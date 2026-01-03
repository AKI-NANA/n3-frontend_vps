// app/api/validation/listing-check/route.ts
/**
 * 出品前バリデーションAPI
 * 
 * 機能:
 * 1. 単一商品のバリデーション
 * 2. 複数商品の一括バリデーション
 * 3. バリデーション結果のサマリー
 * 
 * エンドポイント: POST /api/validation/listing-check
 * 
 * @version 1.0.0
 * @date 2025-12-21
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { 
  validateForListing, 
  validateProducts, 
  getValidationSummary,
  type ValidationResult,
  type ValidationConfig
} from '@/lib/validation/listing-validator';

interface ListingCheckRequest {
  // 単一商品の場合
  productId?: string | number;
  
  // 複数商品の場合
  productIds?: (string | number)[];
  
  // 直接商品データを渡す場合
  productData?: any;
  productsData?: any[];
  
  // バリデーション設定
  config?: Partial<ValidationConfig>;
  
  // オプション
  includeSummary?: boolean;
  strictMode?: boolean;
}

interface ListingCheckResponse {
  success: boolean;
  
  // 単一商品の結果
  result?: ValidationResult;
  
  // 複数商品の結果
  results?: Record<string, ValidationResult>;
  
  // サマリー
  summary?: {
    total: number;
    valid: number;
    invalid: number;
    averageCompletion: number;
    commonErrors: Array<{ field: string; count: number }>;
  };
  
  error?: string;
}

export async function POST(request: Request) {
  try {
    const body: ListingCheckRequest = await request.json();
    const {
      productId,
      productIds,
      productData,
      productsData,
      config = {},
      includeSummary = true,
      strictMode = false
    } = body;
    
    const validationConfig: Partial<ValidationConfig> = {
      ...config,
      strictMode
    };
    
    // ============================================================
    // Case 1: 直接商品データが渡された場合
    // ============================================================
    
    if (productData) {
      const result = validateForListing(productData, validationConfig);
      return NextResponse.json({
        success: true,
        result
      });
    }
    
    if (productsData && productsData.length > 0) {
      const resultsMap = validateProducts(productsData, validationConfig);
      const results: Record<string, ValidationResult> = {};
      resultsMap.forEach((value, key) => {
        results[key] = value;
      });
      
      const response: ListingCheckResponse = {
        success: true,
        results
      };
      
      if (includeSummary) {
        response.summary = getValidationSummary(resultsMap);
      }
      
      return NextResponse.json(response);
    }
    
    // ============================================================
    // Case 2: 商品IDでDBから取得する場合
    // ============================================================
    
    const supabase = await createClient();
    
    // 単一商品
    if (productId) {
      const { data: product, error } = await supabase
        .from('products_master')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error || !product) {
        return NextResponse.json(
          { success: false, error: '商品が見つかりません' },
          { status: 404 }
        );
      }
      
      const result = validateForListing(product, validationConfig);
      return NextResponse.json({
        success: true,
        result
      });
    }
    
    // 複数商品
    if (productIds && productIds.length > 0) {
      const { data: products, error } = await supabase
        .from('products_master')
        .select('*')
        .in('id', productIds);
      
      if (error) {
        return NextResponse.json(
          { success: false, error: 'データ取得エラー' },
          { status: 500 }
        );
      }
      
      if (!products || products.length === 0) {
        return NextResponse.json(
          { success: false, error: '商品が見つかりません' },
          { status: 404 }
        );
      }
      
      const resultsMap = validateProducts(products, validationConfig);
      const results: Record<string, ValidationResult> = {};
      resultsMap.forEach((value, key) => {
        results[key] = value;
      });
      
      const response: ListingCheckResponse = {
        success: true,
        results
      };
      
      if (includeSummary) {
        response.summary = getValidationSummary(resultsMap);
      }
      
      return NextResponse.json(response);
    }
    
    // パラメータ不足
    return NextResponse.json(
      { success: false, error: 'productId, productIds, productData, または productsData が必要です' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('[Validation API] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || '不明なエラー' },
      { status: 500 }
    );
  }
}

// ============================================================
// GETハンドラ（ヘルスチェック）
// ============================================================

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Listing Validation',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
