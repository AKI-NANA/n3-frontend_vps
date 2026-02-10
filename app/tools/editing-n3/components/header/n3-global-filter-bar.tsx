// app/tools/editing-n3/components/header/n3-global-filter-bar.tsx
/**
 * N3GlobalFilterBar - グローバルフィルターバー（拡張版）
 * 
 * フィルターボタンをクリックでモーダル展開
 * 位置: サブツールバーの直下
 * 
 * フィルター項目（グループ別）:
 * 
 * 【基本】
 * - 保管場所 (env / plus1)
 * - L1-L3属性 (連動プルダウン)
 * - 在庫数 (範囲)
 * - 商品タイプ (有在庫/無在庫)
 * - アカウント (MJT/GREEN/Mystical)
 * 
 * 【価格・原価】
 * - 仕入れ値 (範囲)
 * - 販売価格USD (範囲)
 * - 利益率 (範囲)
 * - Pricing種類 (RATE/COST/ST)
 * 
 * 【分類・属性】
 * - カテゴリー (プルダウン)
 * - 原産国 (プルダウン)
 * - 素材 (プルダウン)
 * - 仕入先 (プルダウン)
 * 
 * 【関税・HTS】
 * - HTSコード (テキスト)
 * - HTS関税率 (範囲)
 * 
 * 【スコア・配送】
 * - Listing Score (範囲)
 * - 配送方法 (プルダウン)
 */

'use client';

import React, { memo, useState, useCallback, useMemo, useEffect } from 'react';
import { 
  Filter, X, Search, RotateCcw, ChevronDown, ChevronUp,
  MapPin, Layers, Package, User, Archive, Check, DollarSign,
  Globe, Tag, Truck, BarChart3, FileText
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

export interface GlobalFilterState {
  // 基本
  storageLocation: string | null;
  attrL1: string | null;
  attrL2: string | null;
  attrL3: string | null;
  stockMin: number | null;
  stockMax: number | null;
  productType: string[];
  account: string[];
  searchQuery: string;
  
  // 価格・原価
  costMin: number | null;
  costMax: number | null;
  priceUsdMin: number | null;
  priceUsdMax: number | null;
  profitMarginMin: number | null;
  profitMarginMax: number | null;
  pricingType: string[];
  
  // 分類・属性
  category: string | null;
  originCountry: string | null;
  material: string | null;
  source: string | null;
  
  // 関税・HTS
  htsCode: string | null;
  htsDutyRateMin: number | null;
  htsDutyRateMax: number | null;
  
  // スコア・配送
  listingScoreMin: number | null;
  listingScoreMax: number | null;
  shippingMethod: string | null;
}

export interface N3GlobalFilterBarProps {
  filters: GlobalFilterState;
  onFiltersChange: (filters: GlobalFilterState) => void;
  onApply?: () => void;
}

// ============================================================
// デフォルト値
// ============================================================

export const DEFAULT_FILTER_STATE: GlobalFilterState = {
  storageLocation: null,
  attrL1: null,
  attrL2: null,
  attrL3: null,
  stockMin: null,
  stockMax: null,
  productType: [],
  account: [],
  searchQuery: '',
  costMin: null,
  costMax: null,
  priceUsdMin: null,
  priceUsdMax: null,
  profitMarginMin: null,
  profitMarginMax: null,
  pricingType: [],
  category: null,
  originCountry: null,
  material: null,
  source: null,
  htsCode: null,
  htsDutyRateMin: null,
  htsDutyRateMax: null,
  listingScoreMin: null,
  listingScoreMax: null,
  shippingMethod: null,
};

// ============================================================
// 定数（選択肢）
// ============================================================

const STORAGE_OPTIONS = [
  { value: null, label: 'すべて' },
  { value: 'env', label: 'env' },
  { value: 'plus1', label: 'plus1' },
];

const PRODUCT_TYPE_OPTIONS = [
  { value: 'stock', label: '有在庫', color: '#22c55e' },
  { value: 'dropship', label: '無在庫', color: '#3b82f6' },
];

const ACCOUNT_OPTIONS = [
  { value: 'MJT', label: 'MJT', color: '#3b82f6' },
  { value: 'GREEN', label: 'GREEN', color: '#22c55e' },
  { value: 'mystical-japan-treasures', label: 'Mystical', color: '#8b5cf6' },
];

const PRICING_TYPE_OPTIONS = [
  { value: 'RATE', label: 'RATE', color: '#f59e0b' },
  { value: 'COST', label: 'COST¥', color: '#ef4444' },
  { value: 'ST', label: 'ST', color: '#8b5cf6' },
];

const SOURCE_OPTIONS = [
  { value: 'yahoo_auction', label: 'ヤフオク' },
  { value: 'mercari', label: 'メルカリ' },
  { value: 'rakuma', label: 'ラクマ' },
  { value: 'amazon_jp', label: 'Amazon JP' },
  { value: 'manual', label: '手動登録' },
];

const ORIGIN_COUNTRY_OPTIONS = [
  { value: 'JP', label: '日本 (JP)' },
  { value: 'CN', label: '中国 (CN)' },
  { value: 'TW', label: '台湾 (TW)' },
  { value: 'KR', label: '韓国 (KR)' },
  { value: 'US', label: 'アメリカ (US)' },
  { value: 'VN', label: 'ベトナム (VN)' },
  { value: 'TH', label: 'タイ (TH)' },
  { value: 'OTHER', label: 'その他' },
];

const SHIPPING_METHOD_OPTIONS = [
  { value: 'economy', label: 'Economy' },
  { value: 'standard', label: 'Standard' },
  { value: 'expedited', label: 'Expedited' },
  { value: 'express', label: 'Express' },
];

// ============================================================
// サブコンポーネント
// ============================================================

/** セクションヘッダー（折りたたみ可能） */
const CollapsibleSection = memo(function CollapsibleSection({ 
  icon: Icon, 
  label,
  children,
  defaultOpen = true,
}: { 
  icon: React.ElementType; 
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div style={{ marginBottom: 16 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          width: '100%',
          padding: '8px 0',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          borderBottom: '1px solid var(--panel-border)',
        }}
      >
        <Icon size={14} style={{ color: 'var(--accent)' }} />
        <span style={{ 
          flex: 1, 
          textAlign: 'left',
          fontSize: 12, 
          fontWeight: 600, 
          color: 'var(--text)',
        }}>
          {label}
        </span>
        {isOpen ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
      </button>
      {isOpen && (
        <div style={{ padding: '12px 0' }}>
          {children}
        </div>
      )}
    </div>
  );
});

/** ラジオボタングループ */
const RadioGroup = memo(function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string | null; label: string }[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {options.map((opt) => (
        <label
          key={opt.value ?? 'all'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontSize: 12,
            color: value === opt.value ? 'var(--accent)' : 'var(--text)',
          }}
        >
          <div
            onClick={() => onChange(opt.value)}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: value === opt.value ? 'var(--accent)' : 'var(--panel-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {value === opt.value && (
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'var(--accent)',
              }} />
            )}
          </div>
          <span onClick={() => onChange(opt.value)}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
});

