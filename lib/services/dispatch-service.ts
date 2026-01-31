// lib/services/dispatch-service.ts
/**
 * Dispatch Service - 統合実行サービス（サーバーサイド/クライアント両用）
 * 
 * Phase D-Core: 運用耐性レイヤー統合
 * - Kill Switch チェック
 * - 同時実行制限
 * - 実行モードガード
 * - 監査ログ記録
 * 
 * 使用方法:
 * import { dispatchService } from '@/lib/services/dispatch-service';
 * const result = await dispatchService.execute('amazon_research_bulk', { asins: ['B000...'] });
 */

// ============================================================
// 型定義
// ============================================================

export interface DispatchRequest {
  toolId: string;
  action?: string;
  params?: Record<string, any>;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  metadata?: Record<string, any>;
  // Phase D-Core: スキップオプション（緊急時のみ使用）
  skipKillSwitchCheck?: boolean;
  skipConcurrencyCheck?: boolean;
}

export interface DispatchResult {
  success: boolean;
  jobId?: string;
  data?: any;
  error?: string;
  errorCode?: string;
  executionTime?: number;
  // Phase D-Core: ガード情報
  guardInfo?: {
    killSwitchActive?: boolean;
    concurrencyBlocked?: boolean;
    executionMode?: string;
  };
}

export interface JobStatus {
  jobId: string;
  toolId: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'timeout' | 'cancelled' | 'blocked';
  progress: number;
  retryCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  result?: any;
  error?: string;
  errorCode?: string;
}

export interface SystemHealth {
  killSwitch: {
    active: boolean;
    reason?: string;
    activatedAt?: string;
    activatedBy?: string;
  };
  concurrency: {
    activeJobs: number;
    limits: Record<string, { current: number; max: number }>;
  };
  executionMode: string;
  jobs24h: {
    total: number;
    completed: number;
    failed: number;
    blocked: number;
  };
}

// ============================================================
// Dispatch Service Class
// ============================================================

