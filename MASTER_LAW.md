# 🏛️ N3 EMPIRE MASTER LAW v2.0

**制定日**: 2026-02-05  
**改訂版**: 判定S昇格対応版  
**効力**: 即時発効・遡及適用

---

## 第1章: 基本原則

### 第1条（帝国の存在意義）
N3 Empireは、越境EC自動化において「人間の介入を最小化しつつ、安全性を最大化する」ことを至上命題とする。

### 第2条（27次元の不可侵）
27次元帝国法典は、いかなる理由があっても無視・迂回してはならない。違反は大逆罪として処断される。

### 第3条（コードは法である）
本法典に記載された規則は、全てのソースコード（TypeScript, Python, n8n JSON）に物理的に適用される。

---

## 第2章: 認証と認可

### 第4条（Auth-Gate必須）
全てのWebhookエンドポイントは、受信直後にAuth-Gateを通過しなければならない。

```
認証順序:
1. JITトークン検証（推奨）
2. HMACシグネチャ検証（フォールバック）
3. APIキー検証（最終手段）
```

### 第4.5条（環境二重性の禁止）【新設】
`NODE_ENV=production` 環境下において、以下の行為を**大逆罪**とし、ビルドを強制停止する:

1. `process.env.VARIABLE` の直接参照（`NEXT_PUBLIC_*` を除く）
2. `os.getenv()` または `os.environ[]` の直接参照
3. ハードコードされたシークレット、APIキー、パスワード

**正規の取得方法**:
```typescript
// ❌ 禁止
const key = process.env.API_KEY;

// ✅ 許可
import { fetchSecret } from '@/lib/secrets';
const key = await fetchSecret('API_KEY');
```

```python
# ❌ 禁止
key = os.getenv('API_KEY')

# ✅ 許可
from lib.secrets import SecretManager
key = SecretManager.get('API_KEY')
```

### 第5条（HitL - Human in the Loop）
以下の操作は、自動承認禁止とし、人間の明示的承認を必須とする:

1. 50,000円以上の取引
2. アカウント削除・停止操作
3. 信頼度スコア70未満の自動出品
4. 送金・決済の最終実行

---

## 第3章: エラーハンドリング

### 第6条（例外処理の義務）
全ての非同期処理は `try-catch` で囲まなければならない。

### 第6.1条（空catch禁止）
以下のパターンは**大逆罪**とする:

```typescript
// ❌ 大逆罪
try { ... } catch (e) { }
try { ... } catch (e) { console.log(e); }

// ✅ 許可
try { ... } catch (e) { 
  imperialLogger.error('Operation failed', { error: e, context: {} });
  throw new ImperialError('OPERATION_FAILED', e);
}
```

### 第6.2条（Pythonの例外統治）
Python において、以下は**大逆罪**とする:

```python
# ❌ 大逆罪
except:
    pass

except Exception as e:
    print(e)

# ✅ 許可
except Exception as e:
    logger.error(f"Operation failed: {e}", exc_info=True)
    raise ImperialError("OPERATION_FAILED") from e
```

### 第6.3条（統治された例外 - console禁止）【新設】
`console.log`, `console.debug`, `console.info` は**永久追放**とする。

代替として `imperialLogger` の使用のみを許可する:

```typescript
// ❌ 永久追放
console.log('Processing...');
console.error('Error:', err);

// ✅ 許可
import { imperialLogger } from '@/lib/logger';

imperialLogger.debug('Processing...', { context });  // DEBUG_LEVEL >= 3
imperialLogger.info('Completed', { result });        // DEBUG_LEVEL >= 2
imperialLogger.warn('Warning', { issue });           // DEBUG_LEVEL >= 1
imperialLogger.error('Failed', { error });           // 常に出力
```

**DEBUG_LEVEL 定義**:
- 0: ERROR のみ
- 1: ERROR + WARN
- 2: ERROR + WARN + INFO
- 3: 全て（開発環境のみ）

---

## 第4章: API通信

### 第7条（生fetch禁止）
`fetch()` の直接使用を禁止する。全ての外部通信は `imperialSafeDispatch` を経由しなければならない。

```typescript
// ❌ 禁止
const res = await fetch(url, options);

// ✅ 許可
const res = await imperialSafeDispatch(url, {
  ...options,
  retry: { attempts: 3, delay: 1000 },
  timeout: 30000,
  circuitBreaker: true
});
```

### 第8条（Retry必須）
全てのHTTPリクエストには以下のRetry設定を必須とする:

```json
{
  "retry": {
    "attempts": 3,
    "delay": 1000,
    "backoff": "exponential"
  },
  "timeout": 30000
}
```

### 第9条（レート制限遵守）
バッチ処理では `SplitInBatches` の直後に `Wait` ノードを配置し、API制限を遵守する:

