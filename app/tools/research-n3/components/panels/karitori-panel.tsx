// app/tools/research-n3/components/panels/karitori-panel.tsx
/**
 * カリトリ（価格監視） ツールパネル
 * 
 * 機能:
 * - 商品の価格監視登録
 * - 目標価格設定
 * - 価格下落アラート確認
 * - 自動チェック実行
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Bell, Eye, RefreshCw, Loader2, CheckCircle, AlertCircle,
  TrendingDown, DollarSign, Clock, Zap, Database,
} from 'lucide-react';
import { N3Button } from '@/components/n3';

interface KaritoriPanelProps {
  filter?: string;
  selectedCount?: number;
  selectedIds?: string[];
  onRefresh?: () => void;
}

interface AlertItem {
  id: string;
  asin: string;
  previousPrice: number;
  currentPrice: number;
  targetPrice: number;
  priceDrop: number;
  priceDropPercent: number;
}

interface CheckResult {
  success: boolean;
  checked?: number;
  alerts?: number;
  alertItems?: AlertItem[];
  error?: string;
  stats?: {
    avgPriceDrop: number;
    priceDropCount: number;
    priceRiseCount: number;
  };
  apiMode?: 'keepa' | 'mock';
}

interface WatchingStats {
  watching: number;
  alerts: number;
}

export default function KaritoriPanel({
  filter,
  selectedCount = 0,
  selectedIds = [],
  onRefresh,
}: KaritoriPanelProps) {
  const [targetPricePercent, setTargetPricePercent] = useState('20');
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [registerResult, setRegisterResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [watchingStats, setWatchingStats] = useState<WatchingStats>({ watching: 0, alerts: 0 });
  const [apiConfigured, setApiConfigured] = useState(false);
  
  // 監視統計取得
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/research-table/karitori-check');
      if (res.ok) {
        const data = await res.json();
        setWatchingStats(data.stats || { watching: 0, alerts: 0 });
        setApiConfigured(data.keepaConfigured || false);
      }
    } catch (e) {
      console.error('Failed to fetch karitori stats:', e);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  
  // 監視登録
  const handleRegister = useCallback(async () => {
    if (selectedIds.length === 0) {
      setRegisterResult({ success: false, error: '商品を選択してください' });
      return;
    }
    
    setIsRegistering(true);
    setRegisterResult(null);
    
    try {
      const response = await fetch('/api/research-table/karitori-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedIds,
          targetPricePercent: parseInt(targetPricePercent) || 20,
        }),
      });
      
      const data = await response.json();
      setRegisterResult(data);
      
      if (data.success) {
        fetchStats();
        onRefresh?.();
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'エラーが発生しました';
      setRegisterResult({ success: false, error: errorMessage });
    } finally {
      setIsRegistering(false);
    }
  }, [selectedIds, targetPricePercent, fetchStats, onRefresh]);
  
  // 価格チェック実行
  const handleCheck = useCallback(async () => {
    setIsChecking(true);
    setCheckResult(null);
    
    try {
      const response = await fetch('/api/research-table/karitori-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkAll: true }),
      });
      
      const data: CheckResult = await response.json();
      setCheckResult(data);
      
      if (data.success) {
        fetchStats();
        if ((data.alerts || 0) > 0) {
          onRefresh?.();
        }
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'エラーが発生しました';
      setCheckResult({ success: false, error: errorMessage });
    } finally {
      setIsChecking(false);
    }
  }, [fetchStats, onRefresh]);
  
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-[var(--n3-accent)]" />
            <span className="text-sm font-semibold">カリトリ監視</span>
          </div>
          
          {/* APIモード表示 */}
          <div className={`
            flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium
            ${apiConfigured 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-amber-100 text-amber-700'
            }
          `}>
            {apiConfigured ? (
              <><Zap size={10} />Keepa</>
            ) : (
              <><Database size={10} />Mock</>
            )}
          </div>
        </div>
        
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          価格下落を監視してアラート通知
        </p>
        
        {/* 監視統計 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="p-2 rounded bg-blue-50 border border-blue-200 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-700">
              <Eye size={12} />
              <span className="text-lg font-bold font-mono">{watchingStats.watching}</span>
            </div>
            <div className="text-[10px] text-blue-600">監視中</div>
          </div>
          <div className="p-2 rounded bg-red-50 border border-red-200 text-center">
            <div className="flex items-center justify-center gap-1 text-red-700">
              <Bell size={12} />
              <span className="text-lg font-bold font-mono">{watchingStats.alerts}</span>
            </div>
            <div className="text-[10px] text-red-600">アラート</div>
          </div>
        </div>
        
        {/* 価格チェック実行 */}
        <N3Button
          variant="primary"
          size="sm"
          icon={isChecking ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          className="w-full mb-2"
          onClick={handleCheck}
          disabled={isChecking || watchingStats.watching === 0}
        >
          {isChecking ? '価格チェック中...' : `${watchingStats.watching}件の価格をチェック`}
        </N3Button>
        
        {/* チェック結果 */}
        {checkResult && (
          <div className={`p-2 rounded text-xs ${
            checkResult.success 
              ? (checkResult.alerts || 0) > 0
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {checkResult.success ? (
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {(checkResult.alerts || 0) > 0 ? (
                    <><AlertCircle size={14} /><span className="font-semibold">🎉 {checkResult.alerts}件が目標価格到達！</span></>
                  ) : (
                    <><CheckCircle size={14} /><span>{checkResult.checked}件をチェック完了</span></>
                  )}
                </div>
                {checkResult.stats && (
                  <div className="text-[10px] space-y-0.5 mt-1">
                    <div>値下がり: {checkResult.stats.priceDropCount}件</div>
                    <div>値上がり: {checkResult.stats.priceRiseCount}件</div>
                    <div>平均変動: ¥{checkResult.stats.avgPriceDrop.toLocaleString()}</div>
                  </div>
                )}
              </div>
            ) : (
              <div>{checkResult.error}</div>
            )}
          </div>
        )}
      </div>
      
      {/* 新規登録セクション */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="text-xs font-semibold mb-2">📝 監視に登録</div>
        
        {selectedCount > 0 ? (
          <div className="text-xs text-[var(--n3-accent)] mb-2">
            {selectedCount}件選択中
          </div>
        ) : (
          <div className="text-xs text-[var(--n3-text-muted)] mb-2">
            テーブルで商品を選択してください
          </div>
        )}
        
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">
            <TrendingDown size={10} className="inline mr-1" />
            目標値下げ率 %
          </label>
          <input
            type="number"
            value={targetPricePercent}
            onChange={(e) => setTargetPricePercent(e.target.value)}
            placeholder="20"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
          <div className="text-[10px] text-[var(--n3-text-muted)] mt-1">
            現在価格から{targetPricePercent}%下がったらアラート
          </div>
        </div>
        
        {/* 登録結果 */}
        {registerResult && (
          <div className={`mb-2 p-2 rounded text-xs ${
            registerResult.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {registerResult.success 
              ? <><CheckCircle size={12} className="inline mr-1" />{registerResult.count}件を登録しました</>
              : <><AlertCircle size={12} className="inline mr-1" />{registerResult.error}</>
            }
          </div>
        )}
        
        <N3Button
          variant="secondary"
          size="sm"
          icon={isRegistering ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
          className="w-full"
          onClick={handleRegister}
          disabled={isRegistering || selectedCount === 0}
        >
          {isRegistering ? '登録中...' : '監視リストに追加'}
        </N3Button>
      </div>
      
      {/* アラート一覧 */}
      {checkResult?.alertItems && checkResult.alertItems.length > 0 && (
        <div className="p-3 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold mb-2">🔔 アラート商品</div>
          <div className="space-y-2">
            {checkResult.alertItems.map(item => (
              <div key={item.id} className="p-2 rounded bg-red-50 border border-red-200">
                <div className="text-xs font-mono text-red-800 mb-1">{item.asin}</div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="line-through text-slate-400">¥{item.previousPrice.toLocaleString()}</span>
                  <span className="text-red-600 font-bold">→ ¥{item.currentPrice.toLocaleString()}</span>
                  <span className="text-emerald-600">-{item.priceDropPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* ヒント */}
      <div className="p-3 border-t border-[var(--n3-panel-border)] mt-auto">
        <div className="text-[10px] text-[var(--n3-text-muted)]">
          <Clock size={10} className="inline mr-1" />
          自動チェックはCronジョブで定期実行できます
        </div>
      </div>
    </div>
  );
}
