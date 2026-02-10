// app/tools/finance-n3/page.tsx
/**
 * Finance N3 - 会計管理統合ページ
 * 
 * Phase 4.5: N3WorkspaceLayout による UI統一
 * 
 * Tab構成:
 * - Dashboard (売上・利益サマリー)
 * - Transactions (取引履歴)
 * - Reports (レポート生成)
 * - Bookkeeping (記帳)
 * - Tools (n8n実行)
 */

'use client';

import React, { useState, memo, Suspense } from 'react';
import {
  BarChart3, TrendingUp, FileText, Calculator, DollarSign,
  PieChart, Loader2, Calendar, Download, RefreshCw,
} from 'lucide-react';
import { N3WorkspaceLayout, type L2Tab, type FilterTab } from '@/components/layouts';
import { ToolExecutionPanel } from '@/components/tools';

// ============================================================
// タブ定義
// ============================================================

const FINANCE_TABS: L2Tab[] = [
  { id: 'dashboard', label: 'ダッシュボード', labelEn: 'Dashboard', icon: BarChart3, color: '#3B82F6' },
  { id: 'transactions', label: '取引履歴', labelEn: 'Transactions', icon: TrendingUp, color: '#10B981' },
  { id: 'reports', label: 'レポート', labelEn: 'Reports', icon: FileText, color: '#8B5CF6' },
  { id: 'bookkeeping', label: '記帳', labelEn: 'Bookkeeping', icon: Calculator, color: '#F59E0B' },
  { id: 'tools', label: 'ツール', labelEn: 'Tools', icon: DollarSign, color: '#EC4899' },
];

// ============================================================
// サブコンポーネント
// ============================================================

const StatCard = memo(function StatCard({
  label,
  value,
  change,
  color = 'var(--text)',
}: {
  label: string;
  value: string;
  change?: string;
  color?: string;
}) {
  const isPositive = change?.startsWith('+');
  
  return (
    <div
      style={{
        padding: '20px 24px',
        background: 'var(--panel)',
        borderRadius: 12,
        border: '1px solid var(--panel-border)',
      }}
    >
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      {change && (
        <div
          style={{
            fontSize: 12,
            color: isPositive ? 'var(--success)' : 'var(--error)',
            marginTop: 4,
          }}
        >
          {change} vs 前月
        </div>
      )}
    </div>
  );
});

