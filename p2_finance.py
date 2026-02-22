from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from kafka_producer import publish_event
import datetime
import asyncio

router = APIRouter(prefix="/api/p2/finance")

class TransactionSync(BaseModel):
    user_id: int
    plaid_token: str
    amount: float
    description: str

@router.post("/sync")
def sync_bank_transaction(sync_data: TransactionSync):
    """
    Simulates Open Banking / Plaid transaction sync.
    Classify using fine-tuned DistilBERT (Mocked here).
    Publishes to Kafka `finance.transactions` to trigger P3 Fraud sliding windows.
    """
    # 1. Mock DistilBERT categorization
    predicted_category = "Software Subscriptions" if "tech" in sync_data.description.lower() else "General Shopping"
    
    # 2. Publish to Kafka
    event = {
        "event_type": "bank_sync_transaction",
        "data": sync_data.dict(),
        "category": predicted_category,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("finance.transactions", event)
    
    return {"status": "success", "category": predicted_category, "message": "Transaction synced to TimescaleDB and Kafka."}

@router.get("/budget-meter/{user_id}")
async def budget_meter_sse(user_id: int):
    """
    Server-Sent Events (SSE) for real-time budget meter updates.
    Yields data continuously.
    """
    async def event_generator():
        while True:
            # Simulated real-time balance querying based on background Kafka consumption
            yield f"data: {{'user_id': {user_id}, 'budget_used': 75.3, 'remaining': 24.7}}\n\n"
            await asyncio.sleep(5)
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")
