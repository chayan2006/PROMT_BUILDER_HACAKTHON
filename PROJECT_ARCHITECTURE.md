# SaaS Starter Framework - Project Overview 🚀

This document provides a comprehensive explanation of the entire codebase, architecture, and workflows for the SaaS Starter Framework.

---

## 🏗️ Project Architecture

The project follows a **Full-Stack** architecture:
- **Frontend**: React + Vite (located in `/frontend`)
- **Backend**: FastAPI (Python) (located in `/`)
- **Database**: Supabase (PostgreSQL)
- **Services**: Razorpay (Payments), Twilio (WhatsApp), Resend/Gmail (Email), Ollama (AI)

### Directory Structure
```
Template/
├── main.py               # The "Brain" - API Endpoints
├── database.py           # The "Muscle" - Database & Service Logic
├── ai_service.py         # The "Intelligence" - AI Chat Logic
├── requirements.txt      # Backend Dependencies
├── .env                  # Secrets (API Keys)
└── frontend/             # The "Face" - React Application
```

---

## 🐍 Backend Explanation

### 1. `main.py` (The API Layer)
This file is the entry point for the backend server. It uses **FastAPI** to define URL endpoints that the frontend can talk to.

**Key Endpoints:**
- `GET /`: Health check ("Ready for Hackathon!").
- `POST /login`: Simulates a user login. Calls `process_login_action` from `database.py`.
- `POST /register`: Handles new user registration after payment. Calls `process_framework_action` from `database.py`.
- `POST /create-order`: Generates a Razorpay order ID for payments.
- `POST /chat`: Accepts chat messages and returns an AI response using `ai_service.py`.
- `GET /test-whatsapp` & `POST /whatsapp`: Endpoints for testing Twilio WhatsApp integration.

### 2. `database.py` (The Service Layer)
This file handles all "heavy lifting" logic: talking to the database and external APIs.

**Key Functions:**
- `create_client()`: Connects to **Supabase** using keys from `.env`.
- `create_razorpay_order()`: Creates a payment order with Razorpay.
- `send_email_via_gmail()`: Sends emails using Python's `smtplib`.
- **`process_framework_action()`**: The core logic tied to the hackathon frameowork. When a user registers:
    1.  **Saves** user details to Supabase table `hackathon_data`.
    2.  **Sends** a "Welcome" email via Gmail.
    3.  **Sends** a WhatsApp confirmation via Twilio.
    4.  Returns a success object.

### 3. `ai_service.py` (The AI Layer)
This file acts as a wrapper for a local AI model (Ollama).

**Key Function:**
- `generate_response(messages, model)`:
    - Sends the conversation history to a local Ollama instance running at `http://127.0.0.1:11434`.
    - Returns the AI's text response.
    - Handles errors if Ollama is not running.

---

## ⚛️ Frontend Explanation (`/frontend`)

The frontend is a **React** application built with **Vite** for speed.

**Key Files:**
- `src/main.jsx`: The entry point that renders the React app.
- `src/App.jsx`: The main component handling routing (pages) and layout.
- `src/components/`: Reusable UI pieces (Navbar, Hero, PriceCards, etc.).
- `vite.config.js`: Configuration for the build tool.

The frontend talks to the backend via HTTP requests (using `axios` or `fetch`) to `http://localhost:8000`.

---

## 🔄 Key Workflows

### 1. User Registration Flow
1.  **User** clicks "Subscribe" on Frontend.
2.  **Frontend** calls `/create-order` -> **Backend** (Razorpay API) -> Returns Order ID.
3.  **User** completes payment on Frontend.
4.  **Frontend** calls `/register` with user details & payment ID.
5.  **Backend** (`process_framework_action`):
    -   Saves user to Supabase.
    -   Sends Welcome Email.
    -   Sends WhatsApp msg.
6.  **User** sees "Success" message.

### 2. AI Chat Flow
1.  **User** types a message in the Chat Interface.
2.  **Frontend** sends message history to `POST /chat`.
3.  **Backend** (`ai_service.py`) forwards it to **Ollama**.
4.  **Ollama** generates response -> **Backend** returns it -> **Frontend** displays it.

---

## 🚀 Setup & Run

### 1. Environment Variables (`.env`)
You need to create a `.env` file with these keys:
```env
SUPABASE_URL=...
SUPABASE_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
TWILIO_SID=...
TWILIO_TOKEN=...
EMAIL_USER=...
EMAIL_PASS=...
```

### 2. Run Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload
```
Runs at `http://localhost:8000`

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs at `http://localhost:5173`

### 4. Run AI (Optional)
Ensure [Ollama](https://ollama.com) is installed and running:
```bash
ollama serve
# In another terminal, pull a model if needed
ollama pull phi3
```
