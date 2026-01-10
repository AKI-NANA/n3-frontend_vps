'use client';

import React, { memo, ReactNode, useState, useCallback } from 'react';

// ============================================
// Design Variants
// ============================================
export type TableVariant = 'default' | 'editing' | 'compact' | 'comfortable';
export type TableDensity = 'compact' | 'default' | 'comfortable';

// ============================================
// N3Table - テーブルコンテナ
// ============================================
export interface N3TableProps {
  children: ReactNode;
  variant?: TableVariant;
  density?: TableDensity;
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  className?: string;
}

export const N3Table = memo(function N3Table({
  children,
  variant = 'default',
  density = 'default',
  loading = false,
  empty = false,
  emptyText = 'データがありません',
  className = '',
}: N3TableProps) {
  const tableStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--panel, #ffffff)',
    border: '1px solid var(--panel-border, #e5e7eb)',
    borderRadius: 'var(--radius-md, 8px)',
    overflow: 'hidden',
    fontSize: density === 'compact' ? '11px' : density === 'comfortable' ? '14px' : '12px',
  };

  if (loading) {
    return (
      <div style={tableStyle} className={className}>
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted, #6b7280)' }}>
          読み込み中...
        </div>
      </div>
    );
  }

  if (empty) {
    return (
      <div style={tableStyle} className={className}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '48px 16px',
          color: 'var(--text-muted, #6b7280)',
        }}>
          <div style={{ fontSize: '14px' }}>{emptyText}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={tableStyle} className={className} data-variant={variant} data-density={density}>
      {children}
    </div>
  );
});

// ============================================
// N3TableHeader - ヘッダー行
// ============================================
export interface ColumnDef {
  id: string;
  label: string;
  width?: number | string;
  minWidth?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface N3TableHeaderProps {
  columns: ColumnDef[];
  selectable?: boolean;
  allSelected?: boolean;
  indeterminate?: boolean;
  onSelectAll?: (checked: boolean) => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
  variant?: TableVariant;
  density?: TableDensity;
  className?: string;
}

export const N3TableHeader = memo(function N3TableHeader({
  columns,
  selectable = false,
  allSelected = false,
  indeterminate = false,
  onSelectAll,
  sortColumn,
  sortDirection,
  onSort,
  variant = 'default',
  density = 'default',
  className = '',
}: N3TableHeaderProps) {
  const heightMap = { compact: 24, default: 28, comfortable: 36 };
  const height = heightMap[density];

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: `${height}px`,
    background: 'var(--highlight, #f9fafb)',
    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
    fontSize: density === 'compact' ? '10px' : '11px',
    fontWeight: 500,
    color: 'var(--text-muted, #6b7280)',
    flexShrink: 0,
  };

  const cellStyle = (col: ColumnDef): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: col.align === 'left' ? 'flex-start' : col.align === 'right' ? 'flex-end' : 'center',
    height: '100%',
    flexShrink: 0,
    width: col.width ? (typeof col.width === 'number' ? `${col.width}px` : col.width) : undefined,
    minWidth: col.minWidth,
    flex: col.flex,
    padding: col.align === 'left' ? '0 4px 0 8px' : col.align === 'right' ? '0 8px 0 4px' : '0 4px',
    cursor: col.sortable ? 'pointer' : 'default',
  });

  return (
    <div style={headerStyle} className={className}>
      {selectable && (
        <div style={{ width: density === 'compact' ? '24px' : '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => { if (el) el.indeterminate = indeterminate; }}
            onChange={(e) => onSelectAll?.(e.target.checked)}
            style={{ width: '14px', height: '14px', cursor: 'pointer' }}
          />
        </div>
      )}
      {columns.map((col) => (
        <div
          key={col.id}
          style={cellStyle(col)}
          onClick={() => col.sortable && onSort?.(col.id)}
        >
          {col.label}
          {col.sortable && sortColumn === col.id && (
            <span style={{ marginLeft: '4px' }}>
              {sortDirection === 'asc' ? '↑' : '↓'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
});

// ============================================
// N3TableRow - データ行
// ============================================
export interface N3TableRowProps {
  children: ReactNode;
  selected?: boolean;
  modified?: boolean;
  expanded?: boolean;
  fast?: boolean;
  onClick?: () => void;
  density?: TableDensity;
  className?: string;
}

export const N3TableRow = memo(function N3TableRow({
  children,
  selected = false,
  modified = false,
  expanded = false,
  fast = false,
  onClick,
  density = 'default',
  className = '',
}: N3TableRowProps) {
  const [hovered, setHovered] = useState(false);
  
  const heightMap = { compact: 26, default: 36, comfortable: 48 };
  const height = fast ? 26 : heightMap[density];

  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    height: `${height}px`,
    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
    background: selected 
      ? 'rgba(99, 102, 241, 0.08)' 
      : modified 
        ? 'rgba(245, 158, 11, 0.08)' 
        : hovered 
          ? 'var(--highlight, #f9fafb)' 
          : 'transparent',
    transition: 'background 0.1s ease',
    cursor: onClick ? 'pointer' : 'default',
  };

  return (
    <div
      style={rowStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </div>
  );
});

// ============================================
// N3TableCell - セル
// ============================================
export interface N3TableCellProps {
  children: ReactNode;
  width?: number | string;
  minWidth?: number;
  flex?: number;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const N3TableCell = memo(function N3TableCell({
  children,
  width,
  minWidth,
  flex,
  align = 'center',
  className = '',
}: N3TableCellProps) {
  const cellStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    height: '100%',
    flexShrink: 0,
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    minWidth,
    flex,
    padding: align === 'left' ? '0 4px 0 8px' : align === 'right' ? '0 8px 0 4px' : '0 4px',
    overflow: 'hidden',
  };

  return (
    <div style={cellStyle} className={className}>
      {children}
    </div>
  );
});

// ============================================
// N3TableToolbar - ツールバー
// ============================================
export interface N3TableToolbarProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  density?: TableDensity;
  className?: string;
}

export const N3TableToolbar = memo(function N3TableToolbar({
  children,
  left,
  right,
  density = 'default',
  className = '',
}: N3TableToolbarProps) {
  const height = density === 'compact' ? 24 : 28;

  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: `${height}px`,
    padding: '0 8px',
    background: 'var(--highlight, #f9fafb)',
    borderBottom: '1px solid var(--panel-border, #e5e7eb)',
    flexShrink: 0,
  };

  return (
    <div style={toolbarStyle} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {left}
      </div>
      {children}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {right}
      </div>
    </div>
  );
});

// ============================================
// N3TableFooter - フッター
// ============================================
export interface N3TableFooterProps {
  children?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  density?: TableDensity;
  className?: string;
}

export const N3TableFooter = memo(function N3TableFooter({
  children,
  left,
  right,
  density = 'default',
  className = '',
}: N3TableFooterProps) {
  const height = density === 'compact' ? 22 : 26;

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: `${height}px`,
    padding: '0 8px',
    background: 'var(--highlight, #f9fafb)',
    borderTop: '1px solid var(--panel-border, #e5e7eb)',
    flexShrink: 0,
    fontSize: '10px',
    color: 'var(--text-muted, #6b7280)',
  };

  return (
    <div style={footerStyle} className={className}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {left}
      </div>
      {children}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {right}
      </div>
    </div>
  );
});

export default N3Table;
