/**
 * 全販路一括利益計算API
 * /app/api/v2/calculate-all-marketplaces/route.ts
 * 
 * 複数のマーケットプレイスに対して利益計算を一括実行
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
// 手数料率設定
// =====================================================

const MARKETPLACE_FEES: Record<string, { platform: number; payment: number; name: string; currency: string }> = {
  // 海外販路
  'ebay_us': { platform: 13.25, payment: 0, name: 'eBay US', currency: 'USD' },
  'ebay_uk': { platform: 12.8, payment: 0, name: 'eBay UK', currency: 'GBP' },
  'ebay_de': { platform: 12.5, payment: 0, name: 'eBay DE', currency: 'EUR' },
  'ebay_au': { platform: 13.0, payment: 0, name: 'eBay AU', currency: 'AUD' },
  // 国内販路
  'qoo10_jp': { platform: 10, payment: 3.5, name: 'Qoo10', currency: 'JPY' },
  'amazon_jp': { platform: 15, payment: 0, name: 'Amazon JP', currency: 'JPY' },
  'yahoo_auction_jp': { platform: 8.8, payment: 0, name: 'ヤフオク', currency: 'JPY' },
  'mercari_jp': { platform: 10, payment: 0, name: 'メルカリ', currency: 'JPY' },
  'rakuma_jp': { platform: 6, payment: 0, name: 'ラクマ', currency: 'JPY' },
};

// 国内配送料デフォルト
const DEFAULT_DOMESTIC_SHIPPING = 800;

// 為替レート（デフォルト）
const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  USD: 150,
  GBP: 190,
  EUR: 165,
  AUD: 100,
  JPY: 1,
};

// =====================================================
// 型定義
// =====================================================

interface CalculationResult {
  marketplace: string;
  marketplaceName: string;
  currency: string;
  costPrice: number;
  sellingPrice: number;
  platformFee: number;
  paymentFee: number;
  shippingFee: number;
  otherCosts: number;
  totalDeductions: number;
  netProfit: number;
  profitMarginPercent: number;
  isProfitable: boolean;
  warnings: string[];
  calculatedAt: string;
}

interface CalculationRequest {
  productId: number;
  marketplaces?: string[];
  exchangeRates?: Record<string, number>;
  domesticShippingFee?: number;
  internationalShippingFee?: number;
}

// =====================================================
// POST: 全販路計算
// =====================================================

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();
    const { 
      productId, 
      marketplaces = Object.keys(MARKETPLACE_FEES),
      exchangeRates = DEFAULT_EXCHANGE_RATES,
      domesticShippingFee = DEFAULT_DOMESTIC_SHIPPING,
      internationalShippingFee,
    } = body;
    
    if (!productId) {
      return NextResponse.json({
        success: false,
        error: 'productId が必要です',
      }, { status: 400 });
    }
    
    const supabase = getSupabase();
    
    // 商品データ取得
    const { data: product, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (fetchError || !product) {
      return NextResponse.json({
        success: false,
        error: '商品が見つかりません',
      }, { status: 404 });
    }
    
    // 仕入れ価格（円）
    const costPriceJpy = product.purchase_price_jpy || product.price_jpy || product.cost_price || 0;
    
    if (costPriceJpy <= 0) {
      return NextResponse.json({
        success: false,
        error: '仕入れ価格が設定されていません',
      }, { status: 400 });
    }
    
    // 国際送料（既存データから取得またはデフォルト）
    const intlShipping = internationalShippingFee || product.shipping_cost_usd || 30;
    
    const results: CalculationResult[] = [];
    const marketplaceListingsUpdate: Record<string, any> = {};
    
    // 各マーケットプレイスで計算
    for (const mp of marketplaces) {
      const feeConfig = MARKETPLACE_FEES[mp];
      if (!feeConfig) continue;
      
      const isDomestic = feeConfig.currency === 'JPY';
      const warnings: string[] = [];
      
      // 通貨換算
      const rate = exchangeRates[feeConfig.currency] || 1;
      
      // 販売価格を取得（既存データから）
      let sellingPrice: number;
      if (isDomestic) {
        // 国内: 円価格
        sellingPrice = product.domestic_price_jpy || 
                       product.marketplace_listings?.[mp]?.listed_price || 
                       Math.round(costPriceJpy * 1.3); // デフォルト30%マージン
      } else {
        // 海外: 外貨価格
        sellingPrice = product.marketplace_listings?.[mp]?.listed_price || 
                       product.price_usd || 
                       product.ddp_price_usd || 
                       Math.round((costPriceJpy / rate) * 1.3);
      }
      
      // 手数料計算
      const platformFee = Math.round(sellingPrice * (feeConfig.platform / 100) * 100) / 100;
      const paymentFee = Math.round(sellingPrice * (feeConfig.payment / 100) * 100) / 100;
      
      // 送料
      const shippingFee = isDomestic ? domesticShippingFee : intlShipping;
      
      // その他コスト（梱包費等）
      const otherCosts = isDomestic ? 100 : 0;
      
      // コストを販売通貨に換算
      let costInSellingCurrency: number;
      if (isDomestic) {
        costInSellingCurrency = costPriceJpy;
      } else {
        costInSellingCurrency = Math.round((costPriceJpy / rate) * 100) / 100;
      }
      
      // 合計控除
      const totalDeductions = costInSellingCurrency + platformFee + paymentFee + shippingFee + otherCosts;
      
      // 純利益
      const netProfit = Math.round((sellingPrice - totalDeductions) * 100) / 100;
      
      // 利益率
      const profitMarginPercent = sellingPrice > 0 
        ? Math.round((netProfit / sellingPrice) * 1000) / 10 
        : 0;
      
      // 警告チェック
      if (netProfit <= 0) {
        warnings.push('赤字です！販売価格を見直してください。');
      } else if (profitMarginPercent < 10) {
        warnings.push('利益率が低すぎます（10%未満）');
      }
      
      const result: CalculationResult = {
        marketplace: mp,
        marketplaceName: feeConfig.name,
        currency: feeConfig.currency,
        costPrice: costInSellingCurrency,
        sellingPrice,
        platformFee,
        paymentFee,
        shippingFee,
        otherCosts,
        totalDeductions,
        netProfit,
        profitMarginPercent,
        isProfitable: netProfit > 0,
        warnings,
        calculatedAt: new Date().toISOString(),
      };
      
      results.push(result);
      
      // marketplace_listings更新用データ
      marketplaceListingsUpdate[mp] = {
        ...(product.marketplace_listings?.[mp] || {}),
        listed_price: sellingPrice,
        profit_calculation: {
          net_profit: netProfit,
          profit_margin_percent: profitMarginPercent,
          platform_fee: platformFee,
          payment_fee: paymentFee,
          shipping_fee: shippingFee,
          total_deductions: totalDeductions,
          is_profitable: netProfit > 0,
          calculated_at: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      };
    }
    
    // DB更新
    const { error: updateError } = await supabase
      .from('products_master')
      .update({
        marketplace_listings: {
          ...(product.marketplace_listings || {}),
          ...marketplaceListingsUpdate,
        },
      })
      .eq('id', productId);
    
    if (updateError) {
      console.error('[Calculate All] DB更新エラー:', updateError);
    }
    
    // サマリー計算
    const summary = {
      total: results.length,
      profitable: results.filter(r => r.isProfitable).length,
      unprofitable: results.filter(r => !r.isProfitable).length,
      avgProfitMargin: results.length > 0 
        ? Math.round(results.reduce((sum, r) => sum + r.profitMarginPercent, 0) / results.length * 10) / 10
        : 0,
      totalProfit: {
        JPY: results.filter(r => r.currency === 'JPY').reduce((sum, r) => sum + r.netProfit, 0),
        USD: results.filter(r => r.currency === 'USD').reduce((sum, r) => sum + r.netProfit, 0),
        GBP: results.filter(r => r.currency === 'GBP').reduce((sum, r) => sum + r.netProfit, 0),
        EUR: results.filter(r => r.currency === 'EUR').reduce((sum, r) => sum + r.netProfit, 0),
      },
    };
    
    return NextResponse.json({
      success: true,
      productId,
      costPriceJpy,
      results,
      summary,
      savedToDb: !updateError,
    });
    
  } catch (error: any) {
    console.error('[Calculate All Marketplaces] エラー:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
