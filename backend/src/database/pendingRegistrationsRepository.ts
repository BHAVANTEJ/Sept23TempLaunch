import { pool } from './pool.js';

export interface PendingRegistrationInput {
  email: string;
  firstName: string;
  lastName: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  passwordHash: string;
  otpCode: string;
  otpExpiresAt: Date;
}

export interface PendingRegistration {
  email: string;
  firstName: string;
  lastName: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  passwordHash: string;
  otpCode: string;
  otpExpiresAt: Date;
}

interface PendingRegistrationRow {
  email: string;
  first_name: string;
  last_name: string | null;
  phone_country_code: string | null;
  phone_number: string | null;
  password_hash: string;
  otp_code: string;
  otp_expires_at: string;
}

function toPendingRegistration(row: PendingRegistrationRow): PendingRegistration {
  return {
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phoneCountryCode: row.phone_country_code,
    phoneNumber: row.phone_number,
    passwordHash: row.password_hash,
    otpCode: row.otp_code,
    otpExpiresAt: new Date(row.otp_expires_at),
  };
}

/** Upserts the pending registration for an email, replacing any previous OTP (e.g. on resend). */
export async function upsertPendingRegistration(input: PendingRegistrationInput): Promise<void> {
  await pool.query(
    `INSERT INTO pending_registrations (email, first_name, last_name, phone_country_code, phone_number, password_hash, otp_code, otp_expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (email) DO UPDATE SET
       first_name = EXCLUDED.first_name,
       last_name = EXCLUDED.last_name,
       phone_country_code = EXCLUDED.phone_country_code,
       phone_number = EXCLUDED.phone_number,
       password_hash = EXCLUDED.password_hash,
       otp_code = EXCLUDED.otp_code,
       otp_expires_at = EXCLUDED.otp_expires_at`,
    [input.email, input.firstName, input.lastName, input.phoneCountryCode, input.phoneNumber, input.passwordHash, input.otpCode, input.otpExpiresAt],
  );
}

export async function getPendingRegistration(email: string): Promise<PendingRegistration | null> {
  const result = await pool.query<PendingRegistrationRow>('SELECT * FROM pending_registrations WHERE email = $1', [email]);
  return result.rows[0] ? toPendingRegistration(result.rows[0]) : null;
}

export async function deletePendingRegistration(email: string): Promise<void> {
  await pool.query('DELETE FROM pending_registrations WHERE email = $1', [email]);
}
