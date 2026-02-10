// app/tools/research-n3/page.tsx
/**
 * Research N3 Page - リサーチHub統合ページ
 * 
 * Phase 4.5 + Final Fix:
 * - N3WorkspaceLayout 適用
 * - Amazon Research を component mount
 * - dispatch 経由で実行
 * - ExecutionHistoryPanel 追加
 * 
 * Tab構成:
 * - Amazon Research (主力)
 * - eBay Research (将来)
 * - AI Research (将来)
 * - Market Score (将来)
 */

'use client';

import React, { useState, Suspense, memo } from 'react';
import {
  Package, ShoppingCart, Bot, Target, Loader2,
  Sparkles, Search, History,
} from 'lucide-react';
import { N3WorkspaceLayout, type L2Tab } from '@/components/layouts';
import { ToolExecutionPanel, ExecutionHistoryPanel } from '@/components/tools';

// Amazon Research の中核コンポーネントをインポート
import { AmazonResearchN3PageLayout } from '@/app/tools/amazon-research-n3/components';

// ============================================================
// タブ定義
// ============================================================

const RESEARCH_TABS: L2Tab[] = [
  { id: 'amazon', label: 'Amazon', labelEn: 'Amazon', icon: Package, color: '#FF9900' },
  { id: 'ebay', label: 'eBay', labelEn: 'eBay', icon: ShoppingCart, color: '#0064D2' },
  { id: 'ai_research', label: 'AIリサーチ', labelEn: 'AI Research', icon: Sparkles, color: '#8B5CF6' },
  { id: 'market_score', label: '市場スコア', labelEn: 'Market Score', icon: Target, color: '#10B981' },
  { id: 'tools', label: 'ツール', labelEn: 'Tools', icon: Search, color: '#6B7280' },
  { id: 'history', label: '履歴', labelEn: 'History', icon: History, color: '#F59E0B' },
];

// ============================================================
// サブコンポーネント
// ============================================================

const LoadingFallback = memo(function LoadingFallback({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 400,
        color: 'var(--text-muted)',
      }}
    >
      <Loader2 size={32} className="animate-spin" style={{ marginBottom: 12 }} />
      <span style={{ fontSize: 14 }}>{label}を読み込み中...</span>
    </div>
  );
});

const ComingSoonPanel = memo(function ComingSoonPanel({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: 400,
        background: 'var(--panel)',
        borderRadius: 12,
        margin: 16,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <Icon size={40} color={color} />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
        {label}
      </h3>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Coming Soon</p>
      <span
        style={{
          padding: '6px 16px',
          borderRadius: 20,
          background: 'var(--panel-border)',
          color: 'var(--text-muted)',
          fontSize: 12,
        }}
      >
        開発中
      </span>
    </div>
  );
});

const ToolsTabContent = memo(function ToolsTabContent() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
          Research Tools
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          n8n ワークフローを直接実行できます。dispatch API 経由で処理されます。
        </p>
        <ToolExecutionPanel category="research" />
      </div>
      
      {/* 実行履歴 */}
      <ExecutionHistoryPanel 
        toolIdPrefix="amazon" 
        title="Amazon Research History"
        limit={20}
        autoRefreshInterval={10000}
      />
    </div>
  );
});

const HistoryTabContent = memo(function HistoryTabContent() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>
        実行履歴
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        すべてのリサーチ実行の履歴を表示します。
      </p>
      
      {/* 全Research履歴 */}
      <ExecutionHistoryPanel 
        title="All Research Executions"
        limit={50}
        autoRefreshInterval={10000}
      />
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export default function ResearchN3Page() {
  const [activeTab, setActiveTab] = useState('amazon');
  
  // ツールバー
  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* コンパクトな実行状態表示 */}
      <ExecutionHistoryPanel 
        toolIdPrefix="amazon" 
        compact 
        autoRefreshInterval={5000}
      />
    </div>
  );

  return (
    <N3WorkspaceLayout
      title="Sourcing"
      subtitle="Product Research Hub"
      tabs={RESEARCH_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      toolbar={toolbar}
    >
      {/* Amazon Research - 完成済み */}
      {activeTab === 'amazon' && (
        <Suspense fallback={<LoadingFallback label="Amazon Research" />}>
          <div style={{ height: '100%', overflow: 'hidden' }}>
            <AmazonResearchN3PageLayout />
          </div>
        </Suspense>
      )}

      {/* eBay Research - 将来実装 */}
      {activeTab === 'ebay' && (
        <ComingSoonPanel icon={ShoppingCart} label="eBay Research" color="#0064D2" />
      )}

      {/* AI Research - 将来実装 */}
      {activeTab === 'ai_research' && (
        <ComingSoonPanel icon={Sparkles} label="AI Research" color="#8B5CF6" />
      )}

      {/* Market Score - 将来実装 */}
      {activeTab === 'market_score' && (
        <ComingSoonPanel icon={Target} label="Market Score" color="#10B981" />
      )}

      {/* Tools - n8n実行 */}
      {activeTab === 'tools' && <ToolsTabContent />}

      {/* History - 実行履歴 */}
      {activeTab === 'history' && <HistoryTabContent />}
    </N3WorkspaceLayout>
  );
}
