// components/tools/ToolExecutionPanel.tsx
/**
 * ToolExecutionPanel - n8nツール実行パネル
 * 
 * Phase 4.5: 142個のn8n JSONをUIから実行可能にする
 * 
 * 特徴:
 * - tool-definitions.ts から自動生成
 * - カテゴリ別表示
 * - dispatch API経由で実行
 * - 実行状態・履歴表示
 * 
 * 使用方法:
 * <ToolExecutionPanel category="listing" />
 * <ToolExecutionPanel category="research" />
 */

'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import {
  Play, Loader2, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight,
  Settings, AlertTriangle, Zap, RefreshCw,
} from 'lucide-react';
import { TOOL_DEFINITIONS, DEFAULT_FIELDS_BY_CATEGORY } from '@/components/n3/empire/tool-definitions';
import type { ToolConfig, ToolField } from '@/components/n3/empire/base-tool-layout';

// ============================================================
// 型定義
// ============================================================

export type ToolCategory = 
  | 'listing' 
  | 'inventory' 
  | 'research' 
  | 'media' 
  | 'finance' 
  | 'system' 
  | 'empire' 
  | 'defense' 
  | 'other';

interface ExecutionResult {
  success: boolean;
  jobId?: string;
  error?: string;
  data?: any;
}

interface ToolExecutionPanelProps {
  /** 表示するカテゴリ */
  category: ToolCategory;
  /** コンパクトモード（ボタンのみ） */
  compact?: boolean;
  /** 実行完了時コールバック */
  onExecutionComplete?: (toolId: string, result: ExecutionResult) => void;
  /** カスタムクラス */
  className?: string;
}

// ============================================================
// Dispatch呼び出し関数
// ============================================================

async function dispatchTool(
  toolId: string, 
  action: string = 'execute', 
  params: Record<string, any> = {}
): Promise<ExecutionResult> {
  try {
    const response = await fetch('/api/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId,
        action,
        params,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }
    
    return {
      success: data.success ?? true,
      jobId: data.jobId,
      data: data.data,
      error: data.error,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error',
    };
  }
}

// ============================================================
// サブコンポーネント
// ============================================================

