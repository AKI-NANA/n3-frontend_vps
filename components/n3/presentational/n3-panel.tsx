/**
 * N3Panel - ガラス効果パネルコンポーネント
 * 
 * 背景は完全に透明、ホバー時は不透明になる
 * ツールパネル、アクションバーなどの基盤コンポーネント
 */

'use client';

import React, { memo, useState, type ReactNode, type CSSProperties } from 'react';

export interface N3PanelProps {
  /** 子要素 */
  children: ReactNode;
  /** パディング */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  /** ボーダー位置 */
  border?: 'none' | 'top' | 'bottom' | 'both';
  /** 透明モード（ホバーで不透明になる） */
  transparent?: boolean;
  /** 常に不透明 */
  solid?: boolean;
  /** カスタムスタイル */
  style?: CSSProperties;
  /** カスタムクラス */
  className?: string;
}

const PADDING_MAP = {
  none: '0',
  xs: '4px 8px',
  sm: '8px 12px',
  md: '12px 16px',
  lg: '16px 20px',
};

export const N3Panel = memo(function N3Panel({
  children,
  padding = 'sm',
  border = 'bottom',
  transparent = true,
  solid = false,
  style,
  className = '',
}: N3PanelProps) {
  const [isHovered, setIsHovered] = useState(false);

  // 背景の決定 - 透明モードは完全透明
  const getBackground = () => {
    if (solid) {
      return 'var(--panel)';
    }
    if (transparent && !isHovered) {
      return 'transparent';
    }
    return 'var(--panel)';
  };

  // ボーダーの決定 - 透明時はボーダーも透明
  const getBorder = () => {
    const borderColor = transparent && !isHovered 
      ? 'transparent' 
      : 'var(--panel-border)';
    
    switch (border) {
      case 'top':
        return { borderTop: `1px solid ${borderColor}` };
      case 'bottom':
        return { borderBottom: `1px solid ${borderColor}` };
      case 'both':
        return { 
          borderTop: `1px solid ${borderColor}`,
          borderBottom: `1px solid ${borderColor}`,
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`n3-panel ${className}`}
      style={{
        padding: PADDING_MAP[padding],
        background: getBackground(),
        transition: 'background 0.15s ease, border-color 0.15s ease',
        ...getBorder(),
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
});

export default N3Panel;
