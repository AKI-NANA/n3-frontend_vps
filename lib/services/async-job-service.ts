// lib/services/async-job-service.ts
/**
 * 非同期ジョブサービス
 * 
 * use-job-storeと連携して、以下の処理をバックグラウンドで実行:
 * - 出品処理
 * - スマート処理
 * - AI重量補正
 * - eBaymag同期チェック
 */

import { useJobStore, executeJob, executeJobParallel, CreateJobParams, JobItemResult } from '@/lib/store/use-job-store';
import { validateForEbaymagSync } from '@/lib/product/ebaymag-validator';

// ============================================================
// 型定義
// ============================================================

export interface ListingJobItem {
  id: number;
  sku: string;
  title: string;
  account: string;
  marketplace: string;
}

export interface SmartProcessJobItem {
  id: number;
  sku: string;
  title: string;
  missingFields: string[];
}

export interface WeightCorrectionJobItem {
  id: number;
  sku: string;
  title: string;
  description?: string;
  categoryName?: string;
  currentWeight: number;
}

// ============================================================
// 出品ジョブ
// ============================================================

/**
 * 出品処理をバックグラウンドで実行
 */
export async function startListingJob(
  items: ListingJobItem[],
  options: {
    mode: 'immediate' | 'scheduled';
    scheduledTime?: string;
    account: string;
  },
  callbacks?: {
    onItemSuccess?: (item: ListingJobItem, result: any) => void;
    onItemError?: (item: ListingJobItem, error: string) => void;
    onComplete?: (successCount: number, failedCount: number) => void;
  }
): Promise<void> {
  const store = useJobStore.getState();

  const jobId = store.createJob({
    type: 'listing',
    title: `eBay出品 (${options.mode === 'immediate' ? '即時' : 'スケジュール'})`,
    description: `${items.length}件の商品を${options.account}アカウントで出品`,
    totalItems: items.length,
    onComplete: (job) => {
      callbacks?.onComplete?.(job.successCount, job.failedCount);
    },
  });

  // 並列実行（同時3件）
  for (let i = 0; i < items.length; i++) {
    const currentJob = store.getJob(jobId);
    if (currentJob?.isCancelled) break;

    const item = items[i];
    
    try {
      // eBaymag同期前バリデーション
      const validation = validateForEbaymagSync({
        id: item.id,
        sku: item.sku,
        title: item.title,
        english_title: item.title,
      });

      if (!validation.canSync) {
        throw new Error(`バリデーションエラー: ${validation.blockingIssues.map(i => i.message).join(', ')}`);
      }

      // 出品APIを呼び出し
      const response = await fetch('/api/n8n/listing-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: options.mode === 'immediate' ? 'list_now' : 'schedule',
          ids: [item.id],
          account: options.account.toUpperCase(),
          scheduled_time: options.scheduledTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }

      store.addJobResult(jobId, {
        id: item.id,
        status: 'success',
        message: `出品完了: ${item.sku}`,
        data: result,
      });

      callbacks?.onItemSuccess?.(item, result);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      store.addJobResult(jobId, {
        id: item.id,
        status: 'failed',
        message: errorMessage,
      });

      callbacks?.onItemError?.(item, errorMessage);
    }

    // レート制限対策
    await new Promise(r => setTimeout(r, 500));
  }

  store.completeJob(jobId);
}

// ============================================================
// スマート処理ジョブ
// ============================================================

/**
 * スマート処理をバックグラウンドで実行
 */
