// app/tools/editing-n3/stocktake/stocktake-page-content.tsx
/**
 * 棚卸しモード専用コンテンツ（Plus1用）
 * 
 * データ連携:
 * - inventory_masterテーブルに直接書き込み
 * - 既存ツールのマスタータブと完全連動（同じDB）
 * 
 * 画像保存:
 * - Supabase Storage (inventory-images バケット)
 * - inventory_master.images にURLを保存
 */

'use client';

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Package, Plus, RefreshCw, Camera, X,
  ChevronLeft, ChevronRight, Image as ImageIcon,
  CheckCircle, Clock, Grid, List, MapPin, Edit2
} from 'lucide-react';
import { useInventoryData, useInventorySync } from './hooks';

// ============================================================
// 保管場所選択肢
// ============================================================
const STORAGE_LOCATIONS = [
  { value: 'plus1', label: 'Plus1' },
  { value: 'yao', label: '八尾' },
  { value: 'warehouse_a', label: '倉庫A' },
  { value: 'warehouse_b', label: '倉庫B' },
  { value: 'other', label: 'その他' },
];

// ============================================================
// 新規商品登録モーダル
// ============================================================
function NewProductModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  workerName,
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSubmit: (data: any) => Promise<{ success: boolean; error?: string }>;
  workerName: string;
}) {
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState(workerName.toLowerCase());
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      setError('写真を1枚以上撮影してください');
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    const timestamp = Date.now().toString(36).toUpperCase();
    const autoSku = `${workerName.toUpperCase()}-${timestamp}`;
    
    const result = await onSubmit({
      sku: autoSku,
      product_name: title.trim() || `新規商品 ${autoSku}`,
      physical_quantity: quantity,
      storage_location: location,
      images,
      inventory_type: 'stock',
      counted_by: workerName,
    });
    
    setSubmitting(false);
    
    if (result.success) {
      setTitle('');
      setQuantity(1);
      setLocation(workerName.toLowerCase());
      setImages([]);
      onClose();
    } else {
      setError(result.error || '登録に失敗しました');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div 
        className="w-full max-w-sm rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--panel, white)' }}
      >
        <div 
          className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-white"
          style={{ borderColor: '#e5e7eb' }}
        >
          <h2 className="text-lg font-bold">📦 新規登録</h2>
          <button onClick={onClose} className="p-1 hover:opacity-70">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* 写真（必須） */}
          <div>
            <label className="block text-sm font-medium mb-2">
              📷 写真 <span className="text-red-500">*必須</span>
            </label>
            
            {images.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover rounded" />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X size={12} color="white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full py-3 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 hover:bg-gray-50 text-lg"
              style={{ borderColor: images.length > 0 ? '#22c55e' : '#3b82f6' }}
            >
              <Camera size={24} style={{ color: images.length > 0 ? '#22c55e' : '#3b82f6' }} />
              {uploading ? 'アップロード中...' : images.length > 0 ? '追加撮影' : '写真を撮影'}
            </button>
          </div>
          
          {/* 在庫数 */}
          <div>
            <label className="block text-sm font-medium mb-2">📦 在庫数</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-2xl hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-3xl font-bold font-mono w-16 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-2xl hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 保管場所（変更可能） */}
          <div>
            <label className="block text-sm font-medium mb-2">📍 保管場所</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm"
              style={{ borderColor: '#e5e7eb' }}
            >
              {STORAGE_LOCATIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </select>
          </div>
          
          {/* タイトル（任意） */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-500">
              タイトル（任意）
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="商品の説明を入力..."
              className="w-full px-3 py-2 rounded border text-sm"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
        </div>
        
        <div className="flex gap-2 px-4 py-3 border-t" style={{ borderColor: '#e5e7eb' }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border hover:bg-gray-50"
          >
            キャンセル
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || images.length === 0}
            className="flex-1 py-2.5 rounded-lg text-white font-medium hover:opacity-90 disabled:opacity-50"
            style={{ background: '#22c55e' }}
          >
            {submitting ? '登録中...' : '登録する'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// リスト行（メイン表示）
// ============================================================
const StocktakeListRow = React.memo(function StocktakeListRow({
  product,
  workerName,
  onUpdate,
}: {
  product: any;
  workerName: string;
  onUpdate: () => void;
}) {
  const [quantity, setQuantity] = useState(product.physical_quantity || 0);
  const [location, setLocation] = useState(product.storage_location || '');
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inventorySync = useInventorySync();

  const isProcessedByWorker = product.counted_by === workerName || 
                               product.storage_location === workerName.toLowerCase();
  const imageCount = product.images?.length || 0;
  const imageUrl = product.images?.[0] || product.image_url;

  // 在庫数変更
  const handleQuantityChange = async (newQty: number) => {
    setQuantity(newQty);
    setSaving(true);
    await inventorySync.updateStock(String(product.id), newQty);
    setSaving(false);
  };

  // 保管場所変更
  const handleLocationChange = async (newLocation: string) => {
    setLocation(newLocation);
    setShowLocationEdit(false);
    setSaving(true);
    
    try {
      await fetch('/api/inventory/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: product.id,
          storage_location: newLocation,
          counted_by: workerName,
        }),
      });
      onUpdate();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  // 画像アップロード
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('inventory_master_id', String(product.id));
      
      const res = await fetch('/api/inventory/upload-image', { method: 'POST', body: formData });
      
      if (res.ok) {
        // storage_locationも更新（未設定の場合）
        if (!product.storage_location) {
          await fetch('/api/inventory/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: product.id,
              storage_location: workerName.toLowerCase(),
              counted_by: workerName,
            }),
          });
        } else {
          // counted_byのみ更新
          await fetch('/api/inventory/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: product.id,
              storage_location: product.storage_location,
              counted_by: workerName,
            }),
          });
        }
        onUpdate();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 保管場所の表示名を取得
  const locationLabel = STORAGE_LOCATIONS.find(l => l.value === location)?.label || location || '未設定';

  return (
    <div 
      className="flex items-center gap-2 p-2 rounded-lg bg-white"
      style={{ borderLeft: `4px solid ${isProcessedByWorker ? '#22c55e' : '#e5e7eb'}` }}
    >
      {/* 画像 */}
      <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={20} className="text-gray-300" />
          </div>
        )}
        {imageCount > 0 && (
          <div className="absolute bottom-0 right-0 px-1 text-[10px] bg-black/70 text-white rounded-tl font-bold">
            {imageCount}
          </div>
        )}
        {saving && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      
      {/* 情報 */}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-mono text-gray-400 truncate">{product.sku || '-'}</div>
        <div className="text-sm font-medium truncate mb-1">
          {product.product_name || product.title || '（商品名なし）'}
        </div>
        
        {/* 保管場所（クリックで変更） */}
        {showLocationEdit ? (
          <select
            value={location}
            onChange={(e) => handleLocationChange(e.target.value)}
            onBlur={() => setShowLocationEdit(false)}
            autoFocus
            className="text-xs px-2 py-0.5 rounded border"
            style={{ borderColor: '#3b82f6' }}
          >
            {STORAGE_LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>{loc.label}</option>
            ))}
          </select>
        ) : (
          <button
            onClick={() => setShowLocationEdit(true)}
            className="flex items-center gap-1 text-xs px-2 py-0.5 rounded hover:bg-gray-100"
            style={{ 
              background: location ? 'rgba(34, 197, 94, 0.1)' : '#f3f4f6',
              color: location ? '#22c55e' : '#9ca3af',
            }}
          >
            <MapPin size={10} />
            {locationLabel}
            <Edit2 size={10} className="ml-1 opacity-50" />
          </button>
        )}
      </div>
      
      {/* 在庫数 */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
          className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-lg"
        >
          -
        </button>
        <span 
          className="w-10 text-center font-bold font-mono text-lg"
          style={{ color: quantity > 0 ? '#1f2937' : '#ef4444' }}
        >
          {quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-lg"
        >
          +
        </button>
      </div>
      
      {/* 撮影ボタン */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: imageCount > 0 ? '#22c55e' : '#3b82f6' }}
      >
        <Camera size={18} color="white" />
      </button>
    </div>
  );
});

