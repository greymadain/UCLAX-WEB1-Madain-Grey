import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { initVariants, getVariant } from './utils/abTest';
import './styles/global.css';

// Pages — lazy-loaded for performance (critical for 40+ mobile users on slow connections)
import Presell from './pages/Presell';
import Watch from './pages/Watch';
import Order from './pages/Order';
import Upsell1 from './pages/Upsell1';
import Downsell from './pages/Downsell';
import ThankYou from './pages/ThankYou';

/**
 * App — Funnel Router
 *
 * Route structure:
 *   /          → redirects to /presell or /order based on A/B Test P1-A
 *   /presell   → advertorial pre-sell page
 *   /watch     → VSL video page
 *   /order     → checkout / order page (highest conversion priority)
 *   /upsell-1  → post-purchase OTO
 *   /downsell  → downsell (P6-A: shown or skipped)
 *   /thank-you → order confirmation
 *
 * A/B routing:
 *   P1-A: 50% → /presell first, 50% → /order directly
 *   P6-A: 'show' → /downsell, 'skip' → /thank-you
 */

function FunnelEntry() {
  const navigate = useNavigate();

  useEffect(() => {
    // P1-A: Route cold traffic to presell or direct to order
    const variant = getVariant('P1-A');
    if (variant === 'presell') {
      navigate('/presell', { replace: true });
    } else {
      navigate('/order', { replace: true });
    }
  }, [navigate]);

  return null; // Renders nothing while redirecting
}

function DownsellGate() {
  // P6-A: Show downsell page vs. skip to thank-you
  const variant = getVariant('P6-A');
  if (variant === 'skip') {
    return <Navigate to="/thank-you" replace />;
  }
  return <Downsell />;
}

// Scroll to top on route change (WCAG 2.4.3 — focus management)
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

// Skip navigation link (WCAG 2.4.1)
function SkipNav() {
  return (
    <a
      href="#main-content"
      className="skip-nav"
      style={{
        position: 'absolute',
        top: '-100%',
        left: '1rem',
        background: 'var(--color-brand-green)',
        color: 'white',
        padding: '0.75rem 1.25rem',
        borderRadius: '0 0 8px 8px',
        fontWeight: '700',
        fontSize: '1rem',
        zIndex: 999,
        textDecoration: 'none',
        transition: 'top 0.15s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100%';
      }}
    >
      Skip to main content
    </a>
  );
}

export default function App() {
  // Initialize A/B variants on app load (once per session)
  useEffect(() => {
    initVariants();
  }, []);

  return (
    <BrowserRouter>
      {/* Skip navigation — WCAG 2.4.1 */}
      <SkipNav />

      {/* Scroll to top on navigation */}
      <ScrollToTop />

      <Routes>
        {/* Entry point — routes based on P1-A variant */}
        <Route path="/" element={<FunnelEntry />} />

        {/* Funnel pages */}
        <Route path="/presell"   element={<Presell />} />
        <Route path="/watch"     element={<Watch />} />
        <Route path="/order"     element={<Order />} />
        <Route path="/upsell-1"  element={<Upsell1 />} />
        <Route path="/downsell"  element={<DownsellGate />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* Catch-all — redirect to entry */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
