// lib/audit/commercial-audit-report.ts
// ========================================
// 🔍 N3 Empire OS V8.2.1-Autonomous
// 商用化・製品クオリティ完全監査レポート
// 監査日: 2025-01-24
// ========================================

/**
 * 監査結果の欠落アイテム定義
 */
export interface AuditGapItem {
  id: string;
  category: 'ui' | 'api' | 'db' | 'n8n' | 'security' | 'monitoring';
  severity: 'critical' | 'high' | 'medium' | 'low';
  component: string;
  description: string;
  currentState: string;
  requiredState: string;
  recommendation: string;
  estimatedEffort: 'small' | 'medium' | 'large';
  relatedFiles?: string[];
}

// ========================================
// SECTION 1: UI/UX連携の空白
// ========================================

export const UI_UX_GAPS: AuditGapItem[] = [
  // ========================================
  // 1.1 設定UI欠落
  // ========================================
  {
    id: 'UI-001',
    category: 'ui',
    severity: 'critical',
    component: 'API Credentials Manager UI',
    description: 'APIキー（eBay, Amazon, Keepa等）をUI経由で安全に設定する画面が不完全',
    currentState: 'app/api/credentials/route.tsにAPIは存在するが、フロントエンドUIコンポーネントが欠落',
    requiredState: '各マーケットプレイスのOAuth認証フローとAPIキー入力フォームを持つ設定画面',
    recommendation: 'app/tools/settings-n3/components/CredentialsManagerPanel.tsx を作成し、OAuth2フローを統合',
    estimatedEffort: 'large',
    relatedFiles: ['app/api/credentials/route.ts', 'app/tools/settings-n3/']
  },
  {
    id: 'UI-002',
    category: 'ui',
    severity: 'critical',
    component: 'AI Decision Trace Viewer',
    description: 'AIエージェントの判断証跡（Decision Trace）を確認するUI画面が存在しない',
    currentState: 'core.ai_decision_traces テーブルは存在するが、閲覧UIが未実装',
    requiredState: 'AIの全判断履歴をフィルタ・検索・詳細表示できるダッシュボード',
    recommendation: 'app/tools/operations-n3/components/AIDecisionTracePanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/empire-os/migrations/02_V821_INTEGRATION_SCHEMA.sql']
  },
  {
    id: 'UI-003',
    category: 'ui',
    severity: 'high',
    component: 'API Budget Manager UI',
    description: 'API消費制限・予算設定画面が存在しない',
    currentState: 'core.api_consumption_limits テーブルは存在するが、設定UIが未実装',
    requiredState: 'プロバイダ別の予算設定、アラート閾値、超過時アクションを設定できる画面',
    recommendation: 'app/tools/settings-n3/components/APIBudgetPanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/empire-os/migrations/02_V821_INTEGRATION_SCHEMA.sql']
  },
  {
    id: 'UI-004',
    category: 'ui',
    severity: 'high',
    component: 'HitL Approval Dashboard',
    description: '人間承認が必要なアクションを一覧・承認するUI画面が不完全',
    currentState: 'app/api/hitl/route.tsにAPIは存在するが、一覧表示UIが欠落',
    requiredState: 'pending状態の全アクションを表示し、承認/拒否できるダッシュボード',
    recommendation: 'app/tools/operations-n3/components/HitLApprovalPanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['app/api/hitl/', 'lib/n8n/workflows/v8-unsinkable-template.ts']
  },
  {
    id: 'UI-005',
    category: 'ui',
    severity: 'high',
    component: 'Category Quota Manager UI',
    description: 'カテゴリ別出品枠の設定・管理画面が存在しない',
    currentState: 'commerce.category_listing_quotas テーブルは存在するが、設定UIが未実装',
    requiredState: 'カテゴリ別の出品枠上限、時間帯設定、夜間シフト設定ができる画面',
    recommendation: 'app/tools/listing-n3/components/CategoryQuotaPanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/empire-os/migrations/02_V821_INTEGRATION_SCHEMA.sql']
  },
  {
    id: 'UI-006',
    category: 'ui',
    severity: 'high',
    component: 'Exit Strategy Dashboard',
    description: '撤退候補一覧・撤退計画承認画面が存在しない',
    currentState: 'ExitStrategyEngine は lib/ai/ に実装済みだが、UIが未実装',
    requiredState: 'Soft/Hard Exit候補の一覧、損失見込み、承認ボタンを持つダッシュボード',
    recommendation: 'app/tools/operations-n3/components/ExitStrategyPanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/ai/exit-strategy-engine.ts', 'lib/empire-os/migrations/04_V821_AUTONOMOUS_SCHEMA.sql']
  },
  {
    id: 'UI-007',
    category: 'ui',
    severity: 'medium',
    component: 'Asset Score Viewer',
    description: '商品別Asset Scoreとランクを表示するUI画面が存在しない',
    currentState: 'AssetPilot は lib/ai/ に実装済みだが、UIが未実装',
    requiredState: '商品リストにAsset Score/ランク列を追加、詳細ポップアップで内訳表示',
    recommendation: 'editing-n3, inventory のテーブルにAsset Score列を追加',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/ai/asset-pilot.ts']
  },
  {
    id: 'UI-008',
    category: 'ui',
    severity: 'medium',
    component: 'Portfolio Risk Dashboard',
    description: 'ポートフォリオリスク（集中度等）を可視化するUI画面が存在しない',
    currentState: 'finance.portfolio_risk_manager テーブルは存在するが、UIが未実装',
    requiredState: 'カテゴリ/ブランド集中度のグラフ、警告リスト、リスクスコアを表示',
    recommendation: 'app/tools/analytics-n3/components/PortfolioRiskPanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/empire-os/migrations/04_V821_AUTONOMOUS_SCHEMA.sql']
  },
  {
    id: 'UI-009',
    category: 'ui',
    severity: 'medium',
    component: 'n8n Workflow Status UI',
    description: 'n8nワークフローの実行状況をリアルタイム表示するUI画面が不完全',
    currentState: 'n8n APIへの接続はあるが、ダッシュボード統合が不十分',
    requiredState: 'アクティブなワークフロー、最近の実行履歴、エラー率を表示',
    recommendation: 'app/tools/operations-n3/components/WorkflowStatusPanel.tsx を拡張',
    estimatedEffort: 'small',
    relatedFiles: ['lib/n8n/n8n-client.ts']
  },
  {
    id: 'UI-010',
    category: 'ui',
    severity: 'medium',
    component: 'EOL/Reprint Tracking UI',
    description: 'EOL追跡・再販サイクル情報を表示するUI画面が存在しない',
    currentState: 'commerce.eol_tracking, commerce.reprint_cycles テーブルは存在するが、UIが未実装',
    requiredState: 'EOL予定商品リスト、再販Dipの買い場アラート、高騰予測を表示',
    recommendation: 'app/tools/research-n3/components/EOLTrackingPanel.tsx を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/empire-os/migrations/04_V821_AUTONOMOUS_SCHEMA.sql']
  },

  // ========================================
  // 1.2 オンボーディングUI欠落
  // ========================================
  {
    id: 'UI-011',
    category: 'ui',
    severity: 'critical',
    component: 'OAuth Setup Wizard',
    description: 'eBay/Amazon OAuth認証をステップバイステップで行うウィザードが存在しない',
    currentState: 'OAuth APIは存在するが、ユーザーフレンドリーなウィザードUIがない',
    requiredState: '1. 説明 → 2. 認証 → 3. 確認 → 4. 完了 のステップ形式ウィザード',
    recommendation: 'app/tools/settings-n3/components/OAuthSetupWizard.tsx を作成',
    estimatedEffort: 'large',
    relatedFiles: ['app/api/auth/ebay/', 'app/api/auth/amazon/']
  },
  {
    id: 'UI-012',
    category: 'ui',
    severity: 'high',
    component: 'Initial Setup Checklist',
    description: '初期セットアップの進捗を表示するチェックリストUIが存在しない',
    currentState: 'どの設定が完了しているか、次に何をすべきかが不明確',
    requiredState: '必須設定項目のチェックリストと進捗バー、次のアクションボタン',
    recommendation: 'app/tools/settings-n3/components/SetupChecklist.tsx を作成',
    estimatedEffort: 'small',
    relatedFiles: []
  },
];

