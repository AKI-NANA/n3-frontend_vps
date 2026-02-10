'use client';

import React, { memo } from 'react';
import type { WorkflowStatus, KaritoriStatus, RiskLevel } from '@/app/tools/research-table/types/research';

// ============================================================
// ResearchStatusBadge - Presentational Component
// ============================================================
// ワークフローステータス表示用バッジ
// - Hooks呼び出し禁止
// - 外部マージン禁止
// - React.memoでラップ
// ============================================================

export interface ResearchStatusBadgeProps {
  status: WorkflowStatus;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string; bg: string }> = {
  new: { label: '新規', color: 'var(--text-muted)', bg: 'var(--highlight)' },
  analyzing: { label: '分析中', color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
  approved: { label: '承認済', color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
  rejected: { label: '却下', color: 'var(--color-error)', bg: 'rgba(239, 68, 68, 0.1)' },
  promoted: { label: '昇格済', color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)' },
};

const SIZE_STYLES = {
  xs: { fontSize: 10, padding: '2px 6px', dotSize: 6 },
  sm: { fontSize: 11, padding: '3px 8px', dotSize: 8 },
  md: { fontSize: 12, padding: '4px 10px', dotSize: 10 },
};

export const ResearchStatusBadge = memo(function ResearchStatusBadge({
  status,
  size = 'sm',
  showLabel = true,
}: ResearchStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        color: config.color,
        background: config.bg,
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: sizeStyle.dotSize,
          height: sizeStyle.dotSize,
          borderRadius: '50%',
          background: config.color,
          animation: status === 'analyzing' ? 'pulse 2s infinite' : undefined,
        }}
      />
      {showLabel && config.label}
    </span>
  );
});

// ============================================================
// KaritoriStatusBadge - Presentational Component
// ============================================================

export interface KaritoriStatusBadgeProps {
  status: KaritoriStatus;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
}

const KARITORI_CONFIG: Record<KaritoriStatus, { label: string; color: string; bg: string }> = {
  none: { label: '未設定', color: 'var(--text-muted)', bg: 'var(--highlight)' },
  watching: { label: '監視中', color: 'var(--color-info)', bg: 'rgba(59, 130, 246, 0.1)' },
  alert: { label: 'アラート', color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
  purchased: { label: '購入済', color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
  skipped: { label: 'スキップ', color: 'var(--color-error)', bg: 'rgba(239, 68, 68, 0.1)' },
};

export const KaritoriStatusBadge = memo(function KaritoriStatusBadge({
  status,
  size = 'sm',
  showLabel = true,
}: KaritoriStatusBadgeProps) {
  const config = KARITORI_CONFIG[status];
  const sizeStyle = SIZE_STYLES[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 500,
        color: config.color,
        background: config.bg,
        borderRadius: 4,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: sizeStyle.dotSize,
          height: sizeStyle.dotSize,
          borderRadius: '50%',
          background: config.color,
          animation: status === 'alert' ? 'pulse 1.5s infinite' : undefined,
        }}
      />
      {showLabel && config.label}
    </span>
  );
});

// ============================================================
// RiskBadge - Presentational Component
// ============================================================

export interface RiskBadgeProps {
  level?: RiskLevel;
  section301?: boolean;
  veroRisk?: boolean;
  size?: 'xs' | 'sm' | 'md';
  compact?: boolean;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string }> = {
  low: { label: '低', color: 'var(--color-success)', bg: 'rgba(16, 185, 129, 0.1)' },
  medium: { label: '中', color: 'var(--color-warning)', bg: 'rgba(245, 158, 11, 0.1)' },
  high: { label: '高', color: 'var(--color-error)', bg: 'rgba(239, 68, 68, 0.1)' },
};

export const RiskBadge = memo(function RiskBadge({
  level,
  section301 = false,
  veroRisk = false,
  size = 'sm',
  compact = false,
}: RiskBadgeProps) {
  const sizeStyle = SIZE_STYLES[size];
  const config = level ? RISK_CONFIG[level] : null;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {config && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: sizeStyle.padding,
            fontSize: sizeStyle.fontSize,
            fontWeight: 500,
            color: config.color,
            background: config.bg,
            borderRadius: 4,
          }}
        >
          {compact ? level?.charAt(0).toUpperCase() : `リスク: ${config.label}`}
        </span>
      )}
      {section301 && (
        <span
          style={{
            padding: sizeStyle.padding,
            fontSize: sizeStyle.fontSize,
            fontWeight: 600,
            color: 'var(--color-error)',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 4,
          }}
        >
          301
        </span>
      )}
      {veroRisk && (
        <span
          style={{
            padding: sizeStyle.padding,
            fontSize: sizeStyle.fontSize,
            fontWeight: 600,
            color: '#7c3aed',
            background: 'rgba(124, 58, 237, 0.1)',
            borderRadius: 4,
          }}
        >
          VeRO
        </span>
      )}
    </span>
  );
});

ResearchStatusBadge.displayName = 'ResearchStatusBadge';
KaritoriStatusBadge.displayName = 'KaritoriStatusBadge';
RiskBadge.displayName = 'RiskBadge';

export default ResearchStatusBadge;
