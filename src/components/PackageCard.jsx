import React from 'react';
import './PackageCard.css';
import { getVariant } from '../utils/abTest';

/**
 * PackageCard — WCAG 2.2 AA Compliant
 * SC 4.1.2: fieldset + legend + input[type=radio] — not divs with click handlers
 * SC 2.5.8: Full card is the tap target (entire label is clickable)
 * SC 1.4.1: Selected state uses border weight + icon + bg — not color alone
 * SC 2.1.1: Keyboard navigable (radio buttons natively keyboard accessible)
 *
 * Pricing per spec (Section 4, Module 5):
 *   1-bottle:  Was $69.95 | One-time $59 | Subscribe $53  | /day (sub) $1.77
 *   3-bottle:  Was $191.85| One-time $147| Subscribe $134 | /day (sub) $1.49
 *   6-bottle:  Was $365.70| One-time $254| Subscribe $228 | /day (sub) $1.27
 */

export const PACKAGES = [
  {
    id: 'pkg-1',
    value: '1-bottle',
    bottles: 1,
    days: 30,
    wasPrice: 69.95,
    priceTotal: 59,
    pricePerBottle: 59,
    perDayOneTime: 1.97,
    subscribeTotal: 53,
    perDaySub: 1.77,
    savingsPct: 16,
    badge: null,
  },
  {
    id: 'pkg-3',
    value: '3-bottle',
    bottles: 3,
    days: 90,
    wasPrice: 191.85,
    priceTotal: 147,
    pricePerBottle: 49,
    perDayOneTime: 1.63,
    subscribeTotal: 134,
    perDaySub: 1.49,
    savingsPct: 23,
    badge: '⭐ MOST POPULAR',
  },
  {
    id: 'pkg-6',
    value: '6-bottle',
    bottles: 6,
    days: 180,
    wasPrice: 365.70,
    priceTotal: 254,
    pricePerBottle: 42.33,
    perDayOneTime: 1.41,
    subscribeTotal: 228,
    perDaySub: 1.27,
    savingsPct: 31,
    badge: '🏆 BEST VALUE',
  },
];

export default function PackageSelector({
  selected,
  onChange,
  pricingVariant,
  subscribed = false,
}) {
  // A/B Test P3-B: per-day vs per-bottle pricing display
  const showPerDay = (pricingVariant ?? getVariant('P3-B')) === 'per-day';

  return (
    <fieldset className="package-selector">
      <legend className="package-selector__legend">
        Choose Your Supply — Save Up to 31%
      </legend>

      <div className="package-selector__grid">
        {PACKAGES.map((pkg) => {
          const isSelected = selected === pkg.value;
          const displayPrice   = subscribed ? pkg.subscribeTotal : pkg.priceTotal;
          const displayPerDay  = subscribed ? pkg.perDaySub : pkg.perDayOneTime;
          const displayPerBottle = subscribed
            ? (pkg.subscribeTotal / pkg.bottles).toFixed(2)
            : pkg.pricePerBottle.toFixed(2);

          return (
            <label
              key={pkg.id}
              htmlFor={pkg.id}
              className={`package-card${isSelected ? ' package-card--selected' : ''}`}
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

              {/* Checkmark — not color-only (WCAG 1.4.1) */}
              <span className="package-card__check" aria-hidden="true">
                {isSelected ? '✓' : ''}
              </span>

              {pkg.badge && (
                <div
                  className={`package-card__badge${
                    pkg.badge.includes('POPULAR') ? '' : ' package-card__badge--gold'
                  }`}
                  aria-hidden="true"
                >
                  {pkg.badge}
                </div>
              )}

              <div className="package-card__header">
                <span className="package-card__count">
                  {pkg.bottles} Bottle{pkg.bottles > 1 ? 's' : ''}
                </span>
                <span className="package-card__supply">{pkg.days}-Day Supply</span>
              </div>

              <div className="package-card__pricing">
                {showPerDay ? (
                  <span className="package-card__price-highlight">
                    Only ${displayPerDay.toFixed(2)}
                    <span className="package-card__price-unit">/day</span>
                  </span>
                ) : (
                  <span className="package-card__price-highlight">
                    ${displayPerBottle}
                    <span className="package-card__price-unit">/bottle</span>
                  </span>
                )}

                <div className="package-card__total">
                  <s className="package-card__original">${pkg.wasPrice.toFixed(2)}</s>
                  <strong className="package-card__sale">${displayPrice.toFixed(2)}</strong>
                  <span className="package-card__savings">Save {pkg.savingsPct}%</span>
                </div>
              </div>

              {/* Hidden screen-reader description */}
              <span id={`${pkg.id}-desc`} className="sr-only">
                {pkg.bottles} bottle package. {pkg.days}-day supply.{' '}
                {subscribed
                  ? `Subscribe price: $${pkg.subscribeTotal}. `
                  : `One-time price: $${pkg.priceTotal}. `}
                Was ${pkg.wasPrice.toFixed(2)}. Save {pkg.savingsPct}%.
                {pkg.badge
                  ? ' ' + pkg.badge.replace(/[⭐🏆]/g, '').trim() + '.'
                  : ''}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
