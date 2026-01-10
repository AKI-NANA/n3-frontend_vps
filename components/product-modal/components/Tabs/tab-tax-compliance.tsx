'use client';

// TabTaxCompliance - V13.1
// 🔥 DDU価格表示修正
// DDU = DDU商品価格（関税なし）+ 送料
// DDP = DDP商品価格（関税込み）+ 送料

import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const T = {
  bg: '#F8FAFC', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444',
  purple: '#8b5cf6',
};

const TOOLTIPS = {
  htsCode: 'Harmonized Tariff Schedule コード。米国税関での関税分類に使用。',
  originCountry: '原産国。中国(CN)の場合はSection 301追加関税(25%)が適用。',
  baseRate: 'HTSコードに基づく基本関税率。hts_codes_detailsから取得。',
  section232: '鉄鋼・アルミニウム製品への追加関税（25%）。',
  section301: '中国製品への追加関税（25%）。原産国がCNの場合に適用。',
  productValue: '商品価格（USD）。listing_dataから取得。',
  estimatedDuty: '推定関税額 = 商品価格 × 関税率',
  material: '素材情報。金属の場合Section 232の対象となる可能性。',
  ddpPrice: 'DDP価格。商品価格(関税込み)+送料。売り手が関税負担。',
  dduPrice: 'DDU価格。商品価格(関税なし)+送料。買い手が関税負担。',
  shippingPolicy: 'eBay配送ポリシー名。ebay_shipping_masterから選択。',
  profitMargin: '利益率。(売上-コスト-手数料)/売上×100',
};

export interface TabTaxComplianceProps {
  product: Product | null;
  onRefresh?: () => void;
}

