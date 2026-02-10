/**
 * N3ProductModal - N3コンポーネントで構成された商品編集モーダル
 * 
 * 特徴:
 * - N3Modal + N3ModalHeader + N3ModalTabNavigation + N3ModalBody + N3ModalFooter
 * - 全てN3コンポーネントで構成
 * - マーケットプレイス切り替え対応
 * - タブ構成（遅延読み込み対応）
 * - 自動保存機能対応
 * 
 * 参考: /components/product-modal/full-featured-modal.tsx
 */

'use client';

import React, {
  memo,
  useState,
  useEffect,
  useCallback,
  lazy,
  Suspense,
  ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

// N3 コンポーネント
import { N3Badge } from '../presentational/n3-badge';
import { N3Button } from '../presentational/n3-button';
import { N3Loading, N3LoadingDots } from './n3-loading';
import { DomesticTabRenderer, isDomesticTab } from './domestic-tab-renderer';
import { N3ModalHeader } from './n3-modal-header';
import { N3ModalFooter } from './n3-modal-footer';
import { N3ModalBody } from './n3-modal-body';
import {
  N3ModalTabNavigation,
  DEFAULT_PRODUCT_MODAL_TABS,
  type ModalTab,
} from './n3-modal-tab-navigation';
import {
  N3MarketplaceSelector,
  MARKETPLACE_CONFIG,
  DOMESTIC_MARKETPLACE_IDS,
} from './n3-marketplace-selector';

// Lucide icons
import { X, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

export interface ProductData {
  id: string;
  sku?: string;
  title?: string;
  englishTitle?: string;
  costPrice?: number;
  priceJpy?: number;
  currentStock?: number;
  profitAmountUsd?: number;
  profitMargin?: number;
  listingStatus?: 'active' | 'draft' | 'ended' | 'pending';
  primaryImageUrl?: string;
  galleryImages?: string[];
  updatedAt?: string | Date;
  // その他フィールドは any で許容
  [key: string]: any;
}

export interface N3ProductModalProps {
  /** モーダル開閉状態 */
  open: boolean;
  /** 閉じるハンドラ */
  onClose: () => void;
  /** 商品データ */
  product: ProductData | null;
  /** 保存ハンドラ */
  onSave?: (updates: Partial<ProductData>) => void | Promise<void>;
  /** 削除ハンドラ */
  onDelete?: () => void | Promise<void>;
  /** 前の商品へ移動 */
  onPrev?: () => void;
  /** 次の商品へ移動 */
  onNext?: () => void;
  /** 前の商品があるか */
  hasPrev?: boolean;
  /** 次の商品があるか */
  hasNext?: boolean;
  /** タブ定義（カスタマイズ可能） */
  tabs?: ModalTab[];
  /** 初期マーケットプレイス */
  initialMarketplace?: string;
  /** 初期タブ */
  initialTab?: string;
  /** タブコンテンツレンダラー */
  renderTabContent?: (tabId: string, product: ProductData, marketplace: string, language: 'ja' | 'en') => ReactNode;
  /** モーダルサイズ */
  size?: 'md' | 'lg' | 'xl' | 'full';
  /** z-index */
  zIndex?: number;
}

// ============================================================
// デフォルトのタブコンテンツ（プレースホルダー）
// ============================================================

const DefaultTabContent = memo(function DefaultTabContent({
  tabId,
  product,
  marketplace,
}: {
  tabId: string;
  product: ProductData;
  marketplace: string;
}) {
  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '1rem',
          opacity: 0.5,
        }}
      >
        📋
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text)' }}>
        {tabId.charAt(0).toUpperCase() + tabId.slice(1)} Tab
      </h3>
      <p style={{ fontSize: '13px', marginBottom: '1rem' }}>
        このタブの実装は `renderTabContent` プロップで提供してください。
      </p>
      <div
        style={{
          background: 'var(--highlight)',
          borderRadius: '8px',
          padding: '1rem',
          textAlign: 'left',
          fontSize: '11px',
          fontFamily: 'monospace',
        }}
      >
        <div>Product ID: {product.id}</div>
        <div>SKU: {product.sku || '-'}</div>
        <div>Marketplace: {marketplace}</div>
      </div>
    </div>
  );
});

// ============================================================
// N3ProductModal - メインコンポーネント
// ============================================================

