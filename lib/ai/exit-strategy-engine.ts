// lib/ai/exit-strategy-engine.ts
// ========================================
// 🚪 N3 Empire OS V8.2.1-Autonomous
// Exit Strategy Engine - 二段階撤退システム
// ========================================

import { SupabaseClient } from '@supabase/supabase-js';

// ========================================
// 型定義
// ========================================

/** 撤退ステージ */
export type ExitStage = 
  | 'active'        // アクティブ（通常販売中）
  | 'soft_exit'     // ソフト撤退（値下げ＋多販路展開）
  | 'hard_exit'     // ハード撤退（強制損切り）
  | 'liquidated'    // 清算完了
  | 'hold';         // ホールド（撤退保留）

/** 撤退トリガー */
export type ExitTrigger =
  | 'stagnation_30'     // 30日停滞
  | 'stagnation_60'     // 60日停滞
  | 'price_crash_30'    // 相場30%崩壊
  | 'cash_flow_crisis'  // キャッシュフロー危機
  | 'manual_override'   // 手動オーバーライド
  | 'eol_recovery';     // EOL商品の回復売却

/** 撤退アクション */
export interface ExitAction {
  /** アクションタイプ */
  type: 'price_cut' | 'reroute' | 'bundle' | 'auction' | 'donate' | 'scrap';
  /** アクション詳細 */
  details: {
    /** 値下げ率（%） */
    priceReductionPercent?: number;
    /** 新しい販路 */
    newChannels?: string[];
    /** バンドル対象 */
    bundleWith?: string[];
    /** オークション設定 */
    auctionConfig?: {
      startPrice: number;
      reservePrice: number;
      duration: number;
    };
  };
  /** 期限 */
  deadline: Date;
  /** 優先度 */
  priority: 'urgent' | 'normal' | 'low';
}

/** 撤退計画 */
export interface ExitPlan {
  /** 商品ID */
  productId: string;
  /** SKU */
  sku: string;
  /** 現在のステージ */
  currentStage: ExitStage;
  /** トリガー */
  trigger: ExitTrigger;
  /** 計画されたアクション */
  actions: ExitAction[];
  /** 予想損失額 */
  estimatedLoss: number;
  /** 予想回収額 */
  estimatedRecovery: number;
  /** 回収率 */
  recoveryRate: number;
  /** HitL承認必要 */
  requiresApproval: boolean;
  /** 承認理由 */
  approvalReason?: string;
  /** 作成日時 */
  createdAt: Date;
  /** 実行期限 */
  executionDeadline: Date;
}

/** 撤退設定 */
export interface ExitStrategyConfig {
  /** ソフト撤退トリガー（停滞日数） */
  softExitDays: number;
  /** ハード撤退トリガー（停滞日数） */
  hardExitDays: number;
  /** 相場崩壊閾値（%） */
  priceDropThreshold: number;
  /** ソフト撤退時の値下げ率（%） */
  softExitPriceReduction: number;
  /** ハード撤退時の最大損切り率（%） */
  hardExitMaxLoss: number;
  /** 自動多販路展開を有効化 */
  enableAutoReroute: boolean;
  /** 自動多販路の対象 */
  rerouteChannels: string[];
  /** HitL承認閾値（損失額） */
  hitlThresholdAmount: number;
  /** HitL承認閾値（損失率%） */
  hitlThresholdPercent: number;
}

/** 撤退実行結果 */
export interface ExitExecutionResult {
  /** 成功フラグ */
  success: boolean;
  /** 実行されたアクション */
  executedActions: string[];
  /** 実際の回収額 */
  actualRecovery: number;
  /** 実際の損失額 */
  actualLoss: number;
  /** エラー */
  errors: string[];
  /** 次のアクション */
  nextAction?: ExitAction;
}

/** 在庫アイテム（撤退分析用） */
export interface InventoryItemForExit {
  productId: string;
  sku: string;
  title: string;
  quantity: number;
  purchasePrice: number;
  currentListPrice: number;
  marketPrice: number;
  daysInStock: number;
  lastSaleDate: Date | null;
  views30d: number;
  platform: string;
  category: string;
}

// ========================================
// デフォルト設定
// ========================================

