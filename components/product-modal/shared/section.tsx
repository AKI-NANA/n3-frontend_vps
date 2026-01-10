'use client';

import { ReactNode } from 'react';
import { COLORS, FONTS, SPACING, RADIUS } from './styles';

interface SectionProps {
  title: string;
  titleColor?: string;
  children: ReactNode;
  variant?: 'default' | 'primary' | 'warning' | 'purple';
  className?: string;
}

export function Section({ 
  title, 
  titleColor,
  children, 
  variant = 'default',
  className 
}: SectionProps) {
  const variantStyles = {
    default: {
      border: `1px solid ${COLORS.border}`,
      background: COLORS.bgCard,
      titleColor: COLORS.textSecondary,
    },
    primary: {
      border: `2px solid ${COLORS.primaryBorder}`,
      background: COLORS.primaryLight,
      titleColor: COLORS.primary,
    },
    warning: {
      border: `1px solid #fcd34d`,
      background: '#fffbeb',
      titleColor: '#92400e',
    },
    purple: {
      border: 'none',
      background: `linear-gradient(135deg, ${COLORS.purpleLight}, rgba(147, 51, 234, 0.08))`,
      titleColor: COLORS.purple,
    },
  };

  const style = variantStyles[variant];

  return (
    <div
      className={className}
      style={{
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        border: style.border,
        background: style.background,
      }}
    >
      <div
        style={{
          fontSize: FONTS.sizeXs,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
          color: titleColor || style.titleColor,
          marginBottom: SPACING.md,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
