// app/tools/listing-hub/page.tsx
/**
 * 🚀 Listing Hub - 出品統合母艦
 * 
 * 全出品ツールを統合
 * - Multi-Platform（母艦）
 * - Queue（出品キュー管理）
 * - History（出品履歴）
 * - Error Recovery（エラー復旧）
 */

'use client';

import React from 'react';
import { Rocket, List, Clock, AlertTriangle, Globe } from 'lucide-react';
import { BaseHubLayout, HubTool } from '@/components/n3/empire/base-hub-layout';

// ツールコンポーネント
import { MultiPlatformTool } from './tools/multi-platform-tool';
import { QueueTool } from './tools/queue-tool';
import { HistoryTool } from './tools/history-tool';
import { ErrorRecoveryTool } from './tools/error-recovery-tool';

// ============================================================
// Hub Tools Definition
// ============================================================

const LISTING_TOOLS: HubTool[] = [
  {
    id: 'listing-multi-platform',
    name: 'Multi-Platform',
    nameEn: 'Multi-Platform Listing',
    description: '複数マーケットプレイスへの同時出品',
    icon: <Globe className="w-4 h-4" />,
    component: <MultiPlatformTool />,
    requiresJob: false,
    category: 'listing',
  },
  {
    id: 'listing-queue',
    name: 'Queue',
    nameEn: 'Listing Queue',
    description: '出品キュー管理・スケジュール',
    icon: <List className="w-4 h-4" />,
    component: <QueueTool />,
    requiresJob: false,
    category: 'listing',
  },
  {
    id: 'listing-history',
    name: 'History',
    nameEn: 'Listing History',
    description: '出品履歴・ステータス確認',
    icon: <Clock className="w-4 h-4" />,
    component: <HistoryTool />,
    requiresJob: false,
    category: 'listing',
  },
  {
    id: 'listing-error-recovery',
    name: 'Error Recovery',
    nameEn: 'Error Recovery',
    description: '出品エラーの自動復旧',
    icon: <AlertTriangle className="w-4 h-4" />,
    component: <ErrorRecoveryTool />,
    requiresJob: true,
    category: 'listing',
  },
];

// ============================================================
// Listing Hub Page
// ============================================================

export default function ListingHubPage() {
  return (
    <BaseHubLayout
      title="Listing Hub"
      titleEn="Listing Hub"
      description="全出品ツールを統合した母艦。eBay/Amazon/Qoo10/Shopifyへの出品、キュー管理、エラー復旧を一括管理。"
      icon={<Rocket className="w-6 h-6" />}
      tools={LISTING_TOOLS}
      defaultTool="listing-multi-platform"
      showJobMonitor={true}
    />
  );
}
