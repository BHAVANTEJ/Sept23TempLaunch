import type { Request, Response } from 'express';
import { deletePendingRegistration, getPendingRegistration } from '../database/pendingRegistrationsRepository.js';
import { createUser, EmailAlreadyRegisteredError } from '../database/usersRepository.js';
import { sendRegistrationConfirmation } from '../mail/mailer.js';
import type { ErrorResponse, RegisterResponse, VerifyOtpRequest } from '../types/api.js';

/** Step 2 of registration: check the OTP, then commit the previously-validated details to users. */
export async function verifyOtpController(request: Request<unknown, unknown, VerifyOtpRequest>, response: Response<RegisterResponse | ErrorResponse>): Promise<void> {
  const email = request.body.email?.trim().toLowerCase();
  const otp = request.body.otp?.trim();

  if (!email || !otp) {
    response.status(400).json({ status: 'error', message: 'Email and verification code are required.' });
    return;
  }

  try {
    const pending = await getPendingRegistration(email);

    if (!pending) {
      response.status(400).json({ status: 'error', message: 'No pending registration found for this email. Please register again.' });
      return;
    }
    if (pending.otpExpiresAt.getTime() < Date.now()) {
      response.status(400).json({ status: 'error', message: 'This code has expired. Please request a new one.' });
      return;
    }
    if (pending.otpCode !== otp) {
      response.status(400).json({ status: 'error', message: 'Invalid verification code.' });
      return;
    }

    const user = await createUser({
      firstName: pending.firstName,
      lastName: pending.lastName,
      phoneCountryCode: pending.phoneCountryCode,
      phoneNumber: pending.phoneNumber,
      email: pending.email,
      passwordHash: pending.passwordHash,
    });
    await deletePendingRegistration(email);

    // The account is already committed to the database at this point, so we respond
    // with success immediately and let the confirmation email send in the background -
    // a slow or failed email must never block or fail the registration.
    response.status(201).json({
      status: 'registered',
      message: 'Successfully registered!',
      user: { id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
    });

    sendRegistrationConfirmation(user.firstName, user.email);
  } catch (error) {
    if (error instanceof EmailAlreadyRegisteredError) {
      await deletePendingRegistration(email);
      response.status(409).json({ status: 'error', message: 'An account with this email already exists.' });
      return;
    }
    console.error('Failed to verify registration OTP:', error);
    response.status(500).json({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
}
