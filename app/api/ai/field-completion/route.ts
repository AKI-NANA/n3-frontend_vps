// app/api/ai/field-completion/route.ts
/**
 * フィールド補完APIエンドポイント
 * 
 * POST /api/ai/field-completion
 * - 欠落フィールドのピンポイントAI補完
 * - Gemini 1.5 Flash固定でコスト最小化
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  completeProductFields,
  completeProductsFields,
  estimateCompletionCost,
  type FieldCompletionRequest,
  type CompletableField,
} from '@/lib/services/ai/field-completion-service';
import type { Product } from '@/app/tools/editing/types/product';
import type { ProductAuditReport } from '@/lib/services/audit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 単一商品補完
    if (body.productId && body.missingFields) {
      const req: FieldCompletionRequest = {
        productId: body.productId,
        title: body.title || '',
        category: body.category,
        existingData: body.existingData || {},
        missingFields: body.missingFields as CompletableField[],
      };
      
      const result = await completeProductFields(req);
      
      return NextResponse.json({
        success: true,
        result,
      });
    }
    
    // 複数商品補完
    if (body.products && body.auditReports) {
      const { products, auditReports } = body as {
        products: Product[];
        auditReports: ProductAuditReport[];
      };
      
      const batchResult = await completeProductsFields(products, auditReports);
      
      return NextResponse.json({
        success: batchResult.success,
        results: batchResult.results,
        totalTokens: batchResult.totalTokens,
        totalCostUsd: batchResult.totalCostUsd,
        totalTimeMs: batchResult.totalTimeMs,
        errors: batchResult.errors,
      });
    }
    
    // コスト見積もり
    if (body.estimateOnly) {
      const estimate = estimateCompletionCost(
        body.productCount || 1,
        body.averageFieldsPerProduct || 2
      );
      
      return NextResponse.json({
        success: true,
        estimate,
      });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid request. Provide productId+missingFields, or products+auditReports.',
    }, { status: 400 });
    
  } catch (error) {
    console.error('[API] Field completion error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
