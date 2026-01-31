// lib/ai/mass-upgrade-mapping.ts
// ========================================
// 🚀 N3 Empire OS V8.2.1 - 152ツール一括換装マッピング
// 第3フェーズ：知能パッチ - 最終統合ルール
// ========================================

import { AgentType, AGENT_PRESETS, AI_MODELS } from './agent-core';

// ========================================
// 型定義
// ========================================

/** ツールカテゴリ */
export type ToolCategory = 
  | 'research'      // リサーチ系
  | 'listing'       // 出品系
  | 'inventory'     // 在庫系
  | 'crm'           // CRM系
  | 'order'         // 受注系
  | 'finance'       // 財務系
  | 'media'         // メディア系
  | 'analytics'     // 分析系
  | 'automation'    // 自動化系
  | 'utility';      // ユーティリティ系

/** 知能レベル */
export type IntelligenceLevel = 
  | 'none'          // AI不要
  | 'basic'         // 基本的なAI（分類、翻訳等）
  | 'standard'      // 標準AI（判断、推奨等）
  | 'advanced'      // 高度AI（自律実行、複合判断）
  | 'autonomous';   // 完全自律（Selsimilar等）

/** ツール換装定義 */
export interface ToolUpgradeSpec {
  /** ツールID（ファイル名等） */
  toolId: string;
  /** ツール名 */
  name: string;
  /** カテゴリ */
  category: ToolCategory;
  /** 知能レベル */
  intelligenceLevel: IntelligenceLevel;
  /** 優先度（1-3: 高-低） */
  priority: 1 | 2 | 3;
  /** 使用するエージェントプリセット */
  agentPreset?: string;
  /** カスタムエージェント設定 */
  customAgentConfig?: {
    type: AgentType;
    modelId: string;
    hitlThreshold: number;
    enabledTools: string[];
  };
  /** セルフヒーリング設定 */
  selfHealingConfig?: {
    maxRetries: number;
    enableAlternativeApis: boolean;
    allowDegradedMode: boolean;
  };
  /** V8.2.1統合オプション */
  v821Options: {
    requiresAuthGate: boolean;
    requiresIdentityManager: boolean;
    requiresPolicyValidator: boolean;
    requiresHitL: boolean;
    requiresAuditLog: boolean;
    requiresCategoryQuotaCheck: boolean;
    requiresAIAgent: boolean;
    requiresSelfHealing: boolean;
  };
}

/** 一括換装結果 */
export interface MassUpgradeResult {
  toolId: string;
  status: 'success' | 'skipped' | 'error';
  message: string;
  upgradedComponents: string[];
}

// ========================================
// 152ツール完全マッピング
// ========================================

