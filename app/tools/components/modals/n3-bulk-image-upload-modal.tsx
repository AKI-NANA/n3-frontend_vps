// app/tools/editing-n3/components/modals/n3-bulk-image-upload-modal.tsx
/**
 * N3デザインシステム版 画像一括アップロードモーダル
 * 
 * 機能:
 * - 複数画像のドラッグ&ドロップ対応
 * - 1画像 = 1商品として inventory_master に自動登録
 * - カテゴリ、コンディション、商品タイプの設定
 * - アップロード進捗表示
 */

'use client';

import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  X, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { N3Button, N3Divider, N3Tooltip } from '@/components/n3';

interface BulkUploadResult {
  id: string;
  sku: string;
  filename: string;
  imageUrl: string;
}

interface UploadResults {
  success: boolean;
  registered: number;
  failed: number;
  products: BulkUploadResult[];
  errors: Array<{ filename: string; error: string }>;
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
  const [files, setFiles] = useState<File[]>([]);
  const [category, setCategory] = useState('Toys & Hobbies');
  const [condition, setCondition] = useState('Used');
  const [productType, setProductType] = useState('manual');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<UploadResults | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setResults(null);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      alert('画像を選択してください');
      return;
    }

    setUploading(true);
    setResults(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('marketplace', productType);

      console.log(`📦 アップロード開始: ${files.length}枚`);

      const response = await fetch('/api/inventory/bulk-upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ アップロード成功:', data);
        setResults(data);
        if (data.failed === 0) {
          setFiles([]); // 成功したら画像リストをクリア
          if (onSuccess) {
            onSuccess();
          }
        }
      } else {
        console.error('❌ アップロードエラー:', data);
        setResults({
          success: false,
          registered: 0,
          failed: files.length,
          products: [],
          errors: [{ filename: 'all', error: data.error || 'アップロードに失敗しました' }]
        });
      }
    } catch (error: any) {
      console.error('❌ ネットワークエラー:', error);
      setResults({
        success: false,
        registered: 0,
        failed: files.length,
        products: [],
        errors: [{ filename: 'all', error: error.message || 'ネットワークエラー' }]
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
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
        style={{ background: 'var(--panel)' }}
      >
        {/* ヘッダー */}
        <div 
          className="flex items-center justify-between px-6 py-4"
          style={{ 
            background: 'var(--accent)',
            color: 'white',
          }}
        >
          <div className="flex items-center gap-3">
            <ImageIcon size={24} />
            <div>
              <h2 className="text-lg font-bold">画像一括登録</h2>
              <p className="text-sm opacity-80">棚卸しマスターへ自動登録</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* 説明 */}
          <div 
            className="mb-6 p-4 rounded-lg"
            style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              複数の商品画像を一度にアップロードして、棚卸しマスター（inventory_master）に自動登録できます。
            </p>
            <p className="text-sm font-bold mt-1" style={{ color: 'rgb(34, 197, 94)' }}>
              ✨ 1枚の画像 = 1商品として自動的にSKUが付与されます（ITEM-000001形式）
            </p>
          </div>

          {/* 設定エリア */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                カテゴリー
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-3 rounded text-sm"
                style={{ 
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)',
                }}
              >
                <option value="Toys & Hobbies">Toys & Hobbies</option>
                <option value="Collectibles">Collectibles</option>
                <option value="Sports Mem, Cards & Fan Shop">Sports Cards</option>
                <option value="Video Games & Consoles">Video Games</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                コンディション
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full h-9 px-3 rounded text-sm"
                style={{ 
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)',
                }}
              >
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Refurbished">Refurbished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                商品タイプ
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full h-9 px-3 rounded text-sm"
                style={{ 
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)',
                }}
              >
                <option value="manual">有在庫（stock）</option>
                <option value="dropship">無在庫（dropship）</option>
              </select>
            </div>
          </div>

          {/* ドロップゾーン */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center mb-6
              transition-all duration-200 cursor-pointer
            `}
            style={{
              borderColor: dragOver ? 'var(--accent)' : 'var(--panel-border)',
              background: dragOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload 
              size={48} 
              className="mx-auto mb-4"
              style={{ color: dragOver ? 'var(--accent)' : 'var(--text-subtle)' }}
            />
            <p className="text-base font-medium mb-1" style={{ color: 'var(--text)' }}>
              クリックして画像を選択、またはドラッグ&ドロップ
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              PNG, JPG, GIF (最大10MB/枚)
            </p>
          </div>

          {/* 選択された画像一覧 */}
          {files.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  選択された画像 ({files.length}枚)
                </h3>
                <button
                  onClick={clearAllFiles}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                  style={{ color: 'var(--color-error)' }}
                >
                  <Trash2 size={12} />
                  すべてクリア
                </button>
              </div>
              <div 
                className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto p-2 rounded-lg"
                style={{ background: 'var(--highlight)' }}
              >
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded"
                      style={{ border: '1px solid var(--panel-border)' }}
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white' }}
                    >
                      <X size={12} />
                    </button>
                    <p 
                      className="text-[10px] mt-1 truncate"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* アップロードボタン */}
          <N3Button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            loading={uploading}
            variant="primary"
            size="lg"
            style={{ width: '100%' }}
          >
            <Upload size={18} />
            {uploading 
              ? `アップロード中... ${files.length}枚`
              : `${files.length}枚の画像を棚卸しマスターに一括登録`
            }
          </N3Button>

          {/* 結果表示 */}
          {results && (
            <div 
              className="mt-6 p-4 rounded-lg"
              style={{ 
                background: results.failed === 0 
                  ? 'rgba(34, 197, 94, 0.1)' 
                  : 'rgba(245, 158, 11, 0.1)',
                border: `1px solid ${results.failed === 0 
                  ? 'rgba(34, 197, 94, 0.3)' 
                  : 'rgba(245, 158, 11, 0.3)'
                }`,
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                {results.failed === 0 ? (
                  <CheckCircle size={20} style={{ color: 'rgb(34, 197, 94)' }} />
                ) : (
                  <AlertCircle size={20} style={{ color: 'rgb(245, 158, 11)' }} />
                )}
                <span className="text-base font-bold" style={{ color: 'var(--text)' }}>
                  登録完了: {results.registered}件 / 失敗: {results.failed}件
                </span>
              </div>

              {/* 登録成功した商品 */}
              {results.products.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    登録された商品:
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.products.map(product => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded"
                        style={{ background: 'rgba(34, 197, 94, 0.1)' }}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.filename}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center rounded bg-gray-200">
                            <ImageIcon size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-sm font-medium truncate"
                            style={{ color: 'rgb(34, 197, 94)' }}
                          >
                            {product.sku}
                          </p>
                          <p 
                            className="text-xs truncate"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {product.filename}
                          </p>
                        </div>
                        <a
                          href={`/tools/editing?from=tanaoroshi&sku=${product.sku}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs px-2 py-1 rounded"
                          style={{ 
                            background: 'var(--highlight)',
                            color: 'var(--accent)',
                            border: '1px solid var(--panel-border)',
                          }}
                        >
                          出品データ作成
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* エラー */}
              {results.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-error)' }}>
                    エラー:
                  </h4>
                  <div className="space-y-1">
                    {results.errors.map((err, i) => (
                      <p key={i} className="text-xs" style={{ color: 'var(--color-error)' }}>
                        {err.filename}: {err.error}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default N3BulkImageUploadModal;
