// components/n3/n3-inventory-card.tsx
/**
 * 棚卸しタブ専用カードコンポーネント
 * 
 * 表示内容:
 * - 商品名、SKU、画像
 * - 在庫数（編集可能）
 * - 原価（円）
 * - eBayアカウント（MJT/GREEN/手動）
 * - マーケットプレイス
 * - 保有日数
 * - 商品タイプ（単品/バリエーション/セット）
 * - 保管場所（棚卸し用）
 * - 最終棚卸し日時
 * - 要確認フラグ（赤枠表示）
 * - 確定フラグ（グレーアウト + ✓）
 * - メモ
 */

'use client';

import React, { memo, useState, useRef } from 'react';
import { 
  Check, Package, GitBranch, Layers, Edit3, Minus, Plus, ExternalLink, 
  Archive, ShoppingCart, MapPin, Camera, Clock, X, AlertTriangle, CheckCircle, MessageSquare
} from 'lucide-react';

export interface N3InventoryCardProps {
  /** 商品ID */
  id: string;
  /** タイトル */
  title: string;
  /** SKU */
  sku?: string;
  /** 画像URL */
  imageUrl?: string;
  /** 在庫数 */
  stockQuantity: number;
  /** 原価（円） */
  costJpy?: number;
  /** eBayアカウント */
  ebayAccount?: string;
  /** マーケットプレイス */
  marketplace?: string;
  /** 保有日数 */
  daysHeld?: number;
  /** 商品タイプ: single, variation_parent, variation_child, set */
  productType?: string;
  /** バリエーション親 */
  isVariationParent?: boolean;
  /** バリエーション子 */
  isVariationMember?: boolean;
  /** 在庫ステータス */
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  /** 選択状態 */
  selected?: boolean;
  /** カテゴリー */
  category?: string;
  /** 在庫タイプ: stock(有在庫) / mu(無在庫) */
  inventoryType?: 'stock' | 'mu';
  /** セット販売可能数（構成品から計算） */
  setAvailableQuantity?: number | null;
  
  // 棚卸し用プロパティ
  /** 保管場所 */
  storageLocation?: string;
  /** 最終棚卸し日時 */
  lastCountedAt?: string;
  /** 棚卸し実施者 */
  countedBy?: string;
  /** 棚卸し写真 */
  inventoryImages?: string[];
  /** 棚卸しモード */
  stocktakeMode?: boolean;
  
  // 新規: フラグ・メモ
  /** 要確認フラグ */
  needsCountCheck?: boolean;
  /** 確定フラグ */
  stockConfirmed?: boolean;
  /** メモ */
  stockMemo?: string;
  
  /** 選択時のハンドラ */
  onSelect?: (id: string) => void;
  /** 詳細クリック */
  onDetail?: (id: string) => void;
  /** 在庫変更時のハンドラ */
  onStockChange?: (id: string, newQuantity: number) => void;
  /** 原価変更時のハンドラ */
  onCostChange?: (id: string, newCost: number) => void;
  /** 在庫タイプ変更時のハンドラ */
  onInventoryTypeChange?: (id: string, newType: 'stock' | 'mu') => void;
  /** 在庫タイプトグル表示フラグ（表示するタブでのみtrue） */
  showInventoryTypeToggle?: boolean;
  
  // 棚卸し用ハンドラ
  /** 保管場所変更ハンドラ */
  onStorageLocationChange?: (id: string, location: string) => void;
  /** 棚卸し写真アップロードハンドラ */
  onInventoryImageUpload?: (id: string, file: File) => Promise<string | null>;
  /** 棚卸し完了ハンドラ */
  onStocktakeComplete?: (id: string, data: { quantity: number; location: string; images: string[] }) => void;
  
