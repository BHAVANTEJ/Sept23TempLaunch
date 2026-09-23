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
        <div className="cohort-side">
          <p className="cohort-side-label"><span className="pill-dot" />Something's about to change</p>
          <span className="cohort-side-divider" />
          <p className="cohort-side-text">The skills recruiters search for, revealed.</p>
        </div>

        <div className="cohort-main">
          <span className="cohort-watermark" aria-hidden="true">gritskool</span>

          <div className="cohort-content">
            <h2 className="cohort-heading">The Skills Recruiters Search For,<em>Revealed</em></h2>
            <p className="cohort-label">First look drops in</p>

            {complete ? (
              <p className="launch-message">GritSkool is here. Let the learning begin.</p>
            ) : (
              <div className="timer-grid" aria-label="Countdown to October 9, 2026">
                {(['days', 'hours', 'minutes', 'seconds'] as const).map((unit, index) => (
                  <Fragment key={unit}>
                    <div className={`timer-card${index === 1 ? ' timer-card-highlight' : ''}`}>
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
                <p className="early-access-caption">Be the first to know when we launch.</p>
              </div>
            ) : (
              <>
                <form className="early-access-form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                  <button type="submit" disabled={status === 'submitting'}>{status === 'submitting' ? 'Joining…' : 'Join Waitlist'}</button>
                </form>
                <p className={status === 'error' ? 'form-message form-message-error' : 'early-access-caption'}>
                  {message || 'Be the first to know when we launch.'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
