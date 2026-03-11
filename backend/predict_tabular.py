print("🔥 predict_tabular.py LOADED 🔥")

# predict_tabular.py  (place at project root)
import os
import json
import math
import numpy as np
import onnxruntime as ort

# EXACT feature order used by the trained model
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

# --------- GLOBAL MEDIANS (copied from tester) ----------
GLOBAL_MEDIANS = {
    'Age (yrs)': 27.0,
    'Weight (Kg)': 59.0,
    'Height(Cm)': 158.0,
    'BMI': 23.3,
    'Pulse rate(bpm)': 72.0,
    'Cycle(R/I)': 2.0,
    'Cycle length(days)': 5.0,
    'No. of aborptions': 0.0,
    'I   beta-HCG(mIU/mL)': 20.0,
    'II    beta-HCG(mIU/mL)': 1.99,
    'FSH(mIU/mL)': 4.85,
    'LH(mIU/mL)': 2.3,
    'FSH/LH': 1.88,
    'Hip(inch)': 36.0,
    'Waist(inch)': 32.0,
    'Waist:Hip Ratio': 0.89,
    'TSH (mIU/L)': 2.26,
    'AMH(ng/mL)': 3.7,
    'PRL(ng/mL)': 21.92,
    'PRG(ng/mL)': 0.31,
    'RBS(mg/dl)': 100.0,
    'Weight gain(Y/N)': 0.0,
    'hair growth(Y/N)': 0.0,
    'Hair loss(Y/N)': 0.0,
    'Follicle No. (L)': 7.0,
    'Follicle No. (R)': 7.0,
    'Avg. F size (L) (mm)': 14.0,
    'Avg. F size (R) (mm)': 14.0,
    'Endometrium (mm)': 9.0
}
# -------------------------------------------------------

def sigmoid(x: float) -> float:
    # numerically stable sigmoid
    if x >= 0:
        z = math.exp(-x)
        return 1.0 / (1.0 + z)
    else:
        z = math.exp(x)
        return z / (1.0 + z)

def pretty_percentage(prob: float) -> str:
    p100 = prob * 100.0
    if prob < 1e-6:
        return "<0.0001%"
    if p100 < 0.01:
        return f"{p100:.4f}%"
    return f"{p100:.2f}%"

def preprocess_row_with_medians(input_row: dict, feature_names=FEATURE_NAMES, medians=GLOBAL_MEDIANS):
    """
    Build (1, n) numpy array in the exact order of feature_names.
    If a value is missing or empty, use medians (if present) else 0.
    Also convert common Y/N or boolean strings to 0/1.
    Returns (np.array shaped (1,n), list_of_imputed_fields)
    """
    vec = []
    imputed = []
    for f in feature_names:
        v = input_row.get(f, None)

        # treat empty string as missing
        if v is None or (isinstance(v, str) and v.strip() == ""):
            if f in medians:
                v = medians[f]
                imputed.append(f)
            else:
                v = 0

        # convert yes/no to 1/0
        if isinstance(v, str):
            s = v.strip().lower()
            if s in ("y", "yes", "true", "1"):
                v = 1.0
            elif s in ("n", "no", "false", "0"):
                v = 0.0
            else:
                # try numeric parse
                try:
                    v = float(s)
                except Exception:
                    v = medians.get(f, 0)
                    imputed.append(f)

        # convert booleans to numeric
        if isinstance(v, bool):
            v = 1.0 if v else 0.0

        # coerce to float
        try:
            v = float(v)
        except Exception:
            v = medians.get(f, 0)
            if f not in imputed:
                imputed.append(f)

        vec.append(v)

    row_np = np.array([vec], dtype=np.float32)
    return row_np, imputed

class TabularModel:
    def __init__(self, model_path=MODEL_PATH, meta_path=META_PATH):
        self.meta = load_meta(meta_path)
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"ONNX model not found at: {model_path}")
        self.sess = ort.InferenceSession(model_path, providers=["CPUExecutionProvider"])
        self.input_name = self.sess.get_inputs()[0].name

    def predict_dict(self, input_row: dict):
        # Preprocess with medians & collect which fields were imputed
        X, imputed_fields = preprocess_row_with_medians(input_row, FEATURE_NAMES, GLOBAL_MEDIANS)
        outs = self.sess.run(None, {self.input_name: X})

        print("=== DEBUG START ===")
        print("Final input vector sent to model:")
        print(X)
        print("Raw model outputs:")
        print(outs)
        print("=== DEBUG END ===")

        # Find a probabilities array of shape (1,2) if present
        prob = None

        for out in outs:
            if hasattr(out, "ndim") and out.ndim == 2 and out.shape[1] == 2:
                # this looks like class probabilities (batch_size x 2)
                prob = float(out[0, 1])
                break

        if prob is None:
            # No (1,2) probabilities found — handle single-output cases
            out0 = outs[0]
            if hasattr(out0, "ndim") and out0.ndim == 2 and out0.shape[1] == 2:
                prob = float(out0[0, 1])
            else:
                # single value case: could be logit or probability
                val = float(out0.ravel()[0])
                # if val outside [-1,1] treat as logit
                if val < -1.0 or val > 1.0:
                    prob = sigmoid(val)
                else:
                    prob = min(max(val, 0.0), 1.0)

        threshold = float(self.meta.get("decision_threshold", 0.5))
        label = 1 if prob >= threshold else 0

        return {
            "probability": prob,
            "probability_display": pretty_percentage(prob),
            "predicted_label": label,
            "threshold": threshold,
            "imputed_fields": imputed_fields,
            "input_used": {k: input_row.get(k, None) for k in FEATURE_NAMES}
        }

if __name__ == "__main__":
    m = TabularModel()
    example = {k: 0 for k in FEATURE_NAMES}
    print(m.predict_dict(example))