  // 新規: フラグ・メモ変更ハンドラ
  /** 要確認フラグ変更ハンドラ */
  onNeedsCheckChange?: (id: string, value: boolean) => void;
  /** 確定フラグ変更ハンドラ */
  onConfirmedChange?: (id: string, value: boolean) => void;
  /** メモ変更ハンドラ */
  onMemoChange?: (id: string, memo: string) => void;
  /** フラグコントロール表示フラグ */
  showFlagControls?: boolean;
}

// 商品タイプのアイコンと色
const getProductTypeDisplay = (productType?: string, isVariationParent?: boolean, isVariationMember?: boolean) => {
  if (productType === 'set') {
    return { icon: <Layers size={10} />, label: 'セット', color: '#8b5cf6' };
  }
  if (isVariationParent) {
    return { icon: <GitBranch size={10} />, label: '親', color: '#f97316' };
  }
  if (isVariationMember) {
    return { icon: <GitBranch size={10} />, label: '子', color: '#60a5fa' };
  }
  return { icon: <Package size={10} />, label: '単品', color: '#6b7280' };
};

// 在庫ステータスの色
const getStockStatusColor = (status?: string, quantity?: number): string => {
  if (quantity === 0 || status === 'out_of_stock') return '#ef4444';
  if ((quantity && quantity <= 3) || status === 'low_stock') return '#f59e0b';
  return '#22c55e';
};

// 保有日数の警告レベル
const getDaysHeldColor = (days?: number): string => {
  if (!days) return '#6b7280';
  if (days > 180) return '#ef4444';
  if (days > 90) return '#f59e0b';
  return '#22c55e';
};

// eBayアカウントの色
const getAccountColor = (account?: string): string => {
  if (!account) return '#6b7280';
  const lower = account.toLowerCase();
  if (lower === 'mjt') return '#3b82f6';
  if (lower === 'green') return '#22c55e';
  return '#6b7280';
};

// 棚卸し日時のフォーマット
const formatCountedDate = (dateStr?: string): string => {
  if (!dateStr) return '未実施';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '本日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
};

