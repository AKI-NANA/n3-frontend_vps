'use client';

/**
 * TabPricingDomestic - 国内販路用価格計算タブ
 * 
 * Qoo10, Amazon JP, ヤフオク, メルカリ等の国内販売価格計算
 * lib/qoo10/profit-calculator.ts を使用
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

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
} from '@/lib/qoo10/shipping-rates';

// スタイル
const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#ff0066',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  blue: '#3b82f6',
};

// 国内モール手数料率
const DOMESTIC_FEE_RATES: Record<string, { platform: number; payment: number; name: string }> = {
  'qoo10-jp': { platform: 10, payment: 3.5, name: 'Qoo10' },
  'amazon-jp': { platform: 15, payment: 0, name: 'Amazon JP' },
  'yahoo-auction': { platform: 8.8, payment: 0, name: 'ヤフオク' },
  'mercari': { platform: 10, payment: 0, name: 'メルカリ' },
};

export interface TabPricingDomesticProps {
  product: Product | null;
  marketplace?: string;
  onSave?: (updates: any) => void;
}

export function TabPricingDomestic({ product, marketplace = 'qoo10-jp', onSave }: TabPricingDomesticProps) {
  // === フォームデータ ===
  const [formData, setFormData] = useState({
    costPrice: 0,           // 仕入れ価格
    sellingPrice: 0,        // 販売価格
    stockQuantity: 1,
    
    // 配送設定
    shippingCarrier: 'jp_post' as 'yamato' | 'jp_post' | 'sagawa',
    shippingSize: '60',
    shippingRegion: 'kanto' as keyof typeof REGION_DISPLAY_NAMES,
    isFreeShipping: true,
    
    // 梱包費
    packagingCost: 100,
  });

  // === 計算結果 ===
  const [profitResult, setProfitResult] = useState<{
    netProfit: number;
    profitMargin: number;
    platformFee: number;
    paymentFee: number;
    shippingFee: number;
    totalDeductions: number;
    isProfitable: boolean;
    warnings: string[];
  } | null>(null);

  // === 価格ポイント ===
  const [pricePoints, setPricePoints] = useState<{ margin: number; price: number; profit: number }[]>([]);

  // === UI状態 ===
  const [calculating, setCalculating] = useState(false);

  // モール情報
  const feeInfo = DOMESTIC_FEE_RATES[marketplace] || DOMESTIC_FEE_RATES['qoo10-jp'];

  // === 商品データからフォーム初期化 ===
  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        costPrice: (product as any)?.purchase_price_jpy || (product as any)?.price_jpy || 0,
        sellingPrice: (product as any)?.domestic_price_jpy || (product as any)?.price_jpy || 0,
        stockQuantity: product?.stock?.available || 1,
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
      const platformFeeRate = feeInfo.platform / 100;
      const paymentFeeRate = feeInfo.payment / 100;

      const result = calculateQoo10Profit({
        selling_price: formData.sellingPrice,
        cost_price: formData.costPrice,
        shipping_carrier: formData.shippingCarrier,
        shipping_size: formData.shippingSize,
        shipping_region: formData.shippingRegion,
        qoo10_fee_rate: platformFeeRate,
        payment_fee_rate: paymentFeeRate,
        packaging_cost: formData.packagingCost,
        is_free_shipping: formData.isFreeShipping,
        target_margin: 0.20,
      });

      setProfitResult({
        netProfit: result.net_profit,
        profitMargin: result.profit_margin_percent,
        platformFee: result.qoo10_fee,
        paymentFee: result.payment_fee,
        shippingFee: result.shipping_fee,
        totalDeductions: result.total_deductions,
        isProfitable: result.is_profitable,
        warnings: result.warnings,
      });

      // 価格ポイント計算
      const points = calculatePricePoints(
        formData.costPrice,
        formData.shippingCarrier,
        formData.shippingSize,
        formData.shippingRegion,
        platformFeeRate,
        formData.isFreeShipping
      );
      setPricePoints(points);

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
  }, [formData, feeInfo]);

  // === 推奨価格を適用 ===
  const applyRecommendedPrice = useCallback((targetMargin: number) => {
    const platformFeeRate = feeInfo.platform / 100;
    const paymentFeeRate = feeInfo.payment / 100;

    const recommendedPrice = calculateRecommendedPrice(
      formData.costPrice,
      formData.shippingCarrier,
      formData.shippingSize,
      formData.shippingRegion,
      platformFeeRate,
      paymentFeeRate,
      formData.packagingCost,
      formData.isFreeShipping,
      targetMargin / 100
    );

    setFormData(prev => ({ ...prev, sellingPrice: recommendedPrice }));
    toast.success(`${targetMargin}%利益で ${formatJPY(recommendedPrice)} を設定しました`);
  }, [formData, feeInfo]);

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

  // === 保存 ===
  const handleSave = useCallback(() => {
    onSave?.({
      domestic_pricing: {
        marketplace,
        cost_price: formData.costPrice,
        selling_price: formData.sellingPrice,
        shipping_carrier: formData.shippingCarrier,
        shipping_size: formData.shippingSize,
        shipping_region: formData.shippingRegion,
        is_free_shipping: formData.isFreeShipping,
        profit_result: profitResult,
        calculated_at: new Date().toISOString(),
      },
    });
    toast.success('価格設定を保存しました');
  }, [formData, profitResult, marketplace, onSave]);

  // === レンダリング ===
  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>
        商品を選択してください
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', overflow: 'auto', background: T.bg }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '0.75rem',
        background: `linear-gradient(135deg, ${T.accent}, #ff6699)`,
        borderRadius: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-yen-sign" style={{ color: 'white' }}></i>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>
            {feeInfo.name} 価格計算
          </span>
        </div>
        <div style={{
          padding: '0.25rem 0.5rem',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          color: 'white',
          fontSize: '10px',
        }}>
          手数料: {feeInfo.platform}% + {feeInfo.payment}%
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* 左: 入力 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 価格入力 */}
          <SectionCard title="価格設定">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="仕入れ価格 *">
                <PriceInput
                  value={formData.costPrice}
                  onChange={(v) => setFormData(prev => ({ ...prev, costPrice: v }))}
                />
              </FormField>
              <FormField label="販売価格 *">
                <PriceInput
                  value={formData.sellingPrice}
                  onChange={(v) => setFormData(prev => ({ ...prev, sellingPrice: v }))}
                />
              </FormField>
            </div>

            {/* 推奨価格ボタン */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {[10, 15, 20, 25, 30].map(margin => (
                <button
                  key={margin}
                  onClick={() => applyRecommendedPrice(margin)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: '10px',
                    borderRadius: '4px',
                    border: `1px solid ${T.blue}`,
                    background: `${T.blue}10`,
                    color: T.blue,
                    cursor: 'pointer',
                  }}
                >
                  {margin}%利益
                </button>
              ))}
            </div>
          </SectionCard>

          {/* 配送設定 */}
          <SectionCard title="配送設定">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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
                      {s.nameJa}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="発送元">
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', height: '32px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFreeShipping}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFreeShipping: e.target.checked }))}
                  />
                  <span style={{ fontSize: '11px' }}>送料無料（セラー負担）</span>
                </label>
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
                marginTop: '0.25rem',
              }}
            >
              <i className="fas fa-magic"></i> 最安送料を自動選択
            </button>
          </SectionCard>

          {/* アクションボタン */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleCalculate}
              disabled={calculating}
              style={{
                flex: 1,
                padding: '0.75rem',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                background: T.blue,
                color: 'white',
                cursor: 'pointer',
              }}
            >
              {calculating ? <><i className="fas fa-spinner fa-spin"></i> 計算中...</> : <><i className="fas fa-calculator"></i> 利益計算</>}
            </button>
            <button
              onClick={handleSave}
              disabled={!profitResult}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '12px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                background: profitResult ? T.success : T.textSubtle,
                color: 'white',
                cursor: profitResult ? 'pointer' : 'not-allowed',
              }}
            >
              <i className="fas fa-save"></i> 保存
            </button>
          </div>
        </div>

        {/* 右: 計算結果 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 計算結果 */}
          {profitResult ? (
            <>
              <SectionCard title="計算結果">
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.5rem',
                }}>
                  <ResultBox label="純利益" value={formatJPY(profitResult.netProfit)} color={profitResult.isProfitable ? T.success : T.error} large />
                  <ResultBox label="利益率" value={`${profitResult.profitMargin.toFixed(1)}%`} color={profitResult.isProfitable ? T.success : T.error} large />
                </div>

                <div style={{ marginTop: '0.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  <ResultBox label="モール手数料" value={formatJPY(profitResult.platformFee)} />
                  <ResultBox label="決済手数料" value={formatJPY(profitResult.paymentFee)} />
                  <ResultBox label="送料" value={formatJPY(profitResult.shippingFee)} />
                  <ResultBox label="総コスト" value={formatJPY(profitResult.totalDeductions)} />
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

              {/* 価格ポイント表 */}
              <SectionCard title="利益率別 推奨価格">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ background: T.highlight }}>
                        <th style={thStyle}>利益率</th>
                        <th style={thStyle}>販売価格</th>
                        <th style={thStyle}>利益</th>
                        <th style={thStyle}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pricePoints.map((point, i) => (
                        <tr key={i} style={{ background: point.margin === 20 ? `${T.blue}10` : 'transparent' }}>
                          <td style={tdStyle}>{point.margin}%</td>
                          <td style={tdStyle}>{formatJPY(point.price)}</td>
                          <td style={{ ...tdStyle, color: point.profit >= 0 ? T.success : T.error }}>
                            {formatJPY(point.profit)}
                          </td>
                          <td style={tdStyle}>
                            <button
                              onClick={() => {
                                setFormData(prev => ({ ...prev, sellingPrice: point.price }));
                                toast.success(`${point.margin}%利益の価格を適用しました`);
                              }}
                              style={{
                                padding: '0.125rem 0.375rem',
                                fontSize: '9px',
                                borderRadius: '3px',
                                border: 'none',
                                background: T.blue,
                                color: 'white',
                                cursor: 'pointer',
                              }}
                            >
                              適用
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: T.panel,
              borderRadius: '6px',
              border: `1px solid ${T.panelBorder}`,
            }}>
              <div style={{ textAlign: 'center', color: T.textMuted }}>
                <i className="fas fa-calculator" style={{ fontSize: '32px', marginBottom: '0.5rem' }}></i>
                <div style={{ fontSize: '12px' }}>価格を入力して「利益計算」を押してください</div>
              </div>
            </div>
          )}
        </div>
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
        marginBottom: '0.5rem',
        paddingBottom: '0.375rem',
        borderBottom: `1px solid ${T.panelBorder}`,
      }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function PriceInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: T.textMuted, fontSize: '11px' }}>¥</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ...inputStyle, paddingLeft: '20px' }}
      />
    </div>
  );
}

function ResultBox({ label, value, color, large }: { label: string; value: string; color?: string; large?: boolean }) {
  return (
    <div style={{ padding: '0.5rem', background: T.highlight, borderRadius: '4px', textAlign: 'center' }}>
      <div style={{ fontSize: '8px', color: T.textMuted }}>{label}</div>
      <div style={{ fontSize: large ? '16px' : '12px', fontWeight: 700, color: color || T.text }}>{value}</div>
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

const thStyle: React.CSSProperties = {
  padding: '0.5rem',
  textAlign: 'left',
  fontWeight: 600,
  borderBottom: `1px solid ${T.panelBorder}`,
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem',
  borderBottom: `1px solid ${T.panelBorder}`,
};

export default TabPricingDomestic;
