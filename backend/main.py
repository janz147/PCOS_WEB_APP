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

# replace the normalize_input and endpoint in main.py with this block

def normalize_input(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure keys exist for every FEATURE_NAMES. 
    IMPORTANT: do NOT fill missing clinical values with 0 here.
    Set to None so the model preprocessing function can detect missing
    and apply medians/imputation (or we can count missingness).
    """
    row = {}
    for f in FEATURE_NAMES:
        # use payload value if present; otherwise use None (not 0)
        if f in payload:
            row[f] = payload.get(f)
        else:
            row[f] = None
    return row

@app.post("/predict-pcos")
async def predict_pcos(request: Request):
    """
    Accept either:
      - single JSON object { "Age (yrs)": 28, ... }
      - JSON array [ {..}, {..} ]
    This endpoint now logs payload + normalized row for debugging.
    """
    payload = await request.json()

    # DEBUG: show raw payload (for dev only)
    print(">>> /predict-pcos received payload type:", type(payload))
    print(">>> RAW payload (truncated):", str(payload)[:1000])  # avoid flooding logs

    # batch
    if isinstance(payload, list):
        results = []
        for item in payload:
            if not isinstance(item, dict):
                raise HTTPException(status_code=422, detail="Each item in array must be an object")
            row = normalize_input(item)
            # DEBUG: show normalized input for this item
            print(">>> normalized row for batch item:", row)
            res = model.predict_dict(row)
            results.append(res)
        return {"success": True, "results": results}

    # single
    if not isinstance(payload, dict):
        raise HTTPException(status_code=422, detail="JSON object or array expected")

    row = normalize_input(payload)
    # DEBUG: log normalized row BEFORE calling model
    print(">>> normalized row:", row)

    # call model (predict_dict has its own debug prints)
    result = model.predict_dict(row)
    print(">>> result returned by predict_dict (truncated):", {k: result.get(k) for k in ('probability','predicted_label','imputed_fields')})
    return {"success": True, "result": result}

    

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
