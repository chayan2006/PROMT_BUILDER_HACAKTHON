from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from kafka_producer import publish_event
import datetime
import random

router = APIRouter(prefix="/api/p3/fraud")

class Transaction(BaseModel):
    user_id: int
    amount: float
    merchant: str
    location: str

def xgb_fraud_score(transaction: Transaction) -> float:
    """
    Mock XGBoost / LightGBM Model scoring.
    Must execute in < 100ms.
    """
    # Placeholder inference logic
    return random.uniform(0.01, 0.99)

@router.post("/score")
def secure_transaction(txn: Transaction):
    """
    Real-time transaction monitoring with sub-100ms end-to-end latency.
    Accepts from P2 or P1.
    """
    risk_score = xgb_fraud_score(txn)
    
    # Send transaction to Kafka `finance.transactions`
    txn_event = {
        "event_type": "transaction_processed",
        "data": txn.dict(),
        "risk_score": risk_score,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("finance.transactions", txn_event)
    
    # If high risk > 0.85, fire real-time alert!
    if risk_score > 0.85:
        alert_event = {
            "severity": "CRITICAL",
            "reason": "XGBoost High Anomaly Score",
            "details": txn.dict()
        }
        publish_event("fraud.alerts", alert_event)
        print(f"[P3 FRAUD] Alert published: {alert_event}")
        # Next stage: send async email via Celery here without blocking!
        
        return {"status": "flagged", "risk_score": risk_score, "action": "requires_2fa"}

    return {"status": "cleared", "risk_score": risk_score, "action": "approve"}
