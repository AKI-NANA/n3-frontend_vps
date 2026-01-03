/**
 * 在庫タイプ切り替えAPI
 * POST /api/inventory/toggle-type
 * 
 * 有在庫 ⇔ 無在庫 を切り替える
 * - inventory_type カラムを更新
 * - 有在庫の場合: stock_master にレコード作成（真実の在庫）
 * - 無在庫の場合: stock_master から削除（または非アクティブ化）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// stock_code を生成（日付ベース + ランダム）
function generateStockCode(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `STK-${dateStr}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, unique_id, new_type } = body;
    
    if (!id && !unique_id) {
      return NextResponse.json({
        success: false,
        error: 'id または unique_id が必要です',
      }, { status: 400 });
    }
    
    if (!new_type || !['stock', 'mu'].includes(new_type)) {
      return NextResponse.json({
        success: false,
        error: 'new_type は "stock" または "mu" である必要があります',
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 現在の inventory_master データを取得
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
    
    let stockMasterId = currentData.stock_master_id;
    
    // 2. 有在庫に変更する場合: stock_master にレコード作成
    if (new_type === 'stock') {
      if (!stockMasterId) {
        // stock_master に新規レコード作成
        const stockCode = generateStockCode();
        
        const { data: stockData, error: stockError } = await supabase
          .from('stock_master')
          .insert({
            stock_code: stockCode,
            product_name: currentData.product_name || currentData.title || 'Unknown Product',
            product_name_en: currentData.product_name_en || currentData.title_en,
            sku: currentData.sku,
            physical_quantity: currentData.physical_quantity || currentData.current_stock || 1,
            reserved_quantity: 0,
            cost_price_jpy: currentData.cost_jpy || currentData.cost_price,
            supplier_name: currentData.supplier_name,
            supplier_url: currentData.supplier_url || currentData.source_url,
            condition_name: currentData.condition_name,
            category: currentData.category,
            images: currentData.images || [],
          })
          .select('id, stock_code')
          .single();
        
        if (stockError) {
          console.error('stock_master insert error:', stockError);
          return NextResponse.json({
            success: false,
            error: `stock_master 作成エラー: ${stockError.message}`,
          }, { status: 500 });
        }
        
        stockMasterId = stockData.id;
        console.log(`[toggle-type] stock_master 作成: ${stockData.stock_code}`);
      }
    }
    
    // 3. inventory_master を更新
    const { data, error } = await supabase
      .from('inventory_master')
      .update({ 
        inventory_type: new_type,
        stock_master_id: new_type === 'stock' ? stockMasterId : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentData.id)
      .select('id, unique_id, inventory_type, stock_master_id');
    
    if (error) {
      console.error('Toggle type error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }
    
    // 4. 無在庫に変更する場合: stock_master との紐付けを解除
    //    （stock_master レコード自体は削除しない。他のチャネルが紐づいている可能性があるため）
    if (new_type === 'mu' && currentData.stock_master_id) {
      // 他に紐づいているinventory_masterがあるか確認
      const { data: otherLinks } = await supabase
        .from('inventory_master')
        .select('id')
        .eq('stock_master_id', currentData.stock_master_id)
        .neq('id', currentData.id);
      
      if (!otherLinks || otherLinks.length === 0) {
        // 他に紐づきがなければ stock_master を削除
        await supabase
          .from('stock_master')
          .delete()
          .eq('id', currentData.stock_master_id);
        
        console.log(`[toggle-type] stock_master 削除: ${currentData.stock_master_id}`);
      }
    }
    
    // 5. products_master も連動更新
    await supabase
      .from('products_master')
      .update({ 
        inventory_type: new_type,
        updated_at: new Date().toISOString(),
      })
      .eq('inventory_master_id', currentData.id);
    
    console.log(`[toggle-type] ${currentData.unique_id}: inventory_type → ${new_type}`);
    
    return NextResponse.json({
      success: true,
      updated: data?.[0],
      stock_master_id: new_type === 'stock' ? stockMasterId : null,
      message: `在庫タイプを「${new_type === 'stock' ? '有在庫' : '無在庫'}」に変更しました`,
    });
    
  } catch (error: any) {
    console.error('Toggle type API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '在庫タイプ変更エラー',
    }, { status: 500 });
  }
}

/**
 * 一括切り替え
 * PUT /api/inventory/toggle-type
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, unique_ids, new_type } = body;
    
    if ((!ids || ids.length === 0) && (!unique_ids || unique_ids.length === 0)) {
      return NextResponse.json({
        success: false,
        error: 'ids または unique_ids が必要です',
      }, { status: 400 });
    }
    
    if (!new_type || !['stock', 'mu'].includes(new_type)) {
      return NextResponse.json({
        success: false,
        error: 'new_type は "stock" または "mu" である必要があります',
      }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 対象レコードを取得
    let selectQuery = supabase
      .from('inventory_master')
      .select('*');
    
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
    
    let createdStockMasterCount = 0;
    let deletedStockMasterCount = 0;
    
    // 2. 各アイテムを処理
    for (const item of currentItems) {
      let stockMasterId = item.stock_master_id;
      
      if (new_type === 'stock' && !stockMasterId) {
        // stock_master に新規レコード作成
        const stockCode = generateStockCode();
        
        const { data: stockData, error: stockError } = await supabase
          .from('stock_master')
          .insert({
            stock_code: stockCode,
            product_name: item.product_name || item.title || 'Unknown Product',
            product_name_en: item.product_name_en || item.title_en,
            sku: item.sku,
            physical_quantity: item.physical_quantity || item.current_stock || 1,
            reserved_quantity: 0,
            cost_price_jpy: item.cost_jpy || item.cost_price,
            supplier_name: item.supplier_name,
            supplier_url: item.supplier_url || item.source_url,
            condition_name: item.condition_name,
            category: item.category,
            images: item.images || [],
          })
          .select('id')
          .single();
        
        if (!stockError && stockData) {
          stockMasterId = stockData.id;
          createdStockMasterCount++;
        }
      }
      
      // inventory_master を更新
      await supabase
        .from('inventory_master')
        .update({ 
          inventory_type: new_type,
          stock_master_id: new_type === 'stock' ? stockMasterId : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);
      
      // 無在庫に変更時、孤立したstock_masterを削除
      if (new_type === 'mu' && item.stock_master_id) {
        const { data: otherLinks } = await supabase
          .from('inventory_master')
          .select('id')
          .eq('stock_master_id', item.stock_master_id)
          .neq('id', item.id);
        
        if (!otherLinks || otherLinks.length === 0) {
          await supabase
            .from('stock_master')
            .delete()
            .eq('id', item.stock_master_id);
          deletedStockMasterCount++;
        }
      }
    }
    
    // 3. products_master も連動更新
    const inventoryIds = currentItems.map(d => d.id);
    await supabase
      .from('products_master')
      .update({ 
        inventory_type: new_type,
        updated_at: new Date().toISOString(),
      })
      .in('inventory_master_id', inventoryIds);
    
    console.log(`[toggle-type] 一括更新: ${currentItems.length}件 → ${new_type}`);
    if (createdStockMasterCount > 0) {
      console.log(`[toggle-type] stock_master 作成: ${createdStockMasterCount}件`);
    }
    if (deletedStockMasterCount > 0) {
      console.log(`[toggle-type] stock_master 削除: ${deletedStockMasterCount}件`);
    }
    
    return NextResponse.json({
      success: true,
      updated_count: currentItems.length,
      stock_master_created: createdStockMasterCount,
      stock_master_deleted: deletedStockMasterCount,
      message: `${currentItems.length}件の在庫タイプを「${new_type === 'stock' ? '有在庫' : '無在庫'}」に変更しました`,
    });
    
  } catch (error: any) {
    console.error('Bulk toggle type API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '一括在庫タイプ変更エラー',
    }, { status: 500 });
  }
}
