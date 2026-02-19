# predict_tabular.py
import os
import json
import numpy as np
import onnxruntime as ort

# Features
FEATURE_NAMES = [
    "Age (yrs)",
    "Weight (Kg)",
    "Height(Cm)",
    "BMI",
    "Cycle(R/I)",
    "Cycle length(days)",
    "Marraige Status (Yrs)",
    "Pregnant(Y/N)",
    "No. of aborptions",
    "I   beta-HCG(mIU/mL)",
    "FSH(mIU/mL)",
    "LH(mIU/mL)",
    "FSH/LH",
    "Hip(inch)",
    "Waist(inch)",
    "Waist:Hip Ratio",
    "TSH (mIU/L)",
    "PRL(ng/mL)",
    "Vit D3 (ng/mL)",
    "PRG(ng/mL)",
    "RBS(mg/dl)",
    "Weight gain(Y/N)",
    "hair growth(Y/N)",
    "Skin darkening (Y/N)",
    "Hair loss(Y/N)",
    "Fast food (Y/N)",
    "Reg.Exercise(Y/N)",
]


# Build absolute paths relative to this file (works regardless of cwd)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
META_PATH = os.path.join(BASE_DIR, "TabularModel", "pcos_metadata_v1.json")
MODEL_PATH = os.path.join(BASE_DIR, "TabularModel", "onnx_models", "pcos_tabular_model.onnx")

def load_meta(meta_path=META_PATH):
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}

def preprocess_row(row: dict):
    vec = []

    for f in FEATURE_NAMES:
        v = row.get(f, 0)

        if v is None or v == "":
            v = 0

        if isinstance(v, str):
            v = v.strip().lower()
            if v in ("y", "yes"):
                v = 1
            elif v in ("n", "no"):
                v = 0

        try:
            v = float(v)
        except Exception:
            v = 0

        vec.append(v)

    return np.array([vec], dtype=np.float32)

class TabularModel:
    def __init__(self, model_path=MODEL_PATH, meta_path=META_PATH):
        self.meta = load_meta(meta_path)
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"ONNX model not found at: {model_path}")
        self.sess = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
        self.input_name = self.sess.get_inputs()[0].name

    def predict_dict(self, input_row: dict):
        X = preprocess_row(input_row)
        outs = self.sess.run(None, {self.input_name: X})

        prob = float(outs[0].ravel()[0])
        label = int(prob >= 0.5)

        return {
            "probability_positive": prob,
            "predicted_label": label,
            "input_used": {k: input_row.get(k) for k in FEATURE_NAMES}
        }

if __name__ == "__main__":
    m = TabularModel()
    example = {k: 0 for k in m.meta.get("feature_names", [])}
    print(m.predict_dict(example))
