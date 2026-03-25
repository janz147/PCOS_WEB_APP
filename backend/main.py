# main.py
from __future__ import annotations

import math
from io import BytesIO
from pathlib import Path
from typing import Any, Dict

import numpy as np
import onnxruntime as ort
from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, ImageOps

from predict_tabular import FEATURE_NAMES, TabularModel

# -----------------------------------------------------------------------------
# App setup
# -----------------------------------------------------------------------------
app = FastAPI(title="PCOS Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/", response_class=FileResponse)
async def serve_index():
    index_file = STATIC_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="static/index.html not found")
    return index_file


# -----------------------------------------------------------------------------
# Tabular model
# -----------------------------------------------------------------------------
tabular_model = TabularModel()


def normalize_tabular_input(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Keep only the exact feature keys expected by the tabular model.
    Missing values are set to None so the model layer can decide how to handle them.
    Extra keys from the frontend are ignored.
    """
    return {feature: payload.get(feature, None) for feature in FEATURE_NAMES}


def format_percentage(prob: float) -> str:
    if prob < 1e-6:
        return "<0.0001%"
    return f"{prob * 100:.2f}%"


def adapt_tabular_result(result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Make the model output consistent with the frontend expectations.
    Supports either probability or probability_positive from predict_tabular.py.
    """
    prob = result.get("probability")
    if prob is None:
        prob = result.get("probability_positive")

    if prob is None:
        raise ValueError("Tabular model did not return a probability field")

    prob = float(prob)

    predicted_label = result.get("predicted_label")
    if predicted_label is None:
        predicted_label = 0

    adapted = dict(result)
    adapted["probability"] = prob
    adapted["probability_display"] = result.get("probability_display") or format_percentage(prob)
    adapted["predicted_label"] = int(predicted_label)

    return adapted


@app.post("/predict-pcos")
async def predict_pcos(request: Request):
    """
    Accepts:
      - a single JSON object
      - or a list of JSON objects for batch prediction
    Returns JSON the frontend can read directly.
    """
    payload = await request.json()

    if isinstance(payload, list):
        results = []
        for item in payload:
            if not isinstance(item, dict):
                raise HTTPException(status_code=422, detail="Each batch item must be a JSON object")
            row = normalize_tabular_input(item)
            raw_result = tabular_model.predict_dict(row)
            results.append(adapt_tabular_result(raw_result))

        return {"ok": True, "success": True, "results": results}

    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="Expected a JSON object or array")

    row = normalize_tabular_input(payload)
    raw_result = tabular_model.predict_dict(row)
    result = adapt_tabular_result(raw_result)

    return {"ok": True, "success": True, "result": result}


# -----------------------------------------------------------------------------
# Image model
# -----------------------------------------------------------------------------
IMAGE_MODEL_PATH = BASE_DIR / "ImageModel" / "onnx_models" / "pcos_image_model.onnx"
if not IMAGE_MODEL_PATH.exists():
    raise FileNotFoundError(f"Image model not found at: {IMAGE_MODEL_PATH}")

image_sess = ort.InferenceSession(str(IMAGE_MODEL_PATH), providers=["CPUExecutionProvider"])
image_input_name = image_sess.get_inputs()[0].name
image_input_shape = image_sess.get_inputs()[0].shape

# Same preprocessing values that worked in your tester
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)
SANITIZER_SIZE = 384
MODEL_INPUT_SIZE = 224


def sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def trim_black_border(img: Image.Image, threshold: int = 8, margin: int = 4, min_keep: int = 64) -> Image.Image:
    g = np.array(img.convert("L"))
    mask = g > threshold
    if not mask.any():
        return img

    ys, xs = np.where(mask)
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()

    y0 = max(0, y0 - margin)
    x0 = max(0, x0 - margin)
    y1 = min(g.shape[0] - 1, y1 + margin)
    x1 = min(g.shape[1] - 1, x1 + margin)

    if (y1 - y0 + 1) < min_keep or (x1 - x0 + 1) < min_keep:
        return img

    return img.crop((x0, y0, x1 + 1, y1 + 1))


def center_crop_percent(img: Image.Image, pct: float = 0.85) -> Image.Image:
    w, h = img.size
    side = int(min(w, h) * pct)
    cx, cy = w // 2, h // 2
    x0 = max(0, cx - side // 2)
    y0 = max(0, cy - side // 2)
    x1 = x0 + side
    y1 = y0 + side
    return img.crop((x0, y0, x1, y1))


def to_gray3(img: Image.Image) -> Image.Image:
    g = img.convert("L")
    return Image.merge("RGB", (g, g, g))


def sanitize_image(img: Image.Image) -> Image.Image:
    img = img.convert("RGB")
    img = trim_black_border(img, threshold=8, margin=4)
    img = center_crop_percent(img, pct=0.85)
    img = ImageOps.equalize(img)
    img = to_gray3(img)
    img = ImageOps.contain(img, (SANITIZER_SIZE, SANITIZER_SIZE))

    bg = Image.new("RGB", (SANITIZER_SIZE, SANITIZER_SIZE), (0, 0, 0))
    bg.paste(img, ((SANITIZER_SIZE - img.size[0]) // 2, (SANITIZER_SIZE - img.size[1]) // 2))
    return bg


def preprocess_image(img: Image.Image) -> np.ndarray:
    """
    Same preprocessing that matched your working run_image_once.py:
      - sanitize
      - resize to model input
      - divide by 255
      - ImageNet normalize
      - HWC -> CHW
      - add batch dim
    """
    img = sanitize_image(img)

    # derive model H/W if available, otherwise use 224x224
    if len(image_input_shape) >= 4 and isinstance(image_input_shape[2], int) and isinstance(image_input_shape[3], int):
        h, w = image_input_shape[2], image_input_shape[3]
    else:
        h, w = MODEL_INPUT_SIZE, MODEL_INPUT_SIZE

    img = img.resize((w, h), Image.BILINEAR)

    arr = np.asarray(img).astype(np.float32) / 255.0
    arr = (arr - IMAGENET_MEAN.reshape((1, 1, 3))) / IMAGENET_STD.reshape((1, 1, 3))
    arr = np.transpose(arr, (2, 0, 1)).astype(np.float32)
    arr = np.expand_dims(arr, axis=0)

    return arr


def image_result_payload(raw_logit: float) -> Dict[str, Any]:
    prob_raw = sigmoid(raw_logit)
    prob_infected = 1.0 - prob_raw
    predicted_label = 1 if prob_infected >= 0.5 else 0

    return {
        "raw_logit": float(raw_logit),
        "probability": float(prob_infected),
        "probability_display": format_percentage(float(prob_infected)),
        "predicted_label": int(predicted_label),
    }


@app.post("/predict-image")
async def predict_image(image: UploadFile = File(...)):
    """
    Accepts an uploaded image file and returns prediction JSON.
    """
    contents = await image.read()

    try:
        img = Image.open(BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {e}")

    X = preprocess_image(img)
    outputs = image_sess.run(None, {image_input_name: X})
    raw_logit = float(outputs[0].ravel()[0])

    result = image_result_payload(raw_logit)
    return {"ok": True, "success": True, "result": result}


# -----------------------------------------------------------------------------
# Health
# -----------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok"}