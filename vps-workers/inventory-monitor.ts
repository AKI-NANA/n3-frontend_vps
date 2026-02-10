/**
 * VPS在庫監視ワーカー
 * 
 * PM2で毎時実行され、Yahoo!オークションなどのソースサイトの在庫・価格変動を監視
 * 
 * 実行: pm2 start ecosystem.config.js
 * ログ: pm2 logs inventory-monitor
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import puppeteer, { Browser, Page } from 'puppeteer';

// 環境変数
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Supabaseクライアント
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ログユーティリティ
function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [inventory-monitor] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

function logError(message: string, error: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [inventory-monitor] ERROR: ${message}`, error);
}

// 監視対象レコード型
interface MonitoringTarget {
  id: number;
  sku: string;
  source_url: string;
  source_platform: string;
  current_price: number;
  stock_status: string;
  last_checked_at: string;
}

// スクレイピング結果型
interface ScrapeResult {
  success: boolean;
  price?: number;
  stock?: number;
  stockStatus?: 'in_stock' | 'out_of_stock' | 'unknown';
  title?: string;
  errorMessage?: string;
}

// 変動検出型
interface ChangeDetection {
  productId: number;
  changeCategory: 'inventory' | 'price' | 'both' | 'page_error';
  oldStock?: number;
  newStock?: number;
  oldPrice?: number;
  newPrice?: number;
  errorMessage?: string;
}

/**
 * メイン実行関数
 */
