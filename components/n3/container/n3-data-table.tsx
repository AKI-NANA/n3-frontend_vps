'use client';

import React, { memo, useState, useCallback, useMemo, ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { N3Checkbox } from '../presentational/n3-checkbox';
import { N3Loading } from '../presentational/n3-loading';

// ============================================================
// N3DataTable - Container Component
// ============================================================
// データテーブル（ソート・選択・ページネーション対応）
// - ソート機能
// - 行選択機能
// - カスタムセルレンダリング
// - ローディング/空状態対応
// ============================================================

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnDef<T> {
  /** カラムID */
  id: string;
  /** ヘッダーラベル */
  header: string;
  /** アクセサー（データからセル値を取得） */
  accessor: keyof T | ((row: T) => ReactNode);
  /** カスタムセルレンダラー */
  cell?: (value: unknown, row: T, rowIndex: number) => ReactNode;
  /** ソート可能 */
  sortable?: boolean;
  /** カラム幅 */
  width?: string;
  /** テキスト配置 */
  align?: 'left' | 'center' | 'right';
  /** ヘッダークラス名 */
  headerClassName?: string;
  /** セルクラス名 */
  cellClassName?: string;
}

export interface N3DataTableProps<T> {
  /** カラム定義 */
  columns: ColumnDef<T>[];
  /** データ配列 */
  data: T[];
  /** 行のキー取得関数 */
  getRowKey: (row: T, index: number) => string | number;
  /** ソートカラムID */
  sortColumn?: string;
  /** ソート方向 */
  sortDirection?: SortDirection;
  /** ソート変更ハンドラ */
  onSort?: (columnId: string, direction: SortDirection) => void;
  /** 行選択可能 */
  selectable?: boolean;
  /** 選択行キー配列 */
  selectedKeys?: (string | number)[];
  /** 選択変更ハンドラ */
  onSelectionChange?: (selectedKeys: (string | number)[]) => void;
  /** 行クリックハンドラ */
  onRowClick?: (row: T, index: number) => void;
  /** ローディング状態 */
  loading?: boolean;
  /** 空状態メッセージ */
  emptyMessage?: string;
  /** テーブルサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** ストライプ */
  striped?: boolean;
  /** ホバー効果 */
  hoverable?: boolean;
  /** ボーダー */
  bordered?: boolean;
  /** スティッキーヘッダー */
  stickyHeader?: boolean;
  /** 最大高さ */
  maxHeight?: string;
  /** 追加クラス名 */
  className?: string;
}

export const N3DataTable = memo(function N3DataTable<T>({
  columns,
  data,
  getRowKey,
  sortColumn,
  sortDirection,
  onSort,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onRowClick,
  loading = false,
  emptyMessage = 'データがありません',
  size = 'md',
  striped = false,
  hoverable = true,
  bordered = false,
  stickyHeader = false,
  maxHeight,
  className = '',
}: N3DataTableProps<T>) {
  // 全選択状態
  const allSelected = data.length > 0 && selectedKeys.length === data.length;
  const someSelected = selectedKeys.length > 0 && selectedKeys.length < data.length;

  // ソートハンドラ
  const handleSort = useCallback((columnId: string) => {
    if (!onSort) return;

    let newDirection: SortDirection = 'asc';
    if (sortColumn === columnId) {
      if (sortDirection === 'asc') newDirection = 'desc';
      else if (sortDirection === 'desc') newDirection = null;
    }
    onSort(columnId, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  // 全選択ハンドラ
  const handleSelectAll = useCallback((checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const allKeys = data.map((row, i) => getRowKey(row, i));
      onSelectionChange(allKeys);
    } else {
      onSelectionChange([]);
    }
  }, [data, getRowKey, onSelectionChange]);

  // 行選択ハンドラ
  const handleSelectRow = useCallback((rowKey: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedKeys, rowKey]);
    } else {
      onSelectionChange(selectedKeys.filter(k => k !== rowKey));
    }
  }, [selectedKeys, onSelectionChange]);

  // セル値取得
  const getCellValue = useCallback((column: ColumnDef<T>, row: T): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  }, []);

  // ソートアイコン
  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return <ChevronsUpDown size={14} className="n3-data-table__sort-icon--inactive" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp size={14} className="n3-data-table__sort-icon--active" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown size={14} className="n3-data-table__sort-icon--active" />;
    }
    return <ChevronsUpDown size={14} className="n3-data-table__sort-icon--inactive" />;
  };

  const baseClass = 'n3-data-table';
  const wrapperClasses = [
    `${baseClass}-wrapper`,
    stickyHeader ? `${baseClass}-wrapper--sticky` : '',
    className,
  ].filter(Boolean).join(' ');

  const tableClasses = [
    baseClass,
    `${baseClass}--${size}`,
    striped ? `${baseClass}--striped` : '',
    hoverable ? `${baseClass}--hoverable` : '',
    bordered ? `${baseClass}--bordered` : '',
  ].filter(Boolean).join(' ');

  const style = maxHeight ? { maxHeight } : undefined;

  return (
    <div className={wrapperClasses} style={style}>
      {loading && (
        <div className="n3-data-table__loading-overlay">
          <N3Loading variant="spinner" size="md" text="読み込み中..." />
        </div>
      )}

      <table className={tableClasses}>
        <thead className="n3-data-table__head">
          <tr>
            {selectable && (
              <th className="n3-data-table__th n3-data-table__th--checkbox">
                <N3Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                className={[
                  'n3-data-table__th',
                  column.sortable ? 'n3-data-table__th--sortable' : '',
                  `n3-data-table__th--${column.align || 'left'}`,
                  column.headerClassName || '',
                ].filter(Boolean).join(' ')}
                style={column.width ? { width: column.width } : undefined}
                onClick={column.sortable ? () => handleSort(column.id) : undefined}
              >
                <div className="n3-data-table__th-content">
                  <span>{column.header}</span>
                  {column.sortable && renderSortIcon(column.id)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="n3-data-table__body">
          {data.length === 0 && !loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="n3-data-table__empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              const rowKey = getRowKey(row, rowIndex);
              const isSelected = selectedKeys.includes(rowKey);

              return (
                <tr
                  key={rowKey}
                  className={[
                    'n3-data-table__tr',
                    isSelected ? 'n3-data-table__tr--selected' : '',
                    onRowClick ? 'n3-data-table__tr--clickable' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                >
                  {selectable && (
                    <td className="n3-data-table__td n3-data-table__td--checkbox">
                      <N3Checkbox
                        checked={isSelected}
                        onChange={(checked) => handleSelectRow(rowKey, checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const value = getCellValue(column, row);
                    const cellContent = column.cell
                      ? column.cell(value, row, rowIndex)
                      : value;

                    return (
                      <td
                        key={column.id}
                        className={[
                          'n3-data-table__td',
                          `n3-data-table__td--${column.align || 'left'}`,
                          column.cellClassName || '',
                        ].filter(Boolean).join(' ')}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}) as <T>(props: N3DataTableProps<T>) => React.ReactElement;

N3DataTable.displayName = 'N3DataTable';

export default N3DataTable;
