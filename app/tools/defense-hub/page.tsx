// app/tools/defense-hub/page.tsx
/**
 * 🛡️ Defense Hub - 防衛統合母艦
 * 
 * BAN監視・著作権防衛・セキュリティアラート
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Copyright, Eye, Bell, CheckCircle, XCircle } from 'lucide-react';
import { BaseHubLayout, HubTool, ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

// ============================================================
// BAN Monitor Tool
// ============================================================

function BANMonitorTool() {
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'MJT', platform: 'eBay US', status: 'healthy', lastCheck: '2026-01-26T15:30:00', warnings: 0 },
    { id: 2, name: 'GREEN', platform: 'eBay UK', status: 'warning', lastCheck: '2026-01-26T15:25:00', warnings: 2 },
    { id: 3, name: 'MJT', platform: 'Amazon US', status: 'healthy', lastCheck: '2026-01-26T15:20:00', warnings: 0 },
    { id: 4, name: 'Shopify', platform: 'Shopify', status: 'healthy', lastCheck: '2026-01-26T15:15:00', warnings: 0 },
  ]);
  
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'GREEN (eBay UK): 出品制限警告 - VeRO疑い', time: '2026-01-26T14:00:00' },
    { id: 2, type: 'info', message: 'MJT: 売上好調 - BAN リスク低', time: '2026-01-26T12:00:00' },
  ]);
  
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      healthy: 'bg-green-500/20 text-green-500',
      warning: 'bg-yellow-500/20 text-yellow-500',
      danger: 'bg-red-500/20 text-red-500',
      banned: 'bg-red-700/20 text-red-700',
    };
    const labels: Record<string, string> = { healthy: '正常', warning: '警告', danger: '危険', banned: 'BAN' };
    return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };
  
  return (
    <div className="space-y-6">
      {/* アカウント状態 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2"><Eye className="w-5 h-5" />アカウント監視</h3>
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {accounts.map(acc => (
            <div key={acc.id} className="p-4 flex items-center justify-between hover:bg-[var(--highlight)]">
              <div>
                <div className="font-medium">{acc.name}</div>
                <div className="text-xs text-[var(--text-muted)]">{acc.platform}</div>
              </div>
              <div className="flex items-center gap-4">
                {acc.warnings > 0 && (
                  <span className="text-xs text-yellow-500">{acc.warnings}件の警告</span>
                )}
                {getStatusBadge(acc.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* アラート履歴 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2"><Bell className="w-5 h-5" />アラート履歴</h3>
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {alerts.map(alert => (
            <div key={alert.id} className="p-4 flex items-start gap-3">
              {alert.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="text-sm">{alert.message}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">{new Date(alert.time).toLocaleString('ja-JP')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Copyright Shield Tool
// ============================================================

function CopyrightShieldTool() {
  const [copyrightAlerts, setCopyrightAlerts] = useState([
    { id: 1, product: 'ポケモンカード 25周年', brand: 'Nintendo', status: 'resolved', date: '2026-01-25' },
    { id: 2, product: 'ドラゴンボール フィギュア', brand: 'Bandai', status: 'pending', date: '2026-01-26' },
  ]);
  
  const fields = [
    { id: 'mode', label: '監視モード', type: 'select' as const, options: [
      { value: 'auto', label: '自動対応' },
      { value: 'manual', label: '手動確認' },
      { value: 'alert_only', label: 'アラートのみ' },
    ], defaultValue: 'auto' },
    { id: 'checkVero', label: 'VeROリスト照合', type: 'checkbox' as const, defaultValue: true },
    { id: 'autoRemove', label: '自動出品取り下げ', type: 'checkbox' as const, defaultValue: false },
  ];
  
  return (
    <div className="space-y-6">
      {/* 著作権アラート一覧 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2"><Copyright className="w-5 h-5" />著作権アラート</h3>
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {copyrightAlerts.map(alert => (
            <div key={alert.id} className="p-4 flex items-center justify-between hover:bg-[var(--highlight)]">
              <div>
                <div className="font-medium text-sm">{alert.product}</div>
                <div className="text-xs text-[var(--text-muted)]">ブランド: {alert.brand}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-muted)]">{alert.date}</span>
                <span className={`px-2 py-1 rounded text-xs ${alert.status === 'resolved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {alert.status === 'resolved' ? '解決済み' : '対応中'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ToolExecutionPanel
        toolId="defense-copyright-shield"
        title="著作権防衛設定"
        description="VeROリスト監視・自動対応の設定"
        fields={fields}
      />
    </div>
  );
}

// ============================================================
// Security Alerts Tool
// ============================================================

function SecurityAlertsTool() {
  const fields = [
    { id: 'alertType', label: 'アラートタイプ', type: 'select' as const, options: [
      { value: 'all', label: 'すべて' },
      { value: 'login', label: '不正ログイン' },
      { value: 'api', label: 'API異常' },
      { value: 'rate_limit', label: 'レート制限' },
    ], defaultValue: 'all' },
    { id: 'notifyEmail', label: 'メール通知', type: 'checkbox' as const, defaultValue: true },
    { id: 'notifyChatwork', label: 'ChatWork通知', type: 'checkbox' as const, defaultValue: true },
  ];
  
  return (
    <div className="space-y-6">
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <h4 className="font-bold text-red-500 mb-2">⚠️ セキュリティ監視</h4>
        <p className="text-sm text-[var(--text-muted)]">
          不正アクセス、API異常、レート制限超過などをリアルタイム監視します。
        </p>
      </div>
      <ToolExecutionPanel
        toolId="defense-security-alert"
        title="セキュリティ設定"
        description="セキュリティアラートの設定"
        fields={fields}
      />
    </div>
  );
}

// ============================================================
// Hub Tools Definition
// ============================================================

const DEFENSE_TOOLS: HubTool[] = [
  { id: 'defense-ban-monitor', name: 'BAN Monitor', description: 'アカウントBAN監視', icon: <Eye className="w-4 h-4" />, component: <BANMonitorTool />, category: 'defense' },
  { id: 'defense-copyright-shield', name: 'Copyright Shield', description: '著作権防衛', icon: <Copyright className="w-4 h-4" />, component: <CopyrightShieldTool />, requiresJob: true, category: 'defense' },
  { id: 'defense-security-alert', name: 'Security Alerts', description: 'セキュリティアラート', icon: <AlertTriangle className="w-4 h-4" />, component: <SecurityAlertsTool />, category: 'defense' },
];

export default function DefenseHubPage() {
  return (
    <BaseHubLayout
      title="Defense Hub"
      titleEn="Defense Hub"
      description="BAN監視・著作権防衛・セキュリティアラートを統合（Admin専用）"
      icon={<Shield className="w-6 h-6" />}
      tools={DEFENSE_TOOLS}
      defaultTool="defense-ban-monitor"
    />
  );
}
