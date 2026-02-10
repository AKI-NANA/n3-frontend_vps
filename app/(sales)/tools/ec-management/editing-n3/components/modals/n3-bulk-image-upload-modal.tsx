// app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx
/**
 * N3BulkImageUploadModal (最終修正版)
 * 
 * 機能:
 * - バケット不一致修正に対応
 * - 画像URL保存処理の重複を排除し、Hookに一本化
 * - リスト即時反映のためのステータス更新を追加
 */

'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { 
  Upload, X, CheckCircle, AlertCircle, Image as ImageIcon,
  Trash2, FolderOpen, FileArchive, Camera, Loader2
} from 'lucide-react';
import { N3Button } from '@/components/n3';
import { useInventorySync } from '../../hooks/use-inventory-sync';
import { createClient } from '@/lib/supabase/client'; // 直接DB操作用
import JSZip from 'jszip';

type UploadMode = 'single' | 'folder' | 'zip';

interface ProcessedProduct {
  folderName: string;
  files: File[];
}

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
  }>;
  errors: Array<{ folderName: string; error: string }>;
}

interface N3BulkImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function N3BulkImageUploadModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: N3BulkImageUploadModalProps) {
  const [uploadMode, setUploadMode] = useState<UploadMode>('folder');
  const [files, setFiles] = useState<File[]>([]);
  const [relativePaths, setRelativePaths] = useState<string[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  
  const [skuPrefix, setSkuPrefix] = useState('PLUS1');
  const [storageLocation, setStorageLocation] = useState('plus1');
  const [inventoryType, setInventoryType] = useState<'stock' | 'mu' | 'dropship'>('stock');
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [results, setResults] = useState<UploadResults | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const inventorySync = useInventorySync();
  const supabase = createClient();

  // --- ファイル選択ハンドラ ---
  const handleSingleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
      setRelativePaths(prev => [...prev, ...newFiles.map(f => f.name)]);
    }
  }, []);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const items = e.dataTransfer.items;
    if (!items) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    const zip = droppedFiles.find(f => f.name.endsWith('.zip'));
    if (zip) {
      setUploadMode('zip');
      setZipFile(zip);
      setFiles([]);
      setRelativePaths([]);
    } else {
      const imageFiles = droppedFiles.filter(f => f.type.startsWith('image/'));
      if (imageFiles.length > 0) {
        if (uploadMode === 'zip') setUploadMode('single');
        setFiles(prev => [...prev, ...imageFiles]);
        setRelativePaths(prev => [...prev, ...imageFiles.map(f => f.name)]);
      }
    }
  }, [uploadMode]);

  const clearAll = useCallback(() => {
    setFiles([]);
    setRelativePaths([]);
    setZipFile(null);
    setResults(null);
    setProgress({ current: 0, total: 0, status: '' });
  }, []);

  // --- プレビュー生成 ---
  const previewData = useMemo(() => {
    if (uploadMode === 'zip' && zipFile) {
      return [{ name: zipFile.name, count: '解析待ち', isZip: true }];
    }
    const folders = new Map<string, number>();
    files.forEach((file, i) => {
      const path = relativePaths[i] || file.name;
      const parts = path.split('/').filter(p => p);
      let folderName = parts.length <= 1 
        ? `個別_${file.name.replace(/\.[^/.]+$/, '')}`
        : (parts.length >= 2 ? parts[1] : parts[0]);
      if (!folderName.startsWith('.') && !folderName.startsWith('__')) {
        folders.set(folderName, (folders.get(folderName) || 0) + 1);
      }
    });
    return Array.from(folders.entries()).map(([name, count]) => ({ name, count, isZip: false }));
  }, [files, relativePaths, zipFile, uploadMode]);

  // ▼ アップロード実行メイン処理
  const handleUpload = async () => {
    if (files.length === 0 && !zipFile) {
      alert('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setResults(null);
    setProgress({ current: 0, total: 0, status: '準備中...' });

    const processedGroups: ProcessedProduct[] = [];
    const currentResults: UploadResults = {
      success: true, registered: 0, failed: 0, totalImages: 0, products: [], errors: []
    };

    try {
      // 1. ファイルの準備（ZIP解凍 または フォルダグループ化）
      if (zipFile) {
        setProgress({ current: 0, total: 0, status: 'ZIPファイルを解凍中...' });
        const zip = new JSZip();
        const content = await zip.loadAsync(zipFile);
        const fileMap = new Map<string, File[]>();

        for (const [relativePath, fileEntry] of Object.entries(content.files)) {
          if (fileEntry.dir || fileEntry.name.startsWith('__') || fileEntry.name.includes('/.')) continue;
          const ext = fileEntry.name.split('.').pop()?.toLowerCase();
          if (!ext || !['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) continue;

          const parts = relativePath.split('/').filter(p => p);
          let folderName = parts.length <= 1 
            ? `個別_${fileEntry.name.replace(/\.[^/.]+$/, '')}`
            : (parts.length >= 2 ? parts[1] : parts[0]);

          const blob = await fileEntry.async('blob');
          const file = new File([blob], fileEntry.name.split('/').pop() || 'image.jpg', { type: `image/${ext === 'jpg' ? 'jpeg' : ext}` });

          if (!fileMap.has(folderName)) fileMap.set(folderName, []);
          fileMap.get(folderName)!.push(file);
        }
        fileMap.forEach((files, folderName) => processedGroups.push({ folderName, files }));

      } else {
        const fileMap = new Map<string, File[]>();
        files.forEach((file, i) => {
          const path = relativePaths[i] || file.name;
          const parts = path.split('/').filter(p => p);
          let folderName = parts.length <= 1 
            ? `個別_${file.name.replace(/\.[^/.]+$/, '')}`
            : (parts.length >= 2 ? parts[1] : parts[0]);
          if (!folderName.startsWith('.') && !folderName.startsWith('__')) {
            if (!fileMap.has(folderName)) fileMap.set(folderName, []);
            fileMap.get(folderName)!.push(file);
          }
        });
        fileMap.forEach((files, folderName) => processedGroups.push({ folderName, files }));
      }

      const totalGroups = processedGroups.length;
      setProgress({ current: 0, total: totalGroups, status: '登録開始...' });

      // 2. 登録ループ (直列実行)
      for (let i = 0; i < totalGroups; i++) {
        const group = processedGroups[i];
        const productName = group.folderName.replace(/^個別_/, '').replace(/_/g, ' ');
        
        setProgress({ 
          current: i + 1, 
          total: totalGroups, 
          status: `登録中 (${i + 1}/${totalGroups}): ${productName}` 
        });

        try {
          // A. 正規のSKU生成 (useInventorySync.generateSku)
          const sku = await inventorySync.generateSku(skuPrefix);
          console.log(`[Upload] Processing: ${productName} (SKU: ${sku})`);

          // B. 商品登録 (createProduct)
          const createRes = await inventorySync.createProduct({
            product_name: productName,
            sku: sku,
            physical_quantity: 1,
            cost_price: 0,
            selling_price: 0,
            condition_name: 'New',
            storage_location: storageLocation,
            inventory_type: inventoryType, 
            product_type: 'single',
            source_type: 'bulk_upload_client',
            images: [] // 画像は後で更新
          });

          if (!createRes.success || !createRes.product) {
            throw new Error(createRes.error || '商品登録失敗');
          }

          const newProduct = createRes.product;
          const uploadedImages: string[] = [];

          // C. 画像アップロード
          for (const file of group.files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('inventory_master_id', String(newProduct.id));

            const uploadRes = await fetch('/api/inventory/upload-image', {
              method: 'POST',
              body: formData
            });

            if (uploadRes.ok) {
              const data = await uploadRes.json();
              const imageUrl = data.url || (data.data && data.data.url) || null;
              if (imageUrl) {
                uploadedImages.push(imageUrl);
                console.log(`  ✅ Uploaded: ${imageUrl}`);
              }
            } else {
              console.warn(`  ⚠️ Upload failed: ${uploadRes.status}`);
            }
          }

          // D. DB更新 (画像URL & マーケットプレイス情報)
          if (uploadedImages.length > 0) {
            console.log(`[Upload] Saving ${uploadedImages.length} images to DB for ${sku}`);
            
            // 1. 画像URLの保存 (useInventorySyncのHookを使用)
            // これにより images(jsonb) と inventory_images(text[]) が正しく保存されます
            const updateRes = await inventorySync.updateProductImages(String(newProduct.id), uploadedImages);
            
            if (!updateRes.success) {
              console.error(`  ❌ DB Image Update failed:`, updateRes.error);
            }
            
            // 2. ステータス等の追加情報更新 (直接Supabase)
            // ※ここで images/inventory_images を上書きしないように注意
            const { error: statusUpdateError } = await supabase
              .from('inventory_master')
              .update({
                marketplace: 'ebay', 
                source_data: {
                  ...newProduct.source_data,
                  listing_status: 'active', 
                  imported_at: new Date().toISOString(),
                  source_type: 'bulk_upload_zip'
                }
              })
              .eq('id', newProduct.id);

            if (statusUpdateError) {
              console.warn(`  ⚠️ Status update warning:`, statusUpdateError.message);
            }
          }

          currentResults.registered++;
          currentResults.totalImages += uploadedImages.length;
          currentResults.products.push({
            id: newProduct.id,
            sku: newProduct.sku,
            productName: newProduct.product_name,
            imageCount: uploadedImages.length
          });

        } catch (err: any) {
          console.error(`[Upload] Error processing ${group.folderName}:`, err);
          currentResults.failed++;
          currentResults.errors.push({ folderName: group.folderName, error: err.message });
        }
      }

      setResults(currentResults);
      if (currentResults.failed === 0) {
        onSuccess?.();
      }

    } catch (error: any) {
      console.error('Bulk upload fatal error:', error);
      setResults({
        ...currentResults,
        success: false,
        errors: [...currentResults.errors, { folderName: 'System', error: error.message }]
      });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && !uploading && onClose()}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
        style={{ background: 'var(--panel)' }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ background: 'var(--accent)', color: 'white' }}>
          <div className="flex items-center gap-3">
            <ImageIcon size={24} />
            <div>
              <h2 className="text-lg font-bold">画像一括登録 (Storage修正版)</h2>
              <p className="text-sm opacity-80">ZIP解凍・正規SKU・DB完全同期</p>
            </div>
          </div>
          {!uploading && <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20"><X size={20} /></button>}
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="flex gap-2 mb-6">
            {[
              { mode: 'folder' as UploadMode, icon: FolderOpen, label: 'フォルダ', desc: 'サブフォルダ = 1商品' },
              { mode: 'zip' as UploadMode, icon: FileArchive, label: 'ZIP一括', desc: 'ZIPを解凍して登録' },
              { mode: 'single' as UploadMode, icon: Camera, label: '個別', desc: '1画像 = 1商品' },
            ].map(({ mode, icon: Icon, label, desc }) => (
              <button
                key={mode}
                onClick={() => { if (!uploading) { setUploadMode(mode); clearAll(); } }}
                disabled={uploading}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${uploadMode === mode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                style={{ background: uploadMode === mode ? 'rgba(59, 130, 246, 0.1)' : 'var(--highlight)', opacity: uploading ? 0.5 : 1 }}
              >
                <Icon size={24} className={`mx-auto mb-2 ${uploadMode === mode ? 'text-blue-500' : 'text-gray-400'}`} />
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500">SKUプレフィックス</label>
              <input type="text" value={skuPrefix} onChange={(e) => setSkuPrefix(e.target.value.toUpperCase())} disabled={uploading} className="w-full h-9 px-3 rounded text-sm border" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500">保管場所</label>
              <select value={storageLocation} onChange={(e) => setStorageLocation(e.target.value)} disabled={uploading} className="w-full h-9 px-3 rounded text-sm border">
                <option value="plus1">Plus1</option>
                <option value="env">ENV</option>
                <option value="yao">八尾</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-500">在庫タイプ</label>
              <select value={inventoryType} onChange={(e) => setInventoryType(e.target.value as any)} disabled={uploading} className="w-full h-9 px-3 rounded text-sm border">
                <option value="stock">有在庫 (stock)</option>
                <option value="mu">無在庫 (mu)</option>
              </select>
            </div>
          </div>

          {!uploading && !results && (
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center mb-6 cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
              onClick={() => {
                if (uploadMode === 'folder') folderInputRef.current?.click();
                else if (uploadMode === 'zip') zipInputRef.current?.click();
                else fileInputRef.current?.click();
              }}
            >
              <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleSingleFileChange} className="hidden" />
              <input type="file" ref={folderInputRef} {...{ webkitdirectory: '', directory: '' } as any} onChange={handleFolderChange} className="hidden" />
              <input type="file" ref={zipInputRef} accept=".zip" onChange={handleZipChange} className="hidden" />
              <Upload size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-base font-medium text-gray-700">{uploadMode === 'zip' ? 'ZIPファイルを選択' : '画像ファイル/フォルダを選択'}</p>
            </div>
          )}

          {uploading && (
            <div className="mb-6 p-6 rounded-lg bg-blue-50 border border-blue-100">
              <div className="flex justify-between text-sm mb-2 text-blue-800 font-medium">
                <span>{progress.status}</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${(progress.current / progress.total) * 100}%` }}></div>
              </div>
              <div className="mt-2 text-xs text-blue-500 text-center flex items-center justify-center gap-2">
                <Loader2 size={12} className="animate-spin" /> 処理中はブラウザを閉じないでください
              </div>
            </div>
          )}

          {!uploading && !results && previewData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">検出された商品 ({previewData.length}件)</h3>
                <button onClick={clearAll} className="text-xs text-red-500">すべてクリア</button>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                {previewData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded border">
                    {item.isZip ? <FileArchive size={16} className="text-orange-500" /> : <FolderOpen size={16} className="text-blue-500" />}
                    <span className="text-sm truncate flex-1">{item.name}</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 rounded">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!uploading && !results && (
            <N3Button onClick={handleUpload} disabled={(files.length === 0 && !zipFile)} variant="primary" size="lg" style={{ width: '100%' }}>
              <Upload size={18} /> 登録実行
            </N3Button>
          )}

          {results && (
            <div className="mt-6 p-4 rounded-lg" style={{ background: results.failed === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)' }}>
              <div className="flex items-center gap-2 mb-4 font-bold text-gray-800">
                {results.failed === 0 ? <CheckCircle size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-orange-500" />}
                <span>登録完了: {results.registered}件 / 失敗: {results.failed}件</span>
              </div>
              
              {results.errors.length > 0 && (
                <div className="mt-4 p-3 bg-white rounded border border-red-200 max-h-40 overflow-y-auto">
                  <h4 className="text-sm font-semibold mb-2 text-red-600">エラー詳細:</h4>
                  {results.errors.map((err, i) => (
                    <p key={i} className="text-xs text-red-500 mb-1">• {err.folderName}: {err.error}</p>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <N3Button onClick={clearAll} variant="secondary" size="sm">閉じる</N3Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default N3BulkImageUploadModal;