/**
 * Qoo10PricingTab - Qoo10用価格計算・出品タブ
 * 
 * 機能:
 * - 利益計算（国内モール用）
 * - 価格設定
 * - 保存ボタン
 * - 出品ボタン
 * - 画像表示
 */

'use client';

import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  Calculator, Save, ShoppingBag, Loader2, CheckCircle, AlertCircle,
  Image as ImageIcon, Truck, Percent, DollarSign, Tag, Package
} from 'lucide-react';
import { useProductImages } from '@/hooks/useProductImages';

// ============================================================
// 型定義
// ============================================================

interface Qoo10PricingData {
  price_jpy: number;
  profit_jpy: number;
  profit_margin: number;
  shipping_cost: number;
  platform_fee: number;
  payment_fee: number;
  status: 'none' | 'calculated' | 'ready' | 'listed' | 'error';
  last_calculated_at?: string;
  listed_at?: string;
  listing_id?: string;
  error_message?: string;
}

interface Product {
  id: number;
  sku?: string;
  title_ja?: string;
  title_en?: string;
  price_jpy?: number;
  cost_price?: number;
  weight_g?: number;
  gallery_images?: string[];
  scraped_data?: any;
  listing_data?: any;
  marketplace_listings?: {
    qoo10_jp?: Qoo10PricingData;
    [key: string]: any;
  };
}

interface Qoo10PricingTabProps {
  product: Product;
  onSave?: (data: Partial<Product>) => Promise<void>;
  onListToQoo10?: (product: Product) => Promise<void>;
  isReadOnly?: boolean;
}

// ============================================================
// 定数
// ============================================================

const QOO10_FEE_RATE = 0.12;      // 販売手数料 12%
const QOO10_PAYMENT_RATE = 0.035; // 決済手数料 3.5%
const DEFAULT_SHIPPING_COST = 500; // デフォルト送料

// ============================================================
// メインコンポーネント
// ============================================================

