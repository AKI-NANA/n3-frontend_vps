// app/api/cron/research-auto/route.ts
/**
 * 自動リサーチCronジョブAPI
 * 
 * 機能:
 * - 定期的に新商品を自動取得
 * - eBay売れ筋をスキャン
 * - Amazonトレンドをチェック
 * - カリトリ価格監視を実行
 * 
 * 実行方法:
 * - Vercel Cron Jobs（vercel.jsonで設定）
 * - VPS PM2 + cron
 * - 外部サービス（Uptime Kuma等）からのHTTP呼び出し
 * 
 * セキュリティ:
 * - CRON_SECRET環境変数でアクセス制限
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface CronConfig {
  task: 'ebay_trending' | 'amazon_new' | 'karitori_check' | 'all';
  keywords?: string[];
  categories?: string[];
  limit?: number;
}

interface CronResult {
  task: string;
  success: boolean;
  count: number;
  error?: string;
  duration: number;
}

// ============================================================
// セキュリティチェック
// ============================================================

function verifyRequest(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // CRON_SECRETが未設定の場合はローカル開発と見なす
  if (!cronSecret) {
    console.warn('[Cron] CRON_SECRET not set - allowing request');
    return true;
  }
  
  // Bearer tokenまたはx-cron-secretヘッダーをチェック
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  
  const cronSecretHeader = request.headers.get('x-cron-secret');
  if (cronSecretHeader === cronSecret) {
    return true;
  }
  
  // Vercel Cronからの呼び出しチェック
  const vercelCronHeader = request.headers.get('x-vercel-cron');
  if (vercelCronHeader) {
    return true;
  }
  
  return false;
}

// ============================================================
// eBayトレンドスキャン
// ============================================================

async function scanEbayTrending(keywords: string[], limit: number): Promise<CronResult> {
  const startTime = Date.now();
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    let totalCount = 0;
    
    for (const keyword of keywords) {
      const response = await fetch(`${baseUrl}/api/research-table/ebay-sold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          limit: Math.ceil(limit / keywords.length),
          minProfitMargin: 15,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        totalCount += data.count || 0;
      }
      
      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return {
      task: 'ebay_trending',
      success: true,
      count: totalCount,
      duration: Date.now() - startTime,
    };
    
  } catch (error: any) {
    return {
      task: 'ebay_trending',
      success: false,
      count: 0,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

// ============================================================
// Amazon新商品チェック
// ============================================================

async function checkAmazonNew(categories: string[], limit: number): Promise<CronResult> {
  const startTime = Date.now();
  
  try {
    const apiKey = process.env.KEEPA_API_KEY;
    
    if (!apiKey) {
      return {
        task: 'amazon_new',
        success: false,
        count: 0,
        error: 'KEEPA_API_KEY not configured',
        duration: Date.now() - startTime,
      };
    }
    
    const supabase = await createClient();
    let totalCount = 0;
    
    for (const category of categories) {
      // Keepa Best Sellers / New Releases API
      const url = new URL('https://api.keepa.com/bestsellers');
      url.searchParams.set('key', apiKey);
      url.searchParams.set('domain', '5'); // Amazon Japan
      url.searchParams.set('category', category);
      url.searchParams.set('range', '1'); // 過去1日
      
      const response = await fetch(url.toString());
      const data = await response.json();
      
      if (data.error || !data.bestSellersList) {
        console.error(`Keepa bestsellers error for ${category}:`, data.error);
        continue;
      }
      
      const asins = data.bestSellersList.slice(0, Math.ceil(limit / categories.length));
      
      if (asins.length > 0) {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const batchResponse = await fetch(`${baseUrl}/api/research-table/amazon-batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            asins,
            jobName: `Cron: ${category}`,
            minProfitMargin: 15,
          }),
        });
        
        const batchData = await batchResponse.json();
        if (batchData.success) {
          totalCount += batchData.total || 0;
        }
      }
      
      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return {
      task: 'amazon_new',
      success: true,
      count: totalCount,
      duration: Date.now() - startTime,
    };
    
  } catch (error: any) {
    return {
      task: 'amazon_new',
      success: false,
      count: 0,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

// ============================================================
// カリトリ価格チェック
// ============================================================

async function runKaritoriCheck(): Promise<CronResult> {
  const startTime = Date.now();
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/research-table/karitori-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkAll: true }),
    });
    
    const data = await response.json();
    
    return {
      task: 'karitori_check',
      success: data.success,
      count: data.alerts || 0,
      duration: Date.now() - startTime,
    };
    
  } catch (error: any) {
    return {
      task: 'karitori_check',
      success: false,
      count: 0,
      error: error.message,
      duration: Date.now() - startTime,
    };
  }
}

// ============================================================
// 実行ログ保存
// ============================================================

async function saveCronLog(results: CronResult[]) {
  try {
    const supabase = await createClient();
    
    await supabase.from('cron_logs').insert({
      job_name: 'research-auto',
      results: JSON.stringify(results),
      total_items: results.reduce((sum, r) => sum + r.count, 0),
      total_duration: results.reduce((sum, r) => sum + r.duration, 0),
      success: results.every(r => r.success),
      executed_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to save cron log:', error);
  }
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  // セキュリティチェック
  if (!verifyRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const config: CronConfig = {
      task: body.task || 'all',
      keywords: body.keywords || ['japanese vintage', 'japanese pottery', 'japanese antique'],
      categories: body.categories || ['3291'], // Collectibles
      limit: body.limit || 50,
    };

    console.log(`[Cron] Starting task: ${config.task}`);
    const results: CronResult[] = [];

    // タスク実行
    if (config.task === 'ebay_trending' || config.task === 'all') {
      const result = await scanEbayTrending(config.keywords!, config.limit!);
      results.push(result);
      console.log(`[Cron] eBay trending: ${result.count} items (${result.duration}ms)`);
    }

    if (config.task === 'amazon_new' || config.task === 'all') {
      const result = await checkAmazonNew(config.categories!, config.limit!);
      results.push(result);
      console.log(`[Cron] Amazon new: ${result.count} items (${result.duration}ms)`);
    }

    if (config.task === 'karitori_check' || config.task === 'all') {
      const result = await runKaritoriCheck();
      results.push(result);
      console.log(`[Cron] Karitori check: ${result.count} alerts (${result.duration}ms)`);
    }

    // ログ保存
    await saveCronLog(results);

    const totalCount = results.reduce((sum, r) => sum + r.count, 0);
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalTasks: results.length,
        successfulTasks: results.filter(r => r.success).length,
        totalItems: totalCount,
        totalDuration,
      },
    });

  } catch (error: any) {
    console.error('[Cron] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Vercel Cron対応（GETリクエスト）
export async function GET(request: NextRequest) {
  // セキュリティチェック
  if (!verifyRequest(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // GETリクエストの場合は全タスクを実行
  const fakeRequest = new NextRequest(request.url, {
    method: 'POST',
    headers: request.headers,
    body: JSON.stringify({ task: 'all' }),
  });

  return POST(fakeRequest);
}
