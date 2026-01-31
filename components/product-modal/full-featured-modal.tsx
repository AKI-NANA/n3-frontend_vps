'use client';

// FullFeaturedModal - V9.3 - 国内/海外タブ切り替え対応版
// デザインシステムV4 Sharp & Solid 完全準拠
// 全13タブ + 言語自動切替 + 海外/国内マーケットプレイス対応
// 最適化: タブ遅延ロード + useCallback + 自動保存
// V9.3: 国内販路（Qoo10等）用タブセット追加

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useState, useEffect, useCallback, lazy, Suspense, useMemo } from 'react';
import type { Product } from '@/types/product';
import { useAutoSave } from './hooks/use-auto-save';

// コアコンポーネント（必須）
import { ModalHeader } from './components/modal-header';
import { MarketplaceSelector, MARKETPLACE_CONFIG } from './components/marketplace-selector';
import { TabNavigation } from './components/tab-navigation';
import { ModalFooter } from './components/modal-footer';

// タブ設定
import { getMarketplaceType, isDomesticMarketplace } from './config/tab-config';

// タブの遅延ロード（海外用）
const TabOverview = lazy(() => import('./components/Tabs/tab-overview').then(m => ({ default: m.TabOverview })));
const TabData = lazy(() => import('./components/Tabs/tab-data').then(m => ({ default: m.TabData })));
const TabImages = lazy(() => import('./components/Tabs/tab-images').then(m => ({ default: m.TabImages })));
const TabTools = lazy(() => import('./components/Tabs/tab-tools').then(m => ({ default: m.TabTools })));
const TabMirror = lazy(() => import('./components/Tabs/tab-mirror').then(m => ({ default: m.TabMirror })));
const TabCompetitors = lazy(() => import('./components/Tabs/tab-competitors').then(m => ({ default: m.TabCompetitors })));
const TabPricingStrategy = lazy(() => import('./components/Tabs/tab-pricing-strategy').then(m => ({ default: m.TabPricingStrategy })));
const TabListing = lazy(() => import('./components/Tabs/tab-listing').then(m => ({ default: m.TabListing })));
const TabShipping = lazy(() => import('./components/Tabs/tab-shipping').then(m => ({ default: m.TabShipping })));
const TabTaxCompliance = lazy(() => import('./components/Tabs/tab-tax-compliance').then(m => ({ default: m.TabTaxCompliance })));
const TabHTML = lazy(() => import('./components/Tabs/tab-html').then(m => ({ default: m.TabHTML })));
const TabFinal = lazy(() => import('./components/Tabs/tab-final').then(m => ({ default: m.TabFinal })));
const TabQoo10 = lazy(() => import('./components/Tabs/tab-qoo10').then(m => ({ default: m.TabQoo10 })));
const TabMultiListing = lazy(() => import('./components/Tabs/tab-multi-listing').then(m => ({ default: m.TabMultiListing })));
const TabSMAnalysis = lazy(() => import('./components/Tabs/tab-sm-analysis').then(m => ({ default: m.TabSMAnalysis })));

// タブの遅延ロード（国内用）
const TabDataDomestic = lazy(() => import('./components/Tabs/tab-data-domestic').then(m => ({ default: m.TabDataDomestic })));
const TabImagesDomestic = lazy(() => import('./components/Tabs/tab-images-domestic').then(m => ({ default: m.TabImagesDomestic })));
const TabPricingDomestic = lazy(() => import('./components/Tabs/tab-pricing-domestic').then(m => ({ default: m.TabPricingDomestic })));
const TabShippingDomestic = lazy(() => import('./components/Tabs/tab-shipping-domestic').then(m => ({ default: m.TabShippingDomestic })));
const TabHTMLDomestic = lazy(() => import('./components/Tabs/tab-html-domestic').then(m => ({ default: m.TabHTMLDomestic })));
const TabFinalDomestic = lazy(() => import('./components/Tabs/tab-final-domestic').then(m => ({ default: m.TabFinalDomestic })));

export interface FullFeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave?: (updates: any) => void;
  onRefresh?: () => void;
}

