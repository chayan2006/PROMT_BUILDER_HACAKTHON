# 🔑 API Setup Guide

The project requires several external services to function correctly. Since you downloaded this from GitHub, the sensitive API keys are missing. You need to obtain your own keys and add them to a `.env` file.

---

## 1. Create your `.env` file

Create a file named `.env` in the root directory (Project Folder) and paste the following template:

```env
# Database (Supabase)
SUPABASE_URL=
SUPABASE_KEY=

# Payments (Razorpay)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# WhatsApp Notifications (Twilio)
TWILIO_SID=
TWILIO_TOKEN=

# Email Notifications (Gmail)
# Note: The code uses Gmail SMTP, not Resend as mentioned in the original README.
EMAIL_USER=
EMAIL_PASS=
```

---

## 2. Get Your Keys

### 🗄️ Supabase (Database)
1.  Go to [supabase.com](https://supabase.com/) and create a free account.
2.  Create a "New Project".
3.  Once the project is ready, go to **Project Settings** -> **API**.
4.  Copy the **Project URL** -> `SUPABASE_URL`.
5.  Copy the **anon public** key -> `SUPABASE_KEY`.

### 💳 Razorpay (Payments)
1.  Go to [dashboard.razorpay.com](https://dashboard.razorpay.com/) and sign up.
2.  Switch to **Test Mode** (toggle on the top right).
3.  Go to **Settings** -> **API Keys** -> **Generate Key**.
4.  Copy the **Key ID** -> `RAZORPAY_KEY_ID`.
5.  Copy the **Key Secret** -> `RAZORPAY_KEY_SECRET`.

### 💬 Twilio (WhatsApp/SMS)
1.  Go to [twilio.com](https://www.twilio.com/) and sign up for a free trial.
2.  On the **Console Dashboard**, look for "Account Info".
3.  Copy the **Account SID** -> `TWILIO_SID`.
4.  Copy the **Auth Token** -> `TWILIO_TOKEN`.
5.  **Important**: To test WhatsApp, you must set up the [Twilio Sandbox for WhatsApp](https://console.twilio.com/us1/develop/sms/settings/whatsapp-sandbox).

### 📧 Gmail (Email Notifications)
*Note: You cannot use your regular Gmail password. You must generate an App Password.*
1.  Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2.  Enable **2-Step Verification** if it's not already on.
3.  Search for **"App passwords"**.
4.  Create a new app password (name it "SaaS App" or similar).
5.  Copy the 16-character code causing spaces -> `EMAIL_PASS`.
6.  Use your full Gmail address -> `EMAIL_USER`.

---

## 3. Verify Setup

After adding these keys to your `.env` file:
1.  Restart your backend server (`Ctrl+C` then `uvicorn main:app --reload`).
2.  The server should start without errors.
