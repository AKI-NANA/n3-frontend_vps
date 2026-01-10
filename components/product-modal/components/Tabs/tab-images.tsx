'use client';

// TabImages - V8.3
// デザインシステムV4準拠
// 機能: 画像選択、順序設定、処理設定、DB保存 - 全て維持

import { useState, useEffect } from 'react';
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
}

export function TabImages({ product, maxImages, marketplace, onSave }: TabImagesProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageSettings, setImageSettings] = useState({
    resize: true,
    optimize: true,
    watermark: false,
  });

  /**
   * 重複なしで全画像を取得
   * URL正規化（クエリパラメータ除去）で重複判定
   */
  const getAvailableImages = () => {
    if (!product) return [];

    const images: { id: string; url: string; source: string }[] = [];
    const seen = new Set<string>();  // 正規化URLで重複チェック

    /**
     * URLを正規化してユニークキーを生成
     * クエリパラメータを除去し、小文字化
     */
    const normalizeUrl = (url: string): string => {
      try {
        const parsed = new URL(url);
        // クエリパラメータを除去
        return `${parsed.origin}${parsed.pathname}`.toLowerCase();
      } catch {
        // URLパースに失敗した場合はそのまま小文字化
        return url.split('?')[0].toLowerCase();
      }
    };

    /**
     * 画像を追加（重複チェック付き）
     */
    const addImage = (url: string | undefined | null, source: string, idx: number) => {
      if (!url || typeof url !== 'string') return;
      if (!url.startsWith('http')) return;

      const normalizedUrl = normalizeUrl(url);

      if (!seen.has(normalizedUrl)) {
        seen.add(normalizedUrl);
        images.push({
          id: `${source}-${idx}`,
          url: url,  // 元のURLを保持
          source: source
        });
      }
    };

    // 画像ソースの優先順位（上から順に処理）
    const imageSources = [
      { data: (product as any).gallery_images, name: 'gallery' },
      { data: (product as any).primary_image_url ? [(product as any).primary_image_url] : [], name: 'primary' },
      { data: (product as any).images, name: 'images' },
      { data: (product as any).image_urls, name: 'image_urls' },
      { data: (product as any).scraped_data?.images, name: 'scraped' },
      { data: (product as any).listing_data?.image_urls, name: 'listing' },
      { data: (product as any).ebay_api_data?.images, name: 'ebay_api' },
      { data: (product as any).ebay_api_data?.PictureURL, name: 'ebay_picture' },
    ];

    imageSources.forEach((source) => {
      if (!source.data) return;

      // 配列の場合
      if (Array.isArray(source.data)) {
        source.data.forEach((img, idx) => {
          // 文字列の場合
          if (typeof img === 'string') {
            addImage(img, source.name, idx);
          }
          // オブジェクトの場合（{ url: '...' } or { original: '...' }）
          else if (typeof img === 'object' && img !== null) {
            addImage(img.url || img.original || img.src, source.name, idx);
          }
        });
      }
      // 単一の文字列の場合
      else if (typeof source.data === 'string') {
        addImage(source.data, source.name, 0);
      }
    });

    console.log(`[TabImages] 取得画像数: ${images.length}件（重複除去後）`);

    return images;
  };

  const availableImages = getAvailableImages();

  useEffect(() => {
    if (product) {
      const existing = (product as any)?.listing_data?.image_urls || [];
      if (Array.isArray(existing) && existing.length > 0) {
        const ids = existing
          .map((url: string) => availableImages.find(img => img.url === url)?.id)
          .filter(Boolean) as string[];
        setSelectedImages(ids);
      }
    }
  }, [product?.id]);

  const toggleImage = (imageId: string) => {
    setSelectedImages(prev => {
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
  };

  const selectAll = () => {
    setSelectedImages(availableImages.slice(0, maxImages).map(img => img.id));
  };

  const clearAll = () => {
    setSelectedImages([]);
  };

  const handleSave = async () => {
    const urls = availableImages.filter(img => selectedImages.includes(img.id)).map(img => img.url);
    
    if (product?.id) {
      try {
        const response = await fetch('/api/products/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: product.id,
            updates: {
              listing_data: {
                ...(product as any)?.listing_data,
                image_urls: urls,
                image_count: urls.length,
                image_settings: imageSettings,
              }
            }
          })
        });
        
        if (response.ok) {
          alert(`✓ ${urls.length}枚の画像を保存しました`);
        }
      } catch (error) {
        alert('保存エラー');
      }
    }
  };

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
                const isSelected = selectedImages.includes(img.id);
                return (
                  <div
                    key={img.id}
                    onClick={() => toggleImage(img.id)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      border: `2px solid ${isSelected ? T.success : T.panelBorder}`,
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                Selected ({selectedImages.length}/{maxImages})
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
              {selectedImages.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', padding: '1rem', textAlign: 'center', color: T.textMuted, fontSize: '10px' }}>
                  Select images from left
                </div>
              ) : (
                selectedImages.map((imgId, idx) => {
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

const T2 = T; // For TypeScript
