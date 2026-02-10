// app/tools/editing-n3/components/modals/profit-breakdown-modal.tsx
/**
 * 💰 利益計算内訳ポップアップ v1.0
 * 
 * 機能:
 * - AI推定重量の表示（警告付き）
 * - 送料内訳の表示
 * - 配送方法の切り替え（FedEx ⇔ Economy）
 * - リアルタイム利益再計算
 */

'use client';

import React, { memo, useState, useCallback, useEffect } from 'react';
import { 
  DollarSign, 
  Package, 
  Truck, 
  AlertTriangle, 
  X, 
  RefreshCw,
  Calculator,
  Globe,
  Scale,
  Ruler,
  CheckCircle,
  Info,
} from 'lucide-react';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

interface ProfitBreakdownModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onShippingMethodChange?: (method: 'fedex' | 'economy' | 'flat') => Promise<void>;
  onRefresh?: () => Promise<void>;
}

interface ListingData {
  weight_g?: number;
  weight_g_source?: 'manual' | 'ai_estimated' | 'sm_reference';
  width_cm?: number;
  length_cm?: number;
  height_cm?: number;
  shipping_method?: string;
  shipping_cost_usd?: number;
  shipping_cost_source?: string;
  fedex_cost?: number;
  economy_cost?: number;
  flat_rate_cost?: number;
  listing_price_usd?: number;
  ddp_price_usd?: number;
  ddu_profit_usd?: number;
  ddu_profit_margin?: number;
  ebay_fee_usd?: number;
  customs_duty_usd?: number;
  customs_duty_rate?: number;
}

// ============================================================
// ヘルパー関数
// ============================================================

function formatCurrency(value: number | undefined | null, currency: string = 'USD'): string {
  if (value === undefined || value === null) return '---';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null) return '---';
  return `${value.toFixed(1)}%`;
}

// ============================================================
// メインコンポーネント
// ============================================================

