// app/tools/editing-n3/components/sync/spreadsheet-sync-menu.tsx
/**
 * スプレッドシート同期メニュー
 * 
 * 機能:
 * - Push（ツール → シート）
 * - Pull（シート → ツール）+ プレビュー確認
 * - 属性一括検知
 * 
 * @version 1.0.0
 * @date 2026-01-14
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileSpreadsheet, Upload, Download, Wand2, ChevronDown,
  ExternalLink, Loader2, CheckCircle, AlertTriangle, X,
  Info, ArrowRight
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface PullPreviewItem {
  id: string;
  sku: string;
  product_name: string;
  changes: Record<string, any>;
  before: Record<string, any>;
}

interface PullPreviewResult {
  success: boolean;
  dryRun: boolean;
  stats: {
    total: number;
    updated: number;
    skipped: number;
    conflicts: number;
    errors: number;
  };
  updates: PullPreviewItem[];
  conflicts: any[];
  errors: any[];
}

interface DetectionResult {
  success: boolean;
  stats: {
    total: number;
    setDetected: number;
    gradedDetected: number;
    changed: number;
  };
  results: any[];
}

interface SpreadsheetSyncMenuProps {
  onRefresh?: () => void;
  compact?: boolean;
}

// ============================================================
// メインコンポーネント
// ============================================================

export function SpreadsheetSyncMenu({ onRefresh, compact = false }: SpreadsheetSyncMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showPullPreview, setShowPullPreview] = useState(false);
  const [pullPreview, setPullPreview] = useState<PullPreviewResult | null>(null);
  const [showDetectionResult, setShowDetectionResult] = useState(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 外部クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Push実行（ツール → シート）
  const handlePush = useCallback(async () => {
    if (!confirm('📤 ツールのデータをスプレッドシートに書き出します。\n\n⚠️ シート上の手編集内容は上書きされます。\n続行しますか？')) {
      return;
    }

    setIsLoading(true);
    setLoadingAction('push');
    try {
      const res = await fetch('/api/sync/stocktake-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targets: ['physicalStock', 'allData', 'setVariation'],
        }),
      });
      const data = await res.json();

      if (data.success) {
        setLastResult({
          success: true,
          message: `✅ ${data.syncedCount}件をシートに書き出しました`,
        });
        // スプレッドシートを新しいタブで開く
        if (data.spreadsheetUrl) {
          window.open(data.spreadsheetUrl, '_blank');
        }
      } else {
        throw new Error(data.error || 'Push失敗');
      }
    } catch (e: any) {
      setLastResult({
        success: false,
        message: `❌ エラー: ${e.message}`,
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
      setIsOpen(false);
    }
  }, []);

  // Pull プレビュー実行（シート → ツール、dryRun）
  const handlePullPreview = useCallback(async () => {
    setIsLoading(true);
    setLoadingAction('pull-preview');
    try {
      const res = await fetch('/api/sync/pull-from-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName: '全出品データ',
          dryRun: true,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPullPreview(data);
        setShowPullPreview(true);
        setIsOpen(false);
      } else {
        throw new Error(data.error || 'Preview失敗');
      }
    } catch (e: any) {
      setLastResult({
        success: false,
        message: `❌ エラー: ${e.message}`,
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }, []);

  // Pull 確定実行
  const handlePullConfirm = useCallback(async () => {
    setIsLoading(true);
    setLoadingAction('pull-confirm');
    try {
      const res = await fetch('/api/sync/pull-from-spreadsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName: '全出品データ',
          dryRun: false,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setLastResult({
          success: true,
          message: `✅ ${data.stats.updated}件を取り込みました`,
        });
        setShowPullPreview(false);
        setPullPreview(null);
        onRefresh?.();
      } else {
        throw new Error(data.error || 'Pull失敗');
      }
    } catch (e: any) {
      setLastResult({
        success: false,
        message: `❌ エラー: ${e.message}`,
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }, [onRefresh]);

  // 属性検知実行
  const handleDetectAttributes = useCallback(async () => {
    setIsLoading(true);
    setLoadingAction('detect');
    try {
      const res = await fetch('/api/inventory/detect-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applyToDb: false, // まずプレビュー
        }),
      });
      const data = await res.json();

      if (data.success) {
        setDetectionResult(data);
        setShowDetectionResult(true);
        setIsOpen(false);
      } else {
        throw new Error(data.error || '検知失敗');
      }
    } catch (e: any) {
      setLastResult({
        success: false,
        message: `❌ エラー: ${e.message}`,
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }, []);

  // 属性検知を確定
  const handleDetectionConfirm = useCallback(async () => {
    setIsLoading(true);
    setLoadingAction('detect-confirm');
    try {
      const res = await fetch('/api/inventory/detect-attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applyToDb: true,
          autoSetSku: true, // SET-プレフィックスも自動付与
        }),
      });
      const data = await res.json();

      if (data.success) {
        setLastResult({
          success: true,
          message: `✅ ${data.stats.updated}件の属性を更新しました`,
        });
        setShowDetectionResult(false);
        setDetectionResult(null);
        onRefresh?.();
      } else {
        throw new Error(data.error || '更新失敗');
      }
    } catch (e: any) {
      setLastResult({
        success: false,
        message: `❌ エラー: ${e.message}`,
      });
    } finally {
      setIsLoading(false);
      setLoadingAction(null);
    }
  }, [onRefresh]);

  return (
    <>
      {/* ドロップダウンメニュー */}
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isLoading}
          style={{
            height: compact ? 24 : 32,
            padding: compact ? '0 8px' : '0 12px',
            fontSize: compact ? '11px' : '13px',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <Loader2 size={compact ? 12 : 14} className="animate-spin" />
          ) : (
            <FileSpreadsheet size={compact ? 12 : 14} />
          )}
          <span>シート同期</span>
          <ChevronDown size={compact ? 10 : 12} />
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              width: 220,
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              overflow: 'hidden',
            }}
          >
            {/* Push */}
            <button
              onClick={handlePush}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text)',
                fontSize: '13px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Upload size={16} style={{ color: '#3b82f6' }} />
              <div>
                <div style={{ fontWeight: 500 }}>シートへ書き出す</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Push: ツール → シート</div>
              </div>
            </button>

            <div style={{ height: 1, background: 'var(--panel-border)' }} />

            {/* Pull */}
            <button
              onClick={handlePullPreview}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text)',
                fontSize: '13px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Download size={16} style={{ color: '#10b981' }} />
              <div>
                <div style={{ fontWeight: 500 }}>シートから取り込む</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pull: シート → ツール</div>
              </div>
            </button>

            <div style={{ height: 1, background: 'var(--panel-border)' }} />

            {/* 属性検知 */}
            <button
              onClick={handleDetectAttributes}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--text)',
                fontSize: '13px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Wand2 size={16} style={{ color: '#8b5cf6' }} />
              <div>
                <div style={{ fontWeight: 500 }}>属性を一括検知</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PSA10・セット品を自動判定</div>
              </div>
            </button>

            <div style={{ height: 1, background: 'var(--panel-border)' }} />

            {/* シートを開く */}
            <a
              href="https://docs.google.com/spreadsheets/d/1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 12px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--highlight)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <ExternalLink size={16} />
              <span>シートを開く</span>
            </a>
          </div>
        )}
      </div>

      {/* 結果通知（トースト風） */}
      {lastResult && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '12px 16px',
            background: lastResult.success ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            animation: 'slideIn 0.3s ease',
          }}
          onClick={() => setLastResult(null)}
        >
          {lastResult.success ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{lastResult.message}</span>
          <X size={14} style={{ cursor: 'pointer', marginLeft: 8 }} />
        </div>
      )}

      {/* Pull プレビューモーダル */}
      {showPullPreview && pullPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowPullPreview(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: 600,
              maxHeight: '80vh',
              background: 'var(--panel)',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Download size={20} style={{ color: '#10b981' }} />
                <h3 style={{ margin: 0, fontSize: '16px' }}>取り込みプレビュー</h3>
              </div>
              <button onClick={() => setShowPullPreview(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            {/* 統計 */}
            <div style={{ padding: '16px 20px', background: 'var(--highlight)', display: 'flex', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{pullPreview.stats.updated}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>更新予定</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{pullPreview.stats.skipped}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>スキップ</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{pullPreview.stats.conflicts}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>競合</div>
              </div>
            </div>

            {/* 変更リスト */}
            <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
              {pullPreview.updates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  <Info size={32} style={{ marginBottom: 8 }} />
                  <p>変更はありません</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {pullPreview.updates.slice(0, 50).map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 12px',
                        background: 'var(--highlight)',
                        borderRadius: 6,
                        fontSize: '13px',
                      }}
                    >
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        {item.sku} - {item.product_name?.slice(0, 40)}...
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: '11px' }}>
                        {Object.entries(item.changes).map(([key, value]) => {
                          if (key === 'updated_at' || key === 'sync_source') return null;
                          const before = item.before?.[key];
                          return (
                            <span key={key} style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4 }}>
                              {key}: {String(before ?? '-')} <ArrowRight size={10} style={{ display: 'inline' }} /> <strong>{String(value)}</strong>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {pullPreview.updates.length > 50 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                      ...他{pullPreview.updates.length - 50}件
                    </div>
                  )}
                </div>
              )}

              {/* 競合警告 */}
              {pullPreview.conflicts.length > 0 && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 6 }}>
                  <div style={{ fontWeight: 500, color: '#f59e0b', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <AlertTriangle size={14} />
                    競合（シートのデータが古い）
                  </div>
                  {pullPreview.conflicts.slice(0, 5).map((c, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {c.sku}: {c.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* フッター */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowPullPreview(false)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handlePullConfirm}
                disabled={isLoading || pullPreview.updates.length === 0}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  opacity: isLoading || pullPreview.updates.length === 0 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {isLoading && loadingAction === 'pull-confirm' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                {pullPreview.stats.updated}件を取り込む
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 属性検知結果モーダル */}
      {showDetectionResult && detectionResult && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowDetectionResult(false)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: 500,
              maxHeight: '80vh',
              background: 'var(--panel)',
              borderRadius: 12,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ヘッダー */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--panel-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Wand2 size={20} style={{ color: '#8b5cf6' }} />
                <h3 style={{ margin: 0, fontSize: '16px' }}>属性検知結果</h3>
              </div>
              <button onClick={() => setShowDetectionResult(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>

            {/* 統計 */}
            <div style={{ padding: '16px 20px', background: 'var(--highlight)', display: 'flex', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>{detectionResult.stats.changed}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>変更対象</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>{detectionResult.stats.setDetected}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>セット品</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{detectionResult.stats.gradedDetected}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>グレード品</div>
              </div>
            </div>

            {/* 説明 */}
            <div style={{ padding: '16px 20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <Info size={14} style={{ display: 'inline', marginRight: 4 }} />
              タイトルから「PSA 10」「セット」「まとめ売り」等を検出し、フラグを設定します。
              セット品には自動的に「SET-」プレフィックスがSKUに付与されます。
            </div>

            {/* フッター */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => setShowDetectionResult(false)}
                style={{
                  padding: '8px 16px',
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleDetectionConfirm}
                disabled={isLoading || detectionResult.stats.changed === 0}
                style={{
                  padding: '8px 16px',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  opacity: isLoading || detectionResult.stats.changed === 0 ? 0.5 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {isLoading && loadingAction === 'detect-confirm' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                {detectionResult.stats.changed}件に適用
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
