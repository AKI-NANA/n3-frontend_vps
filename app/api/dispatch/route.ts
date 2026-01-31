// app/api/dispatch/route.ts
/**
 * 🚀 Dispatch API - Hub統合エンドポイント
 * 
 * 全ツール実行の統一エントリーポイント
 * 
 * Phase D-Core: 運用耐性レイヤー統合
 * - Kill Switch チェック
 * - 同時実行制限
 * - 実行モードガード
 * - 監査ログ記録
 * - Admin権限チェック（高リスク操作）
 * 
 * @usage POST /api/dispatch
 * @body { toolId: string, action: string, params: object }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { 
  checkDispatchRateLimit, 
  checkDispatchJobGuard, 
  registerDispatchJob,
  releaseDispatchJob,
} from '@/lib/guards';
import {
  checkKillSwitch,
  KillSwitchActiveError,
} from '@/lib/guards/kill-switch';
import {
  acquireJobLock,
  releaseJobLock,
  ConcurrencyLimitError,
} from '@/lib/guards/concurrency-guard';
import {
  checkN8nExecution,
  ExecutionModeError,
  getExecutionModeInfo,
} from '@/lib/guards/execution-mode';
import {
  logDispatchStart,
  logDispatchComplete,
} from '@/lib/guards/audit-log';
import {
  getCurrentUserFromRequest,
} from '@/lib/guards/admin-guard';
import { TOOL_DEFINITIONS } from '@/components/n3/empire/tool-definitions';

// ============================================================
// Phase A-1: TOOL_DEFINITIONS から自動生成
// ============================================================

const TOOL_WEBHOOK_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(TOOL_DEFINITIONS).map(([toolId, config]) => [
    toolId,
    config.webhookPath
  ])
);

// レガシーtoolId → 新toolId マイグレーション（後方互換用）
const TOOL_ID_MIGRATION: Record<string, string> = {
  'researchAgent': 'research-agent',
  'amazonResearch': 'amazon-research-bulk',
  'trendAgent': 'trend-agent',
  'listingLocal': 'listing-local',
  'stockKiller': 'stock-killer',
  'mediaVideoGen': 'media-video-gen',
  'mediaAudioGen': 'media-audio-gen',
  'ddpCalculate': 'ddp-calculate',
  'amazon_research_bulk': 'amazon-research-bulk',
  'amazon_price_tracker': 'amazon-price-tracker',
  'amazon_competitor_scan': 'amazon-competitor-scan',
  'keepa_sync': 'keepa-sync',
  'listing-ebay-create': 'listing-local',
  'research-gpt-analyze': 'research-agent',
  'research-amazon-search': 'amazon-research-bulk',
  'research-trend-analyze': 'trend-agent',
  'inventory-stock-sync': 'stock-killer',
  'media-video-generate': 'media-video-gen',
  'media-audio-generate': 'media-audio-gen',
  'finance-ddp-calculate': 'ddp-calculate',
};

// ============================================================
// 型定義
// ============================================================

interface DispatchRequest {
  toolId: string;
  action: string;
  params: Record<string, any>;
  metadata?: {
    userId?: string;
    organizationId?: string;
    source?: string;
  };
  options?: {
    timeout?: number;
    priority?: number;
    skipGuards?: boolean;
  };
  // Phase D-Core: ガードスキップフラグ
  skipKillSwitchCheck?: boolean;
  skipConcurrencyCheck?: boolean;
}

// ============================================================
// ジョブタイプ抽出
// ============================================================

function extractJobType(toolId: string): string {
  // toolId からジョブタイプを抽出
  // 例: 'listing-ebay-create' -> 'listing'
  //     'inventory-sync-all' -> 'inventory'
  const parts = toolId.split('-');
  return parts[0] || 'default';
}

// ============================================================
// Job必要判定パターン
// ============================================================

const REQUIRES_JOB_PATTERNS = [
  /^research-/,
  /^amazon-/,
  /^media-video-/,
  /^media-audio-/,
  /^inventory-.*-sync$/,
  /^stock-/,
  /^.*-batch$/,
  /^.*-bulk$/,
  /^keepa-/,
  /^trend-/,
  /^arbitrage-/,
];

function requiresJob(toolId: string): boolean {
  return REQUIRES_JOB_PATTERNS.some(pattern => pattern.test(toolId));
}

// ============================================================
// Supabaseクライアント
// ============================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// HMAC署名生成
// ============================================================

function generateHmacSignature(payload: string): string {
  const secret = process.env.N8N_WEBHOOK_SECRET || 'n3-empire-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

// ============================================================
// Tool ID正規化
// ============================================================

function normalizeToolId(toolId: string): string {
  if (TOOL_ID_MIGRATION[toolId]) {
    return TOOL_ID_MIGRATION[toolId];
  }
  if (toolId.includes('-')) {
    return toolId.toLowerCase();
  }
  return toolId
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

// ============================================================
// Webhook パス解決
// ============================================================

function resolveWebhookPath(toolId: string): string | null {
  const normalized = normalizeToolId(toolId);
  
  if (TOOL_WEBHOOK_MAP[normalized]) {
    return TOOL_WEBHOOK_MAP[normalized];
  }
  
  if (TOOL_ID_MIGRATION[toolId]) {
    const migratedId = TOOL_ID_MIGRATION[toolId];
    if (TOOL_WEBHOOK_MAP[migratedId]) {
      return TOOL_WEBHOOK_MAP[migratedId];
    }
  }
  
  if (TOOL_WEBHOOK_MAP[toolId]) {
    return TOOL_WEBHOOK_MAP[toolId];
  }
  
  return null;
}

// ============================================================
// IP取得
// ============================================================

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return '127.0.0.1';
}

// ============================================================
// Job作成
// ============================================================

async function createJob(
  supabase: any,
  toolId: string,
  action: string,
  params: Record<string, any>,
  metadata?: any,
  fingerprint?: string
): Promise<string> {
  const timeout = metadata?.options?.timeout || 300;
  const timeoutAt = new Date(Date.now() + timeout * 1000).toISOString();
  
  const { data, error } = await supabase
    .from('dispatch_jobs')
    .insert({
      tool_id: toolId,
      action,
      params,
      status: 'pending',
      timeout_at: timeoutAt,
      user_id: metadata?.userId,
      fingerprint,
      metadata: {
        source: metadata?.source,
        organizationId: metadata?.organizationId,
        priority: metadata?.options?.priority || 5,
        ip: metadata?.ip,
      },
    })
    .select('id')
    .single();
  
  if (error) {
    console.error('[Dispatch] Job creation error:', error);
    throw new Error(`Failed to create job: ${error.message}`);
  }
  
  return data.id;
}

// ============================================================
// n8n Webhook呼び出し
// ============================================================

async function callN8nWebhook(
  webhookPath: string,
  params: Record<string, any>,
  jobId?: string
): Promise<any> {
  const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
  const url = `${baseUrl}/webhook/${webhookPath}`;
  
  const payload = JSON.stringify({
    ...params,
    _dispatch: {
      jobId,
      timestamp: new Date().toISOString(),
    },
  });
  
  const signature = generateHmacSignature(payload);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-N3-Signature': signature,
      'X-N3-Job-Id': jobId || '',
    },
    body: payload,
  });
  
  if (!response.ok) {
    throw new Error(`n8n webhook failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// ============================================================
// POST /api/dispatch
// ============================================================

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let supabase: any;
  let jobId: string | null = null;
  let auditLogId: string | null = null;
  let jobType: string = 'default';
  let lockAcquired = false;
  
  try {
    // リクエストパース
    const body: DispatchRequest = await request.json();
    const { 
      toolId: rawToolId, 
      action, 
      params, 
      metadata, 
      options,
      skipKillSwitchCheck,
      skipConcurrencyCheck,
    } = body;
    
    // バリデーション
    if (!rawToolId || !action) {
      return NextResponse.json(
        { success: false, error: 'toolId and action are required' },
        { status: 400 }
      );
    }
    
    // Tool ID正規化
    const toolId = normalizeToolId(rawToolId);
    jobType = extractJobType(toolId);
    
    // クライアントIP取得
    const clientIP = getClientIP(request);
    const userId = metadata?.userId;
    
    // 現在のユーザー取得
    const currentUser = await getCurrentUserFromRequest();
    
    // ============================================================
    // Phase D-Core: ガードチェック
    // ============================================================
    
    // 1. Kill Switch チェック
    if (!skipKillSwitchCheck) {
      try {
        await checkKillSwitch(toolId);
      } catch (error) {
        if (error instanceof KillSwitchActiveError) {
          return NextResponse.json(
            {
              ...error.toResponse(),
              guardInfo: {
                killSwitchActive: true,
                executionMode: getExecutionModeInfo(),
              },
            },
            { status: 503 }
          );
        }
        throw error;
      }
    }
    
    // 2. 実行モードチェック
    try {
      checkN8nExecution();
    } catch (error) {
      if (error instanceof ExecutionModeError) {
        return NextResponse.json(
          {
            ...error.toResponse(),
            guardInfo: {
              executionMode: getExecutionModeInfo(),
            },
          },
          { status: 503 }
        );
      }
      throw error;
    }
    
    // 3. 同時実行制限チェック
    if (!skipConcurrencyCheck) {
      const concurrencyResult = await acquireJobLock(jobType);
      if (!concurrencyResult.allowed) {
        return NextResponse.json(
          {
            success: false,
            error: concurrencyResult.reason || 'Concurrency limit reached',
            code: 'CONCURRENCY_LIMIT',
            guardInfo: {
              concurrencyBlocked: true,
              currentCount: concurrencyResult.currentCount,
              maxLimit: concurrencyResult.maxLimit,
            },
          },
          { status: 429 }
        );
      }
      lockAcquired = true;
    }
    
    // 4. Rate Limit Check
    if (!options?.skipGuards) {
      const rateLimitResult = checkDispatchRateLimit({
        ip: clientIP,
        userId,
        toolId,
      });
      
      if (!rateLimitResult.allowed) {
        if (lockAcquired) {
          await releaseJobLock(jobType);
        }
        return NextResponse.json(
          {
            success: false,
            error: rateLimitResult.reason || 'Rate limit exceeded',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: rateLimitResult.retryAfter,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(rateLimitResult.retryAfter || 60),
            },
          }
        );
      }
    }
    
    // 5. Job Guard Check（二重実行防止）
    if (!options?.skipGuards) {
      const jobGuardResult = checkDispatchJobGuard({
        toolId,
        action,
        params: params || {},
      });
      
      if (!jobGuardResult.allowed) {
        if (lockAcquired) {
          await releaseJobLock(jobType);
        }
        return NextResponse.json(
          {
            success: false,
            error: jobGuardResult.reason || 'Duplicate job detected',
            code: 'DUPLICATE_JOB',
            existingJobId: jobGuardResult.existingJobId,
          },
          { status: 409 }
        );
      }
    }
    
    // ============================================================
    // 監査ログ開始
    // ============================================================
    
    auditLogId = await logDispatchStart({
      toolId,
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      input: { action, params: params ? Object.keys(params) : [] },
    });
    
    // ============================================================
    // Webhookパス解決
    // ============================================================
    
    const webhookPath = resolveWebhookPath(toolId);
    
    if (!webhookPath) {
      if (lockAcquired) {
        await releaseJobLock(jobType);
      }
      
      await logDispatchComplete({
        logId: auditLogId || undefined,
        toolId,
        userId: currentUser?.id,
        userEmail: currentUser?.email,
        durationMs: Date.now() - startTime,
        success: false,
        error: `Unknown toolId: ${rawToolId}`,
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Unknown toolId: "${toolId}"`,
          code: 'UNKNOWN_TOOL_ID',
          availableTools: Object.keys(TOOL_WEBHOOK_MAP).sort(),
        },
        { status: 400 }
      );
    }
    
    // Supabaseクライアント
    supabase = getSupabaseClient();
    
    // Job必要判定
    const needsJob = requiresJob(toolId);
    
    // Fingerprint取得
    const fingerprint = checkDispatchJobGuard({
      toolId,
      action,
      params: params || {},
    }).fingerprint;
    
    if (needsJob) {
      // 非同期Job実行
      jobId = await createJob(
        supabase, 
        toolId, 
        action, 
        params, 
        { ...metadata, options, ip: clientIP },
        fingerprint
      );
      
      registerDispatchJob(jobId, toolId, action, params || {});
      
      // 非同期でn8n実行
      callN8nWebhook(webhookPath, params, jobId)
        .then(async (result) => {
          releaseDispatchJob(jobId!);
          if (lockAcquired) {
            await releaseJobLock(jobType);
          }
          
          await supabase
            .from('dispatch_jobs')
            .update({
              status: 'completed',
              result,
              finished_at: new Date().toISOString(),
            })
            .eq('id', jobId);
          
          await logDispatchComplete({
            logId: auditLogId || undefined,
            toolId,
            userId: currentUser?.id,
            userEmail: currentUser?.email,
            durationMs: Date.now() - startTime,
            output: result,
            success: true,
          });
        })
        .catch(async (error) => {
          releaseDispatchJob(jobId!);
          if (lockAcquired) {
            await releaseJobLock(jobType);
          }
          
          await supabase
            .from('dispatch_jobs')
            .update({
              status: 'failed',
              error: error.message,
              finished_at: new Date().toISOString(),
            })
            .eq('id', jobId);
          
          await logDispatchComplete({
            logId: auditLogId || undefined,
            toolId,
            userId: currentUser?.id,
            userEmail: currentUser?.email,
            durationMs: Date.now() - startTime,
            success: false,
            error: error.message,
          });
        });
      
      return NextResponse.json({
        success: true,
        jobId,
        status: 'pending',
        pollInterval: 2,
        fingerprint,
        toolId,
        webhookPath,
        guardInfo: {
          executionMode: getExecutionModeInfo(),
        },
      });
      
    } else {
      // 同期実行
      try {
        const result = await callN8nWebhook(webhookPath, params);
        
        if (lockAcquired) {
          await releaseJobLock(jobType);
        }
        
        await logDispatchComplete({
          logId: auditLogId || undefined,
          toolId,
          userId: currentUser?.id,
          userEmail: currentUser?.email,
          durationMs: Date.now() - startTime,
          output: result,
          success: true,
        });
        
        return NextResponse.json({
          success: true,
          result,
          toolId,
          webhookPath,
          guardInfo: {
            executionMode: getExecutionModeInfo(),
          },
        });
      } catch (error: any) {
        if (lockAcquired) {
          await releaseJobLock(jobType);
        }
        throw error;
      }
    }
    
  } catch (error: any) {
    console.error('[Dispatch] Error:', error);
    
    if (jobId) {
      releaseDispatchJob(jobId);
    }
    
    if (lockAcquired) {
      await releaseJobLock(jobType);
    }
    
    if (supabase && jobId) {
      await supabase
        .from('dispatch_jobs')
        .update({
          status: 'failed',
          error: error.message,
          finished_at: new Date().toISOString(),
        })
        .eq('id', jobId);
    }
    
    // 監査ログ完了
    const currentUser = await getCurrentUserFromRequest();
    await logDispatchComplete({
      logId: auditLogId || undefined,
      toolId: 'unknown',
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      durationMs: Date.now() - startTime,
      success: false,
      error: error.message,
    });
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// GET /api/dispatch - ツール情報取得
// ============================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // ツール一覧取得
  if (action === 'tools') {
    return NextResponse.json({
      success: true,
      tools: Object.entries(TOOL_WEBHOOK_MAP).map(([id, path]) => ({
        toolId: id,
        webhookPath: path,
        config: TOOL_DEFINITIONS[id] || null,
      })),
      count: Object.keys(TOOL_WEBHOOK_MAP).length,
    });
  }
  
  // システム状態
  const { getKillSwitchStatus } = await import('@/lib/guards/kill-switch');
  const killSwitchStatus = await getKillSwitchStatus();
  
  return NextResponse.json({
    enabled: !killSwitchStatus.active,
    killSwitchActive: killSwitchStatus.active,
    registeredTools: Object.keys(TOOL_WEBHOOK_MAP).length,
    executionMode: getExecutionModeInfo(),
  });
}

// ============================================================
// OPTIONS（CORS対応）
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
