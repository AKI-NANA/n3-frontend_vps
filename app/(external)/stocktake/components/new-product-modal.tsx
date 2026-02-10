// app/(external)/stocktake/components/new-product-modal.tsx
/**
 * 新規商品登録モーダル（外注用）
 * 
 * 入力項目:
 * - 写真（複数枚可、必須）
 * - 商品名（必須）
 * - 色（任意）
 * - サイズ（任意）
 * - 在庫数
 * - 保管場所（デフォルト: plus1）
 */

'use client';

import React, { useState, useRef } from 'react';
import { X, Camera, Plus } from 'lucide-react';
import { STORAGE_LOCATIONS } from '../hooks/use-stocktake';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    product_name: string;
    physical_quantity: number;
    storage_location?: string;
    images?: string[];
    color?: string;
    size?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  onUploadImage: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
}

export function NewProductModal({
  isOpen,
  onClose,
  onSubmit,
  onUploadImage,
}: NewProductModalProps) {
  const [productName, setProductName] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [storageLocation, setStorageLocation] = useState('plus1');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = await onUploadImage(file);
      
      if (result.success && result.url) {
        setImages(prev => [...prev, result.url!]);
      } else {
        setError(result.error || '画像アップロード失敗');
        break;
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      setError('写真を1枚以上撮影してください');
      return;
    }
    if (!productName.trim()) {
      setError('商品名を入力してください');
      return;
    }

    setSaving(true);
    setError(null);

    const result = await onSubmit({
      product_name: productName.trim(),
      physical_quantity: quantity,
      storage_location: storageLocation,
      images: images,
      color: color.trim() || undefined,
      size: size.trim() || undefined,
    });

    setSaving(false);

    if (result.success) {
      setProductName('');
      setColor('');
      setSize('');
      setQuantity(1);
      setStorageLocation('plus1');
      setImages([]);
      onClose();
    } else {
      setError(result.error || '登録失敗');
    }
  };

  const handleClose = () => {
    if (!saving && !uploading) onClose();
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
        padding: '12px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          maxHeight: '92vh',
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
            padding: '12px 14px',
            borderBottom: '1px solid #e5e7eb',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} style={{ color: '#22c55e' }} />
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#1f2937' }}>新規商品登録</span>
          </div>
          <button
            onClick={handleClose}
            disabled={saving || uploading}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: 'none',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6b7280',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '12px 14px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div
              style={{
                padding: '10px',
                marginBottom: '12px',
                borderRadius: '6px',
                background: '#fef2f2',
                color: '#dc2626',
                fontSize: '12px',
              }}
            >
              {error}
            </div>
          )}

          {/* 📷 写真（必須） */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              📷 写真 <span style={{ color: '#ef4444' }}>*必須</span>
              <span style={{ fontSize: '10px', color: '#6b7280', marginLeft: '6px' }}>({images.length}枚)</span>
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />

            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {images.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      width: '60px',
                      height: '60px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: 'none',
                        background: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: `2px dashed ${images.length > 0 ? '#22c55e' : '#d1d5db'}`,
                background: images.length > 0 ? '#f0fdf4' : '#f9fafb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                color: images.length > 0 ? '#22c55e' : '#6b7280',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {uploading ? (
                <>
                  <div style={{ width: '16px', height: '16px', border: '2px solid #d1d5db', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  アップロード中...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  {images.length > 0 ? '追加撮影' : '写真を撮影'}
                </>
              )}
            </button>
          </div>

          {/* 商品名 */}
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              商品名 <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="商品名を入力"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* 色・サイズ（横並び） */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                🎨 色 <span style={{ fontSize: '10px', color: '#9ca3af' }}>任意</span>
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="例: 赤、青"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                📏 サイズ <span style={{ fontSize: '10px', color: '#9ca3af' }}>任意</span>
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="例: S、M、L"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* 在庫数・保管場所（横並び） */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                📦 在庫数
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <span style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'monospace', minWidth: '30px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                📍 保管場所
              </label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer',
                }}
              >
                {STORAGE_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            padding: '12px 14px',
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
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              background: 'white',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading || images.length === 0 || !productName.trim()}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: (saving || uploading || images.length === 0 || !productName.trim()) ? '#9ca3af' : '#22c55e',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (saving || uploading || images.length === 0 || !productName.trim()) ? 'not-allowed' : 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {saving ? '登録中...' : (<><Plus size={16} />登録</>)}
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
