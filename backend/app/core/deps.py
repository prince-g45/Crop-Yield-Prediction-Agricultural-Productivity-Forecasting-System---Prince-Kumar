from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import SECRET_KEY, ALGORITHM
from app.db.session import SessionLocal
from app.models.user import User


# Login endpoint ka URL
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


# Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Current Logged-in User
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # JWT Decode
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        # Email nikalo
        email: str = payload.get("sub")

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # Database me user search karo
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise credentials_exception

    return user