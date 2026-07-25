# SQLAlchemy ke zaroori tools import kar rahe hai
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Humari config.py file se DATABASE_URL (address) uthा rahe hai
from app.core.config import DATABASE_URL


# "Engine" banate hai — ye wo cheez hai jo actual PostgreSQL se connection banati hai
# DATABASE_URL wahi address hai jo config.py mein define kiya tha
engine = create_engine(DATABASE_URL)


# SessionLocal ek "factory" hai jo har baar naya session (baat-cheet ka mauka) deti hai
# Jab bhi backend ko database se data lena/dena ho, isi se session banayenge
SessionLocal = sessionmaker(bind=engine)


# Base ek "template/blueprint" hai
# Aage jo bhi table banayenge (jaise User, Farm, Crop), unhe isi Base se banayenge
Base = declarative_base()