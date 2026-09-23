import { pool } from './pool.js';

export interface WaitlistMember {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
}

interface WaitlistMemberRow {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
}

function toWaitlistMember(row: WaitlistMemberRow): WaitlistMember {
  return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at };
}

/** Inserts a waitlist member, or returns the existing row if the email already signed up. */
export async function addWaitlistMember(name: string | null, email: string): Promise<{ member: WaitlistMember; alreadyRegistered: boolean }> {
  const inserted = await pool.query<WaitlistMemberRow>(
    'INSERT INTO waitlist_members (name, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id, name, email, created_at',
    [name, email],
  );

  if (inserted.rows[0]) {
    return { member: toWaitlistMember(inserted.rows[0]), alreadyRegistered: false };
  }

  const existing = await pool.query<WaitlistMemberRow>('SELECT id, name, email, created_at FROM waitlist_members WHERE email = $1', [email]);
  return { member: toWaitlistMember(existing.rows[0]), alreadyRegistered: true };
}
