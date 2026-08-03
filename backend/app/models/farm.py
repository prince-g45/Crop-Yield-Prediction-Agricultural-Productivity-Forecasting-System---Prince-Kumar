from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)

    farmer_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    farm_name = Column(String, nullable=False)

    crop_name = Column(String, nullable=False)

    area = Column(Float, nullable=False)

    location = Column(String, nullable=False)

    season = Column(String, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    farmer = relationship(
    "User",
    back_populates="farms"
)