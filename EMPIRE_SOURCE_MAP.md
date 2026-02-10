# 🧠 N3 Empire Source Map

生成日時: 2026-02-05T13:44:53.594Z
TypeScriptファイル: 604
Pythonファイル: 0

## 概要

このマップは、N3帝国のソースコードの「全文」ではなく、
「どこに何があるか」の地図です。NotebookLMはこれを元に
システム全体の構造を理解します。

---

## TypeScript API Routes & Services

### app/api/accounting/ai-analysis/route.ts

- **GET** (request: NextRequest)
  - AI経営分析結果の取得・実行API
- **POST** (request: NextRequest)
  - AI経営分析結果の取得・実行API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/accounting/expense-breakdown/route.ts

- **GET** (request: NextRequest)
  - 経費内訳取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/accounting/expense-master/route.ts

- **GET** (request: NextRequest)
  - GET: 経費マスタ一覧取得
- **POST** (request: NextRequest)
  - GET: 経費マスタ一覧取得
- **PUT** (request: NextRequest)
  - GET: 経費マスタ一覧取得
- **DELETE** (request: NextRequest)
  - GET: 経費マスタ一覧取得
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/accounting/financial-summary/route.ts

- **GET** (request: NextRequest)
  - 財務データサマリー取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/accounting/journal-entries/route.ts

- **GET** (request: NextRequest)
  - GET: 仕訳エントリ一覧取得
- **PUT** (request: NextRequest)
  - GET: 仕訳エントリ一覧取得
- **DELETE** (request: NextRequest)
  - GET: 仕訳エントリ一覧取得
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/accounting/link-invoices/route.ts

- **POST** (request: NextRequest)
  - POST /api/accounting/link-invoices
- **GET** (request: NextRequest)
  - POST /api/accounting/link-invoices
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/accounting/sync-mf/route.ts

- **POST** (request: NextRequest)
  - POST: MFクラウド同期実行
- **GET** (request: NextRequest)
  - POST: MFクラウド同期実行
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/accounting/sync-money-cloud/route.ts

- **POST** (request: NextRequest)
  - マネークラウド連携API
- **POST Handler** (request)
  - API Route Handler

### app/api/admin/deploy/route.ts

- **POST** (request: NextRequest)
  - N3 デプロイAPI
- **GET** (request: NextRequest)
  - N3 デプロイAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/admin/migrate/route.ts

- **POST** (request: Request)
  - DBマイグレーション実行API
- **GET** ()
  - DBマイグレーション実行API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/admin/migrate-credentials/route.ts

- **POST** (req: NextRequest)
  - P0: 認証情報移行API
- **GET** (req: NextRequest)
  - P0: 認証情報移行API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/admin/migrate-tokens/route.ts

- **POST** (request: NextRequest)
  - トークン移行API
- **GET** (request: NextRequest)
  - トークン移行API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/admin/sync-listing-status/route.ts

- **POST** (request: NextRequest)
  - 出品ステータス同期API
- **GET** ()
  - 出品ステータス同期API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/ai/batch-analysis/route.ts

- **POST** (request: Request)
  - AI一括画像解析API
- **POST Handler** (request)
  - API Route Handler

### app/api/ai/field-completion/route.ts

- **POST** (request: NextRequest)
  - フィールド補完APIエンドポイント
- **OPTIONS** ()
  - フィールド補完APIエンドポイント
- **POST Handler** (request)
  - API Route Handler

### app/api/ai/image-analysis/route.ts

- **POST** (request: Request)
  - AI画像解析API
- **GET** ()
  - AI画像解析API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/ai/weight-estimation/route.ts

- **POST** (request: NextRequest)
  - AI重量推定API
- **PATCH** (request: NextRequest)
  - AI重量推定API
- **POST Handler** (request)
  - API Route Handler

### app/api/amazon/orders/route.ts

- **GET** (req: NextRequest)
  - Amazon SP-API 受注取得API
- **POST** (req: NextRequest)
  - Amazon SP-API 受注取得API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/amazon/tokens/auto-refresh/route.ts

- **POST** (request: NextRequest)
  - Amazon SP-API トークン自動リフレッシュエンドポイント
- **GET** ()
  - Amazon SP-API トークン自動リフレッシュエンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/amazon/tokens/route.ts

- **GET** (request: NextRequest)
  - Amazon SP-API トークン管理エンドポイント
- **POST** (request: NextRequest)
  - Amazon SP-API トークン管理エンドポイント
- **DELETE** (request: NextRequest)
  - Amazon SP-API トークン管理エンドポイント
- **PATCH** (request: NextRequest)
  - Amazon SP-API トークン管理エンドポイント
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/approval/create-schedule/route.ts

- **POST** (request: NextRequest)
  - 承認と出品スケジュール作成API
- **GET** (request: NextRequest)
  - 承認と出品スケジュール作成API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/approval/delete-schedule/route.ts

- **DELETE** (request: NextRequest)
  - スケジュール削除API
- **POST** (request: NextRequest)
  - スケジュール削除API
- **DELETE Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/approval/update-schedule/route.ts

- **PATCH** (request: NextRequest)
  - スケジュール更新API
- **POST** (request: NextRequest)
  - スケジュール更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/audit/ai-review/route.ts

- **POST** (request: NextRequest)
  - AI監査APIエンドポイント
- **OPTIONS** ()
  - AI監査APIエンドポイント
- **POST Handler** (request)
  - API Route Handler

### app/api/audit/dashboard/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/audit/submit/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/auth/login/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/auth/logout/route.ts

- **POST** (request: NextRequest)
  - POST /api/auth/logout
- **POST Handler** (request)
  - API Route Handler

### app/api/auth/me/route.ts

- **GET** (request: NextRequest)
  - GET /api/auth/me
- **GET Handler** (request)
  - API Route Handler

### app/api/auth/oauth/callback/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/auth/oauth/route.ts

- **POST** (request: NextRequest)
- **GET** (request: NextRequest)
- **PUT** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/auth/register/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/auth/reset-password-temp/route.ts

- **POST** (request: NextRequest)
  - 一時的なパスワードリセットAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/auto-approve/route.ts

- **GET** (request: NextRequest)
  - 自動承認実行API
- **POST** (request: NextRequest)
  - 自動承認実行API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/auto-schedule/route.ts

- **GET** (request: NextRequest)
  - 自動スケジュール生成API
- **POST** (request: NextRequest)
  - 自動スケジュール生成API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/cron-settings/route.ts

- **GET** (request: NextRequest)
  - Cron設定API
- **PUT** (request: NextRequest)
  - Cron設定API
- **POST** (request: NextRequest)
  - Cron設定API
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/logs/route.ts

- **GET** (request: NextRequest)
  - 自動化ログAPI
- **DELETE** (request: NextRequest)
  - 自動化ログAPI
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/automation/pipeline/route.ts

- **GET** (request: NextRequest)
  - 🔄 Auto Pipeline API
- **POST** (request: NextRequest)
  - 🔄 Auto Pipeline API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/scheduler/log/route.ts

- **POST** (request: NextRequest)
  - 📝 Master Scheduler - Log API
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/scheduler/quarantine/route.ts

- **POST** (request: NextRequest)
  - 🔒 Master Scheduler - Quarantine API
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/scheduler/retry/route.ts

- **POST** (request: NextRequest)
  - 🔄 Master Scheduler - Retry API
- **POST Handler** (request)
  - API Route Handler

### app/api/automation/scheduler/tasks/route.ts

- **GET** (request: NextRequest)
  - 🕐 Master Scheduler - Tasks API
- **GET Handler** (request)
  - API Route Handler

### app/api/automation/settings/route.ts

- **GET** (request: NextRequest)
  - Phase C-2: Automation Settings API
- **POST** (request: NextRequest)
  - Phase C-2: Automation Settings API
- **PUT** (request: NextRequest)
  - Phase C-2: Automation Settings API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/batch-listing/route.ts

- **POST** (request: NextRequest)
  - バッチ出品処理エンドポイント
- **GET** (request: NextRequest)
  - バッチ出品処理エンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/ai-suggest/route.ts

- **POST** (request: NextRequest)
  - N3 記帳オートメーション - AI サジェスション API
- **POST Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/apply-rules/route.ts

- **POST** (request: NextRequest)
  - N3 記帳オートメーション - ルール適用 API
- **POST Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/mf/test-connection/route.ts

- **GET** (request: NextRequest)
  - MFクラウド API 接続テスト
- **POST** (request: NextRequest)
  - MFクラウド API 接続テスト
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/rules/delete-all/route.ts

- **DELETE** (request: NextRequest)
  - 全ルール削除API
- **GET** ()
  - 全ルール削除API
- **DELETE Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/rules/import/route.ts

- **POST** (request: NextRequest)
  - 記帳ルール一括インポートAPI
- **GET** (request: NextRequest)
  - 記帳ルール一括インポートAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/rules/import-from-sheet/route.ts

- **POST** (request: NextRequest)
  - スプレッドシートから直接ルールをインポート
- **GET** ()
  - スプレッドシートから直接ルールをインポート
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/rules/route.ts

- **GET** (request: NextRequest)
  - N3 記帳オートメーション - ルール API
- **POST** (request: NextRequest)
  - N3 記帳オートメーション - ルール API
- **PUT** (request: NextRequest)
  - N3 記帳オートメーション - ルール API
- **DELETE** (request: NextRequest)
  - N3 記帳オートメーション - ルール API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/rules/sync/route.ts

- **POST** (request: NextRequest)
  - スプレッドシートからの差分同期API
- **GET** (request: NextRequest)
  - スプレッドシートからの差分同期API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/supusi/route.ts

- **GET** (request: NextRequest)
  - Supusi連携API
- **POST** (request: NextRequest)
  - Supusi連携API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/bookkeeping-n3/transactions/route.ts

- **GET** (request: NextRequest)
  - N3 記帳オートメーション - 取引データ API
- **POST** (request: NextRequest)
  - N3 記帳オートメーション - 取引データ API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/bundle/bulk/route.ts

- **POST** (request: NextRequest)
  - セット品構成の一括操作API
- **DELETE** (request: NextRequest)
  - セット品構成の一括操作API
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/bundle/route.ts

- **GET** (request: NextRequest)
  - セット品構成（bundle_items）管理API
- **POST** (request: NextRequest)
  - セット品構成（bundle_items）管理API
- **DELETE** (request: NextRequest)
  - セット品構成（bundle_items）管理API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/credentials/manage/route.ts

- **POST** (request: NextRequest)
  - 認証情報の保存
- **GET** (request: NextRequest)
  - 認証情報の保存
- **DELETE** (request: NextRequest)
  - 認証情報の保存
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/credentials/route.ts

- **GET** (request: NextRequest)
  - P0: 暗号化された認証情報管理API
- **POST** (request: NextRequest)
  - P0: 暗号化された認証情報管理API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/cron/amazon-research/route.ts

- **GET** (request: NextRequest)
  - Amazon Research Cron Job
- **POST** (request: NextRequest)
  - Amazon Research Cron Job
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/cron/apply-changes/route.ts

- **GET** (request: NextRequest)
  - ====================================================================
- **POST** (request: NextRequest)
  - ====================================================================
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/cron/inventory-monitoring/route.ts

- **GET** (request: NextRequest)
  - ====================================================================
- **POST** (request: NextRequest)
  - ====================================================================
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/cron/research-auto/route.ts

- **POST** (request: NextRequest)
  - Research Auto Cron API - 完全版（監視・通知・検証対応）
- **GET** ()
  - Research Auto Cron API - 完全版（監視・通知・検証対応）
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/cron/spreadsheet-pull/route.ts

- **POST** (request: NextRequest)
  - ====================================================================
- **GET** (request: NextRequest)
  - ====================================================================
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/cron/spreadsheet-push/route.ts

- **POST** (request: NextRequest)
  - ====================================================================
- **GET** (request: NextRequest)
  - ====================================================================
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/currency/convert/route.ts

- **POST** (request: NextRequest)
  - 通貨変換API - ハイブリッドAI監査パイプライン
- **GET** (request: NextRequest)
  - 通貨変換API - ハイブリッドAI監査パイプライン
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/database/check-linked/route.ts

- **GET** ()
  - 連携データ確認API
- **GET Handler** (request)
  - API Route Handler

### app/api/database/check-skus/route.ts

- **GET** ()
  - SKU形式調査API
- **GET Handler** (request)
  - API Route Handler

### app/api/database/link-by-unique-id/route.ts

- **GET** ()
  - unique_idベースで連携するAPI
- **POST** (request: NextRequest)
  - unique_idベースで連携するAPI
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/database/link-tables/route.ts

- **GET** ()
  - テーブル連携API
- **POST** (request: NextRequest)
  - テーブル連携API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/database/migrate/route.ts

- **GET** (request: NextRequest)
- **POST** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/database/migrate-ai-hub/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/database/migrate-shipping/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/database/migrate-sm-sales/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/database/migrate-sql/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/database/run-migration/route.ts

- **GET** ()
  - マイグレーション実行API
- **POST** (request: NextRequest)
  - マイグレーション実行API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/debug/ebay-auth-test/route.ts

- **GET** (request: NextRequest)
  - eBay認証テストAPI
- **POST** (request: NextRequest)
  - eBay認証テストAPI
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/debug/fix-is-parent/route.ts

- **POST** (request: NextRequest)
  - is_parent フラグ修正API
- **GET** (request: NextRequest)
  - is_parent フラグ修正API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/investigate-godzilla/route.ts

- **GET** (request: NextRequest)
  - Little Godzilla 調査API
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/master-vs-editing/route.ts

- **GET** (request: NextRequest)
  - 🔥 緊急調査API - マスター vs データ編集の完全突合
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/master-vs-workflow/route.ts

- **GET** (request: NextRequest)
  - マスター vs ワークフロー 比較デバッグAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/missing-products/route.ts

- **GET** (request: NextRequest)
  - 商品消失調査API v2
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/schema/route.ts

- **GET** (request: NextRequest)
  - デバッグ用：products_masterテーブルのスキーマを確認
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/test-data-editing/route.ts

- **GET** (request: NextRequest)
  - データ編集タブAPIテスト
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/verify-counts/route.ts

- **GET** (request: NextRequest)
  - タブカウント整合性検証API v2（引き継ぎ書準拠）
- **GET Handler** (request)
  - API Route Handler

### app/api/debug/workflow-breakdown/route.ts

- **GET** (request: NextRequest)
  - ワークフロー分類詳細デバッグAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/[jobId]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { jobId: string } })
  - 🔍 Job Status API - 非同期Job状態取得
- **DELETE** (request: NextRequest,
  { params }: { params: { jobId: string } })
  - 🔍 Job Status API - 非同期Job状態取得
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/dispatch/cancel/route.ts

- **POST** (request: NextRequest)
  - ⏹️ Job Cancel API
- **OPTIONS** ()
  - ⏹️ Job Cancel API
- **POST Handler** (request)
  - API Route Handler

### app/api/dispatch/concurrency/reset/route.ts

- **POST** (request: NextRequest)
  - 🔓 Concurrency Reset API
- **POST Handler** (request)
  - API Route Handler

### app/api/dispatch/concurrency/route.ts

- **GET** (request: NextRequest)
  - 🔒 Concurrency Status API
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/control/route.ts

- **POST** (request: NextRequest)
  - 🎛️ Job Control API
- **OPTIONS** ()
  - 🎛️ Job Control API
- **POST Handler** (request)
  - API Route Handler

### app/api/dispatch/health/route.ts

- **GET** (request: NextRequest)
  - 📊 System Health API
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/jobs/route.ts

- **GET** (request: NextRequest)
  - 📋 Job一覧取得API
- **OPTIONS** ()
  - 📋 Job一覧取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/kill-switch/route.ts

- **GET** (request: NextRequest)
  - 🛑 Kill Switch API
- **POST** (request: NextRequest)
  - 🛑 Kill Switch API
- **OPTIONS** ()
  - 🛑 Kill Switch API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/dispatch/logs/route.ts

- **GET** (request: NextRequest)
  - 📋 Execution Logs API
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/metrics/route.ts

- **GET** (request: NextRequest)
  - 📊 Dispatch Metrics API
- **OPTIONS** ()
  - 📊 Dispatch Metrics API
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/retry/route.ts

- **POST** (request: NextRequest)
  - 🔄 Job Retry API
- **OPTIONS** ()
  - 🔄 Job Retry API
- **POST Handler** (request)
  - API Route Handler

### app/api/dispatch/route.ts

- **POST** (request: NextRequest)
  - 🚀 Dispatch API - Hub統合エンドポイント
- **GET** (request: NextRequest)
  - 🚀 Dispatch API - Hub統合エンドポイント
- **OPTIONS** ()
  - 🚀 Dispatch API - Hub統合エンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/dispatch/status/route.ts

- **GET** (request: NextRequest)
  - 📊 Global Status API
- **OPTIONS** ()
  - 📊 Global Status API
- **GET Handler** (request)
  - API Route Handler

### app/api/docs/content/route.ts

- **GET** (request: NextRequest)
  - ドキュメント内容取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/docs/counts/route.ts

- **GET** ()
  - ドキュメントカテゴリ別件数取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/docs/create/route.ts

- **POST** (request: NextRequest)
  - ドキュメント作成API
- **POST Handler** (request)
  - API Route Handler

### app/api/docs/list/route.ts

- **GET** (request: NextRequest)
  - ドキュメント一覧取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/accounts/[id]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { id: string } })
  - app/api/ebay/accounts/[id]/route.ts
- **PATCH** (request: NextRequest,
  { params }: { params: { id: string } })
  - app/api/ebay/accounts/[id]/route.ts
- **DELETE** (request: NextRequest,
  { params }: { params: { id: string } })
  - app/api/ebay/accounts/[id]/route.ts
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/ebay/accounts/route.ts

- **GET** (request: NextRequest)
  - app/api/ebay/accounts/route.ts
- **POST** (request: NextRequest)
  - app/api/ebay/accounts/route.ts
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/analyze-current-policies/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/analyze-shipping-data/route.ts

- **GET** ()
  - 配送データの分析API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/auth/authorize/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/auth/callback/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/auth/check-env/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/auth/test-token/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/auto-offer/calculate/route.ts

- **POST** (request: NextRequest)
  - eBay Auto Offer API - Calculate Offer
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/auto-offer/send/route.ts

- **POST** (request: NextRequest)
  - eBay Auto Offer API - Send Offer
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/blocklist/approve/route.ts

- **POST** (request: NextRequest)
  - POST /api/ebay/blocklist/approve
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/blocklist/buyers/route.ts

- **GET** (request: NextRequest)
  - GET /api/ebay/blocklist/buyers
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/blocklist/cron-sync/route.ts

- **GET** (request: NextRequest)
  - GET /api/ebay/blocklist/cron-sync
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/blocklist/report/route.ts

- **POST** (request: NextRequest)
  - POST /api/ebay/blocklist/report
- **GET** (request: NextRequest)
  - POST /api/ebay/blocklist/report
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/blocklist/stats/route.ts

- **GET** (request: NextRequest)
  - GET /api/ebay/blocklist/stats
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/blocklist/sync/route.ts

- **POST** (request: NextRequest)
  - POST /api/ebay/blocklist/sync
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/browse/search/route-v2.ts

- **POST** (request: NextRequest)
  - Refresh Tokenを使用してUser Access Token取得
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/browse/search/route.ts

- **POST** (request: NextRequest)
  - 🔥 汎用的なキーワード抽出（ハイブリッド型）
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/browse/search/route_phase1.ts

- **POST** (request: NextRequest)
  - 🔥 汎用的なキーワード抽出（ハイブリッド型）
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/bulk-calculate/route.ts

- **POST** (request: NextRequest)
  - 大量商品の一括価格計算API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/category/conditions/route.ts

- **GET** (request: NextRequest)
  - eBay カテゴリ別有効Condition取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/category-limit/route.ts

- **GET** (request: NextRequest)
  - eBay Category Limit API - Get All Category Limits
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/category-limit/sync/route.ts

- **POST** (request: NextRequest)
  - eBay Category Limit API - Sync with eBay
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/category-specifics/route.ts

- **POST** (request: NextRequest)
  - eBay GetCategorySpecifics API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/check-env/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/check-fedex-table/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/check-table-structure/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/check-token/route.ts

- **GET** (req: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/check-tokens/route.ts

- **GET** (req: NextRequest)
  - eBayトークン確認API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/count/route.ts

- **GET** (req: NextRequest)
  - eBay出品数確認API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/create-listing/route.ts

- **POST** (request: NextRequest)
  - eBay 即時出品API - ebay_default_policies対応版 (v2.1)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/ddp-surcharge-matrix/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/debug/credentials/route.ts

- **GET** (request: NextRequest)
  - デバッグ用API: ebay_credentialsテーブルの確認
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/debug/env/route.ts

- **GET** ()
  - デバッグ用API: 環境変数の確認
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/debug/schema/route.ts

- **GET** ()
  - デバッグ用API: ebay_tokensテーブルのスキーマと実データ確認
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/debug/tokens/route.ts

- **GET** (request: NextRequest)
  - デバッグ用API: ebay_tokensテーブルの確認
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/debug-listing-config/route.ts

- **GET** (request: NextRequest)
  - eBay デバッグAPI - ポリシー設定状況確認
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/finding-advanced/route.ts

- **POST** (request: NextRequest)
  - findItemsAdvanced を使用（現在の出品価格から最安値を推測）
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/fulfillment-policy/create/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/fulfillment-policy/list/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/get-categories/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/get-categories-taxonomy/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/get-category-fee/route.ts

- **GET** (request: Request)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/get-item-by-url/route.ts

- **POST** (request: NextRequest)
  - eBay URL から商品詳細を取得するAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/get-item-details/route.ts

- **GET** (request: NextRequest)
  - eBay 商品詳細取得API
- **POST** (request: NextRequest)
  - eBay 商品詳細取得API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/get-item-details-trading/route.ts

- **POST** (request: NextRequest)
  - eBay Trading API GetItem
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/get-policy-zone-rates/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/get-shipping-data/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/get-shipping-policies/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/get-shipping-policy-id/route.ts

- **GET** (request: NextRequest)
  - 出品ツール用: アカウント別の配送ポリシーIDを取得
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/get-token/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/get-unique-fvf-rates/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/inventory/item/route.ts

- **GET** (request: NextRequest)
  - eBay Inventory Item 取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/inventory/list/route.ts

- **GET** (request: NextRequest)
  - eBay Inventory API - 在庫一覧取得
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/inventory/mock/route.ts

- **GET** (request: NextRequest)
  - eBay Inventory API - モックデータ版（開発用）
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/inventory/route.ts

- **GET** (request: NextRequest)
  - eBay Inventory API エンドポイント
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/inventory/simple/route.ts

- **GET** (request: NextRequest)
  - eBay Inventory API - シンプル版（単一アカウント）
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/list-categories/route.ts

- **GET** (request: Request)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/list-policies/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/list-rate-tables/route.ts

- **GET** (req: NextRequest)
- **POST** (req: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/listing/route.ts

- **POST** (request: NextRequest)
  - eBay 出品 API エンドポイント (Smart Listing対応版)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/listing/validate/route.ts

- **POST** (request: NextRequest)
  - eBay 出品データ検証 API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/listings/end/route.ts

- **POST** (request: Request)
  - eBay リスティング終了API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/listings/update-inventory/route.ts

- **POST** (request: Request)
  - eBay リスティング在庫更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/listings/update-price/route.ts

- **POST** (request: Request)
  - eBay リスティング価格更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/location/create/route.ts

- **POST** (request: NextRequest)
  - eBay Location作成API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/location/list/route.ts

- **GET** (request: NextRequest)
  - eBay Location取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/marketing/check-ad/route.ts

- **GET** (request: NextRequest)
  - eBay Marketing API - 広告確認
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/offers/delete/route.ts

- **POST** (request: NextRequest)
  - eBay Offer 削除API
- **DELETE** (request: NextRequest)
  - eBay Offer 削除API
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/ebay/offers/route.ts

- **GET** (request: NextRequest)
  - eBay Offers 一覧取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/orders/route.ts

- **GET** (req: NextRequest)
  - eBay Orders API
- **POST** (req: NextRequest)
  - eBay Orders API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/policy/list/route.ts

- **GET** (req: NextRequest)
  - eBay Policy取得API - 自動トークン更新対応
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/policy/setup/route.ts

- **POST** (req: NextRequest)
  - eBay Policy自動設定API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/policy/sync-to-db/route.ts

- **POST** (req: NextRequest)
  - eBay配送ポリシーをデータベースに同期
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/rate-tables/detail/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/rate-tables/rebuild/route.ts

- **POST** ()
  - 重量に最も近いマスターデータを検索
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/rate-tables/route.ts

- **GET** (request: Request)
  - GET /api/ebay/rate-tables
- **POST** ()
  - GET /api/ebay/rate-tables
- **DELETE** ()
  - GET /api/ebay/rate-tables
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/ebay/refresh-product/route.ts

- **POST** (req: NextRequest)
  - eBay商品詳細取得・更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/rotation/candidates/route.ts

- **GET** (request: NextRequest)
  - eBay Listing Rotation API - Get Rotation Candidates
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/rotation/execute/route.ts

- **POST** (request: NextRequest)
  - eBay Listing Rotation API - Execute Rotation
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/save-categories/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/search/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/select-shipping-policy/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/sell/test/route.ts

- **GET** (request: NextRequest)
  - Sell API テスト - Account API (Fulfillment Policy取得)
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/shipping-policy/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/sm-analysis/route.ts

- **POST** (request: NextRequest)
  - 🔥 統合SM分析API
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/sync/route.ts

- **POST** (request: NextRequest)
  - eBay 在庫同期 API
- **GET** (request: NextRequest)
  - eBay 在庫同期 API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/sync-rate-tables/route.ts

- **GET** (req: NextRequest)
  - 段階 I: Rate Table ID取得・同期API
- **POST** (req: NextRequest)
  - 段階 I: Rate Table ID取得・同期API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/test-listing/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/tokens/[account]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { account: string } })
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/tokens/auto-refresh/route.ts

- **POST** (request: NextRequest)
  - eBay Refresh Token自動更新API
- **GET** (request: NextRequest)
  - eBay Refresh Token自動更新API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/tokens/manual-save/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/tokens/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/ebay/update-listing-price/route.ts

- **POST** (request: NextRequest)
  - POST /api/ebay/update-listing-price
- **POST Handler** (request)
  - API Route Handler

### app/api/ebay/verify-seller/route.ts

- **GET** (req: NextRequest)
  - eBayアカウントのセラーID確認API
- **GET Handler** (request)
  - API Route Handler

### app/api/eu-responsible/[id]/route.ts

- **PATCH** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - PATCH /api/eu-responsible/[id]

### app/api/eu-responsible/route.ts

- **GET** (request: NextRequest)
  - GET /api/eu-responsible
