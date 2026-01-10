/**
 * N3Tooltip - ツールチップコンポーネント
 * 
 * CSS + hover による軽量実装
 * - z-index最大化で他要素の上に表示
 * - 背景は常に不透明（var(--text)を使用）
 */

'use client';

import React, { memo, ReactNode } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface N3TooltipProps {
  /** ツールチップの内容 */
  content: ReactNode;
  /** ラップする要素 */
  children: ReactNode;
  /** 表示位置 */
  position?: TooltipPosition;
  /** 遅延表示（ms） */
  delay?: number;
  /** 最大幅 */
  maxWidth?: number;
  /** 無効化 */
  disabled?: boolean;
}

export const N3Tooltip = memo(function N3Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  maxWidth = 250,
  disabled = false,
}: N3TooltipProps) {
  if (disabled || !content) {
    return <>{children}</>;
  }

  const getPositionStyles = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '6px',
        };
      case 'bottom':
        return {
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '6px',
        };
      case 'left':
        return {
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '6px',
        };
      case 'right':
        return {
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '6px',
        };
    }
  };

  return (
    <span
      className="n3-tooltip-wrapper"
      style={{
        position: 'relative',
        display: 'inline-flex',
      }}
    >
      {children}
      <span
        className={`n3-tooltip n3-tooltip-${position}`}
        style={{
          position: 'absolute',
          ...getPositionStyles(),
          padding: '6px 10px',
          fontSize: '11px',
          fontWeight: 500,
          lineHeight: 1.4,
          /* 背景は常に不透明 - 絶対にrgbaやtransparentを使わない */
          color: '#ffffff',
          background: '#1f2937', /* 固定の暗い色 */
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          maxWidth,
          zIndex: 99999,
          opacity: 0,
          visibility: 'hidden',
          transition: `opacity ${delay}ms ease, visibility ${delay}ms ease`,
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        {content}
      </span>
      <style jsx>{`
        .n3-tooltip-wrapper:hover {
          z-index: 99999;
        }
        .n3-tooltip-wrapper:hover .n3-tooltip {
          opacity: 1;
          visibility: visible;
        }
      `}</style>
    </span>
  );
});

/**
 * N3TooltipText - テキスト専用ツールチップ
 * 
 * 省略されたテキストにホバーで全文表示
 */
export interface N3TooltipTextProps {
  text: string;
  maxLength?: number;
  position?: TooltipPosition;
  className?: string;
}

export const N3TooltipText = memo(function N3TooltipText({
  text,
  maxLength = 30,
  position = 'top',
  className = '',
}: N3TooltipTextProps) {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.substring(0, maxLength)}...` : text;

  if (!shouldTruncate) {
    return <span className={className}>{text}</span>;
  }

  return (
    <N3Tooltip content={text} position={position}>
      <span className={className} style={{ cursor: 'help' }}>
        {displayText}
      </span>
    </N3Tooltip>
  );
});
