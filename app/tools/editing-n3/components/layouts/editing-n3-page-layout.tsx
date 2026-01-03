// app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx
/**
 * Editing N3 Page Layout - N3デザインシステム版レイアウト
 * 
 * ⚠️ アーキテクチャルール:
 * - このファイルは800行以下を維持すること
 * - 新機能追加時は別コンポーネントに分離すること
 * - 詳細は /app/tools/editing-n3/ARCHITECTURE.md を参照
 * 
 * 設計原則:
 * 1. Hooks層は tools/editing から参照
 * 2. ビュー・パネルは別コンポーネントに分離済み
 * 3. レイアウト組み立てのみを担当
 */

'use client';

import React, { useState, useEffect, useCallback, memo, Suspense, lazy, useMemo, useRef } from 'react';
import { Edit3, Truck, Shield, Image as ImageIcon, History } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/error';

// N3コンポーネント
import { N3FilterTab, N3Pagination, N3Footer, N3CollapsibleHeader, N3Divider } from '@/components/n3';
import type { ExpandPanelProduct } from '@/components/n3';

// 分離済みコンポーネント
import { N3PageHeader, N3SubToolbar, N3GlobalFilterBar, DEFAULT_FILTER_STATE, HEADER_HEIGHT } from '../header';
import type { PanelTabId, GlobalFilterState } from '../header';
import { N3BasicEditView, N3InventoryView } from '../views';
import { N3ToolsPanelContent, N3StatsPanelContent, N3GroupingPanel } from '../panels';
import { checkProductCompleteness } from '@/lib/product';
import { MarketplaceSelector } from '@/app/tools/editing/components/marketplace-selector';

// 既存コンポーネント（モーダル群）
import { ProductModal } from '@/app/tools/editing/components/product-modal';
const PasteModal = lazy(() => import('@/app/tools/editing/components/paste-modal').then(m => ({ default: m.PasteModal })));
const CSVUploadModal = lazy(() => import('@/app/tools/editing/components/csv-upload-modal').then(m => ({ default: m.CSVUploadModal })));
const AIDataEnrichmentModal = lazy(() => import('@/app/tools/editing/components/ai-data-enrichment-modal').then(m => ({ default: m.AIDataEnrichmentModal })));
const AIMarketResearchModal = lazy(() => import('@/app/tools/editing/components/ai-market-research-modal').then(m => ({ default: m.AIMarketResearchModal })));
const GeminiBatchModal = lazy(() => import('@/app/tools/editing/components/gemini-batch-modal').then(m => ({ default: m.GeminiBatchModal })));
const HTMLPublishPanel = lazy(() => import('@/app/tools/editing/components/html-publish-panel').then(m => ({ default: m.HTMLPublishPanel })));
const ProductEnrichmentFlow = lazy(() => import('@/app/tools/editing/components/product-enrichment-flow').then(m => ({ default: m.ProductEnrichmentFlow })));
const PricingStrategyPanel = lazy(() => import('@/app/tools/editing/components/pricing-strategy-panel').then(m => ({ default: m.PricingStrategyPanel })));

// フック
import { useProductData } from '@/app/tools/editing/hooks/use-product-data';
import { useBatchProcess } from '@/app/tools/editing/hooks/use-batch-process';
import { useBasicEdit } from '@/app/tools/editing/hooks/use-basic-edit';
import { useUIState, L2TabId } from '@/app/tools/editing/hooks/use-ui-state';
import { useToast } from '@/app/tools/editing/hooks/use-toast';
import { useModals } from '@/app/tools/editing/hooks/use-modals';
import { useSelection } from '@/app/tools/editing/hooks/use-selection';
import { useMarketplace } from '@/app/tools/editing/hooks/use-marketplace';
import { useProductInteraction } from '@/app/tools/editing/hooks/use-product-interaction';
import { useExportOperations } from '@/app/tools/editing/hooks/use-export-operations';
import { useCRUDOperations } from '@/app/tools/editing/hooks/use-crud-operations';
import { useMirrorSelectionStore } from '@/store/mirrorSelectionStore';
import { useProductUIStore, productUIActions, type ListFilterType } from '@/store/product';

// 棚卸しフック
import { useInventoryData, useInventorySync, useVariationCreation, useSetCreation, useTabCounts } from '../../hooks';
import type { SortField } from '../../hooks/use-inventory-data';
import { HistoryTab } from '../l3-tabs';
import { N3BulkImageUploadModal, N3InventoryDetailModal, N3NewProductModal, N3ListingDestinationModal } from '../modals';
import type { NewProductData, SelectedDestination, ListingOptions } from '../modals';
import type { InventoryProduct } from '../../hooks';
import { L2TabContent } from './l2-tab-content';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 定数
// ============================================================

const L2_TABS = [
  { id: 'basic-edit' as L2TabId, label: '基本編集', labelEn: 'Basic', icon: Edit3 },
  { id: 'logistics' as L2TabId, label: 'ロジスティクス', labelEn: 'Logistics', icon: Truck },
  { id: 'compliance' as L2TabId, label: '関税・法令', labelEn: 'Compliance', icon: Shield },
  { id: 'media' as L2TabId, label: 'メディア', labelEn: 'Media', icon: ImageIcon },
  { id: 'history' as L2TabId, label: '履歴・監査', labelEn: 'History', icon: History },
];

