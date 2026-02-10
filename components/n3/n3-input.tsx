/**
 * N3Input - N3デザインシステムの入力コンポーネント
 */

'use client';

import React from 'react';

export interface N3InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
}

export function N3Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  inputSize = 'md',
  className = '',
  style,
  ...props
}: N3InputProps) {
  const sizes = {
    sm: { height: 32, fontSize: 12, padding: '6px 10px' },
    md: { height: 36, fontSize: 13, padding: '8px 12px' },
    lg: { height: 40, fontSize: 14, padding: '10px 14px' },
  };

  const sizeConfig = sizes[inputSize];

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...style }} className={className}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: error ? 'var(--error)' : 'var(--text)',
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: 10,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          {...props}
          style={{
            width: '100%',
            height: sizeConfig.height,
            fontSize: sizeConfig.fontSize,
            padding: leftIcon ? `${sizeConfig.padding.split(' ')[0]} ${sizeConfig.padding.split(' ')[1]} ${sizeConfig.padding.split(' ')[0]} 36px` : sizeConfig.padding,
            paddingRight: rightIcon ? '36px' : sizeConfig.padding.split(' ')[1],
            background: props.disabled ? 'var(--muted)' : 'var(--panel)',
            border: `1px solid ${error ? 'var(--error)' : 'var(--panel-border)'}`,
            borderRadius: 6,
            color: 'var(--text)',
            outline: 'none',
            transition: 'all 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--accent)';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--error)' : 'var(--panel-border)';
            e.target.style.boxShadow = 'none';
            props.onBlur?.(e);
          }}
        />
        
        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: 10,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p
          style={{
            fontSize: 12,
            color: error ? 'var(--error)' : 'var(--text-muted)',
            marginTop: 4,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export interface N3TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export function N3Textarea({
  label,
  error,
  helperText,
  fullWidth = false,
  rows = 4,
  className = '',
  style,
  ...props
}: N3TextareaProps) {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...style }} className={className}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 500,
            color: error ? 'var(--error)' : 'var(--text)',
            marginBottom: 6,
          }}
        >
          {label}
        </label>
      )}
      
      <textarea
        {...props}
        rows={rows}
        style={{
          width: '100%',
          fontSize: 13,
          padding: '8px 12px',
          background: props.disabled ? 'var(--muted)' : 'var(--panel)',
          border: `1px solid ${error ? 'var(--error)' : 'var(--panel-border)'}`,
          borderRadius: 6,
          color: 'var(--text)',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--accent)';
          e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--error)' : 'var(--panel-border)';
          e.target.style.boxShadow = 'none';
          props.onBlur?.(e);
        }}
      />
      
      {(error || helperText) && (
        <p
          style={{
            fontSize: 12,
            color: error ? 'var(--error)' : 'var(--text-muted)',
            marginTop: 4,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
