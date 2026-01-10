'use client';

import React, { memo, useMemo } from 'react';

// ============================================================
// N3ScoreCircle - Presentational Component
// ============================================================
// スコア円形表示（AIスコア、評価など）
// 受注管理のAIスコア表示で使用
// ============================================================

export type N3ScoreLevel = 'high' | 'medium' | 'low' | 'custom';

export interface N3ScoreCircleProps {
  /** スコア値 (0-100) */
  score: number;
  /** スコアレベル（自動計算または手動指定） */
  level?: N3ScoreLevel;
  /** 最大値（デフォルト100） */
  max?: number;
  /** サイズ */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** ラベル表示 */
  showLabel?: boolean;
  /** カスタムカラー */
  color?: string;
  /** カスタムクラス名 */
  className?: string;
}

const getAutoLevel = (score: number, max: number): N3ScoreLevel => {
  const percentage = (score / max) * 100;
  if (percentage >= 70) return 'high';
  if (percentage >= 40) return 'medium';
  return 'low';
};

export const N3ScoreCircle = memo(function N3ScoreCircle({
  score,
  level,
  max = 100,
  size = 'md',
  showLabel = false,
  color,
  className = '',
}: N3ScoreCircleProps) {
  const computedLevel = useMemo(() => {
    if (level && level !== 'custom') return level;
    if (color) return 'custom';
    return getAutoLevel(score, max);
  }, [score, max, level, color]);

  const style = color ? { '--n3-score-color': color } as React.CSSProperties : undefined;

  return (
    <div className={`n3-score-circle n3-score-circle--${computedLevel} n3-score-circle--${size} ${className}`} style={style}>
      <span className="n3-score-circle__value">{score}</span>
      {showLabel && <span className="n3-score-circle__label">/{max}</span>}
    </div>
  );
});

N3ScoreCircle.displayName = 'N3ScoreCircle';

export default N3ScoreCircle;
