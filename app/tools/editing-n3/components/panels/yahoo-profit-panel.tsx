/**
 * Yahoo Auction 利益計算パネル
 * 
 * 既存のProfitBreakdownModalと同じインターフェースで
 * ヤフオク専用の利益率計算を表示
 * 
 * 計算式:
 * 販売価格 = (仕入 + 送料 + 梱包費) ÷ (1 - 手数料率 - 目標利益率)
 * 
 * @version 1.0.0
 * @date 2026-01-30
 */

'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';
import { X, Calculator, TrendingUp, TrendingDown, Package, Truck, Percent, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { calculatePriceByProfitRate, type ProfitRateCalcResult } from '@/lib/yahooauction/profit-calculator';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export interface YahooProfitPanelProps {
  /** 対象商品 */
  product: Product;
  /** 閉じるハンドラ */
  onClose: () => void;
  /** 価格更新ハンドラ（オプション） */
  onPriceUpdate?: (price: number, profitRate: number) => void;
  /** モーダルモード（trueならオーバーレイ表示） */
  isModal?: boolean;
}

type MemberType = 'lyp_premium' | 'standard';

// ============================================================
// 定数
// ============================================================

const FEE_RATES: Record<MemberType, number> = {
  lyp_premium: 0.088,  // 8.8%
  standard: 0.10,       // 10%
};

const FEE_LABELS: Record<MemberType, string> = {
  lyp_premium: 'LYPプレミアム (8.8%)',
  standard: '通常会員 (10%)',
};

const DEFAULT_PACKAGING_COST = 150;
const DEFAULT_MIN_PROFIT_RATE = 15;

// ============================================================
// ユーティリティ
// ============================================================

/**
 * 商品サイズから送料を推定
 */
function estimateShippingCost(product: Product): number {
  const weight = product.listing_data?.weight_g || 0;
  const width = product.listing_data?.width_cm || 0;
  const height = product.listing_data?.height_cm || 0;
  const length = product.listing_data?.length_cm || 0;
  
  // 3辺合計
  const totalSize = width + height + length;
  
  // サイズ・重量から送料を推定（ゆうパック基準）
  if (totalSize <= 60 && weight <= 2000) return 800;
  if (totalSize <= 80 && weight <= 5000) return 1000;
  if (totalSize <= 100 && weight <= 10000) return 1200;
  if (totalSize <= 120 && weight <= 15000) return 1500;
  if (totalSize <= 140 && weight <= 20000) return 1800;
  if (totalSize <= 160 && weight <= 25000) return 2000;
  if (totalSize <= 170 && weight <= 30000) return 2500;
  
  // サイズ不明の場合はデフォルト
  if (totalSize === 0) return 1000;
  
  return 2500; // 大型
}

// ============================================================
// コンポーネント
// ============================================================

export const YahooProfitPanel = memo(function YahooProfitPanel({
  product,
  onClose,
  onPriceUpdate,
  isModal = true,
}: YahooProfitPanelProps) {
  // ステート
  const [memberType, setMemberType] = useState<MemberType>('lyp_premium');
  const [minProfitRate, setMinProfitRate] = useState(DEFAULT_MIN_PROFIT_RATE);
  const [shippingCost, setShippingCost] = useState(() => estimateShippingCost(product));
  const [packagingCost, setPackagingCost] = useState(DEFAULT_PACKAGING_COST);
  const [manualSellingPrice, setManualSellingPrice] = useState<number | null>(null);
  
  // 仕入れ価格
  const costPrice = product.cost_price || product.price_jpy || 0;
  
  // 計算結果
  const calcResult = useMemo<ProfitRateCalcResult | null>(() => {
    if (costPrice <= 0) return null;
    
    return calculatePriceByProfitRate({
      costPrice,
      shippingCost,
      packagingCost,
      minProfitRate,
      memberType,
    });
  }, [costPrice, shippingCost, packagingCost, minProfitRate, memberType]);
  
  // 手動価格入力時の計算
  const manualCalcResult = useMemo(() => {
    if (!manualSellingPrice || manualSellingPrice <= 0) return null;
    
    const feeRate = FEE_RATES[memberType];
    const fee = Math.round(manualSellingPrice * feeRate);
    const netProceeds = manualSellingPrice - fee - shippingCost - packagingCost;
    const profit = netProceeds - costPrice;
    const profitRate = costPrice > 0 ? (profit / costPrice) * 100 : 0;
    
    return {
      sellingPrice: manualSellingPrice,
      fee,
      netProceeds,
      profit,
      profitRate,
      isProfitable: profit > 0,
    };
  }, [manualSellingPrice, memberType, shippingCost, packagingCost, costPrice]);
  
  // 表示用の結果（手動価格優先）
  const displayResult = manualCalcResult || calcResult;
  
  // 価格適用ハンドラ
  const handleApplyPrice = useCallback(() => {
    if (displayResult && onPriceUpdate) {
      onPriceUpdate(displayResult.sellingPrice, displayResult.profitRate);
      onClose();
    }
  }, [displayResult, onPriceUpdate, onClose]);
  
  // レンダリング
  const content = (
    <div style={{ 
      background: 'var(--panel)', 
      borderRadius: isModal ? '12px' : '0',
      overflow: 'hidden',
      width: isModal ? '480px' : '100%',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ヘッダー */}
      <div style={{ 
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #ff0033 0%, #cc0029 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calculator size={20} />
          <span style={{ fontWeight: 600, fontSize: '15px' }}>
            💴 ヤフオク利益計算
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          <X size={18} />
        </button>
      </div>
      
      {/* 商品情報 */}
      <div style={{ 
        padding: '12px 20px',
        background: 'var(--highlight)',
        borderBottom: '1px solid var(--panel-border)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
          {product.title || product.english_title || product.sku || '商品名なし'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          SKU: {product.sku || '-'} | 在庫: {product.physical_quantity || product.current_stock || 0}
        </div>
      </div>
      
      {/* 設定エリア */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--panel-border)' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
          計算設定
        </div>
        
        {/* 会員種別 */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
            会員種別
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['lyp_premium', 'standard'] as MemberType[]).map(type => (
              <button
                key={type}
                onClick={() => setMemberType(type)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '6px',
                  border: `2px solid ${memberType === type ? '#ff0033' : 'var(--panel-border)'}`,
                  background: memberType === type ? '#ff003310' : 'var(--bg-solid)',
                  color: memberType === type ? '#ff0033' : 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                {FEE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
        
        {/* 数値入力グリッド */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {/* 仕入れ価格 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              仕入れ価格
            </label>
            <div style={{ 
              padding: '8px 12px',
              background: 'var(--highlight)',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
            }}>
              ¥{costPrice.toLocaleString()}
            </div>
          </div>
          
          {/* 目標利益率 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              目標利益率 (%)
            </label>
            <input
              type="number"
              value={minProfitRate}
              onChange={(e) => setMinProfitRate(Number(e.target.value))}
              min={0}
              max={100}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid var(--panel-border)',
                borderRadius: '6px',
                background: 'var(--bg-solid)',
                color: 'var(--text)',
              }}
            />
          </div>
          
          {/* 送料 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Truck size={12} /> 送料
            </label>
            <input
              type="number"
              value={shippingCost}
              onChange={(e) => setShippingCost(Number(e.target.value))}
              min={0}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid var(--panel-border)',
                borderRadius: '6px',
                background: 'var(--bg-solid)',
                color: 'var(--text)',
              }}
            />
          </div>
          
          {/* 梱包材費 */}
          <div>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
              <Package size={12} /> 梱包材費
            </label>
            <input
              type="number"
              value={packagingCost}
              onChange={(e) => setPackagingCost(Number(e.target.value))}
              min={0}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 600,
                border: '2px solid var(--panel-border)',
                borderRadius: '6px',
                background: 'var(--bg-solid)',
                color: 'var(--text)',
              }}
            />
          </div>
        </div>
      </div>
      
      {/* 計算結果 */}
      {displayResult && (
        <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
            計算結果
          </div>
          
          {/* メイン結果 */}
          <div style={{ 
            background: displayResult.isProfitable ? '#10b98110' : '#ef444410',
            border: `2px solid ${displayResult.isProfitable ? '#10b981' : '#ef4444'}`,
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>推奨販売価格</span>
              <span style={{ 
                fontSize: '24px', 
                fontWeight: 700, 
                color: displayResult.isProfitable ? '#10b981' : '#ef4444',
              }}>
                ¥{displayResult.sellingPrice.toLocaleString()}
              </span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>利益率</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {displayResult.isProfitable ? (
                  <TrendingUp size={16} color="#10b981" />
                ) : (
                  <TrendingDown size={16} color="#ef4444" />
                )}
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 600,
                  color: displayResult.isProfitable ? '#10b981' : '#ef4444',
                }}>
                  {displayResult.profitRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          
          {/* 詳細内訳 */}
          <div style={{ 
            background: 'var(--highlight)',
            borderRadius: '8px',
            padding: '12px',
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
              内訳
            </div>
            
            <table style={{ width: '100%', fontSize: '12px' }}>
              <tbody>
                <Row label="販売価格" value={`¥${displayResult.sellingPrice.toLocaleString()}`} />
                <Row 
                  label={`落札手数料 (${(FEE_RATES[memberType] * 100).toFixed(1)}%)`} 
                  value={`-¥${displayResult.fee.toLocaleString()}`} 
                  color="#ef4444"
                />
                <Row label="送料" value={`-¥${shippingCost.toLocaleString()}`} color="#ef4444" />
                <Row label="梱包材費" value={`-¥${packagingCost.toLocaleString()}`} color="#ef4444" />
                <tr><td colSpan={2}><hr style={{ border: 'none', borderTop: '1px dashed var(--panel-border)', margin: '8px 0' }} /></td></tr>
                <Row label="手残り" value={`¥${displayResult.netProceeds.toLocaleString()}`} bold />
                <Row label="仕入れ価格" value={`-¥${costPrice.toLocaleString()}`} color="#ef4444" />
                <tr><td colSpan={2}><hr style={{ border: 'none', borderTop: '1px dashed var(--panel-border)', margin: '8px 0' }} /></td></tr>
                <Row 
                  label="利益" 
                  value={`¥${('profit' in displayResult ? displayResult.profit : displayResult.profitAmount).toLocaleString()}`}
                  color={displayResult.isProfitable ? '#10b981' : '#ef4444'}
                  bold
                />
              </tbody>
            </table>
          </div>
          
          {/* 手動価格入力 */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              手動で販売価格を入力（オプション）
            </label>
            <input
              type="number"
              value={manualSellingPrice || ''}
              onChange={(e) => setManualSellingPrice(e.target.value ? Number(e.target.value) : null)}
              placeholder="販売価格を入力..."
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '14px',
                border: '2px solid var(--panel-border)',
                borderRadius: '6px',
                background: 'var(--bg-solid)',
                color: 'var(--text)',
              }}
            />
          </div>
          
          {/* 警告 */}
          {!displayResult.isProfitable && (
            <div style={{ 
              marginTop: '12px',
              padding: '10px 12px',
              background: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}>
              <AlertTriangle size={16} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '11px', color: '#92400e' }}>
                この価格では赤字になります。仕入れ価格・送料・目標利益率を見直してください。
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* フッター */}
      {onPriceUpdate && displayResult && (
        <div style={{ 
          padding: '12px 20px',
          borderTop: '1px solid var(--panel-border)',
          display: 'flex',
          gap: '8px',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px',
              fontSize: '13px',
              fontWeight: 500,
              border: '1px solid var(--panel-border)',
              borderRadius: '6px',
              background: 'var(--bg-solid)',
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleApplyPrice}
            style={{
              flex: 2,
              padding: '10px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              borderRadius: '6px',
              background: '#ff0033',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle size={16} />
            この価格を適用
          </button>
        </div>
      )}
    </div>
  );
  
  // モーダル表示
  if (isModal) {
    return (
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {content}
      </div>
    );
  }
  
  return content;
});

// ============================================================
// サブコンポーネント
// ============================================================

interface RowProps {
  label: string;
  value: string;
  color?: string;
  bold?: boolean;
}

function Row({ label, value, color, bold }: RowProps) {
  return (
    <tr>
      <td style={{ padding: '4px 0', color: 'var(--text-muted)' }}>{label}</td>
      <td style={{ 
        padding: '4px 0', 
        textAlign: 'right',
        color: color || 'var(--text)',
        fontWeight: bold ? 600 : 400,
      }}>
        {value}
      </td>
    </tr>
  );
}

export default YahooProfitPanel;