export const ProfitBreakdownModal = memo(function ProfitBreakdownModal({
  product,
  isOpen,
  onClose,
  onShippingMethodChange,
  onRefresh,
}: ProfitBreakdownModalProps) {
  const listingData: ListingData = (product as any)?.listing_data || {};
  const [selectedMethod, setSelectedMethod] = useState<'fedex' | 'economy' | 'flat'>(
    (listingData.shipping_method as 'fedex' | 'economy' | 'flat') || 'fedex'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  
  // AI推定データかどうか
  const isAIEstimatedWeight = listingData.weight_g_source === 'ai_estimated';
  const isAIEstimatedShipping = listingData.shipping_cost_source === 'ai_estimated';
  const hasAIEstimatedData = isAIEstimatedWeight || isAIEstimatedShipping;
  
  // 配送方法変更ハンドラ
  const handleMethodChange = useCallback(async (method: 'fedex' | 'economy' | 'flat') => {
    if (isUpdating) return;
    
    setSelectedMethod(method);
    
    if (onShippingMethodChange) {
      setIsUpdating(true);
      try {
        await onShippingMethodChange(method);
        if (onRefresh) await onRefresh();
      } catch (error) {
        console.error('配送方法変更エラー:', error);
      } finally {
        setIsUpdating(false);
      }
    }
  }, [onShippingMethodChange, onRefresh, isUpdating]);
  
  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null;
  
  // 利益計算
  const costPrice = product.cost_price || 0;
  const shippingCost = listingData.shipping_cost_usd || 0;
  const ebayFee = listingData.ebay_fee_usd || 0;
  const customsDuty = listingData.customs_duty_usd || 0;
  const listingPrice = listingData.ddp_price_usd || listingData.listing_price_usd || 0;
  const profit = listingData.ddu_profit_usd || (listingPrice - costPrice - shippingCost - ebayFee);
  const profitMargin = listingData.ddu_profit_margin || (listingPrice > 0 ? (profit / listingPrice) * 100 : 0);
  
  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative rounded-lg shadow-xl overflow-hidden"
        style={{ 
          background: 'var(--panel)',
          width: 480,
          maxHeight: '85vh',
        }}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between px-4 py-3"
          style={{ 
            borderBottom: '1px solid var(--panel-border)',
            background: 'var(--highlight)',
          }}
        >
          <div className="flex items-center gap-2">
            <Calculator size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold text-sm">利益計算の内訳</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-black/10 transition-colors"
          >
            <X size={16} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
        
        {/* コンテンツ */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
          {/* AI推定データ警告 */}
          {hasAIEstimatedData && (
            <div 
              className="mx-4 mt-4 p-3 rounded-lg flex gap-3"
              style={{ 
                background: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: '#f59e0b' }} />
              <div className="text-xs">
                <div className="font-semibold mb-1" style={{ color: '#b45309' }}>
                  AI推定データ（要確認）
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  {isAIEstimatedWeight && '• 重量はAIが推定した値です\n'}
                  {isAIEstimatedShipping && '• 送料はAIが推定した値です\n'}
                  実際の値と異なる可能性があります。出品前に必ず確認してください。
                </div>
              </div>
            </div>
          )}
          
          {/* 商品情報 */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-3">
              <Package size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs font-semibold">商品サイズ・重量</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* 重量 */}
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: isAIEstimatedWeight ? 'rgba(251, 191, 36, 0.05)' : 'var(--highlight)',
                  border: isAIEstimatedWeight ? '1px solid rgba(251, 191, 36, 0.2)' : '1px solid var(--panel-border)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Scale size={12} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>重量</span>
                  {isAIEstimatedWeight && (
                    <span 
                      className="px-1.5 py-0.5 rounded text-[9px] font-medium"
                      style={{ background: 'rgba(251, 191, 36, 0.2)', color: '#b45309' }}
                    >
                      AI推定
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold">
                  {listingData.weight_g || product.weight_g || '---'} g
                </div>
              </div>
              
              {/* サイズ */}
              <div 
                className="p-3 rounded-lg"
                style={{ 
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Ruler size={12} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>サイズ (cm)</span>
                </div>
                <div className="text-sm font-semibold">
                  {listingData.width_cm || '?'} × {listingData.length_cm || '?'} × {listingData.height_cm || '?'}
                </div>
              </div>
            </div>
          </div>
          
          {/* 配送方法選択 */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Truck size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs font-semibold">配送方法</span>
              {isUpdating && <RefreshCw size={12} className="animate-spin" style={{ color: 'var(--accent)' }} />}
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {/* FedEx */}
              <button
                onClick={() => handleMethodChange('fedex')}
                disabled={isUpdating}
                className="p-3 rounded-lg transition-all text-left"
                style={{
                  border: selectedMethod === 'fedex' 
                    ? '2px solid var(--accent)' 
                    : '1px solid var(--panel-border)',
                  background: selectedMethod === 'fedex' 
                    ? 'rgba(99, 102, 241, 0.05)' 
                    : 'transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">FedEx</span>
                  {selectedMethod === 'fedex' && (
                    <CheckCircle size={12} style={{ color: 'var(--accent)' }} />
                  )}
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
                  {formatCurrency(listingData.fedex_cost)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  3-5日
                </div>
              </button>
              
              {/* Economy */}
              <button
                onClick={() => handleMethodChange('economy')}
                disabled={isUpdating}
                className="p-3 rounded-lg transition-all text-left"
                style={{
                  border: selectedMethod === 'economy' 
                    ? '2px solid #22c55e' 
                    : '1px solid var(--panel-border)',
                  background: selectedMethod === 'economy' 
                    ? 'rgba(34, 197, 94, 0.05)' 
                    : 'transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Economy</span>
                  {selectedMethod === 'economy' && (
                    <CheckCircle size={12} style={{ color: '#22c55e' }} />
                  )}
                </div>
                <div className="text-sm font-bold" style={{ color: '#22c55e' }}>
                  {formatCurrency(listingData.economy_cost)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  7-14日
                </div>
              </button>
              
              {/* Flat Rate */}
              <button
                onClick={() => handleMethodChange('flat')}
                disabled={isUpdating}
                className="p-3 rounded-lg transition-all text-left"
                style={{
                  border: selectedMethod === 'flat' 
                    ? '2px solid #f59e0b' 
                    : '1px solid var(--panel-border)',
                  background: selectedMethod === 'flat' 
                    ? 'rgba(245, 158, 11, 0.05)' 
                    : 'transparent',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">Flat</span>
                  {selectedMethod === 'flat' && (
                    <CheckCircle size={12} style={{ color: '#f59e0b' }} />
                  )}
                </div>
                <div className="text-sm font-bold" style={{ color: '#f59e0b' }}>
                  {formatCurrency(listingData.flat_rate_cost)}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  定額
                </div>
              </button>
            </div>
          </div>
          
          {/* 利益計算 */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs font-semibold">利益計算</span>
            </div>
            
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>販売価格</td>
                  <td className="py-1.5 text-right font-semibold">
                    {formatCurrency(listingPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>- 仕入原価</td>
                  <td className="py-1.5 text-right" style={{ color: 'var(--text-muted)' }}>
                    {formatCurrency(costPrice)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>- 送料</td>
                  <td className="py-1.5 text-right" style={{ color: 'var(--text-muted)' }}>
                    {formatCurrency(shippingCost)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>- eBay手数料</td>
                  <td className="py-1.5 text-right" style={{ color: 'var(--text-muted)' }}>
                    {formatCurrency(ebayFee)}
                  </td>
                </tr>
                {customsDuty > 0 && (
                  <tr>
                    <td className="py-1.5" style={{ color: 'var(--text-muted)' }}>
                      - 関税 ({formatPercentage(listingData.customs_duty_rate)})
                    </td>
                    <td className="py-1.5 text-right" style={{ color: 'var(--text-muted)' }}>
                      {formatCurrency(customsDuty)}
                    </td>
                  </tr>
                )}
                <tr style={{ borderTop: '1px solid var(--panel-border)' }}>
                  <td className="py-2 font-semibold">純利益 (DDU)</td>
                  <td className="py-2 text-right">
                    <span 
                      className="text-base font-bold"
                      style={{ color: profit >= 0 ? '#22c55e' : '#ef4444' }}
                    >
                      {formatCurrency(profit)}
                    </span>
                    <span 
                      className="ml-2 text-xs"
                      style={{ color: profit >= 0 ? '#22c55e' : '#ef4444' }}
                    >
                      ({formatPercentage(profitMargin)})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* 利益率インジケーター */}
            <div className="mt-3 h-2 rounded-full overflow-hidden" style={{ background: 'var(--panel-border)' }}>
              <div 
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(Math.max(profitMargin, 0), 100)}%`,
                  background: profitMargin >= 20 
                    ? '#22c55e' 
                    : profitMargin >= 10 
                      ? '#f59e0b' 
                      : '#ef4444',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              <span>0%</span>
              <span>目標: 20%+</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        {/* フッター */}
        <div 
          className="flex justify-end gap-2 px-4 py-3"
          style={{ borderTop: '1px solid var(--panel-border)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{ 
              background: 'var(--accent)',
              color: 'white',
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProfitBreakdownModal;
