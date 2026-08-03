from pydantic import BaseModel
from datetime import datetime


class PredictionCreate(BaseModel):
    farm_name: str
    state: str
    crop: str
    season: str
    area: float
    fertilizer: float
    pesticide: float


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
    created_at: datetime

    class Config:
        from_attributes = True