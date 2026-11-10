import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

/**
 * Factory to create a Drizzle ORM client connected to Neon serverless PostgreSQL.
 * Shell factory ready for schema migrations and queries.
 */
export function createDbClient(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to initialize Drizzle database client');
  }
  const sql = neon(databaseUrl);
  return drizzle({ client: sql, schema });
}

export type DatabaseClient = ReturnType<typeof createDbClient>;
