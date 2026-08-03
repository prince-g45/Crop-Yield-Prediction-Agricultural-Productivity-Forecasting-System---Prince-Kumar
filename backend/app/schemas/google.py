from pydantic import BaseModel, EmailStr


class GoogleLoginRequest(BaseModel):
    credential: str


class GoogleSignupRequest(BaseModel):
    full_name: str
    email: EmailStr
    google_id: str
    role: str