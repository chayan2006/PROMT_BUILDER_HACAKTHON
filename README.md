# SaaS Starter Framework 🚀

A full-stack template designed to jumpstart your SaaS or E-commerce project. It comes pre-configured with modern authentication, database, payment, and notification services.

## 🌟 Key Features

- **Frontend**: Fast and responsive UI built with **React** & **Vite**.
- **Styling**: Beautiful components using **Tailwind CSS**.
- **Backend**: High-performance API with **FastAPI** (Python).
- **Database**: Scalable data storage with **Supabase**.
- **Payments**: Integrated **Razorpay** checkout flow.
- **Notifications**:
    - **WhatsApp** alerts via Twilio.
    - **Email** confirmations via Resend.
- **Navigation**: Client-side routing with **React Router**.

---

## 🛠️ Technology Stack

### Frontend (`/frontend`)
| Tech | Description |
| :--- | :--- |
| **Vite** | Next-generation frontend tooling |
| **React** | Library for building user interfaces |
| **Tailwind CSS** | Utility-first CSS framework |
| **Axios** | Promise-based HTTP client for API calls |
| **Lucide React** | Beautiful & consistent icons |
| **React Router** | Declarative routing for React |

### Backend (`/`)
| Tech | Description |
| :--- | :--- |
| **FastAPI** | Modern, fast web framework for building APIs |
| **Uvicorn** | ASGI web server implementation |
| **Supabase** | Open source Firebase alternative (PostgreSQL) |
| **Razorpay** | Payment gateway integration |
| **Twilio** | SMS & WhatsApp API |
| **Resend** | Developer-first email API |

---

## 📂 Project Structure

```
Template/
├── frontend/             # React Application
│   ├── src/
│   │   ├── components/   # UI Components (Subscription, Navbar, etc.)
│   │   ├── App.jsx       # Main Application Component
│   │   └── main.jsx      # Entry Point
│   ├── package.json      # Frontend Dependencies
│   └── vite.config.js    # Vite Configuration
├── main.py               # FastAPI Backend Server
├── database.py           # Database & Service Logic (Supabase, Email, WhatsApp)
├── requirements.txt      # Backend Dependencies
└── .env                  # Environment Variables (Keep Secret!)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.8+
- Accounts for: Supabase, Razorpay, Twilio, Resend

### 1. Backend Setup

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory and add your keys:
    ```env
    # Database
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY=your_supabase_anon_key

    # Payments
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_secret

    # Notifications
    TWILIO_SID=your_twilio_sid
    TWILIO_TOKEN=your_twilio_auth_token
    RESEND_API_KEY=your_resend_api_key
    ```

3.  **Start Server**:
    ```bash
    uvicorn main:app --reload
    ```
    Server will run at `http://localhost:8000`.

### 2. Frontend Setup

1.  **Navigate to Frontend**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Dev Server**:
    ```bash
    npm run dev
    ```
    Frontend will run at `http://localhost:5173`.

---

## 💳 Payment Flow (Razorpay)

1.  **Subscription Page**: User selects a plan and enters details (Name, Email, Phone).
2.  **Order Creation**: Frontend calls `/create-order` to generate a Razorpay Order ID.
3.  **Checkout**: Razorpay modal opens with the pre-filled user details.
4.  **Verification**: On success, the user is redirected to the Registration page.

## 🔔 Notification System

The `process_framework_action` function in `database.py` handles post-action logic:
1.  **Saves** user data to Supabase.
2.  **Sends** a welcome email via Resend.
3.  **Sends** a WhatsApp confirmation via Twilio.

---

## 🤝 Contributing

Feel free to fork this repository and submit pull requests to enhance the framework!
