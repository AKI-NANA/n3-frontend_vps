// lib/n8n/workflows/listing-workflows.ts
/**
 * 出品関連のn8nワークフロー定義
 */

import { n8nClient } from '../n8n-client';

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
    return n8nClient.execute({
      workflow: 'listing-execute',
      action: `list-to-${request.platform}`,
      data: {
        product_id: request.productId,
        platform: request.platform,
        test_mode: request.options?.testMode || false,
        scheduled_time: request.options?.scheduled?.toISOString(),
      },
      options: {
        priority: request.options?.priority,
        async: !request.options?.immediate,
      }
    });
  }

  /**
   * バッチ出品（複数商品を一括）
   */
  async executeBatchListing(productIds: string[], platform: string) {
    return n8nClient.execute({
      workflow: 'listing-batch',
      action: 'batch-list',
      data: {
        product_ids: productIds,
        platform,
        batch_size: 10,
        interval_seconds: 30,
      },
      options: {
        async: true,
        timeout: 300000, // 5分
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
    return n8nClient.execute({
      workflow: 'listing-schedule',
      action: 'create-schedule',
      data: {
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
    return n8nClient.getJobStatus(jobId);
  }

  /**
   * エラー商品を再出品
   */
  async retryFailedListings(platform?: string) {
    return n8nClient.execute({
      workflow: 'listing-retry',
      action: 'retry-failed',
      data: {
        platform: platform || 'all',
        max_retry: 3,
      }
    });
  }

  /**
   * 出品を終了
   */
  async endListing(itemId: string, platform: string) {
    return n8nClient.execute({
      workflow: 'listing-end',
      action: 'end-item',
      data: {
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
    return n8nClient.execute({
      workflow: 'listing-update',
      action: 'revise-item',
      data: {
        item_id: itemId,
        platform,
        updates,
      }
    });
  }
}

export const listingWorkflows = new ListingWorkflows();
