// lib/n8n/workflows/research-workflows.ts
/**
 * リサーチ関連のn8nワークフロー定義
 * 
 * Phase A-2: 全実行を dispatchService 経由に統一
 */

import { dispatchService } from '../n8n-client';

export interface ResearchRequest {
  keyword?: string;
  asin?: string;
  url?: string;
  platform: 'amazon' | 'ebay' | 'keepa' | 'yahoo';
  options?: {
    depth?: 'basic' | 'detailed' | 'comprehensive';
    includeHistory?: boolean;
    competitors?: boolean;
  };
}

export class ResearchWorkflows {
  /**
   * Amazon商品リサーチ
   */
  async researchAmazon(request: {
    asin?: string;
    keyword?: string;
    category?: string;
  }) {
    return dispatchService.execute({
      toolId: 'amazon-research-bulk',
      action: 'analyze-product',
      params: {
        asin: request.asin,
        keyword: request.keyword,
        category: request.category,
        include_keepa: true,
        include_competitors: true,
      },
      options: {
        timeout: 60,
      }
    });
  }

  /**
   * Keepa価格履歴取得
   */
  async getKeepaData(asins: string[]) {
    return dispatchService.execute({
      toolId: 'keepa-sync',
      action: 'get-price-history',
      params: {
        asins,
        stats: 180,
        domain: 1,
        include_sales_rank: true,
      }
    });
  }

  /**
   * eBay相場調査
   */
  async researchEbay(keyword: string, options?: {
    condition?: 'new' | 'used' | 'all';
    soldOnly?: boolean;
  }) {
    return dispatchService.execute({
      toolId: 'sm-batch',
      action: 'find-completed-items',
      params: {
        keyword,
        condition: options?.condition || 'all',
        sold_only: options?.soldOnly || true,
        limit: 100,
      }
    });
  }

  /**
   * ヤフオク商品スクレイピング
   */
  async scrapeYahooAuction(url: string) {
    return dispatchService.execute({
      toolId: 'research-agent',
      action: 'scrape-product',
      params: {
        url,
        include_images: true,
        translate_title: true,
        generate_description: true,
      }
    });
  }

  /**
   * 競合分析
   */
  async analyzeCompetitor(sellerId: string, platform: string) {
    return dispatchService.execute({
      toolId: 'amazon-competitor-scan',
      action: 'analyze-seller',
      params: {
        seller_id: sellerId,
        platform,
        analyze_pricing: true,
        analyze_inventory: true,
        analyze_sales_velocity: true,
      }
    });
  }

  /**
   * 利益計算
   */
  async calculateProfit(data: {
    purchasePrice: number;
    sellingPrice: number;
    platform: string;
    weight?: number;
    dimensions?: { length: number; width: number; height: number };
  }) {
    return dispatchService.execute({
      toolId: 'profit-calculate',
      action: 'calculate',
      params: {
        purchase_price: data.purchasePrice,
        selling_price: data.sellingPrice,
        platform: data.platform,
        weight_kg: data.weight,
        dimensions: data.dimensions,
        include_fees: true,
        include_shipping: true,
        include_taxes: true,
      }
    });
  }

  /**
   * トレンド分析
   */
  async analyzeTrends(category: string, days: number = 30) {
    return dispatchService.execute({
      toolId: 'trend-agent',
      action: 'analyze-category',
      params: {
        category,
        days,
        platforms: ['amazon', 'ebay'],
      }
    });
  }

  /**
   * バッチリサーチ（複数商品を一括）
   */
  async batchResearch(items: Array<{
    identifier: string;
    type: 'asin' | 'keyword' | 'url';
    platform: string;
  }>) {
    return dispatchService.execute({
      toolId: 'amazon-research-bulk',
      action: 'batch-analyze',
      params: {
        items,
        parallel: 3,
      },
      options: {
        timeout: 300,
      }
    });
  }

  /**
   * AIによる商品分析
   */
  async aiAnalysis(productData: any) {
    return dispatchService.execute({
      toolId: 'research-agent',
      action: 'analyze-with-ai',
      params: {
        product_data: productData,
        generate_title: true,
        generate_description: true,
        generate_keywords: true,
        suggest_category: true,
        predict_demand: true,
      }
    });
  }

  /**
   * Amazon価格トラッキング
   */
  async trackAmazonPrices(asins: string[], threshold: number = 5) {
    return dispatchService.execute({
      toolId: 'amazon-price-tracker',
      action: 'track-prices',
      params: {
        asins,
        threshold_percent: threshold,
      }
    });
  }

  /**
   * クロスリージョン価格差分析
   */
  async analyzeArbitrage(productId: string) {
    return dispatchService.execute({
      toolId: 'arbitrage-scan',
      action: 'analyze',
      params: {
        product_id: productId,
        regions: ['us', 'uk', 'de', 'jp'],
      }
    });
  }
}

export const researchWorkflows = new ResearchWorkflows();
