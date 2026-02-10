// components/n3/n3-completion-indicator.tsx
/**
 * N3 Completion Indicator Component
 * 
 * 商品データの完成度を視覚的に表示
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

'use client';

import React, { memo, useMemo } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface N3CompletionIndicatorProps {
  /** 完成度（0-100） */
  completionRate: number;
  /** エラー数 */
  errorCount?: number;
  /** 警告数 */
  warningCount?: number;
  /** サイズ */
  size?: 'sm' | 'md' | 'lg';
  /** 詳細表示 */
  showDetails?: boolean;
  /** ツールチップテキスト */
  tooltip?: string;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** スタイル */
  style?: React.CSSProperties;
}

const SIZE_CONFIG = {
  sm: { circle: 24, stroke: 3, font: 8, icon: 10 },
  md: { circle: 36, stroke: 4, font: 10, icon: 14 },
  lg: { circle: 48, stroke: 5, font: 12, icon: 18 }
};

export const N3CompletionIndicator = memo(function N3CompletionIndicator({
  completionRate,
  errorCount = 0,
  warningCount = 0,
  size = 'md',
  showDetails = false,
  tooltip,
  onClick,
  style
}: N3CompletionIndicatorProps) {
  const config = SIZE_CONFIG[size];
  const radius = (config.circle - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;
  
  // 色の決定
  const color = useMemo(() => {
    if (errorCount > 0) return '#ef4444'; // 赤
    if (completionRate >= 80) return '#22c55e'; // 緑
    if (completionRate >= 60) return '#f59e0b'; // 黄
    return '#6b7280'; // グレー
  }, [completionRate, errorCount]);
  
  // ステータスアイコン
  const StatusIcon = useMemo(() => {
    if (errorCount > 0) return AlertCircle;
    if (warningCount > 0) return AlertTriangle;
    if (completionRate >= 80) return CheckCircle;
    return Info;
  }, [completionRate, errorCount, warningCount]);
  
  return (
    <div
      className="inline-flex items-center gap-2"
      style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
      onClick={onClick}
      title={tooltip}
    >
      {/* 円形プログレス */}
      <div className="relative" style={{ width: config.circle, height: config.circle }}>
        <svg
          width={config.circle}
          height={config.circle}
          className="transform -rotate-90"
        >
          {/* 背景円 */}
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            fill="none"
            stroke="var(--panel-border)"
            strokeWidth={config.stroke}
          />
          {/* プログレス円 */}
          <circle
            cx={config.circle / 2}
            cy={config.circle / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        {/* 中央テキスト */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: config.font, fontWeight: 600, color }}
        >
          {completionRate}
        </div>
      </div>
      
      {/* 詳細表示 */}
      {showDetails && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <StatusIcon size={config.icon} style={{ color }} />
            <span
              className="font-medium"
              style={{ fontSize: config.font + 2, color: 'var(--text)' }}
            >
              {completionRate}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            {errorCount > 0 && (
              <span className="flex items-center gap-0.5 text-red-500">
                <AlertCircle size={10} />
                {errorCount}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-0.5 text-amber-500">
                <AlertTriangle size={10} />
                {warningCount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default N3CompletionIndicator;
