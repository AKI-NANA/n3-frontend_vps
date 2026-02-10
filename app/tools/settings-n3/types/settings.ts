// app/tools/settings-n3/types/settings.ts
/**
 * Settings N3 型定義
 * 設定・マスタ・連携管理の型
 */

// マーケットプレイス
export type Marketplace = 'ebay' | 'amazon' | 'mercari' | 'yahoo' | 'rakuten';

// HTS分類
export interface HTSCode {
  id: string;
  code: string;
  description: string;
  parentId?: string;
  level: number;
  rate?: number;
  children?: HTSCode[];
}

// eBay設定
export interface EbaySettings {
  id: string;
  accountName: string;
  siteId: string;
  paymentPolicy: string;
  shippingPolicy: string;
  returnPolicy: string;
  isActive: boolean;
  lastSync?: string;
}

// Amazon設定
export interface AmazonSettings {
  id: string;
  sellerId: string;
  marketplaceId: string;
  mwsAuthToken?: string;
  isActive: boolean;
  lastSync?: string;
}

// 自動化ルール
export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'time' | 'event' | 'condition';
  triggerConfig: Record<string, any>;
  actions: AutomationAction[];
  isActive: boolean;
  lastRun?: string;
  runCount: number;
}

export interface AutomationAction {
  id: string;
  type: 'price_update' | 'inventory_sync' | 'notification' | 'webhook';
  config: Record<string, any>;
}

// 認証情報
export interface Credential {
  id: string;
  name: string;
  type: 'api_key' | 'oauth' | 'basic';
  platform: Marketplace | 'other';
  status: 'active' | 'expired' | 'revoked';
  expiresAt?: string;
  lastUsed?: string;
}

// システム設定
export interface SystemSetting {
  id: string;
  category: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  isReadOnly: boolean;
}

// L3タブ
export type SettingsL3Tab =
  | 'hts'
  | 'ebay'
  | 'amazon'
  | 'automation'
  | 'credentials'
  | 'system';

// ============================================================
// 統合フック用追加型定義
// ============================================================

// HTS分類（ツリー構造）
export interface HTSCategory {
  id: string;
  code: string;
  name: string;
  description: string;
  dutyRate: number;
  children: HTSCategory[];
}

// eBay設定（統合フック用）
export interface EbaySettingsExtended {
  defaultShipping: {
    domestic: string;
    international: string;
  };
  returnPolicy: {
    accepted: boolean;
    period: number;
    paidBy: 'buyer' | 'seller';
  };
  paymentPolicy: string;
  listingDuration: string;
  autoRelist: boolean;
  bestOfferEnabled: boolean;
  bestOfferAutoAcceptPercent: number;
  bestOfferAutoDeclinePercent: number;
}

// 自動化ルール（統合フック用）
export interface AutomationRuleExtended {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  action: string;
  conditions: Record<string, unknown>;
  lastRun: string;
  runCount: number;
  successCount: number;
}

// 認証情報（統合フック用）
export interface CredentialExtended {
  id: string;
  name: string;
  type: 'api_key' | 'oauth';
  status: 'valid' | 'expiring' | 'expired';
  expiresAt: string;
  lastUsed: string;
}

// ============================================================
// 自動化設定関連型定義
// ============================================================

// 自動承認レベル
export type AutoApprovalLevel = 'conservative' | 'moderate' | 'aggressive';

// トリガー条件
export type TriggerCondition = 'immediate' | 'daily_batch' | 'weekly_batch';

// 監視頻度
export type MonitoringFrequency = 'hourly' | 'daily' | 'custom';

// 自動承認設定
export interface AutoApprovalSettings {
  id?: string;
  enabled: boolean;
  auto_approval_level: AutoApprovalLevel;
  min_seo_score: number;
  min_ai_confidence: number;
  min_profit_margin: number;
  required_fields: string[];
  excluded_categories: string[];
  notification_on_approval: boolean;
  notification_on_rejection: boolean;
  daily_summary_email: boolean;
  created_at?: string;
  updated_at?: string;
}

// デフォルトスケジュール設定
export interface DefaultScheduleSettings {
  id?: string;
  enabled: boolean;
  items_per_day: number;
  items_per_day_min: number;
  items_per_day_max: number;
  sessions_per_day_min: number;
  sessions_per_day_max: number;
  item_interval_min: number;
  item_interval_max: number;
  session_interval_min: number;
  session_interval_max: number;
  preferred_hours: number[];
  weekday_multiplier: number;
  weekend_multiplier: number;
  trigger_condition: TriggerCondition;
  batch_time: string;
  created_at?: string;
  updated_at?: string;
}

// 在庫監視スケジュール設定
export interface MonitoringScheduleSettings {
  id?: string;
  enabled: boolean;
  frequency: MonitoringFrequency;
  time_window_start: string;
  time_window_end: string;
  max_items_per_batch: number;
  delay_min_seconds: number;
  delay_max_seconds: number;
  random_time_offset_minutes: number;
  email_notification: boolean;
  notification_emails: string[];
  notify_on_changes_only: boolean;
  created_at?: string;
  updated_at?: string;
}

// 自動化タブのサブセクション
export type AutomationSubSection = 
  | 'rules'
  | 'listing_schedule'
  | 'inventory_monitoring'
  | 'auto_approval';
