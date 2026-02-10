

---

# SYSTEM SNAPSHOT (2026/2/3 20:19:47)
## Environment: Node v22.15.0 / Next.js ^15.1.0
## Current Contracts (protocol.ts):
```typescript
// lib/contracts/protocol.ts
/**
 * N3 Empire OS - 27次元セキュリティ商用規格
 * 通信プロトコル型定義 + Zodスキーマ
 */

import { z } from 'zod';

// ============================================================
// StandardPayload - 全通信の標準フォーマット
// ============================================================

export const StandardPayloadSchema = z.object({
  toolId: z.string().min(1, 'toolId is required'),
  action: z.string().min(1, 'action is required'),
  params: z.object({
    targets: z.array(z.string()).default([]),
    config: z.record(z.unknown()).default({})
  }),
  trace_id: z.string().uuid(),
  timestamp: z.number().int().positive()
});

export type StandardPayload = z.infer<typeof StandardPayloadSchema>;

// ============================================================
// ImperialResponse - Server Actionからの標準レスポンス
// ============================================================

export const ImperialResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  trace_id: z.string().uuid(),
  timestamp: z.number().int().positive(),
  duration_ms: z.number().optional()
});

export type ImperialResponse = z.infer<typeof ImperialResponseSchema>;

// ============================================================
// ツール別アクション定義
// ============================================================

export const TOOL_ACTIONS = {
  'agent-control': ['list', 'toggle', 'update-config', 'execute'] as const,
  'cron-management': ['list', 'create', 'update', 'delete', 'execute', 'toggle'] as const,
  'execution-dashboard': ['list-logs', 'list-queue', 'retry', 'cancel'] as const,
  'hitl-dashboard': ['list', 'approve', 'reject'] as const,
} as const;

export type ToolId = keyof typeof TOOL_ACTIONS;
export type ToolAction<T extends ToolId> = typeof TOOL_ACTIONS[T][number];

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * StandardPayloadを生成するヘルパー
 */
export function createPayload(
  toolId: string,
  action: string,
  params: { targets?: string[]; config?: Record<string, unknown> } = {}
): StandardPayload {
  return {
    toolId,
    action,
    params: {
      targets: params.targets || [],
      config: params.config || {}
    },
    trace_id: crypto.randomUUID(),
    timestamp: Date.now()
  };
}

/**
 * Zodバリデーション実行
 */
export function validatePayload(data: unknown): StandardPayload {
  return StandardPayloadSchema.parse(data);
}

/**
 * 安全なバリデーション（エラー時はnull）
 */
export function safeValidatePayload(data: unknown): StandardPayload | null {
  const result = StandardPayloadSchema.safeParse(data);
  return result.success ? result.data : null;
}

```
## Git Modified:
?? app/tools/agent-control/
?? app/tools/cron-management/
?? app/tools/execution-dashboard/
?? app/tools/hitl-dashboard/
?? governance/
?? lib/actions/
?? lib/contracts/


---
# MISSION
# MISSION: Phase 2 Tools Security Hardening
現在ルートディレクトリに統合されている以下のツールを「27次元セキュリティ商用規格」に適合させよ。

## 対象ツール
- app/tools/agent-control/page.tsx
- app/tools/cron-management/page.tsx
- app/tools/execution-dashboard/page.tsx
- app/tools/hitl-dashboard/page.tsx

## 修正要件
1. **通信の要塞化**: 
   - 直接の `fetch` を廃止し、`lib/actions/imperial-fetch.ts` (Server Action) を経由した通信に切り替えよ。
   - `StandardPayload` (toolId, action, params) 形式を厳守せよ。
2. **秘密情報の隠蔽**:
   - ハードコードされたIPアドレスやAPIキーがあれば、環境変数参照へ置き換えよ。
3. **UIの不可侵**:
   - JSXの構造、CSS、Tailwindのクラス名は1文字も変更してはならない。ロジックの「配線」のみを最新化せよ。

## 完了定義
- 全ての通信が署名付き Server Action 経由になっていること。
- 型定義（Zod）に矛盾がないこと。

## 基盤ファイル（既に作成済み）
- `lib/contracts/protocol.ts` - StandardPayload型定義 + Zodスキーマ
- `lib/actions/imperial-fetch.ts` - 署名付きServer Action

---
## OUTPUT RULE
修正後のファイルを必ず以下の形式で出力せよ。
===FILE_START===path: [パス]
[コード]
===FILE_END===
UIの構造は絶対に変更せず、ロジックの要塞化のみを行え。
