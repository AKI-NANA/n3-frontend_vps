// app/tools/editing-n3/components/header/n3-master-type-filter-bar.tsx
/**
 * N3 マスター在庫タイプフィルターバー
 * 
 * マスタータブ専用のL4サブフィルター
 * N3WorkflowFilterBarと同じデザインで統一
 * 
 * サブカテゴリ:
 * - すべて: 管理対象全件
 * - 通常品: 単品在庫（regular）
 * - セット品: 構成パーツ連動在庫（set）
 * - 無在庫(MU): モール在庫管理（mu）
 * - 構成パーツ: セット構成に必要な実在庫（parts）
 */

'use client';

import React, { memo, useMemo } from 'react';
import { Package, FileBox, Layers, RefreshCw, Puzzle } from 'lucide-react';
import type { MasterInventoryType } from '@/types/inventory-extended';

// ============================================================
// 型定義
// ============================================================

export interface MasterTypeCountsFromAPI {
  all: number;
  regular: number;
  set: number;
  mu: number;
  parts: number;
}

export interface N3MasterTypeFilterBarProps {
  /** 現在アクティブなフィルター */
  activeType: MasterInventoryType | null;
  /** フィルター変更時のコールバック */
  onTypeChange: (type: MasterInventoryType | null) => void;
  /** カウント（API or 計算値） */
  counts?: MasterTypeCountsFromAPI;
  /** ローディング状態 */
  loading?: boolean;
}

// ============================================================
// タイプ定義（N3WorkflowFilterBarと同じスタイル）
// ============================================================

interface TypeConfig {
  type: MasterInventoryType | null;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  dotColor: string;
  bgColor: string;
  activeBgColor: string;
  tooltip: string;
}

const TYPE_CONFIGS: TypeConfig[] = [
  {
    type: null,
    label: 'すべて',
    shortLabel: 'すべて',
    icon: Package,
    dotColor: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.08)',
    activeBgColor: 'rgba(107, 114, 128, 0.15)',
    tooltip: '全ての在庫タイプを表示',
  },
  {
    type: 'regular',
    label: '通常品',
    shortLabel: '通常',
    icon: FileBox,
    dotColor: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
    activeBgColor: 'rgba(59, 130, 246, 0.15)',
    tooltip: '単品で管理する通常在庫',
  },
  {
    type: 'set',
    label: 'セット品',
    shortLabel: 'セット',
    icon: Layers,
    dotColor: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.08)',
    activeBgColor: 'rgba(139, 92, 246, 0.15)',
    tooltip: '構成パーツを組み合わせたセット商品',
  },
  {
    type: 'mu',
    label: '無在庫(MU)',
    shortLabel: 'MU',
    icon: RefreshCw,
    dotColor: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.08)',
    activeBgColor: 'rgba(245, 158, 11, 0.15)',
    tooltip: '仕入れ先モールで在庫管理する無在庫商品',
  },
  {
    type: 'parts',
    label: '構成パーツ',
    shortLabel: 'パーツ',
    icon: Puzzle,
    dotColor: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.08)',
    activeBgColor: 'rgba(34, 197, 94, 0.15)',
    tooltip: 'セット商品の構成に使用するパーツ',
  },
];

// ============================================================
// メインコンポーネント
// ============================================================

export const N3MasterTypeFilterBar = memo(function N3MasterTypeFilterBar({
  activeType,
  onTypeChange,
  counts,
  loading = false,
}: N3MasterTypeFilterBarProps) {
  
  // カウント取得
  const getCount = (type: MasterInventoryType | null): number => {
    if (!counts) return 0;
    if (type === null) return counts.all;
    return counts[type] || 0;
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: 'var(--highlight)',
      borderBottom: '1px solid var(--panel-border)',
      minHeight: 40,
      overflowX: 'auto',
    }}>
      {/* ラベル */}
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: 'var(--text-muted)',
        marginRight: 4,
        whiteSpace: 'nowrap',
      }}>
        在庫タイプ:
      </div>
      
      {/* フィルターボタン */}
      {TYPE_CONFIGS.map((config) => {
        const Icon = config.icon;
        const isActive = activeType === config.type;
        const count = getCount(config.type);
        
        return (
          <button
            key={config.type ?? 'all'}
            onClick={() => onTypeChange(config.type)}
            disabled={loading}
            title={config.tooltip}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              border: isActive ? `1.5px solid ${config.dotColor}` : '1.5px solid transparent',
              borderRadius: 6,
              background: isActive ? config.activeBgColor : config.bgColor,
              cursor: loading ? 'wait' : 'pointer',
              fontSize: 12,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? config.dotColor : 'var(--text-muted)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {/* ドット */}
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: config.dotColor,
              opacity: isActive ? 1 : 0.5,
            }} />
            
            {/* アイコン */}
            <Icon size={13} style={{ opacity: isActive ? 1 : 0.7 }} />
            
            {/* ラベル */}
            <span>{config.shortLabel}</span>
            
            {/* カウント */}
            <span style={{
              fontSize: 10,
              fontWeight: 700,
              padding: '1px 5px',
              borderRadius: 8,
              background: isActive ? config.dotColor : 'var(--panel-border)',
              color: isActive ? 'white' : 'var(--text-muted)',
              minWidth: 20,
              textAlign: 'center',
            }}>
              {count}
            </span>
          </button>
        );
      })}
      
      {/* ローディング表示 */}
      {loading && (
        <div style={{
          marginLeft: 8,
          fontSize: 11,
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          <div style={{
            width: 12,
            height: 12,
            border: '2px solid var(--panel-border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          読み込み中...
        </div>
      )}
    </div>
  );
});

export default N3MasterTypeFilterBar;
