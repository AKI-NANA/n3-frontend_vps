// components/tools/UniversalToolRunner.tsx
/**
 * 🏰 Universal Tool Runner
 * 
 * Phase B-2: 全ツールを統一UIで実行可能にする
 * 
 * - tool-definitions.ts から動的フォーム生成
 * - Dispatch API 経由で n8n 実行
 * - 実行履歴連携
 * - 検索・フィルタ・ソート機能
 * 
 * 禁止事項:
 * - 個別ページ作成禁止
 * - Sidebar追加禁止
 * - Hub追加禁止
 */

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Search, Filter, Play, Loader2, CheckCircle, XCircle, Clock,
  ChevronRight, ChevronDown, RefreshCw, Settings, History, Zap,
  Package, ShoppingBag, TrendingUp, DollarSign, Film, Shield, 
  Server, Users, HelpCircle, Star, AlertTriangle
} from 'lucide-react';
import TOOL_DEFINITIONS, { DEFAULT_FIELDS_BY_CATEGORY, getToolsByCategory, ToolConfig } from '@/components/n3/empire/tool-definitions';
import type { ToolField } from '@/components/n3/empire/base-tool-layout';

// ============================================================
// 型定義
// ============================================================

interface ExecutionResult {
  success: boolean;
  jobId?: string;
  data?: any;
  error?: string;
  timestamp: string;
}

interface RecentExecution {
  toolId: string;
  timestamp: string;
  status: 'success' | 'error' | 'running';
}

// カテゴリアイコンマッピング
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  listing: <ShoppingBag className="w-4 h-4" />,
  inventory: <Package className="w-4 h-4" />,
  research: <Search className="w-4 h-4" />,
  finance: <DollarSign className="w-4 h-4" />,
  media: <Film className="w-4 h-4" />,
  defense: <Shield className="w-4 h-4" />,
  system: <Server className="w-4 h-4" />,
  empire: <Users className="w-4 h-4" />,
  other: <HelpCircle className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  listing: '#3B82F6',
  inventory: '#10B981',
  research: '#8B5CF6',
  finance: '#F59E0B',
  media: '#EC4899',
  defense: '#EF4444',
  system: '#6366F1',
  empire: '#14B8A6',
  other: '#6B7280',
};

const CATEGORY_LABELS: Record<string, string> = {
  listing: '出品',
  inventory: '在庫',
  research: 'リサーチ',
  finance: '経理',
  media: 'メディア',
  defense: '防衛',
  system: '司令塔',
  empire: '帝国',
  other: 'その他',
};

// ============================================================
// Universal Tool Runner コンポーネント
// ============================================================

interface UniversalToolRunnerProps {
  initialToolId?: string;
  showSearch?: boolean;
  showCategories?: boolean;
  showHistory?: boolean;
  compact?: boolean;
}

