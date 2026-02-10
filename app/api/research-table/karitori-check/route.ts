// app/api/research-table/karitori-check/route.ts
/**
 * カリトリ（価格監視）チェックAPI
 * 
 * 機能:
 * - 監視中商品の現在価格を取得
 * - 目標価格到達をチェック
 * - アラート生成
 * - 価格履歴を記録
 * 
 * 必要な環境変数:
 * - KEEPA_API_KEY
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// ============================================================
// 型定義
// ============================================================

interface WatchingItem {
  id: string;
  asin?: string;
  title: string;
  target_price_jpy: number;
  current_amazon_price: number;
  karitori_status: string;
  supplier_url?: string;
}

interface PriceCheckResult {
  id: string;
  asin: string;
  previousPrice: number;
  currentPrice: number;
  targetPrice: number;
  priceDrop: number;
  priceDropPercent: number;
  targetReached: boolean;
}

// ============================================================
// Keepa価格取得
// ============================================================

async function fetchCurrentPrices(asins: string[]): Promise<Map<string, number>> {
  const apiKey = process.env.KEEPA_API_KEY;
  const priceMap = new Map<string, number>();
  
  if (!apiKey) {
    // モック価格（ランダムに変動）
    asins.forEach(asin => {
      const basePrice = 3000 + Math.random() * 7000;
      const variation = (Math.random() - 0.5) * 1000;
      priceMap.set(asin, Math.round(basePrice + variation));
    });
    return priceMap;
  }

  try {
    const url = new URL('https://api.keepa.com/product');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('domain', '5'); // Amazon Japan
    url.searchParams.set('asin', asins.join(','));
    url.searchParams.set('stats', '1');

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.error || !data.products) {
      console.error('Keepa API error:', data.error);
      return priceMap;
    }

    for (const product of data.products) {
      let price = 0;
      
      // Amazon価格 → FBA → 新品最安値の順で取得
      if (product.csv) {
        const csvTypes = [0, 10, 1]; // Amazon, NewFBA, New
        for (const type of csvTypes) {
          if (product.csv[type] && product.csv[type].length >= 2) {
            const latestPrice = product.csv[type][product.csv[type].length - 1];
            if (latestPrice > 0) {
              price = latestPrice / 100;
              break;
            }
          }
        }
      }
      
      if (price > 0) {
        priceMap.set(product.asin, price);
      }
    }

    return priceMap;

  } catch (error) {
    console.error('Keepa fetch error:', error);
    return priceMap;
  }
}

// ============================================================
// メインハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { checkAll = false, ids } = body;

    const supabase = await createClient();

    // 監視中アイテムを取得
    let query = supabase
      .from('research_repository')
      .select('*')
      .eq('karitori_status', 'watching')
      .not('asin', 'is', null);

    if (!checkAll && ids && Array.isArray(ids)) {
      query = query.in('id', ids);
    }

    const { data: watchingItems, error: fetchError } = await query;

    if (fetchError) {
      throw new Error(`データ取得エラー: ${fetchError.message}`);
    }

    if (!watchingItems || watchingItems.length === 0) {
      return NextResponse.json({
        success: true,
        checked: 0,
        message: '監視中の商品がありません',
      });
    }

    // ASINリストを取得
    const asins = watchingItems
      .filter((item: WatchingItem) => item.asin)
      .map((item: WatchingItem) => item.asin!);

    if (asins.length === 0) {
      return NextResponse.json({
        success: true,
        checked: 0,
        message: 'ASINが設定された商品がありません',
      });
    }

    // 現在価格を取得
    const currentPrices = await fetchCurrentPrices(asins);
    
    const hasApiKey = !!process.env.KEEPA_API_KEY;
    const results: PriceCheckResult[] = [];
    const alerts: PriceCheckResult[] = [];

    // 各アイテムをチェック
    for (const item of watchingItems as WatchingItem[]) {
      if (!item.asin) continue;
      
      const currentPrice = currentPrices.get(item.asin);
      if (currentPrice === undefined) continue;

      const previousPrice = item.current_amazon_price || currentPrice;
      const targetPrice = item.target_price_jpy || 0;
      const priceDrop = previousPrice - currentPrice;
      const priceDropPercent = previousPrice > 0 
        ? (priceDrop / previousPrice) * 100 
        : 0;
      const targetReached = targetPrice > 0 && currentPrice <= targetPrice;

      const result: PriceCheckResult = {
        id: item.id,
        asin: item.asin,
        previousPrice,
        currentPrice,
        targetPrice,
        priceDrop,
        priceDropPercent: Math.round(priceDropPercent * 10) / 10,
        targetReached,
      };

      results.push(result);

      // 価格更新
      const updateData: any = {
        current_amazon_price: currentPrice,
        price_checked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 価格履歴を追加
      const priceHistory = item.price_history ? JSON.parse(item.price_history) : [];
      priceHistory.push({
        price: currentPrice,
        checkedAt: new Date().toISOString(),
      });
      // 最新100件のみ保持
      if (priceHistory.length > 100) {
        priceHistory.shift();
      }
      updateData.price_history = JSON.stringify(priceHistory);

      // 目標価格到達の場合
      if (targetReached) {
        updateData.karitori_status = 'alert';
        alerts.push(result);
      }

      await supabase
        .from('research_repository')
        .update(updateData)
        .eq('id', item.id);
    }

    return NextResponse.json({
      success: true,
      checked: results.length,
      alerts: alerts.length,
      alertItems: alerts,
      results: results.slice(0, 20), // 上位20件を返す
      apiMode: hasApiKey ? 'keepa' : 'mock',
      stats: {
        avgPriceDrop: results.length > 0 
          ? Math.round(results.reduce((s, r) => s + r.priceDrop, 0) / results.length)
          : 0,
        priceDropCount: results.filter(r => r.priceDrop > 0).length,
        priceRiseCount: results.filter(r => r.priceDrop < 0).length,
      },
    });

  } catch (error: any) {
    console.error('Karitori check error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await createClient();
  
  // 監視統計を取得
  const { data: watchingItems, count: watchingCount } = await supabase
    .from('research_repository')
    .select('*', { count: 'exact' })
    .eq('karitori_status', 'watching');

  const { count: alertCount } = await supabase
    .from('research_repository')
    .select('*', { count: 'exact' })
    .eq('karitori_status', 'alert');

  return NextResponse.json({
    status: 'ok',
    api: 'karitori-check',
    keepaConfigured: !!process.env.KEEPA_API_KEY,
    stats: {
      watching: watchingCount || 0,
      alerts: alertCount || 0,
    },
  });
}