// ========================================
// SECTION 2: APIオンボーディング自動化
// ========================================

export const API_ONBOARDING_GAPS: AuditGapItem[] = [
  {
    id: 'API-001',
    category: 'api',
    severity: 'critical',
    component: 'eBay OAuth Callback Handler',
    description: 'eBay OAuth認証のコールバック処理が不完全',
    currentState: 'OAuth開始は可能だが、トークン取得後の自動保存が一部手動',
    requiredState: 'コールバック受信 → トークン取得 → DB保存 → n8n Credentials更新 が全自動',
    recommendation: 'app/api/auth/ebay/callback/route.ts を拡張し、n8n API連携を追加',
    estimatedEffort: 'medium',
    relatedFiles: ['app/api/auth/ebay/', 'lib/n8n/secret-vault.ts']
  },
  {
    id: 'API-002',
    category: 'api',
    severity: 'critical',
    component: 'Amazon SP-API OAuth Flow',
    description: 'Amazon SP-API認証フローが未実装',
    currentState: 'Amazon関連APIは存在するが、OAuth認証フローが不完全',
    requiredState: 'LWA OAuth → Access Token → Refresh Token → DB保存 の完全フロー',
    recommendation: 'app/api/auth/amazon/oauth/route.ts を作成',
    estimatedEffort: 'large',
    relatedFiles: ['app/api/amazon/']
  },
  {
    id: 'API-003',
    category: 'api',
    severity: 'high',
    component: 'Keepa API Key Validation',
    description: 'Keepa APIキーの検証機能が存在しない',
    currentState: 'APIキー入力は可能だが、有効性の事前検証がない',
    requiredState: '入力されたAPIキーでテストリクエストを行い、有効性を確認',
    recommendation: 'app/api/credentials/validate/keepa/route.ts を作成',
    estimatedEffort: 'small',
    relatedFiles: ['app/api/credentials/']
  },
  {
    id: 'API-004',
    category: 'api',
    severity: 'high',
    component: 'n8n Credentials Auto-Sync',
    description: 'DB保存されたAPIキーをn8n Credentialsに自動反映する機能が不完全',
    currentState: 'lib/n8n/secret-vault.ts に概念は存在するが、実際の同期が未実装',
    requiredState: 'DB更新時にn8n REST APIを呼び出し、Credentialsを自動更新',
    recommendation: 'lib/n8n/credentials-sync.ts を作成し、Webhookトリガーを追加',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/n8n/secret-vault.ts', 'lib/n8n/n8n-client.ts']
  },
  {
    id: 'API-005',
    category: 'api',
    severity: 'medium',
    component: 'Token Refresh Automation',
    description: 'トークン期限切れ前の自動更新機能が不十分',
    currentState: 'eBayトークン更新は部分的に実装されているが、全マーケットプレイス統一されていない',
    requiredState: '期限1時間前に自動更新、失敗時はアラート送信',
    recommendation: 'app/api/cron/token-refresh/route.ts を作成し、Vercel Cronで定期実行',
    estimatedEffort: 'medium',
    relatedFiles: ['app/api/tokens/', 'app/api/cron/']
  },
];

