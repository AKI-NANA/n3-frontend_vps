'use client';

// TabData - V9.0 - 完全編集対応版
// デザインシステムV4準拠
// 機能: 全フィールド編集可能、データ保護ロジック、保存後UI同期

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

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
  onSave?: (updates: any) => void;
}

export function TabData({ product, onSave }: TabDataProps) {
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
    // 原価・コストデータ
    purchasePriceJpy: 0,
    shippingCostUsd: 5,
    otherCostUsd: 0,
    // SM由来データ（全て編集可能に）
    material: '',
    brand: '',
    manufacturer: '',
    originCountry: '',
    htsCode: '',
    htsDutyRate: '',
    categoryId: '',
    categoryName: '',
  });

  // データソース記録（手動編集のトラッキング）
  const [dataSources, setDataSources] = useState<Record<string, string>>({});
  
  // 手動編集フラグ（自動処理からの保護）
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});

  // productが変わったらformDataを再初期化
  useEffect(() => {
    if (product) {
      const pAny = product as any;
      setFormData({
        productId: pAny?.source_item_id || product?.asin || product?.id || '',
        dbId: String(product?.id || ''),
        title: product?.title || '',
        description: product?.description || '',
        condition: listingData.condition || scrapedData.condition || pAny?.condition || '',
        englishTitle: pAny?.title_en || pAny?.english_title || '',
        englishDescription: pAny?.description_en || pAny?.english_description || '',
        englishCondition: pAny?.english_condition || listingData.condition_en || '',
        price: pAny?.price_usd || product?.price || 0,
        weight: listingData.weight_g?.toString() || scrapedData.weight_g?.toString() || '',
        length: listingData.length_cm?.toString() || scrapedData.length_cm?.toString() || '',
        width: listingData.width_cm?.toString() || scrapedData.width_cm?.toString() || '',
        height: listingData.height_cm?.toString() || scrapedData.height_cm?.toString() || '',
        generatedSku: product?.sku || '',
        // 原価データを復元（listing_data内優先）
        purchasePriceJpy: listingData.purchase_price_jpy || pAny?.price_jpy || 0,
        shippingCostUsd: listingData.shipping_cost_usd ?? 5,
        otherCostUsd: listingData.other_cost_usd ?? 0,
        // SM由来データ（全て編集可能）
        material: listingData.material || scrapedData.material || pAny?.material || '',
        brand: listingData.brand || scrapedData.brand || pAny?.brand || '',
        manufacturer: listingData.manufacturer || scrapedData.manufacturer || pAny?.manufacturer || '',
        originCountry: listingData.origin_country || pAny?.origin_country || '',
        htsCode: pAny?.hts_code || listingData.hts_code || '',
        htsDutyRate: pAny?.hts_duty_rate?.toString() || listingData.hts_duty_rate?.toString() || '',
        categoryId: pAny?.ebay_category_id || listingData.ebay_category_id || '',
        categoryName: listingData.category_name || pAny?.category_name || '',
      });
      
      // データソースを復元
      setDataSources(listingData.data_sources || {});
      // 手動上書きフラグを復元
      setManualOverrides(listingData.manual_overrides || {});
    }
  }, [product]);

  const handleChange = useCallback((field: string, value: string | number) => {
    let processedValue = value;
    if (typeof value === 'number') {
      if (['price', 'purchasePriceJpy', 'shippingCostUsd', 'otherCostUsd'].includes(field)) {
        processedValue = Math.round(value * 100) / 100;
      } else if (['weight', 'length', 'width', 'height', 'htsDutyRate'].includes(field)) {
        processedValue = Math.round(value * 10) / 10;
      }
    }
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // 手動入力時はソースを 'manual' に設定
    setDataSources(prev => ({ ...prev, [field]: 'manual' }));
    // 手動上書きフラグを設定（自動処理から保護）
    setManualOverrides(prev => ({ ...prev, [field]: true }));
  }, []);

  // 翻訳実行
  const handleTranslate = useCallback(async () => {
    if (!formData.title && !formData.description) {
      toast.error('翻訳する日本語データがありません');
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
        
        // AI翻訳ソースを記録
        setDataSources(prev => ({
          ...prev,
          englishTitle: 'ai_translate',
          englishDescription: 'ai_translate',
          englishCondition: 'ai_translate',
        }));
        
        toast.success('翻訳完了');
      } else {
        toast.error('翻訳失敗: ' + (result.error || ''));
      }
    } catch (error: any) {
      toast.error('エラー: ' + error.message);
    } finally {
      setTranslating(false);
    }
  }, [formData.title, formData.description, formData.englishTitle, formData.englishDescription, formData.condition, product?.id]);

  // 保存
  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      // ✅ products_masterに存在するカラムのみ使用
      // ⚠️ manufacturer, brand, hts_duty_rate はトップレベルに存在しない
      const updates = {
        title: formData.title,
        description: formData.description,
        english_title: formData.englishTitle,
        english_description: formData.englishDescription,
        english_condition: formData.englishCondition,
        title_en: formData.englishTitle,
        description_en: formData.englishDescription,
        // ✅ price_jpy は既存カラム（原価として使用）
        price_jpy: formData.purchasePriceJpy || null,
        // ✅ shipping_cost_usd はトップレベルカラムにも存在
        shipping_cost_usd: formData.shippingCostUsd || null,
        // ✅ トップレベルに存在するカラムのみ
        sku: formData.generatedSku || null,
        material: formData.material || null,
        origin_country: formData.originCountry || null,
        hts_code: formData.htsCode || null,
        ebay_category_id: formData.categoryId || null,
        // ⚠️ 以下はDBに存在しないのでlisting_data内のみに保存
        // brand, manufacturer, hts_duty_rate
        listing_data: {
          ...listingData,
          condition: formData.condition,
          condition_en: formData.englishCondition,
          // 数値に変換して保存
          weight_g: formData.weight ? Number(formData.weight) : null,
          length_cm: formData.length ? Number(formData.length) : null,
          width_cm: formData.width ? Number(formData.width) : null,
          height_cm: formData.height ? Number(formData.height) : null,
          // SM由来データをlisting_dataにもバックアップ
          material: formData.material || null,
          brand: formData.brand || null,
          manufacturer: formData.manufacturer || null,
          origin_country: formData.originCountry || null,
          hts_code: formData.htsCode || null,
          hts_duty_rate: formData.htsDutyRate ? Number(formData.htsDutyRate) : null,
          ebay_category_id: formData.categoryId || null,
          category_name: formData.categoryName || null,
          // ✅ 原価・コストデータはlisting_data内に保存
          purchase_price_jpy: formData.purchasePriceJpy || null,
          shipping_cost_usd: formData.shippingCostUsd,
          other_cost_usd: formData.otherCostUsd,
          // データソースと手動上書きフラグを保存
          data_sources: dataSources,
          manual_overrides: manualOverrides,
        }
      };
      
      const response = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product?.id,
          updates
        })
      });

      if (!response.ok) throw new Error('Save failed');
      const result = await response.json();
      
      if (result.success) {
        setSaveStatus('saved');
        
        // 親コンポーネントに通知
        onSave?.(updates);
        
        // グローバルイベントをディスパッチ（UI同期用）
        window.dispatchEvent(new CustomEvent('n3:product-updated', { 
          detail: { 
            productId: product?.id,
            updates,
            source: 'tab-data'
          } 
        }));
        
        // 監査スコア再計算トリガー
        window.dispatchEvent(new CustomEvent('n3:audit-recalculate', { 
          detail: { productId: product?.id } 
        }));
        
        toast.success('保存しました');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
        setSaveStatus('error');
        toast.error('保存失敗: ' + (result.error || ''));
      }
    } catch (error: any) {
      setSaveStatus('error');
      toast.error('エラー: ' + error.message);
    }
  }, [product?.id, formData, dataSources, manualOverrides, listingData, onSave]);

  // 原価計算用
  const exchangeRate = 150; // TODO: 動的に取得
  const purchasePriceUsd = formData.purchasePriceJpy / exchangeRate;
  const totalCost = purchasePriceUsd + formData.shippingCostUsd + formData.otherCostUsd;
  
  // 推奨価格計算
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
      {/* 3カラムレイアウト */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        
        {/* ========== 左カラム: 日本語 ========== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SectionHeader title="日本語データ" icon="fa-flag" />
          
          <Card>
            <Label>商品タイトル</Label>
            <Input 
              value={formData.title} 
              onChange={(v) => handleChange('title', v)} 
              source={dataSources.title}
              isManualOverride={manualOverrides.title}
            />
          </Card>
          
          <Card>
            <Label>商品説明</Label>
            <TextArea 
              value={formData.description} 
              onChange={(v) => handleChange('description', v)} 
              rows={4} 
            />
          </Card>
          
          <Card>
            <Label>商品状態</Label>
            <Input 
              value={formData.condition} 
              onChange={(v) => handleChange('condition', v)} 
              source={dataSources.condition}
              isManualOverride={manualOverrides.condition}
            />
          </Card>
          
          {/* 原価・コスト情報 */}
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
                  isManualOverride={manualOverrides.purchasePriceJpy}
                />
              </div>
              <div>
                <Label small>USD換算</Label>
                <div style={{ padding: '0.375rem 0.5rem', fontSize: '12px', borderRadius: '4px', background: T.highlight, color: T.text, fontFamily: 'monospace' }}>
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
                  isManualOverride={manualOverrides.shippingCostUsd}
                />
              </div>
              <div>
                <Label small>その他経費 (USD)</Label>
                <Input 
                  type="number" 
                  value={formData.otherCostUsd} 
                  onChange={(v) => handleChange('otherCostUsd', Number(v))} 
                  source={dataSources.otherCostUsd}
                  isManualOverride={manualOverrides.otherCostUsd}
                />
              </div>
            </div>
            {/* 合計コストと推奨価格 */}
            <div style={{ padding: '0.5rem', borderRadius: '4px', background: `${T.success}10`, border: `1px solid ${T.success}40`, marginTop: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>合計コスト</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.text, fontFamily: 'monospace' }}>${totalCost.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>推奨 (20%)</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.success, fontFamily: 'monospace' }}>${recommendedPrice20.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '8px', color: T.textMuted }}>推奨 (25%)</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.success, fontFamily: 'monospace' }}>${recommendedPrice25.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* ========== 中央カラム: 英語 ========== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionHeader title="英語データ" icon="fa-globe" color={T.accent} />
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
              isManualOverride={manualOverrides.englishTitle}
            />
          </Card>
          
          <Card accent>
            <Label color={T.accent}>English Description</Label>
            <TextArea 
              value={formData.englishDescription} 
              onChange={(v) => handleChange('englishDescription', v)} 
              rows={4} 
              accent 
            />
          </Card>
          
          <Card accent>
            <Label color={T.accent}>English Condition</Label>
            <Input 
              value={formData.englishCondition} 
              onChange={(v) => handleChange('englishCondition', v)} 
              accent 
              source={dataSources.englishCondition}
              isManualOverride={manualOverrides.englishCondition}
            />
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
                  onChange={(v) => handleChange('weight', v)} 
                  source={dataSources.weight}
                  isManualOverride={manualOverrides.weight}
                />
              </div>
              <div>
                <Label small>L (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.length} 
                  onChange={(v) => handleChange('length', v)} 
                  source={dataSources.length}
                  isManualOverride={manualOverrides.length}
                />
              </div>
              <div>
                <Label small>W (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.width} 
                  onChange={(v) => handleChange('width', v)} 
                  source={dataSources.width}
                  isManualOverride={manualOverrides.width}
                />
              </div>
              <div>
                <Label small>H (cm)</Label>
                <Input 
                  type="number" 
                  value={formData.height} 
                  onChange={(v) => handleChange('height', v)} 
                  source={dataSources.height}
                  isManualOverride={manualOverrides.height}
                />
              </div>
            </div>
          </Card>
        </div>
        
        {/* ========== 右カラム: SM由来＆識別子 ========== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <SectionHeader title="SM由来 & 分類" icon="fa-database" color={T.warning} />
          
          {/* SM由来データ（全て編集可能） */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.warning, marginBottom: '0.5rem' }}>
              <i className="fas fa-edit" style={{ marginRight: '0.25rem' }}></i>
              SM Data (Editable)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <Label small>素材</Label>
                <Input 
                  value={formData.material} 
                  onChange={(v) => handleChange('material', v)} 
                  source={dataSources.material}
                  isManualOverride={manualOverrides.material}
                />
              </div>
              <div>
                <Label small>ブランド</Label>
                <Input 
                  value={formData.brand} 
                  onChange={(v) => handleChange('brand', v)} 
                  source={dataSources.brand}
                  isManualOverride={manualOverrides.brand}
                />
              </div>
              <div>
                <Label small>メーカー</Label>
                <Input 
                  value={formData.manufacturer} 
                  onChange={(v) => handleChange('manufacturer', v)} 
                  source={dataSources.manufacturer}
                  isManualOverride={manualOverrides.manufacturer}
                />
              </div>
              <div>
                <Label small>原産国</Label>
                <Input 
                  value={formData.originCountry} 
                  onChange={(v) => handleChange('originCountry', v)} 
                  source={dataSources.originCountry}
                  isManualOverride={manualOverrides.originCountry}
                />
              </div>
            </div>
          </Card>
          
          {/* HTS/関税 */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              HTS / Tariff
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
              <div>
                <Label small>HTS Code</Label>
                <Input 
                  value={formData.htsCode} 
                  onChange={(v) => handleChange('htsCode', v)} 
                  source={dataSources.htsCode}
                  isManualOverride={manualOverrides.htsCode}
                />
              </div>
              <div>
                <Label small>税率 (%)</Label>
                <Input 
                  type="number" 
                  value={formData.htsDutyRate} 
                  onChange={(v) => handleChange('htsDutyRate', v)} 
                  source={dataSources.htsDutyRate}
                  isManualOverride={manualOverrides.htsDutyRate}
                />
              </div>
            </div>
          </Card>
          
          {/* eBayカテゴリ */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              eBay Category
            </div>
            <div>
              <Label small>Category ID</Label>
              <Input 
                value={formData.categoryId} 
                onChange={(v) => handleChange('categoryId', v)} 
                source={dataSources.categoryId}
                isManualOverride={manualOverrides.categoryId}
              />
            </div>
            <div style={{ marginTop: '0.5rem' }}>
              <Label small>Category Name</Label>
              <Input 
                value={formData.categoryName} 
                onChange={(v) => handleChange('categoryName', v)} 
                source={dataSources.categoryName}
                isManualOverride={manualOverrides.categoryName}
              />
            </div>
          </Card>
          
          {/* ID情報 */}
          <Card>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              Identifiers
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <Label small>SKU</Label>
                <Input 
                  value={formData.generatedSku} 
                  onChange={(v) => handleChange('generatedSku', v)}
                  source={dataSources.generatedSku}
                  isManualOverride={manualOverrides.generatedSku}
                />
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
              <CheckItem label="JA Title" ok={!!formData.title && formData.title.toString().trim() !== ''} />
              <CheckItem label="EN Title" ok={!!formData.englishTitle && formData.englishTitle.toString().trim() !== ''} />
              <CheckItem label="JA Desc" ok={!!formData.description && formData.description.toString().trim() !== ''} />
              <CheckItem label="EN Desc" ok={!!formData.englishDescription && formData.englishDescription.toString().trim() !== ''} />
              <CheckItem label="Weight" ok={formData.weight !== '' && formData.weight !== null && formData.weight !== undefined && Number(formData.weight) > 0} />
              <CheckItem label="Condition" ok={!!formData.condition && formData.condition.toString().trim() !== ''} />
              <CheckItem label="HTS Code" ok={!!formData.htsCode && formData.htsCode.toString().trim() !== ''} />
              <CheckItem label="Category" ok={!!formData.categoryId && formData.categoryId.toString().trim() !== ''} />
              <CheckItem label="Material" ok={!!formData.material && formData.material.toString().trim() !== ''} />
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
                padding: '0.5rem 1.5rem',
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
              <i className="fas fa-save"></i> Save All
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

function Input({ value, onChange, type = 'text', readOnly, accent, source, isManualOverride }: { 
  value: string | number; 
  onChange?: (v: string) => void; 
  type?: string; 
  readOnly?: boolean; 
  accent?: boolean;
  source?: string;
  isManualOverride?: boolean;
}) {
  // ソースアイコンとツールチップ
  const getSourceInfo = (src: string | undefined, isManual: boolean | undefined) => {
    // 手動上書きの場合は優先表示
    if (isManual) {
      return { icon: 'fa-pen', color: '#3b82f6', label: '手動入力（自動処理から保護）' };
    }
    switch (src) {
      case 'manual': return { icon: 'fa-pen', color: '#3b82f6', label: '手動入力' };
      case 'ai_gemini': return { icon: 'fa-robot', color: '#8b5cf6', label: 'Gemini AI' };
      case 'ai_claude': return { icon: 'fa-robot', color: '#f59e0b', label: 'Claude AI' };
      case 'ai_translate': return { icon: 'fa-language', color: '#10b981', label: 'AI翻訳' };
      case 'scraped': return { icon: 'fa-spider', color: '#64748b', label: 'スクレイピング' };
      case 'sm': return { icon: 'fa-store', color: '#64748b', label: 'SM由来' };
      case 'calculated': return { icon: 'fa-calculator', color: '#06b6d4', label: 'システム計算' };
      case 'imported': return { icon: 'fa-file-import', color: '#ec4899', label: 'インポート' };
      default: return null;
    }
  };
  
  const sourceInfo = getSourceInfo(source, isManualOverride);
  
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
          border: `1px solid ${isManualOverride ? T.accent : accent ? T.accent : T.panelBorder}`,
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

function CheckItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', padding: '0.125rem 0' }}>
      <span style={{ color: T.textMuted }}>{label}</span>
      <span style={{ color: ok ? T.success : T.error, fontWeight: 600 }}>{ok ? '✓' : '✗'}</span>
    </div>
  );
}
