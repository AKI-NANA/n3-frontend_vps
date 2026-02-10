// components/n3/n3-universal-filter.tsx
/**
 * N3 Universal Filter Component
 * 
 * 全タブ共通で使用できるフィルターコンポーネント
 * 
 * 機能:
 * - テキスト検索
 * - 数量範囲フィルター
 * - カテゴリフィルター
 * - 保管場所フィルター
 * - タグフィルター
 * - 価格範囲フィルター
 * - 日付範囲フィルター
 * - フィルター状態の保存/復元
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect, memo } from 'react';
import { 
  Search, Filter, X, ChevronDown, ChevronUp, 
  Tag, MapPin, Calendar, DollarSign, Package,
  RotateCcw, Save, Check
} from 'lucide-react';
import { N3Button } from './presentational/n3-button';
import { N3Input } from './presentational/n3-input';
import { N3Badge } from './presentational/n3-badge';

// ============================================================
// 型定義
// ============================================================

export interface FilterState {
  // テキスト検索
  search?: string;
  
  // 数量フィルター
  quantity?: {
    min?: number;
    max?: number;
    operator?: 'eq' | 'gte' | 'lte' | 'between';
  };
  
  // カテゴリ（複数選択）
  categories?: string[];
  
  // 保管場所（複数選択）
  storageLocations?: string[];
  
  // タグ（複数選択）
  tags?: string[];
  
  // 価格範囲
  priceRange?: {
    min?: number;
    max?: number;
    currency?: 'JPY' | 'USD';
  };
  
  // 日付範囲
  dateRange?: {
    field?: string; // 対象フィールド名
    from?: string;  // ISO日付文字列
    to?: string;
  };
  
  // マーケットプレイス
  marketplace?: string;
  
  // アカウント
  account?: string;
  
  // ステータス
  status?: string;
  
  // 在庫タイプ
  inventoryType?: 'stock' | 'mu' | 'all';
  
  // コンディション
  condition?: string;
  
  // バリエーションステータス
  variationStatus?: 'parent' | 'member' | 'standalone' | 'all';
  
  // カスタムフィルター（拡張用）
  custom?: Record<string, any>;
}

export interface FilterOption {
  id: string;
  label: string;
  count?: number;
  color?: string;
}

export interface FilterConfig {
  // 利用可能なオプション
  categories?: FilterOption[];
  storageLocations?: FilterOption[];
  tags?: FilterOption[];
  marketplaces?: FilterOption[];
  accounts?: FilterOption[];
  statuses?: FilterOption[];
  conditions?: FilterOption[];
  
  // 表示設定
  showSearch?: boolean;
  showQuantity?: boolean;
  showCategories?: boolean;
  showStorageLocations?: boolean;
  showTags?: boolean;
  showPriceRange?: boolean;
  showDateRange?: boolean;
  showMarketplace?: boolean;
  showAccount?: boolean;
  showStatus?: boolean;
  showInventoryType?: boolean;
  showCondition?: boolean;
  showVariationStatus?: boolean;
  
  // その他
  collapsible?: boolean;
  saveToStorage?: boolean;
  storageKey?: string;
}

export interface N3UniversalFilterProps {
  /** フィルター状態 */
  filters: FilterState;
  /** フィルター変更時のコールバック */
  onFilterChange: (filters: FilterState) => void;
  /** フィルター設定 */
  config?: FilterConfig;
  /** コンパクトモード */
  compact?: boolean;
  /** クラス名 */
  className?: string;
  /** スタイル */
  style?: React.CSSProperties;
}

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_CONFIG: FilterConfig = {
  showSearch: true,
  showQuantity: true,
  showCategories: true,
  showStorageLocations: true,
  showTags: true,
  showPriceRange: false,
  showDateRange: false,
  showMarketplace: false,
  showAccount: false,
  showStatus: false,
  showInventoryType: false,
  showCondition: false,
  showVariationStatus: false,
  collapsible: true,
  saveToStorage: false,
  storageKey: 'n3_filter_state'
};

// ============================================================
// サブコンポーネント
// ============================================================

/** フィルターチップ */
const FilterChip = memo(function FilterChip({
  label,
  onRemove,
  color = 'var(--accent)'
}: {
  label: string;
  onRemove: () => void;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
      style={{ 
        background: `${color}20`, 
        color: color,
        border: `1px solid ${color}40`
      }}
    >
      {label}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="hover:bg-white/20 rounded-full p-0.5"
      >
        <X size={10} />
      </button>
    </span>
  );
});

