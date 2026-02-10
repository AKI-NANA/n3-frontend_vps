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

export function validatePayload(data: unknown): StandardPayload {
  return StandardPayloadSchema.parse(data);
}

export function safeValidatePayload(data: unknown): StandardPayload | null {
  const result = StandardPayloadSchema.safeParse(data);
  return result.success ? result.data : null;
}