class DispatchService {
  private baseUrl = '/api/dispatch';
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * ツールを実行
   * Phase D-Core: 全ガードチェック統合
   */
  async execute(
    toolId: string, 
    params: Record<string, any> = {}, 
    options: Partial<DispatchRequest> = {}
  ): Promise<DispatchResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          action: options.action || 'execute',
          params,
          priority: options.priority || 'normal',
          metadata: options.metadata,
          // Phase D-Core: ガードスキップフラグ
          skipKillSwitchCheck: options.skipKillSwitchCheck,
          skipConcurrencyCheck: options.skipConcurrencyCheck,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
          errorCode: data.code,
          executionTime: Date.now() - startTime,
          guardInfo: data.guardInfo,
        };
      }

      return {
        success: data.success ?? true,
        jobId: data.jobId,
        data: data.data || data.result,
        error: data.error,
        errorCode: data.code,
        executionTime: Date.now() - startTime,
        guardInfo: data.guardInfo,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error',
        errorCode: 'NETWORK_ERROR',
        executionTime: Date.now() - startTime,
      };
    }
  }

  /**
   * ジョブのステータスを取得
   */
  async getJobStatus(jobId: string): Promise<JobStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/jobs/${jobId}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.success ? data.job : null;
    } catch {
      return null;
    }
  }

  /**
   * ジョブ一覧を取得
   */
  async getJobs(options: {
    status?: string;
    toolId?: string;
    limit?: number;
    offset?: number;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<{ jobs: JobStatus[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (options.status) params.set('status', options.status);
      if (options.toolId) params.set('toolId', options.toolId);
      if (options.limit) params.set('limit', String(options.limit));
      if (options.offset) params.set('offset', String(options.offset));
      if (options.sortOrder) params.set('sortOrder', options.sortOrder);

      const response = await fetch(`${this.baseUrl}/jobs?${params}`);
      if (!response.ok) return { jobs: [], total: 0 };
      
      const data = await response.json();
      return data.success ? { jobs: data.jobs || [], total: data.total || 0 } : { jobs: [], total: 0 };
    } catch {
      return { jobs: [], total: 0 };
    }
  }

  /**
   * ジョブをリトライ
   */
  async retryJob(jobId: string): Promise<DispatchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/retry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        jobId: data.jobId,
        error: data.error,
        errorCode: data.code,
      };
    } catch (err: any) {
      return { success: false, error: err.message, errorCode: 'NETWORK_ERROR' };
    }
  }

  /**
   * ジョブをキャンセル
   */
  async cancelJob(jobId: string): Promise<DispatchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        error: data.error,
        errorCode: data.code,
      };
    } catch (err: any) {
      return { success: false, error: err.message, errorCode: 'NETWORK_ERROR' };
    }
  }

  /**
   * ジョブの進行をポーリングで監視
   */
  watchJob(jobId: string, callback: (status: JobStatus) => void, intervalMs: number = 2000): () => void {
    if (this.pollingIntervals.has(jobId)) {
      clearInterval(this.pollingIntervals.get(jobId)!);
    }

    const poll = async () => {
      const status = await this.getJobStatus(jobId);
      if (status) {
        callback(status);
        if (['completed', 'failed', 'timeout', 'cancelled', 'blocked'].includes(status.status)) {
          this.unwatchJob(jobId);
        }
      }
    };

    poll();
    const interval = setInterval(poll, intervalMs);
    this.pollingIntervals.set(jobId, interval);

    return () => this.unwatchJob(jobId);
  }

  /**
   * ジョブの監視を停止
   */
  unwatchJob(jobId: string): void {
    const interval = this.pollingIntervals.get(jobId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(jobId);
    }
  }

  /**
   * システムステータスを取得
   */
  async getSystemStatus(): Promise<{
    jobs: { running: number; pending: number; failed: number; completed: number; total24h: number };
    health: { n8n: string; database: string; api: string };
  } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/status`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.success ? data : null;
    } catch {
      return null;
    }
  }

  /**
   * メトリクスを取得
   */
  async getMetrics(period: '1h' | '24h' | '7d' | '30d' = '24h'): Promise<{
    totalJobs: number;
    successRate: number;
    errorRate: number;
    avgDurationMs: number;
    toolMetrics: { toolId: string; totalCount: number; successRate: number }[];
  } | null> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics?period=${period}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.success ? data : null;
    } catch {
      return null;
    }
  }

  // ============================================================
  // Phase D-Core: システム健全性API
  // ============================================================

  /**
   * システム健全性を取得
   */
  async getSystemHealth(): Promise<SystemHealth | null> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.success ? data.health : null;
    } catch {
      return null;
    }
  }

  /**
   * Kill Switch を有効化（Admin専用）
   */
  async activateKillSwitch(reason: string, autoResumeMinutes?: number): Promise<DispatchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/kill-switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'activate',
          reason,
          autoResumeMinutes,
        }),
      });

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        error: data.error,
        errorCode: data.code,
      };
    } catch (err: any) {
      return { success: false, error: err.message, errorCode: 'NETWORK_ERROR' };
    }
  }

  /**
   * Kill Switch を無効化（Admin専用）
   */
  async deactivateKillSwitch(): Promise<DispatchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/kill-switch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deactivate',
        }),
      });

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        error: data.error,
        errorCode: data.code,
      };
    } catch (err: any) {
      return { success: false, error: err.message, errorCode: 'NETWORK_ERROR' };
    }
  }

  /**
   * 同時実行状況を取得
   */
  async getConcurrencyStatus(): Promise<Record<string, { current: number; max: number }> | null> {
    try {
      const response = await fetch(`${this.baseUrl}/concurrency`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return data.success ? data.locks : null;
    } catch {
      return null;
    }
  }

  /**
   * ジョブロックをリセット（Admin専用・緊急用）
   */
  async resetJobLocks(jobType?: string): Promise<DispatchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/concurrency/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType }),
      });

      const data = await response.json();
      return {
        success: data.success ?? response.ok,
        error: data.error,
        errorCode: data.code,
      };
    } catch (err: any) {
      return { success: false, error: err.message, errorCode: 'NETWORK_ERROR' };
    }
  }

  /**
   * 実行ログを取得
   */
  async getExecutionLogs(options: {
    type?: string;
    toolId?: string;
    status?: string;
    limit?: number;
  } = {}): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (options.type) params.set('type', options.type);
      if (options.toolId) params.set('toolId', options.toolId);
      if (options.status) params.set('status', options.status);
      if (options.limit) params.set('limit', String(options.limit));

      const response = await fetch(`${this.baseUrl}/logs?${params}`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.success ? data.logs : [];
    } catch {
      return [];
    }
  }
}

// シングルトンインスタンス
export const dispatchService = new DispatchService();
export default dispatchService;