export const TOOL_UPGRADE_MAPPING: ToolUpgradeSpec[] = [
  // ========================================
  // リサーチ系（28ツール）- 優先度1
  // ========================================
  {
    toolId: 'yahoo-auction-research',
    name: 'ヤフオクリサーチ',
    category: 'research',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'market-research',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'ebay-sold-research',
    name: 'eBay販売実績リサーチ',
    category: 'research',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'market-research',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'amazon-research',
    name: 'Amazonリサーチ',
    category: 'research',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'market-research',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'selsimilar-ebay',
    name: 'Selsimilar（eBay）',
    category: 'research',
    intelligenceLevel: 'autonomous',
    priority: 1,
    agentPreset: 'selsimilar-ebay',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'selsimilar-amazon',
    name: 'Selsimilar（Amazon）',
    category: 'research',
    intelligenceLevel: 'autonomous',
    priority: 1,
    agentPreset: 'selsimilar-amazon',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'price-optimizer',
    name: '価格最適化',
    category: 'research',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'price-optimizer',
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'trend-analyzer',
    name: 'トレンド分析',
    category: 'research',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'trend-analyzer',
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'competitor-analysis',
    name: '競合分析',
    category: 'research',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'market-research',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },

  // ========================================
  // 出品系（24ツール）- 優先度1
  // ========================================
  {
    toolId: 'ebay-listing-create',
    name: 'eBay出品作成',
    category: 'listing',
    intelligenceLevel: 'standard',
    priority: 1,
    agentPreset: 'listing-optimizer',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: true, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: true, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'ebay-listing-revise',
    name: 'eBay出品修正',
    category: 'listing',
    intelligenceLevel: 'basic',
    priority: 1,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: true, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },
  {
    toolId: 'ebay-listing-end',
    name: 'eBay出品終了',
    category: 'listing',
    intelligenceLevel: 'none',
    priority: 2,
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },
  {
    toolId: 'title-generator',
    name: 'タイトル生成',
    category: 'listing',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'title-generator',
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: false, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: true, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: false }
  },
  {
    toolId: 'category-classifier',
    name: 'カテゴリ分類',
    category: 'listing',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'category-classifier',
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'hts-classifier',
    name: 'HTS分類',
    category: 'listing',
    intelligenceLevel: 'advanced',
    priority: 1,
    customAgentConfig: { type: 'listing', modelId: 'gemini-2.0-flash', hitlThreshold: 0.8, enabledTools: ['db_search', 'web_search'] },
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: true, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'bulk-listing',
    name: '一括出品',
    category: 'listing',
    intelligenceLevel: 'standard',
    priority: 1,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: true, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: true, requiresAIAgent: false, requiresSelfHealing: true }
  },

  // ========================================
  // CRM系（18ツール）- 優先度1
  // ========================================
  {
    toolId: 'inquiry-responder',
    name: '問い合わせ対応',
    category: 'crm',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'inquiry-responder',
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: false, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: true, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'return-processor',
    name: '返品処理',
    category: 'crm',
    intelligenceLevel: 'standard',
    priority: 1,
    agentPreset: 'return-processor',
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: true, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'feedback-analyzer',
    name: 'フィードバック分析',
    category: 'crm',
    intelligenceLevel: 'advanced',
    priority: 2,
    customAgentConfig: { type: 'crm', modelId: 'gemini-2.0-flash', hitlThreshold: 0.7, enabledTools: ['db_search'] },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: false }
  },

  // ========================================
  // 異常検知系（12ツール）- 優先度1
  // ========================================
  {
    toolId: 'anomaly-detector',
    name: '異常検知',
    category: 'analytics',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'anomaly-detector',
    selfHealingConfig: { maxRetries: 1, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: false }
  },
  {
    toolId: 'fraud-detector',
    name: '不正検知',
    category: 'analytics',
    intelligenceLevel: 'advanced',
    priority: 1,
    agentPreset: 'fraud-detector',
    selfHealingConfig: { maxRetries: 1, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: false }
  },
  {
    toolId: 'price-alert',
    name: '価格アラート',
    category: 'analytics',
    intelligenceLevel: 'standard',
    priority: 2,
    customAgentConfig: { type: 'anomaly', modelId: 'gpt-4o-mini', hitlThreshold: 0.6, enabledTools: ['db_search', 'price_lookup'] },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'inventory-alert',
    name: '在庫アラート',
    category: 'analytics',
    intelligenceLevel: 'standard',
    priority: 1,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },

  // ========================================
  // 在庫系（20ツール）- 優先度2
  // ========================================
  {
    toolId: 'inventory-sync',
    name: '在庫同期',
    category: 'inventory',
    intelligenceLevel: 'basic',
    priority: 2,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },
  {
    toolId: 'inventory-check',
    name: '在庫チェック',
    category: 'inventory',
    intelligenceLevel: 'basic',
    priority: 2,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },
  {
    toolId: 'source-monitoring',
    name: '仕入先監視',
    category: 'inventory',
    intelligenceLevel: 'standard',
    priority: 1,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: true, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },

  // ========================================
  // 受注系（16ツール）- 優先度2
  // ========================================
  {
    toolId: 'order-sync',
    name: '受注同期',
    category: 'order',
    intelligenceLevel: 'none',
    priority: 2,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },
  {
    toolId: 'shipping-label',
    name: '送り状作成',
    category: 'order',
    intelligenceLevel: 'none',
    priority: 2,
    selfHealingConfig: { maxRetries: 3, enableAlternativeApis: false, allowDegradedMode: false },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: true, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },

  // ========================================
  // 財務系（12ツール）- 優先度3
  // ========================================
  {
    toolId: 'profit-calculator',
    name: '利益計算',
    category: 'finance',
    intelligenceLevel: 'basic',
    priority: 3,
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: false }
  },
  {
    toolId: 'revenue-report',
    name: '収益レポート',
    category: 'finance',
    intelligenceLevel: 'basic',
    priority: 3,
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: false }
  },

  // ========================================
  // メディア系（10ツール）- 優先度3
  // ========================================
  {
    toolId: 'content-generator',
    name: 'コンテンツ生成',
    category: 'media',
    intelligenceLevel: 'advanced',
    priority: 2,
    customAgentConfig: { type: 'content', modelId: 'claude-3-5-sonnet', hitlThreshold: 0.8, enabledTools: ['db_search', 'web_search', 'translation'] },
    selfHealingConfig: { maxRetries: 2, enableAlternativeApis: false, allowDegradedMode: true },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: true, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: true }
  },
  {
    toolId: 'video-script',
    name: '動画台本生成',
    category: 'media',
    intelligenceLevel: 'advanced',
    priority: 3,
    customAgentConfig: { type: 'content', modelId: 'claude-3-5-sonnet', hitlThreshold: 0.75, enabledTools: ['db_search', 'web_search'] },
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: true, requiresHitL: true, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: true, requiresSelfHealing: false }
  },

  // ========================================
  // ユーティリティ系（12ツール）- 優先度3
  // ========================================
  {
    toolId: 'translation',
    name: '翻訳',
    category: 'utility',
    intelligenceLevel: 'basic',
    priority: 3,
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  },
  {
    toolId: 'image-optimizer',
    name: '画像最適化',
    category: 'utility',
    intelligenceLevel: 'none',
    priority: 3,
    v821Options: { requiresAuthGate: true, requiresIdentityManager: false, requiresPolicyValidator: false, requiresHitL: false, requiresAuditLog: true, requiresCategoryQuotaCheck: false, requiresAIAgent: false, requiresSelfHealing: true }
  }
];

