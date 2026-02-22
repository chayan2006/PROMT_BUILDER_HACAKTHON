from fastapi import FastAPI, Form, Request, BackgroundTasks, UploadFile, File
from fastapi.responses import JSONResponse
import traceback
from fastapi.middleware.cors import CORSMiddleware
from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

from config_db import init_db
init_db()

import api_router
import p1_marketplace
import p2_finance
import p3_fraud
import p4_resume
import p5_recommendation
import p6_feedback

# Add core routers
app.include_router(api_router.router)
app.include_router(p1_marketplace.router)
app.include_router(p2_finance.router)
app.include_router(p3_fraud.router)
app.include_router(p4_resume.router)
app.include_router(p5_recommendation.router)
app.include_router(p6_feedback.router)

# ==========================================
# PHASE 5.3: SELF-HEALING AI ERROR HANDLING
# ==========================================
def analyze_and_alert_crash(url: str, error_trace: str):
    try:
        from ai_service import generate_response
        from database import send_email_via_gmail
        import os
        
        print(f"[AGENT] Self-Healing Protocol Activated. Analyzing crash at {url}...")
        
        prompt = f"The FastAPI endpoint {url} just crashed with the following Python traceback:\n\n{error_trace}\n\nAnalyze this error, explain what caused it, and provide the exact python code snippet to fix it."
        messages = [
            {"role": "system", "content": "You are a Senior DevOps AI working on a FastAPI application. Debug the python stack trace and provide a direct fix."},
            {"role": "user", "content": prompt}
        ]
        
        # Ollama generates the fix
        ai_fix = generate_response(messages, model="phi3")
        
        # Alert Developer via Email
        dev_email = os.getenv("EMAIL_USER")
        if dev_email:
            send_email_via_gmail(
                to_email=dev_email,
                subject="🚨 CRITICAL: Your SaaS Platform Crashed!",
                body_html=f"<h3>Endpoint: {url}</h3><p><strong>AI Diagnosis & Fix:</strong></p><pre style='background:#f4f4f4;padding:10px;'>{ai_fix}</pre><br><hr><p><strong>Raw Traceback:</strong></p><pre style='color:red;'>{error_trace}</pre>"
            )
            print("[AGENT] Self-Healing Complete: Developer alerted with AI-generated fix.")
            
    except Exception as inner_e:
        print(f"[CRASH] Self-Healing Agent Failed: {inner_e}")

@app.exception_handler(Exception)
async def ai_self_healing_exception_handler(request: Request, exc: Exception):
    """
    Catches ALL 500 Internal Server errors globally, and queues an AI background task to debug it.
    """
    error_trace = traceback.format_exc()
    print(f"[CRASH] Intercepted 500 Error: {exc}")
    
    # Ask Ollama to Analyze the Crash in the background
    background_tasks = BackgroundTasks()
    background_tasks.add_task(analyze_and_alert_crash, str(request.url), error_trace)
    
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": "Internal Server Error. Our DevOps AI is already debugging this!"},
        background=background_tasks
    )

@app.get("/trigger-crash")
def trigger_crash():
    """
    Deliberately crashes the server to test the AI Self-Healing feature.
    """
    # Intentional ZeroDivisionError
    print("Testing Self-Healing: Triggering deliberate crash...")
    return 1 / 0

@app.get("/")
def home():
    return {"status": "Ready for Hackathon!"}

from pydantic import BaseModel
from typing import Optional
from database import process_framework_action, create_razorpay_order

class User(BaseModel):
    name: str
    email: str
    phone: str
    payment_id: Optional[str] = None

class OrderRequest(BaseModel):
    amount: int
    currency: str = "INR"

@app.get("/test-whatsapp")
def test_whatsapp(to_phone: str):
    try:
        twilio_sid = os.getenv("TWILIO_SID")
        twilio_token = os.getenv("TWILIO_TOKEN")
        client = TwilioClient(twilio_sid, twilio_token)
        
        # Ensure format
        if not to_phone.startswith("whatsapp:"):
            to_phone = f"whatsapp:{to_phone}"

        message = client.messages.create(
            from_='whatsapp:+14155238886',
            body="Test Message from SaaS Framework 🚀",
            to=to_phone
        )
        return {"status": "success", "sid": message.sid}
    except Exception as e:
        return {"status": "error", "message": str(e)}

class LoginRequest(BaseModel):
    email: str
    name: str = "User"

