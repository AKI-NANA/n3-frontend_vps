// app/tools/research-hub/page.tsx
/**
 * 🔍 Research Hub - リサーチ統合母艦
 * 
 * 全リサーチツールを統合
 * - Amazon Research（母艦）
 * - eBay Research
 * - Trend Analysis
 * - Arbitrage Scan
 * - Batch Research
 */

'use client';

import React from 'react';
import { Search, TrendingUp, Shuffle, Layers, ShoppingBag } from 'lucide-react';
import { BaseHubLayout, HubTool } from '@/components/n3/empire/base-hub-layout';

// ツールコンポーネント
import { AmazonSearchTool } from './tools/amazon-search-tool';
import { TrendAnalyzeTool } from './tools/trend-analyze-tool';
import { ArbitrageScanTool } from './tools/arbitrage-scan-tool';
import { BatchResearchTool } from './tools/batch-research-tool';
import { EbayResearchTool } from './tools/ebay-research-tool';

// ============================================================
// Hub Tools Definition
// ============================================================

const RESEARCH_TOOLS: HubTool[] = [
  {
    id: 'research-amazon-search',
    name: 'Amazon Research',
    nameEn: 'Amazon Research',
    description: 'Amazon商品検索・価格調査',
    icon: <ShoppingBag className="w-4 h-4" />,
    component: <AmazonSearchTool />,
    requiresJob: true,
    category: 'research',
  },
  {
    id: 'research-ebay-search',
    name: 'eBay Research',
    nameEn: 'eBay Research',
    description: 'eBay商品検索・競合分析',
    icon: <Search className="w-4 h-4" />,
    component: <EbayResearchTool />,
    requiresJob: true,
    category: 'research',
  },
  {
    id: 'research-trend-analyze',
    name: 'Trend Analysis',
    nameEn: 'Trend Analysis',
    description: 'AIトレンド分析・市場予測',
    icon: <TrendingUp className="w-4 h-4" />,
    component: <TrendAnalyzeTool />,
    requiresJob: true,
    category: 'research',
  },
  {
    id: 'research-arbitrage-scan',
    name: 'Arbitrage Scan',
    nameEn: 'Arbitrage Scan',
    description: '国際価格差・アービトラージ検出',
    icon: <Shuffle className="w-4 h-4" />,
    component: <ArbitrageScanTool />,
    requiresJob: true,
    category: 'research',
  },
  {
    id: 'research-batch',
    name: 'Batch Research',
    nameEn: 'Batch Research',
    description: 'バッチリサーチ・一括処理',
    icon: <Layers className="w-4 h-4" />,
    component: <BatchResearchTool />,
    requiresJob: true,
    category: 'research',
  },
];

// ============================================================
// Research Hub Page
// ============================================================

export default function ResearchHubPage() {
  return (
    <BaseHubLayout
      title="Research Hub"
      titleEn="Research Hub"
      description="全リサーチツールを統合した母艦。Amazon/eBay検索、トレンド分析、アービトラージ検出を一括管理。"
      icon={<Search className="w-6 h-6" />}
      tools={RESEARCH_TOOLS}
      defaultTool="research-amazon-search"
      showJobMonitor={true}
    />
  );
}
