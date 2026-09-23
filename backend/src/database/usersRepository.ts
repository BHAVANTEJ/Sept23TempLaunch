import { pool } from './pool.js';

export interface NewUser {
  firstName: string;
  lastName: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  email: string;
  passwordHash: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  createdAt: string;
}

interface UserRow {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  created_at: string;
}

const POSTGRES_UNIQUE_VIOLATION = '23505';

export class EmailAlreadyRegisteredError extends Error {
  constructor(email: string) {
    super(`Email already registered: ${email}`);
    this.name = 'EmailAlreadyRegisteredError';
  }
}

function toUser(row: UserRow): User {
  return { id: row.id, firstName: row.first_name, lastName: row.last_name, email: row.email, createdAt: row.created_at };
}

export async function createUser(input: NewUser): Promise<User> {
  try {
    const result = await pool.query<UserRow>(
      `INSERT INTO users (first_name, last_name, phone_country_code, phone_number, email, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, first_name, last_name, email, created_at`,
      [input.firstName, input.lastName, input.phoneCountryCode, input.phoneNumber, input.email, input.passwordHash],
    );
    return toUser(result.rows[0]);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === POSTGRES_UNIQUE_VIOLATION) {
      throw new EmailAlreadyRegisteredError(input.email);
    }
    throw error;
  }
}