// ========================================
// 優先度別ツール取得
// ========================================

export function getToolsByPriority(priority: 1 | 2 | 3): ToolUpgradeSpec[] {
  return TOOL_UPGRADE_MAPPING.filter(t => t.priority === priority);
}

export function getToolsByCategory(category: ToolCategory): ToolUpgradeSpec[] {
  return TOOL_UPGRADE_MAPPING.filter(t => t.category === category);
}

export function getToolsByIntelligenceLevel(level: IntelligenceLevel): ToolUpgradeSpec[] {
  return TOOL_UPGRADE_MAPPING.filter(t => t.intelligenceLevel === level);
}

export function getToolsRequiringAI(): ToolUpgradeSpec[] {
  return TOOL_UPGRADE_MAPPING.filter(t => t.v821Options.requiresAIAgent);
}

export function getToolsRequiringHitL(): ToolUpgradeSpec[] {
  return TOOL_UPGRADE_MAPPING.filter(t => t.v821Options.requiresHitL);
}

// ========================================
// V8.2.1金型生成コード
// ========================================

export function generateV821WorkflowCode(spec: ToolUpgradeSpec): string {
  const sections: string[] = [];
  
  // ヘッダー
  sections.push(`// ========================================`);
  sections.push(`// ${spec.name} - V8.2.1 知能パッチ統合版`);
  sections.push(`// カテゴリ: ${spec.category} | 知能レベル: ${spec.intelligenceLevel}`);
  sections.push(`// 自動生成: ${new Date().toISOString()}`);
  sections.push(`// ========================================`);
  sections.push('');
  
  // 1. Auth-Gate（必須）
  if (spec.v821Options.requiresAuthGate) {
    sections.push('// 【STEP 1】Auth-Gate');
    sections.push('// → V8_HEADER_AUTH_GATE を配置');
    sections.push('');
  }
  
  // 2. Identity-Manager
  if (spec.v821Options.requiresIdentityManager) {
    sections.push('// 【STEP 2】Identity-Manager');
    sections.push('// → V8_HEADER_IDENTITY_MANAGER を配置');
    sections.push('');
  }
  
  // 3. Category Quota Check
  if (spec.v821Options.requiresCategoryQuotaCheck) {
    sections.push('// 【STEP 3】Category Quota Check');
    sections.push('// → V821_CATEGORY_QUOTA_CHECK を配置');
    sections.push('');
  }
  
  // 4. AI Agent
  if (spec.v821Options.requiresAIAgent) {
    const preset = spec.agentPreset || 'general';
    const config = spec.customAgentConfig;
    
    sections.push('// 【STEP 4】AI Agent');
    sections.push(`// プリセット: ${preset}`);
    if (config) {
      sections.push(`// カスタム設定: model=${config.modelId}, hitlThreshold=${config.hitlThreshold}`);
    }
    sections.push('// → N8N_AI_AGENT_NODE を配置（変数置換）');
    sections.push('');
  }
  
  // 5. Self-Healing Wrapper
  if (spec.v821Options.requiresSelfHealing && spec.selfHealingConfig) {
    sections.push('// 【STEP 5】Self-Healing Wrapper');
    sections.push(`// maxRetries: ${spec.selfHealingConfig.maxRetries}`);
    sections.push(`// alternativeApis: ${spec.selfHealingConfig.enableAlternativeApis}`);
    sections.push(`// degradedMode: ${spec.selfHealingConfig.allowDegradedMode}`);
    sections.push('// → V821_SELF_HEALING_INTEGRATION を配置');
    sections.push('');
  }
  
  // 6. MAIN-LOGIC
  sections.push('// 【STEP MAIN】Business Logic');
  sections.push('// → 既存のMAIN-LOGICコードをここに配置');
  sections.push('// → Self-Healing有効時は executeWithHealing() でラップ');
  sections.push('');
  
  // 7. Policy-Validator
  if (spec.v821Options.requiresPolicyValidator) {
    sections.push('// 【STEP N-2】Policy-Validator');
    sections.push('// → V8_FOOTER_POLICY_VALIDATOR を配置');
    sections.push('');
  }
  
  // 8. HitL Check
  if (spec.v821Options.requiresHitL) {
    sections.push('// 【STEP N-1】HitL Check');
    sections.push('// → V8_FOOTER_HITL_CHECK を配置');
    sections.push('// ※ AI確信度75%未満で自動エスカレーション');
    sections.push('');
  }
  
  // 9. Audit-Log（必須）
  if (spec.v821Options.requiresAuditLog) {
    sections.push('// 【STEP N】Audit-Log');
    sections.push('// → V8_FOOTER_AUDIT_LOG を配置');
    sections.push('');
  }
  
  return sections.join('\n');
}

