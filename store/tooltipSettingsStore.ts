/**
 * tooltipSettingsStore.ts
 * 
 * ツールチップの表示設定を管理するZustandストア
 * 
 * 機能:
 * - ツールチップのグローバル有効/無効
 * - localStorage永続化
 * - 動的なposition判定ユーティリティ
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ============================================================
// 型定義
// ============================================================

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipSettingsState {
  /** ツールチップ表示の有効/無効 */
  isTooltipEnabled: boolean;
  /** 表示遅延（ms） */
  tooltipDelay: number;
  /** 最大幅 */
  tooltipMaxWidth: number;
}

export interface TooltipSettingsActions {
  /** ツールチップの有効/無効を切り替え */
  toggleTooltips: () => void;
  /** ツールチップを有効化 */
  enableTooltips: () => void;
  /** ツールチップを無効化 */
  disableTooltips: () => void;
  /** 表示遅延を設定 */
  setTooltipDelay: (delay: number) => void;
  /** 最大幅を設定 */
  setTooltipMaxWidth: (width: number) => void;
  /** 設定をリセット */
  resetTooltipSettings: () => void;
}

type TooltipSettingsStore = TooltipSettingsState & TooltipSettingsActions;

// ============================================================
// 初期値
// ============================================================

const DEFAULT_STATE: TooltipSettingsState = {
  isTooltipEnabled: true,
  tooltipDelay: 300,
  tooltipMaxWidth: 280,
};

// ============================================================
// ストア作成
// ============================================================

export const useTooltipSettingsStore = create<TooltipSettingsStore>()(
  persist(
    (set) => ({
      // 初期状態
      ...DEFAULT_STATE,

      // アクション
      toggleTooltips: () => set((state) => ({ 
        isTooltipEnabled: !state.isTooltipEnabled 
      })),

      enableTooltips: () => set({ isTooltipEnabled: true }),

      disableTooltips: () => set({ isTooltipEnabled: false }),

      setTooltipDelay: (delay: number) => set({ 
        tooltipDelay: Math.max(0, Math.min(delay, 2000)) 
      }),

      setTooltipMaxWidth: (width: number) => set({ 
        tooltipMaxWidth: Math.max(100, Math.min(width, 500)) 
      }),

      resetTooltipSettings: () => set(DEFAULT_STATE),
    }),
    {
      name: 'n3-tooltip-settings',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);

// ============================================================
// ユーティリティ関数
// ============================================================

/**
 * 要素の画面位置に基づいてツールチップの表示方向を決定
 * 
 * @param element - 対象要素
 * @param preferredPosition - 優先表示方向（デフォルト: 'bottom'）
 * @returns 最適な表示方向
 */
export function getDynamicTooltipPosition(
  element: HTMLElement | null,
  preferredPosition: TooltipPosition = 'bottom'
): TooltipPosition {
  if (!element || typeof window === 'undefined') {
    return preferredPosition;
  }

  const rect = element.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // 画面端からのマージン（px）
  const MARGIN = 100;
  
  // 右端に近い場合は左に表示
  if (rect.right > viewportWidth - MARGIN) {
    return 'left';
  }
  
  // 左端に近い場合は右に表示
  if (rect.left < MARGIN) {
    return 'right';
  }
  
  // 上端に近い場合は下に表示
  if (rect.top < MARGIN) {
    return 'bottom';
  }
  
  // 下端に近い場合は上に表示
  if (rect.bottom > viewportHeight - MARGIN) {
    return 'top';
  }
  
  return preferredPosition;
}

/**
 * 画面領域に基づく推奨位置を取得（CSS Grid用）
 * 
 * @param areaName - 画面領域名（header, sidebar, main, footer）
 * @returns 推奨表示方向
 */
export function getAreaBasedPosition(areaName: 'header' | 'sidebar' | 'main' | 'footer'): TooltipPosition {
  switch (areaName) {
    case 'header':
      return 'bottom';
    case 'sidebar':
      return 'right';
    case 'footer':
      return 'top';
    case 'main':
    default:
      return 'bottom';
  }
}

// ============================================================
// セレクター（パフォーマンス最適化用）
// ============================================================

export const selectIsTooltipEnabled = (state: TooltipSettingsStore) => state.isTooltipEnabled;
export const selectTooltipDelay = (state: TooltipSettingsStore) => state.tooltipDelay;
export const selectTooltipMaxWidth = (state: TooltipSettingsStore) => state.tooltipMaxWidth;

// ============================================================
// フック（コンポーネント向け）
// ============================================================

/**
 * ツールチップ設定を取得するカスタムフック
 */
export function useTooltipSettings() {
  const isEnabled = useTooltipSettingsStore(selectIsTooltipEnabled);
  const delay = useTooltipSettingsStore(selectTooltipDelay);
  const maxWidth = useTooltipSettingsStore(selectTooltipMaxWidth);
  const toggle = useTooltipSettingsStore((state) => state.toggleTooltips);
  
  return {
    isEnabled,
    delay,
    maxWidth,
    toggle,
  };
}
