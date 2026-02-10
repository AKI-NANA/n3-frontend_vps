# N3 Empire OS V8.3 - 実装ガイド

**生成日**: 2026-01-25
**対象**: VPS単体運用・中央集権型不沈艦構成

---

## 📋 成果物一覧

| ファイル | 用途 |
|---------|------|
| `N3_V83_CORE_ARCHITECTURE.md` | アーキテクチャ設計書 |
| `N3_V83_SQL_SCHEMA.sql` | 追加SQLスキーマ |
| `n3_v83_transform.py` | 140ファイル一括変換スクリプト |
| `N3-CORE-DISPATCHER.json` | 中央司令塔ワークフロー |
| `N3-SUB-DECISION-TRACE.json` | 監査ログサブワークフロー |
| `N3-QUEUE-WORKER.json` | キュー処理ワーカー |

---

## 🚀 実装手順（5ステップ）

### STEP 1: SQLスキーマ適用（5分）

```bash
# Supabase SQL Editorで実行
# または psql コマンドで実行

psql $DATABASE_URL -f N3_V83_SQL_SCHEMA.sql
```

**作成されるテーブル**:
- `n3_job_queue` - ジョブキュー
- `n3_api_health` - Circuit-Breaker用API健全性
- `n3_budget_tracker` - コスト追跡
- `n3_burn_limits` - 上限設定
- `n3_audit_logs` - 監査ログ

### STEP 2: 中央ワークフローのインポート（10分）

n8nダッシュボードで以下を順番にインポート:

1. **N3-SUB-DECISION-TRACE.json**（サブワークフロー）
2. **N3-CORE-DISPATCHER.json**（中央司令塔）
3. **N3-QUEUE-WORKER.json**（キューワーカー）

```bash
# n8n CLIでインポートする場合
n8n import:workflow --input=N3-SUB-DECISION-TRACE.json
n8n import:workflow --input=N3-CORE-DISPATCHER.json
n8n import:workflow --input=N3-QUEUE-WORKER.json
```

### STEP 3: n8n Variables設定（5分）

n8n Settings → Variables で以下を追加:

```
CORE_DISPATCHER_ID = <CORE-Dispatcherのワークフローid>
SUB_DECISION_TRACE_ID = <Decision-TraceのワークフローID>
N3_API_KEYS = key1,key2,key3  # カンマ区切り
N3_ALLOWED_IPS = 127.0.0.1,160.16.120.186  # 空なら制限なし
```

### STEP 4: 140ファイル一括変換（15分）

```bash
# 1. バックアップ作成
cp -r PRODUCTION PRODUCTION_BACKUP_$(date +%Y%m%d)

# 2. 分析実行（ドライラン）
python3 n3_v83_transform.py \
  --input-dir ./PRODUCTION \
  --dry-run

# 3. 変換実行
python3 n3_v83_transform.py \
  --input-dir ./PRODUCTION \
  --output-dir ./PRODUCTION_V83

# 4. 差分確認
diff -r PRODUCTION PRODUCTION_V83 | head -100
```

### STEP 5: 段階的検証（2-3日）

#### Phase 5-1: 10本先行テスト

```bash
# 重要度の低いワークフローから10本選定
# 例: テスト用、開発用、低頻度のもの

# インポート
n8n import:workflow --input=PRODUCTION_V83/テスト/N3-TEST-*.json

# 手動実行テスト
curl -X POST http://160.16.120.186:5678/webhook/core-dispatcher \
  -H "Content-Type: application/json" \
  -d '{
    "workflow_name": "N3-TEST-SAMPLE",
    "action": "execute",
    "priority": 5,
    "payload": {"test": true},
    "auth": {"user_id": "test_user", "api_key": "your_key"}
  }'
```

#### Phase 5-2: 全140本展開

問題がなければ全ワークフローを一括インポート。

---

## 🔧 運用コマンド集

### ジョブキュー確認

```sql
-- 待機中ジョブ
SELECT * FROM n3_job_queue WHERE status = 'waiting' ORDER BY priority DESC, created_at;

-- 実行中ジョブ
SELECT * FROM n3_job_queue WHERE status = 'running';

-- 失敗ジョブ
SELECT * FROM n3_job_queue WHERE status = 'failed' ORDER BY finished_at DESC LIMIT 20;
```

### Circuit-Breaker確認

```sql
-- API健全性一覧
SELECT * FROM v_n3_api_health_summary;

-- ブロック中API
SELECT * FROM n3_api_health WHERE blocked_until > NOW();

-- 手動でブロック解除
UPDATE n3_api_health SET 
  status = 'healthy', 
  fail_count = 0, 
  blocked_until = NULL 
WHERE api_name = 'ebay_trading';
```

