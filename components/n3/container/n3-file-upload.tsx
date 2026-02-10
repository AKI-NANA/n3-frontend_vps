// components/n3/container/n3-file-upload.tsx
/**
 * N3FileUpload - ファイルアップロードコンポーネント (Container)
 * ドラッグ&ドロップ、プレビュー対応
 */

'use client';

import React, { memo, useState, useCallback, useRef } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, Check } from 'lucide-react';
import { N3Button } from '../presentational/n3-button';
import { N3ProgressBar } from '../presentational/n3-progress-bar';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  previewUrl?: string;
}

export interface N3FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  disabled?: boolean;
  showPreview?: boolean;
  variant?: 'default' | 'compact' | 'inline';
  onFilesSelected?: (files: File[]) => void;
  onFileRemove?: (fileId: string) => void;
  onUpload?: (file: File) => Promise<void>;
  uploadedFiles?: UploadedFile[];
  className?: string;
  style?: React.CSSProperties;
}

// ファイルタイプアイコン
const FileIcon = memo(function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) {
    return <Image size={20} style={{ color: 'var(--color-success)' }} />;
  }
  if (type.includes('pdf') || type.includes('document')) {
    return <FileText size={20} style={{ color: 'var(--color-error)' }} />;
  }
  return <File size={20} style={{ color: 'var(--color-primary)' }} />;
});

// ファイルサイズフォーマット
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// ユニークID生成
const generateId = () => Math.random().toString(36).substr(2, 9);

export const N3FileUpload = memo(function N3FileUpload({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  disabled = false,
  showPreview = true,
  variant = 'default',
  onFilesSelected,
  onFileRemove,
  onUpload,
  uploadedFiles: externalFiles,
  className = '',
  style,
}: N3FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [internalFiles, setInternalFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const files = externalFiles || internalFiles;

  // ファイル検証
  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize && file.size > maxSize) {
        return `ファイルサイズが大きすぎます (最大: ${formatFileSize(maxSize)})`;
      }
      if (accept) {
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', '/'));
          }
          return file.type === type;
        });
        if (!isAccepted) {
          return `このファイル形式は対応していません`;
        }
      }
      return null;
    },
    [accept, maxSize]
  );

  // ファイル追加
  const handleFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(newFiles);

      if (maxFiles && files.length + fileArray.length > maxFiles) {
        setError(`最大${maxFiles}ファイルまでアップロードできます`);
        return;
      }

      const validFiles: File[] = [];
      const uploadedFilesList: UploadedFile[] = [];

      for (const file of fileArray) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        validFiles.push(file);

        // プレビューURL生成
        let previewUrl: string | undefined;
        if (showPreview && file.type.startsWith('image/')) {
          previewUrl = URL.createObjectURL(file);
        }

        uploadedFilesList.push({
          id: generateId(),
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          progress: 0,
          status: 'pending',
          previewUrl,
        });
      }

      if (validFiles.length > 0) {
        onFilesSelected?.(validFiles);

        if (!externalFiles) {
          setInternalFiles(prev => [...prev, ...uploadedFilesList]);
        }

        // 自動アップロード
        if (onUpload) {
          for (const uploadedFile of uploadedFilesList) {
            try {
              setInternalFiles(prev =>
                prev.map(f =>
                  f.id === uploadedFile.id ? { ...f, status: 'uploading', progress: 50 } : f
                )
              );
              await onUpload(uploadedFile.file);
              setInternalFiles(prev =>
                prev.map(f =>
                  f.id === uploadedFile.id ? { ...f, status: 'completed', progress: 100 } : f
                )
              );
            } catch (err: any) {
              setInternalFiles(prev =>
                prev.map(f =>
                  f.id === uploadedFile.id
                    ? { ...f, status: 'error', error: err.message || 'アップロード失敗' }
                    : f
                )
              );
            }
          }
        }
      }
    },
    [files.length, maxFiles, validateFile, showPreview, onFilesSelected, externalFiles, onUpload]
  );

  // ファイル削除
  const handleRemove = useCallback(
    (fileId: string) => {
      const file = files.find(f => f.id === fileId);
      if (file?.previewUrl) {
        URL.revokeObjectURL(file.previewUrl);
      }

      if (!externalFiles) {
        setInternalFiles(prev => prev.filter(f => f.id !== fileId));
      }
      onFileRemove?.(fileId);
    },
    [files, externalFiles, onFileRemove]
  );

  // ドラッグイベント
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (!disabled && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [disabled, handleFiles]
  );

  // クリックで選択
  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = '';
      }
    },
    [handleFiles]
  );

  // インラインバリアント
  if (variant === 'inline') {
    return (
      <div className={className} style={style}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <N3Button
          variant="secondary"
          size="sm"
          onClick={handleClick}
          disabled={disabled}
        >
          <Upload size={14} />
          ファイル選択
        </N3Button>
        {files.length > 0 && (
          <span style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {files.length}件選択中
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`n3-file-upload ${className}`} style={style}>
      {/* ドロップゾーン */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? 'var(--color-primary)' : 'var(--panel-border)'}`,
          borderRadius: 'var(--style-radius-lg, 12px)',
          padding: variant === 'compact' ? '16px' : '24px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: isDragging ? 'rgba(99, 102, 241, 0.05)' : 'var(--highlight)',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
        <Upload
          size={variant === 'compact' ? 24 : 32}
          style={{
            color: isDragging ? 'var(--color-primary)' : 'var(--text-muted)',
            marginBottom: '8px',
          }}
        />
        <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
          {isDragging ? 'ドロップしてアップロード' : 'クリックまたはドラッグ&ドロップ'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {accept && `対応形式: ${accept}`}
          {maxSize && ` (最大: ${formatFileSize(maxSize)})`}
        </div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            padding: '8px 12px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 'var(--style-radius-md, 8px)',
            fontSize: '12px',
            color: 'var(--color-error)',
          }}
        >
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* ファイルリスト */}
      {files.length > 0 && (
        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {files.map(file => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                background: 'var(--panel)',
                borderRadius: 'var(--style-radius-md, 8px)',
                border: '1px solid var(--panel-border)',
              }}
            >
              {/* プレビュー/アイコン */}
              {showPreview && file.previewUrl ? (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  style={{
                    width: 40,
                    height: 40,
                    objectFit: 'cover',
                    borderRadius: '6px',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--highlight)',
                    borderRadius: '6px',
                  }}
                >
                  <FileIcon type={file.type} />
                </div>
              )}

              {/* ファイル情報 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {formatFileSize(file.size)}
                </div>
                {file.status === 'uploading' && (
                  <div style={{ marginTop: '4px' }}>
                    <N3ProgressBar value={file.progress} size="sm" />
                  </div>
                )}
                {file.status === 'error' && (
                  <div style={{ fontSize: '11px', color: 'var(--color-error)', marginTop: '2px' }}>
                    {file.error}
                  </div>
                )}
              </div>

              {/* ステータス/アクション */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {file.status === 'completed' && (
                  <Check size={16} style={{ color: 'var(--color-success)' }} />
                )}
                {file.status === 'error' && (
                  <AlertCircle size={16} style={{ color: 'var(--color-error)' }} />
                )}
                <button
                  onClick={() => handleRemove(file.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-error)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default N3FileUpload;
