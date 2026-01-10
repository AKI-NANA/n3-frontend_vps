/**
 * N3Card - N3デザインシステムのカードコンポーネント
 */

'use client';

import React from 'react';

export interface N3CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function N3Card({ 
  children, 
  className = '', 
  onClick, 
  hoverable = false,
  padding = 'md',
}: N3CardProps) {
  const paddingStyles = {
    none: '0',
    sm: '12px',
    md: '16px',
    lg: '24px',
  };

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 8,
        padding: paddingStyles[padding],
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        ...(hoverable && {
          ':hover': {
            borderColor: 'var(--accent)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }
        })
      }}
    >
      {children}
    </div>
  );
}

export interface N3CardHeaderProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function N3CardHeader({ children, title, description, icon }: N3CardHeaderProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: description ? 4 : 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{title}</h3>
          {icon && <div style={{ color: 'var(--text-muted)' }}>{icon}</div>}
        </div>
      )}
      {description && (
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{description}</p>
      )}
      {!title && !description && children}
    </div>
  );
}

export interface N3CardContentProps {
  children: React.ReactNode;
}

export function N3CardContent({ children }: N3CardContentProps) {
  return <div>{children}</div>;
}
