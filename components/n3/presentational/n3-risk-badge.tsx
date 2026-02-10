/**
 * N3RiskBadge - リスクレベル表示バッジ
 *
 * リスクレベル（low/medium/high）をアイコン付きバッジで表示
 * 
 * 設計原則:
 * - リスク判定ロジックは外部で行う
 * - このコンポーネントは結果を表示するだけ
 * - 状態なし
 *
 * @example
 * <N3RiskBadge level="low" />
 * <N3RiskBadge level="high" showDetails section301Risk veroRisk />
 */

import { memo } from 'react';
import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import type { RiskLevel } from '@/types/research';

// ============================================================
// Types
// ============================================================

export interface N3RiskBadgeProps {
  /** リスクレベル */
  level?: RiskLevel | null;
  /** 301条リスク */
  section301Risk?: boolean;
  /** VeROリスク */
  veroRisk?: boolean;
  /** 詳細表示（301条/VeROタグ） */
  showDetails?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Config
// ============================================================

const RISK_CONFIG: Record<RiskLevel, { 
  bg: string; 
  color: string; 
  Icon: typeof Shield; 
  label: string;
}> = {
  low: { 
    bg: 'rgba(16, 185, 129, 0.1)', 
    color: 'var(--success)', 
    Icon: Shield, 
    label: 'Low' 
  },
  medium: { 
    bg: 'rgba(245, 158, 11, 0.1)', 
    color: 'var(--warning)', 
    Icon: AlertCircle, 
    label: 'Medium' 
  },
  high: { 
    bg: 'rgba(239, 68, 68, 0.1)', 
    color: 'var(--error)', 
    Icon: AlertTriangle, 
    label: 'High' 
  },
};

// ============================================================
// Component
// ============================================================

export const N3RiskBadge = memo(function N3RiskBadge({
  level,
  section301Risk = false,
  veroRisk = false,
  showDetails = false,
  className = '',
}: N3RiskBadgeProps) {
  // Null check
  if (!level) {
    return (
      <span 
        className={className}
        style={{ color: 'var(--text-muted)', fontSize: 10 }}
      >
        -
      </span>
    );
  }

  const { bg, color, Icon, label } = RISK_CONFIG[level];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  };

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 500,
    backgroundColor: bg,
    color,
  };

  const detailsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 4,
  };

  const tagStyle = (tagColor: string, tagBg: string): React.CSSProperties => ({
    fontSize: 8,
    padding: '1px 4px',
    borderRadius: 2,
    backgroundColor: tagBg,
    color: tagColor,
  });

  return (
    <div className={className} style={containerStyle}>
      <span style={badgeStyle}>
        <Icon size={12} />
        {label}
      </span>

      {showDetails && (section301Risk || veroRisk) && (
        <div style={detailsStyle}>
          {section301Risk && (
            <span style={tagStyle('var(--warning)', 'rgba(245, 158, 11, 0.1)')}>
              301条
            </span>
          )}
          {veroRisk && (
            <span style={tagStyle('#9333ea', 'rgba(147, 51, 234, 0.1)')}>
              VeRO
            </span>
          )}
        </div>
      )}
    </div>
  );
});

N3RiskBadge.displayName = 'N3RiskBadge';

// ============================================================
// アイコンのみバリエーション
// ============================================================

export interface N3RiskIndicatorProps {
  level?: RiskLevel | null;
  size?: number;
  className?: string;
}

export const N3RiskIndicator = memo(function N3RiskIndicator({
  level,
  size = 14,
  className = '',
}: N3RiskIndicatorProps) {
  if (!level) return null;

  const config = RISK_CONFIG[level];
  const { Icon, color } = config;

  return (
    <span 
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color }}
      title={config.label}
    >
      <Icon size={size} />
    </span>
  );
});

N3RiskIndicator.displayName = 'N3RiskIndicator';
