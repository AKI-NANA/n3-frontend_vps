/**
 * VPSスケジュール自動生成ワーカー
 * 
 * PM2で毎日09:00に実行され、承認済み商品のスケジュールを自動生成
 * 
 * 実行: pm2 start ecosystem.config.js
 * ログ: pm2 logs schedule-generator
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// 環境変数
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Supabaseクライアント
const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ログユーティリティ
function log(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [schedule-generator] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

function logError(message: string, error: any) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [schedule-generator] ERROR: ${message}`, error);
}

// スケジュール設定型
interface ScheduleSettings {
  enabled: boolean;
  items_per_day_min: number;
  items_per_day_max: number;
  sessions_per_day_min: number;
  sessions_per_day_max: number;
  item_interval_min: number;
  item_interval_max: number;
  preferred_hours: number[];
  weekday_multiplier: number;
  weekend_multiplier: number;
}

// デフォルト設定
const DEFAULT_SETTINGS: ScheduleSettings = {
  enabled: true,
  items_per_day_min: 25,
  items_per_day_max: 35,
  sessions_per_day_min: 2,
  sessions_per_day_max: 4,
  item_interval_min: 30,
  item_interval_max: 120,
  preferred_hours: [10, 11, 14, 15, 19, 20],
  weekday_multiplier: 1.0,
  weekend_multiplier: 0.8,
};

/**
 * メイン実行関数
 */
