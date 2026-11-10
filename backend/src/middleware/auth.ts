import type { MiddlewareHandler } from 'hono';
import { jwt } from 'hono/jwt';
import { AppError } from '../lib/errors.js';
import type { AppEnv, PerceptaJwtPayload } from '../types.js';

const PLAN_HIERARCHY: Record<string, number> = {
  free: 0,
  pro: 1,
  teams: 2,
};

/**
 * Base JWT verification middleware wrapping Hono's jwt helper with runtime secret extraction.
 */
export const jwtAuth = (): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    const env = c.get('env') || (c.env as any);
    const secret = env?.JWT_SECRET || process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('INTERNAL', 'JWT_SECRET is not configured', 500);
    }

    const jwtMiddleware = jwt({ secret, alg: 'HS256' });
    try {
      return await jwtMiddleware(c, next);
    } catch {
      throw new AppError('AUTH_REQUIRED', 'Valid authentication token required', 401);
    }
  };
};

/**
 * Ensures a valid JWT payload is present in context.
 * Returns 401 AUTH_REQUIRED if token is missing or invalid.
 */
export const requireAuth = (): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    let payload = c.get('jwtPayload') as PerceptaJwtPayload | undefined;

    if (!payload) {
      const env = c.get('env') || (c.env as any);
      const secret = env?.JWT_SECRET || process.env.JWT_SECRET;
      if (!secret) {
        throw new AppError('INTERNAL', 'JWT_SECRET is not configured', 500);
      }

      try {
        await jwt({ secret, alg: 'HS256' })(c, async () => {});
        payload = c.get('jwtPayload') as PerceptaJwtPayload | undefined;
      } catch {
        throw new AppError('AUTH_REQUIRED', 'Valid authentication token required', 401);
      }
    }

    if (!payload || !payload.sub) {
      throw new AppError('AUTH_REQUIRED', 'Authentication required', 401);
    }

    await next();
  };
};

/**
 * Enforces minimum subscription plan requirements ('pro' | 'teams').
 * Returns 403 FORBIDDEN if the user's plan is insufficient.
 */
export const requirePlan = (
  requiredPlan: 'pro' | 'teams'
): MiddlewareHandler<AppEnv> => {
  return async (c, next) => {
    const payload = c.get('jwtPayload') as PerceptaJwtPayload | undefined;
    if (!payload || !payload.sub) {
      throw new AppError('AUTH_REQUIRED', 'Authentication required', 401);
    }

    const currentLevel = PLAN_HIERARCHY[payload.plan] ?? 0;
    const requiredLevel = PLAN_HIERARCHY[requiredPlan] ?? 1;

    if (currentLevel < requiredLevel) {
      throw new AppError(
        'FORBIDDEN',
        `Access requires a ${requiredPlan.toUpperCase()} subscription or higher`,
        403,
        {
          current_plan: payload.plan,
          required_plan: requiredPlan,
        }
      );
    }

    await next();
  };
};
