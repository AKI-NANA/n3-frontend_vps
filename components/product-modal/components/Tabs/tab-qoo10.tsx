'use client';

/**
 * TabQoo10 - V9.0 完全版
 * 
 * 機能:
 * 1. 仕入れ先データ取得（Amazon JP等からのインポート）
 * 2. 利益計算（国内送料 + Qoo10手数料）
 * 3. HTML説明文生成
 * 4. 画像設定（ストック画像対応）
 * 5. 必須項目管理
 * 6. Excel出力
 * 7. 在庫0での下書き出品
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

// 利益計算インポート
import {
  calculateQoo10Profit,
  calculateRecommendedPrice,
  calculatePricePoints,
  formatJPY,
  getQoo10FeeRate,
  DEFAULT_QOO10_FEE_RATE,
  DEFAULT_PAYMENT_FEE_RATE,
} from '@/lib/qoo10/profit-calculator';

import {
  SHIPPING_SERVICES,
  findCheapestShipping,
  getShippingRate,
  REGION_DISPLAY_NAMES,
  type ShippingService,
} from '@/lib/qoo10/shipping-rates';

// スタイル定数
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#ff0066', // Qoo10ピンク
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  blue: '#3b82f6',
};

// Qoo10カテゴリ
const QOO10_CATEGORIES = [
  { code: '001', name: 'ファッション', fee: 10 },
  { code: '002', name: 'ビューティー・コスメ', fee: 10 },
  { code: '003', name: 'デジタル・家電', fee: 8 },
  { code: '004', name: 'スポーツ・アウトドア', fee: 10 },
  { code: '005', name: '生活雑貨・日用品', fee: 10 },
  { code: '006', name: 'ベビー・キッズ', fee: 10 },
  { code: '007', name: '食品・飲料', fee: 12 },
  { code: '008', name: 'ホビー・コレクション', fee: 10 },
  { code: '009', name: 'インテリア・家具', fee: 10 },
];

export interface TabQoo10Props {
  product: Product | null;
  onSave?: (updates: any) => void;
}

export function TabQoo10({ product, onSave }: TabQoo10Props) {
  // === フォームデータ ===
  const [formData, setFormData] = useState({
    // 基本情報
    title: '',
    promotionText: '',
    description: '',
    htmlDescription: '',
    
    // 価格
    costPrice: 0,           // 仕入れ価格
    sellingPrice: 0,        // 販売価格
    originalPrice: 0,       // 定価（割引表示用）
    
    // カテゴリ・在庫
    categoryCode: '',
    stockQuantity: 1,
    adultYn: 'N' as 'Y' | 'N',
    
    // 配送
    shippingCarrier: 'jp_post' as 'yamato' | 'jp_post' | 'sagawa',
    shippingSize: '60',
    shippingRegion: 'kanto' as keyof typeof REGION_DISPLAY_NAMES,
    isFreeShipping: true,
    
    // その他
    sellerCode: '',         // SKU
    janCode: '',
    brandName: '',
    contactInfo: '返品・交換はお問い合わせください',
    
    // 画像
    images: [] as string[],
  });

  // === 計算結果 ===
  const [profitResult, setProfitResult] = useState<{
    netProfit: number;
    profitMargin: number;
    qoo10Fee: number;
    paymentFee: number;
    shippingFee: number;
    totalDeductions: number;
    isProfitable: boolean;
    warnings: string[];
    recommendedPrice: number;
    breakEvenPrice: number;
  } | null>(null);

  // === UI状態 ===
  const [activeSection, setActiveSection] = useState<'basic' | 'pricing' | 'html' | 'images'>('basic');
  const [calculating, setCalculating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [listing, setListing] = useState(false);

  // === 商品データからフォーム初期化 ===
  useEffect(() => {
    if (product) {
      const listingData = (product as any)?.listing_data || {};
      const qoo10Data = (product as any)?.qoo10_data || {};
      
      setFormData(prev => ({
        ...prev,
        // タイトル（日本語優先）
        title: qoo10Data.title || listingData.title_ja || (product as any)?.japanese_title || product?.title || '',
        promotionText: qoo10Data.promotionText || '',
        description: qoo10Data.description || product?.description || '',
        htmlDescription: qoo10Data.htmlDescription || (product as any)?.html_description || '',
        
        // 価格
        costPrice: (product as any)?.purchase_price_jpy || (product as any)?.price_jpy || 0,
        sellingPrice: qoo10Data.sellingPrice || (product as any)?.price_jpy || 0,
        originalPrice: qoo10Data.originalPrice || Math.round(((product as any)?.price_jpy || 0) * 1.3),
        
        // 在庫
        stockQuantity: product?.stock?.available || 1,
        
        // SKU
        sellerCode: product?.sku || '',
        
        // ブランド
        brandName: product?.brand_name || (product as any)?.brand || '',
        
        // 画像
        images: product?.selectedImages || product?.images?.map(img => img.url) || [],
      }));
    }
  }, [product]);

  // === 利益計算 ===
  const handleCalculate = useCallback(() => {
    if (formData.costPrice <= 0) {
      toast.error('仕入れ価格を入力してください');
      return;
    }

    setCalculating(true);

    try {
      const feeRate = getQoo10FeeRate(formData.categoryCode);
      
      const result = calculateQoo10Profit({
        selling_price: formData.sellingPrice,
        cost_price: formData.costPrice,
        shipping_carrier: formData.shippingCarrier,
        shipping_size: formData.shippingSize,
        shipping_region: formData.shippingRegion,
        qoo10_fee_rate: feeRate,
        payment_fee_rate: DEFAULT_PAYMENT_FEE_RATE,
        is_free_shipping: formData.isFreeShipping,
        target_margin: 0.20,
      });

      const recommendedPrice = calculateRecommendedPrice(
        formData.costPrice,
        formData.shippingCarrier,
        formData.shippingSize,
        formData.shippingRegion,
        feeRate,
        DEFAULT_PAYMENT_FEE_RATE,
        100,
        formData.isFreeShipping,
        0.20
      );

      const breakEvenPrice = calculateRecommendedPrice(
        formData.costPrice,
        formData.shippingCarrier,
        formData.shippingSize,
        formData.shippingRegion,
        feeRate,
        DEFAULT_PAYMENT_FEE_RATE,
        100,
        formData.isFreeShipping,
        0
      );

      setProfitResult({
        netProfit: result.net_profit,
        profitMargin: result.profit_margin_percent,
        qoo10Fee: result.qoo10_fee,
        paymentFee: result.payment_fee,
        shippingFee: result.shipping_fee,
        totalDeductions: result.total_deductions,
        isProfitable: result.is_profitable,
        warnings: result.warnings,
        recommendedPrice,
        breakEvenPrice,
      });

      if (result.is_profitable) {
        toast.success(`利益計算完了: ${formatJPY(result.net_profit)} (${result.profit_margin_percent.toFixed(1)}%)`);
      } else {
        toast.warning('⚠️ 赤字です！価格を見直してください');
      }
    } catch (error: any) {
      toast.error(`計算エラー: ${error.message}`);
    } finally {
      setCalculating(false);
    }
  }, [formData]);

  // === 推奨価格を適用 ===
  const applyRecommendedPrice = useCallback(() => {
    if (profitResult?.recommendedPrice) {
      setFormData(prev => ({
        ...prev,
        sellingPrice: profitResult.recommendedPrice,
      }));
      toast.success(`推奨価格 ${formatJPY(profitResult.recommendedPrice)} を適用しました`);
    }
  }, [profitResult]);

  // === 最安送料を自動選択 ===
  const autoSelectShipping = useCallback(() => {
    const weightG = (product as any)?.weight_g || 500;
    const lengthCm = (product as any)?.length_cm;
    const widthCm = (product as any)?.width_cm;
    const heightCm = (product as any)?.height_cm;

    const cheapest = findCheapestShipping(weightG, lengthCm, widthCm, heightCm, formData.shippingRegion);
    
    if (cheapest) {
      setFormData(prev => ({
        ...prev,
        shippingCarrier: cheapest.service.carrier,
        shippingSize: cheapest.service.sizeCode,
      }));
      toast.success(`最安送料: ${cheapest.service.nameJa} (${formatJPY(cheapest.rate)}) を選択しました`);
    }
  }, [product, formData.shippingRegion]);

  // === HTML説明文生成 ===
  const generateHtml = useCallback(() => {
    const html = `
<div style="max-width: 800px; margin: 0 auto; font-family: 'Hiragino Sans', 'Yu Gothic', sans-serif;">
  <!-- ヘッダー -->
  <div style="background: linear-gradient(135deg, #ff0066, #ff6699); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
    <h1 style="color: white; font-size: 24px; margin: 0;">${formData.title}</h1>
    ${formData.promotionText ? `<p style="color: rgba(255,255,255,0.9); margin-top: 10px;">${formData.promotionText}</p>` : ''}
  </div>

  <!-- 商品画像 -->
  ${formData.images.length > 0 ? `
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${formData.images[0]}" alt="${formData.title}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  </div>
  ` : ''}

  <!-- 商品説明 -->
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; font-size: 18px; border-bottom: 2px solid #ff0066; padding-bottom: 10px; margin-bottom: 15px;">
      商品説明
    </h2>
    <p style="color: #555; line-height: 1.8; white-space: pre-wrap;">${formData.description}</p>
  </div>

  <!-- 商品情報 -->
  <div style="background: white; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; font-size: 18px; border-bottom: 2px solid #ff0066; padding-bottom: 10px; margin-bottom: 15px;">
      商品情報
    </h2>
    <table style="width: 100%; border-collapse: collapse;">
      ${formData.brandName ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">ブランド</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.brandName}</td></tr>` : ''}
      ${formData.janCode ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">JANコード</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${formData.janCode}</td></tr>` : ''}
      <tr><td style="padding: 8px; border-bottom: 1px solid #eee; color: #888;">状態</td><td style="padding: 8px; border-bottom: 1px solid #eee;">新品</td></tr>
    </table>
  </div>

  <!-- 配送について -->
  <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 14px;">📦 配送について</h3>
    <p style="color: #856404; margin: 0; font-size: 13px;">
      ${formData.isFreeShipping ? '送料無料でお届けします！' : '別途送料がかかります。'}
      ご注文確認後、3〜5営業日以内に発送いたします。
    </p>
  </div>

  <!-- 返品について -->
  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
    <h3 style="color: #666; margin: 0 0 10px 0; font-size: 14px;">📞 返品・お問い合わせ</h3>
    <p style="color: #666; margin: 0; font-size: 13px;">${formData.contactInfo}</p>
  </div>
</div>
`.trim();

    setFormData(prev => ({ ...prev, htmlDescription: html }));
    toast.success('HTML説明文を生成しました');
  }, [formData]);

  // === Excel出力 ===
  const handleExportExcel = useCallback(async () => {
    if (!profitResult) {
      toast.error('先に利益計算を実行してください');
      return;
    }

    setExporting(true);

    try {
      // CSVデータ作成
      const csvData = [
        ['項目', '値'],
        ['商品名', formData.title],
        ['販売者商品コード', formData.sellerCode],
        ['カテゴリ', QOO10_CATEGORIES.find(c => c.code === formData.categoryCode)?.name || ''],
        ['仕入れ価格', formData.costPrice.toString()],
        ['販売価格', formData.sellingPrice.toString()],
        ['定価', formData.originalPrice.toString()],
        ['在庫数', formData.stockQuantity.toString()],
        ['送料（セラー負担）', profitResult.shippingFee.toString()],
        ['Qoo10手数料', profitResult.qoo10Fee.toString()],
        ['決済手数料', profitResult.paymentFee.toString()],
        ['利益', profitResult.netProfit.toString()],
        ['利益率', `${profitResult.profitMargin.toFixed(1)}%`],
        ['推奨価格(20%)', profitResult.recommendedPrice.toString()],
        ['損益分岐価格', profitResult.breakEvenPrice.toString()],
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `qoo10_${formData.sellerCode || 'export'}_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      URL.revokeObjectURL(url);
      toast.success('CSVをダウンロードしました');
    } catch (error: any) {
      toast.error(`エクスポートエラー: ${error.message}`);
    } finally {
      setExporting(false);
    }
  }, [formData, profitResult]);

  // === 出品（下書き/即時） ===
  const handleListing = useCallback(async (asDraft: boolean) => {
    // バリデーション
    const errors: string[] = [];
    if (!formData.title) errors.push('商品名');
    if (!formData.categoryCode) errors.push('カテゴリ');
    if (formData.sellingPrice <= 0) errors.push('販売価格');
    if (!formData.htmlDescription) errors.push('HTML説明文');
    if (formData.images.length === 0) errors.push('画像');

    if (errors.length > 0) {
      toast.error(`必須項目が未入力: ${errors.join(', ')}`);
      return;
    }

    setListing(true);

    try {
      // Qoo10出品データ
      const qoo10ListingData = {
        SecondSubCat: formData.categoryCode,
        ItemTitle: formData.title.substring(0, 50),
        PromotionName: formData.promotionText,
        SellerCode: formData.sellerCode,
        SellingPrice: formData.sellingPrice,
        RetailPrice: formData.originalPrice,
        ItemQty: asDraft ? 0 : formData.stockQuantity, // 下書きは在庫0
        ShippingNo: '0', // 送料コードは別途設定
        AdultYN: formData.adultYn,
        ItemDetail: formData.htmlDescription,
        ContactInfo: formData.contactInfo,
        IndustrialCodeType: formData.janCode ? 'J' : '',
        IndustrialCode: formData.janCode,
        ImageUrl: formData.images[0],
        ImageUrl2: formData.images[1],
        ImageUrl3: formData.images[2],
        ImageUrl4: formData.images[3],
        ImageUrl5: formData.images[4],
      };

      // N3 DBに保存
      onSave?.({
        qoo10_data: {
          ...formData,
          listingData: qoo10ListingData,
          listingStatus: asDraft ? 'draft' : 'pending',
          calculatedAt: new Date().toISOString(),
          profitResult,
        },
      });

      toast.success(asDraft 
        ? '✓ 下書き保存しました（在庫0）' 
        : '✓ 出品キューに追加しました'
      );
    } catch (error: any) {
      toast.error(`エラー: ${error.message}`);
    } finally {
      setListing(false);
    }
  }, [formData, profitResult, onSave]);

  // === レンダリング ===
  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        商品を選択してください
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100%', background: T.bg }}>
      {/* === 左サイドバー: ナビゲーション + サマリー === */}
      <div style={{ width: '240px', borderRight: `1px solid ${T.panelBorder}`, padding: '0.75rem', overflow: 'auto' }}>
        {/* Qoo10ロゴ */}
        <div style={{
          padding: '0.75rem',
          background: `linear-gradient(135deg, ${T.accent}, #ff6699)`,
          borderRadius: '6px',
          marginBottom: '0.75rem',
          textAlign: 'center',
        }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>Qoo10 出品</span>
        </div>

        {/* セクションナビ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
          {[
            { id: 'basic', label: '基本情報', icon: 'fa-info-circle' },
            { id: 'pricing', label: '価格・送料', icon: 'fa-calculator' },
            { id: 'html', label: 'HTML説明文', icon: 'fa-code' },
            { id: 'images', label: '画像設定', icon: 'fa-images' },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as any)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                border: 'none',
                background: activeSection === section.id ? T.accent : 'transparent',
                color: activeSection === section.id ? 'white' : T.text,
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: activeSection === section.id ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className={`fas ${section.icon}`}></i>
              {section.label}
            </button>
          ))}
        </div>

        {/* 計算結果サマリー */}
        {profitResult && (
          <div style={{
            padding: '0.75rem',
            background: profitResult.isProfitable ? `${T.success}15` : `${T.error}15`,
            borderRadius: '6px',
            border: `1px solid ${profitResult.isProfitable ? T.success : T.error}`,
          }}>
            <div style={{ fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.5rem' }}>
              利益計算結果
            </div>
            <div style={{ display: 'grid', gap: '0.25rem', fontSize: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: T.textMuted }}>利益</span>
                <span style={{ fontWeight: 700, color: profitResult.isProfitable ? T.success : T.error }}>
                  {formatJPY(profitResult.netProfit)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: T.textMuted }}>利益率</span>
                <span style={{ fontWeight: 700, color: profitResult.isProfitable ? T.success : T.error }}>
                  {profitResult.profitMargin.toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: T.textMuted }}>推奨価格</span>
                <span style={{ fontWeight: 600, color: T.blue }}>
                  {formatJPY(profitResult.recommendedPrice)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={handleCalculate}
            disabled={calculating}
            style={{
              padding: '0.5rem',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              background: T.blue,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {calculating ? <><i className="fas fa-spinner fa-spin"></i> 計算中...</> : <><i className="fas fa-calculator"></i> 利益計算</>}
          </button>
          
          <button
            onClick={handleExportExcel}
            disabled={!profitResult || exporting}
            style={{
              padding: '0.5rem',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px',
              border: `1px solid ${T.success}`,
              background: 'transparent',
              color: T.success,
              cursor: profitResult ? 'pointer' : 'not-allowed',
              opacity: profitResult ? 1 : 0.5,
            }}
          >
            <i className="fas fa-file-excel"></i> CSV出力
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              onClick={() => handleListing(true)}
              disabled={listing}
              style={{
                padding: '0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: `1px solid ${T.accent}`,
                background: 'transparent',
                color: T.accent,
                cursor: 'pointer',
              }}
            >
              下書き
            </button>
            <button
              onClick={() => handleListing(false)}
              disabled={listing}
              style={{
                padding: '0.5rem',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: T.accent,
                color: 'white',
                cursor: 'pointer',
              }}
            >
              出品
            </button>
          </div>
        </div>
      </div>

      {/* === メインコンテンツ === */}
      <div style={{ flex: 1, padding: '0.75rem', overflow: 'auto' }}>
        {/* 基本情報セクション */}
        {activeSection === 'basic' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionCard title="商品情報">
              <FormField label="商品名 *" maxLength={50} currentLength={formData.title.length}>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value.substring(0, 50) }))}
                  placeholder="Qoo10用商品タイトル（50文字以内）"
                  style={inputStyle}
                />
              </FormField>
              
              <FormField label="キャッチコピー（広告文）">
                <input
                  type="text"
                  value={formData.promotionText}
                  onChange={(e) => setFormData(prev => ({ ...prev, promotionText: e.target.value }))}
                  placeholder="送料無料！今だけ限定価格！"
                  style={inputStyle}
                />
              </FormField>

              <FormField label="商品説明">
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="商品の特徴、使い方、スペックなど"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </FormField>
            </SectionCard>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <SectionCard title="カテゴリ・属性">
                <FormField label="カテゴリ *">
                  <select
                    value={formData.categoryCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryCode: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="">選択してください</option>
                    {QOO10_CATEGORIES.map(cat => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name} (手数料 {cat.fee}%)
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="成人商品">
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {(['N', 'Y'] as const).map(val => (
                      <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          checked={formData.adultYn === val}
                          onChange={() => setFormData(prev => ({ ...prev, adultYn: val }))}
                        />
                        {val === 'N' ? '一般商品' : '成人商品'}
                      </label>
                    ))}
                  </div>
                </FormField>

                <FormField label="ブランド">
                  <input
                    type="text"
                    value={formData.brandName}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                    placeholder="ブランド名"
                    style={inputStyle}
                  />
                </FormField>
              </SectionCard>

              <SectionCard title="識別情報">
                <FormField label="販売者商品コード（SKU）">
                  <input
                    type="text"
                    value={formData.sellerCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, sellerCode: e.target.value }))}
                    placeholder="SKU-12345"
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="JANコード">
                  <input
                    type="text"
                    value={formData.janCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, janCode: e.target.value }))}
                    placeholder="4901234567890"
                    style={inputStyle}
                  />
                </FormField>

                <FormField label="返品連絡先 *">
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
                    style={inputStyle}
                  />
                </FormField>
              </SectionCard>
            </div>
          </div>
        )}

        {/* 価格・送料セクション */}
        {activeSection === 'pricing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionCard title="価格設定">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <FormField label="仕入れ価格 *">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '11px' }}>¥</span>
                    <input
                      type="number"
                      value={formData.costPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPrice: Number(e.target.value) }))}
                      style={{ ...inputStyle, paddingLeft: '20px' }}
                    />
                  </div>
                </FormField>

                <FormField label="販売価格 *">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '11px' }}>¥</span>
                    <input
                      type="number"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, sellingPrice: Number(e.target.value) }))}
                      style={{ ...inputStyle, paddingLeft: '20px' }}
                    />
                  </div>
                </FormField>

                <FormField label="定価（元値表示用）">
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '11px' }}>¥</span>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      style={{ ...inputStyle, paddingLeft: '20px' }}
                    />
                  </div>
                </FormField>

                <FormField label="在庫数">
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                    min={0}
                    style={inputStyle}
                  />
                </FormField>
              </div>

              {/* 推奨価格適用ボタン */}
              {profitResult && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    onClick={applyRecommendedPrice}
                    style={{
                      padding: '0.375rem 0.75rem',
                      fontSize: '10px',
                      borderRadius: '4px',
                      border: `1px solid ${T.blue}`,
                      background: `${T.blue}10`,
                      color: T.blue,
                      cursor: 'pointer',
                    }}
                  >
                    推奨価格 {formatJPY(profitResult.recommendedPrice)} を適用
                  </button>
                </div>
              )}
            </SectionCard>

            <SectionCard title="配送設定">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                <FormField label="配送業者">
                  <select
                    value={formData.shippingCarrier}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingCarrier: e.target.value as any }))}
                    style={inputStyle}
                  >
                    <option value="jp_post">日本郵便</option>
                    <option value="yamato">ヤマト運輸</option>
                    <option value="sagawa">佐川急便</option>
                  </select>
                </FormField>

                <FormField label="サイズ">
                  <select
                    value={formData.shippingSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingSize: e.target.value }))}
                    style={inputStyle}
                  >
                    {SHIPPING_SERVICES.filter(s => s.carrier === formData.shippingCarrier).map(s => (
                      <option key={s.id} value={s.sizeCode}>
                        {s.nameJa} ({s.isFlat ? formatJPY(s.flatRate!) : 'サイズ制'})
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="発送元地域">
                  <select
                    value={formData.shippingRegion}
                    onChange={(e) => setFormData(prev => ({ ...prev, shippingRegion: e.target.value as any }))}
                    style={inputStyle}
                  >
                    {Object.entries(REGION_DISPLAY_NAMES).map(([key, name]) => (
                      <option key={key} value={key}>{name}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="送料負担">
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '32px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.isFreeShipping}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFreeShipping: e.target.checked }))}
                      />
                      送料無料
                    </label>
                  </div>
                </FormField>
              </div>

              <button
                onClick={autoSelectShipping}
                style={{
                  padding: '0.375rem 0.75rem',
                  fontSize: '10px',
                  borderRadius: '4px',
                  border: `1px solid ${T.success}`,
                  background: `${T.success}10`,
                  color: T.success,
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                <i className="fas fa-magic"></i> 最安送料を自動選択
              </button>
            </SectionCard>

            {/* 利益計算結果表示 */}
            {profitResult && (
              <SectionCard title="利益計算詳細">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {[
                    { label: '送料', value: formatJPY(profitResult.shippingFee) },
                    { label: 'Qoo10手数料', value: formatJPY(profitResult.qoo10Fee) },
                    { label: '決済手数料', value: formatJPY(profitResult.paymentFee) },
                    { label: '損益分岐', value: formatJPY(profitResult.breakEvenPrice) },
                    { label: '純利益', value: formatJPY(profitResult.netProfit), color: profitResult.isProfitable ? T.success : T.error },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '0.5rem', background: T.highlight, borderRadius: '4px', textAlign: 'center' }}>
                      <div style={{ fontSize: '8px', color: T.textMuted }}>{item.label}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: item.color || T.text }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                {profitResult.warnings.length > 0 && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: `${T.warning}15`, borderRadius: '4px' }}>
                    {profitResult.warnings.map((w, i) => (
                      <div key={i} style={{ fontSize: '10px', color: T.warning }}>
                        <i className="fas fa-exclamation-triangle"></i> {w}
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            )}
          </div>
        )}

        {/* HTML説明文セクション */}
        {activeSection === 'html' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionCard title="HTML商品説明">
              <div style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={generateHtml}
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '11px',
                    fontWeight: 600,
                    borderRadius: '4px',
                    border: 'none',
                    background: T.accent,
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-magic"></i> HTMLを自動生成
                </button>
                <span style={{ marginLeft: '0.5rem', fontSize: '10px', color: T.textMuted }}>
                  ※商品情報から自動でHTMLを生成します
                </span>
              </div>

              <textarea
                value={formData.htmlDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, htmlDescription: e.target.value }))}
                rows={20}
                placeholder="<div>...</div>"
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '10px', resize: 'vertical' }}
              />
            </SectionCard>

            {/* HTMLプレビュー */}
            {formData.htmlDescription && (
              <SectionCard title="プレビュー">
                <div
                  style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '4px',
                    border: `1px solid ${T.panelBorder}`,
                    maxHeight: '400px',
                    overflow: 'auto',
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.htmlDescription }}
                />
              </SectionCard>
            )}
          </div>
        )}

        {/* 画像設定セクション */}
        {activeSection === 'images' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <SectionCard title="商品画像（最大10枚）">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '4px',
                      border: `2px dashed ${formData.images[i] ? T.success : T.panelBorder}`,
                      background: formData.images[i] ? 'white' : T.highlight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {formData.images[i] ? (
                      <>
                        <img
                          src={formData.images[i]}
                          alt={`Image ${i + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          background: i === 0 ? T.accent : T.textMuted,
                          color: 'white',
                          fontSize: '8px',
                          padding: '2px 4px',
                          borderRadius: '2px',
                        }}>
                          {i === 0 ? 'メイン' : i + 1}
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', color: T.textSubtle, fontSize: '10px' }}>
                        <i className="fas fa-image" style={{ fontSize: '20px', marginBottom: '4px' }}></i>
                        <div>{i + 1}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '0.75rem', fontSize: '10px', color: T.textMuted }}>
                <i className="fas fa-info-circle"></i> 
                {' '}画像はモーダルの「Images」タブで設定できます。メイン画像は正方形推奨（600x600px以上）
              </div>
            </SectionCard>

            <SectionCard title="ストック画像設定（今後実装予定）">
              <div style={{ padding: '1rem', background: T.highlight, borderRadius: '4px', textAlign: 'center', color: T.textMuted, fontSize: '11px' }}>
                <i className="fas fa-tools" style={{ fontSize: '24px', marginBottom: '0.5rem' }}></i>
                <div>モール別ストック画像（品質保証マーク等）の設定機能は今後追加予定です</div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}

// === ヘルパーコンポーネント ===

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: T.panel,
      borderRadius: '6px',
      border: `1px solid ${T.panelBorder}`,
      padding: '0.75rem',
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: T.textMuted,
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: `1px solid ${T.panelBorder}`,
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, children, maxLength, currentLength }: { 
  label: string; 
  children: React.ReactNode; 
  maxLength?: number;
  currentLength?: number;
}) {
  return (
    <div>
      <label style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '10px',
        fontWeight: 600,
        color: T.textMuted,
        marginBottom: '0.25rem',
      }}>
        <span>{label}</span>
        {maxLength && currentLength !== undefined && (
          <span style={{ color: currentLength > maxLength * 0.8 ? T.warning : T.textSubtle }}>
            {currentLength}/{maxLength}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.375rem 0.5rem',
  fontSize: '11px',
  borderRadius: '4px',
  border: `1px solid ${T.panelBorder}`,
  background: T.panel,
  color: T.text,
};

export default TabQoo10;
