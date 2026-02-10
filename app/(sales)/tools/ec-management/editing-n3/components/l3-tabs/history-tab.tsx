// app/tools/editing-n3/components/l3-tabs/history-tab.tsx
/**
 * 履歴・監査タブ - 改良版
 * 
 * 機能:
 * 1. 出品スケジューラー - カレンダー/リストビューで日付ごとにスケジュール確認
 *    - 日付クリックでその日の詳細リスト表示
 *    - マーケット/アカウント別の集計表示
 *    - 正確な出品予定時間表示
 *    - 完了アイコン表示
 *    - 個別取り下げ機能
 * 2. 在庫監視 - 在庫変動・価格変動の検出と対応
 * 3. 実行ログ - 過去の出品ログ
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Calendar, 
  Package, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  List,
  Grid3X3,
  Eye,
  ExternalLink,
  X,
  Trash2,
  Ban,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { N3Button, N3StatsBar, N3Divider } from '@/components/n3';

// ============================================================
// 型定義
// ============================================================

type HistorySubTab = 'scheduler' | 'monitoring' | 'logs';
type ViewMode = 'calendar' | 'list';

interface ScheduleItem {
  id: string;
  product_id: number;
  scheduled_at: string | null;
  marketplace: string;
  account_id: string;
  status: 'PENDING' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'ERROR' | 'CANCELLED';
  listing_strategy?: string;
  priority?: number;
  created_at: string;
  products_master?: {
    id: number;
    sku?: string;
    title?: string;
    title_en?: string;
    english_title?: string;
    ai_confidence_score?: number;
    listing_score?: number;
    primary_image_url?: string;
    category_name?: string;      // 🔥 カテゴリー名追加
    ebay_category_id?: string;   // 🔥 eBayカテゴリーID
  };
}

interface MonitoringChange {
  id: string;
  product_id: number;
  change_category: 'inventory' | 'price' | 'both' | 'page_error';
  status: 'pending' | 'approved' | 'applied';
  detected_at: string;
  inventory_change?: {
    old_stock?: number;
    new_stock?: number;
  };
  price_change?: {
    old_price_jpy?: number;
    new_price_jpy?: number;
  };
  products_master?: {
    sku?: string;
    title?: string;
  };
}

interface ListingLog {
  id: string;
  product_id: number;
  schedule_id?: string;
  marketplace: string;
  account: string;
  listed_at: string;
  listing_id?: string;
  status: 'success' | 'failed';
  error_message?: string;
  products_master?: {
    sku?: string;
    title?: string;
  };
}

interface HistoryStats {
  todayListings: number;
  pendingSchedules: number;
  inventoryAlerts: number;
  priceAlerts: number;
  errors: number;
  scheduledToday: number;
}

// アカウント別サマリー
interface AccountSummary {
  marketplace: string;
  account: string;
  total: number;
  completed: number;
  pending: number;
  running: number;
  error: number;
}

// 日付サマリー
interface DaySummary {
  date: string;
  displayDate: string;
  dayOfWeek: number;
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  errorCount: number;
  accountSummaries: AccountSummary[];
  schedules: ScheduleItem[];
}

// サブタブの定義
const SUB_TABS: { id: HistorySubTab; label: string; icon: React.ReactNode }[] = [
  { id: 'scheduler', label: '出品スケジューラー', icon: <Calendar size={14} /> },
  { id: 'monitoring', label: '在庫監視', icon: <Package size={14} /> },
  { id: 'logs', label: '出品履歴', icon: <Clock size={14} /> },
];

// ============================================================
// HistoryTab メインコンポーネント
// ============================================================

export function HistoryTab() {
  const [activeSubTab, setActiveSubTab] = useState<HistorySubTab>('scheduler');
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const [stats, setStats] = useState<HistoryStats>({
    todayListings: 0,
    pendingSchedules: 0,
    inventoryAlerts: 0,
    priceAlerts: 0,
    errors: 0,
    scheduledToday: 0,
  });

  // データ
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [changes, setChanges] = useState<MonitoringChange[]>([]);
  const [logs, setLogs] = useState<ListingLog[]>([]);

  // 統計情報を取得
  const fetchStats = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEnd = new Date(today);
      todayEnd.setHours(23, 59, 59, 999);

      const [
        { count: pendingCount },
        { count: scheduledTodayCount },
        { count: completedTodayCount },
        { count: errorCount },
        { count: inventoryAlerts },
        { count: priceAlerts },
      ] = await Promise.all([
        supabase.from('listing_schedule').select('*', { count: 'exact', head: true })
          .in('status', ['PENDING', 'SCHEDULED']),
        supabase.from('listing_schedule').select('*', { count: 'exact', head: true })
          .gte('scheduled_at', today.toISOString())
          .lte('scheduled_at', todayEnd.toISOString())
          .in('status', ['PENDING', 'SCHEDULED']),
        supabase.from('listing_schedule').select('*', { count: 'exact', head: true })
          .eq('status', 'COMPLETED')
          .gte('scheduled_at', today.toISOString()),
        supabase.from('listing_schedule').select('*', { count: 'exact', head: true })
          .eq('status', 'ERROR'),
        supabase.from('unified_changes').select('*', { count: 'exact', head: true })
          .eq('status', 'pending').eq('change_category', 'inventory'),
        supabase.from('unified_changes').select('*', { count: 'exact', head: true })
          .eq('status', 'pending').eq('change_category', 'price'),
      ]);

      setStats({
        todayListings: completedTodayCount || 0,
        pendingSchedules: pendingCount || 0,
        inventoryAlerts: inventoryAlerts || 0,
        priceAlerts: priceAlerts || 0,
        errors: errorCount || 0,
        scheduledToday: scheduledTodayCount || 0,
      });
    } catch (error) {
      console.error('統計取得エラー:', error);
    }
  }, []);

  // スケジュールデータを取得
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      console.log('[HistoryTab] Fetching schedules...');
      
      // 全てのPENDING/SCHEDULEDスケジュールを取得（月フィルタなし）
      const { data, error } = await supabase
        .from('listing_schedule')
        .select(`
          id,
          product_id,
          scheduled_at,
          marketplace,
          account_id,
          status,
          listing_strategy,
          priority,
          created_at,
          products_master!listing_schedule_product_id_fkey (
            id,
            sku,
            title,
            title_en,
            english_title,
            ai_confidence_score,
            listing_score,
            primary_image_url,
            category_name,
            ebay_category_id
          )
        `)
        .in('status', ['PENDING', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'ERROR'])
        .order('scheduled_at', { ascending: true, nullsFirst: false });

      if (error) {
        console.error('[HistoryTab] スケジュール取得エラー:', error.message, error);
        setSchedules([]);
        return;
      }
      console.log('[HistoryTab] 取得スケジュール:', data?.length || 0, '件', data);
      setSchedules(data || []);
    } catch (error) {
      console.error('[HistoryTab] スケジュール取得エラー:', error);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 変動データを取得
  const fetchChanges = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('unified_changes')
        .select(`
          id,
          product_id,
          change_category,
          status,
          detected_at,
          inventory_change,
          price_change,
          products_master (
            sku,
            title
          )
        `)
        .order('detected_at', { ascending: false })
        .limit(100);

      if (error) {
        setChanges([]);
        return;
      }
      setChanges(data || []);
    } catch (error) {
      setChanges([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 実行ログを取得
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listing_history')
        .select(`
          id,
          product_id,
          schedule_id,
          marketplace,
          account,
          listed_at,
          listing_id,
          status,
          error_message
        `)
        .order('listed_at', { ascending: false })
        .limit(100);

      if (error) {
        setLogs([]);
        return;
      }
      setLogs(data || []);
    } catch (error) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // スケジュールをキャンセル
  const cancelSchedule = useCallback(async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('listing_schedule')
        .update({ status: 'CANCELLED' })
        .eq('id', scheduleId);
      
      if (error) throw error;
      
      // ローカル状態を更新
      setSchedules(prev => prev.map(s => 
        s.id === scheduleId ? { ...s, status: 'CANCELLED' as const } : s
      ));
      fetchStats();
    } catch (error) {
      console.error('キャンセルエラー:', error);
      alert('スケジュールのキャンセルに失敗しました');
    }
  }, [fetchStats]);

  // 初期読み込み
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // タブ切り替え時にデータ取得
  useEffect(() => {
    switch (activeSubTab) {
      case 'scheduler':
        fetchSchedules();
        break;
      case 'monitoring':
        fetchChanges();
        break;
      case 'logs':
        fetchLogs();
        break;
    }
  }, [activeSubTab, fetchSchedules, fetchChanges, fetchLogs]);

  // 月移動時にスケジュール再取得
  useEffect(() => {
    if (activeSubTab === 'scheduler') {
      fetchSchedules();
      setSelectedDate(null);
    }
  }, [currentMonth, activeSubTab, fetchSchedules]);

  // リフレッシュ
  const handleRefresh = () => {
    fetchStats();
    switch (activeSubTab) {
      case 'scheduler':
        fetchSchedules();
        break;
      case 'monitoring':
        fetchChanges();
        break;
      case 'logs':
        fetchLogs();
        break;
    }
  };

  // 月移動
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const monthName = currentMonth.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });

  return (
    <div style={{ padding: 12 }}>
      {/* 統計サマリー */}
      <div style={{ marginBottom: 16 }}>
        <N3StatsBar
          stats={[
            { label: '本日出品', value: stats.todayListings, color: 'green' },
            { label: '本日予定', value: stats.scheduledToday, color: 'blue' },
            { label: 'スケジュール待ち', value: stats.pendingSchedules, color: 'purple' },
            { label: '在庫アラート', value: stats.inventoryAlerts, color: 'yellow' },
            { label: '価格アラート', value: stats.priceAlerts, color: 'orange' },
            { label: 'エラー', value: stats.errors, color: 'red' },
          ]}
          size="compact"
          gap={12}
        />
      </div>

      {/* サブタブナビゲーション */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--panel-border)',
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {SUB_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                background: activeSubTab === tab.id ? 'var(--accent)' : 'var(--panel)',
                color: activeSubTab === tab.id ? 'white' : 'var(--text-muted)',
                border: '1px solid',
                borderColor: activeSubTab === tab.id ? 'var(--accent)' : 'var(--panel-border)',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {activeSubTab === 'scheduler' && (
            <>
              <button
                onClick={() => { setViewMode('calendar'); setSelectedDate(null); }}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'calendar' && !selectedDate ? 'var(--accent)' : 'var(--panel)',
                  color: viewMode === 'calendar' && !selectedDate ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                }}
              >
                <Grid3X3 size={14} />
                カレンダー
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 10px',
                  background: viewMode === 'list' || selectedDate ? 'var(--accent)' : 'var(--panel)',
                  color: viewMode === 'list' || selectedDate ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                }}
              >
                <List size={14} />
                リスト
              </button>
              <N3Divider orientation="vertical" style={{ height: 20 }} />
            </>
          )}
          
          <N3Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            更新
          </N3Button>
        </div>
      </div>

      {/* コンテンツ */}
      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px' }} />
          読み込み中...
        </div>
      ) : (
        <>
          {activeSubTab === 'scheduler' && (
            <SchedulerContent 
              schedules={schedules}
              viewMode={viewMode}
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={prevMonth}
              onNextMonth={nextMonth}
              monthName={monthName}
              onCancelSchedule={cancelSchedule}
            />
          )}
          {activeSubTab === 'monitoring' && <MonitoringContent changes={changes} />}
          {activeSubTab === 'logs' && <LogsContent logs={logs} />}
        </>
      )}
    </div>
  );
}