// ========================================
// SECTION 3: 統合モニタリング機能
// ========================================

export const MONITORING_GAPS: AuditGapItem[] = [
  {
    id: 'MON-001',
    category: 'monitoring',
    severity: 'critical',
    component: 'System Health Metrics Table',
    description: '全ツールの実行回数・成功率・コストを記録するテーブルが存在しない',
    currentState: 'core.audit_logs に部分的な情報はあるが、集計用テーブルがない',
    requiredState: 'ツール別・日別・時間別の集計メトリクステーブル',
    recommendation: 'core.system_health_metrics テーブルを追加（SQL下記）',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/empire-os/migrations/']
  },
  {
    id: 'MON-002',
    category: 'monitoring',
    severity: 'high',
    component: 'Metrics Dashboard UI',
    description: 'システムヘルスメトリクスを表示するダッシュボードUIが存在しない',
    currentState: 'UIなし',
    requiredState: '実行回数、成功率、エラー率、APIコストをグラフ・テーブルで表示',
    recommendation: 'app/tools/operations-n3/components/SystemHealthDashboard.tsx を作成',
    estimatedEffort: 'large',
    relatedFiles: []
  },
  {
    id: 'MON-003',
    category: 'monitoring',
    severity: 'high',
    component: 'Cost Tracking per Tool',
    description: 'ツール別のAPI消費コストをリアルタイム追跡する機能がない',
    currentState: 'core.api_consumption_limits で予算設定は可能だが、ツール別の追跡がない',
    requiredState: '各ツール実行時にコストを自動計算し、累積値を記録',
    recommendation: 'V8.2.1のAudit-Logノードにコスト計算ロジックを追加',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/n8n/workflows/v8-unsinkable-template.ts']
  },
  {
    id: 'MON-004',
    category: 'monitoring',
    severity: 'medium',
    component: 'Error Alert System',
    description: '連続エラー発生時の自動アラート機能が不十分',
    currentState: 'ChatWork通知は部分的に実装されているが、閾値ベースのアラートがない',
    requiredState: '5分間に3回以上エラーで即時アラート、日次サマリーメール',
    recommendation: 'app/api/monitoring/alerts/route.ts を作成',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/n8n/']
  },
  {
    id: 'MON-005',
    category: 'monitoring',
    severity: 'medium',
    component: 'n8n Execution Aggregator',
    description: 'n8n実行履歴をDBに集約する機能がない',
    currentState: 'n8n内部にログは存在するが、N3 DB側に同期されていない',
    requiredState: 'n8n Execution Webhookを受信し、core.n8n_execution_logs に記録',
    recommendation: 'app/api/n8n/execution-webhook/route.ts を作成',
    estimatedEffort: 'small',
    relatedFiles: ['app/api/n8n/']
  },
];

