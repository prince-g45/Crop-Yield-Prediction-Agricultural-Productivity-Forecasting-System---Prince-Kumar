# Pydantic se BaseModel import kar rahe hai
# Ye FastAPI ko batata hai "aane wala data kaisa dikhna chahiye"
from pydantic import BaseModel, EmailStr


# Ye "schema" define karta hai signup ke waqt kya data chahiye
class UserCreate(BaseModel):
    full_name: str      # Naam text mein hona chahiye
    email: EmailStr     # Email sahi format mein hona chahiye (jaise abc@xyz.com)
    password: str       # Password text mein hona chahiye


# Ye schema define karta hai ki response mein kya wapas bhejna hai
# (Password wapas nahi bhejenge, security ke liye)
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True  # Isse database object ko seedha response bana sakte hai