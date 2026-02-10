'use client';

import { CSSProperties } from 'react';
import { COLORS, FONTS, SPACING, RADIUS } from './styles';

// バッジ
interface BadgeProps {
  children: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: CSSProperties;
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {
  const variantStyles = {
    success: { bg: COLORS.successLight, color: COLORS.success },
    warning: { bg: COLORS.warningLight, color: COLORS.warning },
    error: { bg: COLORS.errorLight, color: COLORS.error },
    info: { bg: COLORS.primaryLight, color: COLORS.primary },
    default: { bg: COLORS.bgMuted, color: COLORS.textSecondary },
  };

  const s = variantStyles[variant];

  return (
    <span
      style={{
        padding: '0.25rem 0.6rem',
        fontSize: FONTS.sizeXs,
        fontWeight: 600,
        borderRadius: RADIUS.sm,
        background: s.bg,
        color: s.color,
        display: 'inline-block',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

// ステータスドット
interface StatusDotProps {
  status: 'success' | 'warning' | 'error' | 'neutral';
  label?: string;
}

export function StatusDot({ status, label }: StatusDotProps) {
  const colors = {
    success: COLORS.success,
    warning: COLORS.warning,
    error: COLORS.error,
    neutral: COLORS.textMuted,
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: SPACING.xs }}>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: colors[status],
        }}
      />
      {label && (
        <span style={{ fontSize: FONTS.sizeSm, color: COLORS.textSecondary }}>
          {label}
        </span>
      )}
    </span>
  );
}

// 数値表示（大きめ）
interface StatValueProps {
  value: string | number;
  label: string;
  color?: string;
  prefix?: string;
  suffix?: string;
}

export function StatValue({ value, label, color, prefix, suffix }: StatValueProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: FONTS.sizeXs,
          textTransform: 'uppercase',
          color: COLORS.textMuted,
          marginBottom: SPACING.xs,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: FONTS.sizeLg,
          fontWeight: 700,
          fontFamily: FONTS.mono,
          color: color || COLORS.textPrimary,
        }}
      >
        {prefix}{value}{suffix}
      </div>
    </div>
  );
}

// 情報行（ラベル: 値）
interface InfoRowProps {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
}

export function InfoRow({ label, value, mono }: InfoRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${SPACING.xs} 0`,
      }}
    >
      <span style={{ fontSize: FONTS.sizeSm, color: COLORS.textSecondary }}>
        {label}
      </span>
      <span
        style={{
          fontSize: FONTS.sizeSm,
          fontFamily: mono ? FONTS.mono : 'inherit',
          color: COLORS.textPrimary,
        }}
      >
        {value ?? '-'}
      </span>
    </div>
  );
}
