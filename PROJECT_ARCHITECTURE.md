Build a full-stack, cloud-native Business, Commerce & Finance web platform 
suite consisting of 6 interconnected products. All tools must be 100% free 
(open-source / self-hosted) or free-tier only. No paid tools or paid cloud 
services. Below is the complete specification.

═══════════════════════════════════════════════════════════════
EXISTING STACK (already owned — must integrate):
═══════════════════════════════════════════════════════════════
- Email Automation (async, queue-based via Celery + Redis — NEVER await 
  email in API response path)
- Razorpay for payments (free tier — verify every webhook with 
  HMAC-SHA256 X-Razorpay-Signature before processing)
- Ollama (self-hosted LLM — containerise with Docker, add Redis output 
  cache keyed by SHA256(input_text), add Celery queue in front to prevent 
  overload, sanitise all input before calling Ollama to prevent prompt 
  injection — max 512 tokens, strip control characters)

═══════════════════════════════════════════════════════════════
THE 6 PRODUCTS TO BUILD:
═══════════════════════════════════════════════════════════════

[P1] ONLINE MARKETPLACE FOR LOCAL BUSINESSES
- Multi-tenant vendor platform with storefront, product catalog, 
  inventory management, and order management
- Vendor isolation using PostgreSQL Row-Level Security (RLS)
- Product search via Meilisearch OSS
- Product image storage via MinIO (self-hosted, S3-compatible)
- Razorpay checkout integration (server-side order creation only)
- Real-time order notifications to vendors via WebSocket (ws library)
- Async order events published to Kafka topic: marketplace.orders
- Kafka consumer updates Meilisearch index on product changes
- Redis Pub/Sub for live inventory level updates on product pages
- Roles: Vendor, Buyer, Admin (managed by Keycloak)

[P2] SMART EXPENSE & BUDGET PLANNER
- Personal finance management with bank transaction sync 
  (Open Banking / Plaid free sandbox)
- Transaction category classification using fine-tuned DistilBERT 
  (HuggingFace Transformers — free)
- Spending anomaly detection using Isolation Forest (scikit-learn)
- TimescaleDB hypertables for time-series spending data
- TimescaleDB Continuous Aggregates for instant daily/weekly/monthly 
  dashboard queries
- Ollama (Mistral 7B) generates plain-English budget advice from analytics
- Real-time budget meter updates via Server-Sent Events (SSE) after 
  each transaction sync
- Kafka topic: finance.transactions (consumed by P3 Fraud Scorer)
- Feast feature store: publish user_avg_spend feature (shared with P3, P5)

[P3] FRAUD DETECTION & ALERT SYSTEM
- Real-time transaction monitoring with sub-100ms end-to-end latency
- XGBoost / LightGBM model for tabular transaction risk scoring 
  (NOT Ollama — 100x faster for tabular data)
- Kafka Streams sliding window: flag if 5+ transactions in 60 seconds 
  from same user
- Redis INCR/EXPIRE velocity counters per user/device (O(1) lookups)
- Debezium CDC on PostgreSQL streams DB inserts directly to Kafka 
  (no polling — millisecond detection)
- Fraud alerts pushed to admin dashboard via WebSocket in real time
- Email alert sent async via Celery queue (never blocking)
- FastAPI inference service wrapping XGBoost model
- Ollama generates human-readable fraud reason summary (async, cached)
- Immutable Kafka audit log — all alerts append-only
- Kafka topics: finance.transactions (consumer), fraud.alerts (producer)
- MLflow for model versioning; Airflow DAG for weekly retraining
- Feast: consume device_risk_score and user_avg_spend features

[P4] AI-BASED RESUME SCREENING PORTAL
- Resume upload stored in MinIO (PDF/DOCX)
- Sentence-BERT (all-MiniLM-L6-v2, HuggingFace — free) for 
  resume-JD similarity scoring via cosine similarity
- spaCy NER for skill extraction from job descriptions
- Ollama fills gaps where spaCy NER is uncertain (async, queued)
- Celery workers process resume scoring queue from Kafka topic: 
  resume.uploaded
- Recruiter dashboard with ranked candidate list and score breakdown
- Data minimisation + GDPR retention: pg_cron auto-deletes candidate 
  PII after configurable retention period
- MinIO ACLs: recruiter can only access their own job's resumes
- Email notification to recruiter on processing completion (async)
- Roles: Recruiter, Applicant, Admin (Keycloak)

