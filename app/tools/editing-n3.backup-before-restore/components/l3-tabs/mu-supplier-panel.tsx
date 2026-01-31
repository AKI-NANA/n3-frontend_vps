// app/tools/editing-n3/components/index/mu-supplier-panel.tsx
/**
 * MUSupplierPanel - 無在庫(MU)商品の仕入れ先管理パネル
 * 
 * フェーズ2: 無在庫商品の仕入れ先管理UI
 * 
 * 表示項目:
 * - 商品名 / 商品ID
 * - 仕入れ元モール名 (Amazon, 楽天, Yahoo 等)
 * - 仕入れ元URL (リンクボタン)
 * - 最終在庫確認日時 (最終同期日)
 */

'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { 
  ExternalLink, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Store,
  Package,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { 
  SUPPLIER_MALL_LABELS, 
  type SupplierMall,
  type MUSupplierInfo,
} from '@/types/inventory-extended';

// ============================================================
// 型定義
// ============================================================

export interface MUProduct {
  id: string;
  product_name?: string;
  sku?: string;
  images?: string[];
  image_url?: string;
  mu_supplier_info?: MUSupplierInfo;
  supplier_info?: {
    url?: string;
    tracking_id?: string;
  };
  source_data?: {
    supplier_url?: string;
    supplier_mall?: string;
  };
}

export interface MUSupplierPanelProps {
  /** 無在庫商品リスト */
  products: MUProduct[];
  /** ローディング状態 */
  loading?: boolean;
  /** 仕入れ先情報更新時のコールバック */
  onSupplierInfoUpdate?: (productId: string, info: MUSupplierInfo) => Promise<void>;
  /** 在庫確認実行時のコールバック */
  onCheckStock?: (productId: string) => Promise<{ is_available: boolean; supplier_stock?: number }>;
  /** 一括在庫確認実行時のコールバック */
  onBulkCheckStock?: (productIds: string[]) => Promise<void>;
}

// ============================================================
// サブコンポーネント
// ============================================================

interface MUProductRowProps {
  product: MUProduct;
  onEdit: () => void;
  onCheckStock: () => void;
  checking: boolean;
}

