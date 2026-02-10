// app/tools/editing-n3/components/modals/n3-new-product-modal.tsx
/**
 * 新規商品作成モーダル
 * 
 * inventory_master に新規商品を手動登録するモーダル
 */

'use client';

import React, { useState } from 'react';
import { X, Package, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';

interface N3NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: NewProductData) => Promise<{ success: boolean; error?: string }>;
}

export interface NewProductData {
  product_name: string;
  sku?: string;
  physical_quantity: number;
  cost_price: number;
  selling_price?: number;
  condition_name?: string;
  category?: string;
  notes?: string;
  images?: string[];
}

export function N3NewProductModal({
  isOpen,
  onClose,
  onSubmit,
}: N3NewProductModalProps) {
  const [formData, setFormData] = useState<NewProductData>({
    product_name: '',
    sku: '',
    physical_quantity: 1,
    cost_price: 0,
    selling_price: 0,
    condition_name: 'New',
    category: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (field: keyof NewProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async () => {
    // バリデーション
    if (!formData.product_name.trim()) {
      setError('商品名を入力してください');
      return;
    }
    if (formData.cost_price <= 0) {
      setError('原価を入力してください');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await onSubmit(formData);
      if (result.success) {
        // 成功したらフォームをリセットして閉じる
        setFormData({
          product_name: '',
          sku: '',
          physical_quantity: 1,
          cost_price: 0,
          selling_price: 0,
          condition_name: 'New',
          category: '',
          notes: '',
        });
        onClose();
      } else {
        setError(result.error || '登録に失敗しました');
      }
    } catch (err: any) {
      setError(err.message || '登録に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-lg shadow-xl"
        style={{ background: 'var(--panel)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: 'var(--panel-border)' }}
        >
          <div className="flex items-center gap-3">
            <Plus size={18} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold" style={{ color: 'var(--text)' }}>
              新規商品登録
            </span>
          </div>
          <button 
            onClick={handleClose}
            disabled={saving}
            className="p-1.5 rounded hover:bg-[var(--highlight)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {/* エラー表示 */}
          {error && (
            <div 
              className="mb-4 p-3 rounded text-sm"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)' }}
            >
              {error}
            </div>
          )}

          {/* フォーム */}
          <div className="space-y-4">
            {/* 商品名（必須） */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                商品名 <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) => handleChange('product_name', e.target.value)}
                placeholder="商品名を入力"
                className="w-full px-3 py-2 rounded"
                style={{ 
                  background: 'var(--highlight)', 
                  color: 'var(--text)',
                  border: '1px solid var(--panel-border)',
                }}
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => handleChange('sku', e.target.value)}
                placeholder="SKUを入力（空白の場合は自動生成）"
                className="w-full px-3 py-2 rounded"
                style={{ 
                  background: 'var(--highlight)', 
                  color: 'var(--text)',
                  border: '1px solid var(--panel-border)',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 在庫数 */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  在庫数
                </label>
                <input
                  type="number"
                  value={formData.physical_quantity}
                  onChange={(e) => handleChange('physical_quantity', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-3 py-2 rounded"
                  style={{ 
                    background: 'var(--highlight)', 
                    color: 'var(--text)',
                    border: '1px solid var(--panel-border)',
                  }}
                />
              </div>

              {/* コンディション */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  コンディション
                </label>
                <select
                  value={formData.condition_name}
                  onChange={(e) => handleChange('condition_name', e.target.value)}
                  className="w-full px-3 py-2 rounded"
                  style={{ 
                    background: 'var(--highlight)', 
                    color: 'var(--text)',
                    border: '1px solid var(--panel-border)',
                  }}
                >
                  <option value="New">New（新品）</option>
                  <option value="Used">Used（中古）</option>
                  <option value="Refurbished">Refurbished（再生品）</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 原価（必須） */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  原価 (¥) <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.cost_price}
                  onChange={(e) => handleChange('cost_price', parseInt(e.target.value) || 0)}
                  min="0"
                  placeholder="0"
                  className="w-full px-3 py-2 rounded"
                  style={{ 
                    background: 'var(--highlight)', 
                    color: 'var(--text)',
                    border: '1px solid var(--panel-border)',
                  }}
                />
              </div>

              {/* 販売価格 */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  販売価格 ($)
                </label>
                <input
                  type="number"
                  value={formData.selling_price}
                  onChange={(e) => handleChange('selling_price', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded"
                  style={{ 
                    background: 'var(--highlight)', 
                    color: 'var(--text)',
                    border: '1px solid var(--panel-border)',
                  }}
                />
              </div>
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                カテゴリ
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="カテゴリを入力"
                className="w-full px-3 py-2 rounded"
                style={{ 
                  background: 'var(--highlight)', 
                  color: 'var(--text)',
                  border: '1px solid var(--panel-border)',
                }}
              />
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                メモ
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="メモを入力"
                rows={3}
                className="w-full px-3 py-2 rounded resize-none"
                style={{ 
                  background: 'var(--highlight)', 
                  color: 'var(--text)',
                  border: '1px solid var(--panel-border)',
                }}
              />
            </div>
          </div>
        </div>

        {/* フッター */}
        <div 
          className="flex items-center justify-end gap-3 px-4 py-3 border-t"
          style={{ borderColor: 'var(--panel-border)', background: 'var(--highlight)' }}
        >
          <N3Button
            size="sm"
            variant="ghost"
            onClick={handleClose}
            disabled={saving}
          >
            キャンセル
          </N3Button>
          <N3Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            loading={saving}
          >
            <Plus size={14} />
            登録
          </N3Button>
        </div>
      </div>
    </div>
  );
}
