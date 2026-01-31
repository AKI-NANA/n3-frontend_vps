// lib/hooks/useN8nWebhook.ts
/**
 * N3 n8n Webhook Hook
 * 
 * セキュアな内部トークン付きでn8nワークフローを呼び出す
 * V5-PRODUCTION準拠: crypto不使用、環境変数ベースの認証
 */

import { useState, useCallback } from 'react';

interface UseN8nWebhookOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

interface WebhookResult<T = any> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface WebhookTrigger {
  <T = any>(path: string, payload?: Record<string, any>): Promise<T>;
}

export function useN8nWebhook(options: UseN8nWebhookOptions = {}) {
  const [result, setResult] = useState<WebhookResult>({
    data: null,
    error: null,
    isLoading: false,
  });

  const trigger: WebhookTrigger = useCallback(async (path, payload = {}) => {
    setResult(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // 内部トークン生成（サーバーサイドAPI経由）
      const tokenResponse = await fetch('/api/n8n-auth/generate-internal-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'system' }),
      });

      if (!tokenResponse.ok) {
        throw new Error('トークン生成失敗');
      }

      const { token, timestamp } = await tokenResponse.json();

      // n8n Webhook URL構築
      const webhookBaseUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';
      const webhookUrl = `${webhookBaseUrl}/${path.replace(/^\//, '')}`;

      // n8n呼び出し
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 60000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N3-Internal-Token': token,
          'X-N3-Token-Timestamp': timestamp,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`n8nエラー: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setResult({ data, error: null, isLoading: false });
      options.onSuccess?.(data);
      return data;

    } catch (error: any) {
      const err = error instanceof Error ? error : new Error(String(error));
      setResult({ data: null, error: err, isLoading: false });
      options.onError?.(err);
      throw err;
    }
  }, [options]);

  return {
    ...result,
    trigger,
    reset: () => setResult({ data: null, error: null, isLoading: false }),
  };
}

// 特定ワークフロー用のプリセットHooks
export function useAuditCheck() {
  return useN8nWebhook();
}

export function useShippingUnified() {
  return useN8nWebhook({ timeout: 120000 });
}

export function useResearchAgent() {
  return useN8nWebhook({ timeout: 180000 });
}

export function useGlobalProfitCalc() {
  return useN8nWebhook({ timeout: 90000 });
}
