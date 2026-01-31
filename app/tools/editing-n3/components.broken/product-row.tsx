'use client';

import React, { memo, useMemo } from 'react';
import { N3Checkbox, N3ExpandPanel } from '@/components/n3';
import type { ExpandPanelProduct } from '@/components/n3';
import type { Product } from '@/app/tools/editing/types/product';
import { checkProductCompleteness, getCompletenessBorderColor } from '@/lib/product';
import { 
  auditProduct, 
  getAuditSeverityColor, 
  getAuditScoreColor,
  detectOriginFromTitle,
  detectMaterialFromText,
  type ProductAuditReport 
} from '@/lib/services/audit';
import { COLUMN_WIDTHS, ROW_HEIGHT } from './views/n3-basic-edit-view';

interface ProductRowProps {
  product: Product;
  expandProduct: ExpandPanelProduct;
  isSelected: boolean;
  isExpanded: boolean;
  fastMode: boolean;
  onToggleSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onRowClick: (product: Product) => void;
  onCellChange: (id: string, field: string, value: any) => void;
  onDelete: () => void;
  onEbaySearch: () => void;
  onOpenAuditPanel?: (product: Product) => void;
}

// ============================================================
// 色彩定義（統一配色）
// ============================================================

const COLORS = {
  // ステータス色
  success: '#22c55e',    // 緑
  warning: '#f59e0b',    // オレンジ
  error: '#ef4444',      // 赤
  info: '#3b82f6',       // 青
  
  // バッジ背景（透過）
  successBg: 'rgba(34, 197, 94, 0.12)',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  infoBg: 'rgba(59, 130, 246, 0.12)',
  mutedBg: 'var(--panel)',
  
  // テキスト
  text: 'var(--text)',
  muted: 'var(--text-muted)',
  subtle: 'var(--text-subtle)',
};

// ============================================================
// 監査スコアバッジ (Gemini推奨: AI審査済みアイコン付き)
// ============================================================

interface AuditScoreBadgeProps {
  score: number;
  isAiReviewed?: boolean;  // AI審査済みフラグ
  onClick?: () => void;
}