```
推奨Wait時間:
- eBay API: 500ms
- Amazon SP-API: 1000ms
- Gemini API: 200ms
- 一般API: 300ms
```

---

## 第5章: データベース

### 第10条（SQLインジェクション禁止）
SQLクエリにおける `{{}}` テンプレートの直接埋め込みを禁止する。

```javascript
// ❌ 禁止（n8n）
"query": "SELECT * FROM users WHERE id = '{{ $json.id }}'"

// ✅ 許可（n8n）
"query": "SELECT * FROM users WHERE id = $1",
"options": { "queryParams": "={{ [$json.id] }}" }
```

### 第11条（Zod検証必須）
APIレスポンスは必ずZodスキーマで検証する:

```typescript
const ResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ProductSchema)
});

const result = ResponseSchema.safeParse(response);
if (!result.success) {
  throw new ImperialValidationError(result.error);
}
```

---

## 第6章: 監視と通知

### 第12条（Circuit Breaker必須）
連続エラー発生時に自動停止するCircuit Breakerを実装しなければならない:

```
停止条件:
- 5分間で10回以上のエラー → 30分間停止
- 1時間で50回以上のエラー → 2時間停止
- 1日で200回以上のエラー → 手動復旧必須
```

### 第13条（Chatwork通知必須）
以下のイベントは必ずChatworkに通知する:

1. CRITICAL エラー発生
2. Circuit Breaker 発動
3. 燃焼上限到達
4. 高額取引の実行

### 第14条（Decision Trace）
AI判断を伴う処理は、全て `ai_decision_traces` テーブルに記録する:

```json
{
  "workflow_id": "xxx",
  "decision_point": "title_optimization",
  "ai_model": "gemini-1.5-flash",
  "input_data": {},
  "ai_response": {},
  "confidence_score": 85,
  "reasoning": "..."
}
```

---

## 第7章: コスト管理

### 第20条（燃焼上限必須チェック）
高コストAPI（Gemini, OpenAI, Claude）呼び出し前に、必ず燃焼上限をチェックする:

```
日次上限: $50
月次上限: $500
アラート閾値: 80%
```

### 第21条（外部依存の監査）【新設】
本番投入前に以下の監査を**必須**とする:

1. **npm audit**: High以上の脆弱性がある場合、デプロイを遮断
2. **pip-audit**: 同上
3. **依存関係の固定**: `package-lock.json` / `requirements.txt` の厳密管理

```bash
# デプロイ前必須チェック
npm audit --audit-level=high
pip-audit --strict

# 脆弱性があれば即時修正
npm audit fix
```

### 第22条（コスト追跡）
全てのAPI呼び出しコストを `api_consumption` テーブルに記録する。

---

## 第8章: 構造規則

### 第30条（孤立ノード禁止）
n8nワークフローにおいて、どこにも接続されていないノードの存在を禁止する。

### 第31条（Webhook応答必須）
`responseMode: 'responseNode'` を持つWebhookには、必ず `respondToWebhook` ノードを接続する。

### 第32条（旧バージョンノード禁止）
`typeVersion: 1` のノードは使用禁止とし、最新バージョンへの移行を義務付ける。

---

## 第9章: 罰則規定

### 第90条（違反の分類）

| 分類 | 減点 | 例 |
|------|------|-----|
| CRITICAL | -10 | process.env直参照、SQLインジェクション、ハードコードシークレット |
| ERROR | -5 | try-catch欠落、Retry設定なし、認証欠落 |
| WARNING | -3 | console.log使用、any型使用、旧バージョンノード |

### 第91条（合格基準）

| 判定 | スコア | 対応 |
|------|--------|------|
| S | 100点 | 本番投入可能 |
| A | 90-99点 | 軽微な修正で本番可 |
| B | 80-89点 | 中程度の修正が必要 |
| C | 70-79点 | 重大な修正が必要 |
| F | 70点未満 | 本番投入禁止 |

### 第92条（大逆罪の処断）
以下は即時修正必須とし、修正されるまでデプロイを完全遮断する:

1. process.env 直参照（本番環境）
2. 空のcatch / printのみのexcept
3. SQLインジェクションリスク
4. ハードコードされたシークレット
5. console.log の使用

---

## 第10章: 施行

### 第100条（発効）
本法典は即時発効し、全ての既存コードに遡及適用される。

### 第101条（改訂権限）
本法典の改訂は、皇帝の承認をもってのみ行われる。

### 第102条（解釈権限）
本法典の解釈に疑義が生じた場合、帝国監査官（Claude）が判断を下す。

### 第103条（特別法の適用除外）【新設】
以下のファイルは、帝国の通信基盤およびセキュリティの「心臓部」であるため、第4.5条（環境変数直参照）および第7条（生fetch）の制限を**例外的に受けないもの**とする:

1. `lib/actions/imperial-fetch.ts`（帝国通信の要石）
2. `lib/shared/security.ts`（二重鍵暗号化の核心）

