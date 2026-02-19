# run_image_once.py
import os
import sys
try:
    import onnxruntime as ort
except Exception as e:
    print("ERROR importing onnxruntime:", e)
    print("Make sure you're using a Python version supported by onnxruntime and that it's installed in your venv.")
    sys.exit(1)

from PIL import Image
import numpy as np

MODEL = os.path.join("ImageModel", "onnx_models", "pcos_image_model.onnx")
IMAGE_PATH = os.path.join("ImageModel", "test_images", "sample.jpg")  # put a sample image here

if not os.path.exists(MODEL):
    print("Model not found:", MODEL)
    sys.exit(1)
if not os.path.exists(IMAGE_PATH):
    print("Sample image not found:", IMAGE_PATH)
    print("Drop one sample image at that path or edit IMAGE_PATH in this script.")
    sys.exit(1)

sess = ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])
inp = sess.get_inputs()[0]
input_name = inp.name
shape = inp.shape  # may contain symbolic names like 'batch_size'
print("ONNX input spec:", shape, "name:", input_name)

# Robustly parse shape entries to ints or None
parsed = []
for x in shape:
    # if it's already an int
    if isinstance(x, int):
        parsed.append(x)
        continue
    # try to convert numeric-like strings
    try:
        parsed.append(int(x))
        continue
    except Exception:
        parsed.append(None)

# handle common cases
if len(parsed) == 4:
    _, C, H, W = parsed
elif len(parsed) == 3:
    # assume [C,H,W]
    C, H, W = parsed[0], parsed[1], parsed[2]
else:
    raise RuntimeError(f"Unhandled input shape length: {parsed}")

# Ensure H and W are known
if H is None or W is None or C is None:
    raise RuntimeError(f"Cannot determine model input channels/height/width from shape: {shape} -> parsed: {parsed}")

print("Using C,H,W =", C, H, W)

# open and preprocess image
img = Image.open(IMAGE_PATH)
if C == 1:
    img = img.convert("L")
else:
    img = img.convert("RGB")
img = img.resize((W, H))
arr = np.array(img).astype(np.float32) / 255.0

# HWC -> CHW
if arr.ndim == 3:
    # if RGB but model expects single channel, conversion above handled it
    arr = np.transpose(arr, (2, 0, 1))
elif arr.ndim == 2:
    arr = arr[np.newaxis, :, :]

# add batch
arr = arr[np.newaxis, ...]  # shape (1, C, H, W)
print("Prepared input shape:", arr.shape, arr.dtype)

# Run inference
outs = sess.run(None, {input_name: arr})
logit = float(outs[0].ravel()[0])
import math
prob = 1/(1+math.exp(-logit))
label = 1 if prob >= 0.5 else 0
print("logit:", logit, "probability:", prob, "label:", label)