- **POST** (request: NextRequest)
  - GET /api/eu-responsible
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/eu-responsible/search/route.ts

- **GET** (request: NextRequest)
  - GET /api/eu-responsible/search?manufacturer=xxx&brand=xxx
- **GET Handler** (request)
  - API Route Handler

### app/api/export/ebay-csv/route.ts

- **POST** (request: NextRequest)
  - eBay File Exchange CSV エクスポート API
- **GET** (request: NextRequest)
  - eBay File Exchange CSV エクスポート API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/export/ebay-csv-v2/route.ts

- **POST** (request: NextRequest)
  - eBay CSV Export API (v2)
- **GET** (request: NextRequest)
  - eBay CSV Export API (v2)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/export/excel/route.ts

- **POST** (request: NextRequest)
  - Excelエクスポート API
- **POST Handler** (request)
  - API Route Handler

### app/api/fulfillment/notify-marketplace/route.ts

- **POST** (request: NextRequest)
  - モール発送通知API
- **POST Handler** (request)
  - API Route Handler

### app/api/gateway/route.ts

- **POST** (request: NextRequest)
  - 帝国OS統合APIゲートウェイ v2
- **GET** (request: NextRequest)
  - 帝国OS統合APIゲートウェイ v2
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/gdp/projects/route.ts

- **POST** (request: NextRequest)
- **GET** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/gdp/queue/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/gemini-prompt/route.ts

- **POST** (request: NextRequest)
  - Gemini用プロンプト生成API
- **POST Handler** (request)
  - API Route Handler

### app/api/governance/audit-data/route.ts

- **GET** ()
  - 🏛️ 帝国監査データAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/governance/nightly-cycle/route.ts

- **GET** ()
  - 🏛️ 夜間自律開発サイクルAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/governance/nightly-result/route.ts

- **GET** ()
  - 🛡️ 夜間自律開発結果API
- **GET Handler** (request)
  - API Route Handler

### app/api/governance/notebooklm-export/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/governance/stray-scan/route.ts

- **GET** ()
  - 🔍 野良ファイルスキャンAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/health/apis/route.ts

- **GET** (request: NextRequest)
  - Phase C-5: External API Health Check
- **GET Handler** (request)
  - API Route Handler

### app/api/health/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/health/smoke-test/route.ts

- **GET** (request: NextRequest)
  - Phase C-6: System Smoke Test
- **GET Handler** (request)
  - API Route Handler

### app/api/hitl/approve/[actionCode]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: Promise<{ actionCode: string }> })
- **POST** (request: NextRequest,
  { params }: { params: Promise<{ actionCode: string }> })
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/hitl/pending/route.ts

- **GET** (request: NextRequest)
- **POST** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/hitl/reject/[actionCode]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: Promise<{ actionCode: string }> })
- **POST** (request: NextRequest,
  { params }: { params: Promise<{ actionCode: string }> })
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/html-templates/local/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/image-optimization/generate-variants/route.ts

- **POST** (request: NextRequest)
  - 画像最適化 API - P1/P2/P3 自動生成
- **POST Handler** (request)
  - API Route Handler

### app/api/images/thumbnail/route.ts

- **GET** (request: NextRequest)
  - 画像サムネイル生成プロキシAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/inquiry/bulk-approve/route.ts

- **POST** (request: Request)
  - POST: AIドラフトを一括承認・送信
- **POST Handler** (request)
  - API Route Handler

### app/api/inquiry/classify/route.ts

- **POST** (request: Request)
  - Gemini APIを使用してAI分類を実行
- **POST Handler** (request)
  - API Route Handler

### app/api/inquiry/generate-draft/route.ts

- **POST** (request: Request)
  - Gemini APIを使用して回答ドラフトを生成
- **POST Handler** (request)
  - API Route Handler

### app/api/inquiry/knowledge-base/route.ts

- **GET** (request: Request)
  - GET: ナレッジベースから類似事例を取得
- **POST** (request: Request)
  - GET: ナレッジベースから類似事例を取得
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/inquiry/list/route.ts

- **GET** (request: Request)
  - GET: 問い合わせリストを取得
- **GET Handler** (request)
  - API Route Handler

### app/api/inquiry/migrate/route.ts

- **POST** (request: Request)
- **GET** ()
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inquiry/process-level0/route.ts

- **POST** (request: Request)
  - POST: Level 0 フィルターの顧客選択を処理
- **POST Handler** (request)
  - API Route Handler

### app/api/intelligence-map/query/route.ts

- **POST** (request: NextRequest)
  - N3 Intelligence Map API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/analysis/route.ts

- **GET** (request: NextRequest)
  - 在庫データ分析API
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/attribute-options/route.ts

- **GET** (request: NextRequest)
  - 属性オプション取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/auto-price-reduction/route.ts

- **POST** (request: NextRequest)
  - 在庫最適化: 日次自動値下げ実行
- **GET** (request: NextRequest)
  - 在庫最適化: 日次自動値下げ実行
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/bulk-delete/route.ts

- **POST** (req: NextRequest)
  - inventory_masterの一括削除API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/bulk-upload/route.ts

- **POST** (req: NextRequest)
  - 画像一括登録API
- **GET** ()
  - 画像一括登録API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/bulk-upload-folder/route.ts

- **POST** (req: NextRequest)
  - フォルダ構造対応 画像一括登録API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/classification-queue/route.ts

- **GET** (req: NextRequest)
  - 有在庫判定キュー管理API
- **DELETE** (req: NextRequest)
  - 有在庫判定キュー管理API
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/inventory/classify/route.ts

- **POST** (req: NextRequest)
  - 有在庫判定実行API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/convert-to-master/route.ts

- **POST** (request: NextRequest)
  - 単品変換API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/counts/route.ts

- **GET** (request: NextRequest)
  - 棚卸しタブカウント取得API v2
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/data-cleanup/route.ts

- **GET** (request: NextRequest)
  - データクレンジングAPI
- **POST** (request: NextRequest)
  - データクレンジングAPI
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/deactivate/route.ts

- **POST** (req: NextRequest)
  - POST /api/inventory/deactivate
- **PUT** (req: NextRequest)
  - POST /api/inventory/deactivate
- **GET** (req: NextRequest)
  - POST /api/inventory/deactivate
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/decrement-set/route.ts

- **POST** (request: NextRequest)
  - セット品販売時の在庫減算API
- **GET** (request: NextRequest)
  - セット品販売時の在庫減算API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/detect-attributes/route.ts

- **POST** (request: NextRequest)
  - 属性検知エンジンAPI
- **GET** (request: NextRequest)
  - 属性検知エンジンAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/filter-options/route.ts

- **GET** (request: NextRequest)
  - マスター（在庫）フィルターオプション取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/list/route.ts

- **GET** (request: NextRequest)
  - 棚卸し商品一覧API - サーバーサイドフィルタリング対応
- **POST** (request: NextRequest)
  - 棚卸し商品一覧API - サーバーサイドフィルタリング対応
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/search/route.ts

- **GET** (request: NextRequest)
  - 在庫商品検索API（セット構成追加用）
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/setup-attributes/route.ts

- **GET** (request: NextRequest)
  - 属性カラムセットアップAPI
- **POST** (request: NextRequest)
  - 属性カラムセットアップAPI
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/stats/route.ts

- **GET** (request: NextRequest)
  - 棚卸し統計API
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/sync/route.ts

- **POST** (request: NextRequest)
  - 在庫同期API
- **GET** (request: NextRequest)
  - 在庫同期API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/to-listing/route.ts

- **POST** (request: NextRequest)
  - 在庫から出品データを作成
- **GET** (request: NextRequest)
  - 在庫から出品データを作成
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/toggle-type/route.ts

- **POST** (request: NextRequest)
  - 在庫タイプ切り替えAPI
- **PUT** (request: NextRequest)
  - 在庫タイプ切り替えAPI
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/inventory/update-attribute/route.ts

- **PATCH** (request: NextRequest)
  - 在庫マスターの属性更新API
- **POST** (request: NextRequest)
  - 在庫マスターの属性更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/update-flags/route.ts

- **PATCH** (request: NextRequest)
  - 在庫フラグ更新API
- **POST** (request: NextRequest)
  - 在庫フラグ更新API
- **GET** ()
  - 在庫フラグ更新API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/update-location/route.ts

- **POST** (request: NextRequest)
  - 保管場所更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory/update-master-type/route.ts

- **POST** (request: NextRequest)
  - マスター在庫タイプ更新API
- **PUT** (request: NextRequest)
  - マスター在庫タイプ更新API
- **GET** (request: NextRequest)
  - マスター在庫タイプ更新API
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/update-sku-prefix/route.ts

- **POST** (request: NextRequest)
  - SKUプレフィックス自動付与API
- **PATCH** (request: NextRequest)
  - SKUプレフィックス自動付与API
- **GET** ()
  - SKUプレフィックス自動付与API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory/update-supplier-info/route.ts

- **POST** (request: NextRequest)
  - 仕入れ先情報更新API
- **PATCH** (request: NextRequest)
  - 仕入れ先情報更新API
- **PUT** (request: NextRequest)
  - 仕入れ先情報更新API
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/inventory/upload-image/route.ts

- **POST** (request: NextRequest)
  - 棚卸し画像アップロードAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory-count/auth/route.ts

- **POST** (request: NextRequest)
  - 棚卸しツール認証API
- **DELETE** ()
  - 棚卸しツール認証API
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/inventory-count/products/route.ts

- **GET** (request: NextRequest)
  - 棚卸しツール用 商品検索API
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-count/submit/route.ts

- **POST** (request: NextRequest)
  - 棚卸しデータ保存API
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory-count/upload/route.ts

- **POST** (request: NextRequest)
  - 棚卸し画像アップロードAPI
- **GET** (request: NextRequest)
  - 棚卸し画像アップロードAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/changes/apply/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/changes/mark-completed/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/changes/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/execute/route.ts

- **GET** (request: NextRequest)
  - 在庫監視と価格変動を統合実行
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/export-csv/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/logs/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/schedule/route.ts

- **GET** (request: NextRequest)
- **PUT** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/stats/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/inventory-monitoring/status/[log-id]/route.ts

- **GET** (request: NextRequest,
  context: { params: Promise<{ logId: string }> })
- **GET Handler** (request)
  - API Route Handler

### app/api/jobs/[id]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
  - 個別ジョブAPIエンドポイント
- **DELETE** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
  - 個別ジョブAPIエンドポイント
- **OPTIONS** ()
  - 個別ジョブAPIエンドポイント
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/jobs/route.ts

- **POST** (request: NextRequest)
  - ジョブキューAPIエンドポイント
- **GET** ()
  - ジョブキューAPIエンドポイント
- **OPTIONS** ()
  - ジョブキューAPIエンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/bulk/route.ts

- **POST** (request: NextRequest)
  - 一括出品APIエンドポイント
- **OPTIONS** ()
  - 一括出品APIエンドポイント
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/delist/route.ts

- **POST** (request: NextRequest)
  - 出品停止（Delisting）エンドポイント
- **PUT** (request: NextRequest)
  - 出品停止（Delisting）エンドポイント
- **DELETE** (request: NextRequest)
  - 出品停止（Delisting）エンドポイント
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/listing/edit/route.ts

- **POST** (request: NextRequest)
  - 出品データ編集API
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/error-log/route.ts

- **GET** (request: NextRequest)
  - 出品エラーログ取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/execute/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/execute-schedule-v2/route.ts

- **GET** (request: NextRequest)
  - スケジュール出品実行API v2
- **POST** (request: NextRequest)
  - スケジュール出品実行API v2
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/execute-scheduled/route.ts

- **GET** (request: NextRequest)
  - スケジュール出品実行API
- **POST** (request: NextRequest)
  - スケジュール出品実行API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/immediate/route.ts

- **POST** (request: NextRequest)
  - 今すぐ出品API
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/integrated/route.ts

- **GET** (request: NextRequest)
  - 統合出品データ管理API - データ取得・集約エンドポイント
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/lock-release/route.ts

- **POST** (request: NextRequest)
  - ロック解除API
- **GET** (request: NextRequest)
  - ロック解除API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/logs/[sku]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { sku: string } })
  - ログ取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/logs/route.ts

- **GET** (request: NextRequest)
  - 実行ログAPI
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/mode-switch/route.ts

- **POST** (request: NextRequest)
  - 出品モード切替API
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/now/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/products/route.ts

- **GET** (request: NextRequest)
  - Listing Management API
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/queue/route.ts

- **POST** (request: NextRequest)
  - /api/listing/queue/route.ts
- **GET** (request: NextRequest)
  - /api/listing/queue/route.ts
- **DELETE** (request: NextRequest)
  - /api/listing/queue/route.ts
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/listing/retry/route.ts

- **POST** (request: NextRequest)
  - リトライキューAPI
- **GET** (request: NextRequest)
  - リトライキューAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/rotation/end/route.ts

- **POST** (request: NextRequest)
  - 出品終了API
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/rotation/identify/route.ts

- **POST** (request: NextRequest)
  - 低スコア商品識別API
- **GET** (request: NextRequest)
  - 低スコア商品識別API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/listing/route.ts

- **GET** (request: NextRequest)
- **POST** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/listing/stop/route.ts

- **POST** (request: NextRequest)
  - 出品停止API
- **POST Handler** (request)
  - API Route Handler

### app/api/management/price-patrol/route.ts

- **POST** (req: NextRequest)
  - イベント駆動型価格パトロールAPI
- **GET** (req: NextRequest)
  - イベント駆動型価格パトロールAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/media/channels/[channelId]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { channelId: string } })
