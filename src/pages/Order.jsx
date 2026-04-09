import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/global.css';
import './Order.css';
import TrustBar from '../components/TrustBar';
import PackageSelector, { PACKAGES } from '../components/PackageCard';
import OrderBump from '../components/OrderBump';
import CountdownTimer from '../components/CountdownTimer';
import FAQAccordion from '../components/FAQAccordion';
import StickyBuyBar from '../components/StickyBuyBar';
import FormField from '../components/FormField';
import { getVariant } from '../utils/abTest';

/* ── Validation helpers ──────────────────────────────────────────────────── */
const validators = {
  'first-name': (v) => v.trim().length > 0
    ? null : 'Please enter your first name.',
  'last-name': (v) => v.trim().length > 0
    ? null : 'Please enter your last name.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    ? null : 'Please enter a valid email address (e.g., name@example.com).',
  tel: (v) => /^\+?[\d\s\-().]{7,}$/.test(v)
    ? null : 'Please enter a valid phone number.',
  'address-line1': (v) => v.trim().length > 0
    ? null : 'Please enter your street address.',
  city: (v) => v.trim().length > 0
    ? null : 'Please enter your city.',
  state: (v) => v.trim().length >= 2
    ? null : 'Please enter your state.',
  'postal-code': (v) => /^\d{5}(-\d{4})?$/.test(v)
    ? null : 'Please enter a valid ZIP code (e.g., 90210).',
  'card-number': (v) => /^\d[\d\s]{13,18}\d$/.test(v)
    ? null : 'Please enter a valid 16-digit card number.',
  'card-expiry': (v) => /^(0[1-9]|1[0-2])\/(\d{2}|\d{4})$/.test(v)
    ? null : 'Please enter a valid expiry date (MM/YY).',
  cvv: (v) => /^\d{3,4}$/.test(v)
    ? null : 'Please enter your 3 or 4 digit security code.',
};

const INITIAL_FORM = {
  'first-name': '', 'last-name': '', email: '', tel: '',
  'address-line1': '', city: '', state: '', 'postal-code': '',
  'card-number': '', 'card-expiry': '', cvv: '',
};

