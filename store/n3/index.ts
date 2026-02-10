// store/n3/index.ts
/**
 * N3 UI Stores エクスポート
 *
 * 各N3ページ用のUI状態管理ストア
 * ゴールドスタンダード準拠: サーバーデータはReact Queryで管理
 */

// Listing N3
export {
  useListingUIStore,
  useListingActiveTab,
  useListingCurrentPage,
  useListingPageSize,
  useListingFilters,
  useListingSortField,
  useListingSortOrder,
  useListingSelectedIds,
  useListingViewMode,
  useListingShowStats,
  listingUIActions,
  type ListingTabId,
} from './listingUIStore';

// Analytics N3
export {
  useAnalyticsUIStore,
  useAnalyticsActiveTab,
  useAnalyticsDateRange,
  useAnalyticsMarketplace,
  useAnalyticsChartType,
  useAnalyticsGranularity,
  useAnalyticsCurrency,
  useAnalyticsComparison,
  type AnalyticsTabId,
  type DateRangePreset,
  type ChartType,
} from './analyticsUIStore';

// Finance N3
export {
  useFinanceUIStore,
  useFinanceActiveTab,
  useFinanceJournalStatus,
  useFinanceJournalPage,
  useFinanceSelectedJournalIds,
  useFinanceExpenseCategory,
  useFinanceKobutsuSearch,
  useFinanceCurrency,
  type FinanceTabId,
  type JournalStatus,
  type ExpenseCategory,
} from './financeUIStore';

// Settings N3
export {
  useSettingsUIStore,
  useSettingsActiveTab,
  useSettingsActiveSection,
  useSettingsHtsSearch,
  useSettingsHtsSelectedCategory,
  useSettingsHasUnsavedChanges,
  useSettingsValidationErrors,
  useSettingsCredentialFilter,
  type SettingsTabId,
  type SettingsSectionId,
} from './settingsUIStore';

// Operations N3
export {
  useOperationsUIStore,
  useOperationsActiveTab,
  useOperationsCurrentPage,
  useOperationsPageSize,
  useOperationsFilters,
  useOperationsSortField,
  useOperationsSortOrder,
  useOperationsSelectedOrderId,
  useOperationsSelectedShippingId,
  useOperationsSelectedInquiryId,
  useOperationsSelectedIds,
  useOperationsViewMode,
  useOperationsShowStats,
  useOperationsShowLinkedPanel,
  operationsUIActions,
} from './operationsUIStore';

// Research N3
export {
  useResearchUIStore,
  useResearchActiveTab,
  useResearchCurrentPage,
  useResearchPageSize,
  useResearchFilters,
  useResearchSortField,
  useResearchSortOrder,
  useResearchSelectedIds,
  useResearchSelectedItemId,
  useResearchViewMode,
  useResearchShowStats,
  useResearchShowProfitCalculator,
  researchUIActions,
} from './researchUIStore';
