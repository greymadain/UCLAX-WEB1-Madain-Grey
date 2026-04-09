import React, { useState, useEffect, useRef } from 'react';
import './CountdownTimer.css';

/**
 * CountdownTimer — WCAG 2.2 AA Compliant
 * SC 4.1.2: role="timer" + aria-live="off" (intentional — screen readers
 *           should NOT announce every second; annoying and disruptive)
 * SC 2.2.1: Timer is visual urgency ONLY — does NOT expire form data
 *           or remove cart items. Uses sessionStorage for persistence.
 * SC 2.3.3: Respects prefers-reduced-motion (no animation)
 *
 * @param {number} initialMinutes - Starting minutes (default 14)
 * @param {string} label - Timer label text
 * @param {string} storageKey - sessionStorage key for persistence
 */
export default function CountdownTimer({
  initialMinutes = 14,
  label = 'Special pricing ends in:',
  storageKey = 'asf_timer_end',
}) {
  const [timeLeft, setTimeLeft] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Get or create timer end time (persists across page reloads in session)
    let endTime = sessionStorage.getItem(storageKey);
    if (!endTime) {
      endTime = Date.now() + initialMinutes * 60 * 1000;
      sessionStorage.setItem(storageKey, String(endTime));
    } else {
      endTime = parseInt(endTime, 10);
    }

    const tick = () => {
      const remaining = endTime - Date.now();
      if (remaining <= 0) {
        // Timer expired — reset for a fresh 5-minute window
        // (Fake urgency that shows 0:00 damages trust — reset instead)
        const newEnd = Date.now() + 5 * 60 * 1000;
        sessionStorage.setItem(storageKey, String(newEnd));
        setTimeLeft(5 * 60 * 1000);
      } else {
        setTimeLeft(remaining);
      }
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);
    return () => clearInterval(intervalRef.current);
  }, [initialMinutes, storageKey]);

  const format = (ms) => {
    if (ms === null) return '--:--';
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div
      className="countdown-timer"
      role="timer"
      aria-live="off"   /* Intentional: don't announce every second */
      aria-label={`${label} ${format(timeLeft)}`}
    >
      <span className="countdown-timer__label" aria-hidden="true">
        <span className="countdown-timer__clock-icon" aria-hidden="true">🕐</span>
        {label}
      </span>
      {/* aria-hidden: screen reader reads the aria-label on the container instead */}
      <span
        id="timer-display"
        className="countdown-timer__display"
        aria-hidden="true"
      >
        {format(timeLeft)}
      </span>
    </div>
  );
}
