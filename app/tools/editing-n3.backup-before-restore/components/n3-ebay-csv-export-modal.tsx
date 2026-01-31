/**
 * N3 eBay CSV Export Modal
 * 
 * eBay File Exchange / Seller Hub Reports 形式のCSVエクスポートモーダル
 * 
 * サポートする機能:
 * - アクション: Add, Revise, Relist, VerifyAdd, Draft
 * - フォーマット: FixedPrice (GTC), Auction
 * - サイト: US, UK, AU, DE
 * - アカウント: MJT, GREEN
 * - Item Specifics: C:Brand, C:MPN, C:Type 等（カテゴリ依存）
 * - ビジネスポリシー: PolicyPayment, PolicyShipping, PolicyReturn
 * - HTML説明文対応
 * - 画像URL（最大12枚、|区切り）
 */

'use client';

import React, { useState, useCallback, useMemo, memo } from 'react';
import {
  X, Download, FileSpreadsheet, Check, AlertCircle, Loader2,
  Globe, Building2, Settings2, Package, ChevronDown, Info,
  ShoppingCart, Clock, Gavel, DollarSign, Tag, Image, FileText
} from 'lucide-react';

// シンプルなモーダルラッパー
const SimpleModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: 'var(--panel)', borderRadius: '12px', maxWidth: '720px', width: '90%', maxHeight: '90vh', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--panel-border)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}>
            <X size={20} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ============================================================
// 型定義
// ============================================================

export type EbayAction = 'Add' | 'Revise' | 'Relist' | 'VerifyAdd' | 'Draft';
export type EbayFormat = 'FixedPrice' | 'Auction';
export type EbaySite = 'US' | 'UK' | 'AU' | 'DE';
export type EbayAccount = 'MJT' | 'GREEN';
export type EbayDuration = 'GTC' | '1' | '3' | '5' | '7' | '10' | '30';

export interface EbayCSVExportOptions {
  action: EbayAction;
  format: EbayFormat;
  site: EbaySite;
  account: EbayAccount;
  duration: EbayDuration;
  includeItemSpecifics: boolean;
  includeHtml: boolean;
  includeBusinessPolicies: boolean;
  overrideQuantity: number | null;
  scheduleTime: string | null;
  groupByCategory: boolean;
}

export interface N3EbayCSVExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: any[];
  onExport: (options: EbayCSVExportOptions) => Promise<void>;
}

// ============================================================
// 定数
// ============================================================

const ACTION_OPTIONS: { value: EbayAction; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'Add', label: '新規出品 (Add)', description: '新しい商品をeBayに出品', icon: ShoppingCart },
  { value: 'Revise', label: '更新 (Revise)', description: '既存出品の情報を更新（ItemID必須）', icon: Settings2 },
  { value: 'Relist', label: '再出品 (Relist)', description: '終了した出品を再出品（ItemID必須）', icon: Clock },
  { value: 'VerifyAdd', label: '検証 (VerifyAdd)', description: '出品せずにエラーチェックのみ', icon: Check },
  { value: 'Draft', label: '下書き (Draft)', description: 'Seller Hubの下書きとして保存', icon: FileText },
];

const FORMAT_OPTIONS: { value: EbayFormat; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'FixedPrice', label: '定額出品', description: 'Buy It Now / 即決価格', icon: DollarSign },
  { value: 'Auction', label: 'オークション', description: '競売形式', icon: Gavel },
];

const SITE_OPTIONS: { value: EbaySite; label: string; flag: string; currency: string }[] = [
  { value: 'US', label: 'eBay.com (US)', flag: '🇺🇸', currency: 'USD' },
  { value: 'UK', label: 'eBay.co.uk (UK)', flag: '🇬🇧', currency: 'GBP' },
  { value: 'AU', label: 'eBay.com.au (AU)', flag: '🇦🇺', currency: 'AUD' },
  { value: 'DE', label: 'eBay.de (DE)', flag: '🇩🇪', currency: 'EUR' },
];

const ACCOUNT_OPTIONS: { value: EbayAccount; label: string; color: string }[] = [
  { value: 'MJT', label: 'MJT', color: '#3b82f6' },
  { value: 'GREEN', label: 'GREEN', color: '#22c55e' },
];

const DURATION_OPTIONS: { value: EbayDuration; label: string; forAuction: boolean; forFixedPrice: boolean }[] = [
  { value: 'GTC', label: 'GTC (無期限)', forAuction: false, forFixedPrice: true },
  { value: '30', label: '30日', forAuction: false, forFixedPrice: true },
  { value: '1', label: '1日', forAuction: true, forFixedPrice: false },
  { value: '3', label: '3日', forAuction: true, forFixedPrice: false },
  { value: '5', label: '5日', forAuction: true, forFixedPrice: false },
  { value: '7', label: '7日', forAuction: true, forFixedPrice: false },
  { value: '10', label: '10日', forAuction: true, forFixedPrice: false },
];

