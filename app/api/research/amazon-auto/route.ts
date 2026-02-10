// app/api/research/amazon-auto/route.ts
/**
 * Amazon 自動リサーチ API
 * 
 * 機能:
 * 1. セラーID監視 - 特定セラーの新規出品を自動取得
 * 2. キーワード監視 - 特定キーワードの新商品を自動取得
 * 3. カテゴリ監視 - カテゴリ内のランキング商品を自動取得
 * 4. スケジュール実行 - Cron/Vercel Functionsで定期実行
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// POST: 自動リサーチ設定の作成/更新
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, config } = body;
    
    switch (action) {
      case 'create':
        return await createAutoConfig(config);
      case 'update':
        return await updateAutoConfig(config);
      case 'delete':
        return await deleteAutoConfig(config.id);
      case 'run':
        return await runAutoResearch(config.id);
      case 'run_all':
        return await runAllAutoResearch();
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('Auto research error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// GET: 自動リサーチ設定一覧取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    
    let query = supabase
      .from('amazon_research_auto_config')
      .select('*')
      .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    // 統計情報を追加
    if (includeStats && data) {
      const enrichedData = await Promise.all(
        data.map(async (config) => {
          const { count } = await supabase
            .from('amazon_research')
            .select('*', { count: 'exact', head: true })
            .eq('source', 'auto')
            .eq('source_reference', config.id);
          
          return {
            ...config,
            stats: {
              total_items: count || 0,
            },
          };
        })
      );
      
      return NextResponse.json({ success: true, data: enrichedData });
    }
    
    return NextResponse.json({ success: true, data });
    
  } catch (error: any) {
    console.error('Get auto configs error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// 設定管理
// ============================================================

async function createAutoConfig(config: any) {
  const newConfig = {
    id: `auto-${Date.now()}`,
    name: config.name || '新規自動リサーチ',
    enabled: config.enabled ?? true,
    
    schedule_type: config.schedule_type || 'daily',
    schedule_time: config.schedule_time || '09:00',
    schedule_days: config.schedule_days || [1, 2, 3, 4, 5], // 月-金
    
    source_type: config.source_type || 'seller_ids',
    source_config: config.source_config || {},
    
    filter_config: config.filter_config || {
      min_score: 60,
      min_profit_margin: 10,
      max_bsr: 100000,
    },
    
    notify_on_new_high_score: config.notify_on_new_high_score ?? true,
    notify_email: config.notify_email,
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabase
    .from('amazon_research_auto_config')
    .insert(newConfig)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, data });
}

async function updateAutoConfig(config: any) {
  if (!config.id) {
    return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
  }
  
  const { data, error } = await supabase
    .from('amazon_research_auto_config')
    .update({
      ...config,
      updated_at: new Date().toISOString(),
    })
    .eq('id', config.id)
    .select()
    .single();
  
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, data });
}

async function deleteAutoConfig(id: string) {
  if (!id) {
    return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
  }
  
  const { error } = await supabase
    .from('amazon_research_auto_config')
    .delete()
    .eq('id', id);
  
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true, deleted: id });
}

// ============================================================
// 自動リサーチ実行
// ============================================================

async function runAutoResearch(configId: string) {
  // 設定取得
  const { data: config, error: configError } = await supabase
    .from('amazon_research_auto_config')
    .select('*')
    .eq('id', configId)
    .single();
  
  if (configError || !config) {
    return NextResponse.json({ success: false, error: 'Config not found' }, { status: 404 });
  }
  
  if (!config.enabled) {
    return NextResponse.json({ success: false, error: 'Config is disabled' }, { status: 400 });
  }
  
  let asins: string[] = [];
  
  // ソースタイプに応じてASIN取得
  switch (config.source_type) {
    case 'seller_ids':
      asins = await fetchAsinsBySellers(config.source_config.seller_ids || []);
      break;
    case 'keywords':
      asins = await fetchAsinsByKeywords(config.source_config.keywords || []);
      break;
    case 'category':
      asins = await fetchAsinsByCategory(config.source_config.category_id);
      break;
    case 'asin_list':
      asins = config.source_config.asin_list || [];
      break;
  }
  
  if (asins.length === 0) {
    return NextResponse.json({ 
      success: true, 
      message: 'No new ASINs found',
      processed: 0,
    });
  }
  
  // バッチリサーチ実行
  const results = await processBatchResearch(asins, config);
  
  // フィルター適用
  const filtered = results.filter((item: any) => {
    if (config.filter_config.min_score && item.n3_score < config.filter_config.min_score) return false;
    if (config.filter_config.min_profit_margin && item.estimated_profit_margin < config.filter_config.min_profit_margin) return false;
    if (config.filter_config.max_bsr && item.bsr_current > config.filter_config.max_bsr) return false;
    if (config.filter_config.exclude_brands?.includes(item.brand)) return false;
    return true;
  });
  
  // 設定の実行履歴更新
  await supabase
    .from('amazon_research_auto_config')
    .update({
      last_run: new Date().toISOString(),
      last_run_count: filtered.length,
      total_items_added: (config.total_items_added || 0) + filtered.length,
    })
    .eq('id', configId);
  
  // 高スコア通知
  if (config.notify_on_new_high_score) {
    const highScoreItems = filtered.filter((item: any) => item.n3_score >= 80);
    if (highScoreItems.length > 0) {
      // TODO: メール/Slack通知実装
      console.log(`[AutoResearch] ${highScoreItems.length} high-score items found`);
    }
  }
  
  return NextResponse.json({
    success: true,
    configId,
    total_fetched: asins.length,
    processed: results.length,
    filtered: filtered.length,
    high_score: filtered.filter((i: any) => i.n3_score >= 80).length,
  });
}

async function runAllAutoResearch() {
  // 有効な設定を全て取得
  const { data: configs, error } = await supabase
    .from('amazon_research_auto_config')
    .select('*')
    .eq('enabled', true);
  
  if (error || !configs) {
    return NextResponse.json({ success: false, error: error?.message || 'No configs' }, { status: 500 });
  }
  
  const results = [];
  
  for (const config of configs) {
    try {
      const result = await runSingleConfig(config);
      results.push({ configId: config.id, ...result });
    } catch (err: any) {
      results.push({ configId: config.id, error: err.message });
    }
  }
  
  return NextResponse.json({
    success: true,
    total_configs: configs.length,
    results,
  });
}

async function runSingleConfig(config: any) {
  let asins: string[] = [];
  
  switch (config.source_type) {
    case 'seller_ids':
      asins = await fetchAsinsBySellers(config.source_config.seller_ids || []);
      break;
    case 'keywords':
      asins = await fetchAsinsByKeywords(config.source_config.keywords || []);
      break;
    case 'category':
      asins = await fetchAsinsByCategory(config.source_config.category_id);
      break;
    case 'asin_list':
      asins = config.source_config.asin_list || [];
      break;
  }
  
  const results = await processBatchResearch(asins, config);
  
  const filtered = results.filter((item: any) => {
    if (config.filter_config.min_score && item.n3_score < config.filter_config.min_score) return false;
    if (config.filter_config.min_profit_margin && item.estimated_profit_margin < config.filter_config.min_profit_margin) return false;
    return true;
  });
  
  await supabase
    .from('amazon_research_auto_config')
    .update({
      last_run: new Date().toISOString(),
      last_run_count: filtered.length,
      total_items_added: (config.total_items_added || 0) + filtered.length,
    })
    .eq('id', config.id);
  
  return {
    total_fetched: asins.length,
    processed: results.length,
    filtered: filtered.length,
  };
}

// ============================================================
// ASIN取得関数（モック - 将来PA-API/SP-API連携）
// ============================================================

async function fetchAsinsBySellers(sellerIds: string[]): Promise<string[]> {
  // TODO: SP-APIでセラーの出品一覧を取得
  // 現在はモックデータ
  const asins: string[] = [];
  for (const sellerId of sellerIds) {
    // セラーごとに5-10商品をモック
    const count = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < count; i++) {
      asins.push(`B${String(Math.random()).slice(2, 11).padStart(9, '0')}`);
    }
  }
  return [...new Set(asins)];
}

async function fetchAsinsByKeywords(keywords: string[]): Promise<string[]> {
  // TODO: PA-APIでキーワード検索
  // 現在はモックデータ
  const asins: string[] = [];
  for (const keyword of keywords) {
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
      asins.push(`B${String(Math.random()).slice(2, 11).padStart(9, '0')}`);
    }
  }
  return [...new Set(asins)];
}

async function fetchAsinsByCategory(categoryId: string): Promise<string[]> {
  // TODO: PA-APIでカテゴリランキング取得
  // 現在はモックデータ
  const asins: string[] = [];
  const count = Math.floor(Math.random() * 20) + 10;
  for (let i = 0; i < count; i++) {
    asins.push(`B${String(Math.random()).slice(2, 11).padStart(9, '0')}`);
  }
  return asins;
}

async function processBatchResearch(asins: string[], config: any): Promise<any[]> {
  // 内部APIを呼び出し
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/research/amazon-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asins,
        options: { forceRefresh: false },
      }),
    });
    
    const data = await response.json();
    
    if (data.success && data.results) {
      // ソース情報を追加して保存
      for (const result of data.results) {
        await supabase
          .from('amazon_research')
          .update({
            source: 'auto',
            source_reference: config.id,
            is_auto_tracked: true,
          })
          .eq('asin', result.asin);
      }
      
      return data.results;
    }
    
    return [];
  } catch (err) {
    console.error('Batch research error:', err);
    return [];
  }
}
