# FastAPI ke zaroori tools import kar rahe hai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Humari apni files
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
# Router banate hai
router = APIRouter()


# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================
# SIGNUP API
# ==========================
@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):

    # Check karo email pehle se registered to nahi hai
    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Password Hash
    hashed_password = hash_password(user_data.password)

    # New User
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# ==========================
# LOGIN API
# ==========================
@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):

    # Database me email search karo
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    # User nahi mila
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # Password verify karo
    if not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # JWT Access Token Generate karo
    access_token = create_access_token(
        data={"sub": user.email}
    )

    # Token frontend ko return karo
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

from app.core.deps import get_current_user

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user