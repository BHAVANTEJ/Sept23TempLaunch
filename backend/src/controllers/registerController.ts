import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { pool } from '../database/pool.js';
import { upsertPendingRegistration } from '../database/pendingRegistrationsRepository.js';
import { sendOtpEmail } from '../mail/mailer.js';
import type { ErrorResponse, OtpRequestedResponse, RegisterRequest } from '../types/api.js';
import { generateOtp, OTP_TTL_MS } from '../utils/otp.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SALT_ROUNDS = 10;

/** Step 1 of registration: validate the form, stash it (with a fresh OTP) and email the code. */
export async function registerController(request: Request<unknown, unknown, RegisterRequest>, response: Response<OtpRequestedResponse | ErrorResponse>): Promise<void> {
  const firstName = request.body.firstName?.trim();
  const lastName = request.body.lastName?.trim() || null;
  const phoneCountryCode = request.body.phoneCountryCode?.trim() || null;
  const phoneNumber = request.body.phoneNumber?.trim() || null;
  const email = request.body.email?.trim().toLowerCase();
  const password = request.body.password;

  if (!firstName) {
    response.status(400).json({ status: 'error', message: 'First name is required.' });
    return;
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    response.status(400).json({ status: 'error', message: 'A valid email is required.' });
    return;
  }
  if (!password || password.length < 8) {
    response.status(400).json({ status: 'error', message: 'Password must be at least 8 characters.' });
    return;
  }

  try {
    const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      response.status(409).json({ status: 'error', message: 'An account with this email already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const otpCode = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_TTL_MS);

    await upsertPendingRegistration({ email, firstName, lastName, phoneCountryCode, phoneNumber, passwordHash, otpCode, otpExpiresAt });

    // The verification code is required to complete registration, so unlike the final
    // confirmation email, we await this send and surface a failure instead of hiding it.
    await sendOtpEmail(firstName, email, otpCode);

    response.status(200).json({ status: 'otp_sent', message: `We've sent a verification code to ${email}.`, email });
  } catch (error) {
    console.error('Failed to start registration:', error);
    response.status(500).json({ status: 'error', message: 'Could not send a verification code. Please try again.' });
  }
}
