import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const MIGRATIONS = [
  '001_create_waitlist_members.sql',
  '002_create_users.sql',
  '003_create_pending_registrations.sql',
  '004_make_waitlist_name_optional.sql',
];

export async function initDatabase(): Promise<void> {
  for (const file of MIGRATIONS) {
    const migrationPath = fileURLToPath(new URL(`./migrations/${file}`, import.meta.url));
    const migration = await readFile(migrationPath, 'utf8');
    await pool.query(migration);
  }
}
