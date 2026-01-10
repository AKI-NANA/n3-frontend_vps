// app/tools/editing-n3/components/modals/n3-new-product-modal.tsx
/**
 * 新規商品作成モーダル
 * 
 * inventory_master に新規商品を手動登録するモーダル
 * L4属性（販売予定販路）とその他経費の入力に対応
 */

'use client';

import React, { useState } from 'react';
import { X, Package, Plus, Upload, Image as ImageIcon, Store, Trash2 } from 'lucide-react';
import { N3Button, N3Divider } from '@/components/n3';
import { SALES_CHANNEL_LABELS, COST_ITEM_PRESETS, type SalesChannel, type AdditionalCosts } from '@/types/inventory';

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
  storage_location?: string;  // 保管場所: 'env' | 'plus1'
  attr_l4?: SalesChannel[];   // 販売予定販路
  additional_costs?: AdditionalCosts; // その他経費
}

// 経費項目の型
interface CostItem {
  key: string;
  label: string;
  amount: number;
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
    storage_location: 'plus1',  // 新規登録はデフォルトplus1
    attr_l4: [],
    additional_costs: {},
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // L4属性（販売予定販路）
  const [selectedChannels, setSelectedChannels] = useState<SalesChannel[]>([]);
  
  // その他経費
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [newCostKey, setNewCostKey] = useState('');
  const [newCostAmount, setNewCostAmount] = useState('');

  if (!isOpen) return null;

