'use client';

// TabPricingStrategy - V8.4
// デザインシステムV4準拠
// 機能: 15価格戦略表示、選択、適用 + 利益計算結果表示

import { useState, useEffect } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8',
  accent: '#3b82f6', success: '#10b981', warning: '#f59e0b', error: '#ef4444', purple: '#7c3aed',
};

export interface TabPricingStrategyProps {
  product: Product | null;
  onTabChange?: (tabId: string) => void;
  onSave?: (updates: any) => void;
}

const STRATEGIES = [
  { id: 'lowest', label: 'Lowest Price', desc: '最安値に合わせる', icon: 'fa-arrow-down', color: T.accent },
  { id: 'lowest-5', label: 'Lowest -5%', desc: '最安値より5%低く', icon: 'fa-minus', color: T.success },
  { id: 'lowest+5', label: 'Lowest +5%', desc: '最安値より5%高く', icon: 'fa-plus', color: T.warning },
  { id: 'average', label: 'Average Price', desc: '平均価格に合わせる', icon: 'fa-equals', color: T.purple },
  { id: 'avg-10', label: 'Average -10%', desc: '平均より10%低く', icon: 'fa-minus', color: T.success },
  { id: 'avg+10', label: 'Average +10%', desc: '平均より10%高く', icon: 'fa-plus', color: T.warning },
  { id: 'margin-15', label: '15% Margin', desc: '利益率15%確保', icon: 'fa-percentage', color: T.success },
  { id: 'margin-20', label: '20% Margin', desc: '利益率20%確保', icon: 'fa-percentage', color: T.success },
  { id: 'margin-25', label: '25% Margin', desc: '利益率25%確保', icon: 'fa-percentage', color: T.success },
  { id: 'undercut-1', label: 'Undercut $1', desc: '最安値-$1', icon: 'fa-dollar-sign', color: T.accent },
  { id: 'undercut-5', label: 'Undercut $5', desc: '最安値-$5', icon: 'fa-dollar-sign', color: T.accent },
  { id: 'premium', label: 'Premium', desc: '最高価格帯', icon: 'fa-gem', color: T.warning },
  { id: 'competitive', label: 'Competitive', desc: '競争力重視', icon: 'fa-bolt', color: T.accent },
  { id: 'breakeven', label: 'Break Even', desc: '損益分岐点', icon: 'fa-balance-scale', color: T.textMuted },
  { id: 'custom', label: 'Custom', desc: '手動設定', icon: 'fa-sliders-h', color: T.purple },
];

interface ProfitCalculationResult {
  success: boolean;
  suggestedPrice: number;
  breakEvenPrice: number;
  expectedProfit: number;
  profitMargin: number;
  redFlag: boolean;
  strategyApplied: string;
  details: {
    baseCostUsd: number;
    feesUsd: number;
    shippingCostUsd: number;
    dutyAmount: number;
    totalCost: number;
  };
}

