// app/tools/editing-n3/components/layouts/editing-n3-page-layout.tsx
/**
 * Editing N3 Page Layout - N3デザインシステム版レイアウト
 * 
 * 設計原則:
 * 1. Hooks層は tools/editing から完全に参照（変更禁止）
 * 2. データフローシグネチャ (id, field, value) => void を維持
 * 3. UI層のみN3コンポーネントで再構築
 * 
 * 使用するN3コンポーネント:
 * - N3SidebarMini: サイドナビゲーション
 * - N3HeaderTab, N3PinButton: ヘッダータブ
 * - N3ToolPanel: ツールパネル
 * - N3ExpandPanel: 商品展開パネル
 * - N3EditableCell: インライン編集
 * - N3ViewModeToggle: 表示モード切替
 * - N3Pagination: ページネーション
 */

'use client';

import React, { useState, useEffect, useRef, useCallback, memo, Suspense, lazy, useMemo } from 'react';
import {
  Edit3, Truck, Shield, Image as ImageIcon, History,
  Wrench, GitBranch, Filter,
  User, LogOut, Settings, HelpCircle,
  Home, Package, FileText, Database, BarChart3,
  Zap, Lightbulb,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Error Boundary
import { ErrorBoundary } from '@/components/error';

// N3コンポーネント
import {
  N3HeaderTab,
  N3PinButton,
  N3LanguageSwitch,
  N3WorldClock,
  N3CurrencyDisplay,
  N3NotificationBell,
  N3UserAvatar,
  N3Divider,
  N3HeaderSearchInput,
  N3Button,
  N3SidebarMini,
  N3ToolPanel,
  N3FilterTab,
  N3ViewModeToggle,
  N3Checkbox,
  N3EditableCell,
  N3ExpandPanel,
  N3Pagination,
  N3Footer,
  N3Tooltip,
  N3StatsBar,
  N3CollapsibleHeader,
} from '@/components/n3';
import { N3Card } from '@/components/n3/N3Card';
import { N3CardGrid } from '@/components/n3/N3CardGrid';
import { N3ApprovalActionBar } from '@/components/n3/N3ApprovalActionBar';
import { N3InventoryCardGrid } from '@/components/n3/N3InventoryCardGrid';
import { N3InventoryTable } from '@/components/n3/N3InventoryTable';
import type { ExpandPanelProduct, SidebarMiniItem } from '@/components/n3';

// 完全性チェック
import { filterApprovalReady, checkProductCompleteness } from '@/lib/product';

// 既存コンポーネントをそのまま使用（モーダル群）
import { ProductModal } from '@/app/tools/editing/components/ProductModal';
import { MarketplaceSelector } from '@/app/tools/editing/components/MarketplaceSelector';

// 重いモーダル（遅延読み込み）
const PasteModal = lazy(() => import('@/app/tools/editing/components/PasteModal').then(m => ({ default: m.PasteModal })));
const CSVUploadModal = lazy(() => import('@/app/tools/editing/components/CSVUploadModal').then(m => ({ default: m.CSVUploadModal })));
const AIDataEnrichmentModal = lazy(() => import('@/app/tools/editing/components/AIDataEnrichmentModal').then(m => ({ default: m.AIDataEnrichmentModal })));
const AIMarketResearchModal = lazy(() => import('@/app/tools/editing/components/AIMarketResearchModal').then(m => ({ default: m.AIMarketResearchModal })));
const GeminiBatchModal = lazy(() => import('@/app/tools/editing/components/GeminiBatchModal').then(m => ({ default: m.GeminiBatchModal })));
const HTMLPublishPanel = lazy(() => import('@/app/tools/editing/components/HTMLPublishPanel').then(m => ({ default: m.HTMLPublishPanel })));
const ProductEnrichmentFlow = lazy(() => import('@/app/tools/editing/components/ProductEnrichmentFlow').then(m => ({ default: m.ProductEnrichmentFlow })));
const PricingStrategyPanel = lazy(() => import('@/app/tools/editing/components/PricingStrategyPanel').then(m => ({ default: m.PricingStrategyPanel })));

// フック（tools/editing から参照 - 変更禁止）
import { useProductData } from '@/app/tools/editing/hooks/useProductData';
import { useBatchProcess } from '@/app/tools/editing/hooks/useBatchProcess';
import { useBasicEdit } from '@/app/tools/editing/hooks/useBasicEdit';
import { useUIState, L2TabId } from '@/app/tools/editing/hooks/useUIState';
import { useToast } from '@/app/tools/editing/hooks/useToast';
import { useModals } from '@/app/tools/editing/hooks/useModals';
import { useSelection } from '@/app/tools/editing/hooks/useSelection';
import { useMarketplace } from '@/app/tools/editing/hooks/useMarketplace';
import { useProductInteraction } from '@/app/tools/editing/hooks/useProductInteraction';
import { useExportOperations } from '@/app/tools/editing/hooks/useExportOperations';
import { useCRUDOperations } from '@/app/tools/editing/hooks/useCRUDOperations';
import { useMirrorSelectionStore } from '@/store/mirrorSelectionStore';
import { useProductUIStore, productUIActions, type ListFilterType } from '@/store/product';

// 棚卸しフック（新規追加）
import { useInventoryData, useInventorySync, useVariationCreation, useSetCreation, useTabCounts } from '../../hooks';
import type { SortField, SortOrder, SortOption } from '../../hooks/use-inventory-data';

// 棚卸しタブ用ToolPanel
import { InventoryToolPanel, VariationToolPanel, SetProductToolPanel } from '../L3Tabs';

// N3モーダル
import { N3BulkImageUploadModal, N3InventoryDetailModal, N3NewProductModal } from '../modals';
import type { NewProductData } from '../modals';
import type { InventoryProduct } from '../../hooks';

// 右サイドバー
import { N3GroupingPanel } from '../panels/n3-grouping-panel';

// 商品行コンポーネント（フック安定化のため分離）
import { ProductRow } from '../product-row';

// 型定義（tools/editing から参照 - 変更禁止）
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 定数
// ============================================================

// サイドバーアイテム
const SIDEBAR_ITEMS: SidebarMiniItem[] = [
  { id: 'home', icon: <Home size={18} />, label: 'ホーム' },
  { id: 'products', icon: <Package size={18} />, label: '商品管理', badge: 5 },
  { id: 'orders', icon: <FileText size={18} />, label: '注文管理' },
  { id: 'inventory', icon: <Database size={18} />, label: '在庫' },
  { id: 'analytics', icon: <BarChart3 size={18} />, label: '分析' },
  { id: 'settings', icon: <Settings size={18} />, label: '設定' },
  { id: 'help', icon: <HelpCircle size={18} />, label: 'ヘルプ' },
];

// L2タブの定義
const L2_TABS = [
  { id: 'basic-edit' as L2TabId, label: '基本編集', labelEn: 'Basic', icon: Edit3 },
  { id: 'logistics' as L2TabId, label: 'ロジスティクス', labelEn: 'Logistics', icon: Truck },
  { id: 'compliance' as L2TabId, label: '関税・法令', labelEn: 'Compliance', icon: Shield },
  { id: 'media' as L2TabId, label: 'メディア', labelEn: 'Media', icon: ImageIcon },
  { id: 'history' as L2TabId, label: '履歴・監査', labelEn: 'History', icon: History },
];

// パネルタブの定義
type PanelTabId = 'tools' | 'flow' | 'stats' | 'filter';

const PANEL_TABS: { id: PanelTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'ツール', icon: <Wrench size={14} /> },
  { id: 'flow', label: 'フロー', icon: <GitBranch size={14} /> },
  { id: 'stats', label: '統計', icon: <BarChart3 size={14} /> },
  { id: 'filter', label: 'マーケットプレイス', icon: <Filter size={14} /> },
];

// フィルタータブ（棚卸し機能統合）
const FILTER_TABS = [
  // メイングループ
  { id: 'all', label: '全商品', group: 'main' },
  { id: 'draft', label: '下書き', group: 'main' },  // 新規追加：未出品商品
  { id: 'data_editing', label: 'データ編集', group: 'main' },
  { id: 'approval_pending', label: '承認待ち', group: 'main' },
  { id: 'active_listings', label: '出品中', group: 'main' },
  // 棚卸しグループ（inventory_master連携）
  { id: 'in_stock', label: '有在庫', group: 'inventory', customToolPanel: true },
  { id: 'variation', label: 'バリエーション', group: 'inventory', customToolPanel: true },
  { id: 'set_products', label: 'セット品', group: 'inventory', customToolPanel: true },
  { id: 'in_stock_master', label: 'マスター', group: 'inventory', customToolPanel: true },
  // ステータスグループ
  { id: 'back_order_only', label: '無在庫', group: 'status' },
  { id: 'out_of_stock', label: '在庫0', group: 'status' },
  { id: 'delisted_only', label: '出品停止中', group: 'status' },
];

