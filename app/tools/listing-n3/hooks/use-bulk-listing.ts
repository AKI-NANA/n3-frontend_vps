// app/tools/listing-n3/hooks/use-bulk-listing.ts
/**
 * 一括出品フック
 * CSVインポート・ジョブ管理
 */

'use client';

import { useState, useCallback } from 'react';
import { BulkListingJob, BulkListingError, Marketplace } from '../types/listing';

// モックジョブ
const mockJobs: BulkListingJob[] = [
  {
    id: 'job-1',
    name: 'eBay一括出品 2024-01',
    status: 'completed',
    totalItems: 50,
    processedItems: 50,
    successItems: 48,
    failedItems: 2,
    marketplace: 'ebay',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    errors: [
      { row: 12, sku: 'SKU-000012', error: '画像URLが無効です' },
      { row: 35, sku: 'SKU-000035', error: 'カテゴリが見つかりません' },
    ],
  },
  {
    id: 'job-2',
    name: 'Amazon一括出品',
    status: 'processing',
    totalItems: 30,
    processedItems: 18,
    successItems: 17,
    failedItems: 1,
    marketplace: 'amazon',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

export interface BulkUploadOptions {
  marketplace: Marketplace;
  name: string;
  skipDuplicates?: boolean;
  autoOptimize?: boolean;
}

export function useBulkListing() {
  const [jobs, setJobs] = useState<BulkListingJob[]>(mockJobs);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentJob, setCurrentJob] = useState<BulkListingJob | null>(null);

  // CSVアップロード
  const uploadCsv = useCallback(async (
    file: File,
    options: BulkUploadOptions
  ): Promise<BulkListingJob> => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    // Simulate file parsing
    await new Promise(resolve => setTimeout(resolve, 2000));

    clearInterval(progressInterval);
    setUploadProgress(100);

    const newJob: BulkListingJob = {
      id: `job-${Date.now()}`,
      name: options.name || file.name,
      status: 'pending',
      totalItems: Math.floor(Math.random() * 50) + 10,
      processedItems: 0,
      successItems: 0,
      failedItems: 0,
      marketplace: options.marketplace,
      createdAt: new Date().toISOString(),
    };

    setJobs(prev => [newJob, ...prev]);
    setCurrentJob(newJob);
    setUploading(false);

    return newJob;
  }, []);

  // ジョブ開始
  const startJob = useCallback(async (jobId: string) => {
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId ? { ...j, status: 'processing' } : j
      )
    );

    // Simulate processing
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    let processed = 0;
    const interval = setInterval(() => {
      processed += 1;
      const failed = Math.random() < 0.05 ? 1 : 0;

      setJobs(prev =>
        prev.map(j =>
          j.id === jobId
            ? {
                ...j,
                processedItems: processed,
                successItems: j.successItems + (failed ? 0 : 1),
                failedItems: j.failedItems + failed,
                status: processed >= job.totalItems ? 'completed' : 'processing',
                completedAt: processed >= job.totalItems ? new Date().toISOString() : undefined,
              }
            : j
        )
      );

      if (processed >= job.totalItems) {
        clearInterval(interval);
      }
    }, 300);
  }, [jobs]);

  // ジョブキャンセル
  const cancelJob = useCallback((jobId: string) => {
    setJobs(prev =>
      prev.map(j =>
        j.id === jobId && j.status === 'processing'
          ? { ...j, status: 'failed' }
          : j
      )
    );
  }, []);

  // ジョブ削除
  const deleteJob = useCallback((jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
  }, []);

  // ジョブ再試行
  const retryJob = useCallback(async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status !== 'failed') return;

    setJobs(prev =>
      prev.map(j =>
        j.id === jobId
          ? { ...j, status: 'pending', processedItems: 0, successItems: 0, failedItems: 0 }
          : j
      )
    );

    await startJob(jobId);
  }, [jobs, startJob]);

  // テンプレートダウンロード
  const downloadTemplate = useCallback((marketplace: Marketplace) => {
    const headers = [
      'SKU',
      'Title',
      'Description',
      'Price',
      'Quantity',
      'Category',
      'Condition',
      'Image1',
      'Image2',
      'Image3',
    ];

    const csv = headers.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk_listing_template_${marketplace}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  }, []);

  return {
    jobs,
    uploading,
    uploadProgress,
    currentJob,
    uploadCsv,
    startJob,
    cancelJob,
    deleteJob,
    retryJob,
    downloadTemplate,
  };
}

export default useBulkListing;
