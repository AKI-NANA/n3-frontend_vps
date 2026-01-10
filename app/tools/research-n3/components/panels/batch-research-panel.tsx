// app/tools/research-n3/components/panels/batch-research-panel.tsx
/**
 * バッチリサーチ ツールパネル
 * 
 * 機能:
 * - Amazon ASIN一括リサーチ（Keepa API / PA-API / Mock）
 * - eBayセラーID一括リサーチ
 * - ジョブ管理・進捗表示
 * - APIモード表示・選択
 * - トークン残量モニタリング
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Package, Play, Loader2, CheckCircle, AlertCircle,
  RefreshCw, Database, Zap, Globe, Settings,
} from 'lucide-react';
import { N3Button } from '@/components/n3';

interface BatchResearchPanelProps {
  filter?: string;
  selectedCount?: number;
  onRefresh?: () => void;
}

type JobType = 'amazon_asin' | 'ebay_seller' | 'keyword';
type Marketplace = 'jp' | 'us' | 'uk' | 'de' | 'fr' | 'it' | 'es' | 'ca';
type ApiChoice = 'auto' | 'keepa' | 'paapi';

interface JobResult {
  success: boolean;
  total?: number;
  skipped?: number;
  filtered?: number;
  invalidProducts?: number;
  error?: string;
  message?: string;
  stats?: {
    avgScore: number;
    avgProfitMargin: number;
    highScoreCount: number;
  };
  apiMode?: 'keepa' | 'paapi' | 'mock';
  tokensUsed?: number;
  tokensLeft?: number;
}

interface ApiStatus {
  keepaConfigured: boolean;
  paapiConfigured: boolean;
  activeApi: 'keepa' | 'paapi' | 'mock';
  supportedMarketplaces: string[];
  features: {
    priceHistory: boolean;
    monthlySales: boolean;
    bsr: boolean;
    category: boolean;
    reviews: boolean;
  };
}

const MARKETPLACE_LABELS: Record<Marketplace, string> = {
  jp: '🇯🇵 Japan',
  us: '🇺🇸 USA',
  uk: '🇬🇧 UK',
  de: '🇩🇪 Germany',
  fr: '🇫🇷 France',
  it: '🇮🇹 Italy',
  es: '🇪🇸 Spain',
  ca: '🇨🇦 Canada',
};

const API_LABELS: Record<string, { label: string; color: string }> = {
  keepa: { label: 'Keepa', color: 'bg-emerald-100 text-emerald-700' },
  paapi: { label: 'PA-API', color: 'bg-blue-100 text-blue-700' },
  mock: { label: 'Mock', color: 'bg-amber-100 text-amber-700' },
};

export default function BatchResearchPanel({
  filter,
  selectedCount = 0,
  onRefresh,
}: BatchResearchPanelProps) {
  // State
  const [jobName, setJobName] = useState('');
  const [jobType, setJobType] = useState<JobType>('amazon_asin');
  const [inputData, setInputData] = useState('');
  const [minProfitMargin, setMinProfitMargin] = useState('20');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [marketplace, setMarketplace] = useState<Marketplace>('jp');
  const [apiChoice, setApiChoice] = useState<ApiChoice>('auto');
  
  // API状態
  const [apiStatus, setApiStatus] = useState<ApiStatus | null>(null);
  const [tokensLeft, setTokensLeft] = useState<number | undefined>();
  
  // 実行状態
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 統計
  const [completedCount, setCompletedCount] = useState(0);
  const [sessionTokensUsed, setSessionTokensUsed] = useState(0);
  
  // API状態チェック
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const res = await fetch('/api/research-table/amazon-batch');
        if (res.ok) {
          const data = await res.json();
          setApiStatus({
            keepaConfigured: data.keepaConfigured || false,
            paapiConfigured: data.paapiConfigured || false,
            activeApi: data.activeApi || 'mock',
            supportedMarketplaces: data.supportedMarketplaces || [],
            features: data.features || {
              priceHistory: false,
              monthlySales: false,
              bsr: false,
              category: false,
              reviews: false,
            },
          });
        }
      } catch (e) {
        console.error('API status check failed:', e);
      }
    };
    checkApiStatus();
  }, []);
  
  // ジョブ実行
  const handleRunJob = useCallback(async () => {
    if (!inputData.trim()) {
      setError('データを入力してください');
      return;
    }
    
    setIsRunning(true);
    setResult(null);
    setError(null);
    
    try {
      let endpoint = '';
      let body: Record<string, unknown> = {};
      
      if (jobType === 'amazon_asin') {
        const asins = inputData
          .split(/[\n,\s]+/)
          .map(s => s.trim())
          .filter(s => /^[A-Z0-9]{10}$/.test(s.toUpperCase()));
        
        if (asins.length === 0) {
          setError('有効なASINが見つかりません（10文字の英数字）');
          setIsRunning(false);
          return;
        }
        
        endpoint = '/api/research-table/amazon-batch';
        body = {
          asins,
          jobName: jobName || `Batch ${new Date().toLocaleString('ja-JP')}`,
          minProfitMargin: parseInt(minProfitMargin) || 20,
          targetMarketplace: marketplace,
          estimatedSellingPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined,
          forceApi: apiChoice,
        };
        
      } else if (jobType === 'ebay_seller') {
        const sellerIds = inputData
          .split(/[\n,\s]+/)
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        if (sellerIds.length === 0) {
          setError('セラーIDを入力してください');
          setIsRunning(false);
          return;
        }
        
        endpoint = '/api/research-table/ebay-seller-batch';
        body = {
          sellerIds,
          jobName: jobName || `Seller Batch ${new Date().toLocaleString('ja-JP')}`,
          minProfitMargin: parseInt(minProfitMargin) || 15,
        };
        
      } else if (jobType === 'keyword') {
        const keywords = inputData
          .split('\n')
          .map(s => s.trim())
          .filter(s => s.length > 0);
        
        if (keywords.length === 0) {
          setError('キーワードを入力してください');
          setIsRunning(false);
          return;
        }
        
        endpoint = '/api/research-table/keyword-batch';
        body = {
          keywords,
          jobName: jobName || `Keyword Batch ${new Date().toLocaleString('ja-JP')}`,
          minProfitMargin: parseInt(minProfitMargin) || 15,
          searchPlatform: 'both',
        };
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data: JobResult = await response.json();
      setResult(data);
      
      if (data.success) {
        setCompletedCount(prev => prev + (data.total || 0));
        if (data.tokensUsed) {
          setSessionTokensUsed(prev => prev + data.tokensUsed!);
        }
        if (data.tokensLeft !== undefined) {
          setTokensLeft(data.tokensLeft);
        }
        onRefresh?.();
      }
      
    } catch (e: any) {
      setError(e.message || 'エラーが発生しました');
    } finally {
      setIsRunning(false);
    }
  }, [inputData, jobType, jobName, minProfitMargin, marketplace, estimatedPrice, apiChoice, onRefresh]);
  
  // 入力データのカウント
  const inputCount = inputData
    .split(/[\n,\s]+/)
    .filter(s => s.trim().length > 0).length;
  
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-[var(--n3-accent)]" />
            <span className="text-sm font-semibold">バッチリサーチ</span>
          </div>
          
          {/* APIモード表示 */}
          {apiStatus && (
            <div className={`
              flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium
              ${API_LABELS[apiStatus.activeApi]?.color || 'bg-gray-100 text-gray-700'}
            `}>
              {apiStatus.activeApi === 'mock' ? (
                <Database size={10} />
              ) : (
                <Zap size={10} />
              )}
              {API_LABELS[apiStatus.activeApi]?.label || apiStatus.activeApi}
            </div>
          )}
        </div>
        
        <p className="text-xs text-[var(--n3-text-muted)] mb-2">
          ASIN / セラーID / キーワードを一括リサーチ
        </p>
        
        {/* API機能表示 */}
        {apiStatus && (
          <div className="flex flex-wrap gap-1 mb-3">
            {apiStatus.features.bsr && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">BSR</span>
            )}
            {apiStatus.features.category && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">カテゴリ</span>
            )}
            {apiStatus.features.reviews && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">レビュー</span>
            )}
            {apiStatus.features.priceHistory && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">価格履歴</span>
            )}
            {apiStatus.features.monthlySales && (
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">月間販売数</span>
            )}
          </div>
        )}
      </div>
      
      {/* ジョブタイプ選択 */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">リサーチタイプ</label>
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: 'amazon_asin', label: 'Amazon', icon: '📦' },
            { id: 'ebay_seller', label: 'eBay', icon: '👤' },
            { id: 'keyword', label: 'キーワード', icon: '🔍' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setJobType(type.id as JobType)}
              className={`
                h-8 text-xs font-medium rounded border transition-colors
                flex items-center justify-center gap-1
                ${jobType === type.id
                  ? 'bg-[var(--n3-accent)] border-[var(--n3-accent)] text-white'
                  : 'bg-[var(--n3-bg)] border-[var(--n3-panel-border)] text-[var(--n3-text-muted)] hover:border-[var(--n3-accent)]'
                }
              `}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* 入力エリア */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        {/* ジョブ名 */}
        <div className="mb-2">
          <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">ジョブ名（任意）</label>
          <input
            type="text"
            value={jobName}
            onChange={(e) => setJobName(e.target.value)}
            placeholder="例: 陶器リサーチ 12月"
            className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
          />
        </div>
        
        {/* データ入力 */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-[var(--n3-text-muted)]">
              {jobType === 'amazon_asin' && 'ASINリスト（改行/カンマ区切り）'}
              {jobType === 'ebay_seller' && 'セラーID（改行/カンマ区切り）'}
              {jobType === 'keyword' && 'キーワード（改行区切り）'}
            </label>
            <span className="text-[10px] text-[var(--n3-accent)] font-medium">
              {inputCount}件
            </span>
          </div>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={
              jobType === 'amazon_asin' 
                ? 'B0XXXXXXXX\nB0YYYYYYYY\nB0ZZZZZZZZ'
                : jobType === 'ebay_seller'
                ? 'japan-collector\ntokyo-antiques'
                : 'japanese pottery\nvintage kimono'
            }
            rows={5}
            className="w-full px-2 py-1.5 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)] resize-y font-mono"
          />
        </div>
        
        {/* オプション（2列） */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">最低利益率 %</label>
            <input
              type="number"
              value={minProfitMargin}
              onChange={(e) => setMinProfitMargin(e.target.value)}
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
          
          {jobType === 'amazon_asin' && (
            <div>
              <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">想定販売価格 $</label>
              <input
                type="number"
                value={estimatedPrice}
                onChange={(e) => setEstimatedPrice(e.target.value)}
                placeholder="自動計算"
                className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
              />
            </div>
          )}
        </div>
        
        {/* Amazon専用オプション */}
        {jobType === 'amazon_asin' && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">
                <Globe size={10} className="inline mr-1" />
                マーケットプレイス
              </label>
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value as Marketplace)}
                className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
              >
                {Object.entries(MARKETPLACE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">
                <Settings size={10} className="inline mr-1" />
                API選択
              </label>
              <select
                value={apiChoice}
                onChange={(e) => setApiChoice(e.target.value as ApiChoice)}
                className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
              >
                <option value="auto">🔄 自動（推奨）</option>
                <option value="keepa" disabled={!apiStatus?.keepaConfigured}>
                  ⚡ Keepa {!apiStatus?.keepaConfigured && '(未設定)'}
                </option>
                <option value="paapi" disabled={!apiStatus?.paapiConfigured}>
                  📦 PA-API {!apiStatus?.paapiConfigured && '(未設定)'}
                </option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {/* 実行 & 結果 */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        {/* エラー表示 */}
        {error && (
          <div className="mb-2 p-2 rounded bg-red-50 border border-red-200 text-xs text-red-700">
            <AlertCircle size={12} className="inline mr-1" />
            {error}
          </div>
        )}
        
        {/* 結果表示 */}
        {result && (
          <div className={`mb-2 p-2 rounded text-xs ${
            result.success 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              {result.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
              <span className="font-semibold">
                {result.success 
                  ? (result.total || 0) > 0 ? `${result.total}件を登録` : result.message
                  : 'エラー'
                }
              </span>
            </div>
            
            {result.success && result.stats && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="p-1.5 rounded bg-white/50 text-center">
                  <div className="text-sm font-bold text-indigo-600">{result.stats.avgScore}</div>
                  <div className="text-[10px]">平均スコア</div>
                </div>
                <div className="p-1.5 rounded bg-white/50 text-center">
                  <div className="text-sm font-bold text-emerald-600">{result.stats.avgProfitMargin}%</div>
                  <div className="text-[10px]">平均利益率</div>
                </div>
                <div className="p-1.5 rounded bg-white/50 text-center">
                  <div className="text-sm font-bold text-amber-600">{result.stats.highScoreCount}</div>
                  <div className="text-[10px]">高スコア</div>
                </div>
              </div>
            )}
            
            {result.success && (
              <div className="mt-2 text-[10px] text-slate-600">
                {result.skipped !== undefined && result.skipped > 0 && (
                  <span className="mr-2">重複スキップ: {result.skipped}</span>
                )}
                {result.filtered !== undefined && result.filtered > 0 && (
                  <span className="mr-2">利益率フィルター: {result.filtered}</span>
                )}
                {result.apiMode && (
                  <span className="mr-2">API: {result.apiMode}</span>
                )}
                {result.tokensLeft !== undefined && (
                  <span>残トークン: {result.tokensLeft}</span>
                )}
              </div>
            )}
            
            {result.error && <div>{result.error}</div>}
          </div>
        )}
        
        {/* 実行ボタン */}
        <N3Button
          variant="primary"
          size="sm"
          icon={isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          className="w-full"
          onClick={handleRunJob}
          disabled={isRunning || inputCount === 0}
        >
          {isRunning ? 'リサーチ中...' : `${inputCount}件をリサーチ開始`}
        </N3Button>
      </div>
      
      {/* セッション統計 */}
      <div className="p-3">
        <div className="text-xs font-semibold mb-2">📊 セッション統計</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-slate-50 border border-slate-200">
            <div className="text-[10px] text-slate-500">登録済み</div>
            <div className="text-lg font-bold font-mono text-slate-700">{completedCount}</div>
          </div>
          {sessionTokensUsed > 0 && (
            <div className="p-2 rounded bg-amber-50 border border-amber-200">
              <div className="text-[10px] text-amber-600">使用トークン</div>
              <div className="text-lg font-bold font-mono text-amber-700">{sessionTokensUsed}</div>
            </div>
          )}
          {tokensLeft !== undefined && (
            <div className="p-2 rounded bg-blue-50 border border-blue-200 col-span-2">
              <div className="text-[10px] text-blue-600">残りトークン（Keepa）</div>
              <div className="text-lg font-bold font-mono text-blue-700">{tokensLeft.toLocaleString()}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* フッター */}
      <div className="p-3 border-t border-[var(--n3-panel-border)] mt-auto">
        <N3Button
          variant="ghost"
          size="sm"
          icon={<RefreshCw size={14} />}
          className="w-full"
          onClick={onRefresh}
        >
          テーブル更新
        </N3Button>
      </div>
    </div>
  );
}

export default BatchResearchPanel;
