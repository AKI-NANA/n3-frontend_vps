// app/tools/amazon-research-n3/extension-slot/competitor-scan-panel.tsx
/**
 * 🎯 Competitor Scan Panel
 * 
 * 競合分析パネル
 * - セラー分析
 * - 商品比較
 * - 価格監視
 * 
 * 接続: UI → Dispatch API → n8n
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Users, Play, Loader2, ExternalLink, TrendingUp, TrendingDown, AlertTriangle, Eye } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface CompetitorData {
  sellerId: string;
  sellerName: string;
  rating: number;
  feedbackCount: number;
  productCount: number;
  averagePrice: number;
  priceRange: { min: number; max: number };
  topCategories: string[];
  threatLevel: 'low' | 'medium' | 'high';
  insights: string;
}

// ============================================================
// Competitor Scan Panel Component
// ============================================================

export function CompetitorScanPanel() {
  const [sellerInput, setSellerInput] = useState('');
  const [scanType, setScanType] = useState<'seller' | 'asin'>('seller');
  const [isLoading, setIsLoading] = useState(false);
  const [competitors, setCompetitors] = useState<CompetitorData[]>([]);
  
  const scanCompetitors = useCallback(async () => {
    if (!sellerInput.trim()) return;
    
    setIsLoading(true);
    setCompetitors([]);
    
    try {
      const response = await fetch('/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'research-competitor-scan',
          action: 'execute',
          params: {
            input: sellerInput.trim(),
            scanType,
          },
        }),
      });
      
      const data = await response.json();
      
      if (data.success && data.result) {
        setCompetitors(data.result);
      } else {
        // モックデータ（開発用）
        setCompetitors([
          {
            sellerId: 'A1EXAMPLE001',
            sellerName: 'トップセラーA',
            rating: 4.8,
            feedbackCount: 12500,
            productCount: 850,
            averagePrice: 3500,
            priceRange: { min: 500, max: 25000 },
            topCategories: ['トレーディングカード', 'フィギュア', 'ゲーム'],
            threatLevel: 'high',
            insights: '大規模FBAセラー。価格競争力が高い。',
          },
          {
            sellerId: 'A1EXAMPLE002',
            sellerName: 'ミドルセラーB',
            rating: 4.5,
            feedbackCount: 3200,
            productCount: 320,
            averagePrice: 4200,
            priceRange: { min: 1000, max: 15000 },
            topCategories: ['トレーディングカード', 'コレクターズアイテム'],
            threatLevel: 'medium',
            insights: 'ニッチカテゴリに強い。在庫回転率が高い。',
          },
          {
            sellerId: 'A1EXAMPLE003',
            sellerName: '新規セラーC',
            rating: 4.2,
            feedbackCount: 450,
            productCount: 85,
            averagePrice: 2800,
            priceRange: { min: 800, max: 8000 },
            topCategories: ['トレーディングカード'],
            threatLevel: 'low',
            insights: '新規参入。品揃えが限定的。',
          },
        ]);
      }
    } catch (err) {
      console.error('Competitor scan error:', err);
    }
    
    setIsLoading(false);
  }, [sellerInput, scanType]);
  
  const getThreatBadge = (level: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      high: { bg: 'rgba(239, 68, 68, 0.15)', color: 'rgb(239, 68, 68)', label: '高脅威' },
      medium: { bg: 'rgba(245, 158, 11, 0.15)', color: 'rgb(245, 158, 11)', label: '中脅威' },
      low: { bg: 'rgba(34, 197, 94, 0.15)', color: 'rgb(34, 197, 94)', label: '低脅威' },
    };
    const style = styles[level] || styles.low;
    return (
      <span style={{ 
        padding: '2px 6px', fontSize: 10, fontWeight: 600,
        background: style.bg, color: style.color, borderRadius: 4,
      }}>
        {style.label}
      </span>
    );
  };
  
  return (
    <div style={{ padding: 16, height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ 
          width: 36, height: 36, borderRadius: 8, 
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Users size={18} style={{ color: 'white' }} />
        </div>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>Competitor Scan</h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>
            競合セラー分析
          </p>
        </div>
      </div>
      
      {/* 入力 */}
      <div style={{ 
        padding: 16, background: 'var(--highlight)', borderRadius: 8,
        border: '1px solid var(--panel-border)',
      }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setScanType('seller')}
            style={{
              flex: 1, padding: '8px 12px', fontSize: 11, fontWeight: 500,
              background: scanType === 'seller' ? 'var(--accent)' : 'var(--panel)',
              color: scanType === 'seller' ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            セラーID検索
          </button>
          <button
            onClick={() => setScanType('asin')}
            style={{
              flex: 1, padding: '8px 12px', fontSize: 11, fontWeight: 500,
              background: scanType === 'asin' ? 'var(--accent)' : 'var(--panel)',
              color: scanType === 'asin' ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--panel-border)', borderRadius: 6, cursor: 'pointer',
            }}
          >
            ASIN競合検索
          </button>
        </div>
        
        <input
          type="text"
          value={sellerInput}
          onChange={(e) => setSellerInput(e.target.value)}
          placeholder={scanType === 'seller' ? 'セラーIDを入力（例: A1XXXXXXXX）' : 'ASINを入力（例: B08XXXXXXX）'}
          style={{
            width: '100%', height: 40, padding: '0 12px', fontSize: 12,
            fontFamily: 'var(--font-mono)', background: 'var(--bg)',
            border: '1px solid var(--panel-border)', borderRadius: 6,
            color: 'var(--text)', outline: 'none', marginBottom: 12,
          }}
        />
        
        <button
          onClick={scanCompetitors}
          disabled={!sellerInput.trim() || isLoading}
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
              スキャン中...
            </>
          ) : (
            <>
              <Eye size={16} />
              競合スキャン
            </>
          )}
        </button>
      </div>
      
      {/* 結果 */}
      {competitors.length > 0 && (
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
            検出された競合: {competitors.length}件
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {competitors.map((comp) => (
              <div
                key={comp.sellerId}
                style={{
                  padding: 12, background: 'var(--panel)', borderRadius: 8,
                  border: '1px solid var(--panel-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{comp.sellerName}</span>
                      {getThreatBadge(comp.threatLevel)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                      {comp.sellerId}
                    </div>
                  </div>
                  <a
                    href={`https://www.amazon.co.jp/sp?seller=${comp.sellerId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 2 }}
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>評価</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>★{comp.rating}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>レビュー</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{comp.feedbackCount.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>商品数</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{comp.productCount}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>平均価格</div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>¥{comp.averagePrice.toLocaleString()}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                  {comp.topCategories.map((cat, i) => (
                    <span key={i} style={{
                      padding: '2px 6px', fontSize: 9, background: 'var(--highlight)',
                      borderRadius: 3, color: 'var(--text-muted)',
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>
                
                <div style={{ fontSize: 10, color: 'var(--text)', lineHeight: 1.4 }}>
                  💡 {comp.insights}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 空状態 */}
      {competitors.length === 0 && !isLoading && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ marginBottom: 12, opacity: 0.3 }} />
            <div style={{ fontSize: 13, fontWeight: 500 }}>競合分析を開始</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>
              セラーIDまたはASINを入力して<br/>
              競合状況を分析
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
