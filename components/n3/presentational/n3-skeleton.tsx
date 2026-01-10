'use client';

import React, { memo } from 'react';

// ============================================
// N3Skeleton - スケルトン
// ============================================
export interface N3SkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const N3Skeleton = memo(function N3Skeleton({
  width = '100%',
  height = 16,
  variant = 'text',
  animation = 'pulse',
  className = '',
}: N3SkeletonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'block',
    background: 'linear-gradient(90deg, var(--highlight, #e5e7eb) 25%, var(--panel, #f3f4f6) 50%, var(--highlight, #e5e7eb) 75%)',
    backgroundSize: '200% 100%',
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: variant === 'circular' ? '50%' : variant === 'rounded' ? '8px' : '4px',
    animation: animation === 'pulse' ? 'n3-skeleton-pulse 1.5s ease-in-out infinite' : 
               animation === 'wave' ? 'n3-skeleton-wave 1.5s ease-in-out infinite' : 'none',
  };

  return (
    <>
      <style>{`
        @keyframes n3-skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes n3-skeleton-wave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className={className} style={baseStyle} />
    </>
  );
});

// ============================================
// N3SkeletonText - テキストスケルトン
// ============================================
export interface N3SkeletonTextProps {
  lines?: number;
  lastLineWidth?: number | string;
  spacing?: 'sm' | 'md' | 'lg';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const N3SkeletonText = memo(function N3SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
  spacing = 'md',
  animation = 'pulse',
  className = '',
}: N3SkeletonTextProps) {
  const spacingMap = { sm: 4, md: 8, lg: 12 };
  
  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: `${spacingMap[spacing]}px` }}>
      {Array.from({ length: lines }).map((_, index) => (
        <N3Skeleton
          key={index}
          variant="text"
          animation={animation}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height={16}
        />
      ))}
    </div>
  );
});

// ============================================
// N3SkeletonAvatar - アバタースケルトン
// ============================================
export interface N3SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const N3SkeletonAvatar = memo(function N3SkeletonAvatar({
  size = 'md',
  animation = 'pulse',
  className = '',
}: N3SkeletonAvatarProps) {
  const sizeMap = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 };

  return (
    <N3Skeleton
      variant="circular"
      width={sizeMap[size]}
      height={sizeMap[size]}
      animation={animation}
      className={className}
    />
  );
});

// ============================================
// N3SkeletonTable - テーブルスケルトン
// ============================================
export interface N3SkeletonTableProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const N3SkeletonTable = memo(function N3SkeletonTable({
  rows = 5,
  columns = 4,
  hasHeader = true,
  animation = 'pulse',
  className = '',
}: N3SkeletonTableProps) {
  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
  };

  return (
    <div className={className}>
      {hasHeader && (
        <div style={{ ...rowStyle, background: 'var(--highlight, #f3f4f6)' }}>
          {Array.from({ length: columns }).map((_, index) => (
            <N3Skeleton key={index} variant="text" height={20} animation={animation} />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <N3Skeleton key={colIndex} variant="text" height={16} animation={animation} />
          ))}
        </div>
      ))}
    </div>
  );
});

export default N3Skeleton;
