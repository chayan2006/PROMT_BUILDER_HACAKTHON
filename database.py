import os
from supabase import create_client, Client
from dotenv import load_dotenv
import razorpay
from twilio.rest import Client as TwilioClient
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from fpdf import FPDF
import datetime

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

def send_email_via_gmail(to_email, subject, body_html, attachment_path=None, attachment_name=None):
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

        if attachment_path and attachment_name:
            try:
                with open(attachment_path, "rb") as f:
                    part = MIMEApplication(f.read(), Name=attachment_name)
                part['Content-Disposition'] = f'attachment; filename="{attachment_name}"'
                msg.attach(part)
            except Exception as e:
                print(f"[ERROR] Could not attach file: {e}")

        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)
        
        print(f"[SUCCESS] Email sent to {to_email}")
        return "success"
    except Exception as e:
        print(f"[ERROR] Gmail Send Error: {e}")
        return str(e)

def generate_invoice_pdf(user_name, payment_id):
    """Generates a dynamic PDF invoice and returns the local file path."""
    if not payment_id:
        payment_id = "N/A"
        
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("helvetica", "B", 16)
    pdf.cell(0, 10, "SaaS Starter Template - Official Invoice", ln=True, align="C")
    
    pdf.ln(10) # Line break
    
    pdf.set_font("helvetica", "", 12)
    pdf.cell(0, 10, f"Date: {datetime.date.today()}", ln=True)
    pdf.cell(0, 10, f"Customer Name: {user_name}", ln=True)
    pdf.cell(0, 10, f"Transaction ID: {payment_id}", ln=True)
    
    pdf.ln(10)
    pdf.set_font("helvetica", "B", 12)
    pdf.cell(100, 10, "Description", border=1)
    pdf.cell(40, 10, "Qty", border=1, align="C")
    pdf.cell(50, 10, "Amount", border=1, align="R")
    pdf.ln()
    
    pdf.set_font("helvetica", "", 12)
    pdf.cell(100, 10, "SaaS App Subscription", border=1)
    pdf.cell(40, 10, "1", border=1, align="C")
    pdf.cell(50, 10, "INR 999.00", border=1, align="R")
    pdf.ln(20)
    
    pdf.set_font("helvetica", "I", 10)
    pdf.cell(0, 10, "Thank you for your business!", ln=True, align="C")
    
    file_path = f"temp_invoice_{payment_id}.pdf"
    pdf.output(file_path)
    return file_path

def process_framework_action(user_name, user_email, user_phone, payment_id=None, initial_credits=5):
    """
    The 'Magic' Function (SaaS Framework):
    1. Saves user/action to Database with INITIAL CREDITS
    2. Sends a Confirmation Email (via Gmail) with PDF Invoice
    3. Sends a WhatsApp Notification
    """
    
    results = {}

    # 1. Save to Supabase
    try:
        user_data = {
            "name": user_name, 
            "email": user_email, 
            "status": "Active" if payment_id else "Free", 
            "phone": user_phone,
            "payment_id": payment_id,
            "credits": initial_credits
        }
        # Note: 'hackathon_data' table name kept for now.
        supabase.table("hackathon_data").insert(user_data).execute()
        print(f"[SUCCESS] User {user_name} saved to Supabase.")
        results["supabase"] = "success"
    except Exception as e:
        print(f"[ERROR] Database Error: {e}")
        results["supabase"] = str(e)

    # 2. PDF Invoice & Confirmation Email
    invoice_path = None
    try:
        invoice_path = generate_invoice_pdf(user_name, payment_id)
    except Exception as e:
        print(f"[ERROR] PDF Gen Error: {e}")
        
    email_status = send_email_via_gmail(
        user_email,
        "Action Confirmed & Your Invoice! 🚀",
        f"<strong>Hi {user_name}, your action was successful! Payment ID: {payment_id}</strong><p>Please find your official invoice attached to this email.</p><p>Welcome to the framework.</p>",
        attachment_path=invoice_path,
        attachment_name="Invoice.pdf"
    )
    results["email"] = email_status
    
    # Clean up temp invoice file
    if invoice_path and os.path.exists(invoice_path):
        os.remove(invoice_path)

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

def get_user_by_email(email: str):
    """
    Fetch user details from the Supabase database.
    """
    try:
        response = supabase.table("hackathon_data").select("*").eq("email", email).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"[ERROR] Fetching User Error: {e}")
        return None

def process_login_action(user_email, user_name="User"):
    """
    Simulates Login and sends a Welcome Email.
    """
    results = {}
    
    # Try fetching user
    user_data = get_user_by_email(user_email)
    if user_data:
        user_name = user_data.get("name", user_name)

    # Send Welcome Email
    subject = "Welcome to Our Website! 🎉"
    body = f"""
    <h2>Welcome back, {user_name}!</h2>
    <p>We are thrilled to see you again.</p>
    <p>Logged in successfully.</p>
    """
    
    email_status = send_email_via_gmail(user_email, subject, body)
    results["email"] = email_status
    
    return {"message": "Login processed", "user": user_data, "results": results}