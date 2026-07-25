# FastAPI import kar rahe hai
from fastapi import FastAPI

# Humara database engine aur Base template import kar rahe hai
from app.db.session import engine, Base

# User table ka blueprint import kar rahe hai
# (Isko import karna zaroori hai taaki Python ko iske baare mein pata chale)
from app.models import user


# Ye line asli kaam karti hai:
# Base template se jitne bhi tables define kiye hai (jaise User),
# unko PostgreSQL database mein bana deti hai (agar pehle se nahi bane hai)
Base.metadata.create_all(bind=engine)


app = FastAPI()


@app.get("/")
def home():
    return {"message": "Welcome to YieldSense AI"}


@app.get("/health")
def health_check():
    return {"status": "ok"}