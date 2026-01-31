// app/tools/finance-n3/layouts/finance-n3-page-layout.tsx
/**
 * Finance N3 ページレイアウト
 * 会計・経費・古物台帳の統合レイアウト
 *
 * ゴールドスタンダード準拠: useFinanceIntegrated フックを使用
 */

'use client';

import React, { memo, useState } from 'react';
import {
  BookOpen,
  Receipt,
  Calculator,
  TrendingUp,
  FileText,
  Check,
  X,
  Clock,
  DollarSign,
  CreditCard,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { useFinanceIntegrated } from '../hooks';
import type { FinanceL3Tab, JournalEntry, ExpenseEntry, KobutsuEntry } from '../types/finance';

// L3タブ設定
const L3_TABS: { id: FinanceL3Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'journal', label: '仕訳一覧', icon: <BookOpen size={14} /> },
  { id: 'expense', label: '経費管理', icon: <Receipt size={14} /> },
  { id: 'profit', label: '利益計算', icon: <Calculator size={14} /> },
  { id: 'cashflow', label: 'キャッシュフロー', icon: <TrendingUp size={14} /> },
  { id: 'kobutsu', label: '古物台帳', icon: <FileText size={14} /> },
  { id: 'reports', label: 'レポート', icon: <FileText size={14} /> },
];

// ステータスバッジ
const StatusBadge = memo(function StatusBadge({ status }: { status: string }) {
  const config = {
    draft: { variant: 'secondary' as const, label: '下書き' },
    pending: { variant: 'warning' as const, label: '保留' },
    approved: { variant: 'success' as const, label: '承認済' },
    rejected: { variant: 'error' as const, label: '却下' },
  };
  const { variant, label } = config[status as keyof typeof config] || config.pending;
  return <N3Badge variant={variant} size="sm">{label}</N3Badge>;
});

// 仕訳行
const JournalRow = memo(function JournalRow({
  journal,
  onApprove,
  onReject,
}: {
  journal: JournalEntry;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 120px 120px 100px 100px',
        gap: '12px',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-md, 8px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{journal.date}</span>
      <span style={{ fontSize: '13px', color: 'var(--text)' }}>{journal.description}</span>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{journal.debitAccount}</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
          ¥{(journal.debitAmount || journal.amount || 0).toLocaleString()}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{journal.creditAccount}</div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
          ¥{(journal.creditAmount || journal.amount || 0).toLocaleString()}
        </div>
      </div>
      <StatusBadge status={journal.status} />
      {journal.status === 'pending' && (
        <div style={{ display: 'flex', gap: '4px' }}>
          <N3Button variant="success" size="xs" onClick={onApprove}>
            <Check size={12} />
          </N3Button>
          <N3Button variant="error" size="xs" onClick={onReject}>
            <X size={12} />
          </N3Button>
        </div>
      )}
    </div>
  );
});

// 経費行
const ExpenseRow = memo(function ExpenseRow({
  expense,
}: {
  expense: ExpenseEntry;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 120px 1fr 120px',
        gap: '12px',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-md, 8px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{expense.date}</span>
      <N3Badge variant="outline" size="sm">{expense.category}</N3Badge>
      <span style={{ fontSize: '13px', color: 'var(--text)' }}>{expense.description}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>
        ¥{expense.amount.toLocaleString()}
      </span>
    </div>
  );
});

// 古物台帳行
const KobutsuRow = memo(function KobutsuRow({ entry }: { entry: KobutsuEntry }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 100px 80px 120px 150px',
        gap: '12px',
        alignItems: 'center',
        padding: '12px 16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-md, 8px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{entry.date || entry.acquisitionDate}</span>
      <span style={{ fontSize: '13px', color: 'var(--text)' }}>{entry.itemName}</span>
      <N3Badge variant="outline" size="sm">{entry.category}</N3Badge>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
        {entry.quantity || 1}点
      </span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>
        ¥{(entry.acquisitionPrice || (entry.unitPrice || 0) * (entry.quantity || 1)).toLocaleString()}
      </span>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
        {entry.supplierName || entry.sellerInfo?.name}
        {(entry.idVerification || entry.sellerInfo?.idType) && (
          <Check size={12} style={{ marginLeft: '4px', color: 'var(--color-success)' }} />
        )}
      </span>
    </div>
  );
});

// 統計カード
const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
  color,
  subValue,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  subValue?: string;
}) {
  return (
    <div
      style={{
        padding: '16px',
        background: 'var(--panel)',
        borderRadius: 'var(--style-radius-lg, 12px)',
        border: '1px solid var(--panel-border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={16} style={{ color }} />
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>
        {typeof value === 'number' ? `¥${value.toLocaleString()}` : value}
      </div>
      {subValue && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
          {subValue}
        </div>
      )}
    </div>
  );
});