export function FullFeaturedModal({ isOpen, onClose, product, onSave, onRefresh }: FullFeaturedModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [marketplace, setMarketplace] = useState('ebay-us');
  const [language, setLanguage] = useState<'ja' | 'en'>('en');
  const [refreshKey, setRefreshKey] = useState(0);

  const mpConfig = MARKETPLACE_CONFIG[marketplace] || MARKETPLACE_CONFIG['ebay-us'];
  
  // 国内販路かどうか
  const isDomestic = useMemo(() => isDomesticMarketplace(marketplace), [marketplace]);

  // 自動保存フック
  const {
    handleFieldChange,
    handleBatchChange,
    forceSave,
    unsavedChanges,
    saving,
    checkUnsavedChanges,
    saveStatus,
  } = useAutoSave(
    product?.id || '',
    async (updates) => {
      const response = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product?.id, updates })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || '保存に失敗しました');
      onSave?.(updates);
    },
    { debounceMs: 2000, showToast: true }
  );

  // マーケットプレイス変更時に言語を自動切り替え
  useEffect(() => {
    const config = MARKETPLACE_CONFIG[marketplace];
    if (config) setLanguage(config.language);
  }, [marketplace]);

  // 保存ハンドラー
  const handleSave = useCallback((updates: any) => {
    if (typeof updates === 'object' && Object.keys(updates).length > 1) {
      handleBatchChange(updates);
    } else if (typeof updates === 'object') {
      const [field, value] = Object.entries(updates)[0];
      handleFieldChange(field, value);
    }
  }, [handleFieldChange, handleBatchChange]);

  // モーダルを閉じる
  const handleClose = useCallback(() => {
    if (checkUnsavedChanges()) onClose();
  }, [checkUnsavedChanges, onClose]);

  // データ再読み込み
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    onRefresh?.();
  }, [onRefresh]);

  // タブコンテンツ（国内/海外で切り替え）
  const renderTabContent = useCallback(() => {
    const LoadingFallback = () => (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <div style={{ marginTop: '1rem', fontSize: '14px' }}>読み込み中...</div>
      </div>
    );

    // === 国内販路（Qoo10, Amazon JP等） ===
    if (isDomestic) {
      return (
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'overview' && <TabOverview product={product} marketplace={marketplace} />}
          {activeTab === 'data' && <TabDataDomestic product={product} marketplace={marketplace} onSave={handleSave} />}
          {activeTab === 'images' && <TabImagesDomestic product={product} marketplace={marketplace} onSave={handleSave} />}
          {activeTab === 'pricing' && <TabPricingDomestic product={product} marketplace={marketplace} onSave={handleSave} />}
          {activeTab === 'qoo10' && <TabQoo10 product={product} onSave={handleSave} />}
          {activeTab === 'shipping' && <TabShippingDomestic product={product} marketplace={marketplace} onSave={handleSave} />}
          {activeTab === 'html' && <TabHTMLDomestic product={product} marketplace={marketplace} onSave={handleSave} />}
          {activeTab === 'final' && <TabFinalDomestic product={product} marketplace={marketplace} onSave={handleSave} />}
          {activeTab === 'multi-listing' && <TabMultiListing product={product} onSave={handleSave} onRefresh={handleRefresh} />}
        </Suspense>
      );
    }

    // === 海外販路（eBay US/UK/DE等） ===
    return (
      <Suspense fallback={<LoadingFallback />}>
        {activeTab === 'overview' && <TabOverview product={product} marketplace={marketplace} />}
        {activeTab === 'data' && <TabData product={product} />}
        {activeTab === 'images' && <TabImages key={`images-${refreshKey}`} product={product} maxImages={mpConfig.maxImages} marketplace={marketplace} onSave={handleSave} onRefresh={handleRefresh} />}
        {activeTab === 'tools' && <TabTools product={product} onSave={handleSave} onRefresh={handleRefresh} />}
        {activeTab === 'mirror' && <TabMirror product={product} />}
        {activeTab === 'competitors' && <TabCompetitors product={product} />}
        {activeTab === 'pricing' && <TabPricingStrategy product={product} onTabChange={setActiveTab} onSave={handleSave} />}
        {activeTab === 'qoo10' && <TabQoo10 product={product} onSave={handleSave} />}
        {activeTab === 'listing' && <TabListing product={product} marketplace={marketplace} marketplaceName={mpConfig.name} />}
        {activeTab === 'shipping' && <TabShipping product={product} marketplace={marketplace} marketplaceName={mpConfig.name} />}
        {activeTab === 'tax' && <TabTaxCompliance product={product} />}
        {activeTab === 'html' && <TabHTML product={product} />}
        {activeTab === 'final' && <TabFinal product={product} marketplace={marketplace} marketplaceName={mpConfig.name} onSave={handleSave} />}
        {activeTab === 'multi-listing' && <TabMultiListing product={product} onSave={handleSave} onRefresh={handleRefresh} />}
      </Suspense>
    );
  }, [activeTab, product, marketplace, mpConfig.maxImages, mpConfig.name, handleSave, handleRefresh, isDomestic, refreshKey]);

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9998,
          }}
        />
        {isOpen && (
          <DialogPrimitive.Content
            aria-describedby={undefined}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95vw',
              maxWidth: '1600px',
              height: '92vh',
              maxHeight: '900px',
              background: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9999,
            }}
          >
            <DialogPrimitive.Title style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>
              商品編集モーダル
            </DialogPrimitive.Title>

            {/* ヘッダー */}
            <div style={{ position: 'relative' }}>
              <ModalHeader product={product} onClose={handleClose} language={language} onLanguageChange={setLanguage} />
              
              {(saving || unsavedChanges || saveStatus) && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 500,
                  background: saving ? '#fef3c7' : unsavedChanges ? '#fee2e2' : '#dcfce7',
                  color: saving ? '#92400e' : unsavedChanges ? '#991b1b' : '#166534',
                  border: `1px solid ${saving ? '#fcd34d' : unsavedChanges ? '#fca5a5' : '#86efac'}`,
                }}>
                  {saving && <i className="fas fa-spinner fa-spin"></i>}
                  {!saving && unsavedChanges && <i className="fas fa-exclamation-circle"></i>}
                  {!saving && !unsavedChanges && <i className="fas fa-check-circle"></i>}
                  <span>{saveStatus || (unsavedChanges ? '未保存' : '保存済み')}</span>
                </div>
              )}
            </div>

            <MarketplaceSelector current={marketplace} onChange={setMarketplace} />
            <TabNavigation current={activeTab} onChange={setActiveTab} marketplace={marketplace} isDomestic={isDomestic} />

            <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {renderTabContent()}
            </div>

            <ModalFooter currentTab={activeTab} onTabChange={setActiveTab} onSave={forceSave} onClose={handleClose} />
          </DialogPrimitive.Content>
        )}
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
