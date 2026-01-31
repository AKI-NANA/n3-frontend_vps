// lib/empire-os/ui-api-policies.ts
// ========================================
// N3 Empire OS V8.2.1 - UI連携APIポリシー
// オーナー向けダッシュボード用RLSポリシー＆API
// ========================================

import { SupabaseClient } from '@supabase/supabase-js';

// ========================================
// 型定義
// ========================================

export interface AIDecisionTrace {
  id: string;
  tenant_id: string;
  decision_type: string;
  decision_context: Record<string, any>;
  input_summary: string;
  ai_model: string;
  ai_confidence_score: number;
  final_decision: string;
  decision_reasoning: string;
  was_executed: boolean;
  human_override: boolean;
  workflow_id: string;
  created_at: string;
}

export interface APIConsumptionLimit {
  id: string;
  tenant_id: string;
  api_provider: string;
  api_endpoint: string | null;
  budget_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  budget_amount: number;
  budget_currency: string;
  current_consumption: number;
  last_reset_at: string;
  next_reset_at: string | null;
  alert_threshold_percent: number;
  on_limit_exceeded: 'pause' | 'degrade' | 'continue_alert';
  degraded_model: string | null;
  is_active: boolean;
  is_paused: boolean;
  paused_reason: string | null;
}

export interface CategoryListingQuota {
  id: string;
  tenant_id: string;
  platform: string;
  marketplace: string;
  account_code: string;
  category_id: string;
  category_name: string | null;
  daily_quota: number;
  hourly_quota: number;
  used_today: number;
  used_this_hour: number;
  peak_hours: number[];
  off_peak_multiplier: number;
  is_quota_exceeded: boolean;
}

export interface NightShiftQueueItem {
  id: string;
  tenant_id: string;
  product_id: string;
  product_title: string;
  platform: string;
  marketplace: string;
  account_code: string;
  category_id: string;
  status: 'waiting' | 'scheduled' | 'processing' | 'completed' | 'failed';
  queue_reason: string;
  queued_at: string;
  scheduled_for: string | null;
  priority: number;
}

// ========================================
// AI判断証跡 API
// ========================================

export class AIDecisionTracesAPI {
  constructor(private supabase: SupabaseClient) {}