- **PUT** (request: NextRequest,
  { params }: { params: { channelId: string } })
- **DELETE** (request: NextRequest,
  { params }: { params: { channelId: string } })
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/media/channels/route.ts

- **GET** (request: NextRequest)
- **POST** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/media/generate/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/media/generate-html/route.ts

- **POST** (request: Request)
  - N3 Empire OS - HTML生成API
- **GET** (request: Request)
  - N3 Empire OS - HTML生成API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/media/remotion/route.ts

- **POST** (request: NextRequest)
- **GET** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/media/render-queue/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/media/stats/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/media/videos/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/media/webhook/route.ts

- **POST** (request: NextRequest)
  - メディアWebhook API
- **GET** ()
  - メディアWebhook API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/messages/ai/[message-id]/approve/route.ts

- **POST** (request: Request,
  { params }: { params: { messageId: string } })
  - POST: メッセージを承認
- **POST Handler** (request)
  - API Route Handler

### app/api/messages/ai/[message-id]/reject/route.ts

- **POST** (request: Request,
  { params }: { params: { messageId: string } })
  - POST: メッセージを却下
- **POST Handler** (request)
  - API Route Handler

### app/api/messages/ai/[message-id]/route.ts

- **GET** (request: Request,
  { params }: { params: { messageId: string } })
  - GET: 特定メッセージの詳細を取得
- **PATCH** (request: Request,
  { params }: { params: { messageId: string } })
  - GET: 特定メッセージの詳細を取得
- **GET Handler** (request)
  - API Route Handler

### app/api/messages/ai/[message-id]/send/route.ts

- **POST** (request: Request,
  { params }: { params: { messageId: string } })
  - POST: 承認済みメッセージを送信
- **POST Handler** (request)
  - API Route Handler

### app/api/monitoring/route.ts

- **POST** (request: NextRequest)
  - 在庫監視 API エンドポイント
- **GET** (request: NextRequest)
  - 在庫監視 API エンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/monitoring/summary/route.ts

- **GET** (request: NextRequest)
  - Operations Monitor API
- **GET Handler** (request)
  - API Route Handler

### app/api/n8n/executions/route.ts

- **GET** (request: NextRequest)
  - n8n Execution 履歴 API
- **GET Handler** (request)
  - API Route Handler

### app/api/n8n/route.ts

- **POST** (request: NextRequest)
  - n8n Webhook受信エンドポイント
- **GET** (request: NextRequest)
  - n8n Webhook受信エンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/n8n/workflows/route.ts

- **GET** (request: NextRequest)
  - n8n Workflow 管理 API
- **POST** (request: NextRequest)
  - n8n Workflow 管理 API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/n8n/workflows/toggle/route.ts

- **POST** (request: NextRequest)
  - n8n ワークフロー ON/OFF切り替えAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/n8n-auth/decrypt-key/route.ts

- **POST** (req: NextRequest)
  - n8n用APIキー復号API
- **GET** ()
  - n8n用APIキー復号API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/n8n-auth/generate-internal-token/route.ts

- **POST** (req: NextRequest)
  - n8n内部トークン生成API
- **GET** ()
  - n8n内部トークン生成API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/n8n-auth/verify-internal-token/route.ts

- **POST** (req: NextRequest)
  - n8n内部トークン検証API
- **GET** ()
  - n8n内部トークン検証API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/n8n-proxy/route.ts

- **POST** (request: NextRequest)
  - N3 n8n Proxy API
- **GET** ()
  - N3 n8n Proxy API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/notification/test/route.ts

- **POST** (request: NextRequest)
  - ====================================================================
- **POST Handler** (request)
  - API Route Handler

### app/api/onboarding/progress/route.ts

- **POST** (request: NextRequest)
  - 📈 Onboarding Progress API
- **OPTIONS** ()
  - 📈 Onboarding Progress API
- **POST Handler** (request)
  - API Route Handler

### app/api/onboarding/route.ts

- **POST** (request: NextRequest)
  - 🚀 Onboarding API - セルフオンボーディング
- **GET** (request: NextRequest)
  - 🚀 Onboarding API - セルフオンボーディング
- **OPTIONS** ()
  - 🚀 Onboarding API - セルフオンボーディング
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/orders/v2/update-order-details/route.ts

- **PATCH** (request: NextRequest)
  - 受注詳細更新API

### app/api/payment-policies/sync-ebay-policy-ids/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/pipeline/autonomous/route.ts

- **POST** (request: NextRequest)
  - 自律出品パイプラインAPIエンドポイント
- **OPTIONS** ()
  - 自律出品パイプラインAPIエンドポイント
- **POST Handler** (request)
  - API Route Handler

### app/api/pricing/bulk/route.ts

- **POST** (request: NextRequest)
  - 一括価格計算APIエンドポイント
- **POST Handler** (request)
  - API Route Handler

### app/api/pricing/calculate/route.ts

- **POST** (request: NextRequest)
  - 統合価格計算APIエンドポイント
- **GET** (request: NextRequest)
  - 統合価格計算APIエンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/[id]/analyze/route.ts

- **POST** (request: NextRequest,
  { params }: { params: { id: string } })
  - 商品AI分析API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/[id]/exclude-settings/route.ts

- **POST** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 除外設定保存API
- **GET** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 除外設定保存API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/[id]/health-score/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { id: string } })
  - 商品健全性スコア取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/products/[id]/html/route.ts

- **GET** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
- **GET Handler** (request)
  - API Route Handler

### app/api/products/[id]/price-target/route.ts

- **POST** (request: Request,
  context: { params: Promise<{ id: string }> })
- **GET** (request: Request,
  context: { params: Promise<{ id: string }> })
- **DELETE** (request: Request,
  context: { params: Promise<{ id: string }> })
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/products/[id]/pricing-strategy/route.ts

- **GET** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - GET /api/products/[id]/pricing-strategy
- **PUT** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - GET /api/products/[id]/pricing-strategy
- **DELETE** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - GET /api/products/[id]/pricing-strategy
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/products/[id]/recalculate-prices/route.ts

- **POST** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 🔥 中央値を計算
- **POST Handler** (request)
  - API Route Handler

### app/api/products/[id]/route.ts

- **PATCH** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 商品データ更新API (PATCH)
- **PUT** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 商品データ更新API (PATCH)
- **GET** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 商品データ更新API (PATCH)
- **DELETE** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 商品データ更新API (PATCH)
- **PUT Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/products/[id]/select-price/route.ts

- **POST** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - 利益計算（共通関数）
- **POST Handler** (request)
  - API Route Handler

### app/api/products/[id]/sm-add-item/route.ts

- **POST** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
  - SM手動追加アイテムをDBに保存
- **POST Handler** (request)
  - API Route Handler

### app/api/products/[id]/sm-select-item/route.ts

- **POST** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
  - SM選択アイテムをDBに保存
- **POST Handler** (request)
  - API Route Handler

### app/api/products/[id]/sm-selected-item/route.ts

- **POST** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - SM選択商品保存API
- **GET** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - SM選択商品保存API
- **DELETE** (request: NextRequest,
  context: { params: Promise<{ id: string }> })
  - SM選択商品保存API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/products/[id]/sm-selection/route.ts

- **POST** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
  - SM選択API - ハイブリッドAI監査パイプライン
- **GET** (request: NextRequest,
  { params }: { params: Promise<{ id: string }> })
  - SM選択API - ハイブリッドAI監査パイプライン
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/add-to-variation/route.ts

- **POST** (request: NextRequest)
  - 既存親SKUへの子SKU追加API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/approve/route.ts

- **POST** (request: NextRequest)
  - 商品承認API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/archive/route.ts

- **POST** (request: NextRequest)
  - 商品アーカイブAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/products/attributes/route.ts

- **GET** (request: NextRequest)
  - 商品属性オプション取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/products/audit/route.ts

- **POST** (request: NextRequest)
  - N3出品監査API
- **GET** (request: NextRequest)
  - N3出品監査API
- **PATCH** (request: NextRequest)
  - N3出品監査API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/audit-patch/route.ts

- **PUT** (request: NextRequest)
  - 監査パッチ適用APIエンドポイント
- **POST** (request: NextRequest)
  - 監査パッチ適用APIエンドポイント
- **OPTIONS** ()
  - 監査パッチ適用APIエンドポイント
- **PUT Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/products/batch-update/route.ts

- **POST** (request: NextRequest)
  - 関税率を取得
- **POST Handler** (request)
  - API Route Handler

### app/api/products/bulk-delete/route.ts

- **POST** (request: NextRequest)
  - 商品一括削除API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/bulk-update/route.ts

- **POST** (request: NextRequest)
  - 商品一括更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/bulk-update-sm-selection/route.ts

- **POST** (request: NextRequest)
  - SM連続選択結果の一括更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/bulk-update-status/route.ts

- **POST** (request: NextRequest)
  - 一括ステータス更新API
- **GET** (request: NextRequest)
  - 一括ステータス更新API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/calculate-precise-ddp/route.ts

- **POST** (req: NextRequest)
  - 精密DDP計算API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/complete-editing/route.ts

- **POST** (request: NextRequest)
  - Complete Editing API
- **GET** (request: NextRequest)
  - Complete Editing API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/counts/route.ts

- **GET** (request: NextRequest)
  - タブカウントAPI v19 - Gemini指示書準拠版
- **GET Handler** (request)
  - API Route Handler

### app/api/products/create-bundle/route.ts

- **POST** (request: NextRequest)
  - セット品作成API（全モール共通）
- **POST Handler** (request)
  - API Route Handler

### app/api/products/create-from-research/route.ts

- **POST** (request: NextRequest)
  - リサーチ結果から商品を作成
- **POST Handler** (request)
  - API Route Handler

### app/api/products/create-variation/route.ts

- **POST** (request: NextRequest)
  - P4-A: Zonos精密DDP計算API呼び出し
- **POST Handler** (request)
  - API Route Handler

### app/api/products/debug-counts/route.ts

- **GET** (request: NextRequest)
  - デバッグ用カウントAPI - データ構造分析
- **GET Handler** (request)
  - API Route Handler

### app/api/products/find-parent-candidates/route.ts

- **POST** (request: NextRequest)
  - 既存親SKU候補検索API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/get-all/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/products/get-by-ids/route.ts

- **POST** (request: NextRequest)
  - 商品データ一括取得 API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/get-by-sku/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/products/hts-lookup/route.ts

- **POST** (request: Request)
  - HTS学習システム Phase 2: HTS検索API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/investigate/route.ts

- **GET** (request: NextRequest)
  - 詳細調査API - physical_quantityの実態調査
- **GET Handler** (request)
  - API Route Handler

### app/api/products/investigate-ebay/route.ts

- **GET** (request: NextRequest)
  - eBayデータの通貨・ユニーク商品調査API
- **GET Handler** (request)
  - API Route Handler

### app/api/products/investigate-ghost/route.ts

- **GET** (request: NextRequest)
  - 幽霊データ調査API
- **GET Handler** (request)
  - API Route Handler

### app/api/products/investigate-listing-status/route.ts

- **GET** (request: NextRequest)
  - listing_status調査API
- **GET Handler** (request)
  - API Route Handler

### app/api/products/investigate-mug/route.ts

- **GET** (request: NextRequest)
  - MUG重複調査API
- **GET Handler** (request)
  - API Route Handler

### app/api/products/move-phase/route.ts

- **POST** (request: NextRequest)
  - 商品フェーズ手動移動API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/move-to-approval/route.ts

- **POST** (request: NextRequest)
  - 承認待ちステータス移行API
- **GET** ()
  - 承認待ちステータス移行API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/register/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/products/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/products/save-competitor-data/route.ts

- **POST** (request: NextRequest)
  - 競合商品データを対象商品に保存するAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/products/save-item-specifics/route.ts

- **POST** (request: NextRequest)
  - Item Specifics を products_master に保存
- **POST Handler** (request)
  - API Route Handler

### app/api/products/test/route.ts

- **GET** (request: NextRequest)
  - テスト用簡易API - 商品1件取得
- **GET Handler** (request)
  - API Route Handler

### app/api/products/transform-multichannel/route.ts

- **POST** (request: NextRequest)
  - 多販路変換API
- **GET** (request: NextRequest)
  - 多販路変換API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/products/update/route.ts

- **POST** (request: Request)
- **PUT** (request: Request)
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/products/update-sku/route.ts

- **POST** (request: NextRequest)
  - SKU更新API
- **POST Handler** (request)
  - API Route Handler

### app/api/products/update-status/route.ts

- **PATCH** (request: NextRequest)

### app/api/products/upload/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/products/upload-image/route.ts

- **POST** (request: NextRequest)
  - 商品画像アップロードAPI
- **PUT** (request: NextRequest)
  - 商品画像アップロードAPI
- **DELETE** (request: NextRequest)
  - 商品画像アップロードAPI
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/products/validate-listing/route.ts

- **POST** (request: NextRequest)
  - 商品の出品可能性をチェック
- **POST Handler** (request)
  - API Route Handler

### app/api/qoo10/listing/route.ts

- **POST** (request: NextRequest)
  - Qoo10 出品API
- **GET** (request: NextRequest)
  - Qoo10 出品API
- **PUT** (request: NextRequest)
  - Qoo10 出品API
- **DELETE** (request: NextRequest)
  - Qoo10 出品API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/raw/products/route.ts

- **GET** (request: NextRequest)
  - 全件出力API - n8n連携用 Raw Data Export
- **POST** (request: NextRequest)
  - 全件出力API - n8n連携用 Raw Data Export
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/render/start/route.ts

