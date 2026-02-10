/**
 * 仕入れ先情報更新API
 * POST /api/inventory/update-supplier-info
 * 
 * フェーズ2: 無在庫(MU)商品の仕入れ先管理
 * 
 * MU商品の仕入れ先URL、モール、確認日時などを更新
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 仕入れ元モール種別
type SupplierMall = 'amazon_jp' | 'rakuten' | 'yahoo_shopping' | 'mercari' | 'yahoo_auction' | 'other';

// 仕入れ先情報
interface MUSupplierInfo {
  mall: SupplierMall;
  url: string;
  last_checked_at?: string;
  is_available?: boolean;
  supplier_price?: number;
  supplier_stock?: number;
  notes?: string;
}

/**
 * 仕入れ先情報を更新
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, unique_id, supplier_info } = body;
    
    if (!id && !unique_id) {
      return NextResponse.json({
        success: false,
        error: 'id または unique_id が必要です',
      }, { status: 400 });
    }
    
    if (!supplier_info) {
      return NextResponse.json({
        success: false,
        error: 'supplier_info が必要です',
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 現在のデータを取得
    let selectQuery = supabase
      .from('inventory_master')
      .select('id, unique_id, mu_supplier_info, supplier_info');
    
    if (id) {
      selectQuery = selectQuery.eq('id', id);
    } else {
      selectQuery = selectQuery.eq('unique_id', unique_id);
    }
    
    const { data: currentData, error: selectError } = await selectQuery.single();
    
    if (selectError || !currentData) {
      return NextResponse.json({
        success: false,
        error: '該当する商品が見つかりません',
      }, { status: 404 });
    }
    
    // 2. 仕入れ先情報をマージ
    const existingInfo = currentData.mu_supplier_info || {};
    const mergedInfo: MUSupplierInfo = {
      ...existingInfo,
      ...supplier_info,
    };
    
    // 3. inventory_master を更新
    const { data, error } = await supabase
      .from('inventory_master')
      .update({
        mu_supplier_info: mergedInfo,
        // 旧supplier_infoフィールドも更新（互換性維持）
        supplier_info: {
          ...(currentData.supplier_info || {}),
          url: mergedInfo.url,
          tracking_id: mergedInfo.notes,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentData.id)
      .select('id, unique_id, mu_supplier_info');
    
    if (error) {
      console.error('[update-supplier-info] Update error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
    
    console.log(`[update-supplier-info] ${currentData.unique_id}: 仕入れ先情報を更新`);
    
    return NextResponse.json({
      success: true,
      updated: data?.[0],
      message: '仕入れ先情報を更新しました',
    });
    
  } catch (error: any) {
    console.error('[update-supplier-info] API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '仕入れ先情報更新エラー',
    }, { status: 500 });
  }
}

/**
 * 在庫確認結果を更新
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, unique_id, is_available, supplier_stock, supplier_price } = body;
    
    if (!id && !unique_id) {
      return NextResponse.json({
        success: false,
        error: 'id または unique_id が必要です',
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 現在のデータを取得
    let selectQuery = supabase
      .from('inventory_master')
      .select('id, unique_id, mu_supplier_info');
    
    if (id) {
      selectQuery = selectQuery.eq('id', id);
    } else {
      selectQuery = selectQuery.eq('unique_id', unique_id);
    }
    
    const { data: currentData, error: selectError } = await selectQuery.single();
    
    if (selectError || !currentData) {
      return NextResponse.json({
        success: false,
        error: '該当する商品が見つかりません',
      }, { status: 404 });
    }
    
    // 2. 在庫確認結果を更新
    const existingInfo = currentData.mu_supplier_info || {};
    const updatedInfo: MUSupplierInfo = {
      ...existingInfo,
      is_available: is_available,
      last_checked_at: new Date().toISOString(),
    };
    
    if (supplier_stock !== undefined) {
      updatedInfo.supplier_stock = supplier_stock;
    }
    
    if (supplier_price !== undefined) {
      updatedInfo.supplier_price = supplier_price;
    }
    
    // 3. inventory_master を更新
    const { data, error } = await supabase
      .from('inventory_master')
      .update({
        mu_supplier_info: updatedInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentData.id)
      .select('id, unique_id, mu_supplier_info');
    
    if (error) {
      console.error('[update-supplier-info] PATCH error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
    
    console.log(`[update-supplier-info] ${currentData.unique_id}: 在庫確認結果を更新 (is_available: ${is_available})`);
    
    return NextResponse.json({
      success: true,
      updated: data?.[0],
      is_available: is_available,
      message: is_available ? '仕入れ元に在庫があります' : '仕入れ元の在庫がありません',
    });
    
  } catch (error: any) {
    console.error('[update-supplier-info] PATCH API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '在庫確認更新エラー',
    }, { status: 500 });
  }
}

/**
 * 一括在庫確認（指定されたIDリストの在庫確認日時を更新）
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, unique_ids } = body;
    
    if ((!ids || ids.length === 0) && (!unique_ids || unique_ids.length === 0)) {
      return NextResponse.json({
        success: false,
        error: 'ids または unique_ids が必要です',
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 対象レコードを取得
    let selectQuery = supabase
      .from('inventory_master')
      .select('id, unique_id, mu_supplier_info');
    
    if (ids && ids.length > 0) {
      selectQuery = selectQuery.in('id', ids);
    } else {
      selectQuery = selectQuery.in('unique_id', unique_ids);
    }
    
    const { data: items, error: selectError } = await selectQuery;
    
    if (selectError || !items || items.length === 0) {
      return NextResponse.json({
        success: false,
        error: '該当する商品が見つかりません',
      }, { status: 404 });
    }
    
    // 2. 各商品の在庫確認日時を更新
    let updatedCount = 0;
    const now = new Date().toISOString();
    
    for (const item of items) {
      const existingInfo = item.mu_supplier_info || {};
      const updatedInfo = {
        ...existingInfo,
        last_checked_at: now,
        // 注意: 実際の在庫確認はここでは行わない
        // 外部サービスとの連携が必要な場合は別途実装
      };
      
      const { error: updateError } = await supabase
        .from('inventory_master')
        .update({
          mu_supplier_info: updatedInfo,
          updated_at: now,
        })
        .eq('id', item.id);
      
      if (!updateError) {
        updatedCount++;
      }
    }
    
    console.log(`[update-supplier-info] 一括確認: ${updatedCount}/${items.length}件`);
    
    return NextResponse.json({
      success: true,
      updated_count: updatedCount,
      total_count: items.length,
      checked_at: now,
      message: `${updatedCount}件の在庫確認日時を更新しました`,
    });
    
  } catch (error: any) {
    console.error('[update-supplier-info] PUT API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '一括確認更新エラー',
    }, { status: 500 });
  }
}
