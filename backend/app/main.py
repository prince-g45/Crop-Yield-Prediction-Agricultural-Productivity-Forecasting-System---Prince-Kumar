from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base


# ==========================================
# IMPORT MODELS
# ==========================================

from app.models import user
from app.models import farm
from app.models import prediction


# ==========================================
# IMPORT ROUTERS
# ==========================================

from app.api.v1.auth import router as auth_router
from app.api.v1.farm import router as farm_router
from app.api.v1.prediction import router as prediction_router
from app.api.v1.admin import router as admin_router


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)


# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="YieldSense AI API"
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ==========================================
# AUTHENTICATION ROUTES
# ==========================================

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


# ==========================================
# FARM ROUTES
# ==========================================

app.include_router(
    farm_router,
    prefix="/api/v1/farms",
    tags=["Farm Management"]
)


# ==========================================
# PREDICTION ROUTES
# ==========================================

app.include_router(
    prediction_router,
    prefix="/api/v1/prediction",
    tags=["Prediction"]
)


# ==========================================
# ADMIN ROUTES
# ==========================================

app.include_router(
    admin_router,
    prefix="/api/v1/admin",
    tags=["Admin"]
)


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Welcome to YieldSense AI"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():

    return {
        "status": "ok"
    }