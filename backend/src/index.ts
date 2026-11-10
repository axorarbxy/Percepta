import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validateEnv, type Env } from './lib/env.js';
import { errorHandler } from './middleware/error-handler.js';
import { logger } from './middleware/logger.js';
import { healthRoute } from './routes/health.js';
import type { AppEnv } from './types.js';

// Attempt initial cold-start environment validation if process.env is populated
if (typeof process !== 'undefined' && process.env && Object.keys(process.env).length > 0) {
  try {
    validateEnv(process.env);
  } catch {
    // In edge runtime or Cloudflare workers, bindings are delivered in c.env per request
  }
}

// Initialize the root Hono application
const app = new Hono<AppEnv>();

// 1. Logger middleware (records method, path, status, duration)
app.use('*', logger());

// 2. Environment validation & attachment middleware
app.use('*', async (c, next) => {
  const env = validateEnv(c.env);
  c.set('env', env);
  await next();
});

// 3. CORS middleware (configured per Percepta rules)
app.use('*', async (c, next) => {
  const env = c.get('env') || (c.env as Env);
  const allowedFrontend = env?.FRONTEND_URL || 'http://localhost:3000';

  const corsHandler = cors({
    origin: (origin) => {
      if (!origin) return allowedFrontend;
      if (
        origin === allowedFrontend ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return origin;
      }
      return allowedFrontend;
    },
    credentials: true,
    allowHeaders: ['Authorization', 'Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  });

  return corsHandler(c, next);
});

// 4. Global not-found handler
app.notFound((c) =>
  c.json(
    {
      ok: false as const,
      error: {
        code: 'NOT_FOUND' as const,
        message: 'Route not found',
      },
    },
    404
  )
);

// 5. Global error handler (Hono v5 pattern: accesses error via c.error)
app.onError((c) => errorHandler(c));

// 6. Chained route definitions for RPC AppType inference
// Base path /api/v1
const routes = app.route('/api/v1', healthRoute);

// Export RPC AppType for frontend type-safe client consumption
export type AppType = typeof routes;

// Export default application for Cloudflare Workers / Node runtime adapters
export default app;
