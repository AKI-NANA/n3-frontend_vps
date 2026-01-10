// lib/n8n/n8n-client.ts
/**
 * N3 n8n統合クライアント（VPS版）
 * VPS上のn8nとの通信を管理
 */

export interface N8nWebhookRequest {
  workflow: string;
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
}

export class N8nClient {
  private baseUrl: string;
  private apiKey: string;
  private fallbackEnabled: boolean;

  constructor() {
    // VPS上のn8nを使用
    this.baseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';
    this.apiKey = process.env.NEXT_PUBLIC_N8N_API_KEY || '';
    this.fallbackEnabled = process.env.NEXT_PUBLIC_N8N_FALLBACK === 'true';
  }

  /**
   * n8n Webhookを呼び出す（VPS版）
   */
  async execute(request: N8nWebhookRequest): Promise<N8nWebhookResponse> {
    const url = `${this.baseUrl}/${request.workflow}`;
    
    try {
      console.log(`[n8n VPS] Calling webhook: ${request.workflow}/${request.action}`);
      console.log(`[n8n VPS] URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Workflow': request.workflow,
          'X-Action': request.action,
        },
        body: JSON.stringify({
          action: request.action,
          ...request.data,
          metadata: {
            timestamp: new Date().toISOString(),
            source: 'next-app',
            priority: request.options?.priority || 'normal',
          }
        }),
        signal: request.options?.timeout 
          ? AbortSignal.timeout(request.options.timeout)
          : undefined,
      });

      if (!response.ok) {
        throw new Error(`n8n webhook failed: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        jobId: result.jobId || result.job_id,
        result: result.data || result.result || result,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      console.error(`[n8n VPS] Webhook error for ${request.workflow}:`, error);
      
      if (this.fallbackEnabled) {
        // フォールバック処理を実行
        return this.fallbackToInternal(request);
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 内部APIへのフォールバック
   */
  private async fallbackToInternal(request: N8nWebhookRequest): Promise<N8nWebhookResponse> {
    console.log(`[n8n] Falling back to internal API for ${request.workflow}`);
    
    // ワークフローごとのフォールバックエンドポイント
    const fallbackEndpoints: Record<string, string> = {
      'listing-execute': '/api/listing/execute',
      'research-amazon': '/api/research/amazon-batch',
      'inventory-sync': '/api/inventory/sync',
      'scraping-yahoo': '/api/scraping/yahoo',
      'pricing-update': '/api/pricing/update-all',
    };
    
    const endpoint = fallbackEndpoints[request.workflow];
    
    if (!endpoint) {
      return {
        success: false,
        error: `No fallback endpoint for workflow: ${request.workflow}`,
        timestamp: new Date().toISOString(),
      };
    }
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request.data),
      });
      
      const result = await response.json();
      
      return {
        success: response.ok,
        result,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      return {
        success: false,
        error: `Fallback failed: ${error}`,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * ジョブステータスを確認（VPS版）
   */
  async getJobStatus(jobId: string): Promise<any> {
    const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
    const url = `${baseUrl}/webhook-test/${jobId}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-API-Key': this.apiKey,
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get job status: ${response.status}`);
      }
      
      return response.json();
      
    } catch (error) {
      console.error(`[n8n VPS] Failed to get job status for ${jobId}:`, error);
      return null;
    }
  }

  /**
   * バッチ処理
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
   * VPS接続テスト
   */
  async testConnection(): Promise<boolean> {
    try {
      const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
      const response = await fetch(`${baseUrl}/healthz`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('[n8n VPS] Connection test failed:', error);
      return false;
    }
  }
}

// シングルトンインスタンス
export const n8nClient = new N8nClient();