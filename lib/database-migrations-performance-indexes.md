# パフォーマンス最適化インデックス

## 概要
10,000商品以上の大規模データに対応するため、頻繁に使用されるクエリを最適化するインデックスを追加します。

**推定改善効果**: クエリ速度 **100倍以上**（10,000件時）

---

## 1. products_master テーブルの最適化

### 1.1 バッチ出品クエリ用の複合インデックス

```sql
-- 最も頻繁に使用されるクエリ:
-- SELECT * FROM products_master
-- WHERE status IN ('戦略決定済', '出品スケジュール待ち')
--   AND recommended_platform = 'ebay'
-- LIMIT 50;

-- 複合インデックス作成
CREATE INDEX IF NOT EXISTS idx_products_status_platform
ON products_master(status, recommended_platform)
WHERE status IN ('戦略決定済', '出品スケジュール待ち');

-- コメント
COMMENT ON INDEX idx_products_status_platform IS 'バッチ出品クエリ最適化（status + recommended_platform）';
```

**改善効果**:
- Before: Full Table Scan（10,000行スキャン）
- After: Index Scan（対象行のみ）
- 速度向上: **約100-200倍**

---

### 1.2 親SKU・子SKU検索の最適化

```sql
-- バリエーション変換で頻繁に使用されるクエリ:
-- SELECT * FROM products_master WHERE parent_sku = 'PARENT-001';

-- 既存インデックス確認（Phase 6で作成済み）
CREATE INDEX IF NOT EXISTS idx_products_parent_sku
ON products_master(parent_sku);

CREATE INDEX IF NOT EXISTS idx_products_variation_type
ON products_master(variation_type);

-- 複合インデックス（さらなる最適化）
CREATE INDEX IF NOT EXISTS idx_products_variation_lookup
ON products_master(parent_sku, variation_type, sku)
WHERE parent_sku IS NOT NULL;

COMMENT ON INDEX idx_products_variation_lookup IS 'バリエーション子SKU検索最適化';
```

**改善効果**:
- N+1問題を回避（一括取得で1クエリに削減）
- 親SKU100件 × 子SKU平均5件 = 500SKU検索が1クエリで完了

---

### 1.3 優先度スコア範囲検索の最適化

```sql
-- 優先度順ソートクエリ:
-- SELECT * FROM products_master
-- WHERE status = '取得完了'
-- ORDER BY priority_score DESC
-- LIMIT 100;

CREATE INDEX IF NOT EXISTS idx_products_priority_score
ON products_master(priority_score DESC)
WHERE priority_score IS NOT NULL;

-- ステータス別優先度複合インデックス
CREATE INDEX IF NOT EXISTS idx_products_status_priority
ON products_master(status, priority_score DESC);

COMMENT ON INDEX idx_products_status_priority IS '優先度スコア降順検索最適化';
```

---

### 1.4 実行ステータス検索の最適化

```sql
-- エラー商品検索:
-- SELECT * FROM products_master
-- WHERE execution_status IN ('api_retry_pending', 'listing_failed');

CREATE INDEX IF NOT EXISTS idx_products_execution_status
ON products_master(execution_status)
WHERE execution_status IN ('api_retry_pending', 'listing_failed');

COMMENT ON INDEX idx_products_execution_status IS 'リトライ・エラー商品検索最適化';
```

---

### 1.5 更新日時検索の最適化

```sql
-- 最近更新された商品の検索:
-- SELECT * FROM products_master
-- WHERE updated_at > NOW() - INTERVAL '7 days'
-- ORDER BY updated_at DESC;

CREATE INDEX IF NOT EXISTS idx_products_updated_at
ON products_master(updated_at DESC);

COMMENT ON INDEX idx_products_updated_at IS '更新日時降順検索最適化';
```

---

## 2. exclusive_locks テーブルの最適化

### 2.1 アクティブロック検索の最適化

```sql
-- 最も頻繁に使用されるクエリ:
-- SELECT * FROM exclusive_locks
-- WHERE sku = 'ITEM-001' AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_exclusive_locks_sku_active
ON exclusive_locks(sku, is_active)
WHERE is_active = true;

-- プラットフォーム別ロック検索
CREATE INDEX IF NOT EXISTS idx_exclusive_locks_platform_active
ON exclusive_locks(locked_platform, is_active)
WHERE is_active = true;

COMMENT ON INDEX idx_exclusive_locks_sku_active IS 'アクティブロック検索最適化（SKU）';
COMMENT ON INDEX idx_exclusive_locks_platform_active IS 'アクティブロック検索最適化（プラットフォーム）';
```

---

### 2.2 古いロッククリーンアップの最適化

```sql
-- クリーンアップクエリ:
-- SELECT * FROM exclusive_locks
-- WHERE is_active = true AND locked_at < NOW() - INTERVAL '30 days';

CREATE INDEX IF NOT EXISTS idx_exclusive_locks_cleanup
ON exclusive_locks(is_active, locked_at)
WHERE is_active = true;

COMMENT ON INDEX idx_exclusive_locks_cleanup IS '古いロッククリーンアップ最適化';
```

