from pydantic import BaseModel
from datetime import datetime

# ======================================
# Request from Frontend
# ======================================

class PredictionCreate(BaseModel):
    farm_name: str
    crop: str
    season: str
    area: float
    fertilizer: float
    pesticide: float

    # GPS Coordinates
    latitude: float
    longitude: float


# ======================================
# Response to Frontend
# ======================================

class PredictionResponse(BaseModel):
    id: int

    farm_name: str
    state: str

    crop: str
    season: str

    area: float
    fertilizer: float
    pesticide: float

    predicted_yield: float
    estimated_production: float

    # ==========================
    # Soil Analysis
    # ==========================

    N: float
    P: float
    K: float
    pH: float

    soil_health: str
    recommended_crop: str
    recommendation: str

    created_at: datetime

    class Config:
        from_attributes = True