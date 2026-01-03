/**
 * AI Analysis Tab
 */

'use client';

import React, { useState } from 'react';
import { Bot, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { N3Button, N3Badge } from '@/components/n3';

export function AIAnalysisTab() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleAnalysis = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResults([
        {
          id: 1,
          title: 'ワイヤレスイヤホン市場の急成長',
          confidence: 85,
          profitPotential: '35-45%',
          risk: 'low'
        },
        {
          id: 2,
          title: 'ペット用スマートデバイス',
          confidence: 72,
          profitPotential: '40-55%',
          risk: 'medium'
        }
      ]);
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        padding: 20,
        marginBottom: 20,
        border: '1px solid var(--panel-border)'
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>AI市場分析</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
          AIが市場トレンドを分析して高利益商品を予測します
        </p>
        <N3Button
          variant="primary"
          onClick={handleAnalysis}
          disabled={analyzing}
          icon={analyzing ? <Loader2 size={16} className="animate-spin" /> : <Bot size={16} />}
        >
          {analyzing ? 'AI分析中...' : 'AI分析開始'}
        </N3Button>
      </div>

      {results.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map(result => (
            <div key={result.id} style={{ 
              background: 'var(--panel)', 
              borderRadius: 8, 
              padding: 16,
              border: '1px solid var(--panel-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600 }}>{result.title}</h4>
                <N3Badge variant={result.risk === 'low' ? 'success' : 'warning'}>
                  リスク: {result.risk}
                </N3Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>確信度</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>{result.confidence}%</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>想定利益率</span>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--success)' }}>{result.profitPotential}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
