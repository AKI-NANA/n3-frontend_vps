/**
 * 出品キューAPI
 * /app/api/v2/listing-queue/route.ts
 * 
 * スケジュール出品・一括出品のキュー管理
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// =====================================================
// Supabase
// =====================================================

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// =====================================================
// 型定義
// =====================================================

interface ListingQueueItem {
  id?: string;
  product_id: string;
  marketplace: string;
  status: 'pending' | 'scheduled' | 'processing' | 'completed' | 'failed' | 'cancelled';
  priority?: number;
  scheduled_at?: string;
  listing_data?: Record<string, any>;
  profit_calculation?: Record<string, any>;
  external_listing_id?: string;
  api_response?: Record<string, any>;
  error_message?: string;
  retry_count?: number;
  created_at?: string;
  updated_at?: string;
  executed_at?: string;
}

// =====================================================
// POST: キューに追加
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productMasterId,
      marketplaces,
      status,
      scheduledAt,
      listingData,
      profitCalculation,
      priority,
    } = body;
    
    if (!productMasterId) {
      return NextResponse.json({
        success: false,
        error: 'productMasterId が必要です',
      }, { status: 400 });
    }
    
    if (!marketplaces?.length) {
      return NextResponse.json({
        success: false,
        error: 'marketplaces が必要です',
      }, { status: 400 });
    }
    
    const supabase = getSupabase();
    
    // 各マーケットプレイスごとにキューアイテムを作成
    const queueItems: ListingQueueItem[] = marketplaces.map((mp: string, idx: number) => ({
      product_id: productMasterId,
      marketplace: mp,
      status: status || 'pending',
      priority: priority || (100 - idx),  // 順番に優先度を下げる
      scheduled_at: scheduledAt || null,
      listing_data: listingData || {},
      profit_calculation: profitCalculation?.[mp] || {},
      retry_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    
    // 既存のpending/scheduledアイテムをチェック
    const { data: existing } = await supabase
      .from('listing_queue')
      .select('id, marketplace')
      .eq('product_id', productMasterId)
      .in('marketplace', marketplaces)
      .in('status', ['pending', 'scheduled', 'processing']);
    
    // 重複があれば更新、なければ挿入
    const results = [];
    
    for (const item of queueItems) {
      const existingItem = existing?.find(e => e.marketplace === item.marketplace);
      
      if (existingItem) {
        // 更新
        const { data, error } = await supabase
          .from('listing_queue')
          .update({
            ...item,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingItem.id)
          .select()
          .single();
        
        if (error) {
          console.error(`[ListingQueue] 更新エラー (${item.marketplace}):`, error);
        } else {
          results.push(data);
        }
      } else {
        // 挿入
        const { data, error } = await supabase
          .from('listing_queue')
          .insert(item)
          .select()
          .single();
        
        if (error) {
          console.error(`[ListingQueue] 挿入エラー (${item.marketplace}):`, error);
        } else {
          results.push(data);
        }
      }
    }
    
    // 商品のmarketplace_listingsも更新
    const marketplaceListingsUpdate: Record<string, any> = {};
    for (const mp of marketplaces) {
      marketplaceListingsUpdate[mp] = {
        status: status === 'scheduled' ? 'pending' : status,
        scheduled_at: scheduledAt || null,
        updated_at: new Date().toISOString(),
      };
    }
    
    await supabase
      .from('products_master')
      .update({
        marketplace_listings: marketplaceListingsUpdate,
      })
      .eq('id', productMasterId);
    
    return NextResponse.json({
      success: true,
      queued: results.length,
      items: results,
      message: `${results.length}件のキューを${status === 'scheduled' ? 'スケジュール' : '追加'}しました`,
    });
    
  } catch (error: any) {
    console.error('[ListingQueue POST] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// GET: キュー一覧取得
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const marketplace = searchParams.get('marketplace');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const supabase = getSupabase();
    
    let query = supabase
      .from('listing_queue')
      .select(`
        *,
        products_master (
          id,
          sku,
          title,
          english_title,
          japanese_title,
          price_jpy,
          purchase_price_jpy
        )
      `)
      .order('priority', { ascending: false })
      .order('scheduled_at', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (productId) {
      query = query.eq('product_id', productId);
    }
    
    if (marketplace) {
      query = query.eq('marketplace', marketplace);
    }
    
    if (status) {
      query = query.eq('status', status);
    } else {
      // デフォルトでpending/scheduledを取得
      query = query.in('status', ['pending', 'scheduled', 'processing']);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // サマリー計算
    const summary = {
      total: data?.length || 0,
      pending: data?.filter(d => d.status === 'pending').length || 0,
      scheduled: data?.filter(d => d.status === 'scheduled').length || 0,
      processing: data?.filter(d => d.status === 'processing').length || 0,
    };
    
    return NextResponse.json({
      success: true,
      items: data || [],
      summary,
    });
    
  } catch (error: any) {
    console.error('[ListingQueue GET] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// PUT: キュー更新
// =====================================================

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'id が必要です',
      }, { status: 400 });
    }
    
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from('listing_queue')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return NextResponse.json({
      success: true,
      item: data,
    });
    
  } catch (error: any) {
    console.error('[ListingQueue PUT] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// DELETE: キューから削除
// =====================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const productId = searchParams.get('productId');
    const marketplace = searchParams.get('marketplace');
    
    const supabase = getSupabase();
    
    if (id) {
      // 単一削除
      const { error } = await supabase
        .from('listing_queue')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        message: 'キューアイテムを削除しました',
      });
    }
    
    if (productId) {
      // 商品IDで削除
      let query = supabase
        .from('listing_queue')
        .delete()
        .eq('product_id', productId);
      
      if (marketplace) {
        query = query.eq('marketplace', marketplace);
      }
      
      const { error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({
        success: true,
        message: 'キューアイテムを削除しました',
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'id または productId が必要です',
    }, { status: 400 });
    
  } catch (error: any) {
    console.error('[ListingQueue DELETE] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
