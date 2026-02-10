// app/tools/[toolId]/page.tsx
// 🏰 N3 Empire OS - 動的ツールページ（商用版・UI Orchestrator対応）
// n8nからのui_configを解釈し、完全動的なUIを構築

'use client';

import { useParams, notFound } from 'next/navigation';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  Play, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  RefreshCw,
  Save,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  List,
  Sparkles,
  Package,
  DollarSign,
  Globe,
  Shield,
  Bell,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';
import toolDefinitions from '@/lib/tool-definitions.json';
import type { UIConfig, TabConfig, ColumnConfig, ActionConfig, FilterConfig, N8nStandardResponse, ResponseMeta } from '@/lib/n8n/ui-orchestrator';

// ========================================
// 型定義
// ========================================
interface ToolField {
  name: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'checkbox';
  label: string;
  required?: boolean;
  placeholder?: string;
  default?: string | number | boolean | string[];
  options?: string[];
  dynamic?: boolean;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

interface ToolAction {
  id: string;
  label: string;
  variant: 'primary' | 'secondary' | 'destructive';
}

interface ToolConfig {
  id: string;
  name: string;
  category: string;
  webhookPath: string;
  description: string;
  fields: ToolField[];
  actions: ToolAction[];
  ui_config?: UIConfig;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

// ========================================
// アイコンマッピング
// ========================================
const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Play, Loader2, CheckCircle, AlertCircle, Clock, ChevronDown, ChevronUp,
  ExternalLink, Copy, RefreshCw, Save, Trash2, Edit, Eye, Search, Filter,
  Download, Upload, Settings, List, Sparkles, Package, DollarSign, Globe,
  Shield, Bell, Users, BarChart3, ChevronLeft, ChevronRight, X, Check,
};

function getIcon(name?: string): React.FC<{ className?: string }> | null {
  if (!name) return null;
  return ICON_MAP[name] || null;
}

// ========================================
// カテゴリ設定を取得
// ========================================
const categories = (toolDefinitions as any).categories;

function getCategoryConfig(categoryId: string) {
  return categories[categoryId] || { name: categoryId, color: '#6b7280', icon: 'Settings' };
}

// ========================================
// PIIマスキング関数（簡易版）
// ========================================
function maskValue(value: any, maskType?: string): string {
  if (!value) return '***';
  const str = String(value);
  
  switch (maskType) {
    case 'email':
      const parts = str.split('@');
      if (parts.length !== 2) return '***';
      return `${parts[0].substring(0, 2)}***@${parts[1]}`;
    case 'phone':
      const digits = str.replace(/\D/g, '');
      if (digits.length < 4) return '***';
      return `${digits.substring(0, 3)}-****-${digits.substring(digits.length - 4)}`;
    case 'name':
      return `${str.charAt(0)}***`;
    case 'address':
      return str.length > 10 ? `${str.substring(0, 10)}***` : '***';
    default:
      return '***';
  }
}

// ========================================
// テーブルセル描画
// ========================================
interface TableCellProps {
  column: ColumnConfig;
  value: any;
}

function TableCell({ column, value }: TableCellProps) {
  // マスク処理
  if (column.type === 'masked' && column.mask_type) {
    return <span className="text-gray-400">{maskValue(value, column.mask_type)}</span>;
  }

  switch (column.type) {
    case 'currency':
      const currency = column.format || 'JPY';
      const formatted = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency,
        minimumFractionDigits: currency === 'JPY' ? 0 : 2,
      }).format(value || 0);
      return <span className="font-mono">{formatted}</span>;

    case 'number':
      return <span className="font-mono">{value?.toLocaleString() ?? '-'}</span>;

    case 'date':
      if (!value) return <span className="text-gray-500">-</span>;
      return <span>{new Date(value).toLocaleDateString('ja-JP')}</span>;

