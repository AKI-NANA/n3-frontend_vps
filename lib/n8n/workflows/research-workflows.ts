// lib/n8n/workflows/research-workflows.ts
/**
 * リサーチ関連のn8nワークフロー定義
 */

import { n8nClient } from '../n8n-client';

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
    return n8nClient.execute({
      workflow: 'research-amazon',
      action: 'analyze-product',
      data: {
        asin: request.asin,
        keyword: request.keyword,
        category: request.category,
        include_keepa: true,
        include_competitors: true,
      },
      options: {
        timeout: 60000,
      }
    });
  }

  /**
   * Keepa価格履歴取得
   */
  async getKeepaData(asins: string[]) {
    return n8nClient.execute({
      workflow: 'research-keepa',
      action: 'get-price-history',
      data: {
        asins,
        stats: 180, // 180日間のデータ
        domain: 1, // Amazon.com
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
    return n8nClient.execute({
      workflow: 'research-ebay',
      action: 'find-completed-items',
      data: {
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
    return n8nClient.execute({
      workflow: 'research-yahoo',
      action: 'scrape-product',
      data: {
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
    return n8nClient.execute({
      workflow: 'research-competitor',
      action: 'analyze-seller',
      data: {
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
    return n8nClient.execute({
      workflow: 'research-profit',
      action: 'calculate',
      data: {
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
    return n8nClient.execute({
      workflow: 'research-trends',
      action: 'analyze-category',
      data: {
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
    return n8nClient.execute({
      workflow: 'research-batch',
      action: 'batch-analyze',
      data: {
        items,
        parallel: 3, // 並列処理数
      },
      options: {
        async: true,
        timeout: 300000,
      }
    });
  }

  /**
   * AIによる商品分析
   */
  async aiAnalysis(productData: any) {
    return n8nClient.execute({
      workflow: 'research-ai',
      action: 'analyze-with-ai',
      data: {
        product_data: productData,
        generate_title: true,
        generate_description: true,
        generate_keywords: true,
        suggest_category: true,
        predict_demand: true,
      }
    });
  }
}

export const researchWorkflows = new ResearchWorkflows();
