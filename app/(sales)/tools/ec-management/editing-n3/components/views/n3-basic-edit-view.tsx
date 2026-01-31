// app/tools/editing-n3/components/views/n3-basic-edit-view.tsx
/**
 * N3BasicEditView - 基本編集ビュー（リスト/カード表示）
 * 
 * 責務:
 * - リストビュー表示
 * - カードビュー表示
 * - 商品選択・展開の制御
 * - 🔥 監査パネルへの連携
 * - 🔥 カラムソート機能（Excel風）
 * 
 * 📐 Gemini推奨のデザイン:
 * - カラム幅: COO 85px, HTS/MAT 120px, SCR 70px
 * - 行の高さ: 44-48px
 * - フォントサイズ: 12-13px
 */

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { N3Checkbox } from '@/components/n3';
import { N3CardGrid } from '@/components/n3/n3-card-grid';
import { ProductRow } from '../product-row';
import { checkProductCompleteness } from '@/lib/product';
import type { Product } from '@/app/tools/editing/types/product';
import type { ExpandPanelProduct } from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

// ソート可能なカラム
export type SortableColumn = 
  | 'origin_country' 
  | 'hts_code' 
  | 'material' 
  | 'current_stock' 
  | 'price_jpy' 
  | 'profit_amount_usd' 
  | 'profit_margin' 
  | 'audit_score' 
  | 'product_type';

export interface SortState {
  column: SortableColumn | null;
  direction: 'asc' | 'desc' | null;
}

// 🔥 Gemini推奨のカラム幅
export const COLUMN_WIDTHS = {
  checkbox: 40,      // 中央揃え
  expand: 32,        // 展開ボタン
  product: 280,      // flex: 1, minWidth（画像40px + テキスト + 余白）
  coo: 70,           // 国旗 + 2文字コード
  hts: 80,           // 関税率表示
  mat: 110,          // 素材（長い単語対応）
  stk: 50,           // 在庫数
  cost: 80,          // 原価（通貨記号含む）
  profit: 75,        // 利益額
  rate: 60,          // 利益率
  scr: 55,           // 監査スコア（丸バッジ）
  listing: 80,       // 🔥 出品先バッジ
  st: 40,            // ステータス（●）
  type: 70,          // 商品タイプ
} as const;

// 行の高さ（Gemini推奨: 44-48px）
export const ROW_HEIGHT = 48;

export interface N3BasicEditViewProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedIds: Set<string>;
  expandedId: string | null;
  viewMode: 'list' | 'card';
  fastMode: boolean;
  activeFilter: string;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onToggleExpand: (id: string) => void;
  onRowClick: (product: Product) => void;
  onCellChange: (id: string, field: string, value: any) => void;
  onDelete: (id: string) => void;
  onEbaySearch: (product: Product) => void;
  productToExpandPanelProduct: (product: Product) => ExpandPanelProduct;
  onOpenAuditPanel?: (product: Product) => void;
}

// ============================================================
// ソート可能ヘッダーコンポーネント
// ============================================================

interface SortableHeaderProps {
  label: string;
  column: SortableColumn;
  width: number;
  align?: 'left' | 'center' | 'right';
  sortState: SortState;
  onSort: (column: SortableColumn) => void;
}