[P5] PRODUCT RECOMMENDATION ENGINE
- Hybrid recommendation: collaborative filtering (LightFM OSS) + 
  content-based (TF-IDF + cosine similarity via scikit-learn)
- Lightweight 200-byte JS event tracker on frontend captures 
  click/view/purchase events → REST endpoint → Kafka topic: user.behavior
- Kafka Streams computes last-10-viewed feature in near real time
- Redis caches top-10 recommendations per user (TTL: 5 minutes)
- Ollama generates natural-language recommendation explanations
- Ollama /api/embed endpoint for product description embeddings
- A/B testing: custom traffic split in API layer (10% new model, 
  90% current) — compare CTR before full rollout
- Feast: publish session_product_views feature (shared with P3)
- Airflow DAG for daily model retraining on fresh behavioral data
- Evidently AI OSS for recommendation model drift monitoring

[P6] CUSTOMER FEEDBACK & SENTIMENT ANALYSIS SYSTEM
- Customer review ingestion API → Kafka topic: reviews.submitted
- Ollama (Llama 3.2 / Mistral 7B) for zero-shot sentiment 
  classification (positive / negative / neutral + score)
- BERTopic OSS for unsupervised theme/topic clustering of reviews
- Ollama summarises cluster keywords into human-readable themes
- Celery worker pool consumes reviews.submitted Kafka topic 
  (async — never block the review submission API)
- Redis output cache on Ollama (SHA256 key) — skip re-processing 
  identical review text (reduces Ollama load 40-60%)
- Redis Pub/Sub triggers live sentiment dashboard gauge refresh
- Grafana dashboard: reviews/min, sentiment distribution, top themes, 
  Ollama queue wait time
- Input sanitisation: strip control chars, max 512 tokens before 
  every Ollama call (prevent prompt injection)

═══════════════════════════════════════════════════════════════
SHARED INFRASTRUCTURE (applies to ALL 6 products):
═══════════════════════════════════════════════════════════════

CLOUD & ORCHESTRATION:
- K3s (lightweight Kubernetes) for production container orchestration
- Docker + Docker Compose for local development
- Traefik v3 as API gateway: auto TLS via Let's Encrypt, rate limiting 
  per IP and per API key, JWT ForwardAuth middleware
- OpenTofu (free Terraform fork) for Infrastructure as Code
- K3s HPA + KEDA for event-driven autoscaling on Kafka queue depth

AUTHENTICATION & SECURITY:
- Keycloak 24 (self-hosted on K3s) as unified SSO for all 6 products
- OAuth 2.0 + OpenID Connect (OIDC)
- Short-lived JWT access tokens (15 min) + refresh token rotation
- Redis token blacklist for revoked refresh tokens
- TOTP MFA (Keycloak built-in, Google Authenticator compatible) for 
  vendors, recruiters, and admin users
- Infisical OSS (self-hosted) for secrets management — no .env files 
  in production, no hardcoded credentials
- PostgreSQL pgcrypto for field-level encryption of PII
- Trivy (Aqua OSS) container scanning in CI pipeline
- OWASP Dependency-Check in GitHub Actions for CVE scanning
- Cloudflare Free Tier for DDoS protection and CDN

DATABASES:
- PostgreSQL 16 (primary relational DB for all products)
- PgBouncer for connection pooling (prevents connection exhaustion)
- PostgreSQL streaming replication (1 read replica) — route all 
  dashboard/report queries to replica, writes to primary only
- Composite indexes: (user_id, created_at) on transactions, 
  (vendor_id, status) on orders, (product_id, score DESC) on recs
- Declarative table partitioning by MONTH on transaction tables (P2, P3)
- pg_cron extension for scheduled VACUUM ANALYZE and data retention
- MongoDB Community Edition for product catalog (P1) and reviews (P6)
- TimescaleDB OSS extension on PostgreSQL for P2 and P3 time-series
- Redis OSS (or Valkey fork) for caching, sessions, pub/sub, queues

EVENT STREAMING:
- Apache Kafka in KRaft mode (no ZooKeeper) as central event bus
- Kafka topics: marketplace.orders | finance.transactions | 
  fraud.alerts | user.behavior | reviews.submitted | resume.uploaded
- Debezium OSS for Change Data Capture on PostgreSQL → Kafka
- Kafka Streams for sliding window processing (P3 fraud) and 
  feature computation (P5 recommendations)