const AuditScoreBadge = memo(function AuditScoreBadge({ score, isAiReviewed, onClick }: AuditScoreBadgeProps) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title={`監査スコア: ${score}/100${isAiReviewed ? ' (AI審査済み)' : ''}`}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 3,
        minWidth: 32, 
        height: 20, 
        padding: '0 6px',
        borderRadius: '10px',
        background: getAuditScoreColor(score),
        color: '#fff', 
        fontWeight: 600, 
        fontSize: '11px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {isAiReviewed && <span style={{ fontSize: '9px' }}>✨</span>}
      {score}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const ProductRow = memo(function ProductRow({
  product,
  expandProduct,
  isSelected,
  isExpanded,
  fastMode,
  onToggleSelect,
  onToggleExpand,
  onRowClick,
  onCellChange,
  onDelete,
  onEbaySearch,
  onOpenAuditPanel,
}: ProductRowProps) {
  const productId = String(product.id);

  // 完全性チェック
  const completeness = useMemo(() => checkProductCompleteness(product), [product]);
  
  // 監査チェック
  const auditReport = useMemo<ProductAuditReport>(() => {
    if (product.audit_score !== undefined && product.audit_score !== null) {
      return {
        productId: product.id,
        timestamp: product.last_audit_at || new Date().toISOString(),
        overallSeverity: product.audit_severity || 'ok',
        score: product.audit_score,
        results: product.audit_logs?.map(log => ({
          ruleId: log.ruleId as any,
          severity: log.severity,
          field: log.field,
          currentValue: log.currentValue,
          expectedValue: log.expectedValue,
          message: log.message,
          messageJa: log.message,
          autoFixable: false,
        })) || [],
        needsAiReview: product.audit_severity === 'error',
        aiReviewFields: [],
        autoFixSuggestions: [],
      };
    }
    return auditProduct(product);
  }, [product]);
  
  // 原産国検出
  const originDetection = useMemo(() => {
    if (product.origin_detected) {
      return { country: product.origin_detected, confidence: product.origin_detection_confidence || 0 };
    }
    return detectOriginFromTitle(product.title || '');
  }, [product.title, product.origin_detected, product.origin_detection_confidence]);
  
  // 素材検出
  const materialDetection = useMemo(() => {
    if (product.material_detected) {
      return { material: product.material_detected, dutyRisk: 0 };
    }
    return detectMaterialFromText(product.title || '');
  }, [product.title, product.material_detected]);
  
  // 背景色
  const bgColor = isSelected ? 'rgba(59, 130, 246, 0.06)' : 'transparent';

  const borderLeftColor = useMemo(() => {
    if (auditReport.overallSeverity === 'error') return COLORS.error;
    if (auditReport.overallSeverity === 'warning') return COLORS.warning;
    if (completeness.completionScore >= 100) return getCompletenessBorderColor(100);
    return 'transparent';
  }, [completeness.completionScore, auditReport.overallSeverity]);

  // 値の計算
  const cooValue = product.origin_country || originDetection.country;
  const materialValue = product.material || materialDetection.material;
  const dutyRate = product.hts_duty_rate || product.duty_rate || 0;
  const isHtsMissing = !product.hts_code;
  const hasHighDuty = dutyRate > 0.05;
  const profitUsd = product.profit_amount_usd || 0;
  const profitMargin = product.profit_margin || 0;

  const handleOpenAuditPanel = () => onOpenAuditPanel?.(product);

  return (
    <>
      <div 
        onClick={() => onRowClick(product)}
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: ROW_HEIGHT,
          borderBottom: '1px solid var(--panel-border)',
          borderLeft: `3px solid ${borderLeftColor}`,
          padding: '0 8px',
          cursor: 'pointer',
          background: bgColor,
          transition: 'background 0.15s ease',
        }}
        className="hover:bg-[var(--highlight)]"
      >
        {/* チェックボックス */}
        <div style={{ width: COLUMN_WIDTHS.checkbox, display: 'flex', justifyContent: 'center', flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
          <N3Checkbox checked={isSelected} onChange={() => onToggleSelect(productId)} />
        </div>

        {/* 展開ボタン */}
        <div style={{ width: COLUMN_WIDTHS.expand, display: 'flex', justifyContent: 'center', flexShrink: 0 }} onClick={(e) => { e.stopPropagation(); onToggleExpand(productId); }}>
          <button 
            disabled={fastMode}
            style={{
              width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', borderRadius: '4px',
              color: fastMode ? COLORS.subtle : COLORS.muted,
              cursor: fastMode ? 'not-allowed' : 'pointer', 
              opacity: fastMode ? 0.5 : 1,
              fontSize: '9px',
            }}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>

        {/* 商品情報 */}
        <div style={{ flex: 1, minWidth: COLUMN_WIDTHS.product, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 8px 6px 0' }}>
          <div style={{ 
            width: 38, height: 38, borderRadius: '4px', overflow: 'hidden', 
            background: 'var(--panel)', flexShrink: 0, border: '1px solid var(--panel-border)' 
          }}>
            {product.primary_image_url && (
              <img src={product.primary_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 500,
              color: COLORS.text,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: 1,
            }}>
              {product.title || '(タイトルなし)'}
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: COLORS.muted,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {product.english_title || product.title_en || '(No English title)'}
            </div>
          </div>
        </div>

        {/* 原産国 (COO) - シンプルバッジ */}
        <div style={{ width: COLUMN_WIDTHS.coo, flexShrink: 0, textAlign: 'center' }}>
          <span style={{ 
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 500,
            background: cooValue ? COLORS.infoBg : COLORS.mutedBg,
            color: cooValue ? COLORS.info : COLORS.muted,
          }}>
            {cooValue || '-'}
          </span>
        </div>

        {/* HTS/関税率 */}
        <div style={{ width: COLUMN_WIDTHS.hts, flexShrink: 0, textAlign: 'center' }}>
          <span 
            onClick={(e) => { e.stopPropagation(); if (isHtsMissing) handleOpenAuditPanel(); }}
            style={{ 
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: 500,
              background: isHtsMissing ? COLORS.errorBg : hasHighDuty ? COLORS.warningBg : COLORS.mutedBg,
              color: isHtsMissing ? COLORS.error : hasHighDuty ? COLORS.warning : COLORS.muted,
              cursor: isHtsMissing ? 'pointer' : 'default',
            }} 
            title={isHtsMissing ? 'HTS未設定' : `HTS: ${product.hts_code}`}
          >
            {isHtsMissing ? '-' : `${(dutyRate * 100).toFixed(1)}%`}
          </span>
        </div>

        {/* 素材 (Mat) - シンプルテキスト */}
        <div style={{ width: COLUMN_WIDTHS.mat, flexShrink: 0, overflow: 'hidden', textAlign: 'center' }}>
          <span style={{ 
            fontSize: '11px', 
            color: materialValue ? COLORS.text : COLORS.muted,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'inline-block',
            maxWidth: '100%',
          }} title={materialValue || '-'}>
            {materialValue || '-'}
          </span>
        </div>

        {/* Stock */}
        <div style={{ width: COLUMN_WIDTHS.stk, flexShrink: 0, textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontFamily: 'monospace', color: COLORS.text }}>
            {product.current_stock || 0}
          </span>
        </div>

        {/* Cost */}
        <div style={{ width: COLUMN_WIDTHS.cost, flexShrink: 0, textAlign: 'right', paddingRight: 6 }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: COLORS.text }}>
            ¥{(product.price_jpy || product.cost_price || 0).toLocaleString()}
          </span>
        </div>

        {/* Profit */}
        <div style={{ width: COLUMN_WIDTHS.profit, textAlign: 'right', flexShrink: 0, paddingRight: 6 }}>
          <span style={{ 
            fontSize: '11px', 
            fontFamily: 'monospace', 
            fontWeight: 500,
            color: profitUsd >= 0 ? COLORS.success : COLORS.error,
          }}>
            {profitUsd >= 0 ? '+' : ''}${profitUsd.toFixed(0)}
          </span>
        </div>

        {/* Rate */}
        <div style={{ width: COLUMN_WIDTHS.rate, textAlign: 'right', flexShrink: 0, paddingRight: 6 }}>
          <span style={{ 
            fontSize: '11px', 
            fontFamily: 'monospace',
            fontWeight: 500,
            color: profitMargin >= 0.15 ? COLORS.success : profitMargin >= 0 ? COLORS.text : COLORS.error,
          }}>
            {(profitMargin * 100).toFixed(0)}%
          </span>
        </div>

        {/* 監査スコア */}
        <div style={{ width: COLUMN_WIDTHS.scr, textAlign: 'center', flexShrink: 0 }}>
          <AuditScoreBadge
            score={auditReport.score}
            isAiReviewed={product.ai_reviewed === true || !!product.provenance?.hts_code?.model}
            onClick={handleOpenAuditPanel}
          />
        </div>

        {/* ステータス */}
        <div style={{ width: COLUMN_WIDTHS.st, textAlign: 'center', flexShrink: 0 }}>
          <span 
            title={auditReport.overallSeverity === 'ok' ? 'Ready' : `${auditReport.results.length}件の問題`}
            style={{ 
              display: 'inline-block', 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              background: auditReport.overallSeverity === 'ok' ? COLORS.success : getAuditSeverityColor(auditReport.overallSeverity),
              cursor: auditReport.overallSeverity !== 'ok' ? 'pointer' : 'default',
            }}
            onClick={auditReport.overallSeverity !== 'ok' ? (e) => { e.stopPropagation(); handleOpenAuditPanel(); } : undefined}
          />
        </div>

        {/* Type */}
        <div style={{ width: COLUMN_WIDTHS.type, textAlign: 'center', fontSize: '10px', color: COLORS.muted, flexShrink: 0 }}>
          {product.product_type || '-'}
        </div>
      </div>
      
      {/* 展開パネル */}
      {isExpanded && !fastMode && (
        <N3ExpandPanel product={expandProduct} onEdit={() => onRowClick(product)} onDelete={onDelete} onEbaySearch={onEbaySearch} onCellChange={onCellChange} />
      )}
    </>
  );
});

export default ProductRow;
