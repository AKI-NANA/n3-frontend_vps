// lib/empire-os/migrations/webhook-normalizer.ts
// ========================================
// N3 Empire OS V8.2.1 - Webhook正規化ツール
// 152ワークフローのURL一斉置換
// ========================================

/**
 * V8.2.1-Autonomous 規格のWebhook URL形式
 * Format: http://160.16.120.186:5678/webhook/v821-{category}-{action}
 */

// ========================================
// Webhook マッピング表
// ========================================

export interface WebhookMapping {
  oldPath: string | RegExp;
  newPath: string;
  category: string;
  description: string;
}

export const WEBHOOK_MAPPINGS: WebhookMapping[] = [
  // ========================================
  // 出品系 (Listing)
  // ========================================
  {
    oldPath: '/webhook/listing-reserve',
    newPath: '/webhook/v821-listing-reserve',
    category: 'listing',
    description: '出品予約'
  },
  {
    oldPath: '/webhook/listing-now',
    newPath: '/webhook/v821-listing-now',
    category: 'listing',
    description: '即時出品'
  },
  {
    oldPath: '/webhook/listing-batch',
    newPath: '/webhook/v821-listing-batch',
    category: 'listing',
    description: 'バッチ出品'
  },
  {
    oldPath: '/webhook/listing-revise',
    newPath: '/webhook/v821-listing-revise',
    category: 'listing',
    description: '出品修正'
  },
  {
    oldPath: '/webhook/listing-end',
    newPath: '/webhook/v821-listing-end',
    category: 'listing',
    description: '出品終了'
  },
  {
    oldPath: '/webhook/listing-relist',
    newPath: '/webhook/v821-listing-relist',
    category: 'listing',
    description: '再出品'
  },
  {
    oldPath: /\/webhook\/ebay[-_]?listing/i,
    newPath: '/webhook/v821-listing-ebay',
    category: 'listing',
    description: 'eBay出品'
  },
  {
    oldPath: /\/webhook\/amazon[-_]?listing/i,
    newPath: '/webhook/v821-listing-amazon',
    category: 'listing',
    description: 'Amazon出品'
  },
  {
    oldPath: /\/webhook\/qoo10[-_]?listing/i,
    newPath: '/webhook/v821-listing-qoo10',
    category: 'listing',
    description: 'Qoo10出品'
  },
  {
    oldPath: '/webhook/v8/ebay/listing',
    newPath: '/webhook/v821-listing-ebay',
    category: 'listing',
    description: 'eBay出品（V8）'
  },

  // ========================================
  // 在庫系 (Inventory)
  // ========================================
  {
    oldPath: '/webhook/inventory-sync',
    newPath: '/webhook/v821-inventory-sync',
    category: 'inventory',
    description: '在庫同期'
  },
  {
    oldPath: '/webhook/inventory-monitoring',
    newPath: '/webhook/v821-inventory-monitor',
    category: 'inventory',
    description: '在庫監視'
  },
  {
    oldPath: '/webhook/inventory-check',
    newPath: '/webhook/v821-inventory-check',
    category: 'inventory',
    description: '在庫チェック'
  },
  {
    oldPath: '/webhook/inventory-update',
    newPath: '/webhook/v821-inventory-update',
    category: 'inventory',
    description: '在庫更新'
  },
  {
    oldPath: '/webhook/stock-alert',
    newPath: '/webhook/v821-inventory-alert',
    category: 'inventory',
    description: '在庫アラート'
  },
  {
    oldPath: /\/webhook\/v8\/inventory/i,
    newPath: '/webhook/v821-inventory-sync',
    category: 'inventory',
    description: '在庫同期（V8）'
  },

  // ========================================
  // スケジュール系 (Schedule)
  // ========================================
  {
    oldPath: '/webhook/schedule-cron',
    newPath: '/webhook/v821-schedule-cron',
    category: 'schedule',
    description: 'スケジュール実行'
  },
  {
    oldPath: '/webhook/schedule-create',
    newPath: '/webhook/v821-schedule-create',
    category: 'schedule',
    description: 'スケジュール作成'
  },
  {
    oldPath: '/webhook/schedule-cancel',
    newPath: '/webhook/v821-schedule-cancel',
    category: 'schedule',
    description: 'スケジュールキャンセル'
  },
  {
    oldPath: '/webhook/night-shift',
    newPath: '/webhook/v821-schedule-nightshift',
    category: 'schedule',
    description: '夜間シフト処理'
  },

  // ========================================
  // リサーチ系 (Research)
  // ========================================
  {
    oldPath: /\/webhook\/research[-_]?yahoo/i,
    newPath: '/webhook/v821-research-yahoo',
    category: 'research',
    description: 'ヤフオクリサーチ'
  },
  {
    oldPath: /\/webhook\/research[-_]?ebay/i,
    newPath: '/webhook/v821-research-ebay',
    category: 'research',
    description: 'eBayリサーチ'
  },
  {
    oldPath: /\/webhook\/research[-_]?amazon/i,
    newPath: '/webhook/v821-research-amazon',
    category: 'research',
    description: 'Amazonリサーチ'
  },
  {
    oldPath: /\/webhook\/research[-_]?competitor/i,
    newPath: '/webhook/v821-research-competitor',
    category: 'research',
    description: '競合リサーチ'
  },
  {
    oldPath: /\/webhook\/price[-_]?research/i,
    newPath: '/webhook/v821-research-price',
    category: 'research',
    description: '価格リサーチ'
  },
  {
    oldPath: '/webhook/keepa-fetch',
    newPath: '/webhook/v821-research-keepa',
    category: 'research',
    description: 'Keepaデータ取得'
  },

  // ========================================
  // 価格系 (Pricing)
  // ========================================
  {
    oldPath: /\/webhook\/price[-_]?update/i,
    newPath: '/webhook/v821-pricing-update',
    category: 'pricing',
    description: '価格更新'
  },
  {
    oldPath: /\/webhook\/price[-_]?optimize/i,
    newPath: '/webhook/v821-pricing-optimize',
    category: 'pricing',
    description: '価格最適化'
  },
  {
    oldPath: '/webhook/repricing',
    newPath: '/webhook/v821-pricing-reprice',
    category: 'pricing',
    description: 'リプライシング'
  },
  {
    oldPath: '/webhook/v8/price/update',
    newPath: '/webhook/v821-pricing-update',
    category: 'pricing',
    description: '価格更新（V8）'
  },

  // ========================================
  // 通知系 (Notification)
  // ========================================
  {
    oldPath: '/webhook/chatwork-notify',
    newPath: '/webhook/v821-notify-chatwork',
    category: 'notification',
    description: 'ChatWork通知'
  },
  {
    oldPath: '/webhook/email-notify',
    newPath: '/webhook/v821-notify-email',
    category: 'notification',
    description: 'メール通知'
  },
  {
    oldPath: '/webhook/slack-notify',
    newPath: '/webhook/v821-notify-slack',
    category: 'notification',
    description: 'Slack通知'
  },
  {
    oldPath: '/webhook/line-notify',
    newPath: '/webhook/v821-notify-line',
    category: 'notification',
    description: 'LINE通知'
  },
  {
    oldPath: /\/webhook\/notify/i,
    newPath: '/webhook/v821-notify-generic',
    category: 'notification',
    description: '汎用通知'
  },

  // ========================================
  // 注文・受注系 (Order)
  // ========================================
  {
    oldPath: /\/webhook\/order[-_]?sync/i,
    newPath: '/webhook/v821-order-sync',
    category: 'order',
    description: '注文同期'
  },
  {
    oldPath: /\/webhook\/order[-_]?fulfill/i,
    newPath: '/webhook/v821-order-fulfill',
    category: 'order',
    description: '注文発送処理'
  },
  {
    oldPath: /\/webhook\/order[-_]?cancel/i,
    newPath: '/webhook/v821-order-cancel',
    category: 'order',
    description: '注文キャンセル'
  },
  {
    oldPath: /\/webhook\/shipping[-_]?update/i,
    newPath: '/webhook/v821-order-shipping',
    category: 'order',
    description: '配送情報更新'
  },

  // ========================================
  // メディア系 (Media)
  // ========================================
  {
    oldPath: /\/webhook\/video[-_]?generate/i,
    newPath: '/webhook/v821-media-video-gen',
    category: 'media',
    description: '動画生成'
  },
  {
    oldPath: /\/webhook\/video[-_]?publish/i,
    newPath: '/webhook/v821-media-video-pub',
    category: 'media',
    description: '動画公開'
  },
  {
    oldPath: /\/webhook\/blog[-_]?generate/i,
    newPath: '/webhook/v821-media-blog-gen',
    category: 'media',
    description: 'ブログ生成'
  },
  {
    oldPath: /\/webhook\/blog[-_]?publish/i,
    newPath: '/webhook/v821-media-blog-pub',
    category: 'media',
    description: 'ブログ公開'
  },
  {
    oldPath: /\/webhook\/script[-_]?generate/i,
    newPath: '/webhook/v821-media-script-gen',
    category: 'media',
    description: '脚本生成'
  },
  {
    oldPath: /\/webhook\/tts[-_]?generate/i,
    newPath: '/webhook/v821-media-tts-gen',
    category: 'media',
    description: '音声生成'
  },

  // ========================================
  // 認証・セキュリティ系 (Auth)
  // ========================================
  {
    oldPath: /\/webhook\/token[-_]?refresh/i,
    newPath: '/webhook/v821-auth-token-refresh',
    category: 'auth',
    description: 'トークンリフレッシュ'
  },
  {
    oldPath: /\/webhook\/oauth[-_]?callback/i,
    newPath: '/webhook/v821-auth-oauth-callback',
    category: 'auth',
    description: 'OAuthコールバック'
  },
  {
    oldPath: '/webhook/ebay-token-refresh',
    newPath: '/webhook/v821-auth-ebay-refresh',
    category: 'auth',
    description: 'eBayトークンリフレッシュ'
  },
  {
    oldPath: '/webhook/amazon-token-refresh',
    newPath: '/webhook/v821-auth-amazon-refresh',
    category: 'auth',
    description: 'Amazonトークンリフレッシュ'
  },

  // ========================================
  // HitL (Human-in-the-Loop)
  // ========================================
  {
    oldPath: '/webhook/hitl-callback',
    newPath: '/webhook/v821-hitl-callback',
    category: 'hitl',
    description: 'HitLコールバック'
  },
  {
    oldPath: '/webhook/approval-callback',
    newPath: '/webhook/v821-hitl-approval',
    category: 'hitl',
    description: '承認コールバック'
  },
  {
    oldPath: /\/webhook\/hitl/i,
    newPath: '/webhook/v821-hitl-generic',
    category: 'hitl',
    description: 'HitL汎用'
  },

  // ========================================
  // データ同期系 (Sync)
  // ========================================
  {
    oldPath: /\/webhook\/sync[-_]?ebay/i,
    newPath: '/webhook/v821-sync-ebay',
    category: 'sync',
    description: 'eBay同期'
  },
  {
    oldPath: /\/webhook\/sync[-_]?amazon/i,
    newPath: '/webhook/v821-sync-amazon',
    category: 'sync',
    description: 'Amazon同期'
  },
  {
    oldPath: /\/webhook\/sync[-_]?all/i,
    newPath: '/webhook/v821-sync-all',
    category: 'sync',
    description: '全プラットフォーム同期'
  },
  {
    oldPath: /\/webhook\/data[-_]?sync/i,
    newPath: '/webhook/v821-sync-data',
    category: 'sync',
    description: 'データ同期'
  },

  // ========================================
  // 分析・レポート系 (Analytics)
  // ========================================
  {
    oldPath: /\/webhook\/analytics[-_]?daily/i,
    newPath: '/webhook/v821-analytics-daily',
    category: 'analytics',
    description: '日次分析'
  },
  {
    oldPath: /\/webhook\/analytics[-_]?weekly/i,
    newPath: '/webhook/v821-analytics-weekly',
    category: 'analytics',
    description: '週次分析'
  },
  {
    oldPath: /\/webhook\/report[-_]?generate/i,
    newPath: '/webhook/v821-analytics-report',
    category: 'analytics',
    description: 'レポート生成'
  },

  // ========================================
  // システム系 (System)
  // ========================================
  {
    oldPath: '/webhook/health-check',
    newPath: '/webhook/v821-system-health',
    category: 'system',
    description: 'ヘルスチェック'
  },
  {
    oldPath: '/webhook/self-repair',
    newPath: '/webhook/v821-system-repair',
    category: 'system',
    description: '自己修復'
  },
  {
    oldPath: '/webhook/cleanup',
    newPath: '/webhook/v821-system-cleanup',
    category: 'system',
    description: 'クリーンアップ'
  },
  {
    oldPath: '/webhook/backup',
    newPath: '/webhook/v821-system-backup',
    category: 'system',
    description: 'バックアップ'
  },
];

