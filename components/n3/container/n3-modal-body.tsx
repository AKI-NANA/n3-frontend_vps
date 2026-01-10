/**
 * N3ModalBody - モーダルボディコンポーネント
 * 
 * 用途:
 * - モーダルのメインコンテンツエリア
 * - スクロール対応
 * - パディング管理
 * 
 * Design Spec:
 * - 縦スクロールに対応
 * - padding: 1rem (デフォルト)
 * - flex: 1 で残り高さを確保
 */

'use client';

import React, { memo, ReactNode } from 'react';

export type BodyPadding = 'none' | 'sm' | 'md' | 'lg';
export type BodyScroll = 'auto' | 'hidden' | 'scroll';

export interface N3ModalBodyProps {
  /** 子要素 */
  children: ReactNode;
  /** パディング */
  padding?: BodyPadding;
  /** スクロール設定 */
  scroll?: BodyScroll;
  /** 背景色（CSS変数対応） */
  background?: string;
  /** 最小高さ */
  minHeight?: string | number;
  /** 最大高さ */
  maxHeight?: string | number;
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** カスタムクラス */
  className?: string;
}

const PADDING_MAP: Record<BodyPadding, string> = {
  none: '0',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
};

export const N3ModalBody = memo(function N3ModalBody({
  children,
  padding = 'md',
  scroll = 'auto',
  background,
  minHeight,
  maxHeight,
  style,
  className = '',
}: N3ModalBodyProps) {
  const baseStyle: React.CSSProperties = {
    flex: 1,
    minHeight: minHeight ?? 0,
    maxHeight: maxHeight,
    padding: PADDING_MAP[padding],
    overflowY: scroll,
    overflowX: 'hidden',
    background: background ?? 'var(--bg)',
    ...style,
  };

  return (
    <div className={`n3-modal-body ${className}`} style={baseStyle}>
      {children}
    </div>
  );
});

/**
 * N3ModalSection - モーダル内のセクション分割用
 * 
 * 用途:
 * - モーダルボディ内のコンテンツをセクション分け
 * - タイトル付きの区切り
 */
export interface N3ModalSectionProps {
  /** セクションタイトル */
  title?: string;
  /** 子要素 */
  children: ReactNode;
  /** タイトルなしの場合はdividerのみ */
  divider?: boolean;
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** カスタムクラス */
  className?: string;
}

export const N3ModalSection = memo(function N3ModalSection({
  title,
  children,
  divider = false,
  style,
  className = '',
}: N3ModalSectionProps) {
  return (
    <section
      className={`n3-modal-section ${className}`}
      style={{
        marginBottom: '1rem',
        ...style,
      }}
    >
      {title && (
        <h4
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.75rem',
            paddingBottom: '0.5rem',
            borderBottom: divider ? '1px solid var(--panel-border)' : 'none',
          }}
        >
          {title}
        </h4>
      )}
      {!title && divider && (
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid var(--panel-border)',
            marginBottom: '1rem',
          }}
        />
      )}
      <div>{children}</div>
    </section>
  );
});

/**
 * N3ModalGrid - モーダル内のグリッドレイアウト
 * 
 * 用途:
 * - 2カラム / 3カラムのグリッド配置
 * - フォーム要素の整列
 */
export interface N3ModalGridProps {
  /** 子要素 */
  children: ReactNode;
  /** カラム数 */
  columns?: 1 | 2 | 3 | 4;
  /** ギャップ */
  gap?: 'sm' | 'md' | 'lg';
  /** カスタムスタイル */
  style?: React.CSSProperties;
  /** カスタムクラス */
  className?: string;
}

const GAP_MAP: Record<'sm' | 'md' | 'lg', string> = {
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
};

export const N3ModalGrid = memo(function N3ModalGrid({
  children,
  columns = 2,
  gap = 'md',
  style,
  className = '',
}: N3ModalGridProps) {
  return (
    <div
      className={`n3-modal-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: GAP_MAP[gap],
        ...style,
      }}
    >
      {children}
    </div>
  );
});

export default N3ModalBody;
