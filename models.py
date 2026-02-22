from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship, declarative_base
import datetime
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    customer = "customer"
    vendor = "vendor"
    admin = "admin"

class VendorStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    suspended = "suspended"

class OrderStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"

class PaymentMethod(str, enum.Enum):
    cod = "cod"
    upi = "upi"
    card = "card"

class ReturnStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.customer, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    vendor_profile = relationship("Vendor", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="customer")

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    store_name = Column(String, nullable=False)
    logo_url = Column(Text, nullable=True)
    status = Column(Enum(VendorStatus), default=VendorStatus.pending)
    commission_rate = Column(Float, default=10.0)

    # Relationships
    user = relationship("User", back_populates="vendor_profile")
    products = relationship("Product", back_populates="vendor")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"), nullable=False)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock_qty = Column(Integer, default=0)
    images = Column(Text, nullable=True) # JSON literal or comma separated
    meesho_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)

    # Relationships
    vendor = relationship("Vendor", back_populates="products")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    payment_method = Column(Enum(PaymentMethod), default=PaymentMethod.cod)
    shipping_address = Column(Text, nullable=True)
    stripe_payment_id = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    return_requests = relationship("ReturnRequest", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    # Relationships
    order = relationship("Order", back_populates="items")

class ReturnRequest(Base):
    __tablename__ = "return_requests"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(Enum(ReturnStatus), default=ReturnStatus.pending)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    order = relationship("Order", back_populates="return_requests")
    customer = relationship("User")
