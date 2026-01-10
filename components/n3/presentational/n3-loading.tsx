'use client';

import React, { memo } from 'react';
import { Loader2 } from 'lucide-react';

// ============================================================
// N3Loading - Presentational Component
// ============================================================
// ローディングスピナー/インジケーター
// - variant: spinner / dots / bar
// - size: sm / md / lg / xl
// - overlay: フルスクリーンオーバーレイ
// ============================================================

export interface N3LoadingProps {
  /** バリアント */
  variant?: 'spinner' | 'dots' | 'bar';
  /** サイズ */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** ローディングテキスト */
  text?: string;
  /** オーバーレイ表示 */
  overlay?: boolean;
  /** オーバーレイの透明度 */
  overlayOpacity?: number;
  /** 追加クラス名 */
  className?: string;
}

export const N3Loading = memo(function N3Loading({
  variant = 'spinner',
  size = 'md',
  text,
  overlay = false,
  overlayOpacity = 0.5,
  className = '',
}: N3LoadingProps) {
  const baseClass = 'n3-loading';
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--${size}`,
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <div className={classes}>
      {variant === 'spinner' && (
        <Loader2 className="n3-loading__spinner" />
      )}
      {variant === 'dots' && (
        <div className="n3-loading__dots">
          <span className="n3-loading__dot" />
          <span className="n3-loading__dot" />
          <span className="n3-loading__dot" />
        </div>
      )}
      {variant === 'bar' && (
        <div className="n3-loading__bar">
          <div className="n3-loading__bar-inner" />
        </div>
      )}
      {text && <span className="n3-loading__text">{text}</span>}
    </div>
  );

  if (overlay) {
    return (
      <div
        className="n3-loading-overlay"
        style={{ '--overlay-opacity': overlayOpacity } as React.CSSProperties}
      >
        {content}
      </div>
    );
  }

  return content;
});

N3Loading.displayName = 'N3Loading';

export default N3Loading;
