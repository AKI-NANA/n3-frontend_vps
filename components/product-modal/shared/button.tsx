'use client';

import { CSSProperties, ReactNode } from 'react';
import { COLORS, FONTS, SPACING, RADIUS } from './styles';

// プライマリボタン
interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: CSSProperties;
}

export function Button({
  children,
  onClick,
  icon,
  disabled,
  loading,
  variant = 'primary',
  size = 'md',
  fullWidth,
  style,
}: ButtonProps) {
  const sizeStyles = {
    sm: { padding: '0.35rem 0.75rem', fontSize: FONTS.sizeXs },
    md: { padding: '0.5rem 1rem', fontSize: FONTS.sizeSm },
    lg: { padding: '0.6rem 1.25rem', fontSize: FONTS.sizeBase },
  };

  const variantStyles = {
    primary: {
      background: COLORS.primary,
      color: 'white',
      border: 'none',
      hoverBg: COLORS.primaryHover,
    },
    secondary: {
      background: COLORS.bgCard,
      color: COLORS.textPrimary,
      border: `1px solid ${COLORS.border}`,
      hoverBg: COLORS.bgMuted,
    },
    danger: {
      background: COLORS.bgCard,
      color: COLORS.error,
      border: `1px solid ${COLORS.errorLight}`,
      hoverBg: COLORS.errorLight,
    },
    ghost: {
      background: 'transparent',
      color: COLORS.textSecondary,
      border: 'none',
      hoverBg: COLORS.bgMuted,
    },
  };

  const s = sizeStyles[size];
  const v = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 500,
        borderRadius: RADIUS.md,
        border: v.border,
        background: disabled ? COLORS.bgMuted : v.background,
        color: disabled ? COLORS.textMuted : v.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        transition: 'all 0.15s ease',
        width: fullWidth ? '100%' : 'auto',
        opacity: loading ? 0.7 : 1,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = v.hoverBg;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = v.background;
        }
      }}
    >
      {loading ? (
        <i className="fas fa-spinner fa-spin" />
      ) : icon ? (
        <i className={`fas ${icon}`} />
      ) : null}
      {children}
    </button>
  );
}

// アクションボタン（右サイドバー用）
interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export function ActionButton({ icon, label, onClick, variant = 'default' }: ActionButtonProps) {
  const isDanger = variant === 'danger';

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '0.6rem 0.75rem',
        fontSize: FONTS.sizeSm,
        fontWeight: 500,
        borderRadius: RADIUS.md,
        border: `1px solid ${isDanger ? '#fecaca' : COLORS.border}`,
        background: COLORS.bgCard,
        color: isDanger ? COLORS.error : COLORS.textPrimary,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.sm,
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = isDanger ? '#f87171' : COLORS.primary;
        e.currentTarget.style.color = isDanger ? '#b91c1c' : COLORS.primary;
        e.currentTarget.style.background = isDanger ? COLORS.errorLight : COLORS.bgMuted;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDanger ? '#fecaca' : COLORS.border;
        e.currentTarget.style.color = isDanger ? COLORS.error : COLORS.textPrimary;
        e.currentTarget.style.background = COLORS.bgCard;
      }}
    >
      <i className={`fas ${icon}`} style={{ width: '1rem' }} />
      {label}
    </button>
  );
}

// アイコンボタン（小さい）
interface IconButtonProps {
  icon: string;
  onClick: () => void;
  title?: string;
  variant?: 'default' | 'primary';
}

export function IconButton({ icon, onClick, title, variant = 'default' }: IconButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        padding: '0.4rem 0.6rem',
        fontSize: FONTS.sizeSm,
        borderRadius: RADIUS.sm,
        border: isPrimary ? 'none' : `1px solid ${COLORS.border}`,
        background: isPrimary ? COLORS.primary : COLORS.bgCard,
        color: isPrimary ? 'white' : COLORS.textSecondary,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: SPACING.xs,
        transition: 'all 0.15s ease',
      }}
    >
      <i className={`fas ${icon}`} />
    </button>
  );
}
