# 🧹 N3 Empire Imperial Cleanser Report

**実行日時**: 2026-02-05T06:19:06.573Z
**モード**: 本番適用
**バックアップ**: /Users/aritahiroaki/n3-frontend_new/governance/cleanser_backup_2026-02-05

## サマリー

| 指標 | 値 |
|------|-----|
| スキャンファイル数 | 2810 |
| 変更ファイル数 | 101 |
| 総削除/置換数 | 710 |

## 洗浄ルール別集計

| ルール | 説明 | 削除数 |
|--------|------|--------|
| console.log | console.log/debug/info を削除 | 318 |
| console.error | console.error を imperialLogger.error に置換（TODO） | 195 |
| console.warn | console.warn を imperialLogger.warn に置換（TODO） | 41 |
| print | print()を削除 | 155 |
| empty-except | 空のexceptをlogger.errorに置換 | 1 |

## 変更ファイル一覧

| ファイル | 変更数 | 内容 |
|----------|--------|------|
| app/(sales)/tools/ec-management/editing-n3/components/pipeline/smart-pipeline-button.tsx | 1 | console.log(1) |
| app/(sales)/tools/ec-management/listing-n3/components/l3-tabs/pricing-tool-panel.tsx | 1 | console.log(1) |
| app/api/ebay/create-listing/route.ts | 1 | console.log(1) |
| app/management/orders/v2/order-manager_v2.jsx | 1 | console.log(1) |
| app/management/shipping/shipping-manager.jsx | 1 | console.log(1) |
| app/tools/command-center/page.tsx | 1 | console.log(1) |
| app/tools/control-n3/page.tsx | 2 | console.error(2) |
| app/tools/editing-n3/components/pipeline/smart-pipeline-button.tsx | 1 | console.log(1) |
| app/tools/listing-n3/components/l3-tabs/pricing-tool-panel.tsx | 1 | console.log(1) |
| app/tools/operations/components/ai-market-research-modal.tsx | 1 | console.error(1) |
| app/tools/operations/components/gemini-batch-modal.tsx | 2 | console.error(2) |
| app/tools/operations/components/html-publish-modal.tsx | 3 | console.error(3) |
| app/tools/operations/components/pricing-strategy-panel.tsx | 2 | console.error(2) |
| app/tools/operations/hooks/use-batch-process.ts | 9 | console.log(1), console.warn(2), console.error(6) |
| app/tools/operations/hooks/use-product-data.ts | 2 | console.log(1), console.error(1) |
| app/tools/operations-n3/layouts/operations-n3-page-layout.tsx | 1 | console.log(1) |
| app/tools/product-sourcing-n3/page.tsx | 1 | console.log(1) |
| lib/actions/imperial-fetch.ts | 2 | console.error(2) |
| lib/audit/audit-log.ts | 1 | console.error(1) |
| lib/batch-utils.ts | 1 | console.error(1) |
| lib/ebay/trading-api-fixed.ts | 1 | console.log(1) |
| lib/governance/migration-manager.ts | 2 | console.warn(1), console.error(1) |
| lib/governance/rule-checker.ts | 1 | console.warn(1) |
| lib/mappers/asia/examples/usage-example.js | 2 | console.log(2) |
| lib/services/security/encryption-service.ts | 1 | console.log(1) |
| lib/shared/security.ts | 4 | console.warn(1), console.error(3) |
| lib/shopee/validator.ts | 1 | console.log(1) |
| lib/utils/concurrency/batch-processor.ts | 1 | console.log(1) |
| components/ebay-pricing/calculator-tab-complete-useeffect-fix.tsx | 3 | console.error(3) |
| components/ebay-pricing/calculator-tab-complete.tsx | 4 | console.error(4) |
| components/management-suite/listing/listing-management.tsx | 1 | console.log(1) |
| components/n3/demos/header-preview.tsx | 1 | console.log(1) |
| components/n3/presentational/n3-tooltip.tsx | 1 | console.log(1) |
| components/product-modal/components/Tabs/tab-tax-compliance.tsx | 1 | console.error(1) |
| services/AIEngine.ts | 4 | console.log(4) |
| services/ComplianceMonitor.ts | 9 | console.error(9) |
| services/CredentialsManager.ts | 3 | console.log(2), console.error(1) |
| services/DdpCalculator.ts | 3 | console.log(2), console.warn(1) |
| services/ExclusiveLockManager.ts | 7 | console.log(2), console.warn(1), console.error(4) |
| services/FulfillmentManager.ts | 1 | console.log(1) |
| services/IntegratedPublisher.ts | 57 | console.log(51), console.error(6) |
| services/InventorySyncService.ts | 16 | console.log(10), console.warn(1), console.error(5) |
| services/InventorySyncWorker.ts | 5 | console.log(4), console.error(1) |
| services/InventoryTracker.ts | 5 | console.log(2), console.error(3) |
| services/KobutsuLedgerService.ts | 10 | console.log(7), console.error(3) |
| services/ListingExecutor.ts | 26 | console.log(16), console.warn(3), console.error(7) |
| services/ListingGroupManager.ts | 9 | console.log(9) |
| services/ListingResultLogger.ts | 5 | console.log(1), console.error(4) |
| services/ListingService.ts | 8 | console.log(7), console.warn(1) |
| services/ListingStrategyEngine.ts | 1 | console.error(1) |
| services/LockReleaseService.ts | 9 | console.log(6), console.error(3) |
| services/PerformanceUpdateService.ts | 11 | console.log(8), console.error(3) |
| services/PriceCalculator.ts | 13 | console.log(12), console.warn(1) |
| services/PriorityScoreService.ts | 2 | console.error(2) |
| services/ProductDeduplicationService.ts | 3 | console.error(3) |
| services/PublisherHub.ts | 12 | console.log(7), console.warn(2), console.error(3) |
| services/RetryQueueService.ts | 21 | console.log(11), console.warn(1), console.error(9) |
| services/RpaService.ts | 7 | console.log(7) |
| services/SpecializedDataMapper.ts | 15 | console.log(11), console.warn(4) |
| services/StockTrackingService.ts | 7 | console.log(1), console.error(6) |
| services/UnifiedProfitCalculator.ts | 4 | console.log(2), console.warn(1), console.error(1) |
| services/UniversalApiConnector.ts | 12 | console.log(8), console.warn(1), console.error(3) |
| services/VariationConverter.ts | 1 | console.error(1) |
| services/accounting/ExpenseClassifier.ts | 13 | console.log(7), console.warn(1), console.error(5) |
| services/accounting/FinancialMetricsService.ts | 6 | console.log(3), console.warn(2), console.error(1) |
| services/accounting/MoneyCloudConnector.ts | 9 | console.log(4), console.warn(1), console.error(4) |
| services/ai_pipeline/SupplierLocator.ts | 12 | console.log(8), console.warn(3), console.error(1) |
| services/arbitrage/dataFetcher.ts | 1 | console.log(1) |
| services/batch/batchProcessor.ts | 6 | console.log(4), console.warn(1), console.error(1) |
| services/batchProcessingService.ts | 2 | console.log(2) |
| services/bookkeeping/JournalEntryService.ts | 10 | console.log(6), console.warn(1), console.error(3) |
| services/bookkeeping/RuleGenerator.ts | 14 | console.log(5), console.error(9) |
| services/bookkeeping/TransactionAnalyzer.ts | 5 | console.log(3), console.error(2) |
| services/examples/publishingExamples.ts | 38 | console.log(35), console.error(3) |
| services/finance/cashflowPredictor.ts | 13 | console.log(2), console.warn(2), console.error(9) |
| services/finance/moneyCloudConnector.ts | 7 | console.log(3), console.error(4) |
| services/inquiry/InquiryClassifier.ts | 3 | console.log(1), console.error(2) |
| services/inventory-sync-service.ts | 1 | console.log(1) |
| services/kobutsu/AIScraper.ts | 4 | console.error(4) |
| services/kobutsu/RPA_PDF_Batch.ts | 1 | console.error(1) |
| services/orders/RiskAnalyzer.ts | 1 | console.log(1) |
| services/security/TokenManager.ts | 29 | console.log(11), console.warn(5), console.error(13) |
| services/shipping/ShipmentAuditor.ts | 4 | console.error(4) |
| services/tokenEncryptionService.ts | 7 | console.error(7) |
| hooks/use-ebay-pricing.ts | 1 | console.error(1) |
| hooks/use-listing-backend.ts | 1 | console.warn(1) |
| hooks/use-sm-sequential-selection.ts | 5 | console.log(5) |
| hooks/useInventory.ts | 2 | console.error(2) |
| hooks/useRealtimeSync.ts | 7 | console.log(4), console.error(3) |
| contexts/AuthContext.tsx | 2 | console.error(2) |
| contexts/TenantContext.tsx | 3 | console.error(3) |
| contexts/ThemeContext.tsx | 2 | console.warn(2) |
| scripts/detect_dev_lab_stray.py | 25 | print(25) |
| scripts/detect_stray_tools.py | 24 | print(23), empty-except(1) |
| scripts/export_code_map_to_sqlite.py | 19 | print(19) |
| scripts/import_yahoo.py | 2 | print(2) |
| scripts/inspect_brain.py | 9 | print(9) |
| scripts/n3_orphan_scanner.py | 9 | print(9) |
| scripts/organize_dev_lab_only.py | 38 | print(38) |
| scripts/organize_stray_tools.py | 27 | print(27) |
| scripts/query_brain.py | 3 | print(3) |

