// app/tools/editing-n3/components/l3-tabs/inventory-tool-panel.tsx
/**
 * 有在庫タブ用ツールパネル (Supusi同期 v5 - N3FeatureTooltip対応)
 */

'use client';

import React, { useState, useCallback } from 'react';
import { 
  RefreshCw, 
  Database, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  ImagePlus,
  AlertCircle,
  ExternalLink,
  Users,
  Ban,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUpToLine,
  ArrowDownToLine,
  ChevronDown,
} from 'lucide-react';
import { N3Button, N3Divider, N3FeatureTooltip } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/n3-stats-grid';
import { INVENTORY_TOOLTIPS } from '@/lib/tooltip-contents';
import type { InventoryStats } from '../../hooks';

interface InventoryToolPanelProps {
  stats: InventoryStats;
  loading: boolean;
  syncing: {
    mjt: boolean;
    green: boolean;
    incremental: boolean;
    mercari: boolean;
  };
  selectedCount: number;
  pendingCount: number;
  onSyncIncremental: (account: 'mjt' | 'green' | 'all') => void;
  onSyncFull: (account: 'mjt' | 'green' | 'all') => void;
  onSyncMercari: () => void;
  onRefresh: () => void;
  onBulkDelete: (target: 'out_of_stock' | 'sold' | 'selected') => void;
  onNewProduct: () => void;
  onBulkImageUpload: () => void;
  onImageAttach?: () => void;
}

type SupusiSyncStatus = 'idle' | 'testing' | 'pushing' | 'pulling' | 'success' | 'error';
type SheetType = 'stocktake' | 'master';

const SHEET_LABELS: Record<SheetType, string> = {
  stocktake: '全商品',
  master: 'マスター',
};