// ============================================================
// ヘルパー関数
// ============================================================

const detectAccountFromProducts = (products: any[]): EbayAccount | null => {
  for (const p of products) {
    // 1. ebay_account/accountフィールドから
    if (p.ebay_account || p.account) {
      const acc = (p.ebay_account || p.account).toUpperCase();
      if (acc.includes('MJT')) return 'MJT';
      if (acc.includes('GREEN')) return 'GREEN';
    }
    // 2. SKUから推定
    // パターン: INV-ebay-mjt-{itemId}, INV-ebay-green-{itemId}, MJT-xxx, GRN-xxx
    if (p.sku) {
      const sku = p.sku.toLowerCase();
      if (sku.includes('-mjt-') || sku.startsWith('mjt')) return 'MJT';
      if (sku.includes('-green-') || sku.startsWith('grn')) return 'GREEN';
    }
  }
  return null;
};

const detectSiteFromProducts = (products: any[]): EbaySite | null => {
  for (const p of products) {
    if (p.ebay_site || p.site) {
      const site = (p.ebay_site || p.site).toUpperCase();
      if (site === 'US' || site === 'EBAY.COM') return 'US';
      if (site === 'UK' || site === 'GB' || site === 'EBAY.CO.UK') return 'UK';
      if (site === 'AU' || site === 'EBAY.COM.AU') return 'AU';
      if (site === 'DE' || site === 'EBAY.DE') return 'DE';
    }
  }
  return null;
};

const hasItemIds = (products: any[]): boolean => {
  return products.some(p => p.item_id || p.ebay_item_id || p.listing_data?.item_id);
};

const getCategoryStats = (products: any[]): Map<string, number> => {
  const stats = new Map<string, number>();
  for (const p of products) {
    const catId = p.category_id || p.ebay_category_id || 'unknown';
    const catName = p.category_name || `カテゴリ ${catId}`;
    const key = `${catId}|${catName}`;
    stats.set(key, (stats.get(key) || 0) + 1);
  }
  return stats;
};

// ============================================================
// メインコンポーネント
// ============================================================

