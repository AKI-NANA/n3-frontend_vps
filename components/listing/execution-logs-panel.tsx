'use client';

/**
 * 実行ログパネルコンポーネント
 *
 * execution_logs テーブルのデータを表示し、
 * SKUごとのドリルダウンで詳細な試行履歴を確認できる
 */

import { useState, useEffect } from 'react';

interface ExecutionLog {
  id: number;
  sku: string;
  platform: string | null;
  account_id: string | null;
  success: boolean;
  error_type?: string;
  error_code?: string;
  error_message?: string;
  retry_count?: number;
  executed_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ExecutionLogsPanel({ isOpen, onClose }: Props) {
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [skuLogs, setSkuLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterSuccess, setFilterSuccess] = useState<boolean | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  // ログを取得
  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen, filterSuccess, filterPlatform]);

  // SKU別ログを取得
  useEffect(() => {
    if (selectedSku) {
      fetchSkuLogs(selectedSku);
    }
  }, [selectedSku]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterSuccess !== null) {
        params.append('success', String(filterSuccess));
      }
      if (filterPlatform !== 'all') {
        params.append('platform', filterPlatform);
      }

      const response = await fetch(`/api/listing/logs?${params.toString()}`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch execution logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSkuLogs = async (sku: string) => {
    try {
      const response = await fetch(`/api/listing/logs?sku=${sku}`);
      const data = await response.json();
      setSkuLogs(data.logs || []);
    } catch (error) {
      console.error(`Failed to fetch logs for SKU ${sku}:`, error);
    }
  };

  const handleSkuClick = (sku: string) => {
    setSelectedSku(sku);
  };

  const handleBack = () => {
    setSelectedSku(null);
    setSkuLogs([]);
  };

  // 🔄 リトライハンドラー
  const handleRetry = async (sku: string, platform: string | null) => {
    if (!confirm(`SKU ${sku} を再度出品実行しますか？`)) {
      return;
    }

    try {
      const response = await fetch('/api/publisher/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skus: [sku],
          // platformがあればそれを使用、なければデフォルト
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'リトライに失敗しました');
      }

      const result = await response.json();

      if (result.success && result.stats.success > 0) {
        alert(`✅ SKU ${sku} のリトライに成功しました`);
        // ログを再読み込み
        fetchLogs();
        if (selectedSku) {
          fetchSkuLogs(selectedSku);
        }
      } else {
        const errorMsg = result.results?.[0]?.error_message || 'リトライに失敗しました';
        alert(`❌ リトライに失敗しました: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error('Retry error:', error);
      alert(`リトライ中にエラーが発生しました: ${error.message}`);
    }
  };

  // 🔄 一括リトライハンドラー
  const handleBulkRetry = async () => {
    const failedLogs = logs.filter(log => !log.success);

    if (failedLogs.length === 0) {
      alert('リトライ可能な失敗ログがありません');
      return;
    }

    if (!confirm(`${failedLogs.length}件の失敗SKUを一括リトライしますか？`)) {
      return;
    }

    try {
      const skus = [...new Set(failedLogs.map(log => log.sku))]; // 重複除去

      const response = await fetch('/api/publisher/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '一括リトライに失敗しました');
      }

      const result = await response.json();

      alert(
        `✅ 一括リトライ完了\n\n` +
        `成功: ${result.stats.success}件\n` +
        `失敗: ${result.stats.failed}件\n` +
        `警告: ${result.stats.warnings}件`
      );

      // ログを再読み込み
      fetchLogs();
    } catch (error: any) {
      console.error('Bulk retry error:', error);
      alert(`一括リトライ中にエラーが発生しました: ${error.message}`);
    }
  };

  const getStatusBadge = (log: ExecutionLog) => {
    if (log.success) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          成功
        </span>
      );
    } else if (log.error_type === 'temporary') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          一時的エラー
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          致命的エラー
        </span>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-4xl bg-white shadow-xl overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {selectedSku ? `実行ログ詳細: ${selectedSku}` : '実行ログ'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* フィルター（メインビューのみ） */}
        {!selectedSku && (
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex gap-4 items-center">
              <div>
                <label className="text-sm font-medium mr-2">ステータス:</label>
                <select
                  value={
                    filterSuccess === null
                      ? 'all'
                      : filterSuccess
                      ? 'success'
                      : 'failure'
                  }
                  onChange={(e) =>
                    setFilterSuccess(
                      e.target.value === 'all'
                        ? null
                        : e.target.value === 'success'
                    )
                  }
                  className="border rounded px-3 py-1"
                >
                  <option value="all">すべて</option>
                  <option value="success">成功のみ</option>
                  <option value="failure">失敗のみ</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mr-2">プラットフォーム:</label>
                <select
                  value={filterPlatform}
                  onChange={(e) => setFilterPlatform(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">すべて</option>
                  <option value="ebay">eBay</option>
                  <option value="amazon_us">Amazon US</option>
                  <option value="amazon_au">Amazon AU</option>
                  <option value="amazon_jp">Amazon JP</option>
                  <option value="coupang">Coupang</option>
                </select>
              </div>
              <button
                onClick={fetchLogs}
                className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                更新
              </button>
              <button
                onClick={handleBulkRetry}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded hover:from-orange-700 hover:to-red-700 font-semibold shadow-md"
                title="失敗したSKUを一括リトライ"
              >
                🔄 失敗SKUを一括リトライ
              </button>
            </div>
          </div>
        )}

        {/* コンテンツ */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          ) : selectedSku ? (
            // SKU詳細ビュー
            <div>
              <button
                onClick={handleBack}
                className="mb-4 text-blue-600 hover:text-blue-700"
              >
                ← 一覧に戻る
              </button>

              <div className="space-y-4">
                {skuLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    ログが見つかりません
                  </div>
                ) : (
                  skuLogs.map((log) => (
                    <div
                      key={log.id}
                      className="border rounded-lg p-4 bg-white hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(log)}
                          {log.platform && (
                            <span className="text-sm font-medium text-gray-700">
                              {log.platform}
                            </span>
                          )}
                          {log.retry_count !== undefined && log.retry_count > 0 && (
                            <span className="text-xs text-orange-600">
                              リトライ #{log.retry_count}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(log.executed_at)}
                        </div>
                      </div>

                      {!log.success && (
                        <div className="mt-3">
                          {log.error_code && (
                            <div className="text-sm">
                              <span className="font-semibold">エラーコード:</span>{' '}
                              <code className="bg-gray-100 px-2 py-1 rounded">
                                {log.error_code}
                              </code>
                            </div>
                          )}
                          {log.error_message && (
                            <div className="text-sm mt-2">
                              <span className="font-semibold">エラーメッセージ:</span>
                              <div className="mt-1 bg-red-50 border border-red-200 rounded p-2 text-red-800">
                                {log.error_message}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // メインビュー（ログ一覧）
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      プラットフォーム
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      エラーコード
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      リトライ回数
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      実行日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        ログが見つかりません
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50"
                      >
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => handleSkuClick(log.sku)}
                        >
                          {log.sku}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.platform || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(log)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.error_code || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.retry_count !== undefined ? log.retry_count : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(log.executed_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {!log.success && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRetry(log.sku, log.platform);
                              }}
                              className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 font-medium text-xs"
                            >
                              🔄 リトライ
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
