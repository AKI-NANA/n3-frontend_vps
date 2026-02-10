// components/n8n/dynamic-renderer.tsx
// 🏰 N3 Empire OS - ダイナミック・レンダラー
// n8nからのui_configを解釈してUIコンポーネントを動的生成

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Loader2, RefreshCw, Download, Trash2, Save, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import type { 
  UIConfig, 
  TabConfig, 
  ColumnConfig, 
  ActionConfig, 
  FilterConfig,
  PaginationConfig,
  ResponseMeta,
  ErrorInfo
} from '@/lib/n8n/ui-orchestrator';

// ========================================
// 型定義
// ========================================

export interface N8nStandardResponse<T = any> {
  success: boolean;
  data: T;
  ui_config: UIConfig;
  meta: ResponseMeta;
  error?: ErrorInfo;
}

interface DynamicRendererProps {
  response: N8nStandardResponse;
  onAction?: (actionId: string, selectedIds?: string[], params?: Record<string, any>) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
  className?: string;
}

// ========================================
// アイコンマッピング
// ========================================

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  RefreshCw,
  Download,
  Trash2,
  Save,
  AlertCircle,
};

function getIcon(iconName: string | undefined) {
  if (!iconName) return null;
  const Icon = iconMap[iconName];
  return Icon ? <Icon className="w-4 h-4" /> : null;
}

// ========================================
// PIIマスキング表示
// ========================================

function MaskedValue({ value, type }: { value: string; type?: string }) {
  return (
    <span className="font-mono text-gray-400" title="個人情報保護のためマスクされています">
      {value}
    </span>
  );
}

// ========================================
// テーブルセル
// ========================================

function DynamicTableCell({ value, column }: { value: any; column: ColumnConfig }) {
  if (value == null) return <span className="text-gray-500">-</span>;
  
  switch (column.type) {
    case 'badge':
      const badgeColors: Record<string, string> = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        '出品中': 'bg-green-100 text-green-800',
        error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        'エラー': 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        '処理中': 'bg-yellow-100 text-yellow-800',
      };
      const badgeClass = badgeColors[value] || 'bg-gray-100 text-gray-800';
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
          {value}
        </span>
      );
      
    case 'currency':
      const formatted = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: column.format || 'JPY',
      }).format(value);
      return <span className="font-mono">{formatted}</span>;
      
    case 'number':
      return <span className="font-mono">{value.toLocaleString()}</span>;
      
    case 'date':
      const date = new Date(value);
      return <span>{date.toLocaleDateString('ja-JP')}</span>;
      
    case 'image':
      return (
        <img 
          src={value} 
          alt="" 
          className="w-10 h-10 object-cover rounded"
        />
      );
      
    case 'link':
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          リンク
        </a>
      );
      
    case 'masked':
      return <MaskedValue value={value} type={column.mask_type} />;
      
    default:
      return <span className="truncate max-w-xs block">{String(value)}</span>;
  }
}

// ========================================
// ダイナミックテーブル
// ========================================

