/**
 * N3SourceBadge - リサーチソース表示バッジ
 *
 * リサーチソース（eBay/Amazon/Yahoo等）をバッジで表示
 * 
 * @example
 * <N3SourceBadge source="ebay_sold" />
 * <N3SourceBadge source="amazon" showIcon />
 */

import { memo } from 'react';
import type { ResearchSource } from '@/types/research';

// ============================================================
// Types
// ============================================================

export interface N3SourceBadgeProps {
  /** ソースタイプ */
  source: ResearchSource;
  /** アイコン表示 */
  showIcon?: boolean;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Config
// ============================================================

const SOURCE_CONFIG: Record<ResearchSource, { 
  label: string; 
  shortLabel: string;
  bg: string; 
  color: string;
  icon?: string;
}> = {
  ebay_sold: { 
    label: 'eBay Sold', 
    shortLabel: 'eBay',
    bg: 'rgba(59, 130, 246, 0.1)', 
    color: '#3b82f6',
    icon: '🏷️'
  },
  ebay_seller: { 
    label: 'eBay Seller', 
    shortLabel: 'Seller',
    bg: 'rgba(59, 130, 246, 0.1)', 
    color: '#3b82f6',
    icon: '👤'
  },
  amazon: { 
    label: 'Amazon', 
    shortLabel: 'Amazon',
    bg: 'rgba(255, 153, 0, 0.1)', 
    color: '#ff9900',
    icon: '📦'
  },
  yahoo_auction: { 
    label: 'Yahoo!オークション', 
    shortLabel: 'Yahoo!',
    bg: 'rgba(255, 0, 51, 0.1)', 
    color: '#ff0033',
    icon: '🔨'
  },
  rakuten: { 
    label: '楽天市場', 
    shortLabel: '楽天',
    bg: 'rgba(191, 0, 0, 0.1)', 
    color: '#bf0000',
    icon: '🛒'
  },
  manual: { 
    label: '手動登録', 
    shortLabel: '手動',
    bg: 'rgba(107, 114, 128, 0.1)', 
    color: '#6b7280',
    icon: '✏️'
  },
  batch: { 
    label: 'バッチ処理', 
    shortLabel: 'Batch',
    bg: 'rgba(139, 92, 246, 0.1)', 
    color: '#8b5cf6',
    icon: '⚡'
  },
};

// ============================================================
// Component
// ============================================================

export const N3SourceBadge = memo(function N3SourceBadge({
  source,
  showIcon = false,
  className = '',
}: N3SourceBadgeProps) {
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.manual;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 500,
    backgroundColor: config.bg,
    color: config.color,
    whiteSpace: 'nowrap',
  };

  return (
    <span className={className} style={style} title={config.label}>
      {showIcon && config.icon && <span>{config.icon}</span>}
      {config.shortLabel}
    </span>
  );
});

N3SourceBadge.displayName = 'N3SourceBadge';

// ============================================================
// ソースフィルタータブ用
// ============================================================

export interface N3SourceTabProps {
  source: ResearchSource;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const N3SourceTab = memo(function N3SourceTab({
  source,
  count,
  active = false,
  onClick,
  className = '',
}: N3SourceTabProps) {
  const config = SOURCE_CONFIG[source] || SOURCE_CONFIG.manual;

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    backgroundColor: active ? config.bg : 'transparent',
    color: active ? config.color : 'var(--text-muted)',
    border: `1px solid ${active ? config.color : 'transparent'}`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const countStyle: React.CSSProperties = {
    fontSize: 9,
    padding: '1px 4px',
    borderRadius: 3,
    backgroundColor: active ? config.color : 'var(--highlight)',
    color: active ? 'white' : 'var(--text-muted)',
  };

  return (
    <button 
      className={className} 
      style={style} 
      onClick={onClick}
      type="button"
    >
      {config.icon && <span>{config.icon}</span>}
      <span>{config.shortLabel}</span>
      {count !== undefined && <span style={countStyle}>{count}</span>}
    </button>
  );
});

N3SourceTab.displayName = 'N3SourceTab';