export function TabTaxCompliance({ product, onRefresh }: TabTaxComplianceProps) {
  const [htsCode, setHtsCode] = useState('');
  const [originCountry, setOriginCountry] = useState('JP');
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [baseDutyRate, setBaseDutyRate] = useState<number | null>(null);
  const [section232Rate, setSection232Rate] = useState(0);
  const [section301Rate, setSection301Rate] = useState(0);
  const [trumpTariff2025, setTrumpTariff2025] = useState(0);
  const [htsDescription, setHtsDescription] = useState('');
  const [generalRate, setGeneralRate] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataSources, setDataSources] = useState({ htsCode: '', originCountry: '', material: '' });

  const listingData = (product as any)?.listing_data || {};
  const aiData = (product as any)?.ai_analysis || {};
  const material = (product as any)?.material || listingData.material || '';

  const ddpPriceUsd = parseFloat((product as any)?.ddp_price_usd) || listingData.ddp_price_usd || 0;
  const dduPriceUsd = parseFloat((product as any)?.ddu_price_usd) || listingData.ddu_price_usd || 0;
  const buyerDutyAmount = listingData.buyer_duty_amount_usd || 0;
  const productPriceUsd = listingData.product_price_usd || 0;
  const dduProductPriceUsd = listingData.ddu_product_price_usd || 0;
  const shippingCostUsd = parseFloat((product as any)?.shipping_cost_usd) || listingData.shipping_cost_usd || 0;
  const shippingPolicy = (product as any)?.shipping_policy || listingData.usa_shipping_policy_name || '';
  const carrierName = listingData.carrier_name || '';
  const profitMargin = parseFloat((product as any)?.profit_margin) || listingData.profit_margin || 0;
  const profitAmountUsd = parseFloat((product as any)?.profit_amount_usd) || listingData.profit_amount_usd || 0;

  useEffect(() => {
    if (product) {
      let htsSource = '', originSource = '', materialSource = '';
      let code = '';
      if ((product as any)?.hts_code) { code = (product as any).hts_code; htsSource = 'トップレベル'; }
      else if (listingData.hts_code) { code = listingData.hts_code; htsSource = 'listing_data'; }
      else if (aiData.hts_code) { code = aiData.hts_code; htsSource = 'AI推定'; }
      setHtsCode(code);

      let origin = 'JP';
      if ((product as any)?.origin_country) { origin = (product as any).origin_country; originSource = 'トップレベル'; }
      else if (listingData.origin_country) { origin = listingData.origin_country; originSource = 'listing_data'; }
      setOriginCountry(origin);

      if ((product as any)?.material) materialSource = 'トップレベル';
      else if (listingData.material) materialSource = 'listing_data';
      setDataSources({ htsCode: htsSource, originCountry: originSource, material: materialSource });

      if (listingData.tariff_rate !== undefined && listingData.tariff_rate > 0) {
        setBaseDutyRate(listingData.base_tariff_rate ? listingData.base_tariff_rate * 100 : 0);
        setSection301Rate(listingData.section_301_rate ? listingData.section_301_rate * 100 : 0);
        setTrumpTariff2025(listingData.additional_tariff_2025 ? listingData.additional_tariff_2025 * 100 : 0);
      }
      if (code) lookupHtsCode(code);
    }
  }, [product]);

  const lookupHtsCode = async (code: string) => {
    if (!code || code.length < 4) return;
    setLoading(true);
    try {
      const normalizedCode = code.replace(/\./g, '');
      const { data, error } = await supabase
        .from('hts_codes_details')
        .select('hts_number, description, general_rate, special_rate')
        .or(`hts_number.eq.${code},hts_number.eq.${normalizedCode},hts_number.like.${normalizedCode.substring(0, 6)}%`)
        .limit(1).maybeSingle();
      if (data) {
        setHtsDescription(data.description || '');
        setGeneralRate(data.general_rate || '');
        setBaseDutyRate(parseRate(data.general_rate));
      } else {
        setBaseDutyRate(null); setHtsDescription(''); setGeneralRate('');
      }
    } catch (err) { console.error('HTS検索エラー:', err); }
    finally { setLoading(false); }
  };

  const parseRate = (rateStr: string | null): number => {
    if (!rateStr || rateStr === 'Free') return 0;
    const match = rateStr.match(/([\d.]+)\s*%?/);
    return match ? parseFloat(match[1]) : 0;
  };

  useEffect(() => {
    setSection301Rate(originCountry === 'CN' ? 25 : 0);
    setSection232Rate(0);
  }, [originCountry]);

  const checkSection232Risk = () => {
    const m = material.toLowerCase();
    return ['steel', 'aluminum', 'iron', 'metal', '鉄', 'アルミ'].some(k => m.includes(k));
  };

  const totalDutyRate = (baseDutyRate || 0) + section232Rate + section301Rate + trumpTariff2025;
  const estimatedDuty = productPriceUsd * (totalDutyRate / 100);

  const handleCalculate = async () => {
    if (!htsCode) { toast.error('HTSコードを入力してください'); return; }
    setCalculating(true);
    await lookupHtsCode(htsCode);
    toast.success(`✓ 関税率取得完了: ${totalDutyRate.toFixed(2)}%`);
    setCalculating(false);
  };

  const handleSave = async () => {
    if (!product?.id) return;
    setSaving(true);
    try {
      await supabase.from('products_master').update({
        hts_code: htsCode, origin_country: originCountry,
        listing_data: { ...listingData, hts_code: htsCode, origin_country: originCountry,
          tariff_rate: totalDutyRate / 100, base_tariff_rate: (baseDutyRate || 0) / 100,
          section_232_rate: section232Rate / 100, section_301_rate: section301Rate / 100,
          additional_tariff_2025: trumpTariff2025 / 100, estimated_duty_usd: estimatedDuty,
          hts_description: htsDescription, tariff_updated_at: new Date().toISOString() },
        updated_at: new Date().toISOString()
      }).eq('id', product.id);
      toast.success('✓ 関税情報を保存しました');
      onRefresh?.();
    } catch (err) { toast.error('保存に失敗しました'); }
    finally { setSaving(false); }
  };

  if (!product) return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  const isCalculated = ddpPriceUsd > 0 && shippingPolicy;

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '12px',
        background: isCalculated ? `linear-gradient(135deg, ${T.success}15, ${T.purple}10)` : `linear-gradient(135deg, ${T.warning}15, ${T.error}10)`,
        border: `2px solid ${isCalculated ? T.success : T.warning}40` }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: T.text, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isCalculated ? '✅' : '⚠️'} 計算結果サマリー
          <span style={{ fontSize: '9px', fontWeight: 400, color: isCalculated ? T.success : T.warning,
            background: isCalculated ? `${T.success}20` : `${T.warning}20`, padding: '0.125rem 0.5rem', borderRadius: '4px' }}>
            {isCalculated ? '利益計算済み' : '利益計算が必要 → Toolsタブで実行'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          <SummaryBox icon="🏷️" label="DDU価格（関税別）"
            value={dduPriceUsd > 0 ? `$${dduPriceUsd.toFixed(2)}` : '未計算'}
            subValue={dduProductPriceUsd > 0 ? `商品$${dduProductPriceUsd} + 送料$${shippingCostUsd.toFixed(2)}` : '買い手が関税負担'}
            tooltip={TOOLTIPS.dduPrice} highlight={dduPriceUsd > 0} color={T.accent} />

          <SummaryBox icon="💵" label="DDP価格（関税込）"
            value={ddpPriceUsd > 0 ? `$${ddpPriceUsd.toFixed(2)}` : '未計算'}
            subValue={productPriceUsd > 0 ? `商品$${productPriceUsd} + 送料$${shippingCostUsd.toFixed(2)}` : '売り手が関税負担'}
            tooltip={TOOLTIPS.ddpPrice} highlight={ddpPriceUsd > 0} color={T.purple} />

          <SummaryBox icon="📦" label="配送ポリシー" value={shippingPolicy || '未設定'}
            subValue={carrierName} tooltip={TOOLTIPS.shippingPolicy} highlight={!!shippingPolicy} color={T.accent} />

          <SummaryBox icon="📈" label="利益率"
            value={profitMargin > 0 ? `${profitMargin.toFixed(1)}%` : '未計算'}
            subValue={profitAmountUsd > 0 ? `利益額: $${profitAmountUsd.toFixed(2)}` : ''}
            tooltip={TOOLTIPS.profitMargin} highlight={profitMargin >= 15} warning={profitMargin > 0 && profitMargin < 15}
            color={profitMargin >= 15 ? T.success : T.warning} />

          <SummaryBox icon="🏛️" label="合計関税率"
            value={totalDutyRate > 0 ? `${totalDutyRate.toFixed(1)}%` : '0%'}
            subValue={trumpTariff2025 > 0 ? `Trump: +${trumpTariff2025}%` : (generalRate || '')}
            tooltip="基本関税率 + Trump関税 + Section301" highlight={totalDutyRate > 0}
            color={totalDutyRate > 0 ? T.warning : T.success} />
        </div>
      </div>

      <div style={{ marginBottom: '1rem', padding: '0.625rem 0.75rem', borderRadius: '6px', background: T.panel,
        border: `1px solid ${T.panelBorder}`, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: T.textMuted }}>📊 データソース:</span>
        <SourceChip label="HTS" value={dataSources.htsCode || '未設定'} ok={!!htsCode} />
        <SourceChip label="原産国" value={dataSources.originCountry || 'デフォルト'} ok={!!originCountry} />
        <SourceChip label="素材" value={dataSources.material || '未設定'} ok={!!material} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Card title="🏷️ HTS Classification">
            <div style={{ marginBottom: '0.75rem' }}>
              <Label label="HTS Code" />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" value={htsCode} onChange={(e) => setHtsCode(e.target.value)}
                  onBlur={(e) => lookupHtsCode(e.target.value)} placeholder="e.g. 9504.40.00.00"
                  style={{ flex: 1, padding: '0.5rem 0.625rem', fontSize: '13px', fontFamily: 'monospace', borderRadius: '6px',
                    border: `1px solid ${htsCode ? T.success : T.panelBorder}`, background: T.panel, color: T.text }} />
                <button onClick={() => lookupHtsCode(htsCode)} disabled={loading}
                  style={{ padding: '0.5rem 0.75rem', fontSize: '11px', borderRadius: '6px', border: 'none',
                    background: T.accent, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                  {loading ? '...' : '🔍'}
                </button>
              </div>
            </div>
            {htsDescription && (
              <div style={{ padding: '0.625rem', borderRadius: '6px', background: `${T.success}08`,
                border: `1px solid ${T.success}30`, marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '9px', color: T.success, fontWeight: 600 }}>✅ DB照合済み</div>
                <div style={{ fontSize: '11px', color: T.text, margin: '0.25rem 0' }}>{htsDescription}</div>
                <div style={{ fontSize: '10px', color: T.accent, fontWeight: 600 }}>Rate: {generalRate || 'N/A'}</div>
              </div>
            )}
            <div style={{ marginBottom: '0.5rem' }}>
              <Label label="Origin Country" />
              <select value={originCountry} onChange={(e) => setOriginCountry(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.625rem', fontSize: '12px', borderRadius: '6px',
                  border: `1px solid ${originCountry === 'CN' ? T.error : T.panelBorder}`,
                  background: originCountry === 'CN' ? `${T.error}10` : T.panel, color: T.text }}>
                <option value="JP">🇯🇵 Japan (+24% Trump)</option>
                <option value="CN">🇨🇳 China (+34% Trump +25% S301)</option>
                <option value="KR">🇰🇷 Korea (+25% Trump)</option>
                <option value="TW">🇹🇼 Taiwan (+32% Trump)</option>
                <option value="VN">🇻🇳 Vietnam (+46% Trump)</option>
                <option value="US">🇺🇸 USA (0%)</option>
              </select>
            </div>
          </Card>

          <Card title="⚖️ Additional Tariffs">
            <TariffRow label="Trump 2025" rate={trumpTariff2025} active={trumpTariff2025 > 0} desc="相互関税（原産国別）" />
            <TariffRow label="Section 232" rate={section232Rate} active={section232Rate > 0} desc="鉄鋼・アルミ" />
            <TariffRow label="Section 301" rate={section301Rate} active={originCountry === 'CN'} desc="中国製品" />
            {trumpTariff2025 > 0 && (
              <div style={{ marginTop: '0.5rem', padding: '0.375rem', background: `${T.warning}10`, borderRadius: '4px' }}>
                <div style={{ fontSize: '9px', color: T.warning, fontWeight: 600 }}>🇺🇸 Trump相互関税 {originCountry}: +{trumpTariff2025}%</div>
              </div>
            )}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Card title="💰 Duty Calculation">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <MiniStat label="DDP商品価格" value={`$${productPriceUsd}`} />
              <MiniStat label="DDU商品価格" value={`$${dduProductPriceUsd}`} />
              <MiniStat label="Trump関税" value={`${trumpTariff2025}%`} color={trumpTariff2025 > 0 ? T.warning : T.success} />
              <MiniStat label="合計関税率" value={`${totalDutyRate.toFixed(1)}%`} color={totalDutyRate > 0 ? T.warning : T.success} highlight />
            </div>
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: T.highlight, textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: T.textSubtle }}>買い手関税額（DDU時）</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: buyerDutyAmount > 0 ? T.warning : T.success }}>
                ${buyerDutyAmount.toFixed(2)}
              </div>
            </div>
          </Card>

          <Card title="✅ Status Check">
            <StatusItem label="HTS Code" ok={!!htsCode && !!htsDescription} value={htsCode || '未設定'} />
            <StatusItem label="Origin" ok={!!originCountry} value={originCountry} extra={trumpTariff2025 > 0 ? `(+${trumpTariff2025}%)` : ''} />
            <StatusItem label="Duty Rate" ok={totalDutyRate >= 0} value={`${totalDutyRate.toFixed(1)}%`} />
            <StatusItem label="DDU Price" ok={dduPriceUsd > 0} value={dduPriceUsd > 0 ? `$${dduPriceUsd.toFixed(2)}` : '未計算'} />
            <StatusItem label="DDP Price" ok={ddpPriceUsd > 0} value={ddpPriceUsd > 0 ? `$${ddpPriceUsd.toFixed(2)}` : '未計算'} />
          </Card>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleCalculate} disabled={calculating || !htsCode}
              style={{ flex: 1, padding: '0.625rem', fontSize: '11px', fontWeight: 700, borderRadius: '6px', border: 'none',
                background: (htsCode && !calculating) ? T.accent : T.textMuted, color: '#fff',
                cursor: (htsCode && !calculating) ? 'pointer' : 'not-allowed' }}>
              {calculating ? '⏳' : '📊'} Calculate
            </button>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 1, padding: '0.625rem', fontSize: '11px', fontWeight: 700, borderRadius: '6px', border: 'none',
                background: !saving ? T.success : T.textMuted, color: '#fff', cursor: !saving ? 'pointer' : 'not-allowed' }}>
              {saving ? '⏳' : '💾'} Save
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', padding: '0.625rem', borderRadius: '6px', background: T.panel,
        border: `1px solid ${T.panelBorder}`, fontSize: '9px', color: T.textMuted, fontFamily: 'monospace' }}>
        📐 DDU = DDU商品価格 + 送料 | DDP = DDP商品価格 + 送料 | 価格差 = 関税分
      </div>
    </div>
  );
}

