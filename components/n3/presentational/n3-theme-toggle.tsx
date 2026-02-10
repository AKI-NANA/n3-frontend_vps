// components/n3/presentational/n3-theme-toggle.tsx
'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface N3ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export function N3ThemeToggle({ isDark, onToggle, size = 'sm' }: N3ThemeToggleProps) {
  const iconSize = size === 'sm' ? 14 : 18;
  const padding = size === 'sm' ? '6px' : '8px';
  
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size === 'sm' ? 32 : 40,
        height: size === 'sm' ? 32 : 40,
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
        background: isDark 
          ? 'linear-gradient(135deg, #1e293b, #334155)'
          : 'linear-gradient(135deg, #fef3c7, #fde68a)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: isDark 
          ? 'inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 2px rgba(255,255,255,0.05)'
          : 'inset 0 1px 2px rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.1)',
      }}
      title={isDark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
    >
      {isDark ? (
        <Moon size={iconSize} style={{ color: '#94a3b8' }} />
      ) : (
        <Sun size={iconSize} style={{ color: '#f59e0b' }} />
      )}
    </button>
  );
}
