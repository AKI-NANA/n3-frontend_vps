// app/api/dispatch/retry/route.ts
/**
 * 🔄 Job Retry API
 * 
 * Phase 2C: Empire Command Center用
 * Phase 3B: RBAC対応
 * 
 * 失敗したジョブを再実行
 * 
 * @usage POST /api/dispatch/retry
 * @body { jobId: string }
 * @permission control:retry (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { checkPermission, createPermissionError, type UserRole } from '@/lib/guards';

// ============================================================
// 型定義
// ============================================================

interface RetryRequest {
  jobId: string;
  options?: {
    resetRetryCount?: boolean;
    modifyParams?: Record<string, any>;
  };
}

interface RetryResponse {
  success: boolean;
  newJobId?: string;
  message?: string;
  error?: string;
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
// Tool → Webhook マッピング（route.tsと同じ）
// ============================================================

const TOOL_WEBHOOK_MAP: Record<string, string> = {
  'listing-local': 'n3-listing-local',
  'listing-ebay-create': 'n3-listing-local',
  'listing-error-recovery': 'listing-error-recovery',
  'listing-lp-auto': 'listing-lp-auto',
  'listing-multi-region': 'listing-multi-region',
  'listing-china-gateway': 'listing-china',
  'listing-execute': 'listing-execute',
  'ebay-listing': 'ebay-listing',
  'qoo10-listing': 'qoo10-listing',
  'shopify-sync': 'shopify-sync',
  'amazon-listing': 'amazon-listing',
  'stock-killer': 'stock-sync',
  'inventory-stock-sync': 'stock-sync',
  'usa-supplier-monitor': 'usa-monitor',
  'inventory-monitoring': 'inventory-monitoring',
  'price-defense': 'price-defense',
  'research-agent': 'research-agent',
  'research-gpt-analyze': 'research-agent',
  'research-amazon-search': 'research-agent',
  'sm-batch': 'sm-batch',
  'trend-agent': 'trend-agent',
  'research-trend-analyze': 'trend-agent',
  'arbitrage-scan': 'arbitrage-scan',
  'ddp-calculate': 'ddp-calculate',
  'finance-ddp-calculate': 'ddp-calculate',
  'profit-calculate': 'profit-calculate',
  'accounting-sync': 'accounting-sync',
  'bank-sync': 'bank-sync',
  'payment-match': 'payment-match',
  'media-video-gen': 'media-video-gen',
  'media-video-generate': 'media-video-gen',
  'media-audio-gen': 'media-audio-gen',
  'media-audio-generate': 'media-audio-gen',
  'media-timestamp': 'media-timestamp',
  'media-thumbnail': 'media-thumbnail',
  'media-script': 'media-script',
  'media-upload': 'media-upload',
  'media-analytics': 'media-analytics',
  'media-comment-reply': 'media-comment',
  'media-knowledge-loop': 'media-knowledge',
  'scoring-dispatch': 'scoring-dispatch',
  'fx-price-adjust': 'fx-price-adjust',
  'supplier-switch': 'supplier-switch',
  'sentinel-monitor': 'sentinel',
  'ai-producer': 'ai-producer',
  'empire-revenue': 'empire-revenue',
  'empire-airwallex': 'empire-airwallex',
  'empire-revenue-share': 'empire-revshare',
  'contractor-payment': 'contractor-payment',
  'contractor-material': 'material-analyze',
  'defense-copyright': 'defense-copyright',
  'defense-ban-monitor': 'defense-ban',
  'ai-inquiry-reply': 'inquiry-reply',
  'ai-category-map': 'category-map',
  'local-llm-ollama': 'local-llm',
  // Inventory Extension
  'inventory-sync': 'inventory-sync',
  'inventory-health': 'inventory-health',
  'inventory-bulk-adjust': 'inventory-bulk-adjust',
  'inventory-alert': 'inventory-alert',
  // Research Extension
  'research-hub-analyze': 'research-hub',
  'market-score-calc': 'market-score',
  'competitor-scan': 'competitor-scan',
  // Automation Extension
  'auto-listing': 'auto-listing',
  'queue-monitor': 'queue-monitor',
  'error-recovery': 'error-recovery',
  'batch-execute': 'batch-execute',
};

// ============================================================
// ロール取得（仮実装 - 実際はセッションから取得）
// ============================================================

function getUserRole(request: NextRequest): UserRole {
  // TODO: 実際の実装ではセッション/JWTから取得
  const roleHeader = request.headers.get('x-user-role');
  if (roleHeader && ['admin', 'operator', 'viewer'].includes(roleHeader)) {
    return roleHeader as UserRole;
  }
  // デフォルト: admin（開発中）
  return 'admin';
}

// ============================================================
// POST /api/dispatch/retry
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Phase 3B: RBAC Check
    const userRole = getUserRole(request);
    const permissionResult = checkPermission(userRole, 'control:retry');
    
    if (!permissionResult.allowed) {
      return NextResponse.json(
        createPermissionError(permissionResult),
        { status: 403 }
      );
    }
    
    const body: RetryRequest = await request.json();
    const { jobId, options } = body;
    
    // バリデーション
    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'jobId is required' },
        { status: 400 }
      );
    }
    
    const supabase = getSupabaseClient();
    
    // 元のジョブを取得
    const { data: originalJob, error: fetchError } = await supabase
      .from('dispatch_jobs')
      .select('*')
      .eq('id', jobId)
      .single();
    
    if (fetchError || !originalJob) {
      return NextResponse.json(
        { success: false, error: `Job not found: ${jobId}` },
        { status: 404 }
      );
    }
    
    // 失敗・タイムアウト以外はリトライ不可
    if (!['failed', 'timeout'].includes(originalJob.status)) {
      return NextResponse.json(
        { success: false, error: `Job status is ${originalJob.status}, cannot retry` },
        { status: 400 }
      );
    }
    
    // Webhookパス解決
    const webhookPath = TOOL_WEBHOOK_MAP[originalJob.tool_id];
    if (!webhookPath) {
      return NextResponse.json(
        { success: false, error: `Unknown toolId: ${originalJob.tool_id}` },
        { status: 400 }
      );
    }
    
    // パラメータ（オプションで上書き可能）
    const params = options?.modifyParams
      ? { ...originalJob.params, ...options.modifyParams }
      : originalJob.params;
    
    // リトライカウント
    const retryCount = options?.resetRetryCount
      ? 0
      : (originalJob.retry_count || 0) + 1;
    
    // 最大リトライ回数チェック
    const maxRetries = 3;
    if (retryCount > maxRetries) {
      return NextResponse.json(
        { success: false, error: `Max retry count exceeded (${maxRetries})` },
        { status: 400 }
      );
    }
    
    // 新しいジョブを作成
    const timeout = originalJob.metadata?.options?.timeout || 300;
    const timeoutAt = new Date(Date.now() + timeout * 1000).toISOString();
    
    const { data: newJob, error: createError } = await supabase
      .from('dispatch_jobs')
      .insert({
        tool_id: originalJob.tool_id,
        action: originalJob.action,
        params,
        status: 'pending',
        timeout_at: timeoutAt,
        user_id: originalJob.user_id,
        retry_count: retryCount,
        parent_job_id: jobId,
        metadata: {
          ...originalJob.metadata,
          retryOf: jobId,
          retryAt: new Date().toISOString(),
        },
      })
      .select('id')
      .single();
    
    if (createError) {
      console.error('[Dispatch/Retry] Job creation error:', createError);
      return NextResponse.json(
        { success: false, error: createError.message },
        { status: 500 }
      );
    }
    
    const newJobId = newJob.id;
    
    // 元のジョブを「retried」状態に更新
    await supabase
      .from('dispatch_jobs')
      .update({
        status: 'retried',
        metadata: {
          ...originalJob.metadata,
          retriedTo: newJobId,
          retriedAt: new Date().toISOString(),
        },
      })
      .eq('id', jobId);
    
    // n8n Webhook 非同期実行
    const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
    const url = `${baseUrl}/webhook/${webhookPath}`;
    
    const payload = JSON.stringify({
      ...params,
      _dispatch: {
        jobId: newJobId,
        timestamp: new Date().toISOString(),
        isRetry: true,
        retryCount,
        originalJobId: jobId,
      },
    });
    
    const signature = generateHmacSignature(payload);
    
    // 非同期実行（await しない）
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N3-Signature': signature,
        'X-N3-Job-Id': newJobId,
      },
      body: payload,
    })
      .then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          await supabase
            .from('dispatch_jobs')
            .update({
              status: 'completed',
              result,
              finished_at: new Date().toISOString(),
            })
            .eq('id', newJobId);
        } else {
          throw new Error(`Webhook failed: ${response.status}`);
        }
      })
      .catch(async (error) => {
        await supabase
          .from('dispatch_jobs')
          .update({
            status: 'failed',
            error: error.message,
            finished_at: new Date().toISOString(),
          })
          .eq('id', newJobId);
      });
    
    const response: RetryResponse = {
      success: true,
      newJobId,
      message: `Job ${jobId} scheduled for retry (attempt ${retryCount})`,
    };
    
    return NextResponse.json(response);
    
  } catch (error: any) {
    console.error('[Dispatch/Retry] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// OPTIONS（CORS対応）
// ============================================================

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