export function InventoryToolPanel({
  stats,
  loading,
  syncing,
  selectedCount,
  pendingCount,
  onSyncIncremental,
  onSyncFull,
  onSyncMercari,
  onRefresh,
  onBulkDelete,
  onNewProduct,
  onBulkImageUpload,
  onImageAttach,
}: InventoryToolPanelProps) {
  const anySyncing = syncing.mjt || syncing.green || syncing.incremental || syncing.mercari;
  
  // Supusi同期状態
  const [supusiStatus, setSupusiStatus] = useState<SupusiSyncStatus>('idle');
  const [supusiMessage, setSupusiMessage] = useState<string>('');
  const [supusiError, setSupusiError] = useState<string>('');
  const [selectedSheet, setSelectedSheet] = useState<SheetType>('stocktake');
  const [showSheetMenu, setShowSheetMenu] = useState(false);

  // Supusi接続テスト
  const handleSupusiTest = useCallback(async () => {
    setSupusiStatus('testing');
    setSupusiError('');
    setSupusiMessage('DB接続テスト中...');
    
    try {
      const res = await fetch('/api/sync/supusi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test', sheet: selectedSheet }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSupusiStatus('success');
        setSupusiMessage(data.message || '✅ 接続成功');
      } else {
        setSupusiStatus('error');
        setSupusiError(data.error || '接続失敗');
        setSupusiMessage('');
      }
    } catch (err: any) {
      setSupusiStatus('error');
      setSupusiError(err.message);
      setSupusiMessage('');
    }
  }, [selectedSheet]);

  // プッシュ（DB → シート）
  const handleSupusiPush = useCallback(async () => {
    setSupusiStatus('pushing');
    setSupusiError('');
    setSupusiMessage(`${SHEET_LABELS[selectedSheet]}シートにプッシュ中...`);
    
    try {
      const res = await fetch('/api/sync/supusi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push', sheet: selectedSheet }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSupusiStatus('success');
        setSupusiMessage(data.message || `✅ ${SHEET_LABELS[selectedSheet]}シートにプッシュしました`);
      } else {
        setSupusiStatus('error');
        setSupusiError(data.error || 'プッシュ失敗');
        if (data.hint) setSupusiMessage(data.hint);
      }
    } catch (err: any) {
      setSupusiStatus('error');
      setSupusiError(err.message);
    }
  }, [selectedSheet]);

  // プル（シート → DB）
  const handleSupusiPull = useCallback(async () => {
    if (!confirm(`${SHEET_LABELS[selectedSheet]}シートのデータをDBに反映しますか？\n（既存データが上書きされます）`)) {
      return;
    }
    
    setSupusiStatus('pulling');
    setSupusiError('');
    setSupusiMessage('DBにプル中...');
    
    try {
      const res = await fetch('/api/sync/supusi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pull', sheet: selectedSheet }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSupusiStatus('success');
        setSupusiMessage(data.message || '✅ DBに反映しました');
        onRefresh();
      } else {
        setSupusiStatus('error');
        setSupusiError(data.error || 'プル失敗');
        if (data.hint) setSupusiMessage(data.hint);
      }
    } catch (err: any) {
      setSupusiStatus('error');
      setSupusiError(err.message);
    }
  }, [selectedSheet, onRefresh]);

  // シートを開く
  const handleOpenSheet = useCallback(() => {
    const sheetParam = selectedSheet === 'master' ? '#gid=0' : '';
    window.open(`https://docs.google.com/spreadsheets/d/1lD9ESIhv2oTE6sgL172wOOF9fJAcIy0SHrdhkLNw3MM/edit${sheetParam}`, '_blank');
  }, [selectedSheet]);

  // 削除ハンドラ
  const handleDeleteSelected = () => {
    if (selectedCount === 0) return;
    if (confirm(`${selectedCount}件の商品を削除しますか？\nこの操作は取り消せません。`)) {
      onBulkDelete('selected');
    }
  };

  const handleDeleteOutOfStock = () => {
    if (confirm('在庫数が0の商品をすべて削除しますか？')) {
      onBulkDelete('out_of_stock');
    }
  };

  const isSupusiBusy = supusiStatus === 'testing' || supusiStatus === 'pushing' || supusiStatus === 'pulling';

  return (
    <div style={{ padding: '8px 12px' }}>
      {/* ツールバー行 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 12,
      }}>
        {/* eBay同期ボタングループ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <N3FeatureTooltip
            title={INVENTORY_TOOLTIPS.syncIncremental.title}
            description={INVENTORY_TOOLTIPS.syncIncremental.description}
            hint={INVENTORY_TOOLTIPS.syncIncremental.hint}
            position="bottom"
          >
            <span>
              <N3Button
                size="sm"
                variant="primary"
                onClick={() => onSyncIncremental('all')}
                disabled={anySyncing || loading}
                loading={syncing.incremental}
              >
                <RefreshCw size={14} />
                差分同期
              </N3Button>
            </span>
          </N3FeatureTooltip>
          
          <N3Divider orientation="vertical" style={{ height: 20 }} />
          
          <N3FeatureTooltip
            title={INVENTORY_TOOLTIPS.syncFull.title}
            description={INVENTORY_TOOLTIPS.syncFull.description}
            hint={INVENTORY_TOOLTIPS.syncFull.hint}
            position="bottom"
          >
            <span>
              <N3Button
                size="sm"
                variant="secondary"
                onClick={() => onSyncFull('mjt')}
                disabled={anySyncing || loading}
                loading={syncing.mjt}
                style={{ 
                  borderColor: 'rgba(59, 130, 246, 0.5)',
                  color: 'rgb(59, 130, 246)',
                }}
              >
                MJT
              </N3Button>
            </span>
          </N3FeatureTooltip>
          
          <N3FeatureTooltip
            title={INVENTORY_TOOLTIPS.syncFull.title}
            description={INVENTORY_TOOLTIPS.syncFull.description}
            hint={INVENTORY_TOOLTIPS.syncFull.hint}
            position="bottom"
          >
            <span>
              <N3Button
                size="sm"
                variant="secondary"
                onClick={() => onSyncFull('green')}
                disabled={anySyncing || loading}
                loading={syncing.green}
                style={{ 
                  borderColor: 'rgba(34, 197, 94, 0.5)',
                  color: 'rgb(34, 197, 94)',
                }}
              >
                GREEN
              </N3Button>
            </span>
          </N3FeatureTooltip>
          
          <N3FeatureTooltip
            title={INVENTORY_TOOLTIPS.syncMercari.title}
            description={INVENTORY_TOOLTIPS.syncMercari.description}
            position="bottom"
          >
            <span>
              <N3Button
                size="sm"
                variant="secondary"
                onClick={onSyncMercari}
                disabled={anySyncing || loading}
                loading={syncing.mercari}
                style={{ 
                  borderColor: 'rgba(239, 68, 68, 0.5)',
                  color: 'rgb(239, 68, 68)',
                }}
              >
                メルカリ
              </N3Button>
            </span>
          </N3FeatureTooltip>
        </div>

        <N3Divider orientation="vertical" style={{ height: 20 }} />

        {/* Supusi（スプレッドシート）ボタングループ */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          padding: '4px 10px',
          background: 'rgba(16, 185, 129, 0.08)',
          borderRadius: 6,
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}>
          <FileSpreadsheet size={14} style={{ color: '#10b981' }} />
          
          {/* シート選択ドロップダウン */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowSheetMenu(!showSheetMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 4,
                border: '1px solid rgba(16, 185, 129, 0.3)',
                background: 'rgba(16, 185, 129, 0.1)',
                cursor: 'pointer',
                color: '#10b981',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              {SHEET_LABELS[selectedSheet]}
              <ChevronDown size={12} />
            </button>
            
            {showSheetMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 4,
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 100,
                minWidth: 100,
              }}>
                {(['stocktake', 'master'] as SheetType[]).map((sheet) => (
                  <button
                    key={sheet}
                    onClick={() => {
                      setSelectedSheet(sheet);
                      setShowSheetMenu(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: selectedSheet === sheet ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 12,
                      color: selectedSheet === sheet ? '#10b981' : 'var(--text-primary)',
                    }}
                  >
                    {SHEET_LABELS[sheet]}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 接続テスト */}
          <N3FeatureTooltip
            title="DB接続テスト"
            description="スプレッドシートとの接続状態を確認します。"
            position="bottom"
          >
            <button
              onClick={handleSupusiTest}
              disabled={isSupusiBusy}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 4,
                border: '1px solid rgba(16, 185, 129, 0.3)',
                background: supusiStatus === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                cursor: isSupusiBusy ? 'not-allowed' : 'pointer',
                color: supusiStatus === 'error' ? '#ef4444' : '#10b981',
                opacity: isSupusiBusy ? 0.5 : 1,
              }}
            >
              {supusiStatus === 'testing' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : supusiStatus === 'success' ? (
                <CheckCircle size={14} />
              ) : supusiStatus === 'error' ? (
                <XCircle size={14} />
              ) : (
                <RefreshCw size={14} />
              )}
            </button>
          </N3FeatureTooltip>
          
          {/* プッシュ（DB → シート） */}
          <N3FeatureTooltip
            title="Push（DB → シート）"
            description={`DBの内容を「${SHEET_LABELS[selectedSheet]}」シートに書き出します。`}
            hint="シートが上書きされます"
            position="bottom"
          >
            <button
              onClick={handleSupusiPush}
              disabled={isSupusiBusy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                height: 26,
                padding: '0 8px',
                borderRadius: 4,
                border: '1px solid rgba(16, 185, 129, 0.3)',
                background: supusiStatus === 'pushing' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                cursor: isSupusiBusy ? 'not-allowed' : 'pointer',
                color: '#10b981',
                fontSize: 11,
                fontWeight: 500,
                opacity: isSupusiBusy ? 0.5 : 1,
              }}
            >
              {supusiStatus === 'pushing' ? <Loader2 size={12} className="animate-spin" /> : <ArrowUpToLine size={12} />}
              Push
            </button>
          </N3FeatureTooltip>
          
          {/* プル（シート → DB） */}
          <N3FeatureTooltip
            title="Pull（シート → DB）"
            description={`「${SHEET_LABELS[selectedSheet]}」シートの変更をDBに反映します。`}
            hint="UIに即座に反映されます"
            position="bottom"
          >
            <button
              onClick={handleSupusiPull}
              disabled={isSupusiBusy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                height: 26,
                padding: '0 8px',
                borderRadius: 4,
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: supusiStatus === 'pulling' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                cursor: isSupusiBusy ? 'not-allowed' : 'pointer',
                color: '#3b82f6',
                fontSize: 11,
                fontWeight: 500,
                opacity: isSupusiBusy ? 0.5 : 1,
              }}
            >
              {supusiStatus === 'pulling' ? <Loader2 size={12} className="animate-spin" /> : <ArrowDownToLine size={12} />}
              Pull
            </button>
          </N3FeatureTooltip>
          
          {/* シートを開く */}
          <N3FeatureTooltip
            title="シートを開く"
            description={`${SHEET_LABELS[selectedSheet]}シートを新しいタブで開きます。`}
            position="bottom"
          >
            <button
              onClick={handleOpenSheet}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 26,
                height: 26,
                borderRadius: 4,
                border: '1px solid rgba(16, 185, 129, 0.3)',
                background: 'rgba(16, 185, 129, 0.1)',
                cursor: 'pointer',
                color: '#10b981',
              }}
            >
              <ExternalLink size={12} />
            </button>
          </N3FeatureTooltip>
        </div>

        <N3Divider orientation="vertical" style={{ height: 20 }} />

        {/* アクションボタングループ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <N3FeatureTooltip
            title={INVENTORY_TOOLTIPS.newProduct.title}
            description={INVENTORY_TOOLTIPS.newProduct.description}
            hint={INVENTORY_TOOLTIPS.newProduct.hint}
            position="bottom"
          >
            <span>
              <N3Button size="sm" variant="ghost" onClick={onNewProduct}>
                <Plus size={14} />
                新規
              </N3Button>
            </span>
          </N3FeatureTooltip>
          
          <N3FeatureTooltip
            title={INVENTORY_TOOLTIPS.bulkImageUpload.title}
            description={INVENTORY_TOOLTIPS.bulkImageUpload.description}
            hint={INVENTORY_TOOLTIPS.bulkImageUpload.hint}
            position="bottom"
          >
            <span>
              <N3Button size="sm" variant="ghost" onClick={onBulkImageUpload}>
                <ImageIcon size={14} />
                画像
              </N3Button>
            </span>
          </N3FeatureTooltip>
          
          {/* 画像なし商品への画像追加 */}
          {onImageAttach && (
            <N3FeatureTooltip
              title="画像追加"
              description="画像なし商品に画像を追加します。"
              position="bottom"
            >
              <span>
                <N3Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={onImageAttach}
                  style={{ 
                    color: '#f59e0b',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <ImagePlus size={14} />
                  画像追加
                </N3Button>
              </span>
            </N3FeatureTooltip>
          )}
          
          <N3FeatureTooltip
            title="データ更新"
            description="データベースから最新のデータを再取得します。"
            position="bottom"
          >
            <span>
              <N3Button size="sm" variant="ghost" onClick={onRefresh} disabled={loading} loading={loading}>
                <Database size={14} />
                更新
              </N3Button>
            </span>
          </N3FeatureTooltip>
          
          <N3Divider orientation="vertical" style={{ height: 20 }} />
          
          <N3FeatureTooltip
            title="選択削除"
            description="選択した商品をデータベースから削除します。"
            hint="削除は取り消せません"
            position="bottom"
          >
            <span>
              <N3Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteSelected}
                disabled={loading || selectedCount === 0}
                style={{ color: 'var(--color-error)' }}
              >
                <Trash2 size={14} />
                削除 ({selectedCount})
              </N3Button>
            </span>
          </N3FeatureTooltip>

          <N3FeatureTooltip
            title="在庫0削除"
            description="在庫数が0の商品をすべて一括削除します。"
            hint="売切れ商品の整理に使用"
            position="bottom"
          >
            <span>
              <N3Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteOutOfStock}
                disabled={loading}
                style={{ color: 'var(--text-muted)' }}
              >
                <Ban size={14} />
                在庫0削除
              </N3Button>
            </span>
          </N3FeatureTooltip>
        </div>

        {/* 外注ツールリンク */}
        <N3Divider orientation="vertical" style={{ height: 20 }} />
        
        <N3FeatureTooltip
          title="外注ツール"
          description="外注スタッフ用の棚卸しツールを開きます。"
          hint="バーコードスキャン対応"
          position="bottom"
        >
          <a
            href="/stocktake-plus1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 500,
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              borderRadius: 6,
              textDecoration: 'none',
            }}
          >
            <Users size={14} />
            外注ツール
            <ExternalLink size={12} />
          </a>
        </N3FeatureTooltip>

        {/* 分類待ちバッジ */}
        {pendingCount > 0 && (
          <div style={{ 
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 8px',
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: 4,
            fontSize: 11,
            color: 'rgb(245, 158, 11)',
          }}>
            <AlertCircle size={12} />
            分類待ち: {pendingCount}件
          </div>
        )}
      </div>

      {/* Supusiステータス表示 */}
      {(supusiMessage || supusiError) && (
        <div style={{
          marginBottom: 12,
          padding: '10px 14px',
          borderRadius: 6,
          fontSize: 12,
          background: supusiError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          border: `1px solid ${supusiError ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          color: supusiError ? '#ef4444' : '#10b981',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
        }}>
          {supusiError ? <XCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <CheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
          <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
            {supusiError && <div style={{ fontWeight: 600, marginBottom: 4 }}>❌ {supusiError}</div>}
            {supusiMessage}
          </div>
          <button
            onClick={() => { setSupusiMessage(''); setSupusiError(''); setSupusiStatus('idle'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'inherit', opacity: 0.6 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 統計行 */}
      <N3StatsGrid columns={6} gap={8} size="compact">
        <N3StatItem label="総数" value={stats.totalCount} color="default" />
        <N3StatItem label="在庫あり" value={stats.inStockCount} color="green" />
        <N3StatItem label="MJT" value={stats.mjtCount} color="blue" />
        <N3StatItem label="GREEN" value={stats.greenCount} color="green" />
        <N3StatItem label="総原価" value={`¥${stats.totalCostJpy.toLocaleString()}`} color="yellow" />
        <N3StatItem label="V候補" value={stats.variationCandidateCount} color="purple" />
      </N3StatsGrid>
    </div>
  );
}
