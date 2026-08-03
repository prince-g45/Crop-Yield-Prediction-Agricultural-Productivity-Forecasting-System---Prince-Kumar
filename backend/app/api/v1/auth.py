from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests
from app.schemas.google import (
    GoogleLoginRequest,
    GoogleSignupRequest,
)


from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.core.deps import get_current_user

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ===========================
# Normal Signup
# ===========================

@router.post("/signup", response_model=UserResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user_data.password)

    new_user = User(
    full_name=user_data.full_name,
    email=user_data.email,
    hashed_password=hashed_password,
    role="Farmer"
)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ===========================
# Normal Login
# ===========================

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    if not verify_password(
        user_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    

    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name,
        "email": user.email
    }

# ===========================
# Save Google User
# ===========================

@router.post("/google/save")
def save_google_user(
    data: GoogleSignupRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Account already exists"
        )

    # Random password because Google users don't login using password
    random_password = hash_password(data.google_id)

    new_user = User(

        full_name=data.full_name,

        email=data.email,

        hashed_password=random_password,

        role="Farmer",

    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    access_token = create_access_token(
        data={"sub": new_user.email}
    )

    return {

        "success": True,

        "token": access_token,

        "role": new_user.role,

        "full_name": new_user.full_name,

        "email": new_user.email

    }

# ===========================
# Current User
# ===========================

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ===========================
# Google Signup Check
# ===========================

@router.post("/google/signup")
def google_signup(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db)
):

    try:

        # Verify Google Token
        user_info = id_token.verify_oauth2_token(
            data.credential,
            requests.Request()
        )

        email = user_info.get("email")

        # Check if email already exists
        existing_user = db.query(User).filter(
            User.email == email
        ).first()

        if existing_user:

            return {

                "exists": True,

                "message": "Account already exists. Please login."

            }

        # New Google User
        return {

            "exists": False,

            "name": user_info.get("name"),

            "email": email,

            "google_id": user_info.get("sub"),

            "picture": user_info.get("picture")

        }

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid Google Token"
        )


# ===========================
# Google Login
# ===========================

@router.post("/google/login")
def google_login(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db)
):

    try:

        # Verify Google Token
        user_info = id_token.verify_oauth2_token(
            data.credential,
            requests.Request()
        )

        email = user_info.get("email")

        # Find user in database
        user = db.query(User).filter(
            User.email == email
        ).first()

        if not user:

            raise HTTPException(
                status_code=404,
                detail="Google account not registered. Please signup first."
            )

        access_token = create_access_token(
            data={"sub": user.email}
        )

        return {

            "success": True,

            "token": access_token,

            "role": user.role,

            "full_name": user.full_name,

            "email": user.email

        }

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid Google Login"
        )