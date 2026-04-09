import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import './Order.css';
import ImageGallery from '../components/ImageGallery';
import AwardStrip from '../components/AwardStrip';
import SubscribeToggle from '../components/SubscribeToggle';
import PackageSelector, { PACKAGES } from '../components/PackageCard';
import OrderBump from '../components/OrderBump';
import CountdownTimer from '../components/CountdownTimer';
import FAQAccordion from '../components/FAQAccordion';
import StickyBuyBar from '../components/StickyBuyBar';
import FormField from '../components/FormField';
import { getVariant } from '../utils/abTest';

/* ── Validation helpers ──────────────────────────────────────────────────── */
const validators = {
  'first-name':   (v) => v.trim().length > 0 ? null : 'Please enter your first name.',
  'last-name':    (v) => v.trim().length > 0 ? null : 'Please enter your last name.',
  email:          (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Please enter a valid email address (e.g., name@example.com).',
  tel:            (v) => /^\+?[\d\s\-().]{7,}$/.test(v) ? null : 'Please enter a valid phone number.',
  'address-line1':(v) => v.trim().length > 0 ? null : 'Please enter your street address.',
  city:           (v) => v.trim().length > 0 ? null : 'Please enter your city.',
  state:          (v) => v.trim().length >= 2 ? null : 'Please enter your state (2-letter abbreviation).',
  'postal-code':  (v) => /^\d{5}(-\d{4})?$/.test(v) ? null : 'Please enter a valid ZIP code (e.g., 90210).',
  'card-number':  (v) => /^\d[\d\s]{13,18}\d$/.test(v) ? null : 'Please enter a valid 16-digit card number.',
  'card-expiry':  (v) => /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(v) ? null : 'Please enter a valid expiry date (MM/YY).',
  cvv:            (v) => /^\d{3,4}$/.test(v) ? null : 'Please enter your 3 or 4 digit security code.',
};

const INITIAL_FORM = {
  'first-name': '', 'last-name': '', email: '', tel: '',
  'address-line1': '', city: '', state: '', 'postal-code': '',
  'card-number': '', 'card-expiry': '', cvv: '',
};

const ORDER_FAQS = [
  { id: 'ofaq-1',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. Your payment is processed through 256-bit SSL encryption — the same technology used by major banks. We never store your full card number and comply with PCI DSS standards.' },
  { id: 'ofaq-2',
    question: 'When will my order ship?',
    answer: 'Orders placed before 2pm EST ship same day (Monday–Friday). Standard US delivery is 3–5 business days. You will receive a tracking email once your order ships.' },
  { id: 'ofaq-3',
    question: 'What if it does not work for me?',
    answer: 'No problem. You are covered by our 90-day money-back guarantee. Contact us at support@activatedyou.com or call 800-720-8403 and we will issue a full refund — no questions asked.' },
  { id: 'ofaq-4',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time by calling 800-720-8403 or emailing support@activatedyou.com. There are no cancellation fees and no contracts.' },
];

const BENEFITS = [
  { icon: '💪', title: 'Firms & Tightens',
    body: "Dermaval™ + amino acids support your body's natural collagen production.†*" },
  { icon: '🌿', title: '100% Plant-Based',
    body: 'Vegan, no animal collagen. Third-party tested for purity and potency.' },
  { icon: '✨', title: 'Reduces Fine Lines',
    body: 'Vitamin C + antioxidants fight free-radical skin damage for smoother skin.†*' },
  { icon: '💊', title: 'Just 1 Capsule Daily',
    body: 'One easy capsule with water — no complicated routine, no powders to mix.' },
];

const REVIEWS = [
  { id: 'r1', initials: 'BL', name: 'Beth L.', age: 58, stars: 5,
    quote: "I went to my 40th high school reunion last month and everyone was asking what my secret was. My skin looked as good as it did in my 30s." },
  { id: 'r2', initials: 'MK', name: 'Mary K.', age: 52, stars: 5,
    quote: "After just three weeks, my eyes looked lifted and I had this inner glow I hadn't seen in years. My husband noticed without me saying a word." },
  { id: 'r3', initials: 'RJ', name: 'Rita J.', age: 45, stars: 5,
    quote: "I'd tried so many collagen powders with no luck. After three weeks, my skin looked visibly healthier — and my nails are stronger than ever." },
];

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function Order() {
  const navigate = useNavigate();

  /* ── A/B Variants ── */
  const defaultPkg       = getVariant('P3-A') === '6-bottle' ? '6-bottle' : '3-bottle';
  const expressPlacement = getVariant('P3-D'); // 'above' | 'below'
  const urgencyVariant   = getVariant('P3-E'); // 'all' | 'timer-only' | 'none'
  const pricingVariant   = getVariant('P3-B'); // 'per-day' | 'per-bottle'
  const subscribeDefault = getVariant('P3-C') === 'subscribe';

  /* ── State ── */
  const [selectedPackage, setSelectedPackage] = useState(defaultPkg);
  const [subscribed, setSubscribed]           = useState(subscribeDefault);
  const [bumpChecked, setBumpChecked]         = useState(false);
  const [cvvTooltipOpen, setCvvTooltipOpen]   = useState(false);
  const [form, setForm]       = useState(INITIAL_FORM);
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState(null);

  // Low-stock count: random 11–17, persist per session
  const [stockCount] = useState(() => {
    const stored = sessionStorage.getItem('esf_stock_count');
    if (stored) return parseInt(stored, 10);
    const n = Math.floor(Math.random() * 7) + 11;
    sessionStorage.setItem('esf_stock_count', String(n));
    return n;
  });

  const purchaseWidgetRef = useRef(null);
  const formRef           = useRef(null);
  const errorSummaryRef   = useRef(null);

  /* ── Derived values ── */
  const pkg        = PACKAGES.find((p) => p.value === selectedPackage) ?? PACKAGES[1];
  const baseTotal  = subscribed ? pkg.subscribeTotal : pkg.priceTotal;
  const bumpTotal  = bumpChecked ? 34 : 0;
  const grandTotal = baseTotal + bumpTotal;
  const shipping   = grandTotal >= 99 ? 0 : 7.95;

  /* ── Handlers ── */
  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
    if (touched[field]) {
      setErrors((err) => ({ ...err, [field]: validators[field]?.(val) ?? null }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((err) => ({ ...err, [field]: validators[field]?.(form[field]) ?? null }));
  };

  const validateAll = () => {
    const newErrors = {};
    let hasError = false;
    Object.keys(validators).forEach((field) => {
      const msg = validators[field](form[field]);
      if (msg) { newErrors[field] = msg; hasError = true; }
    });
    setErrors(newErrors);
    setTouched(Object.fromEntries(Object.keys(validators).map((k) => [k, true])));
    return !hasError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) {
      setFormError('Please fix the errors below before continuing.');
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setFormError(null);
    navigate('/upsell-1');
  };

  const scrollToForm = () =>
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const scrollToPurchaseWidget = () =>
    purchaseWidgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const selectedPkgLabel = `${pkg.bottles}-Bottle (${pkg.days}-Day Supply)`;
  const priceLabel = `$${grandTotal.toFixed(2)}`;

  return (
    <>
      {/* ── Sticky Nav Bar ── */}
      <OrderStickyNav />

      <div className="order-page">
        <main id="main-content" className="order-page__main">

          {/* ── HERO: 2-column layout ── */}
          <section className="order-hero" aria-label="Product purchase">
            <div className="container">
              <div className="order-layout">

                {/* ── LEFT: Image Gallery + Award Strip ── */}
                <div className="order-col--left">
                  <ImageGallery />
                  <AwardStrip />
                </div>

                {/* ── RIGHT: Purchase Widget (10 modules) ── */}
                <div
                  className="order-col--right order-widget"
                  ref={purchaseWidgetRef}
                >
                  {/* Module 1 — Rating Row */}
                  <div className="order-widget__rating">
                    <span
                      className="order-widget__stars"
                      aria-label="4.8 out of 5 stars"
                      role="img"
                    >
                      ★★★★★
                    </span>
                    <span className="order-widget__score">4.8</span>
                    <a href="#reviews" className="order-widget__review-count">
                      (14,200+ reviews)
                    </a>
                  </div>

                  {/* Module 2 — Product Title */}
                  <div>
                    <h1 className="order-widget__title">
                      Essential Skin Food™
                    </h1>
                    <p className="order-widget__sub">
                      Plant-based collagen support — firmer, smoother, more radiant skin
                      in as little as 4 weeks.†*
                    </p>
                  </div>

                  {/* Module 3 — Low-Stock Urgency (A/B P3-E: 'all') */}
                  {urgencyVariant === 'all' && (
                    <p
                      className="order-widget__stock"
                      role="status"
                      aria-live="polite"
                    >
                      <span className="order-widget__stock-dot" aria-hidden="true" />
                      Only {stockCount} units left at this price — order now to lock in
                      your discount
                    </p>
                  )}

                  {/* Countdown Timer (A/B P3-E: 'all' or 'timer-only') */}
                  {(urgencyVariant === 'all' || urgencyVariant === 'timer-only') && (
                    <CountdownTimer
                      label="Special pricing ends in:"
                      storageKey="order-timer"
                    />
                  )}

                  {/* Module 4 — Subscribe / One-Time Toggle */}
                  <SubscribeToggle subscribed={subscribed} onChange={setSubscribed} />

                  {/* Module 5 — Package Selector */}
                  <PackageSelector
                    selected={selectedPackage}
                    onChange={setSelectedPackage}
                    pricingVariant={pricingVariant}
                    subscribed={subscribed}
                  />

                  {/* Module 6 — Primary CTA */}
                  <button
                    type="button"
                    className="btn btn--primary btn--full order-cta"
                    onClick={scrollToForm}
                    aria-label={`Claim discounted supply — ${selectedPkgLabel}, $${grandTotal.toFixed(2)}`}
                    data-track="order-cta-click"
                    data-test-id="P3-A"
                  >
                    <span aria-hidden="true">🛒</span>{' '}
                    Claim My Discounted Supply →
                  </button>

                  {/* Module 7 — Express Pay (A/B P3-D: above purchase widget) */}
                  {expressPlacement === 'above' && <ExpressPay />}

                  {/* Module 8 — Trust Strip */}
                  <div
                    className="order-widget__trust"
                    aria-label="Purchase guarantees"
                  >
                    {[
                      { icon: '🔒', label: '256-bit secure checkout' },
                      { icon: '✓',  label: '90-day money-back' },
                      { icon: '🚚', label: 'Free US shipping $99+' },
                      { icon: '🌿', label: '100% plant-based' },
                    ].map(({ icon, label }) => (
                      <span key={label} className="order-widget__trust-item">
                        <span aria-hidden="true">{icon}</span> {label}
                      </span>
                    ))}
                  </div>

                  {/* Module 9 — Guarantee Badge */}
                  <div className="order-widget__guarantee" role="note">
                    <div
                      className="order-widget__guarantee-icon"
                      aria-hidden="true"
                    >
                      ✓
                    </div>
                    <div>
                      <p className="order-widget__guarantee-title">
                        90-Day ActivatedYou Promise
                      </p>
                      <p className="order-widget__guarantee-body">
                        Not thrilled? Return it within 90 days — even if used — for a
                        full refund. No questions asked.
                      </p>
                    </div>
                  </div>

                  {/* Module 10 — Order Bump */}
                  <OrderBump checked={bumpChecked} onChange={setBumpChecked} />

                </div>
                {/* end .order-col--right */}
              </div>
              {/* end .order-layout */}
            </div>
          </section>

          {/* ── Below Fold ── */}
          <div className="container container--narrow">

            <div className="order-divider" aria-hidden="true" />

            <BenefitsGrid />

            <div className="order-divider" aria-hidden="true" />

            <ReviewsSection />

            <RepeatCTABand onCtaClick={scrollToPurchaseWidget} />

            {/* ── Checkout Form ── */}
            <section
              className="order-checkout"
              aria-labelledby="checkout-heading"
              ref={formRef}
            >
              <h2 id="checkout-heading" className="order-checkout__heading">
                Secure Checkout
              </h2>

              {formError && (
                <div
                  ref={errorSummaryRef}
                  role="alert"
                  tabIndex={-1}
                  className="form-error-summary"
                >
                  <span aria-hidden="true">⚠</span> {formError}
                </div>
              )}

              <p className="required-note">
                <span aria-hidden="true">*</span> Required field
              </p>

              {/* Express pay ABOVE credit card form (A/B P3-D variant A) */}
              {expressPlacement !== 'above' && <ExpressPay />}

              <form
                noValidate
                aria-labelledby="checkout-heading"
                onSubmit={handleSubmit}
                className="order-form"
              >
                {/* ── Shipping ── */}
                <fieldset className="order-form__fieldset">
                  <legend className="order-form__legend">Shipping Information</legend>

                  <div className="order-form__row order-form__row--2col">
                    <FormField
                      id="first-name" label="First Name" required
                      autoComplete="given-name"
                      value={form['first-name']}
                      onChange={handleChange('first-name')}
                      onBlur={handleBlur('first-name')}
                      errorMessage={errors['first-name']}
                    />
                    <FormField
                      id="last-name" label="Last Name" required
                      autoComplete="family-name"
                      value={form['last-name']}
                      onChange={handleChange('last-name')}
                      onBlur={handleBlur('last-name')}
                      errorMessage={errors['last-name']}
                    />
                  </div>

                  <FormField
                    id="email" label="Email Address" type="email" required
                    autoComplete="email" placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    errorMessage={errors.email}
                    helpText="We'll send your order confirmation here."
                  />

                  <FormField
                    id="tel" label="Phone Number" type="tel" required
                    autoComplete="tel" placeholder="(555) 555-5555"
                    value={form.tel}
                    onChange={handleChange('tel')}
                    onBlur={handleBlur('tel')}
                    errorMessage={errors.tel}
                    hint="For delivery updates only."
                  />

                  <FormField
                    id="address-line1" label="Street Address" required
                    autoComplete="address-line1" placeholder="123 Main St"
                    value={form['address-line1']}
                    onChange={handleChange('address-line1')}
                    onBlur={handleBlur('address-line1')}
                    errorMessage={errors['address-line1']}
                  />

                  <div className="order-form__row order-form__row--3col">
                    <FormField
                      id="city" label="City" required
                      autoComplete="address-level2"
                      value={form.city}
                      onChange={handleChange('city')}
                      onBlur={handleBlur('city')}
                      errorMessage={errors.city}
                    />
                    <FormField
                      id="state" label="State" required
                      autoComplete="address-level1" placeholder="CA"
                      value={form.state}
                      onChange={handleChange('state')}
                      onBlur={handleBlur('state')}
                      errorMessage={errors.state}
                    />
                    <FormField
                      id="postal-code" label="ZIP Code" required
                      autoComplete="postal-code"
                      inputMode="numeric" pattern="[0-9]*" placeholder="90210"
                      value={form['postal-code']}
                      onChange={handleChange('postal-code')}
                      onBlur={handleBlur('postal-code')}
                      errorMessage={errors['postal-code']}
                    />
                  </div>
                </fieldset>

                {/* ── Payment ── */}
                <fieldset className="order-form__fieldset">
                  <legend className="order-form__legend">Payment Information</legend>

                  <p className="order-form__security-note">
                    <span aria-hidden="true">🔒</span>{' '}
                    256-bit SSL encryption — your data is safe.
                  </p>

                  <FormField
                    id="card-number" label="Card Number" required
                    autoComplete="cc-number" inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form['card-number']}
                    onChange={handleChange('card-number')}
                    onBlur={handleBlur('card-number')}
                    errorMessage={errors['card-number']}
                  />

                  <div className="order-form__row order-form__row--2col">
                    <FormField
                      id="card-expiry" label="Expiry Date" required
                      autoComplete="cc-exp" placeholder="MM/YY"
                      value={form['card-expiry']}
                      onChange={handleChange('card-expiry')}
                      onBlur={handleBlur('card-expiry')}
                      errorMessage={errors['card-expiry']}
                    />

                    {/* CVV with tooltip — "What's this?" for 40+ users */}
                    <div className="form-field">
                      <label htmlFor="cvv" className="form-field__label">
                        Security Code (CVV){' '}
                        <span aria-hidden="true">*</span>
                        <button
                          type="button"
                          className="cvv-help-btn"
                          aria-label="What is a CVV security code?"
                          aria-expanded={cvvTooltipOpen}
                          aria-controls="cvv-tooltip"
                          onClick={() => setCvvTooltipOpen((v) => !v)}
                        >
                          <span aria-hidden="true">?</span>
                        </button>
                      </label>
                      {cvvTooltipOpen && (
                        <div id="cvv-tooltip" role="tooltip" className="cvv-tooltip">
                          The 3-digit code on the back of your Visa or Mastercard.
                          American Express cards use a 4-digit code on the front.
                        </div>
                      )}
                      <input
                        type="text" id="cvv" name="cvv"
                        className={`form-field__input${errors.cvv ? ' form-field--error' : ''}`}
                        required aria-required="true"
                        autoComplete="cc-csc" inputMode="numeric"
                        placeholder="123" maxLength={4}
                        value={form.cvv}
                        onChange={handleChange('cvv')}
                        onBlur={handleBlur('cvv')}
                        aria-describedby={`cvv-tooltip${errors.cvv ? ' cvv-error' : ''}`}
                        aria-invalid={errors.cvv ? 'true' : undefined}
                      />
                      {errors.cvv && (
                        <span id="cvv-error" role="alert" className="form-field__error">
                          <span aria-hidden="true">⚠</span> {errors.cvv}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Express pay BELOW card form (A/B P3-D variant B) */}
                  {expressPlacement === 'below' && <ExpressPay />}
                </fieldset>

                {/* ── Order Summary ── */}
                <section
                  className="order-summary"
                  aria-labelledby="order-summary-heading"
                >
                  <h3 id="order-summary-heading" className="order-summary__heading">
                    Order Summary
                  </h3>
                  <table
                    className="order-summary__table"
                    aria-label="Order breakdown"
                  >
                    <tbody>
                      <tr>
                        <td>Essential Skin Food ({selectedPkgLabel})</td>
                        <td className="order-summary__amount">
                          ${baseTotal.toFixed(2)}
                        </td>
                      </tr>
                      {bumpChecked && (
                        <tr>
                          <td>BioCollagen Complex (Add-on)</td>
                          <td className="order-summary__amount">$34.00</td>
                        </tr>
                      )}
                      <tr>
                        <td>Shipping</td>
                        <td className="order-summary__amount">
                          {shipping === 0 ? (
                            <span className="order-summary__free">FREE</span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="order-summary__total-row">
                        <th scope="row">Total Today</th>
                        <td className="order-summary__total-amount">
                          ${(grandTotal + shipping).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </section>

                {/* ── Guarantee ── */}
                <div className="order-guarantee" role="note">
                  <span aria-hidden="true" style={{ fontSize: '2rem' }}>🛡️</span>
                  <div>
                    <strong>90-Day Money-Back Guarantee</strong>
                    <p className="supporting-text">
                      Not satisfied? Get a full refund — no questions asked.
                    </p>
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  className="btn btn--primary btn--full order-submit-btn"
                  aria-label={`Place order for ${selectedPkgLabel} — $${(grandTotal + shipping).toFixed(2)}`}
                  data-track="checkout-submit"
                >
                  <span aria-hidden="true">🔒</span>{' '}
                  Place My Secure Order — ${(grandTotal + shipping).toFixed(2)}
                </button>

                <p className="order-form__disclaimer supporting-text">
                  By placing your order you agree to our{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Terms &amp; Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>
                    Privacy Policy
                  </a>.
                  {subscribed
                    ? ' Your subscription renews monthly. Cancel anytime.'
                    : ' This is a one-time purchase — no subscription.'}
                </p>
              </form>
            </section>

            {/* ── Delivery Estimate ── */}
            <section className="delivery-estimate" aria-label="Estimated delivery">
              <p>
                <span aria-hidden="true">🚚</span>{' '}
                Order by <time dateTime="14:00">2:00 PM EST</time> today and your package
                ships <strong>same day</strong>. Estimated arrival:{' '}
                <time dateTime={deliveryDateAttr()}>{deliveryDateDisplay()}</time>.
              </p>
            </section>

            {/* ── FAQ ── */}
            <section className="order-faq" aria-labelledby="order-faq-heading">
              <h2 id="order-faq-heading" className="order-faq__heading">
                Common Questions
              </h2>
              <FAQAccordion faqs={ORDER_FAQS} />
            </section>

            {/* ── FDA Disclaimer ── */}
            <p className="fda-disclaimer" role="note">
              †These statements have not been evaluated by the Food and Drug Administration.
              This product is not intended to diagnose, treat, cure, or prevent any disease.
              Individual results may vary. ActivatedYou®, Santa Monica, CA.
            </p>

          </div>
          {/* end below fold */}
        </main>
      </div>

      <StickyBuyBar
        onCtaClick={scrollToForm}
        selectedPackage={selectedPkgLabel}
        price={priceLabel}
      />
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════════════════ */

function OrderStickyNav() {
  return (
    <nav className="order-sticky-nav" aria-label="Store navigation">
      <span className="order-sticky-nav__brand">ActivatedYou</span>

      {/* Desktop: 3 trust micro-items */}
      <div className="order-sticky-nav__trust" aria-hidden="true">
        <span className="order-sticky-nav__trust-item">
          <span>🔒</span> Secure checkout
        </span>
        <span className="order-sticky-nav__trust-item">
          <span>✓</span> 90-day guarantee
        </span>
        <span className="order-sticky-nav__trust-item">
          <span>🚚</span> Free US shipping $99+
        </span>
      </div>

      {/* Mobile: lock icon only */}
      <span className="order-sticky-nav__lock" aria-hidden="true">🔒</span>
    </nav>
  );
}

function ExpressPay() {
  return (
    <div className="express-pay" aria-label="Express checkout options">
      <p className="express-pay__label">
        <span className="express-pay__line" aria-hidden="true" />
        Express Checkout
        <span className="express-pay__line" aria-hidden="true" />
      </p>
      <div className="express-pay__buttons">
        <button
          type="button"
          className="btn-express"
          aria-label="Pay with Apple Pay"
          onClick={() => alert('Apple Pay integration required')}
        >
          <span aria-hidden="true">🍎</span> Apple Pay
        </button>
        <button
          type="button"
          className="btn-express"
          aria-label="Pay with PayPal"
          onClick={() => alert('PayPal integration required')}
        >
          <span aria-hidden="true">🅿️</span> PayPal
        </button>
      </div>
      <p className="express-pay__or">— or pay with card below —</p>
    </div>
  );
}

function BenefitsGrid() {
  return (
    <section className="order-benefits" aria-labelledby="benefits-heading">
      <h2 id="benefits-heading" className="order-benefits__heading">
        4 Reasons 67,000+ Women Trust Essential Skin Food
      </h2>
      <div className="order-benefits__grid">
        {BENEFITS.map((b) => (
          <div key={b.title} className="benefit-card">
            <div className="benefit-card__icon" aria-hidden="true">{b.icon}</div>
            <h3 className="benefit-card__title">{b.title}</h3>
            <p className="benefit-card__body">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section
      className="order-reviews"
      id="reviews"
      aria-labelledby="reviews-heading"
    >
      <h2 id="reviews-heading" className="order-reviews__heading">
        Real results from real women
      </h2>
      <div className="order-reviews__grid">
        {REVIEWS.map((r) => (
          <article key={r.id} className="review-card">
            <div
              className="review-card__stars"
              aria-label={`${r.stars} out of 5 stars`}
            >
              {'★'.repeat(r.stars)}
            </div>
            <blockquote className="review-card__quote">
              <p>"{r.quote}"</p>
            </blockquote>
            <cite className="review-card__cite">
              <span className="review-card__avatar" aria-hidden="true">
                {r.initials}
              </span>
              <span className="review-card__author">
                <strong>{r.name}</strong>
                <span className="review-card__meta">
                  Verified Buyer · Age {r.age}
                </span>
              </span>
            </cite>
          </article>
        ))}
      </div>
    </section>
  );
}

function RepeatCTABand({ onCtaClick }) {
  return (
    <section
      className="order-repeat-cta"
      aria-labelledby="repeat-cta-heading"
    >
      <h2 id="repeat-cta-heading" className="order-repeat-cta__heading">
        Ready to transform your skin from the inside out?
      </h2>
      <p className="order-repeat-cta__sub">
        Join 67,000+ women already seeing results. 90-day guarantee — try it risk-free.
      </p>
      <button
        type="button"
        className="btn btn--primary order-repeat-cta__btn"
        onClick={onCtaClick}
        data-track="repeat-cta-click"
      >
        Claim My Discounted Supply →
      </button>
    </section>
  );
}

/* ── Delivery date helpers ───────────────────────────────────────────────── */
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

function deliveryDateAttr() {
  return addBusinessDays(new Date(), 5).toISOString().split('T')[0];
}

function deliveryDateDisplay() {
  const start = addBusinessDays(new Date(), 3);
  const end   = addBusinessDays(new Date(), 5);
  const opts  = { month: 'long', day: 'numeric' };
  const fmt   = (d) => d.toLocaleDateString('en-US', opts);
  return `${fmt(start)} – ${fmt(end)}`;
}