// 棚卸しタブの判定
const isInventoryTab = (tabId: string) => {
  return ['in_stock', 'variation', 'set_products', 'in_stock_master'].includes(tabId);
};

// World clocks config
const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
];

const HEADER_HEIGHT = 48;

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * Product → ExpandPanelProduct へ変換
 * （データフローを維持しつつN3コンポーネント用に変換）
 */
function productToExpandPanelProduct(product: Product): ExpandPanelProduct {
  return {
    id: String(product.id),
    sku: product.sku || '',
    masterKey: product.master_key || '',
    title: product.title || '',
    englishTitle: product.english_title || product.title_en || '',
    priceJpy: product.price_jpy || product.cost_price || 0,
    currentStock: product.current_stock || 0,
    mainImageUrl: product.primary_image_url || undefined,
    galleryImages: product.gallery_images || [],
    market: {
      lowestPrice: product.sm_lowest_price || undefined,
      avgPrice: product.sm_average_price || undefined,
      competitorCount: product.sm_competitor_count || undefined,
      salesCount: product.sm_sales_count || undefined,
    },
    size: {
      widthCm: product.listing_data?.width_cm || undefined,
      lengthCm: product.listing_data?.length_cm || undefined,
      heightCm: product.listing_data?.height_cm || undefined,
      weightG: product.listing_data?.weight_g || undefined,
    },
    hts: {
      htsCode: product.hts_code || undefined,
      htsDutyRate: product.hts_duty_rate ? `${product.hts_duty_rate}%` : undefined,
      originCountry: product.origin_country || undefined,
      originDutyRate: product.origin_country_duty_rate || undefined,
      material: product.material || undefined,
    },
    vero: {
      isVeroBrand: product.is_vero_brand || false,
      categoryId: product.category_id || undefined,
      categoryName: product.category_name || undefined,
      hasHtml: !!product.html_content,
    },
    dduProfitUsd: product.listing_data?.ddu_profit_usd || product.profit_amount_usd || undefined,
    dduProfitMargin: product.listing_data?.ddu_profit_margin || product.profit_margin || undefined,
  };
}

// ============================================================
// サブコンポーネント
// ============================================================

