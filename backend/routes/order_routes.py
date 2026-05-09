from fastapi import APIRouter, HTTPException, Depends
from typing import List
from database import get_database
from models import Order
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from auth import SECRET_KEY, ALGORITHM

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/", response_model=Order)
async def create_order(order: Order, current_user: str = Depends(get_current_user)):
    db = get_database()
    
    # We should get the user_id from the database based on the email
    user = await db["users"].find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    order_dict = order.dict(exclude={"id"})
    order_dict["user_id"] = str(user["_id"])
    
    result = await db["orders"].insert_one(order_dict)
    created_order = await db["orders"].find_one({"_id": result.inserted_id})
    created_order["_id"] = str(created_order["_id"])
    return created_order

@router.get("/my-orders", response_model=List[Order])
async def get_my_orders(current_user: str = Depends(get_current_user)):
    db = get_database()
    
    user = await db["users"].find_one({"email": current_user})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    orders = await db["orders"].find({"user_id": str(user["_id"])}).to_list(100)
    for order in orders:
        order["_id"] = str(order["_id"])
    return orders
