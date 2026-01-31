# N3 Empire OS V8.2.1-Autonomous
# 商用化・製品クオリティ完全監査レポート

**監査日**: 2025-01-24  
**監査者**: Claude AI  
**対象バージョン**: V8.2.1-Autonomous

---

## 📊 エグゼクティブサマリー

| 指標 | 値 |
|------|-----|
| **検出された欠落項目** | 31件 |
| **Critical（緊急）** | 7件 |
| **High（高優先）** | 13件 |
| **Medium（中優先）** | 10件 |
| **Low（低優先）** | 1件 |

### カテゴリ別内訳

| カテゴリ | 件数 |
|---------|------|
| UI/UX | 12件 |
| API | 5件 |
| Monitoring | 5件 |
| DB不整合 | 3件 |
| n8n不整合 | 2件 |
| Security | 3件 |

### 工数見積もり

| 規模 | 件数 | 概算工数 |
|------|------|----------|
| Large | 4件 | 各2-3日 |
| Medium | 17件 | 各1日 |
| Small | 10件 | 各0.5日 |
| **合計** | **31件** | **約25人日** |

---

## 🚨 CRITICAL（緊急対応必須）

### UI-001: API Credentials Manager UI
- **問題**: APIキー（eBay, Amazon, Keepa等）を安全に設定するUI画面が不完全
- **現状**: `app/api/credentials/route.ts`にAPIは存在するが、フロントエンドUIが欠落
- **影響**: ユーザーがn8nを直接操作しないとAPI連携ができない
- **対策**: `app/tools/settings-n3/components/CredentialsManagerPanel.tsx`を作成
- **工数**: Large（2-3日）

### UI-002: AI Decision Trace Viewer
- **問題**: AIエージェントの判断証跡を確認するUI画面が存在しない
- **現状**: `core.ai_decision_traces`テーブルは存在するが、閲覧UIが未実装
- **影響**: オーナーがAIの判断理由を確認できない
- **対策**: `app/tools/operations-n3/components/AIDecisionTracePanel.tsx`を作成
- **工数**: Medium（1日）

### UI-011: OAuth Setup Wizard
- **問題**: eBay/Amazon OAuth認証をステップバイステップで行うウィザードが存在しない
- **現状**: OAuth APIは存在するが、ユーザーフレンドリーなUIがない
- **影響**: 技術知識のないユーザーがセットアップできない
- **対策**: `app/tools/settings-n3/components/OAuthSetupWizard.tsx`を作成
- **工数**: Large（2-3日）

### API-001: eBay OAuth Callback Handler
- **問題**: eBay OAuth認証のコールバック処理が不完全
- **現状**: OAuth開始は可能だが、トークン取得後の自動保存が一部手動
- **影響**: トークン更新が失敗すると手動介入が必要
- **対策**: `app/api/auth/ebay/callback/route.ts`を拡張し、n8n API連携を追加
- **工数**: Medium（1日）

### API-002: Amazon SP-API OAuth Flow
- **問題**: Amazon SP-API認証フローが未実装
- **現状**: Amazon関連APIは存在するが、OAuth認証フローが不完全
- **影響**: Amazon連携が使用できない
- **対策**: `app/api/auth/amazon/oauth/route.ts`を作成
- **工数**: Large（2-3日）

### MON-001: System Health Metrics Table
- **問題**: 全ツールの実行回数・成功率・コストを記録するテーブルが存在しない
- **現状**: `core.audit_logs`に部分的な情報はあるが、集計用テーブルがない
- **影響**: システム全体の健全性を監視できない
- **対策**: `core.system_health_metrics`テーブルを追加（SQL下記）
- **工数**: Medium（1日）

### SEC-001: API Rate Limiting
- **問題**: Next.js APIルートにレート制限が未実装
- **現状**: 無制限のAPIアクセスが可能
- **影響**: DDoS攻撃や悪意のあるAPIスパムに脆弱
- **対策**: `middleware.ts`でUpstash Ratelimitを導入
- **工数**: Medium（1日）

---

## ⚠️ HIGH（高優先対応）

