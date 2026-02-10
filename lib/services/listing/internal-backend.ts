// lib/services/listing/internal-backend.ts
// 既存の内部API（Next.js API Routes）を使用するバックエンド実装

import { ListingBackend, ListingRequest, ListingResponse, JobStatus } from './listing-service';

export class InternalBackend extends ListingBackend {
  private apiEndpoint: string;
  
  constructor() {
    super('InternalBackend');
    // 環境変数またはデフォルトのAPIエンドポイント
    this.apiEndpoint = process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  async execute(request: ListingRequest): Promise<ListingResponse> {
    this.log('info', 'Executing listing request via internal API', request);
    
    try {
      // 即時実行か予約実行かを判定
      const endpoint = request.options?.immediate 
        ? '/api/listing/immediate'
        : request.options?.scheduled 
        ? '/api/listing/execute-scheduled'
        : '/api/listing/execute';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Request-Id': this.generateJobId()
        },
        body: JSON.stringify({
          productId: request.productId,
          platform: request.platform,
          action: request.action,
          ...request.options
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      
      this.log('info', 'Internal API response received', result);
      
      return {
        success: result.success || false,
        jobId: result.jobId || this.generateJobId(),
        itemId: result.itemId || result.ebayItemId,
        url: result.url || result.listingUrl,
        platform: request.platform,
        status: result.status || (result.success ? 'completed' : 'failed'),
        error: result.error || result.message,
        details: result.details || result.data,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      this.log('error', 'Internal API request failed', error);
      
      return {
        success: false,
        platform: request.platform,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      };
    }
  }
  
  async getStatus(jobId: string): Promise<JobStatus | null> {
    try {
      // 既存のログAPIを使用
      const response = await fetch(`/api/listing/logs?jobId=${jobId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to fetch job status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // データベースの形式から統一形式に変換
      if (!data || !data.logs || data.logs.length === 0) {
        return null;
      }
      
      const log = data.logs[0];
      
      return {
        jobId: jobId,
        status: this.mapStatus(log.status),
        progress: log.progress || 0,
        result: log.result,
        error: log.error_message,
        createdAt: log.created_at,
        updatedAt: log.updated_at,
        completedAt: log.completed_at
      };
      
    } catch (error) {
      this.log('error', 'Failed to get job status', error);
      return null;
    }
  }
  
  async cancelJob(jobId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/listing/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to cancel job: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success || false;
      
    } catch (error) {
      this.log('error', 'Failed to cancel job', error);
      return false;
    }
  }
  
  // バッチ処理のオーバーライド（既存のバッチAPIを使用）
  async executeBatch(requests: ListingRequest[]): Promise<ListingResponse[]> {
    try {
      const response = await fetch('/api/batch/listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: requests.map(req => ({
            product_id: req.productId,
            platform: req.platform,
            action: req.action,
            ...req.options
          }))
        })
      });
      
      if (!response.ok) {
        throw new Error(`Batch API error: ${response.status}`);
      }
      
      const results = await response.json();
      
      return results.map((result: any, index: number) => ({
        success: result.success || false,
        jobId: result.jobId,
        itemId: result.itemId,
        url: result.url,
        platform: requests[index].platform,
        status: result.status || 'completed',
        error: result.error,
        timestamp: new Date().toISOString()
      }));
      
    } catch (error) {
      this.log('error', 'Batch execution failed', error);
      // フォールバックとして個別実行
      return super.executeBatch(requests);
    }
  }
  
  // プライベートメソッド
  private mapStatus(dbStatus: string): 'pending' | 'processing' | 'completed' | 'failed' {
    const statusMap: { [key: string]: 'pending' | 'processing' | 'completed' | 'failed' } = {
      'waiting': 'pending',
      'pending': 'pending',
      'running': 'processing',
      'processing': 'processing',
      'success': 'completed',
      'completed': 'completed',
      'error': 'failed',
      'failed': 'failed',
      'cancelled': 'failed'
    };
    
    return statusMap[dbStatus.toLowerCase()] || 'pending';
  }
}
