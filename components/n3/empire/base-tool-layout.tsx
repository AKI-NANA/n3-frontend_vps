// components/n3/empire/base-tool-layout.tsx
/**
 * 🏰 Empire BaseToolLayout - 全ツール共通レイアウト金型
 * 
 * editing-n3 のデザインを完全継承し、79個のUIを量産するための基盤コンポーネント
 * 
 * 設計原則:
 * 1. デザインは一切変更しない（editing-n3 と同一の見た目）
 * 2. Webhook接続先と入力項目のみ動的に変更
 * 3. 全てのツールで共通のUX体験を提供
 */

'use client';

import React, { useState, useEffect, useCallback, useRef, ReactNode, useMemo } from 'react';
import { 
  Settings, RefreshCw, Play, Pause, CheckCircle, AlertCircle, 
  XCircle, Clock, Loader2, ChevronDown, ChevronRight, 
  ExternalLink, FileText, Zap, BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { N3CollapsibleHeader, N3Footer, N3Pagination, N3Divider } from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

export interface ToolConfig {
  /** ツール名（日本語） */
  name: string;
  /** ツール名（英語） */
  nameEn: string;
  /** カテゴリ */
  category: 'listing' | 'inventory' | 'research' | 'media' | 'finance' | 'system' | 'empire' | 'defense' | 'other';
  /** n8n Webhookパス（例: 'listing-reserve'） */
  webhookPath: string;
  /** 機能詳細 */
  description: string;
  /** JSONファイル名 */
  jsonFile?: string;
  /** バージョン */
  version?: 'V5' | 'V6';
  /** セキュリティ判定 */
  security?: 'A' | 'B' | 'C';
  /** 関連DBテーブル */
  dbTables?: string[];
}

export interface ToolField {
  /** フィールドID */
  id: string;
  /** ラベル（日本語） */
  label: string;
  /** ラベル（英語） */
  labelEn: string;
  /** 入力タイプ */
  type: 'text' | 'number' | 'select' | 'multiselect' | 'checkbox' | 'date' | 'datetime' | 'file' | 'textarea' | 'json';
  /** 選択肢（select/multiselect用） */
  options?: { value: string; label: string }[];
  /** 必須フラグ */
  required?: boolean;
  /** デフォルト値 */
  defaultValue?: any;
  /** プレースホルダー */
  placeholder?: string;
  /** 説明文 */
  hint?: string;
  /** バリデーション関数 */
  validate?: (value: any) => string | null;
}

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'running';
  message: string;
  details?: any;
  duration?: number;
}

