import { Hono } from 'hono';

/**
 * Health check endpoint route definition.
 * Response matches standard envelope:
 * { ok: true, data: { status: "healthy", timestamp: string, version: string } }
 */
export const healthRoute = new Hono().get('/health', (c) => {
  return c.json({
    ok: true as const,
    data: {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  });
});