export function TabPricingStrategy({ product, onTabChange, onSave }: TabPricingStrategyProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [profitResult, setProfitResult] = useState<ProfitCalculationResult | null>(null);
  const [customPrice, setCustomPrice] = useState<string>('');

  // 商品からの初期戦略ロード
  useEffect(() => {
    if (product) {
      const listingData = (product as any)?.listing_data || {};
      const savedStrategy = listingData.pricing_strategy || (product as any)?.pricing_strategy;
      if (savedStrategy) {
        setSelectedStrategy(savedStrategy);
      }
    }
  }, [product]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  // ✅ 送料未計算の場合はブロック画面を表示
  const listingDataCheck = (product as any)?.listing_data || {};
  const shippingCalculatedCheck = listingDataCheck.shipping_cost_calculated === true || 
                                   (product as any)?.shipping_cost_calculated === true;
  const weightGCheck = listingDataCheck.weight_g || (product as any)?.weight_g || 0;
  const hasWeightDataCheck = weightGCheck > 0;
  const purchasePriceJpyCheck = (product as any)?.purchase_price_jpy ?? (product as any)?.price_jpy ?? null;
  const hasCostDataCheck = purchasePriceJpyCheck !== null && purchasePriceJpyCheck !== undefined;

  if (!shippingCalculatedCheck) {
    return (
      <div style={{ padding: '1.5rem', background: T.bg, height: '100%', overflow: 'auto' }}>
        <div style={{
          padding: '2rem',
          borderRadius: '8px',
          background: T.panel,
          border: `2px solid ${T.warning}`,
          textAlign: 'center',
        }}>
          <i className="fas fa-lock" style={{ fontSize: '48px', color: T.warning, marginBottom: '1rem' }}></i>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: T.text, marginBottom: '0.5rem' }}>
            価格戦略の選択には送料計算が必要です
          </h3>
          <p style={{ fontSize: '12px', color: T.textMuted, marginBottom: '1.5rem' }}>
            正確な利益計算のために、以下のステップを完了してください。
          </p>
          
          {/* ステップ表示 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            <StepItem 
              step={1} 
              label="Dataタブで重さ・サイズを入力" 
              completed={hasWeightDataCheck} 
              current={!hasWeightDataCheck}
            />
            <StepItem 
              step={2} 
              label="Dataタブで原価（仕入れ値）を入力" 
              completed={hasCostDataCheck} 
              current={hasWeightDataCheck && !hasCostDataCheck}
            />
            <StepItem 
              step={3} 
              label="Shippingタブで送料を計算" 
              completed={shippingCalculatedCheck} 
              current={hasWeightDataCheck && hasCostDataCheck && !shippingCalculatedCheck}
            />
            <StepItem 
              step={4} 
              label="Pricingタブで価格戦略を選択" 
              completed={false} 
              current={false}
              locked={true}
            />
          </div>

          {/* 現在のステータス */}
          <div style={{
            padding: '1rem',
            borderRadius: '6px',
            background: T.highlight,
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.5rem' }}>
              現在のステータス
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <StatusItem label="重さ" value={hasWeightDataCheck ? `${weightGCheck}g` : '未入力'} ok={hasWeightDataCheck} />
              <StatusItem label="原価" value={hasCostDataCheck ? `¥${purchasePriceJpyCheck?.toLocaleString() || 0}` : '未入力'} ok={hasCostDataCheck} />
              <StatusItem label="送料" value={shippingCalculatedCheck ? '計算済み' : '未計算'} ok={shippingCalculatedCheck} />
            </div>
          </div>

          <p style={{ fontSize: '11px', color: T.textSubtle }}>
            ※ 送料計算完了後、このページが有効になります
          </p>

          {/* ✅ ナビゲーションボタン */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
            {!hasWeightDataCheck && (
              <button
                onClick={() => onTabChange?.('data')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  background: T.accent,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <i className="fas fa-arrow-right"></i>
                Dataタブへ移動
              </button>
            )}
            {hasWeightDataCheck && !hasCostDataCheck && (
              <button
                onClick={() => onTabChange?.('data')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  background: T.accent,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <i className="fas fa-arrow-right"></i>
                Dataタブへ移動
              </button>
            )}
            {hasWeightDataCheck && hasCostDataCheck && !shippingCalculatedCheck && (
              <button
                onClick={() => onTabChange?.('shipping')}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  background: T.success,
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <i className="fas fa-shipping-fast"></i>
                Shippingタブへ移動
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const smLowest = (product as any)?.sm_lowest_price || 0;
  const smAverage = (product as any)?.sm_average_price || 0;
  const smHighest = (product as any)?.sm_highest_price || 0;
  const currentPrice = (product as any)?.price_usd || 0;
  const profitMargin = (product as any)?.profit_margin_percent || (product as any)?.profit_margin || 0;
  
  // ✅ 原価データ（仕入れ値 + 送料 + 経費）
  const purchasePriceJpyRaw = (product as any)?.purchase_price_jpy ?? (product as any)?.price_jpy ?? null;
  const purchasePriceJpy = purchasePriceJpyRaw ?? 0;
  const exchangeRate = (product as any)?.exchange_rate || 150;
  const purchasePriceUsd = purchasePriceJpy / exchangeRate;
  const shippingCost = (product as any)?.shipping_cost_usd || listingDataCheck.shipping_cost_usd || 5;
  const otherCost = (product as any)?.other_cost_usd || 0;
  const dutyRate = (product as any)?.duty_rate || 0;
  const dutyAmount = currentPrice * (dutyRate / 100);
  const ebayFeeRate = 0.13; // eBay手数料13%
  const paypalFeeRate = 0.029; // PayPal手数料2.9%
  
  // ✅ 原価合計（商品代 + 送料 + その他）
  const totalCost = purchasePriceUsd + shippingCost + otherCost;
  
  // ✅ 原価データがあるかどうか
  const hasCostData = purchasePriceJpyRaw !== null && purchasePriceJpyRaw !== undefined;

  // ✅ 価格計算関数
  const calculatePrice = (strategyId: string): number => {
    const totalFeeRate = ebayFeeRate + paypalFeeRate;
    
    const calculateMarginPrice = (marginPercent: number): number => {
      if (!hasCostData) return 0;
      const divisor = 1 - totalFeeRate - (marginPercent / 100);
      if (divisor <= 0) return 0;
      return totalCost / divisor;
    };

    switch (strategyId) {
      case 'lowest': return smLowest;
      case 'lowest-5': return smLowest * 0.95;
      case 'lowest+5': return smLowest * 1.05;
      case 'average': return smAverage;
      case 'avg-10': return smAverage * 0.90;
      case 'avg+10': return smAverage * 1.10;
      case 'undercut-1': return Math.max(0, smLowest - 1);
      case 'undercut-5': return Math.max(0, smLowest - 5);
      case 'premium': return smHighest * 0.95;
      case 'margin-15': return calculateMarginPrice(15);
      case 'margin-20': return calculateMarginPrice(20);
      case 'margin-25': return calculateMarginPrice(25);
      case 'breakeven': return calculateMarginPrice(0);
      case 'competitive': return smLowest > 0 ? smLowest * 0.98 : smAverage * 0.95;
      case 'custom': return parseFloat(customPrice) || currentPrice;
      default: return currentPrice;
    }
  };

  // ✅ 未計算かどうか判定
  const isUncalculable = (strategyId: string): boolean => {
    const needsCostData = ['margin-15', 'margin-20', 'margin-25', 'breakeven'];
    if (needsCostData.includes(strategyId) && !hasCostData) return true;
    
    const needsSmData = ['lowest', 'lowest-5', 'lowest+5', 'average', 'avg-10', 'avg+10', 'undercut-1', 'undercut-5', 'premium', 'competitive'];
    if (needsSmData.includes(strategyId) && smLowest === 0 && smAverage === 0) return true;
    
    return false;
  };

  // ✅ 利益計算API呼び出し
  const handleCalculateProfit = async () => {
    if (!product?.id || !selectedStrategy) {
      toast.error('戦略を選択してください');
      return;
    }

    setCalculating(true);
    try {
      const targetPrice = calculatePrice(selectedStrategy);
      const totalFeeRate = ebayFeeRate + paypalFeeRate;
      const fees = targetPrice * totalFeeRate;
      const dutyAmt = targetPrice * (dutyRate / 100);
      const profit = targetPrice - totalCost - fees - dutyAmt;
      const margin = targetPrice > 0 ? (profit / targetPrice) * 100 : 0;
      const breakEven = totalCost / (1 - totalFeeRate);

      const result: ProfitCalculationResult = {
        success: true,
        suggestedPrice: targetPrice,
        breakEvenPrice: breakEven,
        expectedProfit: profit,
        profitMargin: margin,
        redFlag: profit < 0 || margin < 5,
        strategyApplied: selectedStrategy,
        details: {
          baseCostUsd: purchasePriceUsd,
          feesUsd: fees,
          shippingCostUsd: shippingCost,
          dutyAmount: dutyAmt,
          totalCost: totalCost + fees + dutyAmt,
        }
      };

      setProfitResult(result);
      
      if (result.redFlag) {
        toast.warning('⚠️ 赤字警告: この価格では利益が確保できません');
      } else {
        toast.success(`✅ 利益計算完了: $${profit.toFixed(2)} (${margin.toFixed(1)}%)`);
      }
    } catch (error: any) {
      toast.error(`利益計算エラー: ${error.message}`);
    } finally {
      setCalculating(false);
    }
  };

  // ✅ 戦略適用
  const handleApply = async () => {
    if (!selectedStrategy || !product?.id) return;
    
    setApplying(true);
    try {
      const newPrice = calculatePrice(selectedStrategy);
      
      // 利益計算
      const totalFeeRate = ebayFeeRate + paypalFeeRate;
      const fees = newPrice * totalFeeRate;
      const dutyAmt = newPrice * (dutyRate / 100);
      const profit = newPrice - totalCost - fees - dutyAmt;
      const margin = newPrice > 0 ? (profit / newPrice) * 100 : 0;
      
      // 赤字ストッパー
      if (profit < 0) {
        const confirmed = window.confirm(
          `⚠️ 赤字警告!\n\n` +
          `この価格 ($${newPrice.toFixed(2)}) では\n` +
          `利益: -$${Math.abs(profit).toFixed(2)}\n\n` +
          `本当に適用しますか？`
        );
        if (!confirmed) {
          setApplying(false);
          return;
        }
      }
      
      // APIで保存
      const response = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          updates: {
            price_usd: newPrice,
            profit_margin: margin,
            profit_amount_usd: profit,
            listing_data: {
              ...listingDataCheck,
              pricing_strategy: selectedStrategy,
              calculated_price_usd: newPrice,
              calculated_profit_usd: profit,
              calculated_margin: margin,
              price_calculated_at: new Date().toISOString(),
            }
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(`✓ 価格を $${newPrice.toFixed(2)} に更新しました (利益: ${margin.toFixed(1)}%)`);
        onSave?.({
          price_usd: newPrice,
          profit_margin: margin,
          profit_amount_usd: profit,
        });
      } else {
        throw new Error(data.error || '保存に失敗しました');
      }
    } catch (error: any) {
      toast.error(`適用エラー: ${error.message}`);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      {/* 現在の価格情報 */}
      <div style={{ marginBottom: '0.75rem', padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
          <StatBox label="Current" value={`$${currentPrice.toFixed(2)}`} />
          <StatBox label="SM Lowest" value={smLowest > 0 ? `$${smLowest.toFixed(2)}` : '-'} color={T.accent} />
          <StatBox label="SM Average" value={smAverage > 0 ? `$${smAverage.toFixed(2)}` : '-'} />
          <StatBox label="SM Highest" value={smHighest > 0 ? `$${smHighest.toFixed(2)}` : '-'} color={T.warning} />
          <StatBox label="Margin" value={`${profitMargin.toFixed(1)}%`} color={profitMargin >= 15 ? T.success : T.warning} />
        </div>
      </div>

      {/* ✅ 原価データ情報 + 利益計算ボタン */}
      <div style={{
        marginBottom: '0.75rem',
        padding: '0.75rem',
        borderRadius: '6px',
        background: hasCostData ? `${T.success}10` : `${T.error}10`,
        border: `1px solid ${hasCostData ? `${T.success}40` : T.error}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: hasCostData ? T.success : T.error }}>
            {hasCostData ? '✓ 原価データ入力済み' : '✗ 原価データが未入力です'}
          </div>
          <button
            onClick={handleCalculateProfit}
            disabled={calculating || !selectedStrategy}
            style={{
              padding: '0.375rem 0.75rem',
              fontSize: '10px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              background: selectedStrategy ? T.accent : T.textMuted,
              color: '#fff',
              cursor: selectedStrategy ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            {calculating ? (
              <><i className="fas fa-spinner fa-spin"></i> 計算中...</>
            ) : (
              <><i className="fas fa-calculator"></i> 利益計算</>
            )}
          </button>
        </div>
        
        {hasCostData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: T.textMuted }}>原価</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.text }}>
                ¥{purchasePriceJpy.toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: T.textMuted }}>送料</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.text }}>
                ${shippingCost.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: T.textMuted }}>関税率</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.text }}>
                {dutyRate > 0 ? `${dutyRate}%` : '-'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: T.textMuted }}>合計コスト</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.accent }}>
                ${totalCost.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '8px', color: T.textMuted }}>推奨(20%)</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: T.success }}>
                ${calculatePrice('margin-20').toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ 利益計算結果 */}
      {profitResult && (
        <div style={{
          marginBottom: '0.75rem',
          padding: '0.75rem',
          borderRadius: '6px',
          background: profitResult.redFlag ? `${T.error}15` : `${T.success}15`,
          border: `2px solid ${profitResult.redFlag ? T.error : T.success}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <i className={`fas ${profitResult.redFlag ? 'fa-exclamation-triangle' : 'fa-check-circle'}`} 
               style={{ color: profitResult.redFlag ? T.error : T.success }}></i>
            <div style={{ fontSize: '11px', fontWeight: 700, color: profitResult.redFlag ? T.error : T.success }}>
              {profitResult.redFlag ? '⚠️ 赤字警告' : '✓ 利益計算結果'}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            <ResultBox 
              label="推奨価格" 
              value={`$${profitResult.suggestedPrice.toFixed(2)}`} 
              highlight 
            />
            <ResultBox 
              label="損益分岐" 
              value={`$${profitResult.breakEvenPrice.toFixed(2)}`} 
            />
            <ResultBox 
              label="予想利益" 
              value={`$${profitResult.expectedProfit.toFixed(2)}`}
              color={profitResult.expectedProfit >= 0 ? T.success : T.error}
            />
            <ResultBox 
              label="利益率" 
              value={`${profitResult.profitMargin.toFixed(1)}%`}
              color={profitResult.profitMargin >= 15 ? T.success : (profitResult.profitMargin >= 0 ? T.warning : T.error)}
            />
            <ResultBox 
              label="手数料" 
              value={`$${profitResult.details.feesUsd.toFixed(2)}`}
            />
          </div>
          
          {/* 詳細内訳 */}
          <div style={{ marginTop: '0.5rem', fontSize: '9px', color: T.textMuted }}>
            内訳: 商品代 ${profitResult.details.baseCostUsd.toFixed(2)} + 
            送料 ${profitResult.details.shippingCostUsd.toFixed(2)} + 
            手数料 ${profitResult.details.feesUsd.toFixed(2)}
            {profitResult.details.dutyAmount > 0 && ` + 関税 $${profitResult.details.dutyAmount.toFixed(2)}`}
            = 総コスト ${profitResult.details.totalCost.toFixed(2)}
          </div>
        </div>
      )}

      {/* 戦略グリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {STRATEGIES.map(strategy => {
          const isSelected = selectedStrategy === strategy.id;
          const calculatedPrice = calculatePrice(strategy.id);
          const uncalculable = isUncalculable(strategy.id);
          
          return (
            <div
              key={strategy.id}
              onClick={() => !uncalculable && setSelectedStrategy(strategy.id)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                background: uncalculable ? `${T.error}08` : (isSelected ? `${strategy.color}15` : T.panel),
                border: `2px solid ${uncalculable ? T.error : (isSelected ? strategy.color : T.panelBorder)}`,
                cursor: uncalculable ? 'not-allowed' : 'pointer',
                transition: 'all 0.15s ease',
                opacity: uncalculable ? 0.6 : 1,
                position: 'relative',
              }}
            >
              {uncalculable && (
                <div style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: T.error,
                  color: 'white',
                  fontSize: '8px',
                  padding: '1px 4px',
                  borderRadius: '3px',
                  fontWeight: 700,
                }}>
                  要入力
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.25rem' }}>
                <i className={`fas ${strategy.icon}`} style={{ fontSize: '10px', color: uncalculable ? T.error : strategy.color }}></i>
                <span style={{ fontSize: '10px', fontWeight: 600, color: T.text }}>{strategy.label}</span>
              </div>
              <div style={{ fontSize: '8px', color: T.textMuted, marginBottom: '0.25rem' }}>{strategy.desc}</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: uncalculable ? T.error : strategy.color }}>
                {strategy.id === 'custom' ? (
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => {
                      setCustomPrice(e.target.value);
                      setSelectedStrategy('custom');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="価格入力"
                    style={{
                      width: '100%',
                      padding: '0.25rem',
                      fontSize: '10px',
                      border: `1px solid ${T.panelBorder}`,
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  uncalculable ? '※ 要入力' : `$${calculatedPrice.toFixed(2)}`
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 適用ボタン */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '10px', color: T.textMuted }}>
          {selectedStrategy ? `Selected: ${STRATEGIES.find(s => s.id === selectedStrategy)?.label}` : 'Select a strategy'}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleCalculateProfit}
            disabled={!selectedStrategy || calculating}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px',
              border: `1px solid ${T.accent}`,
              background: 'transparent',
              color: T.accent,
              cursor: selectedStrategy ? 'pointer' : 'not-allowed',
              opacity: selectedStrategy ? 1 : 0.5,
            }}
          >
            {calculating ? <><i className="fas fa-spinner fa-spin"></i> 計算中</> : <><i className="fas fa-calculator"></i> 利益計算</>}
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedStrategy || applying}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '11px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              background: selectedStrategy ? '#1e293b' : T.textMuted,
              color: '#fff',
              cursor: selectedStrategy ? 'pointer' : 'not-allowed',
            }}
          >
            {applying ? <><i className="fas fa-spinner fa-spin"></i> Applying...</> : <><i className="fas fa-check"></i> Apply Strategy</>}
          </button>
        </div>
      </div>
    </div>
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

function ResultBox({ label, value, color, highlight }: { label: string; value: string; color?: string; highlight?: boolean }) {
  return (
    <div style={{ 
      padding: '0.5rem', 
      borderRadius: '4px', 
      background: highlight ? T.accent : T.panel, 
      textAlign: 'center',
      border: highlight ? 'none' : `1px solid ${T.panelBorder}`,
    }}>
      <div style={{ fontSize: '8px', textTransform: 'uppercase', color: highlight ? 'rgba(255,255,255,0.8)' : T.textSubtle }}>{label}</div>
      <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace', color: highlight ? '#fff' : (color || T.text) }}>{value}</div>
    </div>
  );
}

// ✅ ステップ表示コンポーネント
function StepItem({ step, label, completed, current, locked }: { 
  step: number; 
  label: string; 
  completed: boolean; 
  current: boolean;
  locked?: boolean;
}) {
  const bgColor = completed ? T.success : (current ? T.accent : (locked ? T.textSubtle : T.panelBorder));
  const textColor = completed ? T.success : (current ? T.accent : T.textMuted);
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.75rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '6px',
      background: current ? `${T.accent}10` : 'transparent',
      border: current ? `1px solid ${T.accent}40` : '1px solid transparent',
    }}>
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: bgColor,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {completed ? <i className="fas fa-check"></i> : (locked ? <i className="fas fa-lock"></i> : step)}
      </div>
      <span style={{ 
        fontSize: '12px', 
        fontWeight: current ? 600 : 400, 
        color: textColor,
        textAlign: 'left',
      }}>
        {label}
      </span>
      {current && (
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '9px', 
          fontWeight: 600, 
          color: T.accent,
          background: `${T.accent}15`,
          padding: '2px 6px',
          borderRadius: '4px',
        }}>
          ← 次のステップ
        </span>
      )}
    </div>
  );
}

// ✅ ステータス表示コンポーネント
function StatusItem({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '9px', color: T.textMuted }}>{label}</div>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        color: ok ? T.success : T.error,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.25rem',
      }}>
        <i className={`fas ${ok ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
        {value}
      </div>
    </div>
  );
}
