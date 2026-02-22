from fastapi import APIRouter
from pydantic import BaseModel
from kafka_producer import publish_event
import datetime

router = APIRouter(prefix="/api/p5/recommendations")

class UserBehavior(BaseModel):
    user_id: int
    product_id: int
    event_type: str # 'click', 'view', 'purchase'

@router.post("/track")
def track_behavior(behavior: UserBehavior):
    """
    Lightweight endpoint capturing click/view events.
    Sends directly to Kafka -> Kafka Streams computes last-10-viewed.
    """
    event = {
        "event": behavior.event_type,
        "user_id": behavior.user_id,
        "product_id": behavior.product_id,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("user.behavior", event)
    return {"status": "success"}

@router.get("/{user_id}")
def get_recommendations(user_id: int):
    """
    Fetches real-time recommendations (Hybrid LightFM + TF-IDF) generated through Kafka streams and cached in Redis.
    """
    # Mock retrieval logic (In reality, populates from Redis Cache)
    mock_recs = [
        {"product_id": 101, "score": 0.98, "explanation": "Since you frequently viewed AI subscriptions..."},
        {"product_id": 105, "score": 0.89, "explanation": "Similar to your previous software purchases."}
    ]
    return {"user_id": user_id, "recommendations": mock_recs}