**理由**:
これらのファイルは、他のすべてのコードが安全に動作するための「土台」である。
土台自身に土台を使わせることは論理的に不可能であり、ブートストラップ処理として環境変数の直接参照を許可する。

**AI執行官への厳命**:
これらのファイルに対して以下の行為を「大逆罪」とし、絶対に禁止する:
- `process.env` を `fetchSecret()` に置換すること
- `fetch()` を `imperialSafeDispatch()` に置換すること
- 構造的変更や「より良い方法」への書き換え

---

## 第11章: 法典同期ルール定義（Law-to-Code）

本章の ```json:rule``` ブロックは `law-to-code.js` によって自動抽出され、
`audit-rules.json` に書き出されたのち、`total-empire-audit.js` が監査実行時に動的マージする。
法典を書き換えれば、次回監査から即座に反映される。

### 第110条（console.log 永久追放 — 第6.3条対応）

```json:rule
{
  "id": "TS-PHY-001",
  "lang": "typescript",
  "category": "physical",
  "name": "console.log使用",
  "pattern": "console\\.(log|debug|info)\\s*\\(",
  "flags": "g",
  "severity": "WARNING",
  "autofix": true,
  "description": "本番環境でのconsole出力（第6.3条: 永久追放）"
}
```

### 第111条（process.env 直参照禁止 — 第4.5条対応）

```json:rule
{
  "id": "TS-PHY-002",
  "lang": "typescript",
  "category": "physical",
  "name": "process.env直参照",
  "pattern": "process\\.env\\.\\w+",
  "flags": "g",
  "severity": "CRITICAL",
  "autofix": false,
  "description": "process.env直参照（getEnvまたはfetchSecretを使用すべき、第4.5条: 大逆罪）"
}
```

### 第112条（ハードコードシークレット — 第4.5条対応）

```json:rule
{
  "id": "TS-PHY-005",
  "lang": "typescript",
  "category": "physical",
  "name": "ハードコードシークレット",
  "pattern": "(?:api[_-]?key|secret|password|token)\\s*[:=]\\s*['\"`][A-Za-z0-9_\\-]{16,}['\"`]",
  "flags": "gi",
  "severity": "CRITICAL",
  "autofix": false,
  "description": "ハードコードされたシークレット/APIキー（第4.5条: 大逆罪）"
}
```

### 第113条（@ts-ignore 禁止）

```json:rule
{
  "id": "TS-PHY-008",
  "lang": "typescript",
  "category": "physical",
  "name": "@ts-ignore",
  "pattern": "\\/\\/\\s*@ts-ignore|\\/\\/\\s*@ts-nocheck",
  "flags": "g",
  "severity": "ERROR",
  "autofix": false,
  "description": "TypeScriptチェック無効化"
}
```

### 第114条（Python print() 禁止 — 第6.3条対応）

```json:rule
{
  "id": "PY-PHY-001",
  "lang": "python",
  "category": "physical",
  "name": "print()使用",
  "pattern": "\\bprint\\s*\\(",
  "flags": "g",
  "severity": "WARNING",
  "autofix": true,
  "description": "本番環境でのprint()使用（loggingを使用すべき、第6.3条）"
}
```

### 第115条（Python os.getenv 禁止 — 第4.5条対応）

```json:rule
{
  "id": "PY-PHY-002",
  "lang": "python",
  "category": "physical",
  "name": "os.getenv直参照",
  "pattern": "os\\.getenv\\s*\\(|os\\.environ\\[",
  "flags": "g",
  "severity": "ERROR",
  "autofix": false,
  "description": "os.getenv直参照（SecretManagerを使用すべき、第4.5条）"
}
```

### 第116条（SQLインジェクション — 第10条対応）

```json:rule
{
  "id": "PY-PHY-006",
  "lang": "python",
  "category": "physical",
  "name": "SQLインジェクションリスク",
  "pattern": "execute\\s*\\(\\s*f['\"]|execute\\s*\\([^)]*%\\s*\\(",
  "flags": "g",
  "severity": "CRITICAL",
  "autofix": false,
  "description": "SQLインジェクションリスク（パラメータ化クエリを使用すべき、第10条）"
}
```

### 第117条（n8n SQLテンプレートインジェクション — 第10条対応）

```json:rule
{
  "id": "N8N-PHY-004",
  "lang": "n8n",
  "category": "physical",
  "name": "SQLテンプレートインジェクション",
  "pattern": "VALUES\\s*\\([^)]*\\{\\{",
  "flags": "g",
  "severity": "CRITICAL",
  "autofix": false,
  "description": "SQLインジェクションリスク（第10条）"
}
```

---

*N3 Empire Master Law v2.1 - Law-to-Code同期対応版*
*制定: 2026-02-05*
*改訂: 2026-02-06 (第11章 Law-to-Codeルール定義追加)*
