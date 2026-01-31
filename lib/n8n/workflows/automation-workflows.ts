// lib/n8n/workflows/automation-workflows.ts
/**
 * 自動化関連のn8nワークフロー定義
 * 
 * Phase A-2: 全実行を dispatchService 経由に統一
 */

import { dispatchService } from '../n8n-client';

export class AutomationWorkflows {
  /**
   * 自動出品スケジュール設定
   */
  async setupAutoListing(config: {
    enabled: boolean;
    platforms: string[];
    dailyLimit: number;
    timeSlots: Array<{ hour: number; minute: number }>;
  }) {
    return dispatchService.execute({
      toolId: 'listing-execute',
      action: 'setup-schedule',
      params: {
        enabled: config.enabled,
        platforms: config.platforms,
        daily_limit: config.dailyLimit,
        time_slots: config.timeSlots,
      }
    });
  }

  /**
   * 価格自動調整
   */
  async setupPriceAutomation(config: {
    enabled: boolean;
    strategy: 'competitive' | 'fixed-margin' | 'dynamic';
    checkInterval: number;
    minMargin: number;
    maxDiscount: number;
  }) {
    return dispatchService.execute({
      toolId: 'fx-price-adjust',
      action: 'setup-price-automation',
      params: config
    });
  }

  /**
   * 在庫自動補充
   */
  async setupRestockAutomation(config: {
    enabled: boolean;
    threshold: number;
    suppliers: Array<{ id: string; priority: number }>;
  }) {
    return dispatchService.execute({
      toolId: 'supplier-switch',
      action: 'setup-restock',
      params: config
    });
  }

  /**
   * エラー自動リトライ
   */
  async setupErrorRetry(config: {
    maxRetries: number;
    retryInterval: number;
    notifyAfterFail: boolean;
  }) {
    return dispatchService.execute({
      toolId: 'listing-error-recovery',
      action: 'setup-retry',
      params: config
    });
  }

  /**
   * レポート自動生成
   */
  async setupReportGeneration(config: {
    type: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
    includeMetrics: string[];
  }) {
    return dispatchService.execute({
      toolId: 'accounting-sync',
      action: 'setup-report',
      params: config
    });
  }

  /**
   * 通知設定
   */
  async setupNotifications(config: {
    channel: 'slack' | 'email' | 'both';
    events: Array<{
      type: string;
      enabled: boolean;
      priority: 'low' | 'normal' | 'high';
    }>;
  }) {
    return dispatchService.execute({
      toolId: 'sentinel-monitor',
      action: 'setup-notifications',
      params: config
    });
  }

  /**
   * ワークフロー実行履歴取得
   */
  async getExecutionHistory(workflow?: string, limit: number = 100) {
    return dispatchService.getJobs({
      toolId: workflow,
      limit,
      sortOrder: 'desc',
    });
  }

  /**
   * ワークフローを停止
   */
  async stopWorkflow(workflowId: string) {
    return dispatchService.cancelJob(workflowId);
  }

  /**
   * ワークフローを再開（リトライ）
   */
  async resumeWorkflow(workflowId: string) {
    return dispatchService.retryJob(workflowId);
  }

  /**
   * システム監視
   */
  async monitorSystem() {
    return dispatchService.execute({
      toolId: 'sentinel-monitor',
      action: 'check-health',
      params: {}
    });
  }
}

export const automationWorkflows = new AutomationWorkflows();
