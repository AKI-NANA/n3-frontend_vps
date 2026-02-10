/**
 * N3Button - N3デザインシステムのボタンコンポーネント
 */

'use client';

import React from 'react';

export interface N3ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function N3Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  style,
  ...props
}: N3ButtonProps) {
  const variants = {
    primary: {
      background: 'var(--accent)',
      color: 'white',
      border: 'none',
      hover: { background: 'var(--accent-hover)', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' },
    },
    secondary: {
      background: 'var(--panel)',
      color: 'var(--text)',
      border: '1px solid var(--panel-border)',
      hover: { background: 'var(--highlight)', borderColor: 'var(--accent)' },
    },
    success: {
      background: 'var(--success)',
      color: 'white',
      border: 'none',
      hover: { background: 'var(--success-hover)', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' },
    },
    warning: {
      background: 'var(--warning)',
      color: 'white',
      border: 'none',
      hover: { background: 'var(--warning-hover)', boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)' },
    },
    error: {
      background: 'var(--error)',
      color: 'white',
      border: 'none',
      hover: { background: 'var(--error-hover)', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)' },
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text)',
      border: 'none',
      hover: { background: 'var(--highlight)' },
    },
    outline: {
      background: 'transparent',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      hover: { background: 'rgba(59, 130, 246, 0.05)' },
    },
  };

  const sizes = {
    sm: { height: 32, fontSize: 12, padding: '6px 12px' },
    md: { height: 36, fontSize: 13, padding: '8px 16px' },
    lg: { height: 40, fontSize: 14, padding: '10px 20px' },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={className}
      style={{
        width: fullWidth ? '100%' : 'auto',
        height: sizeStyle.height,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        padding: sizeStyle.padding,
        background: isDisabled ? 'var(--muted)' : variantStyle.background,
        color: isDisabled ? 'var(--text-muted)' : variantStyle.color,
        border: variantStyle.border,
        borderRadius: 6,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        transition: 'all 0.2s ease',
        opacity: isDisabled ? 0.6 : 1,
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled && variantStyle.hover) {
          Object.assign(e.currentTarget.style, variantStyle.hover);
        }
        props.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.background = variantStyle.background;
          e.currentTarget.style.boxShadow = 'none';
          if (variantStyle.border) {
            e.currentTarget.style.borderColor = variantStyle.border.includes('solid') 
              ? variantStyle.border.split(' ')[2] 
              : '';
          }
        }
        props.onMouseLeave?.(e);
      }}
    >
      {loading && (
        <span
          style={{
            width: 14,
            height: 14,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      )}
      {!loading && leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
      {children}
      {!loading && rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
      
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
