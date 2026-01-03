'use client';

import React, { memo, useMemo } from 'react';
import { N3Checkbox, N3EditableCell, N3ExpandPanel } from '@/components/n3';
import type { ExpandPanelProduct } from '@/components/n3';
import type { Product } from '@/app/tools/editing/types/product';
import { checkProductCompleteness, getCompletenessColor, getCompletenessBorderColor } from '@/lib/product';

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
}

/**
 * 商品行コンポーネント
 * 各行を独立したコンポーネントにすることで、N3EditableCellのフックが安定する
 * 🔥 完全性スコアに基づいて背景色を変更
 */
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
}: ProductRowProps) {
  const productId = String(product.id);

  // 🔥 完全性チェック
  const completeness = useMemo(() => checkProductCompleteness(product), [product]);
  const bgColor = useMemo(() => {
    if (isSelected) return 'rgba(59, 130, 246, 0.08)';
    if (completeness.completionScore >= 100) return getCompletenessColor(100);
    return 'transparent';
  }, [isSelected, completeness.completionScore]);

  const borderLeftColor = useMemo(() => {
    if (completeness.completionScore >= 100) return getCompletenessBorderColor(100);
    return 'transparent';
  }, [completeness.completionScore]);

  return (
    <>
      {/* 行 */}
      <div 
        onClick={() => onRowClick(product)}
        style={{
          display: 'flex',
          alignItems: 'center',
          minHeight: 56,
          borderBottom: '1px solid var(--panel-border)',
          borderLeft: `3px solid ${borderLeftColor}`,
          padding: '0 8px',
          cursor: 'pointer',
          background: bgColor,
          transition: 'background 0.2s ease',
        }}
        className="hover:bg-[var(--highlight)]"
      >
        {/* チェックボックス */}
        <div style={{ width: 40, display: 'flex', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
          <N3Checkbox 
            checked={isSelected} 
            onChange={() => onToggleSelect(productId)} 
          />
        </div>

        {/* 展開ボタン */}
        <div 
          style={{ width: 32, display: 'flex', justifyContent: 'center' }} 
          onClick={(e) => { e.stopPropagation(); onToggleExpand(productId); }}
        >
          <button 
            disabled={fastMode}
            style={{
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: fastMode ? 'var(--text-subtle)' : 'var(--text-muted)',
              cursor: fastMode ? 'not-allowed' : 'pointer',
              opacity: fastMode ? 0.5 : 1,
            }}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>

        {/* 商品情報（画像 + タイトル） */}
        <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
          {/* サムネイル */}
          <div 
            style={{
              width: 40,
              height: 40,
              borderRadius: '4px',
              overflow: 'hidden',
              background: 'var(--panel)',
              flexShrink: 0,
            }}
          >
            {product.primary_image_url && (
              <img src={product.primary_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>

          {/* タイトル（インライン編集可能） */}
          <div style={{ minWidth: 0, flex: 1 }} onClick={(e) => e.stopPropagation()}>
            {/* 日本語タイトル */}
            <div style={{ marginBottom: 2 }}>
              <N3EditableCell
                value={product.title || ''}
                field="title"
                id={productId}
                type="text"
                onChange={onCellChange}
                alignRight={false}
                mono={false}
                placeholder="日本語タイトル..."
                fontSize="13px"
              />
            </div>
            {/* 英語タイトル */}
            <div>
              <N3EditableCell
                value={product.english_title || product.title_en || ''}
                field="english_title"
                id={productId}
                type="text"
                onChange={onCellChange}
                alignRight={false}
                mono={false}
                placeholder="English title..."
                fontSize="11px"
                textColor="var(--text-muted)"
              />
            </div>
          </div>
        </div>

        {/* Stock - インライン編集可能 */}
        <div style={{ width: 60 }} onClick={(e) => e.stopPropagation()}>
          <N3EditableCell
            value={product.current_stock || 0}
            field="current_stock"
            id={productId}
            type="number"
            onChange={onCellChange}
            alignRight={false}
            mono={true}
          />
        </div>

        {/* Cost - インライン編集可能 */}
        <div style={{ width: 80 }} onClick={(e) => e.stopPropagation()}>
          <N3EditableCell
            value={product.price_jpy || product.cost_price || 0}
            field="price_jpy"
            id={productId}
            type="currency"
            currency="JPY"
            onChange={onCellChange}
            alignRight={true}
            mono={true}
          />
        </div>

        {/* Profit（読み取り専用） */}
        <div style={{ width: 70, textAlign: 'right' }}>
          <span style={{ fontSize: '13px', fontFamily: 'monospace', color: (product.profit_amount_usd || 0) >= 0 ? 'var(--success)' : 'var(--error)' }}>
            {(product.profit_amount_usd || 0) >= 0 ? '+' : ''}${product.profit_amount_usd || 0}
          </span>
        </div>

        {/* Rate（読み取り専用） */}
        <div style={{ width: 60, textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: (product.profit_margin || 0) >= 0 ? 'var(--success)' : 'var(--error)' }}>
            {product.profit_margin?.toFixed(0) || 0}%
          </span>
        </div>

        {/* 🔥 完全性スコア - HTMLの代わりに表示 */}
        <div style={{ width: 50, textAlign: 'center', fontSize: '11px' }}>
          <div 
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 20,
              borderRadius: '10px',
              background: completeness.completionScore >= 100 ? 'var(--success)' : completeness.completionScore >= 80 ? 'var(--warning)' : 'var(--text-subtle)',
              color: completeness.completionScore >= 80 ? '#fff' : 'var(--text)',
              fontWeight: 600,
              fontSize: '10px',
            }}
          >
            {completeness.completionScore}%
          </div>
        </div>

        {/* ステータス */}
        <div style={{ width: 40, textAlign: 'center' }}>
          {completeness.isComplete ? (
            <span title="Ready to List" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
          ) : (
            <span title={`Missing: ${completeness.missingItems.join(', ')}`} style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--text-subtle)' }} />
          )}
        </div>

        {/* Type */}
        <div style={{ width: 50, textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          {product.product_type || '-'}
        </div>
      </div>
      
      {/* 展開パネル */}
      {isExpanded && !fastMode && (
        <N3ExpandPanel
          product={expandProduct}
          onEdit={() => onRowClick(product)}
          onDelete={onDelete}
          onEbaySearch={onEbaySearch}
          onCellChange={onCellChange}
        />
      )}
    </>
  );
});

export default ProductRow;