---

## 3. listing_result_logs テーブルの最適化

### 3.1 SKU別ログ検索の最適化

```sql
-- ログ検索クエリ:
-- SELECT * FROM listing_result_logs
-- WHERE sku = 'ITEM-001'
-- ORDER BY created_at DESC
-- LIMIT 10;

CREATE INDEX IF NOT EXISTS idx_listing_logs_sku_created
ON listing_result_logs(sku, created_at DESC);

COMMENT ON INDEX idx_listing_logs_sku_created IS 'SKU別ログ検索最適化';
```

---

### 3.2 リトライキュー検索の最適化

```sql
-- リトライ対象商品の検索:
-- SELECT * FROM listing_result_logs
-- WHERE success = false
--   AND retry_count < 3
--   AND created_at > NOW() - INTERVAL '7 days';

CREATE INDEX IF NOT EXISTS idx_listing_logs_retry_queue
ON listing_result_logs(success, retry_count, created_at DESC)
WHERE success = false AND retry_count < 3;

COMMENT ON INDEX idx_listing_logs_retry_queue IS 'リトライキュー検索最適化';
```

---

### 3.3 プラットフォーム別統計の最適化

```sql
-- プラットフォーム別成功率の集計:
-- SELECT platform, COUNT(*), SUM(CASE WHEN success THEN 1 ELSE 0 END)
-- FROM listing_result_logs
-- WHERE created_at > NOW() - INTERVAL '30 days'
-- GROUP BY platform;

CREATE INDEX IF NOT EXISTS idx_listing_logs_platform_stats
ON listing_result_logs(platform, success, created_at);

COMMENT ON INDEX idx_listing_logs_platform_stats IS 'プラットフォーム別統計最適化';
```

---

## 4. strategy_rules テーブルの最適化

### 4.1 プラットフォーム別ルール検索の最適化

```sql
-- ルール検索クエリ:
-- SELECT * FROM strategy_rules
-- WHERE platform_key = 'ebay' AND is_active = true;

CREATE INDEX IF NOT EXISTS idx_strategy_rules_platform_active
ON strategy_rules(platform_key, is_active)
WHERE is_active = true;

-- アカウント別ルール検索
CREATE INDEX IF NOT EXISTS idx_strategy_rules_account_active
ON strategy_rules(account_id, is_active)
WHERE is_active = true;

COMMENT ON INDEX idx_strategy_rules_platform_active IS 'プラットフォーム別ルール検索最適化';
COMMENT ON INDEX idx_strategy_rules_account_active IS 'アカウント別ルール検索最適化';
```

---

## 5. sales_history テーブルの最適化

### 5.1 実績検索の最適化

```sql
-- 実績検索クエリ:
-- SELECT * FROM sales_history
-- WHERE platform = 'ebay' AND account_id = 1
-- ORDER BY sale_date DESC
-- LIMIT 100;

CREATE INDEX IF NOT EXISTS idx_sales_history_platform_account
ON sales_history(platform, account_id, sale_date DESC);

-- SKU別実績検索
CREATE INDEX IF NOT EXISTS idx_sales_history_sku
ON sales_history(sku, sale_date DESC);

COMMENT ON INDEX idx_sales_history_platform_account IS 'プラットフォーム別実績検索最適化';
COMMENT ON INDEX idx_sales_history_sku IS 'SKU別実績検索最適化';
```

---

## 6. VERO brands テーブルの最適化（Phase 6追加）

### 6.1 ブランド名検索の最適化

```sql
-- 大文字小文字を無視した検索:
-- SELECT * FROM vero_brands WHERE LOWER(brand_name) = LOWER('Nike');

-- 既存インデックス確認（Phase 6で作成済み）
CREATE INDEX IF NOT EXISTS idx_vero_brands_name
ON vero_brands(brand_name);

-- 大文字小文字を無視した検索の高速化
CREATE INDEX IF NOT EXISTS idx_vero_brands_name_lower
ON vero_brands(LOWER(brand_name));

-- リスクレベル別検索
CREATE INDEX IF NOT EXISTS idx_vero_brands_risk
ON vero_brands(risk_level)
WHERE is_vero = true;

COMMENT ON INDEX idx_vero_brands_name_lower IS 'ブランド名大文字小文字無視検索最適化';
```

---

## 7. パフォーマンス検証クエリ

### 7.1 EXPLAIN ANALYZE の実行

```sql
-- インデックス使用状況の確認
EXPLAIN ANALYZE
SELECT * FROM products_master
WHERE status IN ('戦略決定済', '出品スケジュール待ち')
  AND recommended_platform = 'ebay'
LIMIT 50;

-- 期待される出力:
--  Index Scan using idx_products_status_platform on products_master
--  (actual time=0.015..0.025 rows=50 loops=1)

-- インデックス使用前（悪い例）:
--  Seq Scan on products_master  (actual time=15.234..50.678 rows=50 loops=1)
```

### 7.2 インデックスサイズの確認

