// app/tools/editing-n3/components/modals/n3-bundle-composition-modal.tsx
/**
 * セット品構成管理モーダル
 * 
 * 機能:
 * - セット品の構成シングル一覧表示
 * - 構成の追加・削除
 * - セット在庫の計算表示
 * - ボトルネック警告表示
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, Package, Plus, Trash2, Search, AlertTriangle, Info } from 'lucide-react';
import { useBundleItems } from '../../hooks/use-bundle-items';
import type { BundleComponent, InventorySearchResult } from '../../hooks/use-bundle-items';

interface N3BundleCompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName?: string;
  productSku?: string;
  onSaved?: () => void;
}

export function N3BundleCompositionModal({
  isOpen,
  onClose,
  productId,
  productName,
  productSku,
  onSaved,
}: N3BundleCompositionModalProps) {
  const {
    loading,
    error,
    components,
    setStock,
    searchResults,
    fetchComponents,
    addComponent,
    removeComponent,
    searchInventory,
    clearSearchResults,
  } = useBundleItems();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [addQuantity, setAddQuantity] = useState<Record<string, number>>({});
  
  // モーダルを開いた時にデータを取得
  useEffect(() => {
    if (isOpen && productId) {
      fetchComponents(productId);
      clearSearchResults();
      setSearchQuery('');
    }
  }, [isOpen, productId, fetchComponents, clearSearchResults]);
  
  // 検索実行
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const existingIds = components.map(c => c.inventory?.id).filter(Boolean) as string[];
    existingIds.push(productId); // 自分自身も除外
    
    await searchInventory(searchQuery, existingIds, true);
    setIsSearching(false);
  }, [searchQuery, components, productId, searchInventory]);
  
  // 構成追加
  const handleAdd = useCallback(async (inventoryId: string) => {
    const qty = addQuantity[inventoryId] || 1;
    const result = await addComponent(productId, inventoryId, qty);
    
    if (result.success) {
      clearSearchResults();
      setSearchQuery('');
      setAddQuantity(prev => {
        const newState = { ...prev };
        delete newState[inventoryId];
        return newState;
      });
      onSaved?.();
    }
  }, [productId, addQuantity, addComponent, clearSearchResults, onSaved]);
  
  // 構成削除
  const handleRemove = useCallback(async (bundleItemId: string) => {
    if (!confirm('この構成アイテムを削除しますか？')) return;
    
    const result = await removeComponent(bundleItemId, productId);
    if (result.success) {
      onSaved?.();
    }
  }, [productId, removeComponent, onSaved]);
  
  // キーボードショートカット
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--panel, #1e1e1e)',
          borderRadius: 12,
          width: '90%',
          maxWidth: 700,
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: 16,
            borderBottom: '1px solid var(--panel-border, #333)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Package size={24} style={{ color: 'var(--accent, #6366f1)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                セット品構成管理
              </h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted, #888)', marginTop: 2 }}>
                {productSku && <span>{productSku} | </span>}
                {productName || productId}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 8,
              background: 'transparent',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              color: 'var(--text-muted, #888)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* セット在庫情報 */}
        {setStock && (
          <div
            style={{
              padding: 12,
              margin: 12,
              marginBottom: 0,
              background: setStock.availableSetCount <= 0 
                ? 'rgba(239, 68, 68, 0.1)' 
                : setStock.availableSetCount <= 3
                ? 'rgba(245, 158, 11, 0.1)'
                : 'rgba(34, 197, 94, 0.1)',
              borderRadius: 8,
              border: `1px solid ${
                setStock.availableSetCount <= 0 
                  ? 'rgba(239, 68, 68, 0.3)' 
                  : setStock.availableSetCount <= 3
                  ? 'rgba(245, 158, 11, 0.3)'
                  : 'rgba(34, 197, 94, 0.3)'
              }`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {setStock.availableSetCount <= 3 ? (
                <AlertTriangle size={18} style={{ color: setStock.availableSetCount <= 0 ? '#ef4444' : '#f59e0b' }} />
              ) : (
                <Info size={18} style={{ color: '#22c55e' }} />
              )}
              <span style={{ fontWeight: 500 }}>
                販売可能セット数: <strong>{setStock.availableSetCount}</strong>
              </span>
              {!setStock.hasComponents && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  （構成未登録）
                </span>
              )}
            </div>
            
            {setStock.bottleneck && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                ボトルネック: {setStock.bottleneck.productName} 
                （SKU: {setStock.bottleneck.sku}） - 
                利用可能: {setStock.bottleneck.availableQty}個 / 
                必要: {setStock.bottleneck.requiredQty}個/セット
              </div>
            )}
          </div>
        )}

        {/* 構成一覧 */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 500 }}>
            構成アイテム ({components.length})
          </h4>
          
          {loading && components.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
              読み込み中...
            </div>
          ) : components.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
              <Package size={32} style={{ opacity: 0.3, marginBottom: 8 }} />
              <div>構成アイテムがありません</div>
              <div style={{ fontSize: 12 }}>下の検索から追加してください</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {components.map(comp => (
                <ComponentRow
                  key={comp.id}
                  component={comp}
                  onRemove={() => handleRemove(comp.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* 検索・追加 */}
        <div style={{ padding: 16, borderTop: '1px solid var(--panel-border, #333)' }}>
          <h4 style={{ margin: '0 0 12px', fontSize: 14 }}>シングルを追加</h4>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="SKUまたは商品名で検索..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid var(--panel-border, #333)',
                borderRadius: 6,
                background: 'var(--panel, #1e1e1e)',
                color: 'var(--text, #fff)',
                fontSize: 14,
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              style={{
                padding: '8px 16px',
                background: 'var(--accent, #6366f1)',
                border: 'none',
                borderRadius: 6,
                cursor: isSearching || !searchQuery.trim() ? 'not-allowed' : 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                opacity: isSearching || !searchQuery.trim() ? 0.5 : 1,
              }}
            >
              <Search size={16} />
              {isSearching ? '検索中...' : '検索'}
            </button>
          </div>

          {/* 検索結果 */}
          {searchResults.length > 0 && (
            <div
              style={{
                maxHeight: 200,
                overflow: 'auto',
                border: '1px solid var(--panel-border, #333)',
                borderRadius: 6,
              }}
            >
              {searchResults.map(item => (
                <SearchResultRow
                  key={item.id}
                  item={item}
                  quantity={addQuantity[item.id] || 1}
                  onQuantityChange={(qty) => setAddQuantity(prev => ({ ...prev, [item.id]: qty }))}
                  onAdd={() => handleAdd(item.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* エラー表示 */}
        {error && (
          <div
            style={{
              padding: 12,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              textAlign: 'center',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

// 構成アイテム行コンポーネント
function ComponentRow({
  component,
  onRemove,
}: {
  component: BundleComponent;
  onRemove: () => void;
}) {
  const inv = component.inventory;
  if (!inv) return null;
  
  const available = (inv.physical_quantity || 0) - (inv.reserved_quantity || 0);
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        background: 'var(--highlight, rgba(255,255,255,0.05))',
        borderRadius: 8,
      }}
    >
      {/* サムネイル */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 6,
          background: 'var(--panel, #1e1e1e)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {inv.images?.[0] && (
          <img
            src={inv.images[0]}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      
      {/* 情報 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {inv.product_name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted, #888)' }}>
          {inv.sku} | 在庫: {inv.physical_quantity} (利用可能: {available}) | 
          <strong style={{ color: 'var(--accent, #6366f1)' }}> 使用: {component.quantity}個/セット</strong>
        </div>
      </div>
      
      {/* 削除ボタン */}
      <button
        onClick={onRemove}
        style={{
          padding: 8,
          background: 'rgba(239, 68, 68, 0.1)',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          color: '#ef4444',
          flexShrink: 0,
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

// 検索結果行コンポーネント
function SearchResultRow({
  item,
  quantity,
  onQuantityChange,
  onAdd,
}: {
  item: InventorySearchResult;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAdd: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: 8,
        borderBottom: '1px solid var(--panel-border, #333)',
      }}
    >
      {/* サムネイル */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 4,
          background: 'var(--panel, #1e1e1e)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {item.image_url && (
          <img
            src={item.image_url}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>
      
      {/* 情報 */}
      <div style={{ flex: 1, fontSize: 13, minWidth: 0 }}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.product_name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted, #888)' }}>
          {item.sku} | 在庫: {item.available_quantity}
        </div>
      </div>
      
      {/* 数量入力 */}
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={e => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
        style={{
          width: 50,
          padding: '4px 8px',
          border: '1px solid var(--panel-border, #333)',
          borderRadius: 4,
          background: 'var(--panel, #1e1e1e)',
          color: 'var(--text, #fff)',
          textAlign: 'center',
          fontSize: 12,
        }}
      />
      
      {/* 追加ボタン */}
      <button
        onClick={onAdd}
        style={{
          padding: '6px 12px',
          background: 'var(--success, #22c55e)',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          color: 'white',
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Plus size={14} />
        追加
      </button>
    </div>
  );
}

export default N3BundleCompositionModal;
