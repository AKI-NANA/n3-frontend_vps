# 🏛️ N3帝国 法典対応表 (MASTER_LAW ⇔ Audit Rules)

> **目的**: MASTER_LAW.md の各条文が、監査スクリプト（total-empire-audit.js）でどのように検知されているかを明示する。

---

## 📊 対応表サマリー

| 法典条文 | 監査ルールID | 検知方法 | 自動修正 |
|----------|--------------|----------|----------|
| 第4条 Auth-Gate | TS-DIM-003, N8N-DIM-003 | ✅ 検知あり | ❌ |
| 第4.5条 環境二重性禁止 | TS-PHY-002, PY-PHY-002 | ✅ 検知あり | ⚠️ 準・安全 |
| 第5条 HitL | - | ❌ 未実装 | - |
| 第6条 例外処理義務 | TS-LOG-003, TS-LOG-004 | ✅ 検知あり | ⚠️ 準・安全 |
| 第6.1条 空catch禁止 | TS-LOG-004, PY-LOG-001 | ✅ 検知あり | ✅ 安全修正 |
| 第6.2条 Python例外統治 | PY-LOG-001, PY-LOG-002 | ✅ 検知あり | ⚠️ 準・安全 |
| 第6.3条 console禁止 | TS-PHY-001, PY-PHY-001 | ✅ 検知あり | ✅ 安全修正 |
| 第7条 生fetch禁止 | TS-LOG-001, N8N-PHY-002 | ✅ 検知あり | ❌ |

---

## 📜 詳細対応表

### 第2章: 認証と認可

#### 第4条（Auth-Gate必須）

> 全てのWebhookエンドポイントは、受信直後にAuth-Gateを通過しなければならない。

| 言語 | 監査ルール | 深刻度 | 検知方法 |
|------|-----------|--------|----------|
| TypeScript | `TS-DIM-003` | CRITICAL | /api/ パスでgetServerSession, verifyToken, authenticateの有無を確認 |
| n8n | `N8N-STR-001` | CRITICAL | Webhook直後のノードが認証ノードかを構造解析 |
| n8n | `N8N-DIM-003` | CRITICAL | HMAC, Auth-Gate キーワードの有無を確認 |

**自動修正**: 不可（設計判断が必要）

---

#### 第4.5条（環境二重性の禁止）【大逆罪】

> `process.env.VARIABLE` の直接参照を禁止

| 言語 | 監査ルール | 深刻度 | 検知パターン |
|------|-----------|--------|--------------|
| TypeScript | `TS-PHY-002` | CRITICAL | `/process\.env\.\w+/g` |
| Python | `PY-PHY-002` | ERROR | `/os\.getenv\s*\(|os\.environ\[/g` |
| n8n | `N8N-PHY-001` | CRITICAL | `/process\.env\./g` |

**自動修正**: 準・安全（固定マッピングのみ）
- `process.env.SUPABASE_URL` → `fetchSecret('SUPABASE_URL')`
- マッピングにないキーは手動修正が必要

---

### 第3章: エラーハンドリング

#### 第6条（例外処理の義務）

> 全ての非同期処理は `try-catch` で囲まなければならない。

| 言語 | 監査ルール | 深刻度 | 検知方法 |
|------|-----------|--------|----------|
| TypeScript | `TS-LOG-003` | ERROR | async関数内にawaitがあるがtry-catchがない |

**自動修正**: 不可（catch内の処理は設計判断が必要）

---

#### 第6.1条（空catch禁止）【大逆罪】

> `try { ... } catch (e) { }` や `console.log(e)` のみは大逆罪

| 言語 | 監査ルール | 深刻度 | 検知パターン |
|------|-----------|--------|--------------|
| TypeScript | `TS-LOG-004` | ERROR | `/catch\s*\(\s*\w*\s*\)\s*\{\s*\}/` (空catch) |
| TypeScript | `TS-LOG-004` | ERROR | `/catch\s*\([^)]*\)\s*\{\s*console\.(log|error)\([^)]*\)\s*;?\s*\}/` |
| Python | `PY-LOG-001` | CRITICAL | `/except\s*:\s*\n\s*(pass|\.\.\.)\s*\n/` |
| Python | `PY-LOG-002` | ERROR | `/except[^:]*:\s*\n\s*print\s*\([^)]*\)\s*\n/` |

**自動修正**: 安全修正可能
- 空catchに `imperialLogger.error()` を追加
- `console.log(e)` を `imperialLogger.error()` に置換

---

#### 第6.3条（console禁止）【永久追放】

> `console.log`, `console.debug`, `console.info` は永久追放

