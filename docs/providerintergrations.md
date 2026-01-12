Plan
Understand current routing/files: reviewed providers, orchestrator, API routes, and Redis singleton.
Wire real provider calls in orchestrator: WhatsApp, Email, Voice now use actual providers.
Add BullMQ with Redis for background delivery: queue, worker, and optional inline/queued dispatch.
What I changed
Providers integration in orchestrator
Replaced placeholder/simulated delivery with real provider calls:
WhatsApp uses MetaWhatsAppProvider via getWhatsAppProvider, supports text and template.
Email uses SMTPEmailProvider via getEmailProvider.
Voice uses TwilioVoiceProvider via getVoiceProvider.
All three update unifiedMessage with status, timestamps, failureReason, and externalId.
Expose deliverThroughChannel
Made deliverThroughChannel public so a background worker can reuse delivery logic.
BullMQ queue and worker
Added lib/queues/message-queue.ts:
Creates BullMQ Queue, Worker, and QueueEvents using REDIS_URL.
Worker calls orchestrator.deliverThroughChannel.
Exported enqueueDelivery(data, opts?).
Queue name: message-delivery. Concurrency: 5. Retries/backoff included.
Orchestrator queued dispatch option
In sendMessage, added optional background path when USE_QUEUE === 'true':
Attempts to enqueue delivery with enqueueDelivery.
Falls back to direct send if queue setup fails.
Dependencies
Added "bullmq": "^5.10.0" to dependencies.
Current routing and file system (concise)
App Router: routes under app/api/v1/** with unified messaging endpoint at app/api/v1/messaging/unified/route.ts.
Orchestration: lib/services/conversation-orchestrator.ts coordinates routing, message creation, provider delivery, and state/journey updates.
Providers:
SMS: lib/providers/sms/{safaricom,airtel}.ts via getSMSProvider.
WhatsApp: lib/providers/whatsapp/meta.ts via getWhatsAppProvider.
Email: lib/providers/email/smtp.ts via getEmailProvider.
Voice: lib/providers/voice/twilio.ts via getVoiceProvider.
Redis: lib/redis.ts provides ioredis singleton.
BullMQ: lib/queues/message-queue.ts.
Environment
Add or confirm these vars:

Redis/BullMQ: REDIS_URL, USE_QUEUE=true (to enable background mode)
WhatsApp: META_WA_TOKEN, META_WA_BUSINESS_ID
Email: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM
Voice: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
SMS: SAFARICOM_API_KEY, SAFARICOM_API_SECRET, AIRTEL_API_KEY, AIRTEL_API_SECRET
How to run
Install deps:
pnpm install
Bring up infra:
docker compose up -d (ensures Redis)
Start dev:
pnpm dev
If using BullMQ worker in same process:
The worker is instantiated on import in lib/queues/message-queue.ts. In dev Next.js, it loads under server routes when referenced by orchestrator. For a dedicated worker process in prod, spawn a Node process that imports message-queue.ts.
Minimal test calls
Direct inline (default): POST /api/v1/messaging/unified with body: { "projectId":"p1", "customerId":"+15550001111", "content":"Hello", "preferredChannel":"sms", "fallbackChannels":["whatsapp","email"] }
Queued delivery: set USE_QUEUE=true in .env, then same request.