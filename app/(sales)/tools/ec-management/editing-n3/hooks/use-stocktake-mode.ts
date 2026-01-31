// app/tools/editing-n3/hooks/use-stocktake-mode.ts
/**
 * 棚卸しモードを検出するフック
 * 
 * URLパラメータ ?mode=stocktake で棚卸しモードを有効化
 * 棚卸しモードでは：
 * - サイドバー非表示
 * - L2タブ非表示（基本編集のみ）
 * - フィルタータブは「マスター」のみ表示
 * - ツールパネルは最小限
 * - カードに保管場所・写真・在庫数のみ表示
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export interface StocktakeModeConfig {
  /** 棚卸しモードが有効かどうか */
  isStocktakeMode: boolean;
  /** サイドバーを表示するか */
  showSidebar: boolean;
  /** L2タブを表示するか */
  showL2Tabs: boolean;
  /** ヘッダーを表示するか（時計、通貨等） */
  showFullHeader: boolean;
  /** ツールパネルを表示するか */
  showToolPanel: boolean;
  /** 編集可能な項目 */
  editableFields: string[];
  /** 表示するフィルタータブ */
  visibleFilterTabs: string[];
  /** 担当者名（URLパラメータから） */
  workerName: string | null;
}

export function useStocktakeMode(): StocktakeModeConfig {
  const searchParams = useSearchParams();
  
  return useMemo(() => {
    const mode = searchParams.get('mode');
    const workerName = searchParams.get('worker');
    const isStocktakeMode = mode === 'stocktake';
    
    if (isStocktakeMode) {
      return {
        isStocktakeMode: true,
        showSidebar: false,
        showL2Tabs: false,
        showFullHeader: false,
        showToolPanel: false,
        editableFields: ['physical_quantity', 'storage_location', 'inventory_images'],
        visibleFilterTabs: ['in_stock_master'],
        workerName: workerName || null,
      };
    }
    
    // 通常モード
    return {
      isStocktakeMode: false,
      showSidebar: true,
      showL2Tabs: true,
      showFullHeader: true,
      showToolPanel: true,
      editableFields: [], // 全て編集可能
      visibleFilterTabs: [], // 全て表示
      workerName: null,
    };
  }, [searchParams]);
}

export default useStocktakeMode;
