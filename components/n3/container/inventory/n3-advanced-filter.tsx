/**
 * N3AdvancedFilter - 高度なフィルターコンポーネント
 * 
 * 棚卸し画面のFilterPanelを汎用化
 * 複数行フィルター、マーケットプレイス/アカウント選択、バリエーション状態対応
 * 
 * @example
 * <N3AdvancedFilter
 *   rows={[
 *     { columns: 6, items: [...] },
 *     { columns: 6, items: [...] }
 *   ]}
 *   values={filterValues}
 *   onChange={setFilterValues}
 *   onReset={handleReset}
 * />
 */

'use client';

import React, { memo, type ReactNode } from 'react';
import { 
  Search,
  ShoppingCart,
  Store,
  Tag,
  Package,
  Folder,
  Award,
  Layers,
  TrendingUp,
  Clock,
  Globe,
  GitBranch,
  Lightbulb,
  RotateCcw,
  type LucideIcon
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

export type FilterItemType = 'text' | 'select' | 'checkbox' | 'custom';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface FilterItem {
  /** フィルターキー */
  key: string;
  /** ラベル */
  label: string;
  /** フィルタータイプ */
  type: FilterItemType;
  /** アイコン */
  icon?: LucideIcon;
  /** select用オプション */
  options?: SelectOption[];
  /** text用プレースホルダー */
  placeholder?: string;
  /** 列幅（デフォルト: 1） */
  span?: number;
  /** checkbox用ヒントテキスト */
  hint?: string;
  /** カスタムレンダラー */
  render?: (value: any, onChange: (value: any) => void) => ReactNode;
}

export interface FilterRow {
  /** 列数 */
  columns: 2 | 3 | 4 | 5 | 6;
  /** フィルターアイテム */
  items: FilterItem[];
  /** 区切り線を表示 */
  divider?: boolean;
}

export interface N3AdvancedFilterProps {
  /** フィルター行配列 */
  rows: FilterRow[];
  /** フィルター値 */
  values: Record<string, any>;
  /** 変更ハンドラ */
  onChange: (values: Record<string, any>) => void;
  /** リセットハンドラ */
  onReset?: () => void;
  /** ヒントメッセージ */
  hint?: {
    icon?: LucideIcon;
    message: string;
  };
  /** サイズ指定 */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** 追加のクラス名 */
  className?: string;
}

// ============================================================
// Helper Components
// ============================================================

const FilterInput = memo(function FilterInput({
  item,
  value,
  onChange,
}: {
  item: FilterItem;
  value: any;
  onChange: (value: any) => void;
}) {
  const Icon = item.icon;

  switch (item.type) {
    case 'text':
      return (
        <div className="n3-advanced-filter__item" style={{ gridColumn: item.span ? `span ${item.span}` : undefined }}>
          <label className="n3-advanced-filter__label">
            {Icon && <Icon className="n3-advanced-filter__label-icon" />}
            {item.label}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={item.placeholder}
            className="n3-input"
          />
        </div>
      );

    case 'select':
      return (
        <div className="n3-advanced-filter__item" style={{ gridColumn: item.span ? `span ${item.span}` : undefined }}>
          <label className="n3-advanced-filter__label">
            {Icon && <Icon className="n3-advanced-filter__label-icon" />}
            {item.label}
          </label>
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="n3-select"
          >
            {item.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.icon ? `${opt.icon} ${opt.label}` : opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'checkbox':
      return (
        <div className="n3-advanced-filter__item" style={{ gridColumn: item.span ? `span ${item.span}` : undefined }}>
          <div className="n3-advanced-filter__checkbox-wrapper">
            <label className="n3-advanced-filter__checkbox">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange(e.target.checked)}
              />
              <span className="n3-advanced-filter__checkbox-label">
                {Icon && <Icon className="n3-advanced-filter__label-icon" />}
                {item.label}
              </span>
            </label>
            {item.hint && (
              <p className="n3-advanced-filter__checkbox-hint">{item.hint}</p>
            )}
          </div>
        </div>
      );

    case 'custom':
      return (
        <div className="n3-advanced-filter__item" style={{ gridColumn: item.span ? `span ${item.span}` : undefined }}>
          {item.render?.(value, onChange)}
        </div>
      );

    default:
      return null;
  }
});

// ============================================================
// Main Component
// ============================================================

export const N3AdvancedFilter = memo(function N3AdvancedFilter({
  rows,
  values,
  onChange,
  onReset,
  hint,
  size,
  className = '',
}: N3AdvancedFilterProps) {
  const sizeClass = size ? `n3-size-${size}` : '';
  const classes = ['n3-advanced-filter', sizeClass, className].filter(Boolean).join(' ');

  const handleItemChange = (key: string, value: any) => {
    onChange({ ...values, [key]: value });
  };

  const HintIcon = hint?.icon || Lightbulb;

  return (
    <div className={classes}>
      {rows.map((row, rowIdx) => (
        <React.Fragment key={rowIdx}>
          {row.divider && <div className="n3-advanced-filter__divider" />}
          <div className={`n3-advanced-filter__row n3-advanced-filter__row--${row.columns}`}>
            {row.items.map((item) => (
              <FilterInput
                key={item.key}
                item={item}
                value={values[item.key]}
                onChange={(value) => handleItemChange(item.key, value)}
              />
            ))}
          </div>
        </React.Fragment>
      ))}

      {/* 下部: リセットボタンとヒント */}
      {(onReset || hint) && (
        <div className="n3-advanced-filter__divider">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 2)', flexWrap: 'wrap' }}>
            {onReset && (
              <div className="n3-advanced-filter__actions">
                <button
                  onClick={onReset}
                  className="n3-btn n3-btn-ghost"
                  style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--n3-gap) * 0.5)' }}
                >
                  <RotateCcw style={{ width: 'var(--n3-icon)', height: 'var(--n3-icon)' }} />
                  フィルタークリア
                </button>
              </div>
            )}
            
            {hint && (
              <div className="n3-advanced-filter__hint" style={{ flex: 1 }}>
                <HintIcon className="n3-advanced-filter__hint-icon" />
                <span>
                  <strong>ヒント:</strong> {hint.message}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

N3AdvancedFilter.displayName = 'N3AdvancedFilter';

// ============================================================
// Preset Filter Configurations
// ============================================================

/** マーケットプレイスフィルターオプション */
export const MARKETPLACE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'ebay', label: 'eBay', icon: '🛒' },
  { value: 'mercari', label: 'メルカリ', icon: '🔴' },
  { value: 'manual', label: '手動登録', icon: '✏️' },
];

/** eBayアカウントフィルターオプション */
export const EBAY_ACCOUNT_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'MJT', label: 'MJT', icon: '🔵' },
  { value: 'GREEN', label: 'GREEN', icon: '🟢' },
  { value: 'manual', label: '手動入力', icon: '✏️' },
];

/** 商品タイプフィルターオプション */
export const PRODUCT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'stock', label: '有在庫' },
  { value: 'dropship', label: '無在庫' },
  { value: 'set', label: 'セット商品' },
  { value: 'variation', label: 'バリエーション' },
  { value: 'hybrid', label: 'ハイブリッド' },
];

