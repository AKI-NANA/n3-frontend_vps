// app/api/research/amazon-batch/route.ts
/**
 * Amazon Research バッチAPI
 * 
 * 複数ASINを一括でリサーチ
 * - PA-API / SP-API からデータ取得
 * - N3スコア計算
 * - DB保存
 * 
 * v2: テーブル未作成時のフォールバック対応
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// モックモード設定（テーブルなし時に有効）
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// PA-API設定（将来的に使用）
const PA_API_CONFIG = {
  accessKey: process.env.AMAZON_PA_API_ACCESS_KEY,
  secretKey: process.env.AMAZON_PA_API_SECRET_KEY,
  partnerTag: process.env.AMAZON_PARTNER_TAG || 'n3platform-22',
  marketplace: 'www.amazon.co.jp',
  region: 'us-west-2',
};

// ============================================================
// POST: バッチリサーチ実行
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asins, options = {} } = body;
    
    if (!asins || !Array.isArray(asins) || asins.length === 0) {
      return NextResponse.json({ success: false, error: 'ASINs required' }, { status: 400 });
    }
    
    if (asins.length > 100) {
      return NextResponse.json({ success: false, error: 'Max 100 ASINs per request' }, { status: 400 });
    }
    
    // 重複除去
    const uniqueAsins = [...new Set(asins.map((a: string) => a.trim().toUpperCase()))];
    
    const results: any[] = [];
    const errors: { asin: string; error: string }[] = [];
    
    // テーブル存在確認
    const tableExists = await checkTableExists();
    
    for (const asin of uniqueAsins) {
      try {
        let existing = null;
        
        // テーブルがあれば既存データ確認
        if (tableExists && !USE_MOCK_DATA) {
          const { data } = await supabase
            .from('amazon_research')
            .select('*')
            .eq('asin', asin)
            .single();
          existing = data;
        }
        
        if (existing && !options.forceRefresh) {
          // 24時間以内のデータは再利用
          const updatedAt = new Date(existing.updated_at);
          const hoursSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceUpdate < 24) {
            results.push({
              ...existing,
              id: existing.id || `${asin}-${Date.now()}`,
              source: 'cache',
            });
            continue;
          }
        }
        
        // PA-APIからデータ取得（現在はモックデータ）
        const productData = await fetchProductData(asin);
        
        // N3スコア計算
        const enrichedData = calculateScores(productData);
        
        // テーブルがあればDB保存
        if (tableExists && !USE_MOCK_DATA) {
          const { data: saved, error: saveError } = await supabase
            .from('amazon_research')
            .upsert({
              ...enrichedData,
              asin,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'asin' })
            .select()
            .single();
          
          if (saveError) {
            console.error(`DB save error for ${asin}:`, saveError);
          }
          
          results.push({
            ...enrichedData,
            id: saved?.id || `${asin}-${Date.now()}`,
            asin,
            source: 'api',
          });
        } else {
          // モックモード：メモリ内のみ
          results.push({
            ...enrichedData,
            id: `mock-${asin}-${Date.now()}`,
            asin,
            source: 'mock',
          });
        }
        
      } catch (err: any) {
        console.error(`Error processing ${asin}:`, err);
        errors.push({ asin, error: err.message || 'Unknown error' });
      }
    }
    
    return NextResponse.json({
      success: true,
      total: uniqueAsins.length,
      completed: results.length,
      failed: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined,
      _mock: USE_MOCK_DATA || !tableExists,
    });
    
  } catch (error: any) {
    console.error('Batch research error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// GET: 最近のリサーチ結果取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');
    const minScore = searchParams.get('minScore');
    const mock = searchParams.get('mock') === 'true';
    
    // モックモードまたはテーブルなし
    const tableExists = await checkTableExists();
    
    if (USE_MOCK_DATA || mock || !tableExists) {
      // モックデータを返す
      const mockData = generateMockItems(limit);
      return NextResponse.json({
        success: true,
        data: mockData,
        total: mockData.length,
        limit,
        offset,
        _mock: true,
      });
    }
    
    let query = supabase
      .from('amazon_research')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (minScore) {
      query = query.gte('n3_score', parseInt(minScore));
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      // テーブルがない場合はモックデータを返す
      if (error.code === '42P01') {
        const mockData = generateMockItems(limit);
        return NextResponse.json({
          success: true,
          data: mockData,
          total: mockData.length,
          limit,
          offset,
          _mock: true,
          _note: 'テーブル未作成のためモックデータを表示中'
        });
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data,
      total: count,
      limit,
      offset,
    });
    
  } catch (error: any) {
    console.error('Get research error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * テーブル存在確認
 */
