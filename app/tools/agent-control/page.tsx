// app/tools/agent-control/page.tsx
/**
 * N3 Empire OS V8 - AIエージェント制御UI
 * 
 * 機能:
 * 1. 全23個のAIエージェント一覧
 * 2. ON/OFF切替
 * 3. 自動/HitLモード切替
 * 4. 確信度閾値設定
 * 5. コスト上限設定
 * 6. 実行統計表示
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bot, Play, Pause, Settings, CheckCircle, XCircle, AlertCircle,
  Loader2, RefreshCw, Shield, ShieldAlert, Zap, DollarSign, 
  Sliders, BarChart3, Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { N3CollapsibleHeader, N3Footer } from '@/components/n3';
import { createClient } from '@/lib/supabase/client';

interface AgentConfig {
  id: string;
  agent_type: string;
  is_enabled: boolean;
  auto_mode: boolean;
  hitl_threshold: number;
  max_iterations: number;
  model_name: string;
  temperature: number;
  max_tokens: number;
  tools_enabled: string[];
  custom_instructions: string | null;
  retry_on_errors: string[];
  daily_limit: number | null;
  daily_count: number;
  cost_per_execution_usd: number | null;
  updated_at: string;
}

const AGENT_LABELS: Record<string, { name: string; description: string; category: string }> = {
  'sm_research': { name: 'SM リサーチ Agent', description: 'eBay類似商品検索・マッチング', category: 'リサーチ' },
  'error_recovery': { name: 'エラー復旧 Agent', description: '出品エラーの自動修復', category: '復旧' },
  'data_enrichment': { name: 'データ強化 Agent', description: '商品情報のAI補完', category: '強化' },
  'research_agent': { name: '自律型リサーチ Agent', description: '市場調査・商品発掘', category: 'リサーチ' },
  'price_defense': { name: '価格防衛 Agent', description: '競合価格監視・自動調整', category: '防衛' },
  'listing_hub': { name: '出品ハブ Agent', description: '販路最適化・自動出品', category: '出品' },
  'stock_killer': { name: '在庫同期 Agent', description: '全販路在庫一括同期', category: '在庫' },
  'media_video_gen': { name: '動画生成 Agent', description: 'Remotion動画自動生成', category: 'メディア' },
  'media_audio_gen': { name: '音声生成 Agent', description: 'ElevenLabs音声合成', category: 'メディア' },
  'trend_agent': { name: 'トレンド Agent', description: '市場トレンド分析', category: 'リサーチ' },
  'ai_category_map': { name: 'カテゴリ分類 Agent', description: 'eBayカテゴリ自動判定', category: '分類' },
  'ai_inquiry_reply': { name: '問い合わせ返信 Agent', description: '顧客問い合わせ自動返信', category: '対応' },
  'defense_copyright': { name: '著作権防衛 Agent', description: '著作権リスク検知', category: '防衛' },
  'defense_ban': { name: 'BAN検知 Agent', description: 'アカウントBAN予防', category: '防衛' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'リサーチ': '#8b5cf6',
  '復旧': '#f59e0b',
  '強化': '#10b981',
  '出品': '#3b82f6',
  '在庫': '#10b981',
  'メディア': '#f59e0b',
  '分類': '#6b7280',
  '対応': '#ec4899',
  '防衛': '#14b8a6',
};

export default function AgentControlPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  
  const supabase = createClient();

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_agent_config')
        .select('*')
        .order('agent_type');
      
      if (error) throw error;
      setAgents(data || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const updateAgent = useCallback(async (agentType: string, updates: Partial<AgentConfig>) => {
    try {
      await supabase
        .from('ai_agent_config')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('agent_type', agentType);
      
      setAgents(prev => prev.map(a => 
        a.agent_type === agentType ? { ...a, ...updates } : a
      ));
    } catch (err) {
      console.error('Update failed:', err);
    }
  }, [supabase]);

  const stats = {
    total: agents.length,
    enabled: agents.filter(a => a.is_enabled).length,
    autoMode: agents.filter(a => a.auto_mode).length,
    hitlMode: agents.filter(a => !a.auto_mode && a.is_enabled).length,
    todayExecutions: agents.reduce((sum, a) => sum + a.daily_count, 0)
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <div id="main-scroll-container" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto' }}>
        
        <N3CollapsibleHeader scrollContainerId="main-scroll-container" threshold={10}>
          <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)' }}>
            <div className="flex items-center gap-3">
              <Bot size={24} style={{ color: 'var(--accent)' }} />
              <h1 className="text-lg font-bold" style={{ color: 'var(--text)' }}>🤖 AIエージェント制御</h1>
              <span className="px-2 py-0.5 rounded text-xs" style={{ background: '#8b5cf6', color: 'white' }}>23 Agents</span>
            </div>
            
            <button onClick={fetchAgents} className="flex items-center gap-1 px-3 py-1.5 rounded text-sm" style={{ background: 'var(--highlight)', border: '1px solid var(--panel-border)' }}>
              <RefreshCw size={14} />
              更新
            </button>
          </div>
          
          {/* 統計バー */}
          <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', background: 'var(--highlight)', borderBottom: '1px solid var(--panel-border)', fontSize: 13 }}>
            <span style={{ color: '#22c55e' }}>有効: <strong>{stats.enabled}</strong></span>
            <span style={{ color: '#f59e0b' }}>自動: <strong>{stats.autoMode}</strong></span>
            <span style={{ color: '#14b8a6' }}>HitL: <strong>{stats.hitlMode}</strong></span>
            <span className="ml-auto" style={{ color: 'var(--text-muted)' }}>本日実行: <strong>{stats.todayExecutions}</strong></span>
          </div>
        </N3CollapsibleHeader>

        {/* メインコンテンツ */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* エージェント一覧 */}
          <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
            {loading ? (
              <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent)' }} /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agents.map(agent => {
                  const info = AGENT_LABELS[agent.agent_type] || { name: agent.agent_type, description: '', category: 'その他' };
                  const catColor = CATEGORY_COLORS[info.category] || '#6b7280';
                  
                  return (
                    <div 
                      key={agent.agent_type}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${selectedAgent?.agent_type === agent.agent_type ? 'ring-2 ring-offset-2' : ''}`}
                      style={{ 
                        background: 'var(--panel)',
                        border: '1px solid var(--panel-border)',
                        opacity: agent.is_enabled ? 1 : 0.5,
                        ringColor: 'var(--accent)'
                      }}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <div className="flex items-start gap-3">
                        {/* ON/OFF Toggle */}
                        <button
                          onClick={(e) => { e.stopPropagation(); updateAgent(agent.agent_type, { is_enabled: !agent.is_enabled }); }}
                          className={`mt-1 w-10 h-5 rounded-full relative ${agent.is_enabled ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${agent.is_enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: catColor, color: 'white' }}>
                              {info.category}
                            </span>
                            <h3 className="font-medium text-sm" style={{ color: 'var(--text)' }}>{info.name}</h3>
                          </div>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{info.description}</p>
                          
                          <div className="flex items-center gap-3 mt-2">
                            {/* 自動モードバッジ */}
                            <span className={`flex items-center gap-1 text-xs ${agent.auto_mode ? 'text-amber-600' : 'text-gray-400'}`}>
                              <Zap size={12} />
                              {agent.auto_mode ? '自動' : '手動'}
                            </span>
                            
                            {/* HitL閾値 */}
                            {!agent.auto_mode && (
                              <span className="flex items-center gap-1 text-xs text-teal-600">
                                <Shield size={12} />
                                HitL {agent.hitl_threshold}%
                              </span>
                            )}
                            
                            {/* 本日実行数 */}
                            {agent.daily_count > 0 && (
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                今日: {agent.daily_count}回
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* クイックアクション */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateAgent(agent.agent_type, { auto_mode: !agent.auto_mode }); }}
                            title={agent.auto_mode ? 'HitLモードに切替' : '自動モードに切替'}
                            className={`p-1.5 rounded ${agent.auto_mode ? 'bg-amber-100' : 'hover:bg-gray-100'}`}
                          >
                            <Zap size={14} style={{ color: agent.auto_mode ? '#f59e0b' : 'var(--text-muted)' }} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* 詳細パネル */}
          {selectedAgent && (
            <div style={{ width: 360, borderLeft: '1px solid var(--panel-border)', background: 'var(--panel)', overflow: 'auto' }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                <h2 className="font-bold" style={{ color: 'var(--text)' }}>
                  {AGENT_LABELS[selectedAgent.agent_type]?.name || selectedAgent.agent_type}
                </h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {AGENT_LABELS[selectedAgent.agent_type]?.description}
                </p>
              </div>
              
              <div className="p-4 space-y-4">
                {/* モデル設定 */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>AIモデル</label>
                  <select
                    value={selectedAgent.model_name}
                    onChange={(e) => updateAgent(selectedAgent.agent_type, { model_name: e.target.value })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
                  >
                    <option value="gpt-4o-mini">GPT-4o mini (安価)</option>
                    <option value="gpt-4o">GPT-4o (高性能)</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                  </select>
                </div>
                
                {/* HitL閾値 */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    HitL発動閾値: {selectedAgent.hitl_threshold}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={selectedAgent.hitl_threshold}
                    onChange={(e) => updateAgent(selectedAgent.agent_type, { hitl_threshold: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    確信度がこの値未満の場合、人間の承認を要求
                  </p>
                </div>
                
                {/* 日次上限 */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>日次実行上限</label>
                  <input
                    type="number"
                    value={selectedAgent.daily_limit || ''}
                    onChange={(e) => updateAgent(selectedAgent.agent_type, { daily_limit: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
                    placeholder="無制限"
                  />
                </div>
                
                {/* 最大イテレーション */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>最大試行回数</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={selectedAgent.max_iterations}
                    onChange={(e) => updateAgent(selectedAgent.agent_type, { max_iterations: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded text-sm"
                    style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
                  />
                </div>
                
                {/* Temperature */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Temperature: {selectedAgent.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedAgent.temperature}
                    onChange={(e) => updateAgent(selectedAgent.agent_type, { temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                
                {/* 有効ツール */}
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>有効ツール</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedAgent.tools_enabled?.map(tool => (
                      <span key={tool} className="px-2 py-0.5 rounded text-xs" style={{ background: 'var(--highlight)', color: 'var(--text)' }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* カスタム指示 */}
                {selectedAgent.custom_instructions && (
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>カスタム指示</label>
                    <p className="text-xs p-2 rounded" style={{ background: 'var(--highlight)', color: 'var(--text)' }}>
                      {selectedAgent.custom_instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <N3Footer copyright="© 2025 N3 Empire" version="v8.0.0" status={{ label: 'Agents', connected: true }} />
      </div>
    </div>
  );
}