/** 在庫状態フィルターオプション */
export const STOCK_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'in_stock', label: '在庫あり' },
  { value: 'out_of_stock', label: '欠品' },
];

/** コンディションフィルターオプション */
export const CONDITION_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'new', label: '新品' },
  { value: 'used', label: '中古' },
  { value: 'refurbished', label: '整備済' },
];

/** 在庫タイプフィルターオプション */
export const INVENTORY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'ROTATION_90_DAYS', label: '回転商品（90日）', icon: '⚡' },
  { value: 'INVESTMENT_10_PERCENT', label: '投資商品（10%）', icon: '💎' },
];

/** 価格フェーズフィルターオプション */
export const PRICE_PHASE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'NORMAL', label: '通常販売', icon: '✅' },
  { value: 'WARNING', label: '警戒販売', icon: '⚠️' },
  { value: 'LIQUIDATION', label: '損切り実行', icon: '🔴' },
];

/** 経過日数フィルターオプション */
export const DAYS_HELD_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: '0-90', label: '0-90日（通常）' },
  { value: '91-180', label: '91-180日（警戒）' },
  { value: '180+', label: '180日超（損切り）' },
];

/** 販売サイトフィルターオプション */
export const SITE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'US', label: 'USA (eBay.com)', icon: '🇺🇸' },
  { value: 'UK', label: 'UK (eBay.co.uk)', icon: '🇬🇧' },
  { value: 'AU', label: 'AU (eBay.com.au)', icon: '🇦🇺' },
];

