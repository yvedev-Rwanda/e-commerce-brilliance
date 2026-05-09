from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from database import get_database
from routes.auth_routes import router as auth_router
from routes.product_routes import router as product_router
from routes.order_routes import router as order_router

app = FastAPI(title="E-Commerce Brilliance API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(product_router, prefix="/products", tags=["products"])
app.include_router(order_router, prefix="/orders", tags=["orders"])

@app.on_event("startup")
async def startup_db_client():
    app.mongodb = get_database()

@app.on_event("shutdown")
async def shutdown_db_client():
    pass # Add close connection logic if necessary

@app.get("/")
async def root():
    return {"message": "Welcome to E-Commerce Brilliance API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

