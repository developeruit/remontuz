from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, ForeignKey, DateTime, Enum
)
from sqlalchemy.orm import relationship
import enum
from .database import Base


class UserRole(str, enum.Enum):
    client = "client"
    master = "master"
    admin = "admin"


class OrderStatus(str, enum.Enum):
    new = "new"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(20))
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.client, nullable=False)
    avatar_url = Column(Text)
    city = Column(String(100), default="Toshkent")
    created_at = Column(DateTime, default=datetime.utcnow)

    master_profile = relationship("MasterProfile", back_populates="user", uselist=False)


class MasterProfile(Base):
    __tablename__ = "master_profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specializations = Column(String(500))  # comma-separated
    experience_years = Column(Integer, default=0)
    bio = Column(Text)
    rating = Column(Float, default=5.0)
    total_reviews = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    hourly_rate = Column(Float, default=0)
    city = Column(String(100), default="Toshkent")

    user = relationship("User", back_populates="master_profile")


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100))
    description = Column(Text)
    base_price_per_sqm = Column(Float, default=0)
    icon = Column(String(50))


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    master_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"))
    title = Column(String(255))
    description = Column(Text)
    area_sqm = Column(Float)
    address = Column(Text)
    estimated_price = Column(Float)
    final_price = Column(Float, nullable=True)
    status = Column(Enum(OrderStatus), default=OrderStatus.new)
    created_at = Column(DateTime, default=datetime.utcnow)


class PortfolioItem(Base):
    __tablename__ = "portfolio_items"
    id = Column(Integer, primary_key=True, index=True)
    master_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(255))
    description = Column(Text)
    before_image_url = Column(Text)
    after_image_url = Column(Text)
    service_id = Column(Integer, ForeignKey("services.id"))
    created_at = Column(DateTime, default=datetime.utcnow)


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    client_id = Column(Integer, ForeignKey("users.id"))
    master_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(Text)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Material(Base):
    __tablename__ = "materials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    category = Column(String(100))
    unit = Column(String(20))
    price = Column(Float)
    supplier = Column(String(255))
    image_url = Column(Text)


class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
