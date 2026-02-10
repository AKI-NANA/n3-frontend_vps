// components/product-modal/components/Tabs/components/ai-audit-panel.tsx
/**
 * AI監査用JSONエクスポートパネル
 * 
 * 機能:
 * - 出品データを監査用JSONとして出力
 * - ワンクリックでクリップボードにコピー
 * - AI（Gemini/Claude）に直接渡せる形式
 */

'use client';

import { useState, useCallback } from 'react';
import type { Product } from '@/types/product';

// カラー定数
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  text: '#1e293b',
  textMuted: '#64748b',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
};

interface AIAuditPanelProps {
  product: Product | null;
}

interface AuditData {
  // 1. 商品基本情報
  basicInfo: {
    sku: string;
    title: string;
    titleJa: string;
    categoryId: string;
    categoryName: string;
    material: string;
    countryOfOrigin: string;
    condition: string;
    conditionId: number;
    conditionDescriptors: any[] | null;
  };
  
  // 2. コスト計算の根拠
  costBreakdown: {
    purchasePriceJpy: number;
    exchangeRate: number;
    profitMarginPercent: number;
    ebayFeePercent: number;
    paypalFeePercent: number;
    finalPriceUsd: number;
    estimatedProfitUsd: number;
  };
  
  // 3. 物流データ
  logistics: {
    weightGrams: number;
    dimensions: {
      lengthCm: number;
      widthCm: number;
      heightCm: number;
    };
    shippingPolicyId: string;
    shippingPolicyName: string;
    shippingCostUsd: number;
    carrierCode: string;
  };
  
  // 4. 税務データ
  taxCompliance: {
    htsCode: string;
    htsDescription: string;
    dutyRatePercent: number;
    vatApplicable: boolean;
    gprsRequired: boolean;
  };
  
  // 5. eBay API送信データ
  ebayApiPayload: {
    inventoryItem: any;
    offer: any;
  };
  
  // メタデータ
  metadata: {
    generatedAt: string;
    systemVersion: string;
    marketplace: string;
  };
}

/**
 * 商品データからAI監査用JSONを生成
 */
