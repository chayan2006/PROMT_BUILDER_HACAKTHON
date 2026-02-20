import os
from supabase import create_client, Client
from dotenv import load_dotenv
import razorpay
from twilio.rest import Client as TwilioClient
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load keys from .env file
load_dotenv()

# Initialize Supabase
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Initialize Other APIs
razorpay_client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

def create_razorpay_order(amount, currency="INR"):
    try:
        data = { "amount": amount * 100, "currency": currency, "receipt": "order_rcptid_11" }
        order = razorpay_client.order.create(data=data)
        return order
    except Exception as e:
        print(f"[ERROR] Razorpay Order Creation Error: {e}")
        # Re-raise the exception or return it so main.py can capture it
        raise e

def send_email_via_gmail(to_email, subject, body_html):
    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    if not sender_email or not sender_password:
        print("[ERROR] Gmail Credentials Missing in .env")
        return "credentials_missing"

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body_html, 'html'))

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print(f"[SUCCESS] Email sent to {to_email}")
        return "success"
    except Exception as e:
        print(f"[ERROR] Gmail Send Error: {e}")
        return str(e)

def process_framework_action(user_name, user_email, user_phone, payment_id=None):
    """
    The 'Magic' Function (SaaS Framework):
    1. Saves user/action to Database
    2. Sends a Confirmation Email (via Gmail)
    3. Sends a WhatsApp Notification
    """
    
    results = {}

    # 1. Save to Supabase
    try:
        user_data = {
            "name": user_name, 
            "email": user_email, 
            "status": "Active", 
            "phone": user_phone,
            "payment_id": payment_id
        }
        # Note: 'hackathon_data' table name kept for now.
        supabase.table("hackathon_data").insert(user_data).execute()
        print(f"[SUCCESS] User {user_name} saved to Supabase.")
        results["supabase"] = "success"
    except Exception as e:
        print(f"[ERROR] Database Error: {e}")
        results["supabase"] = str(e)

    # 2. Send Confirmation Email (via Gmail SMTP)
    email_status = send_email_via_gmail(
        user_email,
        "Action Confirmed! 🚀",
        f"<strong>Hi {user_name}, your action was successful! Payment ID: {payment_id}</strong><p>Welcome to the framework.</p>"
    )
    results["email"] = email_status

    # 3. Send WhatsApp Notification (via Twilio)
    try:
        twilio_sid = os.getenv("TWILIO_SID")
        twilio_token = os.getenv("TWILIO_TOKEN")
        
        if not twilio_sid or not twilio_token:
            print("[ERROR] Twilio Credentials Missing!")
            results["whatsapp"] = "credentials_missing"
        else:
            twilio_client = TwilioClient(twilio_sid, twilio_token)
            
            # Ensure number formatting
            formatted_phone = user_phone
            if not formatted_phone.startswith("whatsapp:"):
                formatted_phone = f"whatsapp:{formatted_phone}"
            
            print(f"Attempting to send WhatsApp message to {formatted_phone}...")
            
            message = twilio_client.messages.create(
                from_='whatsapp:+14155238886', # Twilio Sandbox Number
                body=f"Hello {user_name}! Your transaction was successful. Welcome to the SaaS Starter Kit! 🚀",
                to=formatted_phone
            )
            print(f"[SUCCESS] WhatsApp message sent. SID: {message.sid}")
            results["whatsapp"] = "success"
            results["whatsapp_sid"] = message.sid
    except Exception as e:
        print(f"[ERROR] WhatsApp Error: {e}")
        results["whatsapp"] = str(e)

    return {"message": "Framework action processed successfully", "results": results}

def process_login_action(user_email, user_name="User"):
    """
    Simulates Login and sends a Welcome Email.
    """
    results = {}
    
    # Send Welcome Email
    subject = "Welcome to Our Website! 🎉"
    body = f"""
    <h2>Welcome back, {user_name}!</h2>
    <p>We are thrilled to see you again.</p>
    <p>Logged in successfully.</p>
    """
    
    email_status = send_email_via_gmail(user_email, subject, body)
    results["email"] = email_status
    
    return {"message": "Login processed", "results": results}