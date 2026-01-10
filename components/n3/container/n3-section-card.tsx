/**
 * N3SectionCard - セクションカードコンポーネント
 * 
 * /tools/editing の ProductModal で使用
 * タイトル付きのコンテンツカード
 */

'use client';

import React, { memo } from 'react';

export interface N3SectionCardProps {
  /** タイトル */
  title: string;
  /** 子要素 */
  children: React.ReactNode;
  /** アクセントカラー（ボーダー色） */
  accent?: boolean;
  /** アクセントカラー値 */
  accentColor?: string;
  /** 警告スタイル */
  warning?: boolean;
  /** グラデーション背景 */
  gradient?: boolean;
  /** グラデーション色 */
  gradientColors?: [string, string];
  /** パディング */
  padding?: string;
}

export const N3SectionCard = memo(function N3SectionCard({
  title,
  children,
  accent = false,
  accentColor = 'var(--accent)',
  warning = false,
  gradient = false,
  gradientColors = ['var(--accent)', 'var(--purple)'],
  padding = '0.75rem',
}: N3SectionCardProps) {
  // スタイルの決定
  let cardStyle: React.CSSProperties = {
    padding,
    borderRadius: '6px',
    background: 'var(--panel)',
    border: '1px solid var(--panel-border)',
  };

  let titleColor = 'var(--text-muted)';

  if (accent) {
    cardStyle = {
      ...cardStyle,
      border: `1px solid ${accentColor}40`,
      background: `${accentColor}05`,
    };
    titleColor = accentColor;
  }

  if (warning) {
    cardStyle = {
      ...cardStyle,
      background: '#fef3c7',
      border: '1px solid #fcd34d',
    };
    titleColor = '#92400e';
  }

  if (gradient) {
    cardStyle = {
      ...cardStyle,
      background: `linear-gradient(135deg, ${gradientColors[0]}15, ${gradientColors[1]}15)`,
      border: 'none',
    };
    titleColor = gradientColors[0];
  }

  return (
    <div style={cardStyle}>
      <div
        style={{
          fontSize: '9px',
          textTransform: 'uppercase',
          fontWeight: 600,
          color: titleColor,
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
});
