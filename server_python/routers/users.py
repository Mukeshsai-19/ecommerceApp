from fastapi import APIRouter, HTTPException, Depends, Header
from database import users_collection
from auth_utils import decode_access_token, hash_password
from models import UserResponse, UserUpdate
from bson import ObjectId
from pymongo import ReturnDocument

router = APIRouter(prefix="/api/users", tags=["users"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token, authorization denied")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token is not valid")
    
    return payload

@router.get("/profile")
async def get_profile(user: dict = Depends(get_current_user)):
    try:
        user_id = ObjectId(user["id"])
    except:
        user_id = user["id"]
        
    user_data = await users_collection.find_one({"_id": user_id})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_data["_id"] = str(user_data["_id"])
    if "password" in user_data:
        del user_data["password"]
    return user_data

@router.put("/profile")
async def update_profile(update_data: dict, user: dict = Depends(get_current_user)):
    try:
        user_id = ObjectId(user["id"])
    except:
        user_id = user["id"]
    
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])
    
    # Don't allow changing _id or email via this generic update if desired
    if "_id" in update_data: del update_data["_id"]
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    result = await users_collection.find_one_and_update(
        {"_id": user_id},
        {"$set": update_data},
        return_document=ReturnDocument.AFTER
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    
    result["_id"] = str(result["_id"])
    if "password" in result:
        del result["password"]
    return result