```sql
-- 各インデックスのサイズ確認
SELECT
  schemaname,
  tablename,
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE tablename IN ('products_master', 'exclusive_locks', 'listing_result_logs')
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 7.3 未使用インデックスの検出

```sql
-- 使用されていないインデックスを検出（定期チェック推奨）
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch,
  pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND tablename NOT LIKE 'pg_%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 8. VACUUM と ANALYZE の実行

```sql
-- インデックス作成後は必ず実行
VACUUM ANALYZE products_master;
VACUUM ANALYZE exclusive_locks;
VACUUM ANALYZE listing_result_logs;
VACUUM ANALYZE strategy_rules;
VACUUM ANALYZE sales_history;
VACUUM ANALYZE vero_brands;

-- 自動バキューム設定の確認
SHOW autovacuum;

-- テーブル統計の更新
ANALYZE products_master;
```

---

## 9. パーティショニング（オプション・将来的な拡張）

```sql
-- 100,000商品を超える場合のパーティショニング例

-- ステータス別パーティション
CREATE TABLE products_master_partitioned (
  LIKE products_master INCLUDING ALL
) PARTITION BY LIST (status);

CREATE TABLE products_master_listed PARTITION OF products_master_partitioned
FOR VALUES IN ('出品中', '出品停止');

CREATE TABLE products_master_pending PARTITION OF products_master_partitioned
FOR VALUES IN ('戦略決定済', '出品スケジュール待ち', '編集完了');

CREATE TABLE products_master_processing PARTITION OF products_master_partitioned
FOR VALUES IN ('取得完了', '優先度決定済', 'AI処理中', '外注処理完了');

-- （データ移行とテーブル切り替えが必要）
```

---

## 10. 実行手順

### ステップ1: インデックス作成（本番環境では低負荷時に実行）

```sql
-- 一括実行スクリプト
BEGIN;

-- products_master
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status_platform ON products_master(status, recommended_platform) WHERE status IN ('戦略決定済', '出品スケジュール待ち');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_variation_lookup ON products_master(parent_sku, variation_type, sku) WHERE parent_sku IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_priority_score ON products_master(priority_score DESC) WHERE priority_score IS NOT NULL;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_status_priority ON products_master(status, priority_score DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_execution_status ON products_master(execution_status) WHERE execution_status IN ('api_retry_pending', 'listing_failed');
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_updated_at ON products_master(updated_at DESC);

-- exclusive_locks
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exclusive_locks_sku_active ON exclusive_locks(sku, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exclusive_locks_platform_active ON exclusive_locks(locked_platform, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exclusive_locks_cleanup ON exclusive_locks(is_active, locked_at) WHERE is_active = true;

-- listing_result_logs
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_listing_logs_sku_created ON listing_result_logs(sku, created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_listing_logs_retry_queue ON listing_result_logs(success, retry_count, created_at DESC) WHERE success = false AND retry_count < 3;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_listing_logs_platform_stats ON listing_result_logs(platform, success, created_at);

-- strategy_rules
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_strategy_rules_platform_active ON strategy_rules(platform_key, is_active) WHERE is_active = true;
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_strategy_rules_account_active ON strategy_rules(account_id, is_active) WHERE is_active = true;

-- sales_history
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_history_platform_account ON sales_history(platform, account_id, sale_date DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_sales_history_sku ON sales_history(sku, sale_date DESC);

-- vero_brands
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vero_brands_name_lower ON vero_brands(LOWER(brand_name));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_vero_brands_risk ON vero_brands(risk_level) WHERE is_vero = true;

COMMIT;
```

**⚠️ 注意**: `CREATE INDEX CONCURRENTLY` は本番環境でロックを最小限にします。

---

### ステップ2: VACUUM ANALYZE 実行

```sql
VACUUM ANALYZE products_master;
VACUUM ANALYZE exclusive_locks;
VACUUM ANALYZE listing_result_logs;
VACUUM ANALYZE strategy_rules;
VACUUM ANALYZE sales_history;
VACUUM ANALYZE vero_brands;
```

---

### ステップ3: パフォーマンス検証

```sql
-- バッチ出品クエリのパフォーマンス測定
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM products_master
WHERE status IN ('戦略決定済', '出品スケジュール待ち')
  AND recommended_platform = 'ebay'
LIMIT 50;
```

---

## 11. 定期メンテナンス

### 週次タスク

```sql
-- 統計情報の更新
ANALYZE products_master;

-- 古いロックのクリーンアップ
DELETE FROM exclusive_locks
WHERE is_active = false AND unlocked_at < NOW() - INTERVAL '90 days';
```

### 月次タスク

```sql
-- 未使用インデックスのチェック
SELECT * FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND tablename NOT LIKE 'pg_%';

-- テーブル肥大化のチェック
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) -
                 pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

**作成日**: 2025-11-21
**対象**: Phase 1-6全テーブル
**推定改善効果**: クエリ速度 100-200倍、10,000商品処理時間 2-3時間 → 20-30分
**実装見積もり**: 2時間（テスト含む）
