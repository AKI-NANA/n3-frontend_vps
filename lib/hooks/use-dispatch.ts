// lib/hooks/use-dispatch.ts
/**
 * useDispatch - Dispatch Service React Hook
 * 
 * Phase Final Fix: Dispatch統合のReact Hook
 * 
 * 使用方法:
 * import { useDispatch } from '@/lib/hooks/use-dispatch';
 * const { execute, isExecuting, lastResult, jobStatus } = useDispatch();
 */

'use client';

import { useState, useCallback } from 'react';
import { dispatchService, type DispatchRequest, type DispatchResult, type JobStatus } from '@/lib/services/dispatch-service';

// ============================================================
// 型定義
// ============================================================

export interface UseDispatchOptions {
  onSuccess?: (result: DispatchResult) => void;
  onError?: (error: string) => void;
  watchProgress?: boolean;
}

export interface UseDispatchReturn {
  execute: (toolId: string, params?: Record<string, any>, options?: Partial<DispatchRequest>) => Promise<DispatchResult>;
  retry: (jobId: string) => Promise<DispatchResult>;
  cancel: (jobId: string) => Promise<DispatchResult>;
  isExecuting: boolean;
  lastResult: DispatchResult | null;
  jobStatus: JobStatus | null;
}

// ============================================================
// Hook
// ============================================================

export function useDispatch(options: UseDispatchOptions = {}): UseDispatchReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<DispatchResult | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);

  const execute = useCallback(async (
    toolId: string,
    params: Record<string, any> = {},
    executeOptions: Partial<DispatchRequest> = {}
  ): Promise<DispatchResult> => {
    setIsExecuting(true);
    setLastResult(null);
    setJobStatus(null);

    const result = await dispatchService.execute(toolId, params, executeOptions);
    
    setLastResult(result);
    setIsExecuting(false);

    if (result.success) {
      options.onSuccess?.(result);
      
      // 進捗監視
      if (options.watchProgress && result.jobId) {
        dispatchService.watchJob(result.jobId, (status) => {
          setJobStatus(status);
        });
      }
    } else {
      options.onError?.(result.error || 'Unknown error');
    }

    return result;
  }, [options]);

  const retry = useCallback(async (jobId: string) => {
    return dispatchService.retryJob(jobId);
  }, []);

  const cancel = useCallback(async (jobId: string) => {
    return dispatchService.cancelJob(jobId);
  }, []);

  return {
    execute,
    retry,
    cancel,
    isExecuting,
    lastResult,
    jobStatus,
  };
}

export default useDispatch;
