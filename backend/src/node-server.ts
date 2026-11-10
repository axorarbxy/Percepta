import { serve } from '@hono/node-server';
import app from './index.js';
import { validateEnv } from './lib/env.js';

// Validate environment on Node 22+ cold start
const env = validateEnv(process.env);
const port = Number(env.PORT || 8787);

console.log(`🚀 Percepta Backend (Node.js 22+ adapter) starting on http://localhost:${port}`);
console.log(`   API Base: http://localhost:${port}/api/v1`);
console.log(`   Health:   http://localhost:${port}/api/v1/health`);

serve({
  fetch: app.fetch,
  port,
});
