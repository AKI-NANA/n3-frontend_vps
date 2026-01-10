'use client';

import React, { memo } from 'react';

// ============================================
// N3Loading - ローディングスピナー
// ============================================
export interface N3LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  centered?: boolean;
  className?: string;
}

export const N3Loading = memo(function N3Loading({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
  overlay = false,
  centered = false,
  className = '',
}: N3LoadingProps) {
  const sizeMap = { xs: 16, sm: 20, md: 28, lg: 36, xl: 48 };
  const spinnerSize = sizeMap[size];
  
  const colorMap: Record<string, string> = {
    primary: 'var(--accent, #6366f1)',
    secondary: 'var(--text-muted, #6b7280)',
    white: '#ffffff',
    current: 'currentColor',
  };

  const spinnerStyle: React.CSSProperties = {
    width: spinnerSize,
    height: spinnerSize,
    animation: 'n3-spinner-rotate 1s linear infinite',
  };

  const circleStyle: React.CSSProperties = {
    stroke: colorMap[color],
    strokeLinecap: 'round',
    animation: 'n3-spinner-dash 1.5s ease-in-out infinite',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    ...(centered && { justifyContent: 'center' }),
  };

  const content = (
    <>
      <style>{`
        @keyframes n3-spinner-rotate {
          100% { transform: rotate(360deg); }
        }
        @keyframes n3-spinner-dash {
          0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
          100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
        }
      `}</style>
      <div style={containerStyle} className={className}>
        <svg style={spinnerStyle} viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            style={circleStyle}
          />
        </svg>
        {text && (
          <span style={{ fontSize: '14px', color: 'var(--text-muted, #6b7280)' }}>
            {text}
          </span>
        )}
      </div>
    </>
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}>
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
      }}>
        {content}
      </div>
    );
  }

  return content;
});

// ============================================
// N3LoadingDots - ドットローディング
// ============================================
export interface N3LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white' | 'current';
  className?: string;
}

export const N3LoadingDots = memo(function N3LoadingDots({
  size = 'md',
  color = 'primary',
  className = '',
}: N3LoadingDotsProps) {
  const sizeMap = { sm: 6, md: 8, lg: 10 };
  const dotSize = sizeMap[size];
  
  const colorMap: Record<string, string> = {
    primary: 'var(--accent, #6366f1)',
    secondary: 'var(--text-muted, #6b7280)',
    white: '#ffffff',
    current: 'currentColor',
  };

  const dotStyle: React.CSSProperties = {
    width: dotSize,
    height: dotSize,
    borderRadius: '50%',
    background: colorMap[color],
  };

  return (
    <>
      <style>{`
        @keyframes n3-dot-bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
      <div style={{ display: 'flex', gap: '4px' }} className={className}>
        <span style={{ ...dotStyle, animation: 'n3-dot-bounce 1.4s infinite ease-in-out', animationDelay: '-0.32s' }} />
        <span style={{ ...dotStyle, animation: 'n3-dot-bounce 1.4s infinite ease-in-out', animationDelay: '-0.16s' }} />
        <span style={{ ...dotStyle, animation: 'n3-dot-bounce 1.4s infinite ease-in-out' }} />
      </div>
    </>
  );
});

export default N3Loading;
