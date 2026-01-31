/**
 * マスター在庫タイプ更新API
 * POST /api/inventory/update-master-type
 * 
 * フェーズ2: L4階層化対応
 * 
 * inventory_type を以下の値に更新:
 * - regular: 通常品（単品在庫）
 * - set: セット品（構成パーツ連動在庫）
 * - mu: 無在庫（モール在庫管理）
 * - parts: 構成パーツ（セット構成に必要な実在庫）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// マスター在庫タイプ
type MasterInventoryType = 'regular' | 'set' | 'mu' | 'parts';

const VALID_TYPES: MasterInventoryType[] = ['regular', 'set', 'mu', 'parts'];

// 旧タイプから新タイプへのマッピング
const LEGACY_TYPE_MAP: Record<string, MasterInventoryType> = {
  'stock': 'regular',
  'dropship': 'mu',
};

/**
 * 単一商品の在庫タイプ更新
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, unique_id, new_type, is_set_component } = body;
    
    if (!id && !unique_id) {
      return NextResponse.json({
        success: false,
        error: 'id または unique_id が必要です',
      }, { status: 400 });
    }
    
    // 新旧タイプの変換
    let normalizedType = new_type;
    if (LEGACY_TYPE_MAP[new_type]) {
      normalizedType = LEGACY_TYPE_MAP[new_type];
    }
    
    if (!normalizedType || !VALID_TYPES.includes(normalizedType)) {
      return NextResponse.json({
        success: false,
        error: `new_type は ${VALID_TYPES.join(', ')} のいずれかである必要があります`,
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 現在のデータを取得
    let selectQuery = supabase
      .from('inventory_master')
      .select('*');
    
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
    
    // 2. 更新データを準備
    const updateData: Record<string, any> = {
      master_inventory_type: normalizedType,
      updated_at: new Date().toISOString(),
    };
    
    // 旧inventory_typeとの互換性維持
    // regular/parts → 'stock', mu → 'mu', set → 'stock'
    if (normalizedType === 'mu') {
      updateData.inventory_type = 'mu';
    } else {
      updateData.inventory_type = 'stock';
    }
    
    // is_set_componentフラグ
    if (is_set_component !== undefined) {
      updateData.is_set_component = is_set_component;
    } else if (normalizedType === 'parts') {
      updateData.is_set_component = true;
    } else if (normalizedType === 'regular') {
      // 明示的に通常品に変更する場合はフラグをクリア
      updateData.is_set_component = false;
    }
    
    // セット品の場合、product_typeも更新
    if (normalizedType === 'set') {
      updateData.product_type = 'set';
    }
    
    // 3. inventory_master を更新
    const { data, error } = await supabase
      .from('inventory_master')
      .update(updateData)
      .eq('id', currentData.id)
      .select('id, unique_id, master_inventory_type, inventory_type, is_set_component, product_type');
    
    if (error) {
      console.error('[update-master-type] Update error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
    
    // 4. products_master も連動更新
    await supabase
      .from('products_master')
      .update({
        master_inventory_type: normalizedType,
        inventory_type: updateData.inventory_type,
        is_set_component: updateData.is_set_component,
        product_type: updateData.product_type,
        updated_at: new Date().toISOString(),
      })
      .eq('inventory_master_id', currentData.id);
    
    console.log(`[update-master-type] ${currentData.unique_id}: master_inventory_type → ${normalizedType}`);
    
    return NextResponse.json({
      success: true,
      updated: data?.[0],
      message: `在庫タイプを「${normalizedType}」に変更しました`,
    });
    
  } catch (error: any) {
    console.error('[update-master-type] API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '在庫タイプ変更エラー',
    }, { status: 500 });
  }
}

/**
 * 一括更新
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, unique_ids, new_type, is_set_component } = body;
    
    if ((!ids || ids.length === 0) && (!unique_ids || unique_ids.length === 0)) {
      return NextResponse.json({
        success: false,
        error: 'ids または unique_ids が必要です',
      }, { status: 400 });
    }
    
    // 新旧タイプの変換
    let normalizedType = new_type;
    if (LEGACY_TYPE_MAP[new_type]) {
      normalizedType = LEGACY_TYPE_MAP[new_type];
    }
    
    if (!normalizedType || !VALID_TYPES.includes(normalizedType)) {
      return NextResponse.json({
        success: false,
        error: `new_type は ${VALID_TYPES.join(', ')} のいずれかである必要があります`,
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 対象レコードを取得
    let selectQuery = supabase
      .from('inventory_master')
      .select('id, unique_id');
    
    if (ids && ids.length > 0) {
      selectQuery = selectQuery.in('id', ids);
    } else {
      selectQuery = selectQuery.in('unique_id', unique_ids);
    }
    
    const { data: currentItems, error: selectError } = await selectQuery;
    
    if (selectError || !currentItems || currentItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: '該当する商品が見つかりません',
      }, { status: 404 });
    }
    
    // 2. 更新データを準備
    const updateData: Record<string, any> = {
      master_inventory_type: normalizedType,
      updated_at: new Date().toISOString(),
    };
    
    // 旧inventory_typeとの互換性維持
    if (normalizedType === 'mu') {
      updateData.inventory_type = 'mu';
    } else {
      updateData.inventory_type = 'stock';
    }
    
    // is_set_componentフラグ
    if (is_set_component !== undefined) {
      updateData.is_set_component = is_set_component;
    } else if (normalizedType === 'parts') {
      updateData.is_set_component = true;
    } else if (normalizedType === 'regular') {
      updateData.is_set_component = false;
    }
    
    // セット品の場合、product_typeも更新
    if (normalizedType === 'set') {
      updateData.product_type = 'set';
    }
    
    // 3. inventory_master を一括更新
    const inventoryIds = currentItems.map(item => item.id);
    
    const { error: updateError } = await supabase
      .from('inventory_master')
      .update(updateData)
      .in('id', inventoryIds);
    
    if (updateError) {
      console.error('[update-master-type] Bulk update error:', updateError);
      return NextResponse.json({
        success: false,
        error: updateError.message,
      }, { status: 500 });
    }
    
    // 4. products_master も連動更新
    await supabase
      .from('products_master')
      .update({
        master_inventory_type: normalizedType,
        inventory_type: updateData.inventory_type,
        is_set_component: updateData.is_set_component,
        product_type: updateData.product_type,
        updated_at: new Date().toISOString(),
      })
      .in('inventory_master_id', inventoryIds);
    
    console.log(`[update-master-type] 一括更新: ${currentItems.length}件 → ${normalizedType}`);
    
    return NextResponse.json({
      success: true,
      updated_count: currentItems.length,
      message: `${currentItems.length}件の在庫タイプを「${normalizedType}」に変更しました`,
    });
    
  } catch (error: any) {
    console.error('[update-master-type] Bulk API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '一括在庫タイプ変更エラー',
    }, { status: 500 });
  }
}

/**
 * L4サブフィルターのカウント取得
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // マスタータブの対象商品（inventory_type = 'stock' または master_inventory_type あり）
    // まず全体数を取得
    const { count: totalCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .or('inventory_type.eq.stock,master_inventory_type.not.is.null');
    
    // 各タイプのカウント
    const { count: regularCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .or('master_inventory_type.eq.regular,master_inventory_type.is.null')
      .not('product_type', 'eq', 'set')
      .not('inventory_type', 'eq', 'mu')
      .not('is_set_component', 'eq', true);
    
    const { count: setCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .or('master_inventory_type.eq.set,product_type.eq.set');
    
    const { count: muCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .or('master_inventory_type.eq.mu,inventory_type.eq.mu');
    
    const { count: partsCount } = await supabase
      .from('inventory_master')
      .select('*', { count: 'exact', head: true })
      .or('master_inventory_type.eq.parts,is_set_component.eq.true');
    
    return NextResponse.json({
      success: true,
      counts: {
        all: totalCount || 0,
        regular: regularCount || 0,
        set: setCount || 0,
        mu: muCount || 0,
        parts: partsCount || 0,
      },
    });
    
  } catch (error: any) {
    console.error('[update-master-type] GET counts error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'カウント取得エラー',
    }, { status: 500 });
  }
}
