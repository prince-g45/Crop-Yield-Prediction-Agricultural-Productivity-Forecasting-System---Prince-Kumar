from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session
import os

from app.core.config import SECRET_KEY, ALGORITHM
from app.db.session import SessionLocal
from app.models.user import User


# ==========================================
# BEARER TOKEN
# ==========================================

security = HTTPBearer()


# ==========================================
# ADMIN CREDENTIALS
# ==========================================

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")


# ==========================================
# DATABASE SESSION
# ==========================================

def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ==========================================
# CURRENT LOGGED-IN USER
# ==========================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):

    print("========== DEBUG ==========")

    # --------------------------------------
    # Get JWT Token
    # --------------------------------------

    token = credentials.credentials

    print("TOKEN RECEIVED:", token)

    # --------------------------------------
    # Authentication Error
    # --------------------------------------

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    # --------------------------------------
    # Decode JWT
    # --------------------------------------

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        print("PAYLOAD:", payload)

        # ----------------------------------
        # Get Email
        # ----------------------------------

        email: str = payload.get("sub")

        print("EMAIL:", email)

        if email is None:
            raise credentials_exception

    except JWTError as e:

        print("JWT ERROR:", str(e))

        raise credentials_exception

    # ======================================
    # HARD-CODED ADMIN
    # ======================================

    if ADMIN_EMAIL and email.lower() == ADMIN_EMAIL.lower():

        print("ADMIN USER AUTHENTICATED")

        # Admin database mein nahi hai,
        # isliye temporary User object create kar rahe hain.
        admin_user = User(
            full_name="Admin",
            email=ADMIN_EMAIL,
            role="Admin"
        )

        return admin_user

    # ======================================
    # NORMAL DATABASE USER
    # ======================================

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    print("USER FOUND:", user)

    if user is None:

        raise credentials_exception

    # --------------------------------------
    # Return Normal User
    # --------------------------------------

    return user