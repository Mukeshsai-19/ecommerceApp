from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId
from pydantic.functional_validators import BeforeValidator

# Represents an ObjectId field in the database.
# It will be represented as a `str` in the API so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class UserBase(BaseModel):
    name: str
    email: EmailStr
    bio: Optional[str] = ""
    avatar: Optional[str] = ""
    role: str = "seller"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image: Optional[str] = ""
    category: str = "General"

class ProductCreate(ProductBase):
    sellerId: str

class ProductResponse(ProductBase):
    id: PyObjectId = Field(alias="_id")
    sellerId: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )

