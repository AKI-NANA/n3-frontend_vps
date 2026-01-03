// app/tools/settings-n3/hooks/use-automation-settings.ts
/**
 * 自動化設定フック
 * 
 * 3種類の自動化設定を管理:
 * 1. 出品スケジュール設定 (default_schedule_settings)
 * 2. 在庫監視設定 (monitoring_schedules)
 * 3. 自動承認設定 (auto_approval_settings)
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useState } from 'react';
import type {
  AutoApprovalSettings,
  DefaultScheduleSettings,
  MonitoringScheduleSettings,
  AutomationSubSection,
} from '../types/settings';

// ============================================================
// API関数
// ============================================================

/**
 * 自動承認設定取得
 */
async function fetchAutoApprovalSettings(): Promise<AutoApprovalSettings | null> {
  const response = await fetch('/api/automation/settings?type=approval');
  if (!response.ok) {
    throw new Error('Failed to fetch auto approval settings');
  }
  const json = await response.json();
  return json.approval_settings || null;
}

/**
 * 出品スケジュール設定取得
 */
async function fetchScheduleSettings(): Promise<DefaultScheduleSettings | null> {
  const response = await fetch('/api/automation/settings?type=schedule');
  if (!response.ok) {
    throw new Error('Failed to fetch schedule settings');
  }
  const json = await response.json();
  return json.schedule_settings || null;
}

/**
 * 在庫監視設定取得
 */
async function fetchMonitoringSettings(): Promise<MonitoringScheduleSettings | null> {
  const response = await fetch('/api/inventory-monitoring/schedule');
  if (!response.ok) {
    throw new Error('Failed to fetch monitoring settings');
  }
  const json = await response.json();
  return json.schedule || null;
}

/**
 * 自動承認設定保存
 */
async function saveAutoApprovalSettings(settings: Partial<AutoApprovalSettings>): Promise<AutoApprovalSettings> {
  const response = await fetch('/api/automation/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'approval', settings }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save auto approval settings');
  }
  
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to save');
  }
  
  return json.data;
}

/**
 * 出品スケジュール設定保存
 */
async function saveScheduleSettings(settings: Partial<DefaultScheduleSettings>): Promise<DefaultScheduleSettings> {
  const response = await fetch('/api/automation/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'schedule', settings }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save schedule settings');
  }
  
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to save');
  }
  
  return json.data;
}

/**
 * 在庫監視設定保存
 */
async function saveMonitoringSettings(settings: Partial<MonitoringScheduleSettings>): Promise<MonitoringScheduleSettings> {
  const response = await fetch('/api/inventory-monitoring/schedule', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save monitoring settings');
  }
  
  const json = await response.json();
  if (!json.success) {
    throw new Error(json.error || 'Failed to save');
  }
  
  return json.schedule;
}

// ============================================================
// デフォルト設定
// ============================================================

export const DEFAULT_APPROVAL_SETTINGS: AutoApprovalSettings = {
  enabled: false,
  auto_approval_level: 'conservative',
  min_seo_score: 70,
  min_ai_confidence: 0.80,
  min_profit_margin: 10.00,
  required_fields: ['title_en', 'ddp_price_usd', 'category_name', 'primary_image_url'],
  excluded_categories: [],
  notification_on_approval: true,
  notification_on_rejection: true,
  daily_summary_email: false,
};

export const DEFAULT_SCHEDULE_SETTINGS: DefaultScheduleSettings = {
  enabled: false,
  items_per_day: 30,           // 後方互換性
  items_per_day_min: 25,       // 🔥 1日の出品数（最小）
  items_per_day_max: 35,       // 🔥 1日の出品数（最大）
  sessions_per_day_min: 2,
  sessions_per_day_max: 4,
  item_interval_min: 30,
  item_interval_max: 120,
  session_interval_min: 3600,
  session_interval_max: 14400,
  preferred_hours: [10, 11, 14, 15, 19, 20],
  weekday_multiplier: 1.0,
  weekend_multiplier: 0.8,
  trigger_condition: 'daily_batch',
  batch_time: '09:00',
};

export const DEFAULT_MONITORING_SETTINGS: MonitoringScheduleSettings = {
  enabled: false,
  frequency: 'daily',
  time_window_start: '09:00',
  time_window_end: '21:00',
  max_items_per_batch: 100,
  delay_min_seconds: 1,
  delay_max_seconds: 3,
  random_time_offset_minutes: 15,
  email_notification: false,
  notification_emails: [],
  notify_on_changes_only: true,
};

