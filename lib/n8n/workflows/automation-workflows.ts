// lib/n8n/workflows/automation-workflows.ts
/**
 * 自動化関連のn8nワークフロー定義
 */

import { n8nClient } from '../n8n-client';

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
    return n8nClient.execute({
      workflow: 'automation-listing',
      action: 'setup-schedule',
      data: {
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
    checkInterval: number; // 分
    minMargin: number;
    maxDiscount: number;
  }) {
    return n8nClient.execute({
      workflow: 'automation-pricing',
      action: 'setup-price-automation',
      data: config
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
    return n8nClient.execute({
      workflow: 'automation-restock',
      action: 'setup-restock',
      data: config
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
    return n8nClient.execute({
      workflow: 'automation-retry',
      action: 'setup-retry',
      data: config
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
    return n8nClient.execute({
      workflow: 'automation-report',
      action: 'setup-report',
      data: config
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
    return n8nClient.execute({
      workflow: 'automation-notify',
      action: 'setup-notifications',
      data: config
    });
  }

  /**
   * ワークフロー実行履歴取得
   */
  async getExecutionHistory(workflow?: string, limit: number = 100) {
    return n8nClient.execute({
      workflow: 'automation-history',
      action: 'get-history',
      data: {
        workflow,
        limit,
      }
    });
  }

  /**
   * ワークフローを停止
   */
  async stopWorkflow(workflowId: string) {
    return n8nClient.execute({
      workflow: 'automation-control',
      action: 'stop-workflow',
      data: {
        workflow_id: workflowId,
      }
    });
  }

  /**
   * ワークフローを再開
   */
  async resumeWorkflow(workflowId: string) {
    return n8nClient.execute({
      workflow: 'automation-control',
      action: 'resume-workflow',
      data: {
        workflow_id: workflowId,
      }
    });
  }
}

export const automationWorkflows = new AutomationWorkflows();
