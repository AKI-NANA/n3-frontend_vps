// app/tools/listing-n3/hooks/index.ts
/**
 * Listing N3 Hooks エクスポート
 *
 * ゴールドスタンダード:
 * - useListingIntegrated: 統合フック（推奨）- Domain State + UI Stateを連携
 * - 個別フック: 特定機能のみ必要な場合
 */

// 統合フック（推奨）
export { useListingIntegrated, default as useListingIntegratedDefault } from './use-listing-integrated';

// 個別フック（後方互換性・特定機能用）
export { useListingData, default as useListingDataDefault } from './use-listing-data';
export { useSeoOptimization, default as useSeoOptimizationDefault } from './use-seo-optimization';
export { usePricingStrategy, default as usePricingStrategyDefault } from './use-pricing-strategy';
export { useBulkListing, default as useBulkListingDefault } from './use-bulk-listing';
