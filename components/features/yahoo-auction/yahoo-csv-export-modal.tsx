/**
 * Yahoo CSV Export Modal
 * ヤフオク一括出品CSV生成モーダル
 * 
 * 機能:
 * - 利益率ベース価格計算
 * - プレビュー表示
 * - ガード条件（利益率チェック）
 * - Shift_JIS CSV自動ダウンロード
 * 
 * @version 2.0.0
 * @updated 2026-01-30
 */

'use client';

import React, { useState, useCallback, useEffect, memo } from 'react';
import {
  X,
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  Settings,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  Loader2,
} from 'lucide-react';
import {
  YahooCsvExportSettings,
  DEFAULT_CSV_EXPORT_SETTINGS,
  YahooAuctionMemberType,
} from '@/lib/yahooauction/types';

// ============================================================
// 型定義
// ============================================================

interface YahooCsvExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProductIds: number[];
  onExportComplete?: (result: ExportResult) => void;
}

interface ExportResult {
  success: boolean;
  fileName?: string;
  totalProducts: number;
  successCount: number;
  errorCount: number;
  totalProfit: number;
  guardViolations: number;
}

interface PreviewItem {
  productId: number;
  sku?: string;
  title: string;
  sellingPrice: number;
  netProceeds: number;
  profitRate: string;
  isProfitable: boolean;
  warnings: string[];
}

interface PreviewData {
  summary: {
    total: number;
    success: number;
    errors: number;
    totalProfit: number;
    guardViolations: number;
  };
  items: PreviewItem[];
}

// ============================================================
// ローカルストレージ管理
// ============================================================

const SETTINGS_KEY = 'yahoo_csv_export_settings';

function loadSavedSettings(): YahooCsvExportSettings {
  if (typeof window === 'undefined') return DEFAULT_CSV_EXPORT_SETTINGS;
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_CSV_EXPORT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load saved settings:', e);
  }
  return DEFAULT_CSV_EXPORT_SETTINGS;
}

function saveSettings(settings: YahooCsvExportSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}

// ============================================================
// メインコンポーネント
// ============================================================

