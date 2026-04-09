import React, { useState } from 'react';
import './ImageGallery.css';

/**
 * ImageGallery — WCAG 2.2 AA Compliant
 * SC 1.1.1: All images have descriptive alt/aria-label text
 * SC 1.4.1: Active thumbnail uses border + icon, not color alone
 * SC 2.1.1: All thumbnails are keyboard-accessible buttons
 * SC 2.5.8: Thumbnail buttons meet 44px minimum touch target
 */

const IMAGES = [
  {
    id: 'img-front',
    emoji: '💊',
    label: 'Essential Skin Food supplement bottle — 30 capsules, plant-based collagen support',
  },
  {
    id: 'img-ingredients',
    emoji: '🌿',
    label: 'Plant-based ingredients — Dermaval™ blend, Vitamin C, amino acids',
  },
  {
    id: 'img-lifestyle',
    emoji: '✨',
    label: 'Lifestyle — radiant, firmer skin after consistent use',
  },
];

export default function ImageGallery() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = IMAGES[activeIdx];

  return (
    <div className="image-gallery" role="region" aria-label="Product images">
      {/* Main image */}
      <div
        className="image-gallery__main"
        role="img"
        aria-label={active.label}
      >
        <span className="image-gallery__emoji" aria-hidden="true">
          {active.emoji}
        </span>
      </div>

      {/* Thumbnail nav */}
      <ul
        className="image-gallery__thumbs"
        role="list"
        aria-label="Product image thumbnails"
      >
        {IMAGES.map((img, i) => (
          <li key={img.id}>
            <button
              type="button"
              className={`image-gallery__thumb${
                i === activeIdx ? ' image-gallery__thumb--active' : ''
              }`}
              aria-label={`View: ${img.label}`}
              aria-current={i === activeIdx ? 'true' : undefined}
              onClick={() => setActiveIdx(i)}
            >
              <span aria-hidden="true">{img.emoji}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