// モーダルローディング
const ModalLoading = memo(function ModalLoading() {
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
    >
      <div className="rounded-lg p-6 text-center" style={{ background: 'var(--panel)' }}>
        <div 
          className="inline-block w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-2"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
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
  
  // ========================================
  // ローカルUI状態
  // ========================================
  const [activeSidebar, setActiveSidebar] = useState('products');
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // L3フィルターはUIStoreで管理
  const activeFilter = useProductUIStore((state) => state.listFilter);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [fastMode, setFastMode] = useState(false);
  const [tipsEnabled, setTipsEnabled] = useState(true);
  
  // データ完全性フィルター（承認待ち用）
  const [dataFilter, setDataFilter] = useState<'all' | 'complete' | 'incomplete'>('all');

  // ヘッダー右側の状態
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const isPinned = pinnedTab !== null;
  const activeTab = pinnedTab || hoveredTab;

  // ========================================
  // データフック（tools/editing から参照 - 変更禁止）
  // ========================================
  const {
    products, loading, error, modifiedIds, total, pageSize, currentPage,
    setPageSize, setCurrentPage, loadProducts, updateLocalProduct,
    saveAllModified, deleteProducts,
  } = useProductData();
  
  // デバッグ: productsの型を確認
  useEffect(() => {
    console.log('[EditingN3PageLayout] products type:', typeof products, 'isArray:', Array.isArray(products), 'value:', products);
  }, [products]);

  const {
    processing, currentStep, runBatchCategory, runBatchShipping,
    runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror,
    runBatchScores, runAllProcesses,
  } = useBatchProcess(loadProducts);

  const {
    activeL2Tab, setActiveL2Tab, viewMode, setViewMode,
    wrapText, setWrapText, language, setLanguage, useVirtualScroll, listFilter, setListFilter,
  } = useUIState(Array.isArray(products) ? products.length : 0);

  const { toast, showToast } = useToast();
  const modals = useModals();
  const { selectedIds, setSelectedIds, deselectAll, getSelectedProducts } = useSelection();
  const { marketplaces, setMarketplaces } = useMarketplace();
  const { handleProductHover, handleProductClick } = useProductInteraction();
  const { getAllSelected, clearAll } = useMirrorSelectionStore();

  // ========================================
  // 棚卸しフック（棚卸しタブ有効時のみデータ取得）
  // ========================================
  const isInventoryActive = isInventoryTab(activeFilter);
  
  // 棚卸しデータフック
  const inventoryData = useInventoryData();
  
  // タブカウントフック
  const tabCounts = useTabCounts();
  
  // 棚卸し同期フック
  const inventorySync = useInventorySync();
  
  // バリエーション作成フック
  const variationCreation = useVariationCreation();
  
  // セット商品作成フック
  const setCreation = useSetCreation();
  
  // 棚卸しタブがアクティブになったらデータをロード
  useEffect(() => {
    if (isInventoryActive && inventoryData.products.length === 0 && !inventoryData.loading) {
      inventoryData.loadProducts();
    }
  }, [isInventoryActive]);

  // 棚卸しタブのフィルター設定
  useEffect(() => {
    if (isInventoryActive) {
      // マスタータブ・有在庫タブは有在庫のみ表示
      if (activeFilter === 'in_stock' || activeFilter === 'in_stock_master') {
        inventoryData.setFilter({ inventoryType: 'stock' });
      }
      // 無在庫タブは無在庫のみ表示
      else if (activeFilter === 'back_order_only') {
        inventoryData.setFilter({ inventoryType: 'mu' });
      }
      // その他は全て表示
      else {
        inventoryData.setFilter({ inventoryType: undefined });
      }
    }
  }, [activeFilter, isInventoryActive]);

  // 棚卸しタブ用の選択状態（通常の選択とは分離）
  const [inventorySelectedIds, setInventorySelectedIds] = useState<Set<string>>(new Set());
  
  // バリエーションタブ用の状態
  const [showCandidatesOnly, setShowCandidatesOnly] = useState(false);
  
  // セット品タブ用の状態
  const [showSetsOnly, setShowSetsOnly] = useState(false);
  
  // 右サイドバー（グルーピングパネル）の表示状態
  const [showGroupingPanel, setShowGroupingPanel] = useState(false);
  
  // 画像一括アップロードモーダルの表示状態
  const [showBulkImageUploadModal, setShowBulkImageUploadModal] = useState(false);
  
  // 棚卸し商品詳細モーダルの状態
  const [showInventoryDetailModal, setShowInventoryDetailModal] = useState(false);
  const [selectedInventoryProduct, setSelectedInventoryProduct] = useState<InventoryProduct | null>(null);
  
  // 新規商品作成モーダルの状態
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  
  // ProductEnrichmentFlowモーダルの状態
  const [showEnrichmentFlowModal, setShowEnrichmentFlowModal] = useState(false);
  const [enrichmentFlowProduct, setEnrichmentFlowProduct] = useState<Product | null>(null);
  
  // 棚卸しタブで商品選択時は自動でサイドバーを表示
  useEffect(() => {
    if (isInventoryActive && inventorySelectedIds.size >= 2) {
      setShowGroupingPanel(true);
    } else if (inventorySelectedIds.size === 0) {
      setShowGroupingPanel(false);
    }
  }, [isInventoryActive, inventorySelectedIds.size]);

  const exportOps = useExportOperations({ products, selectedIds, showToast });
  const crudOps = useCRUDOperations({
    selectedIds, saveAllModified, deleteProducts, updateLocalProduct, showToast, deselectAll,
  });

  const basicEditHandlers = useBasicEdit({
    products, selectedIds, onShowToast: showToast, onLoadProducts: loadProducts,
    updateLocalProduct, getAllSelected, clearAll, runBatchCategory, runBatchShipping,
    runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror, runBatchScores, runAllProcesses,
  });

  // 派生データ
  const selectedProducts = getSelectedProducts(products);
  const selectedMirrorCount = getAllSelected().length;
  const readyCount = basicEditHandlers.readyCount;
  
  // 完全性チェック結果
  const { completeProducts, incompleteProducts } = useMemo(() => {
    const complete: Product[] = [];
    const incomplete: Product[] = [];
    
    // productsが配列であることを確認
    if (!Array.isArray(products)) {
      console.error('[EditingN3PageLayout] products is not an array:', products);
      return { completeProducts: [], incompleteProducts: [] };
    }
    
    products.forEach(product => {
      const result = checkProductCompleteness(product);
      if (result.isComplete) {
        complete.push(product);
      } else {
        incomplete.push(product);
      }
    });
    
    return { completeProducts: complete, incompleteProducts: incomplete };
  }, [products]);
  
  // 現在のフィルターに応じた表示対象商品
  const displayProducts = useMemo(() => {
    // productsが配列であることを確認
    if (!Array.isArray(products)) {
      console.error('[EditingN3PageLayout] displayProducts: products is not an array:', products);
      return [];
    }
    
    // 棚卸しタブの場合は inventoryData.filteredProducts を使用
    if (isInventoryActive) {
      return inventoryData.filteredProducts || [];
    }
    
    // 承認待ちフィルターの場合はデータフィルターも適用
    if (activeFilter === 'approval_pending') {
      switch (dataFilter) {
        case 'complete':
          return completeProducts;
        case 'incomplete':
          return incompleteProducts;
        default:
          return products;
      }
    }
    return products;
  }, [isInventoryActive, inventoryData.filteredProducts, activeFilter, dataFilter, products, completeProducts, incompleteProducts]);

  // 承認待ちフィルター選択時はカードビューをデフォルトに
  const handleFilterChange = useCallback((filterId: string) => {
    productUIActions.setListFilter(filterId as ListFilterType);
    if (filterId === 'approval_pending') {
      setViewMode('card');
    }
  }, [setViewMode]);

  // ========================================
  // ヘッダーハンドラー
  // ========================================
  
  // クリーンアップ
  useEffect(() => {
    return () => {
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // 時計の更新
  useEffect(() => {
    const update = () => {
      const newTimes: Record<string, string> = {};
      CLOCKS_CONFIG.forEach(c => {
        newTimes[c.label] = new Date().toLocaleTimeString("en-US", { 
          timeZone: c.tz,
          hour: "2-digit", 
          minute: "2-digit",
          hour12: false 
        });
      });
      setTimes(newTimes);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  // Click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsHeaderHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (pinnedTab) return;
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredTab(null);
      setIsHeaderHovered(false);
    }, 150);
  }, [pinnedTab]);

  const handleTabMouseEnter = useCallback((tabId: PanelTabId) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (!pinnedTab) {
      setHoveredTab(tabId);
    }
    setIsHeaderHovered(true);
  }, [pinnedTab]);

  const handleTabClick = (tabId: PanelTabId) => {
    if (pinnedTab === tabId) {
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else {
      setPinnedTab(tabId);
      setHoveredTab(null);
    }
  };

  const handlePinToggle = () => {
    if (pinnedTab) {
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else if (hoveredTab) {
      setPinnedTab(hoveredTab);
      setHoveredTab(null);
    }
  };

  // ========================================
  // 商品操作ハンドラー（データフローシグネチャ維持）
  // ========================================

  const handleToggleSelect = useCallback((id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  }, [selectedIds, setSelectedIds]);

  const handleToggleExpand = useCallback((id: string) => {
    if (fastMode) return;
    setExpandedId(expandedId === id ? null : id);
  }, [fastMode, expandedId]);

  const handleRowClick = useCallback((product: Product) => {
    handleProductClick(product, modals.openProductModal);
  }, [handleProductClick, modals.openProductModal]);

  /**
   * インライン編集ハンドラー
   * シグネチャ: (id: string, field: string, value: any) => void
   * ※このシグネチャは変更禁止
   */
  const handleInlineCellChange = useCallback((id: string, field: string, value: any) => {
    updateLocalProduct(id, { [field]: value });
    showToast(`✅ ${field}: ${value}`, 'success');
  }, [updateLocalProduct, showToast]);

  // ========================================
  // パネルコンテンツ
  // ========================================
  const getPanelContent = (tabId: PanelTabId | null) => {
    switch (tabId) {
      case 'tools':
        // 棚卸しタブ：有在庫
        if (activeFilter === 'in_stock' || activeFilter === 'in_stock_master') {
          return (
            <InventoryToolPanel
              stats={inventoryData.stats}
              loading={inventoryData.loading}
              syncing={{
                mjt: inventorySync.ebaySyncingMjt,
                green: inventorySync.ebaySyncingGreen,
                incremental: inventorySync.incrementalSyncing,
                mercari: inventorySync.mercariSyncing,
              }}
              selectedCount={inventorySelectedIds.size}
              pendingCount={inventoryData.pendingCount}
              onSyncIncremental={(account) => {
                inventorySync.syncEbayIncremental(account);
                showToast(`🔄 ${account.toUpperCase()} 差分同期開始...`, 'success');
              }}
              onSyncFull={(account) => {
                inventorySync.syncEbay(account);
                showToast(`🔄 ${account.toUpperCase()} 完全同期開始...`, 'success');
              }}
              onSyncMercari={() => {
                inventorySync.syncMercari();
                showToast('🔄 メルカリ同期開始...', 'success');
              }}
              onRefresh={() => {
                inventoryData.refreshData();
                showToast('🔄 データ更新中...', 'success');
              }}
              onBulkDelete={async (target) => {
                const result = await inventorySync.bulkDelete(target);
                if (result.success) {
                  showToast(`✅ ${result.deleted}件削除しました`, 'success');
                  inventoryData.refreshData();
                } else {
                  showToast(`❌ 削除失敗: ${result.error}`, 'error');
                }
              }}
              onNewProduct={() => setShowNewProductModal(true)}
              onBulkImageUpload={() => setShowBulkImageUploadModal(true)}
            />
          );
        }
        
        // 棚卸しタブ：バリエーション
        if (activeFilter === 'variation') {
          const candidates = variationCreation.findGroupingCandidates(inventoryData.filteredProducts);
          const groupedCandidates = variationCreation.groupByCategory(inventoryData.filteredProducts);
          
          return (
            <VariationToolPanel
              stats={{
                parentCount: inventoryData.stats.variationParentCount,
                memberCount: inventoryData.stats.variationMemberCount,
                standaloneCount: inventoryData.stats.standaloneCount,
                candidateCount: candidates.length,
              }}
              loading={inventoryData.loading || variationCreation.loading}
              selectedCount={inventorySelectedIds.size}
              showCandidatesOnly={showCandidatesOnly}
              onDetectCandidates={() => {
                setShowCandidatesOnly(true);
                showToast(`🔍 ${candidates.length}件のグルーピング候補を検出`, 'success');
              }}
              onToggleCandidatesOnly={() => setShowCandidatesOnly(!showCandidatesOnly)}
              onCreateVariation={async () => {
                if (inventorySelectedIds.size < 2) {
                  showToast('❌ 2件以上選択してください', 'error');
                  return;
                }
                const selectedProducts = inventoryData.filteredProducts.filter(
                  p => inventorySelectedIds.has(String(p.id))
                );
                // バリエーション作成（全商品をmemberIdsに含める）
                const allSelectedIds = selectedProducts.map(p => String(p.id));
                const result = await variationCreation.createVariation({
                  memberIds: allSelectedIds,  // 全選択商品を子SKUとして渡す
                  variationTitle: selectedProducts[0].title || 'バリエーション商品',
                });
                if (result.success) {
                  showToast(`✅ バリエーション作成完了`, 'success');
                  setInventorySelectedIds(new Set());
                  inventoryData.refreshData();
                } else {
                  showToast(`❌ ${result.error}`, 'error');
                }
              }}
              onClearSelection={() => {
                setInventorySelectedIds(new Set());
                showToast('選択解除', 'success');
              }}
            />
          );
        }
        
        // 棚卸しタブ：セット品
        if (activeFilter === 'set_products') {
          const setCandidates = setCreation.findSetCandidates(inventoryData.filteredProducts);
          const setProducts = inventoryData.filteredProducts.filter(p => p.product_type === 'set');
          const selectedSetProducts = inventoryData.filteredProducts.filter(
            p => inventorySelectedIds.has(String(p.id))
          );
          
          return (
            <SetProductToolPanel
              stats={{
                setCount: setProducts.length,
                totalValue: setProducts.reduce((sum, p) => sum + (p.cost_jpy || 0), 0),
                selectedCount: inventorySelectedIds.size,
              }}
              loading={inventoryData.loading || setCreation.loading}
              selectedCount={inventorySelectedIds.size}
              showSetsOnly={showSetsOnly}
              onCreateSet={async () => {
                if (inventorySelectedIds.size < 2) {
                  showToast('❌ 2件以上選択してください', 'error');
                  return;
                }
                // 選択された商品が単品かチェック
                const nonSingleProducts = selectedSetProducts.filter(p => p.product_type !== 'single');
                if (nonSingleProducts.length > 0) {
                  showToast('❌ 単品商品のみ選択してください', 'error');
                  return;
                }
                
                const quantities = selectedSetProducts.reduce((acc, p) => {
                  acc[String(p.id)] = 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const result = await setCreation.createSet({
                  name: `セット商品_${Date.now()}`,
                  memberIds: selectedSetProducts.map(p => String(p.id)),
                  quantities,
                });
                
                if (result.success) {
                  showToast(`✅ セット商品作成完了`, 'success');
                  setInventorySelectedIds(new Set());
                  inventoryData.refreshData();
                } else {
                  showToast(`❌ ${result.error}`, 'error');
                }
              }}
              onToggleSetsOnly={() => setShowSetsOnly(!showSetsOnly)}
              onEditSet={() => {
                if (inventorySelectedIds.size !== 1) {
                  showToast('❌ 編集するセットを1件選択してください', 'error');
                  return;
                }
                showToast('📝 セット編集モーダル...', 'success');
              }}
              onDeleteSet={async () => {
                if (inventorySelectedIds.size === 0) {
                  showToast('❌ 削除するセットを選択してください', 'error');
                  return;
                }
                showToast('🗑️ セット削除...', 'success');
              }}
            />
          );
        }
        
        // 承認待ちフィルターの場合は承認アクションバー + 通常ツール
        if (activeFilter === 'approval_pending') {
          return (
            <div>
              <N3ApprovalActionBar
                selectedCount={selectedIds.size}
                modifiedCount={modifiedIds.size}
                completeCount={completeProducts.length}
                incompleteCount={incompleteProducts.length}
                dataFilter={dataFilter}
                onDataFilterChange={setDataFilter}
                onSelectAll={() => {
                  const allIds = displayProducts.map(p => String(p.id));
                  setSelectedIds(new Set(allIds));
                  showToast(`✅ ${allIds.length}件全選択`, 'success');
                }}
                onDeselectAll={() => {
                  setSelectedIds(new Set());
                  showToast('選択解除', 'success');
                }}
                onApprove={async () => {
                  if (selectedIds.size === 0) return;
                  for (const id of selectedIds) {
                    updateLocalProduct(id, { ready_to_list: true, workflow_status: 'approved' });
                  }
                  showToast(`✅ ${selectedIds.size}件承認しました`, 'success');
                  setSelectedIds(new Set());
                }}
                onReject={async () => {
                  if (selectedIds.size === 0) return;
                  for (const id of selectedIds) {
                    updateLocalProduct(id, { ready_to_list: false, workflow_status: 'rejected' });
                  }
                  showToast(`❌ ${selectedIds.size}件却下しました`, 'success');
                  setSelectedIds(new Set());
                }}
                onScheduleListing={() => {
                  if (selectedIds.size === 0) return;
                  showToast(`📤 ${selectedIds.size}件を出品予約...`, 'success');
                }}
                onSave={crudOps.handleSaveAll}
                processing={processing}
              />
              {/* 通常のツールパネルも表示 */}
              <N3ToolPanel
                processing={processing}
                currentStep={currentStep}
                modifiedCount={modifiedIds.size}
                readyCount={readyCount}
                selectedMirrorCount={selectedMirrorCount}
                onRunAll={basicEditHandlers.handleRunAll}
                onPaste={modals.openPasteModal}
                onReload={loadProducts}
                onCSVUpload={modals.openCSVModal}
                onCategory={basicEditHandlers.handleCategory}
                onShipping={basicEditHandlers.handleShipping}
                onProfit={basicEditHandlers.handleProfit}
                onHTML={basicEditHandlers.handleHTML}
                onScore={() => runBatchScores(products)}
                onHTS={basicEditHandlers.handleHTSFetch}
                onOrigin={basicEditHandlers.handleOriginCountryFetch}
                onMaterial={basicEditHandlers.handleMaterialFetch}
                onFilter={basicEditHandlers.handleFilterCheck}
                onResearch={basicEditHandlers.handleBulkResearch}
                onAI={basicEditHandlers.handleAIEnrich}
                onTranslate={basicEditHandlers.handleTranslate}
                onSellerMirror={async () => {
                  if (selectedIds.size === 0) {
                    showToast('商品を選択してください', 'error');
                    return;
                  }
                  const selectedArray = Array.from(selectedIds);
                  showToast(`🔍 ${selectedArray.length}件のSM分析を開始します...`, 'success');
                  try {
                    const result = await runBatchSellerMirror(selectedArray);
                    if (result.success) {
                      showToast(`✅ ${result.message || `SellerMirror分析完了: ${result.updated}件`}`, 'success');
                      await loadProducts();
                    } else {
                      showToast(`❌ ${result.error || 'SellerMirror分析に失敗しました'}`, 'error');
                    }
                  } catch (error: any) {
                    showToast(`❌ エラー: ${error.message}`, 'error');
                  }
                }}
                onDetails={basicEditHandlers.handleBatchFetchDetails}
                onGemini={modals.openGeminiBatchModal}
                onFinalProcess={basicEditHandlers.handleFinalProcessChain}
                onList={exportOps.handleList}
                onSave={crudOps.handleSaveAll}
                onDelete={crudOps.handleDelete}
                onExportCSV={exportOps.handleExport}
                onExportEbay={exportOps.handleExportEbay}
                onExportAI={exportOps.handleAIExport}
                onEnrichmentFlow={() => {
                  if (selectedIds.size !== 1) {
                    showToast('1件の商品を選択してください', 'error');
                    return;
                  }
                  const productId = Array.from(selectedIds)[0];
                  const product = displayProducts.find(p => String(p.id) === productId);
                  if (product) {
                    setEnrichmentFlowProduct(product);
                    setShowEnrichmentFlowModal(true);
                  }
                }}
              />
            </div>
          );
        }
        // 通常のツールパネル
        return (
          <N3ToolPanel
            processing={processing}
            currentStep={currentStep}
            modifiedCount={modifiedIds.size}
            readyCount={readyCount}
            selectedMirrorCount={selectedMirrorCount}
            onRunAll={basicEditHandlers.handleRunAll}
            onPaste={modals.openPasteModal}
            onReload={loadProducts}
            onCSVUpload={modals.openCSVModal}
            onCategory={basicEditHandlers.handleCategory}
            onShipping={basicEditHandlers.handleShipping}
            onProfit={basicEditHandlers.handleProfit}
            onHTML={basicEditHandlers.handleHTML}
            onScore={() => runBatchScores(products)}
            onHTS={basicEditHandlers.handleHTSFetch}
            onOrigin={basicEditHandlers.handleOriginCountryFetch}
            onMaterial={basicEditHandlers.handleMaterialFetch}
            onFilter={basicEditHandlers.handleFilterCheck}
            onResearch={basicEditHandlers.handleBulkResearch}
            onAI={basicEditHandlers.handleAIEnrich}
            onTranslate={basicEditHandlers.handleTranslate}
            onSellerMirror={async () => {
              if (selectedIds.size === 0) {
                showToast('商品を選択してください', 'error');
                return;
              }
              const selectedArray = Array.from(selectedIds);
              showToast(`🔍 ${selectedArray.length}件のSM分析を開始します...`, 'success');
              try {
                const result = await runBatchSellerMirror(selectedArray);
                if (result.success) {
                  showToast(`✅ ${result.message || `SellerMirror分析完了: ${result.updated}件`}`, 'success');
                  await loadProducts();
                } else {
                  showToast(`❌ ${result.error || 'SellerMirror分析に失敗しました'}`, 'error');
                }
              } catch (error: any) {
                showToast(`❌ エラー: ${error.message}`, 'error');
              }
            }}
            onDetails={basicEditHandlers.handleBatchFetchDetails}
            onGemini={modals.openGeminiBatchModal}
            onFinalProcess={basicEditHandlers.handleFinalProcessChain}
            onList={exportOps.handleList}
            onSave={crudOps.handleSaveAll}
            onDelete={crudOps.handleDelete}
            onExportCSV={exportOps.handleExport}
            onExportEbay={exportOps.handleExportEbay}
            onExportAI={exportOps.handleAIExport}
            onEnrichmentFlow={() => {
              if (selectedIds.size !== 1) {
                showToast('1件の商品を選択してください', 'error');
                return;
              }
              const productId = Array.from(selectedIds)[0];
              const product = displayProducts.find(p => String(p.id) === productId);
              if (product) {
                setEnrichmentFlowProduct(product);
                setShowEnrichmentFlowModal(true);
              }
            }}
          />
        );
      case 'flow':
        return (
          <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            FLOWパネルは次のステップで実装予定
          </div>
        );
      case 'stats':
        // 棚卸しタブの場合は inventoryData を使用
        if (isInventoryActive) {
          // バリエーションタブ
          if (activeFilter === 'variation') {
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
          // セット品タブ
          if (activeFilter === 'set_products') {
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
          // 有在庫/マスター/無在庫タブ
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
        // 通常タブの場合
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
                  { label: '完全', value: completeProducts.length, color: 'green' },
                  { label: '不完全', value: incompleteProducts.length, color: 'yellow' },
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
      case 'filter':
        return (
          <div className="p-3">
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
              Marketplaces
            </div>
            <MarketplaceSelector marketplaces={marketplaces} onChange={setMarketplaces} />
          </div>
        );
      default:
        return null;
    }
  };

  const showHoverPanel = !isPinned && hoveredTab !== null && isHeaderHovered;
  const clocksData = CLOCKS_CONFIG.map(c => ({ label: c.label, time: times[c.label] || '--:--' }));

  // ========================================
  // レンダリング
  // ========================================

  return (
    <div 
      style={{ 
        display: 'flex', 
        height: '100vh', 
        overflow: 'hidden', 
        background: 'var(--bg)',
      }}
    >
      {/* サイドバー削除: LayoutWrapperのN3IconNavを使用 */}
      {/* <div style={{ flexShrink: 0, position: 'relative', zIndex: 50 }}>
        <N3SidebarMini
          items={SIDEBAR_ITEMS}
          activeId={activeSidebar}
          onItemClick={setActiveSidebar}
        />
      </div> */}

      {/* メインエリア */}
      <div 
        ref={mainContentRef}
        id="main-scroll-container"
        style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', minWidth: 0, overflow: 'auto' }}
      >
        {/* Collapsible Header Group: ヘッダー 〜 Tips（サブツールバー）まで */}
        <N3CollapsibleHeader
          scrollContainerId="main-scroll-container"
          threshold={10}
          transitionDuration={200}
          zIndex={40}
        >
          {/* ヘッダー */}
          <header
            style={{
              height: HEADER_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--glass)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--glass-border)',
              padding: '0 12px',
              flexShrink: 0,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
          {/* Left - タブ */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0 }}>
            <N3PinButton pinned={isPinned} onClick={handlePinToggle} />
            {PANEL_TABS.map((tab) => (
              <N3HeaderTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                active={activeTab === tab.id}
                pinned={pinnedTab === tab.id}
                onMouseEnter={() => handleTabMouseEnter(tab.id)}
                onClick={() => handleTabClick(tab.id)}
              />
            ))}
          </div>

          {/* Center - Search */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <N3HeaderSearchInput placeholder="Search..." shortcut="⌘K" width={240} />
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <N3LanguageSwitch 
              language={language} 
              onToggle={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')} 
            />
            <N3Divider orientation="vertical" />
            <N3WorldClock clocks={clocksData} />
            <N3Divider orientation="vertical" />
            <N3CurrencyDisplay value={149.50} trend="up" />
            <N3Divider orientation="vertical" />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <N3NotificationBell 
                count={3} 
                active={showNotifications}
                onClick={() => setShowNotifications(!showNotifications)} 
              />
              {showNotifications && (
                <div className="n3-dropdown" style={{ width: 280, right: 0 }}>
                  <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Notifications</span>
                  </div>
                  {[
                    { title: "価格更新", desc: "3件の商品価格を更新", time: "2分前", color: "var(--color-success)" },
                    { title: "在庫アラート", desc: "SKU-8012 在庫わずか", time: "12分前", color: "var(--color-warning)" },
                    { title: "出品完了", desc: "eBayに5件出品完了", time: "1時間前", color: "var(--color-info)" },
                  ].map((n, i) => (
                    <div key={i} className="n3-dropdown-item">
                      <div className="n3-status-dot" style={{ background: n.color }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{n.title}</div>
                        <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{n.desc}</div>
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-subtle)' }}>{n.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <N3UserAvatar name={user?.username || 'User'} onClick={() => setShowUserMenu(!showUserMenu)} />
              {showUserMenu && (
                <div className="n3-dropdown" style={{ width: 180 }}>
                  <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                    <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>{user?.username || "User"}</div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{user?.email || "user@example.com"}</div>
                  </div>
                  <div className="n3-dropdown-item"><User size={14} /> Profile</div>
                  <div className="n3-dropdown-item"><Settings size={14} /> Settings</div>
                  <div className="n3-dropdown-item"><HelpCircle size={14} /> Help</div>
                  <div className="n3-dropdown-divider" />
                  <div className="n3-dropdown-item" style={{ color: 'var(--color-error)' }} onClick={() => { setShowUserMenu(false); logout(); }}>
                    <LogOut size={14} /> Sign out
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ホバーパネル */}
        {showHoverPanel && (
          <div
            style={{
              position: 'absolute',
              top: HEADER_HEIGHT,
              left: 56, // sidebar width
              right: 0,
              padding: 6,
              background: 'transparent',
              borderBottom: '1px solid transparent',
              zIndex: 100,
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
            onMouseEnter={handleMouseEnter}
          >
            {getPanelContent(hoveredTab)}
          </div>
        )}

        {/* ピン留めパネル */}
        {isPinned && (
          <div
            style={{
              flexShrink: 0,
              padding: 6,
              background: 'transparent',
              borderBottom: '1px solid transparent',
            }}
          >
            {getPanelContent(pinnedTab)}
          </div>
        )}

        {/* L2タブナビゲーション */}
        <div 
          style={{ 
            height: 36,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '0 12px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {L2_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeL2Tab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveL2Tab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: isActive ? 'var(--accent)' : 'transparent',
                    color: isActive ? 'white' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon size={14} />
                  <span>{language === 'ja' ? tab.label : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* L3フィルターバー（グループ区切り付き） */}
        <div 
          style={{ 
            height: 36,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--highlight)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '0 12px',
            flexShrink: 0,
            overflowX: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* メイングループ */}
            {FILTER_TABS.filter(t => t.group === 'main').map((tab) => (
              <N3FilterTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                count={tabCounts.getTabCount(tab.id)}
                active={activeFilter === tab.id}
                onClick={() => handleFilterChange(tab.id)}
              />
            ))}
            
            {/* グループ区切り */}
            <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
            
            {/* 棚卸しグループ */}
            {FILTER_TABS.filter(t => t.group === 'inventory').map((tab) => (
              <N3FilterTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                count={tabCounts.getTabCount(tab.id)}
                active={activeFilter === tab.id}
                onClick={() => handleFilterChange(tab.id)}
                variant={isInventoryTab(tab.id) ? 'inventory' : 'default'}
              />
            ))}
            
            {/* グループ区切り */}
            <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
            
            {/* ステータスグループ */}
            {FILTER_TABS.filter(t => t.group === 'status').map((tab) => (
              <N3FilterTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                count={tabCounts.getTabCount(tab.id)}
                active={activeFilter === tab.id}
                onClick={() => handleFilterChange(tab.id)}
              />
            ))}
          </div>
        </div>

        {/* サブツールバー */}
        <div 
          style={{ 
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '0 12px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Tips ボタン */}
            {tipsEnabled ? (
              <N3Tooltip content="ツールチップを非表示にする" position="bottom">
                <button
                  onClick={() => setTipsEnabled(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '4px',
                    color: 'rgb(59, 130, 246)',
                    cursor: 'pointer',
                  }}
                >
                  <Lightbulb size={12} />
                  <span>Tips</span>
                </button>
              </N3Tooltip>
            ) : (
              <button
                onClick={() => setTipsEnabled(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: 'transparent',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '4px',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <Lightbulb size={12} />
                <span>Tips</span>
              </button>
            )}

            {/* Fast ボタン */}
            <button
              onClick={() => {
                setFastMode(!fastMode);
                if (!fastMode) setExpandedId(null);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 500,
                background: fastMode ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                border: '1px solid',
                borderColor: fastMode ? 'rgba(245, 158, 11, 0.3)' : 'var(--panel-border)',
                borderRadius: '4px',
                color: fastMode ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
              title={fastMode ? '通常モードに戻す' : '高速モード'}
            >
              <Zap size={12} />
              <span>Fast</span>
            </button>

            <select 
              value={isInventoryActive ? inventoryData.itemsPerPage : pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                if (isInventoryActive) {
                  inventoryData.setItemsPerPage(newSize);
                } else {
                  setPageSize(newSize);
                }
              }}
              style={{
                height: 28,
                padding: '0 8px',
                fontSize: '11px',
                border: '1px solid var(--panel-border)',
                borderRadius: '4px',
                background: 'var(--panel)',
                color: 'var(--text)',
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {isInventoryActive 
                ? `${inventoryData.paginatedProducts.length}/${inventoryData.totalItems}件`
                : `${products.length}/${total}件`
              }
            </span>
            
            {/* 棚卸しタブ用ソートセレクター */}
            {isInventoryActive && (
              <>
                <N3Divider orientation="vertical" style={{ height: 20, margin: '0 8px' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>並び順:</span>
                <select
                  value={inventoryData.sortOption.field}
                  onChange={(e) => inventoryData.setSortOption({
                    ...inventoryData.sortOption,
                    field: e.target.value as SortField
                  })}
                  style={{
                    height: 28,
                    padding: '0 8px',
                    fontSize: '11px',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    background: 'var(--panel)',
                    color: 'var(--text)',
                  }}
                >
                  <option value="created_at">登録日</option>
                  <option value="updated_at">更新日</option>
                  <option value="product_name">商品名</option>
                  <option value="sku">SKU</option>
                  <option value="cost_price">原価</option>
                  <option value="selling_price">販売価格</option>
                  <option value="physical_quantity">在庫数</option>
                </select>
                <button
                  onClick={() => inventoryData.setSortOption({
                    ...inventoryData.sortOption,
                    order: inventoryData.sortOption.order === 'desc' ? 'asc' : 'desc'
                  })}
                  style={{
                    height: 28,
                    width: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    background: 'var(--panel)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                  }}
                  title={inventoryData.sortOption.order === 'desc' ? '降順（新しい順）' : '昇順（古い順）'}
                >
                  {inventoryData.sortOption.order === 'desc' ? '↓' : '↑'}
                </button>
              </>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <N3ViewModeToggle
              value={viewMode}
              onChange={setViewMode}
              size="sm"
              showLabels={true}
            />
          </div>
        </div>
        </N3CollapsibleHeader>

        {/* 棚卸しタブ専用ToolPanelは上部ヘッダーのツールタブ内で表示（二重表示防止のため削除済み） */}

        {/* メインコンテンツ - スクロールは親コンテナに任せる */}
        <ErrorBoundary componentName="N3EditingMainContent">
          <div style={{ flexShrink: 0 }}>
            {/* 棚卸しタブ専用コンテンツ */}
            {isInventoryActive && (
              <div style={{ padding: 12 }}>
                {inventoryData.loading ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    棚卸しデータ読み込み中...
                  </div>
                ) : inventoryData.error ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--error)' }}>
                    エラー: {inventoryData.error}
                  </div>
                ) : inventoryData.paginatedProducts.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    {activeFilter === 'variation' && showCandidatesOnly
                      ? 'グルーピング候補がありません'
                      : activeFilter === 'set_products' && showSetsOnly
                      ? 'セット商品がありません'
                      : '棚卸しデータがありません'
                    }
                  </div>
                ) : (
                  <>
                    {/* 棚卸し情報バー（原価総額表示付き） */}
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
                          {activeFilter === 'in_stock' && `有在庫: ${inventoryData.stats.inStockCount}件`}
                          {activeFilter === 'variation' && `バリエーション: 親${inventoryData.stats.variationParentCount}件 / 子${inventoryData.stats.variationMemberCount}件`}
                          {activeFilter === 'set_products' && `セット商品: ${inventoryData.filteredProducts.filter(p => p.product_type === 'set').length}件`}
                          {activeFilter === 'in_stock_master' && `マスター全件: ${inventoryData.stats.totalCount}件`}
                        </span>
                        <span>
                          ページ {inventoryData.currentPage}/{inventoryData.totalPages}
                          （{inventoryData.paginatedProducts.length}/{inventoryData.totalItems}件表示）
                        </span>
                      </div>
                      
                      {/* 下段: 原価総額・在庫数（棚卸し必須情報） */}
                      <div style={{
                        display: 'flex',
                        gap: 24,
                        paddingTop: 8,
                        borderTop: '1px solid var(--panel-border)',
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
                            {inventoryData.filteredProducts.length.toLocaleString()}種類
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
                            {inventoryData.filteredProducts.reduce((sum, p) => sum + (p.physical_quantity || 0), 0).toLocaleString()}個
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
                            ¥{(inventoryData.stats.totalCostJpy || 0).toLocaleString()}
                          </span>
                        </div>
                        
                        {/* 選択商品原価合計 */}
                        {inventorySelectedIds.size > 0 && (() => {
                          const selectedTotal = inventoryData.filteredProducts
                            .filter(p => inventorySelectedIds.has(String(p.id)))
                            .reduce((sum, p) => sum + ((p.cost_jpy || 0) * (p.physical_quantity || 1)), 0);
                          return (
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
                                選択{inventorySelectedIds.size}件:
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
                          );
                        })()}
                      </div>
                    </div>
                    
                    {/* 棚卸し商品表示（viewModeで切り替え） */}
                    {viewMode === 'list' ? (
                      <N3InventoryTable
                        items={inventoryData.paginatedProducts}
                        selectedIds={inventorySelectedIds}
                        onSelect={(id: string) => {
                          const next = new Set(inventorySelectedIds);
                          if (next.has(id)) next.delete(id); else next.add(id);
                          setInventorySelectedIds(next);
                        }}
                        onDetail={(id: string) => {
                          // 商品詳細モーダルを開く
                          const product = inventoryData.paginatedProducts.find(p => String(p.id) === id);
                          if (product) {
                            setSelectedInventoryProduct(product);
                            setShowInventoryDetailModal(true);
                          }
                        }}
                        onStockChange={async (id: string, newQuantity: number) => {
                          const result = await inventorySync.updateStock(id, newQuantity);
                          if (result.success) {
                            // ローカル状態を即座に更新（UIに即時反映）
                            inventoryData.updateLocalProduct(id, { physical_quantity: newQuantity });
                            showToast(`✅ 在庫数を更新しました`, 'success');
                          } else {
                            showToast(`❌ ${result.error}`, 'error');
                          }
                        }}
                        onCostChange={async (id: string, newCost: number) => {
                          const result = await inventorySync.updateCost(id, newCost);
                          if (result.success) {
                            inventoryData.updateLocalProduct(id, { cost_price: newCost, cost_jpy: newCost });
                            showToast(`✅ 原価を更新しました`, 'success');
                          } else {
                            showToast(`❌ ${result.error}`, 'error');
                          }
                        }}
                      />
                    ) : (
                      <N3InventoryCardGrid
                        items={inventoryData.paginatedProducts}
                        selectedIds={inventorySelectedIds}
                        onSelect={(id: string) => {
                          const next = new Set(inventorySelectedIds);
                          if (next.has(id)) next.delete(id); else next.add(id);
                          setInventorySelectedIds(next);
                        }}
                        onDetail={(id: string) => {
                          // 商品詳細モーダルを開く
                          const product = inventoryData.paginatedProducts.find(p => String(p.id) === id);
                          if (product) {
                            setSelectedInventoryProduct(product);
                            setShowInventoryDetailModal(true);
                          }
                        }}
                        onStockChange={async (id: string, newQuantity: number) => {
                          const result = await inventorySync.updateStock(id, newQuantity);
                          if (result.success) {
                            // ローカル状態を即座に更新（UIに即時反映）
                            inventoryData.updateLocalProduct(id, { physical_quantity: newQuantity });
                            showToast(`✅ 在庫数を更新しました`, 'success');
                          } else {
                            showToast(`❌ ${result.error}`, 'error');
                          }
                        }}
                        onCostChange={async (id: string, newCost: number) => {
                          const result = await inventorySync.updateCost(id, newCost);
                          if (result.success) {
                            inventoryData.updateLocalProduct(id, { cost_price: newCost, cost_jpy: newCost });
                            showToast(`✅ 原価を更新しました`, 'success');
                          } else {
                            showToast(`❌ ${result.error}`, 'error');
                          }
                        }}
                        showInventoryTypeToggle={['active_listings', 'in_stock', 'in_stock_master', 'back_order_only'].includes(activeFilter)}
                        onInventoryTypeChange={async (id: string, newType: 'stock' | 'mu') => {
                          const result = await inventorySync.toggleInventoryType(id, newType);
                          if (result.success) {
                            inventoryData.updateLocalProduct(id, { inventory_type: newType });
                            // タブカウントを再取得
                            tabCounts.fetchAllCounts();
                            showToast(`✅ 在庫タイプを${newType === 'stock' ? '有在庫' : '無在庫'}に変更しました`, 'success');
                          } else {
                            showToast(`❌ ${result.error}`, 'error');
                          }
                        }}
                        columns="auto"
                        gap={8}
                        minCardWidth={180}
                      />
                    )}
                    
                    {/* 棚卸し用ページネーション */}
                    {inventoryData.totalPages > 1 && (
                      <div style={{ marginTop: 16 }}>
                        <N3Pagination
                          total={inventoryData.totalItems}
                          pageSize={inventoryData.itemsPerPage}
                          currentPage={inventoryData.currentPage}
                          onPageChange={inventoryData.setCurrentPage}
                          onPageSizeChange={inventoryData.setItemsPerPage}
                          pageSizeOptions={[10, 50, 100, 500]}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* 通常のリストビュー（棚卸しタブ以外） */}
            {!isInventoryActive && activeL2Tab === 'basic-edit' && viewMode === 'list' && (
              <>
                {/* テーブルヘッダー */}
                <div 
                  style={{ 
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--panel)',
                    borderBottom: '1px solid var(--panel-border)',
                    padding: '0 8px',
                    flexShrink: 0,
                  }}
                >
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: '100%', 
                      fontSize: '11px', 
                      fontWeight: 600, 
                      textTransform: 'uppercase',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <div style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
                      <N3Checkbox 
                        checked={selectedIds.size === displayProducts.length && displayProducts.length > 0} 
                        onChange={() => {
                          if (selectedIds.size === displayProducts.length) {
                            setSelectedIds(new Set());
                          } else {
                            setSelectedIds(new Set(displayProducts.map(p => String(p.id))));
                          }
                        }} 
                      />
                    </div>
                    <div style={{ width: 32, textAlign: 'center' }}>▼</div>
                    <div style={{ flex: 1, minWidth: 200 }}>Product</div>
                    <div style={{ width: 60, textAlign: 'center' }}>Stock</div>
                    <div style={{ width: 80, textAlign: 'right' }}>Cost¥</div>
                    <div style={{ width: 70, textAlign: 'right' }}>Profit</div>
                    <div style={{ width: 60, textAlign: 'right' }}>Rate</div>
                    <div style={{ width: 40, textAlign: 'center' }}>✓</div>
                    <div style={{ width: 40, textAlign: 'center' }}>ST</div>
                    <div style={{ width: 50, textAlign: 'center' }}>Type</div>
                  </div>
                </div>

                {/* テーブル本体 - スクロールは親コンテナに任せる */}
                <div style={{ flexShrink: 0 }}>
                  {loading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      読み込み中...
                    </div>
                  ) : error ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--error)' }}>
                      エラー: {error}
                    </div>
                  ) : displayProducts.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      商品がありません
                    </div>
                  ) : (
                    displayProducts.map((product) => {
                      const expandProduct = productToExpandPanelProduct(product);
                      return (
                        <ProductRow
                          key={product.id}
                          product={product}
                          expandProduct={expandProduct}
                          isSelected={selectedIds.has(String(product.id))}
                          isExpanded={expandedId === String(product.id)}
                          fastMode={fastMode}
                          onToggleSelect={handleToggleSelect}
                          onToggleExpand={handleToggleExpand}
                          onRowClick={handleRowClick}
                          onCellChange={handleInlineCellChange}
                          onDelete={() => showToast('🗑️ 削除', 'success')}
                          onEbaySearch={() => window.open(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(product.english_title || product.title || '')}`, '_blank')}
                        />
                      );
                    })
                  )}
                </div>
              </>
            )}

            {/* カードビュー（棚卸しタブ以外） - スクロールは親コンテナに任せる */}
            {!isInventoryActive && activeL2Tab === 'basic-edit' && viewMode === 'card' && (
              <div style={{ flexShrink: 0, padding: 12 }}>
                {loading ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    読み込み中...
                  </div>
                ) : displayProducts.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                    {activeFilter === 'approval_pending' 
                      ? '承認待ちの商品はありません（全ての必須データが揃っている商品のみ表示されます）'
                      : '商品がありません'
                    }
                  </div>
                ) : (
                  <>
                    {/* 承認待ちの場合は件数表示 */}
                    {activeFilter === 'approval_pending' && (
                      <div style={{ 
                        marginBottom: 12, 
                        padding: '8px 12px', 
                        background: 'var(--highlight)', 
                        borderRadius: 4,
                        fontSize: 12,
                        color: 'var(--text-muted)',
                      }}>
                        承認可能な商品: <strong style={{ color: 'var(--text)' }}>{displayProducts.length}件</strong>
                        （全ての必須項目が揃っている商品のみ）
                      </div>
                    )}
                    <N3CardGrid
                      items={displayProducts.map(product => {
                        const completeness = checkProductCompleteness(product);
                        return {
                          id: String(product.id),
                          title: product.english_title || product.title_en || product.title || '',
                          imageUrl: product.primary_image_url || undefined,
                          price: product.ddp_price_usd || product.listing_data?.ddp_price_usd || product.price_usd || 0,
                          currency: 'USD' as const,
                          profitAmount: product.profit_amount_usd || product.listing_data?.profit_amount_usd || undefined,
                          profitMargin: product.profit_margin || product.listing_data?.profit_margin || undefined,
                          sku: product.sku || undefined,
                          filterPassed: product.filter_passed,
                          category: product.category_name || product.category || undefined,
                          categoryId: product.category_id || product.ebay_category_id || undefined,
                          htsCode: product.hts_code || undefined,
                          originCountry: product.origin_country || undefined,
                          hasEnglishTitle: completeness.checks.englishTitle,
                          hasHtml: !!product.html_content,
                          hasShipping: !!(product.shipping_cost_usd || product.usa_shipping_policy_name),
                          isVeroBrand: product.is_vero_brand || false,
                          selected: selectedIds.has(String(product.id)),
                          onSelect: handleToggleSelect,
                          onDetail: (id) => {
                            const p = displayProducts.find(x => String(x.id) === id);
                            if (p) handleRowClick(p);
                          },
                        };
                      })}
                      columns="auto"
                      gap={8}
                      minCardWidth={160}
                    />
                  </>
                )}
              </div>
            )}

            {/* 他のL2タブ（棚卸しタブ以外） */}
            {!isInventoryActive && activeL2Tab !== 'basic-edit' && (
              <div style={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {activeL2Tab === 'logistics' && 'ロジスティクスコンテンツ'}
                {activeL2Tab === 'compliance' && '関税・法令コンテンツ'}
                {activeL2Tab === 'media' && 'メディアコンテンツ'}
                {activeL2Tab === 'history' && '履歴・監査コンテンツ'}
              </div>
            )}
          </div>
        </ErrorBoundary>

        {/* ページネーション - 棚卸しタブ以外のみ表示 */}
        {!isInventoryActive && (
          <div style={{ flexShrink: 0 }}>
            <N3Pagination
              total={total}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[10, 50, 100, 500]}
            />
          </div>
        )}

        {/* フッター */}
        <N3Footer
          copyright="© 2025 N3 Platform"
          version="v3.0.0 (N3)"
          status={{ label: 'DB', connected: !error }}
          links={[
            { id: 'docs', label: 'ドキュメント', href: '#' },
            { id: 'support', label: 'サポート', href: '#' },
          ]}
        />
      </div>

      {/* 右サイドバー（棚卸しタブで商品選択時のみ表示） */}
      {isInventoryActive && showGroupingPanel && (
        <N3GroupingPanel
          selectedProducts={inventoryData.filteredProducts.filter(
            p => inventorySelectedIds.has(String(p.id))
          )}
          onClose={() => setShowGroupingPanel(false)}
          onClearSelection={() => {
            setInventorySelectedIds(new Set());
            setShowGroupingPanel(false);
          }}
          onCreateVariation={async () => {
            if (inventorySelectedIds.size < 2) {
              showToast('❌ 2件以上選択してください', 'error');
              return;
            }
            const selectedProds = inventoryData.filteredProducts.filter(
              p => inventorySelectedIds.has(String(p.id))
            );
            // バリエーション作成（全商品をmemberIdsに含める）
            const allSelectedIds = selectedProds.map(p => String(p.id));
            const result = await variationCreation.createVariation({
              memberIds: allSelectedIds,  // 全選択商品を子SKUとして渡す
              variationTitle: selectedProds[0].title || 'バリエーション商品',
            });
            if (result.success) {
              showToast(`✅ バリエーション作成完了`, 'success');
              setInventorySelectedIds(new Set());
              setShowGroupingPanel(false);
              inventoryData.refreshData();
            } else {
              showToast(`❌ ${result.error}`, 'error');
            }
          }}
          onCreateSet={async () => {
            if (inventorySelectedIds.size < 2) {
              showToast('❌ 2件以上選択してください', 'error');
              return;
            }
            const selectedProds = inventoryData.filteredProducts.filter(
              p => inventorySelectedIds.has(String(p.id))
            );
            const quantities = selectedProds.reduce((acc, p) => {
              acc[String(p.id)] = 1;
              return acc;
            }, {} as Record<string, number>);
            
            const result = await setCreation.createSet({
              name: `SET_${Date.now()}`,
              memberIds: selectedProds.map(p => String(p.id)),
              quantities,
            });
            
            if (result.success) {
              showToast(`✅ セット商品作成完了`, 'success');
              setInventorySelectedIds(new Set());
              setShowGroupingPanel(false);
              inventoryData.refreshData();
            } else {
              showToast(`❌ ${result.error}`, 'error');
            }
          }}
          onProductClick={(product) => {
            showToast(`📝 商品詳細: ${product.title || product.product_name}`, 'success');
          }}
        />
      )}

      {/* モーダル群 */}
      {modals.selectedProduct && (
        <ProductModal
          product={modals.selectedProduct}
          onClose={modals.closeProductModal}
          onSave={(updates) => crudOps.handleModalSave(modals.selectedProduct!, updates, modals.closeProductModal)}
          onRefresh={loadProducts}
        />
      )}

      {modals.showPasteModal && (
        <Suspense fallback={<ModalLoading />}>
          <PasteModal onClose={modals.closePasteModal} onComplete={loadProducts} />
        </Suspense>
      )}

      {modals.showCSVModal && (
        <Suspense fallback={<ModalLoading />}>
          <CSVUploadModal onClose={modals.closeCSVModal} onComplete={loadProducts} />
        </Suspense>
      )}

      {modals.showAIEnrichModal && modals.enrichTargetProduct && (
        <Suspense fallback={<ModalLoading />}>
          <AIDataEnrichmentModal
            product={modals.enrichTargetProduct}
            onClose={modals.closeAIEnrichModal}
            onSave={async (success) => { if (success) await loadProducts(); modals.closeAIEnrichModal(); }}
          />
        </Suspense>
      )}

      {modals.showMarketResearchModal && (
        <Suspense fallback={<ModalLoading />}>
          <AIMarketResearchModal
            products={selectedProducts}
            onClose={modals.closeMarketResearchModal}
            onComplete={async () => { await loadProducts(); modals.closeMarketResearchModal(); }}
          />
        </Suspense>
      )}

      {modals.showGeminiBatchModal && (
        <Suspense fallback={<ModalLoading />}>
          <GeminiBatchModal
            selectedIds={selectedIds}
            onClose={modals.closeGeminiBatchModal}
            onComplete={async () => { await loadProducts(); modals.closeGeminiBatchModal(); }}
          />
        </Suspense>
      )}

      {modals.showHTMLPanel && (
        <Suspense fallback={<ModalLoading />}>
          <HTMLPublishPanel selectedProducts={selectedProducts} onClose={modals.closeHTMLPanel} />
        </Suspense>
      )}

      {modals.showPricingPanel && (
        <Suspense fallback={<ModalLoading />}>
          <PricingStrategyPanel selectedProducts={selectedProducts} onClose={modals.closePricingPanel} />
        </Suspense>
      )}

      {/* N3画像一括アップロードモーダル */}
      <N3BulkImageUploadModal
        isOpen={showBulkImageUploadModal}
        onClose={() => setShowBulkImageUploadModal(false)}
        onSuccess={() => {
          showToast('✅ 画像アップロード完了', 'success');
          inventoryData.refreshData();
        }}
      />

      {/* 棚卸し商品詳細モーダル */}
      <N3InventoryDetailModal
        product={selectedInventoryProduct}
        isOpen={showInventoryDetailModal}
        onClose={() => {
          setShowInventoryDetailModal(false);
          setSelectedInventoryProduct(null);
        }}
        onStockChange={async (id: string, newQuantity: number) => {
          const result = await inventorySync.updateStock(id, newQuantity);
          if (result.success) {
            inventoryData.updateLocalProduct(id, { physical_quantity: newQuantity });
            showToast(`✅ 在庫数を更新しました`, 'success');
          } else {
            showToast(`❌ ${result.error}`, 'error');
          }
        }}
        onCostChange={async (id: string, newCost: number) => {
          const result = await inventorySync.updateCost(id, newCost);
          if (result.success) {
            inventoryData.updateLocalProduct(id, { cost_price: newCost, cost_jpy: newCost });
            showToast(`✅ 原価を更新しました`, 'success');
          } else {
            showToast(`❌ ${result.error}`, 'error');
          }
        }}
      />

      {/* ProductEnrichmentFlowモーダル */}
      {showEnrichmentFlowModal && enrichmentFlowProduct && (
        <Suspense fallback={<ModalLoading />}>
          <ProductEnrichmentFlow
            product={enrichmentFlowProduct}
            onClose={() => {
              setShowEnrichmentFlowModal(false);
              setEnrichmentFlowProduct(null);
            }}
            onComplete={async () => {
              await loadProducts();
              setShowEnrichmentFlowModal(false);
              setEnrichmentFlowProduct(null);
            }}
            onRunSMAnalysis={async (productId) => {
              const result = await runBatchSellerMirror([productId]);
              return result.success;
            }}
            onRunCalculations={async (productId) => {
              await runBatchShipping([productId]);
              await runBatchProfit([productId]);
              return true;
            }}
            onRunFilter={async (productId) => true}
            onRunScore={async (productId) => {
              await runBatchScores([{ id: productId }] as any);
              return true;
            }}
          />
        </Suspense>
      )}

      {/* 新規商品作成モーダル */}
      <N3NewProductModal
        isOpen={showNewProductModal}
        onClose={() => setShowNewProductModal(false)}
        onSubmit={async (productData: NewProductData) => {
          try {
            const result = await inventorySync.createProduct(productData);
            if (result.success) {
              showToast('✅ 商品を登録しました', 'success');
              inventoryData.refreshData();
              return { success: true };
            } else {
              return { success: false, error: result.error };
            }
          } catch (err: any) {
            return { success: false, error: err.message };
          }
        }}
      />

      {/* トースト通知 */}
      {toast && (
        <div
          className={`fixed bottom-20 right-8 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* プロセス中インジケーター */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998]">
          <div className="rounded-lg p-6 max-w-md" style={{ background: 'var(--panel)' }}>
            <div className="text-center">
              <div className="mb-4">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent)' }} />
              </div>
              <div className="text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>処理中...</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{currentStep}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
