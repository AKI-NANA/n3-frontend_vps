/**
 * Yahoo Auction 利益計算 API
 * 
 * POST /api/v2/yahooauction/calculate-profit
 * 
 * 機能:
 * - 単品の利益計算
 * - 複数商品の一括計算
 * - 価格シミュレーション
 * - 推奨価格の提案
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateYahooAuctionProfit,
  simulatePrice,
  calculateRecommendedPrice,
  calculateBatchProfit,
  calculateProfitSummary,
  YahooAuctionMemberType,
} from '@/lib/yahooauction';

// ============================================================
// 型定義
// ============================================================

interface SingleCalculationRequest {
  mode: 'single';
  costPrice: number;
  targetRecoveryRate: number;
  memberType: YahooAuctionMemberType;
  shippingCost: number;
  packagingCost?: number;
  marketPrice?: number;
}

interface SimulationRequest {
  mode: 'simulation';
  costPrice: number;
  sellingPrice: number;
  memberType: YahooAuctionMemberType;
  shippingCost: number;
  packagingCost?: number;
}

interface RecommendationRequest {
  mode: 'recommend';
  costPrice: number;
  memberType: YahooAuctionMemberType;
  shippingCost: number;
  packagingCost?: number;
  marketPrice?: number;
  targetProfitMargin?: number;
  minimumRecoveryRate?: number;
}

interface BatchCalculationRequest {
  mode: 'batch';
  memberType: YahooAuctionMemberType;
  targetRecoveryRate: number;
  items: Array<{
    id: number | string;
    costPrice: number;
    shippingCost: number;
    marketPrice?: number;
    packagingCost?: number;
  }>;
}

type CalculationRequest = 
  | SingleCalculationRequest 
  | SimulationRequest 
  | RecommendationRequest 
  | BatchCalculationRequest;

// ============================================================
// API ハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: CalculationRequest = await request.json();

    // バリデーション
    if (!body.mode) {
      return NextResponse.json(
        { success: false, error: 'mode is required (single, simulation, recommend, batch)' },
        { status: 400 }
      );
    }

    switch (body.mode) {
      case 'single': {
        const { costPrice, targetRecoveryRate, memberType, shippingCost, packagingCost, marketPrice } = body;
        
        if (typeof costPrice !== 'number' || costPrice <= 0) {
          return NextResponse.json(
            { success: false, error: 'costPrice must be a positive number' },
            { status: 400 }
          );
        }

        const result = calculateYahooAuctionProfit({
          costPrice,
          targetRecoveryRate: targetRecoveryRate || 100,
          memberType: memberType || 'lyp_premium',
          shippingCost: shippingCost || 0,
          packagingCost,
          marketPrice,
        });

        return NextResponse.json({
          success: true,
          mode: 'single',
          result,
        });
      }

      case 'simulation': {
        const { costPrice, sellingPrice, memberType, shippingCost, packagingCost } = body;

        if (typeof costPrice !== 'number' || costPrice <= 0) {
          return NextResponse.json(
            { success: false, error: 'costPrice must be a positive number' },
            { status: 400 }
          );
        }

        if (typeof sellingPrice !== 'number' || sellingPrice <= 0) {
          return NextResponse.json(
            { success: false, error: 'sellingPrice must be a positive number' },
            { status: 400 }
          );
        }

        const result = simulatePrice({
          costPrice,
          sellingPrice,
          memberType: memberType || 'lyp_premium',
          shippingCost: shippingCost || 0,
          packagingCost,
        });

        return NextResponse.json({
          success: true,
          mode: 'simulation',
          result,
        });
      }

      case 'recommend': {
        const { 
          costPrice, memberType, shippingCost, packagingCost, 
          marketPrice, targetProfitMargin, minimumRecoveryRate 
        } = body;

        if (typeof costPrice !== 'number' || costPrice <= 0) {
          return NextResponse.json(
            { success: false, error: 'costPrice must be a positive number' },
            { status: 400 }
          );
        }

        const result = calculateRecommendedPrice(
          costPrice,
          memberType || 'lyp_premium',
          shippingCost || 0,
          packagingCost,
          {
            marketPrice,
            targetProfitMargin,
            minimumRecoveryRate,
          }
        );

        return NextResponse.json({
          success: true,
          mode: 'recommend',
          result,
        });
      }

      case 'batch': {
        const { memberType, targetRecoveryRate, items } = body;

        if (!Array.isArray(items) || items.length === 0) {
          return NextResponse.json(
            { success: false, error: 'items must be a non-empty array' },
            { status: 400 }
          );
        }

        if (items.length > 500) {
          return NextResponse.json(
            { success: false, error: 'Maximum 500 items per batch' },
            { status: 400 }
          );
        }

        const results = calculateBatchProfit(
          items,
          memberType || 'lyp_premium',
          targetRecoveryRate || 100
        );

        const summary = calculateProfitSummary(results);

        return NextResponse.json({
          success: true,
          mode: 'batch',
          count: results.length,
          summary,
          results,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown mode: ${(body as any).mode}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[API] Yahoo Auction calculate-profit error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: ヘルスチェック
export async function GET() {
  return NextResponse.json({
    success: true,
    endpoint: '/api/v2/yahooauction/calculate-profit',
    version: '1.0.0',
    modes: ['single', 'simulation', 'recommend', 'batch'],
    memberTypes: ['lyp_premium', 'standard'],
    feeRates: {
      lyp_premium: '8.8%',
      standard: '10%',
    },
    examples: {
      single: {
        mode: 'single',
        costPrice: 111000,
        targetRecoveryRate: 30,
        memberType: 'lyp_premium',
        shippingCost: 1650,
        marketPrice: 32000,
      },
      simulation: {
        mode: 'simulation',
        costPrice: 111000,
        sellingPrice: 38000,
        memberType: 'lyp_premium',
        shippingCost: 1650,
      },
      recommend: {
        mode: 'recommend',
        costPrice: 111000,
        memberType: 'lyp_premium',
        shippingCost: 1650,
        marketPrice: 32000,
        targetProfitMargin: 15,
        minimumRecoveryRate: 30,
      },
      batch: {
        mode: 'batch',
        memberType: 'lyp_premium',
        targetRecoveryRate: 50,
        items: [
          { id: 1, costPrice: 10000, shippingCost: 800 },
          { id: 2, costPrice: 25000, shippingCost: 1200, marketPrice: 20000 },
        ],
      },
    },
  });
}
