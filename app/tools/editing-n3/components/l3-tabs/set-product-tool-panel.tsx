// app/tools/editing-n3/components/l3-tabs/set-product-tool-panel.tsx
/**
 * セット品タブ用ツールパネル
 * 
 * 機能:
 * - セット作成
 * - セット編集/削除
 * - 統計表示
 */

'use client';

import React from 'react';
import { 
  Box,
  Edit,
  Trash2,
  Info,
} from 'lucide-react';
import { N3Button, N3Divider, N3Tooltip } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/n3-stats-grid';

interface SetProductToolPanelProps {
  stats: {
    setCount: number;
    totalValue: number;
    selectedCount: number;
  };
  loading: boolean;
  selectedCount: number;
  showSetsOnly: boolean;
  onCreateSet: () => void;
  onToggleSetsOnly: () => void;
  onEditSet: () => void;
  onDeleteSet: () => void;
}

export function SetProductToolPanel({
  stats,
  loading,
  selectedCount,
  showSetsOnly,
  onCreateSet,
  onToggleSetsOnly,
  onEditSet,
  onDeleteSet,
}: SetProductToolPanelProps) {
  return (
    <div style={{ padding: '8px 12px' }}>
      {/* ツールバー行 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 8,
      }}>
        <N3Tooltip content="選択した単品商品でセットを作成（2件以上必要）">
          <N3Button
            size="sm"
            variant="primary"
            onClick={onCreateSet}
            disabled={loading || selectedCount < 2}
          >
            <Box size={14} />
            セット作成
            {selectedCount > 0 && ` (${selectedCount})`}
          </N3Button>
        </N3Tooltip>
        
        <N3Button
          size="sm"
          variant={showSetsOnly ? 'primary' : 'ghost'}
          onClick={onToggleSetsOnly}
        >
          セットのみ表示
        </N3Button>
        
        <N3Divider orientation="vertical" style={{ height: 20 }} />
        
        <N3Tooltip content="選択したセットを編集（1件選択）">
          <N3Button
            size="sm"
            variant="ghost"
            onClick={onEditSet}
            disabled={loading || selectedCount !== 1}
          >
            <Edit size={14} />
            編集
          </N3Button>
        </N3Tooltip>
        
        <N3Tooltip content="選択したセットを削除">
          <N3Button
            size="sm"
            variant="ghost"
            onClick={onDeleteSet}
            disabled={loading || selectedCount === 0}
            style={{ color: 'var(--color-error)' }}
          >
            <Trash2 size={14} />
            削除
          </N3Button>
        </N3Tooltip>
      </div>

      {/* ヒント行 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: 'rgba(34, 197, 94, 0.05)',
        borderRadius: 4,
        marginBottom: 12,
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <Info size={12} style={{ color: 'rgb(34, 197, 94)' }} />
        <span>
          セット商品の在庫は、構成商品の在庫変動に連動して自動更新されます。
        </span>
      </div>

      {/* 統計行 */}
      <N3StatsGrid columns={3} gap={8} size="compact">
        <N3StatItem
          label="セット数"
          value={stats.setCount}
          color="purple"
        />
        <N3StatItem
          label="総価値"
          value={`¥${stats.totalValue.toLocaleString()}`}
          color="green"
        />
        <N3StatItem
          label="選択中"
          value={stats.selectedCount}
          color="blue"
        />
      </N3StatsGrid>
    </div>
  );
}
