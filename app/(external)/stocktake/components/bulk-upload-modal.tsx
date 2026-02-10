// app/(external)/stocktake/components/bulk-upload-modal.tsx
/**
 * 外注用 画像一括アップロードモーダル
 * 
 * 機能:
 * - フォルダ選択: フォルダ内のサブフォルダごとに1商品（複数画像対応）
 * - ZIP一括: ZIPファイルを解凍して同様に処理
 * - 個別画像: 1画像 = 1商品
 */

'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  FolderOpen,
  FileArchive,
  Camera,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { STORAGE_LOCATIONS } from '../hooks/use-stocktake';

type UploadMode = 'single' | 'folder' | 'zip';

interface UploadResults {
  success: boolean;
  registered: number;
  failed: number;
  totalImages: number;
  products: Array<{
    id: string;
    sku: string;
    productName: string;
    imageCount: number;
    images: string[];
  }>;
  errors: Array<{ folderName: string; error: string }>;
}

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BulkUploadModal({ isOpen, onClose, onSuccess }: BulkUploadModalProps) {
  const [uploadMode, setUploadMode] = useState<UploadMode>('folder');
  const [files, setFiles] = useState<File[]>([]);
  const [relativePaths, setRelativePaths] = useState<string[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [skuPrefix, setSkuPrefix] = useState('PLUS1');
  const [storageLocation, setStorageLocation] = useState('plus1');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResults | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const folderPreview = useMemo(() => {
    if (uploadMode === 'zip' && zipFile) {
      return [{ name: zipFile.name, count: 1, isZip: true }];
    }
    
    if (files.length === 0) return [];
    
    const folders = new Map<string, number>();
    
    for (let i = 0; i < files.length; i++) {
      const path = relativePaths[i] || files[i].name;
      const parts = path.split('/').filter(p => p);
      
      let folderName: string;
      if (parts.length <= 1) {
        folderName = `個別_${files[i].name.replace(/\.[^/.]+$/, '')}`;
      } else {
        folderName = parts.length >= 2 ? parts[1] : parts[0];
      }
      
      if (folderName.startsWith('.') || folderName.startsWith('__')) continue;
      
      folders.set(folderName, (folders.get(folderName) || 0) + 1);
    }
    
    return Array.from(folders.entries()).map(([name, count]) => ({ name, count, isZip: false }));
  }, [files, relativePaths, zipFile, uploadMode]);

  const handleFolderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      const paths = newFiles.map(f => (f as any).webkitRelativePath || f.name);
      setFiles(newFiles);
      setRelativePaths(paths);
      setZipFile(null);
    }
  }, []);

  const handleZipChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setZipFile(e.target.files[0]);
      setFiles([]);
      setRelativePaths([]);
    }
  }, []);

  const handleSingleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
      setRelativePaths(prev => [...prev, ...newFiles.map(f => f.name)]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const zip = droppedFiles.find(f => f.name.endsWith('.zip'));
    if (zip) {
      setUploadMode('zip');
      setZipFile(zip);
      setFiles([]);
      setRelativePaths([]);
      return;
    }
    
    const imageFiles = droppedFiles.filter(f => f.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setFiles(prev => [...prev, ...imageFiles]);
      setRelativePaths(prev => [...prev, ...imageFiles.map(f => f.name)]);
    }
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setRelativePaths([]);
    setZipFile(null);
    setResults(null);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0 && !zipFile) return;

    setUploading(true);
    setResults(null);

    try {
      const formData = new FormData();
      
      if (zipFile) {
        formData.append('zip', zipFile);
      } else {
        files.forEach((file, i) => {
          formData.append('files', file);
          formData.append('relativePaths', relativePaths[i] || file.name);
        });
      }
      
      formData.append('skuPrefix', skuPrefix);
      formData.append('storageLocation', storageLocation);
      formData.append('inventoryType', 'stock');

      const response = await fetch('/api/inventory/bulk-upload-folder', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        if (data.failed === 0) {
          clearAll();
          onSuccess?.();
        }
      } else {
        setResults({
          success: false,
          registered: 0,
          failed: 1,
          totalImages: 0,
          products: [],
          errors: [{ folderName: 'all', error: data.error || 'アップロード失敗' }]
        });
      }
    } catch (error: any) {
      setResults({
        success: false,
        registered: 0,
        failed: 1,
        totalImages: 0,
        products: [],
        errors: [{ folderName: 'all', error: error.message || 'エラー' }]
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'white',
          borderRadius: '16px',
          overflow: 'hidden',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div style={{ background: '#22c55e', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Upload size={22} />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700 }}>画像一括登録</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>フォルダ・ZIP対応</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
            <X size={18} />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ padding: '16px', overflowY: 'auto', flex: 1 }}>
          {/* モード選択 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[
              { mode: 'folder' as UploadMode, icon: FolderOpen, label: 'フォルダ', color: '#3b82f6' },
              { mode: 'zip' as UploadMode, icon: FileArchive, label: 'ZIP', color: '#f59e0b' },
              { mode: 'single' as UploadMode, icon: Camera, label: '個別', color: '#8b5cf6' },
            ].map(({ mode, icon: Icon, label, color }) => (
              <button
                key={mode}
                onClick={() => { setUploadMode(mode); clearAll(); }}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: '10px',
                  border: uploadMode === mode ? `2px solid ${color}` : '2px solid #e5e7eb',
                  background: uploadMode === mode ? `${color}10` : 'white',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <Icon size={20} style={{ color: uploadMode === mode ? color : '#9ca3af', margin: '0 auto 4px' }} />
                <div style={{ fontSize: '12px', fontWeight: 600, color: uploadMode === mode ? color : '#6b7280' }}>{label}</div>
              </button>
            ))}
          </div>

          {/* 説明 */}
          <div style={{ padding: '12px', borderRadius: '10px', background: '#f0fdf4', marginBottom: '16px', fontSize: '12px', color: '#166534' }}>
            {uploadMode === 'folder' && (
              <>
                <strong>📁 フォルダ選択</strong>
                <div style={{ marginTop: '4px', fontFamily: 'monospace', fontSize: '11px', background: 'white', padding: '8px', borderRadius: '6px' }}>
                  親フォルダ/<br/>
                  ├─ 商品A/ (2枚) → 1商品<br/>
                  ├─ 商品B/ (1枚) → 1商品<br/>
                  └─ 商品C/ (3枚) → 1商品
                </div>
              </>
            )}
            {uploadMode === 'zip' && <><strong>📦 ZIP形式:</strong> フォルダ構造のZIPをアップロード</>}
            {uploadMode === 'single' && <><strong>📷 個別画像:</strong> 1枚 = 1商品として登録</>}
          </div>

          {/* 設定 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block' }}>SKUプレフィックス</label>
              <input
                type="text"
                value={skuPrefix}
                onChange={(e) => setSkuPrefix(e.target.value.toUpperCase())}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', display: 'block' }}>保管場所</label>
              <select
                value={storageLocation}
                onChange={(e) => setStorageLocation(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
              >
                {STORAGE_LOCATIONS.map(loc => (
                  <option key={loc.value} value={loc.value}>{loc.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ドロップゾーン */}
          <div
            style={{
              border: `2px dashed ${dragOver ? '#3b82f6' : '#d1d5db'}`,
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              marginBottom: '16px',
              background: dragOver ? 'rgba(59, 130, 246, 0.05)' : '#f9fafb',
              cursor: 'pointer',
            }}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
            onClick={() => {
              if (uploadMode === 'folder') folderInputRef.current?.click();
              else if (uploadMode === 'zip') zipInputRef.current?.click();
              else fileInputRef.current?.click();
            }}
          >
            <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleSingleChange} style={{ display: 'none' }} />
            <input type="file" ref={folderInputRef} {...{ webkitdirectory: '', directory: '' } as any} onChange={handleFolderChange} style={{ display: 'none' }} />
            <input type="file" ref={zipInputRef} accept=".zip" onChange={handleZipChange} style={{ display: 'none' }} />
            
            <Upload size={32} style={{ color: '#9ca3af', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              {uploadMode === 'folder' ? 'フォルダを選択' : uploadMode === 'zip' ? 'ZIPを選択' : '画像を選択'}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>またはドラッグ&ドロップ</div>
          </div>

          {/* プレビュー */}
          {folderPreview.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                  検出: {folderPreview.length}商品
                </span>
                <button onClick={clearAll} style={{ fontSize: '11px', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Trash2 size={12} />クリア
                </button>
              </div>
              <div style={{ maxHeight: '120px', overflowY: 'auto', background: '#f3f4f6', borderRadius: '8px', padding: '8px' }}>
                {folderPreview.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', background: 'white', borderRadius: '6px', marginBottom: '4px' }}>
                    {item.isZip ? <FileArchive size={14} style={{ color: '#f59e0b' }} /> : <FolderOpen size={14} style={{ color: '#3b82f6' }} />}
                    <span style={{ flex: 1, fontSize: '12px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                    {!item.isZip && <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a' }}>{item.count}枚</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アップロードボタン */}
          <button
            onClick={handleUpload}
            disabled={uploading || (files.length === 0 && !zipFile)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: (files.length === 0 && !zipFile) ? '#d1d5db' : '#22c55e',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: (files.length === 0 && !zipFile) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {uploading ? (
              <>処理中...</>
            ) : (
              <>
                <Upload size={18} />
                {folderPreview.length}商品を一括登録
              </>
            )}
          </button>

          {/* 結果 */}
          {results && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: results.failed === 0 ? '#f0fdf4' : '#fef3c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {results.failed === 0 ? <CheckCircle size={18} style={{ color: '#22c55e' }} /> : <AlertCircle size={18} style={{ color: '#f59e0b' }} />}
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  成功: {results.registered}商品 ({results.totalImages}画像)
                </span>
              </div>
              {results.products.slice(0, 3).map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px', background: 'white', borderRadius: '6px', marginBottom: '4px' }}>
                  {p.images[0] ? <img src={p.images[0]} alt="" style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '4px' }} /> : <ImageIcon size={16} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e' }}>{p.sku}</div>
                    <div style={{ fontSize: '10px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.productName}</div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#3b82f6' }}>{p.imageCount}枚</span>
                </div>
              ))}
              {results.products.length > 3 && (
                <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center', marginTop: '4px' }}>
                  他 {results.products.length - 3}件...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
