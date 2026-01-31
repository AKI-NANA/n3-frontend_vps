// app/tools/editing-n3/components/panels/n3-stats-panel-content.tsx
/**
 * N3StatsPanelContent - 統計パネルのコンテンツ
 * 
 * 責務:
 * - 各フィルターに応じた統計情報の表示
 */

'use client';

import React, { memo } from 'react';
import { N3StatsBar } from '@/components/n3';
import type { Product } from '@/app/tools/editing/types/product';
import type { InventoryProduct } from '../../hooks';

// ============================================================
// 型定義
// ============================================================

export interface N3StatsPanelContentProps {
  /** アクティブフィルター */
  activeFilter: string;
  /** 表示商品リスト */
  displayProducts: Product[];
  /** 全商品数 */
  total: number;
  /** 全商品リスト */
  products: Product[];
  /** 完全データ件数 */
  completeCount: number;
  /** 不完全データ件数 */
  incompleteCount: number;
  /** 棚卸しデータ */
  inventoryData?: {
    filteredProducts: InventoryProduct[];
    stats: {
      variationParentCount: number;
      variationMemberCount: number;
      standaloneCount: number;
    };
  };
}

// ============================================================
// ヘルパー関数
// ============================================================

const isInventoryTab = (tabId: string) => {
  return ['in_stock', 'variation', 'set_products', 'in_stock_master'].includes(tabId);
};

// ============================================================
// メインコンポーネント
// ============================================================

export const N3StatsPanelContent = memo(function N3StatsPanelContent({
  activeFilter,
  displayProducts,
  total,
  products,
  completeCount,
  incompleteCount,
  inventoryData,
}: N3StatsPanelContentProps) {

  // 棚卸しタブ：バリエーション
  if (activeFilter === 'variation' && inventoryData) {
    return (
      <div className="p-3">
        <N3StatsBar
          stats={[
            { label: '総商品数', value: inventoryData.filteredProducts.length, color: 'default' },
            { label: '親SKU', value: inventoryData.stats.variationParentCount, color: 'purple' },
            { label: '子SKU', value: inventoryData.stats.variationMemberCount, color: 'blue' },
            { label: '単独SKU', value: inventoryData.stats.standaloneCount, color: 'gray' },
          ]}
          size="compact"
          gap={8}
        />
      </div>
    );
  }

  // 棚卸しタブ：セット品
  if (activeFilter === 'set_products' && inventoryData) {
    return (
      <div className="p-3">
        <N3StatsBar
          stats={[
            { label: '総商品数', value: inventoryData.filteredProducts.length, color: 'default' },
            { label: 'セット品', value: inventoryData.filteredProducts.filter(p => p.product_type === 'set').length, color: 'purple' },
            { label: '単品', value: inventoryData.filteredProducts.filter(p => p.product_type !== 'set').length, color: 'gray' },
          ]}
          size="compact"
          gap={8}
        />
      </div>
    );
  }

  // 棚卸しタブ：有在庫/マスター/無在庫
  if (isInventoryTab(activeFilter) && inventoryData) {
    return (
      <div className="p-3">
        <N3StatsBar
          stats={[
            { label: '総商品数', value: inventoryData.filteredProducts.length, color: 'default' },
            { label: '有在庫', value: inventoryData.filteredProducts.filter(p => p.inventory_type === 'stock').length, color: 'blue' },
            { label: '無在庫', value: inventoryData.filteredProducts.filter(p => p.inventory_type === 'mu' || !p.inventory_type).length, color: 'yellow' },
            { label: '出品中', value: inventoryData.filteredProducts.filter(p => p.source_data?.listing_status === 'active').length, color: 'green' },
          ]}
          size="compact"
          gap={8}
        />
      </div>
    );
  }

  // データ編集タブ
  if (activeFilter === 'data_editing') {
    return (
      <div className="p-3">
        <N3StatsBar
          stats={[
            { label: '総商品数', value: displayProducts.length, color: 'default' },
            { label: '英語タイトルなし', value: displayProducts.filter(p => !p.english_title).length, color: 'red' },
            { label: 'カテゴリなし', value: displayProducts.filter(p => !p.ebay_category_id).length, color: 'yellow' },
            { label: '画像なし', value: displayProducts.filter(p => !p.primary_image_url).length, color: 'gray' },
          ]}
          size="compact"
          gap={8}
        />
      </div>
    );
  }

  // 承認待ちタブ
  if (activeFilter === 'approval_pending') {
    return (
      <div className="p-3">
        <N3StatsBar
          stats={[
            { label: '総商品数', value: displayProducts.length, color: 'default' },
            { label: '完全', value: completeCount, color: 'green' },
            { label: '不完全', value: incompleteCount, color: 'yellow' },
          ]}
          size="compact"
          gap={8}
        />
      </div>
    );
  }

  // 出品中タブ
  if (activeFilter === 'active_listings') {
    return (
      <div className="p-3">
        <N3StatsBar
          stats={[
            { label: '総商品数', value: displayProducts.length, color: 'default' },
            { label: '有在庫', value: displayProducts.filter(p => p.inventory_type === 'stock').length, color: 'blue' },
            { label: '無在庫', value: displayProducts.filter(p => p.inventory_type === 'mu' || !p.inventory_type).length, color: 'yellow' },
            { label: '在庫0', value: displayProducts.filter(p => !p.physical_quantity).length, color: 'red' },
          ]}
          size="compact"
          gap={8}
        />
      </div>
    );
  }

  // 全商品タブ（デフォルト）
  return (
    <div className="p-3">
      <N3StatsBar
        stats={[
          { label: '総商品数', value: total, color: 'default' },
          { label: '出品準備完了', value: products.filter(p => p.ready_to_list).length, color: 'blue' },
          { label: '未完了', value: products.filter(p => !p.ready_to_list).length, color: 'yellow' },
          { label: '出品済み', value: products.filter(p => p.listed_marketplaces && p.listed_marketplaces.length > 0).length, color: 'green' },
        ]}
        size="compact"
        gap={8}
      />
    </div>
  );
});

export default N3StatsPanelContent;
