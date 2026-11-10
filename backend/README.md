# Percepta Backend

Hono v5 + TypeScript + Cloudflare Workers / Node.js 22+

## Architecture & Foundation
- **Runtime**: Cloudflare Workers (Edge) OR Node.js 22+ / Bun
- **Framework**: Hono v5 (ESM only)
- **Validation**: Zod + `@hono/zod-validator`
- **Database**: PostgreSQL (Neon serverless) + Drizzle ORM
- **RPC**: Hono RPC (`hc`) sharing `AppType` with the frontend

## Directory Structure
```
backend/
├── src/
│   ├── db/
│   │   ├── client.ts        # Drizzle client factory
│   │   └── schema.ts        # Schema definitions (placeholder)
│   ├── lib/
│   │   ├── env.ts           # Zod-validated environment schema & parser
│   │   └── errors.ts        # Envelopes, Error codes, and AppError class
│   ├── middleware/
│   │   ├── error-handler.ts # Hono v5 global error handler
│   │   └── logger.ts        # Request logging middleware
│   ├── routes/
│   │   └── health.ts        # /api/v1/health endpoint
│   ├── index.ts             # App assembly & Cloudflare Workers entry
│   ├── node-server.ts       # Node.js 22+ entry adapter (@hono/node-server)
│   └── types.ts             # AppEnv context types
├── .dev.vars                # Cloudflare dev environment variables
├── .dev.vars.example        # Example environment variables
├── package.json
├── tsconfig.json
└── wrangler.toml
```

## Running the Backend

### Cloudflare Workers (recommended)
```bash
npm install
npm run dev
```
Serves locally via `wrangler dev` at `http://localhost:8787`.

### Node.js 22+
```bash
npm install
npm run dev:node
```
Serves locally via `@hono/node-server` at `http://localhost:8787`.

## Database & Migrations (Drizzle ORM + Neon)

### Database Commands
- **Generate Migrations**: `npm run db:generate` (outputs SQL migrations to `./drizzle`)
- **Run Migrations**: `npm run db:migrate` (applies `./drizzle` migrations via Neon HTTP)
- **Direct Schema Push**: `npm run db:push` (direct prototyping sync)
- **Seed Presets**: `npm run db:seed` (inserts the 3 context profiles: `everyday`, `responder`, `focus`)

### Tables & Enums
- **users**: Accounts, authentication credentials (`password_hash`), display names, and subscription plan (`free`, `pro`, `teams`).
- **profiles**: 1:1 user profile with sensory weights (`audio`, `haptic`, `text`), alert sensitivity (0–100), quiet hours, and active preset.
- **cues**: Awareness history events with types, output channels, severity (`info`, `warning`, `critical`), debugging scene context (`jsonb`), and user response latency.
- **devices**: Registered hardware peripherals (earbuds, smartwatch, phone) and assigned channels.
- **context_profiles**: Seeded system sensory presets (`everyday`, `responder`, `focus`).

## Endpoints
- `GET /api/v1/health` → `{ ok: true, data: { status: "healthy", timestamp, version } }`
- `POST /api/v1/cues` → create a cue for the authenticated user.
- `GET /api/v1/cues` → list the authenticated user's cues with filters and pagination.
- `GET /api/v1/cues/:id` → fetch one of the authenticated user's cues.
- `PATCH /api/v1/cues/:id/respond` → record whether the user responded and optional response latency for personalization.
- `DELETE /api/v1/cues/:id` → permanently delete one of the authenticated user's cues. Cue deletion is hard deletion for this MVP; the endpoint does not retain a soft-deleted history record.

All cue endpoints require a valid JWT. Cue reads, updates, and deletes are scoped to the JWT subject; inaccessible cue IDs return `403`.

## Frontend RPC Integration
In your frontend:
```ts
import { hc } from 'hono/client';
import type { AppType } from '../../backend/src/index.js';

export const client = hc<AppType>('http://localhost:8787');

// Fully typed call:
const res = await client.api.v1.health.$get();
const data = await res.json();
```
