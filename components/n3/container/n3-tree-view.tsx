// components/n3/container/n3-tree-view.tsx
/**
 * N3TreeView - 階層表示コンポーネント (Container)
 * HTSコード、カテゴリ、フォルダ構造の表示に使用
 */

'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Check } from 'lucide-react';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  data?: any;
  disabled?: boolean;
  selectable?: boolean;
}

export interface N3TreeViewProps {
  data: TreeNode[];
  selectedIds?: string[];
  expandedIds?: string[];
  onSelect?: (node: TreeNode) => void;
  onToggle?: (nodeId: string, expanded: boolean) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  multiSelect?: boolean;
  showCheckboxes?: boolean;
  showIcons?: boolean;
  defaultExpandAll?: boolean;
  searchable?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  variant?: 'default' | 'compact' | 'bordered';
  className?: string;
  style?: React.CSSProperties;
}

// ツリーノードコンポーネント
const TreeNodeItem = memo(function TreeNodeItem({
  node,
  level,
  expanded,
  selected,
  checked,
  onToggle,
  onSelect,
  onCheck,
  showCheckboxes,
  showIcons,
  variant,
  highlightText,
}: {
  node: TreeNode;
  level: number;
  expanded: boolean;
  selected: boolean;
  checked: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onCheck: () => void;
  showCheckboxes: boolean;
  showIcons: boolean;
  variant: 'default' | 'compact' | 'bordered';
  highlightText?: string;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isCompact = variant === 'compact';

  // ハイライトテキスト
  const renderLabel = () => {
    if (!highlightText || !node.label.toLowerCase().includes(highlightText.toLowerCase())) {
      return node.label;
    }

    const parts = node.label.split(new RegExp(`(${highlightText})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightText.toLowerCase() ? (
        <mark
          key={i}
          style={{
            background: 'var(--color-warning)',
            color: 'var(--text)',
            borderRadius: '2px',
            padding: '0 2px',
          }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div
      style={{
        paddingLeft: `${level * (isCompact ? 16 : 20)}px`,
        userSelect: 'none',
      }}
    >
      <div
        onClick={node.selectable !== false && !node.disabled ? onSelect : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: isCompact ? '4px 8px' : '6px 10px',
          borderRadius: 'var(--style-radius-md, 8px)',
          cursor: node.disabled ? 'not-allowed' : node.selectable !== false ? 'pointer' : 'default',
          background: selected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
          opacity: node.disabled ? 0.5 : 1,
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={e => {
          if (!selected && !node.disabled) {
            e.currentTarget.style.background = 'var(--highlight)';
          }
        }}
        onMouseLeave={e => {
          if (!selected) {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        {/* 展開アイコン */}
        <div
          onClick={e => {
            e.stopPropagation();
            if (hasChildren) onToggle();
          }}
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: hasChildren ? 'pointer' : 'default',
            color: 'var(--text-muted)',
          }}
        >
          {hasChildren &&
            (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </div>

        {/* チェックボックス */}
        {showCheckboxes && (
          <div
            onClick={e => {
              e.stopPropagation();
              if (!node.disabled) onCheck();
            }}
            style={{
              width: '16px',
              height: '16px',
              border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--panel-border)'}`,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: checked ? 'var(--color-primary)' : 'transparent',
              cursor: node.disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {checked && <Check size={10} color="white" strokeWidth={3} />}
          </div>
        )}

        {/* アイコン */}
        {showIcons && (
          <div style={{ color: 'var(--text-muted)', display: 'flex' }}>
            {node.icon || (hasChildren ? (
              expanded ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : (
              <File size={16} />
            ))}
          </div>
        )}

        {/* ラベル */}
        <span
          style={{
            fontSize: isCompact ? '12px' : '13px',
            color: selected ? 'var(--color-primary)' : 'var(--text)',
            fontWeight: selected ? 500 : 400,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {renderLabel()}
        </span>
      </div>
    </div>
  );
});

export const N3TreeView = memo(function N3TreeView({
  data,
  selectedIds = [],
  expandedIds: externalExpandedIds,
  onSelect,
  onToggle,
  onSelectionChange,
  multiSelect = false,
  showCheckboxes = false,
  showIcons = true,
  defaultExpandAll = false,
  searchable = false,
  searchValue: externalSearchValue,
  onSearchChange,
  variant = 'default',
  className = '',
  style,
}: N3TreeViewProps) {
  // 内部状態
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(() => {
    if (defaultExpandAll) {
      const getAllIds = (nodes: TreeNode[]): string[] => {
        return nodes.flatMap(node => [
          node.id,
          ...(node.children ? getAllIds(node.children) : []),
        ]);
      };
      return getAllIds(data);
    }
    return [];
  });
  const [internalSearchValue, setInternalSearchValue] = useState('');

  const expandedIds = externalExpandedIds ?? internalExpandedIds;
  const searchValue = externalSearchValue ?? internalSearchValue;

  // 展開切り替え
  const handleToggle = useCallback(
    (nodeId: string) => {
      const isExpanded = expandedIds.includes(nodeId);
      const newExpanded = isExpanded
        ? expandedIds.filter(id => id !== nodeId)
        : [...expandedIds, nodeId];

      if (!externalExpandedIds) {
        setInternalExpandedIds(newExpanded);
      }
      onToggle?.(nodeId, !isExpanded);
    },
    [expandedIds, externalExpandedIds, onToggle]
  );

  // 選択
  const handleSelect = useCallback(
    (node: TreeNode) => {
      onSelect?.(node);

      if (multiSelect) {
        const newSelection = selectedIds.includes(node.id)
          ? selectedIds.filter(id => id !== node.id)
          : [...selectedIds, node.id];
        onSelectionChange?.(newSelection);
      } else {
        onSelectionChange?.([node.id]);
      }
    },
    [onSelect, multiSelect, selectedIds, onSelectionChange]
  );

  // チェック
  const handleCheck = useCallback(
    (node: TreeNode) => {
      const newSelection = selectedIds.includes(node.id)
        ? selectedIds.filter(id => id !== node.id)
        : [...selectedIds, node.id];
      onSelectionChange?.(newSelection);
    },
    [selectedIds, onSelectionChange]
  );

  // 検索
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (onSearchChange) {
        onSearchChange(value);
      } else {
        setInternalSearchValue(value);
      }
    },
    [onSearchChange]
  );

  // 検索フィルター
  const filterNodes = useCallback(
    (nodes: TreeNode[], search: string): TreeNode[] => {
      if (!search) return nodes;

      return nodes
        .map(node => {
          const matchesSearch = node.label.toLowerCase().includes(search.toLowerCase());
          const filteredChildren = node.children
            ? filterNodes(node.children, search)
            : undefined;

          if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
            return {
              ...node,
              children: filteredChildren,
            };
          }
          return null;
        })
        .filter(Boolean) as TreeNode[];
    },
    []
  );

  const filteredData = useMemo(
    () => filterNodes(data, searchValue),
    [data, searchValue, filterNodes]
  );

  // ノードレンダリング
  const renderNodes = useCallback(
    (nodes: TreeNode[], level: number = 0): React.ReactNode => {
      return nodes.map(node => {
        const isExpanded = expandedIds.includes(node.id);
        const isSelected = selectedIds.includes(node.id);

        return (
          <React.Fragment key={node.id}>
            <TreeNodeItem
              node={node}
              level={level}
              expanded={isExpanded}
              selected={isSelected}
              checked={isSelected}
              onToggle={() => handleToggle(node.id)}
              onSelect={() => handleSelect(node)}
              onCheck={() => handleCheck(node)}
              showCheckboxes={showCheckboxes}
              showIcons={showIcons}
              variant={variant}
              highlightText={searchValue}
            />
            {isExpanded && node.children && (
              <div>{renderNodes(node.children, level + 1)}</div>
            )}
          </React.Fragment>
        );
      });
    },
    [expandedIds, selectedIds, handleToggle, handleSelect, handleCheck, showCheckboxes, showIcons, variant, searchValue]
  );

  return (
    <div
      className={`n3-tree-view ${className}`}
      style={{
        background: variant === 'bordered' ? 'var(--panel)' : 'transparent',
        border: variant === 'bordered' ? '1px solid var(--panel-border)' : 'none',
        borderRadius: variant === 'bordered' ? 'var(--style-radius-lg, 12px)' : 0,
        padding: variant === 'bordered' ? '12px' : 0,
        ...style,
      }}
    >
      {/* 検索 */}
      {searchable && (
        <div style={{ marginBottom: '12px' }}>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="検索..."
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '13px',
              border: '1px solid var(--panel-border)',
              borderRadius: 'var(--style-radius-md, 8px)',
              background: 'var(--highlight)',
              color: 'var(--text)',
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* ツリー */}
      <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
        {filteredData.length > 0 ? (
          renderNodes(filteredData)
        ) : (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            {searchValue ? '検索結果がありません' : 'データがありません'}
          </div>
        )}
      </div>
    </div>
  );
});

export default N3TreeView;