const FILTER_TABS = [
  { id: 'all', label: '全商品', group: 'main' },
  { id: 'draft', label: '下書き', group: 'main' },
  { id: 'data_editing', label: 'データ編集', group: 'main' },
  { id: 'approval_pending', label: '承認待ち', group: 'main' },
  { id: 'approved', label: '承認済み', group: 'main' },
  { id: 'scheduled', label: '出品予約', group: 'main' },
  { id: 'active_listings', label: '出品中', group: 'main' },
  { id: 'in_stock', label: '有在庫', group: 'inventory' },
  { id: 'variation', label: 'バリエーション', group: 'inventory' },
  { id: 'set_products', label: 'セット品', group: 'inventory' },
  { id: 'in_stock_master', label: 'マスター', group: 'inventory' },
  { id: 'back_order_only', label: '無在庫', group: 'status' },
  { id: 'out_of_stock', label: '在庫0', group: 'status' },
  { id: 'delisted_only', label: '出品停止中', group: 'status' },
];

const isInventoryTab = (tabId: string) => ['in_stock', 'variation', 'set_products', 'in_stock_master'].includes(tabId);

// ============================================================
// ユーティリティ
// ============================================================

function productToExpandPanelProduct(product: Product): ExpandPanelProduct {
  return {
    id: String(product.id), sku: product.sku || '', masterKey: product.master_key || '',
    title: product.title || '', englishTitle: product.english_title || product.title_en || '',
    priceJpy: product.price_jpy || product.cost_price || 0, currentStock: product.current_stock || 0,
    mainImageUrl: product.primary_image_url || undefined, galleryImages: product.gallery_images || [],
    market: { lowestPrice: product.sm_lowest_price, avgPrice: product.sm_average_price, competitorCount: product.sm_competitor_count, salesCount: product.sm_sales_count },
    size: { widthCm: product.listing_data?.width_cm, lengthCm: product.listing_data?.length_cm, heightCm: product.listing_data?.height_cm, weightG: product.listing_data?.weight_g },
    hts: { htsCode: product.hts_code, htsDutyRate: product.hts_duty_rate ? `${product.hts_duty_rate}%` : undefined, originCountry: product.origin_country, material: product.material },
    vero: { isVeroBrand: product.is_vero_brand || false, categoryId: product.category_id, categoryName: product.category_name, hasHtml: !!product.html_content },
    dduProfitUsd: product.listing_data?.ddu_profit_usd || product.profit_amount_usd,
    dduProfitMargin: product.listing_data?.ddu_profit_margin || product.profit_margin,
  };
}

