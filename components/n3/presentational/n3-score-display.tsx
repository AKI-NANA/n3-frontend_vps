/**
 * N3ScoreDisplay - スコア表示コンポーネント
 *
 * スコア値とオプションでプログレスバーを表示
 * 
 * 設計原則:
 * - 純粋なPresentationalコンポーネント
 * - スコア計算ロジックは持たない（Propsで受け取る）
 * - 状態なし
 *
 * @example
 * <N3ScoreDisplay score={85.5} />
 * <N3ScoreDisplay score={72} showBar />
 * <N3ScoreDisplay score={45} showBar label="総合" />
 */

import { memo } from 'react';

// ============================================================
// Types
// ============================================================

export type N3ScoreSize = 'sm' | 'md' | 'lg';

export interface N3ScoreDisplayProps {
  /** スコア値 (0-100) */
  score?: number | null;
  /** 最大スコア */
  maxScore?: number;
  /** サイズ */
  size?: N3ScoreSize;
  /** プログレスバー表示 */
  showBar?: boolean;
  /** ラベル */
  label?: string;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Config
// ============================================================

const SIZE_MAP: Record<N3ScoreSize, { font: number; labelFont: number; barHeight: number; barWidth: number }> = {
  sm: { font: 10, labelFont: 9, barHeight: 4, barWidth: 36 },
  md: { font: 12, labelFont: 9, barHeight: 6, barWidth: 48 },
  lg: { font: 14, labelFont: 10, barHeight: 8, barWidth: 64 },
};

// ============================================================
// Helpers
// ============================================================

function getScoreColor(percentage: number): string {
  if (percentage >= 80) return 'var(--success)';
  if (percentage >= 60) return 'var(--info)';
  if (percentage >= 40) return 'var(--warning)';
  return 'var(--error)';
}

// ============================================================
// Component
// ============================================================

export const N3ScoreDisplay = memo(function N3ScoreDisplay({
  score,
  maxScore = 100,
  size = 'md',
  showBar = false,
  label,
  className = '',
}: N3ScoreDisplayProps) {
  // Null/undefined check
  if (score === null || score === undefined) {
    return (
      <span 
        className={className}
        style={{ color: 'var(--text-muted)', fontSize: SIZE_MAP[size].font }}
      >
        -
      </span>
    );
  }

  const percentage = Math.min((score / maxScore) * 100, 100);
  const color = getScoreColor(percentage);
  const sizeConfig = SIZE_MAP[size];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  };

  const valueRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  };

  const scoreStyle: React.CSSProperties = {
    fontFamily: 'monospace',
    fontSize: sizeConfig.font,
    fontWeight: 600,
    color,
  };

  const barContainerStyle: React.CSSProperties = {
    width: sizeConfig.barWidth,
    height: sizeConfig.barHeight,
    backgroundColor: 'var(--highlight)',
    borderRadius: sizeConfig.barHeight / 2,
    overflow: 'hidden',
  };

  const barFillStyle: React.CSSProperties = {
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: color,
    borderRadius: sizeConfig.barHeight / 2,
    transition: 'width 0.3s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: sizeConfig.labelFont,
    color: 'var(--text-muted)',
  };

  return (
    <div className={className} style={containerStyle}>
      {label && <span style={labelStyle}>{label}</span>}
      <div style={valueRowStyle}>
        <span style={scoreStyle}>{score.toFixed(1)}</span>
        {showBar && (
          <div style={barContainerStyle}>
            <div style={barFillStyle} />
          </div>
        )}
      </div>
    </div>
  );
});

N3ScoreDisplay.displayName = 'N3ScoreDisplay';

// ============================================================
// 複数スコア表示バリエーション
// ============================================================

export interface N3MultiScoreDisplayProps {
  totalScore?: number | null;
  profitScore?: number | null;
  salesScore?: number | null;
  riskScore?: number | null;
  className?: string;
}

export const N3MultiScoreDisplay = memo(function N3MultiScoreDisplay({
  totalScore,
  profitScore,
  salesScore,
  riskScore,
  className = '',
}: N3MultiScoreDisplayProps) {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 4,
    fontSize: 10,
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  };

  const labelStyle: React.CSSProperties = {
    color: 'var(--text-muted)',
  };

  return (
    <div className={className} style={gridStyle}>
      <div style={itemStyle}>
        <span style={labelStyle}>総合:</span>
        <N3ScoreDisplay score={totalScore} size="sm" />
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>利益:</span>
        <N3ScoreDisplay score={profitScore} size="sm" />
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>販売:</span>
        <N3ScoreDisplay score={salesScore} size="sm" />
      </div>
      <div style={itemStyle}>
        <span style={labelStyle}>リスク:</span>
        <N3ScoreDisplay score={riskScore} size="sm" />
      </div>
    </div>
  );
});

N3MultiScoreDisplay.displayName = 'N3MultiScoreDisplay';
