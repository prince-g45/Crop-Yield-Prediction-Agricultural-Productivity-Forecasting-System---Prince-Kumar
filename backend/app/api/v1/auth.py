# FastAPI ke zaroori tools import kar rahe hai
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

# Humari apni files se zaroori cheezein import kar rahe hai
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse


# Router banate hai - ye ek "mini FastAPI app" jaisa hai jisme routes rakhenge
router = APIRouter()

# Password ko hash (encrypt) karne ka tool taiyar kar rahe hai
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Ye function har request ke liye database session deta hai
# aur kaam khatam hone ke baad usse band kar deta hai
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Ye hamara SIGNUP route hai
# Jab koi POST request /signup par aayegi, ye function chalega
@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):

    # Check karo email pehle se to registered nahi hai
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Password ko hash (secure) karo
    hashed_password = pwd_context.hash(user_data.password)

    # Naya user object banao
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password,
    )

    # Database mein save karo
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # Naya data (jaise auto-generated id) wapas le aao

    return new_user