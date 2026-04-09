import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import './Upsell1.css';
import { getVariant } from '../utils/abTest';

/**
 * Upsell1 — Post-Purchase OTO Page (/upsell-1)
 * A/B Tests:
 *   P5-A: Quantity upgrade vs. complementary product
 *   P5-B: Scarcity headline vs. results headline
 *
 * WCAG 2.2 AA: Single-focus page, no nav, large buttons,
 * accept/decline both meet 44px minimum.
 */

const OFFERS = {
  quantity: {
    headline: { scarcity: 'Wait — This Deal Disappears When You Leave', results: 'Unlock 12 Months of Radiant Skin at Our Lowest Price Ever' },
    subhead: 'Double your supply. Lock in today\'s price for a full year.',
    items: ['6 more bottles (180-day supply)', 'Our deepest per-bottle discount', 'Same 90-day guarantee applies'],
    originalPrice: 354,
    offerPrice: 199,
    perBottle: 33,
    badge: '67% OFF — TODAY ONLY',
    cta: 'Yes! Add 6 More Bottles at $33 Each →',
    productName: '6-Bottle Bundle (180-Day Supply)',
  },
  complementary: {
    headline: { scarcity: 'Wait — This Offer Vanishes When You Close This Page', results: 'Supercharge Your Results: Add the Complete Anti-Aging System' },
    subhead: 'BioCollagen Complex works synergistically with Essential Skin Food for amplified results.',
    items: ['Supports collagen at the cellular level', 'Clinically studied plant-based formula', 'Save 30% vs. buying separately'],
    originalPrice: 149.90,
    offerPrice: 107,
    perBottle: null,
    badge: 'EXCLUSIVE BUNDLE — SAVE $42.90',
    cta: 'Yes! Add The Anti-Aging Duo to My Order →',
    productName: 'Anti-Aging Duo Bundle',
  },
};

export default function Upsell1() {
  const navigate = useNavigate();
  const offerType = getVariant('P5-A');       // 'quantity' or 'complementary'
  const headlineType = getVariant('P5-B');    // 'scarcity' or 'results'

  const offer = OFFERS[offerType] || OFFERS.complementary;
  const headline = offer.headline[headlineType] || offer.headline.results;

  const [processing, setProcessing] = useState(false);

  const handleAccept = () => {
    setProcessing(true);
    // In production: process the one-click upsell charge, then navigate
    setTimeout(() => navigate('/thank-you'), 800);
  };

  const handleDecline = () => {
    navigate('/downsell');
  };

  return (
    <div className="upsell-page">
      <main id="main-content" className="upsell-page__main">
        {/* No navigation, no exit links — single focus page */}
        <div className="container container--narrow">

          {/* ── Transition hook ── */}
          <div className="upsell-transition" aria-live="polite">
            <p className="upsell-transition__text">
              <span aria-hidden="true">✅</span>{' '}
              Your order for Essential Skin Food has been placed!
            </p>
          </div>

          {/* ── Offer Card ── */}
          <article className="upsell-card" aria-labelledby="upsell-headline">
            <div className="upsell-card__badge" aria-label={offer.badge}>
              {offer.badge}
            </div>

            <h1 id="upsell-headline" className="upsell-card__headline">
              {headline}
            </h1>

            <p className="upsell-card__subhead">{offer.subhead}</p>

            {/* Product visual placeholder */}
            <div
              className="upsell-card__product-visual"
              role="img"
              aria-label={`${offer.productName} product image`}
            >
              <span aria-hidden="true" className="upsell-card__product-icon">
                {offerType === 'quantity' ? '📦' : '💊'}
              </span>
              <p className="upsell-card__product-name">{offer.productName}</p>
            </div>

            {/* Benefits */}
            <ul className="upsell-card__benefits" role="list">
              {offer.items.map((item, i) => (
                <li key={i} className="upsell-card__benefit">
                  <span aria-hidden="true" className="upsell-card__check">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Pricing */}
            <div className="upsell-card__pricing" aria-label="Pricing breakdown">
              <div className="upsell-card__original">
                Normal price:{' '}
                <s>${offer.originalPrice.toFixed(2)}</s>
              </div>
              <div className="upsell-card__offer-price">
                <span className="upsell-card__price">${offer.offerPrice.toFixed(2)}</span>
                {offer.perBottle && (
                  <span className="upsell-card__per-unit">
                    (Just ${offer.perBottle}/bottle)
                  </span>
                )}
              </div>
              <p className="upsell-card__one-click-note">
                Added to your current order — one click, no re-entering payment info.
              </p>
            </div>

            {/* Guarantee reminder */}
            <div className="upsell-card__guarantee">
              <span aria-hidden="true">🛡️</span>{' '}
              Still covered by our 90-day money-back guarantee.
            </div>

            {/* Accept CTA */}
            <button
              type="button"
              className="btn btn--primary btn--full upsell-accept-btn"
              onClick={handleAccept}
              disabled={processing}
              aria-label={processing ? 'Processing your upgrade...' : offer.cta}
              aria-busy={processing}
            >
              {processing ? (
                <>
                  <span className="upsell-spinner" aria-hidden="true" />
                  Processing...
                </>
              ) : (
                offer.cta
              )}
            </button>

            {/* Decline link — still meets 44px min height (WCAG 2.5.8) */}
            <button
              type="button"
              className="upsell-decline-btn"
              onClick={handleDecline}
              aria-label="No thank you, skip this offer and continue to my order confirmation"
            >
              No thanks — I don't want to save more today. Continue to my confirmation.
            </button>
          </article>

          {/* ── FDA disclaimer ── */}
          <p className="fda-disclaimer" role="note">
            †These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Individual results may vary.
          </p>
        </div>
      </main>
    </div>
  );
}
