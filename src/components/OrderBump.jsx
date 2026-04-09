import React from 'react';
import './OrderBump.css';

/**
 * OrderBump — WCAG 2.2 AA Compliant
 * SC 1.3.1: aside[role="complementary"] separates bump from main form
 * SC 2.5.8: Checkbox label has minimum 44px tap area
 * SC 4.1.2: Proper label association via htmlFor
 * SC 1.4.1: Selection state uses border + icon + text (not color alone)
 */

export default function OrderBump({ checked, onChange }) {
  return (
    <aside
      className={`order-bump ${checked ? 'order-bump--selected' : ''}`}
      aria-labelledby="bump-heading"
      role="complementary"
    >
      <div className="order-bump__badge" aria-hidden="true">
        ⚡ Special One-Time Add-On
      </div>

      <div className="order-bump__content">
        <div className="order-bump__image-col">
          {/* Product image placeholder */}
          <div
            className="order-bump__image-placeholder"
            role="img"
            aria-label="BioCollagen Complex supplement bottle"
          >
            <span aria-hidden="true">💊</span>
          </div>
        </div>

        <div className="order-bump__text-col">
          <h3 id="bump-heading" className="order-bump__heading">
            Complete the Anti-Aging Duo
          </h3>
          <p className="order-bump__description">
            Add <strong>BioCollagen Complex</strong> — works synergistically
            with Essential Skin Food to support collagen from the inside out.
          </p>

          <ul className="order-bump__benefits" role="list">
            <li>Supports skin firmness at the cellular level</li>
            <li>Works synergistically with Essential Skin Food</li>
            <li>One-time addition — no extra subscription</li>
          </ul>

          {/* Checkbox with expanded tap area (WCAG 2.5.8) */}
          <label
            className="order-bump__checkbox-wrapper"
            htmlFor="order-bump-check"
          >
            <input
              type="checkbox"
              id="order-bump-check"
              name="order-bump"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              aria-describedby="bump-price-desc"
              className="order-bump__checkbox"
            />
            <span className="order-bump__checkbox-label">
              Yes! Add BioCollagen Complex to my order
            </span>
          </label>

          <p id="bump-price-desc" className="order-bump__price">
            <s>$49.00</s>{' '}
            <strong className="order-bump__price-sale">$34.00</strong>{' '}
            <span className="order-bump__price-note">added to your order total</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
