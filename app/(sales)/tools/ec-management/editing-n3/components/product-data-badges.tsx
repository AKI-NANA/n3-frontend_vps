// app/tools/editing-n3/components/product-data-badges.tsx
/**
 * 商品データバッジコンポーネント
 * 
 * 🔥 機能:
 * - 重量/サイズ/送料/関税/DDP価格をコンパクトに表示
 * - ホバーで詳細情報をツールチップ表示
 * - データ不足は警告色で表示
 */

'use client';

import React, { memo, useMemo } from 'react';
import {
  Scale,
  Ruler,
  Truck,
  Percent,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Package,
  Globe,
} from 'lucide-react';
import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

interface ProductDataBadgesProps {
  product: Product;
  compact?: boolean;
  showMissing?: boolean;
}

interface BadgeData {
  icon: React.ReactNode;
  label: string;
  value: string;
  hasData: boolean;
  color: string;
  bgColor: string;
  tooltip?: string;
}

// ============================================================
// ユーティリティ
// ============================================================

function extractProductData(product: Product) {
  const listingData = (product as any)?.listing_data || {};
  
  return {
    // 重量
    weightG: listingData.weight_g || product.weight_g || null,
    
    // サイズ
    widthCm: listingData.width_cm || product.width_cm || null,
    lengthCm: listingData.length_cm || product.length_cm || null,
    heightCm: listingData.height_cm || product.height_cm || null,
    
    // 送料
    shippingCostUsd: listingData.shipping_cost_usd || null,
    shippingService: listingData.shipping_service || listingData.usa_shipping_policy_name || null,
    
    // 関税
    htsCode: product.hts_code || null,
    htsDutyRate: product.hts_duty_rate || listingData.hts_duty_rate || null,
    dutyAmountUsd: listingData.duty_amount_usd || null,
    
    // 価格
    ddpPriceUsd: listingData.ddp_price_usd || product.ddp_price_usd || null,
    dduPriceUsd: listingData.ddu_price_usd || product.ddu_price_usd || null,
    
    // 利益
    profitMargin: listingData.ddu_profit_margin || product.profit_margin || null,
    profitAmountUsd: listingData.ddu_profit_usd || product.profit_amount_usd || null,
    
    // 原産国
    originCountry: product.origin_country || listingData.origin_country || null,
  };
}

// ============================================================
// メインコンポーネント
// ============================================================

export const ProductDataBadges = memo(function ProductDataBadges({
  product,
  compact = false,
  showMissing = true,
}: ProductDataBadgesProps) {
  const data = useMemo(() => extractProductData(product), [product]);
  
  // バッジデータを構築
  const badges: BadgeData[] = useMemo(() => {
    const result: BadgeData[] = [];
    
    // 重量バッジ
    const hasWeight = data.weightG !== null && data.weightG > 0;
    if (hasWeight || showMissing) {
      result.push({
        icon: <Scale size={compact ? 10 : 12} />,
        label: '重量',
        value: hasWeight ? `${data.weightG}g` : '-',
        hasData: hasWeight,
        color: hasWeight ? '#6b7280' : '#ef4444',
        bgColor: hasWeight ? 'rgba(107, 114, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tooltip: hasWeight ? `重量: ${data.weightG}g` : '重量未設定',
      });
    }
    
    // サイズバッジ
    const hasSize = data.widthCm && data.lengthCm && data.heightCm;
    if (hasSize || showMissing) {
      result.push({
        icon: <Ruler size={compact ? 10 : 12} />,
        label: 'サイズ',
        value: hasSize ? `${data.widthCm}×${data.lengthCm}×${data.heightCm}` : '-',
        hasData: !!hasSize,
        color: hasSize ? '#6b7280' : '#ef4444',
        bgColor: hasSize ? 'rgba(107, 114, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tooltip: hasSize 
          ? `サイズ: ${data.widthCm}cm × ${data.lengthCm}cm × ${data.heightCm}cm`
          : 'サイズ未設定',
      });
    }
    
    // 送料バッジ
    const hasShipping = data.shippingCostUsd !== null && data.shippingCostUsd > 0;
    if (hasShipping || showMissing) {
      result.push({
        icon: <Truck size={compact ? 10 : 12} />,
        label: '送料',
        value: hasShipping ? `$${data.shippingCostUsd.toFixed(2)}` : '-',
        hasData: hasShipping,
        color: hasShipping ? '#3b82f6' : '#ef4444',
        bgColor: hasShipping ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tooltip: hasShipping 
          ? `送料: $${data.shippingCostUsd.toFixed(2)}${data.shippingService ? ` (${data.shippingService})` : ''}`
          : '送料未計算',
      });
    }
    
    // 関税バッジ
    const hasDuty = data.htsDutyRate !== null;
    if (hasDuty || showMissing) {
      result.push({
        icon: <Percent size={compact ? 10 : 12} />,
        label: '関税',
        value: hasDuty ? `${data.htsDutyRate}%` : '-',
        hasData: hasDuty,
        color: hasDuty ? '#8b5cf6' : '#f59e0b',
        bgColor: hasDuty ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        tooltip: hasDuty 
          ? `関税率: ${data.htsDutyRate}%${data.htsCode ? ` (HTS: ${data.htsCode})` : ''}${data.dutyAmountUsd ? ` = $${data.dutyAmountUsd.toFixed(2)}` : ''}`
          : 'HTSコード未設定',
      });
    }
    
    // DDP価格バッジ
    const hasPrice = data.ddpPriceUsd !== null && data.ddpPriceUsd > 0;
    if (hasPrice || showMissing) {
      result.push({
        icon: <DollarSign size={compact ? 10 : 12} />,
        label: 'DDP',
        value: hasPrice ? `$${data.ddpPriceUsd.toFixed(2)}` : '-',
        hasData: hasPrice,
        color: hasPrice ? '#22c55e' : '#ef4444',
        bgColor: hasPrice ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tooltip: hasPrice 
          ? `DDP価格: $${data.ddpPriceUsd.toFixed(2)}${data.profitMargin !== null ? ` (利益率: ${data.profitMargin.toFixed(1)}%)` : ''}`
          : 'DDP価格未計算',
      });
    }
    
    return result;
  }, [data, compact, showMissing]);
  
  if (compact) {
    // コンパクト表示（アイコン + 値のみ）
    return (
      <div className="flex items-center gap-1 flex-wrap">
        {badges.map((badge, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium"
            style={{
              backgroundColor: badge.bgColor,
              color: badge.color,
            }}
            title={badge.tooltip}
          >
            {badge.icon}
            <span>{badge.value}</span>
          </div>
        ))}
      </div>
    );
  }
  
  // 通常表示
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {badges.map((badge, idx) => (
        <div
          key={idx}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-help"
          style={{
            backgroundColor: badge.bgColor,
            color: badge.color,
            border: `1px solid ${badge.color}20`,
          }}
          title={badge.tooltip}
        >
          {badge.icon}
          <span className="text-[10px] opacity-70">{badge.label}:</span>
          <span>{badge.value}</span>
          {!badge.hasData && showMissing && (
            <AlertTriangle size={10} className="ml-0.5" />
          )}
        </div>
      ))}
    </div>
  );
});