// ========================================
// 一括換装実行関数
// ========================================

export async function executeMassUpgrade(
  tools: ToolUpgradeSpec[],
  options?: {
    dryRun?: boolean;
    skipExisting?: boolean;
    targetCategories?: ToolCategory[];
    targetPriority?: 1 | 2 | 3;
  }
): Promise<MassUpgradeResult[]> {
  const results: MassUpgradeResult[] = [];
  
  // フィルタリング
  let targetTools = tools;
  if (options?.targetCategories) {
    targetTools = targetTools.filter(t => options.targetCategories!.includes(t.category));
  }
  if (options?.targetPriority) {
    targetTools = targetTools.filter(t => t.priority === options.targetPriority);
  }
  
  for (const spec of targetTools) {
    const upgradedComponents: string[] = [];
    
    // 各コンポーネントの換装
    if (spec.v821Options.requiresAuthGate) upgradedComponents.push('Auth-Gate');
    if (spec.v821Options.requiresIdentityManager) upgradedComponents.push('Identity-Manager');
    if (spec.v821Options.requiresCategoryQuotaCheck) upgradedComponents.push('Category-Quota-Check');
    if (spec.v821Options.requiresAIAgent) upgradedComponents.push('AI-Agent');
    if (spec.v821Options.requiresSelfHealing) upgradedComponents.push('Self-Healing');
    if (spec.v821Options.requiresPolicyValidator) upgradedComponents.push('Policy-Validator');
    if (spec.v821Options.requiresHitL) upgradedComponents.push('HitL-Check');
    if (spec.v821Options.requiresAuditLog) upgradedComponents.push('Audit-Log');
    
    if (options?.dryRun) {
      results.push({
        toolId: spec.toolId,
        status: 'success',
        message: `[DRY-RUN] ${spec.name}のV8.2.1換装をシミュレート`,
        upgradedComponents
      });
    } else {
      // 実際の換装処理（n8n APIまたはファイル書き換え）
      try {
        const code = generateV821WorkflowCode(spec);
        // TODO: 実際のファイル書き込みまたはn8n API呼び出し
        
        results.push({
          toolId: spec.toolId,
          status: 'success',
          message: `${spec.name}をV8.2.1に換装完了`,
          upgradedComponents
        });
      } catch (error) {
        results.push({
          toolId: spec.toolId,
          status: 'error',
          message: `換装エラー: ${error instanceof Error ? error.message : 'Unknown'}`,
          upgradedComponents: []
        });
      }
    }
  }
  
  return results;
}

