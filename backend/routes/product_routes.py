from fastapi import APIRouter, HTTPException
from typing import List
from database import get_database
from models import Product
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[Product])
async def get_products():
    db = get_database()
    products = await db["products"].find().to_list(1000)
    for product in products:
        product["_id"] = str(product["_id"])
    return products

@router.get("/search", response_model=List[Product])
async def search_products(q: str):
    db = get_database()
    regex = {"$regex": q, "$options": "i"}
    query = {
        "$or": [
            {"name": regex},
            {"description": regex},
            {"brand": regex},
            {"category": regex}
        ]
    }
    products = await db["products"].find(query).to_list(1000)
    for product in products:
        product["_id"] = str(product["_id"])
    return products

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: str):
    db = get_database()
    product = await db["products"].find_one({"_id": ObjectId(product_id)})
    if product:
        product["_id"] = str(product["_id"])
        return product
    raise HTTPException(status_code=404, detail="Product not found")

@router.post("/", response_model=Product)
async def create_product(product: Product):
    db = get_database()
    product_dict = product.dict(exclude={"id"})
    result = await db["products"].insert_one(product_dict)
    created_product = await db["products"].find_one({"_id": result.inserted_id})
    created_product["_id"] = str(created_product["_id"])
    return created_product
