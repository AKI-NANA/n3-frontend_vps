'use client';

// TabImages - V9.1
// デザインシステムV4準拠
// 機能: 
// - 画像選択、順序設定、処理設定、DB保存
// - ドラッグ&ドロップアップロード機能
// - SM画像の完全除外
// - 画像削除機能
// 
// V9.1: useEffect無限ループ修正

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { Product } from '@/types/product';

const T = {
  bg: '#F1F5F9',
  panel: '#ffffff',
  panelBorder: '#e2e8f0',
  highlight: '#f1f5f9',
  text: '#1e293b',
  textMuted: '#64748b',
  textSubtle: '#94a3b8',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

export interface TabImagesProps {
  product: Product | null;
  maxImages: number;
  marketplace: string;
  onSave?: (updates: any) => void;
  onRefresh?: () => void;
}

/**
 * SM画像のURLパターンを判定
 */
function isSMImageUrl(url: string): boolean {
  if (!url) return false;
  
  const smPatterns = [
    'surugaya',
    'mandarake',
    'mercari',
    'yahoo.co.jp',
    'auctions.yahoo',
    'rakuten.co.jp',
    'amazon.co.jp',
    'amazon.com',
    'ebay.com/itm',
    'i.ebayimg.com',
  ];
  
  const urlLower = url.toLowerCase();
  return smPatterns.some(pattern => urlLower.includes(pattern));
}

/**
 * URLを正規化してユニークキーを生成
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`.toLowerCase();
  } catch {
    return url.split('?')[0].toLowerCase();
  }
}

export function TabImages({ product, maxImages, marketplace, onSave, onRefresh }: TabImagesProps) {
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [deletedUrls, setDeletedUrls] = useState<Set<string>>(new Set()); // 削除済みURLを追跡
  const [imageSettings, setImageSettings] = useState({
    resize: true,
    optimize: true,
    watermark: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 前回の商品IDを追跡
  const prevProductIdRef = useRef<string | number | null>(null);

  /**
   * 利用可能な画像を取得（useMemoで安定化）
   * 削除済みURLを除外
   */
  const availableImages = useMemo(() => {
    if (!product) return [];

    const images: { id: string; url: string; source: string; canDelete: boolean }[] = [];
    const seen = new Set<string>();

    const addImage = (url: string | undefined | null, source: string, idx: number, canDelete: boolean = false) => {
      if (!url || typeof url !== 'string') return;
      if (!url.startsWith('http')) return;
      
      // 削除済みのURLはスキップ
      if (deletedUrls.has(url)) {
        console.log(`[スキップ] 削除済み: ${url.substring(0, 50)}...`);
        return;
      }
      
      if (isSMImageUrl(url)) {
        return;
      }

      const normalizedUrl = normalizeUrl(url);

      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        images.push({
          id: `${source}-${idx}`,
          url: url,
          source: source,
          canDelete: canDelete || source === 'manual' || url.includes('supabase')
        });
      }
    };

    const imageSources = [
      { data: (product as any).manual_images, name: 'manual', canDelete: true },
      { data: (product as any).listing_images, name: 'listing_selected', canDelete: false },
      { data: (product as any).gallery_images, name: 'gallery', canDelete: true },
      { data: (product as any).primary_image_url ? [(product as any).primary_image_url] : [], name: 'primary', canDelete: true },
      { data: (product as any).supplier_images, name: 'supplier', canDelete: true },
      { data: (product as any).images, name: 'images', canDelete: false },
      { data: (product as any).image_urls, name: 'image_urls', canDelete: false },
      { data: (product as any).listing_data?.image_urls, name: 'listing', canDelete: false },
    ];

    imageSources.forEach((source) => {
      if (!source.data) return;

      if (Array.isArray(source.data)) {
        source.data.forEach((img, idx) => {
          if (typeof img === 'string') {
            addImage(img, source.name, idx, source.canDelete);
          } else if (typeof img === 'object' && img !== null) {
            addImage(img.url || img.original || img.src, source.name, idx, source.canDelete);
          }
        });
      } else if (typeof source.data === 'string') {
        addImage(source.data, source.name, 0, source.canDelete);
      }
    });

    return images;
  // deletedUrlsを依存配列に追加
  }, [JSON.stringify({
    id: product?.id,
    manual_images: (product as any)?.manual_images,
    listing_images: (product as any)?.listing_images,
    gallery_images: (product as any)?.gallery_images,
    primary_image_url: (product as any)?.primary_image_url,
    supplier_images: (product as any)?.supplier_images,
    images: (product as any)?.images,
    image_urls: (product as any)?.image_urls,
    listing_data_images: (product as any)?.listing_data?.image_urls,
  }), deletedUrls.size]); // deletedUrls.sizeを依存配列に追加

  // 商品IDが変わった時のみ選択状態を初期化
  useEffect(() => {
    const currentProductId = product?.id;
    
    // 商品IDが変わっていない場合は何もしない
    if (currentProductId === prevProductIdRef.current) {
      return;
    }
    
    prevProductIdRef.current = currentProductId;
    
    // 商品が変わったら削除済みURLをリセット
    setDeletedUrls(new Set());
    
    if (!product) {
      setSelectedImageIds([]);
      return;
    }

    const existing = (product as any)?.listing_data?.image_urls || 
                     (product as any)?.listing_images || 
                     (product as any)?.gallery_images || [];
                     
    if (Array.isArray(existing) && existing.length > 0) {
      const imageMap = new Map<string, string>();
      availableImages.forEach(img => {
        imageMap.set(img.url, img.id);
      });
      
      const ids = existing
        .map((url: string) => imageMap.get(url))
        .filter(Boolean) as string[];
      setSelectedImageIds(ids);
    } else {
      setSelectedImageIds([]);
    }
  }, [product?.id, availableImages]);

  const toggleImage = useCallback((imageId: string) => {
    setSelectedImageIds(prev => {
      if (prev.includes(imageId)) {
        return prev.filter(id => id !== imageId);
      } else {
        if (prev.length >= maxImages) {
          alert(`${marketplace.toUpperCase()}では最大${maxImages}枚まで`);
          return prev;
        }
        return [...prev, imageId];
      }
    });
  }, [maxImages, marketplace]);

  const selectAll = useCallback(() => {
    setSelectedImageIds(availableImages.slice(0, maxImages).map(img => img.id));
  }, [availableImages, maxImages]);

  const clearAll = useCallback(() => {
    setSelectedImageIds([]);
  }, []);

  /**
   * 画像アップロード処理
   */
  const handleUpload = useCallback(async (files: FileList | File[]) => {
    if (!product?.id) {
      alert('商品を選択してください');
      return;
    }

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`0/${fileArray.length} アップロード中...`);

    try {
      const formData = new FormData();
      fileArray.forEach(file => formData.append('files', file));
      formData.append('productId', String(product.id));
      formData.append('imageType', 'manual');

      const response = await fetch('/api/products/upload-image', {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setUploadProgress(`${result.uploaded}枚アップロード完了`);
        
        if (onRefresh) {
          onRefresh();
        }
        
        setTimeout(() => {
          setUploadProgress('');
          setIsUploading(false);
        }, 2000);
      } else {
        throw new Error(result.error || 'アップロードに失敗しました');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`アップロードエラー: ${error.message}`);
      setIsUploading(false);
      setUploadProgress('');
    }
  }, [product?.id, onRefresh]);

  /**
   * 画像削除処理
   */
  const handleDelete = useCallback(async (imageUrl: string) => {
    if (!product?.id) return;

    console.log('\n========== 画像削除開始 ==========')
    console.log('削除対象URL:', imageUrl)
    console.log('商品ID:', product.id)

    try {
      const response = await fetch('/api/products/upload-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          productId: product.id,
        }),
      });

      const result = await response.json();
      console.log('APIレスポンス:', result)

      if (result.success) {
        console.log('✅ 削除成功')
        
        // 🔥 削除済みURLをローカルステートに追加（即時UI更新）
        setDeletedUrls(prev => new Set([...prev, imageUrl]));
        
        // 選択から削除
        const imgToRemove = availableImages.find(img => img.url === imageUrl);
        if (imgToRemove) {
          setSelectedImageIds(prev => prev.filter(id => id !== imgToRemove.id));
        }
        
        // 親コンポーネントに更新を通知
        if (onRefresh) {
          onRefresh();
        }
        
        setDeleteConfirm(null);
      } else {
        throw new Error(result.error || '削除に失敗しました');
      }
    } catch (error: any) {
      console.error('❌ Delete error:', error);
      alert(`削除エラー: ${error.message}`);
    }
    
    console.log('========== 画像削除終了 ==========\n')
  }, [product?.id, availableImages, onRefresh]);

  /**
   * ドラッグ&ドロップハンドラ
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const imageFiles = Array.from(files).filter(file => 
        file.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        handleUpload(imageFiles);
      } else {
        alert('画像ファイルのみアップロードできます');
      }
    }
  }, [handleUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
    e.target.value = '';
  }, [handleUpload]);

  const handleSave = useCallback(async () => {
    const urls = availableImages
      .filter(img => selectedImageIds.includes(img.id))
      .map(img => img.url);
    
    if (product?.id) {
      try {
        // ⚠️ 重要: 複数のカラムを同時に更新
        const updates: Record<string, any> = {
          listing_images: urls,
          gallery_images: urls,
          // 🔥 primary_image_urlを最初の画像に設定（リスト画面のサムネイル用）
          primary_image_url: urls.length > 0 ? urls[0] : null,
          // 🔥 listing_data内の画像情報も更新
          listing_data: {
            ...(product as any)?.listing_data,
            image_urls: urls,
            image_count: urls.length,
            image_settings: imageSettings,
            primary_image: urls.length > 0 ? urls[0] : null,
          }
        };
        
        console.log('💾 画像保存開始:', {
          productId: product.id,
          imageCount: urls.length,
          primaryImage: urls[0]?.substring(0, 50) + '...',
          updates: Object.keys(updates)
        });
        
        const response = await fetch('/api/products/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: product.id,
            updates
          })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          console.log('✅ 画像保存成功');
          alert(`✓ ${urls.length}枚の画像を保存しました`);
          
          // 親コンポーネントに通知
          if (onSave) {
            onSave({ 
              listing_images: urls,
              primary_image_url: urls[0] || null,
              gallery_images: urls
            });
          }
          
          // リフレッシュ
          if (onRefresh) {
            onRefresh();
          }
        } else {
          throw new Error(result.error || '保存に失敗しました');
        }
      } catch (error: any) {
        console.error('❌ 保存エラー:', error);
        alert(`保存エラー: ${error.message}`);
      }
    }
  }, [availableImages, selectedImageIds, product, imageSettings, onSave, onRefresh]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品データがありません</div>;
  }

  return (
    <div style={{ padding: '1rem', background: T.bg, height: '100%', overflow: 'auto' }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: T.text }}>
          <i className="fas fa-images" style={{ marginRight: '0.375rem' }}></i>
          Image Selection
        </div>
        <div style={{
          padding: '0.25rem 0.5rem',
          fontSize: '10px',
          fontWeight: 600,
          borderRadius: '4px',
          background: `${T.accent}20`,
          color: T.accent,
        }}>
          {marketplace.toUpperCase()}: Max {maxImages}
        </div>
      </div>

      {/* ドラッグ&ドロップエリア */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          padding: '1rem',
          marginBottom: '0.75rem',
          borderRadius: '6px',
          border: `2px dashed ${isDragOver ? T.accent : T.panelBorder}`,
          background: isDragOver ? `${T.accent}10` : T.panel,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        {isUploading ? (
          <div>
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2" style={{ borderColor: T.accent }}></div>
            <div style={{ fontSize: '11px', color: T.accent, fontWeight: 600 }}>{uploadProgress}</div>
          </div>
        ) : (
          <>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '1.5rem', color: isDragOver ? T.accent : T.textMuted, marginBottom: '0.25rem', display: 'block' }}></i>
            <div style={{ fontSize: '10px', color: T.textMuted }}>
              ドラッグ&ドロップまたはクリックで画像を追加
            </div>
            <div style={{ fontSize: '9px', color: T.textSubtle, marginTop: '0.25rem' }}>
              JPEG, PNG, GIF, WebP（最大10MB）
            </div>
          </>
        )}
      </div>

      {/* 2カラムレイアウト */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        
        {/* 左: 取得済み画像 */}
        <div style={{ padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle }}>
              Available ({availableImages.length})
            </span>
            <button onClick={selectAll} style={{
              padding: '0.2rem 0.5rem',
              fontSize: '9px',
              fontWeight: 600,
              borderRadius: '4px',
              border: 'none',
              background: T.accent,
              color: '#fff',
              cursor: 'pointer',
            }}>
              Select All
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
            {availableImages.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', color: T.textMuted, fontSize: '11px' }}>
                <i className="fas fa-image" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                No images
              </div>
            ) : (
              availableImages.map((img, idx) => {
                const isSelected = selectedImageIds.includes(img.id);
                return (
                  <div
                    key={img.id}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: `2px solid ${isSelected ? T.success : T.panelBorder}`,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <img 
                      src={img.url} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onClick={() => toggleImage(img.id)}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      padding: '1px 4px',
                      fontSize: '8px',
                      fontWeight: 700,
                      borderRadius: '2px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                    }}>
                      {idx + 1}
                    </div>
                    {/* ソースバッジ */}
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '2px',
                      padding: '1px 3px',
                      fontSize: '7px',
                      fontWeight: 600,
                      borderRadius: '2px',
                      background: img.source === 'manual' ? T.success : 
                                  img.source === 'supplier' ? T.warning : 
                                  'rgba(0,0,0,0.6)',
                      color: '#fff',
                    }}>
                      {img.source.substring(0, 3).toUpperCase()}
                    </div>
                    {/* 削除ボタン */}
                    {img.canDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(img.url);
                        }}
                        style={{
                          position: 'absolute',
                          top: '2px',
                          right: '2px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          border: 'none',
                          background: T.error,
                          color: '#fff',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0.8,
                        }}
                      >
                        ×
                      </button>
                    )}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: T.success,
                        fontSize: '1.25rem',
                        textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                      }}>
                        <i className="fas fa-check-circle"></i>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 右: 選択済み + 設定 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* 選択済み画像 */}
          <div style={{ padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle }}>
                Selected ({selectedImageIds.length}/{maxImages})
              </span>
              <button onClick={clearAll} style={{
                padding: '0.2rem 0.5rem',
                fontSize: '9px',
                fontWeight: 600,
                borderRadius: '4px',
                border: 'none',
                background: T.error,
                color: '#fff',
                cursor: 'pointer',
              }}>
                Clear
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
              {selectedImageIds.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center', color: T.textMuted, fontSize: '10px' }}>
                  Select images from left
                </div>
              ) : (
                selectedImageIds.map((imgId, idx) => {
                  const img = availableImages.find(i => i.id === imgId);
                  if (!img) return null;
                  return (
                    <div key={imgId} style={{
                      aspectRatio: '1',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: `2px solid ${T.success}`,
                      position: 'relative',
                    }}>
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        top: '2px',
                        left: '2px',
                        padding: '1px 4px',
                        fontSize: '8px',
                        fontWeight: 700,
                        borderRadius: '2px',
                        background: T.success,
                        color: '#fff',
                      }}>
                        {idx + 1}
                      </div>
                      {idx === 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          padding: '1px 4px',
                          fontSize: '7px',
                          fontWeight: 700,
                          borderRadius: '2px',
                          background: T.accent,
                          color: '#fff',
                        }}>
                          MAIN
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 画像処理設定 */}
          <div style={{ padding: '0.75rem', borderRadius: '6px', background: T.panel, border: `1px solid ${T.panelBorder}` }}>
            <div style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 600, color: T.textSubtle, marginBottom: '0.5rem' }}>
              Processing Options
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <Checkbox label="Resize to 1600x1600px" checked={imageSettings.resize} onChange={(v) => setImageSettings(p => ({ ...p, resize: v }))} />
              <Checkbox label="Optimize file size" checked={imageSettings.optimize} onChange={(v) => setImageSettings(p => ({ ...p, optimize: v }))} />
              <Checkbox label="Add watermark" checked={imageSettings.watermark} onChange={(v) => setImageSettings(p => ({ ...p, watermark: v }))} />
            </div>
          </div>

          {/* 凡例 */}
          <div style={{ padding: '0.5rem 0.75rem', borderRadius: '6px', background: T.highlight, fontSize: '9px' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem', color: T.text }}>Image Sources:</div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', color: T.textMuted }}>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: T.success, marginRight: '3px' }}></span>Manual</span>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: T.warning, marginRight: '3px' }}></span>Supplier</span>
              <span><span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '2px', background: 'rgba(0,0,0,0.6)', marginRight: '3px' }}></span>Other</span>
            </div>
          </div>

          {/* 保存ボタン */}
          <button onClick={handleSave} style={{
            padding: '0.5rem 1rem',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '4px',
            border: 'none',
            background: '#1e293b',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
          }}>
            <i className="fas fa-save"></i> Save Images
          </button>
        </div>
      </div>

      {/* 削除確認モーダル */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: T.panel,
            padding: '1.5rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '1rem', color: T.text }}>
              画像を削除しますか？
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <img 
                src={deleteConfirm} 
                alt="" 
                style={{ 
                  width: '100%', 
                  maxHeight: '150px', 
                  objectFit: 'contain',
                  borderRadius: '4px',
                  background: T.bg,
                }} 
              />
            </div>
            <div style={{ fontSize: '10px', color: T.textMuted, marginBottom: '1rem' }}>
              この操作は取り消せません。Supabase Storageからも削除されます。
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: `1px solid ${T.panelBorder}`,
                  background: T.panel,
                  color: T.text,
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '11px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  border: 'none',
                  background: T.error,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer', fontSize: '10px', color: T.text }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ margin: 0 }} />
      {label}
    </label>
  );
}
