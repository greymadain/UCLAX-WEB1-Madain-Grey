import React from 'react';
import './TrustBar.css';

/**
 * TrustBar — WCAG 2.2 AA Compliant
 * SC 1.1.1: Icons paired with visible text labels (never icon-only)
 * SC 1.4.3: All text meets 4.5:1 contrast on green background
 * SC 2.1.1: No interactive elements — purely informational
 */

const DEFAULT_ITEMS = [
  { icon: '🔒', text: 'Secure Checkout' },
  { icon: '✅', text: '90-Day Money-Back Guarantee' },
  { icon: '🚚', text: 'Free US Shipping $99+' },
];

export default function TrustBar({ items = DEFAULT_ITEMS, variant = 'green' }) {
  return (
    <div
      className={`trust-bar trust-bar--${variant}`}
      role="region"
      aria-label="Trust and security information"
    >
      <ul className="trust-bar__list" role="list">
        {items.map((item, i) => (
          <li key={i} className="trust-bar__item">
            {/* aria-hidden: icon is decorative; text label carries meaning */}
            <span className="trust-bar__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="trust-bar__text">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
