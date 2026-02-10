// app/test-tooltip/page.tsx
/**
 * ツールチップテストページ
 */

'use client';

import React from 'react';
import { N3Tooltip, N3FeatureTooltip, N3TooltipToggle } from '@/components/n3';
import { useTooltipSettingsStore, selectIsTooltipEnabled } from '@/store/tooltipSettingsStore';

export default function TestTooltipPage() {
  const isEnabled = useTooltipSettingsStore(selectIsTooltipEnabled);
  
  return (
    <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1>ツールチップテスト</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>現在の状態: {isEnabled ? '✅ ON' : '❌ OFF'}</span>
        <N3TooltipToggle />
      </div>
      
      <hr />
      
      <h2>基本ツールチップ（N3Tooltip）</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <N3Tooltip content="これはテストツールチップです" position="top">
          <button style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            上に表示
          </button>
        </N3Tooltip>
        
        <N3Tooltip content="下に表示されるツールチップ" position="bottom">
          <button style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            下に表示
          </button>
        </N3Tooltip>
        
        <N3Tooltip content="左に表示されるツールチップ" position="left">
          <button style={{ padding: '8px 16px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            左に表示
          </button>
        </N3Tooltip>
        
        <N3Tooltip content="右に表示されるツールチップ" position="right">
          <button style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            右に表示
          </button>
        </N3Tooltip>
      </div>
      
      <hr />
      
      <h2>機能解説ツールチップ（N3FeatureTooltip）</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        <N3FeatureTooltip
          title="Run All / スマート実行"
          description="選択した商品に対して、翻訳・送料計算・利益計算をまとめて実行します。"
          hint="選択商品が多い場合は時間がかかります"
          position="bottom"
        >
          <button style={{ padding: '8px 16px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Run All（ホバーしてください）
          </button>
        </N3FeatureTooltip>
        
        <N3FeatureTooltip
          title="保存 / Save"
          description="現在の変更をデータベースに保存します。"
          hint="バッジの数字が未保存の変更件数です"
          position="bottom"
        >
          <button style={{ padding: '8px 16px', background: '#06b6d4', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Save（ホバーしてください）
          </button>
        </N3FeatureTooltip>
      </div>
      
      <hr />
      
      <h2>forceShow=true（常に表示）</h2>
      <N3Tooltip content="これは常に表示されます（forceShow=true）" position="bottom" forceShow>
        <button style={{ padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          常に表示
        </button>
      </N3Tooltip>
      
      <hr />
      
      <h2>デバッグ情報</h2>
      <pre style={{ padding: 16, background: '#f1f5f9', borderRadius: 8, fontSize: 12 }}>
        {JSON.stringify({
          isEnabled,
          localStorage: typeof window !== 'undefined' ? localStorage.getItem('n3-tooltip-settings') : 'N/A',
        }, null, 2)}
      </pre>
    </div>
  );
}
