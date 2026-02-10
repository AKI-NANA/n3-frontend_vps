// app/tools/editing/components/product-row.tsx
/**
 * 商品行コンポーネント - Zustand セレクター対応版
 * 
 * 高速化ポイント:
 * 1. セレクターで特定商品のみ取得（他商品の変更で再レンダリングしない）
 * 2. React.memo で不要な再レンダリング防止
 * 3. useCallback でハンドラをメモ化
 * 
 * 使用方法:
 * <ProductRowOptimized 
 *   productId="123" 
 *   onProductClick={handleClick}
 *   onProductHover={handleHover}
 * />
 */

'use client';

import { memo, useCallback } from 'react';
import { useProductSelector } from '@/store/productStore';
import type { Product } from '../types/product';

interface ProductRowOptimizedProps {
  productId: string;
  isSelected?: boolean;
  isModified?: boolean;
  onProductClick?: (product: Product) => void;
  onProductHover?: (product: Product) => void;
  onSelectChange?: (productId: string, selected: boolean) => void;
  onCellChange?: (productId: string, updates: Partial<Product>) => void;
  wrapText?: boolean;
}

/**
 * 最適化された商品行コンポーネント
 * 
 * セレクターでproductMap[productId]のみを取得するため、
 * 他の商品が更新されてもこのコンポーネントは再レンダリングされない
 */
export const ProductRowOptimized = memo(function ProductRowOptimized({
  productId,
  isSelected = false,
  isModified = false,
  onProductClick,
  onProductHover,
  onSelectChange,
  onCellChange,
  wrapText = false,
}: ProductRowOptimizedProps) {
  // セレクター: この商品のみ取得（他商品の変更で再レンダリングしない）
  const product = useProductSelector(productId);

  // ハンドラのメモ化
  const handleClick = useCallback(() => {
    if (product && onProductClick) {
      onProductClick(product);
    }
  }, [product, onProductClick]);

  const handleHover = useCallback(() => {
    if (product && onProductHover) {
      onProductHover(product);
    }
  }, [product, onProductHover]);

  const handleSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectChange) {
      onSelectChange(productId, e.target.checked);
    }
  }, [productId, onSelectChange]);

  // 商品が見つからない場合
  if (!product) {
    return null;
  }

  // 画像URL取得
  const imageUrl = product.images?.[0] || '/placeholder.png';
  const title = product.title || product.title_en || 'No Title';
  const price = product.price ?? 0;

  return (
    <tr
      className={`
        n3-table-row
        ${isSelected ? 'n3-table-row-selected' : ''}
        ${isModified ? 'n3-table-row-modified' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={handleHover}
    >
      {/* 選択チェックボックス */}
      <td className="n3-table-cell n3-table-cell-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      {/* 画像 */}
      <td className="n3-table-cell n3-table-cell-image">
        <img
          src={imageUrl}
          alt={title}
          className="w-12 h-12 object-cover rounded"
          loading="lazy"
        />
      </td>

      {/* SKU */}
      <td className="n3-table-cell">
        {product.sku || '-'}
      </td>

      {/* タイトル */}
      <td 
        className={`n3-table-cell ${wrapText ? 'whitespace-normal' : 'whitespace-nowrap'}`}
        title={title}
      >
        {wrapText ? title : (title.length > 50 ? `${title.slice(0, 50)}...` : title)}
      </td>

      {/* 価格 */}
      <td className="n3-table-cell text-right">
        ¥{price.toLocaleString()}
      </td>

      {/* ステータス */}
      <td className="n3-table-cell">
        <span className={`n3-badge n3-badge-${product.status || 'draft'}`}>
          {product.status || 'draft'}
        </span>
      </td>

      {/* 変更インジケーター */}
      {isModified && (
        <td className="n3-table-cell text-center">
          <span className="text-amber-500">●</span>
        </td>
      )}
    </tr>
  );
});

/**
 * 商品IDリストから行をレンダリング
 * 
 * 使用方法:
 * <ProductRowList 
 *   productIds={['1', '2', '3']}
 *   selectedIds={selectedSet}
 *   modifiedIds={modifiedSet}
 * />
 */
interface ProductRowListProps {
  productIds: string[];
  selectedIds: Set<string>;
  modifiedIds: Set<string>;
  onProductClick?: (product: Product) => void;
  onProductHover?: (product: Product) => void;
  onSelectChange?: (productId: string, selected: boolean) => void;
  onCellChange?: (productId: string, updates: Partial<Product>) => void;
  wrapText?: boolean;
}

export const ProductRowList = memo(function ProductRowList({
  productIds,
  selectedIds,
  modifiedIds,
  ...props
}: ProductRowListProps) {
  return (
    <>
      {productIds.map((productId) => (
        <ProductRowOptimized
          key={productId}
          productId={productId}
          isSelected={selectedIds.has(productId)}
          isModified={modifiedIds.has(productId)}
          {...props}
        />
      ))}
    </>
  );
});
