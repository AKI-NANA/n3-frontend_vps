// app/tools/editing/components/layouts/toolbar-selector.tsx
/**
 * ToolbarSelector - どのツールバーを表示するか選ぶタブ
 * 
 * 選択肢:
 * - tools: ToolPanel（Run All, Paste, Cat, Ship...）
 * - flow: FLOWパネル（翻訳→SM→詳細→Gemini→処理→出品）
 * - filter: フィルタータブ（全商品, データ編集, 承認待ち...）
 * - none: 全て非表示（データテーブルを最大化）
 */

'use client';

import { memo } from 'react';
import {
  Wrench,
  GitBranch,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export type ToolbarMode = 'tools' | 'flow' | 'filter' | 'none';

interface ToolbarOption {
  id: ToolbarMode;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const TOOLBAR_OPTIONS: ToolbarOption[] = [
  {
    id: 'tools',
    label: 'ツール',
    icon: <Wrench size={12} />,
    description: 'Run All, Paste, Cat, Ship, Profit...'
  },
  {
    id: 'flow',
    label: 'FLOW',
    icon: <GitBranch size={12} />,
    description: '翻訳→SM→詳細→Gemini→処理→出品'
  },
  {
    id: 'filter',
    label: 'フィルター',
    icon: <Filter size={12} />,
    description: '全商品, データ編集, 承認待ち...'
  }
];

interface ToolbarSelectorProps {
  /** 現在選択されているモード */
  activeMode: ToolbarMode;
  /** モード変更時のコールバック */
  onModeChange: (mode: ToolbarMode) => void;
  /** 複数選択を許可するか */
  multiSelect?: boolean;
  /** 複数選択時のアクティブモード（Set） */
  activeModes?: Set<ToolbarMode>;
  /** 複数選択時のトグルコールバック */
  onModeToggle?: (mode: ToolbarMode) => void;
}

export const ToolbarSelector = memo(function ToolbarSelector({
  activeMode,
  onModeChange,
  multiSelect = false,
  activeModes,
  onModeToggle
}: ToolbarSelectorProps) {
  
  // 単一選択モード
  if (!multiSelect) {
    return (
      <div className="n3-toolbar-selector">
        {TOOLBAR_OPTIONS.map((option) => {
          const isActive = activeMode === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onModeChange(isActive ? 'none' : option.id)}
              className={`n3-toolbar-selector__item ${isActive ? 'active' : ''}`}
              title={option.description}
            >
              {option.icon}
              <span>{option.label}</span>
              {isActive && <ChevronUp size={10} />}
            </button>
          );
        })}
        
        {/* 全て閉じるボタン */}
        {activeMode !== 'none' && (
          <button
            onClick={() => onModeChange('none')}
            className="n3-toolbar-selector__close"
            title="全て閉じる"
          >
            <X size={12} />
          </button>
        )}
      </div>
    );
  }
  
  // 複数選択モード（将来用）
  return (
    <div className="n3-toolbar-selector n3-toolbar-selector--multi">
      {TOOLBAR_OPTIONS.map((option) => {
        const isActive = activeModes?.has(option.id) ?? false;
        
        return (
          <button
            key={option.id}
            onClick={() => onModeToggle?.(option.id)}
            className={`n3-toolbar-selector__item ${isActive ? 'active' : ''}`}
            title={option.description}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
});

export { TOOLBAR_OPTIONS };
