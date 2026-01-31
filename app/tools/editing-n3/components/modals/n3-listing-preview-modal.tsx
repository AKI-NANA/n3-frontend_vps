// app/tools/editing-n3/components/modals/n3-listing-preview-modal.tsx
/**
 * 出品前最終確認モーダル v2.3
 * 
 * 🔥 v2.3変更点:
 * - 背景色をシンプル化（白/グレー交互のみ）
 * - 問題がある行のみ背景をハイライト
 * - チカチカする色を削減
 * - 本当に見るべきところだけ色付け
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  DollarSign,
  Package,
  Truck,
  Zap,
  Calendar,
  Globe,
  Tag,
  ChevronDown,
  ChevronRight,
  Bot,
  Scale,
  Box,
  FileText,
  Percent,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { N3Button } from '@/components/n3';
import type { Product } from '@/app/tools/editing/types/product';
import {
  PROVENANCE_CONFIG,
  analyzeProductProvenance,
  hasAIGeneratedData,
  getAIGeneratedFields,
  type ProvenanceInfo,
} from '@/lib/product/provenance';
import {
  getHTSDefinition,
  getHTSJudgmentHint,
  formatDutyRate,
} from '@/lib/product/hts-definitions';
import {
  getCategoryDefinition,
  getCategoryJudgmentHint,
} from '@/lib/product/category-definitions';
import {
  detectMismatches,
  countMismatches,
  type MismatchDetection,
} from '@/lib/product/mismatch-detector';
import {
  mapShippingPolicy,
  detectWeightAnomalies,
  type PolicyMappingResult,
  type PolicyRecommendation,
} from '@/lib/product/policy-mapper';
import {
  validateForEbaymagSync,
} from '@/lib/product/ebaymag-validator';

// ============================================================
// 型定義
// ============================================================

interface N3ListingPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onConfirmListing: (mode: 'immediate' | 'scheduled') => Promise<void>;
  selectedAccount?: string;
}

// ============================================================
// プロバンスドット（控えめに）
// ============================================================

function ProvenanceDot({ provenance }: { provenance: ProvenanceInfo }) {
  // AIの場合のみ目立たせる
  const isAI = provenance.type === 'ai';
  return (
    <span
      style={{
        display: 'inline-block',
        width: isAI ? 10 : 6,
        height: isAI ? 10 : 6,
        borderRadius: '50%',
        background: isAI ? provenance.color : 'var(--text-muted)',
        opacity: isAI ? 1 : 0.3,
        flexShrink: 0,
      }}
      title={`${provenance.label}: ${provenance.description}`}
    />
  );
}

// ============================================================
// 商品行コンポーネント
// ============================================================

interface ProductRowProps {
  product: Product;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function ProductRow({ product, index, isExpanded, onToggle }: ProductRowProps) {
  const listingData = (product as any).listing_data || {};
  const provenances = analyzeProductProvenance(product);
  const mismatches = detectMismatches(product);
  const hasAI = hasAIGeneratedData(product);
  const aiFields = getAIGeneratedFields(product);
  
  // 定義取得
  const htsDefinition = getHTSDefinition(product.hts_code);
  const htsHint = getHTSJudgmentHint(product.hts_code, product.english_title || product.title || '');
  const categoryId = product.ebay_category_id || listingData.ebay_category_id;
  const categoryDefinition = getCategoryDefinition(categoryId);
  const categoryHint = getCategoryJudgmentHint(categoryId, product.english_title || product.title || '');
  
  // プロバンス取得
  const getFieldProvenance = (field: string): ProvenanceInfo => {
    const p = provenances.find(fp => fp.field === field);
    return p?.provenance || PROVENANCE_CONFIG.internal;
  };
  
  // 価格・利益
  const priceJpy = product.price_jpy || (product as any).cost_price || 0;
  const ddpPrice = listingData.ddp_price_usd || product.ddp_price_usd || 0;
  const shippingCost = listingData.shipping_cost_usd || 0;
  const dutyCost = listingData.duty_amount_usd || 0;
  const profitMargin = listingData.ddu_profit_margin || product.profit_margin || 0;
  const profitUsd = listingData.ddu_profit_usd || (product as any).profit_amount_usd || 0;
  const isNegativeProfit = profitMargin < 0;
  const isLowProfit = profitMargin >= 0 && profitMargin < 0.05;
  
  // サイズ
  const weightG = listingData.weight_g || (product as any).weight_g || 0;
  const widthCm = listingData.width_cm || 0;
  const lengthCm = listingData.length_cm || 0;
  const heightCm = listingData.height_cm || 0;
  
  // 問題判定
  const hasCritical = mismatches.some(m => m.severity === 'critical');
  const hasWarning = mismatches.some(m => m.severity === 'warning');
  const isVero = product.is_vero_brand;
  const hasProblem = hasCritical || isVero || isNegativeProfit;
  const hasMinorIssue = hasWarning || isLowProfit || hasAI;
  
  // 背景色：問題ありの行だけ色付け、それ以外はシンプル
  let rowBg = index % 2 === 0 ? '#ffffff' : '#fafafa';
  if (hasProblem) {
    rowBg = '#fff5f5'; // 薄い赤
  } else if (hasMinorIssue) {
    rowBg = '#fffdf5'; // 薄い黄
  }

  return (
    <>
      {/* メイン行 */}
      <div
        onClick={onToggle}
        style={{
          display: 'grid',
          gridTemplateColumns: '24px 44px 1.5fr 140px 120px 100px 90px 80px 80px 70px 70px',
          gap: 6,
          alignItems: 'center',
          padding: '8px 12px',
          background: rowBg,
          borderBottom: '1px solid #eee',
          fontSize: '11px',
          cursor: 'pointer',
          borderLeft: hasProblem ? '3px solid #ef4444' : hasMinorIssue ? '3px solid #f59e0b' : '3px solid transparent',
        }}
      >
        {/* 展開アイコン */}
        <div style={{ color: '#999' }}>
          {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        
        {/* 画像 */}
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#f5f5f5',
          border: '1px solid #eee',
        }}>
          {product.primary_image_url && (
            <img src={product.primary_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>
        
        {/* 商品名 + SKU + バッジ */}
        <div style={{ minWidth: 0 }}>
          <div style={{ 
            fontWeight: 600, 
            color: '#333', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            fontSize: '11px',
          }}>
            {product.english_title || product.title_en || product.title || '(タイトルなし)'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '9px', color: '#888', marginTop: 2 }}>
            <span style={{ fontFamily: 'monospace' }}>{product.sku}</span>
            {/* 問題バッジのみ表示（重要なものだけ） */}
            {isVero && (
              <span style={{ padding: '1px 4px', borderRadius: '3px', background: '#ef4444', color: 'white', fontWeight: 600 }}>
                VERO
              </span>
            )}
            {hasCritical && !isVero && (
              <span style={{ padding: '1px 4px', borderRadius: '3px', background: '#ef4444', color: 'white', fontWeight: 600 }}>
                要確認
              </span>
            )}
            {hasAI && (
              <span style={{ padding: '1px 4px', borderRadius: '3px', background: '#a855f7', color: 'white', fontWeight: 600 }}>
                AI{aiFields.length}
              </span>
            )}
          </div>
        </div>
        
        {/* HTS */}
        <div>
          <div style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: '10px', color: '#333' }}>
            {product.hts_code || <span style={{ color: '#ccc' }}>-</span>}
          </div>
          <div style={{ fontSize: '9px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {htsDefinition?.descriptionJa?.slice(0, 12) || ''}
          </div>
        </div>
        
        {/* カテゴリ */}
        <div style={{ fontSize: '10px', color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {categoryDefinition?.nameJa?.slice(0, 10) || categoryId || '-'}
        </div>
        
        {/* COO + 重量 */}
        <div style={{ fontSize: '10px', color: '#555' }}>
          <div>{product.origin_country || 'JP'}</div>
          <div style={{ color: '#888' }}>{weightG}g</div>
        </div>
        
        {/* 送料 + 関税 */}
        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#555' }}>
          <div>${shippingCost.toFixed(0)}</div>
          <div style={{ color: '#888' }}>税${dutyCost.toFixed(0)}</div>
        </div>
        
        {/* 原価 */}
        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: '#888' }}>
          ¥{priceJpy.toLocaleString()}
        </div>
        
        {/* DDP価格 */}
        <div style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#333' }}>
          ${ddpPrice.toFixed(2)}
        </div>
        
        {/* 利益額 - 問題ある場合のみ色付け */}
        <div style={{ 
          fontSize: '10px', fontFamily: 'monospace', fontWeight: 600,
          color: isNegativeProfit ? '#ef4444' : '#555',
        }}>
          ${profitUsd.toFixed(2)}
        </div>
        
        {/* 利益率 - 問題ある場合のみ色付け */}
        <div style={{ 
          fontSize: '11px', fontFamily: 'monospace', fontWeight: 700,
          color: isNegativeProfit ? '#ef4444' : isLowProfit ? '#f59e0b' : '#555',
          background: isNegativeProfit ? '#fef2f2' : isLowProfit ? '#fffbeb' : 'transparent',
          padding: isNegativeProfit || isLowProfit ? '2px 4px' : 0,
          borderRadius: '3px',
        }}>
          {(profitMargin * 100).toFixed(1)}%
        </div>
      </div>
      
      {/* 展開詳細 */}
      {isExpanded && (
        <div style={{
          padding: '12px 16px 12px 80px',
          background: '#fafafa',
          borderBottom: '1px solid #eee',
          fontSize: '10px',
        }}>
          {/* 不一致警告（問題がある場合のみ強調表示） */}
          {mismatches.length > 0 && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: hasCritical ? '#fef2f2' : '#fffbeb',
              border: `1px solid ${hasCritical ? '#fecaca' : '#fde68a'}`,
              marginBottom: 12,
            }}>
              <div style={{ fontWeight: 700, color: hasCritical ? '#dc2626' : '#d97706', marginBottom: 6 }}>
                ⚠️ 確認が必要な項目 ({mismatches.length}件)
              </div>
              {mismatches.map((m, i) => (
                <div key={i} style={{ marginTop: i > 0 ? 6 : 0, lineHeight: 1.5 }}>
                  <span style={{ color: '#333' }}>{m.message}</span>
                  {m.suggestion && (
                    <span style={{ color: '#666', marginLeft: 8, background: '#fff', padding: '2px 6px', borderRadius: '3px' }}>
                      💡 {m.suggestion}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* 詳細グリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {/* HTS詳細 */}
            <div>
              <div style={{ fontWeight: 600, color: '#666', marginBottom: 6, fontSize: '9px', textTransform: 'uppercase' }}>
                HTSコード
              </div>
              <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#333' }}>
                {product.hts_code || '-'}
              </div>
              <div style={{ color: '#666', marginTop: 2 }}>{htsDefinition?.descriptionJa || ''}</div>
              {htsHint.includes('🚨') && (
                <div style={{ marginTop: 6, padding: '4px 8px', borderRadius: '4px', background: '#fef2f2', color: '#dc2626', fontSize: '9px' }}>
                  {htsHint}
                </div>
              )}
            </div>
            
            {/* カテゴリ詳細 */}
            <div>
              <div style={{ fontWeight: 600, color: '#666', marginBottom: 6, fontSize: '9px', textTransform: 'uppercase' }}>
                eBayカテゴリ
              </div>
              <div style={{ fontWeight: 600, fontSize: '11px', color: '#333' }}>{categoryDefinition?.name || categoryId || '-'}</div>
              <div style={{ color: '#666', marginTop: 2 }}>{categoryDefinition?.nameJa}</div>
              {categoryHint.includes('🚨') && (
                <div style={{ marginTop: 6, padding: '4px 8px', borderRadius: '4px', background: '#fef2f2', color: '#dc2626', fontSize: '9px' }}>
                  {categoryHint}
                </div>
              )}
            </div>
            
            {/* 原産国・重量 */}
            <div>
              <div style={{ fontWeight: 600, color: '#666', marginBottom: 6, fontSize: '9px', textTransform: 'uppercase' }}>
                原産国・サイズ
              </div>
              <div style={{ color: '#333' }}>
                <div>原産国: <strong>{product.origin_country || 'JP'}</strong></div>
                <div style={{ marginTop: 4 }}>重量: <strong>{weightG}g</strong></div>
                <div style={{ marginTop: 4, color: '#888', fontSize: '9px' }}>
                  {widthCm} × {lengthCm} × {heightCm} cm
                </div>
              </div>
            </div>
            
            {/* 配送 */}
            <div>
              <div style={{ fontWeight: 600, color: '#666', marginBottom: 6, fontSize: '9px', textTransform: 'uppercase' }}>
                配送・関税
              </div>
              <div style={{ color: '#333', fontFamily: 'monospace' }}>
                <div>送料: <strong>${shippingCost.toFixed(2)}</strong></div>
                <div style={{ marginTop: 4 }}>関税: <strong>${dutyCost.toFixed(2)}</strong></div>
                <div style={{ marginTop: 4, color: '#888', fontSize: '9px' }}>
                  税率: {formatDutyRate(product.hts_code)}
                </div>
              </div>
            </div>
            
            {/* 価格・利益 */}
            <div>
              <div style={{ fontWeight: 600, color: '#666', marginBottom: 6, fontSize: '9px', textTransform: 'uppercase' }}>
                価格・利益
              </div>
              <div style={{ fontFamily: 'monospace' }}>
                <div style={{ color: '#888' }}>原価: ¥{priceJpy.toLocaleString()}</div>
                <div style={{ marginTop: 4, fontSize: '14px', fontWeight: 700, color: '#333' }}>
                  DDP: ${ddpPrice.toFixed(2)}
                </div>
                <div style={{ 
                  marginTop: 6, padding: '4px 8px', borderRadius: '4px',
                  background: isNegativeProfit ? '#fef2f2' : isLowProfit ? '#fffbeb' : '#f0fdf4',
                  color: isNegativeProfit ? '#dc2626' : isLowProfit ? '#d97706' : '#16a34a',
                  fontWeight: 700,
                }}>
                  利益: ${profitUsd.toFixed(2)} ({(profitMargin * 100).toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export function N3ListingPreviewModal({
  isOpen,
  onClose,
  products,
  onConfirmListing,
  selectedAccount = 'mjt',
}: N3ListingPreviewModalProps) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [acknowledged, setAcknowledged] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 全商品の分析
  const analysis = useMemo(() => {
    let criticalCount = 0;
    let warningCount = 0;
    let aiDataCount = 0;
    let veroCount = 0;
    let negativeProfitCount = 0;
    let lowProfitCount = 0;
    
    for (const product of products) {
      const mismatches = countMismatches(product);
      criticalCount += mismatches.critical;
      warningCount += mismatches.warning;
      
      if (hasAIGeneratedData(product)) aiDataCount++;
      if (product.is_vero_brand) veroCount++;
      
      const profitMargin = (product as any).listing_data?.ddu_profit_margin || product.profit_margin || 0;
      if (profitMargin < 0) negativeProfitCount++;
      else if (profitMargin < 0.05) lowProfitCount++;
    }
    
    // 重量異常検出
    const weightAnomalies = detectWeightAnomalies(
      products.map(p => ({
        id: p.id,
        weightG: (p as any).listing_data?.weight_g || (p as any).weight_g || 0,
        categoryName: p.category_name,
        productTitle: p.english_title || p.title,
      }))
    );
    const weightAnomalyCount = weightAnomalies.length;
    
    return { criticalCount, warningCount, aiDataCount, veroCount, negativeProfitCount, lowProfitCount, weightAnomalyCount, weightAnomalies };
  }, [products]);
  
  // 重量異常は警告だがブロッキングではない（要確認のみ）
  const hasBlockingIssues = analysis.criticalCount > 0 || analysis.veroCount > 0 || analysis.negativeProfitCount > 0;
  const hasWeightWarning = analysis.weightAnomalyCount > 0;
  const canList = !hasBlockingIssues || acknowledged;
  
  const toggleExpand = useCallback((id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  
  const expandAll = useCallback(() => {
    setExpandedIds(new Set(products.map(p => p.id)));
  }, [products]);
  
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);
  
  const handleConfirm = async (mode: 'immediate' | 'scheduled') => {
    setIsSubmitting(true);
    try {
      await onConfirmListing(mode);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div
        style={{
          width: '96%',
          maxWidth: 1500,
          maxHeight: '92vh',
          background: '#fff',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        {/* ヘッダー */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderBottom: '1px solid #e5e5e5',
          background: '#fafafa',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#333', margin: 0 }}>
              出品前確認 ({products.length}件)
            </h2>
            
            {/* サマリー：問題がある場合のみバッジ表示 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '11px' }}>
              {analysis.criticalCount > 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#ef4444', color: 'white', fontWeight: 600 }}>
                  要確認 {analysis.criticalCount}
                </span>
              )}
              {analysis.veroCount > 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#ef4444', color: 'white', fontWeight: 600 }}>
                  VERO {analysis.veroCount}
                </span>
              )}
              {analysis.negativeProfitCount > 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#ef4444', color: 'white', fontWeight: 600 }}>
                  赤字 {analysis.negativeProfitCount}
                </span>
              )}
              {analysis.lowProfitCount > 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#f59e0b', color: 'white', fontWeight: 600 }}>
                  低利益 {analysis.lowProfitCount}
                </span>
              )}
              {analysis.weightAnomalyCount > 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#f97316', color: 'white', fontWeight: 600 }}>
                  重量異常 {analysis.weightAnomalyCount}
                </span>
              )}
              {analysis.aiDataCount > 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#a855f7', color: 'white', fontWeight: 600 }}>
                  AI推論 {analysis.aiDataCount}
                </span>
              )}
              {!hasBlockingIssues && analysis.warningCount === 0 && analysis.aiDataCount === 0 && (
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#22c55e', color: 'white', fontWeight: 600 }}>
                  ✓ 問題なし
                </span>
              )}
            </div>
            
            {/* 展開/折りたたみ */}
            <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
              <button
                onClick={expandAll}
                style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' }}
              >
                全て展開
              </button>
              <button
                onClick={collapseAll}
                style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '4px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', color: '#555' }}
              >
                全て閉じる
              </button>
            </div>
          </div>
          
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#888" />
          </button>
        </div>
        
        {/* テーブルヘッダー */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '24px 44px 1.5fr 140px 120px 100px 90px 80px 80px 70px 70px',
          gap: 6,
          padding: '8px 12px',
          background: '#f5f5f5',
          borderBottom: '1px solid #e5e5e5',
          fontSize: '10px',
          fontWeight: 600,
          color: '#666',
        }}>
          <div></div>
          <div></div>
          <div>商品</div>
          <div>HTS</div>
          <div>カテゴリ</div>
          <div>COO/重量</div>
          <div>送料/税</div>
          <div>原価</div>
          <div>DDP</div>
          <div>利益$</div>
          <div>利益%</div>
        </div>
        
        {/* 商品リスト */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {products.map((product, index) => (
            <ProductRow
              key={product.id}
              product={product}
              index={index}
              isExpanded={expandedIds.has(product.id)}
              onToggle={() => toggleExpand(product.id)}
            />
          ))}
        </div>
        
        {/* フッター */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderTop: '1px solid #e5e5e5',
          background: '#fafafa',
        }}>
          {/* 承認チェックボックス */}
          <div>
            {hasBlockingIssues ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '12px', color: '#dc2626', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(e) => setAcknowledged(e.target.checked)}
                  style={{ width: 16, height: 16 }}
                />
                <span>⚠️ 上記の警告を確認し、リスクを理解した上で出品します</span>
              </label>
            ) : (
              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 500 }}>
                ✓ 出品準備完了
              </span>
            )}
          </div>
          
          {/* ボタン */}
          <div style={{ display: 'flex', gap: 8 }}>
            <N3Button variant="secondary" onClick={onClose} disabled={isSubmitting} size="sm">
              キャンセル
            </N3Button>
            <N3Button
              variant="secondary"
              onClick={() => handleConfirm('scheduled')}
              disabled={!canList || isSubmitting}
              size="sm"
            >
              <Calendar size={14} className="mr-1" />
              スケジュール
            </N3Button>
            <N3Button
              variant="primary"
              onClick={() => handleConfirm('immediate')}
              disabled={!canList || isSubmitting}
              size="sm"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                  処理中
                </>
              ) : (
                <>
                  <Zap size={14} className="mr-1" />
                  今すぐ出品
                </>
              )}
            </N3Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default N3ListingPreviewModal;
