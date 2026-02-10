// app/tools/settings-n3/components/automation-settings-panel.tsx
/**
 * 自動化設定パネル
 * 
 * Settings N3 の自動化タブで表示される統合設定パネル
 * 3種類の自動化設定を1画面で管理:
 * 1. 出品スケジュール設定
 * 2. 在庫監視設定
 * 3. 自動承認設定
 */

'use client';

import React, { memo, useState, useEffect } from 'react';
import {
  Calendar,
  Search,
  CheckCircle,
  Play,
  Pause,
  Save,
  RefreshCw,
  Clock,
  Zap,
  AlertTriangle,
  Settings2,
  Package,
} from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { useAutomationSettings } from '../hooks';
import type {
  AutomationSubSection,
  AutoApprovalSettings,
  DefaultScheduleSettings,
  MonitoringScheduleSettings,
  AutoApprovalLevel,
  TriggerCondition,
  MonitoringFrequency,
} from '../types/settings';

// サブセクションタブ設定
const SUBSECTION_TABS: { id: AutomationSubSection; label: string; icon: React.ReactNode }[] = [
  { id: 'listing_schedule', label: '出品スケジュール', icon: <Calendar size={14} /> },
  { id: 'inventory_monitoring', label: '在庫監視', icon: <Search size={14} /> },
  { id: 'auto_approval', label: '自動承認', icon: <CheckCircle size={14} /> },
];

// 共通スタイル
const cardStyle: React.CSSProperties = {
  padding: '16px',
  background: 'var(--panel)',
  borderRadius: 'var(--style-radius-lg, 12px)',
  border: '1px solid var(--panel-border)',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text)',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--text-muted)',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid var(--panel-border)',
  background: 'var(--highlight)',
  color: 'var(--text)',
  fontSize: '13px',
};

const sliderContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

