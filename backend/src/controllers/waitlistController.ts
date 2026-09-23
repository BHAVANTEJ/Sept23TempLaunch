import type { Request, Response } from 'express';
import { addWaitlistMember } from '../database/waitlistRepository.js';
import { sendWaitlistConfirmation } from '../mail/mailer.js';
import type { ErrorResponse, WaitlistRequest, WaitlistResponse } from '../types/api.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function waitlistController(request: Request<unknown, unknown, WaitlistRequest>, response: Response<WaitlistResponse | ErrorResponse>): Promise<void> {
  const name = request.body.name?.trim() || null;
  const email = request.body.email?.trim().toLowerCase();

  if (!email || !EMAIL_PATTERN.test(email)) {
    response.status(400).json({ status: 'error', message: 'A valid email is required.' });
    return;
  }

  try {
    const { member, alreadyRegistered } = await addWaitlistMember(name, email);

    // Registration itself is already committed to the database at this point, so we
    // respond with success immediately and let the confirmation email send in the
    // background - a slow or failed email must never block or fail the signup.
    response.status(201).json({ status: 'registered', message: 'Successfully registered!', alreadyRegistered });

    sendWaitlistConfirmation(member.name, member.email);
  } catch (error) {
    console.error('Failed to register waitlist member:', error);
    response.status(500).json({ status: 'error', message: 'Something went wrong. Please try again.' });
  }
}
