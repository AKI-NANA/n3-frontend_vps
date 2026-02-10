/**
 * N3FilterBar - Container Component
 *
 * フィルターバー（L3ListFilterの共通版）
 *
 * 設計ルール:
 * - 状態とロジックを子に注入
 * - 子要素間のgap/marginを定義（Container責務）
 * - Hooksを呼び出せる
 *
 * @example
 * <N3FilterBar
 *   filters={filters}
 *   activeFilter={activeFilter}
 *   onFilterChange={setActiveFilter}
 *   leftActions={<N3Button>Fast</N3Button>}
 * />
 */

'use client';

import { memo, type ReactNode } from 'react';
import { N3FilterTab } from '../presentational/n3-filter-tab';

// ============================================================
// Types
// ============================================================

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface N3FilterBarProps {
  /** フィルターオプション一覧 */
  filters: FilterOption[];
  /** アクティブなフィルターID */
  activeFilter: string;
  /** フィルター変更ハンドラ */
  onFilterChange: (filterId: string) => void;
  /** 左側に表示するアクション要素 */
  leftActions?: ReactNode;
  /** 右側に表示するアクション要素 */
  rightActions?: ReactNode;
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Component
// ============================================================

export const N3FilterBar = memo(function N3FilterBar({
  filters,
  activeFilter,
  onFilterChange,
  leftActions,
  rightActions,
  className = '',
}: N3FilterBarProps) {
  const classes = ['n3-l3-filter-bar', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {/* 左側: アクション + フィルタータブ */}
      <div className="flex items-center gap-3">
        {leftActions && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {leftActions}
          </div>
        )}
        <div className="n3-filter-tabs">
          {filters.map((filter) => (
            <N3FilterTab
              key={filter.id}
              label={filter.label}
              count={filter.count}
              icon={filter.icon}
              active={activeFilter === filter.id}
              disabled={filter.disabled}
              onClick={() => onFilterChange(filter.id)}
            />
          ))}
        </div>
      </div>

      {/* 右側: アクションボタン */}
      {rightActions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {rightActions}
        </div>
      )}
    </div>
  );
});

N3FilterBar.displayName = 'N3FilterBar';