export const Qoo10PricingTab = memo(function Qoo10PricingTab({
  product,
  onSave,
  onListToQoo10,
  isReadOnly = false,
}: Qoo10PricingTabProps) {
  // 画像取得
  const { mainImage, allImages, hasImages } = useProductImages(product);

  // 状態管理
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // フォームデータ
  const [formData, setFormData] = useState<Qoo10PricingData>(() => {
    const existing = product.marketplace_listings?.qoo10_jp;
    return {
      price_jpy: existing?.price_jpy || 0,
      profit_jpy: existing?.profit_jpy || 0,
      profit_margin: existing?.profit_margin || 0,
      shipping_cost: existing?.shipping_cost || DEFAULT_SHIPPING_COST,
      platform_fee: existing?.platform_fee || 0,
      payment_fee: existing?.payment_fee || 0,
      status: existing?.status || 'none',
      last_calculated_at: existing?.last_calculated_at,
      listed_at: existing?.listed_at,
      listing_id: existing?.listing_id,
      error_message: existing?.error_message,
    };
  });

  // 利益計算
  const calculateProfit = useCallback(async () => {
    setCalculating(true);
    setError(null);
    setSuccess(null);

    try {
      const costJpy = product.price_jpy || product.cost_price || 0;
      const weightG = product.weight_g || 500;

      if (costJpy <= 0) {
        throw new Error('仕入れ価格が設定されていません');
      }

      // APIで計算
      const response = await fetch('/api/v2/pricing/multi-marketplace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costPriceJpy: costJpy,
          weightGrams: weightG,
          targetMarketplaces: ['qoo10_jp'],
          targetMargin: 15,
        }),
      });

      const data = await response.json();

      if (data.success && data.results?.[0]) {
        const result = data.results[0];
        setFormData(prev => ({
          ...prev,
          price_jpy: Math.round(result.suggestedPrice),
          profit_jpy: Math.round(result.profitJpy),
          profit_margin: result.profitMargin,
          platform_fee: Math.round(result.costBreakdown?.platformFee || 0),
          payment_fee: Math.round(result.costBreakdown?.paymentFee || 0),
          status: result.isProfitable ? 'calculated' : 'error',
          last_calculated_at: new Date().toISOString(),
          error_message: result.isProfitable ? undefined : '利益率が低すぎます',
        }));
        setSuccess('利益計算が完了しました');
      } else {
        throw new Error(data.error || '計算に失敗しました');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCalculating(false);
    }
  }, [product]);

  // 手動で価格変更時の再計算
  const recalculateFromPrice = useCallback((newPrice: number) => {
    const costJpy = product.price_jpy || product.cost_price || 0;
    const shippingCost = formData.shipping_cost;
    
    const platformFee = Math.round(newPrice * QOO10_FEE_RATE);
    const paymentFee = Math.round(newPrice * QOO10_PAYMENT_RATE);
    const totalCost = costJpy + shippingCost + platformFee + paymentFee;
    const profitJpy = newPrice - totalCost;
    const profitMargin = newPrice > 0 ? (profitJpy / newPrice) * 100 : 0;

    setFormData(prev => ({
      ...prev,
      price_jpy: newPrice,
      profit_jpy: profitJpy,
      profit_margin: profitMargin,
      platform_fee: platformFee,
      payment_fee: paymentFee,
      status: profitJpy > 0 ? 'calculated' : 'error',
    }));
  }, [product, formData.shipping_cost]);

  // 保存
  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // marketplace_listings APIで保存
      const response = await fetch('/api/v2/marketplace-listings/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          marketplace: 'qoo10_jp',
          data: {
            ...formData,
            status: formData.profit_jpy > 0 ? 'ready' : 'error',
          },
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({ ...prev, status: 'ready' }));
        setSuccess('保存しました');
        onSave?.({ 
          marketplace_listings: { 
            ...product.marketplace_listings,
            qoo10_jp: formData 
          } 
        });
      } else {
        throw new Error(result.error || '保存に失敗しました');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [product.id, formData, onSave, product.marketplace_listings]);

  // Qoo10に出品
  const handleListToQoo10 = useCallback(async () => {
    if (formData.status !== 'ready' && formData.status !== 'calculated') {
      setError('先に計算と保存を行ってください');
      return;
    }

    setListing(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/v2/listing/qoo10', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          itemTitle: product.title_ja || product.title_en || 'Untitled',
          itemDetail: product.listing_data?.description_ja || product.title_ja || '',
          sellerCode: product.sku || `SKU-${product.id}`,
          secondCategoryCode: product.listing_data?.qoo10_category || '001001001',
          itemPrice: formData.price_jpy,
          itemQty: 1,
          shippingNo: '1',
          imageUrl: mainImage || '',
          optionImageUrls: allImages.slice(1, 10),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData(prev => ({
          ...prev,
          status: 'listed',
          listed_at: new Date().toISOString(),
          listing_id: result.itemCode,
        }));
        setSuccess(`Qoo10に出品しました (商品コード: ${result.itemCode})`);
        onListToQoo10?.(product);
      } else {
        throw new Error(result.error || '出品に失敗しました');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setListing(false);
    }
  }, [product, formData, mainImage, allImages, onListToQoo10]);

  // ステータスバッジ
  const getStatusBadge = () => {
    const statusConfig = {
      none: { label: '未計算', color: '#94a3b8', bg: '#f1f5f9' },
      calculated: { label: '計算済み', color: '#3b82f6', bg: '#dbeafe' },
      ready: { label: '出品準備完了', color: '#f59e0b', bg: '#fef3c7' },
      listed: { label: '出品中', color: '#22c55e', bg: '#dcfce7' },
      error: { label: 'エラー', color: '#ef4444', bg: '#fee2e2' },
    };
    const config = statusConfig[formData.status];
    return (
      <span style={{
        padding: '4px 8px',
        fontSize: '11px',
        fontWeight: 600,
        color: config.color,
        background: config.bg,
        borderRadius: '4px',
      }}>
        {config.label}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} style={{ color: '#ff0066' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Qoo10 出品設定</h3>
          {getStatusBadge()}
        </div>
        {formData.listed_at && (
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            出品日: {new Date(formData.listed_at).toLocaleDateString('ja-JP')}
          </span>
        )}
      </div>

      {/* エラー・成功メッセージ */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '13px',
        }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          background: '#dcfce7',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          color: '#15803d',
          fontSize: '13px',
        }}>
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* メインコンテンツ */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        {/* 画像エリア */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>商品画像</label>
          {hasImages ? (
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}>
              <img
                src={mainImage || ''}
                alt={product.title_ja || 'Product'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div style={{
              width: '200px',
              height: '200px',
              borderRadius: '8px',
              border: '2px dashed #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
            }}>
              <ImageIcon size={32} />
              <span style={{ fontSize: '11px', marginTop: '8px' }}>画像なし</span>
            </div>
          )}
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {allImages.slice(1, 5).map((url, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
              {allImages.length > 5 && (
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '4px',
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: '#64748b',
                }}>
                  +{allImages.length - 5}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 価格・計算エリア */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 仕入れ価格表示 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>仕入れ価格</label>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                ¥{(product.price_jpy || product.cost_price || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>送料</label>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                ¥{formData.shipping_cost.toLocaleString()}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b' }}>重量</label>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>
                {product.weight_g || 500}g
              </div>
            </div>
          </div>

          {/* 販売価格入力 */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px', display: 'block' }}>
              販売価格（税込）
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#64748b' }}>¥</span>
              <input
                type="number"
                value={formData.price_jpy || ''}
                onChange={(e) => recalculateFromPrice(parseInt(e.target.value) || 0)}
                disabled={isReadOnly}
                style={{
                  width: '150px',
                  padding: '8px 12px',
                  fontSize: '20px',
                  fontWeight: 700,
                  border: '2px solid #e2e8f0',
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
              <button
                onClick={calculateProfit}
                disabled={calculating}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  background: '#ff0066',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: calculating ? 'not-allowed' : 'pointer',
                  opacity: calculating ? 0.7 : 1,
                }}
              >
                {calculating ? <Loader2 size={16} className="animate-spin" /> : <Calculator size={16} />}
                自動計算
              </button>
            </div>
          </div>

          {/* 費用内訳 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '8px',
          }}>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b' }}>販売手数料 (12%)</label>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>¥{formData.platform_fee.toLocaleString()}</div>
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b' }}>決済手数料 (3.5%)</label>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>¥{formData.payment_fee.toLocaleString()}</div>
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b' }}>利益額</label>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 700,
                color: formData.profit_jpy >= 0 ? '#22c55e' : '#ef4444',
              }}>
                ¥{formData.profit_jpy.toLocaleString()}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '10px', color: '#64748b' }}>利益率</label>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: 700,
                color: formData.profit_margin >= 15 ? '#22c55e' : formData.profit_margin >= 10 ? '#f59e0b' : '#ef4444',
              }}>
                {formData.profit_margin.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
            <button
              onClick={handleSave}
              disabled={saving || formData.status === 'none'}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: formData.status !== 'none' ? '#3b82f6' : '#e2e8f0',
                color: formData.status !== 'none' ? 'white' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: saving || formData.status === 'none' ? 'not-allowed' : 'pointer',
              }}
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              保存
            </button>
            <button
              onClick={handleListToQoo10}
              disabled={listing || formData.status === 'listed' || (formData.status !== 'ready' && formData.status !== 'calculated')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                background: formData.status === 'listed' ? '#22c55e' : '#ff0066',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: listing || formData.status === 'listed' ? 'not-allowed' : 'pointer',
                opacity: formData.status === 'listed' ? 0.7 : 1,
              }}
            >
              {listing ? (
                <Loader2 size={18} className="animate-spin" />
              ) : formData.status === 'listed' ? (
                <CheckCircle size={18} />
              ) : (
                <ShoppingBag size={18} />
              )}
              {formData.status === 'listed' ? '出品済み' : 'Qoo10に出品'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Qoo10PricingTab;