export interface BaseToolLayoutProps {
  /** ツール設定 */
  config: ToolConfig;
  /** 入力フィールド定義 */
  fields: ToolField[];
  /** カスタムアクション */
  customActions?: {
    id: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  /** 実行前のバリデーション */
  onValidate?: (data: Record<string, any>) => { valid: boolean; errors: string[] };
  /** 実行処理 */
  onExecute?: (data: Record<string, any>) => Promise<{ success: boolean; message: string; data?: any }>;
  /** カスタムコンテンツ（テーブル等） */
  children?: ReactNode;
  /** データロード関数 */
  onLoadData?: () => Promise<any[]>;
  /** データ */
  data?: any[];
  /** ローディング状態 */
  loading?: boolean;
  /** エラー状態 */
  error?: string | null;
}

// ============================================================
// N8N_BASE_URL
// ============================================================
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';

// ============================================================
// ユーティリティ
// ============================================================

const CATEGORY_COLORS: Record<string, string> = {
  listing: '#3b82f6',      // blue
  inventory: '#10b981',    // emerald
  research: '#8b5cf6',     // violet
  media: '#f59e0b',        // amber
  finance: '#ef4444',      // red
  system: '#6b7280',       // gray
  empire: '#ec4899',       // pink
  defense: '#14b8a6',      // teal
  other: '#78716c',        // stone
};

const CATEGORY_LABELS: Record<string, string> = {
  listing: '出品',
  inventory: '在庫',
  research: 'リサーチ',
  media: 'メディア',
  finance: '経理',
  system: 'システム',
  empire: '帝国',
  defense: '防衛',
  other: 'その他',
};

const STATUS_ICONS = {
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  running: Loader2,
};

const STATUS_COLORS = {
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  running: '#3b82f6',
};

// ============================================================
// メインコンポーネント
// ============================================================

export function BaseToolLayout({
  config,
  fields,
  customActions = [],
  onValidate,
  onExecute,
  children,
  onLoadData,
  data = [],
  loading = false,
  error = null,
}: BaseToolLayoutProps) {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [executing, setExecuting] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [language, setLanguage] = useState<'ja' | 'en'>('ja');
  const logContainerRef = useRef<HTMLDivElement>(null);

  // フォームデータ初期化
  useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialData[field.id] = field.defaultValue;
      }
    });
    setFormData(initialData);
  }, [fields]);

  // ログ自動スクロール
  useEffect(() => {
    if (logContainerRef.current && showLogs) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, showLogs]);

  // フィールド値変更
  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  // ログ追加
  const addLog = useCallback((log: Omit<ExecutionLog, 'id' | 'timestamp'>) => {
    setLogs(prev => [...prev, {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      timestamp: new Date(),
    }]);
  }, []);

  // n8n Webhook実行
  const executeWebhook = useCallback(async () => {
    // バリデーション
    if (onValidate) {
      const validation = onValidate(formData);
      if (!validation.valid) {
        validation.errors.forEach(err => {
          addLog({ status: 'error', message: err });
        });
        return;
      }
    }

    setExecuting(true);
    setShowLogs(true);
    
    addLog({ status: 'running', message: `🚀 ${config.name} 実行開始...` });

    const startTime = Date.now();

    try {
      // カスタム実行ハンドラがある場合
      if (onExecute) {
        const result = await onExecute(formData);
        const duration = Date.now() - startTime;
        
        addLog({
          status: result.success ? 'success' : 'error',
          message: result.message,
          details: result.data,
          duration,
        });
        return;
      }

      // n8n Webhook呼び出し
      const webhookUrl = `${N8N_BASE_URL}/${config.webhookPath}`;
      
      addLog({ status: 'running', message: `📡 Webhook送信中: ${webhookUrl}` });

      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: config.webhookPath,
          data: {
            ...formData,
            timestamp: new Date().toISOString(),
            source: 'empire-ui',
            toolName: config.name,
          },
        }),
      });

      const result = await response.json();
      const duration = Date.now() - startTime;

      if (result.success) {
        addLog({
          status: 'success',
          message: `✅ 完了: ${result.message || '正常終了'}`,
          details: result.data,
          duration,
        });
      } else {
        addLog({
          status: 'error',
          message: `❌ エラー: ${result.message || result.error || '不明なエラー'}`,
          details: result,
          duration,
        });
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      addLog({
        status: 'error',
        message: `❌ 例外: ${err.message}`,
        duration,
      });
    } finally {
      setExecuting(false);
    }
  }, [formData, config, onValidate, onExecute, addLog]);

  // フィールドレンダリング
  const renderField = useCallback((field: ToolField) => {
    const value = formData[field.id] ?? '';
    const label = language === 'ja' ? field.label : field.labelEn;

    switch (field.type) {
      case 'select':
        return (
          <div key={field.id} className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)',
              }}
            >
              <option value="">{field.placeholder || '選択...'}</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {field.hint && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{field.hint}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="mb-3 flex items-center gap-2">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
              className="w-4 h-4 rounded"
              style={{ accentColor: 'var(--accent)' }}
            />
            <label htmlFor={field.id} className="text-sm" style={{ color: 'var(--text)' }}>
              {label}
            </label>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
            {field.hint && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{field.hint}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)',
              }}
            />
            {field.hint && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{field.hint}</p>
            )}
          </div>
        );

      case 'json':
        return (
          <div key={field.id} className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <textarea
              value={typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
              onChange={(e) => {
                try {
                  handleFieldChange(field.id, JSON.parse(e.target.value));
                } catch {
                  handleFieldChange(field.id, e.target.value);
                }
              }}
              placeholder={field.placeholder || '{ "key": "value" }'}
              rows={6}
              className="w-full px-3 py-2 rounded text-sm font-mono"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)',
                resize: 'vertical',
              }}
            />
            {field.hint && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{field.hint}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.id} className="mb-3">
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded text-sm"
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--panel-border)',
                color: 'var(--text)',
              }}
            />
            {field.hint && (
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{field.hint}</p>
            )}
          </div>
        );
    }
  }, [formData, language, handleFieldChange]);

  // カテゴリカラー
  const categoryColor = CATEGORY_COLORS[config.category] || CATEGORY_COLORS.other;
  const categoryLabel = CATEGORY_LABELS[config.category] || CATEGORY_LABELS.other;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div 
        id="main-scroll-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          height: '100%', 
          minWidth: 0, 
          overflow: 'auto' 
        }}
      >
        {/* ヘッダー */}
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10} transitionDuration={200} zIndex={40}>
          {/* メインヘッダー */}
          <div 
            style={{ 
              height: 56, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0 16px',
              background: 'var(--panel)', 
              borderBottom: '1px solid var(--panel-border)' 
            }}
          >
            <div className="flex items-center gap-3">
              {/* カテゴリバッジ */}
              <div 
                className="px-2 py-1 rounded text-xs font-semibold"
                style={{ background: categoryColor, color: 'white' }}
              >
                {categoryLabel}
              </div>
              
              {/* ツール名 */}
              <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
                {language === 'ja' ? config.name : config.nameEn}
              </h1>
              
              {/* バージョンバッジ */}
              {config.version && (
                <span 
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ 
                    background: config.version === 'V6' ? '#22c55e' : '#6b7280',
                    color: 'white'
                  }}
                >
                  {config.version}
                </span>
              )}
              
              {/* セキュリティバッジ */}
              {config.security && (
                <span 
                  className="px-2 py-0.5 rounded text-xs"
                  style={{ 
                    background: config.security === 'A' ? '#22c55e' : config.security === 'B' ? '#f59e0b' : '#ef4444',
                    color: 'white'
                  }}
                >
                  セキュリティ: {config.security}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 言語切替 */}
              <button
                onClick={() => setLanguage(l => l === 'ja' ? 'en' : 'ja')}
                className="px-2 py-1 rounded text-xs"
                style={{ 
                  background: 'var(--highlight)', 
                  color: 'var(--text-muted)',
                  border: '1px solid var(--panel-border)'
                }}
              >
                {language === 'ja' ? 'EN' : 'JA'}
              </button>
              
              {/* n8n直リンク */}
              <a
                href={`http://160.16.120.186:5678/workflow`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 rounded text-xs"
                style={{ 
                  background: 'var(--highlight)', 
                  color: 'var(--text-muted)',
                  border: '1px solid var(--panel-border)'
                }}
              >
                <ExternalLink size={12} />
                n8n
              </a>

              {/* ログアウト */}
              {user && (
                <button
                  onClick={logout}
                  className="px-3 py-1 rounded text-xs"
                  style={{ 
                    background: 'transparent', 
                    color: 'var(--text-muted)',
                    border: '1px solid var(--panel-border)'
                  }}
                >
                  ログアウト
                </button>
              )}
            </div>
          </div>

          {/* サブヘッダー: 説明 */}
          <div 
            style={{ 
              height: 36, 
              display: 'flex', 
              alignItems: 'center',
              padding: '0 16px',
              background: 'var(--highlight)', 
              borderBottom: '1px solid var(--panel-border)',
              fontSize: 12,
              color: 'var(--text-muted)'
            }}
          >
            <FileText size={14} className="mr-2" />
            {config.description}
            {config.jsonFile && (
              <span className="ml-4 opacity-60">
                📁 {config.jsonFile}
              </span>
            )}
          </div>
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 左サイドバー: 入力フォーム */}
          <div 
            style={{ 
              width: 320, 
              flexShrink: 0,
              background: 'var(--panel)',
              borderRight: '1px solid var(--panel-border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* フォーム */}
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                  {language === 'ja' ? '⚙️ 設定' : '⚙️ Settings'}
                </h3>
                {fields.map(renderField)}
              </div>

              {/* カスタムアクション */}
              {customActions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text)' }}>
                    {language === 'ja' ? '🎯 アクション' : '🎯 Actions'}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {customActions.map(action => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          onClick={action.onClick}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
                          style={{
                            background: action.variant === 'danger' ? '#ef4444' : action.variant === 'secondary' ? 'var(--highlight)' : 'var(--accent)',
                            color: action.variant === 'secondary' ? 'var(--text)' : 'white',
                            border: action.variant === 'secondary' ? '1px solid var(--panel-border)' : 'none'
                          }}
                        >
                          {Icon && <Icon size={14} />}
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 実行ボタン */}
            <div style={{ padding: 16, borderTop: '1px solid var(--panel-border)' }}>
              <button
                onClick={executeWebhook}
                disabled={executing}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all"
                style={{
                  background: executing ? 'var(--highlight)' : 'var(--accent)',
                  color: executing ? 'var(--text-muted)' : 'white',
                  cursor: executing ? 'not-allowed' : 'pointer'
                }}
              >
                {executing ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {language === 'ja' ? '実行中...' : 'Running...'}
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    {language === 'ja' ? '▶️ 実行' : '▶️ Execute'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 中央: メインコンテンツエリア */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* カスタムコンテンツ or デフォルト */}
            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} />
                </div>
              )}
              
              {error && (
                <div 
                  className="p-4 rounded-lg mb-4"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444' }}
                >
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#ef4444' }}>
                    <XCircle size={16} />
                    {error}
                  </div>
                </div>
              )}

              {children || (
                <div 
                  className="flex items-center justify-center h-full"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div className="text-center">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">
                      {language === 'ja' 
                        ? '左側のフォームを設定して「実行」をクリック'
                        : 'Configure settings on the left and click "Execute"'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 右サイドバー: ログ */}
          <div 
            style={{ 
              width: showLogs ? 360 : 48, 
              flexShrink: 0,
              background: 'var(--panel)',
              borderLeft: '1px solid var(--panel-border)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.2s ease'
            }}
          >
            {/* ログトグルヘッダー */}
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center gap-2 p-3 text-sm font-medium"
              style={{ 
                background: 'var(--highlight)',
                borderBottom: '1px solid var(--panel-border)',
                color: 'var(--text)',
                justifyContent: showLogs ? 'flex-start' : 'center'
              }}
            >
              {showLogs ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
              {showLogs && (language === 'ja' ? '📋 実行ログ' : '📋 Logs')}
              {!showLogs && <Clock size={16} />}
              {logs.length > 0 && (
                <span 
                  className="ml-auto px-2 py-0.5 rounded-full text-xs"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  {logs.length}
                </span>
              )}
            </button>

            {/* ログ一覧 */}
            {showLogs && (
              <div 
                ref={logContainerRef}
                style={{ flex: 1, overflow: 'auto', padding: 12 }}
              >
                {logs.length === 0 ? (
                  <div className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    {language === 'ja' ? 'ログはまだありません' : 'No logs yet'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map(log => {
                      const StatusIcon = STATUS_ICONS[log.status];
                      return (
                        <div 
                          key={log.id}
                          className="p-2 rounded"
                          style={{ 
                            background: 'var(--highlight)',
                            borderLeft: `3px solid ${STATUS_COLORS[log.status]}`
                          }}
                        >
                          <div className="flex items-start gap-2">
                            <StatusIcon 
                              size={14} 
                              className={log.status === 'running' ? 'animate-spin' : ''}
                              style={{ color: STATUS_COLORS[log.status], marginTop: 2 }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs" style={{ color: 'var(--text)' }}>
                                {log.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {log.timestamp.toLocaleTimeString()}
                                </span>
                                {log.duration && (
                                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    ({(log.duration / 1000).toFixed(1)}s)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ログクリアボタン */}
                {logs.length > 0 && (
                  <button
                    onClick={() => setLogs([])}
                    className="w-full mt-4 px-3 py-2 rounded text-xs"
                    style={{ 
                      background: 'var(--highlight)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--panel-border)'
                    }}
                  >
                    {language === 'ja' ? '🗑️ ログをクリア' : '🗑️ Clear logs'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* フッター */}
        <N3Footer 
          copyright="© 2025 N3 Empire" 
          version={`v3.0.0 (${config.version || 'V5'})`}
          status={{ label: 'n8n', connected: true }}
          links={[
            { id: 'n8n', label: 'n8n Dashboard', href: 'http://160.16.120.186:5678' },
            { id: 'docs', label: 'Docs', href: '#' }
          ]}
        />
      </div>
    </div>
  );
}

export default BaseToolLayout;