// ========================================
// SECTION 4: DB/n8n不整合
// ========================================

export const INCONSISTENCY_GAPS: AuditGapItem[] = [
  {
    id: 'INC-001',
    category: 'db',
    severity: 'high',
    component: 'products_master vs products',
    description: '一部のコードで products_master と products を混同している可能性',
    currentState: 'スキーマは products_master だが、古いコードに products 参照が残存の恐れ',
    requiredState: '全コードで products_master に統一',
    recommendation: 'grep -r "from.*(products)[^_]" で検索し、修正',
    estimatedEffort: 'small',
    relatedFiles: []
  },
  {
    id: 'INC-002',
    category: 'n8n',
    severity: 'high',
    component: 'Webhook Path Inconsistency',
    description: 'README記載のWebhookパスと実際のn8nワークフロー設定に不一致の恐れ',
    currentState: '/webhook/listing-reserve 等のパスが一部のワークフローで異なる可能性',
    requiredState: '全Webhookパスを正規化し、lib/n8n/webhook-paths.ts で一元管理',
    recommendation: 'webhook-normalizer.ts を使用して全パスを検証・修正',
    estimatedEffort: 'medium',
    relatedFiles: ['lib/n8n/migrations/webhook-normalizer.ts']
  },
  {
    id: 'INC-003',
    category: 'db',
    severity: 'medium',
    component: 'Column Name Variations',
    description: 'テーブル間でカラム名の命名規則が不統一の箇所がある',
    currentState: 'created_at / createdAt / creation_date など混在の恐れ',
    requiredState: '全テーブルで snake_case (created_at) に統一',
    recommendation: 'DBスキーマを監査し、統一されていないカラムを ALTER TABLE で修正',
    estimatedEffort: 'small',
    relatedFiles: ['lib/empire-os/migrations/']
  },
  {
    id: 'INC-004',
    category: 'api',
    severity: 'medium',
    component: 'API Response Format',
    description: 'APIレスポンスの形式が統一されていない箇所がある',
    currentState: '{ success, data } / { data } / { result } など混在の恐れ',
    requiredState: '全APIで { success: boolean, data?: T, error?: { code, message } } に統一',
    recommendation: 'lib/api/response-formatter.ts を作成し、全APIで使用',
    estimatedEffort: 'medium',
    relatedFiles: ['app/api/']
  },
  {
    id: 'INC-005',
    category: 'n8n',
    severity: 'medium',
    component: 'Environment Variable Names',
    description: 'n8nとNext.jsで環境変数名が微妙に異なる箇所がある',
    currentState: 'SUPABASE_URL vs NEXT_PUBLIC_SUPABASE_URL など',
    requiredState: '環境変数マッピングを明確化し、両方で利用可能にする',
    recommendation: 'lib/config/env-mapping.ts を作成し、変換ロジックを一元化',
    estimatedEffort: 'small',
    relatedFiles: ['.env.local', 'lib/n8n/.env.template']
  },
];

