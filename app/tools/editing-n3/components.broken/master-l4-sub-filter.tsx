// app/tools/editing-n3/components/l3-tabs/master-l4-sub-filter.tsx
/**
 * MasterL4SubFilter - マスタータブ(L3)内のL4サブフィルター
 * 
 * フェーズ2: L4階層化対応
 * 
 * サブカテゴリ:
 * - すべて: 管理対象全件
 * - 通常品: inventory_type === 'regular' (単品在庫)
 * - セット品: inventory_type === 'set' (構成パーツ連動在庫)
 * - 無在庫(MU): inventory_type === 'mu' (モール在庫管理)
 * - 構成パーツ: inventory_type === 'parts' (セット構成に必要な実在庫)
 */

'use client';

import React, { memo, useMemo, useCallback } from 'react';
import { 
  MASTER_L4_SUB_FILTERS, 
  type MasterL4SubFilter as MasterL4SubFilterType,
  type MasterInventoryType,
} from '@/types/inventory-extended';

// ============================================================
// 型定義
// ============================================================

export interface MasterL4SubFilterProps {
  /** アクティブなフィルター */
  activeFilter: MasterL4SubFilterType;
  /** フィルター変更時のコールバック */
  onFilterChange: (filter: MasterL4SubFilterType) => void;
  /** 各フィルターのカウント（オプション） */
  counts?: Record<MasterL4SubFilterType, number>;
  /** ローディング状態 */
  loading?: boolean;
  /** 商品リスト（カウント計算用） */
  products?: any[];
}

// ============================================================
// サブコンポーネント
// ============================================================

interface FilterTabProps {
  id: MasterL4SubFilterType;
  label: string;
  icon: string;
  color: { bg: string; text: string; border: string };
  count?: number;
  active: boolean;
  onClick: () => void;
  loading?: boolean;
}

const FilterTab = memo(function FilterTab({
  id,
  label,
  icon,
  color,
  count,
  active,
  onClick,
  loading,
}: FilterTabProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        border: active ? `2px solid ${color.border}` : '2px solid transparent',
        borderRadius: 6,
        background: active ? color.bg : 'transparent',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        color: active ? color.text : 'var(--text-muted)',
        transition: 'all 0.2s ease',
        opacity: loading ? 0.6 : 1,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        if (!active && !loading) {
          e.currentTarget.style.background = color.bg;
          e.currentTarget.style.color = color.text;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--text-muted)';
        }
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
      {count !== undefined && (
        <span style={{
          padding: '1px 6px',
          borderRadius: 10,
          background: active ? 'rgba(255,255,255,0.3)' : 'var(--highlight)',
          fontSize: 10,
          fontWeight: 600,
          fontFamily: 'monospace',
        }}>
          {count.toLocaleString()}
        </span>
      )}
    </button>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const MasterL4SubFilter = memo(function MasterL4SubFilter({
  activeFilter,
  onFilterChange,
  counts: propCounts,
  loading,
  products,
}: MasterL4SubFilterProps) {
  
  // カウントを計算（propsで渡されていない場合はproductsから計算）
  const counts = useMemo(() => {
    if (propCounts) return propCounts;
    if (!products) return undefined;
    
    const result: Record<MasterL4SubFilterType, number> = {
      all: 0,
      regular: 0,
      set: 0,
      mu: 0,
      parts: 0,
    };
    
    products.forEach(product => {
      result.all++;
      
      // inventory_type または product_type から判定
      const masterType = product.master_inventory_type;
      const productType = product.product_type;
      const inventoryType = product.inventory_type;
      
      if (masterType === 'regular' || (!masterType && productType !== 'set' && inventoryType !== 'mu' && !product.is_set_component)) {
        result.regular++;
      } else if (masterType === 'set' || productType === 'set') {
        result.set++;
      } else if (masterType === 'mu' || inventoryType === 'mu') {
        result.mu++;
      } else if (masterType === 'parts' || product.is_set_component) {
        result.parts++;
      } else {
        // デフォルトは通常品扱い
        result.regular++;
      }
    });
    
    return result;
  }, [propCounts, products]);
  
  const handleFilterClick = useCallback((filterId: MasterL4SubFilterType) => {
    onFilterChange(filterId);
  }, [onFilterChange]);
  
  // 整合性チェック表示（マスター = 通常品 + セット品 + 無在庫 + 構成パーツ）
  const isConsistent = useMemo(() => {
    if (!counts) return true;
    const sum = counts.regular + counts.set + counts.mu + counts.parts;
    return sum === counts.all;
  }, [counts]);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: '8px 12px',
      background: 'var(--highlight)',
      borderBottom: '1px solid var(--panel-border)',
    }}>
      {/* フィルタータブ */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          marginRight: 4,
        }}>
          L4:
        </span>
        
        {MASTER_L4_SUB_FILTERS.map(filter => (
          <FilterTab
            key={filter.id}
            id={filter.id}
            label={filter.label}
            icon={filter.icon}
            color={filter.color}
            count={counts?.[filter.id]}
            active={activeFilter === filter.id}
            onClick={() => handleFilterClick(filter.id)}
            loading={loading}
          />
        ))}
        
        {/* 整合性チェックインジケーター */}
        {counts && !isConsistent && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 4,
            border: '1px solid rgba(239, 68, 68, 0.3)',
          }}>
            <span style={{ fontSize: 11, color: '#ef4444' }}>
              ⚠️ カウント不整合
            </span>
          </div>
        )}
      </div>
      
      {/* 説明テキスト */}
      <div style={{
        fontSize: 10,
        color: 'var(--text-muted)',
        lineHeight: 1.4,
      }}>
        {activeFilter === 'all' && (
          <>📋 管理対象 {counts?.all || 0}件を全表示</>
        )}
        {activeFilter === 'regular' && (
          <>📦 通常品: 単品で管理する在庫商品</>
        )}
        {activeFilter === 'set' && (
          <>🔗 セット品: 構成パーツの在庫から販売可能数を自動計算</>
        )}
        {activeFilter === 'mu' && (
          <>🌐 無在庫(MU): 仕入れ元モールから取り寄せて発送</>
        )}
        {activeFilter === 'parts' && (
          <>🧩 構成パーツ: 単体では出品せず、セット商品の構成要素として使用</>
        )}
      </div>
    </div>
  );
});

export default MasterL4SubFilter;