### コスト確認

```sql
-- 日次コスト
SELECT * FROM v_n3_daily_cost_summary WHERE date = CURRENT_DATE;

-- ユーザー別コスト
SELECT user_id, SUM(cost) as total_cost 
FROM n3_budget_tracker 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY user_id;
```

### キュークリーンアップ

```sql
-- 30日以上前の完了ジョブを削除
SELECT n3_cleanup_old_jobs(30);

-- 90日以上前の監査ログを削除
SELECT n3_cleanup_old_audit_logs(90);
```

---

## 🛡️ トラブルシューティング

### 問題1: 認証エラー (403)

**症状**: `Authentication failed` レスポンス

**対処**:
```sql
-- API Keyが正しいか確認
-- n8n Variables で N3_API_KEYS を確認

-- または Auth-Gate のコードを修正して一時的にスキップ
-- （テスト時のみ）
```

### 問題2: API Blocked (503)

**症状**: `Service temporarily unavailable` レスポンス

**対処**:
```sql
-- ブロック状況確認
SELECT * FROM n3_api_health WHERE api_name = 'ebay_trading';

-- 手動解除
UPDATE n3_api_health SET 
  status = 'healthy', 
  fail_count = 0, 
  blocked_until = NULL,
  recovered_at = NOW()
WHERE api_name = 'ebay_trading';
```

### 問題3: Budget Exceeded (429)

**症状**: `Budget limit exceeded` レスポンス

**対処**:
```sql
-- 現在の使用量確認
SELECT * FROM n3_check_burn_limit('user_001');

-- 上限を一時的に引き上げ
UPDATE n3_burn_limits SET 
  daily_limit = 500, 
  monthly_limit = 5000 
WHERE user_id = 'user_001';
```

### 問題4: Queue満杯

**症状**: 常に `status: queued` で実行されない

**対処**:
```sql
-- 実行中ジョブ確認
SELECT * FROM n3_job_queue WHERE status = 'running';

-- 長時間実行中のジョブを強制終了
UPDATE n3_job_queue SET 
  status = 'failed', 
  error_message = 'Manually terminated - timeout'
WHERE status = 'running' 
AND started_at < NOW() - INTERVAL '30 minutes';
```

---

## 📊 モニタリング

### 推奨アラート設定

| 項目 | 閾値 | アクション |
|------|-----|----------|
| Queue待機数 | > 50 | 通知 |
| API Blocked | any | 即時通知 |
| 日次コスト | > 80% | 警告 |
| 実行時間 | > 5分 | 調査 |

### ChatWork通知例

```javascript
// ワークフロー内で使用
const message = `
⚠️ N3アラート

📊 Queue状況:
- 待機: ${waitingCount}
- 実行中: ${runningCount}

🔴 ブロックAPI: ${blockedApis.join(', ') || 'なし'}

💰 本日コスト: $${dailyCost.toFixed(2)} / $${dailyLimit}
`;

// ChatWork API呼出
```

---

## 📁 ディレクトリ構成（推奨）

```
n8n-workflows/
├── CORE/
│   ├── N3-CORE-DISPATCHER.json      # 中央司令塔
│   ├── N3-QUEUE-WORKER.json         # キューワーカー
│   └── N3-CLEANUP-SCHEDULER.json    # クリーンアップ
├── SUB/
│   ├── N3-SUB-DECISION-TRACE.json   # 監査ログ
│   ├── N3-SUB-CIRCUIT-BREAKER.json  # CB操作（オプション）
│   └── N3-SUB-NOTIFIER.json         # 通知（オプション）
├── 出品/
│   ├── N3-LISTING-EBAY.json
│   ├── N3-LISTING-AMAZON.json
│   └── ...
├── 在庫/
├── リサーチ/
└── メディア/
```

---

## ✅ 完了チェックリスト

- [ ] SQLスキーマ適用完了
- [ ] CORE-Dispatcher インポート・Active化
- [ ] SUB-Decision-Trace インポート・Active化
- [ ] QUEUE-WORKER インポート・Active化
- [ ] n8n Variables 設定完了
- [ ] 10本先行テスト完了
- [ ] 全140本変換・インポート完了
- [ ] モニタリング設定完了
- [ ] バックアップ確認

---

## 🔮 次のステップ

1. **自動スケーリング**: 負荷に応じてスロット数を動的調整
2. **優先度キュー高度化**: VIPユーザー、緊急ジョブの優先処理
3. **分散処理**: 複数VPSへの展開（将来）
4. **AIコスト最適化**: 低優先ジョブは安価なモデルへ自動切替

---

**制作**: N3 Empire OS V8.3
**お問い合わせ**: ChatWorkまたはシステムログを確認
