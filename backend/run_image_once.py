# run_image_once.py
import sys
from pathlib import Path
import numpy as np
import onnxruntime as ort
from PIL import Image, ImageOps

MODEL_PATH = Path("ImageModel/onnx_models/pcos_image_model.onnx")
DEFAULT_IMAGE = Path("ImageModel/test_images/sample.jpg")
IMG_SIZE = 384

IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)

def trim_black_border(img, threshold=8, margin=4, min_keep=64):
    g = np.array(img.convert("L"))
    mask = g > threshold
    if not mask.any():
        return img
    ys, xs = np.where(mask)
    y0, y1 = ys.min(), ys.max()
    x0, x1 = xs.min(), xs.max()
    y0 = max(0, y0 - margin); x0 = max(0, x0 - margin)
    y1 = min(g.shape[0]-1, y1 + margin); x1 = min(g.shape[1]-1, x1 + margin)
    if (y1 - y0 + 1) < min_keep or (x1 - x0 + 1) < min_keep:
        return img
    return img.crop((x0, y0, x1+1, y1+1))

def center_crop_percent(img, pct=0.85):
    w, h = img.size
    side = int(min(w, h) * pct)
    cx, cy = w // 2, h // 2
    x0 = max(0, cx - side // 2)
    y0 = max(0, cy - side // 2)
    x1 = x0 + side
    y1 = y0 + side
    return img.crop((x0, y0, x1, y1))

def to_gray3(img):
    g = img.convert("L")
    return Image.merge("RGB", (g, g, g))

def sanitize_image(img):
    img = img.convert("RGB")
    img = trim_black_border(img, threshold=8, margin=4)
    img = center_crop_percent(img, pct=0.85)
    img = ImageOps.equalize(img)
    img = to_gray3(img)
    img = ImageOps.contain(img, (IMG_SIZE, IMG_SIZE))

    bg = Image.new("RGB", (IMG_SIZE, IMG_SIZE), (0, 0, 0))
    bg.paste(img, ((IMG_SIZE - img.size[0]) // 2,
                   (IMG_SIZE - img.size[1]) // 2))
    return bg

def preprocess(img_path, target_hw):
    img = Image.open(img_path).convert("RGB")
    img = sanitize_image(img)
    img = img.resize(target_hw, Image.BILINEAR)

    arr = np.asarray(img).astype(np.float32) / 255.0
    arr = (arr - IMAGENET_MEAN.reshape((1, 1, 3))) / IMAGENET_STD.reshape((1, 1, 3))
    arr = np.transpose(arr, (2, 0, 1)).astype(np.float32)
    arr = np.expand_dims(arr, axis=0)
    return arr

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

if __name__ == "__main__":
    img_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_IMAGE

    if not MODEL_PATH.exists():
        print("Model not found:", MODEL_PATH)
        sys.exit(1)

    if not img_path.exists():
        print("Image not found:", img_path)
        sys.exit(1)

    sess = ort.InferenceSession(str(MODEL_PATH), providers=["CPUExecutionProvider"])
    inp = sess.get_inputs()[0]
    input_name = inp.name
    shape = inp.shape

    print("ONNX input spec:", shape, "name:", input_name)

    if isinstance(shape[2], int) and isinstance(shape[3], int):
        H, W = shape[2], shape[3]
    else:
        H, W = 224, 224

    print("Using H,W =", H, W)

    X = preprocess(img_path, (W, H))
    print("Prepared input shape:", X.shape, X.dtype)
    print("Input stats:",
          "min=", X.min(),
          "max=", X.max(),
          "mean=", X.mean(),
          "std=", X.std())

    outputs = sess.run(None, {input_name: X})
    raw_logit = float(outputs[0].ravel()[0])

    prob_raw = sigmoid(raw_logit)
    prob_infected = 1.0 - prob_raw
    label = 1 if prob_infected >= 0.5 else 0

    print("\n=== RESULT ===")
    print("raw_logit:", raw_logit)
    print("prob_raw:", prob_raw)
    print("prob_infected:", prob_infected)
    print("label:", label)