const ORDER_FAQS = [
  { id: 'ofaq-1', question: 'Is my payment information secure?',
    answer: 'Absolutely. Your payment is processed through 256-bit SSL encryption — the same technology used by major banks. We never store your full card number and comply with PCI DSS standards.' },
  { id: 'ofaq-2', question: 'When will my order ship?',
    answer: 'Orders placed before 2pm EST ship same day (Monday–Friday). Standard US delivery is 3–5 business days. You will receive a tracking email once your order ships.' },
  { id: 'ofaq-3', question: 'What if it does not work for me?',
    answer: 'No problem. You are covered by our 90-day money-back guarantee. Simply contact our support team at support@activatedyou.com or call 800-720-8403 and we will issue a full refund — no questions asked.' },
  { id: 'ofaq-4', question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time by calling 800-720-8403 or emailing support@activatedyou.com. There are no cancellation fees and no contracts.' },
];

export default function Order() {
  const navigate = useNavigate();

  /* ── A/B Variants ── */
  const defaultPkg = getVariant('P3-A') === '6-bottle' ? '6-bottle' : '3-bottle';
  const expressPayPlacement = getVariant('P3-D'); // 'above' or 'below'
  const urgencyVariant = getVariant('P3-E');       // 'all', 'timer-only', 'none'
  const pricingVariant = getVariant('P3-B');       // 'per-day' or 'per-bottle'
  const subscribeDefault = getVariant('P3-C') === 'subscribe';

  /* ── State ── */
  const [selectedPackage, setSelectedPackage] = useState(defaultPkg);
  const [subscribed, setSubscribed] = useState(subscribeDefault);
  const [bumpChecked, setBumpChecked] = useState(false);
  const [cvvTooltipOpen, setCvvTooltipOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState(null);

  const formRef = useRef(null);
  const errorSummaryRef = useRef(null);

  /* ── Derived values ── */
  const pkg = PACKAGES.find((p) => p.value === selectedPackage) || PACKAGES[1];
  const unitPrice = subscribed ? pkg.subscribePrice : pkg.pricePerBottle;
  const baseTotal = subscribed
    ? pkg.subscribePrice * pkg.bottles
    : pkg.priceTotal;
  const bumpTotal = bumpChecked ? 34 : 0;
  const grandTotal = baseTotal + bumpTotal;

  /* ── Handlers ── */
  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (touched[field]) {
      setErrors((err) => ({ ...err, [field]: validators[field]?.(e.target.value) ?? null }));
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
    setSubmitted(true);
    if (!validateAll()) {
      setFormError('Please fix the errors below before continuing.');
      // Move focus to error summary for screen readers
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
      return;
    }
    setFormError(null);
    navigate('/upsell-1');
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedPkgLabel = `${pkg.bottles}-Bottle (${pkg.days}-Day Supply)`;
  const priceLabel = `$${grandTotal.toFixed(2)}`;

  return (
    <>
      <div className="order-page">
        {/* ── Trust Bar ── */}
        <TrustBar />

        <main id="main-content" className="order-page__main">
          {/* ── Hero ── */}
          <section className="order-hero" aria-labelledby="order-hero-heading">
            <div className="container container--narrow">
              <h1 id="order-hero-heading" className="order-hero__heading">
                You're One Step Away From Firmer, Younger-Looking Skin
              </h1>
              <p className="order-hero__sub">
                Choose your package below — save up to 40% today.
                Free US shipping on orders $99+.
              </p>

              {/* Urgency elements — A/B Test P3-E */}
              {(urgencyVariant === 'all' || urgencyVariant === 'timer-only') && (
                <div className="order-hero__urgency">
                  <CountdownTimer label="Special pricing ends in:" />
                </div>
              )}

              {urgencyVariant === 'all' && (
                <p className="inventory-alert" role="status">
                  <span aria-hidden="true">⚠️</span>{' '}
                  Only 14 units left at this price
                </p>
              )}
            </div>
          </section>

          <div className="container container--narrow">

            {/* ── Package Selector ── */}
            <section className="order-section" aria-labelledby="package-section-heading">
              <h2 id="package-section-heading" className="sr-only">
                Choose Your Package
              </h2>
              <PackageSelector
                selected={selectedPackage}
                onChange={setSelectedPackage}
                pricingVariant={pricingVariant}
              />

              {/* Subscribe & Save toggle */}
              <div className="subscribe-toggle">
                <label className="subscribe-toggle__label" htmlFor="subscribe">
                  <input
                    type="checkbox"
                    id="subscribe"
                    name="subscribe"
                    checked={subscribed}
                    onChange={(e) => setSubscribed(e.target.checked)}
                    className="subscribe-toggle__checkbox"
                    aria-describedby="subscribe-desc"
                  />
                  <span className="subscribe-toggle__text">
                    Subscribe &amp; Save an extra 10%
                    {subscribed && (
                      <strong className="subscribe-toggle__badge"> — Active!</strong>
                    )}
                  </span>
                </label>
                <p id="subscribe-desc" className="subscribe-toggle__info">
                  Receive monthly. Cancel anytime by calling 800-720-8403. No fees.
                </p>
              </div>

              {/* Order total preview */}
              <div className="order-total-preview" aria-live="polite" aria-atomic="true">
                <span className="order-total-preview__label">Your total today:</span>
                <span className="order-total-preview__amount">
                  ${grandTotal.toFixed(2)}
                </span>
                {subscribed && (
                  <span className="order-total-preview__note">
                    (Subscribe &amp; Save applied)
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn btn--primary btn--full order-cta"
                onClick={scrollToForm}
                aria-label={`Continue to checkout — ${selectedPkgLabel}, $${grandTotal.toFixed(2)}`}
              >
                Continue to Secure Checkout →
              </button>
            </section>

            {/* ── Social Proof ── */}
            <section className="order-proof" aria-label="Customer reviews summary">
              <div className="order-proof__rating">
                <span className="stars" aria-label="4.8 out of 5 stars">★★★★★</span>
                <span className="order-proof__score">4.8/5</span>
              </div>
              <p className="order-proof__count">
                Trusted by <strong>67,000+</strong> women over 40
              </p>
            </section>

            {/* ── Order Form ── */}
            <section
              className="order-form-section"
              aria-labelledby="checkout-heading"
              ref={formRef}
            >
              <h2 id="checkout-heading" className="order-form-section__heading">
                Secure Checkout
              </h2>

              {/* Error summary — announced by screen readers */}
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

              {/* ── Express Pay (A/B Test P3-D: position above or below CC) ── */}
              {expressPayPlacement === 'above' && <ExpressPay />}

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
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    errorMessage={errors.email}
                    helpText="We'll send your order confirmation here."
                  />

                  <FormField
                    id="tel" label="Phone Number" type="tel" required
                    autoComplete="tel"
                    placeholder="(555) 555-5555"
                    value={form.tel}
                    onChange={handleChange('tel')}
                    onBlur={handleBlur('tel')}
                    errorMessage={errors.tel}
                    hint="For delivery updates only."
                  />

                  <FormField
                    id="address-line1" label="Street Address" required
                    autoComplete="address-line1"
                    placeholder="123 Main St"
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
                      autoComplete="address-level1"
                      placeholder="CA"
                      value={form.state}
                      onChange={handleChange('state')}
                      onBlur={handleBlur('state')}
                      errorMessage={errors.state}
                    />
                    <FormField
                      id="postal-code" label="ZIP Code" required
                      autoComplete="postal-code"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="90210"
                      value={form['postal-code']}
                      onChange={handleChange('postal-code')}
                      onBlur={handleBlur('postal-code')}
                      errorMessage={errors['postal-code']}
                    />
                  </div>
                </fieldset>

                {/* ── Order Bump (above payment per A/B Test P4-B default) ── */}
                <div className="order-bump-wrapper">
                  <OrderBump checked={bumpChecked} onChange={setBumpChecked} />
                </div>

                {/* ── Payment ── */}
                <fieldset className="order-form__fieldset">
                  <legend className="order-form__legend">Payment Information</legend>

                  <p className="order-form__security-note">
                    <span aria-hidden="true">🔒</span>{' '}
                    256-bit SSL encryption — your data is safe.
                  </p>

                  <FormField
                    id="card-number" label="Card Number" required
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form['card-number']}
                    onChange={handleChange('card-number')}
                    onBlur={handleBlur('card-number')}
                    errorMessage={errors['card-number']}
                  />

                  <div className="order-form__row order-form__row--2col">
                    <FormField
                      id="card-expiry" label="Expiry Date" required
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                      value={form['card-expiry']}
                      onChange={handleChange('card-expiry')}
                      onBlur={handleBlur('card-expiry')}
                      errorMessage={errors['card-expiry']}
                    />

                    {/* CVV with tooltip */}
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
                        <div
                          id="cvv-tooltip"
                          role="tooltip"
                          className="cvv-tooltip"
                        >
                          The 3-digit code on the back of your Visa or Mastercard.
                          American Express cards use a 4-digit code on the front.
                        </div>
                      )}

                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        className={`form-field__input ${errors.cvv ? 'form-field--error' : ''}`}
                        required
                        aria-required="true"
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        placeholder="123"
                        maxLength={4}
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

                  {/* Express pay below CC (A/B Test P3-D variant B) */}
                  {expressPayPlacement === 'below' && <ExpressPay />}
                </fieldset>

                {/* ── Order Summary ── */}
                <section
                  className="order-summary"
                  aria-labelledby="order-summary-heading"
                >
                  <h3 id="order-summary-heading" className="order-summary__heading">
                    Order Summary
                  </h3>
                  <table className="order-summary__table" aria-label="Order breakdown">
                    <tbody>
                      <tr>
                        <td>Essential Skin Food ({selectedPkgLabel})</td>
                        <td className="order-summary__amount">${baseTotal.toFixed(2)}</td>
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
                          {grandTotal >= 99 ? (
                            <span className="order-summary__free">FREE</span>
                          ) : '$7.95'}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="order-summary__total-row">
                        <th scope="row">Total Today</th>
                        <td className="order-summary__total-amount">
                          ${(grandTotal + (grandTotal >= 99 ? 0 : 7.95)).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </section>

                {/* ── Guarantee + Submit ── */}
                <div className="order-guarantee">
                  <div className="guarantee-badge">
                    <span aria-hidden="true" style={{ fontSize: '2rem' }}>🛡️</span>
                    <div>
                      <strong>90-Day Money-Back Guarantee</strong>
                      <p className="supporting-text">
                        Not satisfied? Get a full refund — no questions asked.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn--primary btn--full order-submit-btn"
                  aria-label={`Place order for ${selectedPkgLabel} — $${grandTotal.toFixed(2)}`}
                >
                  <span aria-hidden="true">🔒</span>{' '}
                  Place My Secure Order — ${grandTotal.toFixed(2)}
                </button>

                <p className="order-form__disclaimer supporting-text">
                  By placing your order you agree to our{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms &amp; Conditions</a>{' '}
                  and{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
                  {subscribed
                    ? ' Your subscription will renew monthly. Cancel anytime.'
                    : ' This is a one-time purchase — no subscription.'}
                </p>
              </form>
            </section>

            {/* ── Delivery Estimate ── */}
            <section className="delivery-estimate" aria-label="Estimated delivery">
              <p>
                <span aria-hidden="true">🚚</span>{' '}
                Order by <time dateTime="14:00">2:00 PM EST</time> today and
                your package ships <strong>same day</strong>.
                Estimated arrival:{' '}
                <time dateTime={deliveryDateAttr()}>
                  {deliveryDateDisplay()}
                </time>.
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
              Individual results may vary.
            </p>
          </div>
        </main>
      </div>

      {/* Sticky mobile CTA */}
      <StickyBuyBar
        onCtaClick={scrollToForm}
        selectedPackage={selectedPkgLabel}
        price={priceLabel}
      />
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function ExpressPay() {
  return (
    <div className="express-pay" aria-label="Express checkout options">
      <p className="express-pay__label">
        <span className="express-pay__line" aria-hidden="true"></span>
        Express Checkout
        <span className="express-pay__line" aria-hidden="true"></span>
      </p>
      <div className="express-pay__buttons">
        <button
          type="button"
          className="btn-express btn-express--apple"
          aria-label="Pay with Apple Pay"
          onClick={() => alert('Apple Pay integration required')}
        >
          <span aria-hidden="true">🍎</span> Apple Pay
        </button>
        <button
          type="button"
          className="btn-express btn-express--paypal"
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
  const d = addBusinessDays(new Date(), 5);
  return d.toISOString().split('T')[0];
}

function deliveryDateDisplay() {
  const start = addBusinessDays(new Date(), 3);
  const end   = addBusinessDays(new Date(), 5);
  const opts  = { month: 'long', day: 'numeric' };
  const fmt   = (d) => d.toLocaleDateString('en-US', opts);
  return `${fmt(start)} – ${fmt(end)}`;
}
