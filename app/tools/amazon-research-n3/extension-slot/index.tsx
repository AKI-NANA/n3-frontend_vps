// app/tools/amazon-research-n3/extension-slot/index.tsx
/**
 * 🔌 Research Extension Slot
 * 
 * Phase 2B - amazonrisa-mini への機能統合用スロット
 * 
 * ⚠️ ルール:
 * - Dispatch API経由のみ
 * - 独立state（既存storeに依存しない）
 * - 既存機能に影響しない
 */

export { ResearchAgentPanel } from './research-agent-panel';
export { MarketScorePanel } from './market-score-panel';
export { CompetitorScanPanel } from './competitor-scan-panel';
