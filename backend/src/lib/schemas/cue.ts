import { z } from 'zod';

export const cueTypeSchema = z.enum([
  'obstacle',
  'person',
  'sound',
  'text',
  'navigation',
  'custom',
]);

export const cueSeveritySchema = z.enum(['info', 'warning', 'critical']);

export const createCueSchema = z.object({
  cue_type: cueTypeSchema,
  channel: z.enum(['audio', 'haptic', 'text', 'voice']),
  severity: cueSeveritySchema.default('info'),
  title: z.string().min(1).max(200),
  body: z.string().max(1000).optional(),
  scene_context: z.record(z.unknown()).optional(),
});

export const listCuesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cue_type: cueTypeSchema.optional(),
  severity: cueSeveritySchema.optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
});

export const cueIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const respondToCueSchema = z.object({
  responded: z.boolean(),
  latency_ms: z.number().int().min(0).optional(),
});

export type CreateCueInput = z.infer<typeof createCueSchema>;
export type ListCuesQuery = z.infer<typeof listCuesQuerySchema>;
export type RespondToCueInput = z.infer<typeof respondToCueSchema>;
