'use client';

// TabData - V8.3
// デザインシステムV4準拠
// 機能: 日英データ編集、翻訳API、DB保存 - 全て維持

import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';

// テーマ定数
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export interface TabDataProps {
  product: Product | null;
}

export function TabData({ product }: TabDataProps) {
  const listingData = (product as any)?.listing_data || {};
  const scrapedData = (product as any)?.scraped_data || {};
  
  const [translating, setTranslating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const [formData, setFormData] = useState({
    productId: '',
    dbId: '',
    title: '',
    description: '',
    condition: '',
    englishTitle: '',
    englishDescription: '',
    englishCondition: '',
    price: 0,
    weight: '',
    length: '',
    width: '',
    height: '',
    generatedSku: '',
    // ✅ 原価・コストデータ
    purchasePriceJpy: 0,
    shippingCostUsd: 5,
    otherCostUsd: 0,
  });

  // ✅ データソース記録
  const [dataSources, setDataSources] = useState<Record<string, string>>({});

  // productが変わったらformDataを再初期化
  useEffect(() => {
    if (product) {
      setFormData({
        productId: (product as any)?.source_item_id || product?.asin || product?.id || '',
        dbId: product?.id || '',
        title: product?.title || '',
        description: product?.description || '',
        condition: listingData.condition || scrapedData.condition || '',
        englishTitle: (product as any)?.title_en || (product as any)?.english_title || '',
        englishDescription: (product as any)?.description_en || (product as any)?.english_description || '',
        englishCondition: (product as any)?.english_condition || listingData.condition_en || '',
        price: (product as any)?.price_usd || product?.price || 0,
        weight: listingData.weight_g || '',
        length: listingData.length_cm || '',
        width: listingData.width_cm || '',
        height: listingData.height_cm || '',
        generatedSku: product?.sku || '',
        // ✅ 原価データを復元
        purchasePriceJpy: (product as any)?.purchase_price_jpy || (product as any)?.price_jpy || 0,
        shippingCostUsd: (product as any)?.shipping_cost_usd || listingData.shipping_cost_usd || 5,
        otherCostUsd: (product as any)?.other_cost_usd || listingData.other_cost_usd || 0,
      });
      
      // ✅ データソースを復元
      setDataSources(listingData.data_sources || {});
    }
  }, [product]);

  const handleChange = (field: string, value: string | number) => {
    let processedValue = value;
    if (typeof value === 'number') {
      if (['price', 'purchasePriceJpy', 'shippingCostUsd', 'otherCostUsd'].includes(field)) {
        processedValue = Math.round(value * 100) / 100;
      } else if (['weight', 'length', 'width', 'height'].includes(field)) {
        processedValue = Math.round(value * 10) / 10;
      }
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // ✅ 手動入力時はソースを 'manual' に設定
    setDataSources(prev => ({ ...prev, [field]: 'manual' }));
  };

  // 翻訳実行
  const handleTranslate = async () => {
    if (!formData.title && !formData.description) {
      alert('翻訳する日本語データがありません');
      return;
    }
    if (formData.englishTitle && formData.englishDescription) {
      if (!confirm('既に翻訳済みです。再翻訳しますか？')) return;
    }

    setTranslating(true);
    try {
      const response = await fetch('/api/tools/translate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          title: formData.title,
          description: formData.description,
          condition: formData.condition,
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          englishTitle: result.translations.title || prev.englishTitle,
          englishDescription: result.translations.description || prev.englishDescription,
          englishCondition: result.translations.condition || prev.englishCondition,
        }));
        
        // ✅ AI翻訳ソースを記録
        setDataSources(prev => ({
          ...prev,
          englishTitle: 'ai_translate',
          englishDescription: 'ai_translate',
          englishCondition: 'ai_translate',
        }));
        
        alert('✓ 翻訳完了');
      } else {
        alert('✗ 翻訳失敗: ' + (result.error || ''));
      }
    } catch (error: any) {
      alert('✗ エラー: ' + error.message);
    } finally {
      setTranslating(false);
    }
  };

  // 保存
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product?.id,
          updates: {
            title: formData.title,
            description: formData.description,
            english_title: formData.englishTitle,
            english_description: formData.englishDescription,
            english_condition: formData.englishCondition,
            title_en: formData.englishTitle,
            description_en: formData.englishDescription,
            // ✅ 原価データを保存
            purchase_price_jpy: formData.purchasePriceJpy,
            shipping_cost_usd: formData.shippingCostUsd,
            other_cost_usd: formData.otherCostUsd,
            listing_data: {
              ...listingData,
              condition: formData.condition,
              condition_en: formData.englishCondition,
              // ✅ 数値に変換して保存
              weight_g: formData.weight ? Number(formData.weight) : null,
              length_cm: formData.length ? Number(formData.length) : null,
              width_cm: formData.width ? Number(formData.width) : null,
              height_cm: formData.height ? Number(formData.height) : null,
              // ✅ listing_data内にも保存（バックアップ）
              shipping_cost_usd: formData.shippingCostUsd,
              other_cost_usd: formData.otherCostUsd,
              // ✅ データソースを保存
              data_sources: dataSources,
            }
          }
        })
      });

      if (!response.ok) throw new Error('Save failed');
      const result = await response.json();
      
      if (result.success) {
        setSaveStatus('saved');
        window.dispatchEvent(new CustomEvent('product-updated', { detail: { productId: product?.id } }));
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      setSaveStatus('error');
    }
  };

  const priceJpy = (product as any)?.price_jpy || 0;
  const priceUsd = (product as any)?.price_usd || 0;
  const profitMargin = (product as any)?.profit_margin_percent || 0;

  // ✅ 原価計算用
  const exchangeRate = 150; // TODO: 動的に取得
  const purchasePriceUsd = formData.purchasePriceJpy / exchangeRate;
  const totalCost = purchasePriceUsd + formData.shippingCostUsd + formData.otherCostUsd;
  
  // ✅ 推奨価格計算（手数料約159%を考慮）
  const ebayFeeRate = 0.13;
  const paypalFeeRate = 0.029;
  const totalFeeRate = ebayFeeRate + paypalFeeRate;
  
  const calculateRecommendedPrice = (marginPercent: number): number => {
    if (totalCost <= 0) return 0;
    const divisor = 1 - totalFeeRate - (marginPercent / 100);
    if (divisor <= 0) return 0;
    return totalCost / divisor;
  };
  
  const recommendedPrice20 = calculateRecommendedPrice(20);
  const recommendedPrice25 = calculateRecommendedPrice(25);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      {/* 2カラムレイアウト */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        
        {/* ========== 左カラム: 日本語 ========== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SectionHeader title="日本語データ" icon="fa-flag" />
          
          {/* 基本情報 */}
          <Card>
            <Label>商品タイトル</Label>
            <Input value={formData.title} onChange={(v) => handleChange('title', v)} />
          </Card>
          
          <Card>
            <Label>商品説明</Label>
            <TextArea value={formData.description} onChange={(v) => handleChange('description', v)} rows={4} />
          </Card>
          
          <Card>
            <Label>商品状態</Label>
            <Input value={formData.condition} onChange={(v) => handleChange('condition', v)} />
          </Card>
          
          {/* ✅ 原価・コスト情報（編集可能） */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.warning, marginBottom: '0.5rem' }}>
              <i className="fas fa-coins" style={{ marginRight: '0.25rem' }}></i>
              Cost & Pricing
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <Label small>原価 (JPY)</Label>
                <Input 
                  type="number" 
                  value={formData.purchasePriceJpy} 
                  onChange={(v) => handleChange('purchasePriceJpy', Number(v))} 
                  source={dataSources.purchasePriceJpy}
                />
              </div>
              <div>
                <Label small>USD換算</Label>
                <div style={{ 
                  padding: '0.375rem 0.5rem', 
                  fontSize: '12px', 
                  borderRadius: '4px', 
                  background: T.highlight,
                  color: T.text,
                  fontFamily: 'monospace',
                }}>
                  ${(formData.purchasePriceJpy / exchangeRate).toFixed(2)}
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div>
                <Label small>送料 (USD)</Label>
                <Input 
                  type="number" 
                  value={formData.shippingCostUsd} 
                  onChange={(v) => handleChange('shippingCostUsd', Number(v))} 
                  source={dataSources.shippingCostUsd}
                />
              </div>
              <div>
                <Label small>その他経費 (USD)</Label>
                <Input 
                  type="number" 
                  value={formData.otherCostUsd} 
                  onChange={(v) => handleChange('otherCostUsd', Number(v))} 
                  source={dataSources.otherCostUsd}
                />
              </div>
            </div>
            {/* 合計コストと推奨価格 */}
            <div style={{ 
              padding: '0.5rem', 
              borderRadius: '4px', 
              background: `${T.success}10`, 
              border: `1px solid ${T.success}40`,
              marginTop: '0.5rem',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>合計コスト</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>
                    ${totalCost.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>推奨価格 (20%)</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.success, fontFamily: 'monospace' }}>
                    ${recommendedPrice20.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>推奨価格 (25%)</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.success, fontFamily: 'monospace' }}>
                    ${recommendedPrice25.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {/* サイズ・重量 */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              Size & Weight
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              <div>
                <Label small>Weight (g)</Label>
                <Input 
                  type="number" 
                  value={formData.weight} 
                  onChange={(v) => handleChange('weight', Number(v))} 
                  source={dataSources.weight}
                />
              </div>
              <div>
                <Label small>L (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.length} 
                  onChange={(v) => handleChange('length', Number(v))} 
                  source={dataSources.length}
                />
              </div>
              <div>
                <Label small>W (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.width} 
                  onChange={(v) => handleChange('width', Number(v))} 
                  source={dataSources.width}
                />
              </div>
              <div>
                <Label small>H (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.height} 
                  onChange={(v) => handleChange('height', Number(v))} 
                  source={dataSources.height}
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* ========== 右カラム: 英語 ========== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionHeader title="英語データ (English)" icon="fa-globe" color={T.accent} />
            <button
              onClick={handleTranslate}
              disabled={translating}
              style={{
                padding: '0.25rem 0.75rem',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: translating ? T.textMuted : T.accent,
                color: '#fff',
                cursor: translating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              {translating ? <><i className="fas fa-spinner fa-spin"></i> 翻訳中...</> : <><i className="fas fa-language"></i> 日→英</>}
            </button>
          </div>
          
          <Card accent>
            <Label color={T.accent}>English Title</Label>
            <Input 
              value={formData.englishTitle} 
              onChange={(v) => handleChange('englishTitle', v)} 
              accent 
              source={dataSources.englishTitle}
            />
          </Card>
          
          <Card accent>
            <Label color={T.accent}>English Description</Label>
            <TextArea value={formData.englishDescription} onChange={(v) => handleChange('englishDescription', v)} rows={4} accent />
          </Card>
          
          <Card accent>
            <Label color={T.accent}>English Condition</Label>
            <Input 
              value={formData.englishCondition} 
              onChange={(v) => handleChange('englishCondition', v)} 
              accent 
              source={dataSources.englishCondition}
            />
          </Card>
          
          {/* ID情報 */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              Identifiers
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <Label small>SKU</Label>
                <Input value={formData.generatedSku} readOnly />
              </div>
              <div>
                <Label small>DB ID</Label>
                <Input value={formData.dbId} readOnly />
              </div>
            </div>
          </Card>
          
          {/* データ完全性 */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              Data Completeness
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.25rem' }}>
              <CheckItem label="JA Title" ok={!!formData.title} />
              <CheckItem label="EN Title" ok={!!formData.englishTitle} />
              <CheckItem label="JA Desc" ok={!!formData.description} />
              <CheckItem label="EN Desc" ok={!!formData.englishDescription} />
              <CheckItem label="Price" ok={formData.price > 0} />
              <CheckItem label="Condition" ok={!!formData.condition} />
            </div>
          </Card>
          
          {/* 保存ボタン */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem', marginTop: 'auto' }}>
            {saveStatus !== 'idle' && (
              <span style={{ fontSize: '10px', color: saveStatus === 'saved' ? T.success : saveStatus === 'error' ? T.error : T.accent }}>
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && '✓ Saved'}
                {saveStatus === 'error' && '✗ Error'}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              style={{
                padding: '0.375rem 1rem',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: '#1e293b',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <i className="fas fa-save"></i> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== 小コンポーネント ==========

function SectionHeader({ title, icon, color }: { title: string; icon: string; color?: string }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 700, color: color || T.text, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
      <i className={`fas ${icon}`}></i>
      {title}
    </div>
  );
}

function Card({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{
      padding: '0.75rem',
      borderRadius: '6px',
      background: accent ? `${T.accent}08` : T.panel,
      border: `1px solid ${accent ? `${T.accent}40` : T.panelBorder}`,
    }}>
      {children}
    </div>
  );
}

function Label({ children, color, small }: { children: React.ReactNode; color?: string; small?: boolean }) {
  return (
    <label style={{
      display: 'block',
      fontSize: small ? '8px' : '9px',
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      fontWeight: 600,
      color: color || T.textSubtle,
      marginBottom: '0.25rem',
    }}>
      {children}
    </label>
  );
}

function Input({ value, onChange, type = 'text', readOnly, accent, source }: { 
  value: string | number; 
  onChange?: (v: string) => void; 
  type?: string; 
  readOnly?: boolean; 
  accent?: boolean;
  source?: string;
}) {
  // ✅ ソースアイコンとツールチップ
  const getSourceInfo = (src: string | undefined) => {
    switch (src) {
      case 'manual': return { icon: 'fa-pen', color: '#3b82f6', label: '手動入力' };
      case 'ai_gemini': return { icon: 'fa-robot', color: '#8b5cf6', label: 'Gemini AI' };
      case 'ai_claude': return { icon: 'fa-robot', color: '#f59e0b', label: 'Claude AI' };
      case 'ai_translate': return { icon: 'fa-language', color: '#10b981', label: 'AI翻訳' };
      case 'scraped': return { icon: 'fa-spider', color: '#64748b', label: 'スクレイピング' };
      case 'calculated': return { icon: 'fa-calculator', color: '#06b6d4', label: 'システム計算' };
      case 'imported': return { icon: 'fa-file-import', color: '#ec4899', label: 'インポート' };
      default: return null;
    }
  };
  
  const sourceInfo = getSourceInfo(source);
  
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        style={{
          width: '100%',
          padding: '0.375rem 0.5rem',
          paddingRight: sourceInfo ? '1.75rem' : '0.5rem',
          fontSize: '12px',
          borderRadius: '4px',
          border: `1px solid ${accent ? T.accent : T.panelBorder}`,
          background: readOnly ? T.highlight : T.panel,
          color: T.text,
          outline: 'none',
        }}
      />
      {sourceInfo && (
        <div 
          title={sourceInfo.label}
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: sourceInfo.color,
            fontSize: '10px',
            cursor: 'help',
          }}
        >
          <i className={`fas ${sourceInfo.icon}`}></i>
        </div>
      )}
    </div>
  );
}

function TextArea({ value, onChange, rows = 3, accent }: { value: string; onChange?: (v: string) => void; rows?: number; accent?: boolean }) {
  return (
    <textarea
      value={value}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
      rows={rows}
      style={{
        width: '100%',
        padding: '0.375rem 0.5rem',
        fontSize: '12px',
        borderRadius: '4px',
        border: `1px solid ${accent ? T.accent : T.panelBorder}`,
        background: T.panel,
        color: T.text,
        outline: 'none',
        resize: 'vertical',
      }}
    />
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: '0.5rem', borderRadius: '4px', background: T.highlight, textAlign: 'center' }}>
      <div style={{ fontSize: '8px', textTransform: 'uppercase', color: T.textSubtle }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: color || T.text }}>{value}</div>
    </div>
  );
}

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: '0.125rem 0' }}>
      <span style={{ color: T.textMuted }}>{label}</span>
      <span style={{ color: ok ? T.success : T.error, fontWeight: 600 }}>{ok ? '✓' : '✗'}</span>
    </div>
  );
}