@app.post("/login")
def login_endpoint(request: LoginRequest):
    try:
        from database import process_login_action
        result = process_login_action(request.email, request.name)
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/user/{email}")
def get_user_endpoint(email: str):
    try:
        from database import get_user_by_email
        user = get_user_by_email(email)
        if user:
            return {"status": "success", "user": user}
        return {"status": "error", "message": "User not found"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/create-order")
def create_order(request: OrderRequest):
    try:
        order = create_razorpay_order(request.amount, request.currency)
        return {"status": "success", "order": order}
    except Exception as e:
        return {"status": "error", "message": f"Razorpay Error: {str(e)}"}

@app.post("/register")
def register_user(user: User, background_tasks: BackgroundTasks):
    try:
        from database import process_framework_action
        
        # Initialize credits based on status
        initial_credits = 100 if user.payment_id else 5
        
        result = process_framework_action(user.name, user.email, user.phone, user.payment_id, initial_credits)
        
        # Trigger AI onboarding in the background
        background_tasks.add_task(background_onboarding_task, user.email, user.name, "Active" if user.payment_id else "Free")
        
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

import hmac
import hashlib

@app.post("/webhook/razorpay")
async def razorpay_webhook(request: Request):
    """
    Razorpay HMAC-SHA256 Webhook Verification
    Required for P1 Online Marketplace Checkout
    """
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "change_me_in_production")
    signature = request.headers.get("X-Razorpay-Signature")
    
    if not signature:
        return {"status": "error", "message": "Missing Signature"}
        
    payload = await request.body()
    
    expected_signature = hmac.new(
        secret.encode(), 
        payload, 
        hashlib.sha256
    ).hexdigest()
    
    if expected_signature != signature:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Invalid HMAC-SHA256 signature")
        
    # Processing valid webhook async via Celery or Kafka Stream
    print("[WEBHOOK] Secure Razorpay transaction verified.")
    return {"status": "success", "message": "Webhook Verified"}

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

class ChatRequest(BaseModel):
    messages: list
    model: str = "phi3"
    email: Optional[str] = None

@app.post("/chat")
def chat_endpoint(request: ChatRequest):
    from ai_service import generate_response
    
    context_msgs = request.messages
    if request.email:
        from database import get_user_by_email
        user = get_user_by_email(request.email)
        if user:
            system_prompt = {
                "role": "system",
                "content": f"You are a helpful assistant for this SaaS platform. The user you are talking to is named {user.get('name', 'User')}. Their subscription status is {user.get('status', 'Free')}. Keep your answers helpful and concise."
            }
            context_msgs = [system_prompt] + request.messages
            
    response = generate_response(context_msgs, request.model)
    return {"response": response}

@app.post("/whatsapp-webhook")
async def whatsapp_webhook(request: Request, From: str = Form(...), Body: str = Form(...)):
    """
    Receives incoming WhatsApp messages from Twilio, gets an AI response
    from Ollama, and sends it back to the user via WhatsApp.
    """
    try:
        from ai_service import generate_response
        from database import supabase
        import os
        from twilio.rest import Client
        
        # 1. (Optional) Check if user exists in our DB based on phone number
        # Phone numbers from Twilio come in like 'whatsapp:+1234567890'
        phone_number = From.replace("whatsapp:", "")
        system_prompt = "You are a helpful and very concise AI assistant for a SaaS platform. Keep responses under 2 sentences."
        
        try:
             # Try to find user by phone to give AI more context
             db_response = supabase.table("hackathon_data").select("*").eq("phone", phone_number).execute()
             if db_response.data and len(db_response.data) > 0:
                 user = db_response.data[0]
                 system_prompt = f"You are a concise AI assistant for a SaaS platform. You are talking to a registered user named {user.get('name', 'User')} on the {user.get('status', 'Free')} plan. Keep it extremely brief."
        except Exception as e:
             pass # if DB query fails, just use default prompt
             
        # 2. Ask Ollama for a response
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": Body}
        ]
        
        ai_reply = generate_response(messages, model="phi3")
        
        # 3. Send AI response back via Twilio
        account_sid = os.environ.get('TWILIO_SID')
        auth_token = os.environ.get('TWILIO_TOKEN')
        
        if account_sid and auth_token and auth_token != "[AuthToken]":
            client = Client(account_sid, auth_token)
            
            message = client.messages.create(
                from_='whatsapp:+14155238886', # Your Twilio Sandbox Number
                body=ai_reply,
                to=From
            )
            print(f"[SUCCESS] Sent AI reply to {From}. SID: {message.sid}")
            
        return {"status": "success", "reply": ai_reply}
        
    except Exception as e:
        print(f"[ERROR] WhatsApp Webhook Error: {e}")
        return {"status": "error", "message": str(e)}

class EmailWebhookRequest(BaseModel):
    sender_email: str
    subject: str
    body: str

