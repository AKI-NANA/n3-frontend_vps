// app/tools/listing-n3/components/l3-tabs/bulk-listing-tool-panel.tsx
/**
 * 一括出品ツールパネル
 * CSVアップロード・ジョブ管理
 */

'use client';

import React, { memo, useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, Play, Pause, RefreshCw, Trash2, Download, AlertCircle, Check, Clock } from 'lucide-react';
import { N3Button } from '@/components/n3/presentational/n3-button';
import { N3Badge } from '@/components/n3/presentational/n3-badge';
import { N3ProgressBar } from '@/components/n3/presentational/n3-progress-bar';
import { N3FileUpload } from '@/components/n3/container/n3-file-upload';
import { N3Stepper } from '@/components/n3/container/n3-stepper';
import { BulkListingJob, Marketplace } from '../../types/listing';
import { useBulkListing } from '../../hooks';

interface BulkListingToolPanelProps {
  onComplete?: () => void;
}

// ステータスバッジ
const StatusBadge = memo(function StatusBadge({ status }: { status: BulkListingJob['status'] }) {
  const config = {
    pending: { variant: 'secondary' as const, label: '待機中', icon: Clock },
    processing: { variant: 'warning' as const, label: '処理中', icon: RefreshCw },
    completed: { variant: 'success' as const, label: '完了', icon: Check },
    failed: { variant: 'error' as const, label: '失敗', icon: AlertCircle },
  };

  const { variant, label, icon: Icon } = config[status];

  return (
    <N3Badge variant={variant} size="sm">
      <Icon size={10} style={{ marginRight: '4px' }} />
      {label}
    </N3Badge>
  );
});

// ジョブカード
const JobCard = memo(function JobCard({
  job,
  onStart,
  onCancel,
  onRetry,
  onDelete,
}: {
  job: BulkListingJob;
  onStart: () => void;
  onCancel: () => void;
  onRetry: () => void;
  onDelete: () => void;
}) {
  const progress = job.totalItems > 0 ? (job.processedItems / job.totalItems) * 100 : 0;

  return (
    <div
      style={{
        padding: '14px 16px',
        background: 'var(--panel)',
        border: '1px solid var(--panel-border)',
        borderRadius: 'var(--style-radius-lg, 12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--highlight)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileSpreadsheet size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              {job.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {job.marketplace.toUpperCase()} • {new Date(job.createdAt).toLocaleString('ja-JP')}
            </div>
          </div>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* 進捗 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {job.processedItems} / {job.totalItems} 件処理
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {progress.toFixed(0)}%
          </span>
        </div>
        <N3ProgressBar value={progress} max={100} size="sm" />
      </div>

      {/* 統計 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        <div style={{ textAlign: 'center', padding: '8px', background: 'var(--highlight)', borderRadius: '6px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{job.totalItems}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>合計</div>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '6px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-success)' }}>{job.successItems}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>成功</div>
        </div>
        <div style={{ textAlign: 'center', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-error)' }}>{job.failedItems}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>失敗</div>
        </div>
      </div>

      {/* エラー表示 */}
      {job.errors && job.errors.length > 0 && (
        <div
          style={{
            padding: '10px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 'var(--style-radius-md, 8px)',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-error)', marginBottom: '6px' }}>
            エラー ({job.errors.length}件)
          </div>
          {job.errors.slice(0, 3).map((err, i) => (
            <div key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
              行{err.row}: {err.error}
            </div>
          ))}
          {job.errors.length > 3 && (
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              他 {job.errors.length - 3} 件...
            </div>
          )}
        </div>
      )}

      {/* アクション */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {job.status === 'pending' && (
          <N3Button variant="primary" size="xs" onClick={onStart}>
            <Play size={12} />
            開始
          </N3Button>
        )}
        {job.status === 'processing' && (
          <N3Button variant="secondary" size="xs" onClick={onCancel}>
            <Pause size={12} />
            キャンセル
          </N3Button>
        )}
        {job.status === 'failed' && (
          <N3Button variant="warning" size="xs" onClick={onRetry}>
            <RefreshCw size={12} />
            再試行
          </N3Button>
        )}
        <N3Button variant="ghost" size="xs" onClick={onDelete}>
          <Trash2 size={12} />
        </N3Button>
      </div>
    </div>
  );
});

export const BulkListingToolPanel = memo(function BulkListingToolPanel({
  onComplete,
}: BulkListingToolPanelProps) {
  const {
    jobs,
    uploading,
    uploadProgress,
    uploadCsv,
    startJob,
    cancelJob,
    deleteJob,
    retryJob,
    downloadTemplate,
  } = useBulkListing();

  const [marketplace, setMarketplace] = useState<Marketplace>('ebay');
  const [step, setStep] = useState(0);

  const steps = [
    { id: 'upload', label: 'ファイル選択', description: 'CSVファイルをアップロード' },
    { id: 'settings', label: '設定', description: 'マーケットプレイス選択' },
    { id: 'confirm', label: '確認', description: '内容を確認して実行' },
  ];

  // ファイル選択
  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];

    await uploadCsv(file, {
      marketplace,
      name: file.name.replace('.csv', ''),
      skipDuplicates: true,
      autoOptimize: false,
    });

    setStep(2);
  }, [marketplace, uploadCsv]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
      {/* ヘッダー */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'var(--panel)',
          borderRadius: 'var(--style-radius-lg, 12px)',
          border: '1px solid var(--panel-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Upload size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
              一括出品
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              CSVファイルから商品を一括登録
            </div>
          </div>
        </div>

        <N3Button variant="secondary" size="sm" onClick={() => downloadTemplate(marketplace)}>
          <Download size={14} />
          テンプレート
        </N3Button>
      </div>

      {/* ステッパー */}
      <N3Stepper
        steps={steps.map((s, i) => ({
          ...s,
          status: i < step ? 'completed' : i === step ? 'active' : 'pending',
        }))}
        orientation="horizontal"
        variant="numbered"
      />

      {/* アップロード */}
      {step === 0 && (
        <div>
          {/* マーケットプレイス選択 */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text)', marginBottom: '8px' }}>
              出品先マーケットプレイス
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['ebay', 'amazon', 'mercari', 'yahoo', 'rakuten'] as Marketplace[]).map(mp => (
                <N3Button
                  key={mp}
                  variant={marketplace === mp ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setMarketplace(mp)}
                >
                  {mp.toUpperCase()}
                </N3Button>
              ))}
            </div>
          </div>

          <N3FileUpload
            accept=".csv,.xlsx"
            onFilesSelected={handleFilesSelected}
            showPreview={false}
          />

          {uploading && (
            <div style={{ marginTop: '12px' }}>
              <N3ProgressBar value={uploadProgress} max={100} />
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                アップロード中... {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* ジョブ履歴 */}
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
          ジョブ履歴
        </div>

        {jobs.length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              background: 'var(--panel)',
              borderRadius: 'var(--style-radius-lg, 12px)',
              border: '1px solid var(--panel-border)',
            }}
          >
            <FileSpreadsheet size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              ジョブ履歴がありません
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onStart={() => startJob(job.id)}
                onCancel={() => cancelJob(job.id)}
                onRetry={() => retryJob(job.id)}
                onDelete={() => deleteJob(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default BulkListingToolPanel;
