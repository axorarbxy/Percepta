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

## Endpoints
- `GET /api/v1/health` → `{ ok: true, data: { status: "healthy", timestamp, version } }`

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