function SummaryBox({ icon, label, value, subValue, tooltip, highlight, warning, color }: any) {
  return (
    <div style={{ padding: '0.5rem', borderRadius: '8px', background: T.panel,
      border: `1px solid ${highlight ? (color || T.success) : T.panelBorder}40`, textAlign: 'center' }}>
      <div style={{ fontSize: '14px', marginBottom: '0.125rem' }}>{icon}</div>
      <div style={{ fontSize: '7px', color: T.textSubtle, marginBottom: '0.125rem' }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: highlight ? (color || T.success) : (warning ? T.warning : T.textMuted) }}>{value}</div>
      {subValue && <div style={{ fontSize: '7px', color: T.textSubtle, marginTop: '0.125rem' }}>{subValue}</div>}
    </div>
  );
}

function SourceChip({ label, value, ok }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <span style={{ fontSize: '9px', color: T.textMuted }}>{label}:</span>
      <span style={{ fontSize: '8px', color: ok ? T.success : T.textMuted,
        background: ok ? `${T.success}15` : T.highlight, padding: '0.125rem 0.375rem', borderRadius: '3px' }}>{value}</span>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div style={{ padding: '0.75rem', borderRadius: '8px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: T.text, marginBottom: '0.625rem' }}>{title}</div>
      {children}
    </div>
  );
}

function Label({ label }: any) {
  return <div style={{ fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.25rem' }}>{label}</div>;
}

function MiniStat({ label, value, color, highlight }: any) {
  return (
    <div style={{ padding: '0.5rem', borderRadius: '4px', background: highlight ? `${T.accent}10` : T.highlight, textAlign: 'center' }}>
      <div style={{ fontSize: '8px', color: T.textSubtle }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: color || T.text }}>{value}</div>
    </div>
  );
}

function TariffRow({ label, rate, active, desc }: any) {
  return (
    <div style={{ padding: '0.375rem 0.5rem', borderRadius: '4px', background: active ? `${T.warning}10` : T.highlight,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 600, color: active ? T.warning : T.textMuted }}>{label}</div>
        <div style={{ fontSize: '8px', color: T.textSubtle }}>{desc}</div>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 700, color: active ? T.warning : T.textMuted }}>
        {active ? `+${rate}%` : `${rate}%`}
      </span>
    </div>
  );
}

function StatusItem({ label, ok, value, extra }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: `1px solid ${T.panelBorder}` }}>
      <span style={{ fontSize: '10px', color: T.textMuted }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: ok ? T.text : T.textMuted }}>
          {value} {extra && <span style={{ color: T.warning }}>{extra}</span>}
        </span>
        <span style={{ color: ok ? T.success : T.error, fontSize: '10px' }}>{ok ? '✓' : '✗'}</span>
      </div>
    </div>
  );
}