async function runInventoryMonitor(): Promise<void> {
  log('Starting inventory monitor...');
  
  let browser: Browser | null = null;
  
  try {
    // 監視設定を取得
    const settings = await getMonitoringSettings();
    
    if (!settings.enabled) {
      log('Inventory monitoring is disabled.');
      return;
    }
    
    // 監視対象を取得
    const { data: targets, error: fetchError } = await supabase
      .from('products_master')
      .select('id, sku, source_url, source_platform, current_price, stock_status, last_checked_at')
      .eq('inventory_type', 'dropship') // 無在庫商品のみ
      .not('source_url', 'is', null)
      .order('last_checked_at', { ascending: true, nullsFirst: true })
      .limit(settings.maxItemsPerBatch);
    
    if (fetchError) {
      logError('Failed to fetch monitoring targets', fetchError);
      return;
    }
    
    if (!targets || targets.length === 0) {
      log('No monitoring targets found.');
      return;
    }
    
    log(`Found ${targets.length} targets to monitor.`);
    
    // Puppeteerブラウザ起動
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });
    
    const changes: ChangeDetection[] = [];
    
    // 各ターゲットをスクレイピング
    for (const target of targets as MonitoringTarget[]) {
      try {
        const result = await scrapeTarget(browser, target);
        
        // 変動検出
        const change = detectChanges(target, result);
        if (change) {
          changes.push(change);
        }
        
        // 最終チェック時刻を更新
        await supabase
          .from('products_master')
          .update({
            last_checked_at: new Date().toISOString(),
            ...(result.success && {
              current_price: result.price,
              stock_status: result.stockStatus,
            })
          })
          .eq('id', target.id);
        
        // レート制限対策
        const delay = randomBetween(settings.delayMinSeconds * 1000, settings.delayMaxSeconds * 1000);
        await sleep(delay);
        
      } catch (error) {
        logError(`Error monitoring target ${target.sku}`, error);
        changes.push({
          productId: target.id,
          changeCategory: 'page_error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    // 変動を記録
    if (changes.length > 0) {
      await recordChanges(changes);
      log(`Detected ${changes.length} changes.`);
    } else {
      log('No changes detected.');
    }
    
    log('Inventory monitor completed.');
    
  } catch (error) {
    logError('Unexpected error in inventory monitor', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * 監視設定を取得
 */
async function getMonitoringSettings(): Promise<{
  enabled: boolean;
  maxItemsPerBatch: number;
  delayMinSeconds: number;
  delayMaxSeconds: number;
}> {
  try {
    const { data, error } = await supabase
      .from('monitoring_schedule_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error || !data) {
      return {
        enabled: true,
        maxItemsPerBatch: 100,
        delayMinSeconds: 1,
        delayMaxSeconds: 3
      };
    }
    
    return {
      enabled: data.enabled ?? true,
      maxItemsPerBatch: data.max_items_per_batch ?? 100,
      delayMinSeconds: data.delay_min_seconds ?? 1,
      delayMaxSeconds: data.delay_max_seconds ?? 3
    };
    
  } catch (error) {
    logError('Error getting monitoring settings', error);
    return {
      enabled: true,
      maxItemsPerBatch: 100,
      delayMinSeconds: 1,
      delayMaxSeconds: 3
    };
  }
}

/**
 * ターゲットをスクレイピング
 */
async function scrapeTarget(browser: Browser, target: MonitoringTarget): Promise<ScrapeResult> {
  log(`Scraping: ${target.sku} - ${target.source_url}`);
  
  const page: Page = await browser.newPage();
  
  try {
    // User-Agentを設定
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    // タイムアウト設定
    await page.setDefaultTimeout(30000);
    
    // ページ読み込み
    await page.goto(target.source_url, { waitUntil: 'networkidle2' });
    
    // プラットフォームに応じたスクレイピング
    switch (target.source_platform?.toLowerCase()) {
      case 'yahoo':
      case 'yahoo_auction':
      case 'yahoo_auctions':
        return await scrapeYahooAuction(page);
      
      case 'mercari':
        return await scrapeMercari(page);
      
      case 'rakuma':
        return await scrapeRakuma(page);
      
      default:
        return await scrapeGeneric(page);
    }
    
  } catch (error) {
    logError(`Scraping failed for ${target.sku}`, error);
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Scraping failed'
    };
  } finally {
    await page.close();
  }
}

/**
 * Yahoo!オークション スクレイピング
 */
async function scrapeYahooAuction(page: Page): Promise<ScrapeResult> {
  try {
    // 価格を取得
    const priceText = await page.$eval(
      '.Price__value, .ProductDetail__price, [data-auction-price]',
      (el) => el.textContent?.trim() || ''
    ).catch(() => '');
    
    // 在庫状態を取得（出品終了かどうか）
    const isEnded = await page.$('.ProductDetail__statusEnded, .is-ended').catch(() => null);
    
    // 価格をパース
    const price = parsePrice(priceText);
    
    return {
      success: true,
      price,
      stockStatus: isEnded ? 'out_of_stock' : 'in_stock',
      stock: isEnded ? 0 : 1
    };
    
  } catch (error) {
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Yahoo scraping failed'
    };
  }
}

/**
 * メルカリ スクレイピング
 */
async function scrapeMercari(page: Page): Promise<ScrapeResult> {
  try {
    // 価格を取得
    const priceText = await page.$eval(
      '[data-testid="price"], .item-price, .price',
      (el) => el.textContent?.trim() || ''
    ).catch(() => '');
    
    // 売り切れチェック
    const isSoldOut = await page.$('[data-testid="sold-label"], .item-sold-out-badge').catch(() => null);
    
    const price = parsePrice(priceText);
    
    return {
      success: true,
      price,
      stockStatus: isSoldOut ? 'out_of_stock' : 'in_stock',
      stock: isSoldOut ? 0 : 1
    };
    
  } catch (error) {
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Mercari scraping failed'
    };
  }
}

/**
 * ラクマ スクレイピング
 */
async function scrapeRakuma(page: Page): Promise<ScrapeResult> {
  try {
    const priceText = await page.$eval(
      '.item-price, .price',
      (el) => el.textContent?.trim() || ''
    ).catch(() => '');
    
    const isSoldOut = await page.$('.sold-out, .item-sold').catch(() => null);
    
    const price = parsePrice(priceText);
    
    return {
      success: true,
      price,
      stockStatus: isSoldOut ? 'out_of_stock' : 'in_stock',
      stock: isSoldOut ? 0 : 1
    };
    
  } catch (error) {
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Rakuma scraping failed'
    };
  }
}

/**
 * 汎用スクレイピング
 */
async function scrapeGeneric(page: Page): Promise<ScrapeResult> {
  try {
    // 一般的な価格セレクタを試行
    const selectors = [
      '.price', '.item-price', '[class*="price"]',
      '.product-price', '.sale-price', '.current-price'
    ];
    
    let priceText = '';
    for (const selector of selectors) {
      try {
        priceText = await page.$eval(selector, (el) => el.textContent?.trim() || '');
        if (priceText) break;
      } catch {
        continue;
      }
    }
    
    const price = parsePrice(priceText);
    
    return {
      success: true,
      price,
      stockStatus: 'unknown'
    };
    
  } catch (error) {
    return {
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Generic scraping failed'
    };
  }
}

/**
 * 価格文字列をパース
 */
function parsePrice(priceText: string): number {
  if (!priceText) return 0;
  
  // 数字以外を除去
  const cleaned = priceText.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * 変動を検出
 */
function detectChanges(target: MonitoringTarget, result: ScrapeResult): ChangeDetection | null {
  if (!result.success) {
    return {
      productId: target.id,
      changeCategory: 'page_error',
      errorMessage: result.errorMessage
    };
  }
  
  const priceChanged = result.price && result.price !== target.current_price;
  const stockChanged = result.stockStatus && result.stockStatus !== target.stock_status;
  
  if (!priceChanged && !stockChanged) {
    return null;
  }
  
  let changeCategory: 'inventory' | 'price' | 'both';
  if (priceChanged && stockChanged) {
    changeCategory = 'both';
  } else if (stockChanged) {
    changeCategory = 'inventory';
  } else {
    changeCategory = 'price';
  }
  
  return {
    productId: target.id,
    changeCategory,
    oldPrice: target.current_price,
    newPrice: result.price,
    oldStock: target.stock_status === 'in_stock' ? 1 : 0,
    newStock: result.stock
  };
}

/**
 * 変動を記録
 */
async function recordChanges(changes: ChangeDetection[]): Promise<void> {
  const records = changes.map(change => ({
    product_id: change.productId,
    change_category: change.changeCategory,
    status: 'pending',
    detected_at: new Date().toISOString(),
    inventory_change: change.oldStock !== undefined ? {
      old_stock: change.oldStock,
      new_stock: change.newStock
    } : null,
    price_change: change.oldPrice !== undefined ? {
      old_price_jpy: change.oldPrice,
      new_price_jpy: change.newPrice
    } : null,
    error_message: change.errorMessage
  }));
  
  const { error } = await supabase
    .from('unified_changes')
    .insert(records);
  
  if (error) {
    logError('Failed to record changes', error);
  }
}

/**
 * ユーティリティ
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// メイン実行
runInventoryMonitor()
  .then(() => {
    log('Monitor finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    logError('Monitor failed', error);
    process.exit(1);
  });
