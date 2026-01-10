// lib/n8n/workflows/index.ts
/**
 * n8nワークフローエクスポート
 */

export * from './listing-workflows';
export * from './inventory-workflows';
export * from './research-workflows';
export * from './automation-workflows';

// 統合エクスポート
import { listingWorkflows } from './listing-workflows';
import { inventoryWorkflows } from './inventory-workflows';
import { researchWorkflows } from './research-workflows';
import { automationWorkflows } from './automation-workflows';

export const n8nWorkflows = {
  listing: listingWorkflows,
  inventory: inventoryWorkflows,
  research: researchWorkflows,
  automation: automationWorkflows,
};