// ========================================
// SECTION 5: セキュリティ関連
// ========================================

export const SECURITY_GAPS: AuditGapItem[] = [
  {
    id: 'SEC-001',
    category: 'security',
    severity: 'critical',
    component: 'API Rate Limiting',
    description: 'Next.js APIルートにレート制限が未実装',
    currentState: '無制限のAPIアクセスが可能',
    requiredState: 'IP/ユーザーごとに分単位のレート制限',
    recommendation: 'middleware.ts でUpstash Ratelimitを導入',
    estimatedEffort: 'medium',
    relatedFiles: ['middleware.ts']
  },
  {
    id: 'SEC-002',
    category: 'security',
    severity: 'high',
    component: 'Input Validation',
    description: '一部のAPIでZod等による入力バリデーションが不十分',
    currentState: 'body.xxx で直接アクセスしている箇所あり',
    requiredState: '全APIでZodスキーマによるバリデーション',
    recommendation: 'lib/validation/api-schemas.ts を作成し、全APIで使用',
    estimatedEffort: 'medium',
    relatedFiles: ['app/api/']
  },
  {
    id: 'SEC-003',
    category: 'security',
    severity: 'high',
    component: 'CSRF Protection',
    description: '状態変更APIにCSRF保護が未実装の箇所がある',
    currentState: 'POST/PUT/DELETE APIにCSRFトークン検証なし',
    requiredState: 'カスタムヘッダー or CSRFトークンによる保護',
    recommendation: 'middleware.ts でOriginヘッダー検証を追加',
    estimatedEffort: 'small',
    relatedFiles: ['middleware.ts']
  },
];

// ========================================
// 全監査結果の統合
// ========================================

export const ALL_AUDIT_GAPS: AuditGapItem[] = [
  ...UI_UX_GAPS,
  ...API_ONBOARDING_GAPS,
  ...MONITORING_GAPS,
  ...INCONSISTENCY_GAPS,
  ...SECURITY_GAPS,
];

// ========================================
// サマリー統計
// ========================================

