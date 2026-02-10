'use client';

/**
 * TabImagesDomestic - 国内販路用画像タブ
 * Qoo10: 最大10枚、ストック画像対応
 */

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

const T = {
  bg: '#F1F5F9', panel: '#ffffff', panelBorder: '#e2e8f0', highlight: '#f1f5f9',
  text: '#1e293b', textMuted: '#64748b', textSubtle: '#94a3b8', accent: '#ff0066',
  success: '#10b981', warning: '#f59e0b', error: '#ef4444', blue: '#3b82f6',
};

const MAX_IMAGES: Record<string, number> = {
  'qoo10-jp': 10, 'amazon-jp': 9, 'yahoo-auction': 10, 'mercari': 10,
};

export interface TabImagesDomesticProps {
  product: Product | null;
  marketplace?: string;
  onSave?: (updates: any) => void;
}

export function TabImagesDomestic({ product, marketplace = 'qoo10-jp', onSave }: TabImagesDomesticProps) {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [stockImagePosition, setStockImagePosition] = useState(2); // 2枚目
  const [stockImageUrl, setStockImageUrl] = useState('');
  const maxImages = MAX_IMAGES[marketplace] || 10;

  useEffect(() => {
    if (product) {
      const images = product.images?.map(img => img.url) || [];
      setAvailableImages(images);
      setSelectedImages(product.selectedImages || images.slice(0, maxImages));
    }
  }, [product, maxImages]);

  // 画像選択/解除
  const toggleImage = useCallback((url: string) => {
    setSelectedImages(prev => {
      if (prev.includes(url)) {
        return prev.filter(u => u !== url);
      } else if (prev.length < maxImages) {
        return [...prev, url];
      } else {
        toast.error(`最大${maxImages}枚までです`);
        return prev;
      }
    });
  }, [maxImages]);

  // 順番入れ替え
  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    setSelectedImages(prev => {
      const newArr = [...prev];
      const [removed] = newArr.splice(fromIndex, 1);
      newArr.splice(toIndex, 0, removed);
      return newArr;
    });
  }, []);

  // ストック画像挿入
  const insertStockImage = useCallback(() => {
    if (!stockImageUrl) {
      toast.error('ストック画像URLを入力してください');
      return;
    }
    setSelectedImages(prev => {
      if (prev.length >= maxImages) {
        toast.error(`最大${maxImages}枚までです`);
        return prev;
      }
      const newArr = [...prev];
      const position = Math.min(stockImagePosition - 1, newArr.length);
      newArr.splice(position, 0, stockImageUrl);
      return newArr;
    });
    toast.success(`${stockImagePosition}枚目にストック画像を挿入しました`);
  }, [stockImageUrl, stockImagePosition, maxImages]);

  // 保存
  const handleSave = useCallback(() => {
    onSave?.({ selectedImages, domestic_images: selectedImages });
    toast.success('画像設定を保存しました');
  }, [selectedImages, onSave]);

  if (!product) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: T.textMuted }}>商品を選択してください</div>;
  }

  return (
    <div style={{ padding: '1rem', overflow: 'auto', background: T.bg }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '0.75rem', background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-images" style={{ color: T.blue }}></i>
          <span style={{ fontWeight: 600, fontSize: '14px', color: T.text }}>画像設定（{marketplace.toUpperCase()}）</span>
          <span style={{ padding: '0.125rem 0.375rem', background: T.highlight, borderRadius: '4px', fontSize: '10px', color: T.textMuted }}>{selectedImages.length} / {maxImages}</span>
        </div>
        <button onClick={handleSave} style={{ padding: '0.5rem 1rem', fontSize: '11px', fontWeight: 600, borderRadius: '4px', border: 'none', background: T.success, color: 'white', cursor: 'pointer' }}><i className="fas fa-save"></i> 保存</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* 左: 選択済み画像（並び替え可能） */}
        <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.75rem' }}>選択済み（出品順）</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {[...Array(maxImages)].map((_, i) => (
              <div key={i} style={{ aspectRatio: '1', borderRadius: '4px', border: `2px dashed ${selectedImages[i] ? T.success : T.panelBorder}`, background: selectedImages[i] ? 'white' : T.highlight, position: 'relative', overflow: 'hidden' }}>
                {selectedImages[i] ? (
                  <>
                    <img src={selectedImages[i]} alt={`選択${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '2px', left: '2px', background: i === 0 ? T.accent : T.blue, color: 'white', fontSize: '8px', padding: '1px 4px', borderRadius: '2px' }}>{i === 0 ? 'メイン' : i + 1}</div>
                    <button onClick={() => toggleImage(selectedImages[i])} style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', borderRadius: '50%', border: 'none', background: T.error, color: 'white', fontSize: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    {i > 0 && <button onClick={() => moveImage(i, i - 1)} style={{ position: 'absolute', bottom: '2px', left: '2px', width: '14px', height: '14px', borderRadius: '2px', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '8px', cursor: 'pointer' }}>←</button>}
                    {i < selectedImages.length - 1 && <button onClick={() => moveImage(i, i + 1)} style={{ position: 'absolute', bottom: '2px', right: '2px', width: '14px', height: '14px', borderRadius: '2px', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '8px', cursor: 'pointer' }}>→</button>}
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.textSubtle, fontSize: '10px' }}>{i + 1}</div>
                )}
              </div>
            ))}
          </div>

          {/* ストック画像挿入 */}
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: T.highlight, borderRadius: '6px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: T.textMuted, marginBottom: '0.5rem' }}>ストック画像挿入</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '9px', color: T.textMuted, marginBottom: '0.25rem' }}>画像URL</label>
                <input type="url" value={stockImageUrl} onChange={(e) => setStockImageUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: '0.375rem 0.5rem', fontSize: '10px', borderRadius: '4px', border: `1px solid ${T.panelBorder}`, background: 'white' }} />
              </div>
              <div style={{ width: '60px' }}>
                <label style={{ display: 'block', fontSize: '9px', color: T.textMuted, marginBottom: '0.25rem' }}>位置</label>
                <select value={stockImagePosition} onChange={(e) => setStockImagePosition(Number(e.target.value))} style={{ width: '100%', padding: '0.375rem', fontSize: '10px', borderRadius: '4px', border: `1px solid ${T.panelBorder}`, background: 'white' }}>
                  {[...Array(maxImages)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}枚目</option>)}
                </select>
              </div>
              <button onClick={insertStockImage} style={{ padding: '0.375rem 0.75rem', fontSize: '10px', fontWeight: 600, borderRadius: '4px', border: 'none', background: T.accent, color: 'white', cursor: 'pointer', whiteSpace: 'nowrap' }}>挿入</button>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '9px', color: T.textMuted }}><i className="fas fa-info-circle"></i> 品質保証マーク等を特定位置に挿入できます（推奨: 2枚目）</div>
          </div>
        </div>

        {/* 右: 利用可能な画像 */}
        <div style={{ background: T.panel, borderRadius: '6px', border: `1px solid ${T.panelBorder}`, padding: '0.75rem' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', color: T.textMuted, marginBottom: '0.75rem' }}>利用可能な画像</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', maxHeight: '400px', overflow: 'auto' }}>
            {availableImages.map((url, i) => {
              const isSelected = selectedImages.includes(url);
              return (
                <button key={i} onClick={() => toggleImage(url)} style={{ aspectRatio: '1', borderRadius: '4px', border: `2px solid ${isSelected ? T.success : T.panelBorder}`, background: 'white', padding: 0, cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
                  <img src={url} alt={`画像${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSelected ? 0.5 : 1 }} />
                  {isSelected && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(16,185,129,0.3)' }}><i className="fas fa-check" style={{ color: 'white', fontSize: '20px' }}></i></div>}
                </button>
              );
            })}
          </div>
          {availableImages.length === 0 && (
            <div style={{ textAlign: 'center', color: T.textMuted, padding: '2rem' }}>
              <i className="fas fa-image" style={{ fontSize: '24px', marginBottom: '0.5rem' }}></i>
              <div style={{ fontSize: '11px' }}>画像がありません</div>
            </div>
          )}
        </div>
      </div>

      {/* 注意事項 */}
      <div style={{ marginTop: '1rem', padding: '0.75rem', background: `${T.warning}10`, borderRadius: '6px', border: `1px solid ${T.warning}` }}>
        <div style={{ fontSize: '10px', color: T.warning }}><i className="fas fa-exclamation-triangle"></i> <strong>Qoo10画像ガイドライン:</strong></div>
        <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0, fontSize: '10px', color: T.textMuted }}>
          <li>推奨サイズ: 1000×1000px（正方形）</li>
          <li>メイン画像は白背景推奨</li>
          <li>最大{maxImages}枚まで</li>
        </ul>
      </div>
    </div>
  );
}

export default TabImagesDomestic;