/** オプションセレクター */
const OptionSelector = memo(function OptionSelector({
  label,
  icon: Icon,
  options,
  selected,
  onChange,
  multiple = true
}: {
  label: string;
  icon: React.ElementType;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiple?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleToggle = (id: string) => {
    if (multiple) {
      if (selected.includes(id)) {
        onChange(selected.filter(s => s !== id));
      } else {
        onChange([...selected, id]);
      }
    } else {
      onChange(selected.includes(id) ? [] : [id]);
    }
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded text-sm border transition-colors"
        style={{
          background: selected.length > 0 ? 'var(--accent)' : 'var(--highlight)',
          color: selected.length > 0 ? 'white' : 'var(--text)',
          borderColor: selected.length > 0 ? 'var(--accent)' : 'var(--panel-border)'
        }}
      >
        <Icon size={14} />
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="bg-white/20 px-1.5 rounded text-xs">{selected.length}</span>
        )}
        {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>
      
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 min-w-48 max-h-64 overflow-y-auto rounded-lg shadow-lg z-50"
          style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}
        >
          {options.map(option => (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-black/5 transition-colors"
              style={{ color: 'var(--text)' }}
            >
              <span className="flex items-center gap-2">
                {option.color && (
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ background: option.color }}
                  />
                )}
                {option.label}
              </span>
              <span className="flex items-center gap-2">
                {option.count !== undefined && (
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {option.count}
                  </span>
                )}
                {selected.includes(option.id) && (
                  <Check size={14} style={{ color: 'var(--accent)' }} />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const N3UniversalFilter = memo(function N3UniversalFilter({
  filters,
  onFilterChange,
  config: userConfig = {},
  compact = false,
  className = '',
  style = {}
}: N3UniversalFilterProps) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const [isExpanded, setIsExpanded] = useState(!compact);
  
  // アクティブなフィルター数
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.quantity?.min !== undefined || filters.quantity?.max !== undefined) count++;
    if (filters.categories?.length) count += filters.categories.length;
    if (filters.storageLocations?.length) count += filters.storageLocations.length;
    if (filters.tags?.length) count += filters.tags.length;
    if (filters.priceRange?.min !== undefined || filters.priceRange?.max !== undefined) count++;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    if (filters.marketplace) count++;
    if (filters.account) count++;
    if (filters.status) count++;
    if (filters.inventoryType && filters.inventoryType !== 'all') count++;
    if (filters.condition) count++;
    if (filters.variationStatus && filters.variationStatus !== 'all') count++;
    return count;
  }, [filters]);
  
  // フィルター更新ヘルパー
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  }, [filters, onFilterChange]);
  
  // フィルターリセット
  const resetFilters = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);
  
  // ローカルストレージ保存
  useEffect(() => {
    if (config.saveToStorage && config.storageKey) {
      localStorage.setItem(config.storageKey, JSON.stringify(filters));
    }
  }, [filters, config.saveToStorage, config.storageKey]);
  
  // ローカルストレージ復元
  useEffect(() => {
    if (config.saveToStorage && config.storageKey) {
      const saved = localStorage.getItem(config.storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          onFilterChange(parsed);
        } catch {}
      }
    }
  }, []);
  
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        ...style
      }}
    >
      {/* ヘッダー */}
      <div
        className="flex items-center justify-between px-4 py-2 cursor-pointer"
        style={{ borderBottom: isExpanded ? '1px solid var(--panel-border)' : 'none' }}
        onClick={() => config.collapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            フィルター
          </span>
          {activeFilterCount > 0 && (
            <N3Badge variant="accent" size="sm">{activeFilterCount}</N3Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); resetFilters(); }}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-black/5"
              style={{ color: 'var(--text-muted)' }}
            >
              <RotateCcw size={12} />
              リセット
            </button>
          )}
          {config.collapsible && (
            isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
          )}
        </div>
      </div>
      
      {/* フィルター本体 */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* 検索 */}
          {config.showSearch && (
            <div className="relative">
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 -translate-y-1/2" 
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="SKU、タイトル、IDで検索..."
                value={filters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value || undefined)}
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
              {filters.search && (
                <button
                  onClick={() => updateFilter('search', undefined)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}
          
          {/* フィルターボタン群 */}
          <div className="flex flex-wrap gap-2">
            {/* カテゴリ */}
            {config.showCategories && config.categories && config.categories.length > 0 && (
              <OptionSelector
                label="カテゴリ"
                icon={Package}
                options={config.categories}
                selected={filters.categories || []}
                onChange={(v) => updateFilter('categories', v.length > 0 ? v : undefined)}
              />
            )}
            
            {/* 保管場所 */}
            {config.showStorageLocations && config.storageLocations && config.storageLocations.length > 0 && (
              <OptionSelector
                label="保管場所"
                icon={MapPin}
                options={config.storageLocations}
                selected={filters.storageLocations || []}
                onChange={(v) => updateFilter('storageLocations', v.length > 0 ? v : undefined)}
              />
            )}
            
            {/* タグ */}
            {config.showTags && config.tags && config.tags.length > 0 && (
              <OptionSelector
                label="タグ"
                icon={Tag}
                options={config.tags}
                selected={filters.tags || []}
                onChange={(v) => updateFilter('tags', v.length > 0 ? v : undefined)}
              />
            )}
            
            {/* マーケットプレイス */}
            {config.showMarketplace && config.marketplaces && config.marketplaces.length > 0 && (
              <OptionSelector
                label="マーケットプレイス"
                icon={Package}
                options={config.marketplaces}
                selected={filters.marketplace ? [filters.marketplace] : []}
                onChange={(v) => updateFilter('marketplace', v[0] || undefined)}
                multiple={false}
              />
            )}
            
            {/* アカウント */}
            {config.showAccount && config.accounts && config.accounts.length > 0 && (
              <OptionSelector
                label="アカウント"
                icon={Package}
                options={config.accounts}
                selected={filters.account ? [filters.account] : []}
                onChange={(v) => updateFilter('account', v[0] || undefined)}
                multiple={false}
              />
            )}
          </div>
          
          {/* 数量フィルター */}
          {config.showQuantity && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>数量:</span>
              <input
                type="number"
                placeholder="最小"
                value={filters.quantity?.min ?? ''}
                onChange={(e) => updateFilter('quantity', {
                  ...filters.quantity,
                  min: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="w-20 px-2 py-1 rounded text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>〜</span>
              <input
                type="number"
                placeholder="最大"
                value={filters.quantity?.max ?? ''}
                onChange={(e) => updateFilter('quantity', {
                  ...filters.quantity,
                  max: e.target.value ? parseInt(e.target.value) : undefined
                })}
                className="w-20 px-2 py-1 rounded text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          )}
          
          {/* 価格範囲 */}
          {config.showPriceRange && (
            <div className="flex items-center gap-2">
              <DollarSign size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>価格:</span>
              <input
                type="number"
                placeholder="最小"
                value={filters.priceRange?.min ?? ''}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  min: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-24 px-2 py-1 rounded text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>〜</span>
              <input
                type="number"
                placeholder="最大"
                value={filters.priceRange?.max ?? ''}
                onChange={(e) => updateFilter('priceRange', {
                  ...filters.priceRange,
                  max: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-24 px-2 py-1 rounded text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          )}
          
          {/* 日付範囲 */}
          {config.showDateRange && (
            <div className="flex items-center gap-2">
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>期間:</span>
              <input
                type="date"
                value={filters.dateRange?.from || ''}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  from: e.target.value || undefined
                })}
                className="px-2 py-1 rounded text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
              <span style={{ color: 'var(--text-muted)' }}>〜</span>
              <input
                type="date"
                value={filters.dateRange?.to || ''}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  to: e.target.value || undefined
                })}
                className="px-2 py-1 rounded text-sm"
                style={{
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--text)'
                }}
              />
            </div>
          )}
          
          {/* アクティブフィルター表示 */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-1 pt-2" style={{ borderTop: '1px solid var(--panel-border)' }}>
              {filters.search && (
                <FilterChip
                  label={`検索: ${filters.search}`}
                  onRemove={() => updateFilter('search', undefined)}
                />
              )}
              {filters.categories?.map(cat => (
                <FilterChip
                  key={cat}
                  label={config.categories?.find(c => c.id === cat)?.label || cat}
                  onRemove={() => updateFilter('categories', filters.categories?.filter(c => c !== cat))}
                  color="var(--accent)"
                />
              ))}
              {filters.storageLocations?.map(loc => (
                <FilterChip
                  key={loc}
                  label={config.storageLocations?.find(l => l.id === loc)?.label || loc}
                  onRemove={() => updateFilter('storageLocations', filters.storageLocations?.filter(l => l !== loc))}
                  color="#10b981"
                />
              ))}
              {filters.tags?.map(tag => (
                <FilterChip
                  key={tag}
                  label={config.tags?.find(t => t.id === tag)?.label || tag}
                  onRemove={() => updateFilter('tags', filters.tags?.filter(t => t !== tag))}
                  color="#f59e0b"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default N3UniversalFilter;
