// lib/actions/imperial-fetch.ts
/**
 * N3 Empire OS - 27次元セキュリティ商用規格
 * 署名付きServer Action（通信の要石）
 * すべての外部通信はこのファイルを経由する
 */

"use server";

import crypto from "crypto";
import { 
  StandardPayload, 
  ImperialResponse, 
  validatePayload,
} from "@/lib/contracts/protocol";
import { imperialErrorLog } from "@/lib/shared/imperial-logger";

const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";
const MASTER_KEY = process.env.MASTER_KEY || "dev-key-change-in-production";

function generateSignature(payload: StandardPayload): string {
  const message = JSON.stringify(payload);
  return crypto.createHmac("sha256", MASTER_KEY).update(message).digest("hex");
}

/**
 * 署名付きでn8nへリクエストを送信
 * すべてのツールはこの関数を経由して外部通信を行う
 */
export async function imperialSafeDispatch(
  payload: StandardPayload
): Promise<ImperialResponse> {
  const startTime = Date.now();
  
  try {
    const validatedPayload = validatePayload(payload);
    const signature = generateSignature(validatedPayload);
    const endpoint = `${N8N_BASE_URL}/webhook/${validatedPayload.toolId}/${validatedPayload.action}`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-imperial-signature": signature,
        "x-trace-id": validatedPayload.trace_id,
        "x-timestamp": String(validatedPayload.timestamp),
      },
      body: JSON.stringify(validatedPayload),
      signal: AbortSignal.timeout(30000),
    });

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

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await imperialErrorLog("Imperial Dispatch Error", errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      trace_id: payload.trace_id,
      timestamp: Date.now(),
      duration_ms: Date.now() - startTime,
    };
  }
}

/**
 * Supabaseへの直接操作が必要な場合のラッパー
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    await imperialErrorLog("Imperial Direct Action Error", errorMessage);
    
    return {
      success: false,
      error: errorMessage,
      trace_id,
      timestamp: Date.now(),
      duration_ms: Date.now() - startTime,
    };
  }
}

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
