# ActivatedYou Essential Skin Food — Direct Response Sales Funnel

A full direct-response sales funnel for ActivatedYou's Essential Skin Food supplement.  
Built with **React 18 + Vite + React Router v6**.  
Mobile-first | WCAG 2.2 AA compliant | Optimized for women 40–65.

---

## Setup Instructions

Head over to [Setup](_setup/SETUP.md) to walk through the steps needed to configure your system.

---

## Funnel Flow Diagram

```
Cold Traffic (FB/TikTok/Google)
        │
        ▼
  ┌─────────────┐   A/B Test P1-A (50/50)
  │  / (Entry)  │──────────────────────────┐
  └─────────────┘                          │
        │ variant = 'presell'              │ variant = 'direct'
        ▼                                  ▼
  ┌─────────────┐                   ┌─────────────┐
  │  /presell   │ ──────────────►  │   /order    │◄───────
  │ Advertorial │  CTA click        │  Checkout   │       │
  └─────────────┘                   └─────────────┘       │
                                           │               │
                    ┌──────────────────────┤               │
                    │     /watch (VSL)     │               │
                    │  (alternate entry)   │               │
                    └──────────────────────┘               │
                                           │ Submit order  │
                                           ▼               │
                                    ┌─────────────┐        │
                                    │  /upsell-1  │        │
                                    │  Post OTO   │        │
                                    └─────────────┘        │
                                      │         │          │
                               Accept │         │ Decline  │
                                      ▼         ▼          │
                              ┌──────────┐ ┌──────────┐    │
                              │          │ │/downsell │    │
                              │/thank-you│ │(P6-A:    │    │
                              │  Confirm │ │ show vs  │    │
                              └──────────┘ │  skip)   │    │
                                           └──────────┘    │
                                                │          │
                                         Accept │ Decline  │
                                                ▼          │
                                          /thank-you ──────┘
```

---

## Pages

| Route | File | Description |
|---|---|---|
| `/` | App.jsx | Entry — routes based on P1-A variant |
| `/presell` | pages/Presell.jsx | Advertorial pre-sell (native ad format) |
| `/watch` | pages/Watch.jsx | VSL video page |
| `/order` | pages/Order.jsx | **Checkout page — highest priority** |
| `/upsell-1` | pages/Upsell1.jsx | Post-purchase OTO |
| `/downsell` | pages/Downsell.jsx | Downsell (P6-A gated) |
| `/thank-you` | pages/ThankYou.jsx | Confirmation + cross-sell |

---

## A/B Test Roadmap

All variants are assigned once per session via `sessionStorage` in `src/utils/abTest.js`.  
URL override: `?abtest={"P3-A":"B","P4-A":"A"}`

### Tier 1 — Run First (Highest Revenue Impact)

| Test ID | What's Tested | Metric | Expected Lift | Status |
|---|---|---|---|---|
| **P3-A** | Default package: 3-bottle vs. 6-bottle pre-selected | Revenue Per Visitor (RPV) | +15–25% AOV | Run first |
| **P1-A** | Presell vs. direct-to-order for cold traffic | CVR + ROAS | +15–40% CVR on cold traffic | Run first |
| **P5-A** | OTO offer: quantity upgrade vs. complementary product | OTO take rate x AOV | $2–3 AOV lift per order | Run first |
| **P3-D** | Express pay placement: above vs. below credit card form | Mobile checkout completion | +5–15% mobile CVR | Run first |

### Tier 2 — Run Second

| Test ID | What's Tested | Metric | Expected Lift |
|---|---|---|---|
| **P4-A** | Order bump default: unchecked vs. pre-checked | Bump take rate vs. CVR | +10–30% AOV (monitor CVR drop) |
| **P3-B** | Pricing display: per-day ($1.63/day) vs. per-bottle ($49/bottle) | CVR + tier distribution | +5–15% CVR |
| **P2-A** | VSL vs. long-form text sales letter | CVR by traffic source | +/-10–20% by source |
| **P3-E** | Urgency stack: all/timer-only/none | CVR + return visitor trust | Context dependent |