export const DEFAULT_EXIT_CONFIG: ExitStrategyConfig = {
  softExitDays: 30,
  hardExitDays: 60,
  priceDropThreshold: 30,
  softExitPriceReduction: 15,
  hardExitMaxLoss: 50,
  enableAutoReroute: true,
  rerouteChannels: ['mercari', 'yahoo_auction', 'rakuma', 'ebay_auction'],
  hitlThresholdAmount: 10000, // 1万円以上の損失
  hitlThresholdPercent: 30    // 30%以上の損失
};

// ========================================
// Exit Strategy Engine メインクラス
// ========================================

export class ExitStrategyEngine {
  private supabase: SupabaseClient;
  private config: ExitStrategyConfig;
  
  constructor(supabase: SupabaseClient, config?: Partial<ExitStrategyConfig>) {
    this.supabase = supabase;
    this.config = { ...DEFAULT_EXIT_CONFIG, ...config };
  }
  
  // ========================================
  // 撤退候補の検出
  // ========================================
  
  /**
   * 撤退候補の在庫を検出
   */
  async detectExitCandidates(tenantId: string): Promise<{
    softExitCandidates: InventoryItemForExit[];
    hardExitCandidates: InventoryItemForExit[];
    priceCrashCandidates: InventoryItemForExit[];
  }> {
    // 在庫データを取得
    const { data: inventory, error } = await this.supabase
      .from('inventory_master')
      .select(`
        id, sku, quantity, purchase_price, current_price,
        days_in_stock, last_sale_date, views_30d, platform,
        products_master(id, title, category, market_price)
      `)
      .eq('tenant_id', tenantId)
      .gt('quantity', 0)
      .order('days_in_stock', { ascending: false });
    
    if (error || !inventory) {
      return { softExitCandidates: [], hardExitCandidates: [], priceCrashCandidates: [] };
    }
    
    const items: InventoryItemForExit[] = inventory.map(item => ({
      productId: item.products_master?.id || item.id,
      sku: item.sku,
      title: item.products_master?.title || '',
      quantity: item.quantity,
      purchasePrice: item.purchase_price || 0,
      currentListPrice: item.current_price || 0,
      marketPrice: item.products_master?.market_price || item.current_price || 0,
      daysInStock: item.days_in_stock || 0,
      lastSaleDate: item.last_sale_date ? new Date(item.last_sale_date) : null,
      views30d: item.views_30d || 0,
      platform: item.platform || 'unknown',
      category: item.products_master?.category || 'unknown'
    }));
    
    // 分類
    const softExitCandidates = items.filter(item => 
      item.daysInStock >= this.config.softExitDays && 
      item.daysInStock < this.config.hardExitDays
    );
    
    const hardExitCandidates = items.filter(item => 
      item.daysInStock >= this.config.hardExitDays
    );
    
    const priceCrashCandidates = items.filter(item => {
      if (!item.purchasePrice || !item.marketPrice) return false;
      const priceChange = ((item.marketPrice - item.purchasePrice) / item.purchasePrice) * 100;
      return priceChange <= -this.config.priceDropThreshold;
    });
    
    return { softExitCandidates, hardExitCandidates, priceCrashCandidates };
  }
  
  // ========================================
  // 撤退計画の生成
  // ========================================
  
