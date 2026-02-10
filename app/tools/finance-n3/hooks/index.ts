// app/tools/finance-n3/hooks/index.ts
/**
 * Finance N3 Hooks エクスポート
 *
 * ゴールドスタンダード:
 * - useFinanceIntegrated: 統合フック（推奨）- Domain State + UI Stateを連携
 * - 個別フック: 特定機能のみ必要な場合
 */

// 統合フック（推奨）
export { useFinanceIntegrated, default as useFinanceIntegratedDefault } from './use-finance-integrated';

// 個別フック（後方互換性・特定機能用）
export { useFinanceData, default as useFinanceDataDefault } from './use-finance-data';
