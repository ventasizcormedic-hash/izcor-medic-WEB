import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import * as schema from './schema.ts';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), '.data', 'pglite_db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const client = new PGlite(dbDir);
export const db = drizzle({ client, schema });

export async function initDatabase() {
  await client.waitReady;
}
