// components/common/job-progress-indicator.tsx
/**
 * ジョブ進捗インジケーター
 * 
 * 画面端に表示される小さなインジケーターで、
 * バックグラウンドジョブの進捗をリアルタイム表示
 */
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useJobStore, Job, JOB_TYPE_INFO } from '@/lib/store/use-job-store';
import { X, ChevronDown, ChevronUp, CheckCircle2, XCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';

// ステータスアイコン
const StatusIcon: React.FC<{ status: Job['status'] }> = ({ status }) => {
  switch (status) {
    case 'running':
    case 'pending':
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'failed':
      return <XCircle className="w-4 h-4 text-red-500" />;
    case 'cancelled':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
};

// 詳細パネル
const JobDetailPanel: React.FC<{
  activeJobs: Job[];
  completedJobs: Job[];
  onRemoveJob: (id: string) => void;
  onClearCompleted: () => void;
}> = ({ activeJobs, completedJobs, onRemoveJob, onClearCompleted }) => {
  return (
    <div className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <span className="font-medium text-sm text-gray-700">バックグラウンド処理</span>
        {completedJobs.length > 0 && (
          <button
            onClick={onClearCompleted}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            完了を削除
          </button>
        )}
      </div>

      {/* ジョブリスト */}
      <div className="max-h-64 overflow-y-auto">
        {/* アクティブジョブ */}
        {activeJobs.map(job => (
          <JobItem key={job.id} job={job} onRemove={() => onRemoveJob(job.id)} />
        ))}

        {/* 完了ジョブ */}
        {completedJobs.map(job => (
          <JobItem key={job.id} job={job} onRemove={() => onRemoveJob(job.id)} />
        ))}

        {/* ジョブなし */}
        {activeJobs.length === 0 && completedJobs.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            処理中のジョブはありません
          </div>
        )}
      </div>
    </div>
  );
};

// 個別ジョブ表示
const JobItem: React.FC<{
  job: Job;
  onRemove: () => void;
}> = ({ job, onRemove }) => {
  const typeInfo = JOB_TYPE_INFO[job.type];
  const progressPercent = job.totalItems > 0 
    ? Math.round((job.processedItems / job.totalItems) * 100) 
    : 0;
  const isActive = job.status === 'running' || job.status === 'pending';

  return (
    <div className="p-3 border-b border-gray-100 last:border-0">
      {/* ヘッダー行 */}
      <div className="flex items-center gap-2 mb-1">
        <StatusIcon status={job.status} />
        <span className="text-sm font-medium text-gray-800 flex-1 truncate">
          {typeInfo?.icon} {job.title}
        </span>
        {!isActive && (
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 進捗バー */}
      {isActive && (
        <div className="mb-1">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* 詳細情報 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {job.processedItems}/{job.totalItems}件
        </span>
        <span>
          {job.status === 'completed' && (
            <span className="text-green-600">
              ✓ {job.successCount}件成功
              {job.failedCount > 0 && <span className="text-red-500 ml-1">/ {job.failedCount}件失敗</span>}
            </span>
          )}
          {job.status === 'failed' && (
            <span className="text-red-500">
              {job.failedCount}件失敗
            </span>
          )}
          {job.status === 'cancelled' && (
            <span className="text-yellow-600">キャンセル</span>
          )}
          {isActive && job.estimatedTimeRemaining && (
            <span>残り約{job.estimatedTimeRemaining}秒</span>
          )}
        </span>
      </div>

      {/* エラー表示 */}
      {job.errors.length > 0 && (
        <details className="mt-1">
          <summary className="text-xs text-red-500 cursor-pointer hover:underline">
            エラー詳細 ({job.errors.length}件)
          </summary>
          <ul className="mt-1 text-xs text-red-400 pl-3 list-disc max-h-20 overflow-y-auto">
            {job.errors.slice(0, 5).map((err, i) => (
              <li key={i} className="truncate">{err}</li>
            ))}
            {job.errors.length > 5 && (
              <li>...他 {job.errors.length - 5}件</li>
            )}
          </ul>
        </details>
      )}
    </div>
  );
};

// メインコンポーネント
export const JobProgressIndicator: React.FC = () => {
  const { 
    jobs, 
    isIndicatorVisible, 
    isDetailPanelOpen,
    setIndicatorVisible,
    toggleDetailPanel,
    getActiveJobs,
    getCompletedJobs,
    getTotalProgress,
    removeJob,
    clearCompletedJobs,
  } = useJobStore();

  const activeJobs = getActiveJobs();
  const completedJobs = getCompletedJobs();
  const { processed, total, percent } = getTotalProgress();
  
  const hasJobs = jobs.size > 0;
  const hasActiveJobs = activeJobs.length > 0;

  // 表示するものがなければ非表示
  if (!hasJobs || !isIndicatorVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* 詳細パネル */}
      {isDetailPanelOpen && (
        <JobDetailPanel 
          activeJobs={activeJobs}
          completedJobs={completedJobs}
          onRemoveJob={removeJob}
          onClearCompleted={clearCompletedJobs}
        />
      )}

      {/* ミニインジケーター */}
      <button
        onClick={toggleDetailPanel}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-full shadow-lg transition-all',
          hasActiveJobs
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-green-600 text-white hover:bg-green-700'
        )}
      >
        {hasActiveJobs ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">
              {processed}/{total} ({percent}%)
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              {completedJobs.length}件完了
            </span>
          </>
        )}

        {/* 開閉アイコン */}
        {isDetailPanelOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronUp className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};

export default JobProgressIndicator;
