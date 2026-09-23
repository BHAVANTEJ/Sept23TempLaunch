import { Pool } from 'pg';

console.log(
  '[DB] DATABASE_URL:',
  process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});