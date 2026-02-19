# main.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict, List
from predict_tabular import TabularModel, FEATURE_NAMES
from fastapi.staticfiles import StaticFiles
import pathlib
from fastapi.responses import FileResponse

app = FastAPI(title="PCOS Tabular Predictor")

# Serve the simple frontend from ./static (so visiting / opens index.html)
static_dir = pathlib.Path(__file__).resolve().parent / "static"
if not static_dir.exists():
    static_dir.mkdir(parents=True, exist_ok=True)

# Mount static files at /static (so they don't override API routes)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Serve index.html explicitly at root (GET /)
@app.get("/", response_class=FileResponse)
async def serve_index():
    index_file = static_dir / "index.html"
    return index_file

# CORS — during dev you can allow everything; tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once (cold-start)
model = TabularModel()

def normalize_input(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure keys exist for every FEATURE_NAMES. Fill missing with 0.
    (You can change default/fill behavior if needed.)
    """
    row = {}
    for f in FEATURE_NAMES:
        row[f] = payload.get(f, 0)
    return row

@app.post("/predict-pcos")
async def predict_pcos(request: Request):
    """
    Accept either:
      - single JSON object { "Age (yrs)": 28, ... }
      - JSON array [ {..}, {..} ]
    Returns JSON with probability and label.
    """
    payload = await request.json()

    # batch
    if isinstance(payload, list):
        results = []
        for item in payload:
            if not isinstance(item, dict):
                raise HTTPException(status_code=422, detail="Each item in array must be an object")
            row = normalize_input(item)
            res = model.predict_dict(row)
            results.append(res)
        return {"success": True, "results": results}

    # single
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="JSON object or array expected")
    row = normalize_input(payload)
    result = model.predict_dict(row)
    return {"success": True, "result": result}

@app.get("/health")
def health():
    return {"status": "ok"}
