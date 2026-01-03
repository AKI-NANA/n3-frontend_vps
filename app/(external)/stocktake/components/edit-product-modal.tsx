// app/(external)/stocktake/components/edit-product-modal.tsx
/**
 * 商品編集モーダル（外注用）
 * 
 * 編集項目:
 * - 商品名
 * - 在庫数
 * - 保管場所
 * - 画像追加
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Save, Plus } from 'lucide-react';
import type { StocktakeProduct } from '../hooks/use-stocktake';
import { STORAGE_LOCATIONS } from '../hooks/use-stocktake';

interface EditProductModalProps {
  isOpen: boolean;
  product: StocktakeProduct | null;
  onClose: () => void;
  onSubmit: (id: string, data: {
    product_name?: string;
    physical_quantity?: number;
    storage_location?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onAddImage: (id: string, imageUrl: string) => Promise<{ success: boolean; error?: string }>;
  onUploadImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

export function EditProductModal({
  isOpen,
  product,
  onClose,
  onSubmit,
  onAddImage,
  onUploadImage,
}: EditProductModalProps) {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [storageLocation, setStorageLocation] = useState('plus1');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setProductName(product.product_name || '');
      setQuantity(product.physical_quantity || 1);
      setStorageLocation(product.storage_location || 'plus1');
      setImages(product.images || []);
      setError(null);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleImageAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadResult = await onUploadImage(file);
      
      if (uploadResult.success && uploadResult.url) {
        // DBに保存
        const addResult = await onAddImage(product.id, uploadResult.url);
        if (addResult.success) {
          setImages(prev => [...prev, uploadResult.url!]);
        } else {
          setError(addResult.error || '画像の保存に失敗しました');
          break;
        }
      } else {
        setError(uploadResult.error || '画像アップロードに失敗しました');
        break;
      }
    }

    setUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!productName.trim()) {
      setError('商品名を入力してください');
      return;
    }

    setSaving(true);
    setError(null);

    const result = await onSubmit(product.id, {
      product_name: productName.trim(),
      physical_quantity: quantity,
      storage_location: storageLocation,
    });

    setSaving(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || '更新に失敗しました');
    }
  };

  const handleClose = () => {
    if (!saving && !uploading) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        padding: '16px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <span style={{ fontWeight: 600, color: '#1f2937' }}>商品を編集</span>
          <button
            onClick={handleClose}
            disabled={saving || uploading}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div
              style={{
                padding: '12px',
                marginBottom: '16px',
                borderRadius: '8px',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '13px',
              }}
            >
              {error}
            </div>
          )}

          {/* SKU（読み取り専用） */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              SKU
            </label>
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#f3f4f6',
                fontSize: '13px',
                fontFamily: 'monospace',
                color: '#6b7280',
              }}
            >
              {product.sku}
            </div>
          </div>

          {/* 画像 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              📷 商品画像
              <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '8px' }}>
                ({images.length}枚)
              </span>
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleImageAdd}
              style={{ display: 'none' }}
            />

            {/* 既存画像 */}
            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {images.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: index === 0 ? '2px solid #22c55e' : '1px solid #e5e7eb',
                    }}
                  >
                    <img
                      src={url}
                      alt={`画像 ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 追加ボタン */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px dashed #22c55e',
                background: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: '#22c55e',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              {uploading ? (
                <>
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #d1d5db',
                      borderTopColor: '#22c55e',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  アップロード中...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  画像を追加
                </>
              )}
            </button>
          </div>

          {/* 商品名 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              商品名 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="商品名を入力"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 在庫数 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              📦 在庫数
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <button
                onClick={() => quantity > 0 && setQuantity(quantity - 1)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '2px solid #d1d5db',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#374151',
                }}
              >
                −
              </button>
              <span
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                  color: quantity > 0 ? '#22c55e' : '#ef4444',
                  minWidth: '60px',
                  textAlign: 'center',
                }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  border: '2px solid #d1d5db',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#374151',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* 保管場所 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              📍 保管場所
            </label>
            <select
              value={storageLocation}
              onChange={(e) => setStorageLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {STORAGE_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            background: '#f9fafb',
            flexShrink: 0,
          }}
        >
          <button
            onClick={handleClose}
            disabled={saving || uploading}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: 'white',
              fontSize: '15px',
              fontWeight: 500,
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading || !productName.trim()}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: (saving || uploading || !productName.trim()) ? '#9ca3af' : '#3b82f6',
              fontSize: '15px',
              fontWeight: 600,
              cursor: (saving || uploading || !productName.trim()) ? 'not-allowed' : 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {saving ? '保存中...' : (
              <>
                <Save size={18} />
                保存
              </>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
