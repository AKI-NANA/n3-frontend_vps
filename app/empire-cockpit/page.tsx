// app/empire-cockpit/page.tsx
/**
 * 🏰 Empire Cockpit - 帝国中央司令コクピット
 * 
 * 全142ツールの実行状況、物販・メディアの統合監視ダッシュボード
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Activity, Package, Truck, MessageSquare, Youtube, BookOpen,
  AlertCircle, CheckCircle, XCircle, Clock, RefreshCw, 
  TrendingUp, TrendingDown, ExternalLink, Settings, Zap,
  Play, Pause, BarChart3, PieChart, Globe, DollarSign, 
  Users, Cpu, Database, Server, ChevronRight, ChevronDown, 
  Filter, Search, Eye, ShoppingCart, Box, Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { TOOL_DEFINITIONS } from '@/components/n3/empire/tool-definitions';

// ============================================================
// 型定義
// ============================================================

interface SystemPulse {
  toolId: string;
  toolName: string;
  category: string;
  lastExecution: Date;
  status: 'success' | 'warning' | 'error' | 'running' | 'idle';
  duration?: number;
  message?: string;
  webhookPath: string;
}

interface CommerceStats {
  orders: { total: number; pending: number; shipped: number; change24h: number };
  inventory: { total: number; lowStock: number; outOfStock: number };
  inquiries: { total: number; unresolved: number; avgResponseTime: number };
  revenue: { today: number; week: number; month: number; changeWeek: number };
}

interface MediaStats {
  youtube: { totalViews: number; subscribers: number; latestVideoViews: number; change24h: number; channelCount: number };
  blog: { totalViews: number; todayViews: number; topPosts: { title: string; views: number }[] };
}

// ============================================================
// 定数
// ============================================================

const REFRESH_INTERVAL = 30000;

const STATUS_COLORS: Record<string, string> = {
  success: '#22c55e', warning: '#f59e0b', error: '#ef4444', running: '#3b82f6', idle: '#6b7280',
};

const STATUS_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>> = {
  success: CheckCircle, warning: AlertCircle, error: XCircle, running: RefreshCw, idle: Clock,
};

const CATEGORY_COLORS: Record<string, string> = {
  listing: '#3b82f6', inventory: '#10b981', research: '#8b5cf6', media: '#f59e0b',
  finance: '#ef4444', system: '#6b7280', empire: '#ec4899', defense: '#14b8a6', other: '#78716c',
};

const CATEGORY_LABELS: Record<string, string> = {
  listing: '出品', inventory: '在庫', research: 'リサーチ', media: 'メディア',
  finance: '経理', system: 'システム', empire: '帝国', defense: '防衛', other: 'その他',
};

// ============================================================
// モックデータ生成
// ============================================================

function generateMockPulseData(): SystemPulse[] {
  const tools = Object.entries(TOOL_DEFINITIONS);
  const statuses: SystemPulse['status'][] = ['success', 'success', 'success', 'warning', 'error', 'running', 'idle'];
  return tools.map(([id, config]) => ({
    toolId: id, toolName: config.name, category: config.category,
    lastExecution: new Date(Date.now() - Math.random() * 3600000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    duration: Math.floor(Math.random() * 10000),
    message: config.description, webhookPath: config.webhookPath,
  }));
}

function generateMockCommerceStats(): CommerceStats {
  return {
    orders: { total: 1247, pending: 23, shipped: 1198, change24h: 12.5 },
    inventory: { total: 997, lowStock: 45, outOfStock: 12 },
    inquiries: { total: 156, unresolved: 8, avgResponseTime: 2.3 },
    revenue: { today: 125000, week: 892000, month: 3450000, changeWeek: 8.2 },
  };
}

function generateMockMediaStats(): MediaStats {
  return {
    youtube: { totalViews: 12500000, subscribers: 85000, latestVideoViews: 45000, change24h: 5.2, channelCount: 12 },
    blog: { totalViews: 450000, todayViews: 2300, topPosts: [
      { title: '宅建試験対策ガイド2025', views: 15000 },
      { title: '簿記3級完全攻略', views: 12000 },
    ]},
  };
}

// ============================================================
// サブコンポーネント
// ============================================================

function StatCard({ title, value, change, icon: Icon, color = 'var(--accent)', subtitle }: {
  title: string; value: string | number; change?: number;
  icon: React.ComponentType<{ size?: number }>; color?: string; subtitle?: string;
}) {
  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: change >= 0 ? '#22c55e' : '#ef4444' }}>
            {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{title}</div>
      {subtitle && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>}
    </div>
  );
}

function PulseRow({ pulse, onClick }: { pulse: SystemPulse; onClick: () => void }) {
  const StatusIcon = STATUS_ICONS[pulse.status];
  const categoryColor = CATEGORY_COLORS[pulse.category] || CATEGORY_COLORS.other;
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-2 rounded transition-colors hover:bg-[var(--highlight)]" style={{ textAlign: 'left' }}>
      <StatusIcon size={16} className={pulse.status === 'running' ? 'animate-spin' : ''} style={{ color: STATUS_COLORS[pulse.status] }} />
      <div className="w-2 h-2 rounded-full" style={{ background: categoryColor }} />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate" style={{ color: 'var(--text)' }}>{pulse.toolName}</div>
        <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{pulse.message}</div>
      </div>
      <div className="text-xs text-right" style={{ color: 'var(--text-muted)' }}>
        <div>{pulse.lastExecution.toLocaleTimeString()}</div>
        {pulse.duration && <div>{(pulse.duration / 1000).toFixed(1)}s</div>}
      </div>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
    </button>
  );
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function EmpireCockpitPage() {
  const { user, logout } = useAuth();
  const [pulseData, setPulseData] = useState<SystemPulse[]>([]);
  const [commerceStats, setCommerceStats] = useState<CommerceStats | null>(null);
  const [mediaStats, setMediaStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'error' | 'warning' | 'success'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      setPulseData(generateMockPulseData());
      setCommerceStats(generateMockCommerceStats());
      setMediaStats(generateMockMediaStats());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const filteredPulse = useMemo(() => {
    return pulseData.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (searchQuery && !p.toolName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [pulseData, statusFilter, categoryFilter, searchQuery]);

  const pulseSummary = useMemo(() => {
    const summary = { success: 0, warning: 0, error: 0, running: 0, idle: 0 };
    pulseData.forEach(p => { summary[p.status]++; });
    return summary;
  }, [pulseData]);

  const handlePulseClick = useCallback((pulse: SystemPulse) => {
    window.open(`http://160.16.120.186:5678/workflow`, '_blank');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* ヘッダー */}
      <header style={{ 
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', background: 'var(--panel)', borderBottom: '1px solid var(--panel-border)'
      }}>
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            🏰 Empire Cockpit
          </h1>
          <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: 'var(--accent)', color: 'white' }}>
            {pulseData.length} ツール
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2 px-3 py-1.5 rounded text-sm"
            style={{ 
              background: autoRefresh ? 'var(--accent)' : 'var(--highlight)',
              color: autoRefresh ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)'
            }}
          >
            {autoRefresh ? <Play size={14} /> : <Pause size={14} />}
            {autoRefresh ? '自動更新ON' : '自動更新OFF'}
          </button>
          
          <button onClick={fetchData} className="p-2 rounded" style={{ background: 'var(--highlight)' }}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={{ color: 'var(--text-muted)' }} />
          </button>
          
          <Link href="/tools/editing-n3" className="px-3 py-1.5 rounded text-sm" style={{ background: 'var(--highlight)', color: 'var(--text)', border: '1px solid var(--panel-border)' }}>
            データ編集へ
          </Link>
          
          {user && <button onClick={logout} className="px-3 py-1.5 rounded text-sm" style={{ background: 'transparent', color: 'var(--text-muted)' }}>ログアウト</button>}
        </div>
      </header>

      <div style={{ padding: 24 }}>
        {/* ステータスサマリー */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="p-4 rounded-lg text-center" style={{ background: `${STATUS_COLORS.success}20`, border: `1px solid ${STATUS_COLORS.success}` }}>
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.success }}>{pulseSummary.success}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>成功</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: `${STATUS_COLORS.warning}20`, border: `1px solid ${STATUS_COLORS.warning}` }}>
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.warning }}>{pulseSummary.warning}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>警告</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: `${STATUS_COLORS.error}20`, border: `1px solid ${STATUS_COLORS.error}` }}>
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.error }}>{pulseSummary.error}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>エラー</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: `${STATUS_COLORS.running}20`, border: `1px solid ${STATUS_COLORS.running}` }}>
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.running }}>{pulseSummary.running}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>実行中</div>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: `${STATUS_COLORS.idle}20`, border: `1px solid ${STATUS_COLORS.idle}` }}>
            <div className="text-2xl font-bold" style={{ color: STATUS_COLORS.idle }}>{pulseSummary.idle}</div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>待機中</div>
          </div>
        </div>

        {/* メインコンテンツ: 3カラム */}
        <div className="grid grid-cols-3 gap-6">
          {/* 左カラム: 物販セクション */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <ShoppingCart size={20} style={{ color: '#3b82f6' }} />
              物販セクション
            </h2>
            
            {commerceStats && (
              <div className="space-y-4">
                <StatCard title="本日の売上" value={`¥${commerceStats.revenue.today.toLocaleString()}`} change={commerceStats.revenue.changeWeek} icon={DollarSign} color="#22c55e" subtitle={`週間: ¥${commerceStats.revenue.week.toLocaleString()}`} />
                <StatCard title="受注数" value={commerceStats.orders.total} change={commerceStats.orders.change24h} icon={Package} color="#3b82f6" subtitle={`保留: ${commerceStats.orders.pending}件`} />
                <StatCard title="出荷待ち" value={commerceStats.orders.pending} icon={Truck} color="#f59e0b" />
                <StatCard title="未対応問い合わせ" value={commerceStats.inquiries.unresolved} icon={MessageSquare} color="#ef4444" subtitle={`平均応答: ${commerceStats.inquiries.avgResponseTime}h`} />
                <StatCard title="在庫数" value={commerceStats.inventory.total} icon={Box} color="#8b5cf6" subtitle={`在庫切れ: ${commerceStats.inventory.outOfStock}件`} />
              </div>
            )}
          </div>

          {/* 中央カラム: システムパルス */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Activity size={20} style={{ color: '#ec4899' }} />
              システムパルス
            </h2>
            
            {/* フィルター */}
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ツール検索..."
                  className="w-full pl-8 pr-3 py-1.5 rounded text-sm"
                  style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
                />
              </div>
              <select
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-2 py-1.5 rounded text-sm"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
              >
                <option value="all">全ステータス</option>
                <option value="error">エラーのみ</option>
                <option value="warning">警告のみ</option>
                <option value="success">成功のみ</option>
              </select>
              <select
                value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1.5 rounded text-sm"
                style={{ background: 'var(--input-bg)', border: '1px solid var(--panel-border)', color: 'var(--text)' }}
              >
                <option value="all">全カテゴリ</option>
                {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            {/* パルスリスト */}
            <div 
              className="rounded-lg overflow-hidden"
              style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', maxHeight: 500, overflowY: 'auto' }}
            >
              {filteredPulse.length === 0 ? (
                <div className="p-8 text-center" style={{ color: 'var(--text-muted)' }}>
                  該当するツールがありません
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: 'var(--panel-border)' }}>
                  {filteredPulse.slice(0, 30).map(pulse => (
                    <PulseRow key={pulse.toolId} pulse={pulse} onClick={() => handlePulseClick(pulse)} />
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-2 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              {filteredPulse.length}件表示 / 全{pulseData.length}件
            </div>
          </div>

          {/* 右カラム: メディアセクション */}
          <div>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text)' }}>
              <Youtube size={20} style={{ color: '#ef4444' }} />
              メディアセクション
            </h2>
            
            {mediaStats && (
              <div className="space-y-4">
                <StatCard title="YouTube総再生数" value={mediaStats.youtube.totalViews} change={mediaStats.youtube.change24h} icon={Eye} color="#ef4444" subtitle={`${mediaStats.youtube.channelCount}チャンネル`} />
                <StatCard title="チャンネル登録者" value={mediaStats.youtube.subscribers} icon={Users} color="#ef4444" />
                <StatCard title="最新動画再生数" value={mediaStats.youtube.latestVideoViews} icon={Play} color="#f59e0b" />
                <StatCard title="ブログ本日PV" value={mediaStats.blog.todayViews} icon={BookOpen} color="#8b5cf6" subtitle={`累計: ${mediaStats.blog.totalViews.toLocaleString()}`} />
                
                {/* 人気記事 */}
                <div className="p-4 rounded-lg" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>📊 人気記事TOP3</h3>
                  <div className="space-y-2">
                    {mediaStats.blog.topPosts.map((post, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--highlight)' }}>
                        <span className="text-sm truncate flex-1" style={{ color: 'var(--text)' }}>{post.title}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{post.views.toLocaleString()} PV</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* クイックリンク */}
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>🔗 クイックリンク</h2>
          <div className="grid grid-cols-6 gap-3">
            <Link href="/tools/editing-n3" className="p-4 rounded-lg text-center transition-colors hover:bg-[var(--highlight)]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <Database size={24} className="mx-auto mb-2" style={{ color: '#3b82f6' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>データ編集</span>
            </Link>
            <Link href="/tools/listing-n3" className="p-4 rounded-lg text-center transition-colors hover:bg-[var(--highlight)]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <Package size={24} className="mx-auto mb-2" style={{ color: '#10b981' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>出品管理</span>
            </Link>
            <Link href="/tools/operations-n3" className="p-4 rounded-lg text-center transition-colors hover:bg-[var(--highlight)]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <Cpu size={24} className="mx-auto mb-2" style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>運用</span>
            </Link>
            <Link href="/tools/research-n3" className="p-4 rounded-lg text-center transition-colors hover:bg-[var(--highlight)]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <Search size={24} className="mx-auto mb-2" style={{ color: '#f59e0b' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>リサーチ</span>
            </Link>
            <Link href="/tools/analytics-n3" className="p-4 rounded-lg text-center transition-colors hover:bg-[var(--highlight)]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <BarChart3 size={24} className="mx-auto mb-2" style={{ color: '#ec4899' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>分析</span>
            </Link>
            <a href="http://160.16.120.186:5678" target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg text-center transition-colors hover:bg-[var(--highlight)]" style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)' }}>
              <Server size={24} className="mx-auto mb-2" style={{ color: '#14b8a6' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>n8n</span>
            </a>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer style={{ padding: '16px 24px', borderTop: '1px solid var(--panel-border)', background: 'var(--panel)' }}>
        <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>© 2025 N3 Empire OS</span>
          <span>v3.0.0 • 最終更新: {new Date().toLocaleTimeString()}</span>
        </div>
      </footer>
    </div>
  );
}