async function generateDailySchedule(): Promise<void> {
  log('Starting daily schedule generator...');
  
  try {
    // 設定を取得
    const settings = await getScheduleSettings();
    
    if (!settings.enabled) {
      log('Schedule generation is disabled.');
      return;
    }
    
    // 承認済みでスケジュール未登録の商品を取得
    const { data: approvedProducts, error: fetchError } = await supabase
      .from('products_master')
      .select('id, sku, ebay_category_id, listing_score, ai_confidence_score')
      .eq('approval_status', 'approved')
      .is('schedule_status', null)
      .not('ebay_category_id', 'is', null) // カテゴリー必須
      .order('listing_score', { ascending: false, nullsFirst: false })
      .limit(settings.items_per_day_max * 3); // 3日分を上限に取得
    
    if (fetchError) {
      logError('Failed to fetch approved products', fetchError);
      return;
    }
    
    if (!approvedProducts || approvedProducts.length === 0) {
      log('No approved products waiting for schedule.');
      return;
    }
    
    log(`Found ${approvedProducts.length} approved products.`);
    
    // 既存スケジュールとの重複チェック
    const productIds = approvedProducts.map(p => p.id);
    const { data: existingSchedules } = await supabase
      .from('listing_schedule')
      .select('product_id')
      .in('product_id', productIds)
      .in('status', ['PENDING', 'SCHEDULED', 'RUNNING']);
    
    const existingProductIds = new Set((existingSchedules || []).map(s => s.product_id));
    const newProducts = approvedProducts.filter(p => !existingProductIds.has(p.id));
    
    if (newProducts.length === 0) {
      log('All products already have schedules.');
      return;
    }
    
    log(`${newProducts.length} products need scheduling.`);
    
    // カテゴリー分散＆スコア順ソート
    const sortedProducts = distributeByCategoryWithScorePriority(newProducts);
    
    // 今日のスケジュールを生成
    const scheduleRecords = generateScheduleRecords(sortedProducts, settings);
    
    if (scheduleRecords.length === 0) {
      log('No schedules generated.');
      return;
    }
    
    // スケジュールを保存
    const { error: insertError } = await supabase
      .from('listing_schedule')
      .insert(scheduleRecords);
    
    if (insertError) {
      logError('Failed to insert schedules', insertError);
      return;
    }
    
    // products_masterを更新
    const scheduledProductIds = scheduleRecords.map(s => s.product_id);
    await supabase
      .from('products_master')
      .update({
        schedule_status: 'scheduled',
        workflow_status: 'scheduled',
        scheduled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .in('id', scheduledProductIds);
    
    log(`Generated ${scheduleRecords.length} schedules successfully.`);
    
  } catch (error) {
    logError('Unexpected error in schedule generator', error);
  }
}

/**
 * スケジュール設定を取得
 */
async function getScheduleSettings(): Promise<ScheduleSettings> {
  try {
    const { data, error } = await supabase
      .from('default_schedule_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error || !data) {
      log('Using default settings');
      return DEFAULT_SETTINGS;
    }
    
    const itemsPerDay = data.items_per_day ?? 30;
    
    return {
      enabled: data.enabled ?? true,
      items_per_day_min: data.items_per_day_min ?? Math.floor(itemsPerDay * 0.8),
      items_per_day_max: data.items_per_day_max ?? Math.ceil(itemsPerDay * 1.2),
      sessions_per_day_min: data.sessions_per_day_min ?? 2,
      sessions_per_day_max: data.sessions_per_day_max ?? 4,
      item_interval_min: data.item_interval_min ?? 30,
      item_interval_max: data.item_interval_max ?? 120,
      preferred_hours: data.preferred_hours ?? [10, 11, 14, 15, 19, 20],
      weekday_multiplier: data.weekday_multiplier ?? 1.0,
      weekend_multiplier: data.weekend_multiplier ?? 0.8,
    };
    
  } catch (error) {
    logError('Error getting settings', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * カテゴリー分散（スコア優先を維持）
 */
function distributeByCategoryWithScorePriority(products: any[]): any[] {
  if (products.length <= 1) return products;
  
  const result: any[] = [];
  const remaining = [...products];
  let lastCategory: string | null = null;
  
  while (remaining.length > 0) {
    let foundIndex = -1;
    
    for (let i = 0; i < remaining.length; i++) {
      const category = remaining[i].ebay_category_id || 'unknown';
      if (category !== lastCategory || remaining.length === 1) {
        foundIndex = i;
        break;
      }
    }
    
    if (foundIndex === -1) foundIndex = 0;
    
    const product = remaining.splice(foundIndex, 1)[0];
    result.push(product);
    lastCategory = product.ebay_category_id || 'unknown';
  }
  
  return result;
}

/**
 * スケジュールレコードを生成
 */
function generateScheduleRecords(products: any[], settings: ScheduleSettings): any[] {
  const now = new Date();
  const records: any[] = [];
  
  // 今日の曜日を確認
  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const multiplier = isWeekend ? settings.weekend_multiplier : settings.weekday_multiplier;
  
  // 今日の出品数をランダムに決定
  const baseItems = randomBetween(settings.items_per_day_min, settings.items_per_day_max);
  const todayItems = Math.max(1, Math.floor(baseItems * multiplier));
  
  // スケジュールする商品数
  const itemCount = Math.min(products.length, todayItems);
  
  // セッション数をランダムに決定
  const availableHours = settings.preferred_hours.filter(h => h > now.getHours());
  const maxSessions = Math.min(settings.sessions_per_day_max, availableHours.length);
  const minSessions = Math.min(settings.sessions_per_day_min, maxSessions);
  const sessionCount = randomBetween(minSessions, maxSessions);
  
  if (sessionCount === 0 || availableHours.length === 0) {
    log('No available time slots for today. Will schedule for tomorrow.');
    // 明日のスケジュールを生成
    return generateTomorrowSchedule(products.slice(0, itemCount), settings);
  }
  
  // セッションに使う時間帯を選択
  const selectedHours = selectRandomHours(availableHours, sessionCount);
  
  // 商品をセッションに分配
  const itemsPerSession = distributeItems(itemCount, sessionCount);
  
  let productIndex = 0;
  
  for (let s = 0; s < sessionCount; s++) {
    const hour = selectedHours[s];
    const sessionItems = itemsPerSession[s];
    
    // セッション開始時間
    const sessionStart = new Date(now);
    sessionStart.setHours(hour, randomBetween(0, 30), 0, 0);
    
    let currentTime = new Date(sessionStart);
    
    for (let i = 0; i < sessionItems && productIndex < products.length; i++) {
      const product = products[productIndex];
      
      records.push({
        product_id: product.id,
        marketplace: 'ebay',
        account_id: 'green', // TODO: アカウント設定から取得
        scheduled_at: currentTime.toISOString(),
        status: 'SCHEDULED',
        listing_strategy: 'auto_scheduled',
        priority: 100 - productIndex
      });
      
      // 次の商品の時間
      const interval = randomBetween(settings.item_interval_min, settings.item_interval_max);
      currentTime = new Date(currentTime.getTime() + interval * 1000);
      
      productIndex++;
    }
  }
  
  return records;
}

/**
 * 明日のスケジュールを生成
 */
function generateTomorrowSchedule(products: any[], settings: ScheduleSettings): any[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const records: any[] = [];
  const selectedHours = selectRandomHours(settings.preferred_hours, 
    randomBetween(settings.sessions_per_day_min, settings.sessions_per_day_max));
  
  const itemsPerSession = distributeItems(products.length, selectedHours.length);
  
  let productIndex = 0;
  
  for (let s = 0; s < selectedHours.length; s++) {
    const hour = selectedHours[s];
    const sessionItems = itemsPerSession[s];
    
    const sessionStart = new Date(tomorrow);
    sessionStart.setHours(hour, randomBetween(0, 30), 0, 0);
    
    let currentTime = new Date(sessionStart);
    
    for (let i = 0; i < sessionItems && productIndex < products.length; i++) {
      const product = products[productIndex];
      
      records.push({
        product_id: product.id,
        marketplace: 'ebay',
        account_id: 'green',
        scheduled_at: currentTime.toISOString(),
        status: 'SCHEDULED',
        listing_strategy: 'auto_scheduled',
        priority: 100 - productIndex
      });
      
      const interval = randomBetween(settings.item_interval_min, settings.item_interval_max);
      currentTime = new Date(currentTime.getTime() + interval * 1000);
      
      productIndex++;
    }
  }
  
  return records;
}

/**
 * 商品をセッションに分配
 */
function distributeItems(totalItems: number, sessionCount: number): number[] {
  if (sessionCount <= 0) return [];
  if (sessionCount === 1) return [totalItems];
  
  const distribution: number[] = [];
  let remaining = totalItems;
  
  for (let i = 0; i < sessionCount; i++) {
    const remainingSessions = sessionCount - i;
    const baseCount = Math.floor(remaining / remainingSessions);
    
    if (i === sessionCount - 1) {
      distribution.push(remaining);
    } else {
      const minCount = Math.max(1, Math.floor(baseCount * 0.7));
      const maxCount = Math.ceil(baseCount * 1.3);
      const count = Math.min(remaining - (remainingSessions - 1), randomBetween(minCount, maxCount));
      distribution.push(count);
      remaining -= count;
    }
  }
  
  return distribution;
}

/**
 * ユーティリティ
 */
function selectRandomHours(hours: number[], count: number): number[] {
  const shuffled = [...hours].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).sort((a, b) => a - b);
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// メイン実行
generateDailySchedule()
  .then(() => {
    log('Generator finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    logError('Generator failed', error);
    process.exit(1);
  });
