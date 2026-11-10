import { migrate } from 'drizzle-orm/neon-http/migrator';
import { createDbClient } from './client.js';
import { validateEnv } from '../lib/env.js';

if (typeof process !== 'undefined' && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.dev.vars');
  } catch {
    try {
      process.loadEnvFile('.env');
    } catch {}
  }
}

const env = validateEnv(process.env);
const db = createDbClient(env.DATABASE_URL);

async function runMigrations() {
  console.log('🚀 Running database migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('✅ Database migrations applied successfully.');
}

runMigrations().catch((err) => {
  console.error('❌ Migration error:', err);
  process.exit(1);
});
