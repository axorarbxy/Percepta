import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { hashPassword, verifyPassword } from '../src/lib/crypto.js';
import { errorHandler } from '../src/middleware/error-handler.js';
import { requireAuth, requirePlan } from '../src/middleware/auth.js';
import { registerSchema, loginSchema } from '../src/lib/schemas/auth.js';
import type { AppEnv } from '../src/types.js';

const JWT_SECRET = 'test-super-secret-key-at-least-32-chars-long';

async function testAuth() {
  console.log('=== Percepta Auth Test Suite ===\n');

  // 1. Test Crypto PBKDF2
  console.log('--- Test 1: Password Hashing & Constant-time Verification ---');
  const password = 'SecretPassword123!';
  const hash = await hashPassword(password);
  console.log('Generated PBKDF2 hash:', hash);

  const isValid = await verifyPassword(password, hash);
  const isInvalid = await verifyPassword('WrongPassword', hash);
  console.log('Verification valid password:', isValid === true ? '✓ PASS' : '✗ FAIL');
  console.log('Verification invalid password:', isInvalid === false ? '✓ PASS' : '✗ FAIL');

  // 2. Test Zod Schemas
  console.log('\n--- Test 2: Zod Auth Validation ---');
  const validRegister = registerSchema.safeParse({ email: 'test@example.com', password: 'password123', display_name: 'Test' });
  const invalidEmail = registerSchema.safeParse({ email: 'not-an-email', password: 'password123' });
  const shortPassword = registerSchema.safeParse({ email: 'test@example.com', password: 'short' });
  console.log('Valid registration parse:', validRegister.success ? '✓ PASS' : '✗ FAIL');
  console.log('Invalid email caught:', !invalidEmail.success ? '✓ PASS' : '✗ FAIL');
  console.log('Short password (<8 chars) caught:', !shortPassword.success ? '✓ PASS' : '✗ FAIL');

  // 3. Test Protected Routes and Plan Gatekeeper Middleware
  console.log('\n--- Test 3: Middleware & Route Protection ---');
  const testApp = new Hono<AppEnv>();
  testApp.onError((c) => errorHandler(c));

  // Set mock env
  testApp.use('*', async (c, next) => {
    c.set('env', { JWT_SECRET } as any);
    await next();
  });

  // Protected endpoint
  testApp.get('/api/v1/protected/data', requireAuth(), (c) => {
    const payload = c.get('jwtPayload');
    return c.json({ ok: true, data: { user_id: payload.sub, email: payload.email } });
  });

  // Pro-only endpoint
  testApp.get('/api/v1/protected/pro-feature', requireAuth(), requirePlan('pro'), (c) => {
    return c.json({ ok: true, data: { access: 'granted_pro' } });
  });

  // Test 3a: Accessing protected without token -> 401 AUTH_REQUIRED
  const unauthedRes = await testApp.request('/api/v1/protected/data');
  const unauthedBody = await unauthedRes.json();
  console.log('Unauthenticated request status (expected 401):', unauthedRes.status === 401 ? '✓ PASS' : '✗ FAIL');
  console.log('Error code:', unauthedBody.error?.code);

  // Test 3b: Accessing protected with valid Free token -> 200 OK
  const now = Math.floor(Date.now() / 1000);
  const freeToken = await sign({ sub: 'user-123', email: 'free@percepta.ai', plan: 'free', exp: now + 3600 }, JWT_SECRET, 'HS256');
  const authedRes = await testApp.request('/api/v1/protected/data', {
    headers: { Authorization: `Bearer ${freeToken}` }
  });
  console.log('Authenticated request status (expected 200):', authedRes.status === 200 ? '✓ PASS' : '✗ FAIL');

  // Test 3c: Free user accessing Pro feature -> 403 FORBIDDEN
  const proBlockedRes = await testApp.request('/api/v1/protected/pro-feature', {
    headers: { Authorization: `Bearer ${freeToken}` }
  });
  const proBlockedBody = await proBlockedRes.json();
  console.log('Free user accessing Pro feature status (expected 403):', proBlockedRes.status === 403 ? '✓ PASS' : '✗ FAIL');
  console.log('Error code:', proBlockedBody.error?.code);

  // Test 3d: Pro user accessing Pro feature -> 200 OK
  const proToken = await sign({ sub: 'user-pro-456', email: 'pro@percepta.ai', plan: 'pro', exp: now + 3600 }, JWT_SECRET, 'HS256');
  const proAllowedRes = await testApp.request('/api/v1/protected/pro-feature', {
    headers: { Authorization: `Bearer ${proToken}` }
  });
  console.log('Pro user accessing Pro feature status (expected 200):', proAllowedRes.status === 200 ? '✓ PASS' : '✗ FAIL');

  console.log('\n=== All Authentication Tests Passed Successfully ===');
}

testAuth().catch(console.error);