function SortableHeader({ 
  label, column, width, align = 'center', sortState, onSort 
}: SortableHeaderProps) {
  const isActive = sortState.column === column;
  // 常に薄い矢印を表示、アクティブ時は濃く
  const arrow = isActive 
    ? (sortState.direction === 'asc' ? '▲' : '▼') 
    : '○';  // 薄いインジケーター
  
  return (
    <div 
      onClick={(e) => {
        e.stopPropagation();
        onSort(column);
      }}
      style={{ 
        width, 
        textAlign: align, 
        flexShrink: 0,
        cursor: 'pointer',
        userSelect: 'none',
        color: isActive ? 'var(--accent)' : 'var(--text-muted)',
        fontWeight: isActive ? 700 : 500,
        transition: 'all 0.15s ease',
        padding: isActive ? '2px 6px' : '0 4px',
        // Gemini推奨: アクティブカラムに背景色
        background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        borderRadius: isActive ? 4 : 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
        gap: 4,
      }}
      title={`${label}で並び替え`}
    >
      <span>{label}</span>
      <span style={{ 
        fontSize: '8px', 
        opacity: isActive ? 1 : 0.3,
        color: isActive ? 'var(--accent)' : 'var(--text-muted)',
      }}>
        {arrow}
      </span>
    </div>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export function N3BasicEditView({
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
  onOpenAuditPanel,
}: N3BasicEditViewProps) {
  
  // 🔥 ソート状態
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });

  // 🔥 ソートハンドラー
  const handleSort = useCallback((column: SortableColumn) => {
    setSortState(prev => {
      if (prev.column !== column) {
        return { column, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { column, direction: 'desc' };
      }
      return { column: null, direction: null };
    });
  }, []);

  // 🔥 リアルタイム監査スコアを計算するヘルパー関数
  const getAuditScore = useCallback((product: Product): number => {
    // DBに保存されている場合はそれを使用
    if (product.audit_score !== undefined && product.audit_score !== null) {
      return product.audit_score;
    }
    // リアルタイム計算（簡易版）
    let score = 100;
    if (!product.hts_code) score -= 20;
    if (!product.origin_country) score -= 15;
    if (!product.material) score -= 10;
    if (!product.english_title && !product.title_en) score -= 15;
    if (!product.primary_image_url) score -= 10;
    return Math.max(0, score);
  }, []);

  // 🔥 Gemini推奨: ソート済み商品リスト（改善版）
  const sortedProducts = useMemo(() => {
    console.log('[Sort] useMemo called:', { column: sortState.column, direction: sortState.direction, count: products.length });
    
    if (!sortState.column || !sortState.direction) {
      return products;
    }

    const sorted = [...products].sort((a, b) => {
      const col = sortState.column as SortableColumn;
      
      // 値の抽出
      let aValue: any;
      let bValue: any;
      
      switch (col) {
        case 'origin_country':
          aValue = a.origin_country || '';
          bValue = b.origin_country || '';
          break;
        case 'hts_code':
          aValue = a.hts_duty_rate || a.duty_rate || 0;
          bValue = b.hts_duty_rate || b.duty_rate || 0;
          break;
        case 'material':
          aValue = a.material || '';
          bValue = b.material || '';
          break;
        case 'current_stock':
          aValue = a.current_stock || 0;
          bValue = b.current_stock || 0;
          break;
        case 'price_jpy':
          aValue = a.price_jpy || a.cost_price || 0;
          bValue = b.price_jpy || b.cost_price || 0;
          break;
        case 'profit_amount_usd':
          aValue = a.profit_amount_usd || 0;
          bValue = b.profit_amount_usd || 0;
          break;
        case 'profit_margin':
          aValue = a.profit_margin || 0;
          bValue = b.profit_margin || 0;
          break;
        case 'audit_score':
          // 🔥 リアルタイム計算を使用
          aValue = getAuditScore(a);
          bValue = getAuditScore(b);
          break;
        case 'product_type':
          aValue = a.product_type || '';
          bValue = b.product_type || '';
          break;
        default:
          return 0;
      }

      // 数値比較
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const diff = aValue - bValue;
        return sortState.direction === 'asc' ? diff : -diff;
      }

      // 文字列比較
      const strA = String(aValue);
      const strB = String(bValue);
      const cmp = strA.localeCompare(strB, 'ja');
      return sortState.direction === 'asc' ? cmp : -cmp;
    });

    console.log('[Sort] Sorted:', sorted.slice(0, 3).map(p => ({ id: p.id, score: getAuditScore(p) })));
    return sorted;
  }, [products, sortState, getAuditScore]); // sortStateオブジェクト全体を監視
  
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
          ? '承認待ちの商品はありません'
          : '商品がありません'
        }
      </div>
    );
  }

  // リストビュー
  if (viewMode === 'list') {
    return (
      <>
        {/* テーブルヘッダー（Sticky） */}
        <div 
          style={{ 
            height: 36,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--panel)',
            borderBottom: '1px solid var(--panel-border)',
            padding: '0 8px',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            zIndex: 10,
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
            <div style={{ width: COLUMN_WIDTHS.checkbox, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <N3Checkbox 
                checked={selectedIds.size === sortedProducts.length && sortedProducts.length > 0} 
                onChange={onToggleSelectAll} 
              />
            </div>
            <div style={{ width: COLUMN_WIDTHS.expand, textAlign: 'center', flexShrink: 0 }}>▼</div>
            <div style={{ flex: 1, minWidth: COLUMN_WIDTHS.product, paddingLeft: 8 }}>PRODUCT</div>
            <SortableHeader label="COO" column="origin_country" width={COLUMN_WIDTHS.coo} sortState={sortState} onSort={handleSort} />
            <SortableHeader label="HTS" column="hts_code" width={COLUMN_WIDTHS.hts} sortState={sortState} onSort={handleSort} />
            <SortableHeader label="MAT" column="material" width={COLUMN_WIDTHS.mat} sortState={sortState} onSort={handleSort} />
            <SortableHeader label="STK" column="current_stock" width={COLUMN_WIDTHS.stk} sortState={sortState} onSort={handleSort} />
            <SortableHeader label="COST" column="price_jpy" width={COLUMN_WIDTHS.cost} align="right" sortState={sortState} onSort={handleSort} />
            <SortableHeader label="PROFIT" column="profit_amount_usd" width={COLUMN_WIDTHS.profit} align="right" sortState={sortState} onSort={handleSort} />
            <SortableHeader label="RATE" column="profit_margin" width={COLUMN_WIDTHS.rate} align="right" sortState={sortState} onSort={handleSort} />
            <SortableHeader label="SCR" column="audit_score" width={COLUMN_WIDTHS.scr} sortState={sortState} onSort={handleSort} />
            <div style={{ width: COLUMN_WIDTHS.listing, textAlign: 'center', flexShrink: 0, fontSize: '10px' }}>LIST</div>
            <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}></div>
            <div style={{ width: COLUMN_WIDTHS.st, textAlign: 'center', flexShrink: 0 }}>ST</div>
            <SortableHeader label="TYPE" column="product_type" width={COLUMN_WIDTHS.type} sortState={sortState} onSort={handleSort} />
          </div>
        </div>

        {/* テーブル本体 */}
        <div style={{ flexShrink: 0 }}>
          {sortedProducts.map((product) => {
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
                onOpenAuditPanel={onOpenAuditPanel}
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
}

export default N3BasicEditView;
