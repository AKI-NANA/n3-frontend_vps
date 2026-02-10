/**
 * N3Badge - N3デザインシステムのバッジコンポーネント
 */

'use client';

import React from 'react';

export interface N3BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  onClick?: () => void;
}

export function N3Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  dot = false,
  onClick,
}: N3BadgeProps) {
  const variants = {
    default: {
      background: 'var(--accent)',
      color: 'white',
    },
    success: {
      background: 'var(--success)',
      color: 'white',
    },
    warning: {
      background: 'var(--warning)',
      color: 'white',
    },
    error: {
      background: 'var(--error)',
      color: 'white',
    },
    info: {
      background: 'var(--accent)',
      color: 'white',
    },
    secondary: {
      background: 'var(--muted)',
      color: 'var(--text)',
    },
  };

  const sizes = {
    sm: { fontSize: 10, padding: '2px 6px', height: 18 },
    md: { fontSize: 11, padding: '3px 8px', height: 20 },
    lg: { fontSize: 12, padding: '4px 10px', height: 24 },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dot ? 4 : 0,
        height: sizeStyle.height,
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        padding: sizeStyle.padding,
        background: variantStyle.background,
        color: variantStyle.color,
        borderRadius: 12,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
          }}
        />
      )}
      {children}
    </span>
  );
}
