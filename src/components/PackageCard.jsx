import React from 'react';
import './PackageCard.css';
import { getVariant } from '../utils/abTest';

/**
 * PackageCard — WCAG 2.2 AA Compliant
 * SC 4.1.2: fieldset + legend + input[type=radio] — not divs with click handlers
 * SC 2.5.8: Full card is the tap target (entire label is clickable)
 * SC 1.4.1: Selected state uses border weight + icon + text — not color alone
 * SC 2.1.1: Keyboard navigable (radio buttons natively keyboard accessible)
 */

export const PACKAGES = [
  {
    id: 'pkg-1',
    value: '1-bottle',
    bottles: 1,
    days: 30,
    priceTotal: 59,
    pricePerBottle: 59,
    pricePerDay: 1.97,
    originalPrice: 79,
    savings: 25,
    savingsPct: 25,
    badge: null,
    subscribePrice: 53,
  },
  {
    id: 'pkg-3',
    value: '3-bottle',
    bottles: 3,
    days: 90,
    priceTotal: 147,
    pricePerBottle: 49,
    pricePerDay: 1.63,
    originalPrice: 177,
    savings: 30,
    savingsPct: 17,
    badge: '⭐ MOST POPULAR',
    subscribePrice: 44,
  },
  {
    id: 'pkg-6',
    value: '6-bottle',
    bottles: 6,
    days: 180,
    priceTotal: 264,
    pricePerBottle: 44,
    pricePerDay: 1.47,
    originalPrice: 354,
    savings: 37,
    savingsPct: 25,
    badge: '🏆 BEST VALUE',
    subscribePrice: 40,
  },
];

export default function PackageSelector({ selected, onChange, pricingVariant }) {
  // A/B Test P3-B: per-day vs per-bottle pricing display
  const showPerDay = pricingVariant
    ? pricingVariant === 'per-day'
    : getVariant('P3-B') === 'per-day';

  return (
    <fieldset className="package-selector">
      <legend className="package-selector__legend">
        Choose Your Supply — Save Up to 40%
      </legend>

      <div className="package-selector__grid">
        {PACKAGES.map((pkg) => {
          const isSelected = selected === pkg.value;
          return (
            <label
              key={pkg.id}
              htmlFor={pkg.id}
              className={`package-card ${isSelected ? 'package-card--selected' : ''}`}
              aria-label={`${pkg.bottles} bottle${pkg.bottles > 1 ? 's' : ''}, ${pkg.days}-day supply, $${pkg.pricePerBottle} per bottle, $${pkg.priceTotal} total${pkg.badge ? '. ' + pkg.badge.replace(/[⭐🏆]/g, '') : ''}`}
            >
              <input
                type="radio"
                id={pkg.id}
                name="package"
                value={pkg.value}
                checked={isSelected}
                onChange={() => onChange(pkg.value)}
                className="package-card__radio"
                aria-describedby={`${pkg.id}-desc`}
              />

              {/* Selected checkmark — not color-only (WCAG 1.4.1) */}
              <span className="package-card__check" aria-hidden="true">
                {isSelected ? '✓' : ''}
              </span>

              {pkg.badge && (
                <div className="package-card__badge" aria-hidden="true">
                  {pkg.badge}
                </div>
              )}

              <div className="package-card__header">
                <span className="package-card__count">
                  {pkg.bottles} Bottle{pkg.bottles > 1 ? 's' : ''}
                </span>
                <span className="package-card__supply">
                  {pkg.days}-Day Supply
                </span>
              </div>

              <div className="package-card__pricing">
                {showPerDay ? (
                  <span className="package-card__price-highlight">
                    Only ${pkg.pricePerDay.toFixed(2)}<span className="package-card__price-unit">/day</span>
                  </span>
                ) : (
                  <span className="package-card__price-highlight">
                    ${pkg.pricePerBottle}<span className="package-card__price-unit">/bottle</span>
                  </span>
                )}

                <div className="package-card__total">
                  <s className="package-card__original">${pkg.originalPrice}</s>
                  <strong className="package-card__sale">${pkg.priceTotal}</strong>
                  <span className="package-card__savings">Save {pkg.savingsPct}%</span>
                </div>
              </div>

              {/* Hidden description for screen readers */}
              <span id={`${pkg.id}-desc`} className="sr-only">
                {pkg.bottles} bottle package. {pkg.days}-day supply. ${pkg.pricePerBottle} per bottle.
                Total: ${pkg.priceTotal}. Original price: ${pkg.originalPrice}. Save {pkg.savingsPct}%.
                {pkg.badge ? ' ' + pkg.badge.replace(/[⭐🏆]/g, '').trim() + '.' : ''}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
