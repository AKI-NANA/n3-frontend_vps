/**
 * N3WorkflowStatus - Research専用ステータス表示
 *
 * WorkflowStatusとKaritoriStatusを表示するPresentationalコンポーネント
 * 
 * 設計原則:
 * - Propsを受け取り描画するのみ
 * - ロジックなし、状態なし
 * - 型は共有の /types/research.ts から import
 *
 * @example
 * <N3WorkflowStatus status="approved" />
 * <N3WorkflowStatus status="watching" showLabel />
 */

import { memo } from 'react';
import type { WorkflowStatus, KaritoriStatus } from '@/types/research';

// ============================================================
// Types
// ============================================================

export type N3StatusSize = 'sm' | 'md' | 'lg';

export interface N3WorkflowStatusProps {
  /** ステータス値 */
  status: WorkflowStatus | KaritoriStatus;
  /** サイズ */
  size?: N3StatusSize;
  /** ラベル表示 */
  showLabel?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Config
// ============================================================

const WORKFLOW_CONFIG: Record<WorkflowStatus, { color: string; label: string; pulse?: boolean }> = {
  new: { color: 'var(--text-muted)', label: '新規' },
  analyzing: { color: 'var(--warning)', label: '分析中', pulse: true },
  approved: { color: 'var(--success)', label: '承認済' },
  rejected: { color: 'var(--error)', label: '却下' },
  promoted: { color: 'var(--accent)', label: '昇格済' },
};

const KARITORI_CONFIG: Record<KaritoriStatus, { color: string; label: string; pulse?: boolean }> = {
  none: { color: 'var(--panel-border)', label: '-' },
  watching: { color: 'var(--info)', label: '監視中' },
  alert: { color: 'var(--warning)', label: 'アラート', pulse: true },
  purchased: { color: 'var(--success)', label: '購入済' },
  skipped: { color: 'var(--error)', label: 'スキップ' },
};

const SIZE_MAP: Record<N3StatusSize, { dot: number; font: number; gap: number }> = {
  sm: { dot: 8, font: 9, gap: 4 },
  md: { dot: 12, font: 10, gap: 6 },
  lg: { dot: 16, font: 11, gap: 8 },
};

// ============================================================
// Component
// ============================================================

export const N3WorkflowStatus = memo(function N3WorkflowStatus({
  status,
  size = 'md',
  showLabel = false,
  className = '',
}: N3WorkflowStatusProps) {
  const isWorkflow = status in WORKFLOW_CONFIG;
  const config = isWorkflow 
    ? WORKFLOW_CONFIG[status as WorkflowStatus] 
    : KARITORI_CONFIG[status as KaritoriStatus];
  
  const sizeConfig = SIZE_MAP[size];

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: sizeConfig.gap,
  };

  const dotStyle: React.CSSProperties = {
    width: sizeConfig.dot,
    height: sizeConfig.dot,
    borderRadius: '50%',
    backgroundColor: config.color,
    flexShrink: 0,
    ...(config.pulse && {
      animation: 'pulse 2s ease-in-out infinite',
    }),
  };

  const labelStyle: React.CSSProperties = {
    fontSize: sizeConfig.font,
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
  };

  return (
    <span className={className} style={containerStyle} title={config.label}>
      <span style={dotStyle} />
      {showLabel && <span style={labelStyle}>{config.label}</span>}
    </span>
  );
});

N3WorkflowStatus.displayName = 'N3WorkflowStatus';

// ============================================================
// ラベル付きバッジバリエーション
// ============================================================

export interface N3StatusLabelProps {
  status: WorkflowStatus | KaritoriStatus;
  className?: string;
}

export const N3StatusLabel = memo(function N3StatusLabel({
  status,
  className = '',
}: N3StatusLabelProps) {
  const isWorkflow = status in WORKFLOW_CONFIG;
  const config = isWorkflow 
    ? WORKFLOW_CONFIG[status as WorkflowStatus] 
    : KARITORI_CONFIG[status as KaritoriStatus];

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 500,
    backgroundColor: `color-mix(in srgb, ${config.color} 15%, transparent)`,
    color: config.color,
  };

  const dotStyle: React.CSSProperties = {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: config.color,
  };

  return (
    <span className={className} style={style}>
      <span style={dotStyle} />
      {config.label}
    </span>
  );
});

N3StatusLabel.displayName = 'N3StatusLabel';