  const handleChange = (field: keyof NewProductData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  // 販路チェックボックスのトグル
  const toggleChannel = (channel: SalesChannel) => {
    setSelectedChannels(prev => {
      if (prev.includes(channel)) {
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };

  // 経費項目の追加
  const handleAddCostItem = () => {
    if (!newCostKey || !newCostAmount) return;
    
    const amount = parseInt(newCostAmount) || 0;
    if (amount <= 0) return;
    
    const preset = COST_ITEM_PRESETS.find(p => p.key === newCostKey);
    const existingIndex = costItems.findIndex(item => item.key === newCostKey);
    
    if (existingIndex >= 0) {
      setCostItems(prev => prev.map((item, i) => 
        i === existingIndex ? { ...item, amount } : item
      ));
    } else {
      setCostItems(prev => [...prev, {
        key: newCostKey,
        label: preset?.label || newCostKey,
        amount,
      }]);
    }
    
    setNewCostKey('');
    setNewCostAmount('');
  };

  // 経費項目の削除
  const handleRemoveCostItem = (key: string) => {
    setCostItems(prev => prev.filter(item => item.key !== key));
  };

  // 経費合計
  const totalAdditionalCosts = costItems.reduce((sum, item) => sum + item.amount, 0);

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
      // additional_costsをオブジェクトに変換
      const additionalCosts: AdditionalCosts = {};
      for (const item of costItems) {
        if (item.amount > 0) {
          additionalCosts[item.key] = item.amount;
        }
      }
      
      const submitData: NewProductData = {
        ...formData,
        attr_l4: selectedChannels,
        additional_costs: additionalCosts,
      };
      
      const result = await onSubmit(submitData);
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
          storage_location: 'plus1',
          attr_l4: [],
          additional_costs: {},
        });
        setSelectedChannels([]);
        setCostItems([]);
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

  // 総原価（原価 + 経費）
  const totalCost = formData.cost_price + totalAdditionalCosts;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
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

            <div className="grid grid-cols-3 gap-4">
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

              {/* 保管場所 */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  保管場所
                </label>
                <select
                  value={formData.storage_location}
                  onChange={(e) => handleChange('storage_location', e.target.value)}
                  className="w-full px-3 py-2 rounded"
                  style={{ 
                    background: 'var(--highlight)', 
                    color: formData.storage_location === 'plus1' ? '#22c55e' : 'var(--text)',
                    border: '1px solid var(--panel-border)',
                    fontWeight: 600,
                  }}
                >
                  <option value="plus1">plus1</option>
                  <option value="env">env</option>
                </select>
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

            <N3Divider />

            {/* その他経費セクション */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                その他経費
              </label>
              
              {/* 経費リスト */}
              {costItems.length > 0 && (
                <div className="space-y-2 mb-3">
                  {costItems.map((item) => (
                    <div 
                      key={item.key}
                      className="flex items-center gap-2 p-2 rounded"
                      style={{ background: 'var(--highlight)' }}
                    >
                      <span className="flex-1 text-sm" style={{ color: 'var(--text)' }}>
                        {item.label}
                      </span>
                      <span className="text-sm font-mono" style={{ color: 'var(--text)' }}>
                        ¥{item.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleRemoveCostItem(item.key)}
                        className="p-1 rounded hover:bg-[var(--panel)]"
                        style={{ color: 'var(--color-error)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* 経費追加フォーム */}
              <div className="flex items-center gap-2">
                <select
                  value={newCostKey}
                  onChange={(e) => setNewCostKey(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded text-sm"
                  style={{ 
                    background: 'var(--highlight)', 
                    color: 'var(--text)',
                    border: '1px solid var(--panel-border)',
                  }}
                >
                  <option value="">項目を選択...</option>
                  {COST_ITEM_PRESETS.map((preset) => (
                    <option key={preset.key} value={preset.key}>
                      {preset.label}
                    </option>
                  ))}
                </select>
                <div className="flex items-center">
                  <span className="text-sm mr-1" style={{ color: 'var(--text-muted)' }}>¥</span>
                  <input
                    type="number"
                    value={newCostAmount}
                    onChange={(e) => setNewCostAmount(e.target.value)}
                    placeholder="金額"
                    className="w-24 px-2 py-1.5 rounded text-sm text-right"
                    style={{ 
                      background: 'var(--highlight)', 
                      color: 'var(--text)',
                      border: '1px solid var(--panel-border)',
                    }}
                  />
                </div>
                <N3Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddCostItem}
                  disabled={!newCostKey || !newCostAmount}
                >
                  <Plus size={14} />
                </N3Button>
              </div>
              
              {/* 合計表示 */}
              {costItems.length > 0 && (
                <div 
                  className="mt-2 p-2 rounded flex justify-between items-center"
                  style={{ background: 'rgba(245, 158, 11, 0.1)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--text)' }}>経費合計</span>
                  <span className="font-bold" style={{ color: 'rgb(245, 158, 11)' }}>
                    ¥{totalAdditionalCosts.toLocaleString()}
                  </span>
                </div>
              )}
              
              {/* 総原価 */}
              <div 
                className="mt-2 p-2 rounded flex justify-between items-center"
                style={{ background: 'rgba(59, 130, 246, 0.1)' }}
              >
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  総原価（原価 + 経費）
                </span>
                <span className="font-bold" style={{ color: 'rgb(59, 130, 246)' }}>
                  ¥{totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            <N3Divider />

            {/* L4属性: 販売予定販路 */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                <Store size={14} />
                販売予定販路 (L4)
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(SALES_CHANNEL_LABELS) as [SalesChannel, string][]).map(([channel, label]) => (
                  <label
                    key={channel}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer transition-all"
                    style={{ 
                      background: selectedChannels.includes(channel) 
                        ? 'rgba(59, 130, 246, 0.15)' 
                        : 'var(--highlight)',
                      border: selectedChannels.includes(channel)
                        ? '1px solid rgba(59, 130, 246, 0.5)'
                        : '1px solid transparent',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedChannels.includes(channel)}
                      onChange={() => toggleChannel(channel)}
                      className="rounded"
                    />
                    <span 
                      className="text-sm"
                      style={{ 
                        color: selectedChannels.includes(channel) 
                          ? 'rgb(59, 130, 246)' 
                          : 'var(--text)',
                        fontWeight: selectedChannels.includes(channel) ? 600 : 400,
                      }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <N3Divider />

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
