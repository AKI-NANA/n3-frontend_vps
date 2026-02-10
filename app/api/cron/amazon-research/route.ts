// app/api/cron/amazon-research/route.ts
/**
 * Amazon Research Cron Job
 * 
 * Vercel Cron または外部スケジューラーから呼び出し
 * 設定: vercel.json に cron 設定を追加
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[Cron] Starting Amazon Research scheduled job...');
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    
    const { data: configs, error } = await supabase
      .from('amazon_research_auto_config')
      .select('*')
      .eq('enabled', true);
    
    if (error || !configs || configs.length === 0) {
      return NextResponse.json({ success: true, message: 'No active configs', executed: 0 });
    }
    
    const results = [];
    
    for (const config of configs) {
      const shouldRun = checkSchedule(config, currentHour, currentDay);
      
      if (!shouldRun) {
        results.push({ configId: config.id, name: config.name, skipped: true });
        continue;
      }
      
      try {
        const result = await executeAutoResearch(config);
        results.push({ configId: config.id, name: config.name, ...result });
      } catch (err: any) {
        results.push({ configId: config.id, name: config.name, error: err.message });
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      total_configs: configs.length,
      executed: results.filter(r => !r.skipped && !r.error).length,
      results,
    });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { configId, forceRun } = body;
    
    if (configId) {
      const { data: config, error } = await supabase
        .from('amazon_research_auto_config')
        .select('*')
        .eq('id', configId)
        .single();
      
      if (error || !config) {
        return NextResponse.json({ success: false, error: 'Config not found' }, { status: 404 });
      }
      
      const result = await executeAutoResearch(config);
      return NextResponse.json({ success: true, configId, ...result });
    }
    
    if (forceRun) {
      const { data: configs } = await supabase
        .from('amazon_research_auto_config')
        .select('*')
        .eq('enabled', true);
      
      if (!configs) {
        return NextResponse.json({ success: false, error: 'No configs' }, { status: 404 });
      }
      
      const results = [];
      for (const config of configs) {
        try {
          const result = await executeAutoResearch(config);
          results.push({ configId: config.id, ...result });
        } catch (err: any) {
          results.push({ configId: config.id, error: err.message });
        }
      }
      
      return NextResponse.json({ success: true, total: configs.length, results });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// ヘルパー関数
// ============================================================

function checkSchedule(config: any, currentHour: number, currentDay: number): boolean {
  const scheduleTime = config.schedule_time || '09:00';
  const [hour] = scheduleTime.split(':').map(Number);
  
  if (currentHour !== hour) return false;
  
  if (config.schedule_type === 'weekly') {
    const days = config.schedule_days || [1, 2, 3, 4, 5];
    if (!days.includes(currentDay)) return false;
  }
  
  return true;
}

async function executeAutoResearch(config: any): Promise<any> {
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
  
  if (asins.length === 0) {
    return { processed: 0, message: 'No ASINs found' };
  }
  
  // 既存ASINを除外
  const { data: existing } = await supabase
    .from('amazon_research')
    .select('asin')
    .in('asin', asins);
  
  const existingAsins = new Set(existing?.map(e => e.asin) || []);
  const newAsins = asins.filter(a => !existingAsins.has(a));
  
  if (newAsins.length === 0) {
    return { processed: 0, message: 'All ASINs already exist' };
  }
  
  // バッチ処理
  const results = [];
  const batchSize = 10;
  
  for (let i = 0; i < newAsins.length; i += batchSize) {
    const batch = newAsins.slice(i, i + batchSize);
    const batchResults = await processBatch(batch, config);
    results.push(...batchResults);
  }
  
  // フィルター適用
  const filtered = results.filter((item: any) => {
    const fc = config.filter_config || {};
    if (fc.min_score && item.n3_score < fc.min_score) return false;
    if (fc.min_profit_margin && item.estimated_profit_margin < fc.min_profit_margin) return false;
    if (fc.max_bsr && item.bsr_current > fc.max_bsr) return false;
    if (fc.max_fba_sellers && item.fba_offer_count > fc.max_fba_sellers) return false;
    if (fc.exclude_brands?.includes(item.brand)) return false;
    return true;
  });
  
  // 設定更新
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
    new_asins: newAsins.length,
    processed: results.length,
    filtered: filtered.length,
    high_score: filtered.filter((i: any) => i.n3_score >= 80).length,
  };
}

async function processBatch(asins: string[], config: any): Promise<any[]> {
  const results = [];
  
  for (const asin of asins) {
    try {
      const productData = await fetchProductData(asin);
      const enrichedData = calculateScores(productData);
      
      const { data: saved } = await supabase
        .from('amazon_research')
        .upsert({
          ...enrichedData,
          asin,
          source: 'auto',
          source_reference: config.id,
          is_auto_tracked: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'asin' })
        .select()
        .single();
      
      if (saved) results.push(saved);
    } catch (err) {
      console.error(`Error processing ${asin}:`, err);
    }
  }
  
  return results;
}

// ============================================================
// データ取得（モック - 将来PA-API連携）
// ============================================================

async function fetchAsinsBySellers(sellerIds: string[]): Promise<string[]> {
  // TODO: SP-API実装
  const asins: string[] = [];
  for (const _sellerId of sellerIds) {
    const count = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < count; i++) {
      asins.push(`B${String(Math.random()).slice(2, 11).padStart(9, '0')}`);
    }
  }
  return [...new Set(asins)];
}

async function fetchAsinsByKeywords(keywords: string[]): Promise<string[]> {
  // TODO: PA-API実装
  const asins: string[] = [];
  for (const _keyword of keywords) {
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
      asins.push(`B${String(Math.random()).slice(2, 11).padStart(9, '0')}`);
    }
  }
  return [...new Set(asins)];
}

async function fetchAsinsByCategory(categoryId: string): Promise<string[]> {
  // TODO: PA-API実装
  const asins: string[] = [];
  const count = Math.floor(Math.random() * 20) + 10;
  for (let i = 0; i < count; i++) {
    asins.push(`B${String(Math.random()).slice(2, 11).padStart(9, '0')}`);
  }
  return asins;
}

async function fetchProductData(asin: string): Promise<any> {
  const categories = ['おもちゃ', 'ホーム＆キッチン', '家電&カメラ', 'ビューティー', 'ペット用品'];
  const brands = ['Anker', 'ELECOM', 'Buffalo', 'Panasonic', 'Sony', 'IRIS OHYAMA'];
  
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
  
  const price = rand(1000, 20000);
  const bsr = rand(500, 200000);
  const sales = Math.round(100000 / Math.sqrt(bsr));
  
  return {
    asin,
    title: `${brands[rand(0, brands.length - 1)]} 商品 ${asin.slice(-4)}`,
    brand: brands[rand(0, brands.length - 1)],
    category: categories[rand(0, categories.length - 1)],
    main_image_url: `https://picsum.photos/seed/${asin}/200/200`,
    amazon_price_jpy: price,
    buy_box_price_jpy: price,
    bsr_current: bsr,
    bsr_30d_avg: bsr + rand(-5000, 5000),
    bsr_drops_30d: rand(5, 60),
    monthly_sales_estimate: sales,
    monthly_revenue_estimate: sales * price,
    review_count: rand(10, 2000),
    star_rating: Math.round(randFloat(3.5, 4.8) * 10) / 10,
    new_offer_count: rand(5, 30),
    fba_offer_count: rand(2, 15),
    is_amazon: rand(0, 5) === 0,
    length_cm: rand(10, 40),
    width_cm: rand(5, 30),
    height_cm: rand(3, 20),
    weight_g: rand(100, 2000),
    is_restricted: rand(0, 20) === 0,
    release_date: rand(0, 3) === 0 
      ? new Date(Date.now() - rand(0, 90) * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() - rand(180, 1000) * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  };
}

function calculateScores(data: any): any {
  const price = data.amazon_price_jpy || 0;
  const exchangeRate = 150;
  
  const ebayPriceUsd = (price * 1.15) / exchangeRate;
  const ebayFee = ebayPriceUsd * 0.129;
  const paymentFee = ebayPriceUsd * 0.03;
  const weight = data.weight_g || 500;
  let shippingCost = 8;
  if (weight > 2000) shippingCost = 25;
  else if (weight > 1000) shippingCost = 15;
  else if (weight > 500) shippingCost = 10;
  
  const costUsd = price / exchangeRate;
  const profitUsd = ebayPriceUsd - costUsd - ebayFee - paymentFee - shippingCost;
  const profitMargin = (profitUsd / ebayPriceUsd) * 100;
  
  // スコア計算
  let profitScore = profitMargin >= 30 ? 30 : profitMargin >= 20 ? 24 : profitMargin >= 15 ? 20 : profitMargin >= 10 ? 15 : 5;
  
  const bsr = data.bsr_current || 999999;
  let demandScore = bsr <= 5000 ? 25 : bsr <= 30000 ? 18 : bsr <= 100000 ? 10 : 5;
  
  const fba = data.fba_offer_count || 0;
  let competitionScore = 20;
  if (fba >= 20) competitionScore = 5;
  else if (fba >= 10) competitionScore = 10;
  else if (fba >= 5) competitionScore = 15;
  
  let riskScore = 20;
  const riskFlags: string[] = [];
  if (data.is_restricted) { riskScore -= 8; riskFlags.push('restricted'); }
  if (data.is_amazon) { riskScore -= 5; riskFlags.push('amazon_sell'); }
  
  const totalScore = Math.min(100, profitScore + demandScore + competitionScore + Math.max(0, riskScore));
  
  const releaseDate = data.release_date ? new Date(data.release_date) : null;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const isNewProduct = releaseDate && releaseDate > threeMonthsAgo;
  
  return {
    ...data,
    ebay_estimated_price_usd: Math.round(ebayPriceUsd * 100) / 100,
    estimated_profit_jpy: Math.round(profitUsd * exchangeRate),
    estimated_profit_usd: Math.round(profitUsd * 100) / 100,
    estimated_profit_margin: Math.round(profitMargin * 10) / 10,
    n3_score: totalScore,
    n3_score_breakdown: { profit_score: profitScore, demand_score: demandScore, competition_score: competitionScore, risk_score: Math.max(0, riskScore) },
    risk_flags: riskFlags,
    risk_level: riskScore <= 8 ? 'high' : riskScore <= 14 ? 'medium' : 'low',
    is_new_product: isNewProduct,
  };
}
