// app/api/listing/bulk/route.ts
/**
 * 一括出品APIエンドポイント
 * 
 * POST /api/listing/bulk
 * - 複数商品を一括でeBayに出品
 * - レートリミット管理
 * - 進捗通知対応
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  executeBulkListing, 
  validateBulkListingRequest,
  type BulkListingRequest 
} from '@/lib/services/listing/bulk-listing-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const listingRequest: BulkListingRequest = {
      products: body.products || [],
      options: {
        account: body.account || 'MJT',
        dryRun: body.dryRun ?? false,
        batchSize: body.batchSize || 10,
        delayBetweenBatchesMs: body.delayBetweenBatchesMs || 5000,
        retryFailedItems: body.retryFailedItems ?? true,
        notifyProgress: body.notifyProgress ?? false,
        useEbaymagPolicies: body.useEbaymagPolicies ?? false,
      },
    };
    
    // バリデーション
    const validation = validateBulkListingRequest(listingRequest);
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.errors.join('\n'),
        warnings: validation.warnings,
      }, { status: 400 });
    }
    
    // 一括出品実行
    const result = await executeBulkListing(listingRequest);
    
    return NextResponse.json({
      success: result.success,
      totalRequested: result.totalRequested,
      successCount: result.successCount,
      failedCount: result.failedCount,
      results: result.results,
      totalFees: result.totalFees,
      processingTimeMs: result.processingTimeMs,
      rateLimitInfo: result.rateLimitInfo,
      warnings: validation.warnings,
    });
    
  } catch (error) {
    console.error('[API] Bulk listing error:', error);
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
