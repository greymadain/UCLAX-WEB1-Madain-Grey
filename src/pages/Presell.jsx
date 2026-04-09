import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ExitIntentModal from '../components/ExitIntentModal';
import './Presell.css';

/**
 * Presell — Editorial Advertorial (Native Ad Format)
 * Route: /presell
 *
 * WCAG 2.2 AA:
 *   SC 1.3.1  Semantic article structure: h1 → h2 → h3, blockquote, figure
 *   SC 1.4.3  All text ≥ 4.5:1 on its background
 *   SC 2.4.2  Page titled via <title> (set in index.html or router)
 *   SC 2.5.8  All interactive elements ≥ 44px height
 *   SC 3.3.1  ExitIntentModal triggered once per session
 */

const ARTICLE_DATE = new Date('2026-04-09').toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Called once — gate re-trigger within the same page session
let exitTriggeredThisLoad = false;

export default function Presell() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  /* ── Exit-intent: mouseleave viewport ─────────────────────────────────── */
  const handleMouseLeave = useCallback((e) => {
    if (
      !exitTriggeredThisLoad &&
      e.clientY <= 0 // pointer moved above the viewport top
    ) {
      exitTriggeredThisLoad = true;
      setModalOpen(true);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  /* ── Handlers ──────────────────────────────────────────────────────────── */
  const goToOrder = () => navigate('/order');

  const handleModalAccept = () => {
    setModalOpen(false);
    navigate('/order');
  };

  return (
    <>
      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <header className="presell-masthead" role="banner">
        <div className="presell-masthead__inner container">
          <span className="presell-masthead__pub">
            <strong>Wellness Today</strong>
          </span>
          <nav aria-label="Sponsored content notice">
            <span className="presell-masthead__ad-label">Sponsored</span>
          </nav>
        </div>
      </header>

      {/* ── Main Article ────────────────────────────────────────────────── */}
      <main id="main-content" className="presell-main">
        <article className="presell-article" aria-labelledby="presell-headline">
          {/* Category + headline */}
          <header className="presell-article__header container">
            <p className="section-eyebrow">Health &amp; Beauty</p>
            <h1 id="presell-headline" className="presell-article__headline">
              67,000 Women Over 40 Are Ditching Collagen Powders for This Tiny
              Plant-Based Capsule
            </h1>

            {/* Byline */}
            <div className="presell-article__meta">
              <address className="presell-article__byline">
                By{' '}
                <a
                  href="#author-bio"
                  rel="author"
                  className="presell-article__author-link"
                >
                  Sarah Mitchell
                </a>
                , Health &amp; Wellness Contributor
              </address>
              <div className="presell-article__dateline">
                <time dateTime="2026-04-09">{ARTICLE_DATE}</time>
                <span aria-hidden="true"> · </span>
                <span>5 min read</span>
              </div>
            </div>

            {/* Hero image */}
            <figure className="presell-article__hero-fig">
              <img
                className="presell-article__hero-img"
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&auto=format&fit=crop&q=80"
                alt="Woman in her 40s with smooth, radiant skin looking in a mirror with a confident expression"
                width="900"
                height="506"
                loading="eager"
                fetchpriority="high"
              />
              <figcaption className="presell-article__hero-caption">
                Thousands of women are seeing remarkable skin changes — without
                expensive serums or animal-based collagen powders.
              </figcaption>
            </figure>
          </header>

          {/* ── Body ──────────────────────────────────────────────────────── */}
          <div className="presell-article__body container">

            {/* ── SECTION 1: The Problem ─────────────────────────────────── */}
            <section aria-labelledby="section-problem">
              <h2 id="section-problem" className="presell-article__subhead">
                If You've Tried Collagen Powders and Seen No Results, You're
                Not Alone
              </h2>

              <p>
                Every week, millions of women over 40 scoop chalky collagen
                powder into their morning coffee — hoping to wake up with the
                firm, glowing skin they remember from their 30s. The multi-billion-dollar
                collagen supplement industry has convinced us this is the
                answer. But what if it fundamentally isn't?
              </p>

              <p>
                The inconvenient truth dermatologists rarely discuss: ingested
                animal collagen is broken down by your digestive system into
                generic amino acids before it ever reaches your skin. Your body
                has no mechanism to direct those amino acids <em>specifically</em> back
                into collagen. You're paying a premium for protein powder with
                a beauty story attached.
              </p>

              <p>
                So why do so many women keep buying it? Because the marketing
                is relentless — and because most women don't know a smarter
                alternative exists.
              </p>

              {/* ── PULL QUOTE 1 ──────────────────────────────────────────── */}
              <blockquote className="presell-article__pullquote">
                <p>
                  "I spent over $2,000 on collagen powders and peptide creams
                  over three years. My skin kept getting worse. I felt like I
                  was doing everything right and getting nowhere."
                </p>
                <cite className="presell-article__pullquote-cite">
                  — Karen H., 52, Denver, CO
                </cite>
              </blockquote>
            </section>

            {/* ── CTA 1 — after intro ────────────────────────────────────── */}
            <div className="presell-article__cta-wrap">
              <p className="presell-article__cta-nudge">
                Discover which women are switching — and why it's working:
              </p>
              <button
                type="button"
                className="btn btn--primary presell-article__cta-btn"
                onClick={goToOrder}
              >
                Check Availability In Your Area →
              </button>
            </div>

            <hr className="divider" aria-hidden="true" />

            {/* ── SECTION 2: The Science ─────────────────────────────────── */}
            <section aria-labelledby="section-science">
              <h2 id="section-science" className="presell-article__subhead">
                The Real Reason Your Skin Loses Firmness After 40 (It's Not
                What You Think)
              </h2>

              <p>
                Starting in your mid-30s, your body's natural collagen
                production declines at roughly 1% per year. By 50, you may have
                lost nearly 30% of your skin's structural collagen. The result:
                sagging, fine lines, dullness, and the kind of dryness no
                moisturizer seems to fix.
              </p>

              <p>
                But here's what the collagen powder companies don't advertise:
                your body already <em>knows</em> how to make collagen. It just
                needs the right raw materials and the right cellular signals to
                do so. Feed it those materials, and your skin can begin
                rebuilding its own collagen matrix — from the inside out.
              </p>

              {/* ── INGREDIENT CALLOUT: Dermaval™ ─────────────────────────── */}
              <aside className="presell-ingredient-box" aria-label="Did You Know? — Dermaval™">
                <p className="presell-ingredient-box__label">Did You Know?</p>
                <h3 className="presell-ingredient-box__name">Dermaval™ Blend</h3>
                <p className="presell-ingredient-box__body">
                  Dermaval™ is a patented, plant-based complex of polyphenols
                  and antioxidants clinically studied for its ability to protect
                  collagen-producing fibroblasts from oxidative damage. In a
                  published clinical trial, participants showed a{' '}
                  <strong>40% improvement in skin elasticity</strong> in just
                  12 weeks.†
                </p>
              </aside>

              <p>
                This is the discovery driving a quiet revolution in women's
                skincare — and it's captured in a single daily capsule called{' '}
                <strong>ActivatedYou Essential Skin Food</strong>.
              </p>

              <p>
                The formula doesn't give your body collagen from the outside.
                Instead, it provides the precise combination of plant-based
                nutrients — Dermaval™, Vitamin C, L-Lysine, L-Proline, and
                more — that your fibroblast cells need to synthesize healthy
                collagen naturally. It's a smarter approach backed by
                peer-reviewed research.
              </p>

              {/* ── INGREDIENT CALLOUT: Vitamin C ─────────────────────────── */}
              <aside className="presell-ingredient-box" aria-label="Did You Know? — Vitamin C">
                <p className="presell-ingredient-box__label">Did You Know?</p>
                <h3 className="presell-ingredient-box__name">Vitamin C (as Ascorbic Acid)</h3>
                <p className="presell-ingredient-box__body">
                  Vitamin C is an essential cofactor in collagen biosynthesis —
                  your skin literally cannot build collagen without it. It also
                  neutralizes the free radicals that break down existing collagen,
                  making it doubly effective for visible skin-firming results.†
                </p>
              </aside>

              {/* ── PULL QUOTE 2 ──────────────────────────────────────────── */}
              <blockquote className="presell-article__pullquote">
                <p>
                  "Giving the body building blocks to make its own collagen is
                  fundamentally different from giving it pre-formed collagen.
                  The targeted nutrient approach makes far more biochemical
                  sense for sustained skin health."
                </p>
                <cite className="presell-article__pullquote-cite">
                  — Dr. Renee Jacobs, Board-Certified Dermatologist*
                </cite>
              </blockquote>

              <p className="supporting-text presell-article__disclaimer-inline">
                *Quoted for educational purposes. Individual results may vary.
              </p>
            </section>

            <hr className="divider" aria-hidden="true" />

            {/* ── SECTION 3: The Solution ────────────────────────────────── */}
            <section aria-labelledby="section-solution">
              <h2 id="section-solution" className="presell-article__subhead">
                What Makes Essential Skin Food Different — and Why 67,000+
                Women Are Switching
              </h2>

              <p>
                ActivatedYou Essential Skin Food is a once-daily capsule
                formulated by actress and wellness advocate Maggie Q alongside
                a team of nutritional scientists. Every ingredient was
                selected for its specific role in collagen production, skin
                hydration, and antioxidant defense.
              </p>

              <p>
                Unlike powders that require mixing and often taste chalky,
                Essential Skin Food is two small capsules taken with water —
                easy to remember, convenient enough to take anywhere. Users
                report seeing a visible difference in skin texture and glow
                within 3–6 weeks, with continued improvement over 3 months.
              </p>

              {/* ── INGREDIENT CALLOUT: L-Lysine ──────────────────────────── */}
              <aside className="presell-ingredient-box" aria-label="Did You Know? — L-Lysine">
                <p className="presell-ingredient-box__label">Did You Know?</p>
                <h3 className="presell-ingredient-box__name">L-Lysine</h3>
                <p className="presell-ingredient-box__body">
                  L-Lysine is an essential amino acid that cannot be produced
                  by the body — it must come from diet or supplementation.
                  It plays a critical structural role in collagen cross-linking,
                  giving collagen its tensile strength and skin its "snap-back"
                  firmness.†
                </p>
              </aside>

              <p>
                The formula is 100% plant-based, free from artificial fillers,
                and manufactured in a cGMP-certified, FDA-registered facility
                in the United States. It's also:
              </p>

              <ul className="presell-article__feature-list">
                <li>Gluten-free and dairy-free</li>
                <li>Non-GMO verified</li>
                <li>No soy, shellfish, or egg</li>
                <li>Third-party tested for purity and potency</li>
              </ul>

              {/* ── CTA 2 — after science section ──────────────────────────── */}
              <div className="presell-article__cta-wrap">
                <p className="presell-article__cta-nudge">
                  Limited supply available — see if it's in stock in your area:
                </p>
                <button
                  type="button"
                  className="btn btn--primary presell-article__cta-btn"
                  onClick={goToOrder}
                >
                  Check Availability In Your Area →
                </button>
              </div>
            </section>

            <hr className="divider" aria-hidden="true" />

            {/* ── SECTION 4: Social Proof ────────────────────────────────── */}
            <section aria-labelledby="section-social-proof">
              <h2 id="section-social-proof" className="presell-article__subhead">
                Real Women. Real Results. Here's What They're Saying
              </h2>

              <p>
                Essential Skin Food has accumulated more than 14,200 verified
                customer reviews, making it one of the most-reviewed skincare
                supplements online. We spoke to several women about their
                experience.
              </p>

              {/* ── PULL QUOTE 3 ──────────────────────────────────────────── */}
              <blockquote className="presell-article__pullquote presell-article__pullquote--featured">
                <p>
                  "I've tried expensive serums and collagen powders for years.
                  Nothing worked like this. My skin looks firmer and my friends
                  keep asking what I'm doing differently. I'm 54 and I've
                  never had more confidence in how I look."
                </p>
                <cite className="presell-article__pullquote-cite">
                  — Linda R., 54, Phoenix, AZ · Verified Purchaser
                </cite>
              </blockquote>

              <p>
                Linda is not an anomaly. Of the 14,200-plus reviewers, 91%
                rated the product four or five stars. The most commonly cited
                benefits: firmer skin texture (68%), improved skin glow (71%),
                reduced appearance of fine lines (59%), and better overall skin
                hydration (74%).
              </p>

              <p>
                Many women also report benefits beyond skin — improved nail
                strength, healthier hair texture, and more comfortable joints —
                likely due to the collagen-supportive nutrients serving multiple
                connective tissue functions throughout the body.
              </p>
            </section>

            {/* ── SECTION 5: Conclusion / Close ─────────────────────────── */}
            <section aria-labelledby="section-conclusion">
              <h2 id="section-conclusion" className="presell-article__subhead">
                Is Essential Skin Food Right for You?
              </h2>

              <p>
                If you're a woman over 40 who has tried collagen powders
                without the results you hoped for, Essential Skin Food is worth
                serious consideration. The science is solid, the ingredient
                list is transparent, and the 90-day money-back guarantee means
                you can try it completely risk-free.
              </p>

              <p>
                Due to high demand, stock is frequently limited. ActivatedYou
                ships from a single US fulfillment center and cannot always
                guarantee availability for all regions. We recommend checking
                availability in your area before supplies sell out.
              </p>

              {/* ── CTA 3 — Bottom ─────────────────────────────────────────── */}
              <div className="presell-article__cta-wrap presell-article__cta-wrap--bottom">
                <p className="presell-article__cta-nudge">
                  Join over 67,000 women already experiencing the difference:
                </p>
                <button
                  type="button"
                  className="btn btn--primary presell-article__cta-btn"
                  onClick={goToOrder}
                >
                  Check Availability In Your Area →
                </button>
                <p className="presell-article__cta-sub">
                  90-Day Money-Back Guarantee · Free US Shipping
                </p>
              </div>
            </section>

            {/* ── Author Bio ─────────────────────────────────────────────── */}
            <aside
              id="author-bio"
              className="presell-author-bio"
              aria-label="About the author"
            >
              <div
                className="presell-author-bio__avatar"
                role="img"
                aria-label="Sarah Mitchell's author photo placeholder"
              >
                SM
              </div>
              <div className="presell-author-bio__content">
                <h3 className="presell-author-bio__name">Sarah Mitchell</h3>
                <p className="presell-author-bio__desc supporting-text">
                  Sarah Mitchell is a health and wellness writer with over
                  12 years of experience covering nutrition science, preventive
                  medicine, and women's health. Her work has appeared in
                  national wellness publications and peer-reviewed health
                  journals.
                </p>
              </div>
            </aside>

            {/* ── FDA Disclaimer ──────────────────────────────────────────── */}
            <footer>
              <p className="fda-disclaimer">
                †These statements have not been evaluated by the Food and Drug
                Administration. This product is not intended to diagnose, treat,
                cure, or prevent any disease. Individual results may vary. The
                information presented in this article is for educational
                purposes only and is not intended as medical advice. Always
                consult your physician or qualified healthcare provider before
                beginning any new supplement regimen.
              </p>
            </footer>
          </div>
          {/* /.presell-article__body */}
        </article>
      </main>

      {/* ── Exit-Intent Modal ────────────────────────────────────────────── */}
      <ExitIntentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAccept={handleModalAccept}
      />
    </>
  );
}
