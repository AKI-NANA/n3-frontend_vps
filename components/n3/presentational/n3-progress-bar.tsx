'use client';

import React, { memo } from 'react';

// ============================================================
// N3ProgressBar - Presentational Component
// ============================================================
// 水平プログレスバー
// - variant: default / success / warning / error / info
// - size: xs / sm / md / lg
// - ラベル・パーセント表示対応
// - アニメーション対応
// ============================================================

export interface N3ProgressBarProps {
  /** 現在値 (0-100) */
  value: number;
  /** 最大値 */
  max?: number;
  /** バリアント */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  /** サイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** ラベル */
  label?: string;
  /** パーセント表示 */
  showPercent?: boolean;
  /** 値表示 (例: "50/100") */
  showValue?: boolean;
  /** ストライプアニメーション */
  striped?: boolean;
  /** アニメーション */
  animated?: boolean;
  /** 不確定状態（進行中だが進捗不明） */
  indeterminate?: boolean;
  /** 追加クラス名 */
  className?: string;
}

export const N3ProgressBar = memo(function N3ProgressBar({
  value,
  max = 100,
  variant = 'default',
  size = 'md',
  label,
  showPercent = false,
  showValue = false,
  striped = false,
  animated = false,
  indeterminate = false,
  className = '',
}: N3ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const baseClass = 'n3-progress-bar';
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    className,
  ].filter(Boolean).join(' ');

  const trackClasses = [
    `${baseClass}__track`,
    `${baseClass}__track--${size}`,
  ].filter(Boolean).join(' ');

  const fillClasses = [
    `${baseClass}__fill`,
    `${baseClass}__fill--${variant}`,
    striped ? `${baseClass}__fill--striped` : '',
    animated ? `${baseClass}__fill--animated` : '',
    indeterminate ? `${baseClass}__fill--indeterminate` : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {(label || showPercent || showValue) && (
        <div className="n3-progress-bar__header">
          {label && <span className="n3-progress-bar__label">{label}</span>}
          <span className="n3-progress-bar__value">
            {showValue && `${value}/${max}`}
            {showPercent && !showValue && `${Math.round(percent)}%`}
          </span>
        </div>
      )}
      <div
        className={trackClasses}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={fillClasses}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
    </div>
  );
});

N3ProgressBar.displayName = 'N3ProgressBar';

export default N3ProgressBar;
