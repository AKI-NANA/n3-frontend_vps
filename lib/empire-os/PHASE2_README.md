# N3 Empire OS V8 Phase 2: 守護神ノード

## 📋 概要

Phase 2では、n8nワークフローの「不沈艦・標準テンプレート」となる3つの守護神コンポーネントを実装しました。

1. **Identity-Manager**: ブラウザプロファイル・プロキシ・指紋管理
2. **Policy-Validator**: robots.txt/ToS違反/法的リスク検知
3. **Human-in-the-Loop (HitL)**: 承認キューシステム

---

## 🗃️ 新規DBスキーマ

### テーブル一覧

| スキーマ.テーブル名 | 用途 |
|---|---|
| `core.browser_profiles` | ブラウザプロファイル（プロキシ、UA、指紋） |
| `core.policy_rules` | ポリシールール定義 |
| `core.policy_violations` | 違反検知ログ |
| `core.user_actions` | HitL承認キュー |
| `core.robots_cache` | robots.txtキャッシュ |

### マイグレーション実行

```sql
-- Supabase SQL Editorで実行
\i /path/to/lib/empire-os/phase2-guardian-schema.sql
```

---

## 🛡️ 1. Identity-Manager

テナント別のブラウザプロファイル（プロキシ、User-Agent、指紋）を管理し、BAN回避を実現。

### 機能

- **プロキシ管理**: Residential/Datacenter/Mobile プロキシの設定
- **ブラウザ指紋**: UA、Accept-Language、WebGL、Canvas Noise等
- **セッション管理**: Cookie永続化、自動リフレッシュ
- **ヘルスチェック**: プロファイルの死活監視

### 使用方法

```typescript
import { generateFingerprintConfig, buildIdentityContext } from '@/lib/empire-os';

// 指紋設定生成
const fingerprint = generateFingerprintConfig('JP', 'desktop');

// Identity Context構築
const identity = await buildIdentityContext(profile, decryptSecret);
```

### n8nテンプレート

```javascript
// ワークフローの先頭に配置
// → N8N_IDENTITY_MANAGER_TEMPLATE を使用
```

---

## 🔒 2. Policy-Validator

コンテンツをポリシールールでチェックし、ToS違反・法的リスクを検知。

### 標準ルール

| ルールコード | カテゴリ | 重大度 | アクション |
|---|---|---|---|
| `TOS_VIOLATION_JA` | ToS違反 | error | stop |
| `TOS_VIOLATION_EN` | ToS違反 | error | stop |
| `LEGAL_ADVICE` | 法的リスク | warning | flag |
| `MEDICAL_ADVICE` | 法的リスク | error | stop |
| `PII_LEAK` | コンテンツ安全 | warning | flag |

### 使用方法

```typescript
import { validateContent, SYSTEM_RULES } from '@/lib/empire-os';

const result = validateContent(content, SYSTEM_RULES, {
  platform: 'youtube',
  region: 'JP',
});

if (!result.passed) {
  console.log('Violations:', result.violations);
}
```

### robots.txtチェック

```typescript
import { checkRobotsTxt } from '@/lib/empire-os';

const robotsResult = await checkRobotsTxt('https://example.com/api/data');
if (!robotsResult.allowed) {
  console.log('Disallowed by robots.txt');
}
```

---

## 👤 3. Human-in-the-Loop (HitL)

n8n Waitノードと連携し、人間による承認フローを実現。

### フロー

```
n8n Workflow
    ↓
承認リクエスト作成 (create_pending_action)
    ↓
ChatWork通知送信
    ↓
n8n Waitノードで待機
    ↓
ユーザーがリンククリック (/api/hitl/approve/ACT_xxx)
    ↓
コールバックでn8n再開
    ↓
処理続行
```

### APIエンドポイント

