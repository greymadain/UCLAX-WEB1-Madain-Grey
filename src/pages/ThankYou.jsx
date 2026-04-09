import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/global.css';
import './ThankYou.css';
import TestimonialCard from '../components/TestimonialCard';
import { getVariant } from '../utils/abTest';

/**
 * ThankYou — Order Confirmation Page (/thank-you)
 * A/B Test P7-A: Static cross-sell cards vs. Amazon-style "Frequently Bought Together"
 *
 * WCAG 2.2 AA:
 *  - Order summary in semantic <table>
 *  - Timeline using <ol> + <li>
 *  - Cross-sell cards: informational, no required interaction
 */

const CROSS_SELL_PRODUCTS = [
  {
    id: 'morning-complete',
    name: 'Morning Complete',
    description: 'A comprehensive all-in-one wellness shot to start your day with energy and balance.',
    price: 79.00,
    icon: '🌅',
  },
  {
    id: 'nighttime-complete',
    name: 'Nighttime Complete',
    description: 'Sleep-supporting formula with calming adaptogens. Wake up refreshed.',
    price: 69.00,
    icon: '🌙',
  },
  {
    id: 'active-liver',
    name: 'Active Liver',
    description: 'Comprehensive liver support with milk thistle, NAC, and artichoke extract.',
    price: 59.00,
    icon: '🫀',
  },
];

const TIMELINE = [
  {
    period: 'Day 1',
    title: 'You Begin',
    detail: 'Take 3 capsules daily with a full glass of water. Morning works best for most people.',
  },
  {
    period: 'Days 7–14',
    title: 'Hydration Boost',
    detail: 'Many customers notice improved skin hydration and a healthier glow within the first two weeks.',
  },
  {
    period: 'Weeks 4–6',
    title: 'Firming Begins',
    detail: 'Skin texture improves as your body ramps up natural collagen production. Fine lines may appear softer.',
  },
  {
    period: 'Weeks 8–12',
    title: 'Full Results',
    detail: 'Maximum visible firming and lifting effect. Skin looks and feels noticeably younger.',
  },
];

const SOCIAL_PROOF_REVIEWS = [
  {
    quote: 'I ordered with some skepticism. At 12 weeks I genuinely cannot believe the change. My skin looks like it did 10 years ago.',
    author: 'Margaret S.',
    location: 'Denver, CO',
    rating: 5,
    result: 'Looks 10 years younger at 12 weeks',
    verified: true,
  },
  {
    quote: 'The texture of my skin completely changed. Softer, firmer, more even. I stopped wearing foundation every day.',
    author: 'Patricia W.',
    location: 'Nashville, TN',
    rating: 5,
    result: 'Stopped wearing foundation daily',
    verified: true,
  },
];

