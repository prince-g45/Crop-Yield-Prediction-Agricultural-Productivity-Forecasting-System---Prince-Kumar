import joblib
from pathlib import Path

# Models folder
MODEL_DIR = Path(__file__).resolve().parent.parent / "models"

print("MODEL_DIR:", MODEL_DIR)
print("Model exists:", (MODEL_DIR / "crop_yield_model.pkl").exists())

# Load model
model = joblib.load(MODEL_DIR / "crop_yield_model.pkl")

# Load encoders
crop_encoder = joblib.load(MODEL_DIR / "crop_encoder.pkl")
season_encoder = joblib.load(MODEL_DIR / "season_encoder.pkl")
state_encoder = joblib.load(MODEL_DIR / "state_encoder.pkl")

# Lists for frontend
crop_list = sorted(crop_encoder.classes_.tolist())
season_list = sorted(season_encoder.classes_.tolist())
state_list = sorted(state_encoder.classes_.tolist())


print("Crop Classes:", crop_encoder.classes_)
print("Crop List:", crop_list[:5])
print("Type:", type(crop_list[0]))