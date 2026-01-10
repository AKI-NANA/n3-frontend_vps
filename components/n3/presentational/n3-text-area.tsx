'use client';

import React, { memo, forwardRef, TextareaHTMLAttributes, useState, useEffect, useRef, useCallback } from 'react';

// ============================================
// N3TextArea - テキストエリア
// ============================================
export interface N3TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;
  showCount?: boolean;
  fullWidth?: boolean;
}

export const N3TextArea = memo(
  forwardRef<HTMLTextAreaElement, N3TextAreaProps>(function N3TextArea(
    {
      label,
      error,
      helperText,
      size = 'md',
      autoResize = false,
      minRows = 3,
      maxRows = 10,
      showCount = false,
      fullWidth = false,
      className = '',
      disabled,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
      if (showCount) {
        const text = value?.toString() || '';
        setCharCount(text.length);
      }
    }, [value, showCount]);

    const adjustHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;

      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
    }, [autoResize, minRows, maxRows, textareaRef]);

    useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        adjustHeight();
      },
      [onChange, adjustHeight]
    );

    const wrapperClass = [
      'n3-textarea-wrapper',
      size,
      fullWidth && 'full-width',
      error && 'has-error',
      disabled && 'disabled',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClass}>
        {label && (
          <label className="n3-textarea-label">
            {label}
            {props.required && <span className="n3-required">*</span>}
          </label>
        )}

        <div className="n3-textarea-container">
          <textarea
            ref={textareaRef}
            className="n3-textarea"
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            onChange={handleChange}
            rows={autoResize ? minRows : undefined}
            {...props}
          />
        </div>

        <div className="n3-textarea-footer">
          {(error || helperText) && (
            <span className={`n3-textarea-helper ${error ? 'error' : ''}`}>
              {error || helperText}
            </span>
          )}
          {showCount && (
            <span className="n3-textarea-count">
              {charCount}
              {maxLength && ` / ${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  })
);

export default N3TextArea;
