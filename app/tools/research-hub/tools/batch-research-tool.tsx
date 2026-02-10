// app/tools/research-hub/tools/batch-research-tool.tsx
/**
 * 📦 Batch Research Tool
 * バッチリサーチ・一括処理
 */

'use client';

import React, { useState } from 'react';
import { Layers, Upload, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDispatch, ToolExecutionPanel } from '@/components/n3/empire/base-hub-layout';

export function BatchResearchTool() {
  const { execute, loading, activeJobs } = useDispatch();
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [inputText, setInputText] = useState('');
  
  const handleBatchSubmit = async () => {
    const items = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    if (items.length === 0) {
      alert('処理対象を入力してください');
      return;
    }
    
    try {
      const result = await execute('research-batch', 'execute', {
        items,
        mode: 'keyword', // or 'asin', 'url'
      });
      
      if (result?.results) {
        setBatchResults(result.results);
      }
    } catch (err) {
      console.error('Batch research error:', err);
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    setInputText(text);
  };
  
  // アクティブなリサーチJobの状態
  const researchJobs = activeJobs.filter(job => job.toolId.startsWith('research-'));
  
  return (
    <div className="space-y-6">
      {/* 入力モード切り替え */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputMode('text')}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${inputMode === 'text'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }
          `}
        >
          テキスト入力
        </button>
        <button
          onClick={() => setInputMode('file')}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${inputMode === 'file'
              ? 'bg-[var(--accent)] text-white'
              : 'bg-[var(--highlight)] text-[var(--text-muted)] hover:text-[var(--text)]'
            }
          `}
        >
          ファイルアップロード
        </button>
      </div>
      
      {/* 入力エリア */}
      <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          バッチリサーチ
        </h3>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          キーワード、ASIN、URLを一行ずつ入力してください。最大100件まで一括処理できます。
        </p>
        
        {inputMode === 'text' ? (
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`例:\nB0XXXXXXXX\nB0YYYYYYYY\nポケモン フィギュア\nドラゴンボール 一番くじ`}
            rows={10}
            className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--panel-border)] rounded text-sm font-mono"
          />
        ) : (
          <div className="border-2 border-dashed border-[var(--panel-border)] rounded-lg p-8 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)] mb-4">
              CSV/TXTファイルをドロップまたは選択
            </p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="batch-file-input"
            />
            <label
              htmlFor="batch-file-input"
              className="px-4 py-2 bg-[var(--highlight)] rounded cursor-pointer hover:bg-[var(--panel-border)]"
            >
              ファイルを選択
            </label>
          </div>
        )}
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">
            {inputText.split('\n').filter(l => l.trim()).length} 件
          </span>
          <button
            onClick={handleBatchSubmit}
            disabled={loading || !inputText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                処理中...
              </>
            ) : (
              <>
                <Layers className="w-4 h-4" />
                バッチ実行
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Job進捗 */}
      {researchJobs.length > 0 && (
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg p-4">
          <h3 className="font-bold mb-4">実行中のジョブ</h3>
          <div className="space-y-2">
            {researchJobs.map(job => (
              <div key={job.jobId} className="flex items-center gap-3 p-2 bg-[var(--highlight)] rounded">
                {job.status === 'running' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                ) : job.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : job.status === 'failed' ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : null}
                <span className="flex-1 text-sm">{job.toolId}</span>
                {job.progress > 0 && (
                  <span className="text-sm text-[var(--text-muted)]">{job.progress}%</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 結果表示 */}
      {batchResults.length > 0 && (
        <div className="bg-[var(--panel)] border border-[var(--panel-border)] rounded-lg">
          <div className="p-4 border-b border-[var(--panel-border)] flex items-center justify-between">
            <h3 className="font-bold">処理結果 ({batchResults.length}件)</h3>
            <button
              onClick={() => {
                const csv = batchResults.map(r => 
                  [r.query, r.title, r.price, r.status].join(',')
                ).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'batch-results.csv';
                a.click();
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-[var(--highlight)] rounded text-sm hover:bg-[var(--panel-border)]"
            >
              <Download className="w-4 h-4" />
              CSVダウンロード
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--highlight)] sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left">クエリ</th>
                  <th className="px-4 py-2 text-left">結果</th>
                  <th className="px-4 py-2 text-right">価格</th>
                  <th className="px-4 py-2 text-center">ステータス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--panel-border)]">
                {batchResults.map((result, index) => (
                  <tr key={index} className="hover:bg-[var(--highlight)]">
                    <td className="px-4 py-2 text-[var(--text-muted)]">{result.query}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{result.title || '-'}</td>
                    <td className="px-4 py-2 text-right">{result.price ? `$${result.price}` : '-'}</td>
                    <td className="px-4 py-2 text-center">
                      {result.status === 'found' ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatchResearchTool;
