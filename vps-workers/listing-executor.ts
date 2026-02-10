/**
 * VPS出品実行ワーカー
 * 
 * PM2で5分ごとに実行され、scheduled_atの時間を過ぎたスケジュールを処理する
 * 
 * 実行: pm2 start ecosystem.config.js
 * ログ: pm2 logs listing-executor
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 環境変数
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const EBAY_API_BASE = process.env.EBAY_API_BASE || 'https://api.ebay.com';

// Supabaseクライアント
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ログユーティリティ
function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [listing-executor] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

function logError(message: string, error: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [listing-executor] ERROR: ${message}`, error);
}

// スケジュールレコード型
interface ScheduleRecord {
  id: string;
  product_id: number;
  marketplace: string;
  account_id: string;
  scheduled_at: string;
  status: string;
  products_master?: {
    id: number;
    sku: string;
    title_en: string;
    english_title: string;
    description_en: string;
    ebay_category_id: string;
    listing_price: number;
    condition_id: number;
    condition_description: string;
    primary_image_url: string;
    image_urls: string[];
    item_specifics: Record<string, string>;
    shipping_policy_id: string;
    payment_policy_id: string;
    return_policy_id: string;
  };
}

// 出品結果型
interface ListingResult {
  success: boolean;
  listingId?: string;
  errorMessage?: string;
}

/**
 * メイン実行関数
 */
async function executeScheduledListings(): Promise<void> {
  log('Starting listing executor...');
  
  try {
    // 1. scheduled_at <= NOW() かつ status = 'SCHEDULED' のレコードを取得
    const now = new Date().toISOString();
    
    const { data: pendingSchedules, error: fetchError } = await supabase
      .from('listing_schedule')
      .select(`
        id,
        product_id,
        marketplace,
        account_id,
        scheduled_at,
        status,
        products_master!listing_schedule_product_id_fkey (
          id,
          sku,
          title_en,
          english_title,
          description_en,
          ebay_category_id,
          listing_price,
          condition_id,
          condition_description,
          primary_image_url,
          image_urls,
          item_specifics,
          shipping_policy_id,
          payment_policy_id,
          return_policy_id
        )
      `)
      .lte('scheduled_at', now)
      .eq('status', 'SCHEDULED')
      .order('scheduled_at', { ascending: true })
      .limit(10); // 1回の実行で最大10件
    
    if (fetchError) {
      logError('Failed to fetch pending schedules', fetchError);
      return;
    }
    
    if (!pendingSchedules || pendingSchedules.length === 0) {
      log('No pending schedules found.');
      return;
    }
    
    log(`Found ${pendingSchedules.length} pending schedules.`);
    
    // 2. 各スケジュールを処理
    for (const schedule of pendingSchedules as ScheduleRecord[]) {
      await processSchedule(schedule);
      
      // レート制限対策: 各処理の間に少し待機
      await sleep(2000);
    }
    
    log('Listing executor completed.');
    
  } catch (error) {
    logError('Unexpected error in listing executor', error);
  }
}

/**
 * 個別スケジュールの処理
 */
