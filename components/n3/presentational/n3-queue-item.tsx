'use client';

import React, { memo, useCallback } from 'react';
import { N3PriorityBadge, N3PriorityLevel } from './n3-priority-badge';

// ============================================================
// N3QueueItem - Presentational Component
// ============================================================
// キューアイテムカード（出荷待ち、タスク一覧など）
// 出荷管理、タスク管理で使用
// ============================================================

export type N3QueueItemStatus = 'pending' | 'ready' | 'processing' | 'urgent' | 'completed';

export interface N3QueueItemProps {
  /** アイテムID */
  id: string;
  /** タイトル/商品名 */
  title: string;
  /** 選択状態 */
  selected?: boolean;
  /** 選択時のコールバック */
  onSelect?: (id: string) => void;
  /** ステータス（左ボーダー色） */
  status?: N3QueueItemStatus;
  /** 優先度 */
  priority?: N3PriorityLevel;
  /** チャンネル/カテゴリ */
  channel?: string;
  /** 配送先/詳細1 */
  destination?: string;
  /** 期限/詳細2 */
  deadline?: string;
  /** ドラッグ可能 */
  draggable?: boolean;
  /** カスタムクラス名 */
  className?: string;
}

export const N3QueueItem = memo(function N3QueueItem({
  id,
  title,
  selected = false,
  onSelect,
  status = 'pending',
  priority,
  channel,
  destination,
  deadline,
  draggable = false,
  className = '',
}: N3QueueItemProps) {
  const handleClick = useCallback(() => {
    onSelect?.(id);
  }, [id, onSelect]);

  return (
    <div
      className={`n3-queue-item n3-queue-item--${status} ${selected ? 'n3-queue-item--selected' : ''} ${className}`}
      onClick={handleClick}
      draggable={draggable}
      role="button"
      tabIndex={0}
    >
      <div className="n3-queue-item__header">
        <span className="n3-queue-item__id">{id}</span>
        {priority && <N3PriorityBadge priority={priority} size="xs" />}
      </div>
      <div className="n3-queue-item__title">{title}</div>
      <div className="n3-queue-item__details">
        {channel && <span className="n3-queue-item__channel">{channel}</span>}
        {destination && <span className="n3-queue-item__destination">{destination}</span>}
        {deadline && <span className="n3-queue-item__deadline">{deadline}</span>}
      </div>
    </div>
  );
});

N3QueueItem.displayName = 'N3QueueItem';

export default N3QueueItem;
