// app/tools/editing-n3/components/L3Tabs/inventory-tool-panel.tsx
/**
 * 有在庫タブ用ツールパネル
 * 
 * 機能:
 * - eBay同期（MJT/GREEN、増分/完全）
 * - メルカリ同期
 * - 統計表示
 * - アクションボタン
 */

'use client';

import React from 'react';
import { 
  RefreshCw, 
  Database, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { N3Button, N3Divider, N3Tooltip } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/N3StatsGrid';
import type { InventoryStats } from '../../hooks';

interface InventoryToolPanelProps {
  stats: InventoryStats;
  loading: boolean;
  syncing: {
    mjt: boolean;
    green: boolean;
    incremental: boolean;
    mercari: boolean;
  };
  selectedCount: number;
  pendingCount: number;
  onSyncIncremental: (account: 'mjt' | 'green' | 'all') => void;
  onSyncFull: (account: 'mjt' | 'green' | 'all') => void;
  onSyncMercari: () => void;
  onRefresh: () => void;
  onBulkDelete: (target: 'out_of_stock' | 'sold' | 'selected') => void;
  onNewProduct: () => void;
  onBulkImageUpload: () => void;
}

export function InventoryToolPanel({
  stats,
  loading,
  syncing,
  selectedCount,
  pendingCount,
  onSyncIncremental,
  onSyncFull,
  onSyncMercari,
  onRefresh,
  onBulkDelete,
  onNewProduct,
  onBulkImageUpload,
}: InventoryToolPanelProps) {
  const anySyncing = syncing.mjt || syncing.green || syncing.incremental || syncing.mercari;

  return (
    <div style={{ padding: '8px 12px' }}>
      {/* ツールバー行 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 12,
      }}>
        {/* 同期ボタングループ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <N3Tooltip content="MJT/GREEN 差分同期（高速）">
            <N3Button
              size="sm"
              variant="primary"
              onClick={() => onSyncIncremental('all')}
              disabled={anySyncing || loading}
              loading={syncing.incremental}
            >
              <RefreshCw size={14} />
              差分同期
            </N3Button>
          </N3Tooltip>
          
          <N3Divider orientation="vertical" style={{ height: 20 }} />
          
          <N3Tooltip content="MJT 完全同期">
            <N3Button
              size="sm"
              variant="secondary"
              onClick={() => onSyncFull('mjt')}
              disabled={anySyncing || loading}
              loading={syncing.mjt}
              style={{ 
                background: syncing.mjt ? 'rgba(59, 130, 246, 0.2)' : undefined,
                borderColor: 'rgba(59, 130, 246, 0.5)',
                color: 'rgb(59, 130, 246)',
              }}
            >
              MJT
            </N3Button>
          </N3Tooltip>
          
          <N3Tooltip content="GREEN 完全同期">
            <N3Button
              size="sm"
              variant="secondary"
              onClick={() => onSyncFull('green')}
              disabled={anySyncing || loading}
              loading={syncing.green}
              style={{ 
                background: syncing.green ? 'rgba(34, 197, 94, 0.2)' : undefined,
                borderColor: 'rgba(34, 197, 94, 0.5)',
                color: 'rgb(34, 197, 94)',
              }}
            >
              GREEN
            </N3Button>
          </N3Tooltip>
          
          <N3Divider orientation="vertical" style={{ height: 20 }} />
          
          <N3Tooltip content="メルカリ同期">
            <N3Button
              size="sm"
              variant="secondary"
              onClick={onSyncMercari}
              disabled={anySyncing || loading}
              loading={syncing.mercari}
              style={{ 
                background: syncing.mercari ? 'rgba(239, 68, 68, 0.2)' : undefined,
                borderColor: 'rgba(239, 68, 68, 0.5)',
                color: 'rgb(239, 68, 68)',
              }}
            >
              メルカリ
            </N3Button>
          </N3Tooltip>
        </div>

        <N3Divider orientation="vertical" style={{ height: 20 }} />

        {/* アクションボタングループ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <N3Tooltip content="新規商品作成">
            <N3Button
              size="sm"
              variant="ghost"
              onClick={onNewProduct}
            >
              <Plus size={14} />
              新規
            </N3Button>
          </N3Tooltip>
          
          <N3Tooltip content="画像一括アップロード">
            <N3Button
              size="sm"
              variant="ghost"
              onClick={onBulkImageUpload}
            >
              <ImageIcon size={14} />
              画像
            </N3Button>
          </N3Tooltip>
          
          <N3Tooltip content="データ更新">
            <N3Button
              size="sm"
              variant="ghost"
              onClick={onRefresh}
              disabled={loading}
              loading={loading}
            >
              <Database size={14} />
              更新
            </N3Button>
          </N3Tooltip>
          
          <N3Divider orientation="vertical" style={{ height: 20 }} />
          
          <N3Tooltip content="売切れ商品を管理対象外にする（削除ではなく非表示化）">
            <N3Button
              size="sm"
              variant="ghost"
              onClick={() => onBulkDelete('out_of_stock')}
              disabled={loading}
              style={{ color: 'var(--color-warning)' }}
            >
              <Trash2 size={14} />
              管理対象外
            </N3Button>
          </N3Tooltip>
        </div>

        {/* 分類待ちバッジ */}
        {pendingCount > 0 && (
          <div style={{ 
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: 4,
            fontSize: 11,
            color: 'rgb(245, 158, 11)',
          }}>
            <AlertCircle size={12} />
            分類待ち: {pendingCount}件
          </div>
        )}
      </div>

      {/* 統計行 */}
      <N3StatsGrid columns={6} gap={8} size="compact">
        <N3StatItem
          label="総数"
          value={stats.totalCount}
          color="default"
        />
        <N3StatItem
          label="在庫あり"
          value={stats.inStockCount}
          color="green"
        />
        <N3StatItem
          label="MJT"
          value={stats.mjtCount}
          color="blue"
        />
        <N3StatItem
          label="GREEN"
          value={stats.greenCount}
          color="green"
        />
        <N3StatItem
          label="総原価"
          value={`¥${stats.totalCostJpy.toLocaleString()}`}
          color="yellow"
        />
        <N3StatItem
          label="V候補"
          value={stats.variationCandidateCount}
          color="purple"
        />
      </N3StatsGrid>
    </div>
  );
}
