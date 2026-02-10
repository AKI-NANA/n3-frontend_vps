// lib/ai/index.ts
// ========================================
// 🧠 N3 Empire OS V8.2.1-Autonomous
// AI モジュール 完全エクスポート
// ========================================

// ========================================
// エージェントコア
// ========================================
export {
  type AgentConfig,
  type AgentType,
  type AIModel,
  type AgentTool,
  type AgentExecutionContext,
  type AgentResult,
  type ToolResult,
  AI_MODELS,
  AGENT_PRESETS,
  TOOL_DEFINITIONS,
  N3AIAgent,
  createAgent,
  N8N_AI_AGENT_NODE
} from './agent-core';

// ========================================
// Selsimilarエージェント
// ========================================
export {
  type ProductCandidate,
  type SimilarityScore,
  type SelsimilarResult,
  type SelsimilarConfig,
  DEFAULT_SELSIMILAR_CONFIG,
  SELSIMILAR_SYSTEM_PROMPT,
  SelsimilarAgent,
  createSelsimilarAgent,
  N8N_SELSIMILAR_NODE
} from './selsimilar-agent';

// ========================================
// セルフヒーリングループ
// ========================================
export {
  type HealingState,
  type DataGapType,
  type HealingAction,
  type SelfHealingConfig,
  type AlternativeApi,
  type EscalationCondition,
  type HealingResult,
  type TaskExecutor,
  DEFAULT_SELF_HEALING_CONFIG,
  SelfHealingEngine,
  createSelfHealingEngine,
  N8N_SELF_HEALING_WRAPPER,
  V821_SELF_HEALING_INTEGRATION
} from './self-healing-loop';

// ========================================
// 一括換装マッピング
// ========================================
export {
  type ToolCategory,
  type IntelligenceLevel,
  type ToolUpgradeSpec,
  type MassUpgradeResult,
  TOOL_UPGRADE_MAPPING,
  getToolsByPriority,
  getToolsByCategory,
  getToolsByIntelligenceLevel,
  getToolsRequiringAI,
  getToolsRequiringHitL,
  generateV821WorkflowCode,
  executeMassUpgrade,
  generateUpgradeSummary
} from './mass-upgrade-mapping';

// ========================================
// Asset Pilot（投資知能）
// ========================================
export {
  type DistortionSignal,
  type DistortionType,
  type SignalSource,
  type AssetScoreInput,
  type AssetScoreResult,
  type EOLInfo,
  type PopReportData,
  type ReprintCycle,
  type PortfolioRisk,
  AssetPilot,
  createAssetPilot,
  ASSET_SCORE_THRESHOLDS,
  DEFAULT_RISK_PARAMS
} from './asset-pilot';

// ========================================
// Exit Strategy Engine（撤退エンジン）
// ========================================
export {
  type ExitStage,
  type ExitTrigger,
  type ExitAction,
  type ExitPlan,
  type ExitStrategyConfig,
  type ExitExecutionResult,
  type InventoryItemForExit,
  ExitStrategyEngine,
  createExitStrategyEngine,
  DEFAULT_EXIT_CONFIG,
  N8N_EXIT_STRATEGY_NODE
} from './exit-strategy-engine';

// ========================================
// Geminiクライアント（既存）
// ========================================
export {
  analyzeCrowdfundingOpportunity,
  optimizeImagePrompt
} from './gemini-client';

// ========================================
// 統合オブジェクト: N3AI
// ========================================
import { AI_MODELS, AGENT_PRESETS, createAgent } from './agent-core';
import { createSelsimilarAgent, DEFAULT_SELSIMILAR_CONFIG } from './selsimilar-agent';
import { createSelfHealingEngine, DEFAULT_SELF_HEALING_CONFIG } from './self-healing-loop';
import { TOOL_UPGRADE_MAPPING, executeMassUpgrade, generateUpgradeSummary, getToolsRequiringAI, getToolsRequiringHitL } from './mass-upgrade-mapping';
import { createAssetPilot, ASSET_SCORE_THRESHOLDS, DEFAULT_RISK_PARAMS } from './asset-pilot';
import { createExitStrategyEngine, DEFAULT_EXIT_CONFIG } from './exit-strategy-engine';

export const N3AI = {
  version: '8.2.1-Autonomous',
  
  // ========================================
  // モデル
  // ========================================
  models: AI_MODELS,
  
  // ========================================
  // エージェント
  // ========================================
  presets: AGENT_PRESETS,
  createAgent,
  createSelsimilarAgent,
  
  // ========================================
  // セルフヒーリング
  // ========================================
  createSelfHealingEngine,
  defaultHealingConfig: DEFAULT_SELF_HEALING_CONFIG,
  defaultSelsimilarConfig: DEFAULT_SELSIMILAR_CONFIG,
  
  // ========================================
  // 投資知能（Asset Pilot）
  // ========================================
  createAssetPilot,
  assetScoreThresholds: ASSET_SCORE_THRESHOLDS,
  riskParams: DEFAULT_RISK_PARAMS,
  
  // ========================================
  // 撤退エンジン
  // ========================================
  createExitStrategyEngine,
  defaultExitConfig: DEFAULT_EXIT_CONFIG,
  
  // ========================================
  // 一括換装
  // ========================================
  upgradeMapping: TOOL_UPGRADE_MAPPING,
  executeMassUpgrade,
  generateUpgradeSummary,
  
  // ========================================
  // 統計
  // ========================================
  get stats() {
    return {
      totalTools: TOOL_UPGRADE_MAPPING.length,
      aiRequired: getToolsRequiringAI().length,
      hitlRequired: getToolsRequiringHitL().length,
      autonomousTools: TOOL_UPGRADE_MAPPING.filter(t => t.intelligenceLevel === 'autonomous').length,
      advancedTools: TOOL_UPGRADE_MAPPING.filter(t => t.intelligenceLevel === 'advanced').length,
      standardTools: TOOL_UPGRADE_MAPPING.filter(t => t.intelligenceLevel === 'standard').length
    };
  }
};

export default N3AI;