export const N3EbayCSVExportModal = memo(function N3EbayCSVExportModal({
  isOpen,
  onClose,
  selectedProducts,
  onExport,
}: N3EbayCSVExportModalProps) {
  // 状態
  const [options, setOptions] = useState<EbayCSVExportOptions>({
    action: 'Add',
    format: 'FixedPrice',
    site: 'US',
    account: 'MJT',
    duration: 'GTC',
    includeItemSpecifics: true,
    includeHtml: true,
    includeBusinessPolicies: true,
    overrideQuantity: null,
    scheduleTime: null,
    groupByCategory: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 自動検出
  const detectedAccount = useMemo(() => detectAccountFromProducts(selectedProducts), [selectedProducts]);
  const detectedSite = useMemo(() => detectSiteFromProducts(selectedProducts), [selectedProducts]);
  const hasExistingItemIds = useMemo(() => hasItemIds(selectedProducts), [selectedProducts]);
  const categoryStats = useMemo(() => getCategoryStats(selectedProducts), [selectedProducts]);
  
  // 推奨アクション
  const recommendedAction = useMemo(() => {
    if (hasExistingItemIds) return 'Revise';
    return 'Add';
  }, [hasExistingItemIds]);

  // Duration options filtered by format
  const availableDurations = useMemo(() => {
    return DURATION_OPTIONS.filter(d => 
      options.format === 'Auction' ? d.forAuction : d.forFixedPrice
    );
  }, [options.format]);

  // 初期値設定
  React.useEffect(() => {
    if (isOpen) {
      setOptions(prev => ({
        ...prev,
        account: detectedAccount || prev.account,
        site: detectedSite || prev.site,
        action: recommendedAction,
        duration: options.format === 'Auction' ? '7' : 'GTC',
      }));
    }
  }, [isOpen, detectedAccount, detectedSite, recommendedAction]);

  // フォーマット変更時にDurationを調整
  React.useEffect(() => {
    if (options.format === 'Auction' && options.duration === 'GTC') {
      setOptions(prev => ({ ...prev, duration: '7' }));
    } else if (options.format === 'FixedPrice' && ['1', '3', '5', '7', '10'].includes(options.duration)) {
      setOptions(prev => ({ ...prev, duration: 'GTC' }));
    }
  }, [options.format]);

  // ハンドラー
  const handleOptionChange = useCallback(<K extends keyof EbayCSVExportOptions>(
    key: K,
    value: EbayCSVExportOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const handleExport = useCallback(async () => {
    if (selectedProducts.length === 0) {
      setError('エクスポートする商品を選択してください');
      return;
    }

    // Revise/Relistの場合、ItemID必須チェック
    if ((options.action === 'Revise' || options.action === 'Relist') && !hasExistingItemIds) {
      setError(`${options.action}アクションにはItemIDが必要です。新規出品の場合はAddを選択してください。`);
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      await onExport(options);
      onClose();
    } catch (err: any) {
      setError(err.message || 'エクスポートに失敗しました');
    } finally {
      setIsExporting(false);
    }
  }, [selectedProducts, options, hasExistingItemIds, onExport, onClose]);

  // カテゴリ情報表示
  const categoryInfo = useMemo(() => {
    const entries = Array.from(categoryStats.entries());
    if (entries.length === 0) return null;
    if (entries.length === 1) {
      const [key, count] = entries[0];
      const [catId, catName] = key.split('|');
      return { single: true, catId, catName, count };
    }
    return { single: false, categories: entries };
  }, [categoryStats]);

  if (!isOpen) return null;

  const currentSite = SITE_OPTIONS.find(s => s.value === options.site);
  const currentAccount = ACCOUNT_OPTIONS.find(a => a.value === options.account);

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="eBay CSV エクスポート"
    >
      <div style={{ padding: '16px', maxHeight: '70vh', overflowY: 'auto' }}>
        {/* ヘッダー情報 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, rgba(0, 100, 210, 0.1), rgba(0, 100, 210, 0.05))',
          borderRadius: '8px',
          marginBottom: '16px',
        }}>
          <FileSpreadsheet size={24} style={{ color: '#0064d2' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              eBay File Exchange / Seller Hub Reports 形式
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              選択商品: {selectedProducts.length}件
              {hasExistingItemIds && (
                <span style={{ marginLeft: '8px', color: '#f59e0b' }}>
                  ⚠️ ItemID保有商品あり
                </span>
              )}
            </div>
          </div>
        </div>

        {/* エラー表示 */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '6px',
            marginBottom: '16px',
            color: 'rgb(239, 68, 68)',
            fontSize: '13px',
          }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* カテゴリ情報 */}
        {categoryInfo && (
          <div style={{
            padding: '12px',
            background: 'var(--panel)',
            border: '1px solid var(--panel-border)',
            borderRadius: '6px',
            marginBottom: '16px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              📦 カテゴリ情報
            </div>
            {categoryInfo.single ? (
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                {categoryInfo.catName} ({categoryInfo.catId}) - {categoryInfo.count}件
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text)' }}>
                {categoryInfo.categories.length}カテゴリに分散
                {options.groupByCategory && (
                  <span style={{ color: '#22c55e', marginLeft: '8px' }}>
                    → カテゴリ別にCSV分割
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* メイン設定グリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* アクション */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              アクション *
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {ACTION_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const isRecommended = opt.value === recommendedAction;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleOptionChange('action', opt.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: options.action === opt.value ? 'rgba(0, 100, 210, 0.1)' : 'transparent',
                      border: '1px solid',
                      borderColor: options.action === opt.value ? '#0064d2' : 'var(--panel-border)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={14} style={{ color: options.action === opt.value ? '#0064d2' : 'var(--text-muted)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>
                        {opt.label}
                        {isRecommended && (
                          <span style={{ marginLeft: '6px', fontSize: '10px', color: '#22c55e' }}>推奨</span>
                        )}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{opt.description}</div>
                    </div>
                    {options.action === opt.value && <Check size={14} style={{ color: '#0064d2' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* フォーマット & サイト & アカウント */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* フォーマット */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                出品形式 *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {FORMAT_OPTIONS.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleOptionChange('format', opt.value)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '10px',
                        background: options.format === opt.value ? 'rgba(0, 100, 210, 0.1)' : 'transparent',
                        border: '1px solid',
                        borderColor: options.format === opt.value ? '#0064d2' : 'var(--panel-border)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={14} style={{ color: options.format === opt.value ? '#0064d2' : 'var(--text-muted)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)' }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* サイト */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                出品サイト *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {SITE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleOptionChange('site', opt.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '8px 4px',
                      background: options.site === opt.value ? 'rgba(0, 100, 210, 0.1)' : 'transparent',
                      border: '1px solid',
                      borderColor: options.site === opt.value ? '#0064d2' : 'var(--panel-border)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{opt.flag}</span>
                    <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--text)' }}>{opt.value}</span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{opt.currency}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* アカウント */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                アカウント *
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {ACCOUNT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleOptionChange('account', opt.value)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      background: options.account === opt.value ? `${opt.color}15` : 'transparent',
                      border: '1px solid',
                      borderColor: options.account === opt.value ? opt.color : 'var(--panel-border)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Building2 size={14} style={{ color: options.account === opt.value ? opt.color : 'var(--text-muted)' }} />
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: 600, 
                      color: options.account === opt.value ? opt.color : 'var(--text)' 
                    }}>
                      {opt.label}
                    </span>
                    {detectedAccount === opt.value && (
                      <span style={{ fontSize: '9px', color: '#22c55e' }}>検出</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 出品期間 */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                出品期間
              </label>
              <select
                value={options.duration}
                onChange={(e) => handleOptionChange('duration', e.target.value as EbayDuration)}
                style={{
                  width: '100%',
                  height: '36px',
                  padding: '0 12px',
                  fontSize: '12px',
                  border: '1px solid var(--panel-border)',
                  borderRadius: '6px',
                  background: 'var(--panel)',
                  color: 'var(--text)',
                }}
              >
                {availableDurations.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* オプション */}
        <div style={{ 
          padding: '12px', 
          background: 'var(--panel)', 
          border: '1px solid var(--panel-border)', 
          borderRadius: '6px',
          marginBottom: '16px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
            エクスポートオプション
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.includeItemSpecifics}
                onChange={(e) => handleOptionChange('includeItemSpecifics', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                <Tag size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                Item Specifics (C:Brand等)
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.includeHtml}
                onChange={(e) => handleOptionChange('includeHtml', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                <FileText size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                HTML説明文を含める
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.includeBusinessPolicies}
                onChange={(e) => handleOptionChange('includeBusinessPolicies', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                <Settings2 size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                ビジネスポリシーID
              </span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={options.groupByCategory}
                onChange={(e) => handleOptionChange('groupByCategory', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '12px', color: 'var(--text)' }}>
                <Package size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                カテゴリ別にCSV分割
              </span>
            </label>
          </div>
        </div>

        {/* 詳細オプション（折りたたみ） */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>詳細オプション</span>
            <ChevronDown 
              size={14} 
              style={{ 
                transform: showAdvanced ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s',
                color: 'var(--text-muted)',
              }} 
            />
          </button>
          
          {showAdvanced && (
            <div style={{ 
              padding: '12px', 
              border: '1px solid var(--panel-border)', 
              borderTop: 'none',
              borderRadius: '0 0 6px 6px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}>
              {/* 在庫数上書き */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  在庫数を上書き（空白で元データ使用）
                </label>
                <input
                  type="number"
                  min={1}
                  placeholder="例: 5"
                  value={options.overrideQuantity || ''}
                  onChange={(e) => handleOptionChange('overrideQuantity', e.target.value ? parseInt(e.target.value) : null)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 10px',
                    fontSize: '12px',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    background: 'var(--panel)',
                    color: 'var(--text)',
                  }}
                />
              </div>
              
              {/* スケジュール時間 */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  出品予約時間（空白で即時）
                </label>
                <input
                  type="datetime-local"
                  value={options.scheduleTime || ''}
                  onChange={(e) => handleOptionChange('scheduleTime', e.target.value || null)}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 10px',
                    fontSize: '12px',
                    border: '1px solid var(--panel-border)',
                    borderRadius: '4px',
                    background: 'var(--panel)',
                    color: 'var(--text)',
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 情報パネル */}
        <div style={{
          padding: '12px',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '6px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Info size={14} style={{ color: '#3b82f6', marginTop: '2px' }} />
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong>CSV仕様:</strong><br/>
              • カラム: Action, ItemID, CustomLabel(SKU), *Title, *Category, *ConditionID, *Format, *Duration, *StartPrice, *Quantity, Description, PicURL, C:Brand, C:MPN...<br/>
              • 画像は最大12枚、| (パイプ) で区切り<br/>
              • Item Specificsは C: プレフィックス（例: C:Brand, C:Type）<br/>
              • ビジネスポリシーはID指定: PolicyPayment, PolicyShipping, PolicyReturn
            </div>
          </div>
        </div>

        {/* フッターボタン */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={onClose}
            disabled={isExporting}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 500,
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: '6px',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedProducts.length === 0}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              fontSize: '13px',
              fontWeight: 600,
              background: isExporting ? '#0064d280' : '#0064d2',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: isExporting ? 'not-allowed' : 'pointer',
            }}
          >
            {isExporting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                エクスポート中...
              </>
            ) : (
              <>
                <Download size={16} />
                CSVをダウンロード ({selectedProducts.length}件)
              </>
            )}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
});

export default N3EbayCSVExportModal;