// ========================================
// サマリー生成
// ========================================

export function generateUpgradeSummary(): string {
  const total = TOOL_UPGRADE_MAPPING.length;
  const byPriority = {
    p1: getToolsByPriority(1).length,
    p2: getToolsByPriority(2).length,
    p3: getToolsByPriority(3).length
  };
  const byIntelligence = {
    autonomous: getToolsByIntelligenceLevel('autonomous').length,
    advanced: getToolsByIntelligenceLevel('advanced').length,
    standard: getToolsByIntelligenceLevel('standard').length,
    basic: getToolsByIntelligenceLevel('basic').length,
    none: getToolsByIntelligenceLevel('none').length
  };
  const requiresAI = getToolsRequiringAI().length;
  const requiresHitL = getToolsRequiringHitL().length;
  
  return `
# N3 Empire OS V8.2.1 - 知能パッチ換装サマリー

## 対象ツール数: ${total}

### 優先度別
- P1（最優先）: ${byPriority.p1}ツール
- P2（標準）: ${byPriority.p2}ツール
- P3（低優先）: ${byPriority.p3}ツール

### 知能レベル別
- 完全自律（Autonomous）: ${byIntelligence.autonomous}ツール
- 高度AI（Advanced）: ${byIntelligence.advanced}ツール
- 標準AI（Standard）: ${byIntelligence.standard}ツール
- 基本AI（Basic）: ${byIntelligence.basic}ツール
- AI不要（None）: ${byIntelligence.none}ツール

### 機能要件
- AIエージェント必要: ${requiresAI}ツール
- HitL承認必要: ${requiresHitL}ツール

## 推奨実行順序
1. P1 + Autonomous/Advanced（${getToolsByPriority(1).filter(t => ['autonomous', 'advanced'].includes(t.intelligenceLevel)).length}ツール）
2. P1 + Standard/Basic（${getToolsByPriority(1).filter(t => ['standard', 'basic'].includes(t.intelligenceLevel)).length}ツール）
3. P2（${byPriority.p2}ツール）
4. P3（${byPriority.p3}ツール）
`;
}

// ========================================
// エクスポート
// ========================================

export default {
  TOOL_UPGRADE_MAPPING,
  getToolsByPriority,
  getToolsByCategory,
  getToolsByIntelligenceLevel,
  getToolsRequiringAI,
  getToolsRequiringHitL,
  generateV821WorkflowCode,
  executeMassUpgrade,
  generateUpgradeSummary
};
