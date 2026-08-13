from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import DATABASE_URL


# ==========================================
# DATABASE ENGINE
# ==========================================

engine = create_engine(
    DATABASE_URL
)


# ==========================================
# DATABASE SESSION
# ==========================================

SessionLocal = sessionmaker(
    bind=engine
)


# ==========================================
# SQLAlchemy BASE
# ==========================================

Base = declarative_base()