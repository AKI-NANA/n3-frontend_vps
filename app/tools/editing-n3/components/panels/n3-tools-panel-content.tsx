// app/tools/editing-n3/components/panels/n3-tools-panel-content.tsx
/**
 * N3ToolsPanelContent - ツールパネルのコンテンツ
 * 
 * 責務:
 * - 各フィルターに応じたツールパネルの表示
 * - 承認アクションバーの表示
 */

'use client';

import React, { memo } from 'react';
import { N3ToolPanel, N3StatsBar } from '@/components/n3';
import { N3ApprovalActionBar } from '@/components/n3/n3-approval-action-bar';
import { MarketplaceSelector } from '@/app/tools/editing/components/marketplace-selector';
import { InventoryToolPanel, VariationToolPanel, SetProductToolPanel } from '../l3-tabs';
import type { Product } from '@/app/tools/editing/types/product';
import type { InventoryProduct } from '../../hooks';

// ============================================================
// 型定義
// ============================================================

export interface ToolsPanelContentProps {
  /** アクティブフィルター */
  activeFilter: string;
  /** 処理中フラグ */
  processing: boolean;
  /** 現在のステップ */
  currentStep: string;
  /** 変更済み件数 */
  modifiedCount: number;
  /** 準備完了件数 */
  readyCount: number;
  /** ミラー選択件数 */
  selectedMirrorCount: number;
  /** 選択件数 */
  selectedCount: number;
  /** 完全データ件数 */
  completeCount: number;
  /** 不完全データ件数 */
  incompleteCount: number;
  /** データフィルター */
  dataFilter: 'all' | 'complete' | 'incomplete';
  /** データフィルター変更 */
  onDataFilterChange: (filter: 'all' | 'complete' | 'incomplete') => void;
  /** マーケットプレイス */
  marketplaces: string[];
  /** マーケットプレイス変更 */
  onMarketplacesChange: (marketplaces: string[]) => void;
  /** 棚卸しデータ */
  inventoryData?: {
    stats: any;
    loading: boolean;
    filteredProducts: InventoryProduct[];
  };
  /** 棚卸し同期状態 */
  inventorySyncing?: {
    mjt: boolean;
    green: boolean;
    incremental: boolean;
    mercari: boolean;
  };
  /** 棚卸し選択件数 */
  inventorySelectedCount?: number;
  /** 棚卸し保留件数 */
  inventoryPendingCount?: number;
  /** バリエーション候補のみ表示 */
  showCandidatesOnly?: boolean;
  /** セットのみ表示 */
  showSetsOnly?: boolean;
  /** バリエーション統計 */
  variationStats?: {
    parentCount: number;
    memberCount: number;
    standaloneCount: number;
    candidateCount: number;
  };
  /** バリエーション作成中 */
  variationLoading?: boolean;
  /** セット作成中 */
  setLoading?: boolean;
  /** 選択中の商品ID群 */
  selectedProductIds?: (number | string)[];
  /** ハンドラー群（ツールパネル用） */
  toolHandlers: {
    onRunAll: () => void;
    onPaste: () => void;
    onReload: () => void;
    onCSVUpload: () => void;
    onCategory: () => void;
    onShipping: () => void;
    onProfit: () => void;
    onHTML: () => void;
    onScore: () => void;
    onHTS: () => void;
    onOrigin: () => void;
    onMaterial: () => void;
    onFilter: () => void;
    onResearch: () => void;
    onAI: () => void;
    onTranslate: () => void;
    onSellerMirror: () => void;
    onDetails: () => void;
    onGemini: () => void;
    onFinalProcess: () => void;
    onList: () => void;
    onSave: () => void;
    onDelete: () => void;
    onExportCSV: () => void;
    onExportEbay: () => void;
    onExportAI: () => void;
    onEnrichmentFlow: () => void;
  };
  /** 承認済み件数（選択中のうち承認済みの件数） */
  approvedCount?: number;
  /** 承認ハンドラー群 */
  approvalHandlers: {
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onApprove: () => void;
    onReject: () => void;
    onScheduleListing: () => void;
    onListNow?: () => void;
    onSave: () => void;
  };
  /** 棚卸しハンドラー群 */
  inventoryHandlers?: {
    onSyncIncremental: (account: string) => void;
    onSyncFull: (account: string) => void;
    onSyncMercari: () => void;
    onRefresh: () => void;
    onBulkDelete: (target: string) => void;
    onNewProduct: () => void;
    onBulkImageUpload: () => void;
    onImageAttach?: () => void; // ★ 追加: 画像なし商品への画像追加
    onDetectCandidates: () => void;
    onToggleCandidatesOnly: () => void;
    onCreateVariation: () => void;
    onClearSelection: () => void;
    onCreateSet: () => void;
    onToggleSetsOnly: () => void;
    onEditSet: () => void;
    onDeleteSet: () => void;
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

export const N3ToolsPanelContent = memo(function N3ToolsPanelContent({
  activeFilter,
  processing,
  currentStep,
  modifiedCount,
  readyCount,
  selectedMirrorCount,
  selectedCount,
  completeCount,
  incompleteCount,
  dataFilter,
  onDataFilterChange,
  marketplaces,
  onMarketplacesChange,
  inventoryData,
  inventorySyncing,
  inventorySelectedCount = 0,
  inventoryPendingCount = 0,
  showCandidatesOnly = false,
  showSetsOnly = false,
  variationStats,
  variationLoading = false,
  setLoading = false,
  selectedProductIds = [],
  toolHandlers,
  approvalHandlers,
  inventoryHandlers,
  approvedCount = 0,
}: ToolsPanelContentProps) {

  // 棚卸しタブ：有在庫/マスター
  if ((activeFilter === 'in_stock' || activeFilter === 'in_stock_master') && inventoryData && inventorySyncing && inventoryHandlers) {
    return (
      <InventoryToolPanel
        stats={inventoryData.stats}
        loading={inventoryData.loading}
        syncing={inventorySyncing}
        selectedCount={inventorySelectedCount}
        pendingCount={inventoryPendingCount}
        onSyncIncremental={inventoryHandlers.onSyncIncremental}
        onSyncFull={inventoryHandlers.onSyncFull}
        onSyncMercari={inventoryHandlers.onSyncMercari}
        onRefresh={inventoryHandlers.onRefresh}
        onBulkDelete={inventoryHandlers.onBulkDelete}
        onNewProduct={inventoryHandlers.onNewProduct}
        onBulkImageUpload={inventoryHandlers.onBulkImageUpload}
      />
    );
  }

  // 棚卸しタブ：バリエーション
  if (activeFilter === 'variation' && variationStats && inventoryHandlers) {
    return (
      <VariationToolPanel
        stats={variationStats}
        loading={inventoryData?.loading || variationLoading}
        selectedCount={inventorySelectedCount}
        showCandidatesOnly={showCandidatesOnly}
        onDetectCandidates={inventoryHandlers.onDetectCandidates}
        onToggleCandidatesOnly={inventoryHandlers.onToggleCandidatesOnly}
        onCreateVariation={inventoryHandlers.onCreateVariation}
        onClearSelection={inventoryHandlers.onClearSelection}
      />
    );
  }

  // 棚卸しタブ：セット品
  if (activeFilter === 'set_products' && inventoryData && inventoryHandlers) {
    const setProducts = inventoryData.filteredProducts.filter(p => p.product_type === 'set');
    return (
      <SetProductToolPanel
        stats={{
          setCount: setProducts.length,
          totalValue: setProducts.reduce((sum, p) => sum + (p.cost_jpy || 0), 0),
          selectedCount: inventorySelectedCount,
        }}
        loading={inventoryData.loading || setLoading}
        selectedCount={inventorySelectedCount}
        showSetsOnly={showSetsOnly}
        onCreateSet={inventoryHandlers.onCreateSet}
        onToggleSetsOnly={inventoryHandlers.onToggleSetsOnly}
        onEditSet={inventoryHandlers.onEditSet}
        onDeleteSet={inventoryHandlers.onDeleteSet}
      />
    );
  }

  // 承認待ち or 承認済みフィルター
  if (activeFilter === 'approval_pending' || activeFilter === 'approved') {
    return (
      <div>
        <N3ApprovalActionBar
          selectedCount={selectedCount}
          modifiedCount={modifiedCount}
          completeCount={completeCount}
          incompleteCount={incompleteCount}
          dataFilter={dataFilter}
          onDataFilterChange={onDataFilterChange}
          onSelectAll={approvalHandlers.onSelectAll}
          onDeselectAll={approvalHandlers.onDeselectAll}
          onApprove={approvalHandlers.onApprove}
          onReject={approvalHandlers.onReject}
          onScheduleListing={approvalHandlers.onScheduleListing}
          onListNow={approvalHandlers.onListNow}
          onSave={approvalHandlers.onSave}
          processing={processing}
          approvedCount={approvedCount}
          isApprovedTab={activeFilter === 'approved'}
        />
        <N3ToolPanel
          processing={processing}
          currentStep={currentStep}
          modifiedCount={modifiedCount}
          readyCount={readyCount}
          selectedMirrorCount={selectedMirrorCount}
          selectedProductIds={selectedProductIds}
          {...toolHandlers}
        />
      </div>
    );
  }

  // 通常のツールパネル
  return (
    <N3ToolPanel
      processing={processing}
      currentStep={currentStep}
      modifiedCount={modifiedCount}
      readyCount={readyCount}
      selectedMirrorCount={selectedMirrorCount}
      selectedProductIds={selectedProductIds}
      {...toolHandlers}
    />
  );
});

export default N3ToolsPanelContent;