  /**
   * ソフト撤退計画を生成
   */
  generateSoftExitPlan(item: InventoryItemForExit): ExitPlan {
    const actions: ExitAction[] = [];
    
    // 1. 値下げアクション
    const newPrice = item.currentListPrice * (1 - this.config.softExitPriceReduction / 100);
    actions.push({
      type: 'price_cut',
      details: {
        priceReductionPercent: this.config.softExitPriceReduction
      },
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3日以内
      priority: 'normal'
    });
    
    // 2. 多販路展開（有効時）
    if (this.config.enableAutoReroute) {
      actions.push({
        type: 'reroute',
        details: {
          newChannels: this.config.rerouteChannels.filter(ch => ch !== item.platform)
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7日以内
        priority: 'normal'
      });
    }
    
    // 損失計算
    const estimatedRecovery = newPrice * item.quantity;
    const originalValue = item.purchasePrice * item.quantity;
    const estimatedLoss = Math.max(0, originalValue - estimatedRecovery);
    const recoveryRate = estimatedRecovery / originalValue;
    
    // HitL判定
    const requiresApproval = 
      estimatedLoss >= this.config.hitlThresholdAmount ||
      (1 - recoveryRate) * 100 >= this.config.hitlThresholdPercent;
    
    return {
      productId: item.productId,
      sku: item.sku,
      currentStage: 'soft_exit',
      trigger: 'stagnation_30',
      actions,
      estimatedLoss,
      estimatedRecovery,
      recoveryRate,
      requiresApproval,
      approvalReason: requiresApproval 
        ? `損失額 ${estimatedLoss.toLocaleString()}円 または 損失率 ${((1 - recoveryRate) * 100).toFixed(1)}%が閾値超過` 
        : undefined,
      createdAt: new Date(),
      executionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };
  }
  
  /**
   * ハード撤退計画を生成
   */
  generateHardExitPlan(item: InventoryItemForExit): ExitPlan {
    const actions: ExitAction[] = [];
    
    // 1. 大幅値下げ
    const maxLossPrice = item.purchasePrice * (1 - this.config.hardExitMaxLoss / 100);
    const aggressivePrice = Math.max(maxLossPrice, item.marketPrice * 0.7);
    
    actions.push({
      type: 'price_cut',
      details: {
        priceReductionPercent: Math.round((1 - aggressivePrice / item.currentListPrice) * 100)
      },
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24時間以内
      priority: 'urgent'
    });
    
    // 2. オークション出品
    actions.push({
      type: 'auction',
      details: {
        auctionConfig: {
          startPrice: Math.floor(aggressivePrice * 0.5),
          reservePrice: Math.floor(aggressivePrice * 0.8),
          duration: 7
        }
      },
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3日以内
      priority: 'urgent'
    });
    
    // 3. バンドル販売検討
    actions.push({
      type: 'bundle',
      details: {},
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      priority: 'normal'
    });
    
    // 損失計算
    const estimatedRecovery = aggressivePrice * item.quantity;
    const originalValue = item.purchasePrice * item.quantity;
    const estimatedLoss = Math.max(0, originalValue - estimatedRecovery);
    const recoveryRate = estimatedRecovery / originalValue;
    
    return {
      productId: item.productId,
      sku: item.sku,
      currentStage: 'hard_exit',
      trigger: 'stagnation_60',
      actions,
      estimatedLoss,
      estimatedRecovery,
      recoveryRate,
      requiresApproval: true, // ハード撤退は常に承認必要
      approvalReason: `ハード撤退: 60日以上停滞。予想損失 ${estimatedLoss.toLocaleString()}円`,
      createdAt: new Date(),
      executionDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    };
  }
  
  /**
   * 相場崩壊時の緊急撤退計画を生成
   */
  generateCrashExitPlan(item: InventoryItemForExit): ExitPlan {
    const actions: ExitAction[] = [];
    
    // 緊急売却
    const crashPrice = item.marketPrice * 0.9; // 市場価格の90%
    
    actions.push({
      type: 'price_cut',
      details: {
        priceReductionPercent: Math.round((1 - crashPrice / item.currentListPrice) * 100)
      },
      deadline: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12時間以内
      priority: 'urgent'
    });
    
    // 即時オークション
    actions.push({
      type: 'auction',
      details: {
        auctionConfig: {
          startPrice: 1, // 1円スタート
          reservePrice: Math.floor(crashPrice * 0.5),
          duration: 1 // 1日
        }
      },
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      priority: 'urgent'
    });
    
    const estimatedRecovery = crashPrice * item.quantity;
    const originalValue = item.purchasePrice * item.quantity;
    const estimatedLoss = Math.max(0, originalValue - estimatedRecovery);
    
    return {
      productId: item.productId,
      sku: item.sku,
      currentStage: 'hard_exit',
      trigger: 'price_crash_30',
      actions,
      estimatedLoss,
      estimatedRecovery,
      recoveryRate: estimatedRecovery / originalValue,
      requiresApproval: true,
      approvalReason: `緊急撤退: 相場30%以上崩壊。即時売却を推奨。`,
      createdAt: new Date(),
      executionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
  }
  
  // ========================================
  // 撤退計画の実行
  // ========================================
  
  /**
   * 撤退計画を実行（承認済みの場合）
   */
  async executePlan(plan: ExitPlan, tenantId: string): Promise<ExitExecutionResult> {
    const executedActions: string[] = [];
    const errors: string[] = [];
    let actualRecovery = 0;
    let actualLoss = 0;
    
    for (const action of plan.actions) {
      try {
        switch (action.type) {
          case 'price_cut':
            await this.executePriceCut(plan.productId, action.details.priceReductionPercent || 0, tenantId);
            executedActions.push(`価格を${action.details.priceReductionPercent}%値下げ`);
            break;
            
          case 'reroute':
            if (action.details.newChannels?.length) {
              await this.executeReroute(plan.productId, action.details.newChannels, tenantId);
              executedActions.push(`${action.details.newChannels.join(', ')}に出品`);
            }
            break;
            
          case 'auction':
            if (action.details.auctionConfig) {
              await this.executeAuction(plan.productId, action.details.auctionConfig, tenantId);
              executedActions.push(`オークション出品（開始価格: ${action.details.auctionConfig.startPrice}円）`);
            }
            break;
            
          case 'bundle':
            // バンドル販売のロジック（将来実装）
            executedActions.push('バンドル販売候補としてマーク');
            break;
        }
      } catch (error) {
        errors.push(`${action.type}実行エラー: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    }
    
    // 撤退ログを記録
    await this.recordExitLog(plan, tenantId, executedActions, errors);
    
    return {
      success: errors.length === 0,
      executedActions,
      actualRecovery,
      actualLoss,
      errors,
      nextAction: errors.length > 0 ? plan.actions.find(a => !executedActions.includes(a.type)) : undefined
    };
  }
  
  /** 価格変更を実行 */
  private async executePriceCut(productId: string, reductionPercent: number, tenantId: string): Promise<void> {
    // 現在の価格を取得
    const { data: product } = await this.supabase
      .from('products_master')
      .select('selling_price')
      .eq('id', productId)
      .single();
    
    if (!product) throw new Error('商品が見つかりません');
    
    const newPrice = Math.floor(product.selling_price * (1 - reductionPercent / 100));
    
    // 価格更新
    await this.supabase
      .from('products_master')
      .update({ selling_price: newPrice, updated_at: new Date().toISOString() })
      .eq('id', productId);
    
    // 価格履歴に記録
    await this.supabase
      .from('commerce.price_history')
      .insert({
        tenant_id: tenantId,
        product_id: productId,
        price: newPrice,
        currency: 'JPY',
        price_type: 'exit_strategy',
        change_reason: `撤退戦略: ${reductionPercent}%値下げ`,
        changed_by: 'exit_strategy_engine'
      });
  }
  
  /** 多販路展開を実行 */
  private async executeReroute(productId: string, channels: string[], tenantId: string): Promise<void> {
    // 各チャンネルへの出品キューに追加
    for (const channel of channels) {
      await this.supabase
        .from('commerce.night_shift_queue')
        .insert({
          tenant_id: tenantId,
          product_id: productId,
          platform: channel,
          marketplace: channel.toUpperCase(),
          account_code: 'default',
          category_id: 'auto',
          status: 'waiting',
          queue_reason: 'exit_strategy_reroute',
          priority: 80 // 高優先度
        });
    }
  }
  
  /** オークション出品を実行 */
  private async executeAuction(
    productId: string, 
    config: { startPrice: number; reservePrice: number; duration: number },
    tenantId: string
  ): Promise<void> {
    // オークション出品キューに追加
    await this.supabase
      .from('commerce.night_shift_queue')
      .insert({
        tenant_id: tenantId,
        product_id: productId,
        platform: 'yahoo_auction',
        marketplace: 'YAHOO_AUCTION_JP',
        account_code: 'default',
        category_id: 'auto',
        status: 'waiting',
        queue_reason: 'exit_strategy_auction',
        priority: 90, // 最高優先度
        scheduled_for: new Date().toISOString(),
        result_data: {
          auction_config: config,
          type: 'exit_auction'
        }
      });
  }
  
  /** 撤退ログを記録 */
  private async recordExitLog(
    plan: ExitPlan, 
    tenantId: string, 
    executedActions: string[], 
    errors: string[]
  ): Promise<void> {
    await this.supabase
      .from('commerce.exit_strategy_log')
      .insert({
        tenant_id: tenantId,
        product_id: plan.productId,
        sku: plan.sku,
        stage: plan.currentStage,
        trigger: plan.trigger,
        planned_actions: plan.actions,
        executed_actions: executedActions,
        estimated_loss: plan.estimatedLoss,
        estimated_recovery: plan.estimatedRecovery,
        recovery_rate: plan.recoveryRate,
        errors: errors.length > 0 ? errors : null,
        status: errors.length === 0 ? 'completed' : 'partial',
        executed_at: new Date().toISOString()
      });
    
    // AI判断証跡にも記録
    await this.supabase
      .from('core.ai_decision_traces')
      .insert({
        tenant_id: tenantId,
        decision_type: `exit_${plan.currentStage}`,
        decision_context: {
          module: 'exit_strategy_engine',
          trigger: plan.trigger
        },
        input_data: {
          product_id: plan.productId,
          sku: plan.sku,
          stage: plan.currentStage
        },
        input_summary: `撤退: ${plan.sku} - ${plan.currentStage}`,
        ai_model: 'exit_strategy_v1',
        ai_confidence_score: plan.recoveryRate,
        final_decision: plan.currentStage,
        decision_reasoning: `予想損失: ${plan.estimatedLoss}円, 回収率: ${(plan.recoveryRate * 100).toFixed(1)}%`,
        was_executed: true,
        execution_result: {
          executed_actions: executedActions,
          errors
        }
      });
  }
  
  // ========================================
  // 撤退サマリーの生成
  // ========================================
  
  /**
   * 撤退状況のサマリーを生成
   */
  async generateExitSummary(tenantId: string): Promise<{
    totalCandidates: number;
    softExitCount: number;
    hardExitCount: number;
    totalEstimatedLoss: number;
    totalEstimatedRecovery: number;
    pendingApprovals: number;
    recentExecutions: number;
  }> {
    const candidates = await this.detectExitCandidates(tenantId);
    
    const softPlans = candidates.softExitCandidates.map(item => this.generateSoftExitPlan(item));
    const hardPlans = candidates.hardExitCandidates.map(item => this.generateHardExitPlan(item));
    
    const allPlans = [...softPlans, ...hardPlans];
    
    // 最近の実行数を取得
    const { count: recentExecutions } = await this.supabase
      .from('commerce.exit_strategy_log')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('executed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
    
    return {
      totalCandidates: allPlans.length,
      softExitCount: softPlans.length,
      hardExitCount: hardPlans.length,
      totalEstimatedLoss: allPlans.reduce((sum, p) => sum + p.estimatedLoss, 0),
      totalEstimatedRecovery: allPlans.reduce((sum, p) => sum + p.estimatedRecovery, 0),
      pendingApprovals: allPlans.filter(p => p.requiresApproval).length,
      recentExecutions: recentExecutions || 0
    };
  }
}

// ========================================
// n8n用テンプレート
// ========================================

export const N8N_EXIT_STRATEGY_NODE = `
// ========================================
// N3 Empire OS V8.2.1 - Exit Strategy Engine ノード
// 二段階撤退システム
// ========================================

const input = $input.first().json;
const auth_context = input.auth_context || {};
const tenant_id = auth_context.tenant_id || '0';

// 設定
const CONFIG = {
  softExitDays: 30,
  hardExitDays: 60,
  priceDropThreshold: 30,
  softExitPriceReduction: 15,
  hardExitMaxLoss: 50,
  hitlThresholdAmount: 10000,
  hitlThresholdPercent: 30
};

// 撤退候補を検出
async function detectCandidates() {
  const response = await $http.request({
    method: 'GET',
    url: $env.SUPABASE_URL + '/rest/v1/inventory_master',
    qs: {
      tenant_id: 'eq.' + tenant_id,
      quantity: 'gt.0',
      select: 'id,sku,quantity,purchase_price,current_price,days_in_stock,last_sale_date,platform,products_master(id,title,category,market_price)',
      order: 'days_in_stock.desc'
    },
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY
    },
    json: true
  });
  
  return response || [];
}

// 撤退計画を生成
function generatePlan(item, stage) {
  const actions = [];
  let trigger = 'stagnation_30';
  
  if (stage === 'soft_exit') {
    actions.push({
      type: 'price_cut',
      details: { priceReductionPercent: CONFIG.softExitPriceReduction },
      priority: 'normal'
    });
    actions.push({
      type: 'reroute',
      details: { newChannels: ['mercari', 'yahoo_auction'] },
      priority: 'normal'
    });
  } else if (stage === 'hard_exit') {
    trigger = 'stagnation_60';
    actions.push({
      type: 'price_cut',
      details: { priceReductionPercent: Math.min(50, CONFIG.hardExitMaxLoss) },
      priority: 'urgent'
    });
    actions.push({
      type: 'auction',
      details: {
        auctionConfig: {
          startPrice: 1,
          reservePrice: Math.floor(item.purchase_price * 0.5),
          duration: 7
        }
      },
      priority: 'urgent'
    });
  }
  
  const estimatedRecovery = item.current_price * (1 - CONFIG.softExitPriceReduction / 100) * item.quantity;
  const originalValue = item.purchase_price * item.quantity;
  const estimatedLoss = Math.max(0, originalValue - estimatedRecovery);
  const recoveryRate = estimatedRecovery / originalValue;
  
  const requiresApproval = 
    estimatedLoss >= CONFIG.hitlThresholdAmount ||
    (1 - recoveryRate) * 100 >= CONFIG.hitlThresholdPercent ||
    stage === 'hard_exit';
  
  return {
    productId: item.id,
    sku: item.sku,
    currentStage: stage,
    trigger,
    actions,
    estimatedLoss,
    estimatedRecovery,
    recoveryRate,
    requiresApproval,
    approvalReason: requiresApproval ? '損失額/率が閾値超過またはハード撤退' : null
  };
}

// メイン処理
const inventory = await detectCandidates();

const softExitCandidates = inventory.filter(i => 
  i.days_in_stock >= CONFIG.softExitDays && 
  i.days_in_stock < CONFIG.hardExitDays
);

const hardExitCandidates = inventory.filter(i => 
  i.days_in_stock >= CONFIG.hardExitDays
);

const softPlans = softExitCandidates.map(i => generatePlan(i, 'soft_exit'));
const hardPlans = hardExitCandidates.map(i => generatePlan(i, 'hard_exit'));

const allPlans = [...softPlans, ...hardPlans];
const pendingApprovals = allPlans.filter(p => p.requiresApproval);

// AI判断証跡を記録
if (allPlans.length > 0) {
  await $http.request({
    method: 'POST',
    url: $env.SUPABASE_URL + '/rest/v1/core.ai_decision_traces',
    headers: {
      'apikey': $env.SUPABASE_ANON_KEY,
      'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: {
      tenant_id,
      decision_type: 'exit_strategy_scan',
      decision_context: { module: 'exit_strategy_engine' },
      input_data: { total_inventory: inventory.length },
      input_summary: 'Exit Strategy スキャン: ' + allPlans.length + '件検出',
      ai_model: 'exit_strategy_v1',
      ai_confidence_score: 1,
      final_decision: 'scan_completed',
      decision_reasoning: 'Soft: ' + softPlans.length + '件, Hard: ' + hardPlans.length + '件',
      was_executed: true,
      workflow_id: $workflow.id,
      execution_id: $execution.id
    }
  }).catch(() => {});
}

return [{
  json: {
    ...input,
    exit_strategy_result: {
      totalCandidates: allPlans.length,
      softExitCount: softPlans.length,
      hardExitCount: hardPlans.length,
      plans: allPlans,
      totalEstimatedLoss: allPlans.reduce((sum, p) => sum + p.estimatedLoss, 0),
      totalEstimatedRecovery: allPlans.reduce((sum, p) => sum + p.estimatedRecovery, 0),
      pendingApprovals: pendingApprovals.length
    },
    _requires_hitl: pendingApprovals.length > 0,
    _hitl_reason: pendingApprovals.length > 0 
      ? pendingApprovals.length + '件の撤退計画が承認待ち'
      : null
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export function createExitStrategyEngine(
  supabase: SupabaseClient, 
  config?: Partial<ExitStrategyConfig>
): ExitStrategyEngine {
  return new ExitStrategyEngine(supabase, config);
}

export default {
  ExitStrategyEngine,
  createExitStrategyEngine,
  DEFAULT_EXIT_CONFIG,
  N8N_EXIT_STRATEGY_NODE
};
