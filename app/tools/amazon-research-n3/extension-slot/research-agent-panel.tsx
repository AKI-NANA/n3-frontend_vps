// app/tools/amazon-research-n3/extension-slot/research-agent-panel.tsx
/**
 * 🤖 Research Agent Panel
 * 
 * 【Phase 4 帝国公用語マイグレーション済】
 * 生fetch → Server Actions (executeResearchAgent, getJobStatus) 経由
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Bot, Play, Loader2, CheckCircle, AlertCircle, Sparkles, TrendingUp, Search } from 'lucide-react';
import { executeResearchAgent, getJobStatus } from '../actions';

interface AgentJob {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: AgentResult;
  error?: string;
}

interface AgentResult {
  keywords: string[];
  marketScore: number;
  competitors: number;
  recommendations: string[];
  insights: string;
}

export function ResearchAgentPanel() {
  const [query, setQuery] = useState('');
  const [analysisType, setAnalysisType] = useState<'keyword' | 'market' | 'competitor'>('keyword');
  const [currentJob, setCurrentJob] = useState<AgentJob | null>(null);
  const [results, setResults] = useState<AgentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);
  
  const handleExecuteAgent = useCallback(async () => {
    if (!query.trim()) return;
    
    setError(null);
    setResults(null);
    
    try {
      const response = await executeResearchAgent(
        query.trim(),
        analysisType,
        {
          includeKeywords: true,
          includeMarketScore: true,
          includeCompetitors: analysisType === 'competitor',
        }
      );
      
      if (!response.success) {
        throw new Error(response.error || 'Dispatch failed');
      }
      
      if (response.data?.jobId) {
        setCurrentJob({
          jobId: response.data.jobId,
          status: 'pending',
          progress: 0,
        });
        
        pollIntervalRef.current = setInterval(async () => {
          try {
            const status = await getJobStatus(response.data.jobId);
            
            if (status.success && status.data) {
              setCurrentJob(prev => ({
                ...prev!,
                status: status.data.status,
                progress: status.data.progress || 0,
                result: status.data.result,
                error: status.data.error,
              }));
              
              if (status.data.status === 'completed') {
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                setResults(status.data.result);
                setCurrentJob(null);
              } else if (status.data.status === 'failed') {
                if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
                setError(status.data.error || 'Job failed');
                setCurrentJob(null);
              }
            }
          } catch {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            setError('Polling error');
            setCurrentJob(null);
          }
        }, 2000);
        
        setTimeout(() => {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }, 300000);
      } else if (response.data) {
        setResults(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [query, analysisType]);
  
  const isProcessing = currentJob?.status === 'pending' || currentJob?.status === 'running';
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8, 
          background: 'linear-gradient(135deg, #8B5CF6, #6366F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Bot size={18} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Research Agent</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>GPT-4ベースのAIリサーチ</p>
        </div>
      </div>
      
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            分析タイプ
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'keyword', label: 'キーワード分析', icon: Search },
              { id: 'market', label: '市場調査', icon: TrendingUp },
              { id: 'competitor', label: '競合分析', icon: Sparkles },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setAnalysisType(id as typeof analysisType)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  padding: '8px 12px', fontSize: 11, fontWeight: 500,
                  background: analysisType === id ? 'var(--accent)' : 'var(--panel)',
                  color: analysisType === id ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--panel-border)', borderRadius: 6,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
            分析対象
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              analysisType === 'keyword' ? 'キーワードを入力（例: ポケモンカード 25周年）' :
              analysisType === 'market' ? 'カテゴリ・市場を入力（例: トレーディングカード市場）' :
              'ASIN・商品名・セラーIDを入力'
            }
            style={{
              width: '100%', height: 80, padding: 10, fontSize: 12,
              fontFamily: 'var(--font-mono)', background: 'var(--bg)',
              border: '1px solid var(--panel-border)', borderRadius: 6,
              color: 'var(--text)', resize: 'none', outline: 'none',
            }}
          />
        </div>
        
        <button
          onClick={handleExecuteAgent}
          disabled={!query.trim() || isProcessing}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 16px', fontSize: 13, fontWeight: 600,
            background: isProcessing ? 'var(--panel)' : 'var(--accent)',
            color: isProcessing ? 'var(--text-muted)' : 'white',
            border: 'none', borderRadius: 6, cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              分析中... {currentJob?.progress || 0}%
            </>
          ) : (
            <>
              <Play size={16} />
              AIリサーチ開始
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div style={{
          padding: 12, background: 'rgba(239, 68, 68, 0.1)', borderRadius: 8,
          border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <AlertCircle size={16} style={{ color: 'rgb(239, 68, 68)' }} />
          <span style={{ fontSize: 12, color: 'rgb(239, 68, 68)' }}>{error}</span>
        </div>
      )}
      
      {results && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{
            padding: 12, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8,
            border: '1px solid rgba(34, 197, 94, 0.3)', marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <CheckCircle size={16} style={{ color: 'rgb(34, 197, 94)' }} />
            <span style={{ fontSize: 12, color: 'rgb(34, 197, 94)', fontWeight: 600 }}>分析完了</span>
          </div>
          
          {results.marketScore !== undefined && (
            <div style={{
              padding: 16, background: 'var(--panel)', borderRadius: 8,
              border: '1px solid var(--panel-border)', marginBottom: 12, textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>市場スコア</div>
              <div style={{
                fontSize: 32, fontWeight: 700,
                color: results.marketScore >= 70 ? 'var(--success)' :
                       results.marketScore >= 50 ? 'var(--warning)' : 'var(--error)',
              }}>
                {results.marketScore}
              </div>
            </div>
          )}
          
          {results.keywords && results.keywords.length > 0 && (
            <div style={{
              padding: 12, background: 'var(--panel)', borderRadius: 8,
              border: '1px solid var(--panel-border)', marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>関連キーワード</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {results.keywords.map((kw, i) => (
                  <span key={i} style={{
                    padding: '4px 8px', fontSize: 11, background: 'var(--highlight)',
                    borderRadius: 4, color: 'var(--text)',
                  }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {results.recommendations && results.recommendations.length > 0 && (
            <div style={{
              padding: 12, background: 'var(--panel)', borderRadius: 8,
              border: '1px solid var(--panel-border)', marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>推奨アクション</div>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.6 }}>
                {results.recommendations.map((rec, i) => (
                  <li key={i} style={{ color: 'var(--text)' }}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {results.insights && (
            <div style={{
              padding: 12, background: 'var(--panel)', borderRadius: 8,
              border: '1px solid var(--panel-border)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>AIインサイト</div>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text)', margin: 0 }}>
                {results.insights}
              </p>
            </div>
          )}
        </div>
      )}
      
      {!results && !isProcessing && !error && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>AIリサーチを開始</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              キーワード・市場・競合を入力して<br/>
              GPT-4による深層分析を実行
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
