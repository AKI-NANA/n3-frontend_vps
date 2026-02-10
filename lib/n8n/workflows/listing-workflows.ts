// lib/n8n/workflows/listing-workflows.ts
/**
 * 出品関連のn8nワークフロー定義
 * 
 * Phase A-2: 全実行を dispatchService 経由に統一
 */

import { dispatchService } from '../n8n-client';

export interface ListingRequest {
  productId: string;
  platform: 'ebay' | 'amazon' | 'qoo10' | 'shopee' | 'mercari';
  options?: {
    immediate?: boolean;
    scheduled?: Date;
    priority?: 'low' | 'normal' | 'high';
    testMode?: boolean;
  };
}

export class ListingWorkflows {
  /**
   * 商品を出品
   */
  async executeListing(request: ListingRequest) {
    return dispatchService.execute({
      toolId: 'listing-execute',
      action: `list-to-${request.platform}`,
      params: {
        product_id: request.productId,
        platform: request.platform,
        test_mode: request.options?.testMode || false,
        scheduled_time: request.options?.scheduled?.toISOString(),
      },
      options: {
        priority: request.options?.priority === 'high' ? 1 : 
                  request.options?.priority === 'low' ? 10 : 5,
      }
    });
  }

  /**
   * バッチ出品（複数商品を一括）
   */
  async executeBatchListing(productIds: string[], platform: string) {
    return dispatchService.execute({
      toolId: 'listing-execute',
      action: 'batch-list',
      params: {
        product_ids: productIds,
        platform,
        batch_size: 10,
        interval_seconds: 30,
      },
      options: {
        timeout: 300, // 5分
      }
    });
  }

  /**
   * 出品スケジュールを作成
   */
  async createSchedule(schedule: {
    productIds: string[];
    platform: string;
    startTime: Date;
    interval: number;
  }) {
    return dispatchService.execute({
      toolId: 'listing-execute',
      action: 'create-schedule',
      params: {
        product_ids: schedule.productIds,
        platform: schedule.platform,
        start_time: schedule.startTime.toISOString(),
        interval_minutes: schedule.interval,
      }
    });
  }

  /**
   * 出品ステータスを確認
   */
  async checkListingStatus(jobId: string) {
    return dispatchService.getJobStatus(jobId);
  }

  /**
   * エラー商品を再出品
   */
  async retryFailedListings(platform?: string) {
    return dispatchService.execute({
      toolId: 'listing-error-recovery',
      action: 'retry-failed',
      params: {
        platform: platform || 'all',
        max_retry: 3,
      }
    });
  }

  /**
   * 出品を終了
   */
  async endListing(itemId: string, platform: string) {
    return dispatchService.execute({
      toolId: 'ebay-listing',
      action: 'end-item',
      params: {
        item_id: itemId,
        platform,
        reason: 'NotAvailable',
      }
    });
  }

  /**
   * 価格・在庫を更新
   */
  async updateListing(itemId: string, platform: string, updates: {
    price?: number;
    quantity?: number;
    title?: string;
    description?: string;
  }) {
    return dispatchService.execute({
      toolId: 'ebay-listing',
      action: 'revise-item',
      params: {
        item_id: itemId,
        platform,
        updates,
      }
    });
  }
}

export const listingWorkflows = new ListingWorkflows();
