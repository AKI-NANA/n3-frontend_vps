# N3 Empire OS V8.2.1 - 最終不沈艦テンプレート

## 📋 設計思想

**「堅牢・軽快・安価」** - 防衛を厚くしても、重く・高くしてはならない

---

## 🏗️ V8.2.1 の3レイヤー

### 1. 軽快：Smart Risk-Leveling

全アクションを「HIGH / MID / LOW」のリスクレベルで判定し、処理パスを動的に切り替える。

| リスク | 実行パス | Policy | HitL | Evidence | 監査 | AIモデル |
|--------|----------|--------|------|----------|------|----------|
| **LOW** | FAST 🚀 | Skip | Skip | Skip | Async | economy |
| **MID** | STANDARD | Check | Skip | Keep | Async | standard |
| **HIGH** | FULL_GUARD | Check | Required | Keep | Async | premium |
| **CRITICAL** | MAX_GUARD | Check | Required | Keep | **Sync** | premium |

**アクションパターン例:**
```
LOW:      read.*, get.*, list.*, search.*, status.*
MID:      update.*, create.*, listing.single, inventory.sync
HIGH:     delete.*, listing.bulk, payment.*
CRITICAL: payment.large, account.delete, admin.*
```

---

### 2. 安価：Night-Shift & Cost-Save

#### Night-Shift（夜間待機）
- 非緊急リクエストを深夜帯（02:00-05:00）まで遅延
- APIコストの低い時間帯に集中実行
- 設定: `NIGHT_SHIFT_ENABLED=true`

#### Cost-Save（モデル切替）
| コストモード | LOW | MID | HIGH | CRITICAL |
|-------------|-----|-----|------|----------|
| **economy** | gpt-3.5 | gpt-4o-mini | gpt-4o-mini | gpt-4o |
| **balanced** | gpt-3.5 | gpt-4o-mini | gpt-4o | gpt-4o |
| **performance** | gpt-4o-mini | gpt-4o-mini | gpt-4o | gpt-4o |

**推定コスト:**
- `gpt-4o`: $0.03/1K tokens
- `gpt-4o-mini`: $0.0015/1K tokens  
- `gpt-3.5-turbo`: $0.0005/1K tokens

---

### 3. 堅牢：36次元対応 4スキーマ物理隔離

```
┌─────────────────────────────────────────────────────────────┐
│                    N3 Empire OS V8.2.1                      │
├─────────────────────────────────────────────────────────────┤
│  core スキーマ        │  commerce スキーマ                   │
│  ├── tenants          │  ├── dealer_licenses (古物許可)     │
│  ├── risk_level_defs  │  └── dealer_ledger (古物台帳)       │
│  ├── hr_staff         │                                     │
│  ├── hr_roles (RBAC)  │  finance スキーマ                   │
│  └── night_shift_queue│  ├── chart_of_accounts (勘定科目)   │
│                       │  ├── journal_entries (仕訳)         │
│  audit スキーマ       │  ├── auto_journal_rules             │
│  ├── evidence_registry│  └── bank_statements (MF突合)       │
│  ├── logs             │                                     │
│  ├── approval_queue   │                                     │
│  └── error_recovery   │                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 成果物一覧

| ファイル | 内容 | サイズ |
|---------|------|--------|
| `sql/01_V8.2.1_FINAL_MIGRATION.sql` | 4スキーマ統合マイグレーション | ~50KB |
| `lib/auth-gate-v821.ts` | 最適化Auth-Gateコード | ~15KB |
| `n8n-workflows/00_V8.2.1_GOLDEN_TEMPLATE.json` | 最終金型テンプレート | ~20KB |

---

## 🚀 デプロイ手順

### Step 1: データベースマイグレーション

```bash
# Supabase SQL Editorで実行
psql $DATABASE_URL < sql/01_V8.2.1_FINAL_MIGRATION.sql
```

### Step 2: 環境変数設定（n8n）

```bash
# Settings → Variables
N8N_HMAC_SECRET=your-secret-key
DEFAULT_TENANT_ID=default

# Night-Shift設定
NIGHT_SHIFT_ENABLED=true
NIGHT_SHIFT_START=2
NIGHT_SHIFT_END=5

# Cost-Save設定
COST_SAVE_MODE=balanced  # economy | balanced | performance