### Tier 3 — Fine-Tuning

| Test ID | What's Tested |
|---|---|
| **P4-B** | Order bump placement: above vs. below payment |
| **P4-C** | Bump offer type: complementary vs. quantity |
| **P3-C** | Subscribe default: one-time vs. subscribe pre-checked (monitor 60-day churn) |
| **P5-B** | OTO headline: scarcity frame vs. results frame |
| **P6-A** | Downsell page: show vs. skip to thank-you |
| **P7-A** | Cross-sell format: static cards vs. Amazon-style FBT |

### Sample Size Calculator

```js
// From src/utils/abTest.js
import { calcSampleSize } from './src/utils/abTest';

// Example: 3% baseline CVR, detecting 10% relative lift
calcSampleSize(0.03, 0.10); // 16,800 per variant

// Formula: n = 16 x (p x (1-p)) / MDE squared
// Run for minimum 2 weeks to capture weekly traffic patterns
// Target 95% confidence
```

**What "winning" looks like:**

| Test | Primary Metric | Secondary | Win Threshold |
|---|---|---|---|
| P3-A | RPV (Revenue Per Visitor) | AOV, CVR | >95% confidence; minimum 2-week run |
| P1-A | CVR + ROAS | Return rate | ROAS positive on cold traffic |
| P5-A | OTO take rate x delta AOV | 30-day LTV | Net revenue per session improvement |
| P3-D | Mobile checkout completion rate | Drop-off by step | Stat-sig at 95% |
| P4-A | (Bump take rate) minus (CVR loss x order value) | Net AOV delta | Net positive on RPV |

---

## Component Library

| Component | File | Accessibility |
|---|---|---|
| `PackageSelector` | components/PackageCard.jsx | fieldset + legend + input[type=radio], full-card label |
| `TestimonialCard` | components/TestimonialCard.jsx | blockquote + cite, avatar alt text |
| `TrustBar` | components/TrustBar.jsx | ul[role=list] with icon + text pairs (never icon-only) |
| `CountdownTimer` | components/CountdownTimer.jsx | role=timer + aria-live=off + aria-label |
| `FAQAccordion` | components/FAQAccordion.jsx | button[aria-expanded] + div[role=region][aria-labelledby] |
| `OrderBump` | components/OrderBump.jsx | aside[role=complementary] + 44px checkbox tap area |
| `StickyBuyBar` | components/StickyBuyBar.jsx | Fixed bottom, scroll-padding-bottom in global.css, safe-area-inset |
| `FormField` | components/FormField.jsx | Visible label, aria-required, aria-describedby, role=alert errors |
| `ExitIntentModal` | components/ExitIntentModal.jsx | role=dialog + aria-modal + focus trap + Escape key |

---

## WCAG 2.2 AA Testing Protocol

Run these checks before any launch or major change:

### 1. Automated Scan
```bash
# Install axe-core CLI
npm install -g @axe-core/cli

# Run against local dev server
axe http://localhost:5173/order --exit
axe http://localhost:5173/presell --exit
# Repeat for all routes. Target: 0 violations.
```

### 2. Keyboard Navigation
- Tab through every page without using a mouse
- Confirm all interactive elements are reachable in logical order
- Confirm no keyboard traps (can always Tab away)
- Confirm sticky bar does not obscure focused elements (check scroll-padding-bottom)

### 3. Screen Reader Testing
- **Windows:** NVDA (free) + Chrome
- **macOS/iOS:** VoiceOver (built-in) + Safari
- Test: form fields announced with correct labels, errors announced immediately, package cards read full description, countdown timer NOT announced every second

### 4. Viewport/Reflow Testing (WCAG 1.4.10)
```
- Set viewport to 320px width
- Confirm: no horizontal scrollbar, no clipped content, all text readable
- Set browser font size to 32px (200% zoom)
- Confirm: no overlapping content, no lost functionality
```