// ========================================
// Webhook URL正規化関数
// ========================================

/**
 * URLを新形式に正規化
 */
export function normalizeWebhookUrl(url: string): {
  normalized: string;
  changed: boolean;
  mapping?: WebhookMapping;
} {
  const baseUrl = 'http://160.16.120.186:5678';
  
  // URLからパス部分を抽出
  let path = url;
  if (url.startsWith('http')) {
    try {
      const urlObj = new URL(url);
      path = urlObj.pathname;
    } catch {
      // パースエラーの場合はそのまま使用
    }
  }
  
  // マッピング検索
  for (const mapping of WEBHOOK_MAPPINGS) {
    const matched = typeof mapping.oldPath === 'string'
      ? path === mapping.oldPath || path.endsWith(mapping.oldPath)
      : mapping.oldPath.test(path);
    
    if (matched) {
      return {
        normalized: baseUrl + mapping.newPath,
        changed: true,
        mapping
      };
    }
  }
  
  // マッチしない場合は元のURLを返す
  return {
    normalized: url.startsWith('http') ? url : baseUrl + path,
    changed: false
  };
}

// ========================================
// n8n JSON一括置換
// ========================================

export interface WebhookReplacement {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  oldUrl: string;
  newUrl: string;
  category: string;
  description: string;
}

