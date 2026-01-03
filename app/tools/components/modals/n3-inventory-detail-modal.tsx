// app/tools/editing-n3/components/modals/n3-inventory-detail-modal.tsx
/**
 * 棚卸し商品詳細モーダル
 * 
 * inventory_master の商品詳細を表示・編集するモーダル
 * 原価と在庫数のインライン編集に対応
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Hash, Calendar, Edit2, Save, ExternalLink, Check, Loader2 } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';
import type { InventoryProduct } from '../../hooks';

interface N3InventoryDetailModalProps {
  product: InventoryProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (id: string, updates: Partial<InventoryProduct>) => Promise<void>;
  onStockChange?: (id: string, newQuantity: number) => Promise<void>;
  onCostChange?: (id: string, newCost: number) => Promise<void>;
}

export function N3InventoryDetailModal({
  product,
  isOpen,
  onClose,
  onSave,
  onStockChange,
  onCostChange,
}: N3InventoryDetailModalProps) {
  const [localProduct, setLocalProduct] = useState<InventoryProduct | null>(null);
  
  // 各フィールドの編集状態
  const [editingStock, setEditingStock] = useState(false);
  const [editingCost, setEditingCost] = useState(false);
  
  // 編集中の値
  const [stockValue, setStockValue] = useState<string>('');
  const [costValue, setCostValue] = useState<string>('');
  
  // 保存中の状態
  const [savingStock, setSavingStock] = useState(false);
  const [savingCost, setSavingCost] = useState(false);

  // 商品データをローカルにコピー
  useEffect(() => {
    if (product) {
      setLocalProduct({ ...product });
      setStockValue(String(product.physical_quantity || 0));
      setCostValue(String(product.cost_jpy || product.cost_price || 0));
    }
  }, [product]);

  // モーダルが閉じられた時に編集状態をリセット
  useEffect(() => {
    if (!isOpen) {
      setEditingStock(false);
      setEditingCost(false);
    }
  }, [isOpen]);

  if (!isOpen || !product || !localProduct) return null;

  // 在庫数の保存
  const handleSaveStock = async () => {
    if (!localProduct || !onStockChange) return;
    
    const newQuantity = parseInt(stockValue) || 0;
    if (newQuantity === localProduct.physical_quantity) {
      setEditingStock(false);
      return;
    }
    
    setSavingStock(true);
    try {
      await onStockChange(String(localProduct.id), newQuantity);
      setLocalProduct(prev => prev ? { 
        ...prev, 
        physical_quantity: newQuantity, 
        current_stock: newQuantity 
      } : null);
      setEditingStock(false);
    } finally {
      setSavingStock(false);
    }
  };

  // 原価の保存
  const handleSaveCost = async () => {
    if (!localProduct || !onCostChange) return;
    
    const newCost = parseInt(costValue) || 0;
    const currentCost = localProduct.cost_jpy || localProduct.cost_price || 0;
    if (newCost === currentCost) {
      setEditingCost(false);
      return;
    }
    
    setSavingCost(true);
    try {
      await onCostChange(String(localProduct.id), newCost);
      setLocalProduct(prev => prev ? { 
        ...prev, 
        cost_price: newCost,
        cost_jpy: newCost 
      } : null);
      setEditingCost(false);
    } finally {
      setSavingCost(false);
    }
  };

  // キー入力ハンドラ
  const handleKeyDown = (e: React.KeyboardEvent, type: 'stock' | 'cost') => {
    if (e.key === 'Enter') {
      if (type === 'stock') handleSaveStock();
      else handleSaveCost();
    } else if (e.key === 'Escape') {
      if (type === 'stock') {
        setStockValue(String(localProduct.physical_quantity || 0));
        setEditingStock(false);
      } else {
        setCostValue(String(localProduct.cost_jpy || localProduct.cost_price || 0));
        setEditingCost(false);
      }
    }
  };

  // 画像URL
  const imageUrl = localProduct.image_url || localProduct.images?.[0] || null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl"
        style={{ background: 'var(--panel)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--panel-border)' }}
        >
          <div className="flex items-center gap-3">
            <Package size={18} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              商品詳細
            </span>
            {localProduct.sku && (
              <span 
                className="px-2 py-0.5 rounded text-xs"
                style={{ background: 'var(--highlight)', color: 'var(--text-muted)' }}
              >
                {localProduct.sku}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[var(--highlight)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          <div className="p-4">
            {/* 上部: 画像 + 基本情報 */}
            <div className="flex gap-4 mb-4">
              {/* 画像 */}
              <div 
                className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0"
                style={{ background: 'var(--highlight)' }}
              >
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={localProduct.product_name || ''} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={32} style={{ color: 'var(--text-subtle)' }} />
                  </div>
                )}
              </div>

              {/* 基本情報 */}
              <div className="flex-1 min-w-0">
                <h3 
                  className="text-lg font-medium mb-2 line-clamp-2"
                  style={{ color: 'var(--text)' }}
                >
                  {localProduct.product_name || localProduct.title || '（商品名なし）'}
                </h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>SKU:</span>
                    <span className="ml-2" style={{ color: 'var(--text)' }}>
                      {localProduct.sku || '-'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>アカウント:</span>
                    <span 
                      className="ml-2 px-1.5 py-0.5 rounded text-xs"
                      style={{ 
                        background: localProduct.ebay_account?.toLowerCase() === 'mjt' 
                          ? 'rgba(59, 130, 246, 0.1)' 
                          : 'rgba(34, 197, 94, 0.1)',
                        color: localProduct.ebay_account?.toLowerCase() === 'mjt'
                          ? 'rgb(59, 130, 246)'
                          : 'rgb(34, 197, 94)',
                      }}
                    >
                      {localProduct.ebay_account || 'Manual'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>商品タイプ:</span>
                    <span className="ml-2" style={{ color: 'var(--text)' }}>
                      {localProduct.product_type === 'variation_parent' ? 'バリエーション親' :
                       localProduct.product_type === 'variation_member' ? 'バリエーション子' :
                       localProduct.product_type === 'set' ? 'セット商品' : '単品'}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>コンディション:</span>
                    <span className="ml-2" style={{ color: 'var(--text)' }}>
                      {localProduct.condition_name || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <N3Divider />

            {/* 在庫・価格セクション（編集可能） */}
            <div className="py-4">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                在庫・価格 <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>（クリックで編集）</span>
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {/* 在庫数（編集可能） */}
                <div 
                  className="p-3 rounded-lg cursor-pointer transition-all hover:ring-2 hover:ring-[var(--accent)]"
                  style={{ background: 'var(--highlight)' }}
                  onClick={() => !editingStock && setEditingStock(true)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Hash size={14} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>在庫数</span>
                    </div>
                    {editingStock && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveStock(); }}
                        disabled={savingStock}
                        className="p-1 rounded hover:bg-[var(--panel)]"
                        style={{ color: 'var(--color-success)' }}
                      >
                        {savingStock ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      </button>
                    )}
                  </div>
                  {editingStock ? (
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, 'stock')}
                      onBlur={handleSaveStock}
                      autoFocus
                      className="w-full px-2 py-1 rounded text-xl font-bold text-center"
                      style={{ 
                        background: 'var(--panel)', 
                        color: 'var(--text)',
                        border: '2px solid var(--accent)',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div 
                      className="text-2xl font-bold text-center"
                      style={{ 
                        color: (localProduct.physical_quantity || 0) > 0 
                          ? 'var(--color-success)' 
                          : 'var(--color-error)' 
                      }}
                    >
                      {localProduct.physical_quantity || 0}
                    </div>
                  )}
                </div>

                {/* 原価（編集可能） */}
                <div 
                  className="p-3 rounded-lg cursor-pointer transition-all hover:ring-2 hover:ring-[var(--accent)]"
                  style={{ background: 'var(--highlight)' }}
                  onClick={() => !editingCost && setEditingCost(true)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>原価（円）</span>
                    </div>
                    {editingCost && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSaveCost(); }}
                        disabled={savingCost}
                        className="p-1 rounded hover:bg-[var(--panel)]"
                        style={{ color: 'var(--color-success)' }}
                      >
                        {savingCost ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                      </button>
                    )}
                  </div>
                  {editingCost ? (
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-1" style={{ color: 'var(--text)' }}>¥</span>
                      <input
                        type="number"
                        value={costValue}
                        onChange={(e) => setCostValue(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, 'cost')}
                        onBlur={handleSaveCost}
                        autoFocus
                        className="w-full px-2 py-1 rounded text-xl font-bold text-right"
                        style={{ 
                          background: 'var(--panel)', 
                          color: 'var(--text)',
                          border: '2px solid var(--accent)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-center" style={{ color: 'var(--text)' }}>
                      ¥{(localProduct.cost_jpy || localProduct.cost_price || 0).toLocaleString()}
                    </div>
                  )}
                  {!editingCost && !(localProduct.cost_jpy || localProduct.cost_price) && (
                    <div className="text-xs text-center mt-1" style={{ color: 'var(--text-muted)' }}>
                      未登録
                    </div>
                  )}
                </div>

                {/* 販売価格（表示のみ） */}
                <div 
                  className="p-3 rounded-lg"
                  style={{ background: 'var(--highlight)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>販売価格</span>
                  </div>
                  <div className="text-2xl font-bold text-center" style={{ color: 'var(--accent)' }}>
                    ${(localProduct.selling_price || 0).toFixed(2)}
                  </div>
                </div>
              </div>
              
              {/* 利益表示（原価が登録されている場合） */}
              {(localProduct.cost_jpy || localProduct.cost_price) && localProduct.selling_price && (
                <div 
                  className="mt-3 p-2 rounded text-sm text-center"
                  style={{ background: 'rgba(34, 197, 94, 0.1)' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>推定利益: </span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    ${((localProduct.selling_price || 0) - ((localProduct.cost_jpy || localProduct.cost_price || 0) / 150)).toFixed(2)} USD
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}> / </span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                    ¥{((localProduct.selling_price || 0) * 150 - (localProduct.cost_jpy || localProduct.cost_price || 0)).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <N3Divider />

            {/* 詳細情報 */}
            <div className="py-4">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                詳細情報
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>カテゴリ</span>
                  <span style={{ color: 'var(--text)' }}>{localProduct.category || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>マーケットプレイス</span>
                  <span style={{ color: 'var(--text)' }}>{localProduct.marketplace || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>仕入れ日</span>
                  <span style={{ color: 'var(--text)' }}>
                    {localProduct.date_acquired 
                      ? new Date(localProduct.date_acquired).toLocaleDateString('ja-JP')
                      : '-'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>優先度スコア</span>
                  <span style={{ color: 'var(--text)' }}>{localProduct.priority_score || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>在庫タイプ</span>
                  <span style={{ color: 'var(--text)' }}>
                    {localProduct.inventory_type === 'stock' ? '有在庫' : 
                     localProduct.inventory_type === 'mu' ? '無在庫' : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>価格フェーズ</span>
                  <span style={{ color: 'var(--text)' }}>{localProduct.current_price_phase || '-'}</span>
                </div>
              </div>
            </div>

            {/* バリエーション情報（該当する場合） */}
            {(localProduct.is_variation_parent || localProduct.is_variation_member || localProduct.is_variation_child) && (
              <>
                <N3Divider />
                <div className="py-4">
                  <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                    バリエーション情報
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>親SKU</span>
                      <span style={{ color: 'var(--text)' }}>{localProduct.parent_sku || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>属性</span>
                      <span style={{ color: 'var(--text)' }}>
                        {localProduct.variation_attributes 
                          ? JSON.stringify(localProduct.variation_attributes)
                          : '-'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* セット商品情報（該当する場合） */}
            {localProduct.product_type === 'set' && (
              <>
                <N3Divider />
                <div className="py-4">
                  <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
                    セット構成
                  </h4>
                  
                  {/* セット販売可能数 */}
                  <div 
                    className="p-3 rounded-lg mb-3"
                    style={{ background: 'var(--highlight)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-muted)' }}>セット販売可能数</span>
                      <span 
                        className="text-xl font-bold"
                        style={{ 
                          color: (localProduct.set_available_quantity || 0) > 0 
                            ? 'var(--color-success)' 
                            : 'var(--color-error)' 
                        }}
                      >
                        {localProduct.set_available_quantity ?? '計算中...'}
                      </span>
                    </div>
                  </div>

                  {/* 構成品リスト */}
                  {localProduct.set_members && localProduct.set_members.length > 0 ? (
                    <div className="space-y-2">
                      {localProduct.set_members.map((member, index) => (
                        <div 
                          key={member.product_id || index}
                          className="flex items-center gap-3 p-2 rounded"
                          style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}
                        >
                          {/* 構成品画像 */}
                          <div 
                            className="w-10 h-10 rounded overflow-hidden flex-shrink-0"
                            style={{ background: 'var(--highlight)' }}
                          >
                            {member.image_url ? (
                              <img 
                                src={member.image_url} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} style={{ color: 'var(--text-subtle)' }} />
                              </div>
                            )}
                          </div>
                          
                          {/* 構成品情報 */}
                          <div className="flex-1 min-w-0">
                            <div 
                              className="text-sm truncate"
                              style={{ color: 'var(--text)' }}
                            >
                              {member.product_name || member.sku || `構成品 ${index + 1}`}
                            </div>
                            {member.sku && (
                              <div 
                                className="text-xs truncate"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {member.sku}
                              </div>
                            )}
                          </div>
                          
                          {/* 必要数量 */}
                          <div 
                            className="px-2 py-1 rounded text-sm font-mono"
                            style={{ background: 'var(--highlight)', color: 'var(--text)' }}
                          >
                            ×{member.quantity || 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="p-4 rounded text-center text-sm"
                      style={{ background: 'var(--highlight)', color: 'var(--text-muted)' }}
                    >
                      構成品が登録されていません
                    </div>
                  )}
                </div>
              </>
            )}

            {/* メモ */}
            {localProduct.notes && (
              <>
                <N3Divider />
                <div className="py-4">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    メモ
                  </h4>
                  <div 
                    className="p-3 rounded text-sm"
                    style={{ background: 'var(--highlight)', color: 'var(--text-muted)' }}
                  >
                    {localProduct.notes}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* フッター */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: 'var(--panel-border)', background: 'var(--highlight)' }}
        >
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            更新: {localProduct.updated_at 
              ? new Date(localProduct.updated_at).toLocaleString('ja-JP')
              : '-'
            }
          </div>
          <div className="flex gap-2">
            {localProduct.source_data?.listing_url && (
              <N3Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(localProduct.source_data?.listing_url, '_blank')}
              >
                <ExternalLink size={14} />
                出品ページ
              </N3Button>
            )}
            <N3Button
              size="sm"
              variant="secondary"
              onClick={onClose}
            >
              閉じる
            </N3Button>
          </div>
        </div>
      </div>
    </div>
  );
}