function generateAuditData(product: Product | null): AuditData | null {
  if (!product) return null;
  
  const p = product as any;
  const listingData = p.listing_data || {};
  const ebayData = p.ebay_api_data || {};
  const productDetails = p.product_details || {};
  
  // 基本情報
  const basicInfo = {
    sku: p.sku || '',
    title: p.english_title || p.title_en || p.title || '',
    titleJa: p.title || '',
    categoryId: ebayData.category_id || p.ebay_category_id || listingData.ebay_category_id || '',
    categoryName: listingData.ebay_category_name || '',
    material: productDetails.material || listingData.item_specifics?.Material || 'Not specified',
    countryOfOrigin: listingData.item_specifics?.['Country/Region of Manufacture'] || 'Japan',
    condition: listingData.condition || listingData.condition_en || p.condition_name || 'Used',
    conditionId: listingData.condition_id || 3000,
    conditionDescriptors: listingData.condition_descriptors || null,
  };
  
  // コスト計算
  const purchasePrice = p.purchase_price_jpy || p.cost_jpy || listingData.purchase_price_jpy || 0;
  const exchangeRate = listingData.exchange_rate || 150;
  const finalPrice = listingData.ddp_price_usd || p.ddp_price_usd || p.price_usd || 0;
  const ebayFee = finalPrice * 0.132; // 13.2%概算
  const paypalFee = finalPrice * 0.029 + 0.30; // 2.9% + $0.30
  const shippingCost = listingData.shipping_cost_usd || 0;
  const purchasePriceUsd = purchasePrice / exchangeRate;
  const estimatedProfit = finalPrice - purchasePriceUsd - ebayFee - paypalFee - shippingCost;
  
  const costBreakdown = {
    purchasePriceJpy: purchasePrice,
    exchangeRate: exchangeRate,
    profitMarginPercent: finalPrice > 0 ? ((estimatedProfit / finalPrice) * 100) : 0,
    ebayFeePercent: 13.2,
    paypalFeePercent: 2.9,
    finalPriceUsd: finalPrice,
    estimatedProfitUsd: Math.round(estimatedProfit * 100) / 100,
  };
  
  // 物流データ
  const logistics = {
    weightGrams: listingData.weight_g || p.weight_g || 100,
    dimensions: {
      lengthCm: listingData.length_cm || p.length_cm || 15,
      widthCm: listingData.width_cm || p.width_cm || 10,
      heightCm: listingData.height_cm || p.height_cm || 1,
    },
    shippingPolicyId: listingData.shipping_policy_id?.toString() || '',
    shippingPolicyName: listingData.shipping_policy_name || '',
    shippingCostUsd: shippingCost,
    carrierCode: listingData.carrier_code || 'JAPANPOST',
  };
  
  // 税務データ
  const taxCompliance = {
    htsCode: listingData.hts_code || p.hts_code || '',
    htsDescription: listingData.hts_description || '',
    dutyRatePercent: listingData.duty_rate || 0,
    vatApplicable: listingData.vat_applicable || false,
    gprsRequired: listingData.gprs_required || false,
  };
  
  // eBay API送信データ
  const inventoryItem = {
    sku: basicInfo.sku,
    product: {
      title: basicInfo.title,
      aspects: listingData.item_specifics || {},
      imageUrls: p.gallery_images || [p.primary_image_url].filter(Boolean),
    },
    condition: basicInfo.condition,
    conditionDescriptors: basicInfo.conditionDescriptors,
    availability: {
      shipToLocationAvailability: {
        quantity: p.stock_quantity || p.current_stock || 1,
      },
    },
    packageWeightAndSize: {
      weight: { value: logistics.weightGrams, unit: 'GRAM' },
      dimensions: {
        length: logistics.dimensions.lengthCm,
        width: logistics.dimensions.widthCm,
        height: logistics.dimensions.heightCm,
        unit: 'CENTIMETER',
      },
    },
  };
  
  const offer = {
    sku: basicInfo.sku,
    marketplaceId: 'EBAY_US',
    format: 'FIXED_PRICE',
    categoryId: basicInfo.categoryId,
    conditionId: basicInfo.conditionId,
    conditionDescriptors: basicInfo.conditionDescriptors,
    pricingSummary: {
      price: { currency: 'USD', value: finalPrice.toFixed(2) },
    },
    listingPolicies: {
      fulfillmentPolicyId: logistics.shippingPolicyId,
    },
  };
  
  return {
    basicInfo,
    costBreakdown,
    logistics,
    taxCompliance,
    ebayApiPayload: { inventoryItem, offer },
    metadata: {
      generatedAt: new Date().toISOString(),
      systemVersion: 'N3 v2.0',
      marketplace: 'eBay US',
    },
  };
}

/**
 * AI監査用プロンプトを生成
 */
function generateAuditPrompt(data: AuditData): string {
  return `あなたはeBay輸出の専門コンサルタント、および国際物流・税関のスペシャリストです。
以下のJSONデータを分析し、出品の「安全性」と「利益の妥当性」を多角的に検証してください。

【検証ステップ】
1. **HTSコードの整合性**: 商品タイトルと素材から判断して、設定されたHTSコード（関税番号）は米国税関の基準で適切か？
2. **関税リスクの評価**: このHTSコードに基づき、バイヤーが支払うべき想定関税率は正しいか？（アンチダンピング税等のリスクはないか？）
3. **価格計算の正確性**: 為替、手数料、送料、原価から計算された「最終利益」に計算ミスはないか？
4. **物流の妥当性**: 商品重量に対し、選択された配送ポリシーの料金設定は赤字のリスクがないか？
5. **eBay規約遵守**: このカテゴリで必須とされるAspects（属性）は全て網羅されているか？
6. **Condition設定**: conditionIdとconditionDescriptorsは、カテゴリ${data.basicInfo.categoryId}に対して適切か？

【入力データ (JSON)】
${JSON.stringify(data, null, 2)}`;
}