export function UniversalToolRunner({
  initialToolId,
  showSearch = true,
  showCategories = true,
  showHistory = true,
  compact = false,
}: UniversalToolRunnerProps) {
  // State
  const [selectedToolId, setSelectedToolId] = useState<string | null>(initialToolId || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [recentExecutions, setRecentExecutions] = useState<RecentExecution[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['listing', 'inventory', 'research']));
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // ツール一覧をカテゴリ別にグループ化
  const toolsByCategory = useMemo(() => getToolsByCategory(), []);
  
  // 検索・フィルタ適用
  const filteredTools = useMemo(() => {
    const allTools = Object.entries(TOOL_DEFINITIONS);
    
    return allTools.filter(([id, tool]) => {
      // カテゴリフィルタ
      if (categoryFilter !== 'all' && tool.category !== categoryFilter) {
        return false;
      }
      
      // 検索フィルタ
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          id.toLowerCase().includes(query) ||
          tool.name.toLowerCase().includes(query) ||
          (tool.nameEn?.toLowerCase().includes(query)) ||
          tool.description.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [searchQuery, categoryFilter]);

  // フィルタされたツールをカテゴリ別にグループ化
  const filteredByCategory = useMemo(() => {
    const grouped: Record<string, [string, ToolConfig][]> = {};
    
    filteredTools.forEach(([id, tool]) => {
      if (!grouped[tool.category]) {
        grouped[tool.category] = [];
      }
      grouped[tool.category].push([id, tool]);
    });
    
    return grouped;
  }, [filteredTools]);

  // 選択中のツール
  const selectedTool = selectedToolId ? TOOL_DEFINITIONS[selectedToolId] : null;

  // フィールド取得（ツール固有 + カテゴリデフォルト）
  const getFieldsForTool = useCallback((tool: ToolConfig): ToolField[] => {
    if (tool.fields && tool.fields.length > 0) {
      return tool.fields;
    }
    return DEFAULT_FIELDS_BY_CATEGORY[tool.category] || DEFAULT_FIELDS_BY_CATEGORY.other;
  }, []);

  // カテゴリ展開/折りたたみ
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  // お気に入りトグル
  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  // フォームデータ更新
  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };

  // ツール実行
  const executeTool = async () => {
    if (!selectedToolId || !selectedTool) return;
    
    setIsExecuting(true);
    setExecutionResult(null);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedToolId,
          action: 'execute',
          params: formData,
          metadata: {
            source: 'UniversalToolRunner',
            timestamp: new Date().toISOString(),
          },
        }),
      });
      
      const result = await response.json();
      
      setExecutionResult({
        success: result.success,
        jobId: result.jobId,
        data: result.data,
        error: result.error,
        timestamp: new Date().toISOString(),
      });
      
      // 実行履歴に追加
      setRecentExecutions(prev => [
        { toolId: selectedToolId, timestamp: new Date().toISOString(), status: result.success ? 'success' : 'error' },
        ...prev.slice(0, 9),
      ]);
      
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsExecuting(false);
    }
  };

  // ツール選択時にフォームをリセット
  useEffect(() => {
    setFormData({});
    setExecutionResult(null);
  }, [selectedToolId]);

  return (
    <div className={`flex ${compact ? 'flex-col' : 'flex-row'} gap-4 h-full`}>
      {/* 左パネル: ツール一覧 */}
      {showCategories && (
        <div className={`${compact ? 'w-full' : 'w-80'} flex-shrink-0 bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden flex flex-col`}>
          {/* 検索バー */}
          {showSearch && (
            <div className="p-3 border-b border-[var(--panel-border)]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ツールを検索..."
                  className="w-full pl-10 pr-4 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
              
              {/* カテゴリフィルタ */}
              <div className="flex gap-1 mt-2 flex-wrap">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    categoryFilter === 'all' 
                      ? 'bg-blue-500/20 text-blue-500' 
                      : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  全て ({Object.keys(TOOL_DEFINITIONS).length})
                </button>
                {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                  const count = toolsByCategory[cat]?.length || 0;
                  if (count === 0) return null;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        categoryFilter === cat 
                          ? `bg-opacity-20 text-[${CATEGORY_COLORS[cat]}]` 
                          : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                      style={{
                        backgroundColor: categoryFilter === cat ? `${CATEGORY_COLORS[cat]}20` : undefined,
                        color: categoryFilter === cat ? CATEGORY_COLORS[cat] : undefined,
                      }}
                    >
                      {label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* ツールリスト */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(filteredByCategory).map(([category, tools]) => (
              <div key={category}>
                {/* カテゴリヘッダー */}
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full px-3 py-2 flex items-center justify-between bg-[var(--highlight)] hover:bg-[var(--highlight-hover)] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: CATEGORY_COLORS[category] }}>
                      {CATEGORY_ICONS[category]}
                    </span>
                    <span className="text-sm font-medium">{CATEGORY_LABELS[category]}</span>
                    <span className="text-xs text-[var(--text-muted)]">({tools.length})</span>
                  </div>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </button>
                
                {/* ツールアイテム */}
                {expandedCategories.has(category) && (
                  <div className="divide-y divide-[var(--panel-border)]">
                    {tools.map(([id, tool]) => (
                      <button
                        key={id}
                        onClick={() => setSelectedToolId(id)}
                        className={`w-full px-3 py-2 text-left hover:bg-[var(--highlight)] transition-colors ${
                          selectedToolId === id ? 'bg-blue-500/10 border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{tool.name}</div>
                            <div className="text-xs text-[var(--text-muted)] truncate">{tool.description}</div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
                              className={`p-1 rounded hover:bg-[var(--highlight)] ${favorites.has(id) ? 'text-yellow-500' : 'text-[var(--text-muted)]'}`}
                            >
                              <Star className="w-3 h-3" fill={favorites.has(id) ? 'currentColor' : 'none'} />
                            </button>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              tool.security === 'A' ? 'bg-red-500/20 text-red-500' :
                              tool.security === 'B' ? 'bg-yellow-500/20 text-yellow-500' :
                              'bg-green-500/20 text-green-500'
                            }`}>
                              {tool.security}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {filteredTools.length === 0 && (
              <div className="p-8 text-center text-[var(--text-muted)]">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>ツールが見つかりません</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* 右パネル: ツール実行 */}
      <div className="flex-1 bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden flex flex-col">
        {selectedTool ? (
          <>
            {/* ツールヘッダー */}
            <div className="p-4 border-b border-[var(--panel-border)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${CATEGORY_COLORS[selectedTool.category]}20` }}
                  >
                    <span style={{ color: CATEGORY_COLORS[selectedTool.category] }}>
                      {CATEGORY_ICONS[selectedTool.category]}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{selectedTool.name}</h2>
                    <p className="text-sm text-[var(--text-muted)]">{selectedTool.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-muted)]">
                    {selectedTool.version}
                  </span>
                  <span className="text-xs px-2 py-1 bg-[var(--highlight)] rounded">
                    {selectedTool.webhookPath}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 入力フォーム */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {getFieldsForTool(selectedTool).map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    )}
                    
                    {field.type === 'number' && (
                      <input
                        type="number"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, Number(e.target.value))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    )}
                    
                    {field.type === 'select' && field.options && (
                      <select
                        value={formData[field.id] || field.defaultValue || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="">選択してください</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-3 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-vertical"
                      />
                    )}
                    
                    {field.type === 'checkbox' && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData[field.id] || field.defaultValue || false}
                          onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                          className="w-4 h-4 rounded border-[var(--panel-border)]"
                        />
                        <span className="text-sm">{field.labelEn || field.label}</span>
                      </label>
                    )}
                    
                    {field.type === 'date' && (
                      <input
                        type="date"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    )}
                    
                    {field.type === 'json' && (
                      <textarea
                        value={formData[field.id] || '{}'}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder || '{ "key": "value" }'}
                        rows={4}
                        className="w-full px-3 py-2 bg-[var(--highlight)] border border-[var(--panel-border)] rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-vertical"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {/* DB Tables info */}
              {selectedTool.dbTables && selectedTool.dbTables.length > 0 && (
                <div className="mt-4 p-3 bg-[var(--highlight)] rounded-lg">
                  <div className="text-xs text-[var(--text-muted)] mb-1">関連テーブル:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTool.dbTables.map((table) => (
                      <span key={table} className="text-xs px-2 py-0.5 bg-[var(--panel)] rounded font-mono">
                        {table}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* 実行ボタン & 結果 */}
            <div className="p-4 border-t border-[var(--panel-border)]">
              <button
                onClick={executeTool}
                disabled={isExecuting}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    実行中...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    実行
                  </>
                )}
              </button>
              
              {/* 実行結果 */}
              {executionResult && (
                <div className={`mt-4 p-4 rounded-lg ${
                  executionResult.success 
                    ? 'bg-green-500/10 border border-green-500/20' 
                    : 'bg-red-500/10 border border-red-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {executionResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-bold ${executionResult.success ? 'text-green-500' : 'text-red-500'}`}>
                      {executionResult.success ? '実行成功' : '実行失敗'}
                    </span>
                  </div>
                  
                  {executionResult.jobId && (
                    <div className="text-xs text-[var(--text-muted)] mb-2">
                      Job ID: <code className="bg-[var(--highlight)] px-1 rounded">{executionResult.jobId}</code>
                    </div>
                  )}
                  
                  {executionResult.error && (
                    <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">
                      {executionResult.error}
                    </div>
                  )}
                  
                  {executionResult.data && (
                    <pre className="text-xs bg-[var(--highlight)] p-2 rounded overflow-auto max-h-40 mt-2">
                      {JSON.stringify(executionResult.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Zap className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)] opacity-50" />
              <h3 className="text-lg font-bold mb-2">ツールを選択</h3>
              <p className="text-sm text-[var(--text-muted)]">
                左のリストからツールを選択して実行してください
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* 実行履歴パネル（オプション） */}
      {showHistory && recentExecutions.length > 0 && (
        <div className={`${compact ? 'w-full' : 'w-64'} flex-shrink-0 bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden`}>
          <div className="p-3 border-b border-[var(--panel-border)] flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">最近の実行</span>
          </div>
          <div className="divide-y divide-[var(--panel-border)]">
            {recentExecutions.map((exec, i) => (
              <button
                key={i}
                onClick={() => setSelectedToolId(exec.toolId)}
                className="w-full p-3 text-left hover:bg-[var(--highlight)] transition-colors"
              >
                <div className="flex items-center gap-2">
                  {exec.status === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {exec.status === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
                  {exec.status === 'running' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                  <span className="text-sm font-medium truncate">{exec.toolId}</span>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {new Date(exec.timestamp).toLocaleString('ja-JP')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 単一ツール実行コンポーネント（Coming Soon置換用）
// ============================================================

interface SingleToolRunnerProps {
  toolId: string;
}

export function SingleToolRunner({ toolId }: SingleToolRunnerProps) {
  return (
    <UniversalToolRunner
      initialToolId={toolId}
      showCategories={false}
      showSearch={false}
      showHistory={false}
      compact={true}
    />
  );
}

export default UniversalToolRunner;
