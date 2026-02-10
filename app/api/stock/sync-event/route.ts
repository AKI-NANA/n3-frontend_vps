/**
 * 在庫同期 Webhook エンドポイント
 * POST /api/stock/sync-event
 * 
 * 各販路からの販売通知を受け取り、Global Stock Killerを起動
 */

import { NextRequest, NextResponse } from 'next/server';
import { processSaleEvent, type SaleEvent } from '@/lib/marketplace/global-stock-killer';
import type { MarketplaceId } from '@/lib/marketplace/multi-marketplace-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // リクエストの検証
    if (!body.product_master_id && !body.productMasterId) {
      return NextResponse.json(
        { error: 'product_master_id is required' },
        { status: 400 }
      );
    }
    
    if (!body.source_marketplace && !body.sourceMarketplace) {
      return NextResponse.json(
        { error: 'source_marketplace is required' },
        { status: 400 }
      );
    }
    
    // SaleEventを構築
    const saleEvent: SaleEvent = {
      eventType: body.event_type || body.eventType || 'sale',
      sourceMarketplace: (body.source_marketplace || body.sourceMarketplace) as MarketplaceId,
      productMasterId: body.product_master_id || body.productMasterId,
      inventoryMasterId: body.inventory_master_id || body.inventoryMasterId,
      quantityChange: body.quantity_change ?? body.quantityChange ?? -1,
      orderNumber: body.order_number || body.orderNumber,
      externalItemId: body.external_item_id || body.externalItemId || body.item_id || body.itemId,
      timestamp: new Date(),
      metadata: body.metadata,
    };
    
    console.log('[API /stock/sync-event] 受信:', JSON.stringify(saleEvent));
    
    // Global Stock Killer実行
    const result = await processSaleEvent(saleEvent);
    
    // 結果を返す
    return NextResponse.json({
      success: result.success,
      productMasterId: result.productMasterId,
      physicalQuantityBefore: result.physicalQuantityBefore,
      physicalQuantityAfter: result.physicalQuantityAfter,
      affectedMarketplaces: result.affectedMarketplaces.length,
      executionTimeMs: result.totalExecutionTimeMs,
      warnings: result.warnings,
    });
    
  } catch (error) {
    console.error('[API /stock/sync-event] エラー:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Webhook検証用（GET）
export async function GET(request: NextRequest) {
  // eBayやShopeeのWebhook検証リクエストに対応
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');
  
  if (challenge) {
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    status: 'ok',
    endpoint: '/api/stock/sync-event',
    methods: ['POST'],
    description: 'Global Stock Killer - 販売イベント受信エンドポイント',
    requiredFields: {
      product_master_id: 'number (required)',
      source_marketplace: 'string (required) - ebay_us, shopee_sg, amazon_jp, etc.',
      event_type: 'string (optional) - sale, return, cancel, adjustment (default: sale)',
      quantity_change: 'number (optional) - default: -1',
      order_number: 'string (optional)',
      external_item_id: 'string (optional)',
    },
  });
}
