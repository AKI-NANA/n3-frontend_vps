// app/tools/automation-hub/page.tsx
/**
 * ⚙️ Automation Hub - 自動化設定母艦
 * 
 * Cron管理・ワークフロー制御・エージェント設定・レート制限
 */

'use client';

import React, { useState } from 'react';
import { Cog, Clock, GitBranch, Bot, Gauge, Play, Pause, RefreshCw, Settings } from 'lucide-react';
import { BaseHubLayout, HubTool, useDispatch } from '@/components/n3/empire/base-hub-layout';

// ============================================================
// Cron Management Tool
// ============================================================

function CronManagementTool() {
  const [cronJobs, setCronJobs] = useState([
    { id: 1, name: '在庫同期', cron: '*/30 * * * *', status: 'active', lastRun: '2026-01-26T15:30:00', nextRun: '2026-01-26T16:00:00' },
    { id: 2, name: '価格更新', cron: '0 */6 * * *', status: 'active', lastRun: '2026-01-26T12:00:00', nextRun: '2026-01-26T18:00:00' },
    { id: 3, name: 'BAN監視', cron: '0 * * * *', status: 'active', lastRun: '2026-01-26T15:00:00', nextRun: '2026-01-26T16:00:00' },
    { id: 4, name: '会計連携', cron: '0 9 * * *', status: 'paused', lastRun: '2026-01-25T09:00:00', nextRun: '-' },
  ]);
  
  const toggleCron = (id: number) => {
    setCronJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status: job.status === 'active' ? 'paused' : 'active' } : job
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2"><Clock className="w-5 h-5" />Cronジョブ管理</h3>
          <button className="px-3 py-1.5 bg-[var(--accent)] text-white rounded text-sm">+ 新規追加</button>
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {cronJobs.map(job => (
            <div key={job.id} className="p-4 flex items-center justify-between hover:bg-[var(--highlight)]">
              <div className="flex-1">
                <div className="font-medium">{job.name}</div>
                <div className="text-xs text-[var(--text-muted)] font-mono mt-1">{job.cron}</div>
              </div>
              <div className="text-right mr-4">
                <div className="text-xs text-[var(--text-muted)]">最終実行: {new Date(job.lastRun).toLocaleTimeString('ja-JP')}</div>
                <div className="text-xs text-[var(--text-muted)]">次回: {job.nextRun !== '-' ? new Date(job.nextRun).toLocaleTimeString('ja-JP') : '-'}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${job.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                  {job.status === 'active' ? '実行中' : '停止中'}
                </span>
                <button onClick={() => toggleCron(job.id)} className="p-2 hover:bg-[var(--panel-border)] rounded">
                  {job.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Workflow Control Tool
// ============================================================

function WorkflowControlTool() {
  const [workflows, setWorkflows] = useState([
    { id: 1, name: 'N3-出品処理', status: 'active', executions: 1250, errors: 3, lastModified: '2026-01-25' },
    { id: 2, name: 'N3-在庫同期', status: 'active', executions: 8400, errors: 12, lastModified: '2026-01-24' },
    { id: 3, name: 'N3-リサーチエージェント', status: 'active', executions: 450, errors: 0, lastModified: '2026-01-26' },
    { id: 4, name: 'N3-メディア生成', status: 'inactive', executions: 85, errors: 2, lastModified: '2026-01-20' },
  ]);
  
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2"><GitBranch className="w-5 h-5" />n8nワークフロー</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--highlight)]">
              <tr>
                <th className="px-4 py-3 text-left">ワークフロー名</th>
                <th className="px-4 py-3 text-center">ステータス</th>
                <th className="px-4 py-3 text-right">実行数</th>
                <th className="px-4 py-3 text-right">エラー</th>
                <th className="px-4 py-3 text-center">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--panel-border)]">
              {workflows.map(wf => (
                <tr key={wf.id} className="hover:bg-[var(--highlight)]">
                  <td className="px-4 py-3 font-medium">{wf.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${wf.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                      {wf.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">{wf.executions.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={wf.errors > 0 ? 'text-red-500' : ''}>{wf.errors}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-1.5 hover:bg-[var(--panel-border)] rounded"><Settings className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Agent Settings Tool
// ============================================================

function AgentSettingsTool() {
  const [agents, setAgents] = useState([
    { id: 1, name: 'リサーチエージェント', model: 'GPT-4', temperature: 0.7, status: 'active' },
    { id: 2, name: '価格防衛エージェント', model: 'Claude-3', temperature: 0.3, status: 'active' },
    { id: 3, name: '問い合わせ対応エージェント', model: 'GPT-4', temperature: 0.5, status: 'paused' },
  ]);
  
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2"><Bot className="w-5 h-5" />AIエージェント設定</h3>
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {agents.map(agent => (
            <div key={agent.id} className="p-4 flex items-center justify-between hover:bg-[var(--highlight)]">
              <div>
                <div className="font-medium">{agent.name}</div>
                <div className="text-xs text-[var(--text-muted)]">モデル: {agent.model} | Temperature: {agent.temperature}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${agent.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
                  {agent.status === 'active' ? '稼働中' : '停止中'}
                </span>
                <button className="p-2 hover:bg-[var(--panel-border)] rounded"><Settings className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Rate Limits Tool
// ============================================================

function RateLimitsTool() {
  const [limits, setLimits] = useState([
    { api: 'eBay Trading API', limit: 5000, used: 3240, period: '1日' },
    { api: 'Amazon PA-API', limit: 8640, used: 2100, period: '1日' },
    { api: 'OpenAI GPT-4', limit: 10000, used: 4500, period: '1日' },
    { api: 'ElevenLabs', limit: 100000, used: 45000, period: '1月' },
  ]);
  
  return (
    <div className="space-y-6">
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
        <div className="p-4 border-b border-[var(--panel-border)]">
          <h3 className="font-bold flex items-center gap-2"><Gauge className="w-5 h-5" />APIレート制限</h3>
        </div>
        <div className="divide-y divide-[var(--panel-border)]">
          {limits.map((limit, i) => {
            const percentage = (limit.used / limit.limit) * 100;
            return (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm">{limit.api}</div>
                  <div className="text-xs text-[var(--text-muted)]">{limit.used.toLocaleString()} / {limit.limit.toLocaleString()} ({limit.period})</div>
                </div>
                <div className="h-2 bg-[var(--highlight)] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-right text-xs text-[var(--text-muted)] mt-1">{percentage.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Hub Tools Definition
// ============================================================

const AUTOMATION_TOOLS: HubTool[] = [
  { id: 'automation-cron', name: 'Cron Management', description: 'スケジュール実行管理', icon: <Clock className="w-4 h-4" />, component: <CronManagementTool />, category: 'system' },
  { id: 'automation-workflow', name: 'Workflow Control', description: 'n8nワークフロー制御', icon: <GitBranch className="w-4 h-4" />, component: <WorkflowControlTool />, category: 'system' },
  { id: 'automation-agent', name: 'Agent Settings', description: 'AIエージェント設定', icon: <Bot className="w-4 h-4" />, component: <AgentSettingsTool />, category: 'system' },
  { id: 'automation-rate-limit', name: 'Rate Limits', description: 'APIレート制限監視', icon: <Gauge className="w-4 h-4" />, component: <RateLimitsTool />, category: 'system' },
];

export default function AutomationHubPage() {
  return (
    <BaseHubLayout
      title="Automation Hub"
      titleEn="Automation Hub"
      description="Cron管理・ワークフロー制御・エージェント設定（Admin専用）"
      icon={<Cog className="w-6 h-6" />}
      tools={AUTOMATION_TOOLS}
      defaultTool="automation-cron"
    />
  );
}