| エンドポイント | メソッド | 説明 |
|---|---|---|
| `/api/hitl/approve/[actionCode]` | GET/POST | 承認 |
| `/api/hitl/reject/[actionCode]` | GET/POST | 拒否 |
| `/api/hitl/pending` | GET | 承認待ち一覧 |
| `/api/hitl/pending` | POST | 一括承認/拒否 |

### 使用方法

```typescript
import { createApprovalRequest, processDecision } from '@/lib/empire-os';

// 承認リクエスト作成
const response = await createApprovalRequest({
  tenant_id: '0',
  action_type: 'publish_listing',
  target_type: 'product',
  target_id: '123',
  target_title: 'Sample Product',
  request_reason: 'Policy violation detected',
}, supabase);

// 承認URL: /api/hitl/approve/{action_code}
// 拒否URL: /api/hitl/reject/{action_code}
```

---

## 🔧 n8nテンプレート一覧

### 利用可能なテンプレート

| テンプレート名 | ファイル | 用途 |
|---|---|---|
| `N8N_IDENTITY_MANAGER_TEMPLATE` | identity-manager.ts | プロファイル取得 |
| `N8N_IDENTITY_HTTP_WRAPPER_TEMPLATE` | identity-manager.ts | HTTPリクエスト設定 |
| `N8N_POLICY_VALIDATOR_TEMPLATE` | policy-validator.ts | ポリシーチェック |
| `N8N_ROBOTS_CHECK_TEMPLATE` | policy-validator.ts | robots.txtチェック |
| `N8N_CREATE_APPROVAL_TEMPLATE` | human-in-the-loop.ts | 承認リクエスト作成 |
| `N8N_WAIT_FOR_APPROVAL_TEMPLATE` | human-in-the-loop.ts | Wait設定 |
| `N8N_PROCESS_APPROVAL_RESULT_TEMPLATE` | human-in-the-loop.ts | 結果処理 |
| `N8N_APPROVAL_BRANCH_TEMPLATE` | human-in-the-loop.ts | 承認分岐 |

### インポート方法

```typescript
import EmpireOS from '@/lib/empire-os';

// テンプレート取得
const template = EmpireOS.templates.policyValidator;
```

---

## 🚀 統合パイプライン

3つのコンポーネントを統合した `guardianPipeline` 関数を提供。

```typescript
import { guardianPipeline } from '@/lib/empire-os';

const result = await guardianPipeline(
  async () => {
    // 実行したい処理
    return await publishToEbay(product);
  },
  {
    tenant_id: '0',
    target_platform: 'ebay',
    content: product.description,
    action_type: 'publish_listing',
    target_title: product.title,
    require_approval: false, // Policy違反時のみ自動で承認要求
    supabase: supabaseClient,
  }
);

if (result.success) {
  console.log('Published:', result.data);
} else if (result.hitl_result?.required) {
  console.log('Waiting for approval:', result.hitl_result.action_code);
} else {
  console.log('Error:', result.error);
}
```

---

## 📝 次のステップ

1. [ ] Supabaseでスキーマ実行 (`phase2-guardian-schema.sql`)
2. [ ] n8nで標準テンプレートをインポート
3. [ ] 既存152ワークフローへの守護神ノード組み込み
4. [ ] ChatWork通知設定
5. [ ] 承認待ちダッシュボードUI作成

---

## 📁 ファイル構成

```
lib/empire-os/
├── index.ts                    # エントリーポイント（更新）
├── schema.sql                  # Phase 1 スキーマ
├── phase2-guardian-schema.sql  # Phase 2 スキーマ（新規）
├── identity-manager.ts         # Identity Manager（新規）
├── policy-validator.ts         # Policy Validator（新規）
├── human-in-the-loop.ts        # HitL（新規）
├── auth-gate.ts
├── self-repair.ts
└── ui-config-master.ts

app/api/hitl/
├── approve/[actionCode]/route.ts  # 承認API（新規）
├── reject/[actionCode]/route.ts   # 拒否API（新規）
└── pending/route.ts               # 承認待ち一覧API（新規）
```
