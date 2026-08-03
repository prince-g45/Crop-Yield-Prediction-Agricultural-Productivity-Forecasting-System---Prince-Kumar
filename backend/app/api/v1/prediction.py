from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.prediction import Prediction
from app.models.user import User

from app.schemas.prediction import (
    PredictionCreate,
    PredictionResponse,
)

from app.core.deps import get_current_user

router = APIRouter()


def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()


@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_crop_yield(

    data: PredictionCreate,

    db: Session = Depends(get_db),

    current_user: User = Depends(get_current_user)

):

    # Temporary Prediction
    predicted_yield = 4.75

    estimated_production = (
        predicted_yield * data.area
    )

    prediction = Prediction(

        user_id=current_user.id,

        farm_name=data.farm_name,

        state=data.state,

        crop=data.crop,

        season=data.season,

        area=data.area,

        fertilizer=data.fertilizer,

        pesticide=data.pesticide,

        predicted_yield=predicted_yield,

        estimated_production=estimated_production,

    )

    db.add(prediction)

    db.commit()

    db.refresh(prediction)

    return prediction