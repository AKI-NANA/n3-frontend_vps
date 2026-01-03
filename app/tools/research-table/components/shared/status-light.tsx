/**
 * StatusLight: グリーンライト方式のステータス表示
 */

import { cn } from '@/lib/utils';
import type { WorkflowStatus, KaritoriStatus } from '../../types/research';

interface StatusLightProps {
  status: WorkflowStatus | KaritoriStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const WORKFLOW_STATUS_CONFIG: Record<WorkflowStatus, { color: string; label: string }> = {
  new: { color: 'bg-gray-300', label: '新規' },
  analyzing: { color: 'bg-yellow-500 animate-pulse', label: '分析中' },
  approved: { color: 'bg-emerald-500', label: '承認済' },
  rejected: { color: 'bg-red-500', label: '却下' },
  promoted: { color: 'bg-blue-500', label: '昇格済' },
};

const KARITORI_STATUS_CONFIG: Record<KaritoriStatus, { color: string; label: string }> = {
  none: { color: 'bg-gray-200', label: '-' },
  watching: { color: 'bg-blue-400', label: '監視中' },
  alert: { color: 'bg-orange-500 animate-pulse', label: 'アラート' },
  purchased: { color: 'bg-emerald-500', label: '購入済' },
  skipped: { color: 'bg-red-400', label: 'スキップ' },
};

const SIZE_CLASSES = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export function StatusLight({ status, size = 'md', showLabel = false }: StatusLightProps) {
  const isWorkflowStatus = status in WORKFLOW_STATUS_CONFIG;
  const config = isWorkflowStatus
    ? WORKFLOW_STATUS_CONFIG[status as WorkflowStatus]
    : KARITORI_STATUS_CONFIG[status as KaritoriStatus];

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          'rounded-full',
          SIZE_CLASSES[size],
          config.color
        )}
        title={config.label}
      />
      {showLabel && (
        <span className="text-[10px] text-muted-foreground">{config.label}</span>
      )}
    </div>
  );
}

// ステータスラベルのみ
export function StatusLabel({ status }: { status: WorkflowStatus | KaritoriStatus }) {
  const isWorkflowStatus = status in WORKFLOW_STATUS_CONFIG;
  const config = isWorkflowStatus
    ? WORKFLOW_STATUS_CONFIG[status as WorkflowStatus]
    : KARITORI_STATUS_CONFIG[status as KaritoriStatus];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium',
        isWorkflowStatus ? 'bg-gray-100 text-gray-700' : 'bg-blue-50 text-blue-700'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          config.color.replace(' animate-pulse', '')
        )}
      />
      {config.label}
    </span>
  );
}
