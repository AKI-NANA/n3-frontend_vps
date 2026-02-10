// lib/n8n/n8n-client.ts
/**
 * N3 n8n統合クライアント
 * 
 * ⚠️ Phase A-2: 全実行を /api/dispatch 経由に統一
 * 
 * 直接 n8n URL への fetch は禁止
 * 全実行はDispatch API経由でログ・Rate Limit・Job Guard適用
 */

export interface N8nWebhookRequest {
  workflow: string;    // toolId として使用
  action: string;
  data: any;
  options?: {
    async?: boolean;
    timeout?: number;
    priority?: 'low' | 'normal' | 'high';
  };
}

export interface N8nWebhookResponse {
  success: boolean;
  jobId?: string;
  result?: any;
  error?: string;
  timestamp: string;
  toolId?: string;
  webhookPath?: string;
}

// Dispatch API のベースURL（相対パス）
const DISPATCH_API_URL = '/api/dispatch';

/**
 * Dispatch API経由でツールを実行
 * 
 * @deprecated 直接 dispatchService を使用してください
 */
export class N8nClient {
  /**
   * n8n Webhookを呼び出す（Dispatch API経由）
   * 
   * ⚠️ 全実行は /api/dispatch を経由
   * - Rate Limit 適用
   * - Job Guard 適用
   * - 実行ログ記録
   */
  async execute(request: N8nWebhookRequest): Promise<N8nWebhookResponse> {
    console.log(`[n8n] Dispatch経由で実行: ${request.workflow}/${request.action}`);
    
    try {
      const response = await fetch(DISPATCH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId: request.workflow,
          action: request.action,
          params: request.data,
          options: {
            timeout: request.options?.timeout,
            priority: request.options?.priority === 'high' ? 1 : 
                      request.options?.priority === 'low' ? 10 : 5,
          },
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || `Dispatch failed: ${response.status}`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: result.success ?? true,
        jobId: result.jobId,
        result: result.result || result.data,
        toolId: result.toolId,
        webhookPath: result.webhookPath,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      console.error(`[n8n] Dispatch error for ${request.workflow}:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * ジョブステータスを確認（Dispatch API経由）
   */
  async getJobStatus(jobId: string): Promise<any> {
    try {
      const response = await fetch(`/api/dispatch/jobs?jobId=${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get job status: ${response.status}`);
      }
      
      return response.json();
      
    } catch (error) {
      console.error(`[n8n] Failed to get job status for ${jobId}:`, error);
      return null;
    }
  }

  /**
   * バッチ処理（Dispatch API経由）
   */
  async executeBatch(workflows: N8nWebhookRequest[]): Promise<N8nWebhookResponse[]> {
    const results: N8nWebhookResponse[] = [];
    
    for (const workflow of workflows) {
      const result = await this.execute(workflow);
      results.push(result);
      
      // レート制限対策
      if (workflow.options?.priority !== 'high') {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  }

  /**
   * 接続テスト（Dispatch API経由）
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${DISPATCH_API_URL}?action=status`, {
        method: 'GET',
      });
      
      return response.ok;
    } catch (error) {
      console.error('[n8n] Connection test failed:', error);
      return false;
    }
  }
}

// シングルトンインスタンス
export const n8nClient = new N8nClient();

// ============================================================
// 推奨: dispatchService を直接使用
// ============================================================

/**
 * Dispatch Service - 推奨される実行方法
 * 
 * 使用例:
 * ```
 * import { dispatchService } from '@/lib/n8n/n8n-client';
 * 
 * const result = await dispatchService.execute({
 *   toolId: 'listing-local',
 *   action: 'list_now',
 *   params: { productIds: [123, 456] },
 * });
 * ```
 */
export const dispatchService = {
  /**
   * ツール実行
   */
  async execute(request: {
    toolId: string;
    action: string;
    params?: Record<string, any>;
    metadata?: {
      userId?: string;
      organizationId?: string;
      source?: string;
    };
    options?: {
      timeout?: number;
      priority?: number;
    };
  }): Promise<N8nWebhookResponse> {
    console.log(`[Dispatch] 実行: ${request.toolId}/${request.action}`);
    
    try {
      const response = await fetch(DISPATCH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();
      
      return {
        success: result.success ?? response.ok,
        jobId: result.jobId,
        result: result.result,
        error: result.error,
        toolId: result.toolId,
        webhookPath: result.webhookPath,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      console.error(`[Dispatch] Error for ${request.toolId}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * ジョブステータス取得
   */
  async getJobStatus(jobId: string): Promise<any> {
    try {
      const response = await fetch(`/api/dispatch/jobs?jobId=${jobId}`);
      if (!response.ok) return null;
      return response.json();
    } catch {
      return null;
    }
  },

  /**
   * 全ジョブ一覧取得
   */
  async getJobs(options?: {
    status?: string;
    toolId?: string;
    limit?: number;
    sortOrder?: 'asc' | 'desc';
  }): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (options?.status) params.set('status', options.status);
      if (options?.toolId) params.set('toolId', options.toolId);
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.sortOrder) params.set('sortOrder', options.sortOrder);
      
      const response = await fetch(`/api/dispatch/jobs?${params}`);
      if (!response.ok) return { jobs: [], total: 0 };
      return response.json();
    } catch {
      return { jobs: [], total: 0 };
    }
  },

  /**
   * ツール一覧取得
   */
  async getTools(): Promise<any> {
    try {
      const response = await fetch(`${DISPATCH_API_URL}?action=tools`);
      if (!response.ok) return { tools: [], count: 0 };
      return response.json();
    } catch {
      return { tools: [], count: 0 };
    }
  },

  /**
   * Dispatch状態確認
   */
  async getStatus(): Promise<{
    enabled: boolean;
    killSwitchActive: boolean;
    registeredTools: number;
  }> {
    try {
      const response = await fetch(DISPATCH_API_URL);
      if (!response.ok) return { enabled: false, killSwitchActive: true, registeredTools: 0 };
      return response.json();
    } catch {
      return { enabled: false, killSwitchActive: true, registeredTools: 0 };
    }
  },

  /**
   * ジョブリトライ
   */
  async retryJob(jobId: string): Promise<any> {
    try {
      const response = await fetch('/api/dispatch/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      return response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },

  /**
   * ジョブキャンセル
   */
  async cancelJob(jobId: string): Promise<any> {
    try {
      const response = await fetch('/api/dispatch/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      return response.json();
    } catch (error) {
      return { success: false, error: String(error) };
    }
  },
};

// デフォルトエクスポート
export default dispatchService;