| ID | コンポーネント | 問題 | 対策 | 工数 |
|----|---------------|------|------|------|
| UI-003 | API Budget Manager UI | 予算設定UIが存在しない | APIBudgetPanel.tsx作成 | Medium |
| UI-004 | HitL Approval Dashboard | 承認UI画面が不完全 | HitLApprovalPanel.tsx作成 | Medium |
| UI-005 | Category Quota Manager UI | 出品枠設定UIが存在しない | CategoryQuotaPanel.tsx作成 | Medium |
| UI-006 | Exit Strategy Dashboard | 撤退候補UIが存在しない | ExitStrategyPanel.tsx作成 | Medium |
| UI-012 | Initial Setup Checklist | セットアップ進捗UIが存在しない | SetupChecklist.tsx作成 | Small |
| API-003 | Keepa API Key Validation | APIキー検証機能がない | validate/keepa/route.ts作成 | Small |
| API-004 | n8n Credentials Auto-Sync | DB→n8n自動同期が不完全 | credentials-sync.ts作成 | Medium |
| MON-002 | Metrics Dashboard UI | メトリクスUIが存在しない | SystemHealthDashboard.tsx作成 | Large |
| MON-003 | Cost Tracking per Tool | ツール別コスト追跡がない | Audit-Logにコスト計算追加 | Medium |
| INC-001 | products_master vs products | テーブル名混同の恐れ | grep検索→修正 | Small |
| INC-002 | Webhook Path Inconsistency | Webhookパス不一致の恐れ | webhook-normalizer実行 | Medium |
| SEC-002 | Input Validation | バリデーション不十分 | api-schemas.ts作成 | Medium |
| SEC-003 | CSRF Protection | CSRF保護未実装 | Originヘッダー検証追加 | Small |

---

## 📋 MEDIUM（中優先対応）

| ID | コンポーネント | 問題 | 対策 | 工数 |
|----|---------------|------|------|------|
| UI-007 | Asset Score Viewer | Asset Score表示UIが存在しない | テーブルに列追加 | Medium |
| UI-008 | Portfolio Risk Dashboard | リスク可視化UIが存在しない | PortfolioRiskPanel.tsx作成 | Medium |
| UI-009 | n8n Workflow Status UI | ワークフロー状況UIが不完全 | WorkflowStatusPanel.tsx拡張 | Small |
| UI-010 | EOL/Reprint Tracking UI | EOL追跡UIが存在しない | EOLTrackingPanel.tsx作成 | Medium |
| API-005 | Token Refresh Automation | 自動更新が不十分 | cron/token-refresh作成 | Medium |
| MON-004 | Error Alert System | アラート機能が不十分 | alerts/route.ts作成 | Medium |
| MON-005 | n8n Execution Aggregator | 実行履歴集約がない | execution-webhook作成 | Small |
| INC-003 | Column Name Variations | カラム名不統一 | ALTER TABLEで修正 | Small |
| INC-004 | API Response Format | レスポンス形式不統一 | response-formatter.ts作成 | Medium |
| INC-005 | Environment Variable Names | 環境変数名不統一 | env-mapping.ts作成 | Small |

---

## 🗄️ 追加が必要なDBテーブル

### core.system_health_metrics

```sql
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
```

### core.n8n_execution_logs

```sql
CREATE TABLE IF NOT EXISTS core.n8n_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  
  -- n8n識別
  n8n_execution_id VARCHAR(100) NOT NULL UNIQUE,
  workflow_id VARCHAR(100) NOT NULL,
  workflow_name VARCHAR(200),
  
  -- 実行情報
  status VARCHAR(30) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  execution_time_ms INTEGER,
  
  -- 入出力
  input_data_summary TEXT,
  output_data_summary TEXT,
  
  -- エラー
  error_message TEXT,
  error_node VARCHAR(200),
  
  -- コスト追跡
  estimated_cost_usd DECIMAL(15,6),
  tokens_used INTEGER,
  api_calls_made INTEGER,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🖼️ UI設計案: AI Decision Trace Viewer

### 画面構成

```
┌─────────────────────────────────────────────────────────────────┐
│ AI判断証跡ビューア                                    [更新] [CSV出力]│
├─────────────────────────────────────────────────────────────────┤
│ フィルタ: [決定タイプ ▼] [モデル ▼] [日付範囲] [確信度 >__]         │
├─────────────────────────────────────────────────────────────────┤
│ ID     │ タイプ        │ モデル       │ 確信度 │ 決定    │ 日時      │
│────────┼───────────────┼──────────────┼────────┼─────────┼───────────│
│ trace-1│ selsimilar    │ gpt-4o       │ 82%    │ 自動承認│ 10:23:45  │
│ trace-2│ exit_strategy │ gpt-4o-mini  │ 65%    │ HitL    │ 10:22:30  │
│ trace-3│ price_optimize│ gemini-flash │ 91%    │ 自動承認│ 10:21:15  │
│ [詳細] │               │              │        │         │           │
├─────────────────────────────────────────────────────────────────┤
│ 詳細パネル（選択時に展開）                                         │
│ ┌─入力データ────────────┐ ┌─AI推論──────────────────────┐       │
│ │ { "product_id": ...  │ │ タイトル類似度: 78%        │       │
│ │   "title": "..."     │ │ 画像類似度: 85%            │       │
│ │ }                    │ │ 総合スコア: 82%            │       │
│ └──────────────────────┘ └────────────────────────────┘       │
│ ┌─決定理由────────────────────────────────────────────────────┐ │
│ │ 「確信度82%が閾値75%を超えたため自動承認。次点との差は12pt。」   │ │
│ └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### コンポーネント構成