/**
 * n8nワークフローJSON内のWebhook URLを一括置換
 */
export function replaceWebhooksInWorkflow(
  workflow: any,
  dryRun: boolean = true
): {
  workflow: any;
  replacements: WebhookReplacement[];
  summary: {
    total: number;
    replaced: number;
    skipped: number;
    byCategory: Record<string, number>;
  };
} {
  const replacements: WebhookReplacement[] = [];
  const byCategory: Record<string, number> = {};
  let replaced = 0;
  let skipped = 0;
  let total = 0;
  
  // ディープコピー
  const workflowCopy = JSON.parse(JSON.stringify(workflow));
  
  // ノードを走査
  for (const node of workflowCopy.nodes || []) {
    // Webhookノード
    if (node.type === 'n8n-nodes-base.webhook') {
      total++;
      const oldPath = node.parameters?.path || '';
      const result = normalizeWebhookUrl('/webhook/' + oldPath);
      
      if (result.changed && result.mapping) {
        replacements.push({
          nodeId: node.id,
          nodeName: node.name,
          nodeType: 'webhook',
          oldUrl: '/webhook/' + oldPath,
          newUrl: result.mapping.newPath,
          category: result.mapping.category,
          description: result.mapping.description
        });
        
        if (!dryRun) {
          node.parameters.path = result.mapping.newPath.replace('/webhook/', '');
        }
        
        replaced++;
        byCategory[result.mapping.category] = (byCategory[result.mapping.category] || 0) + 1;
      } else {
        skipped++;
      }
    }
    
    // HTTP Requestノード
    if (node.type === 'n8n-nodes-base.httpRequest') {
      const url = node.parameters?.url || '';
      if (url.includes('/webhook/')) {
        total++;
        const result = normalizeWebhookUrl(url);
        
        if (result.changed && result.mapping) {
          replacements.push({
            nodeId: node.id,
            nodeName: node.name,
            nodeType: 'httpRequest',
            oldUrl: url,
            newUrl: result.normalized,
            category: result.mapping.category,
            description: result.mapping.description
          });
          
          if (!dryRun) {
            node.parameters.url = result.normalized;
          }
          
          replaced++;
          byCategory[result.mapping.category] = (byCategory[result.mapping.category] || 0) + 1;
        } else {
          skipped++;
        }
      }
    }
    
    // Codeノード内のURL（文字列検索）
    if (node.type === 'n8n-nodes-base.code') {
      const code = node.parameters?.jsCode || '';
      const webhookMatches = code.match(/\/webhook\/[a-zA-Z0-9_-]+/g) || [];
      
      for (const match of webhookMatches) {
        total++;
        const result = normalizeWebhookUrl(match);
        
        if (result.changed && result.mapping) {
          replacements.push({
            nodeId: node.id,
            nodeName: node.name,
            nodeType: 'code',
            oldUrl: match,
            newUrl: result.mapping.newPath,
            category: result.mapping.category,
            description: result.mapping.description
          });
          
          if (!dryRun) {
            node.parameters.jsCode = node.parameters.jsCode.replace(match, result.mapping.newPath);
          }
          
          replaced++;
          byCategory[result.mapping.category] = (byCategory[result.mapping.category] || 0) + 1;
        } else {
          skipped++;
        }
      }
    }
  }
  
  return {
    workflow: dryRun ? workflow : workflowCopy,
    replacements,
    summary: {
      total,
      replaced,
      skipped,
      byCategory
    }
  };
}

