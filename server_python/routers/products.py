from fastapi import APIRouter, HTTPException, Depends, Header, Query
from models import ProductCreate, ProductResponse
from database import products_collection
from auth_utils import decode_access_token
from bson import ObjectId
from pymongo import ReturnDocument
from typing import List, Optional
from datetime import datetime

router = APIRouter(prefix="/api/products", tags=["products"])

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No token, authorization denied")
    
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token is not valid")
    
    return payload

@router.get("/", response_model=List[dict])
async def get_products(sellerId: Optional[str] = Query(None)):
    query = {}
    if sellerId:
        try:
            query["sellerId"] = ObjectId(sellerId)
        except:
            query["sellerId"] = sellerId
            
    products = []
    async for product in products_collection.find(query).sort("createdAt", -1):
        product["_id"] = str(product["_id"])
        if "sellerId" in product:
            product["sellerId"] = str(product["sellerId"])
        products.append(product)
    return products

@router.post("/", status_code=201)
async def add_product(product_data: dict, user: dict = Depends(get_current_user)):
    try:
        seller_id = ObjectId(user["id"])
    except:
        seller_id = user["id"]
        
    product_dict = {
        **product_data, 
        "sellerId": seller_id, 
        "createdAt": datetime.utcnow()
    }
    result = await products_collection.insert_one(product_dict)
    product_dict["_id"] = str(result.inserted_id)
    product_dict["sellerId"] = str(product_dict["sellerId"])
    return product_dict

@router.put("/{product_id}")
async def update_product(product_id: str, product_data: dict, user: dict = Depends(get_current_user)):
    try:
        p_id = ObjectId(product_id)
        u_id = ObjectId(user["id"])
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    # Don't allow changing sellerId or _id via update
    if "sellerId" in product_data: del product_data["sellerId"]
    if "_id" in product_data: del product_data["_id"]

    if not product_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    result = await products_collection.find_one_and_update(
        {"_id": p_id, "sellerId": u_id},
        {"$set": product_data},
        return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found or unauthorized")
    
    result["_id"] = str(result["_id"])
    result["sellerId"] = str(result["sellerId"])
    return result

@router.delete("/{product_id}")
async def delete_product(product_id: str, user: dict = Depends(get_current_user)):
    try:
        p_id = ObjectId(product_id)
        u_id = ObjectId(user["id"])
    except:
        raise HTTPException(status_code=400, detail="Invalid ID format")

    result = await products_collection.find_one_and_delete(
        {"_id": p_id, "sellerId": u_id}
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found or unauthorized")
    
    return {"message": "Product deleted"}
