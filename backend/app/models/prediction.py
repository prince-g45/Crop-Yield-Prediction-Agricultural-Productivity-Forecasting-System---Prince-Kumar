from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base


class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    farm_name = Column(String, nullable=False)

    state = Column(String, nullable=False)

    crop = Column(String, nullable=False)

    season = Column(String, nullable=False)

    area = Column(Float, nullable=False)

    fertilizer = Column(Float, nullable=False)

    pesticide = Column(Float, nullable=False)

    predicted_yield = Column(Float, nullable=False)

    estimated_production = Column(Float, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship("User", back_populates="predictions")