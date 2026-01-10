'use client';

import React, { memo, useCallback, useState } from 'react';
import { ListTodo, Printer, Truck } from 'lucide-react';
import { N3PanelHeader, N3QueueItem, N3Button, N3FilterTab } from '@/components/n3';
import type { N3QueueItemStatus } from '@/components/n3/presentational/n3-queue-item';
import type { N3PriorityLevel } from '@/components/n3/presentational/n3-priority-badge';

// ============================================================
// ShukkaQueuePanel - Container Component
// ============================================================
// 出荷待ちキューパネル
// N3PanelHeader + N3QueueItem + N3FilterTabを組み合わせ
// ============================================================

export interface ShukkaQueueItemData {
  id: string;
  title: string;
  status: N3QueueItemStatus;
  priority: N3PriorityLevel;
  channel: string;
  destination: string;
  deadline: string;
}

export interface ShukkaQueuePanelProps {
  items: ShukkaQueueItemData[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
  onBulkPrint?: () => void;
  onBulkShip?: () => void;
  pendingCount: number;
  urgentCount: number;
  className?: string;
}

type FilterType = 'all' | 'urgent' | 'ready';

export const ShukkaQueuePanel = memo(function ShukkaQueuePanel({
  items,
  selectedItemId,
  onSelectItem,
  onBulkPrint,
  onBulkShip,
  pendingCount,
  urgentCount,
  className = '',
}: ShukkaQueuePanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredItems = items.filter((item) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'urgent') return item.status === 'urgent' || item.priority === 'urgent';
    if (activeFilter === 'ready') return item.status === 'ready';
    return true;
  });

  const handleFilterChange = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  return (
    <div className={`shukka-queue-panel ${className}`}>
      <N3PanelHeader
        title="出荷待ちキュー"
        icon={ListTodo}
        variant="purple"
        stats={
          <div className="shukka-queue-panel__stats">
            <span>待機中: {pendingCount}件</span>
            <span>緊急: {urgentCount}件</span>
          </div>
        }
      />

      <div className="shukka-queue-panel__controls">
        <div className="shukka-queue-panel__bulk-actions">
          <N3Button size="xs" variant="primary" onClick={onBulkPrint}>
            <Printer size={12} />
            一括伝票
          </N3Button>
          <N3Button size="xs" variant="primary" onClick={onBulkShip}>
            <Truck size={12} />
            一括出荷
          </N3Button>
        </div>

        <div className="shukka-queue-panel__filters">
          <N3FilterTab
            active={activeFilter === 'all'}
            onClick={() => handleFilterChange('all')}
          >
            全て
          </N3FilterTab>
          <N3FilterTab
            active={activeFilter === 'urgent'}
            onClick={() => handleFilterChange('urgent')}
          >
            緊急
          </N3FilterTab>
          <N3FilterTab
            active={activeFilter === 'ready'}
            onClick={() => handleFilterChange('ready')}
          >
            準備完了
          </N3FilterTab>
        </div>
      </div>

      <div className="shukka-queue-panel__list">
        {filteredItems.map((item) => (
          <N3QueueItem
            key={item.id}
            id={item.id}
            title={item.title}
            status={item.status}
            priority={item.priority}
            channel={item.channel}
            destination={item.destination}
            deadline={item.deadline}
            selected={selectedItemId === item.id}
            onSelect={onSelectItem}
            draggable
          />
        ))}
        {filteredItems.length === 0 && (
          <div className="shukka-queue-panel__empty">
            該当するアイテムがありません
          </div>
        )}
      </div>
    </div>
  );
});

ShukkaQueuePanel.displayName = 'ShukkaQueuePanel';

export default ShukkaQueuePanel;
