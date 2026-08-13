from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.db.session import SessionLocal
from app.models.user import User
from app.models.prediction import Prediction
from app.core.deps import get_current_user


router = APIRouter()


# ==========================================
# DATABASE
# ==========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@router.get("/dashboard")
def get_admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    # --------------------------------------
    # Total Farmers
    # --------------------------------------

    total_farmers = (
        db.query(func.count(User.id))
        .filter(User.role == "Farmer")
        .scalar()
    ) or 0


    # --------------------------------------
    # Total Predictions
    # --------------------------------------

    total_predictions = (
        db.query(func.count(Prediction.id))
        .scalar()
    ) or 0


    # --------------------------------------
    # Most Predicted Crop
    # --------------------------------------

    most_predicted_crop = (
        db.query(
            Prediction.crop,
            func.count(Prediction.id).label("count")
        )
        .group_by(Prediction.crop)
        .order_by(desc("count"))
        .first()
    )


    crop_name = (
        most_predicted_crop.crop
        if most_predicted_crop
        else None
    )


    # --------------------------------------
    # Most Active State
    # --------------------------------------

    most_active_state = (
        db.query(
            Prediction.state,
            func.count(Prediction.id).label("count")
        )
        .group_by(Prediction.state)
        .order_by(desc("count"))
        .first()
    )


    state_name = (
        most_active_state.state
        if most_active_state
        else None
    )


    # --------------------------------------
    # Recent Activity
    # --------------------------------------

    recent_predictions = (
        db.query(Prediction, User)
        .join(
            User,
            Prediction.user_id == User.id
        )
        .order_by(
            desc(Prediction.created_at)
        )
        .limit(10)
        .all()
    )


    recent_activity = []


    for prediction, user in recent_predictions:

        recent_activity.append({

            "id": prediction.id,

            "date": (
                prediction.created_at.isoformat()
                if prediction.created_at
                else None
            ),

            "user": user.email,

            "activity": (
                f"Predicted {prediction.crop} "
                f"yield in {prediction.state}"
            ),

            "crop": prediction.crop,

            "state": prediction.state,

            "predicted_yield": prediction.predicted_yield,

        })


    # --------------------------------------
    # Response
    # --------------------------------------

    return {

        "total_farmers": total_farmers,

        "total_predictions": total_predictions,

        "most_predicted_crop": crop_name,

        "most_active_state": state_name,

        "recent_activity": recent_activity,

    }


# ==========================================
# GET ALL FARMERS
# ==========================================

@router.get("/farmers")
def get_all_farmers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    farmers = (
        db.query(User)
        .filter(User.role == "Farmer")
        .order_by(
            desc(User.created_at)
        )
        .all()
    )


    return [

        {
            "id": farmer.id,

            "full_name": farmer.full_name,

            "email": farmer.email,

            "role": farmer.role,

            "is_active": farmer.is_active,

            "created_at": (
                farmer.created_at.isoformat()
                if farmer.created_at
                else None
            ),

        }

        for farmer in farmers

    ]


# ==========================================
# CHANGE FARMER STATUS
# ==========================================

@router.patch("/farmers/{farmer_id}/status")
def update_farmer_status(
    farmer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    farmer = (
        db.query(User)
        .filter(
            User.id == farmer_id,
            User.role == "Farmer"
        )
        .first()
    )


    if farmer is None:

        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )


    # Toggle status

    farmer.is_active = not farmer.is_active

    db.commit()

    db.refresh(farmer)


    return {

        "success": True,

        "message": (
            "Farmer activated"
            if farmer.is_active
            else "Farmer deactivated"
        ),

        "farmer": {

            "id": farmer.id,

            "full_name": farmer.full_name,

            "email": farmer.email,

            "is_active": farmer.is_active,

        }

    }


# ==========================================
# DELETE FARMER
# ==========================================

@router.delete("/farmers/{farmer_id}")
def delete_farmer(
    farmer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    farmer = (
        db.query(User)
        .filter(
            User.id == farmer_id,
            User.role == "Farmer"
        )
        .first()
    )


    if farmer is None:

        raise HTTPException(
            status_code=404,
            detail="Farmer not found"
        )


    # --------------------------------------
    # Delete Farmer
    #
    # User model has:
    #
    # farms = cascade="all, delete"
    # predictions = cascade="all, delete"
    #
    # So related records will also be removed.
    # --------------------------------------

    db.delete(farmer)

    db.commit()


    return {

        "success": True,

        "message": "Farmer deleted successfully",

        "farmer_id": farmer_id,

    }