STORAGE & SEARCH:
- MinIO (self-hosted, S3-compatible) for all file storage
- Meilisearch OSS for product search (P1) and review search (P6)
- Meilisearch updated asynchronously via Kafka consumer

OBSERVABILITY STACK:
- Prometheus + Grafana OSS for metrics and dashboards
- Grafana Loki + Promtail for log aggregation (NOT ELK — 10x less RAM)
- OpenTelemetry SDK in all services → Grafana Tempo for distributed traces
- GlitchTip (self-hosted, Sentry-compatible SDK) for error tracking
- Uptime Kuma (self-hosted) for uptime monitoring with email alerts
- Prometheus Alertmanager for alert routing
- Grafana OnCall OSS for on-call rotation management
- Pyroscope OSS for continuous profiling
- k6 OSS for load testing (outputs to Prometheus via remote write)
- Playwright + GitHub Actions CRON for synthetic monitoring every 15 min
- Netdata OSS for real-time server resource monitoring

MLOPS:
- MLflow (self-hosted) as model registry for all ML models
- Apache Airflow for scheduled retraining DAGs
- Feast OSS as feature store — shared features: user_avg_spend, 
  device_risk_score, session_product_views
- Evidently AI OSS for model drift detection
- Optuna OSS for hyperparameter optimisation

CI/CD:
- GitHub Actions (free tier) for CI: test → lint → Trivy scan → build
- ArgoCD (self-hosted) for GitOps-based deployment to K3s
- Gitea Container Registry or Docker Hub free tier for images

FRONTEND:
- Next.js (MIT licence, self-hosted — do NOT use Vercel paid)
- SSR for product pages (P1) and recruiter portal (P4) — SEO-critical
- Static Generation for marketing / landing pages
- next/dynamic lazy imports — initial JS bundle < 180 KB gzipped
- react-window for virtual scrolling on long lists (P1, P4)
- Comlink (Google OSS) for Web Workers — offload CSV export and 
  chart rendering to background threads
- Fontsource (npm) for self-hosted fonts — no Google Fonts CDN
- HTTP Cache-Control: 1 year for static assets, 30s for product listings

═══════════════════════════════════════════════════════════════
PERFORMANCE TARGETS:
═══════════════════════════════════════════════════════════════
- API P99 latency: < 200ms
- Fraud scoring end-to-end: < 100ms
- Recommendation API: < 150ms
- Page load on 4G: < 2 seconds
- Fraud alert WebSocket push: < 100ms from transaction insert

═══════════════════════════════════════════════════════════════
IMPLEMENTATION ORDER (follow this sequence):
═══════════════════════════════════════════════════════════════
PHASE 1 (Foundation — do this before any product code):
1. K3s cluster + OpenTofu IaC
2. Keycloak SSO with roles for all 6 products
3. Traefik API gateway with TLS + rate limiting + JWT auth
4. Infisical OSS secrets management
5. Containerised Ollama + Celery queue + Redis output cache
6. Apache Kafka (KRaft) with all 6 topics
7. Full observability: Prometheus + Grafana + Loki + GlitchTip + 
   Uptime Kuma + Alertmanager
8. Razorpay HMAC webhook verification middleware
9. Async email queue via Celery + Redis

PHASE 2 (Core Products):
- Build P1, P3, P6, P4 (in this order)
- Add Debezium CDC after P1 and P3 are running
- Database hardening: indexes, read replica, partitioning, PgBouncer
- Cloudflare Free Tier CDN setup

PHASE 3 (Intelligence Layer):
- Build P2 and P5
- MLflow model registry + Airflow DAGs
- Feast feature store with shared features across P2, P3, P5
- Evidently AI drift monitoring in Grafana
- Playwright synthetic test suite in GitHub Actions CRON
- k6 load test baseline per product

═══════════════════════════════════════════════════════════════
COST CONSTRAINT:
═══════════════════════════════════════════════════════════════
Tool licensing cost: ₹0/month
Infrastructure (VPS/cloud compute): ₹8,000–₹30,000/month
Razorpay: 2% per transaction (no monthly fee)
Cloudflare: Free tier only
GitHub Actions: Free tier (2,000 min/month for private repos)

Do NOT suggest or use: Datadog, New Relic, Splunk, Auth0, Okta, 
AWS SageMaker, AWS MSK, Confluent Cloud, MongoDB Atlas paid, 
Elastic Cloud, Algolia, HashiCorp Vault (BSL licence), Sentry cloud 
paid plans, PagerDuty, OpsGenie, Vercel paid, or any other paid tool.