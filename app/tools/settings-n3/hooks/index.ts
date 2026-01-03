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
<<<<<<< HEAD
export { useSettingsData, default as useSettingsDataDefault } from './use-settings-data';
=======
export { useSettingsData, default as useSettingsDataDefault } from './useSettingsData';
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce

// 自動化設定専用フック
export { 
  useAutomationSettings, 
  DEFAULT_APPROVAL_SETTINGS, 
  DEFAULT_SCHEDULE_SETTINGS, 
  DEFAULT_MONITORING_SETTINGS 
<<<<<<< HEAD
} from './use-automation-settings';
=======
} from './use-automation-settings';
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce
