export interface HealthResponse { status: 'ok'; service: 'gritskool-api'; timestamp: string; }

export interface WaitlistRequest { name?: string; email: string; }

export interface WaitlistResponse { status: 'registered'; message: string; alreadyRegistered: boolean; }

export interface ErrorResponse { status: 'error'; message: string; }

export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: 'registered';
  message: string;
  user: { id: string; firstName: string; lastName: string | null; email: string };
}

export interface OtpRequestedResponse {
  status: 'otp_sent';
  message: string;
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}
