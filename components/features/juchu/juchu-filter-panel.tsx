'use client';

import React, { memo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import {
  N3PanelHeader,
  N3SearchInput,
  N3Select,
  N3DateRangePicker,
  N3Button,
  N3Tag,
} from '@/components/n3';

// ============================================================
// JuchuFilterPanel - Container Component
// ============================================================
// 受注検索・フィルターパネル
// N3Input, N3Select, N3DateRangePickerを組み合わせ
// ============================================================

export interface JuchuFilters {
  searchQuery: string;
  dateFrom: string;
  dateTo: string;
  channel: string;
  status: string;
  paymentStatus: string;
  country: string;
}

export interface JuchuFilterPanelProps {
  filters: JuchuFilters;
  onFiltersChange: (filters: JuchuFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  className?: string;
}

const channelOptions = [
  { value: '', label: '全てのチャネル' },
  { value: 'ebay', label: 'eBay' },
  { value: 'shopee', label: 'Shopee' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'shopify', label: 'Shopify' },
];

const statusOptions = [
  { value: '', label: '全てのステータス' },
  { value: 'new', label: '新規注文' },
  { value: 'paid', label: '支払い完了' },
  { value: 'processing', label: '処理中' },
  { value: 'shipped', label: '出荷済み' },
  { value: 'delivered', label: '配送完了' },
];

const paymentOptions = [
  { value: '', label: '全ての支払い状況' },
  { value: 'pending', label: '支払い待ち' },
  { value: 'completed', label: '支払い完了' },
  { value: 'failed', label: '支払い失敗' },
];

const countryOptions = [
  { value: '', label: '全ての国' },
  { value: 'US', label: 'アメリカ' },
  { value: 'UK', label: 'イギリス' },
  { value: 'DE', label: 'ドイツ' },
  { value: 'AU', label: 'オーストラリア' },
  { value: 'CA', label: 'カナダ' },
];

export const JuchuFilterPanel = memo(function JuchuFilterPanel({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  className = '',
}: JuchuFilterPanelProps) {
  const updateFilter = useCallback(
    <K extends keyof JuchuFilters>(key: K, value: JuchuFilters[K]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const activeFilters = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'searchQuery'
  );

  const removeFilter = useCallback(
    (key: keyof JuchuFilters) => {
      onFiltersChange({ ...filters, [key]: '' });
    },
    [filters, onFiltersChange]
  );

  return (
    <div className={`juchu-filter-panel ${className}`}>
      <N3PanelHeader
        title="受注検索・フィルター"
        icon={Search}
        variant="primary"
        compact
      />

      <div className="juchu-filter-panel__search">
        <N3SearchInput
          value={filters.searchQuery}
          onValueChange={(v) => updateFilter('searchQuery', v)}
          placeholder="注文ID・商品名・顧客名で検索..."
        />
      </div>

      <div className="juchu-filter-panel__content">
        <div className="juchu-filter-panel__group">
          <div className="juchu-filter-panel__group-title">期間設定</div>
          <N3DateRangePicker
            from={filters.dateFrom}
            to={filters.dateTo}
            onFromChange={(v) => updateFilter('dateFrom', v)}
            onToChange={(v) => updateFilter('dateTo', v)}
            fromLabel=""
            toLabel=""
            size="sm"
            vertical
          />
        </div>

        <div className="juchu-filter-panel__group">
          <div className="juchu-filter-panel__group-title">販売チャネル</div>
          <N3Select
            value={filters.channel}
            onValueChange={(v) => updateFilter('channel', v)}
            options={channelOptions}
            size="sm"
          />
        </div>

        <div className="juchu-filter-panel__group">
          <div className="juchu-filter-panel__group-title">注文ステータス</div>
          <N3Select
            value={filters.status}
            onValueChange={(v) => updateFilter('status', v)}
            options={statusOptions}
            size="sm"
          />
        </div>

        <div className="juchu-filter-panel__group">
          <div className="juchu-filter-panel__group-title">支払い状況</div>
          <N3Select
            value={filters.paymentStatus}
            onValueChange={(v) => updateFilter('paymentStatus', v)}
            options={paymentOptions}
            size="sm"
          />
        </div>

        <div className="juchu-filter-panel__group">
          <div className="juchu-filter-panel__group-title">配送先国</div>
          <N3Select
            value={filters.country}
            onValueChange={(v) => updateFilter('country', v)}
            options={countryOptions}
            size="sm"
          />
        </div>

        {activeFilters.length > 0 && (
          <div className="juchu-filter-panel__tags">
            {activeFilters.map(([key, value]) => (
              <N3Tag
                key={key}
                onClose={() => removeFilter(key as keyof JuchuFilters)}
              >
                {value as string}
              </N3Tag>
            ))}
          </div>
        )}
      </div>

      <div className="juchu-filter-panel__actions">
        <N3Button variant="primary" size="sm" onClick={onApplyFilters}>
          <Search size={14} />
          検索
        </N3Button>
        <N3Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X size={14} />
          クリア
        </N3Button>
      </div>
    </div>
  );
});

JuchuFilterPanel.displayName = 'JuchuFilterPanel';

export default JuchuFilterPanel;