// ============================================================
// スケジューラーコンテンツ
// ============================================================

function SchedulerContent({ 
  schedules,
  viewMode,
  currentMonth,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  monthName,
  onCancelSchedule,
}: { 
  schedules: ScheduleItem[];
  viewMode: ViewMode;
  currentMonth: Date;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  monthName: string;
  onCancelSchedule: (id: string) => void;
}) {
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
  const today = new Date().toISOString().split('T')[0];

  // 日付ごとのサマリーを計算（scheduled_atがnullのものは「未スケジュール」としてグループ化）
  const { daySummaries, unscheduledItems } = useMemo(() => {
    const summaries: Record<string, DaySummary> = {};
    const unscheduled: ScheduleItem[] = [];
    
    schedules.forEach(schedule => {
      // scheduled_at が null の場合は未スケジュールリストへ
      if (!schedule.scheduled_at) {
        unscheduled.push(schedule);
        return;
      }
      
      const dateKey = schedule.scheduled_at.split('T')[0];
      
      if (!summaries[dateKey]) {
        const date = new Date(dateKey);
        summaries[dateKey] = {
          date: dateKey,
          displayDate: date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
          dayOfWeek: date.getDay(),
          totalCount: 0,
          completedCount: 0,
          pendingCount: 0,
          errorCount: 0,
          accountSummaries: [],
          schedules: [],
        };
      }
      
      summaries[dateKey].schedules.push(schedule);
      summaries[dateKey].totalCount++;
      
      if (schedule.status === 'COMPLETED') summaries[dateKey].completedCount++;
      else if (['PENDING', 'SCHEDULED'].includes(schedule.status)) summaries[dateKey].pendingCount++;
      else if (schedule.status === 'ERROR') summaries[dateKey].errorCount++;
    });
    
    // アカウント別サマリーを計算
    Object.values(summaries).forEach(day => {
      const accountMap: Record<string, AccountSummary> = {};
      
      day.schedules.forEach(s => {
        const key = `${s.marketplace}:${s.account_id}`;
        if (!accountMap[key]) {
          accountMap[key] = {
            marketplace: s.marketplace,
            account: s.account_id,
            total: 0,
            completed: 0,
            pending: 0,
            running: 0,
            error: 0,
          };
        }
        accountMap[key].total++;
        if (s.status === 'COMPLETED') accountMap[key].completed++;
        else if (['PENDING', 'SCHEDULED'].includes(s.status)) accountMap[key].pending++;
        else if (s.status === 'RUNNING') accountMap[key].running++;
        else if (s.status === 'ERROR') accountMap[key].error++;
      });
      
      day.accountSummaries = Object.values(accountMap);
      
      // 時間順にソート
      day.schedules.sort((a, b) => {
        const timeA = a.scheduled_at ? new Date(a.scheduled_at).getTime() : 0;
        const timeB = b.scheduled_at ? new Date(b.scheduled_at).getTime() : 0;
        return timeA - timeB;
      });
    });
    
    return { daySummaries: summaries, unscheduledItems: unscheduled };
  }, [schedules]);

  // カレンダーグリッド生成
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days: (DaySummary | null)[] = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      days.push(daySummaries[dateStr] || {
        date: dateStr,
        displayDate: date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' }),
        dayOfWeek: date.getDay(),
        totalCount: 0,
        completedCount: 0,
        pendingCount: 0,
        errorCount: 0,
        accountSummaries: [],
        schedules: [],
      });
    }
    return days;
  }, [currentMonth, daySummaries]);

  // 選択日のスケジュール
  const selectedDaySchedules = selectedDate ? (daySummaries[selectedDate]?.schedules || []) : [];

  // スケジュールがない場合（未スケジュールも含む）
  if (schedules.length === 0) {
    return (
      <div style={{ 
        padding: 48, 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>スケジュールがありません</div>
        <div style={{ fontSize: 13 }}>
          承認ページで商品を承認して出品スケジュールを作成しましょう
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 月ナビゲーション */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 16,
        padding: '8px 12px',
        background: 'var(--panel)',
        borderRadius: 6,
        border: '1px solid var(--panel-border)',
      }}>
        <button onClick={onPrevMonth} style={navBtnStyle}>
          <ChevronLeft size={16} /> 前月
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{monthName}</span>
          {selectedDate && (
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              padding: '4px 10px',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: 4,
              fontSize: 13,
            }}>
              {new Date(selectedDate).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })}
              <button 
                onClick={() => onSelectDate(null)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  padding: 0,
                  display: 'flex',
                  color: 'white',
                }}
              >
                <X size={14} />
              </button>
            </span>
          )}
        </div>
        <button onClick={onNextMonth} style={navBtnStyle}>
          翌月 <ChevronRight size={16} />
        </button>
      </div>

      {/* カレンダービュー（日付選択なし時） */}
      {viewMode === 'calendar' && !selectedDate && (
        <div style={{ 
          background: 'var(--panel)', 
          borderRadius: 8, 
          border: '2px solid var(--panel-border)',
          overflow: 'hidden',
        }}>
          {/* 曜日ヘッダー */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            borderBottom: '2px solid var(--panel-border)',
          }}>
            {weekDays.map((day, idx) => (
              <div key={day} style={{ 
                padding: '10px 4px', 
                textAlign: 'center', 
                fontWeight: 700, 
                fontSize: 12,
                color: idx === 0 ? 'rgb(239, 68, 68)' : idx === 6 ? 'rgb(59, 130, 246)' : 'var(--text)',
                background: 'var(--highlight)',
                borderRight: idx < 6 ? '1px solid var(--panel-border)' : 'none',
              }}>
                {day}
              </div>
            ))}
          </div>
          
          {/* カレンダーグリッド */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((day, idx) => {
              if (!day) {
                return (
                  <div key={`empty-${idx}`} style={{ 
                    minHeight: 100, 
                    background: 'var(--highlight)', 
                    opacity: 0.5,
                    borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--panel-border)' : 'none',
                    borderBottom: '1px solid var(--panel-border)',
                  }} />
                );
              }
              
              const isToday = day.date === today;
              const dayNum = parseInt(day.date.split('-')[2]);
              const hasSchedules = day.totalCount > 0;
              
              return (
                <div 
                  key={day.date}
                  onClick={() => hasSchedules && onSelectDate(day.date)}
                  style={{
                    minHeight: 100,
                    padding: 6,
                    borderRight: (idx + 1) % 7 !== 0 ? '1px solid var(--panel-border)' : 'none',
                    borderBottom: '1px solid var(--panel-border)',
                    background: isToday ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                    cursor: hasSchedules ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => hasSchedules && (e.currentTarget.style.background = 'var(--highlight)')}
                  onMouseLeave={(e) => e.currentTarget.style.background = isToday ? 'rgba(59, 130, 246, 0.08)' : 'transparent'}
                >
                  {/* 日付ヘッダー */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}>
                    <span style={{ 
                      fontSize: 14, 
                      fontWeight: isToday ? 700 : 500,
                      color: isToday ? 'rgb(59, 130, 246)' : day.dayOfWeek === 0 ? 'rgb(239, 68, 68)' : day.dayOfWeek === 6 ? 'rgb(59, 130, 246)' : 'var(--text)',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: isToday ? 'rgb(59, 130, 246)' : 'transparent',
                      ...(isToday && { color: 'white' }),
                    }}>
                      {dayNum}
                    </span>
                    {day.totalCount > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {day.completedCount > 0 && (
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            fontSize: 10, 
                            fontWeight: 600,
                            color: 'rgb(34, 197, 94)',
                          }}>
                            <CheckCircle2 size={10} /> {day.completedCount}
                          </span>
                        )}
                        {day.pendingCount > 0 && (
                          <span style={{ 
                            fontSize: 10, 
                            fontWeight: 600,
                            padding: '1px 4px',
                            background: 'rgba(59, 130, 246, 0.15)',
                            color: 'rgb(59, 130, 246)',
                            borderRadius: 4,
                          }}>
                            {day.pendingCount}件
                          </span>
                        )}
                        {day.errorCount > 0 && (
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            fontSize: 10, 
                            fontWeight: 600,
                            color: 'rgb(239, 68, 68)',
                          }}>
                            <XCircle size={10} /> {day.errorCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* アカウント別サマリー */}
                  <div style={{ fontSize: 10, lineHeight: 1.5 }}>
                    {day.accountSummaries.slice(0, 3).map((acc, i) => (
                      <div 
                        key={`${acc.marketplace}-${acc.account}-${i}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '2px 4px',
                          marginBottom: 2,
                          background: 'var(--highlight)',
                          borderRadius: 3,
                          borderLeft: `3px solid ${getMarketplaceColor(acc.marketplace)}`,
                        }}
                      >
                        <span style={{ 
                          fontWeight: 600, 
                          color: getMarketplaceColor(acc.marketplace),
                          textTransform: 'uppercase',
                        }}>
                          {acc.marketplace.slice(0, 4)}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {acc.account}
                        </span>
                        <span style={{ fontWeight: 700, color: 'var(--text)' }}>
                          {acc.total}
                        </span>
                      </div>
                    ))}
                    {day.accountSummaries.length > 3 && (
                      <div style={{ color: 'var(--text-muted)', paddingLeft: 4, fontSize: 9 }}>
                        +{day.accountSummaries.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* リストビュー（日付選択時または全リスト表示時） */}
      {(viewMode === 'list' || selectedDate) && (
        <ScheduleListView 
          schedules={selectedDate ? selectedDaySchedules : schedules}
          selectedDate={selectedDate}
          onCancelSchedule={onCancelSchedule}
          unscheduledItems={selectedDate ? [] : unscheduledItems}
        />
      )}
    </div>
  );
}

// スケジュールリストビュー
function ScheduleListView({
  schedules,
  selectedDate,
  onCancelSchedule,
  unscheduledItems = [],
}: {
  schedules: ScheduleItem[];
  selectedDate: string | null;
  onCancelSchedule: (id: string) => void;
  unscheduledItems?: ScheduleItem[];
}) {
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const handleCancel = async (id: string) => {
    if (!confirm('このスケジュールを取り下げますか？')) return;
    setCancelingId(id);
    await onCancelSchedule(id);
    setCancelingId(null);
  };

  // スケジュール済み（scheduled_atがあるもの）と未スケジュール（scheduled_atがnull）を結合
  // 重複防止: 日付指定時はschedulesのみ（既にフィルタ済み）、それ以外はschedules + 未スケジュール
  const allItems = selectedDate 
    ? schedules  // 既にその日のスケジュールのみが渡されている
    : [...schedules.filter(s => s.scheduled_at !== null), ...unscheduledItems];

  if (allItems.length === 0) {
    return (
      <div style={{ 
        padding: 48, 
        textAlign: 'center', 
        color: 'var(--text-muted)',
        background: 'var(--panel)',
        borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>スケジュールがありません</div>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'var(--panel)', 
      borderRadius: 8, 
      border: '1px solid var(--panel-border)',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--highlight)' }}>
            <th style={thStyle}>ステータス</th>
            <th style={thStyle}>出品予定時間</th>
            <th style={thStyle}>マーケット</th>
            <th style={thStyle}>アカウント</th>
            <th style={thStyle}>SKU</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>商品名</th>
            <th style={thStyle}>eBayカテゴリーID</th>
            <th style={thStyle}>スコア</th>
            <th style={thStyle}>アクション</th>
          </tr>
        </thead>
        <tbody>
          {allItems.map((schedule, index) => {
            const isCompleted = schedule.status === 'COMPLETED';
            const isCancelled = schedule.status === 'CANCELLED';
            const isError = schedule.status === 'ERROR';
            const isPending = ['PENDING', 'SCHEDULED'].includes(schedule.status);
            const score = schedule.products_master?.ai_confidence_score || schedule.products_master?.listing_score || 0;
            const title = schedule.products_master?.english_title || schedule.products_master?.title_en || schedule.products_master?.title || '-';
            const scheduledTime = schedule.scheduled_at 
              ? new Date(schedule.scheduled_at).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
              : '--:--';
            const scheduledDate = schedule.scheduled_at
              ? new Date(schedule.scheduled_at).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' })
              : '-';

            return (
              <tr 
                key={schedule.id}
                style={{ 
                  borderTop: index > 0 ? '1px solid var(--panel-border)' : 'none',
                  opacity: isCancelled ? 0.5 : 1,
                  background: isCompleted ? 'rgba(34, 197, 94, 0.05)' : isError ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                }}
              >
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {isCompleted && <CheckCircle2 size={16} style={{ color: 'rgb(34, 197, 94)' }} />}
                  {isError && <XCircle size={16} style={{ color: 'rgb(239, 68, 68)' }} />}
                  {isCancelled && <Ban size={16} style={{ color: 'var(--text-muted)' }} />}
                  {isPending && <Clock size={16} style={{ color: 'rgb(59, 130, 246)' }} />}
                  {schedule.status === 'RUNNING' && <Loader2 size={16} className="animate-spin" style={{ color: 'rgb(245, 158, 11)' }} />}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'monospace' }}>
                  {!selectedDate && <span style={{ fontSize: 10, color: 'var(--text-muted)', marginRight: 4 }}>{scheduledDate}</span>}
                  <span style={{ fontWeight: 600 }}>{scheduledTime}</span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    background: `${getMarketplaceColor(schedule.marketplace)}20`,
                    color: getMarketplaceColor(schedule.marketplace),
                    textTransform: 'uppercase',
                  }}>
                    {schedule.marketplace}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11 }}>
                  {schedule.account_id}
                </td>
                <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11 }}>
                  {schedule.products_master?.sku || '-'}
                </td>
                <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {title}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'monospace', fontSize: 11 }}>
                  {schedule.products_master?.ebay_category_id ? (
                    <span style={{ 
                      padding: '2px 6px', 
                      background: 'rgba(59, 130, 246, 0.1)', 
                      borderRadius: 4,
                      color: 'rgb(59, 130, 246)',
                    }}>
                      {schedule.products_master.ebay_category_id}
                    </span>
                  ) : (
                    <span style={{ color: 'rgb(239, 68, 68)', fontWeight: 600 }}>未設定</span>
                  )}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block',
                    minWidth: 28,
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 700,
                    background: score >= 80 ? 'rgba(34, 197, 94, 0.15)' : score >= 60 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(156, 163, 175, 0.15)',
                    color: score >= 80 ? 'rgb(34, 197, 94)' : score >= 60 ? 'rgb(245, 158, 11)' : 'var(--text-muted)',
                  }}>
                    {score}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {isPending && (
                    <button
                      onClick={() => handleCancel(schedule.id)}
                      disabled={cancelingId === schedule.id}
                      style={{
                        padding: '4px 8px',
                        background: 'transparent',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        borderRadius: 4,
                        cursor: cancelingId === schedule.id ? 'wait' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: 'rgb(239, 68, 68)',
                        opacity: cancelingId === schedule.id ? 0.5 : 1,
                      }}
                      title="取り下げ"
                    >
                      {cancelingId === schedule.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  )}
                  {isCompleted && (
                    <button
                      style={{
                        padding: '4px 8px',
                        background: 'transparent',
                        border: '1px solid var(--panel-border)',
                        borderRadius: 4,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        color: 'var(--text-muted)',
                      }}
                      title="詳細"
                    >
                      <Eye size={12} />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// 在庫監視コンテンツ
// ============================================================

function MonitoringContent({ changes }: { changes: MonitoringChange[] }) {
  if (changes.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
        <CheckCircle2 size={48} style={{ margin: '0 auto 16px', opacity: 0.3, color: 'var(--success)' }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>変動アラートはありません</div>
        <div style={{ fontSize: 13 }}>在庫・価格の変動が検出されるとここに表示されます</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--highlight)' }}>
            <th style={thStyle}>検出日時</th>
            <th style={thStyle}>SKU</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>商品名</th>
            <th style={thStyle}>種類</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>変動内容</th>
            <th style={thStyle}>ステータス</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((change, index) => (
            <tr key={change.id} style={{ borderTop: index > 0 ? '1px solid var(--panel-border)' : 'none' }}>
              <td style={tdStyle}>
                {new Date(change.detected_at).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11 }}>{change.products_master?.sku || '-'}</td>
              <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {change.products_master?.title || '-'}
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <CategoryBadge category={change.change_category} />
              </td>
              <td style={tdStyle}>
                {change.inventory_change && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Package size={12} />
                    {change.inventory_change.old_stock} → {change.inventory_change.new_stock}
                    {(change.inventory_change.new_stock || 0) > (change.inventory_change.old_stock || 0) 
                      ? <TrendingUp size={12} style={{ color: 'var(--success)' }} />
                      : <TrendingDown size={12} style={{ color: 'var(--error)' }} />
                    }
                  </span>
                )}
                {change.price_change && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    ¥{change.price_change.old_price_jpy?.toLocaleString()} → ¥{change.price_change.new_price_jpy?.toLocaleString()}
                    {(change.price_change.new_price_jpy || 0) > (change.price_change.old_price_jpy || 0)
                      ? <TrendingUp size={12} style={{ color: 'var(--success)' }} />
                      : <TrendingDown size={12} style={{ color: 'var(--error)' }} />
                    }
                  </span>
                )}
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <StatusBadge status={change.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// 実行ログコンテンツ
// ============================================================

function LogsContent({ logs }: { logs: ListingLog[] }) {
  if (logs.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)' }}>
        <Clock size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>出品履歴がありません</div>
        <div style={{ fontSize: 13 }}>出品が実行されるとここに記録されます</div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--panel)', borderRadius: 8, border: '1px solid var(--panel-border)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--highlight)' }}>
            <th style={thStyle}>出品日時</th>
            <th style={thStyle}>結果</th>
            <th style={thStyle}>マーケット</th>
            <th style={thStyle}>アカウント</th>
            <th style={thStyle}>リスティングID</th>
            <th style={{ ...thStyle, textAlign: 'left' }}>エラー</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={log.id} style={{ borderTop: index > 0 ? '1px solid var(--panel-border)' : 'none' }}>
              <td style={tdStyle}>
                {new Date(log.listed_at).toLocaleString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                {log.status === 'success' 
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--success)' }}><CheckCircle2 size={14} /> 成功</span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--error)' }}><XCircle size={14} /> 失敗</span>
                }
              </td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', textTransform: 'uppercase' }}>
                  {log.marketplace}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: 'center', fontSize: 11 }}>{log.account}</td>
              <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 11 }}>
                {log.listing_id ? (
                  <a href={`https://www.ebay.com/itm/${log.listing_id}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgb(59, 130, 246)', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                    {log.listing_id} <ExternalLink size={10} />
                  </a>
                ) : '-'}
              </td>
              <td style={{ ...tdStyle, fontSize: 11, color: 'var(--error)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {log.error_message || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// ユーティリティ
// ============================================================

const navBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  background: 'var(--highlight)',
  border: '1px solid var(--panel-border)',
  borderRadius: 4,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  color: 'var(--text)',
  fontSize: 12,
};

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  textAlign: 'center',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--text-muted)',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 12,
};

function getMarketplaceColor(marketplace: string): string {
  const colors: Record<string, string> = {
    ebay: 'rgb(59, 130, 246)',
    amazon: 'rgb(245, 158, 11)',
    mercari: 'rgb(239, 68, 68)',
    yahoo: 'rgb(239, 68, 68)',
    qoo10: 'rgb(139, 92, 246)',
  };
  return colors[marketplace.toLowerCase()] || 'var(--text-muted)';
}

function CategoryBadge({ category }: { category: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    inventory: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', label: '在庫' },
    price: { bg: 'rgba(245, 158, 11, 0.1)', color: 'rgb(245, 158, 11)', label: '価格' },
    both: { bg: 'rgba(139, 92, 246, 0.1)', color: 'rgb(139, 92, 246)', label: '両方' },
    page_error: { bg: 'rgba(239, 68, 68, 0.1)', color: 'rgb(239, 68, 68)', label: 'ページエラー' },
  };
  const style = styles[category] || styles.inventory;
  return <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: style.bg, color: style.color }}>{style.label}</span>;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: 'rgba(245, 158, 11, 0.1)', color: 'rgb(245, 158, 11)', label: '未対応' },
    approved: { bg: 'rgba(59, 130, 246, 0.1)', color: 'rgb(59, 130, 246)', label: '承認済' },
    applied: { bg: 'rgba(34, 197, 94, 0.1)', color: 'rgb(34, 197, 94)', label: '反映済' },
  };
  const style = styles[status] || styles.pending;
  return <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: style.bg, color: style.color }}>{style.label}</span>;
}

export default HistoryTab;