// ============================================================
// カード表示
// ============================================================
const StocktakeCard = React.memo(function StocktakeCard({
  product,
  workerName,
  onUpdate,
}: {
  product: any;
  workerName: string;
  onUpdate: () => void;
}) {
  const [quantity, setQuantity] = useState(product.physical_quantity || 0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inventorySync = useInventorySync();

  const isProcessedByWorker = product.counted_by === workerName || 
                               product.storage_location === workerName.toLowerCase();
  const imageCount = product.images?.length || 0;
  const imageUrl = product.images?.[0] || product.image_url;

  const handleQuantityChange = async (newQty: number) => {
    setQuantity(newQty);
    setSaving(true);
    await inventorySync.updateStock(String(product.id), newQty);
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('inventory_master_id', String(product.id));
      
      const res = await fetch('/api/inventory/upload-image', { method: 'POST', body: formData });
      
      if (res.ok) {
        if (!product.storage_location) {
          await fetch('/api/inventory/update-location', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: product.id,
              storage_location: workerName.toLowerCase(),
              counted_by: workerName,
            }),
          });
        }
        onUpdate();
      }
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div 
      className="rounded-lg overflow-hidden relative bg-white"
      style={{ border: `2px solid ${isProcessedByWorker ? '#22c55e' : '#e5e7eb'}` }}
    >
      {isProcessedByWorker && (
        <div className="absolute top-0 left-0 z-10 px-1 py-0.5 text-[10px] font-bold text-white rounded-br bg-green-500">
          ✓{workerName}
        </div>
      )}

      <div className="relative aspect-square bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={24} className="text-gray-300" />
          </div>
        )}
        
        {imageCount > 0 && (
          <div className="absolute top-1 right-1 px-1 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 bg-black/70 text-white">
            <ImageIcon size={10} />{imageCount}
          </div>
        )}
        
        {saving && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center justify-center bg-black/70"
        >
          <Camera size={14} color="white" />
        </button>
      </div>
      
      <div className="p-1.5">
        <div className="text-[10px] font-mono text-gray-400 truncate">{product.sku || '-'}</div>
        <div className="text-xs font-medium line-clamp-1 mb-1">
          {product.product_name || product.title || '（商品名なし）'}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={() => handleQuantityChange(Math.max(0, quantity - 1))}
            className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold bg-gray-100"
          >
            -
          </button>
          <span className="text-base font-bold font-mono" style={{ color: quantity > 0 ? '#1f2937' : '#ef4444' }}>
            {quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-6 h-6 rounded flex items-center justify-center text-sm font-bold bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================
export function StocktakePageContent() {
  const searchParams = useSearchParams();
  const workerName = searchParams.get('worker') || 'Plus1';
  
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // デフォルトはリスト
  
  const inventoryData = useInventoryData();
  const inventorySync = useInventorySync();
  
  useEffect(() => {
    inventoryData.setItemsPerPage(100);
  }, []);
  
  useEffect(() => {
    inventoryData.loadProducts('in_stock_master');
  }, []);
  
  useEffect(() => {
    inventoryData.setFilter({ search });
  }, [search]);
  
  const allItems = inventoryData.filteredProducts || [];
  
  const stats = useMemo(() => {
    const workerLower = workerName.toLowerCase();
    const processedByWorker = allItems.filter(p => 
      p.counted_by === workerName || p.storage_location === workerLower
    );
    const totalImages = processedByWorker.reduce((sum, p) => sum + (p.images?.length || 0), 0);
    const pending = allItems.filter(p => 
      p.counted_by !== workerName && p.storage_location !== workerLower
    );
    
    return {
      total: allItems.length,
      processedCount: processedByWorker.length,
      pendingCount: pending.length,
      totalImages,
    };
  }, [allItems, workerName]);
  
  const filteredItems = useMemo(() => {
    const workerLower = workerName.toLowerCase();
    if (filterMode === 'completed') {
      return allItems.filter(p => p.counted_by === workerName || p.storage_location === workerLower);
    }
    if (filterMode === 'pending') {
      return allItems.filter(p => p.counted_by !== workerName && p.storage_location !== workerLower);
    }
    return allItems;
  }, [allItems, filterMode, workerName]);
  
  const items = useMemo(() => {
    const start = (inventoryData.currentPage - 1) * inventoryData.itemsPerPage;
    return filteredItems.slice(start, start + inventoryData.itemsPerPage);
  }, [filteredItems, inventoryData.currentPage, inventoryData.itemsPerPage]);
  
  const loading = inventoryData.loading;
  const totalPages = Math.ceil(filteredItems.length / inventoryData.itemsPerPage);

  const handleNewProduct = async (data: any) => {
    try {
      const result = await inventorySync.createProduct({
        sku: data.sku,
        product_name: data.product_name,
        physical_quantity: data.physical_quantity,
        storage_location: data.storage_location,
        images: data.images,
        inventory_type: 'stock',
        source_type: 'stocktake',
        counted_by: data.counted_by,
      });
      
      if (result.success) {
        inventoryData.refreshData();
        return { success: true };
      }
      return { success: false, error: result.error };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f0f0' }}>
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="px-2 py-1.5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded flex items-center justify-center bg-green-500">
                <Package size={14} color="white" />
              </div>
              <span className="font-bold text-sm">{workerName}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="flex rounded overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                >
                  <Grid size={16} />
                </button>
              </div>
              
              <button
                onClick={() => setShowNewModal(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded text-white text-sm font-medium bg-green-500"
              >
                <Plus size={14} />
                新規
              </button>
              
              <button onClick={() => inventoryData.refreshData()} className="p-1.5 rounded hover:bg-gray-100">
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* 統計 */}
          <div className="flex items-center gap-2 text-xs mb-1.5">
            <span className="text-gray-500">全{stats.total}</span>
            <span className="text-green-600 font-bold">✓{stats.processedCount}件</span>
            <span className="text-blue-600 font-bold">📷{stats.totalImages}枚</span>
            <span className="text-orange-500">⏳{stats.pendingCount}件</span>
          </div>
          
          {/* フィルター + 検索 */}
          <div className="flex gap-1.5">
            <div className="flex gap-0.5 flex-shrink-0">
              {[
                { id: 'all', label: '全部', color: '#3b82f6' },
                { id: 'pending', label: '未処理', color: '#f59e0b' },
                { id: 'completed', label: '済', color: '#22c55e' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterMode(f.id as any)}
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ 
                    background: filterMode === f.id ? f.color : '#f3f4f6',
                    color: filterMode === f.id ? 'white' : '#6b7280',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="検索..."
                className="w-full pl-7 pr-2 py-1 rounded border text-sm"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* メイン */}
      <main className="p-1.5">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        )}
        
        {/* リスト表示 */}
        {!loading && items.length > 0 && viewMode === 'list' && (
          <div className="space-y-1">
            {items.map((product) => (
              <StocktakeListRow
                key={product.id}
                product={product}
                workerName={workerName}
                onUpdate={() => inventoryData.refreshData()}
              />
            ))}
          </div>
        )}
        
        {/* グリッド表示 */}
        {!loading && items.length > 0 && viewMode === 'grid' && (
          <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
            {items.map((product) => (
              <StocktakeCard
                key={product.id}
                product={product}
                workerName={workerName}
                onUpdate={() => inventoryData.refreshData()}
              />
            ))}
          </div>
        )}
        
        {!loading && items.length === 0 && (
          <div className="text-center py-8">
            <Package size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500 text-sm mb-3">
              {filterMode === 'completed' ? '処理済みの商品はありません' :
               filterMode === 'pending' ? '未処理の商品はありません！🎉' :
               '商品がありません'}
            </p>
            <button
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 rounded text-white text-sm bg-green-500"
            >
              新規登録
            </button>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-3 py-2">
            <button
              onClick={() => inventoryData.setCurrentPage(inventoryData.currentPage - 1)}
              disabled={inventoryData.currentPage <= 1}
              className="p-2 rounded bg-white disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-500">{inventoryData.currentPage}/{totalPages}</span>
            <button
              onClick={() => inventoryData.setCurrentPage(inventoryData.currentPage + 1)}
              disabled={inventoryData.currentPage >= totalPages}
              className="p-2 rounded bg-white disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
      
      <NewProductModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={handleNewProduct}
        workerName={workerName}
      />
    </div>
  );
}
