from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base

# ===========================
# Import Models
# ===========================

from app.models import user
from app.models import farm
from app.models import prediction

# ===========================
# Import Routers
# ===========================

from app.api.v1.auth import router as auth_router
from app.api.v1.farm import router as farm_router
from app.api.v1.prediction import router as prediction_router

# ===========================
# Create Database Tables
# ===========================

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YieldSense AI API"
)

# ===========================
# CORS Configuration
# ===========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# Authentication Routes
# ===========================

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)

# ===========================
# Farm Routes
# ===========================

app.include_router(
    farm_router,
    prefix="/api/v1/farms",
    tags=["Farm Management"]
)

# ===========================
# Prediction Routes
# ===========================

app.include_router(
    prediction_router,
    prefix="/api/v1/prediction",
    tags=["Prediction"]
)

# ===========================
# Home
# ===========================

@app.get("/")
def home():
    return {
        "message": "Welcome to YieldSense AI"
    }

# ===========================
# Health Check
# ===========================

@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }