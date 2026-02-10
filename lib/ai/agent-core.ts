// lib/ai/agent-core.ts
// ========================================
// 🧠 N3 Empire OS V8.2.1 - AIエージェントコア
// 第3フェーズ：知能パッチ - LangChain/LangGraph統合
// ========================================

import { SupabaseClient } from '@supabase/supabase-js';

// ========================================
// 型定義
// ========================================

/** AIエージェントの設定 */
export interface AgentConfig {
  /** エージェント識別子 */
  agentId: string;
  /** エージェント名 */
  name: string;
  /** エージェントタイプ */
  type: AgentType;
  /** 使用するAIモデル */
  model: AIModel;
  /** 最大リトライ回数 */
  maxRetries: number;
  /** HitLエスカレーション閾値（確信度） */
  hitlThreshold: number;
  /** 有効なツール */
  enabledTools: AgentTool[];
  /** システムプロンプト */
  systemPrompt: string;
  /** 温度パラメータ */
  temperature: number;
  /** コスト制限（USD/日） */
  dailyCostLimit: number;
}

/** エージェントタイプ */
export type AgentType = 
  | 'research'      // リサーチ・市場調査
  | 'listing'       // 出品・価格最適化
  | 'crm'           // 顧客対応
  | 'anomaly'       // 異常検知
  | 'selsimilar'    // 類似商品特定
  | 'content'       // コンテンツ生成
  | 'general';      // 汎用

/** AIモデル */
export interface AIModel {
  provider: 'openai' | 'anthropic' | 'google' | 'local';
  modelId: string;
  costPer1kTokens: number;
}

/** エージェントが使用できるツール */
export type AgentTool = 
  | 'db_search'           // DB検索
  | 'web_search'          // Web検索
  | 'vision_compare'      // 画像比較
  | 'price_lookup'        // 価格検索
  | 'inventory_check'     // 在庫チェック
  | 'competitor_analysis' // 競合分析
  | 'translation'         // 翻訳
  | 'hts_lookup'          // HTS分類
  | 'shipping_calc';      // 送料計算

/** エージェント実行コンテキスト */
export interface AgentExecutionContext {
  tenantId: string;
  executionId: string;
  workflowId?: string;
  inputData: Record<string, unknown>;
  authContext: {
    planCode: string;
    tierLevel: number;
    quotaRemaining: number;
  };
}

/** エージェント実行結果 */
export interface AgentResult {
  success: boolean;
  confidence: number;
  result: unknown;
  reasoning: string;
  toolsUsed: string[];
  tokenUsage: {
    input: number;
    output: number;
    total: number;
  };
  costUsd: number;
  executionTimeMs: number;
  requiresHitl: boolean;
  hitlReason?: string;
}

/** ツール実行結果 */
export interface ToolResult {
  tool: AgentTool;
  success: boolean;
  data: unknown;
  error?: string;
  executionTimeMs: number;
}

// ========================================
// デフォルトモデル設定
// ========================================

export const AI_MODELS: Record<string, AIModel> = {
  'gpt-4o': {
    provider: 'openai',
    modelId: 'gpt-4o',
    costPer1kTokens: 0.01
  },
  'gpt-4o-mini': {
    provider: 'openai',
    modelId: 'gpt-4o-mini',
    costPer1kTokens: 0.00015
  },
  'claude-3-5-sonnet': {
    provider: 'anthropic',
    modelId: 'claude-3-5-sonnet-20241022',
    costPer1kTokens: 0.003
  },
  'claude-3-5-haiku': {
    provider: 'anthropic',
    modelId: 'claude-3-5-haiku-20241022',
    costPer1kTokens: 0.0008
  },
  'gemini-2.0-flash': {
    provider: 'google',
    modelId: 'gemini-2.0-flash-exp',
    costPer1kTokens: 0.0001
  },
  'gemini-1.5-pro': {
    provider: 'google',
    modelId: 'gemini-1.5-pro',
    costPer1kTokens: 0.00125
  }
};

// ========================================
// エージェントプリセット（28優先ツール用）
// ========================================

export const AGENT_PRESETS: Record<string, Partial<AgentConfig>> = {
  // リサーチ系（8ツール）
  'market-research': {
    type: 'research',
    model: AI_MODELS['gemini-2.0-flash'],
    maxRetries: 3,
    hitlThreshold: 0.6,
    enabledTools: ['db_search', 'web_search', 'competitor_analysis', 'price_lookup'],
    temperature: 0.3,
    dailyCostLimit: 5.0
  },
  'price-optimizer': {
    type: 'research',
    model: AI_MODELS['gpt-4o-mini'],
    maxRetries: 2,
    hitlThreshold: 0.7,
    enabledTools: ['db_search', 'price_lookup', 'competitor_analysis'],
    temperature: 0.1,
    dailyCostLimit: 3.0
  },
  'trend-analyzer': {
    type: 'research',
    model: AI_MODELS['gemini-1.5-pro'],
    maxRetries: 2,
    hitlThreshold: 0.65,
    enabledTools: ['web_search', 'db_search'],
    temperature: 0.4,
    dailyCostLimit: 10.0
  },
  
  // 出品系（6ツール）
  'listing-optimizer': {
    type: 'listing',
    model: AI_MODELS['claude-3-5-sonnet'],
    maxRetries: 3,
    hitlThreshold: 0.75,
    enabledTools: ['db_search', 'translation', 'hts_lookup', 'shipping_calc'],
    temperature: 0.2,
    dailyCostLimit: 8.0
  },
  'title-generator': {
    type: 'listing',
    model: AI_MODELS['gpt-4o-mini'],
    maxRetries: 2,
    hitlThreshold: 0.8,
    enabledTools: ['db_search', 'translation'],
    temperature: 0.5,
    dailyCostLimit: 2.0
  },
  'category-classifier': {
    type: 'listing',
    model: AI_MODELS['gemini-2.0-flash'],
    maxRetries: 3,
    hitlThreshold: 0.7,
    enabledTools: ['db_search', 'web_search'],
    temperature: 0.1,
    dailyCostLimit: 1.0
  },
  
  // CRM系（5ツール）
  'inquiry-responder': {
    type: 'crm',
    model: AI_MODELS['claude-3-5-sonnet'],
    maxRetries: 2,
    hitlThreshold: 0.8,
    enabledTools: ['db_search', 'inventory_check', 'shipping_calc'],
    temperature: 0.3,
    dailyCostLimit: 5.0
  },
  'return-processor': {
    type: 'crm',
    model: AI_MODELS['gpt-4o-mini'],
    maxRetries: 2,
    hitlThreshold: 0.85,
    enabledTools: ['db_search'],
    temperature: 0.1,
    dailyCostLimit: 2.0
  },
  
  // 異常検知系（4ツール）
  'anomaly-detector': {
    type: 'anomaly',
    model: AI_MODELS['gpt-4o'],
    maxRetries: 1,
    hitlThreshold: 0.6,
    enabledTools: ['db_search', 'web_search', 'price_lookup'],
    temperature: 0.1,
    dailyCostLimit: 10.0
  },
  'fraud-detector': {
    type: 'anomaly',
    model: AI_MODELS['claude-3-5-sonnet'],
    maxRetries: 1,
    hitlThreshold: 0.5,
    enabledTools: ['db_search', 'web_search'],
    temperature: 0.0,
    dailyCostLimit: 5.0
  },
  
  // Selsimilar系（5ツール）
  'selsimilar-ebay': {
    type: 'selsimilar',
    model: AI_MODELS['gpt-4o'],
    maxRetries: 3,
    hitlThreshold: 0.75,
    enabledTools: ['db_search', 'web_search', 'vision_compare', 'price_lookup'],
    temperature: 0.2,
    dailyCostLimit: 15.0
  },
  'selsimilar-amazon': {
    type: 'selsimilar',
    model: AI_MODELS['gpt-4o'],
    maxRetries: 3,
    hitlThreshold: 0.75,
    enabledTools: ['db_search', 'web_search', 'vision_compare', 'price_lookup'],
    temperature: 0.2,
    dailyCostLimit: 15.0
  },
  'image-matcher': {
    type: 'selsimilar',
    model: AI_MODELS['gpt-4o'],
    maxRetries: 2,
    hitlThreshold: 0.7,
    enabledTools: ['vision_compare', 'db_search'],
    temperature: 0.1,
    dailyCostLimit: 10.0
  }
};

// ========================================
// ツール定義（LangChain形式）
// ========================================

export const TOOL_DEFINITIONS = {
  db_search: {
    name: 'db_search',
    description: 'N3データベースから商品、在庫、履歴データを検索します',
    parameters: {
      type: 'object',
      properties: {
        table: {
          type: 'string',
          enum: ['products_master', 'inventory_master', 'price_history', 'sales_history', 'competitor_data']
        },
        filters: {
          type: 'object',
          description: 'フィルタ条件（例：{ "sku": "ABC123" }）'
        },
        select: {
          type: 'string',
          description: '取得するカラム（例："id,title,price"）'
        },
        limit: {
          type: 'number',
          default: 10
        }
      },
      required: ['table']
    }
  },
  
  web_search: {
    name: 'web_search',
    description: 'Web検索を実行し、最新の市場情報や競合データを取得します',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: '検索クエリ'
        },
        site: {
          type: 'string',
          description: '特定サイト内検索（例："ebay.com"）'
        },
        maxResults: {
          type: 'number',
          default: 5
        }
      },
      required: ['query']
    }
  },
  
  vision_compare: {
    name: 'vision_compare',
    description: '2つの商品画像を比較し、類似度スコアと差異を返します',
    parameters: {
      type: 'object',
      properties: {
        sourceImageUrl: {
          type: 'string',
          description: '比較元の画像URL'
        },
        targetImageUrl: {
          type: 'string',
          description: '比較先の画像URL'
        },
        aspectsToCompare: {
          type: 'array',
          items: { type: 'string' },
          description: '比較する観点（例：["color", "shape", "brand_logo"]）',
          default: ['overall', 'details', 'text']
        }
      },
      required: ['sourceImageUrl', 'targetImageUrl']
    }
  },
  
  price_lookup: {
    name: 'price_lookup',
    description: '指定したマーケットプレイスでの価格情報を取得します',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['ebay', 'amazon', 'yahoo', 'mercari', 'rakuten']
        },
        keyword: {
          type: 'string',
          description: '検索キーワード'
        },
        condition: {
          type: 'string',
          enum: ['new', 'used', 'all'],
          default: 'all'
        },
        currency: {
          type: 'string',
          default: 'JPY'
        }
      },
      required: ['platform', 'keyword']
    }
  },
  
  inventory_check: {
    name: 'inventory_check',
    description: '仕入先の在庫状況と価格をリアルタイムでチェックします',
    parameters: {
      type: 'object',
      properties: {
        sourceUrl: {
          type: 'string',
          description: '仕入先のURL'
        },
        productId: {
          type: 'string',
          description: '内部商品ID'
        }
      },
      required: ['sourceUrl']
    }
  },
  
  competitor_analysis: {
    name: 'competitor_analysis',
    description: '競合セラーの出品状況、価格帯、販売実績を分析します',
    parameters: {
      type: 'object',
      properties: {
        platform: {
          type: 'string',
          enum: ['ebay', 'amazon']
        },
        categoryId: {
          type: 'string'
        },
        keyword: {
          type: 'string'
        },
        analysisDepth: {
          type: 'string',
          enum: ['shallow', 'deep'],
          default: 'shallow'
        }
      },
      required: ['platform']
    }
  },
  
  translation: {
    name: 'translation',
    description: 'テキストを翻訳します（日→英が主）',
    parameters: {
      type: 'object',
      properties: {
        text: {
          type: 'string'
        },
        sourceLang: {
          type: 'string',
          default: 'ja'
        },
        targetLang: {
          type: 'string',
          default: 'en'
        },
        style: {
          type: 'string',
          enum: ['formal', 'casual', 'marketing'],
          default: 'formal'
        }
      },
      required: ['text']
    }
  },
  
  hts_lookup: {
    name: 'hts_lookup',
    description: 'HTS（関税分類）コードを検索し、関税率を返します',
    parameters: {
      type: 'object',
      properties: {
        productDescription: {
          type: 'string'
        },
        destinationCountry: {
          type: 'string',
          default: 'US'
        }
      },
      required: ['productDescription']
    }
  },
  
  shipping_calc: {
    name: 'shipping_calc',
    description: '送料を計算します',
    parameters: {
      type: 'object',
      properties: {
        weight: {
          type: 'number',
          description: '重量（kg）'
        },
        dimensions: {
          type: 'object',
          properties: {
            length: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' }
          }
        },
        origin: {
          type: 'string',
          default: 'JP'
        },
        destination: {
          type: 'string'
        },
        carriers: {
          type: 'array',
          items: { type: 'string' },
          default: ['fedex', 'dhl', 'ems']
        }
      },
      required: ['weight', 'destination']
    }
  }
};

// ========================================
// AIエージェントクラス
// ========================================

export class N3AIAgent {
  private config: AgentConfig;
  private supabase: SupabaseClient;
  private toolExecutors: Map<AgentTool, (params: unknown) => Promise<ToolResult>>;
  
  constructor(config: AgentConfig, supabase: SupabaseClient) {
    this.config = config;
    this.supabase = supabase;
    this.toolExecutors = new Map();
    this.initializeToolExecutors();
  }
  
  private initializeToolExecutors(): void {
    // DB検索ツール
    this.toolExecutors.set('db_search', async (params: unknown) => {
      const p = params as { table: string; filters?: Record<string, unknown>; select?: string; limit?: number };
      const start = Date.now();
      try {
        let query = this.supabase.from(p.table).select(p.select || '*');
        
        if (p.filters) {
          Object.entries(p.filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        
        const { data, error } = await query.limit(p.limit || 10);
        
        return {
          tool: 'db_search',
          success: !error,
          data: data || [],
          error: error?.message,
          executionTimeMs: Date.now() - start
        };
      } catch (e) {
        return {
          tool: 'db_search',
          success: false,
          data: null,
          error: e instanceof Error ? e.message : 'Unknown error',
          executionTimeMs: Date.now() - start
        };
      }
    });
    
    // 他のツールは実際の実装に応じて追加
    // web_search, vision_compare, price_lookup, etc.
  }
  
  /** ツール実行 */
  async executeTool(tool: AgentTool, params: unknown): Promise<ToolResult> {
    const executor = this.toolExecutors.get(tool);
    if (!executor) {
      return {
        tool,
        success: false,
        data: null,
        error: `Tool ${tool} not implemented`,
        executionTimeMs: 0
      };
    }
    return executor(params);
  }
  
  /** エージェント実行（メインエントリーポイント） */
  async execute(context: AgentExecutionContext): Promise<AgentResult> {
    const startTime = Date.now();
    const toolsUsed: string[] = [];
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let confidence = 0;
    let result: unknown = null;
    let reasoning = '';
    let requiresHitl = false;
    let hitlReason: string | undefined;
    
    try {
      // 1. AI呼び出し（実際の実装はプロバイダーごとに分岐）
      // ここではスタブとして基本的な処理を行う
      
      // 2. ツール実行ループ（再帰的セルフヒーリング）
      let retryCount = 0;
      let needsMoreData = true;
      
      while (needsMoreData && retryCount < this.config.maxRetries) {
        // AIがツール呼び出しを決定した場合
        // 実際にはLangChain/LangGraphのAgentExecutorを使用
        
        // シミュレーション：データ不足を検知して再試行
        if (retryCount < this.config.maxRetries - 1) {
          // ツール実行
          const toolResult = await this.executeTool('db_search', {
            table: 'products_master',
            filters: context.inputData,
            limit: 5
          });
          
          toolsUsed.push('db_search');
          
          if (toolResult.success && Array.isArray(toolResult.data) && toolResult.data.length > 0) {
            needsMoreData = false;
            result = toolResult.data;
          } else {
            retryCount++;
          }
        } else {
          needsMoreData = false;
        }
      }
      
      // 3. 確信度計算
      confidence = this.calculateConfidence(result, toolsUsed);
      
      // 4. HitL判定
      if (confidence < this.config.hitlThreshold) {
        requiresHitl = true;
        hitlReason = `確信度 ${(confidence * 100).toFixed(1)}% < 閾値 ${(this.config.hitlThreshold * 100).toFixed(1)}%`;
      }
      
      // 5. 推論説明生成
      reasoning = this.generateReasoning(result, toolsUsed, confidence);
      
      // トークン使用量（概算）
      totalInputTokens = JSON.stringify(context.inputData).length / 4;
      totalOutputTokens = JSON.stringify(result).length / 4;
      
    } catch (error) {
      return {
        success: false,
        confidence: 0,
        result: null,
        reasoning: `エラー発生: ${error instanceof Error ? error.message : 'Unknown'}`,
        toolsUsed,
        tokenUsage: { input: totalInputTokens, output: totalOutputTokens, total: totalInputTokens + totalOutputTokens },
        costUsd: this.calculateCost(totalInputTokens + totalOutputTokens),
        executionTimeMs: Date.now() - startTime,
        requiresHitl: true,
        hitlReason: 'エージェント実行エラー'
      };
    }
    
    return {
      success: true,
      confidence,
      result,
      reasoning,
      toolsUsed,
      tokenUsage: {
        input: totalInputTokens,
        output: totalOutputTokens,
        total: totalInputTokens + totalOutputTokens
      },
      costUsd: this.calculateCost(totalInputTokens + totalOutputTokens),
      executionTimeMs: Date.now() - startTime,
      requiresHitl,
      hitlReason
    };
  }
  
  /** 確信度計算 */
  private calculateConfidence(result: unknown, toolsUsed: string[]): number {
    let confidence = 0.5; // ベース
    
    // 結果がある場合
    if (result) {
      confidence += 0.2;
      
      // 配列で複数結果がある場合
      if (Array.isArray(result) && result.length > 1) {
        confidence += 0.1;
      }
    }
    
    // 複数ツールを使用した場合
    if (toolsUsed.length >= 2) {
      confidence += 0.1;
    }
    
    // 画像比較を使用した場合
    if (toolsUsed.includes('vision_compare')) {
      confidence += 0.1;
    }
    
    return Math.min(confidence, 1.0);
  }
  
  /** コスト計算 */
  private calculateCost(totalTokens: number): number {
    return (totalTokens / 1000) * this.config.model.costPer1kTokens;
  }
  
  /** 推論説明生成 */
  private generateReasoning(result: unknown, toolsUsed: string[], confidence: number): string {
    const parts: string[] = [];
    
    parts.push(`【使用ツール】${toolsUsed.join(', ') || 'なし'}`);
    parts.push(`【確信度】${(confidence * 100).toFixed(1)}%`);
    
    if (result) {
      if (Array.isArray(result)) {
        parts.push(`【結果】${result.length}件の候補を発見`);
      } else {
        parts.push(`【結果】データを取得`);
      }
    } else {
      parts.push(`【結果】該当データなし`);
    }
    
    return parts.join('\n');
  }
  
  /** AI判断証跡をDBに記録 */
  async recordDecisionTrace(
    context: AgentExecutionContext,
    result: AgentResult
  ): Promise<void> {
    await this.supabase.from('core.ai_decision_traces').insert({
      tenant_id: context.tenantId,
      decision_type: this.config.type,
      decision_context: {
        agent_id: this.config.agentId,
        agent_name: this.config.name,
        model: this.config.model.modelId
      },
      input_data: context.inputData,
      input_summary: JSON.stringify(context.inputData).substring(0, 500),
      ai_model: this.config.model.modelId,
      ai_response: result.result,
      ai_confidence_score: result.confidence,
      final_decision: result.requiresHitl ? 'escalated_to_hitl' : 'auto_approved',
      decision_reasoning: result.reasoning,
      was_executed: !result.requiresHitl,
      workflow_id: context.workflowId,
      execution_id: context.executionId
    });
  }
}

// ========================================
// エージェントファクトリー
// ========================================

export function createAgent(
  presetName: string,
  supabase: SupabaseClient,
  overrides?: Partial<AgentConfig>
): N3AIAgent {
  const preset = AGENT_PRESETS[presetName];
  if (!preset) {
    throw new Error(`Unknown agent preset: ${presetName}`);
  }
  
  const config: AgentConfig = {
    agentId: `${presetName}-${Date.now()}`,
    name: presetName,
    type: preset.type || 'general',
    model: preset.model || AI_MODELS['gpt-4o-mini'],
    maxRetries: preset.maxRetries || 3,
    hitlThreshold: preset.hitlThreshold || 0.75,
    enabledTools: preset.enabledTools || ['db_search'],
    systemPrompt: '',
    temperature: preset.temperature || 0.3,
    dailyCostLimit: preset.dailyCostLimit || 5.0,
    ...overrides
  };
  
  return new N3AIAgent(config, supabase);
}

// ========================================
// n8n用テンプレートコード
// ========================================

/** n8nのAI Agentノード用テンプレート */
export const N8N_AI_AGENT_NODE = `
// ========================================
// N3 Empire OS V8.2.1 - AI Agent ノード
// LangChain/LangGraph統合
// ========================================

const input = $input.first().json;
const auth_context = input.auth_context || {};
const tenant_id = auth_context.tenant_id || '0';

// エージェント設定
const AGENT_CONFIG = {
  agentId: '{{AGENT_ID}}',
  name: '{{AGENT_NAME}}',
  type: '{{AGENT_TYPE}}',
  model: {
    provider: '{{MODEL_PROVIDER}}',
    modelId: '{{MODEL_ID}}',
    costPer1kTokens: {{COST_PER_1K_TOKENS}}
  },
  maxRetries: {{MAX_RETRIES}},
  hitlThreshold: {{HITL_THRESHOLD}},
  enabledTools: [{{ENABLED_TOOLS}}],
  temperature: {{TEMPERATURE}},
  systemPrompt: \`{{SYSTEM_PROMPT}}\`
};

// ツール定義
const TOOLS = [
  {
    name: 'db_search',
    description: 'N3データベースから商品、在庫、履歴データを検索',
    execute: async (params) => {
      const { table, filters, select, limit } = params;
      const response = await $http.request({
        method: 'GET',
        url: $env.SUPABASE_URL + '/rest/v1/' + table,
        qs: { ...filters, select: select || '*', limit: limit || 10 },
        headers: {
          'apikey': $env.SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY
        },
        json: true
      });
      return response;
    }
  },
  {
    name: 'web_search',
    description: 'Web検索で最新情報を取得',
    execute: async (params) => {
      const { query, site, maxResults } = params;
      // SerpAPI or Brave Search APIを使用
      const searchQuery = site ? query + ' site:' + site : query;
      const response = await $http.request({
        method: 'GET',
        url: 'https://serpapi.com/search',
        qs: {
          q: searchQuery,
          api_key: $env.SERPAPI_KEY,
          num: maxResults || 5
        },
        json: true
      });
      return response.organic_results || [];
    }
  },
  {
    name: 'vision_compare',
    description: '画像比較による類似度判定',
    execute: async (params) => {
      const { sourceImageUrl, targetImageUrl, aspectsToCompare } = params;
      // OpenAI Vision APIを使用
      const response = await $http.request({
        method: 'POST',
        url: 'https://api.openai.com/v1/chat/completions',
        headers: {
          'Authorization': 'Bearer ' + $env.OPENAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: {
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: '2つの商品画像を比較し、類似度スコア（0-100）と詳細な差異を返してください。JSON形式で出力。'
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: '以下の2つの画像を比較してください。比較観点: ' + (aspectsToCompare || ['overall']).join(', ') },
                { type: 'image_url', image_url: { url: sourceImageUrl } },
                { type: 'image_url', image_url: { url: targetImageUrl } }
              ]
            }
          ],
          max_tokens: 1000,
          response_format: { type: 'json_object' }
        },
        json: true
      });
      return JSON.parse(response.choices[0].message.content);
    }
  }
];

// 再帰的セルフヒーリングループ
async function executeWithRetry(task, maxRetries) {
  let lastResult = null;
  let retryCount = 0;
  
  while (retryCount < maxRetries) {
    try {
      // AIに判断させる
      const aiResponse = await callAI(task, lastResult);
      
      // ツール呼び出しが必要な場合
      if (aiResponse.tool_calls && aiResponse.tool_calls.length > 0) {
        const toolResults = [];
        for (const toolCall of aiResponse.tool_calls) {
          const tool = TOOLS.find(t => t.name === toolCall.name);
          if (tool) {
            const result = await tool.execute(toolCall.arguments);
            toolResults.push({ name: toolCall.name, result });
          }
        }
        
        // ツール結果をAIにフィードバック
        lastResult = { ...aiResponse, tool_results: toolResults };
        
        // データが十分か判定
        if (aiResponse.has_sufficient_data) {
          return { success: true, ...aiResponse };
        }
      } else {
        // 最終回答
        return { success: true, ...aiResponse };
      }
    } catch (error) {
      lastResult = { error: error.message };
    }
    
    retryCount++;
  }
  
  return { success: false, error: 'Max retries exceeded', lastResult };
}

// AI呼び出し関数
async function callAI(task, previousResult) {
  const messages = [
    { role: 'system', content: AGENT_CONFIG.systemPrompt },
    { role: 'user', content: JSON.stringify({ task, previous_result: previousResult }) }
  ];
  
  const response = await $http.request({
    method: 'POST',
    url: AGENT_CONFIG.model.provider === 'openai' 
      ? 'https://api.openai.com/v1/chat/completions'
      : AGENT_CONFIG.model.provider === 'anthropic'
      ? 'https://api.anthropic.com/v1/messages'
      : 'https://generativelanguage.googleapis.com/v1/models/' + AGENT_CONFIG.model.modelId + ':generateContent',
    headers: {
      'Authorization': 'Bearer ' + $env[AGENT_CONFIG.model.provider.toUpperCase() + '_API_KEY'],
      'Content-Type': 'application/json'
    },
    body: {
      model: AGENT_CONFIG.model.modelId,
      messages,
      temperature: AGENT_CONFIG.temperature,
      tools: TOOLS.map(t => ({ type: 'function', function: { name: t.name, description: t.description, parameters: {} } }))
    },
    json: true
  });
  
  return parseAIResponse(response);
}

// メイン実行
const task = input.task || input;
const result = await executeWithRetry(task, AGENT_CONFIG.maxRetries);

// 確信度チェック → HitLエスカレーション
const confidence = result.confidence || 0.5;
const requiresHitL = confidence < AGENT_CONFIG.hitlThreshold;

// AI判断証跡を記録
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
    decision_type: AGENT_CONFIG.type,
    decision_context: { agent_id: AGENT_CONFIG.agentId, model: AGENT_CONFIG.model.modelId },
    input_data: task,
    ai_model: AGENT_CONFIG.model.modelId,
    ai_confidence_score: confidence,
    final_decision: requiresHitL ? 'escalated_to_hitl' : 'auto_executed',
    decision_reasoning: result.reasoning || '',
    was_executed: !requiresHitL,
    workflow_id: $workflow.id,
    execution_id: $execution.id
  }
});

return [{
  json: {
    ...input,
    ai_agent_result: result,
    _requires_hitl: requiresHitL,
    _hitl_reason: requiresHitL ? 'AI確信度が閾値未満: ' + (confidence * 100).toFixed(1) + '%' : null
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export default {
  // 型・設定
  AI_MODELS,
  AGENT_PRESETS,
  TOOL_DEFINITIONS,
  
  // クラス
  N3AIAgent,
  
  // ファクトリー
  createAgent,
  
  // n8nテンプレート
  N8N_AI_AGENT_NODE
};
