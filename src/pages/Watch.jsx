import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TrustBar from '../components/TrustBar';
import TestimonialCard from '../components/TestimonialCard';
import FAQAccordion from '../components/FAQAccordion';
import StickyBuyBar from '../components/StickyBuyBar';
import { getVariant } from '../utils/abTest';
import './Watch.css';

/**
 * Watch — Video Sales Letter (VSL) Page
 * Route: /watch
 *
 * WCAG 2.2 AA:
 *   SC 1.2.2  Captions noted for video content
 *   SC 1.3.1  Semantic landmark structure: header, main, section, article
 *   SC 1.4.3  All text ≥ 4.5:1 contrast on its background
 *   SC 2.1.1  Fully keyboard navigable; play button ≥ 60px
 *   SC 2.4.3  Logical focus order follows DOM order
 *   SC 2.5.8  All interactive elements ≥ 44px height
 *   SC 4.1.3  role="status" live-region announces deferred CTA
 *
 * A/B Test P2-B:
 *   'immediate' → CTA visible on mount
 *   'delayed'   → CTA revealed after 15-second timer
 */

/* ── Static data ──────────────────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    author: 'Linda R.',
    location: 'Phoenix, AZ',
    rating: 5,
    result: 'Noticed difference in 3 weeks',
    quote:
      "I've tried expensive serums and collagen powders for years. Nothing worked like this. My skin looks firmer and my friends keep asking what I'm doing differently.",
    verified: true,
  },
  {
    author: 'Carol M.',
    location: 'Tampa, FL',
    rating: 5,
    result: 'Dark spots fading',
    quote:
      "At 58, I thought sagging skin was just something I had to accept. After 6 weeks on Essential Skin Food, I genuinely look younger. My husband noticed before I did!",
    verified: true,
  },
  {
    author: 'Deborah T.',
    location: 'Seattle, WA',
    rating: 5,
    result: 'More radiant, less dull',
    quote:
      "I was skeptical about plant-based collagen support. But after seeing results in my skin texture and glow within the first month, I'm a believer. Ordering the 6-bottle pack now.",
    verified: true,
  },
];

const CTA_DELAY_MS = 15_000; // 15 seconds for P2-B 'delayed' variant

/* ── Component ────────────────────────────────────────────────────────────── */

