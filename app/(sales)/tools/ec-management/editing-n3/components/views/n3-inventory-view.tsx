// app/tools/editing-n3/components/views/n3-inventory-view.tsx
/**
 * N3InventoryView - 棚卸しビュー（カード/テーブル表示）v3
 * 
 * 責務:
 * - 棚卸し商品のカード/テーブル表示
 * - 在庫数・原価の編集
 * - 属性（attr_l1/l2/l3）の編集（マスタータブ）
 * - 棚卸し統計表示
 * - 要確認/確定フラグ管理
 * - メモ管理
 */

'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { N3Pagination, N3Divider } from '@/components/n3';
import { N3InventoryCardGrid } from '@/components/n3/n3-inventory-card-grid';
import { N3InventoryTable } from '@/components/n3/n3-inventory-table';
import { AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';
import type { InventoryProduct } from '../../hooks';
import type { MasterInventoryType } from '@/types/inventory-extended';

// L4サブフィルターコンポーネント
import { MasterL4SubFilter } from '../l3-tabs';

// ============================================================
// 型定義
// ============================================================

export interface InventoryStats {
  totalCount: number;
  inStockCount: number;
  variationParentCount: number;
  variationMemberCount: number;
  standaloneCount: number;
  totalCostJpy: number;
}

export interface N3InventoryViewProps {
  paginatedProducts: InventoryProduct[];
  filteredProducts: InventoryProduct[];
  stats: InventoryStats;
  loading: boolean;
  error: string | null;
  selectedIds: Set<string>;
  viewMode: 'list' | 'card';
  activeFilter: string;
  showCandidatesOnly: boolean;
  showSetsOnly: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (size: number) => void;
  };
  // 🔥 フェーズ2: L4サブフィルター
  masterInventoryType?: MasterInventoryType | null;
  onMasterInventoryTypeChange?: (type: MasterInventoryType | null) => void;
  l4TypeCounts?: {
    all: number;
    regular: number;
    set: number;
    mu: number;
    parts: number;
  };
  onSelect: (id: string) => void;
  onDetail: (id: string) => void;
  onStockChange: (id: string, quantity: number) => Promise<void>;
  onCostChange: (id: string, cost: number) => Promise<void>;
  onInventoryTypeChange?: (id: string, type: 'stock' | 'mu') => Promise<void>;
  onStorageLocationChange?: (id: string, location: string) => Promise<void>;
  onAttributeChange?: (id: string, level: 'l1' | 'l2' | 'l3', value: string) => Promise<void>;
  onL4Change?: (id: string, channels: string[]) => Promise<void>;
  onVerifiedChange?: (id: string, verified: boolean) => Promise<void>;
  onInventoryImageUpload?: (id: string, file: File) => Promise<string | null>;
  onRefresh?: () => void;
}

// ============================================================
// メインコンポーネント
// ============================================================

