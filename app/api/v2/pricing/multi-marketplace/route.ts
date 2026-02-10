/**
 * 多販路一括利益計算API
 * app/api/v2/pricing/multi-marketplace/route.ts
 * 
 * 統一計算エンジンを使用した正確な利益計算
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateProfit,
  calculateMultiMarketplace,
  getShippingRates,
  getFeeRate,
  getAllExchangeRates,
  type MarketplaceId,
  type ProductCostData,
} from '@/lib/pricing/pricing-engine';

export const dynamic = 'force-dynamic';

// =====================================================
// POST: 一括利益計算
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      costPriceJpy,
      purchasePriceJpy,     // 両方対応
      weightGrams,
      otherCostJpy,
      dutyRate,
      targetMarketplaces,
      targetMargin,
      shippingCodes,        // { ebay_us: 'EBAY_STD', qoo10_jp: 'QOO10_FREE' }
      categoryCodes,        // { qoo10_jp: 'HOBBY' }
    } = body;
    
    // 必須チェック
    const cost = costPriceJpy || purchasePriceJpy;
    if (!cost || cost <= 0) {
      return NextResponse.json({
        success: false,
        error: '仕入れ価格（costPriceJpy）が必要です',
      }, { status: 400 });
    }
    
    // 商品コストデータ
    const productCost: ProductCostData = {
      purchasePriceJpy: cost,
      weightGrams: weightGrams || 500,
      otherCostJpy: otherCostJpy || 0,
      dutyRate: dutyRate || 0,
    };
    
    // 対象マーケットプレイス
    const marketplaces: MarketplaceId[] = targetMarketplaces || [
      'ebay_us',
      'qoo10_jp',
      'shopee_sg',
      'amazon_jp',
    ];
    
    // 各マーケットプレイスで計算
    const results = [];
    
    for (const mp of marketplaces) {
      try {
        const result = await calculateProfit({
          productCost,
          marketplace: mp,
          targetMargin: targetMargin || 15,
          shippingCode: shippingCodes?.[mp],
          categoryCode: categoryCodes?.[mp],
        });
        
        // モール名を追加
        results.push({
          ...result,
          marketplaceName: getMarketplaceName(mp),
          marketplaceColor: getMarketplaceColor(mp),
        });
      } catch (error: any) {
        console.error(`[API] ${mp} 計算エラー:`, error);
        results.push({
          marketplace: mp,
          marketplaceName: getMarketplaceName(mp),
          error: error.message,
        });
      }
    }
    
    // 利益順でソート
    const sortedResults = results
      .filter(r => !r.error)
      .sort((a, b) => (b.profitJpy || 0) - (a.profitJpy || 0));
    
    const profitableResults = sortedResults.filter(r => r.isProfitable);
    const bestResult = profitableResults[0];
    
    return NextResponse.json({
      success: true,
      results: sortedResults,
      errors: results.filter(r => r.error),
      summary: {
        totalCalculated: sortedResults.length,
        profitableCount: profitableResults.length,
        unprofitableCount: sortedResults.length - profitableResults.length,
        bestMarketplace: bestResult?.marketplace || null,
        bestMarketplaceName: bestResult?.marketplaceName || null,
        maxProfitJpy: bestResult?.profitJpy || 0,
        maxProfitMargin: bestResult?.profitMargin || 0,
      },
      input: {
        purchasePriceJpy: cost,
        weightGrams: productCost.weightGrams,
        targetMargin: targetMargin || 15,
      },
      calculatedAt: new Date().toISOString(),
    });
    
  } catch (error: any) {
    console.error('[API] 計算エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// GET: 送料・手数料情報取得
// =====================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const marketplace = searchParams.get('marketplace') as MarketplaceId;
    const action = searchParams.get('action');
    
    // 為替レート一覧
    if (action === 'exchange-rates') {
      const rates = await getAllExchangeRates();
      return NextResponse.json({
        success: true,
        rates,
        updatedAt: new Date().toISOString(),
      });
    }
    
    // 送料一覧
    if (action === 'shipping-rates' && marketplace) {
      const rates = await getShippingRates(marketplace);
      return NextResponse.json({
        success: true,
        marketplace,
        rates,
      });
    }
    
    // 手数料情報
    if (action === 'fee-rates' && marketplace) {
      const categoryCode = searchParams.get('category') || undefined;
      const feeRate = await getFeeRate(marketplace, categoryCode);
      return NextResponse.json({
        success: true,
        marketplace,
        feeRate,
      });
    }
    
    // 簡易計算（URLパラメータ）
    const costJpy = searchParams.get('costJpy');
    const weightGrams = searchParams.get('weightGrams');
    
    if (costJpy) {
      const productCost: ProductCostData = {
        purchasePriceJpy: parseFloat(costJpy),
        weightGrams: weightGrams ? parseInt(weightGrams) : 500,
      };
      
      const targetMp = marketplace || 'ebay_us';
      const result = await calculateProfit({
        productCost,
        marketplace: targetMp,
        targetMargin: 15,
      });
      
      return NextResponse.json({
        success: true,
        result: {
          ...result,
          marketplaceName: getMarketplaceName(targetMp),
        },
      });
    }
    
    // デフォルト: 対応モール一覧
    return NextResponse.json({
      success: true,
      supportedMarketplaces: [
        { id: 'ebay_us', name: 'eBay US', currency: 'USD', enabled: true },
        { id: 'ebay_uk', name: 'eBay UK', currency: 'GBP', enabled: true },
        { id: 'ebay_de', name: 'eBay DE', currency: 'EUR', enabled: true },
        { id: 'ebay_au', name: 'eBay AU', currency: 'AUD', enabled: true },
        { id: 'qoo10_jp', name: 'Qoo10 JP', currency: 'JPY', enabled: true },
        { id: 'qoo10_sg', name: 'Qoo10 SG', currency: 'SGD', enabled: false },
        { id: 'amazon_jp', name: 'Amazon JP', currency: 'JPY', enabled: true },
        { id: 'amazon_us', name: 'Amazon US', currency: 'USD', enabled: false },
        { id: 'shopee_sg', name: 'Shopee SG', currency: 'SGD', enabled: true },
        { id: 'shopee_my', name: 'Shopee MY', currency: 'MYR', enabled: false },
      ],
    });
    
  } catch (error: any) {
    console.error('[API] GETエラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

// =====================================================
// ヘルパー関数
// =====================================================

function getMarketplaceName(mp: MarketplaceId): string {
  const names: Record<MarketplaceId, string> = {
    ebay_us: 'eBay US',
    ebay_uk: 'eBay UK',
    ebay_de: 'eBay DE',
    ebay_au: 'eBay AU',
    qoo10_jp: 'Qoo10 JP',
    qoo10_sg: 'Qoo10 SG',
    amazon_jp: 'Amazon JP',
    amazon_us: 'Amazon US',
    shopee_sg: 'Shopee SG',
    shopee_my: 'Shopee MY',
    shopee_th: 'Shopee TH',
  };
  return names[mp] || mp;
}

function getMarketplaceColor(mp: MarketplaceId): string {
  const colors: Record<string, string> = {
    ebay_us: '#0064d2',
    ebay_uk: '#0064d2',
    ebay_de: '#0064d2',
    ebay_au: '#0064d2',
    qoo10_jp: '#ff0066',
    qoo10_sg: '#ff0066',
    amazon_jp: '#ff9900',
    amazon_us: '#ff9900',
    shopee_sg: '#ee4d2d',
    shopee_my: '#ee4d2d',
    shopee_th: '#ee4d2d',
  };
  return colors[mp] || '#3b82f6';
}
