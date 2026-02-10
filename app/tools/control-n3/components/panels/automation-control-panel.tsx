// app/tools/control-n3/components/panels/automation-control-panel.tsx
/**
 * 🤖 Automation Control Panel
 * 
 * Phase C-2: 自動化マスタースイッチUI
 * 
 * 機能:
 * - 全自動ON/OFF（マスタースイッチ）
 * - 個別ツールON/OFF
 * - 時間帯制御
 * - 優先度変更
 * - 実行スケジュール表示
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Power, Play, Pause, Clock, Calendar, AlertTriangle, CheckCircle,
  RefreshCw, Loader2, Settings, ChevronDown, ChevronRight, Zap,
  Shield, Package, Search, DollarSign, Film, Server, Users, Moon, Sun
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface AutomationSetting {
  id: string;
  tool_id: string;
  tool_name: string;
  category: string;
  enabled: boolean;
  cron_expression: string | null;
  run_window_start: string | null;
  run_window_end: string | null;
  priority: number;
  last_run_at: string | null;
  last_status: string | null;
  next_run_at: string | null;
}

interface Stats {
  total: number;
  enabled: number;
  disabled: number;
  running: number;
  error: number;
}

// カテゴリ設定
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  inventory: { icon: <Package className="w-4 h-4" />, color: '#10B981', label: '在庫' },
  research: { icon: <Search className="w-4 h-4" />, color: '#8B5CF6', label: 'リサーチ' },
  listing: { icon: <Zap className="w-4 h-4" />, color: '#3B82F6', label: '出品' },
  finance: { icon: <DollarSign className="w-4 h-4" />, color: '#F59E0B', label: '経理' },
  media: { icon: <Film className="w-4 h-4" />, color: '#EC4899', label: 'メディア' },
  defense: { icon: <Shield className="w-4 h-4" />, color: '#EF4444', label: '防衛' },
  system: { icon: <Server className="w-4 h-4" />, color: '#6366F1', label: '司令塔' },
  empire: { icon: <Users className="w-4 h-4" />, color: '#14B8A6', label: '帝国' },
};

// ============================================================
// Automation Control Panel
// ============================================================

export function AutomationControlPanel() {
  const [settings, setSettings] = useState<AutomationSetting[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, enabled: 0, disabled: 0, running: 0, error: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(CATEGORY_CONFIG)));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [source, setSource] = useState<'database' | 'mock'>('database');

  // データ取得
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/automation/settings');
      const data = await res.json();
      
      if (data.success) {
        setSettings(data.settings || []);
        setStats(data.stats || { total: 0, enabled: 0, disabled: 0, running: 0, error: 0 });
        setSource(data.source);
      }
    } catch (error) {
      console.error('Failed to fetch automation settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 30000); // 30秒ごと更新
    return () => clearInterval(interval);
  }, [fetchSettings]);

  // トグル処理
  const handleToggle = async (toolId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/automation/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', toolId }),
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchSettings();
      }
    } catch (error) {
      console.error('Toggle failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // マスタースイッチ
  const handleMasterSwitch = async (enable: boolean, category?: string) => {
    if (!enable && !confirm('全自動化を停止しますか？')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/automation/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: enable ? 'enable_all' : 'disable_all',
          category: category !== 'all' ? category : undefined,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchSettings();
        alert(data.message);
      }
    } catch (error) {
      console.error('Master switch failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // カテゴリ別グループ化
  const settingsByCategory = useMemo(() => {
    const grouped: Record<string, AutomationSetting[]> = {};
    settings.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });
    return grouped;
  }, [settings]);

  // フィルタリング
  const filteredCategories = useMemo(() => {
    if (selectedCategory === 'all') return Object.keys(settingsByCategory);
    return [selectedCategory];
  }, [selectedCategory, settingsByCategory]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-3 text-[var(--text-muted)]">自動化設定を読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ソース警告 */}
      {source === 'mock' && (
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <div>
            <div className="font-medium text-yellow-500">モックデータを使用中</div>
            <div className="text-sm text-[var(--text-muted)]">
              automation_settings テーブルが存在しません。
              <code className="mx-1 px-2 py-0.5 bg-[var(--highlight)] rounded text-xs">/docs/sql/automation_settings.sql</code>
              を実行してください。
            </div>
          </div>
        </div>
      )}

      {/* マスタースイッチ */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <Power className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Automation Master Control</h2>
              <p className="text-sm text-[var(--text-muted)]">全自動化の一括制御・夜間運転管理</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchSettings}
              disabled={isSaving}
              className="px-4 py-2 bg-[var(--highlight)] hover:bg-[var(--highlight-hover)] rounded-lg text-sm flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
              更新
            </button>
            
            <button
              onClick={() => handleMasterSwitch(false)}
              disabled={isSaving || stats.enabled === 0}
              className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500/30 rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Pause className="w-4 h-4" />
              全停止
            </button>
            
            <button
              onClick={() => handleMasterSwitch(true)}
              disabled={isSaving}
              className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              全自動開始
            </button>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-5 gap-4">
          {[
            { label: '総ツール', value: stats.total, color: 'text-blue-500', icon: Settings },
            { label: '有効', value: stats.enabled, color: 'text-green-500', icon: CheckCircle },
            { label: '無効', value: stats.disabled, color: 'text-gray-500', icon: Pause },
            { label: '実行中', value: stats.running, color: 'text-yellow-500', icon: Loader2 },
            { label: 'エラー', value: stats.error, color: 'text-red-500', icon: AlertTriangle },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="bg-[var(--highlight)] rounded-lg p-4 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
              <div className={`text-2xl font-bold ${color}`}>{value}</div>
              <div className="text-xs text-[var(--text-muted)]">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 時間帯インジケーター */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            実行時間帯マップ
          </h3>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> 深夜バッチ</span>
            <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> 日中実行</span>
          </div>
        </div>
        <div className="flex h-8 rounded-lg overflow-hidden">
          {Array.from({ length: 24 }).map((_, hour) => {
            const activeTools = settings.filter(s => {
              if (!s.enabled || !s.run_window_start || !s.run_window_end) return false;
              const start = parseInt(s.run_window_start.split(':')[0]);
              const end = parseInt(s.run_window_end.split(':')[0]);
              return hour >= start && hour < end;
            });
            return (
              <div
                key={hour}
                className="flex-1 flex items-center justify-center text-[10px] border-r border-[var(--panel-border)] last:border-r-0"
                style={{
                  background: activeTools.length > 0 
                    ? `rgba(59, 130, 246, ${Math.min(0.2 + activeTools.length * 0.1, 0.8)})` 
                    : 'var(--highlight)',
                }}
                title={activeTools.length > 0 ? `${activeTools.length}件のタスク` : ''}
              >
                {hour}
              </div>
            );
          })}
        </div>
      </div>

      {/* カテゴリフィルタ */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-500/20 text-blue-500'
              : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
          }`}
        >
          全て ({stats.total})
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([cat, config]) => {
          const count = settingsByCategory[cat]?.length || 0;
          const enabledCount = settingsByCategory[cat]?.filter(s => s.enabled).length || 0;
          if (count === 0) return null;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCategory === cat
                  ? 'bg-opacity-20'
                  : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
              style={{
                backgroundColor: selectedCategory === cat ? `${config.color}20` : undefined,
                color: selectedCategory === cat ? config.color : undefined,
              }}
            >
              {config.icon}
              {config.label}
              <span className="text-xs opacity-70">
                {enabledCount}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ツール一覧 */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg overflow-hidden">
        {filteredCategories.map(category => {
          const tools = settingsByCategory[category] || [];
          const config = CATEGORY_CONFIG[category] || { icon: <Settings className="w-4 h-4" />, color: '#6B7280', label: category };
          const isExpanded = expandedCategories.has(category);
          
          return (
            <div key={category}>
              {/* カテゴリヘッダー */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-4 py-3 flex items-center justify-between bg-[var(--highlight)] hover:bg-[var(--highlight-hover)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: config.color }}>{config.icon}</span>
                  <span className="font-bold">{config.label}</span>
                  <span className="text-sm text-[var(--text-muted)]">
                    ({tools.filter(t => t.enabled).length}/{tools.length} 有効)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMasterSwitch(true, category); }}
                    className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded hover:bg-green-500/30"
                  >
                    全有効
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMasterSwitch(false, category); }}
                    className="px-2 py-1 text-xs bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                  >
                    全停止
                  </button>
                  {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
              </button>
              
              {/* ツールリスト */}
              {isExpanded && (
                <div className="divide-y divide-[var(--panel-border)]">
                  {tools.map(tool => (
                    <div key={tool.id} className="px-4 py-3 flex items-center justify-between hover:bg-[var(--highlight)] transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggle(tool.tool_id)}
                            disabled={isSaving}
                            className={`w-12 h-6 rounded-full relative transition-colors ${
                              tool.enabled ? 'bg-green-500' : 'bg-gray-600'
                            }`}
                          >
                            <div
                              className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                tool.enabled ? 'translate-x-7' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <div>
                            <div className="font-medium">{tool.tool_name}</div>
                            <div className="text-xs text-[var(--text-muted)] flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tool.cron_expression || '未設定'}
                              </span>
                              {tool.run_window_start && tool.run_window_end && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {tool.run_window_start} - {tool.run_window_end}
                                </span>
                              )}
                              <span>優先度: {tool.priority}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* 最終実行状態 */}
                        {tool.last_status && (
                          <div className="text-xs text-right">
                            <div className={`flex items-center gap-1 ${
                              tool.last_status === 'success' ? 'text-green-500' :
                              tool.last_status === 'error' ? 'text-red-500' :
                              tool.last_status === 'running' ? 'text-yellow-500' : 'text-gray-500'
                            }`}>
                              {tool.last_status === 'success' && <CheckCircle className="w-3 h-3" />}
                              {tool.last_status === 'error' && <AlertTriangle className="w-3 h-3" />}
                              {tool.last_status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
                              {tool.last_status}
                            </div>
                            {tool.last_run_at && (
                              <div className="text-[var(--text-muted)]">
                                {new Date(tool.last_run_at).toLocaleString('ja-JP', { 
                                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                                })}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* 次回実行 */}
                        {tool.enabled && tool.next_run_at && (
                          <div className="text-xs text-right text-blue-500">
                            <div>次回実行</div>
                            <div>
                              {new Date(tool.next_run_at).toLocaleString('ja-JP', { 
                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AutomationControlPanel;
