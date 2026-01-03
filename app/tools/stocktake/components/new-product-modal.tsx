// app/tools/stocktake/components/new-product-modal.tsx
/**
 * 新規商品登録モーダル（外注用）
 * 画像、数、タイトル、色、サイズを入力
 */

'use client';

import React, { useState, useRef } from 'react';
import { X, Camera, Plus, Package } from 'lucide-react';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    product_name: string;
    physical_quantity: number;
    color?: string;
    size?: string;
    image_url?: string;
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
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const result = await onUploadImage(file);
    
    if (result.success && result.url) {
      setImageUrl(result.url);
    } else {
      setError(result.error || '画像アップロードに失敗しました');
    }

    setUploading(false);
    
    // input をリセット
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

    const result = await onSubmit({
      product_name: productName.trim(),
      physical_quantity: quantity,
      color: color.trim() || undefined,
      size: size.trim() || undefined,
      image_url: imageUrl || undefined,
    });

    setSaving(false);

    if (result.success) {
      // リセット
      setProductName('');
      setQuantity(1);
      setColor('');
      setSize('');
      setImageUrl(null);
      onClose();
    } else {
      setError(result.error || '登録に失敗しました');
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
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} style={{ color: '#22c55e' }} />
            <span style={{ fontWeight: 600, color: '#1f2937' }}>新規商品登録</span>
          </div>
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
        <div style={{ padding: '16px' }}>
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

          {/* 画像 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              商品画像
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />
            {imageUrl ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={imageUrl}
                  alt="商品画像"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    right: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Camera size={14} />
                  変更
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  width: '100%',
                  height: '150px',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db',
                  background: '#f9fafb',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#6b7280',
                }}
              >
                {uploading ? (
                  <>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        border: '2px solid #d1d5db',
                        borderTopColor: '#22c55e',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <span style={{ fontSize: '13px' }}>アップロード中...</span>
                  </>
                ) : (
                  <>
                    <Camera size={32} />
                    <span style={{ fontSize: '13px' }}>タップして撮影</span>
                  </>
                )}
              </button>
            )}
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

          {/* 色・サイズ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                色
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="例: 赤、青"
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
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                サイズ
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="例: S、M、L"
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
          </div>

          {/* 数量 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              数量
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#374151',
                }}
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '18px',
                  fontWeight: 600,
                  textAlign: 'center',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#374151',
                }}
              >
                +
              </button>
            </div>
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
              background: saving ? '#9ca3af' : '#22c55e',
              fontSize: '15px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {saving ? '登録中...' : (
              <>
                <Plus size={18} />
                登録
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
