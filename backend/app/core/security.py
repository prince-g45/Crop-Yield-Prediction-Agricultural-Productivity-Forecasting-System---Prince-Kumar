from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

# JWT Access Token Generate
def create_access_token(data: dict):
    # Original data ki copy bana lo
    to_encode = data.copy()

    # Expiry time set karo
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Token me expiry add karo
    to_encode.update({"exp": expire})

    # JWT Token generate karo
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt