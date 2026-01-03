// app/tools/research-n3/components/panels/ai-proposal-panel.tsx
/**
 * AI提案 ツールパネル
 * 
 * 機能:
 * - Gemini/Claude APIで商品分析・提案
 * - 売れ筋パターン分析
 * - カテゴリ推奨
 * - 価格戦略提案
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Bot, Sparkles, RefreshCw, Loader2, Send,
  Lightbulb, TrendingUp, Target, Zap, Database,
} from 'lucide-react';
import { N3Button } from '@/components/n3';

interface AIProposalPanelProps {
  filter?: string;
  selectedCount?: number;
  selectedIds?: string[];
  onRefresh?: () => void;
}

type AIMode = 'analyze' | 'suggest' | 'optimize' | 'categorize';

interface AIResponse {
  analysis?: string;
  insights?: string[];
  suggestions?: Array<{
    keyword: string;
    estimatedDemand: string;
    estimatedProfit: number;
    reasoning: string;
    searchTips: string[];
  }>;
  optimization?: {
    currentIssues: string[];
    improvements: string[];
    priorityActions: string[];
  };
  categoryRecommendations?: Array<{
    category: string;
    subcategory?: string;
    confidence: number;
    reasoning: string;
  }>;
}

export default function AIProposalPanel({
  filter,
  selectedCount = 0,
  selectedIds = [],
  onRefresh,
}: AIProposalPanelProps) {
  const [mode, setMode] = useState<AIMode>('analyze');
  const [customPrompt, setCustomPrompt] = useState('');
  const [targetProfit, setTargetProfit] = useState('25');
  const [category, setCategory] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiMode, setApiMode] = useState<string>('unknown');
  
  // APIステータス確認
  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await fetch('/api/research-table/ai-proposal');
        if (res.ok) {
          const data = await res.json();
          setApiMode(data.activeAI || 'mock');
        }
      } catch (e) {
        setApiMode('mock');
      }
    };
    checkApi();
  }, []);
  
  // AI実行
  const handleExecute = useCallback(async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const body: Record<string, unknown> = { mode };
      
      if (mode === 'analyze' && selectedIds.length > 0) {
        body.productIds = selectedIds;
      }
      
      if (mode === 'suggest') {
        body.category = category || undefined;
        body.targetProfit = parseInt(targetProfit) || 25;
      }
      
      if (mode === 'categorize') {
        body.customPrompt = customPrompt;
      }
      
      const res = await fetch('/api/research-table/ai-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResponse(data.response);
        setApiMode(data.apiMode);
      } else {
        setError(data.error || 'エラーが発生しました');
      }
      
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'エラーが発生しました';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [mode, selectedIds, category, targetProfit, customPrompt]);
  
  const MODE_OPTIONS: { id: AIMode; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'analyze', label: '分析', icon: <TrendingUp size={12} />, description: '商品群の傾向を分析' },
    { id: 'suggest', label: '提案', icon: <Lightbulb size={12} />, description: '売れ筋キーワードを提案' },
    { id: 'optimize', label: '最適化', icon: <Target size={12} />, description: '改善点を提案' },
    { id: 'categorize', label: '分類', icon: <Sparkles size={12} />, description: 'eBayカテゴリを推奨' },
  ];
  
  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="p-3 border-b border-[var(--n3-panel-border)]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-[var(--n3-accent)]" />
            <span className="text-sm font-semibold">AI提案</span>
          </div>
          
          {/* APIモード表示 */}
          <div className={`
            flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium
            ${apiMode === 'gemini' || apiMode === 'claude'
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-amber-100 text-amber-700'
            }
          `}>
            {apiMode === 'gemini' ? (
              <><Zap size={10} />Gemini</>
            ) : apiMode === 'claude' ? (
              <><Zap size={10} />Claude</>
            ) : (
              <><Database size={10} />Mock</>
            )}
          </div>
        </div>
        
        <p className="text-xs text-[var(--n3-text-muted)] mb-3">
          AIで商品分析・販売戦略を提案
        </p>
        
        {/* モード選択 */}
        <div className="grid grid-cols-4 gap-1 mb-3">
          {MODE_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => setMode(opt.id)}
              className={`
                flex flex-col items-center gap-0.5 p-2 rounded border transition-colors
                ${mode === opt.id
                  ? 'bg-[var(--n3-accent)] border-[var(--n3-accent)] text-white'
                  : 'bg-[var(--n3-bg)] border-[var(--n3-panel-border)] text-[var(--n3-text-muted)] hover:border-[var(--n3-accent)]'
                }
              `}
            >
              {opt.icon}
              <span className="text-[10px] font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
        
        {/* モード別オプション */}
        {mode === 'analyze' && (
          <div className="mb-3 p-2 rounded bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-600">
              {selectedCount > 0 
                ? `選択中の${selectedCount}件を分析します`
                : '最新の商品データを分析します'
              }
            </div>
          </div>
        )}
        
        {mode === 'suggest' && (
          <div className="space-y-2 mb-3">
            <div>
              <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">カテゴリ（任意）</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="日本の伝統工芸品"
                className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">目標利益率 %</label>
              <input
                type="number"
                value={targetProfit}
                onChange={(e) => setTargetProfit(e.target.value)}
                className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
              />
            </div>
          </div>
        )}
        
        {mode === 'categorize' && (
          <div className="mb-3">
            <label className="text-xs text-[var(--n3-text-muted)] mb-1 block">商品タイトル</label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Japanese Vintage Imari Porcelain Bowl"
              className="w-full h-8 px-2 text-xs rounded border border-[var(--n3-panel-border)] bg-[var(--n3-bg)] text-[var(--n3-text)]"
            />
          </div>
        )}
        
        {/* 実行ボタン */}
        <N3Button
          variant="primary"
          size="sm"
          icon={isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          className="w-full"
          onClick={handleExecute}
          disabled={isLoading || (mode === 'categorize' && !customPrompt.trim())}
        >
          {isLoading ? 'AI分析中...' : 'AIに依頼'}
        </N3Button>
      </div>
      
      {/* 結果表示 */}
      <div className="flex-1 overflow-y-auto p-3">
        {error && (
          <div className="p-2 rounded bg-red-50 border border-red-200 text-xs text-red-700 mb-3">
            {error}
          </div>
        )}
        
        {response && (
          <div className="space-y-3">
            {/* 分析結果 */}
            {response.analysis && (
              <div className="p-2 rounded bg-indigo-50 border border-indigo-200">
                <div className="text-xs font-semibold text-indigo-700 mb-1">📊 分析結果</div>
                <div className="text-xs text-indigo-900">{response.analysis}</div>
              </div>
            )}
            
            {/* インサイト */}
            {response.insights && response.insights.length > 0 && (
              <div className="p-2 rounded bg-amber-50 border border-amber-200">
                <div className="text-xs font-semibold text-amber-700 mb-1">💡 インサイト</div>
                <ul className="text-xs text-amber-900 space-y-1">
                  {response.insights.map((insight, i) => (
                    <li key={i}>• {insight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* 提案 */}
            {response.suggestions && response.suggestions.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold">🎯 おすすめキーワード</div>
                {response.suggestions.map((s, i) => (
                  <div key={i} className="p-2 rounded bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-emerald-800">{s.keyword}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        s.estimatedDemand === 'high' ? 'bg-emerald-200 text-emerald-800' :
                        s.estimatedDemand === 'medium' ? 'bg-amber-200 text-amber-800' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        需要: {s.estimatedDemand}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-700 mb-1">
                      推定利益率: {s.estimatedProfit}%
                    </div>
                    <div className="text-[10px] text-emerald-900">{s.reasoning}</div>
                    {s.searchTips && s.searchTips.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.searchTips.map((tip, j) => (
                          <span key={j} className="text-[9px] px-1 py-0.5 rounded bg-emerald-200 text-emerald-800">
                            {tip}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* 最適化提案 */}
            {response.optimization && (
              <div className="space-y-2">
                {response.optimization.currentIssues?.length > 0 && (
                  <div className="p-2 rounded bg-red-50 border border-red-200">
                    <div className="text-xs font-semibold text-red-700 mb-1">⚠️ 現在の課題</div>
                    <ul className="text-[10px] text-red-900 space-y-0.5">
                      {response.optimization.currentIssues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.optimization.improvements?.length > 0 && (
                  <div className="p-2 rounded bg-blue-50 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-700 mb-1">💡 改善提案</div>
                    <ul className="text-[10px] text-blue-900 space-y-0.5">
                      {response.optimization.improvements.map((imp, i) => (
                        <li key={i}>• {imp}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {response.optimization.priorityActions?.length > 0 && (
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                    <div className="text-xs font-semibold text-emerald-700 mb-1">🎯 優先アクション</div>
                    <ul className="text-[10px] text-emerald-900 space-y-0.5">
                      {response.optimization.priorityActions.map((action, i) => (
                        <li key={i}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* カテゴリ推奨 */}
            {response.categoryRecommendations && response.categoryRecommendations.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold">📁 推奨カテゴリ</div>
                {response.categoryRecommendations.map((cat, i) => (
                  <div key={i} className="p-2 rounded bg-purple-50 border border-purple-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-purple-800">
                        {cat.category}
                        {cat.subcategory && ` > ${cat.subcategory}`}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-200 text-purple-800">
                        {Math.round(cat.confidence * 100)}%
                      </span>
                    </div>
                    <div className="text-[10px] text-purple-900">{cat.reasoning}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!response && !error && !isLoading && (
          <div className="text-center text-xs text-[var(--n3-text-muted)] py-8">
            モードを選択して「AIに依頼」をクリック
          </div>
        )}
      </div>
      
      {/* フッター */}
      <div className="p-3 border-t border-[var(--n3-panel-border)]">
        <N3Button 
          variant="ghost" 
          size="sm" 
          icon={<RefreshCw size={14} />}
          onClick={onRefresh}
          className="w-full"
        >
          テーブル更新
        </N3Button>
      </div>
    </div>
  );
}
