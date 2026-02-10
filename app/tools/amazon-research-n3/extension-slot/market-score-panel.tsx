// app/tools/amazon-research-n3/extension-slot/market-score-panel.tsx
/**
 * 📊 Market Score Panel
 * 
 * 【Phase 4 帝国公用語マイグレーション済】
 * 生fetch → Server Action (analyzeMarketScore) 経由
 */

'use client';

import React, { useState, useCallback } from 'react';
import { BarChart3, Play, Loader2, TrendingUp, Target, DollarSign } from 'lucide-react';
import { analyzeMarketScore } from '../actions';

interface MarketScoreResult {
  overallScore: number;
  demandScore: number;
  competitionScore: number;
  profitScore: number;
  trendScore: number;
  insights: {
    demand: string;
    competition: string;
    profit: string;
    trend: string;
  };
}

export function MarketScorePanel() {
  const [category, setCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MarketScoreResult | null>(null);
  
  const handleAnalyzeMarket = useCallback(async () => {
    if (!category.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await analyzeMarketScore(category.trim());
      
      if (response.success && response.data) {
        setResult(response.data);
      }
    } catch {
      // エラーはServer Action側で処理済み
    }
    
    setIsLoading(false);
  }, [category]);
  
  const ScoreBar = ({ label, score, icon: Icon, color }: { label: string; score: number; icon: React.ElementType; color: string }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon size={14} style={{ color }} />
          <span style={{ fontSize: 11, fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}</span>
      </div>
      <div style={{ height: 6, background: 'var(--panel-border)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ 
          width: `${score}%`, height: '100%', background: color,
          transition: 'width 0.5s ease-out',
        }} />
      </div>
    </div>
  );
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8, 
          background: 'linear-gradient(135deg, #10B981, #059669)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BarChart3 size={18} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Market Score</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>カテゴリ市場分析</p>
        </div>
      </div>
      
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
          カテゴリ / 市場
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="例: トレーディングカード、フィギュア、家電"
          style={{
            width: '100%', height: 40, padding: '0 12px', fontSize: 12,
            background: 'var(--bg)', border: '1px solid var(--panel-border)',
            borderRadius: 6, color: 'var(--text)', outline: 'none', marginBottom: 12,
          }}
        />
        
        <button
          onClick={handleAnalyzeMarket}
          disabled={!category.trim() || isLoading}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 16px', fontSize: 13, fontWeight: 600,
            background: isLoading ? 'var(--panel)' : 'var(--accent)',
            color: isLoading ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Play size={16} />
              市場分析
            </>
          )}
        </button>
      </div>
      
      {result && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{
            padding: 20, background: 'var(--panel)', borderRadius: 8,
            border: '1px solid var(--panel-border)', marginBottom: 16, textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>総合市場スコア</div>
            <div style={{
              fontSize: 48, fontWeight: 700, lineHeight: 1,
              color: result.overallScore >= 70 ? 'var(--success)' :
                     result.overallScore >= 50 ? 'var(--warning)' : 'var(--error)',
            }}>
              {result.overallScore}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>/ 100</div>
          </div>
          
          <div style={{
            padding: 16, background: 'var(--panel)', borderRadius: 8,
            border: '1px solid var(--panel-border)', marginBottom: 16,
          }}>
            <ScoreBar label="需要スコア" score={result.demandScore} icon={TrendingUp} color="rgb(59, 130, 246)" />
            <ScoreBar label="競争スコア" score={result.competitionScore} icon={Target} color="rgb(245, 158, 11)" />
            <ScoreBar label="利益スコア" score={result.profitScore} icon={DollarSign} color="rgb(34, 197, 94)" />
            <ScoreBar label="トレンド" score={result.trendScore} icon={TrendingUp} color="rgb(168, 85, 247)" />
          </div>
          
          <div style={{
            padding: 12, background: 'var(--panel)', borderRadius: 8,
            border: '1px solid var(--panel-border)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>分析インサイト</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(result.insights).map(([key, text]) => (
                <div key={key} style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text)' }}>
                  <strong style={{ color: 'var(--accent)' }}>
                    {key === 'demand' ? '📈 需要' : key === 'competition' ? '🎯 競争' : key === 'profit' ? '💰 利益' : '📊 トレンド'}:
                  </strong> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {!result && !isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <BarChart3 size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>市場分析を開始</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              カテゴリを入力して<br/>
              市場の可能性を分析
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
