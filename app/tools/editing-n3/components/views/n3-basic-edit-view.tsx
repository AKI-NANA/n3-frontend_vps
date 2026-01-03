// app/tools/editing-n3/components/views/n3-basic-edit-view.tsx
/**
 * N3BasicEditView - 基本編集ビュー（リスト/カード表示）
 * 
 * 責務:
 * - リストビュー表示
 * - カードビュー表示
 * - 商品選択・展開の制御
 */

'use client';

import React, { memo } from 'react';
import { N3Checkbox } from '@/components/n3';
import { N3CardGrid } from '@/components/n3/n3-card-grid';
import { ProductRow } from '../product-row';
import { checkProductCompleteness } from '@/lib/product';
import type { Product } from '@/app/tools/editing/types/product';
import type { ExpandPanelProduct } from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

export interface N3BasicEditViewProps {
  /** 表示する商品リスト */
  products: Product[];
  /** ローディング状態 */
  loading: boolean;
  /** エラーメッセージ */
  error: string | null;
  /** 選択されたID */
  selectedIds: Set<string>;
  /** 展開中のID */
  expandedId: string | null;
  /** 表示モード */
  viewMode: 'list' | 'card';
  /** 高速モード */
  fastMode: boolean;
  /** アクティブフィルター */
  activeFilter: string;
  /** 選択トグル */
  onToggleSelect: (id: string) => void;
  /** 全選択トグル */
  onToggleSelectAll: () => void;
  /** 展開トグル */
  onToggleExpand: (id: string) => void;
  /** 行クリック */
  onRowClick: (product: Product) => void;
  /** セル変更 */
  onCellChange: (id: string, field: string, value: any) => void;
  /** 削除 */
  onDelete: (id: string) => void;
  /** eBay検索 */
  onEbaySearch: (product: Product) => void;
  /** Product → ExpandPanelProduct 変換関数 */
  productToExpandPanelProduct: (product: Product) => ExpandPanelProduct;
}

// ============================================================
// メインコンポーネント
// ============================================================

export const N3BasicEditView = memo(function N3BasicEditView({
  products,
  loading,
  error,
  selectedIds,
  expandedId,
  viewMode,
  fastMode,
  activeFilter,
  onToggleSelect,
  onToggleSelectAll,
  onToggleExpand,
  onRowClick,
  onCellChange,
  onDelete,
  onEbaySearch,
  productToExpandPanelProduct,
}: N3BasicEditViewProps) {
  
  // ローディング
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        読み込み中...
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--error)' }}>
        エラー: {error}
      </div>
    );
  }

  // 空
  if (products.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        {activeFilter === 'approval_pending' 
          ? '承認待ちの商品はありません（全ての必須データが揃っている商品のみ表示されます）'
          : '商品がありません'
        }
      </div>
    );
  }

  // リストビュー
  if (viewMode === 'list') {
    return (
      <>
        {/* テーブルヘッダー */}
        <div 
          style={{ 
            height: 32,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '0 8px',
            flexShrink: 0,
          }}
        >
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%', 
              fontSize: '11px', 
              fontWeight: 600, 
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ width: 40, display: 'flex', justifyContent: 'center' }}>
              <N3Checkbox 
                checked={selectedIds.size === products.length && products.length > 0} 
                onChange={onToggleSelectAll} 
              />
            </div>
            <div style={{ width: 32, textAlign: 'center' }}>▼</div>
            <div style={{ flex: 1, minWidth: 200 }}>Product</div>
            <div style={{ width: 60, textAlign: 'center' }}>Stock</div>
            <div style={{ width: 80, textAlign: 'right' }}>Cost¥</div>
            <div style={{ width: 70, textAlign: 'right' }}>Profit</div>
            <div style={{ width: 60, textAlign: 'right' }}>Rate</div>
            <div style={{ width: 40, textAlign: 'center' }}>✓</div>
            <div style={{ width: 40, textAlign: 'center' }}>ST</div>
            <div style={{ width: 50, textAlign: 'center' }}>Type</div>
          </div>
        </div>

        {/* テーブル本体 */}
        <div style={{ flexShrink: 0, contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
          {products.map((product) => {
            const expandProduct = productToExpandPanelProduct(product);
            return (
              <ProductRow
                key={product.id}
                product={product}
                expandProduct={expandProduct}
                isSelected={selectedIds.has(String(product.id))}
                isExpanded={expandedId === String(product.id)}
                fastMode={fastMode}
                onToggleSelect={onToggleSelect}
                onToggleExpand={onToggleExpand}
                onRowClick={onRowClick}
                onCellChange={onCellChange}
                onDelete={() => onDelete(String(product.id))}
                onEbaySearch={() => onEbaySearch(product)}
              />
            );
          })}
        </div>
      </>
    );
  }

  // カードビュー
  return (
    <div style={{ flexShrink: 0, padding: 12 }}>
      {/* 承認待ちの場合は件数表示 */}
      {activeFilter === 'approval_pending' && (
        <div style={{ 
          marginBottom: 12, 
          padding: '8px 12px', 
          background: 'var(--highlight)', 
          borderRadius: 4,
          fontSize: 12,
          color: 'var(--text-muted)',
        }}>
          承認可能な商品: <strong style={{ color: 'var(--text)' }}>{products.length}件</strong>
          （全ての必須項目が揃っている商品のみ）
        </div>
      )}
      <N3CardGrid
        items={products.map(product => {
          const completeness = checkProductCompleteness(product);
          return {
            id: String(product.id),
            title: product.english_title || product.title_en || product.title || '',
            imageUrl: product.primary_image_url || undefined,
            price: product.ddp_price_usd || product.listing_data?.ddp_price_usd || product.price_usd || 0,
            currency: 'USD' as const,
            profitAmount: product.profit_amount_usd || product.listing_data?.profit_amount_usd || undefined,
            profitMargin: product.profit_margin || product.listing_data?.profit_margin || undefined,
            sku: product.sku || undefined,
            filterPassed: product.filter_passed,
            // VERO情報追加
            filterFailReason: product.filter_passed === false && product.is_vero_brand 
              ? `VERO: ${product.vero_detected_brand || 'ブランド検出'}` 
              : undefined,
            veroDetectedBrand: product.vero_detected_brand,
            humanApproved: product.ready_to_list || product.workflow_status === 'approved',
            category: product.category_name || product.category || undefined,
            categoryId: product.category_id || product.ebay_category_id || undefined,
            htsCode: product.hts_code || undefined,
            originCountry: product.origin_country || undefined,
            hasEnglishTitle: completeness.checks.englishTitle,
            hasHtml: !!product.html_content,
            hasShipping: !!(product.shipping_cost_usd || product.usa_shipping_policy_name),
            isVeroBrand: product.is_vero_brand || false,
            selected: selectedIds.has(String(product.id)),
            onSelect: onToggleSelect,
            onDetail: (id) => {
              const p = products.find(x => String(x.id) === id);
              if (p) onRowClick(p);
            },
          };
        })}
        columns="auto"
        gap={8}
        minCardWidth={160}
      />
    </div>
  );
});

export default N3BasicEditView;
