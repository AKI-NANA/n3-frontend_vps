// app/tools/editing-n3/components/modals/n3-sku-edit-modal.tsx
/**
 * SKU編集モーダル
 * 
 * eBay出品時の「重複エラー」回避用
 * - SKUを手動で変更可能
 * - 新しいSKUを自動生成するオプション
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { X, RefreshCw, AlertTriangle, Copy, Check, Edit3 } from 'lucide-react';
import { N3Button } from '@/components/n3';

interface N3SKUEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  currentSku: string;
  productTitle: string;
  errorMessage?: string;
  onSave: (newSku: string) => Promise<{ success: boolean; error?: string }>;
  onRetryListing?: () => void;
}

export function N3SKUEditModal({
  isOpen,
  onClose,
  productId,
  currentSku,
  productTitle,
  errorMessage,
  onSave,
  onRetryListing,
}: N3SKUEditModalProps) {
  const [newSku, setNewSku] = useState(currentSku);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // モーダルが開かれたときにSKUをリセット
  useEffect(() => {
    if (isOpen) {
      setNewSku(currentSku);
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, currentSku]);

  // SKU自動生成
  const generateNewSku = useCallback(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const baseSku = currentSku.replace(/-v\d+$/, '').replace(/-\d+$/, '');
    const newGeneratedSku = `${baseSku}-${timestamp}${random}`;
    setNewSku(newGeneratedSku);
  }, [currentSku]);

  // バージョン追加（シンプル）
  const addVersion = useCallback(() => {
    const baseSku = currentSku.replace(/-v\d+$/, '');
    const match = currentSku.match(/-v(\d+)$/);
    const version = match ? parseInt(match[1]) + 1 : 2;
    setNewSku(`${baseSku}-v${version}`);
  }, [currentSku]);

  // SKUをコピー
  const copySku = useCallback(() => {
    navigator.clipboard.writeText(newSku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [newSku]);

  // 保存処理
  const handleSave = async () => {
    if (newSku === currentSku) {
      setError('SKUが変更されていません');
      return;
    }

    if (!newSku.trim()) {
      setError('SKUを入力してください');
      return;
    }

    // SKUバリデーション（eBayの制限: 英数字、ハイフン、アンダースコアのみ、50文字以内）
    if (!/^[A-Za-z0-9_-]+$/.test(newSku)) {
      setError('SKUは英数字、ハイフン(-)、アンダースコア(_)のみ使用可能です');
      return;
    }

    if (newSku.length > 50) {
      setError('SKUは50文字以内にしてください');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await onSave(newSku);
      if (result.success) {
        setSuccess(true);
        // 成功後、3秒で自動閉じる
        setTimeout(() => {
          onClose();
          if (onRetryListing) {
            onRetryListing();
          }
        }, 1500);
      } else {
        setError(result.error || 'SKUの更新に失敗しました');
      }
    } catch (e: any) {
      setError(e.message || '予期しないエラーが発生しました');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="rounded-lg shadow-2xl w-full max-w-md overflow-hidden"
        style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}
      >
        {/* ヘッダー */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--panel-border)' }}
        >
          <div className="flex items-center gap-3">
            <Edit3 size={20} style={{ color: 'var(--accent)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
              SKU編集
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-5 py-4 space-y-4">
          {/* エラーメッセージ（出品エラーの詳細） */}
          {errorMessage && (
            <div
              className="p-3 rounded-lg flex items-start gap-3"
              style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
            >
              <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: '#ef4444' }}>
                  出品エラー
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {errorMessage}
                </div>
              </div>
            </div>
          )}

          {/* 商品情報 */}
          <div
            className="p-3 rounded-lg"
            style={{ background: 'var(--highlight)' }}
          >
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              商品名
            </div>
            <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {productTitle || `商品ID: ${productId}`}
            </div>
          </div>

          {/* 現在のSKU */}
          <div>
            <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              現在のSKU
            </label>
            <div
              className="mt-1 px-3 py-2 rounded-lg text-sm font-mono"
              style={{ background: 'var(--highlight)', color: 'var(--text-muted)' }}
            >
              {currentSku}
            </div>
          </div>

          {/* 新しいSKU */}
          <div>
            <label className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              新しいSKU
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                value={newSku}
                onChange={(e) => setNewSku(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-mono"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)',
                }}
                placeholder="新しいSKUを入力"
              />
              <button
                onClick={copySku}
                className="p-2 rounded-lg transition-colors"
                style={{ background: 'var(--highlight)', color: 'var(--text-muted)' }}
                title="コピー"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* クイックアクション */}
          <div className="flex gap-2">
            <button
              onClick={addVersion}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'var(--highlight)', color: 'var(--text)' }}
            >
              バージョン追加 (-v2)
            </button>
            <button
              onClick={generateNewSku}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
              style={{ background: 'var(--highlight)', color: 'var(--text)' }}
            >
              <RefreshCw size={12} />
              自動生成
            </button>
          </div>

          {/* 説明 */}
          <div
            className="p-3 rounded-lg text-xs"
            style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--text-muted)' }}
          >
            <p className="mb-1">
              <strong>ヒント:</strong> eBayでは、同じSKUで複数の出品予約（Offer）が作成できません。
            </p>
            <p>
              SKUを変更することで、新しい出品として処理されます。
            </p>
          </div>

          {/* エラー表示 */}
          {error && (
            <div
              className="p-3 rounded-lg text-sm"
              style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            >
              {error}
            </div>
          )}

          {/* 成功表示 */}
          {success && (
            <div
              className="p-3 rounded-lg text-sm flex items-center gap-2"
              style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
            >
              <Check size={16} />
              SKUを更新しました。再出品を試みます...
            </div>
          )}
        </div>

        {/* フッター */}
        <div
          className="flex items-center justify-end gap-2 px-5 py-4"
          style={{ borderTop: '1px solid var(--panel-border)', background: 'var(--highlight)' }}
        >
          <N3Button variant="secondary" onClick={onClose} disabled={isSaving}>
            キャンセル
          </N3Button>
          <N3Button
            variant="primary"
            onClick={handleSave}
            disabled={isSaving || newSku === currentSku || success}
          >
            {isSaving ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                保存中...
              </>
            ) : (
              '保存して再出品'
            )}
          </N3Button>
        </div>
      </div>
    </div>
  );
}

export default N3SKUEditModal;
