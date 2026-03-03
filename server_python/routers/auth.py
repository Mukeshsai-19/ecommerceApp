from fastapi import APIRouter, HTTPException, status
from models import UserCreate, UserResponse
from database import users_collection
from auth_utils import hash_password, verify_password, create_access_token
from bson import ObjectId

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/signup")
async def signup(user_data: UserCreate):
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_dict = user_data.model_dump()
    user_dict["password"] = hash_password(user_data.password)
    
    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)
    
    token = create_access_token({"id": user_id})
    return {"token": token, "user": {"id": user_id, "name": user_data.name, "email": user_data.email, "role": user_dict.get("role", "seller")}}

@router.post("/signin")
async def signin(login_data: dict):
    email = login_data.get("email")
    password = login_data.get("password")
    
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=400, detail="User not found python")
    
    if not verify_password(password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    token = create_access_token({"id": user_id})
    
    return {"token": token, "user": {"id": user_id, "name": user["name"], "email": user["email"], "role": user.get("role", "seller")}}
