/**
 * N3Divider - Presentational Component
 * 
 * 区切り線（縦/横）
 */

'use client';

import { memo, type CSSProperties } from 'react';

export interface N3DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: CSSProperties;
}

export const N3Divider = memo(function N3Divider({
  orientation = 'horizontal',
  className = '',
  style,
}: N3DividerProps) {
  return (
    <div 
      className={`n3-divider n3-divider-${orientation} ${className}`} 
      style={style}
    />
  );
});

N3Divider.displayName = 'N3Divider';
