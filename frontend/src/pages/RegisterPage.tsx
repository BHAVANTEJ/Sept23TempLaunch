import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const COUNTRY_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'United States (+1)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+971', label: 'UAE (+971)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+86', label: 'China (+86)' },
];

type Step = 'form' | 'otp';
type Status = 'idle' | 'submitting' | 'success' | 'error';

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function requestOtp() {
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneCountryCode: phoneNumber ? countryCode : '',
          phoneNumber,
          email,
          password,
        }),
      });
      const data: { status: string; message: string } = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('idle');
      setMessage('');
      setOtp('');
      setStep('otp');
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Please try again.');
    }
  }

  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await requestOtp();
  }

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data: { status: string; message: string } = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage("Successfully registered! We've sent a confirmation to your email. Redirecting…");
      setFirstName('');
      setLastName('');
      setPhoneNumber('');
      setEmail('');
      setPassword('');
      setOtp('');
      setTimeout(() => navigate('/'), 1800);
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Please try again.');
    }
  }

  if (step === 'otp') {
    return (
      <section className="register-section">
        <div className="register-card">
          <p className="eyebrow"><span className="eyebrow-line" />Verify your email</p>
          <h1>Enter your<br /><em>code.</em></h1>
          <p className="hero-text" style={{ margin: '0 0 24px', maxWidth: 'none' }}>We sent a 6-digit verification code to <strong>{email}</strong>.</p>

          <form className="register-form" onSubmit={handleOtpSubmit} noValidate>
            <label className="form-field">
              <span>Verification code *</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
            </label>

            <button className="button button-primary register-submit" type="submit" disabled={status === 'submitting' || otp.length !== 6}>
              {status === 'submitting' ? 'Verifying…' : 'Verify & Complete Registration'} <span>↗</span>
            </button>

            {message ? <p className={status === 'success' ? 'form-message form-message-success' : 'form-message form-message-error'}>{message}</p> : null}

            {status === 'success' ? (
              <Link className="text-link" to="/">← Back to home</Link>
            ) : (
              <>
                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <button type="button" className="text-link" onClick={requestOtp} disabled={status === 'submitting'}>Resend code</button>
                  <button type="button" className="text-link" onClick={() => { setStep('form'); setStatus('idle'); setMessage(''); }}>Back to edit</button>
                </div>
                <Link className="text-link" to="/">← Back to home</Link>
              </>
            )}
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="register-section">
      <div className="register-card">
        <p className="eyebrow"><span className="eyebrow-line" />Join GritSkool</p>
        <h1>Create your<br /><em>account.</em></h1>

        <form className="register-form" onSubmit={handleFormSubmit} noValidate>
          <div className="form-row">
            <label className="form-field">
              <span>First name *</span>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required autoComplete="given-name" />
            </label>
            <label className="form-field">
              <span>Last name</span>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
            </label>
          </div>

          <label className="form-field">
            <span>Phone number</span>
            <div className="phone-field">
              <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} aria-label="Country code">
                {COUNTRY_CODES.map((entry) => (
                  <option key={entry.code} value={entry.code}>{entry.label}</option>
                ))}
              </select>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="98765 43210" autoComplete="tel-national" />
            </div>
          </label>

          <label className="form-field">
            <span>Email *</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>

          <label className="form-field">
            <span>Password *</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
          </label>

          <button className="button button-primary register-submit" type="submit" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending code…' : 'Sign Up'} <span>↗</span>
          </button>

          {message ? <p className="form-message form-message-error">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
