// app/tools/editing-n3/components/sync/inventory-sync-panel.tsx
/**
 * 棚卸し同期パネル
 * 
 * 機能:
 * - 同期診断（DB vs シートの差分表示）
 * - Push（DB → シート）
 * - Pull（シート → DB）
 * - バックアップ確認
 * - 進捗表示
 */
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  RefreshCw, Upload, Download, AlertTriangle, CheckCircle,
  ExternalLink, FileSpreadsheet, Database, Clock, Info,
  ChevronDown, ChevronUp, Loader2, Shield
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface DiagnosisResult {
  dbCount: number;
  sheetCount: number;
  matchedCount: number;
  dbOnlySkus: string[];
  sheetOnlySkus: string[];
  duplicateSkus: string[];
  deletedInDb: number;
}

interface SyncResult {
  success: boolean;
  action: string;
  rowsAffected: number;
  errors: string[];
  backupSheet?: string;
  details?: any;
}

interface SyncStatus {
  isLoading: boolean;
  lastSyncAt: Date | null;
  lastAction: string | null;
  lastResult: SyncResult | null;
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function InventorySyncPanel() {
  const [target, setTarget] = useState<'products' | 'inventory'>('products');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [status, setStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSyncAt: null,
    lastAction: null,
    lastResult: null,
  });
  const [showDetails, setShowDetails] = useState(false);
  const [createBackup, setCreateBackup] = useState(true);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  // 初期ステータス取得
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/sync/inventory-sheets?action=status');
      const data = await res.json();
      if (data.spreadsheetUrl) {
        setSpreadsheetUrl(data.spreadsheetUrl);
      }
    } catch (e) {
      console.error('Status fetch error:', e);
    }
  };

  // 診断実行
  const runDiagnosis = useCallback(async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/sync/inventory-sheets?action=diagnose&target=${target}`);
      const data = await res.json();
      
      if (data.success) {
        setDiagnosis(data.diagnosis);
        setSpreadsheetUrl(data.spreadsheetUrl || spreadsheetUrl);
      } else {
        throw new Error(data.error);
      }
    } catch (e: any) {
      console.error('Diagnosis error:', e);
      setStatus(prev => ({
        ...prev,
        lastResult: { success: false, action: 'diagnose', rowsAffected: 0, errors: [e.message] }
      }));
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, [target, spreadsheetUrl]);

  // Push実行
  const runPush = useCallback(async () => {
    if (!confirm('DBのデータをスプレッドシートに反映します。続行しますか？')) return;
    
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/sync/inventory-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push', target, createBackup }),
      });
      const data = await res.json();
      
      setStatus(prev => ({
        ...prev,
        lastSyncAt: new Date(),
        lastAction: 'push',
        lastResult: data,
      }));
      setSpreadsheetUrl(data.spreadsheetUrl || spreadsheetUrl);
      
      // 成功後に診断を再実行
      if (data.success) {
        await runDiagnosis();
      }
    } catch (e: any) {
      setStatus(prev => ({
        ...prev,
        lastResult: { success: false, action: 'push', rowsAffected: 0, errors: [e.message] }
      }));
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, [target, createBackup, runDiagnosis, spreadsheetUrl]);

  // Pull実行
  const runPull = useCallback(async () => {
    if (!confirm('スプレッドシートの変更をDBに取り込みます。編集可能なカラムのみ更新されます。続行しますか？')) return;
    
    setStatus(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch('/api/sync/inventory-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pull', target }),
      });
      const data = await res.json();
      
      setStatus(prev => ({
        ...prev,
        lastSyncAt: new Date(),
        lastAction: 'pull',
        lastResult: data,
      }));
      
      // 成功後に診断を再実行
      if (data.success) {
        await runDiagnosis();
      }
    } catch (e: any) {
      setStatus(prev => ({
        ...prev,
        lastResult: { success: false, action: 'pull', rowsAffected: 0, errors: [e.message] }
      }));
    } finally {
      setStatus(prev => ({ ...prev, isLoading: false }));
    }
  }, [target, runDiagnosis]);

  return (
    <div className="p-4 space-y-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">棚卸し同期</h2>
            <p className="text-sm text-gray-500">Google Sheets ↔ Database</p>
          </div>
        </div>
        
        {spreadsheetUrl && (
          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
          >
            <ExternalLink size={14} />
            シートを開く
          </a>
        )}
      </div>

      {/* ターゲット選択 */}
      <div className="flex gap-2">
        <button
          onClick={() => setTarget('products')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            target === 'products'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Database size={14} className="inline mr-2" />
          商品マスター
        </button>
        <button
          onClick={() => setTarget('inventory')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            target === 'inventory'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Database size={14} className="inline mr-2" />
          在庫マスター
        </button>
      </div>

      {/* 診断結果 */}
      {diagnosis && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Info size={16} />
              同期診断結果
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-blue-600 flex items-center gap-1"
            >
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              詳細
            </button>
          </div>

          {/* サマリー */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{diagnosis.dbCount}</div>
              <div className="text-xs text-gray-500">DB件数</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{diagnosis.sheetCount}</div>
              <div className="text-xs text-gray-500">シート件数</div>
            </div>
            <div className={`bg-white rounded-lg p-3 text-center ${
              diagnosis.dbCount !== diagnosis.sheetCount ? 'ring-2 ring-orange-400' : ''
            }`}>
              <div className={`text-2xl font-bold ${
                diagnosis.dbCount === diagnosis.sheetCount ? 'text-green-600' : 'text-orange-600'
              }`}>
                {diagnosis.dbCount - diagnosis.sheetCount}
              </div>
              <div className="text-xs text-gray-500">差分</div>
            </div>
          </div>

          {/* 一致状況 */}
          <div className="flex items-center gap-2">
            {diagnosis.dbCount === diagnosis.sheetCount ? (
              <CheckCircle className="text-green-500" size={16} />
            ) : (
              <AlertTriangle className="text-orange-500" size={16} />
            )}
            <span className="text-sm">
              {diagnosis.matchedCount}件が一致 / 
              DBのみ: {diagnosis.dbOnlySkus.length}件 / 
              シートのみ: {diagnosis.sheetOnlySkus.length}件
            </span>
          </div>

          {/* 詳細 */}
          {showDetails && (
            <div className="space-y-2 mt-3 pt-3 border-t">
              {diagnosis.duplicateSkus.length > 0 && (
                <div className="text-sm">
                  <span className="text-red-600 font-medium">⚠️ 重複SKU: </span>
                  <span className="text-gray-600">
                    {diagnosis.duplicateSkus.slice(0, 5).join(', ')}
                    {diagnosis.duplicateSkus.length > 5 && ` ...他${diagnosis.duplicateSkus.length - 5}件`}
                  </span>
                </div>
              )}
              {diagnosis.dbOnlySkus.length > 0 && (
                <div className="text-sm">
                  <span className="text-blue-600 font-medium">DBのみ: </span>
                  <span className="text-gray-600">
                    {diagnosis.dbOnlySkus.slice(0, 5).join(', ')}
                    {diagnosis.dbOnlySkus.length > 5 && ` ...他${diagnosis.dbOnlySkus.length - 5}件`}
                  </span>
                </div>
              )}
              {diagnosis.sheetOnlySkus.length > 0 && (
                <div className="text-sm">
                  <span className="text-green-600 font-medium">シートのみ: </span>
                  <span className="text-gray-600">
                    {diagnosis.sheetOnlySkus.slice(0, 5).join(', ')}
                    {diagnosis.sheetOnlySkus.length > 5 && ` ...他${diagnosis.sheetOnlySkus.length - 5}件`}
                  </span>
                </div>
              )}
              {diagnosis.deletedInDb > 0 && (
                <div className="text-sm">
                  <span className="text-gray-600 font-medium">削除済み（DB）: </span>
                  <span className="text-gray-600">{diagnosis.deletedInDb}件</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 最終同期結果 */}
      {status.lastResult && (
        <div className={`rounded-lg p-3 ${
          status.lastResult.success ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center gap-2">
            {status.lastResult.success ? (
              <CheckCircle className="text-green-600" size={16} />
            ) : (
              <AlertTriangle className="text-red-600" size={16} />
            )}
            <span className={`font-medium ${
              status.lastResult.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {status.lastAction === 'push' ? 'Push' : 'Pull'}: 
              {status.lastResult.rowsAffected}件を処理
            </span>
          </div>
          {status.lastResult.backupSheet && (
            <div className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <Shield size={12} />
              バックアップ: {status.lastResult.backupSheet}
            </div>
          )}
          {status.lastResult.errors.length > 0 && (
            <div className="text-sm text-red-600 mt-1">
              エラー: {status.lastResult.errors.slice(0, 3).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* 最終同期日時 */}
      {status.lastSyncAt && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={14} />
          最終同期: {status.lastSyncAt.toLocaleString('ja-JP')}
        </div>
      )}

      {/* バックアップオプション */}
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={createBackup}
          onChange={(e) => setCreateBackup(e.target.checked)}
          className="rounded border-gray-300"
        />
        <Shield size={14} className="text-gray-500" />
        Push前にバックアップを作成
      </label>

      {/* アクションボタン */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={runDiagnosis}
          disabled={status.isLoading}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {status.isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <RefreshCw size={16} />
          )}
          診断
        </button>
        
        <button
          onClick={runPush}
          disabled={status.isLoading}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {status.isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Upload size={16} />
          )}
          Push
        </button>
        
        <button
          onClick={runPull}
          disabled={status.isLoading}
          className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {status.isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Download size={16} />
          )}
          Pull
        </button>
      </div>

      {/* 説明 */}
      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 rounded-lg p-3">
        <div><strong>診断:</strong> DB とシートの件数・差分を確認</div>
        <div><strong>Push:</strong> DB → シート（UPSERT方式で差分更新）</div>
        <div><strong>Pull:</strong> シート → DB（編集可能カラムのみ更新）</div>
      </div>
    </div>
  );
}