    case 'badge':
      const badgeColors: Record<string, string> = {
        active: 'bg-green-500/20 text-green-400 border-green-500/30',
        inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        draft: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        listed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        sold: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      };
      const colorClass = badgeColors[value?.toLowerCase()] || badgeColors.inactive;
      return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${colorClass}`}>
          {value || '-'}
        </span>
      );

    case 'image':
      if (!value) return <div className="w-10 h-10 bg-gray-700 rounded" />;
      return <img src={value} alt="" className="w-10 h-10 object-cover rounded" loading="lazy" />;

    case 'link':
      if (!value) return <span className="text-gray-500">-</span>;
      return (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
          リンク
        </a>
      );

    default:
      return <span className="truncate">{value ?? '-'}</span>;
  }
}

// ========================================
// メインコンポーネント
// ========================================
export default function DynamicToolPage() {
  const params = useParams();
  const toolId = params.toolId as string;
  
  // ツール設定を取得
  const tools = (toolDefinitions as any).tools;
  const config: ToolConfig | undefined = tools[toolId];
  
  // 存在しないツールの場合は404
  if (!config) {
    notFound();
  }
  
  const categoryConfig = getCategoryConfig(config.category);
  
  // ========================================
  // State
  // ========================================
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    config.fields.forEach(field => {
      if (field.default !== undefined) {
        initial[field.name] = field.default;
      } else if (field.type === 'checkbox') {
        initial[field.name] = false;
      } else if (field.type === 'multiselect') {
        initial[field.name] = [];
      } else {
        initial[field.name] = '';
      }
    });
    return initial;
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const [lastResult, setLastResult] = useState<N8nStandardResponse | null>(null);
  
  // タブ/テーブル状態
  const [activeTab, setActiveTab] = useState<string>('main');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // ========================================
  // n8nからのUI設定を取得
  // ========================================
  const uiConfig = useMemo(() => {
    // n8nレスポンスにui_configがあればそれを優先
    if (lastResult?.ui_config) {
      return lastResult.ui_config;
    }
    // ツール定義のui_configを使用
    return config.ui_config || null;
  }, [lastResult, config.ui_config]);
  
  // ========================================
  // ログ追加
  // ========================================
  const addLog = useCallback((level: LogEntry['level'], message: string, details?: string) => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      message,
      details,
    };
    setLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);
  
  // ========================================
  // フォーム値変更
  // ========================================
  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };
  
  // ========================================
  // アクション実行
  // ========================================
  const executeAction = async (actionId: string, additionalData?: any) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    setCurrentAction(actionId);
    addLog('info', `アクション「${actionId}」を開始...`);
    
    try {
      // バリデーション
      const requiredFields = config.fields.filter(f => f.required);
      for (const field of requiredFields) {
        if (!formData[field.name] && !additionalData?.[field.name]) {
          throw new Error(`「${field.label}」は必須です`);
        }
      }
      
      // n8n-proxy へリクエスト
      const response = await fetch('/api/n8n-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: config.webhookPath,
          data: {
            action: actionId,
            ...formData,
            ...additionalData,
            selectedRows,
            filters: filterValues,
            pagination: { page: currentPage, page_size: 50 },
            sort: sortColumn ? { column: sortColumn, direction: sortDirection } : undefined,
          },
        }),
      });
      
      const result: N8nStandardResponse = await response.json();
      
      if (result.success) {
        addLog('success', `アクション「${actionId}」が完了しました`, JSON.stringify(result.data, null, 2));
        setLastResult(result);
        // 選択をクリア
        if (additionalData?.selectedRows) {
          setSelectedRows([]);
        }
      } else {
        throw new Error(result.error?.message || '不明なエラー');
      }
      
    } catch (error) {
      const message = error instanceof Error ? error.message : '実行エラー';
      addLog('error', `アクション「${actionId}」が失敗しました: ${message}`);
    } finally {
      setIsExecuting(false);
      setCurrentAction(null);
    }
  };
  
  // ========================================
  // 初回データ取得
  // ========================================
  useEffect(() => {
    // ツールによっては初期データ取得が必要
    if (config.webhookPath && !lastResult) {
      executeAction('get_list');
    }
  }, [config.webhookPath]);
  
  // ========================================
  // フィールドレンダリング
  // ========================================
  const renderField = (field: ToolField) => {
    const baseInputClass = `
      w-full px-3 py-2 rounded-lg border transition-colors
      bg-gray-800 border-gray-600 text-white
      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
      disabled:opacity-50 disabled:cursor-not-allowed
    `;
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            disabled={isExecuting}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 4}
            className={baseInputClass}
            disabled={isExecuting}
          />
        );
        
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.name] ?? ''}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            min={field.min}
            max={field.max}
            step={field.step || 1}
            className={baseInputClass}
            disabled={isExecuting}
          />
        );
        
      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseInputClass}
            disabled={isExecuting}
          >
            <option value="">選択してください</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
        
      case 'multiselect':
        const selectedValues = formData[field.name] || [];
        return (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleFieldChange(field.name, [...selectedValues, opt]);
                    } else {
                      handleFieldChange(field.name, selectedValues.filter((v: string) => v !== opt));
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
                  disabled={isExecuting}
                />
                <span className="text-sm text-gray-300">{opt}</span>
              </label>
            ))}
          </div>
        );
        
      case 'checkbox':
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
              disabled={isExecuting}
            />
            <span className="text-sm text-gray-300">{field.label}</span>
          </label>
        );
        
      default:
        return null;
    }
  };
  
  // ========================================
  // ログアイコン
  // ========================================
  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };
  
  // ========================================
  // テーブル描画
  // ========================================
  const renderDataTable = () => {
    if (!lastResult?.data || !Array.isArray(lastResult.data)) return null;
    
    const columns = uiConfig?.data_display?.columns || [];
    const data = lastResult.data;
    
    if (columns.length === 0) {
      // カラム定義がない場合はJSONとして表示
      return (
        <div className="p-4">
          <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      );
    }
    
    const visibleColumns = columns.filter(c => c.visible !== false);
    
    return (
      <div className="overflow-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/70 border-b border-gray-700">
              {uiConfig?.data_display?.selectable && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRows(data.map((row: any) => row.id?.toString() || ''));
                      } else {
                        setSelectedRows([]);
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                  />
                </th>
              )}
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className={`px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider
                    ${column.sortable && uiConfig?.data_display?.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => {
                    if (column.sortable && uiConfig?.data_display?.sortable) {
                      const newDirection = sortColumn === column.id && sortDirection === 'asc' ? 'desc' : 'asc';
                      setSortColumn(column.id);
                      setSortDirection(newDirection);
                      executeAction('get_list');
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortColumn === column.id && (
                      <span className="text-blue-400">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              {uiConfig?.data_display?.row_actions && uiConfig.data_display.row_actions.length > 0 && (
                <th className="w-20 px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((row: any, rowIndex: number) => {
              const rowId = row.id?.toString() || rowIndex.toString();
              const isSelected = selectedRows.includes(rowId);
              
              return (
                <tr
                  key={rowId}
                  className={`hover:bg-gray-800/50 transition-colors ${isSelected ? 'bg-blue-900/20' : ''}`}
                >
                  {uiConfig?.data_display?.selectable && (
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows([...selectedRows, rowId]);
                          } else {
                            setSelectedRows(selectedRows.filter(id => id !== rowId));
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                      />
                    </td>
                  )}
                  {visibleColumns.map((column) => (
                    <td key={column.id} className="px-3 py-3 text-sm text-gray-300">
                      <TableCell column={column} value={row[column.id]} />
                    </td>
                  ))}
                  {uiConfig?.data_display?.row_actions && uiConfig.data_display.row_actions.length > 0 && (
                    <td className="px-3 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {uiConfig.data_display.row_actions.slice(0, 2).map((action) => {
                          const IconComponent = getIcon(action.icon);
                          return (
                            <button
                              key={action.id}
                              onClick={() => executeAction(action.id, { row, selectedRows: [row.id] })}
                              className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                              title={action.label}
                            >
                              {IconComponent && <IconComponent className="w-4 h-4" />}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="py-12 text-center text-gray-500">データがありません</div>
        )}
      </div>
    );
  };
  
  // ========================================
  // アクションボタン描画
  // ========================================
  const renderActionButtons = (actions: ActionConfig[] | undefined) => {
    if (!actions || actions.length === 0) return null;
    
    return (
      <div className="flex gap-2">
        {actions.map(action => {
          const isRunning = isExecuting && currentAction === action.id;
          const IconComponent = getIcon(action.icon);
          
          const themeClasses: Record<string, string> = {
            primary: 'bg-blue-600 hover:bg-blue-700 text-white',
            secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
            success: 'bg-green-600 hover:bg-green-700 text-white',
            warning: 'bg-orange-600 hover:bg-orange-700 text-white',
            danger: 'bg-red-600 hover:bg-red-700 text-white',
            ghost: 'bg-transparent hover:bg-gray-700 text-gray-300',
          };
          
          const buttonClass = `
            px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors
            ${themeClasses[action.theme || 'secondary']}
            ${isExecuting ? 'opacity-50 cursor-not-allowed' : ''}
            ${action.bulk && selectedRows.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
          `;
          
          return (
            <button
              key={action.id}
              onClick={() => executeAction(action.id, { selectedRows })}
              disabled={isExecuting || (action.bulk && selectedRows.length === 0)}
              className={buttonClass}
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : IconComponent ? (
                <IconComponent className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {action.label}
            </button>
          );
        })}
      </div>
    );
  };
  
  // ========================================
  // タブヘッダー描画
  // ========================================
  const renderTabs = () => {
    const tabs = uiConfig?.tabs;
    if (!tabs || tabs.length === 0) return null;
    
    return (
      <div className="flex border-b border-gray-700">
        {tabs
          .filter(t => t.visible !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map(tab => {
            const IconComponent = getIcon(tab.icon);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors
                  ${isActive
                    ? 'border-blue-500 text-blue-400 bg-gray-800/50'
                    : 'border-transparent text-gray-400 hover:text-white hover:bg-gray-800/30'
                  }
                `}
              >
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {tab.label}
              </button>
            );
          })}
      </div>
    );
  };
  
  // ========================================
  // ページネーション描画
  // ========================================
  const renderPagination = () => {
    const pagination = uiConfig?.pagination;
    if (!pagination?.enabled) return null;
    
    const totalCount = lastResult?.meta?.total_count || 0;
    const totalPages = Math.ceil(totalCount / pagination.page_size);
    
    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
        <div className="flex items-center gap-4">
          {pagination.show_total && (
            <span className="text-sm text-gray-400">全 {totalCount.toLocaleString()} 件</span>
          )}
          {selectedRows.length > 0 && (
            <span className="text-sm text-blue-400">{selectedRows.length}件選択中</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCurrentPage(prev => Math.max(1, prev - 1));
              executeAction('get_list');
            }}
            disabled={currentPage <= 1 || isExecuting}
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-300">
            {currentPage} / {totalPages || 1}
          </span>
          <button
            onClick={() => {
              setCurrentPage(prev => Math.min(totalPages, prev + 1));
              executeAction('get_list');
            }}
            disabled={currentPage >= totalPages || isExecuting}
            className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };
  
  // ========================================
  // Render
  // ========================================
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ヘッダー */}
      <header 
        className="border-b border-gray-700 px-6 py-4"
        style={{ borderLeftColor: categoryConfig.color, borderLeftWidth: '4px' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ backgroundColor: categoryConfig.color + '20', color: categoryConfig.color }}
              >
                {categoryConfig.name}
              </span>
              <span>•</span>
              <code className="text-xs">{config.webhookPath}</code>
            </div>
            <h1 className="text-2xl font-bold">{config.name}</h1>
            <p className="text-gray-400 mt-1">{config.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {lastResult?.meta && (
              <span className="text-xs text-gray-500">
                {lastResult.meta.execution_time_ms}ms
              </span>
            )}
            <a
              href={`${process.env.NEXT_PUBLIC_N8N_BASE_URL || 'http://160.16.120.186:5678'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              n8nで開く
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* メインエリア */}
        <main className="flex-1 flex flex-col">
          {/* タブ */}
          {renderTabs()}
          
          {/* アクションバー */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800/30">
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <span className="text-sm text-blue-400">{selectedRows.length}件選択中</span>
              )}
            </div>
            {renderActionButtons(uiConfig?.actions)}
          </div>
          
          {/* メインコンテンツ */}
          <div className="flex-1 overflow-auto">
            {/* フォームパネル（タブがmainの場合のみ、または結果がない場合） */}
            {(activeTab === 'main' || !lastResult) && config.fields.length > 0 && (
              <div className="p-6 max-w-2xl">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-lg font-semibold mb-4">パラメータ設定</h2>
                  
                  <div className="space-y-4">
                    {config.fields.map(field => (
                      <div key={field.name}>
                        {field.type !== 'checkbox' && (
                          <label className="block text-sm font-medium text-gray-300 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                        )}
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                  
                  {/* 旧アクションボタン */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
                    {config.actions.map(action => {
                      const isRunning = isExecuting && currentAction === action.id;
                      
                      let buttonClass = 'px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ';
                      
                      switch (action.variant) {
                        case 'primary':
                          buttonClass += 'bg-blue-600 hover:bg-blue-700 text-white';
                          break;
                        case 'destructive':
                          buttonClass += 'bg-red-600 hover:bg-red-700 text-white';
                          break;
                        default:
                          buttonClass += 'bg-gray-600 hover:bg-gray-700 text-white';
                      }
                      
                      if (isExecuting) {
                        buttonClass += ' opacity-50 cursor-not-allowed';
                      }
                      
                      return (
                        <button
                          key={action.id}
                          onClick={() => executeAction(action.id)}
                          disabled={isExecuting}
                          className={buttonClass}
                        >
                          {isRunning ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {/* データテーブル */}
            {lastResult?.data && uiConfig?.data_display?.type === 'table' && (
              <div className="flex-1">
                {renderDataTable()}
              </div>
            )}
            
            {/* JSON結果（テーブル以外、またはui_configがない場合） */}
            {lastResult && (!uiConfig?.data_display || uiConfig.data_display.type !== 'table') && (
              <div className="p-6 max-w-2xl">
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">実行結果</h2>
                    <button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(lastResult.data, null, 2))}
                      className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                      コピー
                    </button>
                  </div>
                  <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    {JSON.stringify(lastResult.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
          
          {/* ページネーション */}
          {renderPagination()}
        </main>
        
        {/* ログパネル */}
        <aside className="w-96 border-l border-gray-700 bg-gray-800">
          <div className="p-4 border-b border-gray-700">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center justify-between w-full"
            >
              <span className="font-semibold">実行ログ</span>
              {showLogs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {showLogs && (
            <div className="p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">ログはありません</p>
              ) : (
                logs.map(log => (
                  <div
                    key={log.id}
                    className="p-3 bg-gray-900 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-start gap-2">
                      {getLogIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{log.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {log.timestamp.toLocaleTimeString()}
                        </p>
                        {log.details && (
                          <pre className="mt-2 text-xs bg-gray-800 p-2 rounded overflow-auto max-h-40">
                            {log.details}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