  /**
   * AI判断証跡一覧取得（オーナーのみ）
   */
  async list(params: {
    tenant_id: string;
    decision_type?: string;
    limit?: number;
    offset?: number;
    from_date?: string;
    to_date?: string;
  }): Promise<{ data: AIDecisionTrace[]; count: number }> {
    let query = this.supabase
      .from('ai_decision_traces')
      .select('*', { count: 'exact' })
      .eq('tenant_id', params.tenant_id)
      .order('created_at', { ascending: false });

    if (params.decision_type) {
      query = query.eq('decision_type', params.decision_type);
    }
    if (params.from_date) {
      query = query.gte('created_at', params.from_date);
    }
    if (params.to_date) {
      query = query.lte('created_at', params.to_date);
    }
    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 50) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`Failed to fetch AI decision traces: ${error.message}`);
    }

    return { data: data || [], count: count || 0 };
  }

  /**
   * 判断タイプ別サマリー取得
   */
  async getSummary(tenant_id: string, days: number = 30): Promise<{
    by_type: Record<string, {
      total: number;
      executed: number;
      overridden: number;
      avg_confidence: number;
    }>;
    daily: Array<{
      date: string;
      total: number;
      executed: number;
    }>;
  }> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await this.supabase
      .from('ai_decision_traces')
      .select('decision_type, was_executed, human_override, ai_confidence_score, created_at')
      .eq('tenant_id', tenant_id)
      .gte('created_at', fromDate.toISOString());

    if (error) {
      throw new Error(`Failed to fetch summary: ${error.message}`);
    }

    // 集計処理
    const byType: Record<string, { total: number; executed: number; overridden: number; confidences: number[] }> = {};
    const dailyMap: Map<string, { total: number; executed: number }> = new Map();

    for (const row of data || []) {
      // タイプ別集計
      if (!byType[row.decision_type]) {
        byType[row.decision_type] = { total: 0, executed: 0, overridden: 0, confidences: [] };
      }
      byType[row.decision_type].total++;
      if (row.was_executed) byType[row.decision_type].executed++;
      if (row.human_override) byType[row.decision_type].overridden++;
      if (row.ai_confidence_score) byType[row.decision_type].confidences.push(row.ai_confidence_score);

      // 日別集計
      const date = row.created_at.split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { total: 0, executed: 0 });
      }
      const daily = dailyMap.get(date)!;
      daily.total++;
      if (row.was_executed) daily.executed++;
    }

    // 結果整形
    const byTypeResult: Record<string, { total: number; executed: number; overridden: number; avg_confidence: number }> = {};
    for (const [type, stats] of Object.entries(byType)) {
      byTypeResult[type] = {
        total: stats.total,
        executed: stats.executed,
        overridden: stats.overridden,
        avg_confidence: stats.confidences.length > 0
          ? stats.confidences.reduce((a, b) => a + b, 0) / stats.confidences.length
          : 0
      };
    }

    const dailyResult = Array.from(dailyMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { by_type: byTypeResult, daily: dailyResult };
  }

  /**
   * 判断証跡の詳細取得
   */
  async get(id: string): Promise<AIDecisionTrace | null> {
    const { data, error } = await this.supabase
      .from('ai_decision_traces')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Failed to fetch trace: ${error.message}`);
    }

    return data;
  }
}

// ========================================
// API消費制限 API
// ========================================

export class APIConsumptionLimitsAPI {
  constructor(private supabase: SupabaseClient) {}

  /**
   * 消費制限一覧取得
   */
  async list(tenant_id: string): Promise<APIConsumptionLimit[]> {
    const { data, error } = await this.supabase
      .from('api_consumption_limits')
      .select('*')
      .eq('tenant_id', tenant_id)
      .order('api_provider');

    if (error) {
      throw new Error(`Failed to fetch limits: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 消費制限更新（オーナーのみ）
   */
  async update(
    id: string,
    updates: Partial<Pick<APIConsumptionLimit, 
      'budget_amount' | 'alert_threshold_percent' | 'on_limit_exceeded' | 
      'degraded_model' | 'is_active' | 'is_paused' | 'paused_reason'
    >>
  ): Promise<APIConsumptionLimit> {
    const { data, error } = await this.supabase
      .from('api_consumption_limits')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update limit: ${error.message}`);
    }

    return data;
  }

  /**
   * 消費制限作成
   */
  async create(limit: Omit<APIConsumptionLimit, 'id' | 'current_consumption' | 'last_reset_at'>): Promise<APIConsumptionLimit> {
    const { data, error } = await this.supabase
      .from('api_consumption_limits')
      .insert({
        ...limit,
        current_consumption: 0,
        last_reset_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create limit: ${error.message}`);
    }

    return data;
  }

  /**
   * 消費量記録（n8nから呼び出し）
   */
  async recordConsumption(
    tenant_id: string,
    api_provider: string,
    amount: number,
    api_endpoint?: string
  ): Promise<{
    limit: APIConsumptionLimit;
    exceeded: boolean;
    action: 'continue' | 'pause' | 'degrade';
    degraded_to?: string;
  }> {
    // 該当の制限設定を取得
    let query = this.supabase
      .from('api_consumption_limits')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('api_provider', api_provider)
      .eq('is_active', true);

    if (api_endpoint) {
      query = query.or(`api_endpoint.eq.${api_endpoint},api_endpoint.is.null`);
    } else {
      query = query.is('api_endpoint', null);
    }

    const { data: limits, error: fetchError } = await query.order('api_endpoint', { nullsFirst: false });

    if (fetchError) {
      throw new Error(`Failed to fetch limit: ${fetchError.message}`);
    }

    // 最も具体的な制限を使用
    const limit = limits?.[0];
    if (!limit) {
      // 制限設定がない場合は新規作成（デフォルト値）
      const newLimit = await this.create({
        tenant_id,
        api_provider,
        api_endpoint: api_endpoint || null,
        budget_type: 'monthly',
        budget_amount: 1000,
        budget_currency: 'USD',
        next_reset_at: null,
        alert_threshold_percent: 80,
        on_limit_exceeded: 'continue_alert',
        degraded_model: null,
        is_active: true,
        is_paused: false,
        paused_reason: null
      });

      return {
        limit: newLimit,
        exceeded: false,
        action: 'continue'
      };
    }

    // 消費量更新
    const newConsumption = (limit.current_consumption || 0) + amount;
    const exceeded = newConsumption >= limit.budget_amount;

    const { data: updated, error: updateError } = await this.supabase
      .from('api_consumption_limits')
      .update({
        current_consumption: newConsumption,
        updated_at: new Date().toISOString()
      })
      .eq('id', limit.id)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update consumption: ${updateError.message}`);
    }

    // アクション決定
    let action: 'continue' | 'pause' | 'degrade' = 'continue';
    if (exceeded || limit.is_paused) {
      action = limit.on_limit_exceeded === 'degrade' && limit.degraded_model 
        ? 'degrade' 
        : limit.on_limit_exceeded === 'pause' 
          ? 'pause' 
          : 'continue';
    }

    return {
      limit: updated,
      exceeded,
      action,
      degraded_to: action === 'degrade' ? limit.degraded_model || undefined : undefined
    };
  }

  /**
   * 消費状況サマリー取得
   */
  async getSummary(tenant_id: string): Promise<{
    total_budget: number;
    total_consumed: number;
    usage_percent: number;
    providers: Array<{
      provider: string;
      budget: number;
      consumed: number;
      percent: number;
      status: 'ok' | 'warning' | 'exceeded';
    }>;
  }> {
    const limits = await this.list(tenant_id);

    let totalBudget = 0;
    let totalConsumed = 0;
    const providers: Array<{
      provider: string;
      budget: number;
      consumed: number;
      percent: number;
      status: 'ok' | 'warning' | 'exceeded';
    }> = [];

    for (const limit of limits) {
      if (!limit.is_active) continue;

      totalBudget += limit.budget_amount;
      totalConsumed += limit.current_consumption;

      const percent = limit.budget_amount > 0
        ? (limit.current_consumption / limit.budget_amount) * 100
        : 0;

      providers.push({
        provider: limit.api_provider,
        budget: limit.budget_amount,
        consumed: limit.current_consumption,
        percent,
        status: percent >= 100 ? 'exceeded' : percent >= limit.alert_threshold_percent ? 'warning' : 'ok'
      });
    }

    return {
      total_budget: totalBudget,
      total_consumed: totalConsumed,
      usage_percent: totalBudget > 0 ? (totalConsumed / totalBudget) * 100 : 0,
      providers
    };
  }
}

// ========================================
// カテゴリ枠オプティマイザー API
// ========================================

export class CategoryQuotaOptimizerAPI {
  constructor(private supabase: SupabaseClient) {}

  /**
   * 枠状況一覧取得
   */
  async list(tenant_id: string, platform?: string): Promise<CategoryListingQuota[]> {
    let query = this.supabase
      .from('category_listing_quotas')
      .select('*')
      .eq('tenant_id', tenant_id)
      .eq('is_active', true);

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query.order('platform').order('category_name');

    if (error) {
      throw new Error(`Failed to fetch quotas: ${error.message}`);
    }

    return data || [];
  }

  /**
   * 出品前の枠チェック＆キュー登録
   */
  async checkAndQueue(params: {
    tenant_id: string;
    product_id: string;
    product_title: string;
    platform: string;
    marketplace: string;
    account_code: string;
    category_id: string;
    workflow_id?: string;
    execution_id?: string;
  }): Promise<{
    can_list: boolean;
    queued: boolean;
    queue_id?: string;
    reason?: string;
    quota: {
      daily_used: number;
      daily_limit: number;
      hourly_used: number;
      hourly_limit: number;
    };
  }> {
    // Supabase RPC呼び出し
    const { data, error } = await this.supabase.rpc('check_and_queue_listing', {
      p_tenant_id: params.tenant_id,
      p_product_id: params.product_id,
      p_product_title: params.product_title,
      p_platform: params.platform,
      p_marketplace: params.marketplace,
      p_account_code: params.account_code,
      p_category_id: params.category_id,
      p_workflow_id: params.workflow_id || null,
      p_execution_id: params.execution_id || null
    });

    if (error) {
      throw new Error(`Quota check failed: ${error.message}`);
    }

    return data;
  }

  /**
   * 夜間シフトキュー一覧取得
   */
  async getNightShiftQueue(tenant_id: string, status?: string): Promise<NightShiftQueueItem[]> {
    let query = this.supabase
      .from('night_shift_queue')
      .select('*')
      .eq('tenant_id', tenant_id)
      .order('priority', { ascending: false })
      .order('queued_at');

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch queue: ${error.message}`);
    }

    return data || [];
  }

  /**
   * キューアイテムの優先度更新
   */
  async updatePriority(queue_id: string, priority: number): Promise<void> {
    const { error } = await this.supabase
      .from('night_shift_queue')
      .update({ priority, updated_at: new Date().toISOString() })
      .eq('id', queue_id);

    if (error) {
      throw new Error(`Failed to update priority: ${error.message}`);
    }
  }

  /**
   * キューアイテムのキャンセル
   */
  async cancelQueueItem(queue_id: string): Promise<void> {
    const { error } = await this.supabase
      .from('night_shift_queue')
      .update({ 
        status: 'cancelled' as any,
        updated_at: new Date().toISOString()
      })
      .eq('id', queue_id)
      .eq('status', 'waiting');

    if (error) {
      throw new Error(`Failed to cancel queue item: ${error.message}`);
    }
  }

  /**
   * 枠使用状況サマリー
   */
  async getQuotaSummary(tenant_id: string): Promise<{
    total_categories: number;
    exceeded_categories: number;
    queue_waiting: number;
    queue_processing: number;
    by_platform: Record<string, {
      total: number;
      exceeded: number;
      usage_percent: number;
    }>;
  }> {
    // 枠状況取得
    const quotas = await this.list(tenant_id);
    
    // キュー状況取得
    const { data: queueData, error: queueError } = await this.supabase
      .from('night_shift_queue')
      .select('status')
      .eq('tenant_id', tenant_id)
      .in('status', ['waiting', 'processing']);

    if (queueError) {
      throw new Error(`Failed to fetch queue summary: ${queueError.message}`);
    }

    const byPlatform: Record<string, { total: number; exceeded: number; usedTotal: number; limitTotal: number }> = {};

    for (const quota of quotas) {
      if (!byPlatform[quota.platform]) {
        byPlatform[quota.platform] = { total: 0, exceeded: 0, usedTotal: 0, limitTotal: 0 };
      }
      byPlatform[quota.platform].total++;
      if (quota.is_quota_exceeded) byPlatform[quota.platform].exceeded++;
      byPlatform[quota.platform].usedTotal += quota.used_today;
      byPlatform[quota.platform].limitTotal += quota.daily_quota;
    }

    const byPlatformResult: Record<string, { total: number; exceeded: number; usage_percent: number }> = {};
    for (const [platform, stats] of Object.entries(byPlatform)) {
      byPlatformResult[platform] = {
        total: stats.total,
        exceeded: stats.exceeded,
        usage_percent: stats.limitTotal > 0 ? (stats.usedTotal / stats.limitTotal) * 100 : 0
      };
    }

    return {
      total_categories: quotas.length,
      exceeded_categories: quotas.filter(q => q.is_quota_exceeded).length,
      queue_waiting: queueData?.filter(q => q.status === 'waiting').length || 0,
      queue_processing: queueData?.filter(q => q.status === 'processing').length || 0,
      by_platform: byPlatformResult
    };
  }
}