// ========================================
// バッチ処理
// ========================================

/**
 * 複数ワークフローの一括置換
 */
export function replaceWebhooksInBatch(
  workflows: any[],
  dryRun: boolean = true
): {
  workflows: any[];
  totalReplacements: WebhookReplacement[];
  summary: {
    workflowsProcessed: number;
    totalUrls: number;
    totalReplaced: number;
    totalSkipped: number;
    byCategory: Record<string, number>;
  };
} {
  const allReplacements: WebhookReplacement[] = [];
  const processedWorkflows: any[] = [];
  const byCategory: Record<string, number> = {};
  let totalUrls = 0;
  let totalReplaced = 0;
  let totalSkipped = 0;
  
  for (const workflow of workflows) {
    const result = replaceWebhooksInWorkflow(workflow, dryRun);
    
    processedWorkflows.push(result.workflow);
    allReplacements.push(...result.replacements);
    
    totalUrls += result.summary.total;
    totalReplaced += result.summary.replaced;
    totalSkipped += result.summary.skipped;
    
    for (const [category, count] of Object.entries(result.summary.byCategory)) {
      byCategory[category] = (byCategory[category] || 0) + count;
    }
  }
  
  return {
    workflows: processedWorkflows,
    totalReplacements: allReplacements,
    summary: {
      workflowsProcessed: workflows.length,
      totalUrls,
      totalReplaced,
      totalSkipped,
      byCategory
    }
  };
}

