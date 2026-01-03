// app/tools/analytics-n3/hooks/index.ts
/**
 * Analytics N3 Hooks エクスポート
 *
 * ゴールドスタンダード:
 * - useAnalyticsIntegrated: 統合フック（推奨）- Domain State + UI Stateを連携
 * - 個別フック: 特定機能のみ必要な場合
 */

// 統合フック（推奨）
export { useAnalyticsIntegrated, default as useAnalyticsIntegratedDefault } from './use-analytics-integrated';

// 個別フック（後方互換性・特定機能用）
export { useAnalyticsData, default as useAnalyticsDataDefault } from './use-analytics-data';
export { useAIMetrics, default as useAIMetricsDefault } from './use-ai-metrics';
