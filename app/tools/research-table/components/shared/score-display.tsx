/**
 * ScoreDisplay: スコア表示コンポーネント
 */

import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score?: number | null;
  maxScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showBar?: boolean;
  label?: string;
}

export function ScoreDisplay({
  score,
  maxScore = 100,
  size = 'md',
  showBar = false,
  label,
}: ScoreDisplayProps) {
  if (score === null || score === undefined) {
    return <span className="text-gray-400 text-[10px]">-</span>;
  }

  const percentage = Math.min((score / maxScore) * 100, 100);

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500' };
    if (pct >= 60) return { text: 'text-blue-600', bg: 'bg-blue-500' };
    if (pct >= 40) return { text: 'text-yellow-600', bg: 'bg-yellow-500' };
    return { text: 'text-red-600', bg: 'bg-red-500' };
  };

  const colors = getScoreColor(percentage);

  const sizeClasses = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm font-semibold',
  };

  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <span className="text-[9px] text-muted-foreground">{label}</span>
      )}
      <div className="flex items-center gap-1.5">
        <span className={cn('font-mono', sizeClasses[size], colors.text)}>
          {score.toFixed(1)}
        </span>
        {showBar && (
          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full transition-all', colors.bg)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// 複数スコア表示
interface MultiScoreDisplayProps {
  totalScore?: number | null;
  profitScore?: number | null;
  salesScore?: number | null;
  riskScore?: number | null;
}

export function MultiScoreDisplay({
  totalScore,
  profitScore,
  salesScore,
  riskScore,
}: MultiScoreDisplayProps) {
  return (
    <div className="grid grid-cols-2 gap-1 text-[10px]">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">総合:</span>
        <ScoreDisplay score={totalScore} size="sm" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">利益:</span>
        <ScoreDisplay score={profitScore} size="sm" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">販売:</span>
        <ScoreDisplay score={salesScore} size="sm" />
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">リスク:</span>
        <ScoreDisplay score={riskScore} size="sm" />
      </div>
    </div>
  );
}