export function getAuditSummary() {
  const total = ALL_AUDIT_GAPS.length;
  
  const byCategory = ALL_AUDIT_GAPS.reduce((acc, gap) => {
    acc[gap.category] = (acc[gap.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const bySeverity = ALL_AUDIT_GAPS.reduce((acc, gap) => {
    acc[gap.severity] = (acc[gap.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byEffort = ALL_AUDIT_GAPS.reduce((acc, gap) => {
    acc[gap.estimatedEffort] = (acc[gap.estimatedEffort] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    byCategory,
    bySeverity,
    byEffort,
    criticalCount: bySeverity.critical || 0,
    highCount: bySeverity.high || 0,
    mediumCount: bySeverity.medium || 0,
    lowCount: bySeverity.low || 0,
  };
}

// ========================================
// CSV出力用フォーマット
// ========================================

export function toCSV(): string {
  const headers = [
    'ID',
    'Category',
    'Severity',
    'Component',
    'Description',
    'Current State',
    'Required State',
    'Recommendation',
    'Estimated Effort'
  ];
  
  const rows = ALL_AUDIT_GAPS.map(gap => [
    gap.id,
    gap.category,
    gap.severity,
    `"${gap.component.replace(/"/g, '""')}"`,
    `"${gap.description.replace(/"/g, '""')}"`,
    `"${gap.currentState.replace(/"/g, '""')}"`,
    `"${gap.requiredState.replace(/"/g, '""')}"`,
    `"${gap.recommendation.replace(/"/g, '""')}"`,
    gap.estimatedEffort
  ]);
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

// ========================================
// 追加が必要なDBテーブル定義
// ========================================

export const ADDITIONAL_DB_SCHEMA = `
-- ========================================
-- 追加テーブル: system_health_metrics
-- ========================================

CREATE TABLE IF NOT EXISTS core.system_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  
  -- 期間
  period_type VARCHAR(20) NOT NULL, -- 'hourly', 'daily', 'weekly'
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- ツール識別
  tool_id VARCHAR(100) NOT NULL,
  tool_name VARCHAR(200),
  tool_category VARCHAR(50),
  
  -- 実行メトリクス
  execution_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,4) GENERATED ALWAYS AS (
    CASE WHEN execution_count > 0 
    THEN success_count::decimal / execution_count 
    ELSE 0 END
  ) STORED,
  
  -- パフォーマンス
  avg_execution_time_ms INTEGER,
  max_execution_time_ms INTEGER,
  min_execution_time_ms INTEGER,
  p95_execution_time_ms INTEGER,
  
  -- コスト
  total_api_cost_usd DECIMAL(15,6) DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  
  -- エラー詳細
  error_breakdown JSONB DEFAULT '{}'::jsonb,
  top_errors JSONB DEFAULT '[]'::jsonb,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, tool_id, period_type, period_start)
);

-- インデックス
CREATE INDEX idx_health_metrics_tenant ON core.system_health_metrics(tenant_id);
CREATE INDEX idx_health_metrics_tool ON core.system_health_metrics(tool_id);
CREATE INDEX idx_health_metrics_period ON core.system_health_metrics(period_start DESC);

-- RLS
ALTER TABLE core.system_health_metrics ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 追加テーブル: n8n_execution_logs
-- ========================================

CREATE TABLE IF NOT EXISTS core.n8n_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- n8n識別
  n8n_execution_id VARCHAR(100) NOT NULL UNIQUE,
  workflow_id VARCHAR(100) NOT NULL,
  workflow_name VARCHAR(200),
  
  -- 実行情報
  status VARCHAR(30) NOT NULL, -- 'success', 'error', 'running', 'waiting'
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  
  -- 入出力
  input_data_summary TEXT,
  output_data_summary TEXT,
  
  -- エラー
  error_message TEXT,
  error_node VARCHAR(200),
  error_stack TEXT,
  
  -- コスト追跡
  estimated_cost_usd DECIMAL(15,6),
  tokens_used INTEGER,
  api_calls_made INTEGER,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_n8n_logs_workflow ON core.n8n_execution_logs(workflow_id);
CREATE INDEX idx_n8n_logs_status ON core.n8n_execution_logs(status);
CREATE INDEX idx_n8n_logs_started ON core.n8n_execution_logs(started_at DESC);

-- RLS
ALTER TABLE core.n8n_execution_logs ENABLE ROW LEVEL SECURITY;
`;

export default {
  UI_UX_GAPS,
  API_ONBOARDING_GAPS,
  MONITORING_GAPS,
  INCONSISTENCY_GAPS,
  SECURITY_GAPS,
  ALL_AUDIT_GAPS,
  getAuditSummary,
  toCSV,
  ADDITIONAL_DB_SCHEMA,
};