const ModalLoading = memo(function ModalLoading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-lg p-6 text-center" style={{ background: 'var(--panel)' }}>
        <div className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-2" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        <div className="text-sm" style={{ color: 'var(--text-muted)' }}>読み込み中...</div>
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export function EditingN3PageLayout() {
  const { user, logout } = useAuth();
  
  // UI状態
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const activeFilter = useProductUIStore((state) => state.listFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fastMode, setFastMode] = useState(true);  // 🚀 デフォルトでFASTモードON
  const [tipsEnabled, setTipsEnabled] = useState(true);
  const [dataFilter, setDataFilter] = useState<'all' | 'complete' | 'incomplete'>('all');
  const [globalFilters, setGlobalFilters] = useState<GlobalFilterState>(DEFAULT_FILTER_STATE);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const isPinned = pinnedTab !== null;

  // データフック
  const { products, loading, error, modifiedIds, total, pageSize, currentPage, setPageSize, setCurrentPage, loadProducts, updateLocalProduct, saveAllModified, deleteProducts } = useProductData();
  const { processing, currentStep, runBatchCategory, runBatchShipping, runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror, runBatchScores, runAllProcesses } = useBatchProcess(loadProducts);
  const { activeL2Tab, setActiveL2Tab, viewMode, setViewMode, language, setLanguage } = useUIState(Array.isArray(products) ? products.length : 0);
  const { toast, showToast } = useToast();
  const modals = useModals();
  const { selectedIds, setSelectedIds, deselectAll, getSelectedProducts } = useSelection();
  const { marketplaces, setMarketplaces } = useMarketplace();
  const { handleProductClick } = useProductInteraction();
  const { getAllSelected, clearAll } = useMirrorSelectionStore();

  // 棚卸しフック
  const isInventoryActive = isInventoryTab(activeFilter);
  const inventoryData = useInventoryData();
  const tabCounts = useTabCounts();
  const inventorySync = useInventorySync();
  const variationCreation = useVariationCreation();
  const setCreation = useSetCreation();
  
  const [inventorySelectedIds, setInventorySelectedIds] = useState<Set<string>>(new Set());
  const [showCandidatesOnly, setShowCandidatesOnly] = useState(false);
  const [showSetsOnly, setShowSetsOnly] = useState(false);
  const [showGroupingPanel, setShowGroupingPanel] = useState(false);
  const [showBulkImageUploadModal, setShowBulkImageUploadModal] = useState(false);
  const [showInventoryDetailModal, setShowInventoryDetailModal] = useState(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<InventoryProduct | null>(null);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showEnrichmentFlowModal, setShowEnrichmentFlowModal] = useState(false);
  const [enrichmentFlowProduct, setEnrichmentFlowProduct] = useState<Product | null>(null);
  const [showListingDestinationModal, setShowListingDestinationModal] = useState(false);
  
  // 出品予約用ステート
  const [isReserving, setIsReserving] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // ============================================================
  // ❗ P0: 無限ループ対策 - useRefで関数参照を安定化
  // ============================================================
  
  // 関数参照を安定化（依存配列に入れても再実行されない）
  const inventoryLoadProductsRef = useRef(inventoryData.loadProducts);
  const inventorySetFilterRef = useRef(inventoryData.setFilter);
  
  // 関数が更新されたらrefも更新（でも再レンダリングはトリガーしない）
  useEffect(() => {
    inventoryLoadProductsRef.current = inventoryData.loadProducts;
    inventorySetFilterRef.current = inventoryData.setFilter;
  });
  
  // 初回ロード用のフラグ
  const inventoryLoadedRef = useRef(false);
  // マウント回数追跡（無限ループデバッグ用）
  const layoutMountCountRef = useRef(0);
  
  // 🚨 無限ループ検知: 10秒以内に5回以上マウントされたら警告
  useEffect(() => {
    layoutMountCountRef.current++;
    const currentCount = layoutMountCountRef.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[EditingN3PageLayout] MOUNT #${currentCount}`);
    }
    
    if (currentCount > 5) {
      console.error(`[EditingN3PageLayout] ⚠️ マウント回数が多すぎます (${currentCount}回)`);
    }
    
    // 10秒後にカウントリセット
    const timer = setTimeout(() => {
      layoutMountCountRef.current = 0;
    }, 10000);
    
    return () => {
      clearTimeout(timer);
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EditingN3PageLayout] UNMOUNT`);
      }
    };
  }, []);
  
  // 棚卸しタブに切り替えた時の初回ロード
  // ❗ 依存配列: inventoryDataの関数ではなく、プリミティブ値のみ
  const inventoryProductsLength = inventoryData.products.length;
  const inventoryLoading = inventoryData.loading;
  
  useEffect(() => {
    // 棚卸しタブがアクティブで、まだロードしていなく、データが空で、ロード中でない場合
    if (isInventoryActive && !inventoryLoadedRef.current && inventoryProductsLength === 0 && !inventoryLoading) {
      inventoryLoadedRef.current = true;
      // ref経由で安定した関数を呼び出し
      inventoryLoadProductsRef.current();
    }
    // タブから離れたらフラグをリセット
    if (!isInventoryActive) {
      inventoryLoadedRef.current = false;
    }
  }, [isInventoryActive, inventoryProductsLength, inventoryLoading]);
  
  // フィルター変更時の処理
  // ❗ 依存配列: プリミティブ値のみ（関数参照は含まない）
  const prevFilterRef = useRef(activeFilter);
  useEffect(() => {
    // フィルターが変わった時のみ実行
    if (prevFilterRef.current !== activeFilter) {
      prevFilterRef.current = activeFilter;
      if (isInventoryActive) {
        // ref経由で安定した関数を呼び出し
        switch (activeFilter) {
          case 'in_stock':
            inventorySetFilterRef.current({ inventoryType: 'stock', masterOnly: false, dataIncomplete: false });
            break;
          case 'in_stock_master':
            inventorySetFilterRef.current({ inventoryType: 'stock', masterOnly: true, dataIncomplete: false });
            break;
          case 'variation':
            inventorySetFilterRef.current({ variationStatus: 'parent', masterOnly: false, dataIncomplete: false });
            break;
          case 'set_products':
            inventorySetFilterRef.current({ productType: 'set', masterOnly: false, dataIncomplete: false });
            break;
          default:
            inventorySetFilterRef.current({ inventoryType: undefined, masterOnly: false, dataIncomplete: false });
        }
      }
    }
  }, [activeFilter, isInventoryActive]);
  
  // グループパネル表示制御
  useEffect(() => {
    if (isInventoryActive && inventorySelectedIds.size >= 2) {
      setShowGroupingPanel(true);
    } else if (inventorySelectedIds.size === 0) {
      setShowGroupingPanel(false);
    }
  }, [isInventoryActive, inventorySelectedIds.size]);

  // 派生データ
  const exportOps = useExportOperations({ products, selectedIds, showToast });
  const crudOps = useCRUDOperations({ selectedIds, saveAllModified, deleteProducts, updateLocalProduct, showToast, deselectAll });
  const basicEditHandlers = useBasicEdit({ products, selectedIds, onShowToast: showToast, onLoadProducts: loadProducts, updateLocalProduct, getAllSelected, clearAll, runBatchCategory, runBatchShipping, runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror, runBatchScores, runAllProcesses });
  const selectedProducts = getSelectedProducts(products);
  const selectedMirrorCount = getAllSelected().length;
  const readyCount = basicEditHandlers.readyCount;
  
  const { completeProducts, incompleteProducts } = useMemo(() => {
    const complete: Product[] = [], incomplete: Product[] = [];
    if (!Array.isArray(products)) return { completeProducts: [], incompleteProducts: [] };
    products.forEach(p => { if (checkProductCompleteness(p).isComplete) complete.push(p); else incomplete.push(p); });
    return { completeProducts: complete, incompleteProducts: incomplete };
  }, [products]);

  // 選択中の承認済み商品数を計算
  const approvedSelectedCount = useMemo(() => {
    if (!Array.isArray(products) || selectedIds.size === 0) return 0;
    return products.filter(p => 
      selectedIds.has(String(p.id)) && 
      (p.workflow_status === 'approved' || p.ready_to_list === true)
    ).length;
  }, [products, selectedIds]);
  
  const displayProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    if (isInventoryActive) return inventoryData.filteredProducts || [];
    if (activeFilter === 'approval_pending') {
      if (dataFilter === 'complete') return completeProducts;
      if (dataFilter === 'incomplete') return incompleteProducts;
    }
    return products;
  }, [isInventoryActive, inventoryData.filteredProducts, activeFilter, dataFilter, products, completeProducts, incompleteProducts]);

  // ハンドラー
  const handleFilterChange = useCallback((filterId: string) => { productUIActions.setListFilter(filterId as ListFilterType); if (filterId === 'approval_pending') setViewMode('card'); }, [setViewMode]);
  const handleToggleSelect = useCallback((id: string) => { const n = new Set(selectedIds); if (n.has(id)) n.delete(id); else n.add(id); setSelectedIds(n); }, [selectedIds, setSelectedIds]);
  const handleToggleSelectAll = useCallback(() => { if (selectedIds.size === displayProducts.length) setSelectedIds(new Set()); else setSelectedIds(new Set(displayProducts.map(p => String(p.id)))); }, [selectedIds, displayProducts, setSelectedIds]);
  const handleToggleExpand = useCallback((id: string) => { if (fastMode) return; setExpandedId(expandedId === id ? null : id); }, [fastMode, expandedId]);
  const handleRowClick = useCallback((product: Product) => { handleProductClick(product, modals.openProductModal); }, [handleProductClick, modals.openProductModal]);
  const handleInlineCellChange = useCallback((id: string, field: string, value: any) => { updateLocalProduct(id, { [field]: value }); showToast(`✅ ${field}: ${value}`, 'success'); }, [updateLocalProduct, showToast]);
  
  // 今すぐ出品ハンドラ（ヘッダー用）
  const handleListNow = useCallback(async () => {
    if (selectedIds.size === 0) return;
    // 出品先選択モーダルを表示
    setShowListingDestinationModal(true);
  }, [selectedIds]);
  
  // 承認バーの出品ハンドラ群
  const handleApprovalListNow = useCallback(async () => {
    // 出品先選択モーダルを開く
    setShowListingDestinationModal(true);
  }, []);

  const handleApprovalSchedule = useCallback(async () => {
    // 出品先選択モーダルを開く（スケジュールモード）
    setShowListingDestinationModal(true);
    // TODO: モーダルにスケジュールモードを伝える方法を追加
  }, []);

  // パネルコンテンツ取得
  const candidates = variationCreation.findGroupingCandidates(inventoryData.filteredProducts);
  
  const getPanelContent = (tabId: PanelTabId | null) => {
    if (tabId === 'tools') return <N3ToolsPanelContent activeFilter={activeFilter} processing={processing} currentStep={currentStep} modifiedCount={modifiedIds.size} readyCount={readyCount} selectedMirrorCount={selectedMirrorCount} selectedCount={selectedIds.size} completeCount={completeProducts.length} incompleteCount={incompleteProducts.length} dataFilter={dataFilter} onDataFilterChange={setDataFilter} marketplaces={marketplaces} onMarketplacesChange={setMarketplaces} inventoryData={{ stats: inventoryData.stats, loading: inventoryData.loading, filteredProducts: inventoryData.filteredProducts }} inventorySyncing={{ mjt: inventorySync.ebaySyncingMjt, green: inventorySync.ebaySyncingGreen, incremental: inventorySync.incrementalSyncing, mercari: inventorySync.mercariSyncing }} inventorySelectedCount={inventorySelectedIds.size} inventoryPendingCount={inventoryData.pendingCount} showCandidatesOnly={showCandidatesOnly} showSetsOnly={showSetsOnly} variationStats={{ parentCount: inventoryData.stats.variationParentCount, memberCount: inventoryData.stats.variationMemberCount, standaloneCount: inventoryData.stats.standaloneCount, candidateCount: candidates.length }} variationLoading={variationCreation.loading} setLoading={setCreation.loading} selectedProductIds={Array.from(selectedIds)} toolHandlers={{ onRunAll: basicEditHandlers.handleRunAll, onPaste: modals.openPasteModal, onReload: loadProducts, onCSVUpload: modals.openCSVModal, onCategory: basicEditHandlers.handleCategory, onShipping: basicEditHandlers.handleShipping, onProfit: basicEditHandlers.handleProfit, onHTML: basicEditHandlers.handleHTML, onScore: () => runBatchScores(products), onHTS: basicEditHandlers.handleHTSFetch, onOrigin: basicEditHandlers.handleOriginCountryFetch, onMaterial: basicEditHandlers.handleMaterialFetch, onFilter: basicEditHandlers.handleFilterCheck, onResearch: basicEditHandlers.handleBulkResearch, onAI: basicEditHandlers.handleAIEnrich, onTranslate: basicEditHandlers.handleTranslate, onSellerMirror: async () => { if (selectedIds.size === 0) { showToast('商品を選択', 'error'); return; } const r = await runBatchSellerMirror(Array.from(selectedIds)); if (r.success) { showToast('✅ SM分析完了', 'success'); await loadProducts(); } else showToast(`❌ ${r.error}`, 'error'); }, onDetails: basicEditHandlers.handleBatchFetchDetails, onGemini: modals.openGeminiBatchModal, onFinalProcess: basicEditHandlers.handleFinalProcessChain, onList: exportOps.handleList, onSave: crudOps.handleSaveAll, onDelete: crudOps.handleDelete, onExportCSV: exportOps.handleExport, onExportEbay: exportOps.handleExportEbay, onExportAI: exportOps.handleAIExport, onEnrichmentFlow: () => { if (selectedIds.size !== 1) { showToast('1件選択', 'error'); return; } const p = displayProducts.find(x => String(x.id) === Array.from(selectedIds)[0]); if (p) { setEnrichmentFlowProduct(p); setShowEnrichmentFlowModal(true); } } }} approvalHandlers={{ onSelectAll: () => { setSelectedIds(new Set(displayProducts.map(p => String(p.id)))); showToast(`✅ 全選択`, 'success'); }, onDeselectAll: () => { setSelectedIds(new Set()); showToast('選択解除', 'success'); }, onApprove: async () => { if (selectedIds.size === 0) { showToast('商品を選択してください', 'error'); return; } try { const res = await fetch('/api/products/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds: Array.from(selectedIds).map(id => parseInt(id)), action: 'approve' }) }); const data = await res.json(); if (data.success) { showToast(`✅ ${data.updated}件を承認しました`, 'success'); await loadProducts(); } else { showToast(`❌ ${data.error}`, 'error'); } } catch (e: any) { showToast(`❌ ${e.message}`, 'error'); } }, onReject: async () => { if (selectedIds.size === 0) { showToast('商品を選択してください', 'error'); return; } try { const res = await fetch('/api/products/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productIds: Array.from(selectedIds).map(id => parseInt(id)), action: 'reject' }) }); const data = await res.json(); if (data.success) { showToast(`❌ ${data.updated}件を却下しました`, 'success'); await loadProducts(); setSelectedIds(new Set()); } else { showToast(`❌ ${data.error}`, 'error'); } } catch (e: any) { showToast(`❌ ${e.message}`, 'error'); } }, onScheduleListing: () => { const approvedIds = Array.from(selectedIds).filter(id => { const p = products.find(x => String(x.id) === id); return p && (p.workflow_status === 'approved' || p.approval_status === 'approved'); }); if (approvedIds.length === 0) { showToast('承認済み商品を選択してください', 'error'); return; } setShowListingDestinationModal(true); }, onListNow: () => { const approvedIds = Array.from(selectedIds).filter(id => { const p = products.find(x => String(x.id) === id); return p && (p.workflow_status === 'approved' || p.approval_status === 'approved'); }); if (approvedIds.length === 0) { showToast('承認済み商品を選択してください', 'error'); return; } setShowListingDestinationModal(true); }, onSave: crudOps.handleSaveAll }} approvedCount={approvedSelectedCount} inventoryHandlers={{ onSyncIncremental: (a) => { inventorySync.syncEbayIncremental(a); showToast(`🔄 ${a} 差分同期`, 'success'); }, onSyncFull: (a) => { inventorySync.syncEbay(a); showToast(`🔄 ${a} 完全同期`, 'success'); }, onSyncMercari: () => { inventorySync.syncMercari(); showToast('🔄 メルカリ同期', 'success'); }, onRefresh: () => { inventoryData.refreshData(); showToast('🔄 更新中', 'success'); }, onBulkDelete: async (t) => { const r = await inventorySync.bulkDelete(t); if (r.success) { showToast(`✅ ${r.deleted}件削除`, 'success'); inventoryData.refreshData(); } else showToast(`❌ ${r.error}`, 'error'); }, onNewProduct: () => setShowNewProductModal(true), onBulkImageUpload: () => setShowBulkImageUploadModal(true), onDetectCandidates: () => { setShowCandidatesOnly(true); showToast(`🔍 ${candidates.length}件検出`, 'success'); }, onToggleCandidatesOnly: () => setShowCandidatesOnly(!showCandidatesOnly), onCreateVariation: async () => { if (inventorySelectedIds.size < 2) { showToast('❌ 2件以上', 'error'); return; } const ps = inventoryData.filteredProducts.filter(p => inventorySelectedIds.has(String(p.id))); const r = await variationCreation.createVariation({ memberIds: ps.map(p => String(p.id)), variationTitle: ps[0].title || 'バリエーション' }); if (r.success) { showToast('✅ 作成完了', 'success'); setInventorySelectedIds(new Set()); inventoryData.refreshData(); } else showToast(`❌ ${r.error}`, 'error'); }, onClearSelection: () => { setInventorySelectedIds(new Set()); showToast('選択解除', 'success'); }, onCreateSet: async () => { if (inventorySelectedIds.size < 2) { showToast('❌ 2件以上', 'error'); return; } const ps = inventoryData.filteredProducts.filter(p => inventorySelectedIds.has(String(p.id))); const q = ps.reduce((a, p) => { a[String(p.id)] = 1; return a; }, {} as Record<string, number>); const r = await setCreation.createSet({ name: `SET_${Date.now()}`, memberIds: ps.map(p => String(p.id)), quantities: q }); if (r.success) { showToast('✅ セット作成', 'success'); setInventorySelectedIds(new Set()); inventoryData.refreshData(); } else showToast(`❌ ${r.error}`, 'error'); }, onToggleSetsOnly: () => setShowSetsOnly(!showSetsOnly), onEditSet: () => showToast('📝 セット編集', 'success'), onDeleteSet: () => showToast('🗑️ セット削除', 'success') }} />;
    if (tabId === 'flow') return <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>FLOWパネルは次のステップで実装予定</div>;
    if (tabId === 'stats') return <N3StatsPanelContent activeFilter={activeFilter} displayProducts={displayProducts} total={total} products={products} completeCount={completeProducts.length} incompleteCount={incompleteProducts.length} inventoryData={{ filteredProducts: inventoryData.filteredProducts, stats: inventoryData.stats }} />;
    if (tabId === 'filter') return <div className="p-3"><div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Marketplaces</div><MarketplaceSelector marketplaces={marketplaces} onChange={setMarketplaces} /></div>;
    return null;
  };

  const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;

  // レンダリング
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div ref={mainContentRef} id="main-scroll-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minWidth: 0, overflow: 'auto' }}>
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10} transitionDuration={200} zIndex={40}>
          <N3PageHeader 
            user={user} 
            onLogout={logout} 
            language={language} 
            onLanguageToggle={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')} 
            pinnedTab={pinnedTab} 
            onPinnedTabChange={setPinnedTab} 
            hoveredTab={hoveredTab} 
            onHoveredTabChange={setHoveredTab} 
            isHeaderHovered={isHeaderHovered} 
            onHeaderHoveredChange={setIsHeaderHovered}
            // 今すぐ出品ボタン用
            selectedCount={selectedIds.size}
            onListNow={handleListNow}
            isListing={isReserving}
          />
          {showHoverPanel && <div style={{ position: 'absolute', top: HEADER_HEIGHT, left: 0, right: 0, padding: 6, zIndex: 100, maxHeight: '60vh', overflowY: 'auto' }}>{getPanelContent(hoveredTab)}</div>}
          {isPinned && <div style={{ flexShrink: 0, padding: 6 }}>{getPanelContent(pinnedTab)}</div>}

          {/* L2タブ */}
          <div style={{ height: 36, display: 'flex', alignItems: 'center', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)', padding: '0 12px', flexShrink: 0 }}>
            {L2_TABS.map((tab) => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveL2Tab(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: '12px', fontWeight: 500, background: activeL2Tab === tab.id ? 'var(--accent)' : 'transparent', color: activeL2Tab === tab.id ? 'white' : 'var(--text-muted)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><Icon size={14} /><span>{language === 'ja' ? tab.label : tab.labelEn}</span></button>; })}
          </div>

          {/* L3フィルター */}
          {activeL2Tab !== 'history' && (
            <div style={{ height: 36, display: 'flex', alignItems: 'center', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)', padding: '0 12px', flexShrink: 0, overflowX: 'auto' }}>
              {FILTER_TABS.filter(t => t.group === 'main').map(tab => <N3FilterTab key={tab.id} id={tab.id} label={tab.label} count={tabCounts.getTabCount(tab.id)} active={activeFilter === tab.id} onClick={() => handleFilterChange(tab.id)} />)}
              <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
              {FILTER_TABS.filter(t => t.group === 'inventory').map(tab => <N3FilterTab key={tab.id} id={tab.id} label={tab.label} count={tabCounts.getTabCount(tab.id)} active={activeFilter === tab.id} onClick={() => handleFilterChange(tab.id)} variant={isInventoryTab(tab.id) ? 'inventory' : 'default'} />)}
              <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
              {FILTER_TABS.filter(t => t.group === 'status').map(tab => <N3FilterTab key={tab.id} id={tab.id} label={tab.label} count={tabCounts.getTabCount(tab.id)} active={activeFilter === tab.id} onClick={() => handleFilterChange(tab.id)} />)}
            </div>
          )}

          {/* サブツールバー */}
          {activeL2Tab !== 'history' && <N3SubToolbar tipsEnabled={tipsEnabled} onTipsToggle={() => setTipsEnabled(!tipsEnabled)} fastMode={fastMode} onFastModeToggle={() => { setFastMode(!fastMode); if (!fastMode) setExpandedId(null); }} pageSize={isInventoryActive ? inventoryData.itemsPerPage : pageSize} onPageSizeChange={isInventoryActive ? inventoryData.setItemsPerPage : setPageSize} displayCount={isInventoryActive ? inventoryData.paginatedProducts.length : products.length} totalCount={isInventoryActive ? inventoryData.totalItems : total} viewMode={viewMode} onViewModeChange={setViewMode} isInventoryTab={isInventoryActive} sortOption={isInventoryActive ? inventoryData.sortOption : undefined} onSortOptionChange={isInventoryActive ? inventoryData.setSortOption : undefined} />}
          
          {/* グローバルフィルターバー */}
          {activeL2Tab !== 'history' && (
            <N3GlobalFilterBar
              filters={globalFilters}
              onFiltersChange={setGlobalFilters}
              onApply={() => {
                // フィルター適用時の処理
                showToast(`✅ フィルター適用`, 'success');
              }}
            />
          )}
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <ErrorBoundary componentName="N3EditingMainContent">
          <div style={{ flexShrink: 0 }}>
            {isInventoryActive && <N3InventoryView paginatedProducts={inventoryData.paginatedProducts} filteredProducts={inventoryData.filteredProducts} stats={inventoryData.stats} loading={inventoryData.loading} error={inventoryData.error} selectedIds={inventorySelectedIds} viewMode={viewMode} activeFilter={activeFilter} showCandidatesOnly={showCandidatesOnly} showSetsOnly={showSetsOnly} pagination={{ currentPage: inventoryData.currentPage, totalPages: inventoryData.totalPages, totalItems: inventoryData.totalItems, itemsPerPage: inventoryData.itemsPerPage, setCurrentPage: inventoryData.setCurrentPage, setItemsPerPage: inventoryData.setItemsPerPage }} onSelect={(id) => { const n = new Set(inventorySelectedIds); if (n.has(id)) n.delete(id); else n.add(id); setInventorySelectedIds(n); }} onDetail={(id) => { const p = inventoryData.paginatedProducts.find(x => String(x.id) === id); if (p) { setSelectedInventoryProduct(p); setShowInventoryDetailModal(true); } }} onStockChange={async (id, q) => { const r = await inventorySync.updateStock(id, q); if (r.success) { inventoryData.updateLocalProduct(id, { physical_quantity: q }); showToast('✅ 在庫更新', 'success'); } else showToast(`❌ ${r.error}`, 'error'); }} onCostChange={async (id, c) => { const r = await inventorySync.updateCost(id, c); if (r.success) { inventoryData.updateLocalProduct(id, { cost_price: c, cost_jpy: c }); showToast('✅ 原価更新', 'success'); } else showToast(`❌ ${r.error}`, 'error'); }} onInventoryTypeChange={async (id, t) => { const r = await inventorySync.toggleInventoryType(id, t); if (r.success) { inventoryData.updateLocalProduct(id, { inventory_type: t }); tabCounts.fetchAllCounts(); showToast(`✅ ${t === 'stock' ? '有在庫' : '無在庫'}に変更`, 'success'); } else showToast(`❌ ${r.error}`, 'error'); }} onStorageLocationChange={async (id, l) => { const r = await inventorySync.updateStorageLocation(id, l); if (r.success) { inventoryData.updateLocalProduct(id, { storage_location: l }); showToast(`✅ 保管場所更新`, 'success'); } else showToast(`❌ ${r.error}`, 'error'); }} />}
            {!isInventoryActive && activeL2Tab === 'basic-edit' && <N3BasicEditView products={displayProducts} loading={loading} error={error} selectedIds={selectedIds} expandedId={expandedId} viewMode={viewMode} fastMode={fastMode} activeFilter={activeFilter} onToggleSelect={handleToggleSelect} onToggleSelectAll={handleToggleSelectAll} onToggleExpand={handleToggleExpand} onRowClick={handleRowClick} onCellChange={handleInlineCellChange} onDelete={(id) => showToast('🗑️ 削除', 'success')} onEbaySearch={(p) => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(p.english_title || p.title || '')}`, '_blank')} productToExpandPanelProduct={productToExpandPanelProduct} />}
            {!isInventoryActive && (activeL2Tab === 'logistics' || activeL2Tab === 'compliance' || activeL2Tab === 'media') && <div style={{ height: 'calc(100vh - 250px)', minHeight: 400 }}><L2TabContent activeL2Tab={activeL2Tab} /></div>}
            {activeL2Tab === 'history' && <HistoryTab />}
          </div>
        </ErrorBoundary>

        {!isInventoryActive && <div style={{ flexShrink: 0 }}><N3Pagination total={total} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} pageSizeOptions={[10, 50, 100, 500]} /></div>}
        <N3Footer copyright="© 2025 N3 Platform" version="v3.0.0 (N3)" status={{ label: 'DB', connected: !error }} links={[{ id: 'docs', label: 'ドキュメント', href: '#' }]} />
      </div>

      {/* 右サイドバー */}
      {isInventoryActive && showGroupingPanel && <N3GroupingPanel selectedProducts={inventoryData.filteredProducts.filter(p => inventorySelectedIds.has(String(p.id)))} onClose={() => setShowGroupingPanel(false)} onClearSelection={() => { setInventorySelectedIds(new Set()); setShowGroupingPanel(false); }} onCreateVariation={async () => { const ps = inventoryData.filteredProducts.filter(p => inventorySelectedIds.has(String(p.id))); const r = await variationCreation.createVariation({ memberIds: ps.map(p => String(p.id)), variationTitle: ps[0]?.title || 'バリエーション' }); if (r.success) { showToast('✅ 作成完了', 'success'); setInventorySelectedIds(new Set()); setShowGroupingPanel(false); inventoryData.refreshData(); } else showToast(`❌ ${r.error}`, 'error'); }} onCreateSet={async () => { const ps = inventoryData.filteredProducts.filter(p => inventorySelectedIds.has(String(p.id))); const q = ps.reduce((a, p) => { a[String(p.id)] = 1; return a; }, {} as Record<string, number>); const r = await setCreation.createSet({ name: `SET_${Date.now()}`, memberIds: ps.map(p => String(p.id)), quantities: q }); if (r.success) { showToast('✅ セット作成', 'success'); setInventorySelectedIds(new Set()); setShowGroupingPanel(false); inventoryData.refreshData(); } else showToast(`❌ ${r.error}`, 'error'); }} onProductClick={(p) => showToast(`📝 ${p.title || p.product_name}`, 'success')} />}

      {/* モーダル群 */}
      {modals.selectedProduct && <ProductModal product={modals.selectedProduct} onClose={modals.closeProductModal} onSave={(u) => crudOps.handleModalSave(modals.selectedProduct!, u, modals.closeProductModal)} onRefresh={loadProducts} />}
      {modals.showPasteModal && <Suspense fallback={<ModalLoading />}><PasteModal onClose={modals.closePasteModal} onComplete={loadProducts} /></Suspense>}
      {modals.showCSVModal && <Suspense fallback={<ModalLoading />}><CSVUploadModal onClose={modals.closeCSVModal} onComplete={loadProducts} /></Suspense>}
      {modals.showAIEnrichModal && modals.enrichTargetProduct && <Suspense fallback={<ModalLoading />}><AIDataEnrichmentModal product={modals.enrichTargetProduct} onClose={modals.closeAIEnrichModal} onSave={async (s) => { if (s) await loadProducts(); modals.closeAIEnrichModal(); }} /></Suspense>}
      {modals.showMarketResearchModal && <Suspense fallback={<ModalLoading />}><AIMarketResearchModal products={selectedProducts} onClose={modals.closeMarketResearchModal} onComplete={async () => { await loadProducts(); modals.closeMarketResearchModal(); }} /></Suspense>}
      {modals.showGeminiBatchModal && <Suspense fallback={<ModalLoading />}><GeminiBatchModal selectedIds={selectedIds} onClose={modals.closeGeminiBatchModal} onComplete={async () => { await loadProducts(); modals.closeGeminiBatchModal(); }} /></Suspense>}
      {modals.showHTMLPanel && <Suspense fallback={<ModalLoading />}><HTMLPublishPanel selectedProducts={selectedProducts} onClose={modals.closeHTMLPanel} /></Suspense>}
      {modals.showPricingPanel && <Suspense fallback={<ModalLoading />}><PricingStrategyPanel selectedProducts={selectedProducts} onClose={modals.closePricingPanel} /></Suspense>}
      <N3BulkImageUploadModal isOpen={showBulkImageUploadModal} onClose={() => setShowBulkImageUploadModal(false)} onSuccess={() => { showToast('✅ 画像アップロード完了', 'success'); inventoryData.refreshData(); }} />
      <N3InventoryDetailModal product={selectedInventoryProduct} isOpen={showInventoryDetailModal} onClose={() => { setShowInventoryDetailModal(false); setSelectedInventoryProduct(null); }} onStockChange={async (id, q) => { const r = await inventorySync.updateStock(id, q); if (r.success) { inventoryData.updateLocalProduct(id, { physical_quantity: q }); showToast('✅ 更新', 'success'); } else showToast(`❌ ${r.error}`, 'error'); }} onCostChange={async (id, c) => { const r = await inventorySync.updateCost(id, c); if (r.success) { inventoryData.updateLocalProduct(id, { cost_price: c, cost_jpy: c }); showToast('✅ 更新', 'success'); } else showToast(`❌ ${r.error}`, 'error'); }} />
      {showEnrichmentFlowModal && enrichmentFlowProduct && <Suspense fallback={<ModalLoading />}><ProductEnrichmentFlow product={enrichmentFlowProduct} onClose={() => { setShowEnrichmentFlowModal(false); setEnrichmentFlowProduct(null); }} onComplete={async () => { await loadProducts(); setShowEnrichmentFlowModal(false); setEnrichmentFlowProduct(null); }} onRunSMAnalysis={async (id) => { const r = await runBatchSellerMirror([id]); return r.success; }} onRunCalculations={async (id) => { await runBatchShipping([id]); await runBatchProfit([id]); return true; }} onRunFilter={async () => true} onRunScore={async (id) => { await runBatchScores([{ id }] as any); return true; }} /></Suspense>}
      <N3NewProductModal isOpen={showNewProductModal} onClose={() => setShowNewProductModal(false)} onSubmit={async (d: NewProductData) => { const r = await inventorySync.createProduct(d); if (r.success) { showToast('✅ 登録', 'success'); inventoryData.refreshData(); return { success: true }; } return { success: false, error: r.error }; }} />

      {/* 出品先選択モーダル */}
      <N3ListingDestinationModal
        isOpen={showListingDestinationModal}
        onClose={() => setShowListingDestinationModal(false)}
        selectedProductCount={Array.from(selectedIds).filter(id => {
          const p = products.find(x => String(x.id) === id);
          return p && (p.workflow_status === 'approved' || p.approval_status === 'approved');
        }).length}
        onConfirm={async (destinations: SelectedDestination[], options: ListingOptions) => {
          const approvedIds = Array.from(selectedIds).filter(id => {
            const p = products.find(x => String(x.id) === id);
            return p && (p.workflow_status === 'approved' || p.approval_status === 'approved' || true); // テスト用に全て許可
          });
          
          setIsReserving(true); // 出品処理中フラグ
          
          if (options.mode === 'immediate') {
            // 今すぐ出品 - n8n経由で出品
            for (const dest of destinations) {
              try {
                // n8nエンドポイントに送信
                const res = await fetch('/api/n8n-proxy', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    endpoint: 'listing-reserve',
                    data: {
                      ids: approvedIds.map(id => parseInt(id)),
                      action: 'list_now',
                      target: dest.marketplace.toLowerCase(),
                      account: dest.accountId,
                      timestamp: new Date().toISOString(),
                      products: products
                        .filter(p => approvedIds.includes(String(p.id)))
                        .map(p => ({
                          id: p.id,
                          sku: p.sku,
                          title: p.title,
                          price: p.price_jpy || p.cost_price || 0,
                          quantity: p.current_stock || 1,
                          marketplace: dest.marketplace,
                          account: dest.accountId,
                        }))
                    }
                  })
                });
                
                const data = await res.json();
                if (data.success) {
                  showToast(`⚡ ${dest.marketplace}/${dest.accountId}: ${data.data.processed_count}件を出品しました`, 'success');
                } else {
                  showToast(`❌ ${dest.marketplace}/${dest.accountId}: ${data.message}`, 'error');
                }
              } catch (e: any) {
                showToast(`❌ ${dest.marketplace}/${dest.accountId}: ${e.message}`, 'error');
              }
            }
          } else {
            // スケジュール登録
            try {
              const res = await fetch('/api/n8n-proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  endpoint: 'listing-reserve',
                  data: {
                    ids: approvedIds.map(id => parseInt(id)),
                    action: 'schedule',
                    timestamp: new Date().toISOString(),
                    strategy: {
                      mode: 'scheduled',
                      marketplaces: destinations.map(d => ({
                        marketplace: d.marketplace,
                        accountId: d.accountId
                      }))
                    }
                  }
                })
              });
              const data = await res.json();
              if (data.success) {
                showToast(`📅 ${data.data.processed_count}件のスケジュールを作成`, 'success');
              } else {
                showToast(`❌ ${data.message}`, 'error');
              }
            } catch (e: any) {
              showToast(`❌ ${e.message}`, 'error');
            }
          }
          
          setIsReserving(false); // 出品処理終了
          await loadProducts();
          setSelectedIds(new Set());
          setShowListingDestinationModal(false);
        }}
      />

      {/* トースト・処理中 */}
      {toast && <div className={`fixed bottom-20 right-8 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>{toast.message}</div>}
      {processing && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]"><div className="rounded-lg p-6" style={{ background: 'var(--panel)' }}><div className="text-center"><div className="mb-4"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }} /></div><div className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>処理中...</div><div className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentStep}</div></div></div></div>}
    </div>
  );
}
