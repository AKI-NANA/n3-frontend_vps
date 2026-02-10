// app/tools/bookkeeping-n3/components/rules-management-panel.tsx
/**
 * ルール管理パネル
 * - ルール一覧表示（Excel風テーブル）
 * - スプレッドシートからインポート
 * - CSVアップロード
 * - 個別/一括削除
 */

'use client';

import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from 'react';
import { 
  RefreshCw, 
  Upload, 
  Search, 
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  AlertCircle,
  Trash2,
} from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface BookkeepingRule {
  id: string;
  keyword: string;
  match_type: string;
  match_source: string;
  priority: number;
  target_category: string;
  target_sub_category: string;
  tax_code: string;
  credit_account: string;
  credit_sub_account: string;
  credit_tax_code: string;
  applied_count: number;
  ai_confidence_score: number | null;
  status: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// 定数
// ============================================================

const DEFAULT_SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/14c0kwE-jhrMkqhRe96XcR78Y5XOQH0o7qsJfRBcmM80/edit';

// ============================================================
// メインコンポーネント
// ============================================================

export const RulesManagementPanel = memo(function RulesManagementPanel() {
  const [rules, setRules] = useState<BookkeepingRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [pageSize, setPageSize] = useState(500);
  
  // 選択関連
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // 削除関連
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'all' | 'selected'>('all');
  const [deleting, setDeleting] = useState(false);
  
  // インポート関連
  const [showImportModal, setShowImportModal] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState(DEFAULT_SPREADSHEET_URL);
  const [sheetName, setSheetName] = useState('統合ルール');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  
  // CSV関連
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvUploading, setCsvUploading] = useState(false);
  
  // ルール読み込み
  const loadRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bookkeeping-n3/rules');
      const data = await response.json();
      
      if (data.success) {
        setRules(data.data.rules || []);
      } else {
        setError(data.error || 'ルールの読み込みに失敗しました');
      }
    } catch (err) {
      setError('ルールの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    loadRules();
  }, [loadRules]);
  
  // フィルター（useMemoで先に定義）
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = searchQuery === '' || 
        rule.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rule.target_category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSource = filterSource === 'all' || rule.match_source === filterSource;
      return matchesSearch && matchesSource;
    }).slice(0, pageSize);
  }, [rules, searchQuery, filterSource, pageSize]);
  
  // 統計
  const stats = useMemo(() => ({
    total: rules.length,
    bySource: {
      '借方補助科目': rules.filter(r => r.match_source === '借方補助科目').length,
      '貸方補助科目': rules.filter(r => r.match_source === '貸方補助科目').length,
      '摘要': rules.filter(r => r.match_source === '摘要').length,
      'メモ': rules.filter(r => r.match_source === 'メモ').length,
    },
    highConfidence: rules.filter(r => (r.ai_confidence_score || 0) >= 0.9).length,
  }), [rules]);
  
  // 全ルール削除
  const handleDeleteAll = useCallback(async () => {
    setDeleting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/bookkeeping-n3/rules/delete-all?confirm=yes', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowDeleteConfirm(false);
        setSelectedIds(new Set());
        await loadRules();
      } else {
        setError(data.error || '削除に失敗しました');
      }
    } catch (err) {
      setError('削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  }, [loadRules]);
  
  // 選択したルールを削除
  const handleDeleteSelected = useCallback(async () => {
    if (selectedIds.size === 0) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      for (const id of selectedIds) {
        await fetch(`/api/bookkeeping-n3/rules?rule_id=${id}`, {
          method: 'DELETE',
        });
      }
      
      setSelectedIds(new Set());
      setShowDeleteConfirm(false);
      await loadRules();
    } catch (err) {
      setError('削除に失敗しました');
    } finally {
      setDeleting(false);
    }
  }, [selectedIds, loadRules]);
  
  // 個別ルール削除
  const handleDeleteOne = useCallback(async (id: string) => {
    try {
      await fetch(`/api/bookkeeping-n3/rules?rule_id=${id}`, {
        method: 'DELETE',
      });
      await loadRules();
    } catch (err) {
      setError('削除に失敗しました');
    }
  }, [loadRules]);
  
  // チェックボックストグル
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  // 全選択/全解除
  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredRules.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRules.map(r => r.id)));
    }
  }, [filteredRules, selectedIds.size]);
  
  // スプレッドシートからインポート
  const handleImportFromSheet = useCallback(async () => {
    if (!spreadsheetUrl) {
      setError('スプレッドシートURLを入力してください');
      return;
    }
    
    setImporting(true);
    setImportResult(null);
    setError(null);
    
    try {
      const response = await fetch('/api/bookkeeping-n3/rules/import-from-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spreadsheet_url: spreadsheetUrl,
          sheet_name: sheetName,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImportResult(data.data);
        await loadRules();
      } else {
        setError(data.error || 'インポートに失敗しました');
      }
    } catch (err) {
      setError('インポートに失敗しました');
    } finally {
      setImporting(false);
    }
  }, [spreadsheetUrl, sheetName, loadRules]);
  
  // CSVアップロード
  const handleCsvUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setCsvUploading(true);
    setError(null);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      
      if (lines.length < 2) {
        setError('CSVにデータがありません');
        return;
      }
      
      const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
      
      const csvRules = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
        if (!values[0] || values[0].includes('統計')) continue;
        
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
        
        csvRules.push({
          keyword: row['キーワード'] || row['主キーワード'] || '',
          match_source: row['抽出元'] || '摘要',
          priority: parseInt(row['優先度']) || 100,
          debit_account: row['借方勘定科目'] || '',
          debit_sub_account: row['借方補助科目'] || '',
          debit_tax_code: row['借方税区分'] || '',
          credit_account: row['貸方勘定科目'] || '',
          credit_sub_account: row['貸方補助科目'] || '',
          credit_tax_code: row['貸方税区分'] || '',
          applied_count: parseInt(row['出現回数'] || row['総出現回数']) || 0,
          confidence_score: (parseInt(row['信頼度(%)'] || row['最高信頼度(%)'] || row['信頼度']) || 0) / 100,
        });
      }
      
      const response = await fetch('/api/bookkeeping-n3/rules/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules: csvRules, spreadsheet_id: 'csv_upload' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImportResult(data.data);
        await loadRules();
      } else {
        setError(data.error || 'CSVインポートに失敗');
      }
    } catch (err) {
      setError('CSVの読み込みに失敗しました');
    } finally {
      setCsvUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [loadRules]);
  
  // 削除確認を開く
  const openDeleteConfirm = useCallback((mode: 'all' | 'selected') => {
    setDeleteMode(mode);
    setShowDeleteConfirm(true);
  }, []);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      {/* ツールバー */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '8px 16px',
        borderBottom: '1px solid var(--panel-border)',
        background: 'var(--panel)',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* 検索 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6,
            padding: '4px 10px',
            background: 'var(--highlight)',
            borderRadius: 4,
            border: '1px solid var(--panel-border)',
          }}>
            <Search size={12} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワード検索..."
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: 11,
                color: 'var(--text)',
                outline: 'none',
                width: 120,
              }}
            />
          </div>
          
          {/* フィルター */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
            }}
          >
            <option value="all">全ソース</option>
            <option value="借方補助科目">借方補助科目</option>
            <option value="貸方補助科目">貸方補助科目</option>
            <option value="摘要">摘要</option>
            <option value="メモ">メモ</option>
          </select>
          
          {/* 表示件数 */}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              background: 'var(--panel)',
              color: 'var(--text)',
            }}
          >
            <option value={100}>100件</option>
            <option value={300}>300件</option>
            <option value={500}>500件</option>
            <option value={1000}>1000件</option>
            <option value={9999}>全件</option>
          </select>
          
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {filteredRules.length} / {stats.total} 件
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {/* 選択削除 */}
          {selectedIds.size > 0 && (
            <button
              onClick={() => openDeleteConfirm('selected')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                fontSize: 11,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 4,
                color: 'var(--error)',
                cursor: 'pointer',
              }}
            >
              <Trash2 size={12} />
              <span>{selectedIds.size}件削除</span>
            </button>
          )}
          
          {/* 全削除 */}
          {rules.length > 0 && selectedIds.size === 0 && (
            <button
              onClick={() => openDeleteConfirm('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                fontSize: 11,
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 4,
                color: 'var(--error)',
                cursor: 'pointer',
              }}
            >
              <XCircle size={12} />
              <span>全削除</span>
            </button>
          )}
          
          {/* スプレッドシートからインポート */}
          <button
            onClick={() => setShowImportModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              fontSize: 11,
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.3))',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: 4,
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <FileSpreadsheet size={12} />
            <span>シートからインポート</span>
          </button>
          
          {/* CSVアップロード */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={csvUploading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              fontSize: 11,
              background: 'var(--highlight)',
              border: '1px solid var(--panel-border)',
              borderRadius: 4,
              color: 'var(--text)',
              cursor: 'pointer',
            }}
          >
            <Upload size={12} />
            <span>{csvUploading ? '...' : 'CSV'}</span>
          </button>
          
          {/* 更新 */}
          <button
            onClick={loadRules}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              fontSize: 11,
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 4,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      {/* 統計バー */}
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        padding: '6px 16px',
        borderBottom: '1px solid var(--panel-border)',
        background: 'var(--highlight)',
        fontSize: 10,
        flexWrap: 'wrap',
      }}>
        {Object.entries(stats.bySource).map(([source, count]) => (
          <div key={source} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ color: 'var(--text-muted)' }}>{source}:</span>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{count}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: 'var(--text-muted)' }}>高信頼:</span>
          <span style={{ fontWeight: 600, color: 'var(--success)' }}>{stats.highConfidence}</span>
        </div>
      </div>
      
      {/* エラー/結果表示 */}
      {error && (
        <div style={{ 
          padding: '8px 16px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          color: 'var(--error)',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {importResult && (
        <div style={{ 
          padding: '8px 16px', 
          background: 'rgba(34, 197, 94, 0.1)', 
          color: 'var(--success)',
          fontSize: 11,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <CheckCircle size={14} />
          インポート完了: {importResult.total}件 - 新規{importResult.inserted} / 更新{importResult.updated} / スキップ{importResult.skipped}
        </div>
      )}
      
      {/* テーブル */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 10 }}>
          <thead>
            <tr style={{ background: 'var(--panel)', position: 'sticky', top: 0, zIndex: 10 }}>
              <th style={{ ...thStyle, width: 30 }}>
                <input
                  type="checkbox"
                  checked={filteredRules.length > 0 && selectedIds.size === filteredRules.length}
                  onChange={toggleSelectAll}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th style={{ ...thStyle, width: 35 }}>#</th>
              <th style={thStyle}>キーワード</th>
              <th style={thStyle}>ソース</th>
              <th style={{ ...thStyle, width: 40 }}>優先</th>
              <th style={thStyle}>借方科目</th>
              <th style={thStyle}>借方補助</th>
              <th style={thStyle}>借方税</th>
              <th style={thStyle}>貸方科目</th>
              <th style={thStyle}>貸方補助</th>
              <th style={thStyle}>貸方税</th>
              <th style={{ ...thStyle, width: 40 }}>回数</th>
              <th style={{ ...thStyle, width: 40 }}>信頼</th>
              <th style={{ ...thStyle, width: 35 }}></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={12} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  読み込み中...
                </td>
              </tr>
            ) : filteredRules.length === 0 ? (
              <tr>
                <td colSpan={14} style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ marginBottom: 12 }}>ルールがありません</div>
                  <button
                    onClick={() => setShowImportModal(true)}
                    style={{
                      padding: '8px 16px',
                      fontSize: 11,
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    スプレッドシートからインポート
                  </button>
                </td>
              </tr>
            ) : (
              filteredRules.map((rule, index) => (
                <tr 
                  key={rule.id}
                  style={{ 
                    background: selectedIds.has(rule.id) 
                      ? 'rgba(59, 130, 246, 0.1)' 
                      : index % 2 === 0 ? 'var(--bg)' : 'var(--highlight)',
                  }}
                >
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(rule.id)}
                      onChange={() => toggleSelect(rule.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', fontSize: 9 }}>
                    {index + 1}
                  </td>
                  <td style={tdStyle}>{rule.keyword}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '1px 4px',
                      borderRadius: 3,
                      fontSize: 9,
                      background: getSourceColor(rule.match_source),
                      color: 'white',
                    }}>
                      {rule.match_source}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{rule.priority}</td>
                  <td style={tdStyle}>{rule.target_category}</td>
                  <td style={tdStyle}>{rule.target_sub_category}</td>
                  <td style={tdStyle}>{rule.tax_code}</td>
                  <td style={tdStyle}>{rule.credit_account}</td>
                  <td style={tdStyle}>{rule.credit_sub_account}</td>
                  <td style={tdStyle}>{rule.credit_tax_code}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{rule.applied_count}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    {rule.ai_confidence_score ? `${Math.round(rule.ai_confidence_score * 100)}%` : '-'}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteOne(rule.id)}
                      style={{
                        padding: '2px 4px',
                        fontSize: 9,
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--error)',
                        cursor: 'pointer',
                        opacity: 0.6,
                      }}
                      title="削除"
                    >
                      <Trash2 size={12} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* インポートモーダル */}
      {showImportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 500,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>
              スプレッドシートからインポート
            </h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-muted)' }}>
                スプレッドシートURL
              </label>
              <input
                type="text"
                value={spreadsheetUrl}
                onChange={(e) => setSpreadsheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 12,
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, marginBottom: 6, color: 'var(--text-muted)' }}>
                シート名
              </label>
              <select
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  fontSize: 12,
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                }}
              >
                <option value="統合ルール">統合ルール（推奨）</option>
                <option value="個別ルール">個別ルール</option>
              </select>
            </div>
            
            <div style={{ 
              padding: 12, 
              background: 'rgba(245, 158, 11, 0.1)', 
              borderRadius: 6,
              marginBottom: 16,
              fontSize: 11,
              color: 'var(--warning)',
            }}>
              ⚠️ スプレッドシートを「リンクを知っている全員が閲覧可」に設定してください
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => { setShowImportModal(false); setError(null); setImportResult(null); }}
                style={{
                  padding: '10px 20px',
                  fontSize: 12,
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleImportFromSheet}
                disabled={importing}
                style={{
                  padding: '10px 20px',
                  fontSize: 12,
                  background: 'var(--accent)',
                  border: 'none',
                  borderRadius: 6,
                  color: 'white',
                  cursor: 'pointer',
                  opacity: importing ? 0.7 : 1,
                }}
              >
                {importing ? 'インポート中...' : 'インポート実行'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 削除確認モーダル */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--panel)',
            borderRadius: 12,
            padding: 24,
            width: '90%',
            maxWidth: 400,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: 'var(--error)' }}>
              {deleteMode === 'all' ? '全ルール削除' : '選択ルール削除'}
            </h3>
            
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text)' }}>
              {deleteMode === 'all' 
                ? `${rules.length}件のルールをすべて削除します。`
                : `${selectedIds.size}件の選択したルールを削除します。`
              }
              この操作は取り消せません。
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '10px 20px',
                  fontSize: 12,
                  background: 'var(--highlight)',
                  border: '1px solid var(--panel-border)',
                  borderRadius: 6,
                  color: 'var(--text)',
                  cursor: 'pointer',
                }}
              >
                キャンセル
              </button>
              <button
                onClick={deleteMode === 'all' ? handleDeleteAll : handleDeleteSelected}
                disabled={deleting}
                style={{
                  padding: '10px 20px',
                  fontSize: 12,
                  background: 'var(--error)',
                  border: 'none',
                  borderRadius: 6,
                  color: 'white',
                  cursor: 'pointer',
                  opacity: deleting ? 0.7 : 1,
                }}
              >
                {deleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

// スタイル
const thStyle: React.CSSProperties = {
  padding: '6px 8px',
  textAlign: 'left',
  fontWeight: 600,
  color: 'var(--text-muted)',
  borderBottom: '2px solid var(--panel-border)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '5px 8px',
  borderBottom: '1px solid var(--panel-border)',
  color: 'var(--text)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 120,
};

function getSourceColor(source: string): string {
  switch (source) {
    case '借方補助科目': return 'rgba(59, 130, 246, 0.8)';
    case '貸方補助科目': return 'rgba(34, 197, 94, 0.8)';
    case '摘要': return 'rgba(168, 85, 247, 0.8)';
    case 'メモ': return 'rgba(245, 158, 11, 0.8)';
    default: return 'rgba(107, 114, 128, 0.8)';
  }
}

export default RulesManagementPanel;
