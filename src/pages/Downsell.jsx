import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import './Downsell.css';
import { getVariant } from '../utils/abTest';

/**
 * Downsell Page (/downsell)
 * Shown to users who declined OTO-1.
 * A/B Test P6-A: Show downsell vs. skip to thank-you.
 * (Routing logic lives in App.jsx — this page is the "show" variant)
 *
 * WCAG 2.2 AA: same single-focus, no-nav, large-button pattern as Upsell1.
 */

export default function Downsell() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const handleAccept = () => {
    setProcessing(true);
    setTimeout(() => navigate('/thank-you'), 800);
  };

  const handleDecline = () => {
    navigate('/thank-you');
  };

  return (
    <div className="downsell-page">
      <main id="main-content" className="downsell-page__main">
        <div className="container container--narrow">

          {/* ── Empathy bridge ── */}
          <div className="downsell-bridge" aria-live="polite">
            <p className="downsell-bridge__text">
              We heard you — here's a smaller option.
            </p>
          </div>

          {/* ── Offer Card ── */}
          <article className="downsell-card" aria-labelledby="downsell-headline">
            <div className="downsell-card__tag">A Better Deal Before You Go</div>

            <h1 id="downsell-headline" className="downsell-card__headline">
              Start Smaller — Try 1 Bottle of BioCollagen Complex for Just $19
            </h1>

            <p className="downsell-card__subhead">
              This is our lowest-ever introductory price. Get the full
              anti-aging benefit at no risk.
            </p>

            {/* Product */}
            <div
              className="downsell-card__product"
              role="img"
              aria-label="BioCollagen Complex single bottle"
            >
              <span aria-hidden="true" className="downsell-card__icon">💊</span>
              <div>
                <p className="downsell-card__product-name">BioCollagen Complex</p>
                <p className="downsell-card__product-sub">1 Bottle — 30-Day Supply</p>
              </div>
            </div>

            {/* Benefits */}
            <ul className="downsell-card__benefits" role="list">
              <li>Works synergistically with your Essential Skin Food order</li>
              <li>Clinically studied plant-based collagen support</li>
              <li>Still protected by our 90-day money-back guarantee</li>
            </ul>

            {/* Pricing */}
            <div className="downsell-card__pricing">
              <span className="downsell-card__original">
                Regular price: <s>$49.00</s>
              </span>
              <div className="downsell-card__offer">
                <span className="downsell-card__price">$19.00</span>
                <span className="downsell-card__savings">Save 61%</span>
              </div>
              <p className="downsell-card__note">
                One-time charge. No subscription. No re-entering payment.
              </p>
            </div>

            {/* Accept */}
            <button
              type="button"
              className="btn btn--primary btn--full downsell-accept-btn"
              onClick={handleAccept}
              disabled={processing}
              aria-label={
                processing
                  ? 'Processing your order upgrade...'
                  : 'Yes, add BioCollagen Complex for $19'
              }
              aria-busy={processing}
            >
              {processing ? 'Processing...' : 'Yes! Add BioCollagen Complex for $19 →'}
            </button>

            {/* Guarantee */}
            <p className="downsell-card__guarantee">
              <span aria-hidden="true">🛡️</span>{' '}
              Covered by our 90-day money-back guarantee.
            </p>

            {/* Decline — fully accessible button, min 44px */}
            <button
              type="button"
              className="downsell-decline-btn"
              onClick={handleDecline}
              aria-label="No thank you, go to my order confirmation"
            >
              No thanks — take me to my order confirmation.
            </button>
          </article>

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