- **POST** (req: Request)
- **GET** (req: Request)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research/amazon-auto/route.ts

- **POST** (request: NextRequest)
  - Amazon 自動リサーチ API
- **GET** (request: NextRequest)
  - Amazon 自動リサーチ API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research/amazon-batch/route.ts

- **POST** (request: NextRequest)
  - Amazon Research バッチAPI
- **GET** (request: NextRequest)
  - Amazon Research バッチAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research/catalog-decision/route.ts

- **GET** (request: NextRequest)
  - Catalog Decision API
- **POST** (request: NextRequest)
  - Catalog Decision API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/research/send-to-catalog/route.ts

- **POST** (request: NextRequest)
  - Send to Catalog API
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/ai-proposal/route.ts

- **POST** (request: NextRequest)
  - AI商品提案API
- **GET** ()
  - AI商品提案API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/amazon-batch/route.ts

- **POST** (request: NextRequest)
  - Amazon ASIN一括リサーチAPI
- **GET** ()
  - Amazon ASIN一括リサーチAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/analyze/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/approve/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/auto-pending/route.ts

- **POST** (request: NextRequest)
  - 自動Pending処理API
- **GET** (request: NextRequest)
  - 自動Pending処理API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/ebay-seller-batch/route.ts

- **POST** (request: NextRequest)
  - eBayセラー分析バッチAPI
- **GET** ()
  - eBayセラー分析バッチAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/ebay-sold/route.ts

- **POST** (request: NextRequest)
  - eBay売れ筋リサーチAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/karitori-check/route.ts

- **POST** (request: NextRequest)
  - カリトリ（価格監視）チェックAPI
- **GET** ()
  - カリトリ（価格監視）チェックAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/karitori-register/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/keyword-batch/route.ts

- **POST** (request: NextRequest)
  - キーワードバッチリサーチAPI
- **GET** ()
  - キーワードバッチリサーチAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/list/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/product-search/route.ts

- **POST** (request: NextRequest)
  - 単品商品リサーチAPI
- **GET** ()
  - 単品商品リサーチAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/promote/route.ts

- **POST** (request: NextRequest)
  - リサーチ結果をproducts_masterへ転送するAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/reject/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/reverse-search/route.ts

- **POST** (request: NextRequest)
  - 逆引きリサーチAPI
- **GET** ()
  - 逆引きリサーチAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/research-table/send-to-catalog/route.ts

- **POST** (request: NextRequest)
  - リサーチ結果をCatalog承認待ちに送信
- **POST Handler** (request)
  - API Route Handler

### app/api/research-table/supplier-search/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/return-policies/sync-ebay-policy-ids/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/score/calculate/route.ts

- **POST** (request: NextRequest)
  - スコア計算API
- **GET** (request: NextRequest)
  - スコア計算API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/scraping/batch/failed/[batch-id]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { batchId: string } })
  - 失敗URL一覧取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/scraping/batch/status/[batch-id]/route.ts

- **GET** (request: NextRequest,
  { params }: { params: { batchId: string } })
  - バッチ進捗状況取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/security/api-keys/route.ts

- **GET** (request: NextRequest)
  - 🔑 API Key Management
- **POST** (request: NextRequest)
  - 🔑 API Key Management
- **DELETE** (request: NextRequest)
  - 🔑 API Key Management
- **OPTIONS** ()
  - 🔑 API Key Management
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/security/decrypt-secret/route.ts

- **POST** (request: NextRequest)
- **GET** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/security/oauth-hub/route.ts

- **POST** (request: NextRequest)
- **GET** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/security/tokens/route.ts

- **GET** (request: NextRequest)
  - GET /api/security/tokens
- **POST** (request: NextRequest)
  - GET /api/security/tokens
- **DELETE** (request: NextRequest)
  - GET /api/security/tokens
- **PATCH** (request: NextRequest)
  - GET /api/security/tokens
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/sellermirror/analyze/route.ts

- **POST** (request: NextRequest)
  - SellerMirror分析API
- **POST Handler** (request)
  - API Route Handler

### app/api/sellermirror/batch-details/route.ts

- **POST** (request: NextRequest)
  - SellerMirror 競合商品詳細一括取得API
- **POST Handler** (request)
  - API Route Handler

### app/api/sellermirror/item-details/route.ts

- **POST** (request: NextRequest)
  - eBay Browse API - 単一商品詳細取得
- **POST Handler** (request)
  - API Route Handler

### app/api/settings/auto-sync/route.ts

- **GET** (request: NextRequest)
- **POST** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/settings/ebay/accounts/route.ts

- **GET** (req: NextRequest)
  - GET /api/settings/ebay/accounts
- **POST** (req: NextRequest)
  - GET /api/settings/ebay/accounts
- **PUT** (req: NextRequest)
  - GET /api/settings/ebay/accounts
- **DELETE** (req: NextRequest)
  - GET /api/settings/ebay/accounts
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/settings/mercari/accounts/route.ts

- **GET** (req: NextRequest)
  - GET /api/settings/mercari/accounts
- **POST** (req: NextRequest)
  - GET /api/settings/mercari/accounts
- **PUT** (req: NextRequest)
  - GET /api/settings/mercari/accounts
- **DELETE** (req: NextRequest)
  - GET /api/settings/mercari/accounts
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/settings/pricing-defaults/route.ts

- **GET** (request: NextRequest)
  - GET /api/settings/pricing-defaults
- **PUT** (request: NextRequest)
  - GET /api/settings/pricing-defaults
- **POST** (request: NextRequest)
  - GET /api/settings/pricing-defaults
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/shipping-policies/generate-templates/route.ts

- **POST** (req: NextRequest)
  - テンプレート自動生成API
- **GET** (req: NextRequest)
  - テンプレート自動生成API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/shipping-policies/sync-ebay-policy-ids/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/shopee/transform-listing/route.ts

- **POST** (request: NextRequest)
  - Shopee出品データ変換API
- **POST Handler** (request)
  - API Route Handler

### app/api/stock/sync-event/route.ts

- **POST** (request: NextRequest)
  - 在庫同期 Webhook エンドポイント
- **GET** (request: NextRequest)
  - 在庫同期 Webhook エンドポイント
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/strategy/execute/route.ts

- **POST** (request: NextRequest)
  - 出品戦略エンジンAPI
- **GET** (request: NextRequest)
  - 出品戦略エンジンAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/supabase/list-tables/route.ts

- **GET** ()
- **GET Handler** (request)
  - API Route Handler

### app/api/supabase/table-detail/route.ts

- **GET** (request: NextRequest)
- **GET Handler** (request)
  - API Route Handler

### app/api/supabase/test-connection/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/supplier/search/route.ts

- **POST** (request: NextRequest)
  - 仕入れ先検索API
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/ebay-direct/route.ts

- **POST** (req: NextRequest)
  - eBay→inventory_master 直接同期API（P0-1対応）
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/ebay-incremental/route.ts

- **POST** (req: NextRequest)
  - eBay 差分同期API
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/ebay-to-inventory/route.ts

- **POST** (req: NextRequest)
  - eBay出品データをinventory_masterに直接同期
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/ebay-trading/route.ts

- **POST** (req: NextRequest)
  - eBay Trading API 経由での出品同期（高速版）
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/execute-all/route.ts

- **POST** (req: NextRequest)
  - 一括同期実行API
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/execute-recovery/route.ts

- **POST** (req: NextRequest)
  - リカバリ実行API
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/get-snapshots/route.ts

- **GET** ()
  - スナップショット取得API
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/inventory-sheets/route.ts

- **GET** (request: NextRequest)
  - 棚卸し同期システム v2.0
- **POST** (request: NextRequest)
  - 棚卸し同期システム v2.0
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/mercari/route.ts

- **POST** (req: NextRequest)
  - メルカリ出品同期API
- **GET** ()
  - メルカリ出品同期API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/pull-from-spreadsheet/route.ts

- **POST** (request: NextRequest)
  - スプレッドシート → DB 同期API（Pull機能）
- **GET** (request: NextRequest)
  - スプレッドシート → DB 同期API（Pull機能）
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/resolve-conflict/route.ts

- **POST** (request: Request)
- **GET** (request: Request)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/schedule/route.ts

- **GET** (req: NextRequest)
  - 同期スケジュール管理API
- **POST** (req: NextRequest)
  - 同期スケジュール管理API
- **DELETE** (req: NextRequest)
  - 同期スケジュール管理API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/sync/spreadsheet/route.ts

- **GET** (request: Request)
  - スプレッドシート動的同期API v2
- **POST** (request: Request)
  - スプレッドシート動的同期API v2
- **PUT** (request: Request)
  - スプレッドシート動的同期API v2
- **DELETE** ()
  - スプレッドシート動的同期API v2
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/sync/spreadsheet-full/route.ts

- **POST** (request: NextRequest)
  - スプレッドシート ↔ products_master 双方向同期API
- **PUT** (request: NextRequest)
  - スプレッドシート ↔ products_master 双方向同期API
- **GET** ()
  - スプレッドシート ↔ products_master 双方向同期API
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/spreadsheet-test/route.ts

- **GET** ()
  - スプレッドシート同期テスト用API
- **POST** (request: NextRequest)
  - スプレッドシート同期テスト用API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/sync/status/route.ts

- **GET** (request: NextRequest)
  - ====================================================================
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/stocktake-spreadsheet/route.ts

- **POST** (request: NextRequest)
  - 棚卸しデータ ↔ Googleスプレッドシート同期API v2
- **GET** ()
  - 棚卸しデータ ↔ Googleスプレッドシート同期API v2
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/sync/supusi/route.ts

- **GET** (request: NextRequest)
  - Supusi（スプレッドシート）同期API v5
- **POST** (request: NextRequest)
  - Supusi（スプレッドシート）同期API v5
- **PUT** (request: NextRequest)
  - Supusi（スプレッドシート）同期API v5
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### app/api/system/analysis/route.ts

- **GET** (request: NextRequest)
  - 📊 Phase F-2: 分析レポート生成 API
- **GET Handler** (request)
  - API Route Handler

### app/api/system/audit/route.ts

- **POST** (request: NextRequest)
  - 🔒 Phase H-5: Audit Log API
- **GET** (request: NextRequest)
  - 🔒 Phase H-5: Audit Log API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/system/emergency/route.ts

- **GET** ()
  - Emergency Stop API
- **POST** (request: NextRequest)
  - Emergency Stop API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/system/events/route.ts

- **pushEvent** (event: Omit<SSEEvent, 'timestamp'>)
  - 🔴 Phase H-6: Server-Sent Events (SSE) API
- **GET** (request: NextRequest)
  - 🔴 Phase H-6: Server-Sent Events (SSE) API
- **POST** (request: NextRequest)
  - 🔴 Phase H-6: Server-Sent Events (SSE) API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/system/mode/route.ts

- **GET** (request: NextRequest)
  - 🎛️ Phase G: Operation Mode API
- **POST** (request: NextRequest)
  - 🎛️ Phase G: Operation Mode API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/system/preflight/route.ts

- **GET** (request: NextRequest)
  - ✈️ Phase G: Pre-flight Check API
- **GET Handler** (request)
  - API Route Handler

### app/api/system/startup/route.ts

- **GET** (request: NextRequest)
  - 🚀 Phase G: System Startup API
- **POST** (request: NextRequest)
  - 🚀 Phase G: System Startup API
- **DELETE** (request: NextRequest)
  - 🚀 Phase G: System Startup API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/system-logs/route.ts

- **POST** (request: NextRequest)
- **GET** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/tags/assign/route.ts

- **POST** (request: Request)
  - タグ割り当てAPI
- **POST Handler** (request)
  - API Route Handler

### app/api/tags/route.ts

- **GET** ()
  - タグ管理API
- **POST** (request: Request)
  - タグ管理API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/tenant/organizations/route.ts

- **GET** (request: NextRequest)
  - 🏢 Tenant Organizations API
- **POST** (request: NextRequest)
  - 🏢 Tenant Organizations API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/tenant/role/route.ts

- **GET** (request: NextRequest)
  - 👤 Tenant Role API
- **GET Handler** (request)
  - API Route Handler

### app/api/tenant/usage/route.ts

- **GET** (request: NextRequest)
  - 📊 Tenant Usage API
- **GET Handler** (request)
  - API Route Handler

### app/api/test/create-test-schedule/route.ts

- **GET** (request: NextRequest)
  - テスト用: 指定した商品名で検索し、出品スケジュールを作成
- **DELETE** (request: NextRequest)
  - テスト用: 指定した商品名で検索し、出品スケジュールを作成
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/test/ebay-browse/route.ts

- **GET** (request: NextRequest)
  - eBay Browse API テスト用エンドポイント
- **GET Handler** (request)
  - API Route Handler

### app/api/tokens/route.ts

- **GET** (request: NextRequest)
  - ==============================================================================
- **POST** (request: NextRequest)
  - ==============================================================================
- **DELETE** (request: NextRequest)
  - ==============================================================================
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/tools/auto-publish/route.ts

- **POST** (request: Request)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/batch-process/route.ts

- **POST** (request: NextRequest)
  - バッチ処理API
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/category-analyze/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/complete-preparation/route.ts

- **POST** (request: NextRequest)
  - 出品準備完全自動化API
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/html-generate/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/messages/approve/route.ts

- **POST** (request: NextRequest)
  - POST /api/tools/messages/approve
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/messages/reject/route.ts

- **POST** (request: NextRequest)
  - POST /api/tools/messages/reject
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/messages/route.ts

