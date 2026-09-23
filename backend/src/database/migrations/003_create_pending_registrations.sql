CREATE TABLE IF NOT EXISTS pending_registrations (
  email TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  phone_country_code TEXT,
  phone_number TEXT,
  password_hash TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  otp_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