// ============================================================
// 詳細表示コンポーネント
// ============================================================

export const ProductDataDetail = memo(function ProductDataDetail({
  product,
}: { product: Product }) {
  const data = useMemo(() => extractProductData(product), [product]);
  
  const rows = [
    { label: '重量', value: data.weightG ? `${data.weightG}g` : '-', icon: <Scale size={14} /> },
    { label: 'サイズ', value: data.widthCm ? `${data.widthCm}×${data.lengthCm}×${data.heightCm}cm` : '-', icon: <Ruler size={14} /> },
    { label: '送料', value: data.shippingCostUsd ? `$${data.shippingCostUsd.toFixed(2)}` : '-', icon: <Truck size={14} />, sub: data.shippingService },
    { label: 'HTSコード', value: data.htsCode || '-', icon: <Package size={14} /> },
    { label: '関税率', value: data.htsDutyRate ? `${data.htsDutyRate}%` : '-', icon: <Percent size={14} />, sub: data.dutyAmountUsd ? `$${data.dutyAmountUsd.toFixed(2)}` : null },
    { label: '原産国', value: data.originCountry || '-', icon: <Globe size={14} /> },
    { label: 'DDP価格', value: data.ddpPriceUsd ? `$${data.ddpPriceUsd.toFixed(2)}` : '-', icon: <DollarSign size={14} />, highlight: true },
    { label: 'DDU価格', value: data.dduPriceUsd ? `$${data.dduPriceUsd.toFixed(2)}` : '-', icon: <DollarSign size={14} /> },
    { label: '利益率', value: data.profitMargin !== null ? `${data.profitMargin.toFixed(1)}%` : '-', icon: data.profitMargin !== null && data.profitMargin >= 0 ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-red-500" />, highlight: true, color: data.profitMargin !== null ? (data.profitMargin >= 0 ? '#22c55e' : '#ef4444') : undefined },
  ];
  
  return (
    <div className="space-y-1">
      {rows.map((row, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between py-1 px-2 rounded text-xs"
          style={{
            backgroundColor: row.highlight ? 'var(--highlight)' : 'transparent',
          }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            {row.icon}
            <span>{row.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="font-medium"
              style={{ color: row.color || 'var(--text)' }}
            >
              {row.value}
            </span>
            {row.sub && (
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                ({row.sub})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

// ============================================================
// ミニバッジ（テーブル行用）
// ============================================================

export const ProductMiniDataBadge = memo(function ProductMiniDataBadge({
  product,
}: { product: Product }) {
  const data = useMemo(() => extractProductData(product), [product]);
  
  const hasAllData = !!(
    data.weightG &&
    data.widthCm && data.lengthCm && data.heightCm &&
    data.shippingCostUsd &&
    data.ddpPriceUsd
  );
  
  const missingCount = [
    !data.weightG,
    !(data.widthCm && data.lengthCm && data.heightCm),
    !data.shippingCostUsd,
    !data.ddpPriceUsd,
    !data.htsCode,
  ].filter(Boolean).length;
  
  if (hasAllData) {
    return (
      <div
        className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px]"
        style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
        title={`DDP: $${data.ddpPriceUsd?.toFixed(2)} | 送料: $${data.shippingCostUsd?.toFixed(2)} | 重量: ${data.weightG}g`}
      >
        <CheckCircle2 size={10} />
        <span>${data.ddpPriceUsd?.toFixed(0)}</span>
      </div>
    );
  }
  
  return (
    <div
      className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px]"
      style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
      title={`${missingCount}項目が未設定`}
    >
      <AlertTriangle size={10} />
      <span>-{missingCount}</span>
    </div>
  );
});

export default ProductDataBadges;
