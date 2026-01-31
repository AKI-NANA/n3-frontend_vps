// lib/services/listing/n8n-backend.ts
// n8n Webhook を使用するバックエンド実装

import { ListingBackend, ListingRequest, ListingResponse, JobStatus } from './listing-service';
import { createClient } from '@supabase/supabase-js';

export class N8nBackend extends ListingBackend {
  private webhookUrl: string;
  private apiKey: string;
  private supabase: any;
  
  constructor() {
    super('N8nBackend');
    
    // n8n設定
    this.webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook';
    this.apiKey = process.env.N8N_API_KEY || '';
    
    // Supabase設定（ジョブステータス確認用）
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }
  
  async execute(request: ListingRequest): Promise<ListingResponse> {
    this.log('info', 'Executing listing request via n8n webhook', request);
    
    const jobId = this.generateJobId();
    
    try {
      // n8nのWebhookエンドポイントを決定
      const webhookPath = this.getWebhookPath(request.platform, request.action);
      const fullUrl = `${this.webhookUrl}/${webhookPath}`;
      
      this.log('info', `Calling n8n webhook: ${fullUrl}`);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'X-Job-Id': jobId
        },
        body: JSON.stringify({
          job_id: jobId,
          product_id: request.productId,
          platform: request.platform,
          action: request.action,
          options: request.options,
          callback_url: this.getCallbackUrl(),
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`n8n webhook error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      // n8nは非同期処理のため、ジョブIDを返す
      this.log('info', 'n8n job submitted', { jobId, result });
      
      // ジョブ情報をSupabaseに保存（オプション）
      if (this.supabase) {
        await this.saveJobToDatabase(jobId, request);
      }
      
      return {
        success: true,
        jobId: result.job_id || jobId,
        platform: request.platform,
        status: 'processing',
        details: result,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.log('error', 'n8n webhook request failed', error);
      
      return {
        success: false,
        jobId: jobId,
        platform: request.platform,
        status: 'failed',
        error: error instanceof Error ? error.message : 'n8n connection failed',
        timestamp: new Date().toISOString()
      };
    }
  }
  
  async getStatus(jobId: string): Promise<JobStatus | null> {
    if (!this.supabase) {
      this.log('warn', 'Supabase not configured, cannot get job status');
      return null;
    }
    
    try {
      // listing_jobsテーブルから状態を取得
      const { data, error } = await this.supabase
        .from('listing_jobs')
        .select('*')
        .eq('job_id', jobId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {  // Not found
          return null;
        }
        throw error;
      }
      
      return {
        jobId: data.job_id,
        status: data.status,
        progress: data.progress || 0,
        result: data.response_data,
        error: data.error_message,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        completedAt: data.completed_at
      };
      
    } catch (error) {
      this.log('error', 'Failed to get job status from database', error);
      return null;
    }
  }
  
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      // n8nにキャンセルリクエストを送信
      const response = await fetch(`${this.webhookUrl}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({ job_id: jobId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to cancel job: ${response.status}`);
      }
      
      // データベースのステータスも更新
      if (this.supabase) {
        await this.supabase
          .from('listing_jobs')
          .update({ 
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('job_id', jobId);
      }
      
      return true;
      
    } catch (error) {
      this.log('error', 'Failed to cancel job', error);
      return false;
    }
  }
  
  // バッチ処理のオーバーライド（n8n用）
  async executeBatch(requests: ListingRequest[]): Promise<ListingResponse[]> {
    const batchJobId = `batch_${this.generateJobId()}`;
    
    try {
      const response = await fetch(`${this.webhookUrl}/batch-listing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          batch_job_id: batchJobId,
          requests: requests.map(req => ({
            product_id: req.productId,
            platform: req.platform,
            action: req.action,
            options: req.options
          })),
          callback_url: this.getCallbackUrl()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Batch webhook error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // バッチ処理は非同期なので、各リクエストに対してジョブIDを生成
      return requests.map((request, index) => ({
        success: true,
        jobId: `${batchJobId}_${index}`,
        platform: request.platform,
        status: 'processing',
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      this.log('error', 'Batch execution via n8n failed', error);
      // フォールバックとして個別実行
      return super.executeBatch(requests);
    }
  }
  
  // プライベートメソッド
  private getWebhookPath(platform: string, action: string): string {
    // プラットフォームとアクションに基づいてWebhookパスを決定
    const pathMap: { [key: string]: string } = {
      'ebay-list': 'ebay-listing',
      'ebay-update': 'ebay-revise',
      'ebay-end': 'ebay-end-listing',
      'amazon-list': 'amazon-listing',
      'amazon-update': 'amazon-update',
      'qoo10-list': 'qoo10-listing-execute',
      'qoo10-update': 'qoo10-inventory-sync',
      'shopee-list': 'shopee-listing',
      'mercari-list': 'mercari-listing',
      'yahoo-list': 'yahoo-listing-execute',
      'yahoo-update': 'yahoo-inventory-monitor'
    };
    
    const key = `${platform}-${action}`;
    return pathMap[key] || 'general-listing';
  }
  
  private getCallbackUrl(): string {
    // Next.jsのコールバックURL
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return `${baseUrl}/api/n8n/callback`;
  }
  
  private async saveJobToDatabase(jobId: string, request: ListingRequest): Promise<void> {
    if (!this.supabase) return;
    
    try {
      await this.supabase
        .from('listing_jobs')
        .insert({
          job_id: jobId,
          product_id: request.productId,
          platform: request.platform,
          action: request.action,
          status: 'pending',
          request_data: request,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      this.log('error', 'Failed to save job to database', error);
    }
  }
}
