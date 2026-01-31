// app/tools/editing-n3/components/l3-tabs/MediaTab/image-management-panel.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, Download, Eye, Check, X } from 'lucide-react';
import { N3Button, N3Input, N3Checkbox } from '@/components/n3';

interface ImageItem {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  productId?: string;
  productSku?: string;
}

export function ImageManagementPanel() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      // 実際の画像データAPIを呼び出し
      const res = await fetch('/api/images/list?limit=100');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.images) {
          setImages(data.images.map((img: any) => ({
            id: img.id || img.image_id || String(Math.random()),
            url: img.url || img.image_url || img.primary_image_url,
            filename: img.filename || img.original_filename || 'image.jpg',
            size: img.size || img.file_size || 0,
            uploadedAt: img.uploaded_at || img.created_at || new Date().toISOString(),
            productId: img.product_id,
            productSku: img.sku || img.product_sku,
          })));
        } else {
          // APIが空の場合
          setImages([]);
        }
      } else {
        console.error('Failed to load images:', res.status);
        setImages([]);
      }
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
    }
    setLoading(false);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredImages.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredImages.map(img => img.id)));
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`${selectedIds.size}件の画像を削除しますか？`)) return;
    setImages(images.filter(img => !selectedIds.has(img.id)));
    setSelectedIds(new Set());
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const filteredImages = images.filter(img => 
    !searchQuery || 
    img.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
    img.productSku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ツールバー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <N3Input
          placeholder="ファイル名またはSKUで検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          style={{ width: 250 }}
        />
        
        <div style={{ flex: 1 }} />
        
        <N3Button size="sm" variant="primary" onClick={() => alert('アップロード機能')}>
          <Upload size={14} />
          アップロード
        </N3Button>
        
        <N3Button size="sm" variant="secondary" onClick={loadImages} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          更新
        </N3Button>
        
        {selectedIds.size > 0 && (
          <N3Button size="sm" variant="ghost" onClick={deleteSelected} style={{ color: 'rgb(239, 68, 68)' }}>
            <Trash2 size={14} />
            選択削除 ({selectedIds.size})
          </N3Button>
        )}
      </div>

      {/* 統計 */}
      <div style={{
        display: 'flex',
        gap: 24,
        padding: 12,
        background: 'var(--highlight)',
        borderRadius: 8,
        fontSize: 13,
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>総画像数:</span>{' '}
          <strong>{images.length}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>総サイズ:</span>{' '}
          <strong>{formatSize(images.reduce((sum, img) => sum + img.size, 0))}</strong>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>商品紐付け済み:</span>{' '}
          <strong>{images.filter(img => img.productSku).length}</strong>
        </div>
      </div>

      {/* 選択ヘッダー */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '8px 12px',
        background: 'var(--panel)',
        borderRadius: 6,
        border: '1px solid var(--panel-border)',
      }}>
        <N3Checkbox
          checked={selectedIds.size === filteredImages.length && filteredImages.length > 0}
          onChange={selectAll}
        />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {selectedIds.size > 0 ? `${selectedIds.size}件選択中` : '全選択'}
        </span>
      </div>

      {/* 画像グリッド */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 12,
        alignContent: 'start',
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            読み込み中...
          </div>
        ) : filteredImages.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div>画像がありません</div>
          </div>
        ) : (
          filteredImages.map(img => (
            <div
              key={img.id}
              style={{
                position: 'relative',
                background: 'var(--panel)',
                borderRadius: 8,
                border: `2px solid ${selectedIds.has(img.id) ? 'rgb(59, 130, 246)' : 'var(--panel-border)'}`,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => toggleSelect(img.id)}
            >
              {/* チェックボックス */}
              <div style={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 10,
                background: 'white',
                borderRadius: 4,
                padding: 2,
              }}>
                <N3Checkbox
                  checked={selectedIds.has(img.id)}
                  onChange={() => toggleSelect(img.id)}
                />
              </div>
              
              {/* プレビューボタン */}
              <button
                onClick={(e) => { e.stopPropagation(); setPreviewImage(img); }}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  zIndex: 10,
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  borderRadius: 4,
                  padding: 6,
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <Eye size={14} />
              </button>
              
              {/* 画像 */}
              <div style={{ aspectRatio: '1', overflow: 'hidden' }}>
                <img
                  src={img.url}
                  alt={img.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              
              {/* 情報 */}
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {img.filename}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
                  <span>{formatSize(img.size)}</span>
                  <span>{img.productSku || '未紐付け'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* プレビューモーダル */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage.url}
            alt={previewImage.filename}
            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
          />
          <button
            onClick={() => setPreviewImage(null)}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
