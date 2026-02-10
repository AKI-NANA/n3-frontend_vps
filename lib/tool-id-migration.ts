// lib/tool-id-migration.ts
/**
 * 🔄 Tool ID Migration Map
 * 
 * 旧命名規則 → 新命名規則（kebab-case）のマッピング
 * 後方互換性を6ヶ月間維持
 * 
 * 命名規則: <domain>-<action>-<scope>
 * 例: research-amazon-search, listing-ebay-create
 */

export const TOOL_ID_MIGRATION: Record<string, string> = {
  // ─────────────────────────────────────────────
  // Listing（出品）
  // ─────────────────────────────────────────────
  'listingLocal': 'listing-ebay-create',
  'listing-local': 'listing-ebay-create',
  'listingErrorRecovery': 'listing-error-recovery',
  'listingLpAuto': 'listing-lp-auto',
  'listingMultiRegion': 'listing-multi-platform-create',
  'listingChinaGateway': 'listing-china-create',
  'listingExecute': 'listing-execute',
  'ebayListing': 'listing-ebay-create',
  'qoo10Listing': 'listing-qoo10-create',
  'shopifySync': 'listing-shopify-sync',
  'amazonListing': 'listing-amazon-create',
  
  // ─────────────────────────────────────────────
  // Inventory（在庫）
  // ─────────────────────────────────────────────
  'stockKiller': 'inventory-stock-sync',
  'stock-killer': 'inventory-stock-sync',
  'usaSupplierMonitor': 'inventory-supplier-monitor',
  'inventoryMonitoring': 'inventory-stock-monitor',
  'priceDefense': 'inventory-price-defense',
  
  // ─────────────────────────────────────────────
  // Research（リサーチ）
  // ─────────────────────────────────────────────
  'researchAgent': 'research-gpt-analyze',
  'research-agent': 'research-gpt-analyze',
  'amazonResearch': 'research-amazon-search',
  'amazon-research': 'research-amazon-search',
  'smBatch': 'research-sm-batch',
  'sm-batch': 'research-sm-batch',
  'trendAgent': 'research-trend-analyze',
  'trend-agent': 'research-trend-analyze',
  'arbitrageScan': 'research-arbitrage-scan',
  'arbitrage-scan': 'research-arbitrage-scan',
  
  // ─────────────────────────────────────────────
  // Finance（経理・価格計算）
  // ─────────────────────────────────────────────
  'ddpCalculate': 'finance-ddp-calculate',
  'ddp-calculate': 'finance-ddp-calculate',
  'profitCalculate': 'finance-profit-calculate',
  'profit-calculate': 'finance-profit-calculate',
  'accountingSync': 'finance-accounting-sync',
  'accounting-sync': 'finance-accounting-sync',
  'bankSync': 'finance-bank-sync',
  'bank-sync': 'finance-bank-sync',
  'paymentMatch': 'finance-payment-match',
  'payment-match': 'finance-payment-match',
  
  // ─────────────────────────────────────────────
  // Media（メディア）
  // ─────────────────────────────────────────────
  'mediaVideoGen': 'media-video-generate',
  'media-video-gen': 'media-video-generate',
  'mediaAudioGen': 'media-audio-generate',
  'media-audio-gen': 'media-audio-generate',
  'mediaTimestamp': 'media-timestamp-extract',
  'media-timestamp': 'media-timestamp-extract',
  'mediaThumbnail': 'media-thumbnail-generate',
  'media-thumbnail': 'media-thumbnail-generate',
  'mediaScript': 'media-script-generate',
  'media-script': 'media-script-generate',
  'mediaUpload': 'media-youtube-upload',
  'media-upload': 'media-youtube-upload',
  'mediaAnalytics': 'media-analytics-fetch',
  'media-analytics': 'media-analytics-fetch',
  'mediaCommentReply': 'media-comment-reply',
  'media-comment-reply': 'media-comment-reply',
  'mediaKnowledgeLoop': 'media-knowledge-evolve',
  'media-knowledge-loop': 'media-knowledge-evolve',
  
  // ─────────────────────────────────────────────
  // System（司令塔）
  // ─────────────────────────────────────────────
  'scoringDispatch': 'system-scoring-dispatch',
  'scoring-dispatch': 'system-scoring-dispatch',
  'fxPriceAdjust': 'system-fx-price-adjust',
  'fx-price-adjust': 'system-fx-price-adjust',
  'supplierSwitch': 'system-supplier-switch',
  'supplier-switch': 'system-supplier-switch',
  'sentinelMonitor': 'system-sentinel-monitor',
  'sentinel-monitor': 'system-sentinel-monitor',
  'aiProducer': 'system-ai-producer-approve',
  'ai-producer': 'system-ai-producer-approve',
  
  // ─────────────────────────────────────────────
  // Empire（帝国）
  // ─────────────────────────────────────────────
  'empireRevenue': 'empire-revenue-calculate',
  'empire-revenue': 'empire-revenue-calculate',
  'empireAirwallex': 'empire-airwallex-transfer',
  'empire-airwallex': 'empire-airwallex-transfer',
  'empireRevenueShare': 'empire-revshare-calculate',
  'empire-revenue-share': 'empire-revshare-calculate',
  'contractorPayment': 'empire-contractor-pay',
  'contractor-payment': 'empire-contractor-pay',
  'contractorMaterial': 'empire-material-analyze',
  'contractor-material': 'empire-material-analyze',
  
  // ─────────────────────────────────────────────
  // Defense（防衛）
  // ─────────────────────────────────────────────
  'defenseCopyright': 'defense-copyright-shield',
  'defense-copyright': 'defense-copyright-shield',
  'defenseBanMonitor': 'defense-ban-monitor',
  'defense-ban-monitor': 'defense-ban-monitor',
  
  // ─────────────────────────────────────────────
  // AI
  // ─────────────────────────────────────────────
  'aiInquiryReply': 'ai-inquiry-reply',
  'ai-inquiry-reply': 'ai-inquiry-reply',
  'aiCategoryMap': 'ai-category-map',
  'ai-category-map': 'ai-category-map',
  
  // ─────────────────────────────────────────────
  // Other
  // ─────────────────────────────────────────────
  'localLlmOllama': 'other-local-llm',
  'local-llm-ollama': 'other-local-llm',
};

