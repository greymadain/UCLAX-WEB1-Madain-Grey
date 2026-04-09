import React, { useState, useEffect } from 'react';
import './StickyBuyBar.css';

/**
 * StickyBuyBar — WCAG 2.2 AA Compliant
 * SC 2.4.11: Does not obscure focused elements (scroll-padding-bottom set in global.css)
 * SC 2.5.8: CTA button minimum 56px height
 * SC 1.4.3: All text meets contrast requirements on white background
 *
 * Appears after user has scrolled past the initial CTA.
 * Hidden on desktop (package selector is visible in viewport).
 */

export default function StickyBuyBar({ onCtaClick, selectedPackage, price }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px — ensures user has seen product info
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="sticky-buy-bar"
      role="region"
      aria-label="Quick checkout bar"
    >
      <div className="sticky-buy-bar__inner">
        <div className="sticky-buy-bar__info">
          <span className="sticky-buy-bar__product">Essential Skin Food</span>
          {selectedPackage && (
            <span className="sticky-buy-bar__package">{selectedPackage}</span>
          )}
        </div>

        <button
          type="button"
          className="btn btn--primary sticky-buy-bar__cta"
          onClick={onCtaClick}
          aria-label={`Add to order${price ? ` — ${price}` : ''}`}
        >
          {price
            ? `Claim My Supply — ${price}`
            : 'Claim My Discounted Supply →'}
        </button>
      </div>
    </div>
  );
}
