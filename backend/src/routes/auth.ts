import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { createDbClient } from '../db/client.js';
import { profiles, users } from '../db/schema.js';
import { hashPassword, verifyPassword } from '../lib/crypto.js';
import { AppError } from '../lib/errors.js';
import { loginSchema, registerSchema } from '../lib/schemas/auth.js';
import { requireAuth } from '../middleware/auth.js';
import type { AppEnv, PerceptaJwtPayload } from '../types.js';

// In-memory rate limiting stub for login attempts
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkLoginRateLimit(ipOrEmail: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ipOrEmail);

  if (record && record.resetAt > now) {
    if (record.count >= 5) {
      throw new AppError(
        'RATE_LIMITED',
        'Too many failed login attempts. Please try again in 5 minutes.',
        429
      );
    }
  } else {
    loginAttempts.set(ipOrEmail, { count: 0, resetAt: now + 5 * 60 * 1000 });
  }
}

function recordFailedLogin(ipOrEmail: string): void {
  const record = loginAttempts.get(ipOrEmail);
  if (record) {
    record.count += 1;
  }
}

function clearLoginAttempts(ipOrEmail: string): void {
  loginAttempts.delete(ipOrEmail);
}

/**
 * Auth Router for Percepta Backend
 * - POST /register
 * - POST /login
 * - GET  /me
 */
export const authRoute = new Hono<AppEnv>()
  // 1. POST /register
  .post(
    '/register',
    zValidator('json', registerSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid registration input',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { email, password, display_name } = c.req.valid('json');
      const env = c.get('env') || (c.env as any);
      const db = createDbClient(env.DATABASE_URL);

      const normalizedEmail = email.toLowerCase().trim();

      // Check if email is already registered
      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (existing.length > 0) {
        throw new AppError(
          'VALIDATION_ERROR',
          'An account with this email address already exists',
          409
        );
      }

      // Hash password using PBKDF2 (100,000 iterations, Web Crypto)
      const passwordHash = await hashPassword(password);

      // Insert new user
      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash,
          displayName: display_name?.trim() || null,
          plan: 'free',
        })
        .returning({
          id: users.id,
          email: users.email,
          displayName: users.displayName,
          plan: users.plan,
        });

      // Insert default 1:1 sensory profile
      await db.insert(profiles).values({
        userId: newUser.id,
        policyAudioWeight: 0.33,
        policyHapticWeight: 0.33,
        policyTextWeight: 0.34,
        alertSensitivity: 50,
        activeContextProfile: 'everyday',
      });

      // Issue JWT token (7-day validity)
      const now = Math.floor(Date.now() / 1000);
      const exp = now + 7 * 24 * 60 * 60;

      const token = await sign(
        {
          sub: newUser.id,
          email: newUser.email,
          plan: newUser.plan,
          iat: now,
          exp,
        },
        env.JWT_SECRET,
        'HS256'
      );

      return c.json(
        {
          ok: true as const,
          data: {
            token,
            user: {
              id: newUser.id,
              email: newUser.email,
              display_name: newUser.displayName,
              plan: newUser.plan,
            },
          },
        },
        201
      );
    }
  )

  // 2. POST /login
  .post(
    '/login',
    zValidator('json', loginSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid login input',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { email, password } = c.req.valid('json');
      const env = c.get('env') || (c.env as any);
      const db = createDbClient(env.DATABASE_URL);

      const normalizedEmail = email.toLowerCase().trim();

      // Check rate limit status
      checkLoginRateLimit(normalizedEmail);

      // Fetch user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, normalizedEmail))
        .limit(1);

      if (!user) {
        recordFailedLogin(normalizedEmail);
        throw new AppError('AUTH_REQUIRED', 'Invalid email or password', 401);
      }

      // Constant-time hash verification
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        recordFailedLogin(normalizedEmail);
        throw new AppError('AUTH_REQUIRED', 'Invalid email or password', 401);
      }

      clearLoginAttempts(normalizedEmail);

      // Sign JWT with 7-day expiration
      const now = Math.floor(Date.now() / 1000);
      const exp = now + 7 * 24 * 60 * 60;

      const token = await sign(
        {
          sub: user.id,
          email: user.email,
          plan: user.plan,
          iat: now,
          exp,
        },
        env.JWT_SECRET,
        'HS256'
      );

      return c.json({
        ok: true as const,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            display_name: user.displayName,
            plan: user.plan,
          },
        },
      });
    }
  )

  // 3. GET /me (protected)
  .get('/me', requireAuth(), async (c) => {
    const payload = c.get('jwtPayload') as PerceptaJwtPayload;
    const env = c.get('env') || (c.env as any);
    const db = createDbClient(env.DATABASE_URL);

    // Fetch user without leaking passwordHash
    const [userRecord] = await db
      .select({
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        plan: users.plan,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, payload.sub))
      .limit(1);

    if (!userRecord) {
      throw new AppError('NOT_FOUND', 'User account not found', 404);
    }

    // Fetch user sensory profile
    const [profileRecord] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userRecord.id))
      .limit(1);

    return c.json({
      ok: true as const,
      data: {
        user: {
          id: userRecord.id,
          email: userRecord.email,
          display_name: userRecord.displayName,
          plan: userRecord.plan,
          created_at: userRecord.createdAt,
          updated_at: userRecord.updatedAt,
        },
        profile: profileRecord || null,
      },
    });
  });
