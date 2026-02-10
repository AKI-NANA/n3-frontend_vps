// components/n3/n3-inventory-card-grid.tsx
/**
 * 棚卸し専用カードグリッドコンポーネント
 * 
 * N3CardGridとは異なり、棚卸し固有の情報を表示:
 * - 在庫数編集機能
 * - 保有日数
 * - eBayアカウント
 * - 商品タイプ
 * - 保管場所（棚卸しモード）
 * - 棚卸し写真（棚卸しモード）
 * - 要確認/確定フラグ
 * - メモ
 */

'use client';

import React, { memo } from 'react';
import { N3InventoryCard, N3InventoryCardProps } from './n3-inventory-card';
import type { InventoryProduct } from '@/app/tools/editing-n3/hooks/use-inventory-data';

export interface N3InventoryCardGridProps {
  /** 棚卸し商品リスト */
  items: InventoryProduct[];
  /** 選択中のID一覧 */
  selectedIds: Set<string>;
  /** 選択変更ハンドラ */
  onSelect?: (id: string) => void;
  /** 詳細クリックハンドラ */
  onDetail?: (id: string) => void;
  /** 在庫変更ハンドラ */
  onStockChange?: (id: string, newQuantity: number) => void;
  /** 原価変更ハンドラ */
  onCostChange?: (id: string, newCost: number) => void;
  /** 在庫タイプ変更ハンドラ */
  onInventoryTypeChange?: (id: string, newType: 'stock' | 'mu') => void;
  /** 在庫タイプトグル表示フラグ */
  showInventoryTypeToggle?: boolean;
  /** カラム数（auto/2/3/4/5/6） */
  columns?: 'auto' | 2 | 3 | 4 | 5 | 6;
  /** ギャップ */
  gap?: number;
  /** 最小カード幅（auto時） */
  minCardWidth?: number;
  
  // 棚卸しモード用
  /** 棚卸しモード */
  stocktakeMode?: boolean;
  /** 保管場所変更ハンドラ */
  onStorageLocationChange?: (id: string, location: string) => void;
  /** 棚卸し写真アップロードハンドラ */
  onInventoryImageUpload?: (id: string, file: File) => Promise<string | null>;
  /** 棚卸し完了ハンドラ */
  onStocktakeComplete?: (id: string, data: { quantity: number; location: string; images: string[] }) => void;
  
  // 新規: フラグ・メモ
  /** 要確認フラグ変更ハンドラ */
  onNeedsCheckChange?: (id: string, value: boolean) => void;
  /** 確定フラグ変更ハンドラ */
  onConfirmedChange?: (id: string, value: boolean) => void;
  /** メモ変更ハンドラ */
  onMemoChange?: (id: string, memo: string) => void;
  /** フラグコントロール表示フラグ */
  showFlagControls?: boolean;
}

export const N3InventoryCardGrid = memo(function N3InventoryCardGrid({
  items,
  selectedIds,
  onSelect,
  onDetail,
  onStockChange,
  onCostChange,
  onInventoryTypeChange,
  showInventoryTypeToggle = false,
  columns = 'auto',
  gap = 8,
  minCardWidth = 180,
  // 棚卸しモード
  stocktakeMode = false,
  onStorageLocationChange,
  onInventoryImageUpload,
  onStocktakeComplete,
  // フラグ・メモ
  onNeedsCheckChange,
  onConfirmedChange,
  onMemoChange,
  showFlagControls = false,
}: N3InventoryCardGridProps) {
  // グリッドスタイル
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: `${gap}px`,
    gridTemplateColumns:
      columns === 'auto'
        ? `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`
        : `repeat(${columns}, 1fr)`,
    contentVisibility: 'auto',
    containIntrinsicSize: '0 500px',
  };

  // 保有日数を計算
  const calculateDaysHeld = (dateAcquired?: string): number | undefined => {
    if (!dateAcquired) return undefined;
    const acquired = new Date(dateAcquired);
    const now = new Date();
    return Math.floor((now.getTime() - acquired.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={gridStyle}>
      {items.map((item) => (
        <N3InventoryCard
          key={item.id}
          id={String(item.id)}
          title={item.product_name || item.title || ''}
          sku={item.sku || undefined}
          imageUrl={item.images?.[0] || item.image_url || undefined}
          stockQuantity={item.physical_quantity || item.current_stock || 0}
          costJpy={item.cost_jpy || (item.cost_price && item.cost_price < 1000 ? item.cost_price * 150 : item.cost_price)}
          ebayAccount={item.ebay_account || item.account || undefined}
          marketplace={item.marketplace || undefined}
          daysHeld={item.date_acquired ? calculateDaysHeld(item.date_acquired) : undefined}
          productType={item.product_type || undefined}
          isVariationParent={item.is_variation_parent}
          isVariationMember={item.is_variation_member || item.is_variation_child}
          stockStatus={item.stock_status}
          category={item.category || undefined}
          inventoryType={item.inventory_type as 'stock' | 'mu' | undefined}
          setAvailableQuantity={item.set_available_quantity}
          selected={selectedIds.has(String(item.id))}
          // 棚卸し用プロパティ
          storageLocation={(item as any).storage_location}
          lastCountedAt={(item as any).last_counted_at}
          countedBy={(item as any).counted_by}
          inventoryImages={(item as any).inventory_images}
          stocktakeMode={stocktakeMode}
          // 新規: フラグ・メモ
          needsCountCheck={(item as any).needs_count_check || false}
          stockConfirmed={(item as any).stock_confirmed || false}
          stockMemo={(item as any).stock_memo || ''}
          // ハンドラ
          onSelect={onSelect}
          onDetail={onDetail}
          onStockChange={onStockChange}
          onCostChange={onCostChange}
          onInventoryTypeChange={onInventoryTypeChange}
          showInventoryTypeToggle={showInventoryTypeToggle}
          onStorageLocationChange={onStorageLocationChange}
          onInventoryImageUpload={onInventoryImageUpload}
          onStocktakeComplete={onStocktakeComplete}
          // フラグ・メモハンドラ
          onNeedsCheckChange={onNeedsCheckChange}
          onConfirmedChange={onConfirmedChange}
          onMemoChange={onMemoChange}
          showFlagControls={showFlagControls}
        />
      ))}
    </div>
  );
});

export default N3InventoryCardGrid;