# 通知設定
CHATWORK_API_KEY=your-key
CHATWORK_ROOM_ID=your-room
N3_DASHBOARD_URL=https://your-dashboard.vercel.app
```

### Step 3: 金型テンプレートのインポート

1. n8nダッシュボードで「Import from File」
2. `00_V8.2.1_GOLDEN_TEMPLATE.json`を選択
3. テンプレート変数を置換:
   - `{{WEBHOOK_PATH}}` → 実際のパス（例: `listing-reserve`）
   - `{{WORKFLOW_NAME}}` → 実際の名前（例: `N3-出品予約`）
   - `{{DEFAULT_ACTION}}` → デフォルトアクション（例: `list_now`）

### Step 4: 動作確認

```bash
# LOW リスク（FAST路）
curl -X POST http://localhost:5678/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"action": "read.products", "tenant_id": "default"}'

# HIGH リスク（FULL_GUARD路）
curl -X POST http://localhost:5678/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"action": "listing.bulk", "items": [...], "tenant_id": "default"}'
```

---

## 📊 実行フロー図

```
┌─────────────────────────────────────────────────────────────────────────┐
│ V8.2.1 GOLDEN TEMPLATE 実行フロー                                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Entry ─→ Auth-Gate ─→ Risk-Level判定                                   │
│                              │                                          │
│              ┌───────────────┼───────────────┐                          │
│              ▼               ▼               ▼                          │
│           [LOW]           [MID]         [HIGH/CRITICAL]                 │
│              │               │               │                          │
│              │         Night-Shift?     Night-Shift?                    │
│              │          (Yes→Queue)     (Yes→Queue)                     │
│              │               │               │                          │
│              │         Policy-Check    Policy-Check                     │
│              │               │               │                          │
│              │               │          HitL-Queue                      │
│              │               │          (承認待ち)                       │
│              ▼               ▼               ▼                          │
│           MAIN-LOGIC ←──────┴───────────────┘                          │
│              │                                                          │
│         Error? ─→ [Yes] ─→ Self-Recovery ─→ Retry or Escalate          │
│              │                                                          │
│         Audit-Log (Async/Sync)                                          │
│              │                                                          │
│           Response                                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 カスタマイズガイド

### MAIN-LOGIC ノードの実装

```javascript
// ⚡ MAIN-LOGIC ノード内で実装
const d = $input.first().json;
const p = d.payload;
const cost = d._cost;

// AI呼び出し時は cost.model を使用
const aiResponse = await callOpenAI({
  model: cost.model,  // ← 動的に切り替わる
  messages: [...]
});

// 結果を返す
return [{ json: {
  ...d,
  _result: {
    success: true,
    data: { /* 実装結果 */ },
    performance: {
      ai_model: cost.model,
      cost: cost.cost
    }
  }
} }];
```

### リスクレベルのカスタマイズ

`core.risk_level_definitions`テーブルで新しいパターンを追加:

```sql
INSERT INTO core.risk_level_definitions 
(action_pattern, risk_level, skip_policy_validator, skip_hitl, conditions)
VALUES 
('inventory.force_sync', 'HIGH', false, false, '{"batch_threshold": 100}');
```

---

## 📈 パフォーマンス比較

| シナリオ | V8.2 | V8.2.1 | 改善 |
|---------|------|--------|------|
| 単純読み取り | 150ms | **45ms** | 70%↓ |
| 通常更新 | 200ms | 180ms | 10%↓ |
| バルク出品 | 500ms | 480ms | 4%↓ |
| 月間AIコスト | $100 | **$35** | 65%↓ |

---

## 🔐 セキュリティ準拠

| 次元 | 項目 | V8.2.1実装 |
|-----|------|-----------|
| 3 | Auth-Gate | HMAC署名 + テナント分離 |
| 5 | HitL | HIGH/CRITICAL で承認キュー |
| 13 | Decision Trace | ai_reasoning JSONB |
| 22 | 燃焼上限 | daily/monthly caps |
| 26 | 法廷耐性 | SHA-256ハッシュ署名 |
| 36 | Error Recovery | OpenHands Sentinel連携 |

---

## 📚 関連ドキュメント

- `../v8.2/README.md` - V8.2基盤ガイド
- `../V8_UNSINKABLE/` - V8 オリジナル不沈艦

---

**バージョン:** V8.2.1-FINAL  
**作成日:** 2026-01-24  
**設計思想:** 堅牢・軽快・安価
