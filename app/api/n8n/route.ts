// app/api/n8n/route.ts
/**
 * n8n Webhook受信エンドポイント
 * n8nからのコールバックを受信して処理
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflow, action, jobId, status, result, error } = body;

    console.log(`[n8n callback] Received: ${workflow}/${action} - ${status}`);

    const supabase = createClient();

    // ジョブステータスを更新
    if (jobId) {
      await supabase
        .from('n8n_jobs')
        .upsert({
          job_id: jobId,
          workflow,
          action,
          status,
          result,
          error,
          updated_at: new Date().toISOString(),
        });
    }

    // ワークフロー別の処理
    switch (workflow) {
      case 'listing-execute':
        await handleListingComplete(body, supabase);
        break;
      
      case 'inventory-sync':
        await handleInventorySync(body, supabase);
        break;
      
      case 'research-amazon':
        await handleResearchComplete(body, supabase);
        break;
      
      default:
        console.log(`Unknown workflow: ${workflow}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[n8n callback] Error:', error);
    return NextResponse.json(
      { error: 'Callback processing failed' },
      { status: 500 }
    );
  }
}

// 出品完了処理
async function handleListingComplete(data: any, supabase: any) {
  const { productId, platform, itemId, listingUrl } = data.result || {};

  if (itemId) {
    await supabase
      .from('products_master')
      .update({
        listing_status: 'active',
        [`${platform}_item_id`]: itemId,
        listing_url: listingUrl,
        listed_at: new Date().toISOString(),
      })
      .eq('id', productId);

    console.log(`[Listing] Product ${productId} listed on ${platform}: ${itemId}`);
  }
}

// 在庫同期完了処理
async function handleInventorySync(data: any, supabase: any) {
  const { synced, errors } = data.result || {};

  console.log(`[Inventory] Synced ${synced} items, ${errors} errors`);

  // 同期履歴を記録
  await supabase
    .from('sync_history')
    .insert({
      type: 'inventory',
      status: errors > 0 ? 'partial' : 'success',
      synced_count: synced,
      error_count: errors,
      executed_at: new Date().toISOString(),
    });
}

// リサーチ完了処理
async function handleResearchComplete(data: any, supabase: any) {
  const { productData } = data.result || {};

  if (productData) {
    await supabase
      .from('research_results')
      .insert({
        platform: data.platform,
        data: productData,
        created_at: new Date().toISOString(),
      });

    console.log(`[Research] Saved research data for ${data.platform}`);
  }
}

// Webhookステータス確認用
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('n8n_jobs')
    .select('*')
    .eq('job_id', jobId)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
