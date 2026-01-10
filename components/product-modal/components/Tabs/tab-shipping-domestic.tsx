'use client';

/**
 * TabShippingDomestic - 国内配送設定タブ
 * 
 * ヤマト運輸、日本郵便、佐川急便の国内送料計算
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

import {
  SHIPPING_SERVICES,
  YAMATO_TAKKYUBIN_RATES,
  YUPACK_RATES,
  REGION_DISPLAY_NAMES,
  CARRIER_DISPLAY_NAMES,
  getShippingRate,
  findCheapestShipping,
  type ShippingService,
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

export interface TabShippingDomesticProps {
  product: Product | null;
  marketplace?: string;
  onSave?: (updates: any) => void;
}

export function TabShippingDomestic({ product, marketplace = 'qoo10-jp', onSave }: TabShippingDomesticProps) {
  // === 状態 ===
  const [selectedCarrier, setSelectedCarrier] = useState<'yamato' | 'jp_post' | 'sagawa'>('jp_post');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<keyof typeof REGION_DISPLAY_NAMES>('kanto');
  const [isFreeShipping, setIsFreeShipping] = useState(true);
  
  // 商品情報
  const [productInfo, setProductInfo] = useState({
    weightG: 500,
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
  });

  // === 商品データから初期化 ===
  useEffect(() => {
    if (product) {
      setProductInfo({
        weightG: (product as any)?.weight_g || 500,
        lengthCm: (product as any)?.length_cm || 0,
        widthCm: (product as any)?.width_cm || 0,
        heightCm: (product as any)?.height_cm || 0,
      });
    }
  }, [product]);

  // === 利用可能なサービス ===
  const availableServices = useMemo(() => {
    return SHIPPING_SERVICES.filter(s => s.carrier === selectedCarrier);
  }, [selectedCarrier]);

  // 最初のサービスを選択
  useEffect(() => {
    if (availableServices.length > 0 && !selectedService) {
      setSelectedService(availableServices[0].id);
    }
  }, [availableServices, selectedService]);

  // === 選択中のサービス ===
  const currentService = useMemo(() => {
    return SHIPPING_SERVICES.find(s => s.id === selectedService);
  }, [selectedService]);

  // === 送料計算 ===
  const shippingCost = useMemo(() => {
    if (!currentService) return 0;
    return currentService.isFlat && currentService.flatRate
      ? currentService.flatRate
      : getShippingRate(selectedCarrier, currentService.sizeCode, selectedRegion);
  }, [currentService, selectedCarrier, selectedRegion]);

  // === 最安送料を自動選択 ===
  const autoSelectCheapest = useCallback(() => {
    const cheapest = findCheapestShipping(
      productInfo.weightG,
      productInfo.lengthCm || undefined,
      productInfo.widthCm || undefined,
      productInfo.heightCm || undefined,
      selectedRegion
    );
    
    if (cheapest) {
      setSelectedCarrier(cheapest.service.carrier);
      setSelectedService(cheapest.service.id);
      toast.success(`最安送料: ${cheapest.service.nameJa} (¥${cheapest.rate}) を選択しました`);
    } else {
      toast.error('適切な送料が見つかりませんでした');
    }
  }, [productInfo, selectedRegion]);

  // === 保存 ===
  const handleSave = useCallback(() => {
    onSave?.({
      domestic_shipping: {
        carrier: selectedCarrier,
        service_id: selectedService,
        service_name: currentService?.nameJa,
        size_code: currentService?.sizeCode,
        region: selectedRegion,
        is_free_shipping: isFreeShipping,
        shipping_cost: shippingCost,
        product_weight_g: productInfo.weightG,
        saved_at: new Date().toISOString(),
      },
    });
    toast.success('配送設定を保存しました');
  }, [selectedCarrier, selectedService, currentService, selectedRegion, isFreeShipping, shippingCost, productInfo, onSave]);

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
        background: `linear-gradient(135deg, ${T.blue}, #60a5fa)`,
        borderRadius: '6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-truck" style={{ color: 'white' }}></i>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>
            国内配送設定
          </span>
        </div>
        <button
          onClick={autoSelectCheapest}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '10px',
            fontWeight: 600,
            borderRadius: '4px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-magic"></i> 最安自動選択
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* 左: 配送業者・サービス選択 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 商品情報 */}
          <SectionCard title="商品サイズ・重量">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              <FormField label="重量 (g)">
                <input
                  type="number"
                  value={productInfo.weightG}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, weightG: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="縦 (cm)">
                <input
                  type="number"
                  value={productInfo.lengthCm}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, lengthCm: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="横 (cm)">
                <input
                  type="number"
                  value={productInfo.widthCm}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, widthCm: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </FormField>
              <FormField label="高さ (cm)">
                <input
                  type="number"
                  value={productInfo.heightCm}
                  onChange={(e) => setProductInfo(prev => ({ ...prev, heightCm: Number(e.target.value) }))}
                  style={inputStyle}
                />
              </FormField>
            </div>
            {productInfo.lengthCm > 0 && productInfo.widthCm > 0 && productInfo.heightCm > 0 && (
              <div style={{ marginTop: '0.5rem', fontSize: '10px', color: T.textMuted }}>
                3辺合計: {productInfo.lengthCm + productInfo.widthCm + productInfo.heightCm} cm
              </div>
            )}
          </SectionCard>

          {/* 配送業者選択 */}
          <SectionCard title="配送業者">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {(['jp_post', 'yamato', 'sagawa'] as const).map(carrier => (
                <button
                  key={carrier}
                  onClick={() => {
                    setSelectedCarrier(carrier);
                    setSelectedService('');
                  }}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: `2px solid ${selectedCarrier === carrier ? T.blue : T.panelBorder}`,
                    background: selectedCarrier === carrier ? `${T.blue}10` : 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: selectedCarrier === carrier ? T.blue : T.text }}>
                    {CARRIER_DISPLAY_NAMES[carrier]}
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* サービス選択 */}
          <SectionCard title="配送サービス">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxHeight: '200px', overflow: 'auto' }}>
              {availableServices.map(service => {
                const rate = service.isFlat && service.flatRate
                  ? service.flatRate
                  : getShippingRate(selectedCarrier, service.sizeCode, selectedRegion);
                
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '4px',
                      border: `1px solid ${selectedService === service.id ? T.blue : T.panelBorder}`,
                      background: selectedService === service.id ? `${T.blue}10` : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: T.text }}>{service.nameJa}</div>
                      <div style={{ fontSize: '9px', color: T.textMuted }}>{service.description}</div>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: T.accent }}>
                      ¥{rate.toLocaleString()}
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* 発送元・送料負担 */}
          <SectionCard title="発送設定">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <FormField label="発送元地域">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as any)}
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
                    checked={isFreeShipping}
                    onChange={(e) => setIsFreeShipping(e.target.checked)}
                  />
                  <span style={{ fontSize: '11px' }}>送料無料（セラー負担）</span>
                </label>
              </FormField>
            </div>
          </SectionCard>
        </div>

        {/* 右: 料金表示・保存 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 選択中の送料 */}
          <SectionCard title="選択中の配送方法">
            {currentService ? (
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '12px', color: T.textMuted, marginBottom: '0.5rem' }}>
                  {CARRIER_DISPLAY_NAMES[selectedCarrier]} / {currentService.nameJa}
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: T.accent }}>
                  ¥{shippingCost.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '0.5rem' }}>
                  {currentService.tracking && <span style={{ marginRight: '0.5rem' }}>✓ 追跡可</span>}
                  {currentService.compensation && <span>✓ 補償あり</span>}
                </div>
                {isFreeShipping && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    background: `${T.accent}15`,
                    color: T.accent,
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    display: 'inline-block',
                  }}>
                    送料無料（この料金はセラー負担）
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: T.textMuted, padding: '2rem' }}>
                配送サービスを選択してください
              </div>
            )}
          </SectionCard>

          {/* 地域別送料表 */}
          {currentService && !currentService.isFlat && (
            <SectionCard title="地域別送料">
              <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                  <tbody>
                    {Object.entries(REGION_DISPLAY_NAMES).map(([key, name]) => {
                      const rate = getShippingRate(selectedCarrier, currentService.sizeCode, key as any);
                      return (
                        <tr key={key} style={{ background: key === selectedRegion ? `${T.blue}10` : 'transparent' }}>
                          <td style={{ padding: '0.375rem', borderBottom: `1px solid ${T.panelBorder}` }}>{name}</td>
                          <td style={{ padding: '0.375rem', borderBottom: `1px solid ${T.panelBorder}`, textAlign: 'right', fontWeight: 600 }}>
                            ¥{rate.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            style={{
              padding: '0.75rem',
              fontSize: '12px',
              fontWeight: 600,
              borderRadius: '6px',
              border: 'none',
              background: T.success,
              color: 'white',
              cursor: 'pointer',
              marginTop: 'auto',
            }}
          >
            <i className="fas fa-save"></i> 配送設定を保存
          </button>
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
      <label style={{ display: 'block', fontSize: '9px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>
        {label}
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

export default TabShippingDomestic;
