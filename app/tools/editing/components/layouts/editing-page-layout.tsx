// app/tools/editing/components/layouts/editing-page-layout.tsx
/**
 * Editing Page Layout - 専用ヘッダー版
 * 
 * Design Catalog の「📐 Layout（ページ構成）」と同じ動作:
 * - ホバー時: パネルがコンテンツの上に重なる (absolute, 背景色あり)
 * - ピン留め時: パネルがコンテンツを押し下げる (通常フロー)
 */

'use client';

import { useState, useEffect, useRef, useCallback, memo, Suspense, lazy } from 'react';
import { 
  Edit3, Truck, Shield, Image as ImageIcon, History,
  Wrench, GitBranch, Filter,
  User, LogOut, Settings, HelpCircle,
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
} from '@/components/n3';

// 軽量コンポーネント（即座に読み込み）
import { ToolPanel } from '../tool-panel';
import { BasicEditTab } from '../basic-edit-tab';
import { LogisticsContent, ComplianceContent, MediaContent, HistoryContent } from '../l2-tab-contents';
import { ProductModal } from '../product-modal';
import { MarketplaceSelector } from '../marketplace-selector';

// 重いモーダル（遅延読み込み）
const PasteModal = lazy(() => import('../paste-modal').then(m => ({ default: m.PasteModal })));
const CSVUploadModal = lazy(() => import('../csv-upload-modal').then(m => ({ default: m.CSVUploadModal })));
const AIDataEnrichmentModal = lazy(() => import('../ai-data-enrichment-modal').then(m => ({ default: m.AIDataEnrichmentModal })));
const AIMarketResearchModal = lazy(() => import('../ai-market-research-modal').then(m => ({ default: m.AIMarketResearchModal })));
const GeminiBatchModal = lazy(() => import('../gemini-batch-modal').then(m => ({ default: m.GeminiBatchModal })));
const HTMLPublishPanel = lazy(() => import('../html-publish-panel').then(m => ({ default: m.HTMLPublishPanel })));
const PricingStrategyPanel = lazy(() => import('../pricing-strategy-panel').then(m => ({ default: m.PricingStrategyPanel })));
const ItemSpecificsEditorModal = lazy(() => import('../item-specifics-editor-modal').then(m => ({ default: m.ItemSpecificsEditorModal })));

// フック
import { useProductData } from '../../hooks/use-product-data';
import { useBatchProcess } from '../../hooks/use-batch-process';
import { useBasicEdit } from '../../hooks/use-basic-edit';
import { useUIState, L2TabId } from '../../hooks/use-ui-state';
import { useToast } from '../../hooks/use-toast';
import { useModals } from '../../hooks/use-modals';
import { useSelection } from '../../hooks/use-selection';
import { useMarketplace } from '../../hooks/use-marketplace';
import { useProductInteraction } from '../../hooks/use-product-interaction';
import { useExportOperations } from '../../hooks/use-export-operations';
import { useCRUDOperations } from '../../hooks/use-crud-operations';
import { useMirrorSelectionStore } from '@/store/mirrorSelectionStore';

// 型定義
import type { Product } from '../../types/product';

// ============================================================
// 定数
// ============================================================

// L2タブの定義
const L2_TABS = [
  { id: 'basic-edit' as L2TabId, label: '基本編集', labelEn: 'Basic', icon: Edit3 },
  { id: 'logistics' as L2TabId, label: 'ロジスティクス', labelEn: 'Logistics', icon: Truck },
  { id: 'compliance' as L2TabId, label: '関税・法令', labelEn: 'Compliance', icon: Shield },
  { id: 'media' as L2TabId, label: 'メディア', labelEn: 'Media', icon: ImageIcon },
  { id: 'history' as L2TabId, label: '履歴・監査', labelEn: 'History', icon: History },
];

// パネルタブの定義
type PanelTabId = 'tools' | 'flow' | 'filter';