## ⚠️ 要手動修正: process.env/os.getenv 使用箇所

以下の箇所は `fetchSecret()` または `SecretManager` への置換が必要です:

| ファイル | 行 | コード |
|----------|-----|--------|
| app/(sales)/tools/ec-management/editing-n3/components/layouts/editing-n3-page-layout.tsx | 324 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/components/layouts/editing-n3-page-layout.tsx | 337 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/components/layouts/editing-n3-page-layout.tsx | 355 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/components/layouts/editing-n3-page-layout.tsx | 376 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/components/layouts/editing-n3-page-layout.tsx | 390 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/hooks/use-inventory-data.ts | 219 | `if (process.env.NODE_ENV === 'development' && mountCountRef....` |
| app/(sales)/tools/ec-management/editing-n3/hooks/use-tab-counts.ts | 158 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/page.tsx | 39 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/page.tsx | 49 | `if (process.env.NODE_ENV === 'development') {` |
| app/(sales)/tools/ec-management/editing-n3/page.tsx | 65 | `if (process.env.NODE_ENV === 'development') {` |
| app/api/admin/deploy/route.ts | 30 | `const N3_ROOT = process.env.N3_ROOT || '/Users/AKI-NANA/n3-f...` |
| app/api/admin/deploy/route.ts | 31 | `const N3_VPS_LOCAL = process.env.N3_VPS_LOCAL || '/Users/AKI...` |
| app/api/admin/deploy/route.ts | 32 | `const VPS_HOST = process.env.VPS_HOST || process.env.N3_INTE...` |
| app/api/admin/deploy/route.ts | 33 | `const VPS_USER = process.env.VPS_USER || 'ubuntu';` |
| app/api/admin/deploy/route.ts | 34 | `const VPS_PATH = process.env.VPS_PATH || '~/n3-frontend-vps'...` |
| app/api/admin/deploy/route.ts | 37 | `const ADMIN_KEY = process.env.ADMIN_DEPLOY_KEY || 'n3-deploy...` |
| app/api/admin/migrate/route.ts | 16 | `process.env.SUPABASE_SERVICE_ROLE_KEY!` |
| app/api/admin/migrate/route.ts | 102 | `'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,` |
| app/api/admin/migrate/route.ts | 103 | `'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE...` |
| app/api/admin/migrate-credentials/route.ts | 17 | `const ADMIN_PASSWORD = process.env.ADMIN_MIGRATION_PASSWORD` |
| app/api/admin/migrate-credentials/route.ts | 143 | `const mercariApiKey = process.env.MERCARI_API_KEY` |
| app/api/admin/migrate-tokens/route.ts | 28 | `const adminPassword = process.env.ADMIN_PASSWORD || 'admin-s...` |
| app/api/admin/sync-listing-status/route.ts | 15 | `process.env.SUPABASE_SERVICE_ROLE_KEY!` |
| app/api/ai/batch-analysis/route.ts | 17 | `const GEMINI_API_KEY = await fetchSecret('GEMINI_API_KEY') |...` |
| app/api/ai/image-analysis/route.ts | 25 | `const GEMINI_API_KEY = await fetchSecret('GEMINI_API_KEY') |...` |
| app/api/ai/weight-estimation/route.ts | 13 | `const GEMINI_API_KEY = await fetchSecret('GEMINI_API_KEY') |...` |
| app/api/amazon/tokens/route.ts | 86 | `const finalClientSecret = clientSecret || await fetchSecret(...` |
| app/api/audit/dashboard/route.ts | 7 | `process.env.SUPABASE_SERVICE_ROLE_KEY!` |
| app/api/audit/submit/route.ts | 9 | `process.env.SUPABASE_SERVICE_ROLE_KEY!` |
| app/api/auth/login/route.ts | 6 | `const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secre...` |
| app/api/auth/login/route.ts | 8 | `if (!process.env.JWT_SECRET) {` |
| app/api/auth/login/route.ts | 96 | `secure: process.env.NODE_ENV === 'production',` |
| app/api/auth/logout/route.ts | 18 | `secure: process.env.NODE_ENV === 'production',` |
| app/api/auth/me/route.ts | 5 | `const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secre...` |
| app/api/automation/scheduler/quarantine/route.ts | 81 | `const notifyUrl = process.env.N8N_BASE_URL` |
| app/api/automation/scheduler/quarantine/route.ts | 82 | `? `${process.env.N8N_BASE_URL}/webhook/notification`` |
| app/api/automation/settings/route.ts | 17 | `process.env.SUPABASE_SERVICE_ROLE_KEY!` |
| app/api/bookkeeping-n3/apply-rules/route.ts | 13 | `process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PU...` |
| app/api/bookkeeping-n3/mf/test-connection/route.ts | 40 | `const clientId = process.env.MONEYFORWARD_CLIENT_ID;` |
| app/api/bookkeeping-n3/mf/test-connection/route.ts | 41 | `const clientSecret = process.env.MONEYFORWARD_CLIENT_SECRET;` |
| app/api/bookkeeping-n3/mf/test-connection/route.ts | 42 | `const redirectUri = process.env.MONEYFORWARD_REDIRECT_URI;` |
| app/api/bookkeeping-n3/mf/test-connection/route.ts | 82 | `const clientId = process.env.MONEYFORWARD_CLIENT_ID;` |
| app/api/bookkeeping-n3/mf/test-connection/route.ts | 83 | `const clientSecret = process.env.MONEYFORWARD_CLIENT_SECRET;` |
| app/api/bookkeeping-n3/mf/test-connection/route.ts | 84 | `const redirectUri = process.env.MONEYFORWARD_REDIRECT_URI;` |
| app/api/bookkeeping-n3/rules/delete-all/route.ts | 10 | `const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE...` |
| app/api/bookkeeping-n3/rules/import/route.ts | 11 | `const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE...` |
| app/api/bookkeeping-n3/rules/import-from-sheet/route.ts | 11 | `const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE...` |
| app/api/bookkeeping-n3/rules/route.ts | 16 | `process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PU...` |
| app/api/bookkeeping-n3/rules/sync/route.ts | 11 | `const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE...` |
| app/api/bookkeeping-n3/supusi/route.ts | 11 | `const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE...` |

... 他 585 件

---

✅ 洗浄が適用されました。バックアップは上記ディレクトリにあります。
