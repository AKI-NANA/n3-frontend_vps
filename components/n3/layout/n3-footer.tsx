'use client';

import React, { memo, ReactNode } from 'react';
import Link from 'next/link';

// ============================================
// N3Footer - フッター
// ============================================
export interface N3FooterLink {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}

export interface N3FooterProps {
  copyright?: string;
  logo?: ReactNode;
  links?: N3FooterLink[];
  simple?: boolean;
  fixed?: boolean;
  className?: string;
}

export const N3Footer = memo(function N3Footer({
  copyright = '© 2025 N3 Platform',
  logo,
  links = [],
  simple = true,
  fixed = false,
  className = '',
}: N3FooterProps) {
  return (
    <footer
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: simple ? 'center' : 'space-between',
        gap: '1rem',
        padding: simple ? '0.75rem 1rem' : '1rem 1.5rem',
        fontSize: '12px',
        color: 'var(--text-muted)',
        background: 'var(--panel)',
        borderTop: '1px solid var(--panel-border)',
        ...(fixed && {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }),
      }}
    >
      {/* ロゴ（フルモード） */}
      {!simple && logo && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {logo}
        </div>
      )}

      {/* 中央: コピーライト + リンク */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <span>{copyright}</span>

        {links.length > 0 && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {links.map((link, index) => (
              <React.Fragment key={link.id}>
                {index > 0 && (
                  <span style={{ color: 'var(--text-subtle)' }}>|</span>
                )}
                {link.href ? (
                  <Link
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    style={{
                      color: 'var(--text-muted)',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={link.onClick}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }}
                  >
                    {link.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      {/* 右側スペーサー（フルモード） */}
      {!simple && logo && <div style={{ width: '1px' }} />}
    </footer>
  );
});

export default N3Footer;
