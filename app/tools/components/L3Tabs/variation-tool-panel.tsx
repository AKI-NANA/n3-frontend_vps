// app/tools/editing-n3/components/L3Tabs/variation-tool-panel.tsx
/**
 * バリエーションタブ用ツールパネル
 * 
 * 機能:
 * - 候補検出
 * - バリエーション作成
 * - 統計表示
 */

'use client';

import React from 'react';
import { 
  Search,
  Layers,
  X,
  Info,
} from 'lucide-react';
import { N3Button, N3Divider, N3Tooltip } from '@/components/n3';
import { N3StatsGrid, N3StatItem } from '@/components/n3/container/N3StatsGrid';

interface VariationToolPanelProps {
  stats: {
    parentCount: number;
    memberCount: number;
    standaloneCount: number;
    candidateCount: number;
  };
  loading: boolean;
  selectedCount: number;
  showCandidatesOnly: boolean;
  onDetectCandidates: () => void;
  onToggleCandidatesOnly: () => void;
  onCreateVariation: () => void;
  onClearSelection: () => void;
}

export function VariationToolPanel({
  stats,
  loading,
  selectedCount,
  showCandidatesOnly,
  onDetectCandidates,
  onToggleCandidatesOnly,
  onCreateVariation,
  onClearSelection,
}: VariationToolPanelProps) {
  return (
    <div style={{ padding: '8px 12px' }}>
      {/* ツールバー行 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 8,
      }}>
        <N3Tooltip content="グルーピング候補を検出">
          <N3Button
            size="sm"
            variant="secondary"
            onClick={onDetectCandidates}
            disabled={loading}
          >
            <Search size={14} />
            候補検出
          </N3Button>
        </N3Tooltip>
        
        <N3Button
          size="sm"
          variant={showCandidatesOnly ? 'primary' : 'ghost'}
          onClick={onToggleCandidatesOnly}
        >
          候補のみ表示
        </N3Button>
        
        <N3Divider orientation="vertical" style={{ height: 20 }} />
        
        <N3Tooltip content="選択した商品でバリエーションを作成（2件以上必要）">
          <N3Button
            size="sm"
            variant="primary"
            onClick={onCreateVariation}
            disabled={loading || selectedCount < 2}
          >
            <Layers size={14} />
            バリエーション作成
            {selectedCount > 0 && ` (${selectedCount})`}
          </N3Button>
        </N3Tooltip>
        
        {selectedCount > 0 && (
          <N3Button
            size="sm"
            variant="ghost"
            onClick={onClearSelection}
          >
            <X size={14} />
            選択解除
          </N3Button>
        )}
      </div>

      {/* ヒント行 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: 'rgba(59, 130, 246, 0.05)',
        borderRadius: 4,
        marginBottom: 12,
        fontSize: 11,
        color: 'var(--text-muted)',
      }}>
        <Info size={12} style={{ color: 'rgb(59, 130, 246)' }} />
        <span>
          同一カテゴリの商品をバリエーションにまとめると、DDP最適化で送料を削減できます。
        </span>
      </div>

      {/* 統計行 */}
      <N3StatsGrid columns={4} gap={8} size="compact">
        <N3StatItem
          label="親商品"
          value={stats.parentCount}
          color="purple"
        />
        <N3StatItem
          label="子商品"
          value={stats.memberCount}
          color="blue"
        />
        <N3StatItem
          label="単体"
          value={stats.standaloneCount}
          color="default"
        />
        <N3StatItem
          label="候補"
          value={stats.candidateCount}
          color="green"
        />
      </N3StatsGrid>
    </div>
  );
}
