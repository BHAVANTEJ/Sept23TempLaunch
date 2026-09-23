import { randomInt } from 'node:crypto';

export const OTP_TTL_MS = 10 * 60 * 1000;

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}