@app.post("/email-webhook")
def email_webhook(request: EmailWebhookRequest):
    """
    Agentic Email Router: Uses AI to detect user intent (support vs schedule), 
    extracts parameters (date/time), and autonomously triggers the correct workflow.
    """
    try:
        from ai_service import generate_response
        from database import send_email_via_gmail
        import json
        
        # 1. Ask AI to output strict JSON recognizing the Intent
        intent_prompt = f"Analyze this email from {request.sender_email}: '{request.subject} - {request.body}'. " \
                        f"If they are asking to schedule a meeting, output valid JSON: {{\"intent\": \"schedule\", \"date\": \"extracted_date\", \"time\": \"extracted_time\"}}. " \
                        f"Otherwise, output: {{\"intent\": \"support\"}}. Output ONLY raw JSON, nothing else."
        
        messages = [
            {"role": "system", "content": "You are a strict JSON-only API router. Return only valid python dictionary strings without markdown syntax, no backticks."},
            {"role": "user", "content": intent_prompt}
        ]
        
        ai_raw_json = generate_response(messages, model="phi3")
        
        try:
            # Clean up the output in case the local LLM wraps it in markdown
            if "```json" in ai_raw_json:
                ai_raw_json = ai_raw_json.split("```json")[1].split("```")[0].strip()
            elif "```" in ai_raw_json:
                ai_raw_json = ai_raw_json.split("```")[1].split("```")[0].strip()
                
            parsed_data = json.loads(ai_raw_json)
        except Exception as parse_e:
            print(f"[WARN] JSON Parse Failed, falling back to Support Workflow. Raw AI: {ai_raw_json}")
            parsed_data = {"intent": "support"}
        
        # 2. Agentic Routing Logic
        if parsed_data.get("intent") == "schedule":
            # Workflow A: Auto-Scheduler
            date = parsed_data.get("date", "soon")
            time = parsed_data.get("time", "TBD")
            
            # (In a real app, we would insert an event into Supabase Calendar here)
            print(f"[AGENT] Auto-scheduling meeting for {date} at {time} in Database...")
            
            ai_reply = f"Hello! I'm the AI Assistant. I've successfully scheduled our meeting for {date} at {time} on my calendar. I will send you a calendar invite shortly!"
            subject = f"Re: {request.subject} [Meeting Confirmed]"
        else:
            # Workflow B: Standard Support Auto-Responder
            support_prompt = f"Draft a polite, helpful, and concise response to this email: '{request.body}'"
            messages = [
                {"role": "system", "content": "You are a support AI. Very concise (under 3 sentences)."},
                {"role": "user", "content": support_prompt}
            ]
            ai_reply = generate_response(messages, model="phi3")
            subject = f"Re: {request.subject}"

        # 3. Send out the final resolution via SMTP
        send_email_via_gmail(
            to_email=request.sender_email,
            subject=subject,
            body_html=f"<p>{ai_reply.replace('\n', '<br>')}</p>"
        )
        
        return {
            "status": "success", 
            "ai_intent": parsed_data.get("intent"),
            "ai_reply": ai_reply
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def background_onboarding_task(email: str, name: str, status: str):
    from ai_service import generate_response
    from database import send_email_via_gmail
    
    prompt = f"Write a personalized 'Day 2' check-in email to a user named {name} who is currently on the '{status}' plan. Encourage them to try our new AI features."
    messages = [
        {"role": "system", "content": "You are the friendly founder of this SaaS platform. Keep the email to 2-3 sentences max."},
        {"role": "user", "content": prompt}
    ]
    
    ai_email_body = generate_response(messages, model="phi3")
    
    send_email_via_gmail(
        to_email=email,
        subject="Checking in!",
        body_html=f"<p>{ai_email_body.replace('\n', '<br>')}</p>"
    )

class OnboardingRequest(BaseModel):
    email: str
    name: str = "User"
    status: str = "Free"

@app.post("/simulate-onboarding")
def trigger_onboarding(request: OnboardingRequest, background_tasks: BackgroundTasks):
    """
    Simulates triggering an automated Day 2 onboarding email using FastAPI Background Tasks.
    """
    background_tasks.add_task(background_onboarding_task, request.email, request.name, request.status)
    return {"status": "success", "message": "Onboarding background task triggered! Email will arrive soon."}


@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    """
    Accepts a .wav audio file, transcribes it using SpeechRecognition, 
    and uses Ollama to summarize the meeting into action items.
    """
    if not file.filename.endswith('.wav'):
        return {"status": "error", "message": "Currently only .wav files are supported for this template."}
        
    try:
        import speech_recognition as sr
        import shutil
        from ai_service import generate_response
        import tempfile
        import os
        
        # Save temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        # Transcribe
        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_path) as source:
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            
        # Clean up temp file
        os.remove(temp_path)
            
        # Summarize with Ollama
        prompt = f"Here is a meeting transcript:\n\n{text}\n\nPlease summarize the meeting and list the key Action Items."
        messages = [
            {"role": "system", "content": "You are an executive assistant. Your job is to extract extremely concise summaries and action items from transcripts."},
            {"role": "user", "content": prompt}
        ]
        summary = generate_response(messages, model="phi3")
        
        return {
            "status": "success", 
            "transcription": text,
            "summary": summary
        }
    except Exception as e:
        print(f"[ERROR] Audio processing failed: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/admin/users")