export const N3ProductModal = memo(function N3ProductModal({
  open,
  onClose,
  product,
  onSave,
  onDelete,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  tabs = DEFAULT_PRODUCT_MODAL_TABS,
  initialMarketplace = 'ebay-us',
  initialTab = 'overview',
  renderTabContent,
  size = 'xl',
  zIndex = 9999,
}: N3ProductModalProps) {
  // ============================================
  // 状態管理
  // ============================================
  const [activeTab, setActiveTab] = useState(initialTab);
  const [marketplace, setMarketplace] = useState(initialMarketplace);
  const [language, setLanguage] = useState<'ja' | 'en'>('en');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving' | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  // マーケットプレイス設定
  const mpConfig = MARKETPLACE_CONFIG[marketplace] || MARKETPLACE_CONFIG['ebay-us'];
  const isDomestic = DOMESTIC_MARKETPLACE_IDS.includes(marketplace);

  // ============================================
  // ポータルターゲットを設定（テーマが適用された要素を優先）
  // ============================================
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const themeRoot = document.querySelector('[data-theme]') as HTMLElement || document.body;
      setPortalTarget(themeRoot);
    }
  }, []);

  // ============================================
  // マーケットプレイス変更時の言語自動切り替え
  // ============================================
  useEffect(() => {
    if (mpConfig?.language) {
      setLanguage(mpConfig.language);
    }
  }, [mpConfig]);

  // ============================================
  // ESCキーで閉じる
  // ============================================
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // ============================================
  // スクロールロック
  // ============================================
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  // ============================================
  // 保存処理
  // ============================================
  const handleSave = useCallback(async () => {
    if (!onSave || !product) return;

    setSaving(true);
    setSaveStatus('saving');

    try {
      await onSave({});
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('unsaved');
    } finally {
      setSaving(false);
    }
  }, [onSave, product]);

  // ============================================
  // オーバーレイクリックで閉じる
  // ============================================
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // ============================================
  // タブコンテンツのレンダリング
  // ============================================
  const renderContent = useCallback(() => {
    if (!product) {
      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '2rem',
          }}
        >
          <N3Loading message="商品データを読み込み中..." />
        </div>
      );
    }

    // 国内販路タブの場合はDomesticTabRendererを使用
    if (isDomesticTab(activeTab)) {
      return (
        <DomesticTabRenderer
          tabId={activeTab}
          product={product}
          marketplace={marketplace}
          onSave={onSave as any}
        />
      );
    }

    // 外部から提供されたレンダラーがあれば使用
    if (renderTabContent) {
      return renderTabContent(activeTab, product, marketplace, language);
    }

    // デフォルトのプレースホルダー
    return (
      <DefaultTabContent
        tabId={activeTab}
        product={product}
        marketplace={marketplace}
      />
    );
  }, [activeTab, product, marketplace, language, renderTabContent, onSave]);

  // ============================================
  // モーダルサイズ
  // ============================================
  const sizeStyle = {
    md: { width: '90vw', maxWidth: '800px', height: '80vh', maxHeight: '700px' },
    lg: { width: '92vw', maxWidth: '1200px', height: '85vh', maxHeight: '800px' },
    xl: { width: '95vw', maxWidth: '1600px', height: '92vh', maxHeight: '900px' },
    full: { width: '100vw', maxWidth: '100vw', height: '100vh', maxHeight: '100vh', borderRadius: 0 },
  }[size];

  // ============================================
  // レンダリング
  // ============================================
  if (!open) return null;

  const modal = (
    <div
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: zIndex,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          ...sizeStyle,
          background: 'var(--bg)',
          borderRadius: size === 'full' ? 0 : '8px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <N3ModalHeader
            status={product?.listingStatus || 'pending'}
            sku={product?.sku}
            title={language === 'ja' ? (product?.title || '-') : (product?.englishTitle || product?.title || '-')}
            language={language}
            onLanguageChange={setLanguage}
            onClose={onClose}
            rightContent={
              saveStatus && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 500,
                    background:
                      saveStatus === 'saving'
                        ? 'rgba(251, 191, 36, 0.1)'
                        : saveStatus === 'saved'
                        ? 'rgba(52, 211, 153, 0.1)'
                        : 'rgba(248, 113, 113, 0.1)',
                    color:
                      saveStatus === 'saving'
                        ? 'rgb(251, 191, 36)'
                        : saveStatus === 'saved'
                        ? 'rgb(52, 211, 153)'
                        : 'rgb(248, 113, 113)',
                    border: `1px solid ${
                      saveStatus === 'saving'
                        ? 'rgba(251, 191, 36, 0.3)'
                        : saveStatus === 'saved'
                        ? 'rgba(52, 211, 153, 0.3)'
                        : 'rgba(248, 113, 113, 0.3)'
                    }`,
                  }}
                >
                  {saveStatus === 'saving' && <Clock size={12} />}
                  {saveStatus === 'saved' && <CheckCircle size={12} />}
                  {saveStatus === 'unsaved' && <AlertCircle size={12} />}
                  <span>
                    {saveStatus === 'saving'
                      ? '保存中...'
                      : saveStatus === 'saved'
                      ? '保存済み'
                      : '未保存'}
                  </span>
                </div>
              )
            }
          />
        </div>

        {/* マーケットプレイス選択 */}
        <div style={{ flexShrink: 0 }}>
          <N3MarketplaceSelector
            current={marketplace}
            onChange={setMarketplace}
            size="sm"
          />
        </div>

        {/* タブナビゲーション */}
        <div style={{ flexShrink: 0 }}>
          <N3ModalTabNavigation
            tabs={tabs}
            current={activeTab}
            onChange={setActiveTab}
            marketplace={marketplace}
            domesticMarketplaces={DOMESTIC_MARKETPLACE_IDS}
            language={language}
            size="sm"
          />
        </div>

        {/* ボディ（タブコンテンツ） */}
        <N3ModalBody
          padding="none"
          scroll="auto"
          background="var(--bg)"
          style={{ flex: 1, minHeight: 0 }}
        >
          <Suspense
            fallback={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px',
                  color: 'var(--text-muted)',
                }}
              >
                <N3LoadingDots />
              </div>
            }
          >
            {renderContent()}
          </Suspense>
        </N3ModalBody>

        {/* フッター */}
        <N3ModalFooter
          updatedAt={product?.updatedAt}
          showPrev={hasPrev}
          showNext={hasNext}
          onPrev={onPrev}
          onNext={onNext}
          onCancel={onClose}
          onSave={onSave ? handleSave : undefined}
          saving={saving}
          saveText="Save"
        />
      </div>
    </div>
  );

  // ポータルでレンダリング
  if (typeof document !== 'undefined' && portalTarget) {
    return createPortal(modal, portalTarget);
  }

  return modal;
});

export default N3ProductModal;
