/**
 * Batch Research N3 - 大規模データ一括取得バッチ
 * 
 * 元ツール: /tools/batch-research
 * デザイン: N3 Design System
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  N3Panel,
  N3FilterGrid,
  N3FilterRow,
  N3FilterField,
  N3Input,
  N3Button,
  N3Select,
  N3TextArea,
  N3StatsGrid,
  N3StatItem,
  N3Badge,
  N3Card,
  N3EmptyState,
  N3LoadingDots,
  N3ToastContainer,
  N3ProgressBar,
  useToast,
} from '@/components/n3';
import { Clock, Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BatchJob {
  job_id: string;
  job_name: string;
  status: string;
  progress_percentage: number;
  total_tasks: number;
  tasks_completed: number;
  tasks_pending: number;
  created_at: string;
}

type SplitUnit = 'day' | 'week';
type ExecutionFrequency = 'once' | 'daily' | 'weekly' | 'monthly';

export default function BatchResearchN3Page() {
  const { toasts, removeToast, toast: showToast } = useToast();

  // フォーム状態
  const [jobName, setJobName] = useState('');
  const [description, setDescription] = useState('');
  const [sellerIds, setSellerIds] = useState('');
  const [keywords, setKeywords] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [splitUnit, setSplitUnit] = useState<SplitUnit>('week');
  const [executionFrequency, setExecutionFrequency] = useState<ExecutionFrequency>('once');

  // UI状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobs, setJobs] = useState<BatchJob[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // 推定情報
  const [estimatedTasks, setEstimatedTasks] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  // 推定タスク数を計算
  useEffect(() => {
    if (sellerIds && dateStart && dateEnd) {
      const sellerCount = sellerIds.split(',').filter((s) => s.trim()).length;
      const keywordCount = keywords ? keywords.split(',').filter((k) => k.trim()).length : 1;

      const start = new Date(dateStart);
      const end = new Date(dateEnd);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      let dateRangeCount = 0;
      if (splitUnit === 'day') {
        dateRangeCount = diffDays;
      } else {
        dateRangeCount = Math.ceil(diffDays / 7);
      }

      const totalTasks = sellerCount * keywordCount * dateRangeCount;
      setEstimatedTasks(totalTasks);

      const estimatedSeconds = totalTasks * 7;
      setEstimatedTime(formatTime(estimatedSeconds));
    }
  }, [sellerIds, keywords, dateStart, dateEnd, splitUnit]);

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}秒`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}分${seconds % 60}秒`;
    if (seconds < 86400)
      return `${Math.floor(seconds / 3600)}時間${Math.floor((seconds % 3600) / 60)}分`;
    return `${Math.floor(seconds / 86400)}日${Math.floor((seconds % 86400) / 3600)}時間`;
  };

  const fetchJobs = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await fetch('/api/batch-research/jobs?limit=10');
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('ジョブ一覧取得エラー:', error);
      showToast('ジョブ一覧の取得に失敗しました', 'error');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobName.trim() || !sellerIds.trim() || !dateStart || !dateEnd) {
      showToast('必須項目を入力してください', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const sellerIdArray = sellerIds
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s);
      const keywordArray = keywords
        ? keywords
            .split(',')
            .map((k) => k.trim())
            .filter((k) => k)
        : undefined;

      const response = await fetch('/api/batch-research/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_name: jobName,
          description,
          target_seller_ids: sellerIdArray,
          keywords: keywordArray,
          date_start: dateStart,
          date_end: dateEnd,
          split_unit: splitUnit,
          execution_frequency: executionFrequency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showToast(
          `ジョブを作成しました！総タスク数: ${data.summary.total_tasks}`,
          'success'
        );
        // フォームをリセット
        setJobName('');
        setDescription('');
        setSellerIds('');
        setKeywords('');
        setDateStart('');
        setDateEnd('');
        // ジョブ一覧を更新
        fetchJobs();
      } else {
        showToast(data.error || 'ジョブの作成に失敗しました', 'error');
      }
    } catch (error: any) {
      console.error('Error creating job:', error);
      showToast('エラーが発生しました', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'running':
        return 'info';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'paused':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: 24 }}>
      <N3ToastContainer toasts={toasts} onClose={removeToast} />

      {/* メインコンテンツ */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* 左側: フォーム */}
        <div>
          <N3Panel title="新規バッチジョブ作成">
            <form onSubmit={handleSubmit}>
              <N3FilterGrid>
                <N3FilterRow>
                  <N3FilterField label="ジョブ名 *" span={6}>
                    <N3Input
                      value={jobName}
                      onChange={(e) => setJobName(e.target.value)}
                      placeholder="例: 日本人セラー Q3 2025 リサーチ"
                      required
                    />
                  </N3FilterField>
                </N3FilterRow>

                <N3FilterRow>
                  <N3FilterField label="説明（任意）" span={6}>
                    <N3TextArea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="このジョブの目的や詳細を入力..."
                      rows={3}
                    />
                  </N3FilterField>
                </N3FilterRow>

                <N3FilterRow>
                  <N3FilterField label="ターゲットセラーID *" span={6}>
                    <N3TextArea
                      value={sellerIds}
                      onChange={(e) => setSellerIds(e.target.value)}
                      placeholder="カンマ区切りで入力: jpn_seller_001, jpn_seller_002"
                      rows={3}
                      required
                    />
                  </N3FilterField>
                </N3FilterRow>

                <N3FilterRow>
                  <N3FilterField label="キーワード（任意）" span={6}>
                    <N3Input
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="カンマ区切り: Figure, Anime （空欄でセラーの全商品）"
                    />
                  </N3FilterField>
                </N3FilterRow>

                <N3FilterRow>
                  <N3FilterField label="開始日 *" span={3}>
                    <N3Input
                      type="date"
                      value={dateStart}
                      onChange={(e) => setDateStart(e.target.value)}
                      required
                    />
                  </N3FilterField>
                  <N3FilterField label="終了日 *" span={3}>
                    <N3Input
                      type="date"
                      value={dateEnd}
                      onChange={(e) => setDateEnd(e.target.value)}
                      required
                    />
                  </N3FilterField>
                </N3FilterRow>

                <N3FilterRow>
                  <N3FilterField label="日付分割単位" span={3}>
                    <N3Select
                      value={splitUnit}
                      onChange={(e) => setSplitUnit(e.target.value as SplitUnit)}
                    >
                      <option value="week">1週間単位（推奨）</option>
                      <option value="day">1日単位（細かく分割）</option>
                    </N3Select>
                  </N3FilterField>
                  <N3FilterField label="実行頻度" span={3}>
                    <N3Select
                      value={executionFrequency}
                      onChange={(e) =>
                        setExecutionFrequency(e.target.value as ExecutionFrequency)
                      }
                    >
                      <option value="once">1回のみ</option>
                      <option value="daily">毎日</option>
                      <option value="weekly">毎週</option>
                      <option value="monthly">毎月</option>
                    </N3Select>
                  </N3FilterField>
                </N3FilterRow>

                <N3FilterRow>
                  <N3FilterField label="" span={6}>
                    <N3Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="primary"
                      style={{ width: '100%', marginTop: 16 }}
                    >
                      {isSubmitting ? 'ジョブ作成中...' : 'バッチジョブを作成'}
                    </N3Button>
                  </N3FilterField>
                </N3FilterRow>
              </N3FilterGrid>
            </form>
          </N3Panel>
        </div>

        {/* 右側: 推定情報とジョブ一覧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* 推定情報 */}
          <N3Panel title="推定情報">
            <N3StatsGrid columns={1}>
              <N3StatItem
                icon={<Database size={20} />}
                label="推定タスク数"
                value={estimatedTasks}
                color="blue"
              />
              <N3StatItem
                icon={<Clock size={20} />}
                label="推定完了時間"
                value={estimatedTime || '-'}
                color="purple"
              />
            </N3StatsGrid>
          </N3Panel>

          {/* ジョブ一覧 */}
          <N3Panel
            title="最近のジョブ"
            action={
              <N3Button
                onClick={fetchJobs}
                disabled={isLoadingJobs}
                variant="ghost"
                size="sm"
              >
                {isLoadingJobs ? <Loader2 size={14} className="animate-spin" /> : '更新'}
              </N3Button>
            }
          >
            {jobs.length === 0 ? (
              <N3EmptyState
                icon={<Database size={32} />}
                title="ジョブがありません"
                description="左側のフォームから新規ジョブを作成してください"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map((job) => (
                  <N3Card
                    key={job.job_id}
                    style={{
                      padding: 16,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      /* ジョブ詳細へ遷移 */
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>
                        {job.job_name}
                      </span>
                      <N3Badge variant={getStatusBadgeVariant(job.status)}>
                        {job.status}
                      </N3Badge>
                    </div>
                    <N3ProgressBar
                      progress={job.progress_percentage}
                      style={{ marginBottom: 8 }}
                    />
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {job.tasks_completed} / {job.total_tasks} タスク完了
                    </div>
                  </N3Card>
                ))}
              </div>
            )}
          </N3Panel>

          {/* 使い方ガイド */}
          <N3Panel title="使い方">
            <ol
              style={{
                fontSize: 14,
                lineHeight: 1.8,
                paddingLeft: 20,
                color: 'var(--text)',
              }}
            >
              <li>調査したいセラーIDを入力</li>
              <li>取得期間を指定（最大1年推奨）</li>
              <li>日付分割単位を選択</li>
              <li>ジョブを作成</li>
              <li>VPSのCronが自動実行</li>
            </ol>
          </N3Panel>
        </div>
      </div>
    </div>
  );
}
