from pydantic import BaseModel, Field
from datetime import datetime


# ======================================
# WEATHER ANALYSIS
# ======================================

class WeatherYear(BaseModel):
    year: int
    rainfall_mm: float
    temperature_c: float
    humidity_percent: float


class WeatherAnalysis(BaseModel):

    available: bool

    message: str | None = None

    average_rainfall_mm: float | None = None

    average_temperature_c: float | None = None

    average_humidity_percent: float | None = None

    suitability: str | None = None

    years: list[WeatherYear] = Field(
        default_factory=list
    )

    summary: str | None = None


# ======================================
# REQUEST FROM FRONTEND
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
# RESPONSE TO FRONTEND
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
    # SOIL ANALYSIS
    # ==========================

    N: float

    P: float

    K: float

    pH: float

    soil_health: str

    recommended_crop: str

    recommendation: str

    # ==========================
    # GEMINI AGRICULTURAL REPORT
    # ==========================

    agricultural_report: str | None = None

    # ==========================
    # WEATHER ANALYSIS
    # ==========================

    weather_analysis: WeatherAnalysis | None = None

    # ==========================
    # CREATED AT
    # ==========================

    created_at: datetime

    class Config:
        from_attributes = True