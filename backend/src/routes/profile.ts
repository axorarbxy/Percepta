import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { createDbClient } from '../db/client.js';
import { contextProfiles, profiles } from '../db/schema.js';
import { AppError } from '../lib/errors.js';
import {
  applyPresetSchema,
  policyWeightsSchema,
  profilePatchSchema,
  type ProfilePatchInput,
} from '../lib/schemas/profile.js';
import { requireAuth } from '../middleware/auth.js';
import type { AppEnv } from '../types.js';

type UserProfile = typeof profiles.$inferSelect;

function dominantChannel(profile: UserProfile): 'audio' | 'haptic' | 'text' {
  const weights = [
    { channel: 'audio' as const, weight: profile.policyAudioWeight },
    { channel: 'haptic' as const, weight: profile.policyHapticWeight },
    { channel: 'text' as const, weight: profile.policyTextWeight },
  ];

  return weights.reduce((dominant, current) =>
    current.weight > dominant.weight ? current : dominant
  ).channel;
}

function serializeProfile(profile: UserProfile) {
  return {
    ...profile,
    dominant_channel: dominantChannel(profile),
  };
}

async function getOrCreateProfile(
  db: ReturnType<typeof createDbClient>,
  userId: string
): Promise<UserProfile> {
  await db.insert(profiles).values({ userId }).onConflictDoNothing({ target: profiles.userId });

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (!profile) {
    throw new AppError('NOT_FOUND', 'User profile not found', 404);
  }

  return profile;
}

function profileUpdateValues(input: ProfilePatchInput) {
  return {
    ...(input.policy_audio_weight !== undefined && {
      policyAudioWeight: input.policy_audio_weight,
    }),
    ...(input.policy_haptic_weight !== undefined && {
      policyHapticWeight: input.policy_haptic_weight,
    }),
    ...(input.policy_text_weight !== undefined && {
      policyTextWeight: input.policy_text_weight,
    }),
    ...(input.alert_sensitivity !== undefined && {
      alertSensitivity: input.alert_sensitivity,
    }),
    ...(input.quiet_hours_start !== undefined && {
      quietHoursStart: input.quiet_hours_start,
    }),
    ...(input.quiet_hours_end !== undefined && {
      quietHoursEnd: input.quiet_hours_end,
    }),
    ...(input.active_context_profile !== undefined && {
      activeContextProfile: input.active_context_profile,
    }),
  };
}

export const profileRoute = new Hono<AppEnv>()
  .use('*', requireAuth())
  .get('/presets', async (c) => {
    const db = createDbClient(c.get('env').DATABASE_URL);
    const data = await db.select().from(contextProfiles);

    return c.json({ ok: true as const, data });
  })
  .get('/', async (c) => {
    const userId = c.get('jwtPayload').sub;
    const db = createDbClient(c.get('env').DATABASE_URL);
    const profile = await getOrCreateProfile(db, userId);

    return c.json({ ok: true as const, data: serializeProfile(profile) });
  })
  .patch(
    '/',
    zValidator('json', profilePatchSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid profile input',
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
      const currentProfile = await getOrCreateProfile(db, userId);
      const containsWeight = [
        input.policy_audio_weight,
        input.policy_haptic_weight,
        input.policy_text_weight,
      ].some((weight) => weight !== undefined);

      if (containsWeight) {
        const weightsResult = policyWeightsSchema.safeParse({
          policy_audio_weight:
            input.policy_audio_weight ?? currentProfile.policyAudioWeight,
          policy_haptic_weight:
            input.policy_haptic_weight ?? currentProfile.policyHapticWeight,
          policy_text_weight: input.policy_text_weight ?? currentProfile.policyTextWeight,
        });

        if (!weightsResult.success) {
          return c.json(
            {
              ok: false as const,
              error: {
                code: 'VALIDATION_ERROR' as const,
                message: 'Policy weights must sum to 1.0',
                details: weightsResult.error.flatten(),
              },
            },
            400
          );
        }
      }

      const [updatedProfile] = await db
        .update(profiles)
        .set({ ...profileUpdateValues(input), updatedAt: new Date() })
        .where(eq(profiles.userId, userId))
        .returning();

      if (!updatedProfile) {
        throw new AppError('NOT_FOUND', 'User profile not found', 404);
      }

      return c.json({ ok: true as const, data: serializeProfile(updatedProfile) });
    }
  )
  .post(
    '/apply-preset',
    zValidator('json', applyPresetSchema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false as const,
            error: {
              code: 'VALIDATION_ERROR' as const,
              message: 'Invalid profile preset',
              details: result.error.flatten(),
            },
          },
          400
        );
      }
    }),
    async (c) => {
      const { preset } = c.req.valid('json');
      const userId = c.get('jwtPayload').sub;
      const db = createDbClient(c.get('env').DATABASE_URL);
      const [presetProfile] = await db
        .select()
        .from(contextProfiles)
        .where(eq(contextProfiles.name, preset))
        .limit(1);

      if (!presetProfile) {
        throw new AppError('NOT_FOUND', 'Profile preset not found', 404);
      }

      await getOrCreateProfile(db, userId);
      const [updatedProfile] = await db
        .update(profiles)
        .set({
          policyAudioWeight: presetProfile.audioWeight,
          policyHapticWeight: presetProfile.hapticWeight,
          policyTextWeight: presetProfile.textWeight,
          alertSensitivity: presetProfile.sensitivity,
          activeContextProfile: preset,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userId))
        .returning();

      if (!updatedProfile) {
        throw new AppError('NOT_FOUND', 'User profile not found', 404);
      }

      return c.json({ ok: true as const, data: serializeProfile(updatedProfile) });
    }
  )
  .post('/reset-policy', async (c) => {
    const userId = c.get('jwtPayload').sub;
    const db = createDbClient(c.get('env').DATABASE_URL);
    await getOrCreateProfile(db, userId);

    const [updatedProfile] = await db
      .update(profiles)
      .set({
        policyAudioWeight: 0.33,
        policyHapticWeight: 0.33,
        policyTextWeight: 0.34,
        alertSensitivity: 50,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();

    if (!updatedProfile) {
      throw new AppError('NOT_FOUND', 'User profile not found', 404);
    }

    return c.json({ ok: true as const, data: serializeProfile(updatedProfile) });
  });
