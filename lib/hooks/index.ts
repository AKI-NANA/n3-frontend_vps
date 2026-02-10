// lib/hooks/index.ts
/**
 * N3 Custom Hooks - エクスポート
 */

// Dispatch (Phase Final Fix)
export { useDispatch, type UseDispatchOptions, type UseDispatchReturn } from './use-dispatch';

// n8n Webhook
export { 
  useN8nWebhook,
  useAuditCheck,
  useShippingUnified,
  useResearchAgent,
  useGlobalProfitCalc,
} from './useN8nWebhook';

// 監査ステータス
export { 
  useAuditStatus,
  useAuditStatusBatch,
  type AuditStatus,
} from './useAuditStatus';

// Supabase Realtime
export {
  useSupabaseRealtime,
  useOrdersRealtime,
  useInventoryRealtime,
  useAdminTasksRealtime,
  useResearchResultsRealtime,
  useProductsRealtime,
} from './useSupabaseRealtime';
