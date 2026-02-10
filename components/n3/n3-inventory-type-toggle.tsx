// components/n3/n3-inventory-type-toggle.tsx
/**
 * 有在庫/無在庫 ワンクリック切り替えカードUI
 * 
 * 機能:
 * - 現在の在庫タイプを視覚的に表示
 * - クリックで inventory_type を切り替え
 * - 一括切り替え対応
 */

'use client';

import React, { useState } from 'react';
import { Package, Truck, Loader2 } from 'lucide-react';

interface N3InventoryTypeToggleProps {
  // 単一商品用
  productId?: string;
  uniqueId?: string;
  currentType?: 'stock' | 'mu' | null;
  sku?: string;
  
  // 一括用
  selectedIds?: string[];
  
  // コールバック
  onToggle?: (newType: 'stock' | 'mu') => void;
  onSuccess?: () => void;
  
  // 表示モード
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  disabled?: boolean;
}

/**
 * 有在庫判定（SKUベース）
 */
function determineStockType(inventoryType?: string | null, sku?: string): 'stock' | 'mu' {
  if (inventoryType === 'stock') return 'stock';
  if (inventoryType === 'mu') return 'mu';
  
  // SKUベースの自動判定
  const skuLower = (sku || '').toLowerCase();
  return skuLower.includes('stock') ? 'stock' : 'mu';
}

export function N3InventoryTypeToggle({
  productId,
  uniqueId,
  currentType,
  sku,
  selectedIds,
  onToggle,
  onSuccess,
  size = 'md',
  showLabels = true,
  disabled = false,
}: N3InventoryTypeToggleProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 現在のタイプを判定
  const effectiveType = determineStockType(currentType, sku);
  const isStock = effectiveType === 'stock';
  
  // サイズに応じたスタイル
  const sizeStyles = {
    sm: { card: 'p-2 gap-1', icon: 14, text: 'text-xs' },
    md: { card: 'p-3 gap-2', icon: 18, text: 'text-sm' },
    lg: { card: 'p-4 gap-3', icon: 24, text: 'text-base' },
  };
  const styles = sizeStyles[size];
  
  // 切り替え処理
  const handleToggle = async (newType: 'stock' | 'mu') => {
    if (disabled || loading) return;
    if (newType === effectiveType) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // 一括モード
      if (selectedIds && selectedIds.length > 0) {
        const response = await fetch('/api/inventory/toggle-type', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ids: selectedIds,
            new_type: newType,
          }),
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || '更新に失敗しました');
        }
      }
      // 単一モード
      else if (productId || uniqueId) {
        const response = await fetch('/api/inventory/toggle-type', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: productId,
            unique_id: uniqueId,
            new_type: newType,
          }),
        });
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || '更新に失敗しました');
        }
      }
      
      onToggle?.(newType);
      onSuccess?.();
      
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
      console.error('Toggle type error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex gap-2">
      {/* 有在庫ボタン */}
      <button
        onClick={() => handleToggle('stock')}
        disabled={disabled || loading}
        className={`
          flex items-center ${styles.card} rounded-lg border-2 transition-all
          ${isStock 
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
            : 'border-gray-200 bg-white text-gray-500 hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-800'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {loading && isStock ? (
          <Loader2 size={styles.icon} className="animate-spin" />
        ) : (
          <Package size={styles.icon} />
        )}
        {showLabels && <span className={styles.text}>有在庫</span>}
      </button>
      
      {/* 無在庫ボタン */}
      <button
        onClick={() => handleToggle('mu')}
        disabled={disabled || loading}
        className={`
          flex items-center ${styles.card} rounded-lg border-2 transition-all
          ${!isStock 
            ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' 
            : 'border-gray-200 bg-white text-gray-500 hover:border-amber-300 dark:border-gray-600 dark:bg-gray-800'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {loading && !isStock ? (
          <Loader2 size={styles.icon} className="animate-spin" />
        ) : (
          <Truck size={styles.icon} />
        )}
        {showLabels && <span className={styles.text}>無在庫</span>}
      </button>
      
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}

/**
 * 統計表示用カード
 */
interface N3InventoryTypeStatsProps {
  stockCount: number;
  dropshipCount: number;
  activeFilter?: 'stock' | 'dropship' | null;
  onFilterChange?: (filter: 'stock' | 'dropship' | null) => void;
}

export function N3InventoryTypeStats({
  stockCount,
  dropshipCount,
  activeFilter,
  onFilterChange,
}: N3InventoryTypeStatsProps) {
  return (
    <div className="flex gap-3">
      {/* 有在庫カード */}
      <button
        onClick={() => onFilterChange?.(activeFilter === 'stock' ? null : 'stock')}
        className={`
          flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition-all
          ${activeFilter === 'stock'
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
            : 'border-gray-200 bg-white hover:border-emerald-300 dark:border-gray-600 dark:bg-gray-800'
          }
        `}
      >
        <Package size={24} className="text-emerald-600 mb-2" />
        <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
          {stockCount}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">有在庫</span>
      </button>
      
      {/* 無在庫カード */}
      <button
        onClick={() => onFilterChange?.(activeFilter === 'dropship' ? null : 'dropship')}
        className={`
          flex-1 flex flex-col items-center p-4 rounded-xl border-2 transition-all
          ${activeFilter === 'dropship'
            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30'
            : 'border-gray-200 bg-white hover:border-amber-300 dark:border-gray-600 dark:bg-gray-800'
          }
        `}
      >
        <Truck size={24} className="text-amber-600 mb-2" />
        <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">
          {dropshipCount}
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">無在庫</span>
      </button>
    </div>
  );
}

export default N3InventoryTypeToggle;
