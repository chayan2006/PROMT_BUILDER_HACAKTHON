import os
import json
from kafka import KafkaProducer

KAFKA_BROKER_URL = os.getenv("KAFKA_BROKER_URL", "localhost:9092")

# Global producer instance
producer = None

def get_kafka_producer():
    global producer
    if producer is None:
        try:
            producer = KafkaProducer(
                bootstrap_servers=[KAFKA_BROKER_URL],
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            print("[KAFKA] Producer connected successfully")
        except Exception as e:
            print(f"[KAFKA] Connection failed: {e}")
    return producer

def publish_event(topic: str, event_data: dict):
    prod = get_kafka_producer()
    if prod:
        prod.send(topic, event_data)
        prod.flush()
