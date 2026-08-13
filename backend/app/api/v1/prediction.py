from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc
import pandas as pd

from datetime import datetime

from app.db.session import SessionLocal
from app.models.prediction import Prediction
from app.models.user import User

from app.schemas.prediction import (
    PredictionCreate,
    PredictionResponse,
)

from app.core.model_loader import (
    model,
    crop_encoder,
    season_encoder,
    state_encoder,
    crop_list,
    season_list,
)

from app.core.weather import get_weather
from app.core.soil import get_soil_data

# ======================================
# Historical Weather Analysis
# ======================================

from app.core.weather_analysis import (
    get_historical_weather_analysis
)

from app.core.deps import get_current_user
from app.core.gemini import generate_agriculture_report

router = APIRouter()


# ======================================
# Database
# ======================================

def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ======================================
# Metadata
# ======================================

@router.get("/metadata")
def get_prediction_metadata():

    return {
        "crops": crop_list,
        "seasons": season_list,
    }


# ======================================
# Predict Crop Yield
# ======================================

@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_crop_yield(
    data: PredictionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================
    # CURRENT WEATHER
    #
    # This remains exactly as before.
    # It is used by the trained ML model.
    # ======================================

    weather = get_weather(
        data.latitude,
        data.longitude
    )


    # ======================================
    # HISTORICAL WEATHER ANALYSIS
    #
    # This uses YieldSense_datasets.csv.
    #
    # It is NOT current weather.
    # ======================================

    weather_analysis = (
        get_historical_weather_analysis(
            crop=data.crop,
            state=weather["state"],
            season=data.season,
        )
    )


    # ======================================
    # SOIL
    # ======================================

    soil = get_soil_data(
        weather["state"]
    )


    # ======================================
    # ENCODE CROP
    # ======================================

    crop = crop_encoder.transform(
        [data.crop]
    )[0]


    # ======================================
    # ENCODE SEASON
    # ======================================

    season = season_encoder.transform(
        [data.season]
    )[0]


    # ======================================
    # ENCODE STATE
    # ======================================

    state = state_encoder.transform(
        [weather["state"]]
    )[0]


    # ======================================
    # MODEL INPUT
    #
    # YOUR TRAINED MODEL INPUT
    # REMAINS UNCHANGED
    # ======================================

    input_data = pd.DataFrame([{

        "crop": crop,

        "year": datetime.now().year,

        "season": season,

        "state": state,

        "area": data.area,

        "fertilizer": data.fertilizer,

        "pesticide": data.pesticide,

        "avg_temp_c": weather["temperature"],

        "total_rainfall_mm": weather["rainfall"],

        "avg_humidity_percent": weather["humidity"],

        "N": soil["N"],

        "P": soil["P"],

        "K": soil["K"],

        "pH": soil["pH"],

    }])


    # ======================================
    # RANDOM FOREST PREDICTION
    # ======================================

    predicted_yield = float(
        model.predict(input_data)[0]
    )


    # ======================================
    # ESTIMATED PRODUCTION
    # ======================================

    estimated_production = (
        predicted_yield * data.area
    )


    # ======================================
    # GEMINI AGRICULTURAL AI REPORT
    # ======================================

    agriculture_report = generate_agriculture_report(

        state=weather["state"],

        crop=data.crop,

        season=data.season,

        predicted_yield=predicted_yield,

        estimated_production=estimated_production,

        temperature=weather["temperature"],

        rainfall=weather["rainfall"],

        humidity=weather["humidity"],

        N=soil["N"],

        P=soil["P"],

        K=soil["K"],

        pH=soil["pH"],

        soil_health=soil["soil_health"],

    )


    # ======================================
    # SAVE PREDICTION
    # ======================================

    prediction = Prediction(

        user_id=current_user.id,

        farm_name=data.farm_name,

        state=weather["state"],

        crop=data.crop,

        season=data.season,

        area=data.area,

        fertilizer=data.fertilizer,

        pesticide=data.pesticide,

        predicted_yield=predicted_yield,

        estimated_production=estimated_production,


        # ==========================
        # SOIL ANALYSIS
        # ==========================

        N=soil["N"],

        P=soil["P"],

        K=soil["K"],

        pH=soil["pH"],

        soil_health=soil["soil_health"],

        recommended_crop=soil["recommended_crop"],

        recommendation=soil["recommendation"],


        # ==========================
        # GEMINI AI REPORT
        # ==========================

        agricultural_report=agriculture_report,

    )


    # ======================================
    # DATABASE SAVE
    # ======================================

    db.add(prediction)

    db.commit()

    db.refresh(prediction)


    # ======================================
    # BUILD FINAL RESPONSE
    #
    # Same Prediction Result contains:
    #
    # Yield
    # Soil Analysis
    # Weather Analysis
    # AI Report
    # ======================================

    response = PredictionResponse.model_validate(
        prediction
    )

    response.weather_analysis = (
        weather_analysis
    )


    return response


# ======================================
# Prediction History
# ======================================

@router.get(
    "/history",
    response_model=list[PredictionResponse]
)
def get_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    predictions = (
        db.query(Prediction)
        .filter(
            Prediction.user_id == current_user.id
        )
        .order_by(
            desc(Prediction.created_at)
        )
        .all()
    )

    return predictions


# ======================================
# Delete Prediction
# ======================================

@router.delete("/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    prediction = (
        db.query(Prediction)
        .filter(
            Prediction.id == prediction_id,
            Prediction.user_id == current_user.id
        )
        .first()
    )

    if prediction is None:

        raise HTTPException(
            status_code=404,
            detail="Prediction not found"
        )

    db.delete(prediction)

    db.commit()

    return {
        "success": True,
        "message": "Prediction deleted successfully"
    }


# ======================================
# Debug Token
# ======================================

@router.get("/debug-token")
def debug_token(request: Request):

    return {
        "authorization": request.headers.get(
            "Authorization"
        )
    }