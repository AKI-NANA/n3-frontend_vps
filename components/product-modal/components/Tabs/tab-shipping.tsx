'use client';

// TabShipping - V11.0
// 🔥 ebay_shipping_masterテーブルから配送ポリシー取得（1200件）

import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
};

const SHIPPING_SERVICES = [
  { code: 'ExpeditedShippingFromOutsideUS', name: 'Expedited Shipping', nameJa: '速達配送', days: '1-4', category: 'expedited' },
  { code: 'StandardShippingFromOutsideUS', name: 'Standard Shipping', nameJa: '標準配送', days: '5-10', category: 'standard' },
  { code: 'eBaySpeedPAKEconomy', name: 'eBay SpeedPAK Economy', nameJa: 'SpeedPAK', days: '8-12', category: 'economy' },
  { code: 'EconomyShippingFromOutsideUS', name: 'Economy Shipping', nameJa: 'エコノミー', days: '11-23', category: 'economy' },
];

interface ShippingOption {
  id: number;
  service_name: string;
  carrier_name: string;
  service_code: string;
  service_type: string;
  weight_from_kg: number;
  weight_to_kg: number;
  base_rate_jpy: number;
  base_rate_usd: string;
  shipping_cost_with_margin_usd: string;
}

export interface TabShippingProps {
  product: Product | null;
  marketplace: string;
  marketplaceName: string;
  onRefresh?: () => void;
}

