from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    city: Optional[str] = "Toshkent"


class UserCreate(UserBase):
    password: str
    role: Optional[str] = "client"


class UserOut(UserBase):
    id: int
    role: str
    avatar_url: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ServiceBase(BaseModel):
    name: str
    category: Optional[str] = None
    description: Optional[str] = None
    base_price_per_sqm: float = 0
    icon: Optional[str] = None


class ServiceOut(ServiceBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class MasterProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: Optional[str] = None
    specializations: Optional[str] = None
    experience_years: int = 0
    bio: Optional[str] = None
    rating: float = 5.0
    total_reviews: int = 0
    is_verified: bool = False
    hourly_rate: float = 0
    city: Optional[str] = None
    avatar_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class MasterProfileUpdate(BaseModel):
    specializations: Optional[str] = None
    experience_years: Optional[int] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None
    city: Optional[str] = None


class OrderCreate(BaseModel):
    service_id: int
    title: str
    description: Optional[str] = None
    area_sqm: float
    address: Optional[str] = None
    estimated_price: float


class OrderOut(BaseModel):
    id: int
    client_id: int
    master_id: Optional[int] = None
    service_id: int
    title: str
    description: Optional[str] = None
    area_sqm: float
    address: Optional[str] = None
    estimated_price: float
    final_price: Optional[float] = None
    status: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class PortfolioCreate(BaseModel):
    title: str
    description: Optional[str] = None
    before_image_url: Optional[str] = None
    after_image_url: Optional[str] = None
    service_id: int


class PortfolioOut(PortfolioCreate):
    id: int
    master_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ReviewCreate(BaseModel):
    master_id: int
    order_id: Optional[int] = None
    rating: int
    comment: Optional[str] = None


class ReviewOut(BaseModel):
    id: int
    client_id: int
    master_id: int
    rating: int
    comment: Optional[str] = None
    is_approved: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class MaterialBase(BaseModel):
    name: str
    category: Optional[str] = None
    unit: Optional[str] = None
    price: float
    supplier: Optional[str] = None
    image_url: Optional[str] = None


class MaterialOut(MaterialBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class MessageCreate(BaseModel):
    order_id: int
    content: str


class MessageOut(BaseModel):
    id: int
    order_id: int
    sender_id: int
    content: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class CalcIn(BaseModel):
    service_id: int
    area_sqm: float


class CalcOut(BaseModel):
    service_id: int
    area_sqm: float
    price_per_sqm: float
    total: float
