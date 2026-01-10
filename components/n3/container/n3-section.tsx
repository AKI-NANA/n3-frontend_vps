// components/n3/container/n3-section.tsx
/**
 * N3Section - レイアウトセクションコンポーネント
 *
 * インラインスタイルの置き換え用
 * - パネル、グリッド、フレックスボックスを提供
 * - N3デザインシステムに準拠
 */

'use client';

import React, { memo, ReactNode } from 'react';

// ============================================================
// N3Panel - 汎用パネル
// ============================================================

export interface N3PanelProps {
  children: ReactNode;
  /** パディング */
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 背景色 */
  background?: 'panel' | 'bg' | 'highlight' | 'transparent';
  /** ボーダー */
  border?: boolean;
  /** 角丸 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加クラス名 */
  className?: string;
  /** 追加スタイル */
  style?: React.CSSProperties;
}

const paddingMap = {
  none: 0,
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

const roundedMap = {
  none: 0,
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
};

const backgroundMap = {
  panel: 'var(--panel)',
  bg: 'var(--bg)',
  highlight: 'var(--highlight)',
  transparent: 'transparent',
};

export const N3Panel = memo(function N3Panel({
  children,
  padding = 'md',
  background = 'panel',
  border = false,
  rounded = 'md',
  className = '',
  style,
}: N3PanelProps) {
  return (
    <div
      className={className}
      style={{
        padding: paddingMap[padding],
        background: backgroundMap[background],
        border: border ? '1px solid var(--panel-border)' : undefined,
        borderRadius: roundedMap[rounded],
        ...style,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================
// N3Flex - フレックスボックス
// ============================================================

export interface N3FlexProps {
  children: ReactNode;
  /** 方向 */
  direction?: 'row' | 'column';
  /** 配置（主軸） */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** 配置（交差軸） */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** ギャップ */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 折り返し */
  wrap?: boolean;
  /** 追加クラス名 */
  className?: string;
  /** 追加スタイル */
  style?: React.CSSProperties;
}

const justifyMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

const alignMap = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

const gapMap = {
  none: 0,
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const N3Flex = memo(function N3Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 'md',
  wrap = false,
  className = '',
  style,
}: N3FlexProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justifyMap[justify],
        alignItems: alignMap[align],
        gap: gapMap[gap],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================
// N3Grid - グリッド
// ============================================================

export interface N3GridProps {
  children: ReactNode;
  /** 列数 */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  /** ギャップ */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加クラス名 */
  className?: string;
  /** 追加スタイル */
  style?: React.CSSProperties;
}

export const N3Grid = memo(function N3Grid({
  children,
  columns = 'auto',
  gap = 'md',
  className = '',
  style,
}: N3GridProps) {
  const gridTemplateColumns =
    columns === 'auto'
      ? 'repeat(auto-fill, minmax(280px, 1fr))'
      : `repeat(${columns}, 1fr)`;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: gapMap[gap],
        ...style,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================
// N3Stack - 縦方向スタック
// ============================================================

export interface N3StackProps {
  children: ReactNode;
  /** ギャップ */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加クラス名 */
  className?: string;
  /** 追加スタイル */
  style?: React.CSSProperties;
}

export const N3Stack = memo(function N3Stack({
  children,
  gap = 'md',
  className = '',
  style,
}: N3StackProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: gapMap[gap],
        ...style,
      }}
    >
      {children}
    </div>
  );
});

// ============================================================
// N3Divider - 区切り線
// ============================================================

export interface N3DividerProps {
  /** 方向 */
  orientation?: 'horizontal' | 'vertical';
  /** マージン */
  margin?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加クラス名 */
  className?: string;
}

export const N3Divider = memo(function N3Divider({
  orientation = 'horizontal',
  margin = 'md',
  className = '',
}: N3DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={className}
      style={{
        width: isHorizontal ? '100%' : '1px',
        height: isHorizontal ? '1px' : '100%',
        background: 'var(--panel-border)',
        margin: isHorizontal
          ? `${gapMap[margin]} 0`
          : `0 ${gapMap[margin]}`,
      }}
    />
  );
});

// ============================================================
// N3Spacer - スペーサー
// ============================================================

export interface N3SpacerProps {
  /** サイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const N3Spacer = memo(function N3Spacer({
  size = 'md',
}: N3SpacerProps) {
  return <div style={{ height: gapMap[size] }} />;
});

export default N3Panel;
