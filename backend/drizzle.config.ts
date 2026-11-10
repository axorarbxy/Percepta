import { defineConfig } from 'drizzle-kit';

// Load local dev secrets if running under Node.js
if (typeof process !== 'undefined' && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.dev.vars');
  } catch {
    try {
      process.loadEnvFile('.env');
    } catch {
      // Env variables already present in environment
    }
  }
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  strict: true,
  verbose: true,
});