/** バリエーション状態フィルターオプション */
export const VARIATION_STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'すべて' },
  { value: 'standalone', label: '単独SKU', icon: '🔹' },
  { value: 'parent', label: 'バリエーション親', icon: '👑' },
  { value: 'member', label: 'バリエーションメンバー', icon: '🔗' },
];

// ============================================================
// Preset Row Builder
// ============================================================

/**
 * 棚卸しページ用のフィルター行を生成
 */
export function createInventoryFilterRows(categories: string[] = []): FilterRow[] {
  return [
    // 1行目: 検索、マーケットプレイス、アカウント、商品タイプ、在庫状態
    {
      columns: 6,
      items: [
        { key: 'search', label: '商品名・SKU検索', type: 'text', icon: Search, span: 2, placeholder: '商品名またはSKUを入力...' },
        { key: 'marketplace', label: '販売モール', type: 'select', icon: ShoppingCart, options: MARKETPLACE_OPTIONS },
        { key: 'ebay_account', label: 'eBayアカウント', type: 'select', icon: Store, options: EBAY_ACCOUNT_OPTIONS },
        { key: 'product_type', label: '商品タイプ', type: 'select', icon: Tag, options: PRODUCT_TYPE_OPTIONS },
        { key: 'stock_status', label: '在庫状態', type: 'select', icon: Package, options: STOCK_STATUS_OPTIONS },
      ],
    },
    // 2行目: カテゴリ、コンディション、在庫タイプ、価格フェーズ、経過日数、サイト
    {
      columns: 6,
      items: [
        { 
          key: 'category', 
          label: 'カテゴリ', 
          type: 'select', 
          icon: Folder, 
          options: [
            { value: '', label: 'すべて' },
            ...categories.map(c => ({ value: c, label: c }))
          ] 
        },
        { key: 'condition', label: '商品状態', type: 'select', icon: Award, options: CONDITION_OPTIONS },
        { key: 'inventory_type', label: '在庫タイプ', type: 'select', icon: Layers, options: INVENTORY_TYPE_OPTIONS },
        { key: 'price_phase', label: '価格フェーズ', type: 'select', icon: TrendingUp, options: PRICE_PHASE_OPTIONS },
        { key: 'days_held', label: '経過日数', type: 'select', icon: Clock, options: DAYS_HELD_OPTIONS },
        { key: 'site', label: '販売サイト', type: 'select', icon: Globe, options: SITE_OPTIONS },
      ],
    },
    // 3行目: バリエーション関連
    {
      columns: 6,
      divider: true,
      items: [
        { 
          key: 'grouping_candidate', 
          label: 'バリエーション候補のみ表示', 
          type: 'checkbox', 
          icon: GitBranch, 
          span: 2,
          hint: '同カテゴリ・類似価格帯の商品をフィルター'
        },
        { key: 'variation_status', label: 'バリエーション状態', type: 'select', icon: GitBranch, options: VARIATION_STATUS_OPTIONS },
      ],
    },
  ];
}
