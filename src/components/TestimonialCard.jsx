import React from 'react';
import './TestimonialCard.css';

/**
 * TestimonialCard — WCAG 2.2 AA Compliant
 * SC 1.3.1: blockquote + cite — correct semantic HTML for quotations
 * SC 1.4.3: Star color #8A6A1A on white = 5.2:1 ✅
 * SC 1.1.1: Avatar alt text describes the customer
 */

export default function TestimonialCard({ testimonial }) {
  const {
    quote,
    author,
    location,
    rating = 5,
    avatarSrc,
    avatarAlt,
    beforeAfter,
    verified,
    result,
  } = testimonial;

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <article className="testimonial-card">
      {/* Star rating */}
      <div
        className="testimonial-card__stars"
        aria-label={`Rated ${rating} out of 5 stars`}
      >
        <span aria-hidden="true" className="stars">{stars}</span>
      </div>

      {/* Result callout */}
      {result && (
        <p className="testimonial-card__result">
          <strong>{result}</strong>
        </p>
      )}

      {/* Quote */}
      <blockquote className="testimonial-card__quote">
        <p>{quote}</p>
      </blockquote>

      {/* Author info */}
      <footer className="testimonial-card__footer">
        {avatarSrc ? (
          <img
            className="testimonial-card__avatar"
            src={avatarSrc}
            alt={avatarAlt || `Photo of ${author}`}
            width="48"
            height="48"
            loading="lazy"
          />
        ) : (
          <div
            className="testimonial-card__avatar-placeholder"
            role="img"
            aria-label={`${author}'s avatar`}
          >
            {author.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="testimonial-card__author-info">
          <cite className="testimonial-card__author">{author}</cite>
          {location && (
            <span className="testimonial-card__location">{location}</span>
          )}
          {verified && (
            <span className="testimonial-card__verified" aria-label="Verified purchase">
              <span aria-hidden="true">✅</span> Verified Purchase
            </span>
          )}
        </div>
      </footer>
    </article>
  );
}
