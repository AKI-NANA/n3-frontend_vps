// Research N3 - Hooks
/**
 * ゴールドスタンダード準拠
 * - useResearchIntegrated: React Query + Zustand 統合フック（推奨）
 * - 既存フックは後方互換用に残す
 */

// ゴールドスタンダード統合フック（推奨）
export { useResearchIntegrated } from './use-research-integrated';

// レガシーフック（後方互換用）
export { useResearchData } from '@/app/tools/research-table/hooks/use-research-data';
export { useKaritoriActions } from '@/app/tools/research-table/hooks/use-karitori-actions';
export { useResearchActions } from '@/app/tools/research-table/hooks/use-research-actions';
export { useShippingCalculation } from '@/app/tools/research-table/hooks/use-shipping-calculation';