const PANEL_TABS: { id: PanelTabId; label: string; icon: React.ReactNode }[] = [
  { id: 'tools', label: 'ツール', icon: <Wrench size={14} /> },
  { id: 'flow', label: 'フロー', icon: <GitBranch size={14} /> },
  { id: 'filter', label: 'マーケットプレイス', icon: <Filter size={14} /> },
];

// World clocks config
const CLOCKS_CONFIG = [
  { label: "LA", tz: "America/Los_Angeles" },
  { label: "NY", tz: "America/New_York" },
  { label: "DE", tz: "Europe/Berlin" },
  { label: "JP", tz: "Asia/Tokyo" },
];

const HEADER_HEIGHT = 48;

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

export function EditingPageLayout() {
  const { user, logout } = useAuth();
  
  // ========================================
  // ヘッダー状態（Design Catalogと同じパターン）
  // ========================================
  const [pinnedTab, setPinnedTab] = useState<PanelTabId | null>(null);
  const [hoveredTab, setHoveredTab] = useState<PanelTabId | null>(null);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isPinned = pinnedTab !== null;
  const activeTab = pinnedTab || hoveredTab;

  // ヘッダー右側の状態
  const [times, setTimes] = useState<Record<string, string>>({});
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // ========================================
  // データフック
  // ========================================
  const {
    products, loading, error, modifiedIds, total, pageSize, currentPage,
    setPageSize, setCurrentPage, loadProducts, updateLocalProduct,
    saveAllModified, deleteProducts,
  } = useProductData();

  const {
    processing, currentStep, runBatchCategory, runBatchShipping,
    runBatchProfit, runBatchHTMLGenerate, runBatchSellerMirror,
    runBatchScores, runAllProcesses,
  } = useBatchProcess(loadProducts);

  const {
    activeL2Tab, setActiveL2Tab, viewMode, setViewMode,
    wrapText, setWrapText, language, setLanguage, useVirtualScroll, listFilter, setListFilter,
  } = useUIState(products.length);

  const { toast, showToast } = useToast();
  const modals = useModals();
  const { selectedIds, setSelectedIds, deselectAll, getSelectedProducts } = useSelection();
  const { marketplaces, setMarketplaces } = useMarketplace();
  const { handleProductHover, handleProductClick } = useProductInteraction();
  const { getAllSelected, clearAll } = useMirrorSelectionStore();

  // 🔥 ページ読み込み時にlocalStorageの古いMirror選択をクリア
  useEffect(() => {
    const oldSelections = getAllSelected();
    if (oldSelections.length > 0) {
      console.log('🧹 ページ読み込み時に古いMirror選択をクリア:', oldSelections.length, '件');
      clearAll();
    }
  }, []); // 初回マウント時のみ実行

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

  // ========================================
  // ヘッダーハンドラー（Design Catalogと同じ）
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
      // 同じタブをクリック → 固定解除
      setPinnedTab(null);
      setHoveredTab(null);
      setIsHeaderHovered(false);
    } else {
      // 別のタブをクリック → そのタブを固定
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
  // パネルコンテンツ
  // ========================================
  const getPanelContent = (tabId: PanelTabId | null) => {
    switch (tabId) {
      case 'tools':
        return (
          <ToolPanel
            modifiedCount={modifiedIds.size}
            readyCount={readyCount}
            processing={processing}
            currentStep={currentStep}
            onRunAll={basicEditHandlers.handleRunAll}
            onPaste={modals.openPasteModal}
            onCategory={basicEditHandlers.handleCategory}
            onShipping={basicEditHandlers.handleShipping}
            onProfit={basicEditHandlers.handleProfit}
            onHTML={basicEditHandlers.handleHTML}
            onHTSFetch={basicEditHandlers.handleHTSFetch}
            onHTSClassification={modals.openGeminiBatchModal}
            onOriginCountryFetch={basicEditHandlers.handleOriginCountryFetch}
            onMaterialFetch={basicEditHandlers.handleMaterialFetch}
            onDutyRatesLookup={basicEditHandlers.handleDutyRatesLookup}
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
            onScores={() => runBatchScores(products)}
            onSave={crudOps.handleSaveAll}
            onDelete={crudOps.handleDelete}
            onExport={exportOps.handleExport}
            onExportEbay={exportOps.handleExportEbay}
            onExportYahoo={exportOps.handleExportYahoo}
            onExportMercari={exportOps.handleExportMercari}
            onAIExport={exportOps.handleAIExport}
            onList={exportOps.handleList}
            onLoadData={loadProducts}
            onCSVUpload={modals.openCSVModal}
            onBulkResearch={basicEditHandlers.handleBulkResearch}
            onBatchFetchDetails={basicEditHandlers.handleBatchFetchDetails}
            selectedMirrorCount={selectedMirrorCount}
            onAIEnrich={basicEditHandlers.handleAIEnrich}
            onFilterCheck={basicEditHandlers.handleFilterCheck}
            onPricingStrategy={modals.openPricingPanel}
            onMarketResearch={modals.openMarketResearchModal}
            onTranslate={basicEditHandlers.handleTranslate}
            onGenerateGeminiPrompt={basicEditHandlers.handleGenerateGeminiPrompt}
            onFinalProcessChain={basicEditHandlers.handleFinalProcessChain}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            wrapText={wrapText}
            onWrapTextChange={setWrapText}
          />
        );
      case 'flow':
        return (
          <div className="p-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            FLOWパネルは次のステップで実装予定
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
      className="editing-page-wrapper"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        marginLeft: 'var(--sidebar-width)',
        paddingTop: HEADER_HEIGHT,
      }}
    >
      {/* ========================================
          ヘッダー部分（fixedで画面上部に固定）
          ======================================== */}
      <div className="editing-header-area" onMouseLeave={handleMouseLeave}>
        {/* ヘッダーバー */}
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 'var(--sidebar-width)',
            right: 0,
            height: HEADER_HEIGHT,
            display: 'flex',
            alignItems: 'stretch',
            background: 'var(--glass)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--glass-border)',
            zIndex: 40,
          }}
          onMouseEnter={handleMouseEnter}
        >
          {/* Left - タブ */}
          <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingRight: 16 }}>
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

        {/* ホバーパネル (fixed, 重なる、背景色あり) */}
        {showHoverPanel && (
          <div
            style={{
              position: 'fixed',
              top: HEADER_HEIGHT,
              left: 'var(--sidebar-width)',
              right: 0,
              padding: 6,
              background: 'var(--panel)',
              borderBottom: '1px solid var(--panel-border)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 100,
              maxHeight: '60vh',
              overflowY: 'auto',
            }}
            onMouseEnter={handleMouseEnter}
          >
            {getPanelContent(hoveredTab)}
          </div>
        )}
      </div>

      {/* ========================================
          ピン留めパネル (通常フロー - 押し下げる)
          ======================================== */}
      {isPinned && (
        <div
          style={{
            flexShrink: 0,
            padding: 6,
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
          }}
        >
          {getPanelContent(pinnedTab)}
        </div>
      )}

      {/* ========================================
          メインコンテンツ
          ======================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* L2タブナビゲーション */}
        <div className="n3-l2-tabs-container">
          <div className="n3-l2-tabs">
            {L2_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveL2Tab(tab.id)}
                  className={`n3-l2-tab ${activeL2Tab === tab.id ? 'active' : ''}`}
                >
                  <Icon size={14} />
                  <span>{language === 'ja' ? tab.label : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* メインコンテンツ（Error Boundaryで保護） */}
        <ErrorBoundary componentName="EditingMainContent">
          <div className="n3-page-content" style={{ flex: 1 }}>
            {activeL2Tab === 'basic-edit' && (
              <BasicEditTab
                products={products}
                selectedIds={selectedIds}
                modifiedIds={modifiedIds}
                onSelectChange={setSelectedIds}
                onCellChange={updateLocalProduct}
                onProductClick={(product) => handleProductClick(product, modals.openProductModal)}
                onProductHover={handleProductHover}
                onShowToast={showToast}
                onLoadProducts={loadProducts}
                updateLocalProduct={updateLocalProduct}
                getAllSelected={getAllSelected}
                clearAll={clearAll}
                wrapText={wrapText}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onWrapTextChange={setWrapText}
                processing={processing}
                currentStep={currentStep}
                total={total}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageSizeChange={setPageSize}
                onPageChange={setCurrentPage}
                onListFilterChange={setListFilter}
                useVirtualScroll={useVirtualScroll}
                runBatchCategory={runBatchCategory}
                runBatchShipping={runBatchShipping}
                runBatchProfit={runBatchProfit}
                runBatchHTMLGenerate={runBatchHTMLGenerate}
                runBatchSellerMirror={runBatchSellerMirror}
                runBatchScores={runBatchScores}
                runAllProcesses={runAllProcesses}
                onPaste={modals.openPasteModal}
                onSave={crudOps.handleSaveAll}
                onDelete={crudOps.handleDelete}
                onExport={exportOps.handleExport}
                onExportEbay={exportOps.handleExportEbay}
                onExportYahoo={exportOps.handleExportYahoo}
                onExportMercari={exportOps.handleExportMercari}
                onAIExport={exportOps.handleAIExport}
                onList={exportOps.handleList}
                onCSVUpload={modals.openCSVModal}
                selectedMirrorCount={selectedMirrorCount}
                onPricingStrategy={modals.openPricingPanel}
                onMarketResearch={modals.openMarketResearchModal}
                onHTSClassification={modals.openGeminiBatchModal}
                showToolPanel={false}
              />
            )}

            {activeL2Tab === 'logistics' && (
              <LogisticsContent
                products={selectedProducts}
                onRunBatchShipping={() => runBatchShipping(Array.from(selectedIds))}
                onRunBatchProfit={() => runBatchProfit(Array.from(selectedIds))}
              />
            )}

            {activeL2Tab === 'compliance' && (
              <ComplianceContent
                products={selectedProducts}
                onRunBatchCategory={() => runBatchCategory(Array.from(selectedIds))}
              />
            )}

            {activeL2Tab === 'media' && <MediaContent products={selectedProducts} />}
            {activeL2Tab === 'history' && <HistoryContent products={selectedProducts} />}
          </div>
        </ErrorBoundary>
      </div>

      {/* モーダル群（遅延読み込み + Suspense） */}
      {modals.selectedProduct && (
        <ProductModal
          product={modals.selectedProduct}
          onClose={modals.closeProductModal}
          onSave={(updates) => crudOps.handleModalSave(modals.selectedProduct!, updates, modals.closeProductModal)}
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

      {/* Item Specifics編集モーダル */}
      {basicEditHandlers.showItemSpecificsModal && basicEditHandlers.itemSpecificsTarget && (
        <Suspense fallback={<ModalLoading />}>
          <ItemSpecificsEditorModal
            product={basicEditHandlers.itemSpecificsTarget.product}
            competitorDetails={basicEditHandlers.itemSpecificsTarget.competitorDetails}
            onClose={basicEditHandlers.handleCloseItemSpecificsModal}
            onSave={async (data) => {
              try {
                const response = await fetch('/api/products/save-item-specifics', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    productId: basicEditHandlers.itemSpecificsTarget!.product.id,
                    ...data
                  })
                });
                const result = await response.json();
                if (result.success) {
                  showToast(`✅ Item Specificsを保存しました`, 'success');
                  await loadProducts();
                } else {
                  throw new Error(result.error);
                }
              } catch (err: any) {
                showToast(`❌ ${err.message || '保存に失敗しました'}`, 'error');
              }
              basicEditHandlers.handleCloseItemSpecificsModal();
            }}
          />
        </Suspense>
      )}

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
