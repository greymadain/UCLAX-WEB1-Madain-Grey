import React, { useState } from 'react';
import './FAQAccordion.css';

/**
 * FAQAccordion — WCAG 2.2 AA Compliant
 * SC 4.1.2: button[aria-expanded] + div[role="region"][aria-labelledby]
 * SC 2.1.1: Fully keyboard navigable
 * SC 2.4.3: Focus order follows DOM order
 */

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'How long until I see results?',
    answer:
      'Most customers notice improvements in skin hydration and glow within 2–4 weeks. Firmer, more lifted-looking skin typically appears around weeks 8–12. For best results, take consistently every day with a full glass of water.',
  },
  {
    id: 'faq-2',
    question: 'Is Essential Skin Food really plant-based?',
    answer:
      'Yes — 100%. Unlike traditional collagen supplements sourced from animal hides or marine fish, Essential Skin Food contains zero animal-derived collagen. Instead, it provides the plant-based building blocks your body needs to produce its own collagen naturally — including Vitamin C, L-Lysine, L-Proline, and our proprietary Dermaval™ Blend.',
  },
  {
    id: 'faq-3',
    question: 'What is your money-back guarantee?',
    answer:
      'We stand behind Essential Skin Food with a full 90-day money-back guarantee. If you are not completely satisfied for any reason, simply contact our customer support team and we will refund your purchase — no questions asked, no hassle.',
  },
  {
    id: 'faq-4',
    question: 'Can I cancel my subscription?',
    answer:
      'Absolutely. You can cancel at any time by calling our team at 800-720-8403 or emailing support. There are no cancellation fees and no long-term contracts. We make it easy to manage your subscription on your terms.',
  },
  {
    id: 'faq-5',
    question: 'Are there any side effects?',
    answer:
      'Essential Skin Food is formulated with natural plant-based ingredients and is generally well-tolerated. As with any supplement, if you are pregnant, nursing, or have a medical condition, please consult your healthcare provider before use. These statements have not been evaluated by the FDA.',
  },
];

export default function FAQAccordion({ faqs = DEFAULT_FAQS, singleOpen = false }) {
  const [openIds, setOpenIds] = useState(new Set());

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="faq-accordion">
      {faqs.map((faq) => {
        const isOpen = openIds.has(faq.id);
        const btnId = `${faq.id}-btn`;
        const contentId = `${faq.id}-content`;

        return (
          <div key={faq.id} className="faq-accordion__item">
            <h3 className="faq-accordion__heading">
              <button
                id={btnId}
                className={`faq-accordion__trigger ${isOpen ? 'faq-accordion__trigger--open' : ''}`}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggle(faq.id)}
                type="button"
              >
                <span className="faq-accordion__question">{faq.question}</span>
                <span
                  className="faq-accordion__icon"
                  aria-hidden="true"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>

            <div
              id={contentId}
              role="region"
              aria-labelledby={btnId}
              className={`faq-accordion__content ${isOpen ? 'faq-accordion__content--open' : ''}`}
              hidden={!isOpen}
            >
              <div className="faq-accordion__body">
                <p>{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
