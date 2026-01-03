// app/tools/editing/config/bar-configs.ts
// バー管理システム - タブ切り替えとバー表示の連動ルール

export type BarType = "global" | "tab" | "tool" | "filter" | "status" | "context";

export type BarDisplayRule = {
  barId: string;                    // バーID（例: "bar-01", "bar-02"）
  barName: string;                  // バー名（例: "Tab Navigation", "Main Tool Bar"）
  barType: BarType;                 // バータイプ
  showOnTabs: "all" | string[];     // 表示するタブ（"all" または ["basic-edit", "logistics"]）
  height: number;                   // 固定高さ（px）
  collapsible: boolean;             // 折りたたみ可能か
  priority: number;                 // 表示優先度（1が最高）
  className?: string;               // CSSクラス
  showWhen?: {                      // 追加の表示条件
    hasSelection?: boolean;         // 選択された商品がある場合
    hasModified?: boolean;          // 修正された商品がある場合
    processing?: boolean;           // 処理中
  };
};

/**
 * Editing Toolのバー設定
 */
export const EDITING_BAR_CONFIG: BarDisplayRule[] = [
  {
    barId: "bar-01-tab-navigation",
    barName: "Tab Navigation",
    barType: "tab",
    showOnTabs: "all",
    height: 40,
    collapsible: false,
    priority: 1,
    className: "bar-tab-navigation",
  },
  {
    barId: "bar-02-main-toolbar",
    barName: "Main Tool Bar",
    barType: "tool",
    showOnTabs: "all",
    height: 80,
    collapsible: true,
    priority: 2,
    className: "bar-main-toolbar",
  },
  {
    barId: "bar-03-table-control",
    barName: "Table Control Bar",
    barType: "filter",
    showOnTabs: ["basic-edit"],
    height: 30,
    collapsible: false,
    priority: 3,
    className: "bar-table-control",
  },
];

/**
 * 指定されたタブでバーを表示すべきか判定
 */
export function shouldShowBar(
  bar: BarDisplayRule,
  activeTab: string,
  context?: {
    hasSelection?: boolean;
    hasModified?: boolean;
    processing?: boolean;
  }
): boolean {
  // タブ条件チェック
  const tabMatch = bar.showOnTabs === "all" || bar.showOnTabs.includes(activeTab);
  if (!tabMatch) return false;

  // 追加条件チェック
  if (bar.showWhen && context) {
    if (bar.showWhen.hasSelection !== undefined && context.hasSelection !== bar.showWhen.hasSelection) {
      return false;
    }
    if (bar.showWhen.hasModified !== undefined && context.hasModified !== bar.showWhen.hasModified) {
      return false;
    }
    if (bar.showWhen.processing !== undefined && context.processing !== bar.showWhen.processing) {
      return false;
    }
  }

  return true;
}

/**
 * バーの合計高さを計算
 */
export function calculateTotalBarHeight(
  activeTab: string,
  context?: Parameters<typeof shouldShowBar>[2]
): number {
  return EDITING_BAR_CONFIG
    .filter(bar => shouldShowBar(bar, activeTab, context))
    .reduce((sum, bar) => sum + bar.height, 0);
}

/**
 * アクティブなバーのリストを取得
 */
export function getActiveBars(
  activeTab: string,
  context?: Parameters<typeof shouldShowBar>[2]
): BarDisplayRule[] {
  return EDITING_BAR_CONFIG
    .filter(bar => shouldShowBar(bar, activeTab, context))
    .sort((a, b) => a.priority - b.priority);
}