// ============================================================
// 出品スケジュール設定セクション
// ============================================================
const ListingScheduleSection = memo(function ListingScheduleSection({
  settings,
  onSave,
  isSaving,
}: {
  settings: DefaultScheduleSettings;
  onSave: (settings: Partial<DefaultScheduleSettings>) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async () => {
    await onSave(form);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ヘッダー & 有効/無効トグル */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={sectionTitleStyle}>
            <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
            出品スケジュール設定
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <N3Badge variant={form.enabled ? 'success' : 'secondary'} size="sm">
              {form.enabled ? '有効' : '無効'}
            </N3Badge>
            <N3Button
              variant={form.enabled ? 'success' : 'secondary'}
              size="xs"
              onClick={() => setForm({ ...form, enabled: !form.enabled })}
            >
              {form.enabled ? <Pause size={12} /> : <Play size={12} />}
            </N3Button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          承認済み商品の出品スケジュールを自動生成します。cronワーカーが設定に基づいて定期実行します。
        </p>

        {/* 出品数設定 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>1日あたりの出品数</div>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min={1}
              max={100}
              value={form.items_per_day}
              onChange={(e) => setForm({ ...form, items_per_day: Number(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: '50px' }}>
              {form.items_per_day}件
            </span>
          </div>
        </div>

        {/* セッション設定 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={labelStyle}>セッション数（最小）</div>
            <input
              type="number"
              min={1}
              max={24}
              value={form.sessions_per_day_min}
              onChange={(e) => setForm({ ...form, sessions_per_day_min: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>セッション数（最大）</div>
            <input
              type="number"
              min={1}
              max={24}
              value={form.sessions_per_day_max}
              onChange={(e) => setForm({ ...form, sessions_per_day_max: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* 間隔設定 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={labelStyle}>商品間隔（最小秒）</div>
            <input
              type="number"
              min={10}
              max={600}
              value={form.item_interval_min}
              onChange={(e) => setForm({ ...form, item_interval_min: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>商品間隔（最大秒）</div>
            <input
              type="number"
              min={10}
              max={600}
              value={form.item_interval_max}
              onChange={(e) => setForm({ ...form, item_interval_max: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* 曜日倍率 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={labelStyle}>平日倍率</div>
            <div style={sliderContainerStyle}>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={form.weekday_multiplier * 100}
                onChange={(e) => setForm({ ...form, weekday_multiplier: Number(e.target.value) / 100 })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>x{form.weekday_multiplier}</span>
            </div>
          </div>
          <div>
            <div style={labelStyle}>休日倍率</div>
            <div style={sliderContainerStyle}>
              <input
                type="range"
                min={0}
                max={200}
                step={10}
                value={form.weekend_multiplier * 100}
                onChange={(e) => setForm({ ...form, weekend_multiplier: Number(e.target.value) / 100 })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>x{form.weekend_multiplier}</span>
            </div>
          </div>
        </div>

        {/* トリガー設定 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>実行タイミング</div>
          <select
            value={form.trigger_condition}
            onChange={(e) => setForm({ ...form, trigger_condition: e.target.value as TriggerCondition })}
            style={inputStyle}
          >
            <option value="immediate">承認直後に即スケジュール</option>
            <option value="daily_batch">毎日決まった時間にバッチ生成</option>
            <option value="weekly_batch">週1回バッチ生成</option>
          </select>
        </div>

        {form.trigger_condition !== 'immediate' && (
          <div style={{ marginBottom: '16px' }}>
            <div style={labelStyle}>バッチ実行時間</div>
            <input
              type="time"
              value={form.batch_time}
              onChange={(e) => setForm({ ...form, batch_time: e.target.value })}
              style={inputStyle}
            />
          </div>
        )}
      </div>

      {/* 保存ボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <N3Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          設定を保存
        </N3Button>
      </div>
    </div>
  );
});

// ============================================================
// 在庫監視設定セクション
// ============================================================
const InventoryMonitoringSection = memo(function InventoryMonitoringSection({
  settings,
  onSave,
  isSaving,
}: {
  settings: MonitoringScheduleSettings;
  onSave: (settings: Partial<MonitoringScheduleSettings>) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async () => {
    await onSave(form);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ヘッダー & 有効/無効トグル */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={sectionTitleStyle}>
            <Search size={18} style={{ color: 'var(--color-warning)' }} />
            在庫監視設定（無在庫用）
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <N3Badge variant={form.enabled ? 'success' : 'secondary'} size="sm">
              {form.enabled ? '有効' : '無効'}
            </N3Badge>
            <N3Button
              variant={form.enabled ? 'success' : 'secondary'}
              size="xs"
              onClick={() => setForm({ ...form, enabled: !form.enabled })}
            >
              {form.enabled ? <Pause size={12} /> : <Play size={12} />}
            </N3Button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          ソース元（Yahoo/Mercari等）の在庫・価格変動を監視し、eBay出品に反映します。
        </p>

        {/* 監視頻度 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>監視頻度</div>
          <select
            value={form.frequency}
            onChange={(e) => setForm({ ...form, frequency: e.target.value as MonitoringFrequency })}
            style={inputStyle}
          >
            <option value="hourly">毎時</option>
            <option value="daily">毎日</option>
            <option value="custom">カスタム</option>
          </select>
        </div>

        {/* 時間帯設定 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={labelStyle}>開始時間</div>
            <input
              type="time"
              value={form.time_window_start}
              onChange={(e) => setForm({ ...form, time_window_start: e.target.value })}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>終了時間</div>
            <input
              type="time"
              value={form.time_window_end}
              onChange={(e) => setForm({ ...form, time_window_end: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* バッチサイズ */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>バッチあたりの最大件数</div>
          <div style={sliderContainerStyle}>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={form.max_items_per_batch}
              onChange={(e) => setForm({ ...form, max_items_per_batch: Number(e.target.value) })}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: '60px' }}>
              {form.max_items_per_batch}件
            </span>
          </div>
        </div>

        {/* 遅延設定 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div>
            <div style={labelStyle}>遅延（最小秒）</div>
            <input
              type="number"
              min={0}
              max={10}
              value={form.delay_min_seconds}
              onChange={(e) => setForm({ ...form, delay_min_seconds: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
          <div>
            <div style={labelStyle}>遅延（最大秒）</div>
            <input
              type="number"
              min={0}
              max={10}
              value={form.delay_max_seconds}
              onChange={(e) => setForm({ ...form, delay_max_seconds: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* 通知設定 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <input
              type="checkbox"
              id="email_notification"
              checked={form.email_notification}
              onChange={(e) => setForm({ ...form, email_notification: e.target.checked })}
            />
            <label htmlFor="email_notification" style={{ fontSize: '13px', color: 'var(--text)' }}>
              メール通知を有効にする
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="notify_on_changes_only"
              checked={form.notify_on_changes_only}
              onChange={(e) => setForm({ ...form, notify_on_changes_only: e.target.checked })}
            />
            <label htmlFor="notify_on_changes_only" style={{ fontSize: '13px', color: 'var(--text)' }}>
              変動があった場合のみ通知
            </label>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <N3Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          設定を保存
        </N3Button>
      </div>
    </div>
  );
});

// ============================================================
// 自動承認設定セクション
// ============================================================
const AutoApprovalSection = memo(function AutoApprovalSection({
  settings,
  onSave,
  isSaving,
}: {
  settings: AutoApprovalSettings;
  onSave: (settings: Partial<AutoApprovalSettings>) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async () => {
    await onSave(form);
  };

  const levelDescriptions: Record<AutoApprovalLevel, string> = {
    conservative: '全てのスコア条件をクリアした商品のみ自動承認',
    moderate: '3つのスコア条件のうち2つをクリアすれば自動承認',
    aggressive: '必須フィールドがあれば自動承認（スコアは参考）',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ヘッダー & 有効/無効トグル */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={sectionTitleStyle}>
            <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
            自動承認設定
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <N3Badge variant={form.enabled ? 'success' : 'secondary'} size="sm">
              {form.enabled ? '有効' : '無効'}
            </N3Badge>
            <N3Button
              variant={form.enabled ? 'success' : 'secondary'}
              size="xs"
              onClick={() => setForm({ ...form, enabled: !form.enabled })}
            >
              {form.enabled ? <Pause size={12} /> : <Play size={12} />}
            </N3Button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
          条件に基づいて商品を自動で承認・却下します。スコア条件を満たした商品が自動承認されます。
        </p>

        {/* 承認レベル */}
        <div style={{ marginBottom: '16px' }}>
          <div style={labelStyle}>承認レベル</div>
          <select
            value={form.auto_approval_level}
            onChange={(e) => setForm({ ...form, auto_approval_level: e.target.value as AutoApprovalLevel })}
            style={inputStyle}
          >
            <option value="conservative">厳格（全条件必須）</option>
            <option value="moderate">中程度（主要条件のみ）</option>
            <option value="aggressive">積極的（最低限の条件）</option>
          </select>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {levelDescriptions[form.auto_approval_level]}
          </p>
        </div>

        {/* スコア条件 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
            スコア条件
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={labelStyle}>最低SEOスコア</div>
            <div style={sliderContainerStyle}>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.min_seo_score}
                onChange={(e) => setForm({ ...form, min_seo_score: Number(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: '50px' }}>
                {form.min_seo_score}
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={labelStyle}>最低AI信頼度</div>
            <div style={sliderContainerStyle}>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.min_ai_confidence * 100}
                onChange={(e) => setForm({ ...form, min_ai_confidence: Number(e.target.value) / 100 })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: '50px' }}>
                {Math.round(form.min_ai_confidence * 100)}%
              </span>
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div style={labelStyle}>最低利益率</div>
            <div style={sliderContainerStyle}>
              <input
                type="range"
                min={-50}
                max={100}
                step={5}
                value={form.min_profit_margin}
                onChange={(e) => setForm({ ...form, min_profit_margin: Number(e.target.value) })}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', minWidth: '50px' }}>
                {form.min_profit_margin}%
              </span>
            </div>
          </div>
        </div>

        {/* 通知設定 */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
            通知設定
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="notification_on_approval"
                checked={form.notification_on_approval}
                onChange={(e) => setForm({ ...form, notification_on_approval: e.target.checked })}
              />
              <label htmlFor="notification_on_approval" style={{ fontSize: '13px', color: 'var(--text)' }}>
                承認時に通知
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="notification_on_rejection"
                checked={form.notification_on_rejection}
                onChange={(e) => setForm({ ...form, notification_on_rejection: e.target.checked })}
              />
              <label htmlFor="notification_on_rejection" style={{ fontSize: '13px', color: 'var(--text)' }}>
                却下時に通知
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="daily_summary_email"
                checked={form.daily_summary_email}
                onChange={(e) => setForm({ ...form, daily_summary_email: e.target.checked })}
              />
              <label htmlFor="daily_summary_email" style={{ fontSize: '13px', color: 'var(--text)' }}>
                日次サマリーメール
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 保存ボタン */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <N3Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          設定を保存
        </N3Button>
      </div>
    </div>
  );
});

// ============================================================
// メインパネル
// ============================================================
export const AutomationSettingsPanel = memo(function AutomationSettingsPanel() {
  const {
    activeSubSection,
    setActiveSubSection,
    approvalSettings,
    scheduleSettings,
    monitoringSettings,
    stats,
    isLoading,
    isSavingApproval,
    isSavingSchedule,
    isSavingMonitoring,
    saveApproval,
    saveSchedule,
    saveMonitoring,
    refreshAll,
  } = useAutomationSettings();

  if (isLoading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={24} className="animate-spin" style={{ marginBottom: '8px' }} />
        <div>読み込み中...</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* ステータスサマリー */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>出品スケジュール</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <N3Badge variant={stats.scheduleEnabled ? 'success' : 'secondary'} size="xs">
              {stats.scheduleEnabled ? '有効' : '無効'}
            </N3Badge>
            <span style={{ fontSize: '13px', color: 'var(--text)' }}>{stats.itemsPerDay}件/日</span>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Search size={16} style={{ color: 'var(--color-warning)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>在庫監視</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <N3Badge variant={stats.monitoringEnabled ? 'success' : 'secondary'} size="xs">
              {stats.monitoringEnabled ? '有効' : '無効'}
            </N3Badge>
            <span style={{ fontSize: '13px', color: 'var(--text)' }}>{stats.monitoringFrequency}</span>
          </div>
        </div>

        <div style={{ ...cardStyle, padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>自動承認</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <N3Badge variant={stats.approvalEnabled ? 'success' : 'secondary'} size="xs">
              {stats.approvalEnabled ? '有効' : '無効'}
            </N3Badge>
          </div>
        </div>
      </div>

      {/* サブセクションタブ */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px' }}>
        {SUBSECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubSection(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '6px',
              border: 'none',
              background: activeSubSection === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: activeSubSection === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: activeSubSection === tab.id ? 600 : 400,
              transition: 'all 0.15s ease',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <N3Button variant="ghost" size="xs" onClick={refreshAll}>
          <RefreshCw size={12} />
          更新
        </N3Button>
      </div>

      {/* サブセクションコンテンツ */}
      {activeSubSection === 'listing_schedule' && (
        <ListingScheduleSection
          settings={scheduleSettings}
          onSave={saveSchedule}
          isSaving={isSavingSchedule}
        />
      )}
      {activeSubSection === 'inventory_monitoring' && (
        <InventoryMonitoringSection
          settings={monitoringSettings}
          onSave={saveMonitoring}
          isSaving={isSavingMonitoring}
        />
      )}
      {activeSubSection === 'auto_approval' && (
        <AutoApprovalSection
          settings={approvalSettings}
          onSave={saveApproval}
          isSaving={isSavingApproval}
        />
      )}
    </div>
  );
});

export default AutomationSettingsPanel;
