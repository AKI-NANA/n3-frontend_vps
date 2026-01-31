// lib/n8n/dynamic-renderer.tsx
// 🏰 N3 Empire OS - Dynamic UI Renderer
// n8nからのui_configを解釈し、動的にUIコンポーネントを生成

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  Table,
  RefreshCw,
  Download,
  Save,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Loader2,
  MoreVertical,
  List,
  Sparkles,
  Settings,
  Package,
  DollarSign,
  Image,
  Globe,
  Shield,
  Bell,
  Users,
  BarChart3,
} from 'lucide-react';
import { UIConfig, TabConfig, ColumnConfig, ActionConfig, FilterConfig, PaginationConfig, N8nStandardResponse, ErrorInfo } from './ui-orchestrator';
import PIIMasking from './pii-masking';

// ========================================
// アイコンマッピング
// ========================================

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  RefreshCw,
  Download,
  Save,
  Trash2,
  Edit,
  Eye,
  Search,
  Filter,
  X,
  Check,
  AlertCircle,
  Loader2,
  MoreVertical,
  List,
  Sparkles,
  Settings,
  Package,
  DollarSign,
  Image,
  Globe,
  Shield,
  Bell,
  Users,
  BarChart3,
  Table,
};

function getIcon(iconName?: string): React.FC<{ className?: string }> | null {
  if (!iconName) return null;
  return ICON_MAP[iconName] || null;
}

// ========================================
// 型定義
// ========================================

interface DynamicRendererProps {
  response: N8nStandardResponse;
  onAction: (actionId: string, data?: any) => Promise<void>;
  onFilterChange?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  isLoading?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

interface TableCellProps {
  column: ColumnConfig;
  value: any;
  row: any;
}

// ========================================
// PIIマスキング付きセル描画
// ========================================

function TableCell({ column, value, row }: TableCellProps) {
  // マスク処理
  if (column.type === 'masked' && column.mask_type) {
    const maskedValue = PIIMasking.maskByType(value, column.mask_type);
    return <span className="text-gray-400">{maskedValue}</span>;
  }

  // 型別レンダリング
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
      const date = new Date(value);
      return <span>{date.toLocaleDateString('ja-JP')}</span>;

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
      return (
        <img
          src={value}
          alt=""
          className="w-10 h-10 object-cover rounded"
          loading="lazy"
        />
      );

    case 'link':
      if (!value) return <span className="text-gray-500">-</span>;
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          リンク
        </a>
      );

    case 'text':
    default:
      return <span className="truncate">{value ?? '-'}</span>;
  }
}

// ========================================
// フィルターコンポーネント
// ========================================

interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
}