- **GET** (request: NextRequest)
  - GET /api/tools/messages
- **POST** (request: NextRequest)
  - GET /api/tools/messages
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/profit-calculate/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/profit-calculate/route_phase2.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/queue-content/route.ts

- **POST** (request: Request)
  - コンテンツを投稿キューに追加
- **GET** (request: Request)
  - コンテンツを投稿キューに追加
- **PATCH** (request: Request)
  - コンテンツを投稿キューに追加
- **DELETE** (request: Request)
  - コンテンツを投稿キューに追加
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/tools/scheduler-monitor/route.ts

- **GET** (req: NextRequest)
  - UI-4: 統合ジョブ監視API
- **POST** (req: NextRequest)
  - UI-4: 統合ジョブ監視API
- **GET Handler** (request)
  - API Route Handler
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/sellermirror-analyze/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/shipping-calculate/route.ts

- **POST** (request: NextRequest)
- **POST Handler** (request)
  - API Route Handler

### app/api/tools/translate-product/route.ts

- **POST** (request: NextRequest)
  - 🔥 v2.0: workflow_status 自動遷移対応
- **POST Handler** (request)
  - API Route Handler

### app/api/upload/zip/route.ts

- **POST** (request: Request)
  - ZIPアップロードAPI（入れ子構造対応）
- **GET** ()
  - ZIPアップロードAPI（入れ子構造対応）
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/usage/route.ts

- **GET** (request: NextRequest)
  - 📊 Usage API - 使用量メータリング
- **OPTIONS** ()
  - 📊 Usage API - 使用量メータリング
- **GET Handler** (request)
  - API Route Handler

### app/api/v2/calculate-all-marketplaces/route.ts

- **POST** (request: NextRequest)
  - 全販路一括利益計算API
- **POST Handler** (request)
  - API Route Handler

### app/api/v2/listing/qoo10/route.ts

- **POST** (request: NextRequest)
  - Qoo10 出品API
- **PUT** (request: NextRequest)
  - Qoo10 出品API
- **GET** (request: NextRequest)
  - Qoo10 出品API
- **POST Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/v2/listing-queue/route.ts

- **POST** (request: NextRequest)
  - 出品キューAPI
- **GET** (request: NextRequest)
  - 出品キューAPI
- **PUT** (request: NextRequest)
  - 出品キューAPI
- **DELETE** (request: NextRequest)
  - 出品キューAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler
- **DELETE Handler** (request)
  - API Route Handler

### app/api/v2/marketplace-listings/save/route.ts

- **POST** (request: NextRequest)
  - 多販路計算結果保存API
- **GET** (request: NextRequest)
  - 多販路計算結果保存API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/v2/pricing/multi-marketplace/route.ts

- **POST** (request: NextRequest)
  - 多販路一括利益計算API
- **GET** (request: NextRequest)
  - 多販路一括利益計算API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/v2/yahooauction/calculate-profit/route.ts

- **POST** (request: NextRequest)
  - Yahoo Auction 利益計算 API
- **GET** ()
  - Yahoo Auction 利益計算 API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/v2/yahooauction/generate-title/route.ts

- **POST** (request: NextRequest)
  - Yahoo Auction タイトル生成 API
- **GET** ()
  - Yahoo Auction タイトル生成 API
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/validation/listing-check/route.ts

- **POST** (request: Request)
  - 出品前バリデーションAPI
- **GET** ()
  - 出品前バリデーションAPI
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler

### app/api/yahoo/categories/search/route.ts

- **GET** (request: NextRequest)
  - Yahoo Auction カテゴリ検索API
- **GET Handler** (request)
  - API Route Handler

### app/api/yahoo/listing/route.ts

- **POST** (request: NextRequest)
  - Yahoo Auction (ヤフオク) 出品API V2
- **GET** (request: NextRequest)
  - Yahoo Auction (ヤフオク) 出品API V2
- **PUT** (request: NextRequest)
  - Yahoo Auction (ヤフオク) 出品API V2
- **POST Handler** (request)
  - API Route Handler
- **GET Handler** (request)
  - API Route Handler
- **PUT Handler** (request)
  - API Route Handler

### lib/services/ai/audit-ai-service.ts

- **runAiAudit** (products: Product[],
  auditReports: ProductAuditReport[],
  config: Partial<AuditAiConfig> = {})
  - 監査AI サービス - Gemini/Claude APIを使用した高精度監査
- **runSingleProductAiAudit** (product: Product,
  auditReport: ProductAuditReport,
  config: Partial<AuditAiConfig> = {})
  - 監査AI サービス - Gemini/Claude APIを使用した高精度監査
- **generateUpdatesFromAiPatches** (patches: AiPatch[],
  minConfidence: number = 0.85)
  - 監査AI サービス - Gemini/Claude APIを使用した高精度監査

### lib/services/ai/claude/claude-analysis-service.ts

- **runClaudeAnalysis** (input: ClaudeAnalysisInput)
  - Claudeに専門解析を依頼するためのプロンプトを生成する
- **runBatchClaudeAnalysis** (inputs: ClaudeAnalysisInput[])
  - Claudeに専門解析を依頼するためのプロンプトを生成する
- **runClaudeAnalysisLegacy** (data: IntermediateResearchData)
  - Claudeに専門解析を依頼するためのプロンプトを生成する

### lib/services/ai/field-completion-service.ts

- **completeProductFields** (request: FieldCompletionRequest)
  - フィールド補完サービス - ピンポイントAI補完
- **extractMissingFieldsFromAudit** (product: Product,
  auditReport: ProductAuditReport)
  - フィールド補完サービス - ピンポイントAI補完