export function AIAuditPanel({ product }: AIAuditPanelProps) {
  const [copied, setCopied] = useState<'json' | 'prompt' | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const auditData = generateAuditData(product);
  
  const handleCopyJson = useCallback(async () => {
    if (!auditData) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(auditData, null, 2));
      setCopied('json');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('コピー失敗:', err);
    }
  }, [auditData]);
  
  const handleCopyPrompt = useCallback(async () => {
    if (!auditData) return;
    
    try {
      const prompt = generateAuditPrompt(auditData);
      await navigator.clipboard.writeText(prompt);
      setCopied('prompt');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('コピー失敗:', err);
    }
  }, [auditData]);
  
  if (!product) {
    return (
      <div style={{ padding: 16, color: T.textMuted, textAlign: 'center' }}>
        商品を選択してください
      </div>
    );
  }
  
  return (
    <div style={{
      backgroundColor: T.panel,
      border: `1px solid ${T.panelBorder}`,
      borderRadius: 8,
      padding: 16,
      marginTop: 16,
    }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🤖</span>
          <span style={{ fontWeight: 600, color: T.text }}>AI監査データ</span>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          style={{
            padding: '4px 8px',
            fontSize: 12,
            backgroundColor: 'transparent',
            border: `1px solid ${T.panelBorder}`,
            borderRadius: 4,
            cursor: 'pointer',
            color: T.textMuted,
          }}
        >
          {showPreview ? '閉じる' : 'プレビュー'}
        </button>
      </div>
      
      {/* 説明 */}
      <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 12 }}>
        出品データをAI（Gemini/Claude）で検証するためのJSONデータを生成します。
        HTSコード、利益計算、配送設定の妥当性をAIがチェックします。
      </p>
      
      {/* ボタン */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          onClick={handleCopyJson}
          style={{
            flex: 1,
            minWidth: 140,
            padding: '10px 16px',
            backgroundColor: copied === 'json' ? T.success : T.accent,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background-color 0.2s',
          }}
        >
          {copied === 'json' ? (
            <>✓ コピー完了</>
          ) : (
            <>📋 JSONをコピー</>
          )}
        </button>
        
        <button
          onClick={handleCopyPrompt}
          style={{
            flex: 1,
            minWidth: 140,
            padding: '10px 16px',
            backgroundColor: copied === 'prompt' ? T.success : T.warning,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background-color 0.2s',
          }}
        >
          {copied === 'prompt' ? (
            <>✓ コピー完了</>
          ) : (
            <>🧠 AI用プロンプトをコピー</>
          )}
        </button>
      </div>
      
      {/* プレビュー */}
      {showPreview && auditData && (
        <div style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: T.bg,
          borderRadius: 6,
          maxHeight: 300,
          overflow: 'auto',
        }}>
          <pre style={{
            fontSize: 11,
            fontFamily: 'Monaco, Consolas, monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0,
            color: T.text,
          }}>
            {JSON.stringify(auditData, null, 2)}
          </pre>
        </div>
      )}
      
      {/* サマリー */}
      {auditData && (
        <div style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: T.bg,
          borderRadius: 6,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 8,
        }}>
          <SummaryItem label="SKU" value={auditData.basicInfo.sku} />
          <SummaryItem label="カテゴリ" value={auditData.basicInfo.categoryId} />
          <SummaryItem label="価格" value={`$${auditData.costBreakdown.finalPriceUsd.toFixed(2)}`} />
          <SummaryItem label="予想利益" value={`$${auditData.costBreakdown.estimatedProfitUsd.toFixed(2)}`} highlight={auditData.costBreakdown.estimatedProfitUsd > 0} />
          <SummaryItem label="重量" value={`${auditData.logistics.weightGrams}g`} />
          <SummaryItem label="HTS" value={auditData.taxCompliance.htsCode || '未設定'} warn={!auditData.taxCompliance.htsCode} />
          <SummaryItem label="Condition ID" value={auditData.basicInfo.conditionId.toString()} />
          <SummaryItem label="Descriptors" value={auditData.basicInfo.conditionDescriptors ? '設定済' : '未設定'} warn={!auditData.basicInfo.conditionDescriptors} />
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value, highlight, warn }: { 
  label: string; 
  value: string; 
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: 10, color: T.textMuted }}>{label}</div>
      <div style={{ 
        fontSize: 12, 
        fontWeight: 500, 
        color: warn ? T.warning : highlight ? T.success : T.text,
      }}>
        {value}
      </div>
    </div>
  );
}

export default AIAuditPanel;
