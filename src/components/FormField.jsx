import React, { useState } from 'react';
import './FormField.css';

/**
 * FormField — WCAG 2.2 AA Compliant
 * SC 3.3.2: Visible label above the field (placeholder is NOT a substitute)
 * SC 3.3.1: Error identifies field AND describes the fix
 * SC 3.3.3: Error suggests correct format
 * SC 1.3.5: autocomplete attributes for 40+ users (reduces typing)
 * SC 4.1.3: role="alert" for error messages (announced immediately by screen readers)
 * SC 1.4.4: Input font-size >= 16px (prevents iOS Safari auto-zoom)
 * SC 2.5.8: Minimum 52px input height (above 44px minimum)
 */

export default function FormField({
  id,
  label,
  type = 'text',
  required = false,
  autoComplete,
  inputMode,
  pattern,
  placeholder,
  value,
  onChange,
  onBlur,
  errorMessage,
  helpText,
  hint,
}) {
  const errorId = `${id}-error`;
  const helpId  = `${id}-help`;
  const hintId  = `${id}-hint`;

  // Build aria-describedby from all applicable ids
  const describedBy = [
    helpText ? helpId : null,
    hint     ? hintId : null,
    errorMessage ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`form-field ${errorMessage ? 'form-field--error' : ''}`}>
      <label htmlFor={id} className="form-field__label">
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true"> *</span>
        )}
      </label>

      {hint && (
        <span id={hintId} className="form-field__hint">
          {hint}
        </span>
      )}

      <input
        id={id}
        name={id}
        type={type}
        className="form-field__input"
        required={required}
        aria-required={required ? 'true' : undefined}
        autoComplete={autoComplete}
        inputMode={inputMode}
        pattern={pattern}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-describedby={describedBy}
        aria-invalid={errorMessage ? 'true' : undefined}
      />

      {helpText && (
        <span id={helpId} className="form-field__help">
          {helpText}
        </span>
      )}

      {/* Error — role="alert" announced immediately by screen readers (SC 4.1.3) */}
      {errorMessage && (
        <span id={errorId} role="alert" className="form-field__error">
          <span className="form-field__error-icon" aria-hidden="true">⚠</span>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