export const FinanceN3PageLayout = memo(function FinanceN3PageLayout() {
  // ゴールドスタンダード: 統合フックを使用
  const {
    journalEntries,
    journalStats,
    expenseRecords,
    expenseByCategory,
    kobutsuRecords,
    activeTab,
    setActiveTab,
    selectJournal,
    isLoading,
    refresh,
  } = useFinanceIntegrated();

  const [searchValue, setSearchValue] = useState('');

  // タブコンテンツ
  const renderTabContent = () => {
    switch (activeTab) {
      case 'journal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 120px 120px 100px 100px',
                gap: '12px',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              <span>日付</span>
              <span>摘要</span>
              <span style={{ textAlign: 'right' }}>借方</span>
              <span style={{ textAlign: 'right' }}>貸方</span>
              <span>ステータス</span>
              <span>操作</span>
            </div>
            {journalEntries.map(journal => (
              <JournalRow
                key={journal.id}
                journal={journal as JournalEntry}
                onApprove={() => selectJournal(journal.id)}
                onReject={() => selectJournal(journal.id)}
              />
            ))}
            {journalEntries.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                仕訳データがありません
              </div>
            )}
          </div>
        );

      case 'expense':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 120px 1fr 120px',
                gap: '12px',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              <span>日付</span>
              <span>カテゴリ</span>
              <span>説明</span>
              <span style={{ textAlign: 'right' }}>金額</span>
            </div>
            {expenseRecords.map(expense => (
              <ExpenseRow
                key={expense.id}
                expense={expense as ExpenseEntry}
              />
            ))}
            {expenseRecords.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                経費データがありません
              </div>
            )}
          </div>
        );

      case 'kobutsu':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: 'var(--style-radius-md, 8px)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                marginBottom: '8px',
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--color-error)', fontWeight: 500 }}>
                古物営業法に基づく記録
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                古物商許可証に基づき、取引記録を正確に記載してください。
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 100px 80px 120px 150px',
                gap: '12px',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
              }}
            >
              <span>日付</span>
              <span>品名</span>
              <span>区分</span>
              <span style={{ textAlign: 'center' }}>数量</span>
              <span style={{ textAlign: 'right' }}>金額</span>
              <span>相手方</span>
            </div>
            {kobutsuRecords.map(entry => (
              <KobutsuRow key={entry.id} entry={entry as KobutsuEntry} />
            ))}
            {kobutsuRecords.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                古物台帳データがありません
              </div>
            )}
          </div>
        );

      default:
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              background: 'var(--panel)',
              borderRadius: 'var(--style-radius-lg, 12px)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <Calculator size={32} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px' }}>準備中...</div>
            </div>
          </div>
        );
    }
  };

  // 統計値を計算
  const totalDebit = journalStats?.totalDebit || 0;
  const totalExpense = Object.values(expenseByCategory).reduce((a, b) => a + (b as number), 0);
  const pendingCount = journalStats?.pending || 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* ヘッダー */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--panel)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--color-success), var(--color-warning))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                会計管理 (N3)
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                仕訳・経費・古物台帳の統合管理
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <N3Button variant="primary" size="sm">
              <Plus size={14} />
              新規仕訳
            </N3Button>
            <N3Button variant="secondary" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </N3Button>
          </div>
        </div>

        {/* 統計 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          <StatCard label="現金残高" value={totalDebit} icon={DollarSign} color="var(--color-primary)" />
          <StatCard label="売上高" value={totalDebit} icon={TrendingUp} color="var(--color-success)" />
          <StatCard label="経費" value={totalExpense} icon={CreditCard} color="var(--color-error)" />
          <StatCard label="未承認仕訳" value={pendingCount} icon={Clock} color="var(--color-warning)" subValue="件" />
          <StatCard label="未承認経費" value={0} icon={Receipt} color="var(--color-info)" subValue="件" />
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* 左サイドバー */}
        <div
          style={{
            width: '200px',
            borderRight: '1px solid var(--panel-border)',
            background: 'var(--panel)',
            padding: '12px',
            overflowY: 'auto',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', padding: '0 8px' }}>
            会計メニュー
          </div>
          {L3_TABS.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: 'var(--style-radius-md, 8px)',
                cursor: 'pointer',
                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text)',
                marginBottom: '4px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.icon}
              <span style={{ fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400 }}>
                {tab.label}
              </span>
            </div>
          ))}
        </div>

        {/* コンテンツエリア */}
        <div
          style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            background: 'var(--bg)',
          }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
});

export default FinanceN3PageLayout;