async function processSchedule(schedule: ScheduleRecord): Promise<void> {
  const { id, product_id, marketplace, account_id } = schedule;
  
  log(`Processing schedule: ${id}`, { product_id, marketplace, account_id });
  
  try {
    // ステータスを RUNNING に更新（排他制御）
    const { error: updateError } = await supabase
      .from('listing_schedule')
      .update({ 
        status: 'RUNNING',
        started_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('status', 'SCHEDULED'); // 楽観的ロック
    
    if (updateError) {
      logError(`Failed to update status to RUNNING for schedule ${id}`, updateError);
      return;
    }
    
    // 商品データの検証
    const product = schedule.products_master;
    if (!product) {
      await markAsError(id, 'Product data not found');
      return;
    }
    
    if (!product.ebay_category_id) {
      await markAsError(id, 'eBay category ID is required');
      return;
    }
    
    // 出品実行
    const result = await executeListing(schedule);
    
    // 結果に応じてステータス更新
    if (result.success) {
      await supabase
        .from('listing_schedule')
        .update({
          status: 'COMPLETED',
          listing_id: result.listingId,
          completed_at: new Date().toISOString()
        })
        .eq('id', id);
      
      // products_masterも更新
      await supabase
        .from('products_master')
        .update({
          ebay_listing_id: result.listingId,
          listing_status: 'active',
          listed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', product_id);
      
      log(`Successfully listed: ${id} -> ${result.listingId}`);
      
    } else {
      await markAsError(id, result.errorMessage || 'Unknown error');
    }
    
  } catch (error) {
    logError(`Error processing schedule ${id}`, error);
    await markAsError(id, error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * エラーステータスに更新
 */
async function markAsError(scheduleId: string, errorMessage: string): Promise<void> {
  await supabase
    .from('listing_schedule')
    .update({
      status: 'ERROR',
      error_message: errorMessage,
      completed_at: new Date().toISOString()
    })
    .eq('id', scheduleId);
  
  logError(`Schedule ${scheduleId} marked as ERROR`, errorMessage);
}

/**
 * eBay出品実行
 * TODO: 実際のeBay Trading API呼び出しを実装
 */
async function executeListing(schedule: ScheduleRecord): Promise<ListingResult> {
  const product = schedule.products_master!;
  const { marketplace, account_id } = schedule;
  
  log(`Executing listing for product ${product.sku}...`);
  
  try {
    // アクセストークンを取得
    const accessToken = await getEbayAccessToken(account_id);
    if (!accessToken) {
      return { success: false, errorMessage: 'Failed to get eBay access token' };
    }
    
    // eBay Trading API AddItem呼び出し
    // 注: 実際の実装ではeBay Trading APIを使用
    const response = await callEbayAddItem({
      accessToken,
      marketplace,
      product: {
        title: product.english_title || product.title_en,
        description: product.description_en,
        categoryId: product.ebay_category_id,
        price: product.listing_price,
        conditionId: product.condition_id,
        conditionDescription: product.condition_description,
        imageUrls: product.image_urls || [product.primary_image_url],
        itemSpecifics: product.item_specifics,
        sku: product.sku,
        shippingPolicyId: product.shipping_policy_id,
        paymentPolicyId: product.payment_policy_id,
        returnPolicyId: product.return_policy_id,
      }
    });
    
    if (response.success && response.itemId) {
      return { success: true, listingId: response.itemId };
    } else {
      return { success: false, errorMessage: response.errorMessage || 'eBay API error' };
    }
    
  } catch (error) {
    logError('Error in executeListing', error);
    return { 
      success: false, 
      errorMessage: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * eBayアクセストークン取得
 */
async function getEbayAccessToken(accountId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('ebay_tokens')
      .select('access_token, expires_at, refresh_token')
      .eq('account_id', accountId)
      .single();
    
    if (error || !data) {
      logError(`No token found for account ${accountId}`, error);
      return null;
    }
    
    // トークン有効期限チェック
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (expiresAt <= now) {
      // トークンリフレッシュが必要
      log(`Token expired for account ${accountId}, refreshing...`);
      return await refreshEbayToken(accountId, data.refresh_token);
    }
    
    return data.access_token;
    
  } catch (error) {
    logError('Error getting eBay access token', error);
    return null;
  }
}

/**
 * eBayトークンリフレッシュ
 */
async function refreshEbayToken(accountId: string, refreshToken: string): Promise<string | null> {
  try {
    const clientId = process.env.EBAY_CLIENT_ID;
    const clientSecret = process.env.EBAY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      logError('eBay credentials not configured', null);
      return null;
    }
    
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${credentials}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        scope: 'https://api.ebay.com/oauth/api_scope https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.marketing https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/sell.fulfillment'
      })
    });
    
    if (!response.ok) {
      logError('Token refresh failed', await response.text());
      return null;
    }
    
    const tokenData = await response.json();
    
    // トークンを保存
    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
    
    await supabase
      .from('ebay_tokens')
      .update({
        access_token: tokenData.access_token,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('account_id', accountId);
    
    log(`Token refreshed for account ${accountId}`);
    return tokenData.access_token;
    
  } catch (error) {
    logError('Error refreshing token', error);
    return null;
  }
}

/**
 * eBay AddItem API呼び出し
 * 注: 実際の実装ではXML形式のTrading APIを使用
 */
async function callEbayAddItem(params: {
  accessToken: string;
  marketplace: string;
  product: {
    title: string;
    description: string;
    categoryId: string;
    price: number;
    conditionId: number;
    conditionDescription?: string;
    imageUrls: string[];
    itemSpecifics?: Record<string, string>;
    sku: string;
    shippingPolicyId?: string;
    paymentPolicyId?: string;
    returnPolicyId?: string;
  };
}): Promise<{ success: boolean; itemId?: string; errorMessage?: string }> {
  
  // TODO: 実際のeBay Trading API AddItem実装
  // 現在はプレースホルダー
  
  log('callEbayAddItem called (placeholder)', { 
    marketplace: params.marketplace,
    sku: params.product.sku,
    title: params.product.title.substring(0, 50) + '...'
  });
  
  // 開発用: ダミーの成功レスポンス
  // 本番環境では実際のAPI呼び出しに置き換える
  if (process.env.NODE_ENV === 'development' || process.env.DRY_RUN === 'true') {
    return {
      success: true,
      itemId: `DUMMY-${Date.now()}-${params.product.sku}`
    };
  }
  
  // TODO: 本番用のeBay Trading API実装
  return {
    success: false,
    errorMessage: 'eBay Trading API not yet implemented'
  };
}

/**
 * スリープユーティリティ
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// メイン実行
executeScheduledListings()
  .then(() => {
    log('Executor finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    logError('Executor failed', error);
    process.exit(1);
  });
