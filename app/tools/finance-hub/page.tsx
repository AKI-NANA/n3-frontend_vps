// app/tools/finance-hub/page.tsx
/**
 * 💰 Finance Hub - 経理統合母艦
 * 
 * DDP計算・利益分析・会計連携・レベニューシェア
 */

'use client';

import React, { useState } from 'react';
import { DollarSign, Calculator, TrendingUp, FileText, Users, BarChart3 } from 'lucide-react';
import { BaseHubLayout, HubTool, ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

// ============================================================
// DDP Calculator Tool
// ============================================================

function DDPCalculatorTool() {
  const fields = [
    { id: 'productIds', label: '商品ID（カンマ区切り）', type: 'text' as const, placeholder: '123, 456, 789', required: true },
    { id: 'sourceCountry', label: '発送元国', type: 'select' as const, options: [
      { value: 'JP', label: '日本' },
      { value: 'CN', label: '中国' },
      { value: 'US', label: 'アメリカ' },
    ], defaultValue: 'JP' },
    { id: 'destinationCountry', label: '送り先国', type: 'select' as const, options: [
      { value: 'US', label: 'アメリカ' },
      { value: 'UK', label: 'イギリス' },
      { value: 'DE', label: 'ドイツ' },
      { value: 'AU', label: 'オーストラリア' },
    ], defaultValue: 'US' },
    { id: 'includeAiHts', label: 'AI HTSコード自動判定', type: 'checkbox' as const, defaultValue: true },
    { id: 'includeFees', label: '手数料含む', type: 'checkbox' as const, defaultValue: true },
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <h4 className="font-bold text-green-500 mb-2">💹 AI補完DDP計算</h4>
        <p className="text-sm text-[var(--text-muted)]">
          AIによるHTSコード自動判定、関税・送料・手数料を含めた完全なDDP価格を計算します。
        </p>
      </div>
      <ToolExecutionPanel
        toolId="finance-ddp-calculate"
        title="DDP価格計算"
        description="AI補完による正確なDDP価格計算"
        fields={fields}
      />
    </div>
  );
}

// ============================================================
// Profit Analysis Tool
// ============================================================

function ProfitAnalysisTool() {
  const [profitData, setProfitData] = useState([
    { period: '今日', revenue: 15420, cost: 8230, profit: 7190, margin: 46.6 },
    { period: '今週', revenue: 89500, cost: 48200, profit: 41300, margin: 46.1 },
    { period: '今月', revenue: 324000, cost: 175000, profit: 149000, margin: 46.0 },
  ]);
  
  const fields = [
    { id: 'dateFrom', label: '開始日', type: 'date' as const, required: true },
    { id: 'dateTo', label: '終了日', type: 'date' as const, required: true },
    { id: 'groupBy', label: 'グループ化', type: 'select' as const, options: [
      { value: 'day', label: '日別' },
      { value: 'week', label: '週別' },
      { value: 'month', label: '月別' },
      { value: 'product', label: '商品別' },
      { value: 'marketplace', label: 'マーケット別' },
    ], defaultValue: 'day' },
  ];
  
  return (
    <div className="space-y-6">
      {/* サマリー */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '売上', value: '¥324,000', color: 'text-blue-500' },
          { label: '原価', value: '¥175,000', color: 'text-red-500' },
          { label: '利益', value: '¥149,000', color: 'text-green-500' },
          { label: '利益率', value: '46.0%', color: 'text-yellow-500' },
        ].map((s, i) => (
          <div key={i} className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4 text-center">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
          </div>
        ))}
      </div>
      
      {/* テーブル */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--highlight)]">
            <tr>
              <th className="px-4 py-3 text-left">期間</th>
              <th className="px-4 py-3 text-right">売上</th>
              <th className="px-4 py-3 text-right">原価</th>
              <th className="px-4 py-3 text-right">利益</th>
              <th className="px-4 py-3 text-right">利益率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--panel-border)]">
            {profitData.map((row, i) => (
              <tr key={i} className="hover:bg-[var(--highlight)]">
                <td className="px-4 py-3">{row.period}</td>
                <td className="px-4 py-3 text-right text-blue-500">¥{row.revenue.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-red-500">¥{row.cost.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-green-500 font-bold">¥{row.profit.toLocaleString()}</td>
                <td className="px-4 py-3 text-right">{row.margin}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <ToolExecutionPanel
        toolId="finance-profit-analyze"
        title="利益分析レポート生成"
        description="詳細な利益分析レポートを生成"
        fields={fields}
      />
    </div>
  );
}

// ============================================================
// Accounting Sync Tool
// ============================================================

function AccountingSyncTool() {
  const fields = [
    { id: 'target', label: '連携先', type: 'select' as const, options: [
      { value: 'money_forward', label: 'MoneyForward' },
      { value: 'freee', label: 'freee' },
      { value: 'both', label: '両方' },
    ], defaultValue: 'money_forward', required: true },
    { id: 'dateFrom', label: '対象期間（開始）', type: 'date' as const },
    { id: 'dateTo', label: '対象期間（終了）', type: 'date' as const },
    { id: 'autoApprove', label: '自動承認', type: 'checkbox' as const, defaultValue: false },
  ];
  
  return (
    <div className="space-y-6">
      <ToolExecutionPanel
        toolId="finance-accounting-sync"
        title="会計ソフト連携"
        description="MoneyForward/freeeへの自動仕訳連携"
        fields={fields}
      />
    </div>
  );
}

// ============================================================
// Revenue Share Tool
// ============================================================

function RevenueShareTool() {
  const [shares, setShares] = useState([
    { name: '外注A', role: 'リサーチ', revenue: 50000, rate: 10, payment: 5000 },
    { name: '外注B', role: '出品', revenue: 80000, rate: 8, payment: 6400 },
    { name: 'パートナーC', role: 'マーケティング', revenue: 120000, rate: 15, payment: 18000 },
  ]);
  
  const fields = [
    { id: 'period', label: '対象期間', type: 'select' as const, options: [
      { value: 'this_month', label: '今月' },
      { value: 'last_month', label: '先月' },
      { value: 'custom', label: 'カスタム' },
    ], defaultValue: 'this_month' },
    { id: 'autoCalculate', label: '自動計算実行', type: 'checkbox' as const, defaultValue: true },
  ];
  
  return (
    <div className="space-y-6">
      {/* レベニューシェア一覧 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2">
            <Users className="w-5 h-5" />
            レベニューシェア計算
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--highlight)]">
              <tr>
                <th className="px-4 py-3 text-left">名前</th>
                <th className="px-4 py-3 text-left">役割</th>
                <th className="px-4 py-3 text-right">関連売上</th>
                <th className="px-4 py-3 text-right">レート</th>
                <th className="px-4 py-3 text-right">支払額</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)]">
              {shares.map((s, i) => (
                <tr key={i} className="hover:bg-[var(--highlight)]">
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{s.role}</td>
                  <td className="px-4 py-3 text-right">¥{s.revenue.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{s.rate}%</td>
                  <td className="px-4 py-3 text-right text-green-500 font-bold">¥{s.payment.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[var(--highlight)]">
              <tr>
                <td colSpan={4} className="px-4 py-3 font-bold text-right">合計</td>
                <td className="px-4 py-3 text-right text-green-500 font-bold">
                  ¥{shares.reduce((sum, s) => sum + s.payment, 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <ToolExecutionPanel
        toolId="finance-revshare-calculate"
        title="レベニューシェア計算実行"
        description="全パートナーのレベニューシェアを一括計算"
        fields={fields}
      />
    </div>
  );
}

// ============================================================
// Hub Tools Definition
// ============================================================

const FINANCE_TOOLS: HubTool[] = [
  { id: 'finance-ddp-calculate', name: 'DDP Calculator', description: 'AI補完DDP価格計算', icon: <Calculator className="w-4 h-4" />, component: <DDPCalculatorTool />, category: 'finance' },
  { id: 'finance-profit-analyze', name: 'Profit Analysis', description: '利益分析', icon: <TrendingUp className="w-4 h-4" />, component: <ProfitAnalysisTool />, category: 'finance' },
  { id: 'finance-accounting-sync', name: 'Accounting', description: '会計ソフト連携', icon: <FileText className="w-4 h-4" />, component: <AccountingSyncTool />, category: 'finance' },
  { id: 'finance-revshare-calculate', name: 'Revenue Share', description: 'レベニューシェア計算', icon: <Users className="w-4 h-4" />, component: <RevenueShareTool />, category: 'finance' },
];

export default function FinanceHubPage() {
  return (
    <BaseHubLayout
      title="Finance Hub"
      titleEn="Finance Hub"
      description="DDP計算・利益分析・会計連携・レベニューシェアを統合"
      icon={<DollarSign className="w-6 h-6" />}
      tools={FINANCE_TOOLS}
      defaultTool="finance-ddp-calculate"
    />
  );
}
