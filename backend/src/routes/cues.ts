import { zValidator } from '@hono/zod-validator';
import { and, count, desc, eq, gte, lte } from 'drizzle-orm';
import { Hono } from 'hono';
import { createDbClient } from '../db/client.js';
import { cues } from '../db/schema.js';
import { AppError } from '../lib/errors.js';
import {
  createCueSchema,
  cueIdParamsSchema,
  listCuesQuerySchema,
  respondToCueSchema,
} from '../lib/schemas/cue.js';
import { requireAuth } from '../middleware/auth.js';
import type { AppEnv } from '../types.js';

export const cuesRoute = new Hono<AppEnv>()
  .use('*', requireAuth())
  .post(
    '/',
    zValidator('json', createCueSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid cue input',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const input = c.req.valid('json');
      const userId = c.get('jwtPayload').sub;
      const db = createDbClient(c.get('env').DATABASE_URL);

      const [createdCue] = await db
        .insert(cues)
        .values({
          userId,
          cueType: input.cue_type,
          channel: input.channel,
          severity: input.severity,
          title: input.title,
          ...(input.body !== undefined && { body: input.body }),
          ...(input.scene_context !== undefined && { sceneContext: input.scene_context }),
        })
        .returning();

      return c.json({ ok: true as const, data: createdCue }, 201);
    }
  )
  .get(
    '/',
    zValidator('query', listCuesQuerySchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid cue query',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { page, limit, cue_type, severity, from, to } = c.req.valid('query');
      const userId = c.get('jwtPayload').sub;
      const db = createDbClient(c.get('env').DATABASE_URL);

      const filters = [eq(cues.userId, userId)];
      if (cue_type) filters.push(eq(cues.cueType, cue_type));
      if (severity) filters.push(eq(cues.severity, severity));
      if (from) filters.push(gte(cues.createdAt, new Date(from)));
      if (to) filters.push(lte(cues.createdAt, new Date(to)));

      const where = and(...filters);
      const [countResult] = await db
        .select({ total: count() })
        .from(cues)
        .where(where);
      const data = await db
        .select()
        .from(cues)
        .where(where)
        .orderBy(desc(cues.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);

      return c.json({
        ok: true as const,
        data,
        meta: { page, limit, total: countResult.total },
      });
    }
  )
  .get(
    '/:id',
    zValidator('param', cueIdParamsSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid cue ID',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      const userId = c.get('jwtPayload').sub;
      const db = createDbClient(c.get('env').DATABASE_URL);
      const [cue] = await db
        .select()
        .from(cues)
        .where(and(eq(cues.id, id), eq(cues.userId, userId)))
        .limit(1);

      if (!cue) {
        throw new AppError('FORBIDDEN', 'Cue not found or access denied', 403);
      }

      return c.json({ ok: true as const, data: cue });
    }
  )
  .patch(
    '/:id/respond',
    zValidator('param', cueIdParamsSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid cue ID',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    zValidator('json', respondToCueSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid cue response',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      const { responded, latency_ms } = c.req.valid('json');
      const userId = c.get('jwtPayload').sub;
      const db = createDbClient(c.get('env').DATABASE_URL);
      const [updatedCue] = await db
        .update(cues)
        .set({
          userResponded: responded,
          responseLatencyMs: latency_ms ?? null,
        })
        .where(and(eq(cues.id, id), eq(cues.userId, userId)))
        .returning();

      if (!updatedCue) {
        throw new AppError('FORBIDDEN', 'Cue not found or access denied', 403);
      }

      return c.json({ ok: true as const, data: updatedCue });
    }
  )
  .delete(
    '/:id',
    zValidator('param', cueIdParamsSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid cue ID',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { id } = c.req.valid('param');
      const userId = c.get('jwtPayload').sub;
      const db = createDbClient(c.get('env').DATABASE_URL);
      const [deletedCue] = await db
        .delete(cues)
        .where(and(eq(cues.id, id), eq(cues.userId, userId)))
        .returning();

      if (!deletedCue) {
        throw new AppError('FORBIDDEN', 'Cue not found or access denied', 403);
      }

      return c.json({ ok: true as const, data: deletedCue });
    }
  );