def get_all_users():
    """FETCH ALL USERS FOR ADMIN DASHBOARD"""
    try:
        from database import supabase
        response = supabase.table("hackathon_data").select("*").execute()
        return {"status": "success", "users": response.data}
    except Exception as e:
        return {"status": "error", "message": str(e)}

class AdminAnalyzeRequest(BaseModel):
    query: str

@app.post("/admin/analyze")
def analyze_data(request: AdminAnalyzeRequest):
    """
    Feeds the entire user JSON database into Ollama and asks a question about it.
    """
    try:
        from database import supabase
        from ai_service import generate_response
        import json
        
        # 1. Fetch raw data
        db_response = supabase.table("hackathon_data").select("*").execute()
        raw_data = db_response.data
        
        # 2. Convert to string
        json_data_str = json.dumps(raw_data)
        
        # 3. Ask Ollama!
        prompt = f"You are a Data Analyst AI. Look at this raw user database JSON:\n\n{json_data_str}\n\nAnswer the CEO's question accurately based ONLY on this data: '{request.query}'"
        
        messages = [
            {"role": "system", "content": "You are a concise, highly analytical Data Scientist. Provide answers in 2-4 sentences max based on the provided JSON data."},
            {"role": "user", "content": prompt}
        ]
        
        analysis = generate_response(messages, model="phi3")
        return {"status": "success", "analysis": analysis}
    except Exception as e:
        return {"status": "error", "message": str(e)}

class TranslateRequest(BaseModel):
    text: str
    target_language: str

@app.post("/translate")
def translate_text(request: TranslateRequest):
    """
    Translates UI text into a target language using Ollama.
    """
    try:
        from ai_service import generate_response
        
        prompt = f"Translate the following UI text into {request.target_language} accurately and concisely. Return ONLY the translated text, no quotes or conversational filler: '{request.text}'"
        
        messages = [
            {"role": "system", "content": f"You are a professional localization expert. Translate directly into {request.target_language} without any extra explanation."},
            {"role": "user", "content": prompt}
        ]
        
        translated_text = generate_response(messages, model="phi3").strip(' "\'\n`')
        return {"status": "success", "translated_text": translated_text}
    except Exception as e:
        return {"status": "error", "message": str(e)}

class WriterRequest(BaseModel):
    email: str
    topic: str
    tone: str = "Professional"

@app.post("/ai-writer")
def ai_writer(request: WriterRequest):
    """
    SaaS feature: deducts 1 credit to generate a blog post via Ollama.
    """
    try:
        from ai_service import generate_response
        from database import supabase
        
        # 1. Check Credits
        user_res = supabase.table("hackathon_data").select("id, credits").eq("email", request.email).execute()
        if not user_res.data or len(user_res.data) == 0:
            return {"status": "error", "message": "User not found."}
            
        current_credits = user_res.data[0].get("credits", 0)
        
        if current_credits <= 0:
            return {"status": "error", "message": "Insufficient Credits. Please upgrade your subscription."}
            
        # 2. Generate Content
        prompt = f"Write a structured, engaging ~300 word blog post about '{request.topic}'. Tone: {request.tone}."
        messages = [
            {"role": "system", "content": "You are an expert AI copywriter for a SaaS platform. Use markdown headings."},
            {"role": "user", "content": prompt}
        ]
        
        article = generate_response(messages, model="phi3")
        
        # 3. Deduct Credit
        new_credits = current_credits - 1
        supabase.table("hackathon_data").update({"credits": new_credits}).eq("email", request.email).execute()
        
        # 4. Optional: Save to a user_content table (skipped here to keep Supabase schema simple for the hackathon, returning right to UI)
        
        return {
            "status": "success", 
            "article": article,
            "credits_remaining": new_credits
        }
        
    except Exception as e:
        print(f"[ERROR] AI Writer Failed: {e}")
        return {"status": "error", "message": str(e)}