export default function ThankYou() {
  const crossSellVariant = getVariant('P7-A'); // 'static' or 'amazon-fbt'

  // Mock order data — in production, pull from session/state/URL params
  const orderData = {
    orderNumber: 'ASF-' + Math.floor(100000 + Math.random() * 900000),
    product: 'Essential Skin Food — 3-Bottle (90-Day Supply)',
    quantity: 3,
    subtotal: 147.00,
    shipping: 0,
    total: 147.00,
    estimatedDelivery: deliveryRange(),
  };

  return (
    <div className="ty-page">
      <main id="main-content" className="ty-page__main">
        <div className="container container--narrow">

          {/* ── Confirmation Hero ── */}
          <section className="ty-hero" aria-labelledby="ty-hero-heading">
            <div className="ty-hero__icon" aria-hidden="true">✅</div>
            <h1 id="ty-hero-heading" className="ty-hero__heading">
              Thank You — Your Order Is Confirmed!
            </h1>
            <p className="ty-hero__sub">
              Order <strong>{orderData.orderNumber}</strong> is being prepared.
              Check your email for your confirmation receipt.
            </p>
          </section>

          {/* ── Order Summary (semantic table) ── */}
          <section className="ty-order-summary" aria-labelledby="ty-summary-heading">
            <h2 id="ty-summary-heading" className="ty-order-summary__heading">
              Order Summary
            </h2>

            <table className="ty-order-table" aria-label="Your order details">
              <caption className="sr-only">
                Order {orderData.orderNumber} — complete details
              </caption>
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col" className="ty-order-table__qty">Qty</th>
                  <th scope="col" className="ty-order-table__price">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{orderData.product}</td>
                  <td className="ty-order-table__qty">{orderData.quantity}</td>
                  <td className="ty-order-table__price">${orderData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Shipping</td>
                  <td className="ty-order-table__qty">—</td>
                  <td className="ty-order-table__price">
                    {orderData.shipping === 0 ? (
                      <span className="ty-order-table__free">FREE</span>
                    ) : (
                      `$${orderData.shipping.toFixed(2)}`
                    )}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="ty-order-table__total">
                  <th scope="row" colSpan={2}>Total Charged</th>
                  <td className="ty-order-table__price">
                    ${orderData.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <p className="ty-order-delivery">
              <span aria-hidden="true">🚚</span>{' '}
              Estimated delivery: <strong>{orderData.estimatedDelivery}</strong>
            </p>
          </section>

          {/* ── What to Expect Timeline ── */}
          <section className="ty-timeline" aria-labelledby="ty-timeline-heading">
            <h2 id="ty-timeline-heading" className="ty-timeline__heading">
              What to Expect on Your Journey
            </h2>
            <p className="ty-timeline__intro">
              Here is what thousands of women report as they take Essential Skin Food consistently.
              Results vary by individual.
            </p>

            <ol className="ty-timeline__list" aria-label="Results timeline">
              {TIMELINE.map((step, i) => (
                <li key={i} className="ty-timeline__item">
                  <div className="ty-timeline__marker" aria-hidden="true">
                    {i + 1}
                  </div>
                  <div className="ty-timeline__content">
                    <span className="ty-timeline__period">{step.period}</span>
                    <h3 className="ty-timeline__title">{step.title}</h3>
                    <p className="ty-timeline__detail">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Social proof to reinforce purchase decision ── */}
          <section className="ty-reviews" aria-labelledby="ty-reviews-heading">
            <h2 id="ty-reviews-heading" className="ty-reviews__heading">
              You're in Great Company
            </h2>
            <div className="ty-reviews__grid">
              {SOCIAL_PROOF_REVIEWS.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </div>
          </section>

          {/* ── Cross-Sell ── */}
          <section className="ty-crosssell" aria-labelledby="ty-crosssell-heading">
            <h2 id="ty-crosssell-heading" className="ty-crosssell__heading">
              Complete Your Wellness Routine
            </h2>

            {crossSellVariant === 'amazon-fbt' ? (
              /* Amazon-style "Frequently Bought Together" */
              <AmazonFBT products={CROSS_SELL_PRODUCTS} />
            ) : (
              /* Static product cards */
              <div className="ty-crosssell__grid">
                {CROSS_SELL_PRODUCTS.map((product) => (
                  <CrossSellCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* ── Referral placeholder ── */}
          <section className="ty-referral" aria-labelledby="ty-referral-heading">
            <h2 id="ty-referral-heading" className="ty-referral__heading">
              Share the Love
            </h2>
            <p>
              Know a friend who'd love healthier, younger-looking skin? Share your
              personal referral link and earn credit toward your next order.
            </p>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => alert('Referral program integration required')}
            >
              Get My Referral Link
            </button>
          </section>

          {/* ── FDA Disclaimer ── */}
          <p className="fda-disclaimer" role="note">
            †These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
            Individual results may vary.
          </p>
        </div>
      </main>

      {/* ── Page Footer ── */}
      <footer className="page-footer" role="contentinfo">
        <p>
          Questions? Call us at <a href="tel:8007208403">800-720-8403</a> or email{' '}
          <a href="mailto:support@activatedyou.com">support@activatedyou.com</a>
        </p>
        <p>
          © {new Date().getFullYear()} ActivatedYou. All rights reserved.{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a> |{' '}
          <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
        </p>
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function CrossSellCard({ product }) {
  return (
    <article className="crosssell-card" aria-labelledby={`cs-${product.id}-name`}>
      <div
        className="crosssell-card__icon"
        role="img"
        aria-label={`${product.name} product image`}
      >
        <span aria-hidden="true">{product.icon}</span>
      </div>
      <h3 id={`cs-${product.id}-name`} className="crosssell-card__name">
        {product.name}
      </h3>
      <p className="crosssell-card__desc">{product.description}</p>
      <p className="crosssell-card__price">${product.price.toFixed(2)}</p>
      <button
        type="button"
        className="btn btn--secondary btn--full crosssell-card__btn"
        onClick={() => alert(`Add ${product.name} — integration required`)}
      >
        Add to Cart
      </button>
    </article>
  );
}

function AmazonFBT({ products }) {
  return (
    <div className="amazon-fbt" aria-label="Frequently bought together">
      <div className="amazon-fbt__products">
        {products.map((p, i) => (
          <React.Fragment key={p.id}>
            <div className="amazon-fbt__product">
              <span className="amazon-fbt__icon" aria-hidden="true">{p.icon}</span>
              <p className="amazon-fbt__name">{p.name}</p>
              <p className="amazon-fbt__price">${p.price.toFixed(2)}</p>
            </div>
            {i < products.length - 1 && (
              <span className="amazon-fbt__plus" aria-hidden="true">+</span>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="amazon-fbt__total">
        <p>
          Bundle price:{' '}
          <strong>
            ${products.reduce((sum, p) => sum + p.price * 0.85, 0).toFixed(2)}
          </strong>{' '}
          <s className="amazon-fbt__original">
            ${products.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
          </s>
          {' '}(Save 15%)
        </p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => alert('Bundle add-to-cart — integration required')}
        >
          Add All 3 to Cart — Save 15%
        </button>
      </div>
    </div>
  );
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function addBusinessDays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function deliveryRange() {
  const start = addBusinessDays(new Date(), 3);
  const end   = addBusinessDays(new Date(), 5);
  const opts  = { month: 'long', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}
