/**
 * A/B Test Utility — ActivatedYou Essential Skin Food Funnel
 *
 * Variant assignment is stored in sessionStorage so urgency elements persist
 * across the funnel session but reset on new sessions (prevents stale urgency).
 *
 * Usage:
 *   import { getVariant, setVariant, initVariants } from '../utils/abTest';
 *
 *   // URL override: ?variant={"P3-A":"B","P4-A":"A"}
 *   // Read variant in a component:
 *   const pkg = getVariant('P3-A'); // returns 'A' or 'B'
 */

const STORAGE_KEY = 'asf_ab_variants';

/**
 * Active test definitions.
 * Each test has:
 *   - description: what is being tested
 *   - metric: primary success metric
 *   - expectedLift: documented expected range
 *   - tier: 1 (run first), 2, or 3
 */
export const AB_TESTS = {
  'P1-A': {
    description: 'Presell vs. Direct-to-Order',
    variants: ['presell', 'direct'],
    metric: 'CVR + ROAS',
    expectedLift: '+15–40% CVR on cold traffic',
    tier: 1,
  },
  'P2-A': {
    description: 'VSL vs. Long-Form Static',
    variants: ['vsl', 'static'],
    metric: 'CVR by traffic source',
    expectedLift: '±10–20% CVR delta by source',
    tier: 2,
  },
  'P2-B': {
    description: 'Delayed CTA: Immediate vs. 15-second timer',
    variants: ['immediate', 'delayed'],
    metric: 'CTA click rate',
    expectedLift: 'Standard VSL best practice',
    tier: 2,
  },
  'P3-A': {
    description: 'Default Package: 3-bottle vs. 6-bottle pre-selected',
    variants: ['3-bottle', '6-bottle'],
    metric: 'Revenue Per Visitor (RPV)',
    expectedLift: '+15–25% AOV lift',
    tier: 1,
  },
  'P3-B': {
    description: 'Per-Day vs. Per-Bottle Pricing display',
    variants: ['per-day', 'per-bottle'],
    metric: 'CVR + tier distribution',
    expectedLift: '+5–15% CVR',
    tier: 2,
  },
  'P3-C': {
    description: 'Subscribe Default: One-time vs. subscribe pre-checked',
    variants: ['one-time', 'subscribe'],
    metric: 'Subscribe take rate + 60-day churn',
    expectedLift: 'Variable — monitor churn',
    tier: 3,
  },
  'P3-D': {
    description: 'Express Pay Placement: Above vs. below credit card',
    variants: ['above', 'below'],
    metric: 'Mobile checkout completion',
    expectedLift: '+5–15% mobile CVR',
    tier: 1,
  },
  'P3-E': {
    description: 'Urgency Stack: All elements vs. timer-only vs. none',
    variants: ['all', 'timer-only', 'none'],
    metric: 'CVR + return visitor behavior',
    expectedLift: 'Variable — trust impact',
    tier: 2,
  },
  'P4-A': {
    description: 'Order Bump Default State: Unchecked vs. pre-checked',
    variants: ['unchecked', 'checked'],
    metric: 'Bump take rate vs. overall CVR',
    expectedLift: '+10–30% AOV, risk of CVR loss',
    tier: 2,
  },
  'P4-B': {
    description: 'Order Bump Placement: Above vs. below payment section',
    variants: ['above-payment', 'below-payment'],
    metric: 'Bump take rate',
    expectedLift: 'Context dependent',
    tier: 3,
  },
  'P4-C': {
    description: 'Bump Offer Type: Complementary product vs. quantity upgrade',
    variants: ['complementary', 'quantity'],
    metric: 'Bump take rate × AOV',
    expectedLift: 'Variable',
    tier: 3,
  },
  'P5-A': {
    description: 'OTO Offer Type: Quantity upgrade vs. complementary product',
    variants: ['quantity', 'complementary'],
    metric: 'OTO take rate × AOV lift',
    expectedLift: '$2–3 AOV lift can turn marginal funnel profitable',
    tier: 1,
  },
  'P5-B': {
    description: 'OTO Headline: Scarcity frame vs. Results frame',
    variants: ['scarcity', 'results'],
    metric: 'OTO CVR + LTV proxy (AOV)',
    expectedLift: 'Results frame → higher-LTV buyers',
    tier: 3,
  },
  'P6-A': {
    description: 'Downsell vs. Skip: Show downsell page vs. go to thank-you',
    variants: ['show', 'skip'],
    metric: 'Incremental revenue vs. friction cost',
    expectedLift: 'Net revenue impact',
    tier: 3,
  },
  'P7-A': {
    description: 'Cross-Sell Format: Static cards vs. Amazon-style FBT',
    variants: ['static', 'amazon-fbt'],
    metric: 'Post-purchase click rate',
    expectedLift: 'Amazon-style lifts post-purchase clicks',
    tier: 3,
  },
};

/**
 * Retrieve all stored variants from sessionStorage.
 * @returns {Object} key-value map of testId -> variant
 */
function getStoredVariants() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persist variant assignments to sessionStorage.
 * @param {Object} variants
 */
function saveVariants(variants) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(variants));
  } catch {
    // sessionStorage unavailable — continue without persistence
  }
}

/**
 * Parse URL ?abtest= override param.
 * Supports: ?abtest={"P3-A":"B","P4-A":"A"}
 * @returns {Object}
 */
function getUrlOverrides() {
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('abtest');
    return raw ? JSON.parse(decodeURIComponent(raw)) : {};
  } catch {
    return {};
  }
}

/**
 * Initialize all variant assignments for a session.
 * - URL overrides take highest priority
 * - Previously stored assignments are preserved (funnel consistency)
 * - New assignments are randomly generated (50/50 or equal-weight)
 *
 * Call once at app startup (e.g., in App.jsx useEffect).
 */
export function initVariants() {
  const stored = getStoredVariants();
  const urlOverrides = getUrlOverrides();
  const merged = { ...stored, ...urlOverrides };

  // Assign any tests that don't yet have a variant
  Object.entries(AB_TESTS).forEach(([testId, test]) => {
    if (!merged[testId]) {
      const idx = Math.floor(Math.random() * test.variants.length);
      merged[testId] = test.variants[idx];
    }
  });

  saveVariants(merged);
  return merged;
}

/**
 * Get the assigned variant for a specific test.
 * @param {string} testId — e.g. 'P3-A'
 * @returns {string} variant value (e.g. '3-bottle', 'B', 'above')
 */
export function getVariant(testId) {
  const variants = getStoredVariants();
  return variants[testId] ?? AB_TESTS[testId]?.variants[0] ?? 'A';
}

/**
 * Manually set a variant (for testing/QA purposes).
 * @param {string} testId
 * @param {string} variant
 */
export function setVariant(testId, variant) {
  const variants = getStoredVariants();
  variants[testId] = variant;
  saveVariants(variants);
}

/**
 * Sample size calculator for 95% confidence.
 * Formula: n = 16 × (p × (1-p)) / MDE²
 * @param {number} baselineCVR — e.g. 0.03 for 3%
 * @param {number} mdeRelative — minimum detectable effect as relative lift, e.g. 0.10 for 10%
 * @returns {number} minimum sample per variant
 */
export function calcSampleSize(baselineCVR, mdeRelative = 0.1) {
  const mdeAbsolute = baselineCVR * mdeRelative;
  return Math.ceil(16 * (baselineCVR * (1 - baselineCVR)) / (mdeAbsolute ** 2));
}
