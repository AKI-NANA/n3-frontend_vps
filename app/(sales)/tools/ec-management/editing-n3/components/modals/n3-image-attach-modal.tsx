// app/tools/editing-n3/components/modals/n3-image-attach-modal.tsx
/**
 * N3ImageAttachModal - 既存商品への画像紐付けモーダル
 * 
 * 機能:
 * - 画像なし商品のリスト表示
 * - 各商品に画像をドラッグ&ドロップで追加
 * - SKU/商品名でマッチングして一括紐付け
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  X, Upload, Image as ImageIcon, Camera, Search, 
  CheckCircle, AlertCircle, Package, Loader2, Trash2,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { N3Button } from '@/components/n3';
import { createClient } from '@/lib/supabase/client';

interface ProductWithoutImage {
  id: string;
  sku: string;
  product_name: string;
  physical_quantity: number;
  storage_location: string;
  created_at: string;
}

interface N3ImageAttachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function N3ImageAttachModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: N3ImageAttachModalProps) {
  const [products, setProducts] = useState<ProductWithoutImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithoutImage | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[id: string]: 'pending' | 'uploading' | 'done' | 'error'}>({});
  const [pendingImages, setPendingImages] = useState<{[productId: string]: File[]}>({});
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // 画像なし商品を取得
  const loadProductsWithoutImages = useCallback(async () => {
    setLoading(true);
    try {
      // 画像がない商品を取得（images が null または空配列）
      let query = supabase
        .from('inventory_master')
        .select('id, sku, product_name, physical_quantity, storage_location, created_at, images', { count: 'exact' })
        .or('images.is.null,images.eq.[]')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`sku.ilike.%${searchQuery}%,product_name.ilike.%${searchQuery}%`);
      }

      const { data, error, count } = await query
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (error) throw error;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (err: any) {
      console.error('Load products error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page, supabase]);

  useEffect(() => {
    if (isOpen) {
      loadProductsWithoutImages();
    }
  }, [isOpen, loadProductsWithoutImages]);

  // 画像選択ハンドラ
  const handleFileSelect = useCallback((productId: string, files: FileList | null) => {
    if (!files) return;
    
    const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setPendingImages(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), ...imageFiles]
    }));
  }, []);

  // 画像削除
  const removePendingImage = useCallback((productId: string, index: number) => {
    setPendingImages(prev => ({
      ...prev,
      [productId]: prev[productId]?.filter((_, i) => i !== index) || []
    }));
  }, []);

  // 単一商品への画像アップロード
  const uploadImagesForProduct = async (productId: string, files: File[]): Promise<boolean> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('inventory_master_id', productId);

        const res = await fetch('/api/inventory/upload-image', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          const imageUrl = data.url || data.data?.url;
          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          }
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    if (uploadedUrls.length > 0) {
      // DBの images カラムを更新
      const { error } = await supabase
        .from('inventory_master')
        .update({
          images: uploadedUrls,
          image_url: uploadedUrls[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', productId);

      return !error;
    }

    return false;
  };

  // 全ての保留中画像をアップロード
  const handleUploadAll = async () => {
    const productIds = Object.keys(pendingImages).filter(id => pendingImages[id]?.length > 0);
    if (productIds.length === 0) return;

    setUploading(true);
    
    for (const productId of productIds) {
      setUploadProgress(prev => ({ ...prev, [productId]: 'uploading' }));
      
      const success = await uploadImagesForProduct(productId, pendingImages[productId]);
      
      setUploadProgress(prev => ({ 
        ...prev, 
        [productId]: success ? 'done' : 'error' 
      }));
    }

    setUploading(false);
    
    // 成功した商品を pendingImages から削除
    setPendingImages(prev => {
      const newPending = { ...prev };
      for (const productId of productIds) {
        if (uploadProgress[productId] === 'done') {
          delete newPending[productId];
        }
      }
      return newPending;
    });

    // リストを更新
    loadProductsWithoutImages();
    onSuccess?.();
  };

  // ドラッグ&ドロップ
  const handleDrop = useCallback((e: React.DragEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(productId, e.dataTransfer.files);
  }, [handleFileSelect]);

  const totalPages = Math.ceil(totalCount / pageSize);
  const pendingCount = Object.values(pendingImages).reduce((sum, files) => sum + files.length, 0);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && !uploading && onClose()}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
        style={{ background: 'var(--panel)' }}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white' }}
        >
          <div className="flex items-center gap-3">
            <ImageIcon size={24} />
            <div>
              <h2 className="text-lg font-bold">画像なし商品への画像追加</h2>
              <p className="text-sm opacity-80">
                {totalCount}件の画像なし商品
                {pendingCount > 0 && ` • ${pendingCount}枚の画像を待機中`}
              </p>
            </div>
          </div>
          {!uploading && (
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20">
              <X size={20} />
            </button>
          )}
        </div>

        {/* 検索バー */}
        <div className="px-6 py-3 border-b" style={{ borderColor: 'var(--panel-border)' }}>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                placeholder="SKU または 商品名で検索..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm"
                style={{ borderColor: 'var(--panel-border)' }}
              />
            </div>
            
            {pendingCount > 0 && (
              <N3Button 
                onClick={handleUploadAll} 
                disabled={uploading}
                variant="primary"
                size="sm"
              >
                {uploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    アップロード中...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    {pendingCount}枚をアップロード
                  </>
                )}
              </N3Button>
            )}
          </div>
        </div>

        {/* 商品リスト */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
              <p className="text-lg font-semibold text-gray-700">
                すべての商品に画像があります
              </p>
              <p className="text-sm text-gray-500 mt-2">
                画像なしの商品はありません
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => {
                const pending = pendingImages[product.id] || [];
                const status = uploadProgress[product.id];
                
                return (
                  <div 
                    key={product.id}
                    className="flex items-center gap-4 p-4 rounded-lg border transition-all"
                    style={{ 
                      borderColor: pending.length > 0 ? '#f59e0b' : 'var(--panel-border)',
                      background: status === 'done' ? 'rgba(34, 197, 94, 0.1)' : 'var(--highlight)'
                    }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => handleDrop(e, product.id)}
                  >
                    {/* 商品情報 */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {pending.length > 0 ? (
                        <div className="relative w-full h-full">
                          <img 
                            src={URL.createObjectURL(pending[0])} 
                            alt="" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {pending.length > 1 && (
                            <div className="absolute bottom-0 right-0 px-1.5 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded-tl">
                              +{pending.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Package size={24} className="text-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 rounded">
                          {product.sku}
                        </span>
                        <span className="text-xs text-gray-500">
                          在庫: {product.physical_quantity}
                        </span>
                        {product.storage_location && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded">
                            {product.storage_location}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium truncate">
                        {product.product_name || '（商品名なし）'}
                      </p>
                    </div>

                    {/* 画像追加エリア */}
                    <div className="flex items-center gap-2">
                      {/* 保留中の画像サムネイル */}
                      {pending.length > 0 && (
                        <div className="flex items-center gap-1">
                          {pending.slice(0, 3).map((file, idx) => (
                            <div key={idx} className="relative group">
                              <img 
                                src={URL.createObjectURL(file)}
                                alt=""
                                className="w-10 h-10 object-cover rounded border"
                              />
                              <button
                                onClick={() => removePendingImage(product.id, idx)}
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* ステータス表示 */}
                      {status === 'uploading' && (
                        <Loader2 size={20} className="animate-spin text-blue-500" />
                      )}
                      {status === 'done' && (
                        <CheckCircle size={20} className="text-green-500" />
                      )}
                      {status === 'error' && (
                        <AlertCircle size={20} className="text-red-500" />
                      )}

                      {/* 画像追加ボタン */}
                      {status !== 'done' && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFileSelect(product.id, e.target.files)}
                            className="hidden"
                            id={`file-input-${product.id}`}
                          />
                          <label
                            htmlFor={`file-input-${product.id}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors"
                            style={{ 
                              background: pending.length > 0 ? '#fef3c7' : 'var(--panel)',
                              border: '1px dashed',
                              borderColor: pending.length > 0 ? '#f59e0b' : '#d1d5db'
                            }}
                          >
                            <Camera size={16} className={pending.length > 0 ? 'text-orange-500' : 'text-gray-400'} />
                            <span className="text-xs font-medium">
                              {pending.length > 0 ? '追加' : '画像選択'}
                            </span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 px-6 py-3 border-t" style={{ borderColor: 'var(--panel-border)' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* 使い方ヒント */}
        <div className="px-6 py-3 bg-gray-50 border-t text-xs text-gray-500" style={{ borderColor: 'var(--panel-border)' }}>
          💡 ヒント: 商品行に画像をドラッグ&ドロップすることもできます。複数枚の画像を選択可能です。
        </div>
      </div>
    </div>
  );
}

export default N3ImageAttachModal;
