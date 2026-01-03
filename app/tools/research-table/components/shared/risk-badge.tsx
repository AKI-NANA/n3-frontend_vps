/**
 * RiskBadge: リスクレベル表示バッジ
 */

import { cn } from '@/lib/utils';
import { AlertTriangle, Shield, AlertCircle } from 'lucide-react';
import type { RiskLevel } from '../../types/research';

interface RiskBadgeProps {
  level?: RiskLevel | null;
  section301Risk?: boolean;
  veroRisk?: boolean;
  showDetails?: boolean;
}

const RISK_CONFIG: Record<RiskLevel, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  low: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    icon: <Shield className="w-3 h-3" />,
    label: 'Low',
  },
  medium: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    icon: <AlertCircle className="w-3 h-3" />,
    label: 'Medium',
  },
  high: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    icon: <AlertTriangle className="w-3 h-3" />,
    label: 'High',
  },
};

export function RiskBadge({
  level,
  section301Risk = false,
  veroRisk = false,
  showDetails = false,
}: RiskBadgeProps) {
  if (!level) {
    return <span className="text-gray-400 text-[10px]">-</span>;
  }

  const config = RISK_CONFIG[level];

  return (
    <div className="flex flex-col gap-1">
      <span
        className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium',
          config.bg,
          config.text
        )}
      >
        {config.icon}
        {config.label}
      </span>

      {showDetails && (section301Risk || veroRisk) && (
        <div className="flex flex-wrap gap-1">
          {section301Risk && (
            <span className="px-1 py-0.5 bg-orange-100 text-orange-800 rounded text-[8px]">
              301条
            </span>
          )}
          {veroRisk && (
            <span className="px-1 py-0.5 bg-purple-100 text-purple-800 rounded text-[8px]">
              VeRO
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// リスクインジケーター（アイコンのみ）
export function RiskIndicator({ level }: { level?: RiskLevel | null }) {
  if (!level) return null;

  const colors = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  };

  return (
    <div className={cn('flex items-center justify-center', colors[level])}>
      {level === 'low' && <Shield className="w-3.5 h-3.5" />}
      {level === 'medium' && <AlertCircle className="w-3.5 h-3.5" />}
      {level === 'high' && <AlertTriangle className="w-3.5 h-3.5" />}
    </div>
  );
}