/** チェックボックスグループ */
const CheckboxGroup = memo(function CheckboxGroup({
  options,
  values,
  onChange,
}: {
  options: { value: string; label: string; color?: string }[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const handleToggle = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter(v => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isChecked = values.includes(opt.value);
        return (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              fontSize: 12,
              color: isChecked ? (opt.color || 'var(--accent)') : 'var(--text)',
            }}
          >
            <div
              onClick={() => handleToggle(opt.value)}
              style={{
                width: 16,
                height: 16,
                borderRadius: 3,
                border: '2px solid',
                borderColor: isChecked ? (opt.color || 'var(--accent)') : 'var(--panel-border)',
                background: isChecked ? (opt.color || 'var(--accent)') : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isChecked && <Check size={10} color="white" strokeWidth={3} />}
            </div>
            <span onClick={() => handleToggle(opt.value)}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
});

/** プルダウン */
const SelectDropdown = memo(function SelectDropdown({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = '選択',
}: {
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      style={{
        padding: '6px 10px',
        fontSize: 12,
        border: '1px solid var(--panel-border)',
        borderRadius: 4,
        background: disabled ? 'var(--highlight)' : 'var(--panel)',
        color: disabled ? 'var(--text-muted)' : 'var(--text)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minWidth: 120,
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
});

/** 数値範囲入力 */
const NumberRangeInput = memo(function NumberRangeInput({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  minPlaceholder = '最小',
  maxPlaceholder = '最大',
  prefix = '',
  suffix = '',
}: {
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {prefix && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{prefix}</span>}
      <input
        type="number"
        value={minValue ?? ''}
        onChange={(e) => onMinChange(e.target.value ? parseFloat(e.target.value) : null)}
        placeholder={minPlaceholder}
        style={{
          width: 70,
          padding: '6px 8px',
          fontSize: 12,
          border: '1px solid var(--panel-border)',
          borderRadius: 4,
          background: 'var(--panel)',
          color: 'var(--text)',
        }}
      />
      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>〜</span>
      <input
        type="number"
        value={maxValue ?? ''}
        onChange={(e) => onMaxChange(e.target.value ? parseFloat(e.target.value) : null)}
        placeholder={maxPlaceholder}
        style={{
          width: 70,
          padding: '6px 8px',
          fontSize: 12,
          border: '1px solid var(--panel-border)',
          borderRadius: 4,
          background: 'var(--panel)',
          color: 'var(--text)',
        }}
      />
      {suffix && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{suffix}</span>}
    </div>
  );
});

/** テキスト入力 */
const TextInput = memo(function TextInput({
  value,
  onChange,
  placeholder = '',
}: {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
      placeholder={placeholder}
      style={{
        padding: '6px 10px',
        fontSize: 12,
        border: '1px solid var(--panel-border)',
        borderRadius: 4,
        background: 'var(--panel)',
        color: 'var(--text)',
        minWidth: 150,
      }}
    />
  );
});

/** フィルターラベル付き行 */
const FilterRow = memo(function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 12, 
      marginBottom: 10,
    }}>
      <span style={{ 
        fontSize: 11, 
        color: 'var(--text-muted)', 
        minWidth: 80,
        flexShrink: 0,
      }}>
        {label}
      </span>
      {children}
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export const N3GlobalFilterBar = memo(function N3GlobalFilterBar({
  filters,
  onFiltersChange,
  onApply,
}: N3GlobalFilterBarProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.searchQuery);
  
  // L1-L3属性オプション（API連動）
  const [l1Options, setL1Options] = useState<string[]>([]);
  const [l2Options, setL2Options] = useState<string[]>([]);
  const [l3Options, setL3Options] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  // アクティブフィルター数
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.storageLocation) count++;
    if (filters.attrL1) count++;
    if (filters.attrL2) count++;
    if (filters.attrL3) count++;
    if (filters.stockMin !== null || filters.stockMax !== null) count++;
    if (filters.productType.length) count++;
    if (filters.account.length) count++;
    if (filters.searchQuery) count++;
    if (filters.costMin !== null || filters.costMax !== null) count++;
    if (filters.priceUsdMin !== null || filters.priceUsdMax !== null) count++;
    if (filters.profitMarginMin !== null || filters.profitMarginMax !== null) count++;
    if (filters.pricingType.length) count++;
    if (filters.category) count++;
    if (filters.originCountry) count++;
    if (filters.material) count++;
    if (filters.source) count++;
    if (filters.htsCode) count++;
    if (filters.htsDutyRateMin !== null || filters.htsDutyRateMax !== null) count++;
    if (filters.listingScoreMin !== null || filters.listingScoreMax !== null) count++;
    if (filters.shippingMethod) count++;
    return count;
  }, [filters]);

  // アクティブフィルターのバッジ表示用
  const activeBadges = useMemo(() => {
    const badges: { label: string; color: string }[] = [];
    if (filters.storageLocation) badges.push({ label: `場所:${filters.storageLocation}`, color: '#6366f1' });
    if (filters.productType.length) badges.push({ label: filters.productType.map(t => t === 'stock' ? '有在庫' : '無在庫').join('/'), color: '#22c55e' });
    if (filters.account.length) badges.push({ label: filters.account.join('/'), color: '#3b82f6' });
    if (filters.category) badges.push({ label: `Cat:${filters.category.slice(0,10)}`, color: '#f59e0b' });
    if (filters.originCountry) badges.push({ label: `国:${filters.originCountry}`, color: '#8b5cf6' });
    if (filters.pricingType.length) badges.push({ label: `Pricing:${filters.pricingType.join('/')}`, color: '#ef4444' });
    if (filters.listingScoreMin !== null || filters.listingScoreMax !== null) {
      badges.push({ label: `Score:${filters.listingScoreMin ?? 0}-${filters.listingScoreMax ?? 100}`, color: '#14b8a6' });
    }
    return badges.slice(0, 4); // 最大4つまで表示
  }, [filters]);

  // L1オプションを取得
  useEffect(() => {
    const fetchL1Options = async () => {
      try {
        const res = await fetch('/api/inventory/attribute-options');
        const data = await res.json();
        if (data.success) {
          setL1Options(data.l1Options || []);
        }
      } catch (err) {
        console.error('[N3GlobalFilterBar] Failed to fetch L1 options:', err);
      }
    };
    fetchL1Options();
  }, []);

  // L1選択時にL2オプションを取得
  useEffect(() => {
    if (!filters.attrL1) {
      setL2Options([]);
      setL3Options([]);
      return;
    }
    const fetchL2Options = async () => {
      try {
        const res = await fetch(`/api/inventory/attribute-options?l1=${encodeURIComponent(filters.attrL1!)}`);
        const data = await res.json();
        if (data.success) {
          setL2Options(data.l2Options || []);
        }
      } catch (err) {
        console.error('[N3GlobalFilterBar] Failed to fetch L2 options:', err);
      }
    };
    fetchL2Options();
  }, [filters.attrL1]);

  // L2選択時にL3オプションを取得
  useEffect(() => {
    if (!filters.attrL1 || !filters.attrL2) {
      setL3Options([]);
      return;
    }
    const fetchL3Options = async () => {
      try {
        const res = await fetch(`/api/inventory/attribute-options?l1=${encodeURIComponent(filters.attrL1!)}&l2=${encodeURIComponent(filters.attrL2!)}`);
        const data = await res.json();
        if (data.success) {
          setL3Options(data.l3Options || []);
        }
      } catch (err) {
        console.error('[N3GlobalFilterBar] Failed to fetch L3 options:', err);
      }
    };
    fetchL3Options();
  }, [filters.attrL1, filters.attrL2]);

  // フィルター更新
  const updateFilter = useCallback((key: keyof GlobalFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // L1変更時はL2, L3をクリア
    if (key === 'attrL1') {
      newFilters.attrL2 = null;
      newFilters.attrL3 = null;
    }
    // L2変更時はL3をクリア
    if (key === 'attrL2') {
      newFilters.attrL3 = null;
    }
    
    onFiltersChange(newFilters);
  }, [filters, onFiltersChange]);

  // 検索実行
  const handleSearch = useCallback(() => {
    updateFilter('searchQuery', searchInput);
  }, [searchInput, updateFilter]);

  // リセット
  const handleReset = useCallback(() => {
    setSearchInput('');
    onFiltersChange(DEFAULT_FILTER_STATE);
  }, [onFiltersChange]);

  // 適用
  const handleApply = useCallback(() => {
    setIsPanelOpen(false);
    onApply?.();
  }, [onApply]);

  return (
    <div style={{ position: 'relative', zIndex: 50 }}>
      {/* メインバー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          background: 'var(--highlight)',
          borderBottom: '1px solid var(--panel-border)',
          minHeight: 36,
        }}
      >
        {/* フィルターボタン */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            background: activeCount > 0 ? 'var(--accent)' : 'var(--panel)',
            color: activeCount > 0 ? 'white' : 'var(--text)',
            border: '1px solid var(--panel-border)',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 500,
          }}
        >
          <Filter size={14} />
          <span>絞込</span>
          {activeCount > 0 && (
            <span style={{
              background: 'white',
              color: 'var(--accent)',
              padding: '1px 6px',
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 700,
            }}>
              {activeCount}
            </span>
          )}
        </button>

        {/* 検索バー */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--panel)',
            borderRadius: 4,
            padding: '0 8px',
            border: '1px solid var(--panel-border)',
          }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="SKU, タイトルで検索..."
            style={{
              width: 180,
              padding: '5px 8px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 12,
              color: 'var(--text)',
            }}
          />
          {searchInput && (
            <X
              size={14}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => {
                setSearchInput('');
                updateFilter('searchQuery', '');
              }}
            />
          )}
        </div>

        {/* アクティブフィルター表示 */}
        {activeBadges.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {activeBadges.map((badge, i) => (
              <span 
                key={i}
                style={{ 
                  padding: '2px 8px', 
                  background: badge.color, 
                  color: 'white', 
                  borderRadius: 10, 
                  fontSize: 10,
                  fontWeight: 500,
                }}
              >
                {badge.label}
              </span>
            ))}
            {activeCount > activeBadges.length && (
              <span style={{ 
                padding: '2px 8px', 
                background: 'var(--text-muted)', 
                color: 'white', 
                borderRadius: 10, 
                fontSize: 10,
              }}>
                +{activeCount - activeBadges.length}
              </span>
            )}
          </div>
        )}

        {/* スペーサー */}
        <div style={{ flex: 1 }} />

        {/* リセットボタン */}
        {activeCount > 0 && (
          <button
            onClick={handleReset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              background: 'transparent',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: 11,
            }}
          >
            <RotateCcw size={12} />
            リセット
          </button>
        )}
      </div>

      {/* フィルターパネル（モーダル） */}
      {isPanelOpen && (
        <>
          {/* 背景オーバーレイ */}
          <div
            onClick={() => setIsPanelOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 9998,
            }}
          />
          
          {/* パネル */}
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%',
              maxWidth: 1200,
              maxHeight: '80vh',
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: 8,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ヘッダー */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid var(--panel-border)',
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                フィルター設定
              </div>
              <button
                onClick={() => setIsPanelOpen(false)}
                style={{
                  width: 28,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--highlight)',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* コンテンツ */}
            <div style={{ 
              padding: '16px 24px',
            }}>
              {/* 3カラムレイアウト */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
                {/* 左カラム */}
                <div>
                  {/* 基本 */}
                  <CollapsibleSection icon={MapPin} label="基本">
                    <FilterRow label="保管場所">
                      <RadioGroup
                        options={STORAGE_OPTIONS}
                        value={filters.storageLocation}
                        onChange={(v) => updateFilter('storageLocation', v)}
                      />
                    </FilterRow>
                    <FilterRow label="在庫数">
                      <NumberRangeInput
                        minValue={filters.stockMin}
                        maxValue={filters.stockMax}
                        onMinChange={(v) => updateFilter('stockMin', v)}
                        onMaxChange={(v) => updateFilter('stockMax', v)}
                        minPlaceholder="0"
                        maxPlaceholder="∞"
                      />
                    </FilterRow>
                    <FilterRow label="商品タイプ">
                      <CheckboxGroup
                        options={PRODUCT_TYPE_OPTIONS}
                        values={filters.productType}
                        onChange={(v) => updateFilter('productType', v)}
                      />
                    </FilterRow>
                    <FilterRow label="アカウント">
                      <CheckboxGroup
                        options={ACCOUNT_OPTIONS}
                        values={filters.account}
                        onChange={(v) => updateFilter('account', v)}
                      />
                    </FilterRow>
                  </CollapsibleSection>

                  {/* 属性L1-L3 */}
                  <CollapsibleSection icon={Layers} label="属性（L1-L3）" defaultOpen={false}>
                    <FilterRow label="L1属性">
                      <SelectDropdown
                        value={filters.attrL1}
                        options={l1Options.map(o => ({ value: o, label: o }))}
                        onChange={(v) => updateFilter('attrL1', v)}
                        placeholder="L1を選択"
                      />
                    </FilterRow>
                    <FilterRow label="L2属性">
                      <SelectDropdown
                        value={filters.attrL2}
                        options={l2Options.map(o => ({ value: o, label: o }))}
                        onChange={(v) => updateFilter('attrL2', v)}
                        disabled={!filters.attrL1}
                        placeholder={!filters.attrL1 ? 'L1を先に選択' : 'L2を選択'}
                      />
                    </FilterRow>
                    <FilterRow label="L3属性">
                      <SelectDropdown
                        value={filters.attrL3}
                        options={l3Options.map(o => ({ value: o, label: o }))}
                        onChange={(v) => updateFilter('attrL3', v)}
                        disabled={!filters.attrL2}
                        placeholder={!filters.attrL2 ? 'L2を先に選択' : 'L3を選択'}
                      />
                    </FilterRow>
                  </CollapsibleSection>

                </div>

                {/* 中央カラム */}
                <div>
                  {/* 分類・属性 */}
                  <CollapsibleSection icon={Tag} label="分類・属性">
                    <FilterRow label="仕入先">
                      <SelectDropdown
                        value={filters.source}
                        options={SOURCE_OPTIONS}
                        onChange={(v) => updateFilter('source', v)}
                        placeholder="仕入先"
                      />
                    </FilterRow>
                    <FilterRow label="原産国">
                      <SelectDropdown
                        value={filters.originCountry}
                        options={ORIGIN_COUNTRY_OPTIONS}
                        onChange={(v) => updateFilter('originCountry', v)}
                        placeholder="原産国"
                      />
                    </FilterRow>
                    <FilterRow label="素材">
                      <TextInput
                        value={filters.material}
                        onChange={(v) => updateFilter('material', v)}
                        placeholder="例: プラスチック"
                      />
                    </FilterRow>
                  </CollapsibleSection>

                  {/* 価格・原価 */}
                  <CollapsibleSection icon={DollarSign} label="価格・原価">
                    <FilterRow label="仕入れ値">
                      <NumberRangeInput
                        minValue={filters.costMin}
                        maxValue={filters.costMax}
                        onMinChange={(v) => updateFilter('costMin', v)}
                        onMaxChange={(v) => updateFilter('costMax', v)}
                        prefix="¥"
                      />
                    </FilterRow>
                    <FilterRow label="販売価格">
                      <NumberRangeInput
                        minValue={filters.priceUsdMin}
                        maxValue={filters.priceUsdMax}
                        onMinChange={(v) => updateFilter('priceUsdMin', v)}
                        onMaxChange={(v) => updateFilter('priceUsdMax', v)}
                        prefix="$"
                      />
                    </FilterRow>
                    <FilterRow label="利益率">
                      <NumberRangeInput
                        minValue={filters.profitMarginMin}
                        maxValue={filters.profitMarginMax}
                        onMinChange={(v) => updateFilter('profitMarginMin', v)}
                        onMaxChange={(v) => updateFilter('profitMarginMax', v)}
                        suffix="%"
                      />
                    </FilterRow>
                    <FilterRow label="Pricing種類">
                      <CheckboxGroup
                        options={PRICING_TYPE_OPTIONS}
                        values={filters.pricingType}
                        onChange={(v) => updateFilter('pricingType', v)}
                      />
                    </FilterRow>
                  </CollapsibleSection>

                </div>

                {/* 右カラム */}
                <div>
                  {/* 関税・HTS */}
                  <CollapsibleSection icon={Globe} label="関税・HTS">
                    <FilterRow label="HTSコード">
                      <TextInput
                        value={filters.htsCode}
                        onChange={(v) => updateFilter('htsCode', v)}
                        placeholder="例: 9503.00"
                      />
                    </FilterRow>
                    <FilterRow label="HTS関税率">
                      <NumberRangeInput
                        minValue={filters.htsDutyRateMin}
                        maxValue={filters.htsDutyRateMax}
                        onMinChange={(v) => updateFilter('htsDutyRateMin', v)}
                        onMaxChange={(v) => updateFilter('htsDutyRateMax', v)}
                        suffix="%"
                      />
                    </FilterRow>
                  </CollapsibleSection>

                  {/* スコア・配送 */}
                  <CollapsibleSection icon={BarChart3} label="スコア・配送">
                    <FilterRow label="Listing Score">
                      <NumberRangeInput
                        minValue={filters.listingScoreMin}
                        maxValue={filters.listingScoreMax}
                        onMinChange={(v) => updateFilter('listingScoreMin', v)}
                        onMaxChange={(v) => updateFilter('listingScoreMax', v)}
                        minPlaceholder="0"
                        maxPlaceholder="100"
                      />
                    </FilterRow>
                    <FilterRow label="配送方法">
                      <SelectDropdown
                        value={filters.shippingMethod}
                        options={SHIPPING_METHOD_OPTIONS}
                        onChange={(v) => updateFilter('shippingMethod', v)}
                        placeholder="配送方法"
                      />
                    </FilterRow>
                  </CollapsibleSection>
                </div>
              </div>
            </div>

            {/* フッター */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderTop: '1px solid var(--panel-border)',
                background: 'var(--highlight)',
                flexShrink: 0,
              }}
            >
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 4,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                リセット
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--panel)',
                    border: '1px solid var(--panel-border)',
                    borderRadius: 4,
                    color: 'var(--text)',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  キャンセル
                </button>
                <button
                  onClick={handleApply}
                  style={{
                    padding: '8px 24px',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: 4,
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  適用
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
});

export default N3GlobalFilterBar;