export const YahooCsvExportModal = memo(function YahooCsvExportModal({
  isOpen,
  onClose,
  selectedProductIds,
  onExportComplete,
}: YahooCsvExportModalProps) {
  // ステート
  const [settings, setSettings] = useState<YahooCsvExportSettings>(loadSavedSettings);
  const [step, setStep] = useState<'settings' | 'preview' | 'exporting'>('settings');
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 設定変更ハンドラ
  const updateSettings = useCallback((key: keyof YahooCsvExportSettings, value: any) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      saveSettings(updated);
      return updated;
    });
  }, []);

  // プレビュー取得
  const fetchPreview = useCallback(async () => {
    if (selectedProductIds.length === 0) {
      setError('商品が選択されていません');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/yahoo/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProductIds,
          exportSettings: settings,
          outputFormat: 'preview',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'プレビューの取得に失敗しました');
      }

      setPreview({
        summary: data.summary,
        items: data.items,
      });
      setStep('preview');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductIds, settings]);

  // CSVダウンロード
  const downloadCsv = useCallback(async () => {
    setStep('exporting');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/yahoo/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productIds: selectedProductIds,
          exportSettings: settings,
          outputFormat: 'csv',
          saveLog: true,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'CSVの生成に失敗しました');
      }

      // Blobとしてダウンロード
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
      const fileName = fileNameMatch?.[1] || `yahoo_export_${Date.now()}.csv`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // 完了コールバック
      if (onExportComplete && preview) {
        onExportComplete({
          success: true,
          fileName,
          totalProducts: preview.summary.total,
          successCount: preview.summary.success,
          errorCount: preview.summary.errors,
          totalProfit: preview.summary.totalProfit,
          guardViolations: preview.summary.guardViolations,
        });
      }

      onClose();
    } catch (err: any) {
      setError(err.message);
      setStep('preview');
    } finally {
      setIsLoading(false);
    }
  }, [selectedProductIds, settings, preview, onExportComplete, onClose]);

  // モーダルが閉じたらリセット
  useEffect(() => {
    if (!isOpen) {
      setStep('settings');
      setPreview(null);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: step === 'preview' ? '900px' : '500px',
          maxHeight: '90vh',
          background: 'var(--panel)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--panel-border)',
            background: 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileSpreadsheet size={24} color="white" />
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'white', margin: 0 }}>
                ヤフオクCSV生成
              </h2>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {selectedProductIds.length}件の商品を出品
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
            }}
          >
            <X size={18} color="white" />
          </button>
        </div>

        {/* コンテンツ */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          {/* エラー表示 */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            >
              <AlertTriangle size={18} color="#ef4444" />
              <span style={{ fontSize: '13px', color: '#ef4444' }}>{error}</span>
            </div>
          )}

          {/* Step 1: 設定 */}
          {step === 'settings' && (
            <SettingsForm
              settings={settings}
              onUpdate={updateSettings}
              onNext={fetchPreview}
              isLoading={isLoading}
            />
          )}

          {/* Step 2: プレビュー */}
          {step === 'preview' && preview && (
            <PreviewTable
              preview={preview}
              settings={settings}
              onBack={() => setStep('settings')}
              onDownload={downloadCsv}
              isLoading={isLoading}
            />
          )}

          {/* Step 3: エクスポート中 */}
          {step === 'exporting' && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Loader2
                size={48}
                style={{ color: 'var(--color-primary)', animation: 'spin 1s linear infinite' }}
              />
              <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                CSVを生成しています...
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

// ============================================================
// 設定フォーム
// ============================================================

interface SettingsFormProps {
  settings: YahooCsvExportSettings;
  onUpdate: (key: keyof YahooCsvExportSettings, value: any) => void;
  onNext: () => void;
  isLoading: boolean;
}

const SettingsForm = memo(function SettingsForm({
  settings,
  onUpdate,
  onNext,
  isLoading,
}: SettingsFormProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 会員種別 */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text)' }}>
          会員種別
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { value: 'lyp_premium', label: 'LYPプレミアム (8.8%)', color: '#ff6b00' },
            { value: 'standard', label: '通常会員 (10%)', color: '#666' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onUpdate('memberType', opt.value as YahooAuctionMemberType)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: settings.memberType === opt.value
                  ? `2px solid ${opt.color}`
                  : '1px solid var(--panel-border)',
                borderRadius: '8px',
                background: settings.memberType === opt.value ? `${opt.color}10` : 'var(--panel)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: settings.memberType === opt.value ? 600 : 400,
                color: settings.memberType === opt.value ? opt.color : 'var(--text)',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 最低利益率 */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text)' }}>
          最低利益率
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={settings.minProfitRate}
            onChange={e => onUpdate('minProfitRate', parseInt(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{
            minWidth: '60px',
            padding: '8px 12px',
            background: 'var(--highlight)',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            textAlign: 'center',
            color: settings.minProfitRate >= 15 ? 'var(--color-success)' : 'var(--color-warning)',
          }}>
            {settings.minProfitRate}%
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          ※ この利益率を下回る商品は警告表示されます
        </p>
      </div>

      {/* 送料計算方式 */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text)' }}>
          送料計算方式
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onUpdate('shippingCalcMethod', 'actual')}
            style={{
              flex: 1,
              padding: '12px',
              border: settings.shippingCalcMethod === 'actual'
                ? '2px solid var(--color-primary)'
                : '1px solid var(--panel-border)',
              borderRadius: '8px',
              background: settings.shippingCalcMethod === 'actual' ? 'var(--highlight)' : 'var(--panel)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            実費計算（サイズ基準）
          </button>
          <button
            onClick={() => onUpdate('shippingCalcMethod', 'fixed')}
            style={{
              flex: 1,
              padding: '12px',
              border: settings.shippingCalcMethod === 'fixed'
                ? '2px solid var(--color-primary)'
                : '1px solid var(--panel-border)',
              borderRadius: '8px',
              background: settings.shippingCalcMethod === 'fixed' ? 'var(--highlight)' : 'var(--panel)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            固定金額
          </button>
        </div>
        {settings.shippingCalcMethod === 'fixed' && (
          <input
            type="number"
            value={settings.fixedShippingCost || 1000}
            onChange={e => onUpdate('fixedShippingCost', parseInt(e.target.value) || 0)}
            placeholder="固定送料（円）"
            style={{
              width: '100%',
              marginTop: '8px',
              padding: '10px 12px',
              border: '1px solid var(--panel-border)',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        )}
      </div>

      {/* 梱包材費 */}
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px', color: 'var(--text)' }}>
          梱包材費（円）
        </label>
        <input
          type="number"
          value={settings.packagingCost}
          onChange={e => onUpdate('packagingCost', parseInt(e.target.value) || 0)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid var(--panel-border)',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
      </div>

      {/* 損切り許容 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>
            損切り許容
          </span>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>
            ONにすると赤字商品もCSVに含まれます
          </p>
        </div>
        <button
          onClick={() => onUpdate('allowLossCut', !settings.allowLossCut)}
          style={{
            width: '50px',
            height: '28px',
            borderRadius: '14px',
            border: 'none',
            background: settings.allowLossCut ? 'var(--color-warning)' : 'var(--panel-border)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s',
          }}
        >
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: 'white',
              position: 'absolute',
              top: '3px',
              left: settings.allowLossCut ? '25px' : '3px',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
          />
        </button>
      </div>

      {/* 次へボタン */}
      <button
        onClick={onNext}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '14px',
          background: isLoading ? 'var(--panel-border)' : 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 600,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            計算中...
          </>
        ) : (
          <>
            <Calculator size={18} />
            価格計算・プレビュー
          </>
        )}
      </button>
    </div>
  );
});

// ============================================================
// プレビューテーブル
// ============================================================

interface PreviewTableProps {
  preview: PreviewData;
  settings: YahooCsvExportSettings;
  onBack: () => void;
  onDownload: () => void;
  isLoading: boolean;
}

const PreviewTable = memo(function PreviewTable({
  preview,
  settings,
  onBack,
  onDownload,
  isLoading,
}: PreviewTableProps) {
  const { summary, items } = preview;
  const hasErrors = summary.errors > 0;
  const hasWarnings = summary.guardViolations > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* サマリー */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
      >
        <SummaryCard
          label="合計"
          value={summary.total}
          suffix="件"
          color="var(--text)"
        />
        <SummaryCard
          label="成功"
          value={summary.success}
          suffix="件"
          color="var(--color-success)"
        />
        <SummaryCard
          label="警告"
          value={summary.guardViolations}
          suffix="件"
          color="var(--color-warning)"
        />
        <SummaryCard
          label="総利益"
          value={summary.totalProfit.toLocaleString()}
          prefix="¥"
          color={summary.totalProfit >= 0 ? 'var(--color-success)' : 'var(--color-error)'}
        />
      </div>

      {/* 警告メッセージ */}
      {(hasErrors || hasWarnings) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: hasErrors ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${hasErrors ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            borderRadius: '8px',
          }}
        >
          <AlertTriangle size={18} color={hasErrors ? '#ef4444' : '#f59e0b'} />
          <span style={{ fontSize: '13px', color: hasErrors ? '#ef4444' : '#f59e0b' }}>
            {hasErrors
              ? `${summary.errors}件の商品でエラーが発生しました`
              : `${summary.guardViolations}件の商品が利益率 ${settings.minProfitRate}% を下回っています`}
          </span>
        </div>
      )}

      {/* テーブル */}
      <div
        style={{
          border: '1px solid var(--panel-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxHeight: '400px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'var(--highlight)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 500 }}>商品名</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>販売価格</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>利益率</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 500 }}>状態</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.productId}
                  style={{
                    borderTop: '1px solid var(--panel-border)',
                    background: item.warnings.length > 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ fontWeight: 500 }}>{item.title.slice(0, 40)}{item.title.length > 40 ? '...' : ''}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.sku}</div>
                    {item.warnings.map((w, wi) => (
                      <div key={wi} style={{ fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>{w}</div>
                    ))}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                    ¥{item.sellingPrice.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: parseFloat(item.profitRate) >= settings.minProfitRate
                          ? 'var(--color-success)'
                          : parseFloat(item.profitRate) >= 0
                          ? 'var(--color-warning)'
                          : 'var(--color-error)',
                        fontWeight: 500,
                      }}
                    >
                      {parseFloat(item.profitRate) >= 0 ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {item.profitRate}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {item.isProfitable ? (
                      <CheckCircle size={18} color="var(--color-success)" />
                    ) : (
                      <AlertTriangle size={18} color="var(--color-warning)" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ボタン */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: '14px',
            background: 'var(--panel)',
            border: '1px solid var(--panel-border)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          ← 設定に戻る
        </button>
        <button
          onClick={onDownload}
          disabled={isLoading || summary.success === 0}
          style={{
            flex: 2,
            padding: '14px',
            background: summary.success === 0
              ? 'var(--panel-border)'
              : 'linear-gradient(135deg, #ff6b00 0%, #ff8c00 100%)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: summary.success === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Download size={18} />
          CSVダウンロード（{summary.success}件）
        </button>
      </div>

      {/* 注意書き */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          padding: '12px',
          background: 'var(--highlight)',
          borderRadius: '8px',
        }}
      >
        <Info size={16} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          <strong>文字コード:</strong> Shift_JIS（オークタウン対応）<br />
          <strong>注意:</strong> ダウンロード後、オークタウンにアップロードしてください。
        </div>
      </div>
    </div>
  );
});

// ============================================================
// サマリーカード
// ============================================================

interface SummaryCardProps {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  color: string;
}

const SummaryCard = memo(function SummaryCard({
  label,
  value,
  prefix,
  suffix,
  color,
}: SummaryCardProps) {
  return (
    <div
      style={{
        padding: '14px',
        background: 'var(--highlight)',
        borderRadius: '10px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 700, color }}>
        {prefix}
        {value}
        {suffix}
      </div>
    </div>
  );
});

export default YahooCsvExportModal;