| 言語 | 監査ルール | 深刻度 | 検知パターン |
|------|-----------|--------|--------------|
| TypeScript | `TS-PHY-001` | WARNING | `/console\.(log|debug|info)\s*\(/g` |
| Python | `PY-PHY-001` | WARNING | `/\bprint\s*\(/g` |

**自動修正**: 安全修正可能
- 削除（デバッグ用の場合）
- `imperialLogger.debug()` に置換（ログ目的の場合）

---

### 第4章: API通信

#### 第7条（生fetch禁止）

> `fetch()` の直接使用を禁止。`imperialSafeDispatch` を経由すべき。

| 言語 | 監査ルール | 深刻度 | 検知方法 |
|------|-----------|--------|----------|
| TypeScript | `TS-LOG-001` | ERROR | fetch()があるがimperialSafeDispatch/safeFetch/apiClientがない |
| n8n | `N8N-PHY-002` | WARNING | `/await\s+fetch\s*\(/g` |
| Python | `PY-LOG-004` | ERROR | requests.get/postがあるが.raise_for_status()/.status_codeがない |

**自動修正**: 不可（リトライ/タイムアウト設定は設計判断が必要）

---

## 🔒 セキュリティルール

### APIキーの露出

| 言語 | 監査ルール | 深刻度 | 検知パターン |
|------|-----------|--------|--------------|
| TypeScript | `TS-PHY-005` | CRITICAL | `/(?:api[_-]?key|secret|password|token)\s*[:=]\s*['"\`][A-Za-z0-9_\-]{16,}['"\`]/gi` |
| Python | `PY-PHY-003` | CRITICAL | `/(?:password|secret|api_key|token)\s*=\s*['"][^'"]{8,}['"]/gi` |
| n8n | `N8N-PHY-003` | CRITICAL | `/['"\`][\w-]*(secret|password)[\w-]*['"\`]/gi` |

---

### XSS / SQLインジェクション対策

| 言語 | 監査ルール | 深刻度 | 検知方法 |
|------|-----------|--------|----------|
| Python | `PY-PHY-006` | CRITICAL | `/execute\s*\(\s*f['"]|execute\s*\([^)]*%\s*\(/g` (SQLインジェクション) |
| Python | `PY-PHY-004` | CRITICAL | `/\beval\s*\(/g` |
| Python | `PY-PHY-005` | CRITICAL | `/\bexec\s*\(/g` |
| n8n | `N8N-PHY-004` | CRITICAL | `/VALUES\s*\([^)]*\{\{/g` (SQLテンプレートインジェクション) |

---

## 🏗️ 保守性ルール

### 関数の行数制限

> 現在未実装。将来的に `TS-MTN-001` として追加予定。

### any型の禁止

| 言語 | 監査ルール | 深刻度 | 検知パターン |
|------|-----------|--------|--------------|
| TypeScript | `TS-PHY-006` | WARNING | `/:\s*any\b|as\s+any\b/g` |

---

## 📁 構造ルール

### ファイル配置ルール

> 現在は stray-scanner-v2.js で検知
> - `app/`, `lib/`, `components/`, `hooks/` は帝国公認ディレクトリ
> - `.bak`, `.backup`, `.old`, `.tmp` は野良ファイル

### 命名規則

> 現在未実装。将来的に追加予定。

---

## 📈 27次元チェック

| 次元 | 内容 | TypeScript | Python | n8n |
|------|------|------------|--------|-----|
| 3 | Auth-Gate | TS-DIM-003 | - | N8N-DIM-003 |
| 22 | Burn Limit | TS-DIM-022 | PY-DIM-022 | N8N-DIM-022 |
| 27 | 通知 | TS-DIM-027 | - | N8N-DIM-027 |

---

## 🛠️ 未実装ルール（今後の拡張予定）

| 法典条文 | 内容 | ステータス |
|----------|------|------------|
| 第5条 HitL | 50,000円以上の取引に人間承認必須 | 📋 設計中 |
| - | 関数行数制限（100行以上でWARNING） | 📋 設計中 |
| - | ファイル命名規則チェック | 📋 設計中 |
| - | import順序チェック | 📋 設計中 |

---

## 📊 自動修正分類

| 分類 | 説明 | 対象ルール |
|------|------|------------|
| ✅ 安全修正 | 副作用なしで自動適用可能 | TS-PHY-001, PY-PHY-001, 空catch |
| ⚠️ 準・安全修正 | 固定マッピングのみ自動適用 | TS-PHY-002（一部） |
| ❌ 手動修正 | 設計判断が必要 | Auth-Gate, 生fetch, try-catch追加 |

---

*最終更新: 2026-02-05*
*N3 Empire - Law Enforcement Division*
