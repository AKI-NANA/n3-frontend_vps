// app/tools/stock-n3/page.tsx
/**
 * N3 Finance - Global Oracle：自律投資OS
 * 
 * N3WorkspaceLayout による UI統一
 * 
 * Tab構成:
 * - Dashboard (市場概要・ポートフォリオ)
 * - Analysis (AI分析・ディベート)
 * - Strategy (戦術書・シミュレーション)
 * - Portfolio (資金管理)
 * - Settings (設定)
 * 
 * n8n Webhooks:
 * - /fin-data-ingest: J-Quantsデータ取得
 * - /fin-context-judge: マクロ環境判定
 * - /fin-strategy-sim: 戦略シミュレーション
 * - /fin-agent-debate: AIエージェントディベート
 * - /fin-tactical-plan: 戦術書生成
 * - /fin-cash-watcher: キャッシュフロー監視
 */

'use client';

import React, { useState, memo } from 'react';
import {
  TrendingUp, TrendingDown, BarChart3, Brain, Target,
  Wallet, Shield, AlertTriangle, RefreshCw, Settings,
  Activity, DollarSign, PieChart, Zap, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { N3WorkspaceLayout, type L2Tab } from '@/components/layouts';

// ============================================================
// タブ定義
// ============================================================

const STOCK_TABS: L2Tab[] = [
  { id: 'dashboard', label: '概要', labelEn: 'Dashboard', icon: BarChart3, color: '#14b8a6' },
  { id: 'analysis', label: '分析', labelEn: 'Analysis', icon: Brain, color: '#8B5CF6' },
  { id: 'strategy', label: '戦術書', labelEn: 'Strategy', icon: Target, color: '#F59E0B' },
  { id: 'portfolio', label: '資金管理', labelEn: 'Portfolio', icon: Wallet, color: '#10B981' },
  { id: 'settings', label: '設定', labelEn: 'Settings', icon: Settings, color: '#6B7280' },
];

// ============================================================
// サブコンポーネント
// ============================================================

const StatCard = memo(function StatCard({
  label,
  value,
  change,
  icon: Icon,
  color = 'var(--text)',
}: {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  color?: string;
}) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div
      style={{
        padding: '16px 20px',
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={16} style={{ color }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      {change && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: isPositive ? '#10B981' : '#EF4444',
            marginTop: 4,
          }}
        >
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      )}
    </div>
  );
});