export function TabShipping({ product, marketplace, marketplaceName, onRefresh }: TabShippingProps) {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedPolicy, setSelectedPolicy] = useState<string>('');
  const [policies, setPolicies] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const listingData = (product as any)?.listing_data || {};
  const weight = listingData.weight_g || (product as any)?.scraped_data?.weight_g || (product as any)?.weight_g || 0;
  const dimensions = {
    l: listingData.length_cm || 0,
    w: listingData.width_cm || 0,
    h: listingData.height_cm || 0,
  };

  const autoSelectedPolicy = {
    name: listingData.usa_shipping_policy_name || (product as any)?.shipping_policy || '',
    shippingCost: listingData.shipping_cost_usd || (product as any)?.shipping_cost_usd || 0,
    ddpPrice: listingData.ddp_price_usd || (product as any)?.ddp_price_usd || 0,
    carrierName: listingData.carrier_name || '',
    serviceName: listingData.carrier_service || '',
  };

  // 🔥 ebay_shipping_masterから配送ポリシー取得
  useEffect(() => {
    async function loadShippingPolicies() {
      try {
        setLoading(true);
        const weightKg = Math.max(weight / 1000, 0.001);
        
        // 総件数取得
        const { count } = await supabase
          .from('ebay_shipping_master')
          .select('*', { count: 'exact', head: true })
          .eq('country_code', 'US');
        
        setTotalCount(count || 0);
        
        // 重量帯に合うポリシー取得
        const { data, error } = await supabase
          .from('ebay_shipping_master')
          .select('*')
          .eq('country_code', 'US')
          .lte('weight_from_kg', weightKg)
          .gte('weight_to_kg', weightKg)
          .order('shipping_cost_with_margin_usd', { ascending: true })
          .limit(50);
        
        if (error) {
          console.error('[TabShipping] ebay_shipping_master取得エラー:', error);
        } else {
          setPolicies(data || []);
          console.log(`[TabShipping] 配送ポリシー取得: ${data?.length || 0}件 (重量: ${weightKg}kg, 全${count}件中)`);
        }

        if (listingData.shipping_service) {
          setSelectedService(listingData.shipping_service);
        }
      } catch (err) {
        console.error('[TabShipping] データ取得エラー:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadShippingPolicies();
  }, [weight]);

  const weightKg = weight / 1000;
  
  const filteredPolicies = policies.filter(policy => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return policy.service_name?.toLowerCase().includes(term) ||
             policy.carrier_name?.toLowerCase().includes(term) ||
             policy.service_code?.toLowerCase().includes(term);
    }
    return true;
  });

  const handleCalculateProfit = async () => {
    if (!product?.id) return;
    
    setCalculating(true);
    try {
      const res = await fetch('/api/tools/profit-calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: [String(product.id)], forceZeroCost: true })
      });
      
      const data = await res.json();
      
      if (data.updated > 0) {
        toast.success('✅ 利益計算完了！配送ポリシー自動選択されました');
        onRefresh?.();
      } else if (data.errors?.length > 0) {
        throw new Error(data.errors[0].error);
      } else {
        toast.info('計算完了しましたが更新はありませんでした');
      }
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`);
    } finally {
      setCalculating(false);
    }
  };

  const handleUsePolicy = async (policy: ShippingOption) => {
    if (!product?.id) return;
    
    try {
      setSaving(true);
      
      const shippingCost = parseFloat(policy.shipping_cost_with_margin_usd) || 0;
      const baseRate = parseFloat(policy.base_rate_usd) || shippingCost;
      
      const { error } = await supabase
        .from('products_master')
        .update({
          listing_data: {
            ...listingData,
            shipping_policy_id: policy.id,
            usa_shipping_policy_name: policy.service_name,
            shipping_service: policy.service_name,
            carrier_name: policy.carrier_name,
            carrier_service: policy.service_code,
            base_shipping_usd: baseRate,
            shipping_cost_usd: shippingCost,
            shipping_cost_calculated: true,
          },
          shipping_policy: policy.service_name,
          shipping_cost_usd: shippingCost,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);
      
      if (error) throw error;
      
      setSelectedPolicy(String(policy.id));
      toast.success(`✓ ${policy.service_name} を適用しました ($${shippingCost})`);
      onRefresh?.();
    } catch (err) {
      console.error('ポリシー適用エラー:', err);
      toast.error('適用に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        
        {/* 左: 商品情報 + 自動選択結果 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Card title="📦 Package Info">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              <StatBox label="重量" value={`${weight}g`} highlight={weight > 0} />
              <StatBox label="長さ" value={`${dimensions.l}cm`} />
              <StatBox label="幅" value={`${dimensions.w}cm`} />
              <StatBox label="高さ" value={`${dimensions.h}cm`} />
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '9px', color: T.textMuted }}>
              重量帯: {weightKg.toFixed(3)} kg
            </div>
          </Card>

          <Card title="✅ 現在の配送設定（利益計算で自動選択）">
            {autoSelectedPolicy.name ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ 
                  padding: '0.75rem', borderRadius: '6px', 
                  background: `${T.success}15`, border: `2px solid ${T.success}` 
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: T.success }}>
                    {autoSelectedPolicy.name}
                  </div>
                  {autoSelectedPolicy.carrierName && (
                    <div style={{ fontSize: '10px', color: T.textMuted, marginTop: '0.25rem' }}>
                      {autoSelectedPolicy.carrierName} - {autoSelectedPolicy.serviceName}
                    </div>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  <StatBox label="送料" value={`$${autoSelectedPolicy.shippingCost.toFixed(2)}`} color={T.accent} highlight />
                  <StatBox label="DDP価格" value={`$${autoSelectedPolicy.ddpPrice.toFixed(2)}`} color={T.success} highlight />
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: T.warning, fontSize: '11px' }}>
                ⚠️ 配送ポリシーが未選択です<br/>
                <span style={{ fontSize: '10px', color: T.textMuted }}>
                  「利益計算を実行」で自動選択されます
                </span>
              </div>
            )}
            
            <button onClick={handleCalculateProfit} disabled={calculating}
              style={{
                marginTop: '0.75rem', width: '100%', padding: '0.5rem 1rem',
                fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none',
                background: T.accent, color: '#fff',
                cursor: calculating ? 'wait' : 'pointer', opacity: calculating ? 0.7 : 1,
              }}
            >
              {calculating ? '⏳ 計算中...' : '🔄 利益計算を実行（配送ポリシー自動選択）'}
            </button>
          </Card>

          <Card title="🚀 Shipping Service">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {SHIPPING_SERVICES.map(service => (
                <div key={service.code} onClick={() => setSelectedService(service.code)}
                  style={{
                    padding: '0.5rem', borderRadius: '4px',
                    background: selectedService === service.code ? `${T.accent}15` : T.highlight,
                    border: `1px solid ${selectedService === service.code ? T.accent : 'transparent'}`,
                    cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: T.text }}>{service.name}</div>
                    <div style={{ fontSize: '8px', color: T.textMuted }}>{service.nameJa}</div>
                  </div>
                  <div style={{ 
                    fontSize: '9px', fontWeight: 600, 
                    color: service.category === 'expedited' ? T.error : service.category === 'standard' ? T.accent : T.success,
                    background: `${service.category === 'expedited' ? T.error : service.category === 'standard' ? T.accent : T.success}15`,
                    padding: '0.125rem 0.375rem', borderRadius: '3px',
                  }}>
                    {service.days} days
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 右: ポリシー一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type="text" placeholder="キャリア・サービス名で検索..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1, padding: '0.375rem 0.5rem', fontSize: '10px',
                border: `1px solid ${T.panelBorder}`, borderRadius: '4px', background: T.panel,
              }}
            />
            <span style={{ fontSize: '9px', color: T.textMuted }}>
              {filteredPolicies.length} / {policies.length}件 (全{totalCount}件)
            </span>
          </div>

          <Card title={`📋 ebay_shipping_master (US, ${weightKg.toFixed(3)}kg)`}>
            {loading ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: T.textMuted, fontSize: '10px' }}>
                ⏳ ポリシーを読み込み中...
              </div>
            ) : filteredPolicies.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: T.textMuted, fontSize: '10px' }}>
                該当する配送ポリシーがありません<br/>
                <span style={{ fontSize: '9px' }}>（重量: {weightKg}kg に対応するデータがありません）</span>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {filteredPolicies.map(policy => {
                  const isAutoSelected = autoSelectedPolicy.name === policy.service_name;
                  const isManualSelected = selectedPolicy === String(policy.id);
                  const shippingCost = parseFloat(policy.shipping_cost_with_margin_usd) || 0;
                  
                  return (
                    <div key={policy.id}
                      style={{
                        padding: '0.5rem', borderRadius: '4px',
                        background: isAutoSelected ? `${T.success}15` : isManualSelected ? `${T.accent}15` : T.highlight,
                        border: `1px solid ${isAutoSelected ? T.success : isManualSelected ? T.accent : 'transparent'}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ fontSize: '10px', fontWeight: 600, color: T.text }}>
                              {policy.service_name}
                            </div>
                            <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '2px', 
                              background: policy.service_type === 'Express' ? `${T.error}20` : `${T.success}20`,
                              color: policy.service_type === 'Express' ? T.error : T.success 
                            }}>
                              {policy.service_type}
                            </span>
                            {isAutoSelected && (
                              <span style={{ fontSize: '8px', padding: '1px 4px', borderRadius: '2px', background: T.success, color: 'white' }}>
                                自動選択
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '8px', color: T.textMuted, marginTop: '0.125rem' }}>
                            {policy.carrier_name} | 
                            重量: {policy.weight_from_kg}-{policy.weight_to_kg}kg | 
                            <strong style={{ color: T.accent }}>${shippingCost.toFixed(2)}</strong>
                          </div>
                        </div>
                        <button onClick={() => handleUsePolicy(policy)} disabled={saving}
                          style={{
                            padding: '0.25rem 0.5rem', fontSize: '9px', fontWeight: 600,
                            borderRadius: '3px', border: 'none',
                            background: isAutoSelected || isManualSelected ? T.success : T.accent, color: '#fff',
                            cursor: 'pointer', opacity: saving ? 0.7 : 1,
                          }}
                        >
                          {isAutoSelected || isManualSelected ? '✓ 適用中' : '使う'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
      <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function StatBox({ label, value, color, highlight }: { label: string; value: string; color?: string; highlight?: boolean }) {
  return (
    <div style={{ 
      padding: '0.375rem', borderRadius: '4px', 
      background: highlight ? `${T.accent}10` : T.highlight, textAlign: 'center',
      border: highlight ? `1px solid ${T.accent}30` : 'none',
    }}>
      <div style={{ fontSize: '7px', textTransform: 'uppercase', color: T.textSubtle }}>{label}</div>
      <div style={{ fontSize: '10px', fontWeight: 700, color: color || T.text }}>{value}</div>
    </div>
  );
}
