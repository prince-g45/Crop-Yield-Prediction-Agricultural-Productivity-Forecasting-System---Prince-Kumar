from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine, Base
from app.models import user
from app.api.v1.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@app.get("/")
def home():
    return {"message": "Welcome to YieldSense AI"}


@app.get("/health")
def health_check():
    return {"status": "ok"}