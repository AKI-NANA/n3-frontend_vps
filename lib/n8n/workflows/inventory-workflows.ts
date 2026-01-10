// lib/n8n/workflows/inventory-workflows.ts
/**
 * 在庫管理関連のn8nワークフロー定義
 */

import { n8nClient } from '../n8n-client';

export interface InventorySyncRequest {
  platforms?: string[];
  skus?: string[];
  fullSync?: boolean;
}

export class InventoryWorkflows {
  /**
   * 在庫同期を実行
   */
  async syncInventory(request: InventorySyncRequest = {}) {
    return n8nClient.execute({
      workflow: 'inventory-sync',
      action: 'sync-all',
      data: {
        platforms: request.platforms || ['ebay', 'amazon'],
        skus: request.skus,
        full_sync: request.fullSync || false,
      },
      options: {
        timeout: 120000, // 2分
      }
    });
  }

  /**
   * プラットフォーム別在庫取得
   */
  async getInventory(platform: string, sku?: string) {
    return n8nClient.execute({
      workflow: 'inventory-get',
      action: `get-${platform}-inventory`,
      data: {
        platform,
        sku,
      }
    });
  }

  /**
   * 在庫数を更新
   */
  async updateStock(updates: Array<{
    sku: string;
    quantity: number;
    platforms?: string[];
  }>) {
    return n8nClient.execute({
      workflow: 'inventory-update',
      action: 'update-stock',
      data: {
        updates,
        sync_immediately: true,
      }
    });
  }

  /**
   * 在庫アラート設定
   */
  async setStockAlert(sku: string, threshold: number) {
    return n8nClient.execute({
      workflow: 'inventory-alert',
      action: 'set-alert',
      data: {
        sku,
        threshold,
        notification_channel: 'slack',
      }
    });
  }

  /**
   * 在庫レポート生成
   */
  async generateInventoryReport(options: {
    format: 'csv' | 'excel' | 'json';
    dateRange?: { start: Date; end: Date };
  }) {
    return n8nClient.execute({
      workflow: 'inventory-report',
      action: 'generate-report',
      data: {
        format: options.format,
        start_date: options.dateRange?.start.toISOString(),
        end_date: options.dateRange?.end.toISOString(),
      }
    });
  }

  /**
   * FBA在庫を同期
   */
  async syncFBAInventory() {
    return n8nClient.execute({
      workflow: 'inventory-fba',
      action: 'sync-fba',
      data: {
        marketplace_id: 'ATVPDKIKX0DER',
      }
    });
  }

  /**
   * 在庫履歴を取得
   */
  async getInventoryHistory(sku: string, days: number = 30) {
    return n8nClient.execute({
      workflow: 'inventory-history',
      action: 'get-history',
      data: {
        sku,
        days,
      }
    });
  }

  /**
   * 在庫予測
   */
  async predictStockout(skus?: string[]) {
    return n8nClient.execute({
      workflow: 'inventory-prediction',
      action: 'predict-stockout',
      data: {
        skus: skus || 'all',
        forecast_days: 30,
      }
    });
  }
}

export const inventoryWorkflows = new InventoryWorkflows();
