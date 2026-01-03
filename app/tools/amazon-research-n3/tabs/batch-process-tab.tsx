/**
 * Batch Process Tab
 */

'use client';

import React, { useState } from 'react';
import { Upload, Package, Copy, Trash2, Play, Loader2 } from 'lucide-react';
import { N3Button } from '@/components/n3';

export function BatchProcessTab() {
  const [batchInput, setBatchInput] = useState('');
  const [processing, setProcessing] = useState(false);
  
  const parsedCount = batchInput.match(/[A-Z0-9]{10}/g)?.length || 0;

  const handleProcess = async () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
    }, 3000);
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ 
        background: 'var(--panel)', 
        borderRadius: 8, 
        overflow: 'hidden',
        border: '1px solid var(--panel-border)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 16px', 
          borderBottom: '1px solid var(--panel-border)',
          background: 'var(--highlight)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Upload size={16} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>バッチ処理</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button 
              onClick={async () => { 
                const text = await navigator.clipboard.readText(); 
                setBatchInput(prev => prev + '\n' + text); 
              }}
              style={{ 
                padding: '4px 10px', 
                fontSize: 12, 
                background: 'var(--bg)', 
                border: '1px solid var(--panel-border)', 
                borderRadius: 4, 
                color: 'var(--text)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Copy size={12} /> 貼付
            </button>
            <button 
              onClick={() => setBatchInput('')}
              style={{ 
                padding: '4px 10px', 
                fontSize: 12, 
                background: 'var(--bg)', 
                border: '1px solid var(--panel-border)', 
                borderRadius: 4, 
                color: 'var(--text)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Trash2 size={12} /> クリア
            </button>
          </div>
        </div>
        
        <textarea 
          value={batchInput} 
          onChange={(e) => setBatchInput(e.target.value)} 
          placeholder="ASIN、商品ID、URLを入力（1行に1つ）" 
          style={{ 
            width: '100%', 
            height: 200, 
            padding: 16, 
            fontSize: 13, 
            fontFamily: 'monospace',
            background: 'var(--bg)', 
            border: 'none', 
            color: 'var(--text)', 
            resize: 'vertical',
            outline: 'none' 
          }} 
        />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '12px 16px',
          borderTop: '1px solid var(--panel-border)',
          background: 'var(--highlight)'
        }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {parsedCount > 0 ? (
              <><strong style={{ color: 'var(--accent)' }}>{parsedCount}</strong>件のアイテム検出</>
            ) : (
              'アイテムを入力してください'
            )}
          </span>
          <N3Button
            variant="primary"
            size="sm"
            onClick={handleProcess}
            disabled={!parsedCount || processing}
            icon={processing ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
          >
            {processing ? '処理中...' : 'バッチ処理開始'}
          </N3Button>
        </div>
      </div>
    </div>
  );
}