// ========================================
// n8n出品ノード用のカテゴリ枠チェックコード
// ========================================

export const N8N_CATEGORY_QUOTA_CHECK = `
// ========================================
// N3 Empire OS V8.2.1 - カテゴリ枠チェック
// 全ての出品系JSONに組み込む
// ========================================

const tenant_id = $json.auth_context?.tenant_id || '00000000-0000-0000-0000-000000000000';
const product_id = $json.product_id;
const product_title = $json.product_title || $json.title || 'Unknown Product';
const platform = $json.platform || 'ebay';
const marketplace = $json.marketplace || 'EBAY_US';
const account_code = $json.account || 'mjt';
const category_id = $json.category_id || '1';
const workflow_id = $execution.id?.split('-')[0] || null;
const execution_id = $execution.id || null;

// Supabase RPC呼び出し
const quotaCheckResponse = await $http.request({
  method: 'POST',
  url: $env.SUPABASE_URL + '/rest/v1/rpc/check_and_queue_listing',
  headers: {
    'apikey': $env.SUPABASE_ANON_KEY,
    'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
    'Content-Type': 'application/json'
  },
  body: {
    p_tenant_id: tenant_id,
    p_product_id: product_id,
    p_product_title: product_title,
    p_platform: platform,
    p_marketplace: marketplace,
    p_account_code: account_code,
    p_category_id: category_id,
    p_workflow_id: workflow_id,
    p_execution_id: execution_id
  },
  json: true
}).catch(err => ({ can_list: true, queued: false, error: err.message }));

// 枠チェック結果を出力に追加
const quotaResult = quotaCheckResponse;

if (!quotaResult.can_list) {
  // 夜間シフト待ちステータスでDBを更新
  await $http.request({
    method: 'PATCH',
    url: $env.SUPABASE_URL + '/rest/v1/products_master?id=eq.' + product_id,
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: {
      listing_status: 'night_shift_waiting',
      night_shift_queue_id: quotaResult.queue_id,
      listing_notes: JSON.stringify({
        reason: quotaResult.reason,
        queued_at: new Date().toISOString(),
        quota: quotaResult.quota
      }),
      updated_at: new Date().toISOString()
    }
  }).catch(() => {});
  
  // ChatWork通知（オプション）
  if ($env.CHATWORK_API_KEY && $env.CHATWORK_ROOM_ID) {
    await $http.request({
      method: 'POST',
      url: 'https://api.chatwork.com/v2/rooms/' + $env.CHATWORK_ROOM_ID + '/messages',
      headers: {
        'X-ChatWorkToken': $env.CHATWORK_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'body=[info][title]⏰ 夜間シフト待ち[/title]商品「' + product_title + '」は枠制限のため夜間シフト待ちキューに追加されました。\\n理由: ' + quotaResult.reason + '\\n日次枠: ' + quotaResult.quota.daily_used + '/' + quotaResult.quota.daily_limit + '[/info]'
    }).catch(() => {});
  }
  
  return [{
    json: {
      ...($input.first().json),
      _quota_check: quotaResult,
      _status: 'queued_for_night_shift',
      _skip_listing: true
    }
  }];
}

// 枠内の場合は続行
return [{
  json: {
    ...($input.first().json),
    _quota_check: quotaResult,
    _status: 'quota_ok'
  }
}];
`;

// ========================================
// 統合エクスポート
// ========================================

export function createUIAPIs(supabase: SupabaseClient) {
  return {
    aiDecisionTraces: new AIDecisionTracesAPI(supabase),
    apiConsumptionLimits: new APIConsumptionLimitsAPI(supabase),
    categoryQuotaOptimizer: new CategoryQuotaOptimizerAPI(supabase)
  };
}

export default {
  AIDecisionTracesAPI,
  APIConsumptionLimitsAPI,
  CategoryQuotaOptimizerAPI,
  createUIAPIs,
  N8N_CATEGORY_QUOTA_CHECK
};
