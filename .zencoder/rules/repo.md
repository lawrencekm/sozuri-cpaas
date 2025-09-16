# Repository Metadata

- name: sozuri-project
- stack: Next.js 15, React 19, TypeScript, Prisma 6, PostgreSQL, TailwindCSS
- packageManager: pnpm
- auth: next-auth
- db client: PrismaClient singleton in lib/prisma.ts (and lib/db.ts duplicate)
- api style: App Router (route.ts) under app/api/v1/**
- domains:
  - messaging: unified orchestration, message logs, webhooks
  - analytics: dashboard metrics (currently mock)
  - admin: projects, users, logs, metrics
- infra: docker-compose (postgres, redis), .env for config

## Important Paths
- app/api/v1/**: REST endpoints
- lib/services/**: orchestration, routing, conversation management
- prisma/schema.prisma: DB schema
- lib/cache.ts, lib/redis.ts: Redis helpers

## Known Gaps / TODOs
- Analytics metrics endpoint returns mock data
- Delivery functions in ConversationOrchestrator simulate provider delivery
- No rate limiting/idempotency
- No background queue for delivery/webhooks

## Environment
- DATABASE_URL, REDIS_URL, NEXTAUTH_*, provider keys

## Start Locally
1. pnpm install
2. docker compose up -d
3. pnpm dev

## Note
- Redis is optional; features degrade gracefully if unavailable where used via try/ping.