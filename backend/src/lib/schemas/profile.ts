import { z } from 'zod';

export const contextPresetSchema = z.enum(['everyday', 'responder', 'focus']);

export const policyWeightsSchema = z
  .object({
    policy_audio_weight: z.number().min(0).max(1),
    policy_haptic_weight: z.number().min(0).max(1),
    policy_text_weight: z.number().min(0).max(1),
  })
  .refine(
    (weights) =>
      Math.abs(
        weights.policy_audio_weight +
          weights.policy_haptic_weight +
          weights.policy_text_weight -
          1
      ) <= 0.01,
    {
      message: 'Policy weights must sum to 1.0',
    }
  );

export const profilePatchSchema = z.object({
  policy_audio_weight: z.number().min(0).max(1).optional(),
  policy_haptic_weight: z.number().min(0).max(1).optional(),
  policy_text_weight: z.number().min(0).max(1).optional(),
  alert_sensitivity: z.number().int().min(0).max(100).optional(),
  quiet_hours_start: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  quiet_hours_end: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  active_context_profile: contextPresetSchema.optional(),
});

export const applyPresetSchema = z.object({
  preset: contextPresetSchema,
});

export type ProfilePatchInput = z.infer<typeof profilePatchSchema>;
export type PolicyWeights = z.infer<typeof policyWeightsSchema>;
