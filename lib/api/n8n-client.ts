/**
 * n8n統合APIクライアント（トークン認証付き）
 */

import { getN8nTrigger } from '@/types/ui-config';

const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';
const INTERNAL_TOKEN = process.env.NEXT_PUBLIC_N3_INTERNAL_TOKEN || '';

export type N8nResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  executionId?: string;
  timestamp: string;
};

export type N8nRequestPayload = {
  action: string;
  [key: string]: any;
};

export async function triggerN8nWorkflow<T = any>(
  uiElementId: string,
  payload: N8nRequestPayload
): Promise<N8nResponse<T>> {
  try {
    const trigger = getN8nTrigger(uiElementId);
    
    if (!trigger) {
      throw new Error(`UI要素 "${uiElementId}" にn8nトリガーが設定されていません`);
    }

    const missingParams = trigger.requiredParams.filter(
      param => !(param in payload)
    );
    
    if (missingParams.length > 0) {
      throw new Error(
        `必須パラメータが不足しています: ${missingParams.join(', ')}`
      );
    }

    const webhookUrl = `${N8N_BASE_URL}${trigger.webhookPath}`;

    console.log(`[n8n] Triggering: ${trigger.workflowId}`);
    console.log(`[n8n] URL: ${webhookUrl}`);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-n3-internal-token': INTERNAL_TOKEN, // ✅ トークン追加
      },
      body: JSON.stringify({
        ...payload,
        uiElementId,
        workflowId: trigger.workflowId,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`n8nリクエスト失敗: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.result || data,
      executionId: data.executionId,
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('[n8n] エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラー',
      timestamp: new Date().toISOString(),
    };
  }
}

// ヘルパー関数
export async function triggerListing(payload: {
  action: 'list_now' | 'schedule' | 'cancel';
  ids: number[];
  target?: string;
  account?: string;
  scheduledAt?: string;
}) {
  return triggerN8nWorkflow('listing-n3.publish-now', payload);
}

export async function triggerInventorySync(payload: {
  action: 'sync_all' | 'sync_product';
  platforms?: string[];
  ids?: number[];
}) {
  return triggerN8nWorkflow('operations-n3.sync-inventory', payload);
}

export async function triggerBulkDelete(payload: {
  action: 'bulk_delete';
  ids: number[];
  reason?: string;
}) {
  return triggerN8nWorkflow('editing-n3.bulk-delete', payload);
}

export async function checkN8nHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${N8N_BASE_URL.replace('/webhook', '')}/healthz`);
    return response.ok;
  } catch {
    return false;
  }
}
