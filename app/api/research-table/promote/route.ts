// app/api/research-table/promote/route.ts
/**
 * リサーチ結果をproducts_masterへ転送するAPI
 * 
 * 機能:
 * - research_repositoryから承認済み(research_pending)アイテムを取得
 * - スコア順にソートしてproducts_masterへ挿入
 * - 重複チェック（ASIN/source_url）
 * 
 * 🔥 v2: research_pending ステータスを追加
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'IDsが必要です' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. 対象のリサーチアイテムを取得（スコア順）
    // 🔥 research_pending を追加
    const { data: researchItems, error: fetchError } = await supabase
      .from('research_repository')
      .select('*')
      .in('id', ids)
      .in('status', ['approved', 'new', 'analyzing', 'research_pending'])
      .order('total_score', { ascending: false });

    if (fetchError) {
      throw new Error(`リサーチアイテム取得エラー: ${fetchError.message}`);
    }

    if (!researchItems || researchItems.length === 0) {
      return NextResponse.json(
        { success: false, error: '対象アイテムが見つかりません' },
        { status: 404 }
      );
    }

    // 2. products_masterへ挿入するデータを準備
    const productsToInsert = researchItems.map((item, index) => ({
      // 基本情報
      title: item.title,
      title_ja: item.title,
      title_en: item.english_title || '',
      english_title: item.english_title || '',
      description_ja: item.title,
      description_en: item.english_title || '',
      
      // 画像
      primary_image_url: item.image_url,
      image_url: item.image_url,
      images: item.image_urls ? JSON.stringify(item.image_urls) : JSON.stringify([item.image_url].filter(Boolean)),
      
      // 価格情報
      price_jpy: item.supplier_price_jpy || 0,
      price_usd: item.sold_price_usd || 0,
      cost_jpy: item.supplier_price_jpy || 0,
      cost_price: item.supplier_price_jpy || 0,
      estimated_profit_usd: item.estimated_profit_usd || 0,
      profit_margin: item.profit_margin || 0,
      
      // 分類
      category_name: item.category_name || '',
      brand: item.brand || '',
      brand_name: item.brand || '',
      condition: item.condition_name || 'Used',
      
      // 仕入先情報
      supplier_url: item.supplier_url || '',
      source_url: item.source_url || item.supplier_url || '',
      supplier_name: item.supplier_name || '',
      supplier_source: item.supplier_source || '',
      
      // Amazon関連
      asin: item.asin || null,
      
      // eBay関連
      ebay_item_id: item.ebay_item_id || null,
      
      // HTS/関税
      hts_code: item.hts_code || '',
      origin_country: item.origin_country || 'JP',
      
      // スコア
      research_score: item.total_score || 0,
      profit_score: item.profit_score || 0,
      risk_score: item.risk_score || 0,
      
      // SM分析参照用
      sm_lowest_price: item.sold_price_usd || null,
      sm_sales_count: item.sold_count || null,
      sm_competitor_count: item.competitor_count || null,
      
      // リスク
      risk_level: item.risk_level || 'low',
      vero_risk: item.vero_risk || false,
      is_vero_brand: item.vero_risk || false,
      section_301_risk: item.section_301_risk || false,
      
      // ステータス
      status: 'draft',
      listing_status: 'draft',
      workflow_status: 'translation', // 翻訳工程から開始
      
      // メタ
      source: 'research_n3',
      research_repository_id: item.id,
      research_item_id: item.id,
      sort_order: index,
      
      // タイムスタンプ
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));

    // 3. 重複チェック（ASINまたはsource_url）
    const asins = productsToInsert.filter(p => p.asin).map(p => p.asin);
    const supplierUrls = productsToInsert.filter(p => p.supplier_url).map(p => p.supplier_url);

    let existingAsins: string[] = [];
    let existingUrls: string[] = [];

    if (asins.length > 0) {
      const { data: existing } = await supabase
        .from('products_master')
        .select('asin')
        .in('asin', asins);
      existingAsins = (existing || []).map(e => e.asin);
    }

    if (supplierUrls.length > 0) {
      const { data: existing } = await supabase
        .from('products_master')
        .select('supplier_url')
        .in('supplier_url', supplierUrls);
      existingUrls = (existing || []).map(e => e.supplier_url);
    }

    // 重複を除外
    const uniqueProducts = productsToInsert.filter(p => {
      if (p.asin && existingAsins.includes(p.asin)) return false;
      if (p.supplier_url && existingUrls.includes(p.supplier_url)) return false;
      return true;
    });

    if (uniqueProducts.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        skipped: productsToInsert.length,
        message: 'すべてのアイテムは既に登録済みです',
      });
    }

    // 4. products_masterへ挿入
    const { data: inserted, error: insertError } = await supabase
      .from('products_master')
      .insert(uniqueProducts)
      .select('id');

    if (insertError) {
      throw new Error(`products_master挿入エラー: ${insertError.message}`);
    }

    // 5. research_repositoryのステータスを更新
    const promotedIds = uniqueProducts.map(p => p.research_item_id);
    const { error: updateError } = await supabase
      .from('research_repository')
      .update({ 
        status: 'promoted',
        promoted_product_id: inserted?.[0]?.id || null,
        updated_at: new Date().toISOString(),
      })
      .in('id', promotedIds);

    if (updateError) {
      console.warn('ステータス更新警告:', updateError.message);
    }

    return NextResponse.json({
      success: true,
      count: uniqueProducts.length,
      skipped: productsToInsert.length - uniqueProducts.length,
      insertedIds: inserted?.map(i => i.id) || [],
    });

  } catch (error: any) {
    console.error('Promote error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
