from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from ai_service import generate_response
from kafka_producer import publish_event
import datetime

router = APIRouter(prefix="/api/p6/feedback")

class Review(BaseModel):
    product_id: int
    user_id: int
    review_text: str

def analyze_review_background(review_text: str, product_id: int):
    """
    Ollama zero-shot classification (Positive/Negative/Neutral)
    Processed via Celery or BackgroundTasks so it NEVER blocks the API response per requirements.
    """
    prompt = f"Analyze this product product review. Output ONLY ONE WORD (Positive, Negative, or Neutral): '{review_text}'"
    messages = [
        {"role": "system", "content": "You are a zero-shot sentiment classification API."},
        {"role": "user", "content": prompt}
    ]
    sentiment = generate_response(messages, model="phi3").strip()
    
    event = {
        "event_type": "review_analyzed",
        "product_id": product_id,
        "sentiment": sentiment,
        "text": review_text
    }
    # Stream the final analysis to Kafka for real-time Grafana/Redis dashboard gauges
    publish_event("reviews.analyzed", event)
    print(f"[P6 FEEDBACK] Analysis complete: {sentiment} -> published to Kafka")

@router.post("/submit")
def submit_review(review: Review, background_tasks: BackgroundTasks):
    """
    Customer review ingestion API -> Kafka topic: reviews.submitted
    Immediately accepts the review and offloads Ollama inference to the background.
    """
    
    event = {
        "event_type": "review_submitted",
        "data": review.dict(),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("reviews.submitted", event)
    
    # Offload AI to background worker
    background_tasks.add_task(analyze_review_background, review.review_text, review.product_id)
    
    return {"status": "success", "message": "Review accepted for asynchronous processing."}
