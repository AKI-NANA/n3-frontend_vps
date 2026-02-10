// lib/actions/imperial-fetch.ts
/**
 * N3 Empire OS - 27次元セキュリティ商用規格
 * 署名付きServer Action（通信の要石）
 * 
 * すべての外部通信はこのファイルを経由する
 */

"use server";

import crypto from "crypto";
import { 
  StandardPayload, 
  ImperialResponse, 
  validatePayload,
  StandardPayloadSchema 
} from "@/lib/contracts/protocol";

// ============================================================
// 環境変数
// ============================================================

const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const MASTER_KEY = process.env.MASTER_KEY || "dev-key-change-in-production";

// ============================================================
// 署名生成
// ============================================================

function generateSignature(payload: StandardPayload): string {
  const message = JSON.stringify(payload);
  return crypto
    .createHmac("sha256", MASTER_KEY)
    .update(message)
    .digest("hex");
}

// ============================================================
// メイン関数: imperialSafeDispatch
// ============================================================

/**
 * 署名付きでn8nへリクエストを送信
 * すべてのツールはこの関数を経由して外部通信を行う
 */
export async function imperialSafeDispatch(
  payload: StandardPayload
): Promise<ImperialResponse> {
  const startTime = Date.now();
  
  try {
    // 1. ペイロードのバリデーション
    const validatedPayload = validatePayload(payload);
    
    // 2. 署名生成
    const signature = generateSignature(validatedPayload);
    
    // 3. エンドポイント決定
    const endpoint = `${N8N_BASE_URL}/webhook/${validatedPayload.toolId}/${validatedPayload.action}`;
    
    // 4. リクエスト送信
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-imperial-signature": signature,
        "x-trace-id": validatedPayload.trace_id,
        "x-timestamp": String(validatedPayload.timestamp),
      },
      body: JSON.stringify(validatedPayload),
      // タイムアウト設定（30秒）
      signal: AbortSignal.timeout(30000),
    });

    // 5. レスポンス処理
    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
        trace_id: validatedPayload.trace_id,
        timestamp: Date.now(),
        duration_ms: Date.now() - startTime,
      };
    }

    const data = await response.json();
    
    return {
      success: true,
      data,
      trace_id: validatedPayload.trace_id,
      timestamp: Date.now(),
      duration_ms: Date.now() - startTime,
    };

  } catch (error: any) {
    console.error("[Imperial Dispatch Error]", error);
    
    return {
      success: false,
      error: error.message || "Unknown error",
      trace_id: payload.trace_id,
      timestamp: Date.now(),
      duration_ms: Date.now() - startTime,
    };
  }
}

// ============================================================
// 簡易版: Supabase直接操作用（n8n不要の場合）
// ============================================================

/**
 * Supabaseへの直接操作が必要な場合のラッパー
 * n8nを経由せず、直接DBを操作する場合に使用
 */
export async function imperialDirectAction<T>(
  action: () => Promise<T>,
  traceId?: string
): Promise<ImperialResponse> {
  const startTime = Date.now();
  const trace_id = traceId || crypto.randomUUID();
  
  try {
    const result = await action();
    
    return {
      success: true,
      data: result,
      trace_id,
      timestamp: Date.now(),
      duration_ms: Date.now() - startTime,
    };
  } catch (error: any) {
    console.error("[Imperial Direct Action Error]", error);
    
    return {
      success: false,
      error: error.message || "Unknown error",
      trace_id,
      timestamp: Date.now(),
      duration_ms: Date.now() - startTime,
    };
  }
}

// ============================================================
// バリデーション付きペイロード作成（クライアント用エクスポート）
// ============================================================

/**
 * クライアントサイドでペイロードを作成するためのヘルパー
 * Server Actionとして呼び出し可能
 */
export async function createSecurePayload(
  toolId: string,
  action: string,
  params: { targets?: string[]; config?: Record<string, unknown> } = {}
): Promise<StandardPayload> {
  return {
    toolId,
    action,
    params: {
      targets: params.targets || [],
      config: params.config || {},
    },
    trace_id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
}