export async function startSmartProcessJob(
  items: SmartProcessJobItem[],
  callbacks?: {
    onItemSuccess?: (item: SmartProcessJobItem, result: any) => void;
    onItemError?: (item: SmartProcessJobItem, error: string) => void;
    onComplete?: (successCount: number, failedCount: number) => void;
  }
): Promise<void> {
  const store = useJobStore.getState();

  const jobId = store.createJob({
    type: 'smart_process',
    title: 'スマート一括処理',
    description: `${items.length}件の商品データを自動補完`,
    totalItems: items.length,
    onComplete: (job) => {
      callbacks?.onComplete?.(job.successCount, job.failedCount);
    },
  });

  for (let i = 0; i < items.length; i++) {
    const currentJob = store.getJob(jobId);
    if (currentJob?.isCancelled) break;

    const item = items[i];
    
    try {
      // スマート処理APIを呼び出し
      const response = await fetch('/api/smart-process/single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          missingFields: item.missingFields,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }

      store.addJobResult(jobId, {
        id: item.id,
        status: 'success',
        message: `処理完了: ${item.sku}`,
        data: result,
      });

      callbacks?.onItemSuccess?.(item, result);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      store.addJobResult(jobId, {
        id: item.id,
        status: 'failed',
        message: errorMessage,
      });

      callbacks?.onItemError?.(item, errorMessage);
    }

    // レート制限対策
    await new Promise(r => setTimeout(r, 300));
  }

  store.completeJob(jobId);
}

// ============================================================
// AI重量補正ジョブ
// ============================================================

/**
 * AI重量補正をバックグラウンドで実行
 */
export async function startWeightCorrectionJob(
  items: WeightCorrectionJobItem[],
  callbacks?: {
    onItemSuccess?: (item: WeightCorrectionJobItem, newWeight: number) => void;
    onItemError?: (item: WeightCorrectionJobItem, error: string) => void;
    onComplete?: (successCount: number, failedCount: number) => void;
  }
): Promise<void> {
  const store = useJobStore.getState();

  const jobId = store.createJob({
    type: 'weight_correction',
    title: 'AI重量補正',
    description: `${items.length}件の重量をAIで再推定`,
    totalItems: items.length,
    onComplete: (job) => {
      callbacks?.onComplete?.(job.successCount, job.failedCount);
    },
  });

  for (let i = 0; i < items.length; i++) {
    const currentJob = store.getJob(jobId);
    if (currentJob?.isCancelled) break;

    const item = items[i];
    
    try {
      const response = await fetch('/api/ai/weight-estimation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          title: item.title,
          description: item.description,
          categoryName: item.categoryName,
          currentWeight: item.currentWeight,
          saveToDb: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }

      store.addJobResult(jobId, {
        id: item.id,
        status: 'success',
        message: `${item.currentWeight}g → ${result.estimation.weight}g`,
        data: result,
      });

      callbacks?.onItemSuccess?.(item, result.estimation.weight);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      store.addJobResult(jobId, {
        id: item.id,
        status: 'failed',
        message: errorMessage,
      });

      callbacks?.onItemError?.(item, errorMessage);
    }

    // Gemini API レート制限対策
    await new Promise(r => setTimeout(r, 500));
  }

  store.completeJob(jobId);
}

// ============================================================
// eBaymagバリデーションジョブ
// ============================================================

export interface EbaymagValidationJobItem {
  id: number;
  sku: string;
  title: string;
  listing_data?: any;
  ddp_price_usd?: number;
  primary_image_url?: string;
  ebay_category_id?: string;
  condition?: string;
}

/**
 * eBaymag同期可能性チェックをバックグラウンドで実行
 */
export async function startEbaymagValidationJob(
  items: EbaymagValidationJobItem[],
  callbacks?: {
    onItemValidated?: (item: EbaymagValidationJobItem, canSync: boolean, issues: string[]) => void;
    onComplete?: (syncableCount: number, blockedCount: number) => void;
  }
): Promise<{ syncable: number[]; blocked: Array<{ id: number; reasons: string[] }> }> {
  const store = useJobStore.getState();
  const syncable: number[] = [];
  const blocked: Array<{ id: number; reasons: string[] }> = [];

  const jobId = store.createJob({
    type: 'policy_mapping',
    title: 'eBaymag同期チェック',
    description: `${items.length}件の同期可能性を検証`,
    totalItems: items.length,
  });

  for (let i = 0; i < items.length; i++) {
    const currentJob = store.getJob(jobId);
    if (currentJob?.isCancelled) break;

    const item = items[i];
    
    const validation = validateForEbaymagSync({
      id: item.id,
      sku: item.sku,
      title: item.title,
      english_title: item.title,
      listing_data: item.listing_data,
      ddp_price_usd: item.ddp_price_usd,
      primary_image_url: item.primary_image_url,
      ebay_category_id: item.ebay_category_id,
      condition: item.condition,
    });

    if (validation.canSync) {
      syncable.push(item.id);
      store.addJobResult(jobId, {
        id: item.id,
        status: 'success',
        message: '同期可能',
      });
    } else {
      const reasons = validation.blockingIssues.map(i => i.message);
      blocked.push({ id: item.id, reasons });
      store.addJobResult(jobId, {
        id: item.id,
        status: 'failed',
        message: reasons.join('; '),
      });
    }

    callbacks?.onItemValidated?.(item, validation.canSync, 
      validation.blockingIssues.map(i => i.message));
  }

  store.completeJob(jobId);
  callbacks?.onComplete?.(syncable.length, blocked.length);

  return { syncable, blocked };
}
