// app/tools/editing/config/button-status.ts
// ボタンの実装状況を管理する設定ファイル

export type ButtonStatus = {
  implemented: boolean;
  borderColor: string;
  hoverColor: string;
  tooltip?: string;
};

export const BUTTON_STATUS_MAP: Record<string, ButtonStatus> = {
  // ✅ 実装済み（緑・薄く）
  runAll: {
    implemented: true,
    borderColor: "#10b98125",  // emerald-500 15%透明度
    hoverColor: "#10b98140",   // emerald-500 25%透明度
    tooltip: "✅ 実装済み - 全処理を一括実行"
  },
  reload: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - Supabaseから最新データを再読み込み"
  },
  save: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 変更をSupabaseに保存"
  },
  category: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - eBayカテゴリ分類（/api/tools/category-analyze）"
  },
  shipping: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 送料計算（/api/tools/shipping-calculate）"
  },
  profit: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 利益計算（/api/tools/profit-calculate）"
  },
  html: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - HTML生成（/api/tools/html-generate）"
  },
  sellerMirror: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - SellerMirror分析（/api/sellermirror/analyze）"
  },
  translate: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 翻訳（/api/tools/translate-product）"
  },
  score: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - スコア計算（/api/score/calculate）"
  },
  filter: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - フィルターチェック（/api/filter-check）"
  },
  research: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 市場リサーチ（/api/research）"
  },
  hts: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - HTS推定（/api/hts/estimate）"
  },
  origin: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 原産国取得（/api/hts/lookup-duty-rates）"
  },
  details: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 詳細取得（/api/sellermirror/batch-details）"
  },
  delete: {
    implemented: true,
    borderColor: "#10b98125",
    hoverColor: "#10b98140",
    tooltip: "✅ 実装済み - 削除（/api/products/[id] DELETE）"
  },

  // ❌ 未実装（ピンク・薄く）
  paste: {
    implemented: false,
    borderColor: "#f472b625",  // pink-400 15%透明度
    hoverColor: "#f472b640",   // pink-400 25%透明度
    tooltip: "⚠️ 未実装 - クリップボード貼り付け"
  },
  csv: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - CSVアップロード機能"
  },
  material: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - 素材情報取得"
  },
  ai: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - AI強化（説明文・キーワード生成）"
  },
  gemini: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - Gemini用プロンプト生成"
  },
  finalProcess: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - 最終処理チェーン実行"
  },
  list: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - 準備完了商品をeBayに出品"
  },
  export: {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 未実装 - エクスポートメニュー"
  },
};

export function getButtonStatus(buttonKey: string): ButtonStatus {
  return BUTTON_STATUS_MAP[buttonKey] || {
    implemented: false,
    borderColor: "#f472b625",
    hoverColor: "#f472b640",
    tooltip: "⚠️ 実装状況不明"
  };
}
