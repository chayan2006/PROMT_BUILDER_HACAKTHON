from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
import uuid

from kafka_producer import publish_event
from config_db import get_db
from models import Product as DBProduct, Order as DBOrder, OrderItem as DBOrderItem, OrderStatus, PaymentMethod

router = APIRouter(prefix="/api/p1/marketplace")

class ProductResponse(BaseModel):
    id: int
    name: str
    slug: Optional[str]
    description: Optional[str]
    price: float
    stock_qty: int
    images: Optional[str]
    vendor_id: int

    class Config:
        orm_mode = True

@router.get("/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    products = db.query(DBProduct).filter(DBProduct.is_active == True).all()
    return products

class CartItem(BaseModel):
    product_id: int
    quantity: int

class CheckoutRequest(BaseModel):
    customer_id: int
    items: List[CartItem]
    payment_method: str
    shipping_address: str

@router.post("/checkout")
def checkout(request: CheckoutRequest, db: Session = Depends(get_db)):
    total_amount = 0.0
    db_items = []

    for item in request.items:
        prod = db.query(DBProduct).filter(DBProduct.id == item.product_id).first()
        if not prod or prod.stock_qty < item.quantity:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} is out of stock or does not exist.")

        line_total = prod.price * item.quantity
        total_amount += line_total

        prod.stock_qty -= item.quantity

        db_item = DBOrderItem(
            product_id=prod.id,
            quantity=item.quantity,
            unit_price=prod.price
        )
        db_items.append(db_item)

    try:
        pm_enum = PaymentMethod(request.payment_method.lower())
    except ValueError:
        pm_enum = PaymentMethod.cod

    new_order = DBOrder(
        customer_id=request.customer_id,
        total_amount=total_amount,
        status=OrderStatus.pending if pm_enum == PaymentMethod.cod else OrderStatus.paid,
        payment_method=pm_enum,
        shipping_address=request.shipping_address,
        stripe_payment_id="fake_id_" + str(uuid.uuid4())[:8]
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for db_item in db_items:
        db_item.order_id = new_order.id
        db.add(db_item)

    db.commit()

    event = {
        "event_type": "checkout_completed",
        "order_id": new_order.id,
        "amount": total_amount,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("marketplace.orders", event)

    return {"status": "success", "order_id": new_order.id, "total_amount": total_amount}

class Product(BaseModel):
    name: str
    description: str
    price: float
    vendor_id: int
    stock_qty: int

class Order(BaseModel):
    customer_id: int
    vendor_id: int
    product_id: int
    quantity: int
    total_price: float

@router.post("/products")
def create_product(product: Product):
    event = {
        "event_type": "product_created",
        "data": product.dict(),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("marketplace.products", event)
    return {"status": "success"}

@router.post("/orders")
def place_order(order: Order):
    event = {
        "event_type": "order_placed",
        "data": order.dict(),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("marketplace.orders", event)
    return {"status": "success"}
