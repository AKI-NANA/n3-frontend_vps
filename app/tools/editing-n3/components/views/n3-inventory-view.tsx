// app/tools/editing-n3/components/views/n3-inventory-view.tsx
/**
 * N3InventoryView - 棚卸しビュー（カード/テーブル表示）v2
 * 
 * 責務:
 * - 棚卸し商品のカード/テーブル表示
 * - 在庫数・原価の編集
 * - 属性（attr_l1/l2/l3）の編集（マスタータブ）
 * - 棚卸し統計表示
 */

'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { N3Pagination, N3Divider } from '@/components/n3';
import { N3InventoryCardGrid } from '@/components/n3/n3-inventory-card-grid';
import { N3InventoryTable } from '@/components/n3/n3-inventory-table';
import type { InventoryProduct } from '../../hooks';

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
  /** 表示する商品リスト（ページネーション済み） */
  paginatedProducts: InventoryProduct[];
  /** フィルター済み商品リスト（統計用） */
  filteredProducts: InventoryProduct[];
  /** 統計情報 */
  stats: InventoryStats;
  /** ローディング状態 */
  loading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 選択されたID */
  selectedIds: Set<string>;
  /** 表示モード */
  viewMode: 'list' | 'card';
  /** アクティブフィルター */
  activeFilter: string;
  /** 候補のみ表示（バリエーションタブ） */
  showCandidatesOnly: boolean;
  /** セットのみ表示（セット品タブ） */
  showSetsOnly: boolean;
  /** ページネーション */
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    setCurrentPage: (page: number) => void;
    setItemsPerPage: (size: number) => void;
  };
  /** 選択トグル */
  onSelect: (id: string) => void;
  /** 詳細表示 */
  onDetail: (id: string) => void;
  /** 在庫数変更 */
  onStockChange: (id: string, quantity: number) => Promise<void>;
  /** 原価変更 */
  onCostChange: (id: string, cost: number) => Promise<void>;
  /** 在庫タイプ変更 */
  onInventoryTypeChange?: (id: string, type: 'stock' | 'mu') => Promise<void>;
  /** 保管場所変更 */
  onStorageLocationChange?: (id: string, location: string) => Promise<void>;
  /** 属性変更 */
  onAttributeChange?: (id: string, level: 'l1' | 'l2' | 'l3', value: string) => Promise<void>;
  /** 確定フラグ変更 */
  onVerifiedChange?: (id: string, verified: boolean) => Promise<void>;
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
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
  onInventoryTypeChange,
  onStorageLocationChange,
  onAttributeChange,
  onVerifiedChange,
}: N3InventoryViewProps) {
  
  // 属性オプション（APIから取得）
  const [attributeOptions, setAttributeOptions] = useState<{
    l1: string[];
    l2: string[];
    l3: string[];
  }>({ l1: [], l2: [], l3: [] });
  
  // マスタータブの場合、属性カラムを表示
  const showAttributeColumns = activeFilter === 'in_stock_master';
  
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
  
  // 属性変更ハンドラー
  const handleAttributeChange = useCallback(async (id: string, level: 'l1' | 'l2' | 'l3', value: string) => {
    if (onAttributeChange) {
      await onAttributeChange(id, level, value);
    } else {
      // デフォルトのAPI呼び出し
      try {
        const res = await fetch('/api/inventory/update-attribute', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            field: `attr_${level}`,
            value,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          console.error('[N3InventoryView] Attribute update failed:', data.error);
        }
      } catch (err) {
        console.error('[N3InventoryView] Attribute update error:', err);
      }
    }
  }, [onAttributeChange]);
  
  // 確定フラグ変更ハンドラー
  const handleVerifiedChange = useCallback(async (id: string, verified: boolean) => {
    if (onVerifiedChange) {
      await onVerifiedChange(id, verified);
    } else {
      // デフォルトのAPI呼び出し
      try {
        const res = await fetch('/api/inventory/update-attribute', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id,
            field: 'is_verified',
            value: verified,
          }),
        });
        const data = await res.json();
        if (!data.success) {
          console.error('[N3InventoryView] Verified update failed:', data.error);
        }
      } catch (err) {
        console.error('[N3InventoryView] Verified update error:', err);
      }
    }
  }, [onVerifiedChange]);

  // ローディング
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        棚卸しデータ読み込み中...
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--error)' }}>
        エラー: {error}
      </div>
    );
  }

  // 空
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

  // 選択商品の原価合計を計算
  const selectedTotal = filteredProducts
    .filter(p => selectedIds.has(String(p.id)))
    .reduce((sum, p) => sum + ((p.cost_jpy || 0) * (p.physical_quantity || 1)), 0);
  
  // 確定済み商品数
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
        {/* 上段: 基本情報 */}
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
        
        {/* 下段: 原価総額・在庫数 */}
        <div style={{
          display: 'flex',
          gap: 24,
          paddingTop: 8,
          borderTop: '1px solid var(--panel-border)',
          flexWrap: 'wrap',
        }}>
          {/* 商品種類数 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>商品種類数:</span>
            <span style={{
              fontWeight: 700,
              fontFamily: 'monospace',
              fontSize: 14,
              color: 'var(--text)',
            }}>
              {filteredProducts.length.toLocaleString()}種類
            </span>
          </div>
          
          {/* 在庫数合計 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>総在庫数:</span>
            <span style={{
              fontWeight: 600,
              fontFamily: 'monospace',
              fontSize: 13,
              color: 'var(--success)',
            }}>
              {filteredProducts.reduce((sum, p) => sum + (p.physical_quantity || 0), 0).toLocaleString()}個
            </span>
          </div>
          
          {/* 全商品原価総額 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>原価総額:</span>
            <span style={{
              fontWeight: 700,
              fontFamily: 'monospace',
              fontSize: 14,
              color: 'var(--text)',
            }}>
              ¥{(stats.totalCostJpy || 0).toLocaleString()}
            </span>
          </div>
          
          {/* 確定済み商品数（マスタータブのみ） */}
          {showAttributeColumns && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 4,
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}>
              <span style={{ color: '#10b981', fontSize: 11 }}>
                確定済み:
              </span>
              <span style={{
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: 14,
                color: '#10b981',
              }}>
                {verifiedCount}/{filteredProducts.length}件
              </span>
            </div>
          )}
          
          {/* 選択商品原価合計 */}
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
              <span style={{
                fontWeight: 700,
                fontFamily: 'monospace',
                fontSize: 14,
                color: 'rgb(59, 130, 246)',
              }}>
                ¥{selectedTotal.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* マスタータブの場合、属性入力のヒント表示 */}
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
          <span>L1/L2/L3をクリックして属性を設定。✓をクリックで「確定」としてマーク。確定済み商品はエメラルド枠で表示されます。</span>
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
