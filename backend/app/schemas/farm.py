from pydantic import BaseModel


# Used when creating a new farm
class FarmCreate(BaseModel):
    farm_name: str
    crop_name: str
    area: float
    location: str
    season: str


# Used when returning farm data
class FarmResponse(BaseModel):
    id: int
    farm_name: str
    crop_name: str
    area: float
    location: str
    season: str

    class Config:
        from_attributes = True