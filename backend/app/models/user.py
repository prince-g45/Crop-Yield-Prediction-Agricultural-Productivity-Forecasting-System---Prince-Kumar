from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    # User ID
    id = Column(Integer, primary_key=True, index=True)

    # Full Name
    full_name = Column(String, nullable=False)

    # Email
    email = Column(String, unique=True, index=True, nullable=False)

    # Password
    hashed_password = Column(String, nullable=False)

    # User Role
    role = Column(String, default="Farmer")

    # Created Date
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # One User → Many Farms
    farms = relationship(
        "Farm",
        back_populates="farmer",
        cascade="all, delete"
    )

    # One User → Many Predictions
    predictions = relationship(
        "Prediction",
        back_populates="user",
        cascade="all, delete"
    )