import { Fragment, useEffect, useState } from 'react';
import type { FormEvent } from 'react';

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };
const target = new Date('2026-10-09T00:00:00');
const getTimeLeft = (): TimeLeft => { const difference = Math.max(0, target.getTime() - Date.now()); return { days: Math.floor(difference / 86400000), hours: Math.floor(difference / 3600000) % 24, minutes: Math.floor(difference / 60000) % 60, seconds: Math.floor(difference / 1000) % 60 }; };

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function Countdown() {
  const [time, setTime] = useState(getTimeLeft);
  useEffect(() => { const timer = window.setInterval(() => setTime(getTimeLeft()), 1000); return () => window.clearInterval(timer); }, []);
  const complete = Object.values(time).every((value) => value === 0);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data: { status: string; message: string } = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage("You're on the list!");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Please try again.');
    }
  }

  return (
    <section className="cohort-section" id="countdown">
      <div className="cohort-card">
        <p className="pill"><span className="pill-dot" />Next cohort</p>
        <h2 className="cohort-heading">Starts <em>October 9</em></h2>
        <p className="cohort-sub">Seats are limited and reviewed in the order applications arrive. Secure your place before enrolment closes.</p>
        <p className="cohort-label"><span className="live-dot" />Next cohort starts in</p>

        <span className="cohort-watermark" aria-hidden="true">GRITSKOOL</span>

        {complete ? (
          <p className="launch-message">GritSkool is here. Let the learning begin.</p>
        ) : (
          <div className="timer-grid" aria-label="Countdown to October 9, 2026">
            {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit, index) => (
              <Fragment key={unit}>
                <div className="timer-card">
                  <strong>{String(time[unit]).padStart(2, '0')}</strong>
                  <span>{unit}</span>
                </div>
                {index < 3 && <span className="timer-colon" aria-hidden="true">:</span>}
              </Fragment>
            ))}
          </div>
        )}

        {status === 'success' ? (
          <div className="success-block">
            <p className="success-heading">{message || "You're on the list!"}</p>
            <p className="early-access-caption">Be first to see it when it drops.</p>
          </div>
        ) : (
          <>
            <form className="early-access-form" onSubmit={handleSubmit}>
              <span className="early-access-icon" aria-hidden="true">✉</span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Joining…' : 'Get early access'} <span>→</span></button>
            </form>
            <p className={status === 'error' ? 'form-message form-message-error' : 'early-access-caption'}>
              {message || 'Be first to see it when it drops.'}
            </p>
          </>
        )}
        <p className="early-access-caption">October 2026 Cohort · all times IST</p>
      </div>
    </section>
  );
}
