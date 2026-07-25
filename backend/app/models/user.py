# SQLAlchemy ke column types import kar rahe hai
# Integer = number, String = text, DateTime = date/time
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func  # func.now() -> current date/time dega automatically

# Base template import kar rahe hai jo humne session.py mein banaya tha
from app.db.session import Base


# Ye class ek "table blueprint" hai
# Iska naam "User" hai, aur database mein iski table "users" naam se banegi
class User(Base):
    __tablename__ = "users"  # Database mein table ka naam

    # Har user ka unique ID (auto-increment hoga: 1, 2, 3...)
    id = Column(Integer, primary_key=True, index=True)

    # User ka pura naam (text, khali nahi ho sakta)
    full_name = Column(String, nullable=False)

    # Email (unique hona chahiye -> do users same email se register nahi kar sakte)
    email = Column(String, unique=True, index=True, nullable=False)

    # Password (hamesha "hashed" (encrypted) form mein store hoga, plain text nahi)
    hashed_password = Column(String, nullable=False)

    # Role batata hai user kaun hai: farmer, admin, agri_consultant, etc.
    # Default value "farmer" rakhi hai
    role = Column(String, default="farmer")

    # Account kab bana - automatically current date/time save hogi
    created_at = Column(DateTime(timezone=True), server_default=func.now())