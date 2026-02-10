'use client';

import { ReactNode } from 'react';
import { COLORS, SPACING } from './styles';

// 3カラムレイアウト（Overview, Final用）
interface ThreeColumnLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function ThreeColumnLayout({ left, center, right }: ThreeColumnLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 200px',
        gap: SPACING.xl,
        height: '100%',
        padding: SPACING.xl,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, overflow: 'auto' }}>
        {left}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, overflow: 'auto' }}>
        {center}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, overflow: 'auto' }}>
        {right}
      </div>
    </div>
  );
}

// 2カラムレイアウト（Data, Listing, Shipping, Tax, HTML用）
interface TwoColumnLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftWidth?: string;
  rightWidth?: string;
}

export function TwoColumnLayout({ 
  left, 
  right, 
  leftWidth = '1fr', 
  rightWidth = '1fr' 
}: TwoColumnLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${leftWidth} ${rightWidth}`,
        gap: SPACING.xl,
        height: '100%',
        padding: SPACING.xl,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, overflow: 'auto' }}>
        {left}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, overflow: 'auto' }}>
        {right}
      </div>
    </div>
  );
}

// 1カラムレイアウト（Images, Tools, Mirror, Competitors, Pricing, Qoo10用）
interface SingleColumnLayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export function SingleColumnLayout({ children, maxWidth }: SingleColumnLayoutProps) {
  return (
    <div
      style={{
        padding: SPACING.xl,
        height: '100%',
        overflow: 'auto',
        maxWidth: maxWidth || '100%',
        margin: maxWidth ? '0 auto' : undefined,
      }}
    >
      {children}
    </div>
  );
}

// グリッドレイアウト（カード一覧用）
interface GridLayoutProps {
  children: ReactNode;
  columns?: number;
  gap?: string;
}

export function GridLayout({ children, columns = 4, gap = SPACING.md }: GridLayoutProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

// フレックス行
interface FlexRowProps {
  children: ReactNode;
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function FlexRow({ 
  children, 
  gap = SPACING.md, 
  align = 'center',
  justify = 'start'
}: FlexRowProps) {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align,
        justifyContent: justifyMap[justify],
        gap,
      }}
    >
      {children}
    </div>
  );
}
