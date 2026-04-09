import React from 'react';
import './AwardStrip.css';

/**
 * AwardStrip — WCAG 2.2 AA Compliant
 * role="complementary": supplementary info about the product
 * aria-hidden on decorative star icon
 */
export default function AwardStrip() {
  return (
    <aside
      className="award-strip"
      role="complementary"
      aria-label="Product award recognition"
    >
      <span className="award-strip__icon" aria-hidden="true">⭐</span>
      <p className="award-strip__text">
        <strong>2025 Mindful Award</strong> — Beauty Product of the Year
      </p>
    </aside>
  );
}