const DashboardTabContent = memo(function DashboardTabContent() {
  return (
    <div style={{ padding: 16 }}>
      {/* 統計カード */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <StatCard label="月間売上" value="¥2,450,000" change="+12.5%" color="#10B981" />
        <StatCard label="月間利益" value="¥485,000" change="+8.2%" color="#3B82F6" />
        <StatCard label="利益率" value="19.8%" change="+1.3%" />
        <StatCard label="受注件数" value="342件" change="+24件" />
      </div>
      
      {/* プラットフォーム別 */}
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
        プラットフォーム別売上
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { name: 'eBay US', amount: '¥1,280,000', share: 52, color: '#0064D2' },
          { name: 'eBay UK', amount: '¥580,000', share: 24, color: '#3B82F6' },
          { name: 'Amazon JP', amount: '¥590,000', share: 24, color: '#FF9900' },
        ].map((platform) => (
          <div
            key={platform.name}
            style={{
              padding: 16,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{platform.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{platform.share}%</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: platform.color }}>
              {platform.amount}
            </div>
            <div
              style={{
                marginTop: 8,
                height: 4,
                borderRadius: 2,
                background: 'var(--panel-border)',
              }}
            >
              <div
                style={{
                  width: `${platform.share}%`,
                  height: '100%',
                  borderRadius: 2,
                  background: platform.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* 月次推移グラフ（プレースホルダー） */}
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
        月次推移
      </h3>
      <div
        style={{
          height: 200,
          background: 'var(--panel)',
          borderRadius: 12,
          border: '1px solid var(--panel-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
        }}
      >
        <PieChart size={24} style={{ marginRight: 8, opacity: 0.5 }} />
        グラフは後日実装
      </div>
    </div>
  );
});

const TransactionsTabContent = memo(function TransactionsTabContent() {
  const transactions = [
    { id: 1, date: '2025-01-26', platform: 'eBay US', type: '売上', amount: 12500, currency: 'JPY' },
    { id: 2, date: '2025-01-26', platform: 'eBay US', type: '手数料', amount: -1875, currency: 'JPY' },
    { id: 3, date: '2025-01-25', platform: 'Amazon JP', type: '売上', amount: 8900, currency: 'JPY' },
    { id: 4, date: '2025-01-25', platform: 'eBay UK', type: '売上', amount: 15200, currency: 'JPY' },
    { id: 5, date: '2025-01-24', platform: 'eBay US', type: '返金', amount: -3500, currency: 'JPY' },
  ];
  
  return (
    <div style={{ padding: 16 }}>
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
            gridTemplateColumns: '100px 120px 1fr 100px 120px',
            padding: '12px 16px',
            background: 'var(--panel-alt)',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
          }}
        >
          <div>日付</div>
          <div>プラットフォーム</div>
          <div>種別</div>
          <div style={{ textAlign: 'right' }}>金額</div>
          <div style={{ textAlign: 'right' }}>通貨</div>
        </div>
        
        {/* データ行 */}
        {transactions.map((tx) => (
          <div
            key={tx.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '100px 120px 1fr 100px 120px',
              padding: '12px 16px',
              borderBottom: '1px solid var(--panel-border)',
              fontSize: 13,
            }}
          >
            <div style={{ opacity: 0.7 }}>{tx.date}</div>
            <div>{tx.platform}</div>
            <div>{tx.type}</div>
            <div
              style={{
                textAlign: 'right',
                fontWeight: 500,
                color: tx.amount >= 0 ? 'var(--success)' : 'var(--error)',
              }}
            >
              {tx.amount >= 0 ? '+' : ''}{tx.amount.toLocaleString()}
            </div>
            <div style={{ textAlign: 'right', opacity: 0.7 }}>{tx.currency}</div>
          </div>
        ))}
      </div>
    </div>
  );
});

const ReportsTabContent = memo(function ReportsTabContent() {
  const reports = [
    { id: 1, name: '月次売上レポート', period: '2025年1月', status: '生成可能' },
    { id: 2, name: '四半期利益分析', period: 'Q4 2024', status: '生成可能' },
    { id: 3, name: '年間決算書', period: '2024年', status: '生成可能' },
    { id: 4, name: 'プラットフォーム別分析', period: '2025年1月', status: '生成可能' },
  ];
  
  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {reports.map((report) => (
          <div
            key={report.id}
            style={{
              padding: 20,
              background: 'var(--panel)',
              borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{report.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                  {report.period}
                </div>
              </div>
              <FileText size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: 'var(--accent)',
                color: 'white',
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              生成
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

const BookkeepingTabContent = memo(function BookkeepingTabContent() {
  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          padding: 24,
          background: 'var(--panel)',
          borderRadius: 12,
          border: '1px solid var(--panel-border)',
          textAlign: 'center',
        }}
      >
        <Calculator size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>自動記帳</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          freee/MFクラウドとの連携で自動仕訳
        </p>
        <button
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--accent)',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} />
          同期実行
        </button>
      </div>
    </div>
  );
});

const ToolsTabContent = memo(function ToolsTabContent() {
  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--text)' }}>
        Finance Tools
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        n8n ワークフローを直接実行できます。dispatch API 経由で処理されます。
      </p>
      <ToolExecutionPanel category="finance" />
    </div>
  );
});

// ============================================================
// メインコンポーネント
// ============================================================

export default function FinanceN3Page() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // フィルター定義
  const getFilters = (): FilterTab[] => {
    switch (activeTab) {
      case 'transactions':
        return [
          { id: 'all', label: '全て' },
          { id: 'sales', label: '売上' },
          { id: 'fees', label: '手数料' },
          { id: 'refunds', label: '返金' },
        ];
      default:
        return [];
    }
  };
  
  // ツールバー
  const toolbar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--panel-alt)',
          color: 'var(--text)',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        <Calendar size={14} />
        今月
      </button>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '6px 12px',
          borderRadius: 6,
          border: 'none',
          background: 'var(--panel-alt)',
          color: 'var(--text)',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        <Download size={14} />
        エクスポート
      </button>
    </div>
  );

  return (
    <N3WorkspaceLayout
      title="Finance"
      subtitle="売上・利益・記帳管理"
      tabs={FINANCE_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      filters={getFilters()}
      toolbar={toolbar}
    >
      {activeTab === 'dashboard' && <DashboardTabContent />}
      {activeTab === 'transactions' && <TransactionsTabContent />}
      {activeTab === 'reports' && <ReportsTabContent />}
      {activeTab === 'bookkeeping' && <BookkeepingTabContent />}
      {activeTab === 'tools' && <ToolsTabContent />}
    </N3WorkspaceLayout>
  );
}
