/**
 * /api/listing/queue/route.ts
 * 
 * 出品キュー管理API
 * 
 * 注意: 既存のlisting_queueテーブル（product_id UUID）に対応
 * 
 * POST: キューにアイテム追加
 * GET: キュー一覧取得
 * DELETE: キューアイテム削除
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// POST: キューにアイテム追加
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productIds,  // UUID[]
      marketplaces, 
      scheduleAt, 
      priority = 100 
    } = body;

    if (!productIds?.length || !marketplaces?.length) {
      return NextResponse.json(
        { error: 'productIds と marketplaces は必須です' },
        { status: 400 }
      );
    }

    // 商品情報を取得
    const { data: products, error: productError } = await supabase
      .from('products_master')
      .select('id, sku, title_en, listing_price, stock_quantity, workflow_status')
      .in('id', productIds);

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 });
    }

    // 承認済み商品のみフィルタ
    const approvedProducts = products?.filter(p => p.workflow_status === 'approved') || [];
    
    if (approvedProducts.length === 0) {
      return NextResponse.json(
        { error: '承認済みの商品がありません' },
        { status: 400 }
      );
    }

    // キューアイテムを作成
    const queueItems = [];
    for (const product of approvedProducts) {
      for (const marketplace of marketplaces) {
        queueItems.push({
          product_id: product.id,  // UUID
          marketplace,
          status: scheduleAt ? 'scheduled' : 'pending',
          priority,
          scheduled_at: scheduleAt || null,
          listing_data: {
            sku: product.sku,
            title: product.title_en,
            price: product.listing_price,
            quantity: product.stock_quantity,
          },
          request_data: {
            sku: product.sku,
            title: product.title_en,
            price: product.listing_price,
            quantity: product.stock_quantity,
          },
        });
      }
    }

    // バッチ挿入
    const { data: insertedItems, error: insertError } = await supabase
      .from('listing_queue')
      .insert(queueItems)
      .select('id');

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // n8n出品ハブに通知（即時出品の場合）
    if (!scheduleAt) {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';
      
      try {
        await fetch(`${n8nWebhookUrl}/listing-hub`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            queue_ids: insertedItems?.map(i => i.id) || [],
            product_ids: approvedProducts.map(p => p.id),
            marketplaces,
          }),
        });
      } catch (e) {
        console.error('n8n notification failed:', e);
        // n8n通知失敗は致命的エラーではない
      }
    }

    return NextResponse.json({
      success: true,
      queued: insertedItems?.length || 0,
      queueIds: insertedItems?.map(i => i.id) || [],
      skipped: productIds.length - approvedProducts.length,
    });

  } catch (e: any) {
    console.error('Queue POST error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// GET: キュー一覧取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const marketplace = searchParams.get('marketplace');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('listing_queue')
      .select(`
        *,
        products_master:product_id (
          id, sku, title_en, listing_price
        )
      `)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }
    if (marketplace) {
      query = query.eq('marketplace', marketplace);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 統計情報も取得
    const { data: statsData } = await supabase
      .from('listing_queue')
      .select('status')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    const stats = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      scheduled: 0,
    };

    statsData?.forEach(item => {
      if (item.status in stats) {
        (stats as any)[item.status]++;
      }
    });

    return NextResponse.json({
      items: data || [],
      stats,
      total: data?.length || 0,
    });

  } catch (e: any) {
    console.error('Queue GET error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ============================================================
// DELETE: キューアイテム削除/キャンセル
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');  // UUID
    const action = searchParams.get('action') || 'cancel';

    if (!id) {
      return NextResponse.json({ error: 'id は必須です' }, { status: 400 });
    }

    if (action === 'cancel') {
      // キャンセル（ステータス変更のみ）
      const { error } = await supabase
        .from('listing_queue')
        .update({ 
          status: 'cancelled', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .in('status', ['pending', 'scheduled']);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (action === 'delete') {
      // 物理削除
      const { error } = await supabase
        .from('listing_queue')
        .delete()
        .eq('id', id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });

  } catch (e: any) {
    console.error('Queue DELETE error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