export default function Watch() {
  const navigate = useNavigate();

  /* A/B Test P2-B: 'immediate' | 'delayed' */
  const ctaVariant = getVariant('P2-B');
  const isDelayed = ctaVariant === 'delayed';

  /* CTA visibility state */
  const [ctaVisible, setCtaVisible] = useState(!isDelayed);

  /* Drives the role="status" announcement when CTA appears */
  const [ctaAnnouncement, setCtaAnnouncement] = useState('');

  /* Video play state (placeholder — no real video embed) */
  const [isPlaying, setIsPlaying] = useState(false);

  /* Transcript expanded */
  const [transcriptOpen, setTranscriptOpen] = useState(false);

  /* Sticky bar: appears after scroll past video section */
  const videoSectionRef = useRef(null);
  const [stickyVisible, setStickyVisible] = useState(false);

  /* ── Delayed CTA timer (P2-B) ─────────────────────────────────────────── */
  useEffect(() => {
    if (!isDelayed) return; // 'immediate' variant — already visible

    const timerId = setTimeout(() => {
      setCtaVisible(true);
      setCtaAnnouncement(
        'Special offer now available — Start My Skin Transformation.'
      );
    }, CTA_DELAY_MS);

    return () => clearTimeout(timerId);
  }, [isDelayed]);

  /* Clear announcement after screen reader has read it */
  useEffect(() => {
    if (!ctaAnnouncement) return;
    const id = setTimeout(() => setCtaAnnouncement(''), 5000);
    return () => clearTimeout(id);
  }, [ctaAnnouncement]);

  /* ── Sticky buy bar scroll watcher ───────────────────────────────────────  */
  const handleScroll = useCallback(() => {
    if (!videoSectionRef.current) return;
    const { bottom } = videoSectionRef.current.getBoundingClientRect();
    setStickyVisible(bottom < 0);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  const goToOrder = () => navigate('/order');

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Real implementation would call video player API here
  };

  return (
    <>
      {/* ── Skip link ──────────────────────────────────────────────────── */}
      <a href="#main-content" className="sr-only watch-skip-link">
        Skip to main content
      </a>

      {/* ── Live region for deferred CTA announcement ──────────────────── */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {ctaAnnouncement}
      </div>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main id="main-content" className="watch-main">

        {/* ── Hero / Pre-headline section ───────────────────────────────── */}
        <section
          className="watch-hero section"
          aria-labelledby="watch-pre-headline"
        >
          <div className="container container--narrow watch-hero__inner">

            {/* Pre-headline */}
            <p className="section-eyebrow watch-hero__eyebrow">
              Women 40+ Are Calling This Their 'Anti-Aging Secret'
            </p>

            {/* Social proof bar */}
            <div
              className="watch-social-proof"
              aria-label="Customer ratings summary"
            >
              <span
                className="stars watch-social-proof__stars"
                aria-hidden="true"
              >
                ★★★★★
              </span>
              <span className="watch-social-proof__text">
                <span className="sr-only">Rated </span>
                4.8/5
                <span aria-hidden="true"> · </span>
                14,200+ Reviews
              </span>
            </div>

            {/* Page H1 */}
            <h1 id="watch-pre-headline" className="watch-hero__headline">
              Discover the Plant-Based Secret Behind 67,000+ Women's Skin
              Transformations
            </h1>

            <p className="watch-hero__subhead">
              Watch the short presentation below to see the breakthrough science
              dermatologists are quietly recommending.
            </p>
          </div>
        </section>

        {/* ── Video section ─────────────────────────────────────────────── */}
        <section
          ref={videoSectionRef}
          className="watch-video-section"
          aria-labelledby="video-section-heading"
        >
          <div className="container container--narrow">
            <h2 id="video-section-heading" className="sr-only">
              Product Presentation Video
            </h2>

            {/* 16:9 video wrapper */}
            <div
              className="watch-video-frame"
              role="region"
              aria-label="Product presentation video player"
            >
              {/* Play button overlay — shown until isPlaying */}
              {!isPlaying && (
                <button
                  type="button"
                  className="watch-play-btn"
                  onClick={handlePlayClick}
                  aria-label="Play presentation"
                >
                  {/* Play triangle — decorative, aria-label on button */}
                  <span
                    className="watch-play-btn__icon"
                    aria-hidden="true"
                  >
                    ▶
                  </span>
                </button>
              )}

              {/* Placeholder video content — replace with actual embed */}
              {isPlaying && (
                <div className="watch-video-placeholder watch-video-placeholder--playing">
                  <p className="watch-video-placeholder__msg">
                    Video presentation playing…
                  </p>
                  <p className="watch-video-placeholder__sub supporting-text">
                    (Replace this element with your actual video embed.)
                  </p>
                </div>
              )}

              {!isPlaying && (
                <div className="watch-video-placeholder" aria-hidden="true">
                  <p className="watch-video-placeholder__msg">
                    Essential Skin Food
                  </p>
                  <p className="watch-video-placeholder__sub supporting-text">
                    Press play to watch the presentation
                  </p>
                </div>
              )}
            </div>

            {/* Below-video accessibility controls — always visible */}
            <div className="watch-video-meta">
              <button
                type="button"
                className="btn btn--ghost watch-transcript-toggle"
                aria-expanded={transcriptOpen}
                aria-controls="watch-transcript"
                onClick={() => setTranscriptOpen((v) => !v)}
              >
                <span aria-hidden="true">{transcriptOpen ? '▲' : '▼'}</span>
                {transcriptOpen ? 'Hide Transcript' : 'Read Transcript'}
              </button>

              <span className="watch-video-meta__captions supporting-text">
                <span aria-hidden="true">CC</span>{' '}
                Captions available — click CC
              </span>
            </div>

            {/* Transcript region */}
            <div
              id="watch-transcript"
              role="region"
              aria-label="Video transcript"
              className={`watch-transcript ${transcriptOpen ? 'watch-transcript--open' : ''}`}
              hidden={!transcriptOpen}
            >
              <div className="watch-transcript__body">
                <p>
                  <strong>Transcript:</strong> If you're a woman over 40 and
                  you've tried collagen powders, peptide creams, or expensive
                  serums without seeing the results you hoped for — you are not
                  alone, and you're not doing anything wrong. The science just
                  hasn't been on your side. Until now.
                </p>
                <p>
                  In this short presentation, you'll discover why ingested
                  collagen can't target your skin — and the plant-based nutrient
                  combination that gives your body exactly what it needs to
                  rebuild its own collagen, naturally.
                </p>
                <p>
                  This is ActivatedYou Essential Skin Food. And it's changing
                  how thousands of women approach skin health every single day.
                </p>
                <p className="supporting-text">
                  [Full transcript continues below. For accessibility support,
                  contact us at support@activatedyou.com.]
                </p>
              </div>
            </div>

            {/* ── CTA — shown immediately or after 15-second delay ──────── */}
            <div
              className={`watch-cta-wrap ${ctaVisible ? 'watch-cta-wrap--visible' : 'watch-cta-wrap--hidden'}`}
              aria-hidden={!ctaVisible}
            >
              <p className="watch-cta-wrap__nudge">
                Ready to transform your skin from the inside out?
              </p>
              <button
                type="button"
                className="btn btn--primary btn--full watch-cta-btn"
                onClick={goToOrder}
                tabIndex={ctaVisible ? 0 : -1}
              >
                Start My Skin Transformation →
              </button>
              <p className="watch-cta-wrap__sub supporting-text">
                90-Day Money-Back Guarantee · Free US Shipping
              </p>
            </div>
          </div>
        </section>

        {/* ── Trust Bar ─────────────────────────────────────────────────── */}
        <TrustBar />

        {/* ── Testimonials ──────────────────────────────────────────────── */}
        <section
          className="watch-testimonials section"
          aria-labelledby="testimonials-heading"
        >
          <div className="container container--narrow">
            <h2 id="testimonials-heading" className="watch-section-heading">
              What Our Customers Are Saying
            </h2>
            <p className="watch-section-sub">
              Over 14,200 verified reviews. Here are three of our favorites.
            </p>

            <ul
              className="watch-testimonials__list"
              role="list"
              aria-label="Customer testimonials"
            >
              {TESTIMONIALS.map((t) => (
                <li key={t.author} className="watch-testimonials__item">
                  <TestimonialCard testimonial={t} />
                </li>
              ))}
            </ul>

            {/* Second CTA after testimonials */}
            <div className="watch-cta-wrap watch-cta-wrap--visible watch-cta-wrap--after-testimonials">
              <button
                type="button"
                className="btn btn--primary btn--full watch-cta-btn"
                onClick={goToOrder}
              >
                Start My Skin Transformation →
              </button>
              <p className="watch-cta-wrap__sub supporting-text">
                Join 67,000+ women · 90-Day Guarantee · Free Shipping
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section
          className="watch-faq section"
          aria-labelledby="faq-heading"
        >
          <div className="container container--narrow">
            <h2 id="faq-heading" className="watch-section-heading">
              Frequently Asked Questions
            </h2>
            <FAQAccordion singleOpen={false} />
          </div>
        </section>

        {/* ── FDA Disclaimer ────────────────────────────────────────────── */}
        <footer className="watch-footer container container--narrow">
          <p className="fda-disclaimer">
            †These statements have not been evaluated by the Food and Drug
            Administration. This product is not intended to diagnose, treat,
            cure, or prevent any disease. Individual results may vary. The
            information presented in this video is for educational purposes only
            and is not intended as medical advice. Always consult your physician
            or qualified healthcare provider before beginning any new supplement
            regimen.
          </p>
        </footer>
      </main>

      {/* ── Sticky Buy Bar — appears after scroll past video ──────────── */}
      {stickyVisible && (
        <StickyBuyBar
          onCtaClick={goToOrder}
          selectedPackage="3-Bottle Supply"
          price="$49.95/bottle"
        />
      )}
    </>
  );
}
