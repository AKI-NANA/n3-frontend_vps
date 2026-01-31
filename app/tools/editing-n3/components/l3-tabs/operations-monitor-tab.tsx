// app/tools/editing-n3/components/l3-tabs/operations-monitor-tab.tsx
/**
 * Operations Monitor Tab
 * - 今日の実行状況
 * - ワークフロー履歴
 * - 異常アラート
 * - システム状態
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Clock,
  TrendingUp,
  Shield,
  Zap,
} from 'lucide-react';

interface DailySummary {
  date: string;
  research: { count: number; success: number; error: number; output: number };
  listing: { count: number; success: number; error: number; output: number };
  stock: { count: number; success: number; error: number; output: number };
  price: { count: number; success: number; error: number; output: number };
}

interface WorkflowLog {
  id: string;
  workflow_name: string;
  workflow_type: string;
  status: string;
  start_time: string;
  end_time: string;
  duration_sec: number;
  input_count: number;
  output_count: number;
  error_count: number;
  error_message?: string;
  meta_json?: any;
  created_at: string;
}

interface SystemStatus {
  global_stop: { stopped: boolean; reason?: string };
  api_stats?: any;
  dry_run: boolean;
  auto_approve: boolean;
}

interface MonitoringData {
  today: DailySummary;
  recent_errors: Array<{
    id: string;
    workflow_name: string;
    workflow_type: string;
    error_message: string;
    created_at: string;
  }>;
  history: WorkflowLog[];
  daily_stats: Array<{
    date: string;
    total: number;
    success: number;
    error: number;
    output: number;
  }>;
  system_status: SystemStatus;
}

export function OperationsMonitorTab() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/monitoring/summary?days=7&limit=50');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
        setError(null);
      } else {
        setError(json.error || 'Failed to fetch');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // 1分毎に更新
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !data) {
    return (
      <div className="p-6 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">読み込み中...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">エラー: {error}</p>
          <Button onClick={fetchData} className="mt-2" variant="outline" size="sm">
            再試行
          </Button>
        </div>
      </div>
    );
  }

  const { today, recent_errors, history, daily_stats, system_status } = data!;

  return (
    <div className="p-4 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Operations Monitor
        </h2>
        <Button onClick={fetchData} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          更新
        </Button>
      </div>

      {/* システム状態 */}
      <Card className={system_status.global_stop.stopped ? 'border-red-500 bg-red-50' : ''}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            システム状態
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {system_status.global_stop.stopped ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                緊急停止中
              </Badge>
            ) : (
              <Badge variant="default" className="bg-green-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                稼働中
              </Badge>
            )}
            <Badge variant={system_status.dry_run ? 'secondary' : 'outline'}>
              DRY_RUN: {system_status.dry_run ? 'ON' : 'OFF'}
            </Badge>
            <Badge variant={system_status.auto_approve ? 'default' : 'outline'}>
              AUTO_APPROVE: {system_status.auto_approve ? 'ON' : 'OFF'}
            </Badge>
          </div>
          {system_status.api_stats && (
            <div className="mt-2 text-xs text-gray-500">
              API呼び出し: Research {system_status.api_stats.research?.daily_count || 0}回 
              (${(system_status.api_stats.research?.daily_cost_usd || 0).toFixed(3)})
            </div>
          )}
        </CardContent>
      </Card>

      {/* 今日の実行状況 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            今日の実行状況 ({today.date})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="リサーチ"
              count={today.research.count}
              success={today.research.success}
              error={today.research.error}
              output={today.research.output}
            />
            <StatCard
              label="出品"
              count={today.listing.count}
              success={today.listing.success}
              error={today.listing.error}
              output={today.listing.output}
            />
            <StatCard
              label="在庫更新"
              count={today.stock.count}
              success={today.stock.success}
              error={today.stock.error}
              output={today.stock.output}
            />
            <StatCard
              label="価格変更"
              count={today.price.count}
              success={today.price.success}
              error={today.price.error}
              output={today.price.output}
            />
          </div>
        </CardContent>
      </Card>

      {/* 異常アラート */}
      {recent_errors.length > 0 && (
        <Card className="border-orange-300 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-4 h-4" />
              異常アラート（24時間以内）
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {recent_errors.map((err) => (
                <div key={err.id} className="text-sm bg-white p-2 rounded border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{err.workflow_name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(err.created_at).toLocaleString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-red-600 text-xs mt-1 truncate">{err.error_message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ワークフロー履歴 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            ワークフロー履歴
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-1">日時</th>
                  <th className="text-left py-2 px-1">種別</th>
                  <th className="text-left py-2 px-1">状態</th>
                  <th className="text-right py-2 px-1">入力</th>
                  <th className="text-right py-2 px-1">出力</th>
                  <th className="text-right py-2 px-1">時間</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 20).map((log) => (
                  <tr key={log.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-1 text-xs">
                      {new Date(log.created_at).toLocaleString('ja-JP', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2 px-1">
                      <Badge variant="outline" className="text-xs">
                        {log.workflow_type}
                      </Badge>
                    </td>
                    <td className="py-2 px-1">
                      {log.status === 'success' && (
                        <Badge className="bg-green-500 text-xs">成功</Badge>
                      )}
                      {log.status === 'error' && (
                        <Badge variant="destructive" className="text-xs">失敗</Badge>
                      )}
                      {log.status === 'partial' && (
                        <Badge className="bg-yellow-500 text-xs">一部</Badge>
                      )}
                    </td>
                    <td className="py-2 px-1 text-right">{log.input_count}</td>
                    <td className="py-2 px-1 text-right">{log.output_count}</td>
                    <td className="py-2 px-1 text-right text-xs">
                      {log.duration_sec?.toFixed(1)}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 日別集計グラフ（簡易版） */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4" />
            日別集計（7日間）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {daily_stats.slice(0, 7).map((day) => (
              <div key={day.date} className="flex items-center gap-2">
                <span className="text-xs w-20">{day.date.slice(5)}</span>
                <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden flex">
                  <div 
                    className="bg-green-500 h-full" 
                    style={{ width: `${(day.success / Math.max(day.total, 1)) * 100}%` }}
                  />
                  <div 
                    className="bg-red-500 h-full" 
                    style={{ width: `${(day.error / Math.max(day.total, 1)) * 100}%` }}
                  />
                </div>
                <span className="text-xs w-16 text-right">{day.output}件</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 統計カード
function StatCard({ 
  label, 
  count, 
  success, 
  error, 
  output 
}: { 
  label: string; 
  count: number; 
  success: number; 
  error: number; 
  output: number;
}) {
  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold">{count}</div>
      <div className="flex gap-2 text-xs mt-1">
        <span className="text-green-600">✓{success}</span>
        {error > 0 && <span className="text-red-600">✗{error}</span>}
      </div>
      <div className="text-xs text-gray-400 mt-1">出力: {output}件</div>
    </div>
  );
}

export default OperationsMonitorTab;
