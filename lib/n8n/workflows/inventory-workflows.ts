// lib/n8n/workflows/inventory-workflows.ts
/**
 * 在庫管理関連のn8nワークフロー定義
 * 
 * Phase A-2: 全実行を dispatchService 経由に統一
 */

import { dispatchService } from '../n8n-client';

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
    return dispatchService.execute({
      toolId: 'stock-killer',
      action: 'sync-all',
      params: {
        platforms: request.platforms || ['ebay', 'amazon'],
        skus: request.skus,
        full_sync: request.fullSync || false,
      },
      options: {
        timeout: 120,
      }
    });
  }

  /**
   * プラットフォーム別在庫取得
   */
  async getInventory(platform: string, sku?: string) {
    return dispatchService.execute({
      toolId: 'inventory-monitoring',
      action: `get-${platform}-inventory`,
      params: {
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
    return dispatchService.execute({
      toolId: 'stock-killer',
      action: 'update-stock',
      params: {
        updates,
        sync_immediately: true,
      }
    });
  }

  /**
   * 在庫アラート設定
   */
  async setStockAlert(sku: string, threshold: number) {
    return dispatchService.execute({
      toolId: 'inventory-monitoring',
      action: 'set-alert',
      params: {
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
    return dispatchService.execute({
      toolId: 'inventory-monitoring',
      action: 'generate-report',
      params: {
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
    return dispatchService.execute({
      toolId: 'stock-killer',
      action: 'sync-fba',
      params: {
        marketplace_id: 'ATVPDKIKX0DER',
      }
    });
  }

  /**
   * 在庫履歴を取得
   */
  async getInventoryHistory(sku: string, days: number = 30) {
    return dispatchService.execute({
      toolId: 'inventory-monitoring',
      action: 'get-history',
      params: {
        sku,
        days,
      }
    });
  }

  /**
   * 在庫予測
   */
  async predictStockout(skus?: string[]) {
    return dispatchService.execute({
      toolId: 'price-defense',
      action: 'predict-stockout',
      params: {
        skus: skus || 'all',
        forecast_days: 30,
      }
    });
  }

  /**
   * USA仕入れ監視
   */
  async monitorUSASupplier(productIds?: string[]) {
    return dispatchService.execute({
      toolId: 'usa-supplier-monitor',
      action: 'check-prices',
      params: {
        product_ids: productIds,
      }
    });
  }
}

export const inventoryWorkflows = new InventoryWorkflows();