// ============================================================
// Tool ID Normalization Utility
// ============================================================

/**
 * ToolIDを正規化（kebab-case）
 * マイグレーションマップを優先し、未登録はcamelCase→kebab-case変換
 */
export function normalizeToolId(rawId: string): string {
  // 1. マイグレーションマップをチェック
  if (TOOL_ID_MIGRATION[rawId]) {
    return TOOL_ID_MIGRATION[rawId];
  }
  
  // 2. すでにkebab-caseならそのまま（小文字化のみ）
  if (rawId.includes('-')) {
    return rawId.toLowerCase();
  }
  
  // 3. camelCase → kebab-case
  return rawId
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * 正規化されたToolIDからドメイン抽出
 */
export function extractDomain(toolId: string): string {
  const normalized = normalizeToolId(toolId);
  return normalized.split('-')[0];
}

/**
 * 正規化されたToolIDからアクション抽出
 */
export function extractAction(toolId: string): string {
  const normalized = normalizeToolId(toolId);
  const parts = normalized.split('-');
  return parts.length > 1 ? parts[1] : '';
}

// ============================================================
// Domain → Hub Mapping
// ============================================================

export const DOMAIN_TO_HUB: Record<string, string> = {
  listing: 'listing-hub',
  inventory: 'inventory-hub',
  research: 'research-hub',
  finance: 'finance-hub',
  media: 'media-hub',
  system: 'command-center',
  empire: 'finance-hub',
  defense: 'defense-hub',
  ai: 'research-hub',
  other: 'settings',
};

/**
 * ToolIDからHub名を取得
 */
export function getHubForTool(toolId: string): string {
  const domain = extractDomain(toolId);
  return DOMAIN_TO_HUB[domain] || 'settings';
}

export default TOOL_ID_MIGRATION;
