from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmResponse

router = APIRouter()


# ===========================
# Database Session
# ===========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===========================
# Create Farm
# ===========================

@router.post("/", response_model=FarmResponse)
def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db)
):

    new_farm = Farm(
        farmer_id=1,   # Temporary (Later JWT Login User ID)
        farm_name=farm.farm_name,
        crop_name=farm.crop_name,
        area=farm.area,
        location=farm.location,
        season=farm.season,
    )

    db.add(new_farm)
    db.commit()
    db.refresh(new_farm)

    return new_farm


# ===========================
# Get All Farms
# ===========================

@router.get("/", response_model=list[FarmResponse])
def get_all_farms(db: Session = Depends(get_db)):

    farms = db.query(Farm).all()

    return farms


# ===========================
# Update Farm
# ===========================

@router.put("/{farm_id}", response_model=FarmResponse)
def update_farm(
    farm_id: int,
    farm: FarmCreate,
    db: Session = Depends(get_db)
):

    existing_farm = db.query(Farm).filter(
        Farm.id == farm_id
    ).first()

    if not existing_farm:
        raise HTTPException(
            status_code=404,
            detail="Farm not found"
        )

    existing_farm.farm_name = farm.farm_name
    existing_farm.crop_name = farm.crop_name
    existing_farm.area = farm.area
    existing_farm.location = farm.location
    existing_farm.season = farm.season

    db.commit()
    db.refresh(existing_farm)

    return existing_farm


# ===========================
# Delete Farm
# ===========================

@router.delete("/{farm_id}")
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db)
):

    farm = db.query(Farm).filter(
        Farm.id == farm_id
    ).first()

    if not farm:
        raise HTTPException(
            status_code=404,
            detail="Farm not found"
        )

    db.delete(farm)
    db.commit()

    return {
        "message": "Farm deleted successfully"
    }