```typescript
// app/tools/operations-n3/components/AIDecisionTracePanel.tsx
interface AIDecisionTracePanel {
  // フィルタ
  filters: {
    decisionType?: string;
    aiModel?: string;
    dateFrom?: Date;
    dateTo?: Date;
    minConfidence?: number;
    wasExecuted?: boolean;
    humanOverride?: boolean;
  };
  
  // ページネーション
  page: number;
  pageSize: number;
  
  // ソート
  sortBy: 'created_at' | 'confidence' | 'decision_type';
  sortOrder: 'asc' | 'desc';
}
```

---

## 🔐 APIオンボーディング自動化フロー

### 理想的なフロー（修正後）

```
ユーザー
   │
   ▼
┌──────────────────────────────────────────────────────────────┐
│ 1. 設定画面 → 「eBay連携」ボタンをクリック                       │
└──────────────────────────────────────────────────────────────┘
   │
   ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. OAuth Setup Wizard が起動                                  │
│    ステップ1: 説明「eBayアカウントと連携します」               │
│    ステップ2: 「eBayでログイン」ボタン → eBay OAuth画面へ       │
└──────────────────────────────────────────────────────────────┘
   │
   ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. eBay OAuth画面でユーザーが承認                              │
└──────────────────────────────────────────────────────────────┘
   │
   ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. Callback: /api/auth/ebay/callback                          │
│    - code受信                                                 │
│    - Access Token取得                                         │
│    - Refresh Token取得                                        │
│    - DB保存（encrypted_credentials）   ←─ 現在は部分実装      │
│    - n8n Credentials 自動更新          ←─ 【未実装】          │
└──────────────────────────────────────────────────────────────┘
   │
   ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. ステップ3: 「連携完了！」確認画面                           │
│    - 接続テスト実行                                           │
│    - 「設定に戻る」ボタン                                     │
└──────────────────────────────────────────────────────────────┘
```

### n8n Credentials同期の実装案

```typescript
// lib/n8n/credentials-sync.ts

export async function syncCredentialToN8n(
  credentialId: string,
  marketplaceId: string,
  credentials: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
  }
): Promise<boolean> {
  const n8nApiUrl = process.env.N8N_API_URL;
  const n8nApiKey = process.env.N8N_API_KEY;
  
  // n8n REST API経由でCredentialsを更新
  const response = await fetch(`${n8nApiUrl}/api/v1/credentials/${credentialId}`, {
    method: 'PATCH',
    headers: {
      'X-N8N-API-KEY': n8nApiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken
      }
    })
  });
  
  return response.ok;
}
```

---

## 📈 推奨実装順序

### Phase A: Critical対応（1週間）

1. **SEC-001**: API Rate Limiting（DoS攻撃防止）
2. **UI-001**: API Credentials Manager UI
3. **UI-011**: OAuth Setup Wizard
4. **API-001**: eBay OAuth Callback Handler
5. **API-002**: Amazon SP-API OAuth Flow

### Phase B: モニタリング整備（3日）

1. **MON-001**: system_health_metrics テーブル追加
2. **MON-002**: Metrics Dashboard UI
3. **MON-003**: Cost Tracking per Tool

### Phase C: 知能UI整備（3日）

1. **UI-002**: AI Decision Trace Viewer
2. **UI-004**: HitL Approval Dashboard
3. **UI-006**: Exit Strategy Dashboard

### Phase D: 残りの対応（4日）

1. その他のHigh/Medium項目

---

## 📁 成果物

1. **監査レポート**: `lib/audit/commercial-audit-report.ts`
2. **CSVエクスポート**: `lib/audit/commercial-audit-gaps.csv`
3. **本ドキュメント**: `lib/audit/COMMERCIAL_AUDIT_REPORT.md`

---

**監査完了**

全31件の欠落項目を特定しました。Critical 7件を最優先で対応することを推奨します。