const ToolButton = memo(function ToolButton({
  tool,
  isExpanded,
  isExecuting,
  lastResult,
  onToggle,
  onExecute,
}: {
  tool: ToolConfig & { id: string };
  isExpanded: boolean;
  isExecuting: boolean;
  lastResult?: ExecutionResult;
  onToggle: () => void;
  onExecute: (params: Record<string, any>) => void;
}) {
  const [params, setParams] = useState<Record<string, any>>({});
  const fields = DEFAULT_FIELDS_BY_CATEGORY[tool.category] || [];
  
  // クイック実行（デフォルトパラメータ）
  const handleQuickExecute = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExecute({});
  };
  
  // パラメータ付き実行
  const handleExecuteWithParams = () => {
    onExecute(params);
  };
  
  return (
    <div
      style={{
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
        overflow: 'hidden',
        marginBottom: 8,
      }}
    >
      {/* ヘッダー */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          cursor: 'pointer',
          background: isExpanded ? 'var(--panel-alt)' : 'transparent',
        }}
      >
        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
            {tool.name}
          </div>
          {tool.description && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {tool.description}
            </div>
          )}
        </div>
        
        {/* ステータスアイコン */}
        {isExecuting && <Loader2 size={16} className="animate-spin" style={{ color: 'var(--accent)' }} />}
        {!isExecuting && lastResult?.success && <CheckCircle size={16} style={{ color: 'var(--success)' }} />}
        {!isExecuting && lastResult?.success === false && <XCircle size={16} style={{ color: 'var(--error)' }} />}
        
        {/* クイック実行ボタン */}
        <button
          onClick={handleQuickExecute}
          disabled={isExecuting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 6,
            border: 'none',
            background: isExecuting ? 'var(--panel-alt)' : 'var(--accent)',
            color: 'white',
            fontSize: 11,
            fontWeight: 600,
            cursor: isExecuting ? 'not-allowed' : 'pointer',
          }}
        >
          {isExecuting ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
          実行
        </button>
      </div>
      
      {/* 展開パネル */}
      {isExpanded && (
        <div style={{ padding: '12px', borderTop: '1px solid var(--panel-border)' }}>
          {/* パラメータフィールド */}
          {fields.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                パラメータ
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {fields.slice(0, 4).map((field) => (
                  <div key={field.id}>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={params[field.id] || ''}
                        onChange={(e) => setParams({ ...params, [field.id]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--panel-border)',
                          background: 'var(--bg)',
                          color: 'var(--text)',
                          fontSize: 12,
                        }}
                      >
                        <option value="">選択してください</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={params[field.id] || ''}
                        onChange={(e) => setParams({ ...params, [field.id]: e.target.value })}
                        placeholder={field.placeholder}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: 6,
                          border: '1px solid var(--panel-border)',
                          background: 'var(--bg)',
                          color: 'var(--text)',
                          fontSize: 12,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 実行ボタン（パラメータ付き） */}
          <button
            onClick={handleExecuteWithParams}
            disabled={isExecuting}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: isExecuting ? 'var(--panel-alt)' : 'var(--accent)',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: isExecuting ? 'not-allowed' : 'pointer',
            }}
          >
            {isExecuting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                実行中...
              </>
            ) : (
              <>
                <Zap size={14} />
                パラメータ付きで実行
              </>
            )}
          </button>
          
          {/* 最後の結果表示 */}
          {lastResult && (
            <div
              style={{
                marginTop: 12,
                padding: 10,
                borderRadius: 6,
                background: lastResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${lastResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: lastResult.success ? 'var(--success)' : 'var(--error)' }}>
                {lastResult.success ? '✓ 成功' : '✗ 失敗'}
              </div>
              {lastResult.jobId && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                  Job ID: {lastResult.jobId}
                </div>
              )}
              {lastResult.error && (
                <div style={{ fontSize: 11, color: 'var(--error)', marginTop: 4 }}>
                  {lastResult.error}
                </div>
              )}
            </div>
          )}
          
          {/* メタ情報 */}
          <div style={{ marginTop: 12, fontSize: 10, color: 'var(--text-muted)' }}>
            <div>Webhook: {tool.webhookPath}</div>
            <div>Version: {tool.version}</div>
            <div>Security: {tool.security}</div>
          </div>
        </div>
      )}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const ToolExecutionPanel = memo(function ToolExecutionPanel({
  category,
  compact = false,
  onExecutionComplete,
  className = '',
}: ToolExecutionPanelProps) {
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);
  const [executingTools, setExecutingTools] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Record<string, ExecutionResult>>({});
  
  // カテゴリのツール一覧を取得
  const tools = useMemo(() => {
    return Object.entries(TOOL_DEFINITIONS)
      .filter(([_, tool]) => tool.category === category)
      .map(([id, tool]) => ({ id, ...tool }));
  }, [category]);
  
  // ツール実行
  const handleExecute = useCallback(async (toolId: string, params: Record<string, any>) => {
    setExecutingTools((prev) => new Set(prev).add(toolId));
    
    const result = await dispatchTool(toolId, 'execute', params);
    
    setResults((prev) => ({ ...prev, [toolId]: result }));
    setExecutingTools((prev) => {
      const next = new Set(prev);
      next.delete(toolId);
      return next;
    });
    
    if (onExecutionComplete) {
      onExecutionComplete(toolId, result);
    }
  }, [onExecutionComplete]);
  
  // トグル
  const handleToggle = useCallback((toolId: string) => {
    setExpandedToolId((prev) => (prev === toolId ? null : toolId));
  }, []);
  
  if (tools.length === 0) {
    return (
      <div
        className={className}
        style={{
          padding: 24,
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <AlertTriangle size={24} style={{ marginBottom: 8, opacity: 0.5 }} />
        <div style={{ fontSize: 13 }}>このカテゴリにツールがありません</div>
      </div>
    );
  }
  
  // コンパクトモード（ボタンのみ）
  if (compact) {
    return (
      <div className={className} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {tools.map((tool) => {
          const isExecuting = executingTools.has(tool.id);
          const result = results[tool.id];
          
          return (
            <button
              key={tool.id}
              onClick={() => handleExecute(tool.id, {})}
              disabled={isExecuting}
              title={tool.description}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid var(--panel-border)',
                background: isExecuting ? 'var(--panel-alt)' : 'var(--panel)',
                color: 'var(--text)',
                fontSize: 12,
                cursor: isExecuting ? 'not-allowed' : 'pointer',
              }}
            >
              {isExecuting ? (
                <Loader2 size={12} className="animate-spin" />
              ) : result?.success ? (
                <CheckCircle size={12} style={{ color: 'var(--success)' }} />
              ) : result?.success === false ? (
                <XCircle size={12} style={{ color: 'var(--error)' }} />
              ) : (
                <Play size={12} />
              )}
              {tool.name.replace(/【[^】]+】/, '').slice(0, 20)}
            </button>
          );
        })}
      </div>
    );
  }
  
  // フルモード
  return (
    <div className={className}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
          {category.charAt(0).toUpperCase() + category.slice(1)} Tools
          <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
            ({tools.length}件)
          </span>
        </div>
        <button
          onClick={() => setResults({})}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            borderRadius: 4,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 11,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={12} />
          リセット
        </button>
      </div>
      
      {/* ツールリスト */}
      <div>
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            tool={tool}
            isExpanded={expandedToolId === tool.id}
            isExecuting={executingTools.has(tool.id)}
            lastResult={results[tool.id]}
            onToggle={() => handleToggle(tool.id)}
            onExecute={(params) => handleExecute(tool.id, params)}
          />
        ))}
      </div>
    </div>
  );
});

export default ToolExecutionPanel;
