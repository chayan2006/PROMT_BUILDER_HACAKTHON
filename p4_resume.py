from fastapi import APIRouter, UploadFile, File, Form
from kafka_producer import publish_event
import datetime
import os

router = APIRouter(prefix="/api/p4/resume")

@router.post("/upload")
async def upload_resume(job_id: int = Form(...), file: UploadFile = File(...)):
    """
    Resume upload logic simulating MinIO storage and Kafka topic dispatch for Sentence-BERT processing.
    """
    # 1. Mock MinIO Upload process
    file_bytes = await file.read()
    mock_s3_path = f"s3://resumes/job_{job_id}/{file.filename}"
    
    # 2. Dispatch to Kafka queue `resume.uploaded` for Celery Workers
    event = {
        "event_type": "resume_uploaded",
        "job_id": job_id,
        "s3_path": mock_s3_path,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    publish_event("resume.uploaded", event)
    print(f"[P4 RESUME] File {file.filename} uploaded and streaming to Celery workers for NLP.")
    
    return {"status": "success", "message": "Resume uploaded. AI Similarity scoring is processing asynchronously."}