function DynamicTable({
  data,
  columns,
  selectable = false,
  rowActions,
  selectedIds,
  onSelectionChange,
  onRowAction,
}: {
  data: any[];
  columns: ColumnConfig[];
  selectable?: boolean;
  rowActions?: ActionConfig[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowAction?: (actionId: string, rowId: string, rowData: any) => void;
}) {
  const allSelected = data.length > 0 && selectedIds.length === data.length;
  
  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(data.map((row: any) => row.id || row.sku));
    }
  };
  
  const toggleRow = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {selectable && (
                <th className="w-12 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="rounded border-gray-300"
                  />
                </th>
              )}
              {columns.filter(c => c.visible !== false).map(column => (
                <th 
                  key={column.id}
                  style={{ width: column.width }}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              {rowActions && rowActions.length > 0 && (
                <th className="w-24 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-gray-500"
                >
                  データがありません
                </td>
              </tr>
            ) : (
              data.map((row: any, index: number) => {
                const rowId = row.id || row.sku || index.toString();
                const isSelected = selectedIds.includes(rowId);
                
                return (
                  <tr 
                    key={rowId}
                    className={isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(rowId)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    {columns.filter(c => c.visible !== false).map(column => (
                      <td key={column.id} className="px-4 py-3 text-sm">
                        <DynamicTableCell 
                          value={row[column.id]} 
                          column={column} 
                        />
                      </td>
                    ))}
                    {rowActions && rowActions.length > 0 && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          {rowActions.map(action => (
                            <button
                              key={action.id}
                              onClick={() => onRowAction?.(action.id, rowId, row)}
                              disabled={action.disabled}
                              className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                action.theme === 'danger' ? 'text-red-500' : 'text-gray-500'
                              }`}
                              title={action.label}
                            >
                              {getIcon(action.icon)}
                            </button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========================================
// ダイナミックフィルター
// ========================================

function DynamicFilters({
  filters,
  values,
  onChange,
}: {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}) {
  const handleChange = (id: string, value: any) => {
    onChange({ ...values, [id]: value });
  };
  
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-4">
      {filters.map(filter => (
        <div key={filter.id} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {filter.label}
          </label>
          
          {filter.type === 'text' && (
            <input
              type="text"
              value={values[filter.id] || ''}
              onChange={(e) => handleChange(filter.id, e.target.value)}
              placeholder={filter.label}
              className="w-40 px-3 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
            />
          )}
          
          {filter.type === 'select' && (
            <select
              value={values[filter.id] || ''}
              onChange={(e) => handleChange(filter.id, e.target.value)}
              className="w-40 px-3 py-1.5 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="">選択...</option>
              {filter.options?.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          
          {filter.type === 'checkbox' && (
            <input
              type="checkbox"
              checked={values[filter.id] || false}
              onChange={(e) => handleChange(filter.id, e.target.checked)}
              className="mt-2"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ========================================
// ダイナミックページネーション
// ========================================

function DynamicPagination({
  config,
  totalCount,
  currentPage,
  onPageChange,
  onPageSizeChange,
}: {
  config: PaginationConfig;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  if (!config.enabled) return null;
  
  const totalPages = Math.ceil(totalCount / config.page_size);
  
  return (
    <div className="flex items-center justify-between py-4">
      {config.show_total && (
        <span className="text-sm text-gray-500">
          全 {totalCount.toLocaleString()} 件
        </span>
      )}
      
      <div className="flex items-center gap-2">
        {config.page_size_options && (
          <select
            value={config.page_size}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className="px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            {config.page_size_options.map(size => (
              <option key={size} value={size}>
                {size}件
              </option>
            ))}
          </select>
        )}
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-sm px-2">
          {currentPage} / {totalPages || 1}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// ========================================
// メインコンポーネント
// ========================================

export function DynamicRenderer({
  response,
  onAction,
  onRefresh,
  isLoading = false,
  className = '',
}: DynamicRendererProps) {
  const { success, data, ui_config, meta, error } = response;
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(ui_config.pagination?.page_size || 50);
  const [activeTab, setActiveTab] = useState(ui_config.tabs?.[0]?.id || 'main');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    message?: string;
  } | null>(null);
  
  // エラー表示
  if (!success && error) {
    return (
      <div className={`p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 ${className}`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-600 dark:text-red-400">
              エラーが発生しました
            </h3>
            <p className="text-red-600 dark:text-red-400 mt-1">{error.message}</p>
            {error.suggested_action && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                推奨: {error.suggested_action}
              </p>
            )}
            {error.recoverable && onRefresh && (
              <button 
                onClick={onRefresh}
                className="mt-4 px-4 py-2 text-sm bg-white dark:bg-gray-800 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                再試行
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // アクション実行
  const handleAction = async (actionId: string) => {
    const action = ui_config.actions?.find(a => a.id === actionId);
    
    if (action?.confirm) {
      setPendingAction({ id: actionId, message: action.confirm_message });
      setShowConfirmDialog(true);
      return;
    }
    
    await onAction?.(actionId, selectedIds.length > 0 ? selectedIds : undefined, filterValues);
  };
  
  const confirmAction = async () => {
    if (pendingAction) {
      await onAction?.(pendingAction.id, selectedIds.length > 0 ? selectedIds : undefined, filterValues);
    }
    setShowConfirmDialog(false);
    setPendingAction(null);
  };
  
  // 行アクション
  const handleRowAction = async (actionId: string, rowId: string, rowData: any) => {
    await onAction?.(actionId, [rowId], { row: rowData });
  };
  
  // コンテンツレンダリング
  const renderContent = () => {
    const displayData = Array.isArray(data) ? data : [data];
    
    switch (ui_config.view_type) {
      case 'table':
        return (
          <>
            {ui_config.filters && ui_config.filters.length > 0 && (
              <DynamicFilters
                filters={ui_config.filters}
                values={filterValues}
                onChange={setFilterValues}
              />
            )}
            
            <DynamicTable
              data={displayData}
              columns={ui_config.data_display?.columns || []}
              selectable={ui_config.data_display?.selectable}
              rowActions={ui_config.data_display?.row_actions}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              onRowAction={handleRowAction}
            />
            
            {ui_config.pagination && (
              <DynamicPagination
                config={{ ...ui_config.pagination, page_size: pageSize }}
                totalCount={meta.total_count}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            )}
          </>
        );
        
      case 'tabs':
        return (
          <div className="space-y-4">
            <div className="flex border-b dark:border-gray-700">
              {ui_config.tabs?.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div>
              {ui_config.tabs?.find(t => t.id === activeTab)?.content_type === 'table' ? (
                <DynamicTable
                  data={displayData}
                  columns={ui_config.data_display?.columns || []}
                  selectable={ui_config.data_display?.selectable}
                  rowActions={ui_config.data_display?.row_actions}
                  selectedIds={selectedIds}
                  onSelectionChange={setSelectedIds}
                  onRowAction={handleRowAction}
                />
              ) : (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                  <pre className="text-sm overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'modal':
      case 'panel':
      default:
        return (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* アクションバー */}
      {ui_config.actions && ui_config.actions.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <span className="text-sm text-gray-500">
                {selectedIds.length}件選択中
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {ui_config.actions.map(action => {
              const disabled = action.bulk && selectedIds.length === 0;
              
              const buttonClass = `
                px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors
                ${action.theme === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400' 
                  : action.theme === 'danger'
                  ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400'
                  : action.theme === 'ghost'
                  ? 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  : 'bg-white border text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `;
              
              return (
                <button
                  key={action.id}
                  onClick={() => handleAction(action.id)}
                  disabled={isLoading || action.disabled || disabled}
                  className={buttonClass}
                >
                  {isLoading && action.id === 'refresh' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    getIcon(action.icon)
                  )}
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* メインコンテンツ */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        renderContent()
      )}
      
      {/* メタ情報 */}
      <div className="text-xs text-gray-400 flex items-center gap-4">
        <span>実行時間: {meta.execution_time_ms}ms</span>
        {meta.tenant_id && <span>テナント: {meta.tenant_id}</span>}
        {meta.cached && <span className="text-green-500">キャッシュ済み</span>}
      </div>
      
      {/* 確認ダイアログ */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">確認</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {pendingAction?.message || 'この操作を実行しますか？'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                キャンセル
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                実行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DynamicRenderer;
