import React from 'react';
import './SubscribeToggle.css';

/**
 * SubscribeToggle — WCAG 2.2 AA Compliant
 * SC 4.1.2: role="group" + aria-label for the toggle group
 * SC 1.3.1: aria-pressed communicates pressed state to screen readers
 * SC 2.5.8: min-height 44px on buttons
 * SC 1.4.1: Active state uses background + text color, not color alone
 */
export default function SubscribeToggle({ subscribed, onChange }) {
  return (
    <div
      className="subscribe-toggle"
      role="group"
      aria-label="Purchase type"
    >
      <button
        type="button"
        className={`subscribe-toggle__btn${
          subscribed ? ' subscribe-toggle__btn--active' : ''
        }`}
        aria-pressed={subscribed}
        onClick={() => onChange(true)}
      >
        Subscribe &amp; Save 10%
      </button>
      <button
        type="button"
        className={`subscribe-toggle__btn${
          !subscribed ? ' subscribe-toggle__btn--active' : ''
        }`}
        aria-pressed={!subscribed}
        onClick={() => onChange(false)}
      >
        One-Time Purchase
      </button>
    </div>
  );
}