async function checkTableExists(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('amazon_research')
      .select('id')
      .limit(1);
    
    // テーブルが存在しない場合のエラーコード
    if (error?.code === '42P01') {
      return false;
    }
    return !error;
  } catch {
    return false;
  }
}

/**
 * モックアイテム生成
 */
function generateMockItems(count: number): any[] {
  const items: any[] = [];
  const categories = ['おもちゃ', 'ホーム＆キッチン', '家電&カメラ', 'ビューティー', 'ペット用品', 'スポーツ&アウトドア'];
  const brands = ['Anker', 'ELECOM', 'Buffalo', 'Panasonic', 'Sony', 'IRIS OHYAMA', 'YAMAZEN', 'サンワ', 'UGREEN', 'JBL'];
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  for (let i = 0; i < count; i++) {
    const asin = `B${String(rand(10000000, 99999999)).padStart(9, '0')}`;
    const data = fetchProductDataSync(asin, brands, categories, rand);
    const enriched = calculateScores(data);
    items.push({
      ...enriched,
      id: `mock-${i}-${asin}`,
    });
  }
  
  // スコア順でソート
  items.sort((a, b) => (b.n3_score || 0) - (a.n3_score || 0));
  
  return items;
}

function fetchProductDataSync(asin: string, brands: string[], categories: string[], rand: (min: number, max: number) => number): any {
  const randFloat = (min: number, max: number) => Math.random() * (max - min) + min;
  
  const price = rand(1000, 20000);
  const bsr = rand(500, 200000);
  const sales = Math.round(100000 / Math.sqrt(bsr));
  const brand = brands[rand(0, brands.length - 1)];
  const category = categories[rand(0, categories.length - 1)];
  
  return {
    asin,
    title: `${brand} ${category}向け商品 ${asin.slice(-4)} - 高品質`,
    brand,
    manufacturer: brand,
    category,
    main_image_url: `https://picsum.photos/seed/${asin}/200/200`,
    
    amazon_price_jpy: price,
    buy_box_price_jpy: price,
    lowest_new_price_jpy: Math.round(price * 0.95),
    
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
    requires_approval: rand(0, 15) === 0,
    hazmat_type: rand(0, 30) === 0 ? 'limited' : null,
    
    release_date: rand(0, 3) === 0 
      ? new Date(Date.now() - rand(0, 90) * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() - rand(180, 1000) * 24 * 60 * 60 * 1000).toISOString(),
    
    out_of_stock_percentage_30d: randFloat(0, 0.3),
    
    status: 'completed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * PA-APIからデータ取得（現在はモックデータ）
 * 将来的にPA-API/SP-API連携
 */
async function fetchProductData(asin: string): Promise<any> {
  const categories = ['おもちゃ', 'ホーム＆キッチン', '家電&カメラ', 'ビューティー', 'ペット用品', 'スポーツ&アウトドア'];
  const brands = ['Anker', 'ELECOM', 'Buffalo', 'Panasonic', 'Sony', 'IRIS OHYAMA', 'YAMAZEN', 'サンワ'];
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return fetchProductDataSync(asin, brands, categories, rand);
}

/**
 * N3スコア計算
 */
function calculateScores(data: any): any {
  // 利益推定
  const price = data.amazon_price_jpy || 0;
  const exchangeRate = 150;
  const targetMargin = 0.15;
  
  const ebayPriceUsd = (price * (1 + targetMargin)) / exchangeRate;
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
  
  // 利益スコア（30点）
  let profitScore = 0;
  if (profitMargin >= 30) profitScore = 30;
  else if (profitMargin >= 25) profitScore = 27;
  else if (profitMargin >= 20) profitScore = 24;
  else if (profitMargin >= 15) profitScore = 20;
  else if (profitMargin >= 10) profitScore = 15;
  else if (profitMargin >= 5) profitScore = 10;
  else if (profitMargin >= 0) profitScore = 5;
  
  // 需要スコア（30点）
  let demandScore = 0;
  const bsr = data.bsr_current || 999999;
  if (bsr <= 1000) demandScore += 12;
  else if (bsr <= 5000) demandScore += 10;
  else if (bsr <= 10000) demandScore += 8;
  else if (bsr <= 30000) demandScore += 6;
  else if (bsr <= 50000) demandScore += 5;
  else if (bsr <= 100000) demandScore += 3;
  else demandScore += 1;
  
  const drops = data.bsr_drops_30d || 0;
  if (drops >= 100) demandScore += 10;
  else if (drops >= 50) demandScore += 8;
  else if (drops >= 30) demandScore += 6;
  else if (drops >= 15) demandScore += 4;
  else if (drops >= 5) demandScore += 2;
  
  const category = data.category || '';
  if (['おもちゃ', 'ビューティー', 'ホーム＆キッチン', 'ペット用品'].includes(category)) {
    demandScore += 8;
  } else {
    demandScore += 4;
  }
  demandScore = Math.min(30, demandScore);
  
  // 競合スコア（20点）
  let competitionScore = 20;
  const totalOffers = (data.new_offer_count || 0) + (data.fba_offer_count || 0);
  if (totalOffers >= 50) competitionScore -= 10;
  else if (totalOffers >= 30) competitionScore -= 7;
  else if (totalOffers >= 20) competitionScore -= 5;
  else if (totalOffers >= 10) competitionScore -= 3;
  
  const fba = data.fba_offer_count || 0;
  if (fba >= 20) competitionScore -= 5;
  else if (fba >= 10) competitionScore -= 3;
  else if (fba >= 5) competitionScore -= 1;
  
  if (data.is_amazon) competitionScore -= 5;
  competitionScore = Math.max(0, competitionScore);
  
  // リスクスコア（20点）
  let riskScore = 20;
  const riskFlags: string[] = [];
  
  if (data.is_restricted) { riskScore -= 8; riskFlags.push('restricted'); }
  if (data.requires_approval) { riskScore -= 3; riskFlags.push('approval_required'); }
  if (data.hazmat_type) { riskScore -= 5; riskFlags.push('hazmat'); }
  if (data.is_amazon) { riskScore -= 3; riskFlags.push('amazon_sell'); }
  if (profitMargin < 10) { riskScore -= 2; riskFlags.push('low_margin'); }
  if (fba >= 20) { riskScore -= 2; riskFlags.push('high_competition'); }
  
  // VeROチェック
  const highRiskBrands = ['Nintendo', 'Sony', 'Apple', 'Disney', 'Marvel', 'Pokemon', 'LEGO', 'Bandai'];
  if (data.brand && highRiskBrands.some(b => data.brand.toLowerCase().includes(b.toLowerCase()))) {
    riskScore -= 7;
    riskFlags.push('ip_risk');
  }
  
  riskScore = Math.max(0, riskScore);
  
  // 総合スコア
  const totalScore = Math.min(100, profitScore + demandScore + competitionScore + riskScore);
  
  // 新製品判定
  const releaseDate = data.release_date ? new Date(data.release_date) : null;
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const isNewProduct = releaseDate && releaseDate > threeMonthsAgo;
  
  // リスクレベル
  let riskLevel = 'low';
  if (riskScore <= 8) riskLevel = 'high';
  else if (riskScore <= 14) riskLevel = 'medium';
  
  return {
    ...data,
    
    // 利益計算
    ebay_estimated_price_usd: Math.round(ebayPriceUsd * 100) / 100,
    estimated_profit_jpy: Math.round(profitUsd * exchangeRate),
    estimated_profit_usd: Math.round(profitUsd * 100) / 100,
    estimated_profit_margin: Math.round(profitMargin * 10) / 10,
    
    // N3スコア
    n3_score: totalScore,
    n3_score_breakdown: {
      profit_score: profitScore,
      demand_score: demandScore,
      competition_score: competitionScore,
      risk_score: riskScore,
    },
    
    // リスク
    risk_flags: riskFlags,
    risk_level: riskLevel,
    
    // 特殊判定
    is_new_product: isNewProduct,
    is_variation: false,
    is_variation_candidate: !!(data.color || data.size),
  };
}
