import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL is required (PostgreSQL connection string)',
  }).min(1),
  JWT_SECRET: z.string({
    required_error: 'JWT_SECRET is required for authentication',
  }).min(16, 'JWT_SECRET should be at least 16 characters'),
  OPENAI_API_KEY: z.string({
    required_error: 'OPENAI_API_KEY is required',
  }).min(1),
  GEMINI_API_KEY: z.string({
    required_error: 'GEMINI_API_KEY is required',
  }).min(1),
  PINECONE_API_KEY: z.string({
    required_error: 'PINECONE_API_KEY is required',
  }).min(1),
  PINECONE_INDEX: z.string({
    required_error: 'PINECONE_INDEX is required',
  }).min(1),
  R2_ACCESS_KEY: z.string({
    required_error: 'R2_ACCESS_KEY is required',
  }).min(1),
  R2_SECRET_KEY: z.string({
    required_error: 'R2_SECRET_KEY is required',
  }).min(1),
  FRONTEND_URL: z.string({
    required_error: 'FRONTEND_URL is required for CORS origin validation',
  }).min(1).default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().optional().default('8787'),
});

export type Env = z.infer<typeof envSchema>;

let validatedEnv: Env | null = null;

/**
 * Validates and returns environment variables from Cloudflare Workers (c.env)
 * or Node.js (process.env). Throws a descriptive error if any required variable is missing.
 */
export function validateEnv(runtimeEnv?: unknown): Env {
  const procEnv = typeof process !== 'undefined' ? process.env : {};
  const rawSource =
    runtimeEnv && typeof runtimeEnv === 'object' && Object.keys(runtimeEnv).length > 0
      ? { ...procEnv, ...runtimeEnv }
      : procEnv;

  const result = envSchema.safeParse(rawSource);

  if (!result.success) {
    const errorMessages = result.error.issues
      .map((issue) => `  - [${issue.path.join('.') || 'root'}]: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\n❌ [Percepta Backend Configuration Error]\nFailed to validate environment variables:\n${errorMessages}\n\nPlease check your .dev.vars or environment configuration.\n`
    );
  }

  validatedEnv = result.data;
  return result.data;
}

/**
 * Returns currently cached validated environment variables, or validates from process.env if available.
 */
export function getEnv(): Env {
  if (!validatedEnv) {
    return validateEnv();
  }
  return validatedEnv;
}