export const N3InventoryCard = memo(function N3InventoryCard(props: N3InventoryCardProps) {
  const {
    id,
    title,
    sku,
    imageUrl,
    stockQuantity,
    costJpy,
    ebayAccount,
    marketplace,
    daysHeld,
    productType,
    isVariationParent,
    isVariationMember,
    stockStatus,
    category,
    inventoryType,
    setAvailableQuantity,
    selected = false,
    // 棚卸し
    storageLocation,
    lastCountedAt,
    countedBy,
    inventoryImages,
    stocktakeMode = false,
    // フラグ・メモ
    needsCountCheck = false,
    stockConfirmed = false,
    stockMemo = '',
    // ハンドラ
    onSelect,
    onDetail,
    onStockChange,
    onCostChange,
    onInventoryTypeChange,
    showInventoryTypeToggle = false,
    onStorageLocationChange,
    onInventoryImageUpload,
    onStocktakeComplete,
    // フラグ・メモハンドラ
    onNeedsCheckChange,
    onConfirmedChange,
    onMemoChange,
    showFlagControls = false,
  } = props;

  const [isEditingStock, setIsEditingStock] = useState(false);
  const [localStock, setLocalStock] = useState(stockQuantity);
  const [isEditingCost, setIsEditingCost] = useState(false);
  const [localCost, setLocalCost] = useState(costJpy || 0);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [localLocation, setLocalLocation] = useState(storageLocation || '');
  const [localImages, setLocalImages] = useState<string[]>(inventoryImages || []);
  const [uploading, setUploading] = useState(false);
  const [showMemoPopup, setShowMemoPopup] = useState(false);
  const [editingMemo, setEditingMemo] = useState(stockMemo);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const typeDisplay = getProductTypeDisplay(productType, isVariationParent, isVariationMember);
  const stockColor = getStockStatusColor(stockStatus, stockQuantity);
  const daysColor = getDaysHeldColor(daysHeld);
  const accountColor = getAccountColor(ebayAccount);

  // ボーダースタイル決定
  const getBorderStyle = () => {
    if (needsCountCheck) {
      return '3px solid #ef4444'; // 赤枠（要確認）
    }
    if (stockConfirmed) {
      return '2px solid #22c55e'; // 緑枠（確定）
    }
    if (selected) {
      return '2px solid var(--accent)';
    }
    return '1px solid var(--panel-border)';
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDetail) {
      onDetail(id);
    }
  };

  const handleStockIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = localStock + 1;
    setLocalStock(newValue);
    onStockChange?.(id, newValue);
  };

  const handleStockDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (localStock > 0) {
      const newValue = localStock - 1;
      setLocalStock(newValue);
      onStockChange?.(id, newValue);
    }
  };

  const handleInventoryTypeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newType = inventoryType === 'stock' ? 'mu' : 'stock';
    onInventoryTypeChange?.(id, newType);
  };

  const handleCostSubmit = () => {
    setIsEditingCost(false);
    if (localCost !== (costJpy || 0)) {
      onCostChange?.(id, localCost);
    }
  };

  const handleCostKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCostSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingCost(false);
      setLocalCost(costJpy || 0);
    }
  };

  // 保管場所の編集
  const handleLocationSubmit = () => {
    setIsEditingLocation(false);
    if (localLocation !== (storageLocation || '')) {
      onStorageLocationChange?.(id, localLocation);
    }
  };

  const handleLocationKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLocationSubmit();
    } else if (e.key === 'Escape') {
      setIsEditingLocation(false);
      setLocalLocation(storageLocation || '');
    }
  };

  // 画像アップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onInventoryImageUpload) return;
    
    setUploading(true);
    try {
      const url = await onInventoryImageUpload(id, file);
      if (url) {
        setLocalImages(prev => [...prev, url]);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 画像削除
  const handleImageRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalImages(prev => prev.filter((_, i) => i !== index));
  };

  // 棚卸し完了
  const handleStocktakeComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStocktakeComplete?.(id, {
      quantity: localStock,
      location: localLocation,
      images: localImages,
    });
  };

  // フラグトグル
  const handleNeedsCheckToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNeedsCheckChange?.(id, !needsCountCheck);
  };

  const handleConfirmedToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onConfirmedChange?.(id, !stockConfirmed);
  };

  // メモ保存
  const handleMemoSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMemoChange?.(id, editingMemo);
    setShowMemoPopup(false);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        background: stockConfirmed ? 'rgba(34, 197, 94, 0.05)' : (selected ? 'var(--highlight)' : 'var(--panel)'),
        border: getBorderStyle(),
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        fontSize: '10px',
        position: 'relative',
        opacity: stockConfirmed ? 0.85 : 1,
      }}
      className="hover:shadow-md hover:border-[var(--text-muted)]"
    >
      {/* 確定オーバーレイ */}
      {stockConfirmed && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          pointerEvents: 'none',
        }}>
          <CheckCircle size={48} style={{ color: '#22c55e', opacity: 0.3 }} />
        </div>
      )}

      {/* 画像エリア */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingBottom: '75%',
          background: 'var(--highlight)',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              contentVisibility: 'auto',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              color: 'var(--text-muted)',
              fontSize: '10px',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(245, 158, 11, 0.05) 100%)',
            }}
          >
            <Camera size={24} style={{ opacity: 0.4 }} />
            <span>画像なし</span>
            {onInventoryImageUpload && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
                style={{
                  padding: '6px 12px',
                  fontSize: '10px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                className="hover:opacity-90"
              >
                <Camera size={12} />
                {uploading ? '...' : '画像を追加'}
              </button>
            )}
          </div>
        )}

        {/* 左上: 要確認バッジ */}
        {needsCountCheck && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '3px 6px',
              borderRadius: '3px',
              background: '#ef4444',
              color: 'white',
              fontSize: '9px',
              fontWeight: 700,
              zIndex: 10,
              animation: 'pulse 2s infinite',
            }}
          >
            <AlertTriangle size={10} />
            要確認
          </div>
        )}

        {/* 左上: 確定バッジ（要確認でない場合） */}
        {!needsCountCheck && stockConfirmed && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '3px 6px',
              borderRadius: '3px',
              background: '#22c55e',
              color: 'white',
              fontSize: '9px',
              fontWeight: 700,
              zIndex: 10,
            }}
          >
            <CheckCircle size={10} />
            確定
          </div>
        )}

        {/* 左上: 商品タイプバッジ（フラグがない場合） */}
        {!needsCountCheck && !stockConfirmed && (
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '2px 4px',
              borderRadius: '2px',
              background: 'rgba(0,0,0,0.75)',
              color: typeDisplay.color,
              fontSize: '9px',
              fontWeight: 600,
            }}
          >
            {typeDisplay.icon}
            <span>{typeDisplay.label}</span>
          </div>
        )}

        {/* 右上: 在庫数バッジ */}
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            padding: '2px 6px',
            borderRadius: '2px',
            fontSize: '10px',
            fontWeight: 700,
            fontFamily: 'var(--font-mono, monospace)',
            background: 'rgba(0,0,0,0.75)',
            color: stockColor,
          }}
        >
          {productType === 'set' && setAvailableQuantity !== undefined && setAvailableQuantity !== null ? (
            <span title={`構成品在庫: ${stockQuantity} / セット販売可能: ${setAvailableQuantity}`}>
              セット: {setAvailableQuantity}
            </span>
          ) : (
            <span>在庫: {stockQuantity}</span>
          )}
        </div>

        {/* 左下: eBayアカウント */}
        {ebayAccount && (
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              padding: '2px 4px',
              borderRadius: '2px',
              fontSize: '8px',
              fontWeight: 600,
              background: accountColor,
              color: 'white',
            }}
          >
            {ebayAccount.toUpperCase()}
          </div>
        )}

        {/* 右下: メモアイコン */}
        {stockMemo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMemoPopup(!showMemoPopup);
            }}
            style={{
              position: 'absolute',
              bottom: '4px',
              right: selected ? '24px' : '4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#f59e0b',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 6,
            }}
            title={stockMemo}
          >
            <MessageSquare size={10} />
          </button>
        )}

        {/* 選択チェック */}
        {selected && (
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '2px',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check size={10} color="white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* メモポップアップ */}
      {showMemoPopup && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: '#fffbeb',
            border: '1px solid #f59e0b',
            borderRadius: '4px',
            padding: '8px',
            fontSize: '10px',
            color: '#92400e',
            zIndex: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginTop: '4px',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageSquare size={12} /> メモ
          </div>
          {onMemoChange ? (
            <>
              <textarea
                value={editingMemo}
                onChange={(e) => setEditingMemo(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '50px',
                  padding: '4px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '10px',
                  resize: 'vertical',
                }}
              />
              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                <button
                  onClick={handleMemoSave}
                  style={{
                    flex: 1,
                    padding: '4px',
                    background: '#22c55e',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  保存
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMemoPopup(false);
                    setEditingMemo(stockMemo);
                  }}
                  style={{
                    flex: 1,
                    padding: '4px',
                    background: '#6b7280',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  キャンセル
                </button>
              </div>
            </>
          ) : (
            <div>{stockMemo}</div>
          )}
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ padding: '6px' }}>
        {/* タイトル */}
        <div
          style={{
            fontSize: '10px',
            fontWeight: 500,
            color: 'var(--text)',
            marginBottom: '2px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={title}
        >
          {title}
        </div>

        {/* SKU */}
        {sku && (
          <div
            style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono, monospace)',
              color: 'var(--text-muted)',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {sku}
          </div>
        )}

        {/* 情報グリッド */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px 6px',
            fontSize: '9px',
            marginBottom: '4px',
          }}
        >
          {/* 保管場所 */}
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <MapPin size={9} /> 場所:
          </span>
          {onStorageLocationChange ? (
            <select
              value={localLocation || 'env'}
              onChange={(e) => {
                e.stopPropagation();
                const newLocation = e.target.value;
                setLocalLocation(newLocation);
                onStorageLocationChange(id, newLocation);
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                padding: '1px 2px',
                fontSize: '9px',
                border: '1px solid var(--panel-border)',
                borderRadius: '2px',
                background: 'var(--panel)',
                color: localLocation === 'plus1' ? '#22c55e' : 'var(--text)',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="env">env</option>
              <option value="plus1">plus1</option>
              <option value="yao">八尾</option>
              <option value="warehouse_a">倉庫A</option>
              <option value="warehouse_b">倉庫B</option>
              <option value="other">その他</option>
            </select>
          ) : (
            <span
              style={{
                textAlign: 'right',
                fontWeight: 600,
                color: localLocation === 'plus1' ? '#22c55e' : 'var(--text)',
                padding: '1px 4px',
                borderRadius: '2px',
              }}
            >
              {localLocation || 'env'}
            </span>
          )}

          {/* 原価 */}
          <span style={{ color: 'var(--text-muted)' }}>原価:</span>
          {isEditingCost ? (
            <input
              type="number"
              value={localCost}
              onChange={(e) => setLocalCost(parseInt(e.target.value) || 0)}
              onBlur={handleCostSubmit}
              onKeyDown={handleCostKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus
              style={{
                width: '100%',
                padding: '1px 4px',
                fontSize: '9px',
                textAlign: 'right',
                border: '1px solid var(--accent)',
                borderRadius: '2px',
                background: 'var(--panel)',
                color: 'var(--text)',
                fontFamily: 'var(--font-mono, monospace)',
              }}
            />
          ) : (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onCostChange) {
                  setIsEditingCost(true);
                }
              }}
              style={{
                textAlign: 'right',
                fontWeight: 600,
                fontFamily: 'var(--font-mono, monospace)',
                color: costJpy ? 'var(--text)' : '#6b7280',
                cursor: onCostChange ? 'pointer' : 'default',
                padding: '1px 2px',
                borderRadius: '2px',
                transition: 'background 0.15s',
              }}
              className={onCostChange ? 'hover:bg-[var(--highlight)]' : ''}
              title={onCostChange ? 'クリックして編集' : undefined}
            >
              {costJpy ? `¥${costJpy.toLocaleString()}` : '-'}
            </span>
          )}

          {/* 保有日数 */}
          <span style={{ color: 'var(--text-muted)' }}>保有:</span>
          <span
            style={{
              textAlign: 'right',
              fontWeight: 500,
              color: daysColor,
            }}
          >
            {daysHeld !== undefined ? `${daysHeld}日` : '-'}
          </span>

          {/* カテゴリー */}
          <span style={{ color: 'var(--text-muted)' }}>Cat:</span>
          <span
            style={{
              textAlign: 'right',
              color: category ? 'var(--text)' : '#6b7280',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            title={category}
          >
            {category ? (category.length > 8 ? category.slice(0, 8) + '…' : category) : '-'}
          </span>
        </div>

        {/* 画像アップロード用hidden input */}
        {onInventoryImageUpload && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            onClick={(e) => e.stopPropagation()}
            style={{ display: 'none' }}
          />
        )}

        {/* フラグコントロール（showFlagControlsがtrueの場合） */}
        {showFlagControls && (
          <div
            style={{
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid var(--panel-border)',
              display: 'flex',
              gap: '4px',
            }}
          >
            {/* 要確認トグル */}
            {onNeedsCheckChange && (
              <button
                onClick={handleNeedsCheckToggle}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  padding: '4px',
                  fontSize: '8px',
                  fontWeight: 600,
                  background: needsCountCheck ? '#fef2f2' : 'var(--panel-border)',
                  border: needsCountCheck ? '1px solid #ef4444' : '1px solid transparent',
                  borderRadius: '3px',
                  color: needsCountCheck ? '#dc2626' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title={needsCountCheck ? '要確認を解除' : '要確認に設定'}
              >
                <AlertTriangle size={10} />
                要確認
              </button>
            )}

            {/* 確定トグル */}
            {onConfirmedChange && (
              <button
                onClick={handleConfirmedToggle}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  padding: '4px',
                  fontSize: '8px',
                  fontWeight: 600,
                  background: stockConfirmed ? '#dcfce7' : 'var(--panel-border)',
                  border: stockConfirmed ? '1px solid #22c55e' : '1px solid transparent',
                  borderRadius: '3px',
                  color: stockConfirmed ? '#16a34a' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title={stockConfirmed ? '確定を解除' : '確定に設定'}
              >
                <CheckCircle size={10} />
                確定
              </button>
            )}

            {/* メモボタン */}
            {onMemoChange && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMemoPopup(!showMemoPopup);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px 6px',
                  fontSize: '8px',
                  fontWeight: 600,
                  background: stockMemo ? '#fef3c7' : 'var(--panel-border)',
                  border: stockMemo ? '1px solid #f59e0b' : '1px solid transparent',
                  borderRadius: '3px',
                  color: stockMemo ? '#b45309' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                title="メモを編集"
              >
                <MessageSquare size={10} />
              </button>
            )}
          </div>
        )}

        {/* 在庫編集 + 詳細ボタン */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '4px',
            borderTop: showFlagControls ? 'none' : '1px solid var(--panel-border)',
            marginTop: showFlagControls ? '0' : '4px',
          }}
        >
          {/* 在庫編集コントロール */}
          {onStockChange ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleStockDecrement}
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--panel-border)',
                  border: 'none',
                  borderRadius: '2px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                <Minus size={12} />
              </button>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: stockColor,
                  minWidth: '20px',
                  textAlign: 'center',
                }}
              >
                {localStock}
              </span>
              <button
                onClick={handleStockIncrement}
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--panel-border)',
                  border: 'none',
                  borderRadius: '2px',
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                <Plus size={12} />
              </button>
            </div>
          ) : (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'var(--font-mono, monospace)',
                color: stockColor,
              }}
            >
              {stockQuantity}個
            </span>
          )}

          {/* 詳細ボタン */}
          {onDetail && (
            <button
              onClick={handleDetailClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 6px',
                fontSize: '9px',
                background: 'var(--panel-border)',
                border: 'none',
                borderRadius: '2px',
                color: 'var(--text)',
                cursor: 'pointer',
              }}
              className="hover:opacity-80"
            >
              <ExternalLink size={10} />
              詳細
            </button>
          )}
        </div>

        {/* 在庫タイプトグルボタン */}
        {showInventoryTypeToggle && onInventoryTypeChange && (
          <div
            style={{
              marginTop: '4px',
              paddingTop: '4px',
              borderTop: '1px solid var(--panel-border)',
            }}
          >
            <button
              onClick={handleInventoryTypeToggle}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '4px 8px',
                fontSize: '9px',
                fontWeight: 600,
                background: inventoryType === 'stock'
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                border: `1px solid ${inventoryType === 'stock' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                borderRadius: '4px',
                color: inventoryType === 'stock' ? 'rgb(34, 197, 94)' : 'rgb(59, 130, 246)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              className="hover:opacity-80"
              title={inventoryType === 'stock' ? '無在庫に切り替え' : '有在庫に切り替え'}
            >
              {inventoryType === 'stock' ? (
                <>
                  <Archive size={10} />
                  <span>有在庫</span>
                  <span style={{ fontSize: '8px', opacity: 0.7 }}>→ 切替</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={10} />
                  <span>無在庫</span>
                  <span style={{ fontSize: '8px', opacity: 0.7 }}>→ 切替</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* パルスアニメーション */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
});

export default N3InventoryCard;