- **completeProductsFields** (products: Product[],
  auditReports: ProductAuditReport[],
  onProgress?: (completed: number, total: number)
  - フィールド補完サービス - ピンポイントAI補完
- **applyCompletionToProduct** (product: Product,
  completion: FieldCompletionResult,
  minConfidence: number = 0.7)
  - フィールド補完サービス - ピンポイントAI補完
- **estimateCompletionCost** (productCount: number,
  averageFieldsPerProduct: number = 2)
  - フィールド補完サービス - ピンポイントAI補完

### lib/services/ai/gemini/gemini-api.ts

- **generateResearchPrompt** (type: ResearchPromptType,
  productData: ProductData)
  - N3 Empire OS - Gemini AI Prompt Generator

### lib/services/ai/health-score-service.ts

- **analyzeProductImage** (imageUrl: string)
  - AI改善提案エンジン - Gemini Vision画像分析統合
- **calculateHealthScore** (product: ProductData)
  - AI改善提案エンジン - Gemini Vision画像分析統合
- **batchAnalyzeProducts** (products: ProductData[],
  onProgress?: (current: number, total: number)
  - AI改善提案エンジン - Gemini Vision画像分析統合

### lib/services/amazon/amazon-service.ts

- **calculateAcquisitionScore** (productDetails: any, config: AmazonConfig)
  - Amazonのデータ品質（情報量）を加味したスコアを付与するロジック

### lib/services/api-cost-tracker.ts

- **estimateTokens** (text: string)
  - APIコスト追跡サービス
- **estimateGeminiCost** (inputText: string,
  model: 'GEMINI_FLASH' | 'GEMINI_PRO' = 'GEMINI_FLASH')
  - APIコスト追跡サービス
- **estimateBatchCost** (productCount: number,
  operations: {
    translate?: boolean;
    scout?: boolean;
    geminiHts?: boolean;
    geminiWeight?: boolean;
    geminiCategory?: boolean;
  })
  - APIコスト追跡サービス

### lib/services/async-job-service.ts

- **startListingJob** (items: ListingJobItem[],
  options: {
    mode: 'immediate' | 'scheduled';
    scheduledTime?: string;
    account: string;
  },
  callbacks?: {
    onItemSuccess?: (item: ListingJobItem, result: any)
  - 非同期ジョブサービス
- **startSmartProcessJob** (items: SmartProcessJobItem[],
  callbacks?: {
    onItemSuccess?: (item: SmartProcessJobItem, result: any)
  - 非同期ジョブサービス
- **startWeightCorrectionJob** (items: WeightCorrectionJobItem[],
  callbacks?: {
    onItemSuccess?: (item: WeightCorrectionJobItem, newWeight: number)
  - 非同期ジョブサービス
- **startEbaymagValidationJob** (items: EbaymagValidationJobItem[],
  callbacks?: {
    onItemValidated?: (item: EbaymagValidationJobItem, canSync: boolean, issues: string[])
  - 非同期ジョブサービス

### lib/services/audit/audit-service.ts

- **detectOriginFromTitle** (title: string)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **detectOriginFromBrand** (title: string)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **detectMaterialFromText** (text: string)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **detectFromCategory** (categoryId: string | null)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **isTradingCard** (title: string, categoryId: string | null)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **detectBatteryRisk** (title: string, category?: string)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **auditProduct** (product: Product)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **auditProducts** (products: Product[])
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **extractForAiReview** (products: Product[],
  auditReports: ProductAuditReport[])
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **generateAiPromptData** (requests: AiAuditRequest[])
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **parseAiResponse** (responseJson: string)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **applySelectedPatches** (product: Product,
  patches: AiPatch[])
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **applyAutoFixSuggestions** (product: Product,
  suggestions: AutoFixSuggestion[],
  minConfidence: number = 0.85)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **getAuditSeverityColor** (severity: AuditSeverity)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **getAuditScoreColor** (score: number)
  - N3出品監査サービス - 3層フィルターアーキテクチャ
- **generateAuditSummary** (reports: ProductAuditReport[])
  - N3出品監査サービス - 3層フィルターアーキテクチャ

### lib/services/audit/vero-patent-service.ts

- **detectVeroInText** (text: string)
  - VeRO & パテントトロール対策サービス
- **detectPatentTrollRisk** (text: string)
  - VeRO & パテントトロール対策サービス
- **checkVeroPatentRisk** (product: Product,
  config: Partial<VeroPatentConfig> = {})
  - VeRO & パテントトロール対策サービス
- **batchCheckVeroPatent** (products: Product[],
  config?: Partial<VeroPatentConfig>)
  - VeRO & パテントトロール対策サービス
- **getStatusUpdateForRisk** (result: VeroCheckResult)
  - VeRO & パテントトロール対策サービス
- **aiVeroPatentCheck** (product: Product)
  - VeRO & パテントトロール対策サービス

### lib/services/crossborder/cross-border-profit-calculator.ts

- **calculateCrossBorderProfit** (product: ProductInput,
  route: CrossBorderRoute,
  targetProfit: number = 0.20)
  - lib/services/crossborder/cross-border-profit-calculator.ts
- **findOptimalCrossBorderRoute** (product: ProductInput,
  routes: CrossBorderRoute[],
  targetProfit: number = 0.20)
  - lib/services/crossborder/cross-border-profit-calculator.ts
- **calculateAutoListingPrice** (product: ProductInput,
  route: CrossBorderRoute,
  targetProfitRate: number = 0.20)
  - lib/services/crossborder/cross-border-profit-calculator.ts

### lib/services/crossborder/ddp-automation-service.ts

- **executeDdpAutomation** (request: DdpAutomationRequest)
  - lib/services/crossborder/ddp-automation-service.ts
- **updateTrackingNumber** (orderId: string,
  forwarderName: string,
  shipmentId: string)
  - lib/services/crossborder/ddp-automation-service.ts
- **monitorOrderDelivery** (orderId: string,
  forwarderName: string,
  trackingNumber: string)
  - lib/services/crossborder/ddp-automation-service.ts

### lib/services/crossborder/forwarder-api-service.ts

- **getDdpShippingRate** (request: DdpRateRequest)
  - lib/services/crossborder/forwarder-api-service.ts
- **createShippingInstruction** (request: ShippingInstructionRequest)
  - lib/services/crossborder/forwarder-api-service.ts
- **getTrackingInfo** (forwarderName: string,
  trackingNumber: string)
  - lib/services/crossborder/forwarder-api-service.ts
- **getWarehouseAddress** (forwarderName: string,
  country: string)
  - lib/services/crossborder/forwarder-api-service.ts

### lib/services/crossborder/forwarders/dhl-api-client.ts

- **getDhlDdpRate** (credential: ForwarderApiCredential,
  request: DdpRateRequest)
  - lib/services/crossborder/forwarders/dhl-api-client.ts
- **createDhlShipment** (credential: ForwarderApiCredential,
  request: ShippingInstructionRequest)
  - lib/services/crossborder/forwarders/dhl-api-client.ts
- **getDhlTracking** (credential: ForwarderApiCredential,
  trackingNumber: string)
  - lib/services/crossborder/forwarders/dhl-api-client.ts

### lib/services/crossborder/forwarders/fedex-api-client.ts

- **getFedexDdpRate** (credential: ForwarderApiCredential,
  request: DdpRateRequest)
  - lib/services/crossborder/forwarders/fedex-api-client.ts
- **createFedexShipment** (credential: ForwarderApiCredential,
  request: ShippingInstructionRequest)
  - lib/services/crossborder/forwarders/fedex-api-client.ts
- **getFedexTracking** (credential: ForwarderApiCredential,
  trackingNumber: string)
  - lib/services/crossborder/forwarders/fedex-api-client.ts

### lib/services/crossborder/forwarders/shipandco-api-client.ts

- **getShipAndCoRate** (credential: ForwarderApiCredential,
  request: DdpRateRequest)
  - lib/services/crossborder/forwarders/shipandco-api-client.ts
- **createShipAndCoShipment** (credential: ForwarderApiCredential,
  request: ShippingInstructionRequest)
  - lib/services/crossborder/forwarders/shipandco-api-client.ts
- **getShipAndCoTracking** (credential: ForwarderApiCredential,
  trackingNumber: string)
  - lib/services/crossborder/forwarders/shipandco-api-client.ts

### lib/services/currency/exchange-service.ts

- **getExchangeRate** (from: string, to: string)
  - 為替変換サービス - ハイブリッドAI監査パイプライン
- **convertPriceForMarketplace** (basePriceUsd: number,
  targetMarketplace: string)
  - 為替変換サービス - ハイブリッドAI監査パイプライン
- **convertToUsd** (price: number, fromCurrency: string)
  - 為替変換サービス - ハイブリッドAI監査パイプライン
- **convertCurrency** (price: number,
  fromCurrency: string,
  toCurrency: string)
  - 為替変換サービス - ハイブリッドAI監査パイプライン
- **getAllRatesFromUsd** ()
  - 為替変換サービス - ハイブリッドAI監査パイプライン
- **formatPrice** (price: number, currency: string)
  - 為替変換サービス - ハイブリッドAI監査パイプライン
- **getCurrencyForMarketplace** (marketplaceId: string)
  - 為替変換サービス - ハイブリッドAI監査パイプライン

### lib/services/ebay/analysis-logic.ts

- **calculateRecommendedPrice** (avgSoldPrice: number,
  currentLowestPrice: number)
  - SM分析ロジック
- **calculateDemandScore** (soldLast90Days: number,
  competitorCount: number)
  - SM分析ロジック
- **interpretDemandScore** (score: number)
  - SM分析ロジック
- **determineConfidenceLevel** (findingSuccess: boolean,
  browseSuccess: boolean,
  soldLast90Days: number,
  competitorCount: number)
  - SM分析ロジック
- **mergeAnalysisResults** (findingResult: FindingApiResult | null,
  browseResult: BrowseApiResult | null)
  - SM分析ロジック
- **calculateMedian** (values: number[])
  - SM分析ロジック
- **calculateSoldCounts** (items: FindingItem[])
  - SM分析ロジック

### lib/services/ebay-auth-manager.ts

- **getEbayToken** (account: EbayAccount = "green")
  - N3 Empire OS - eBay認証統一管理（唯一神）
- **clearEbayTokenCache** (account?: EbayAccount)
  - N3 Empire OS - eBay認証統一管理（唯一神）
- **isTokenValid** (account: EbayAccount = "green")
  - N3 Empire OS - eBay認証統一管理（唯一神）
- **getTokenStatus** ()
  - N3 Empire OS - eBay認証統一管理（唯一神）

### lib/services/image/bundle-image-generator.ts

- **generateBundleImage** (input: BundleImageInput)
  - セット品（Bundle）トップ画像自動生成サービス
- **batchGenerateBundleImages** (inputs: BundleImageInput[],
  onProgress?: (completed: number, total: number)
  - セット品（Bundle）トップ画像自動生成サービス

### lib/services/image/image-optimization.ts

- **getTransformedUrl** (originalUrl: string,
  options: ImageTransformOptions)
  - 画像最適化サービス V2
- **getThumbnailUrl** (originalUrl: string, size: keyof typeof IMAGE_SIZES = 'thumbnail')
  - 画像最適化サービス V2
- **getOptimizedImageSet** (originalUrl: string)
  - 画像最適化サービス V2
- **getFirstImageUrl** (images: string | string[] | null | undefined)
  - 画像最適化サービス V2
- **normalizeImages** (images: any)
  - 画像最適化サービス V2
- **addThumbnailsToImages** (images: string[])
  - 画像最適化サービス V2
- **getCachedThumbnail** (originalUrl: string, size: keyof typeof IMAGE_SIZES = 'thumbnail')
  - 画像最適化サービス V2
- **clearImageCache** ()
  - 画像最適化サービス V2

### lib/services/image/image-processor-integration.ts

- **prepareImagesForListing** (imageUrls: string[],
  sku: string,
  marketplace: string,
  accountId: string,
  customZoom?: number)
  - 画像処理統合ヘルパー
- **getImageSettingsFromListingData** (listingData: any)
  - 画像処理統合ヘルパー
- **prepareSingleImageForListing** (imageUrl: string,
  sku: string,
  marketplace: string,
  accountId: string,
  customZoom?: number)
  - 画像処理統合ヘルパー

### lib/services/image/image-processor-service.ts

- **fetchImageRules** (accountId: string,
  marketplace: string)
  - 画像最適化エンジン - ImageProcessorService
- **getDefaultImageRule** (marketplace: string)
  - 画像最適化エンジン - ImageProcessorService
- **generateZoomVariants** (imageUrl: string,
  sku: string)
  - 画像最適化エンジン - ImageProcessorService
- **applyWatermark** (imageBuffer: Buffer,
  watermarkUrl: string,
  position: ImageRule['watermark_position'],
  opacity: number,
  scale: number)
  - 画像最適化エンジン - ImageProcessorService
- **processImageForListing** (imageUrl: string,
  sku: string,
  marketplace: string,
  accountId: string,
  customZoom?: number)
  - 画像最適化エンジン - ImageProcessorService
- **batchProcessImages** (imageUrls: string[],
  sku: string,
  marketplace: string,
  accountId: string,
  customZoom?: number)
  - 画像最適化エンジン - ImageProcessorService

### lib/services/image/image-upload-optimizer.ts

- **optimizeImageClient** (imageSource: File | Blob | string,
  options: Partial<ImageOptimizeOptions> = {})
  - 画像アップロード最適化サービス
- **optimizeImagesClient** (images: Array<File | Blob | string>,
  options: Partial<ImageOptimizeOptions> = {},
  onProgress?: (progress: BatchOptimizeProgress)
  - 画像アップロード最適化サービス
- **calculateResizeDimensions** (originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number)
  - 画像アップロード最適化サービス
- **dataUrlToBlob** (dataUrl: string)
  - 画像アップロード最適化サービス
- **validateImageUrl** (url: string)
  - 画像アップロード最適化サービス
- **prepareImageForEbay** (imageSource: File | Blob | string)
  - 画像アップロード最適化サービス
- **prepareImagesForEbay** (images: Array<File | Blob | string>,
  onProgress?: (progress: BatchOptimizeProgress)
  - 画像アップロード最適化サービス
- **estimateOptimizedSize** (originalWidth: number,
  originalHeight: number,
  originalSize: number,
  targetWidth: number = 1600,
  quality: number = 0.85)
  - 画像アップロード最適化サービス

### lib/services/inventory/automatic-price-reduction-service.ts

- **daysSinceAcquisition** (dateAcquired: string | null)
  - 在庫最適化：自動値下げサービス
- **daysUntilDeadline** (targetDeadline: string | null)
  - 在庫最適化：自動値下げサービス
- **calculateDefaultDeadline** (dateAcquired: string)
  - 在庫最適化：自動値下げサービス
- **determinePricePhase** (dateAcquired: string | null,
  targetDeadline?: string | null)
  - 在庫最適化：自動値下げサービス
- **getPhaseName** (phase: PricePhase)
  - 在庫最適化：自動値下げサービス
- **getPhaseColor** (phase: PricePhase)
  - 在庫最適化：自動値下げサービス
- **calculateRecommendedPrice** (product: InventoryProduct,
  phase: PricePhase,
  competitivePrice?: number)
  - 在庫最適化：自動値下げサービス
- **calculateProfitMargin** (sellingPrice: number,
  cogs: number,
  fees: number = 0,
  shipping: number = 0)
  - 在庫最適化：自動値下げサービス
- **calculateFinalProfitMargin** (product: InventoryProduct)
  - 在庫最適化：自動値下げサービス
- **shouldAlert** (product: InventoryProduct)
  - 在庫最適化：自動値下げサービス
- **getAlertProducts** (products: InventoryProduct[])
  - 在庫最適化：自動値下げサービス
- **executePriceReduction** (product: InventoryProduct,
  dryRun: boolean = false)
  - 在庫最適化：自動値下げサービス
- **batchPriceReduction** (products: InventoryProduct[],
  dryRun: boolean = false)
  - 在庫最適化：自動値下げサービス
- **calculateInventoryOptimizationStats** (products: InventoryProduct[])
  - 在庫最適化：自動値下げサービス

### lib/services/legacy/amazon/queue-processor.ts

- **getGlobalQueueProcessor** (supabaseUrl: string, supabaseKey: string)
  - Amazon更新キュープロセッサー

### lib/services/legacy/amazon/sp-api/crypto-utils.ts

- **encryptToken** (plaintext: string)
  - トークン暗号化・復号化ユーティリティ
- **decryptToken** (encryptedText: string)
  - トークン暗号化・復号化ユーティリティ
- **isValidEncryptedToken** (encryptedText: string)
  - トークン暗号化・復号化ユーティリティ
- **testEncryption** ()
  - トークン暗号化・復号化ユーティリティ

### lib/services/legacy/amazon/sp-api/lwa-auth.ts

- **getAccessToken** (refreshToken: string)
  - Login With Amazon (LWA) 認証フロー実装
- **exchangeAuthorizationCode** (authorizationCode: string,
  redirectUri: string)
  - Login With Amazon (LWA) 認証フロー実装
- **isTokenExpired** (expiresAt: Date)
  - Login With Amazon (LWA) 認証フロー実装
- **generateAuthorizationUrl** (redirectUri: string, state?: string)
  - Login With Amazon (LWA) 認証フロー実装

### lib/services/legacy/amazon/tracking-upload-service.ts

- **uploadTrackingToAmazon** (request: TrackingUploadRequest)
  - lib/amazon/tracking-upload-service.ts
- **batchUploadTrackingToAmazon** (requests: TrackingUploadRequest[])
  - lib/amazon/tracking-upload-service.ts
- **getTrackingUploadHistory** (orderId: string)
  - lib/amazon/tracking-upload-service.ts

### lib/services/legacy/ebay/ebay-account-api.ts

- **getRestrictedUserList** (accessToken: string)
  - N3 Empire OS - eBay Account API クライアント
- **setRestrictedUserList** (accessToken: string, usernames: string[])
  - N3 Empire OS - eBay Account API クライアント
- **mergeBlocklists** (existingList: string[], sharedList: string[], maxSize = 5000)
  - N3 Empire OS - eBay Account API クライアント
- **calculateBlocklistDiff** (oldList: string[], newList: string[])
  - N3 Empire OS - eBay Account API クライアント
- **syncBlocklistToEbay** (accessToken: string,
  sharedBlocklist: string[])
  - N3 Empire OS - eBay Account API クライアント

### lib/services/legacy/ebay/ebay-api.ts

- **getEbayCredentials** (account: 'green' | 'mjt' | 'mystical' = 'green')
  - N3 Empire OS - eBay Trading API ヘルパー
- **callEbayTradingAPI** (options: EbayApiOptions)
  - N3 Empire OS - eBay Trading API ヘルパー
- **extractXmlValue** (xml: string, tagName: string)
  - N3 Empire OS - eBay Trading API ヘルパー
- **extractXmlArray** (xml: string, tagName: string)
  - N3 Empire OS - eBay Trading API ヘルパー

### lib/services/legacy/mercari/api-client.ts

- **updateMercariItem** (item_id: string,
  updates: {
    price?: number
    status?: 'on_sale' | 'sold_out'
  })
  - Mercari API クライアント
- **deleteMercariItem** (item_id: string)
  - Mercari API クライアント
- **getMercariMessages** (limit: number = 50)
  - Mercari API クライアント

### lib/services/legacy/mercari/client.ts

- **importMercariListings** (listings: MercariListing[])
  - メルカリAPI クライアント
- **importMercariOrders** (orders: MercariOrder[])
  - メルカリAPI クライアント

### lib/services/legacy/mercari/html-parser.ts

- **parseMercariListingsHtml** (html: string)
  - メルカリ出品一覧HTMLパーサー
- **convertToInventoryFormat** (items: MercariListingItem[], accountName: string = 'default')
  - メルカリ出品一覧HTMLパーサー

### lib/services/legacy/misc/note-client.ts

- **postToNote** (postData: NotePostData, token: string)
  - Note APIを通じて記事を自動投稿する

### lib/services/listing/bulk-listing-service.ts

- **mapToEbaymagShippingPolicy** (originalPolicy: string,
  targetMarketplace: string)
  - 一括出品サービス - eBaymag対応・レートリミット管理
- **isShippingPolicyError** (errorCode: number)
  - 一括出品サービス - eBaymag対応・レートリミット管理
- **convertProductForEbaymag** (product: Product, targetMarketplace: string)
  - 一括出品サービス - eBaymag対応・レートリミット管理
- **executeBulkListing** (request: BulkListingRequest,
  onProgress?: (current: number, total: number, message: string)
  - 一括出品サービス - eBaymag対応・レートリミット管理
- **validateProductForListing** (product: Product)
  - 一括出品サービス - eBaymag対応・レートリミット管理
- **validateBulkListingRequest** (request: BulkListingRequest)
  - 一括出品サービス - eBaymag対応・レートリミット管理

### lib/services/listing/bundle-variation-service.ts

- **calculateBundleCost** (items: BundleItem[])
  - セット品・バリエーション・オークション管理サービス
- **calculateBundleWeight** (items: BundleItem[])
  - セット品・バリエーション・オークション管理サービス
- **calculateBundleMinStock** (items: BundleItem[], 
  stockMap: Map<string, number>)
  - セット品・バリエーション・オークション管理サービス
- **calculateBundleDimensions** (items: BundleItem[])
  - セット品・バリエーション・オークション管理サービス
- **buildBundleProduct** (bundleId: string,
  bundleSku: string,
  bundleTitle: string,
  items: BundleItem[],
  stockMap: Map<string, number>)
  - セット品・バリエーション・オークション管理サービス
- **calculateDdpCost** (costPriceJpy: number,
  weightG: number,
  exchangeRate: number = 0.0067,  // JPY→USD
  shippingCostPerGram: number = 0.015  // $0.015/g)
  - セット品・バリエーション・オークション管理サービス
- **calculateVariationPricing** (variations: Variation[],
  targetProfitMargin: number = 0.20,  // 20%利益率
  exchangeRate: number = 0.0067)
  - セット品・バリエーション・オークション管理サービス
- **buildEbayVariations** (product: VariationProduct)
  - セット品・バリエーション・オークション管理サービス
- **convertDurationToEbay** (days: AuctionSettings['durationDays'])
  - セット品・バリエーション・オークション管理サービス
- **applyAuctionSettings** (baseItem: EbayListingData['item'],
  settings: AuctionSettings)
  - セット品・バリエーション・オークション管理サービス
- **buildEbayListingData** (product: Product | VariationProduct,
  settings: AuctionSettings,
  options: {
    categoryId: string;
    conditionId: string;
    shippingPolicy?: string;
    returnPolicy?: string;
    paymentPolicy?: string;
  })
  - セット品・バリエーション・オークション管理サービス
- **validateVariationProduct** (product: VariationProduct)
  - セット品・バリエーション・オークション管理サービス
- **validateBundleProduct** (bundle: BundleProduct)
  - セット品・バリエーション・オークション管理サービス

### lib/services/listing/listing-rotation-service.ts

- **identifyLowScoreItems** (criteria: LowScoreItemCriteria = {})
  - 出品交代サービス (タスク5B - S-8)
- **endListing** (input: EndListingInput)
  - 出品交代サービス (タスク5B - S-8)
- **endBulkListings** (items: LowScoreItem[],
  reason: string)
  - 出品交代サービス (タスク5B - S-8)

### lib/services/listing/listing-service.ts

- **getListingBackend** ()

### lib/services/listing/log-service.ts

- **fetchListingLogs** (sku: string)
  - SKUに紐づく全ての履歴データを取得する（ログ取得 API用）

### lib/services/media/index.ts

- **getDefaultBrandConfig** ()
- **getDefaultVoiceConfig** ()
- **getDefaultProductionConfig** ()
- **getDefaultSecurityConfig** ()

### lib/services/mercari/inventory-service.ts

- **saveInventoryHistory** (data: ScrapedInventoryData)
  - スクレイピング結果を inventory_history テーブルに保存する

### lib/services/mercari/scraper.ts

- **parseMercariListingsHtml** (html: string, sellerId: string)
  - メルカリスクレイピングサービス
- **convertMercariToInventory** (item: MercariItem, sellerId: string)
  - メルカリスクレイピングサービス
- **convertToFullSizeImage** (thumbnailUrl: string)
  - メルカリスクレイピングサービス

### lib/services/mercari/scraping-core.ts

- **scrapeInventoryAndSellerData** (url: string, sku: string)
  - Amazon/eBayのページから価格、在庫数、出品者数などを取得するコア関数を拡張

### lib/services/messaging/auto-reply-engine.ts

- **classifyMessage** (message: UnifiedMessage)
  - AIを利用して通知メッセージの緊急度と意図を分類する（Claude KDL連携想定）
- **submitClassificationCorrection** (data: TrainingData)
  - AIを利用して通知メッセージの緊急度と意図を分類する（Claude KDL連携想定）
- **generateAutoReply** (message: UnifiedMessage)
  - AIを利用して通知メッセージの緊急度と意図を分類する（Claude KDL連携想定）

### lib/services/messaging/kpi-controller.ts

- **markMessageAsCompleted** (messageId: string, staffId: string)
  - 顧客メッセージの対応完了ステータスを更新する
- **registerAlertToCalendar** (notificationTitle: string, sourceMall: string)
  - 顧客メッセージの対応完了ステータスを更新する
- **getUnansweredMessageCount** ()
  - 顧客メッセージの対応完了ステータスを更新する

### lib/services/pipeline/autonomous-listing-pipeline.ts

- **runAutonomousPipeline** (product: Product,
  options: Partial<PipelineOptions> = {})
  - 自律出品パイプライン
- **runBatchPipeline** (products: Product[],
  options: Partial<PipelineOptions> = {},
  onProgress?: (completed: number, total: number, context: PipelineContext)
  - 自律出品パイプライン
- **summarizePipelineResults** (contexts: PipelineContext[])
  - 自律出品パイプライン

### lib/services/pricing/price-calculation-service.ts

- **calculateDynamicShippingDdp** (product: Product, 
    childVariations: Product[] // 選択された子SKU（構成品）の配列)
  - DDPコストに基づき、バリエーションの Item Price と SKU別送料サーチャージを計算する
- **calculateTotalCostPrice** (items: GroupingItem[], skuMaster: Product[])
  - DDPコストに基づき、バリエーションの Item Price と SKU別送料サーチャージを計算する

### lib/services/profit-calculator.ts

- **formatCurrency** (amount: number)
  - Phase 1: 利益計算エンジン (ProfitCalculator)
- **formatPercentage** (value: number, decimals: number = 1)
  - Phase 1: 利益計算エンジン (ProfitCalculator)
- **getProfitMarginColor** (margin: number)
  - Phase 1: 利益計算エンジン (ProfitCalculator)
- **getRiskBadgeColor** (isRisk: boolean)
  - Phase 1: 利益計算エンジン (ProfitCalculator)

### lib/services/scheduler/job-queue-service.ts

- **startFullPipeline** (productIds: string[],
  smSource: string,
  options?: JobData['options'])
  - ジョブキューサービス - 非同期バックグラウンド処理
- **watchJobProgress** (jobId: string,
  onProgress: (job: Job)
  - ジョブキューサービス - 非同期バックグラウンド処理

### lib/services/security/token-encryption-service.ts

- **saveEncryptedToken** (marketplaceId: string,
  tokenType: string,
  plainToken: string,
  expiresAt?: string)
  - 暗号化されたトークンをデータベースに保存
- **getDecryptedToken** (marketplaceId: string,
  tokenType: string)
  - 暗号化されたトークンをデータベースに保存
- **getAllDecryptedTokens** ()
  - 暗号化されたトークンをデータベースに保存
- **deactivateToken** (marketplaceId: string,
  tokenType: string)
  - 暗号化されたトークンをデータベースに保存
- **migratePlainTokensToEncrypted** ()
  - 暗号化されたトークンをデータベースに保存
- **checkTokenExpiry** (marketplaceId: string,
  tokenType: string)
  - 暗号化されたトークンをデータベースに保存

### lib/services/shipping/shipping-delay-predictor.ts

- **predictShippingDelay** (order: Order,
  processingDays: number = 2)
  - 指定された日付が週末（土日）かどうかを判定
- **batchPredictShippingDelay** (orders: Order[],
  processingDays: number = 2)
  - 指定された日付が週末（土日）かどうかを判定

### lib/services/shipping-policy-service.ts

- **selectShippingPolicy** (accountId: string,
  weightGrams: number)
  - eBay配送ポリシー選択サービス
- **getDefaultPolicies** (accountId: string)
  - eBay配送ポリシー選択サービス
- **getAllActivePolicies** (accountId: string)
  - eBay配送ポリシー選択サービス

### lib/services/sm/candidate-scoring.ts

- **scoreCandidates** (candidates: SMCandidate[],
  productContext: ProductContext,
  config: Partial<ScoringConfig> = {})
  - SM（SellerMirror）分析候補スコアリングシステム
- **getBestCandidate** (candidates: SMCandidate[],
  productContext: ProductContext,
  config: Partial<ScoringConfig> = {})
  - SM（SellerMirror）分析候補スコアリングシステム
- **getTopCandidates** (candidates: SMCandidate[],
  productContext: ProductContext,
  topN: number = 5,
  config: Partial<ScoringConfig> = {})
  - SM（SellerMirror）分析候補スコアリングシステム
- **shouldAutoSelect** (bestCandidate: ScoredCandidate | null,
  minAutoSelectScore: number = 75)
  - SM（SellerMirror）分析候補スコアリングシステム

### lib/services/spreadsheet/google-auth.ts

- **getGoogleAuth** (config?: GoogleAuthConfig)
  - Google Sheets API 認証ヘルパー
- **getGoogleSheetsClient** ()
  - Google Sheets API 認証ヘルパー
- **checkSpreadsheetAccess** (spreadsheetId: string)
  - Google Sheets API 認証ヘルパー

### lib/services/spreadsheet/realtime-sync.ts

- **startProductsSync** (spreadsheetId: string, sheetName = 'Products')
  - Supabase Realtime ↔ Google Sheets 双方向同期サービス
- **startInventorySync** (spreadsheetId: string, sheetName = 'Inventory')
  - Supabase Realtime ↔ Google Sheets 双方向同期サービス

### lib/services/stock/stock-sync-service.ts

- **decrementStock** (stockMasterId: string,
  quantity: number,
  sourceMarketplace: string,
  sourceOrderId: string,
  options: {
    syncToMarketplaces?: boolean
    orderItemId?: string
  } = {})
  - 在庫連動サービス
- **incrementStock** (stockMasterId: string,
  quantity: number,
  reason: 'return' | 'adjustment' | 'import',
  notes?: string)
  - 在庫連動サービス
- **syncDropshipChange** (changeId: string,
  options: {
    dryRun?: boolean
    account?: string
  } = {})
  - 在庫連動サービス
- **batchSyncDropshipChanges** (changeIds: string[],
  options: {
    dryRun?: boolean
    account?: string
  } = {})
  - 在庫連動サービス
- **calculateSetAvailability** (setProductId: string)
  - 在庫連動サービス
- **processSetSale** (setProductId: string,
  quantity: number,
  sourceMarketplace: string,
  sourceOrderId: string)
  - 在庫連動サービス
- **getStockStatus** (stockMasterId: string)
  - 在庫連動サービス
- **executePendingMarketplaceSyncs** ()
  - 在庫連動サービス

### lib/services/stock/yahoo-auction-sync-service.ts

- **checkYahooAuctionStatus** (url: string)
  - ヤフオク在庫同期サービス
- **syncYahooAuctionInventory** (options: {
    dryRun?: boolean;
    limit?: number;
    notifyChat?: boolean;
  } = {})
  - ヤフオク在庫同期サービス
- **scheduledYahooSync** ()
  - ヤフオク在庫同期サービス

### lib/services/token-encryption-service.ts

- **getTokenService** ()
  - ==============================================================================
- **saveEbayToken** (accountName: string,
  accessToken: string,
  expiresAt: Date)
  - ==============================================================================
- **getEbayToken** (accountName: string)
  - ==============================================================================
- **getTokenExpiryAlerts** ()
  - ==============================================================================

### lib/services/unified-service-registry.ts

- **calculateSafeShippingWeight** (estimatedWeightG: number,
  config: Partial<WeightMarginConfig> = {})
  - N3 統合サービスレジストリ
- **getNextScheduledTime** (config: Partial<ListingScheduleConfig> = {})
  - N3 統合サービスレジストリ
- **runUnifiedAudit** (product: Product)
  - N3 統合サービスレジストリ
- **batchUnifiedAudit** (products: Product[])
  - N3 統合サービスレジストリ
- **getAvailableServices** ()
  - N3 統合サービスレジストリ

### lib/services/upload/zip-processor.ts

- **processZipFile** (file: File | Blob)
  - ZIP ファイル処理サービス（入れ子構造対応）
- **processZipFileWithOptions** (file: File | Blob,
  options: ZipProcessOptions)
  - ZIP ファイル処理サービス（入れ子構造対応）

### lib/actions/amazon-research-actions.ts

- **fetchResearchItems** (options: { limit?: number } = {})
  - Amazon Research N3 - Server Actions
- **executeResearchBatch** (asins: string[])
  - Amazon Research N3 - Server Actions
- **sendToCatalog** (ids: string[])
  - Amazon Research N3 - Server Actions
- **createProductFromResearch** (item: {
  asin: string;
  title?: string;
  image_url?: string;
  price_jpy?: number;
  brand?: string;
  category?: string;
  n3_score?: number;
})
  - Amazon Research N3 - Server Actions
- **fetchAutoConfigs** (includeStats: boolean = false)
  - Amazon Research N3 - Server Actions
- **updateAutoConfig** (updates: {
  id: string;
  enabled?: boolean;
  name?: string;
  schedule_type?: string;
  schedule_time?: string;
})
  - Amazon Research N3 - Server Actions
- **executeCronResearch** (configId: string)
  - Amazon Research N3 - Server Actions

### lib/actions/governance-actions.ts

- **generateAIPrompt** ()
  - 🏛️ N3 Empire OS - Governance Server Actions
- **getGovernanceFile** (label: string)
  - 🏛️ N3 Empire OS - Governance Server Actions
- **updateTaskFile** (content: string)
  - 🏛️ N3 Empire OS - Governance Server Actions
- **auditCode** (code: string)
  - 🏛️ N3 Empire OS - Governance Server Actions

### lib/actions/imperial-fetch.ts

- **imperialSafeDispatch** (payload: StandardPayload)
  - 【MASTER_LAW 第103条 適用】
- **createSecurePayload** (toolId: string,
  action: string,
  params: { targets?: string[]; config?: Record<string, unknown> } = {})
  - 【MASTER_LAW 第103条 適用】