export const N3InventoryView = memo(function N3InventoryView({
  paginatedProducts,
  filteredProducts,
  stats,
  loading,
  error,
  selectedIds,
  viewMode,
  activeFilter,
  showCandidatesOnly,
  showSetsOnly,
  pagination,
  // 🔥 L4サブフィルター
  masterInventoryType,
  onMasterInventoryTypeChange,
  l4TypeCounts,
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
  onInventoryTypeChange,
  onStorageLocationChange,
  onAttributeChange,
  onL4Change,
  onVerifiedChange,
  onInventoryImageUpload,
  onRefresh,
}: N3InventoryViewProps) {
  
  const [attributeOptions, setAttributeOptions] = useState<{
    l1: string[];
    l2: string[];
    l3: string[];
  }>({ l1: [], l2: [], l3: [] });
  
  const [flagStats, setFlagStats] = useState<{
    needsCheckCount: number;
    confirmedCount: number;
    withMemoCount: number;
  }>({ needsCheckCount: 0, confirmedCount: 0, withMemoCount: 0 });
  
  const showAttributeColumns = activeFilter === 'in_stock_master';
  const showFlagControls = activeFilter === 'in_stock' || activeFilter === 'in_stock_master';
  
  // 属性オプションを取得
  useEffect(() => {
    if (!showAttributeColumns) return;
    
    const fetchOptions = async () => {
      try {
        const res = await fetch('/api/inventory/attribute-options');
        const data = await res.json();
        if (data.success) {
          setAttributeOptions({
            l1: data.l1Options || [],
            l2: data.l2Options || [],
            l3: data.l3Options || [],
          });
        }
      } catch (err) {
        console.error('[N3InventoryView] Failed to fetch attribute options:', err);
      }
    };
    
    fetchOptions();
  }, [showAttributeColumns]);
  
  // フラグ統計を取得
  useEffect(() => {
    if (!showFlagControls) return;
    
    const fetchFlagStats = async () => {
      try {
        const res = await fetch('/api/inventory/update-flags');
        const data = await res.json();
        if (data.success && data.stats) {
          setFlagStats({
            needsCheckCount: data.stats.needsCheckCount || 0,
            confirmedCount: data.stats.confirmedCount || 0,
            withMemoCount: data.stats.withMemoCount || 0,
          });
        }
      } catch (err) {
        console.error('[N3InventoryView] Failed to fetch flag stats:', err);
      }
    };
    
    fetchFlagStats();
  }, [showFlagControls]); // paginatedProductsを依存から削除（無限ループ防止）
  
  // 属性変更ハンドラー
  const handleAttributeChange = useCallback(async (id: string, level: 'l1' | 'l2' | 'l3', value: string) => {
    if (onAttributeChange) {
      await onAttributeChange(id, level, value);
    } else {
      try {
        await fetch('/api/inventory/update-attribute', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, field: `attr_${level}`, value }),
        });
      } catch (err) {
        console.error('[N3InventoryView] Attribute update error:', err);
      }
    }
  }, [onAttributeChange]);
  
  // L4属性変更ハンドラー
  const handleL4Change = useCallback(async (id: string, channels: string[]) => {
    if (onL4Change) {
      await onL4Change(id, channels);
    } else {
      try {
        await fetch('/api/inventory/update-attribute', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, field: 'attr_l4', value: channels }),
        });
      } catch (err) {
        console.error('[N3InventoryView] L4 update error:', err);
      }
    }
  }, [onL4Change]);
  
  // 確定フラグ変更ハンドラー
  const handleVerifiedChange = useCallback(async (id: string, verified: boolean) => {
    if (onVerifiedChange) {
      await onVerifiedChange(id, verified);
    } else {
      try {
        await fetch('/api/inventory/update-attribute', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, field: 'is_verified', value: verified }),
        });
      } catch (err) {
        console.error('[N3InventoryView] Verified update error:', err);
      }
    }
  }, [onVerifiedChange]);
  
  // 統計再取得関数
  const refetchFlagStats = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory/update-flags');
      const data = await res.json();
      if (data.success && data.stats) {
        setFlagStats({
          needsCheckCount: data.stats.needsCheckCount || 0,
          confirmedCount: data.stats.confirmedCount || 0,
          withMemoCount: data.stats.withMemoCount || 0,
        });
      }
    } catch (err) {
      console.error('[N3InventoryView] Failed to refetch flag stats:', err);
    }
  }, []);

  // 要確認フラグ変更ハンドラー
  const handleNeedsCheckChange = useCallback(async (id: string, value: boolean) => {
    try {
      const res = await fetch('/api/inventory/update-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field: 'needs_count_check', value }),
      });
      const data = await res.json();
      if (data.success) {
        // 統計を再取得（APIから正確な値を取得）
        await refetchFlagStats();
        onRefresh?.();
      }
    } catch (err) {
      console.error('[N3InventoryView] NeedsCheck update error:', err);
    }
  }, [onRefresh, refetchFlagStats]);
  
  // stock_confirmed 変更ハンドラー
  const handleConfirmedChange = useCallback(async (id: string, value: boolean) => {
    try {
      const res = await fetch('/api/inventory/update-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field: 'stock_confirmed', value }),
      });
      const data = await res.json();
      if (data.success) {
        // 統計を再取得
        await refetchFlagStats();
        onRefresh?.();
      }
    } catch (err) {
      console.error('[N3InventoryView] Confirmed update error:', err);
    }
  }, [onRefresh, refetchFlagStats]);
  
  // メモ変更ハンドラー
  const handleMemoChange = useCallback(async (id: string, memo: string) => {
    try {
      const res = await fetch('/api/inventory/update-flags', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field: 'stock_memo', value: memo }),
      });
      const data = await res.json();
      if (data.success) {
        onRefresh?.();
      }
    } catch (err) {
      console.error('[N3InventoryView] Memo update error:', err);
    }
  }, [onRefresh]);
  
  // 一括フラグ更新
  const handleBulkFlagUpdate = useCallback(async (updates: { needs_count_check?: boolean; stock_confirmed?: boolean }) => {
    if (selectedIds.size === 0) return;
    
    try {
      const res = await fetch('/api/inventory/update-flags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedIds), updates }),
      });
      const data = await res.json();
      if (data.success) {
        // 統計を再取得
        await refetchFlagStats();
        onRefresh?.();
      } else {
        alert(`一括更新エラー: ${data.error}`);
      }
    } catch (err: any) {
      alert(`エラー: ${err.message}`);
    }
  }, [selectedIds, onRefresh, refetchFlagStats]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        棚卸しデータ読み込み中...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--error)' }}>
        エラー: {error}
      </div>
    );
  }

  if (paginatedProducts.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        {activeFilter === 'variation' && showCandidatesOnly
          ? 'グルーピング候補がありません'
          : activeFilter === 'set_products' && showSetsOnly
          ? 'セット商品がありません'
          : '棚卸しデータがありません'
        }
      </div>
    );
  }

  const selectedTotal = filteredProducts
    .filter(p => selectedIds.has(String(p.id)))
    .reduce((sum, p) => sum + ((p.cost_jpy || 0) * (p.physical_quantity || 1)), 0);
  
  const verifiedCount = filteredProducts.filter(p => (p as any).is_verified === true).length;

  return (
    <div style={{ padding: 12 }}>
      {/* 棚卸し情報バー */}
      <div style={{
        marginBottom: 12,
        padding: '10px 12px',
        background: 'var(--highlight)',
        borderRadius: 4,
        fontSize: 12,
        border: '1px solid var(--panel-border)',
      }}>
        {/* 上段 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
          color: 'var(--text-muted)',
        }}>
          <span>
            {activeFilter === 'in_stock' && `有在庫: ${stats.inStockCount}件`}
            {activeFilter === 'variation' && `バリエーション: 親${stats.variationParentCount}件 / 子${stats.variationMemberCount}件`}
            {activeFilter === 'set_products' && `セット商品: ${filteredProducts.filter(p => p.product_type === 'set').length}件`}
            {activeFilter === 'in_stock_master' && `マスター全件: ${stats.totalCount}件`}
          </span>
          <span>
            ページ {pagination.currentPage}/{pagination.totalPages}
            （{paginatedProducts.length}/{pagination.totalItems}件表示）
          </span>
        </div>
        
        {/* フラグ統計（有在庫タブのみ） */}
        {showFlagControls && (
          <div style={{
            display: 'flex',
            gap: 12,
            paddingBottom: 8,
            marginBottom: 8,
            borderBottom: '1px solid var(--panel-border)',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              background: flagStats.needsCheckCount > 0 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
              borderRadius: 4,
              border: flagStats.needsCheckCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid transparent',
            }}>
              <AlertTriangle size={12} style={{ color: '#ef4444' }} />
              <span style={{ fontSize: 11, color: '#ef4444' }}>
                要確認: <strong>{flagStats.needsCheckCount}</strong>件
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              background: 'rgba(34, 197, 94, 0.1)',
              borderRadius: 4,
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}>
              <CheckCircle size={12} style={{ color: '#22c55e' }} />
              <span style={{ fontSize: 11, color: '#22c55e' }}>
                確定: <strong>{flagStats.confirmedCount}</strong>/{stats.inStockCount}件
              </span>
            </div>
            
            {flagStats.withMemoCount > 0 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: 4,
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}>
                <MessageSquare size={12} style={{ color: '#f59e0b' }} />
                <span style={{ fontSize: 11, color: '#f59e0b' }}>
                  メモ: <strong>{flagStats.withMemoCount}</strong>件
                </span>
              </div>
            )}
            
            {selectedIds.size > 0 && (
              <>
                <div style={{ width: 1, height: 24, background: 'var(--panel-border)' }} />
                <button
                  onClick={() => handleBulkFlagUpdate({ needs_count_check: true })}
                  style={{
                    padding: '4px 8px',
                    fontSize: 10,
                    fontWeight: 600,
                    background: '#fef2f2',
                    border: '1px solid #ef4444',
                    borderRadius: 4,
                    color: '#dc2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <AlertTriangle size={10} />
                  選択{selectedIds.size}件を要確認
                </button>
                <button
                  onClick={() => handleBulkFlagUpdate({ stock_confirmed: true })}
                  style={{
                    padding: '4px 8px',
                    fontSize: 10,
                    fontWeight: 600,
                    background: '#dcfce7',
                    border: '1px solid #22c55e',
                    borderRadius: 4,
                    color: '#16a34a',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <CheckCircle size={10} />
                  選択{selectedIds.size}件を確定
                </button>
              </>
            )}
          </div>
        )}
        
        {/* 下段 */}
        <div style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>商品種類数:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14, color: 'var(--text)' }}>
              {filteredProducts.length.toLocaleString()}種類
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>総在庫数:</span>
            <span style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 13, color: 'var(--success)' }}>
              {filteredProducts.reduce((sum, p) => sum + (p.physical_quantity || 0), 0).toLocaleString()}個
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>原価総額:</span>
            <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14, color: 'var(--text)' }}>
              ¥{(stats.totalCostJpy || 0).toLocaleString()}
            </span>
          </div>
          
          {selectedIds.size > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 4,
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}>
              <span style={{ color: 'rgb(59, 130, 246)', fontSize: 11 }}>
                選択{selectedIds.size}件:
              </span>
              <span style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14, color: 'rgb(59, 130, 246)' }}>
                ¥{selectedTotal.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* 属性入力ヒント */}
      {showAttributeColumns && (
        <div style={{
          marginBottom: 12,
          padding: '8px 12px',
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: 4,
          fontSize: 11,
          color: '#10b981',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontWeight: 600 }}>💡 属性入力モード:</span>
          <span>L1/L2/L3をクリックして属性を設定。✓をクリックで「確定」としてマーク。</span>
        </div>
      )}
      
      {/* 商品表示 */}
      {viewMode === 'list' ? (
        <N3InventoryTable
          items={paginatedProducts}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onDetail={onDetail}
          onStockChange={onStockChange}
          onCostChange={onCostChange}
          onAttributeChange={handleAttributeChange}
          onL4Change={handleL4Change}
          onVerifiedChange={handleVerifiedChange}
          attributeOptions={attributeOptions}
          showAttributeColumns={showAttributeColumns}
        />
      ) : (
        <N3InventoryCardGrid
          items={paginatedProducts}
          selectedIds={selectedIds}
          onSelect={onSelect}
          onDetail={onDetail}
          onStockChange={onStockChange}
          onCostChange={onCostChange}
          showInventoryTypeToggle={['active_listings', 'in_stock', 'in_stock_master', 'back_order_only'].includes(activeFilter)}
          onInventoryTypeChange={onInventoryTypeChange}
          onStorageLocationChange={onStorageLocationChange}
          onInventoryImageUpload={onInventoryImageUpload}
          // フラグコントロール
          showFlagControls={showFlagControls}
          onNeedsCheckChange={handleNeedsCheckChange}
          onConfirmedChange={handleConfirmedChange}
          onMemoChange={handleMemoChange}
          columns="auto"
          gap={8}
          minCardWidth={180}
        />
      )}
      
      {/* ページネーション */}
      {pagination.totalPages > 1 && (
        <div style={{ marginTop: 16 }}>
          <N3Pagination
            total={pagination.totalItems}
            pageSize={pagination.itemsPerPage}
            currentPage={pagination.currentPage}
            onPageChange={pagination.setCurrentPage}
            onPageSizeChange={pagination.setItemsPerPage}
            pageSizeOptions={[10, 50, 100, 500]}
          />
        </div>
      )}
    </div>
  );
});

export default N3InventoryView;
