// app/tools/listing-n3/extension-slot/index.tsx
/**
 * 🔌 Listing Extension Slot
 * 
 * Phase 2B - listing-n3 への機能統合用スロット
 * 
 * ⚠️ ルール:
 * - Dispatch API経由のみ
 * - 独立state（既存hooks/store/contextに依存しない）
 * - 既存出品機能に影響しない
 */

'use client';

import dynamic from 'next/dynamic';

// Dynamic imports for extension slot components
export const AutoListingPanel = dynamic(
  () => import('./auto-listing-panel').then(m => ({ default: m.AutoListingPanel })),
  { ssr: false }
);

export const QueueMonitorPanel = dynamic(
  () => import('./queue-monitor-panel').then(m => ({ default: m.QueueMonitorPanel })),
  { ssr: false }
);

export const ErrorRecoveryPanel = dynamic(
  () => import('./error-recovery-panel').then(m => ({ default: m.ErrorRecoveryPanel })),
  { ssr: false }
);

export const BatchExecutePanel = dynamic(
  () => import('./batch-execute-panel').then(m => ({ default: m.BatchExecutePanel })),
  { ssr: false }
);