// ========================================
// マッピング表出力
// ========================================

/**
 * Markdownテーブル形式でマッピング表を出力
 */
export function generateMappingTable(): string {
  const lines = [
    '# N3 Empire OS V8.2.1 Webhook マッピング表',
    '',
    '| カテゴリ | 旧パス | 新パス | 説明 |',
    '|---|---|---|---|'
  ];
  
  // カテゴリでソート
  const sorted = [...WEBHOOK_MAPPINGS].sort((a, b) => 
    a.category.localeCompare(b.category) || a.description.localeCompare(b.description)
  );
  
  for (const mapping of sorted) {
    const oldPath = typeof mapping.oldPath === 'string' 
      ? mapping.oldPath 
      : mapping.oldPath.toString();
    lines.push(`| ${mapping.category} | \`${oldPath}\` | \`${mapping.newPath}\` | ${mapping.description} |`);
  }
  
  return lines.join('\n');
}

// ========================================
// n8n API経由での一括更新
// ========================================

export interface N8nApiConfig {
  baseUrl: string;
  apiKey?: string;
}

/**
 * n8n APIを使用してワークフローを取得・更新
 */
export async function updateWorkflowsViaApi(
  config: N8nApiConfig,
  dryRun: boolean = true
): Promise<{
  success: boolean;
  results: Array<{
    workflowId: string;
    workflowName: string;
    status: 'updated' | 'skipped' | 'error';
    replacements: number;
    error?: string;
  }>;
  summary: {
    total: number;
    updated: number;
    skipped: number;
    errors: number;
  };
}> {
  const results: Array<{
    workflowId: string;
    workflowName: string;
    status: 'updated' | 'skipped' | 'error';
    replacements: number;
    error?: string;
  }> = [];
  
  try {
    // ワークフロー一覧取得
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.apiKey) {
      headers['X-N8N-API-KEY'] = config.apiKey;
    }
    
    const listResponse = await fetch(`${config.baseUrl}/api/v1/workflows`, {
      headers
    });
    
    if (!listResponse.ok) {
      throw new Error(`Failed to fetch workflows: ${listResponse.statusText}`);
    }
    
    const { data: workflows } = await listResponse.json();
    
    for (const wf of workflows) {
      try {
        // ワークフロー詳細取得
        const detailResponse = await fetch(`${config.baseUrl}/api/v1/workflows/${wf.id}`, {
          headers
        });
        
        if (!detailResponse.ok) {
          results.push({
            workflowId: wf.id,
            workflowName: wf.name,
            status: 'error',
            replacements: 0,
            error: `Failed to fetch: ${detailResponse.statusText}`
          });
          continue;
        }
        
        const workflow = await detailResponse.json();
        
        // 置換処理
        const replacement = replaceWebhooksInWorkflow(workflow, dryRun);
        
        if (replacement.summary.replaced === 0) {
          results.push({
            workflowId: wf.id,
            workflowName: wf.name,
            status: 'skipped',
            replacements: 0
          });
          continue;
        }
        
        // 更新（dryRunでない場合）
        if (!dryRun) {
          const updateResponse = await fetch(`${config.baseUrl}/api/v1/workflows/${wf.id}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(replacement.workflow)
          });
          
          if (!updateResponse.ok) {
            results.push({
              workflowId: wf.id,
              workflowName: wf.name,
              status: 'error',
              replacements: replacement.summary.replaced,
              error: `Failed to update: ${updateResponse.statusText}`
            });
            continue;
          }
        }
        
        results.push({
          workflowId: wf.id,
          workflowName: wf.name,
          status: 'updated',
          replacements: replacement.summary.replaced
        });
        
      } catch (err) {
        results.push({
          workflowId: wf.id,
          workflowName: wf.name,
          status: 'error',
          replacements: 0,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }
    
    return {
      success: true,
      results,
      summary: {
        total: results.length,
        updated: results.filter(r => r.status === 'updated').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        errors: results.filter(r => r.status === 'error').length
      }
    };
    
  } catch (err) {
    return {
      success: false,
      results,
      summary: {
        total: 0,
        updated: 0,
        skipped: 0,
        errors: 1
      }
    };
  }
}

// ========================================
// エクスポート
// ========================================

export default {
  WEBHOOK_MAPPINGS,
  normalizeWebhookUrl,
  replaceWebhooksInWorkflow,
  replaceWebhooksInBatch,
  generateMappingTable,
  updateWorkflowsViaApi
};
