import { neon } from '@neondatabase/serverless';
import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema.js';

export type Database = NeonHttpDatabase<typeof schema>;

let cachedDb: Database | null = null;

/**
 * Creates a Drizzle ORM client connected to Neon PostgreSQL.
 * Uses HTTP query execution via @neondatabase/serverless, ensuring full
 * compatibility across Cloudflare Workers (edge) and Node.js 22+.
 */
export function createDbClient(databaseUrl: string): Database {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to initialize Drizzle database client');
  }

  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

/**
 * Returns a cached singleton database client, or instantiates one from
 * the supplied URL or process.env.DATABASE_URL.
 */
export function getDb(databaseUrl?: string): Database {
  if (cachedDb && !databaseUrl) {
    return cachedDb;
  }

  const url = databaseUrl || (typeof process !== 'undefined' ? process.env.DATABASE_URL : undefined);
  if (!url) {
    throw new Error('DATABASE_URL must be provided to initialize database client');
  }

  cachedDb = createDbClient(url);
  return cachedDb;
}
