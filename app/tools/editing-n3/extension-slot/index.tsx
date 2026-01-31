// app/tools/editing-n3/extension-slot/index.tsx
/**
 * 🔌 Editing Extension Slot (Inventory AI)
 * 
 * Phase 2B-③ - editing-n3 への機能統合用スロット
 * 
 * ⚠️ 絶対ルール:
 * - Dispatch API経由のみ（n8n直叩き禁止）
 * - 独立state（既存hooks/store/contextに依存しない）
 * - 既存在庫編集機能に影響しない
 * - UI追加はSlot内限定
 */

'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for extension slot components (lazy load)
export const InventorySyncPanel = dynamic(
  () => import('./inventory-sync-panel').then(m => ({ default: m.InventorySyncPanel })),
  { ssr: false }
);

export const StockHealthPanel = dynamic(
  () => import('./stock-health-panel').then(m => ({ default: m.StockHealthPanel })),
  { ssr: false }
);

export const BulkAdjustPanel = dynamic(
  () => import('./bulk-adjust-panel').then(m => ({ default: m.BulkAdjustPanel })),
  { ssr: false }
);

export const AlertMonitorPanel = dynamic(
  () => import('./alert-monitor-panel').then(m => ({ default: m.AlertMonitorPanel })),
  { ssr: false }
);