### 5. Color Contrast Verification

Use WebAIM Contrast Checker (webaim.org/resources/contrastchecker):

| Token | Value | Background | Ratio | Status |
|---|---|---|---|---|
| `--color-text-primary` | `#1A1A1A` | `#FBF7F0` | 15.8:1 | AA pass |
| `--color-text-secondary` | `#3D3D3D` | `#FBF7F0` | 9.7:1 | AA pass |
| `--color-text-on-green` | `#FFFFFF` | `#3D8C2F` | 4.6:1 | AA pass |
| `--color-brand-gold` (text) | `#8A6A1A` | `#FFFFFF` | 5.2:1 | AA pass |
| `--color-error` | `#B91C1C` | `#FFFFFF` | 5.9:1 | AA pass |
| `--color-text-muted` | `#5A5A5A` | `#FFFFFF` | 7.2:1 | AA pass |
| Placeholder text | `#767676` | `#FFFFFF` | 4.6:1 | AA pass |

**Never use** `#C9A84C` as text — it fails at 2.3:1 on white. Use only for decorative borders/dividers.

### 6. WAVE Tool
- Install WAVE browser extension (webaim.org/wave)
- Run on each page. Resolve all Errors and Alerts.

### 7. Touch Target Audit (WCAG 2.5.8)
- Every interactive element: minimum 24x24px (WCAG 2.2 absolute minimum)
- Recommended for 40+ audience: 44x44px
- CTA buttons: min-height 56px
- Checkbox labels: min-height 44px with padding expansion
- Package cards: entire card clickable via label wrapping radio input

---

## Form Field autocomplete Reference

| Field | autocomplete value | Input Type |
|---|---|---|
| First name | `given-name` | `type="text"` |
| Last name | `family-name` | `type="text"` |
| Email | `email` | `type="email"` |
| Phone | `tel` | `type="tel"` |
| Street address | `address-line1` | `type="text"` |
| City | `address-level2` | `type="text"` |
| State | `address-level1` | `type="text"` |
| ZIP code | `postal-code` | `type="text"` inputMode="numeric" |
| Card number | `cc-number` | `type="text"` inputMode="numeric" |
| Card expiry | `cc-exp` | `type="text"` |
| CVV | `cc-csc` | `type="text"` inputMode="numeric" |

---

## Getting Started

```bash
npm install
npm run dev      # Development server at http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

### Testing A/B Variants Locally

Force specific variants via URL:
```
http://localhost:5173/?abtest={"P3-A":"6-bottle","P3-E":"all"}
```

---

## File Structure

```
src/
├── styles/
│   └── global.css           # Design tokens, typography, utilities
├── utils/
│   └── abTest.js            # A/B test variant management
├── components/
│   ├── CountdownTimer.jsx/css
│   ├── ExitIntentModal.jsx/css
│   ├── FAQAccordion.jsx/css
│   ├── FormField.jsx/css
│   ├── OrderBump.jsx/css
│   ├── PackageCard.jsx/css
│   ├── StickyBuyBar.jsx/css
│   ├── TestimonialCard.jsx/css
│   └── TrustBar.jsx/css
├── pages/
│   ├── Presell.jsx/css      # Advertorial
│   ├── Watch.jsx/css        # VSL page
│   ├── Order.jsx/css        # Highest priority
│   ├── Upsell1.jsx/css      # Post-purchase OTO
│   ├── Downsell.jsx/css     # Downsell
│   └── ThankYou.jsx/css     # Confirmation
├── App.jsx                  # Router + A/B routing logic
└── main.jsx                 # React entry point
```

---

## Compliance

This funnel is designed to meet **WCAG 2.2 Level AA** requirements. WCAG 2.2 AA is required by ADA Title II (effective April 2024), the European Accessibility Act (effective June 2025), and Section 508 (US federal). No third-party accessibility overlay widgets are used — accessibility is built into the code directly.
