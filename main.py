from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# This allows your frontend to talk to your backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "Ready for Hackathon!"}

from pydantic import BaseModel
from database import process_framework_action, create_razorpay_order

class User(BaseModel):
    name: str
    email: str
    phone: str
    payment_id: str = None

class OrderRequest(BaseModel):
    amount: int
    currency: str = "INR"

@app.post("/create-order")
def create_order(request: OrderRequest):
    try:
        order = create_razorpay_order(request.amount, request.currency)
        return {"status": "success", "order": order}
    except Exception as e:
        return {"status": "error", "message": f"Razorpay Error: {str(e)}"}

@app.post("/register")
def register_user(user: User):
    try:
        result = process_framework_action(user.name, user.email, user.phone, user.payment_id)
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/whatsapp")
def send_whatsapp():
    try:
        account_sid = os.environ.get('TWILIO_SID')
        auth_token = os.environ.get('TWILIO_TOKEN')
        
        if not account_sid or not auth_token or auth_token == "[AuthToken]":
            return {"status": "error", "message": "Twilio credentials not set in .env"}

        client = Client(account_sid, auth_token)

        message = client.messages.create(
            from_='whatsapp:+14155238886',
            content_sid='HX229f5a04fd0510ce1b071852155d3e75',
            content_variables='{"1":"409173"}',
            to='whatsapp:+918101799554'
        )

        return {"status": "success", "sid": message.sid}
    except Exception as e:
        return {"status": "error", "message": str(e)}