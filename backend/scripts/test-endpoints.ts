import app from '../src/index.js';
import { validateEnv } from '../src/lib/env.js';
import { AppError } from '../src/lib/errors.js';
import { HTTPException } from 'hono/http-exception';

// Preload env
validateEnv(process.env);

// Dynamically add test routes to test error mappings
app.get('/api/v1/test-app-error', () => {
  throw new AppError('AUTH_REQUIRED', 'Authentication is required', 401, { reason: 'Missing token' });
});

app.get('/api/v1/test-http-exception', () => {
  throw new HTTPException(403, { message: 'Access denied to this resource' });
});

app.get('/api/v1/test-internal-error', () => {
  throw new Error('Database connection crashed unexpectedly');
});

async function runTests() {
  console.log('--- Testing 1: GET /api/v1/health ---');
  const res1 = await app.request('/api/v1/health');
  console.log('Status:', res1.status);
  console.log('CORS Headers:', res1.headers.get('access-control-allow-origin'));
  const body1 = await res1.json();
  console.log('Body:', JSON.stringify(body1, null, 2));

  console.log('\n--- Testing 2: 404 Route /api/v1/not-found-path ---');
  const res2 = await app.request('/api/v1/not-found-path');
  console.log('Status:', res2.status);
  const body2 = await res2.json();
  console.log('Body:', JSON.stringify(body2, null, 2));

  console.log('\n--- Testing 3: AppError mapping (AUTH_REQUIRED) ---');
  const res3 = await app.request('/api/v1/test-app-error');
  console.log('Status:', res3.status);
  const body3 = await res3.json();
  console.log('Body:', JSON.stringify(body3, null, 2));

  console.log('\n--- Testing 4: HTTPException mapping (403 -> FORBIDDEN) ---');
  const res4 = await app.request('/api/v1/test-http-exception');
  console.log('Status:', res4.status);
  const body4 = await res4.json();
  console.log('Body:', JSON.stringify(body4, null, 2));

  console.log('\n--- Testing 5: Unhandled Internal Error (500 -> INTERNAL without leaking details) ---');
  const res5 = await app.request('/api/v1/test-internal-error');
  console.log('Status:', res5.status);
  const body5 = await res5.json();
  console.log('Body:', JSON.stringify(body5, null, 2));

  console.log('\n--- Testing Completed Successfully ---');
}

runTests().catch(console.error);

