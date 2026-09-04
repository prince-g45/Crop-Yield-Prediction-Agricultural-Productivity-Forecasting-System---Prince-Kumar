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

# ======================================
# Risk Assessment
# ======================================

from app.core.risk_assessment import (
    calculate_risk_assessment
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
    # Used by the trained ML model.
    # ======================================

    weather = get_weather(
        data.latitude,
        data.longitude
    )


    # ======================================
    # HISTORICAL WEATHER ANALYSIS
    #
    # Uses YieldSense_datasets.csv.
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
    # TRAINED MODEL INPUT REMAINS UNCHANGED
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
    # RISK ASSESSMENT
    # ======================================

    risk_assessment = calculate_risk_assessment(

        temperature=weather["temperature"],

        rainfall=weather["rainfall"],

        humidity=weather["humidity"],

        soil_health=soil["soil_health"],

        weather_analysis=weather_analysis,

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
        # CURRENT WEATHER
        # ==========================

        temperature=weather["temperature"],

        rainfall=weather["rainfall"],

        humidity=weather["humidity"],


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
    # Contains:
    # Yield
    # Soil Analysis
    # Current Weather
    # Historical Weather
    # Risk Assessment
    # AI Report
    # ======================================

    response = PredictionResponse.model_validate(
        prediction
    )

    response.weather_analysis = (
        weather_analysis
    )

    response.risk_assessment = (
        risk_assessment
    )


    return response


# ======================================
# Farmer Prediction History
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

    responses = []

    for prediction in predictions:

        response = PredictionResponse.model_validate(
            prediction
        )

        # ======================================
        # Historical Weather Analysis
        # ======================================

        try:

            weather_analysis = (
                get_historical_weather_analysis(
                    crop=prediction.crop,
                    state=prediction.state,
                    season=prediction.season,
                )
            )

            response.weather_analysis = (
                weather_analysis
            )

        except Exception as error:

            print(
                "Historical weather analysis failed:",
                error
            )

            response.weather_analysis = None

        # ======================================
        # Risk Assessment
        # ======================================

        try:

            risk_assessment = (
                calculate_risk_assessment(
                    temperature=prediction.temperature,
                    rainfall=prediction.rainfall,
                    humidity=prediction.humidity,
                    soil_health=prediction.soil_health,
                    weather_analysis=weather_analysis,
                )
            )

            response.risk_assessment = (
                risk_assessment
            )

        except Exception as error:

            print(
                "Risk assessment failed:",
                error
            )

            response.risk_assessment = None

        responses.append(response)

    return responses


# ======================================
# Admin Prediction History
# ======================================

@router.get(
    "/admin/history",
    response_model=list[PredictionResponse]
)
def get_admin_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    admin_role = (
        str(current_user.role or "")
        .strip()
        .lower()
    )

    print("ADMIN EMAIL:", current_user.email)
    print("ADMIN ROLE:", repr(current_user.role))
    print("NORMALIZED ROLE:", repr(admin_role))

    if admin_role != "admin":

        print("ADMIN ACCESS DENIED")

        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    print("ADMIN ACCESS GRANTED")

    predictions = (
        db.query(Prediction)
        .order_by(
            desc(Prediction.created_at)
        )
        .all()
    )

    responses = []

    for prediction in predictions:

        response = PredictionResponse.model_validate(
            prediction
        )

        # ======================================
        # Historical Weather Analysis
        # ======================================

        try:

            weather_analysis = (
                get_historical_weather_analysis(
                    crop=prediction.crop,
                    state=prediction.state,
                    season=prediction.season,
                )
            )

            response.weather_analysis = (
                weather_analysis
            )

        except Exception as error:

            print(
                "Historical weather analysis failed:",
                error
            )

            response.weather_analysis = None

            weather_analysis = None

        # ======================================
        # Risk Assessment
        # ======================================

        try:

            risk_assessment = (
                calculate_risk_assessment(
                    temperature=prediction.temperature,
                    rainfall=prediction.rainfall,
                    humidity=prediction.humidity,
                    soil_health=prediction.soil_health,
                    weather_analysis=weather_analysis,
                )
            )

            response.risk_assessment = (
                risk_assessment
            )

        except Exception as error:

            print(
                "Risk assessment failed:",
                error
            )

            response.risk_assessment = None

        responses.append(response)

    print(
        "TOTAL ADMIN PREDICTIONS:",
        len(responses)
    )

    return responses


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
@router.get(
    "/admin/history",
    response_model=list[PredictionResponse]
)
def get_admin_prediction_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    print("ADMIN EMAIL:", current_user.email)
    print("ADMIN ROLE:", repr(current_user.role))

    if not current_user.role or current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail=f"Admin access required. Current role: {current_user.role}"
        )

    predictions = (
        db.query(Prediction)
        .order_by(
            desc(Prediction.created_at)
        )
        .all()
    )

    return predictions
    # --------------------------------------
    # Admin Access Check
    # --------------------------------------

    if not current_user.role or current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # --------------------------------------
    # Get All Predictions
    # --------------------------------------

    predictions = (
        db.query(Prediction)
        .order_by(
            desc(Prediction.created_at)
        )
        .all()
    )

    return predictions


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