function FilterBar({ filters, values, onChange }: FilterBarProps) {
  const handleChange = (filterId: string, value: any) => {
    onChange({ ...values, [filterId]: value });
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-800/50 border-b border-gray-700">
      {filters.map((filter) => (
        <div key={filter.id} className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">{filter.label}</label>
          {filter.type === 'select' && (
            <select
              value={values[filter.id] || ''}
              onChange={(e) => handleChange(filter.id, e.target.value)}
              className="px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">全て</option>
              {filter.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
          {filter.type === 'text' && (
            <input
              type="text"
              value={values[filter.id] || ''}
              onChange={(e) => handleChange(filter.id, e.target.value)}
              placeholder={filter.label}
              className="px-3 py-1.5 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-blue-500 focus:outline-none"
            />
          )}
          {filter.type === 'checkbox' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={values[filter.id] || false}
                onChange={(e) => handleChange(filter.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
              />
              <span className="text-sm text-gray-300">{filter.label}</span>
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

// ========================================
// ページネーションコンポーネント
// ========================================

interface PaginationBarProps {
  config: PaginationConfig;
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number, pageSize: number) => void;
}

function PaginationBar({ config, totalCount, currentPage, onPageChange }: PaginationBarProps) {
  const totalPages = Math.ceil(totalCount / config.page_size);
  const [pageSize, setPageSize] = useState(config.page_size);

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    onPageChange(1, newSize);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
      <div className="flex items-center gap-4">
        {config.show_total && (
          <span className="text-sm text-gray-400">
            全 {totalCount.toLocaleString()} 件
          </span>
        )}
        {config.page_size_options && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">表示:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white"
            >
              {config.page_size_options.map((size) => (
                <option key={size} value={size}>
                  {size}件
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1, pageSize)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-300">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1, pageSize)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ========================================
// アクションボタン
// ========================================

interface ActionButtonProps {
  action: ActionConfig;
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

function ActionButton({ action, onClick, isLoading, disabled }: ActionButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const IconComponent = getIcon(action.icon);

  const themeClasses: Record<string, string> = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    warning: 'bg-orange-600 hover:bg-orange-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300',
  };

  const handleClick = () => {
    if (action.confirm) {
      setShowConfirm(true);
    } else {
      onClick();
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onClick();
  };

  const buttonClass = `
    px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors
    ${themeClasses[action.theme || 'secondary']}
    ${(disabled || action.disabled) ? 'opacity-50 cursor-not-allowed' : ''}
  `;

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || action.disabled || isLoading}
        className={buttonClass}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : IconComponent ? (
          <IconComponent className="w-4 h-4" />
        ) : null}
        {action.label}
      </button>

      {/* 確認モーダル */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold">確認</h3>
            </div>
            <p className="text-gray-300 mb-6">
              {action.confirm_message || `「${action.label}」を実行しますか？`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-700 rounded-lg"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 text-sm rounded-lg ${themeClasses[action.theme || 'primary']}`}
              >
                実行
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ========================================
// タブコンポーネント
// ========================================

interface TabsRendererProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

function TabsRenderer({ tabs, activeTab, onTabChange, children }: TabsRendererProps) {
  return (
    <div className="flex flex-col h-full">
      {/* タブヘッダー */}
      <div className="flex border-b border-gray-700">
        {tabs
          .filter((t) => t.visible !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((tab) => {
            const IconComponent = getIcon(tab.icon);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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
      {/* タブコンテンツ */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

// ========================================
// テーブルレンダラー
// ========================================

interface DataTableProps {
  data: any[];
  columns: ColumnConfig[];
  sortable?: boolean;
  selectable?: boolean;
  rowActions?: ActionConfig[];
  selectedRows: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowAction: (actionId: string, row: any) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
}

function DataTable({
  data,
  columns,
  sortable,
  selectable,
  rowActions,
  selectedRows,
  onSelectionChange,
  onRowAction,
  sortColumn,
  sortDirection,
  onSort,
}: DataTableProps) {
  const visibleColumns = columns.filter((c) => c.visible !== false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(data.map((row) => row.id?.toString() || ''));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedRows, rowId]);
    } else {
      onSelectionChange(selectedRows.filter((id) => id !== rowId));
    }
  };

  const handleSort = (columnId: string) => {
    if (!sortable || !onSort) return;
    const column = columns.find((c) => c.id === columnId);
    if (!column?.sortable) return;

    const newDirection =
      sortColumn === columnId && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(columnId, newDirection);
  };

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-800/70 border-b border-gray-700">
            {selectable && (
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.length === data.length && data.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                />
              </th>
            )}
            {visibleColumns.map((column) => (
              <th
                key={column.id}
                className={`px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider
                  ${column.sortable && sortable ? 'cursor-pointer hover:text-white' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {sortColumn === column.id && (
                    <span className="text-blue-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {rowActions && rowActions.length > 0 && (
              <th className="w-20 px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                操作
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, rowIndex) => {
            const rowId = row.id?.toString() || rowIndex.toString();
            const isSelected = selectedRows.includes(rowId);

            return (
              <tr
                key={rowId}
                className={`
                  hover:bg-gray-800/50 transition-colors
                  ${isSelected ? 'bg-blue-900/20' : ''}
                `}
              >
                {selectable && (
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                    />
                  </td>
                )}
                {visibleColumns.map((column) => (
                  <td key={column.id} className="px-3 py-3 text-sm text-gray-300">
                    <TableCell column={column} value={row[column.id]} row={row} />
                  </td>
                ))}
                {rowActions && rowActions.length > 0 && (
                  <td className="px-3 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {rowActions.slice(0, 2).map((action) => {
                        const IconComponent = getIcon(action.icon);
                        return (
                          <button
                            key={action.id}
                            onClick={() => onRowAction(action.id, row)}
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
}

// ========================================
// メインレンダラー
// ========================================

export function DynamicRenderer({
  response,
  onAction,
  onFilterChange,
  onPageChange,
  onSort,
  isLoading = false,
  selectedRows = [],
  onSelectionChange,
}: DynamicRendererProps) {
  const { success, data, ui_config, meta, error } = response;
  const [activeTab, setActiveTab] = useState<string>(ui_config?.tabs?.[0]?.id || 'main');
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [localSelectedRows, setLocalSelectedRows] = useState<string[]>(selectedRows);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // 選択行の管理
  const handleSelectionChange = useCallback(
    (ids: string[]) => {
      setLocalSelectedRows(ids);
      onSelectionChange?.(ids);
    },
    [onSelectionChange]
  );

  // フィルター変更
  const handleFilterChange = useCallback(
    (values: Record<string, any>) => {
      setFilterValues(values);
      setCurrentPage(1);
      onFilterChange?.(values);
    },
    [onFilterChange]
  );

  // ページ変更
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      setCurrentPage(page);
      onPageChange?.(page, pageSize);
    },
    [onPageChange]
  );

  // ソート
  const handleSort = useCallback(
    (columnId: string, direction: 'asc' | 'desc') => {
      setSortColumn(columnId);
      setSortDirection(direction);
      onSort?.(columnId, direction);
    },
    [onSort]
  );

  // アクション実行
  const handleAction = useCallback(
    async (actionId: string, actionData?: any) => {
      setActionLoading(actionId);
      try {
        await onAction(actionId, actionData);
      } finally {
        setActionLoading(null);
      }
    },
    [onAction]
  );

  // 行アクション
  const handleRowAction = useCallback(
    (actionId: string, row: any) => {
      handleAction(actionId, { row, selectedRows: [row.id] });
    },
    [handleAction]
  );

  // エラー表示
  if (!success && error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">エラー: {error.code}</span>
          </div>
          <p className="text-red-300">{error.message}</p>
          {error.suggested_action && (
            <p className="text-gray-400 text-sm mt-2">{error.suggested_action}</p>
          )}
        </div>
      </div>
    );
  }

  // ローディング
  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        <span className="ml-3 text-gray-400">読み込み中...</span>
      </div>
    );
  }

  // データなし
  if (!ui_config) {
    return (
      <div className="p-6">
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  }

  // メインコンテンツ描画
  const renderContent = () => {
    const displayConfig = ui_config.data_display;

    if (displayConfig?.type === 'table' && Array.isArray(data)) {
      return (
        <DataTable
          data={data}
          columns={displayConfig.columns || []}
          sortable={displayConfig.sortable}
          selectable={displayConfig.selectable}
          rowActions={displayConfig.row_actions}
          selectedRows={localSelectedRows}
          onSelectionChange={handleSelectionChange}
          onRowAction={handleRowAction}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      );
    }

    // デフォルト: JSONとして表示
    return (
      <div className="p-6">
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  // タブ形式
  if (ui_config.view_type === 'tabs' && ui_config.tabs) {
    return (
      <div className="flex flex-col h-full">
        <TabsRenderer
          tabs={ui_config.tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {/* フィルター */}
          {ui_config.filters && ui_config.filters.length > 0 && (
            <FilterBar
              filters={ui_config.filters}
              values={filterValues}
              onChange={handleFilterChange}
            />
          )}

          {/* アクションバー */}
          {ui_config.actions && ui_config.actions.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                {localSelectedRows.length > 0 && (
                  <span className="text-sm text-gray-400">
                    {localSelectedRows.length}件選択中
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {ui_config.actions.map((action) => (
                  <ActionButton
                    key={action.id}
                    action={action}
                    onClick={() =>
                      handleAction(action.id, {
                        selectedRows: localSelectedRows,
                        filters: filterValues,
                      })
                    }
                    isLoading={actionLoading === action.id}
                    disabled={action.bulk && localSelectedRows.length === 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* コンテンツ */}
          {renderContent()}

          {/* ページネーション */}
          {ui_config.pagination?.enabled && (
            <PaginationBar
              config={ui_config.pagination}
              totalCount={meta.total_count}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </TabsRenderer>
      </div>
    );
  }

  // テーブル形式（デフォルト）
  return (
    <div className="flex flex-col h-full">
      {/* フィルター */}
      {ui_config.filters && ui_config.filters.length > 0 && (
        <FilterBar
          filters={ui_config.filters}
          values={filterValues}
          onChange={handleFilterChange}
        />
      )}

      {/* アクションバー */}
      {ui_config.actions && ui_config.actions.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {localSelectedRows.length > 0 && (
              <span className="text-sm text-gray-400">
                {localSelectedRows.length}件選択中
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {ui_config.actions.map((action) => (
              <ActionButton
                key={action.id}
                action={action}
                onClick={() =>
                  handleAction(action.id, {
                    selectedRows: localSelectedRows,
                    filters: filterValues,
                  })
                }
                isLoading={actionLoading === action.id}
                disabled={action.bulk && localSelectedRows.length === 0}
              />
            ))}
          </div>
        </div>
      )}

      {/* コンテンツ */}
      <div className="flex-1 overflow-auto">{renderContent()}</div>

      {/* ページネーション */}
      {ui_config.pagination?.enabled && (
        <PaginationBar
          config={ui_config.pagination}
          totalCount={meta.total_count}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

// ========================================
// エクスポート
// ========================================

export default DynamicRenderer;
