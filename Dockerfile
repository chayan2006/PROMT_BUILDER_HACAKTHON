# DEPENDENCIES FOR FASTAPI REWRITE (Dockerfile requirements)
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install celery redis kafka-python psycopg2-binary passlib bcrypt python-jose

COPY . .

# Wait for db script
RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*
