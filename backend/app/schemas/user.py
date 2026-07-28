# Pydantic se BaseModel aur EmailStr import kar rahe hain
# BaseModel -> API ke request aur response ka structure define karta hai
# EmailStr -> Email ka format automatically validate karta hai
from pydantic import BaseModel, EmailStr


# ==========================
# Signup Request Schema
# ==========================
# Jab naya user account banayega (Signup),
# tab ye data frontend se aayega.
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


# ==========================
# Login Request Schema
# ==========================
# Login ke time sirf Email aur Password chahiye.
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================
# API Response Schema
# ==========================
# User create ya fetch hone ke baad
# frontend ko kya data bhejna hai.
# Security ke liye password kabhi response me nahi bhejte.
class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True