const MUProductRow = memo(function MUProductRow({
  product,
  onEdit,
  onCheckStock,
  checking,
}: MUProductRowProps) {
  const supplierInfo = product.mu_supplier_info || {
    mall: (product.source_data?.supplier_mall as SupplierMall) || 'other',
    url: product.mu_supplier_info?.url || product.supplier_info?.url || product.source_data?.supplier_url || '',
    last_checked_at: undefined,
    is_available: undefined,
  };
  
  const imageUrl = product.image_url || (product.images && product.images[0]) || '';
  
  // 最終確認からの経過時間を計算
  const lastCheckedText = useMemo(() => {
    if (!supplierInfo.last_checked_at) return '未確認';
    
    const lastChecked = new Date(supplierInfo.last_checked_at);
    const now = new Date();
    const diffMs = now.getTime() - lastChecked.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}日前`;
    if (diffHours > 0) return `${diffHours}時間前`;
    return '直近';
  }, [supplierInfo.last_checked_at]);
  
  // 確認が古いかどうか（24時間以上）
  const isStale = useMemo(() => {
    if (!supplierInfo.last_checked_at) return true;
    const lastChecked = new Date(supplierInfo.last_checked_at);
    const now = new Date();
    const diffMs = now.getTime() - lastChecked.getTime();
    return diffMs > 24 * 60 * 60 * 1000;
  }, [supplierInfo.last_checked_at]);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '10px 12px',
      background: 'var(--panel)',
      borderRadius: 6,
      border: '1px solid var(--panel-border)',
      marginBottom: 6,
    }}>
      {/* 画像 */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 4,
        overflow: 'hidden',
        background: 'var(--highlight)',
        flexShrink: 0,
      }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.product_name || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}>
            <Package size={20} />
          </div>
        )}
      </div>
      
      {/* 商品情報 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--text)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginBottom: 2,
        }}>
          {product.product_name || product.sku || product.id}
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--text-muted)',
        }}>
          ID: {product.id}
        </div>
      </div>
      
      {/* 仕入れ元モール */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        background: 'var(--highlight)',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 500,
        color: 'var(--text)',
        minWidth: 80,
      }}>
        <Store size={12} />
        {SUPPLIER_MALL_LABELS[supplierInfo.mall] || '不明'}
      </div>
      
      {/* 仕入れ元URL */}
      <div style={{ width: 100 }}>
        {supplierInfo.url ? (
          <a
            href={supplierInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              color: '#3b82f6',
              textDecoration: 'none',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <ExternalLink size={10} />
            仕入れ元
          </a>
        ) : (
          <span style={{
            fontSize: 10,
            color: 'var(--text-muted)',
          }}>
            URL未設定
          </span>
        )}
      </div>
      
      {/* 最終確認日時 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        background: isStale ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 500,
        color: isStale ? '#f59e0b' : '#22c55e',
        minWidth: 70,
      }}>
        <Clock size={10} />
        {lastCheckedText}
      </div>
      
      {/* 在庫状態 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 600,
        minWidth: 60,
        ...(supplierInfo.is_available === undefined
          ? { background: 'var(--highlight)', color: 'var(--text-muted)' }
          : supplierInfo.is_available
          ? { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }
          : { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }),
      }}>
        {supplierInfo.is_available === undefined ? (
          <>? 未確認</>
        ) : supplierInfo.is_available ? (
          <><CheckCircle size={10} /> 在庫あり</>
        ) : (
          <><AlertTriangle size={10} /> 在庫なし</>
        )}
      </div>
      
      {/* アクション */}
      <div style={{ display: 'flex', gap: 4 }}>
        <button
          onClick={onCheckStock}
          disabled={checking || !supplierInfo.url}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            background: 'var(--panel)',
            cursor: checking || !supplierInfo.url ? 'not-allowed' : 'pointer',
            opacity: checking || !supplierInfo.url ? 0.5 : 1,
            color: 'var(--text)',
          }}
          title="在庫確認"
        >
          <RefreshCw size={12} className={checking ? 'animate-spin' : ''} />
        </button>
        <button
          onClick={onEdit}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            background: 'var(--panel)',
            cursor: 'pointer',
            color: 'var(--text)',
          }}
          title="編集"
        >
          <Edit2 size={12} />
        </button>
      </div>
    </div>
  );
});

// 編集モーダル
interface EditSupplierModalProps {
  product: MUProduct;
  onClose: () => void;
  onSave: (info: MUSupplierInfo) => void;
  saving: boolean;
}

const EditSupplierModal = memo(function EditSupplierModal({
  product,
  onClose,
  onSave,
  saving,
}: EditSupplierModalProps) {
  const currentInfo = product.mu_supplier_info || {
    mall: 'other' as SupplierMall,
    url: product.supplier_info?.url || product.source_data?.supplier_url || '',
  };
  
  const [mall, setMall] = useState<SupplierMall>(currentInfo.mall);
  const [url, setUrl] = useState(currentInfo.url);
  const [notes, setNotes] = useState(currentInfo.notes || '');
  
  const handleSave = () => {
    onSave({
      mall,
      url,
      notes: notes || undefined,
      last_checked_at: currentInfo.last_checked_at,
      is_available: currentInfo.is_available,
      supplier_price: currentInfo.supplier_price,
      supplier_stock: currentInfo.supplier_stock,
    });
  };
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{
        background: 'var(--panel)',
        borderRadius: 8,
        padding: 20,
        width: 400,
        maxWidth: '90vw',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
            仕入れ先情報を編集
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
            }}
          >
            <X size={16} />
          </button>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
            仕入れ元モール
          </label>
          <select
            value={mall}
            onChange={(e) => setMall(e.target.value as SupplierMall)}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 12,
            }}
          >
            {(Object.keys(SUPPLIER_MALL_LABELS) as SupplierMall[]).map(key => (
              <option key={key} value={key}>
                {SUPPLIER_MALL_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
            仕入れ元URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 12,
            }}
          />
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>
            メモ
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="仕入れに関するメモ..."
            rows={3}
            style={{
              width: '100%',
              padding: '8px 10px',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--bg)',
              color: 'var(--text)',
              fontSize: 12,
              resize: 'vertical',
            }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: '8px 16px',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 16px',
              border: 'none',
              borderRadius: 4,
              background: '#3b82f6',
              color: 'white',
              fontSize: 12,
              fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            <Save size={12} />
            保存
          </button>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const MUSupplierPanel = memo(function MUSupplierPanel({
  products,
  loading,
  onSupplierInfoUpdate,
  onCheckStock,
  onBulkCheckStock,
}: MUSupplierPanelProps) {
  const [editingProduct, setEditingProduct] = useState<MUProduct | null>(null);
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set());
  const [savingEdit, setSavingEdit] = useState(false);
  const [bulkChecking, setBulkChecking] = useState(false);
  
  // 仕入れ先情報を更新
  const handleSaveSupplierInfo = useCallback(async (info: MUSupplierInfo) => {
    if (!editingProduct || !onSupplierInfoUpdate) return;
    
    setSavingEdit(true);
    try {
      await onSupplierInfoUpdate(editingProduct.id, info);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to update supplier info:', error);
    } finally {
      setSavingEdit(false);
    }
  }, [editingProduct, onSupplierInfoUpdate]);
  
  // 単一商品の在庫確認
  const handleCheckStock = useCallback(async (productId: string) => {
    if (!onCheckStock) return;
    
    setCheckingIds(prev => new Set(prev).add(productId));
    try {
      await onCheckStock(productId);
    } catch (error) {
      console.error('Failed to check stock:', error);
    } finally {
      setCheckingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [onCheckStock]);
  
  // 一括在庫確認
  const handleBulkCheckStock = useCallback(async () => {
    if (!onBulkCheckStock || products.length === 0) return;
    
    setBulkChecking(true);
    try {
      await onBulkCheckStock(products.map(p => p.id));
    } catch (error) {
      console.error('Failed to bulk check stock:', error);
    } finally {
      setBulkChecking(false);
    }
  }, [onBulkCheckStock, products]);
  
  // 統計
  const stats = useMemo(() => {
    let availableCount = 0;
    let unavailableCount = 0;
    let uncheckedCount = 0;
    let staleCount = 0;
    
    const now = new Date();
    
    products.forEach(p => {
      const info = p.mu_supplier_info;
      if (!info || info.is_available === undefined) {
        uncheckedCount++;
      } else if (info.is_available) {
        availableCount++;
      } else {
        unavailableCount++;
      }
      
      if (info?.last_checked_at) {
        const lastChecked = new Date(info.last_checked_at);
        if (now.getTime() - lastChecked.getTime() > 24 * 60 * 60 * 1000) {
          staleCount++;
        }
      } else {
        staleCount++;
      }
    });
    
    return { availableCount, unavailableCount, uncheckedCount, staleCount };
  }, [products]);
  
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        読み込み中...
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
        無在庫(MU)商品がありません
      </div>
    );
  }
  
  return (
    <div style={{ padding: 12 }}>
      {/* ヘッダー */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        padding: '10px 12px',
        background: 'var(--highlight)',
        borderRadius: 6,
      }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text)',
          }}>
            🌐 無在庫(MU)管理: {products.length}件
          </div>
          
          <div style={{
            display: 'flex',
            gap: 8,
          }}>
            <span style={{
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
            }}>
              在庫あり: {stats.availableCount}
            </span>
            <span style={{
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
            }}>
              在庫なし: {stats.unavailableCount}
            </span>
            <span style={{
              padding: '2px 6px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 500,
              background: 'rgba(107, 114, 128, 0.1)',
              color: '#6b7280',
            }}>
              未確認: {stats.uncheckedCount}
            </span>
            {stats.staleCount > 0 && (
              <span style={{
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 500,
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#f59e0b',
              }}>
                要更新: {stats.staleCount}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={handleBulkCheckStock}
          disabled={bulkChecking || !onBulkCheckStock}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 12px',
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            background: 'var(--panel)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--text)',
            cursor: bulkChecking || !onBulkCheckStock ? 'not-allowed' : 'pointer',
            opacity: bulkChecking || !onBulkCheckStock ? 0.6 : 1,
          }}
        >
          <RefreshCw size={12} className={bulkChecking ? 'animate-spin' : ''} />
          一括確認
        </button>
      </div>
      
      {/* 商品リスト */}
      <div>
        {products.map(product => (
          <MUProductRow
            key={product.id}
            product={product}
            onEdit={() => setEditingProduct(product)}
            onCheckStock={() => handleCheckStock(product.id)}
            checking={checkingIds.has(product.id)}
          />
        ))}
      </div>
      
      {/* 編集モーダル */}
      {editingProduct && (
        <EditSupplierModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveSupplierInfo}
          saving={savingEdit}
        />
      )}
    </div>
  );
});

export default MUSupplierPanel;
