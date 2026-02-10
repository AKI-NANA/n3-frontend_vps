// app/tools/operations-n3/hooks/index.ts
/**
 * Operations N3 - カスタムフック
 */

// ゴールドスタンダード統合フック（推奨）
export { useOperationsIntegrated } from './use-operations-integrated';

// レガシーフック（後方互換用）
export { useOperationsData } from './use-operations-data';
export type { UseOperationsDataOptions, UseOperationsDataReturn } from './use-operations-data';

export { useLinkedData } from './use-linked-data';
export type { LinkedDataType, UseLinkedDataOptions, UseLinkedDataReturn } from './use-linked-data';
