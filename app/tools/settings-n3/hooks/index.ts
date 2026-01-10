// app/tools/settings-n3/hooks/index.ts
/**
 * Settings N3 Hooks エクスポート
 *
 * ゴールドスタンダード:
 * - useSettingsIntegrated: 統合フック（推奨）- Domain State + UI Stateを連携
 * - 個別フック: 特定機能のみ必要な場合
 */

// 統合フック（推奨）
export { useSettingsIntegrated, default as useSettingsIntegratedDefault } from './use-settings-integrated';

// 個別フック（後方互換性・特定機能用）
export { useSettingsData, default as useSettingsDataDefault } from './use-settings-data';

// 自動化設定専用フック
export { 
  useAutomationSettings, 
  DEFAULT_APPROVAL_SETTINGS, 
  DEFAULT_SCHEDULE_SETTINGS, 
  DEFAULT_MONITORING_SETTINGS 
} from './use-automation-settings';
