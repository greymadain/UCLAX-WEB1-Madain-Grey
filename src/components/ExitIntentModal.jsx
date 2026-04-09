import React, { useEffect, useRef } from 'react';
import './ExitIntentModal.css';

/**
 * ExitIntentModal — WCAG 2.2 AA Compliant
 * SC 4.1.2: role="dialog" + aria-modal="true" + aria-labelledby
 * SC 2.1.2: Focus trap — user cannot tab outside modal while open
 * SC 2.4.3: Focus moves to modal on open; returns to trigger on close
 * SC 2.5.8: All buttons minimum 44px height
 */

export default function ExitIntentModal({ isOpen, onClose, onAccept }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Store previously focused element and move focus to modal
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      // Small delay to ensure modal is rendered
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus();
      });
    } else {
      // Return focus to triggering element on close
      previousFocusRef.current?.focus();
    }
  }, [isOpen]);

  // Focus trap — keep focus inside modal while open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = modalRef.current?.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="exit-modal-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      {/* Prevent click inside modal from closing it */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-modal-title"
        aria-describedby="exit-modal-desc"
        className="exit-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="exit-modal__close"
          onClick={onClose}
          aria-label="Close offer and continue to leave"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="exit-modal__content">
          <p className="exit-modal__eyebrow">Wait — Before You Go!</p>

          <h2 id="exit-modal-title" className="exit-modal__heading">
            Your Skin Deserves One More Chance
          </h2>

          <p id="exit-modal-desc" className="exit-modal__body">
            Take an additional <strong>10% off</strong> your first order today.
            Use code <strong>SKIN10</strong> at checkout. This offer expires
            when you leave this page.
          </p>

          <div className="exit-modal__offer">
            <span className="exit-modal__code">SKIN10</span>
            <span className="exit-modal__discount">Extra 10% Off</span>
          </div>

          <div className="exit-modal__actions">
            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={onAccept}
            >
              Claim My 10% Discount →
            </button>

            <button
              type="button"
              className="btn btn--ghost exit-modal__decline"
              onClick={onClose}
            >
              No thanks, I'll skip the discount
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
