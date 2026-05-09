from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class Product(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    description: Optional[str] = None
    price: float
    category: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserInDB(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    is_admin: bool

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Order(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: str = "pending" # pending, processing, shipped, delivered, cancelled
    shipping_address: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