// ダッシュボードタブ
const DashboardContent = memo(function DashboardContent() {
  // モックデータ
  const marketData = {
    mode: 'CAUTIOUS',
    modeScore: 55,
    usdjpy: 156.2,
    us10y: 4.65,
    envTags: ['円安進行', '高金利継続', '需給:強気', '節分天井警戒'],
  };

  const cashStatus = {
    investable: 1500000,
    maxPerStock: 150000,
    totalReserve: 3800000,
    usdBalance: 5000,
  };

  const watchlist = [
    { code: '7203', name: 'トヨタ自動車', price: 2850, change: 1.6, per: 10.2, signal: 2.3 },
    { code: '6758', name: 'ソニーG', price: 15240, change: -0.8, per: 18.5, signal: 1.8 },
    { code: '9984', name: 'ソフトバンクG', price: 8920, change: 2.1, per: 15.3, signal: 2.1 },
    { code: '8306', name: '三菱UFJ', price: 1680, change: 0.5, per: 12.1, signal: 1.5 },
  ];

  return (
    <div style={{ padding: 16 }}>
      {/* モードステータス */}
      <div
        style={{
          padding: 12,
          background: marketData.mode === 'CAUTIOUS' ? '#F59E0B10' : '#10B98110',
          border: `1px solid ${marketData.mode === 'CAUTIOUS' ? '#F59E0B30' : '#10B98130'}`,
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {marketData.mode === 'CAUTIOUS' ? (
              <AlertTriangle size={18} style={{ color: '#F59E0B' }} />
            ) : (
              <Shield size={18} style={{ color: '#10B981' }} />
            )}
            <span style={{ fontSize: 14, fontWeight: 600 }}>
              {marketData.mode}モード ({marketData.modeScore}/100)
            </span>
          </div>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              background: 'var(--panel)',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              fontSize: 11,
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} />
            更新
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 12 }}>
          <span>USD/JPY: <strong>{marketData.usdjpy}</strong></span>
          <span>米10Y: <strong>{marketData.us10y}%</strong></span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {marketData.envTags.map((tag, i) => (
            <span
              key={i}
              style={{
                fontSize: 10,
                padding: '3px 6px',
                borderRadius: 4,
                background: 'var(--panel)',
                color: 'var(--text-muted)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* キャッシュステータス */}
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
        キャッシュステータス
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatCard
          label="投資可能額（JPY）"
          value={`¥${cashStatus.investable.toLocaleString()}`}
          icon={Wallet}
          color="#10B981"
        />
        <StatCard
          label="1銘柄最大"
          value={`¥${cashStatus.maxPerStock.toLocaleString()}`}
          icon={Target}
          color="#3B82F6"
        />
        <StatCard
          label="総リザーブ"
          value={`¥${cashStatus.totalReserve.toLocaleString()}`}
          icon={Shield}
          color="#8B5CF6"
        />
        <StatCard
          label="USD残高"
          value={`$${cashStatus.usdBalance.toLocaleString()}`}
          icon={DollarSign}
          color="#F59E0B"
        />
      </div>

      {/* 監視銘柄 */}
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
        監視銘柄
      </h3>
      <div
        style={{
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          overflow: 'hidden',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '70px 1fr 90px 70px 70px 70px',
            padding: '10px 12px',
            background: 'var(--panel-alt)',
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          <div>コード</div>
          <div>銘柄名</div>
          <div style={{ textAlign: 'right' }}>株価</div>
          <div style={{ textAlign: 'right' }}>変化</div>
          <div style={{ textAlign: 'right' }}>PER</div>
          <div style={{ textAlign: 'right' }}>信用倍</div>
        </div>

        {/* データ行 */}
        {watchlist.map((stock, i) => (
          <div
            key={stock.code}
            style={{
              display: 'grid',
              gridTemplateColumns: '70px 1fr 90px 70px 70px 70px',
              padding: '10px 12px',
              borderBottom: i < watchlist.length - 1 ? '1px solid var(--panel-border)' : 'none',
              fontSize: 12,
            }}
          >
            <div style={{ fontWeight: 500 }}>{stock.code}</div>
            <div>{stock.name}</div>
            <div style={{ textAlign: 'right', fontWeight: 500 }}>¥{stock.price.toLocaleString()}</div>
            <div
              style={{
                textAlign: 'right',
                color: stock.change >= 0 ? '#10B981' : '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              {stock.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {stock.change >= 0 ? '+' : ''}{stock.change}%
            </div>
            <div style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{stock.per}</div>
            <div style={{ textAlign: 'right', color: 'var(--text-muted)' }}>{stock.signal}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

// 分析タブ
const AnalysisContent = memo(function AnalysisContent() {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          padding: 12,
          background: '#8B5CF610',
          border: '1px solid #8B5CF630',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#8B5CF6', marginBottom: 4 }}>
          🧠 AIエージェントディベート
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          複数のAIエージェント（強気派・弱気派・中立派）が市場分析を議論し、最適な投資判断を導き出します。
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { name: 'Bull Agent', opinion: '買い推奨', confidence: 72, color: '#10B981' },
          { name: 'Bear Agent', opinion: '様子見', confidence: 45, color: '#EF4444' },
          { name: 'Neutral Agent', opinion: '分散投資', confidence: 68, color: '#6B7280' },
        ].map((agent) => (
          <div
            key={agent.name}
            style={{
              padding: 12,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{agent.name}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: agent.color, marginBottom: 8 }}>
              {agent.opinion}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  height: 4,
                  background: 'var(--panel-border)',
                  borderRadius: 2,
                }}
              >
                <div
                  style={{
                    width: `${agent.confidence}%`,
                    height: '100%',
                    background: agent.color,
                    borderRadius: 2,
                  }}
                />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{agent.confidence}%</span>
            </div>
          </div>
        ))}
      </div>

      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          width: '100%',
          padding: '10px 20px',
          background: '#8B5CF6',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Brain size={16} />
        ディベートを開始
      </button>
    </div>
  );
});

// 戦術書タブ
const StrategyContent = memo(function StrategyContent() {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          padding: 12,
          background: '#F59E0B10',
          border: '1px solid #F59E0B30',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B', marginBottom: 4 }}>
          📋 戦術書生成
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          市場環境、ポートフォリオ状況、AIディベート結果を統合し、具体的な投資アクションプランを生成します。
        </p>
      </div>

      <div
        style={{
          padding: 32,
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <Target size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
        <p style={{ fontSize: 13 }}>戦術書を生成するにはデータ更新を実行してください</p>
        <button
          style={{
            marginTop: 12,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#F59E0B',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <Zap size={14} />
          戦術書を生成
        </button>
      </div>
    </div>
  );
});

// 資金管理タブ
const PortfolioContent = memo(function PortfolioContent() {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          padding: 12,
          background: '#10B98110',
          border: '1px solid #10B98130',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#10B981', marginBottom: 4 }}>
          💰 資金管理
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          ポートフォリオの配分状況、リスク管理、キャッシュフロー監視を行います。
        </p>
      </div>

      {/* アセットアロケーション */}
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>
        アセットアロケーション
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { name: '日本株', value: 45, color: '#EF4444' },
          { name: '米国株', value: 30, color: '#3B82F6' },
          { name: '現金', value: 20, color: '#10B981' },
          { name: 'その他', value: 5, color: '#8B5CF6' },
        ].map((asset) => (
          <div
            key={asset.name}
            style={{
              padding: 12,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12 }}>{asset.name}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: asset.color }}>{asset.value}%</span>
            </div>
            <div
              style={{
                height: 4,
                background: 'var(--panel-border)',
                borderRadius: 2,
              }}
            >
              <div
                style={{
                  width: `${asset.value}%`,
                  height: '100%',
                  background: asset.color,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          height: 150,
          background: 'var(--panel)',
          borderRadius: 8,
          border: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: 12,
        }}
      >
        <PieChart size={20} style={{ marginRight: 8, opacity: 0.5 }} />
        詳細グラフは後日実装
      </div>
    </div>
  );
});

// 設定タブ
const SettingsContent = memo(function SettingsContent() {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          padding: 12,
          background: '#6B728010',
          border: '1px solid #6B728030',
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}>
          ⚙️ 投資OS設定
        </h4>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          リスク許容度、投資上限、自動売買ルールなどを設定します。
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[
          { label: '1銘柄最大投資額', value: '¥150,000', description: 'リスク分散のため' },
          { label: '損切りライン', value: '-8%', description: '自動売却トリガー' },
          { label: '利確ライン', value: '+15%', description: '部分利確を推奨' },
          { label: 'モード自動切替', value: '有効', description: '市場環境に応じて' },
        ].map((setting) => (
          <div
            key={setting.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 12,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{setting.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{setting.description}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#14b8a6' }}>{setting.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

// ============================================================
// メインページ
// ============================================================

export default function StockN3Page() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'analysis':
        return <AnalysisContent />;
      case 'strategy':
        return <StrategyContent />;
      case 'portfolio':
        return <PortfolioContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <N3WorkspaceLayout
      title="N3 Finance - Global Oracle"
      subtitle="自律投資OS（物販・メディア・投資統合）"
      tabs={STOCK_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderTabContent()}
    </N3WorkspaceLayout>
  );
}