// ============================================================
// 統合フック
// ============================================================

export function useAutomationSettings() {
  const queryClient = useQueryClient();
  
  // サブセクション状態
  const [activeSubSection, setActiveSubSection] = useState<AutomationSubSection>('listing_schedule');

  // ===== Query: 自動承認設定 =====
  const approvalQuery = useQuery({
    queryKey: ['automation', 'approval'],
    queryFn: fetchAutoApprovalSettings,
    staleTime: 60 * 1000, // 1分
  });

  // ===== Query: 出品スケジュール設定 =====
  const scheduleQuery = useQuery({
    queryKey: ['automation', 'schedule'],
    queryFn: fetchScheduleSettings,
    staleTime: 60 * 1000,
  });

  // ===== Query: 在庫監視設定 =====
  const monitoringQuery = useQuery({
    queryKey: ['automation', 'monitoring'],
    queryFn: fetchMonitoringSettings,
    staleTime: 60 * 1000,
  });

  // ===== Mutations =====
  const approvalMutation = useMutation({
    mutationFn: saveAutoApprovalSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation', 'approval'] });
    },
  });

  const scheduleMutation = useMutation({
    mutationFn: saveScheduleSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation', 'schedule'] });
    },
  });

  const monitoringMutation = useMutation({
    mutationFn: saveMonitoringSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation', 'monitoring'] });
    },
  });

  // ===== マージされたデータ（デフォルト値付き） =====
  const approvalSettings = useMemo(
    () => approvalQuery.data ?? DEFAULT_APPROVAL_SETTINGS,
    [approvalQuery.data]
  );

  const scheduleSettings = useMemo(
    () => scheduleQuery.data ?? DEFAULT_SCHEDULE_SETTINGS,
    [scheduleQuery.data]
  );

  const monitoringSettings = useMemo(
    () => monitoringQuery.data ?? DEFAULT_MONITORING_SETTINGS,
    [monitoringQuery.data]
  );

  // ===== アクション =====
  const saveApproval = useCallback(
    (settings: Partial<AutoApprovalSettings>) => {
      return approvalMutation.mutateAsync(settings);
    },
    [approvalMutation]
  );

  const saveSchedule = useCallback(
    (settings: Partial<DefaultScheduleSettings>) => {
      return scheduleMutation.mutateAsync(settings);
    },
    [scheduleMutation]
  );

  const saveMonitoring = useCallback(
    (settings: Partial<MonitoringScheduleSettings>) => {
      return monitoringMutation.mutateAsync(settings);
    },
    [monitoringMutation]
  );

  const refreshAll = useCallback(() => {
    approvalQuery.refetch();
    scheduleQuery.refetch();
    monitoringQuery.refetch();
  }, [approvalQuery, scheduleQuery, monitoringQuery]);

  // ===== 統計 =====
  const stats = useMemo(() => ({
    approvalEnabled: approvalSettings.enabled,
    scheduleEnabled: scheduleSettings.enabled,
    monitoringEnabled: monitoringSettings.enabled,
    itemsPerDay: scheduleSettings.items_per_day,
    monitoringFrequency: monitoringSettings.frequency,
  }), [approvalSettings, scheduleSettings, monitoringSettings]);

  // ===== 返却値 =====
  return {
    // サブセクション
    activeSubSection,
    setActiveSubSection,

    // データ
    approvalSettings,
    scheduleSettings,
    monitoringSettings,
    stats,

    // ローディング状態
    isLoading: approvalQuery.isLoading || scheduleQuery.isLoading || monitoringQuery.isLoading,
    isFetching: approvalQuery.isFetching || scheduleQuery.isFetching || monitoringQuery.isFetching,
    isSavingApproval: approvalMutation.isPending,
    isSavingSchedule: scheduleMutation.isPending,
    isSavingMonitoring: monitoringMutation.isPending,

    // エラー
    error: 
      (approvalQuery.error instanceof Error ? approvalQuery.error.message : null) ||
      (scheduleQuery.error instanceof Error ? scheduleQuery.error.message : null) ||
      (monitoringQuery.error instanceof Error ? monitoringQuery.error.message : null),

    // アクション
    saveApproval,
    saveSchedule,
    saveMonitoring,
    refreshAll,
  };
}

export default useAutomationSettings;
