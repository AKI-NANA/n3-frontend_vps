/**
 * tooltip-contents.ts
 * 
 * N3ツールの全ボタンに対するツールチップ内容を定義
 * 
 * 設計原則:
 * - 単なるボタン名ではなく「何が起きるか」を具体的に記述
 * - 💡 ヒントで次にやるべきことを助言
 * - 機能カテゴリごとにグループ化
 */

// ============================================================
// ツールチップ内容の型定義
// ============================================================

export interface TooltipContent {
  /** 機能タイトル */
  title: string;
  /** 機能の説明 */
  description: string;
  /** 追加ヒント（オプション） */
  hint?: string;
}

// ============================================================
// メインツールバー - クイックアクション
// ============================================================

export const QUICK_ACTION_TOOLTIPS: Record<string, TooltipContent> = {
  runAll: {
    title: 'Run All / スマート実行',
    description: '翻訳から計算まで、不足している全工程をAIが判断して一括実行します。',
    hint: '選択商品が多い場合は時間がかかります',
  },
  paste: {
    title: '貼り付け (Paste)',
    description: 'Excelやスプレッドシートからコピーした商品データを貼り付けて新規登録します。',
    hint: 'タブ区切りのテキストを受け付けます',
  },
  reload: {
    title: '再読み込み (Reload)',
    description: 'データベースから最新の商品データを再取得し、画面を更新します。',
    hint: '変更が反映されない場合に使用',
  },
  csv: {
    title: 'CSVアップロード',
    description: 'CSVファイルから商品データを一括インポートします。',
    hint: 'テンプレートに沿った形式で準備してください',
  },
};

// ============================================================
// メインツールバー - 処理ボタン
// ============================================================

export const PROCESSING_TOOLTIPS: Record<string, TooltipContent> = {
  category: {
    title: 'カテゴリ分類 (Cat)',
    description: '商品タイトルと説明から最適なeBayカテゴリを自動推定します。',
    hint: 'Item Specificsにも影響します',
  },
  shipping: {
    title: '送料計算 (Ship)',
    description: '設定された重量と配送ポリシーから、最も正確な送料を算出します。',
    hint: '重量が未入力の商品はスキップされます',
  },
  profit: {
    title: '利益計算 (Profit)',
    description: '最新の原価・送料・関税に基づき、DDP販売価格と利益率を算出します。',
    hint: '為替レートは自動取得されます',
  },
  html: {
    title: 'HTML説明文生成',
    description: 'eBay用のリッチHTML説明文をテンプレートから自動生成します。',
    hint: 'テンプレートは設定で変更可能',
  },
  score: {
    title: '監査 (Score)',
    description: '全データの整合性をチェックし、出品可能な状態かスコア化します。',
    hint: 'スコア80以上で出品推奨',
  },
};

// ============================================================
// メインツールバー - HTS & データ補完
// ============================================================

export const DATA_TOOLTIPS: Record<string, TooltipContent> = {
  hts: {
    title: 'HTS判定',
    description: 'カテゴリ定義に基づき、輸出に必要なHSコード（関税分類番号）を特定します。',
    hint: '関税率計算の基礎データになります',
  },
  origin: {
    title: '原産国取得 (Origin)',
    description: '商品情報から製造国・原産国を推定し、COO（Country of Origin）を設定します。',
    hint: 'VERO判定にも使用されます',
  },
  material: {
    title: '素材取得 (Material)',
    description: '商品説明から主要な素材情報を抽出し、Item Specificsに設定します。',
    hint: 'HTS判定の精度向上に役立ちます',
  },
  filter: {
    title: 'フィルターチェック',
    description: '出品可能条件をチェックし、VERO違反やポリシー違反を検出します。',
    hint: '赤旗が表示された商品は要確認',
  },
};

// ============================================================
// メインツールバー - リサーチ & AI
// ============================================================

export const RESEARCH_TOOLTIPS: Record<string, TooltipContent> = {
  research: {
    title: '市場リサーチ (Research)',
    description: '選択商品の市場データを収集し、競合価格や販売実績を分析します。',
    hint: 'eBay / Amazon / ヤフオクが対象',
  },
  ai: {
    title: 'AI強化',
    description: 'AIがタイトル・説明文を最適化し、SEOに有利なキーワードを提案します。',
    hint: 'Gemini APIを使用します',
  },
};

// ============================================================
// フローパネル - ステップ別処理
// ============================================================

export const FLOW_TOOLTIPS: Record<string, TooltipContent> = {
  translate: {
    title: '① 翻訳',
    description: '日本語タイトルをGoogle翻訳で英語に変換します（無料API）。',
    hint: '翻訳済みの商品はスキップされます',
  },
  sellerMirror: {
    title: '② SM検索',
    description: 'ヤフオク等から類似商品を検索し、重量やサイズの候補を取得します。',
    hint: '検索キーワードは自動生成されます',
  },
  details: {
    title: '③ SM選択',
    description: '取得した仕入れ先候補の中から、人間が1つを確定させます（手動）。',
    hint: 'チェックマークで候補を選択してください',
  },
  gemini: {
    title: '④ AI強化 (Gemini)',
    description: 'AI（Gemini）がHTSコード、素材、重量の不足分を推論・補完します。',
    hint: 'APIキーが設定されている必要があります',
  },
  finalProcess: {
    title: '⑤ 処理 (Calc)',
    description: '送料計算→利益計算→HTML生成→スコア計算を一括実行します。',
    hint: '最終チェック前の仕上げ処理',
  },
  list: {
    title: '⑥ 出品 (List)',
    description: '最終確認モーダルを開き、eBayへの予約または即時出品を実行します。',
    hint: 'スコア80以上の商品のみ出品可能',
  },
  enrichmentFlow: {
    title: '0 AI強化フロー',
    description: 'SM分析→競合選択→AI強化を1つのフローで実行します。',
    hint: '1商品ずつの詳細処理に最適',
  },
};

// ============================================================
// アクションボタン
// ============================================================

export const ACTION_TOOLTIPS: Record<string, TooltipContent> = {
  save: {
    title: '保存 (Save)',
    description: '編集した内容をデータベースに保存します。',
    hint: 'バッジの数字が未保存の変更件数です',
  },
  delete: {
    title: '削除 (Delete)',
    description: '選択した商品をデータベースから削除します。',
    hint: '削除は取り消せません',
  },
  export: {
    title: 'エクスポート (Export)',
    description: '選択商品をCSV / eBay形式 / AI分析用形式で出力します。',
  },
  exportCSV: {
    title: 'CSV All',
    description: '全フィールドを含むCSVファイルをダウンロードします。',
  },
  exportEbay: {
    title: 'eBay Format',
    description: 'eBay File Exchange形式のCSVを生成します。',
    hint: 'Seller Hub→File Exchangeで使用可能',
  },
  exportAI: {
    title: 'AI Export',
    description: 'AI分析用のプロンプトとデータを生成します。',
    hint: 'Claude / ChatGPT / Geminiで使用可能',
  },
};

// ============================================================
// サブツールバー
// ============================================================

export const SUBTOOLBAR_TOOLTIPS: Record<string, TooltipContent> = {
  smartProcess: {
    title: 'スマート一括処理',
    description: '選択商品のフェーズを自動判定し、最適な処理を実行します。',
    hint: '翻訳待ち→翻訳、SM検索待ち→SM分析...',
  },
  bulkAudit: {
    title: '一括監査',
    description: '選択商品のデータ完全性を一括チェックし、問題点をリストアップします。',
    hint: 'HTS/原産国/重量/利益率の妥当性を確認',
  },
  tips: {
    title: 'Tips表示切替',
    description: 'ONにすると各項目にヒント・説明が表示されます。',
    hint: '初心者はONを推奨',
  },
  fast: {
    title: '高速モード (Fast)',
    description: 'ONにすると展開パネルを無効化し、リスト表示を高速化します。',
    hint: '大量データ閲覧時に有効',
  },
  pageSize: {
    title: '表示件数',
    description: '1ページに表示する商品数を変更します。',
    hint: '10/50/100/500件から選択',
  },
  sort: {
    title: '並び替え',
    description: '商品リストの表示順を変更します。',
    hint: '登録日/更新日/SKU/原価で並替',
  },
  viewMode: {
    title: '表示モード',
    description: 'リスト表示とカード表示を切り替えます。',
    hint: '承認作業はカード表示が便利',
  },
  phaseSummary: {
    title: 'フェーズサマリー',
    description: 'クリックすると該当フェーズの商品だけ表示されます。',
    hint: '①翻訳待ち ②SM検索待ち ③SM選択待ち...',
  },
};

// ============================================================
// ヘッダーボタン
// ============================================================

export const HEADER_TOOLTIPS: Record<string, TooltipContent> = {
  listNow: {
    title: '今すぐ出品',
    description: '選択した商品を即座にeBayに出品します。',
    hint: '承認済み（approved）の商品のみ対象',
  },
  sheet: {
    title: 'スプレッドシート',
    description: '棚卸し用Googleスプレッドシートを新しいタブで開きます。',
  },
  supabase: {
    title: 'Supabase Dashboard',
    description: 'データベース管理画面を新しいタブで開きます。',
    hint: '直接SQLを実行可能',
  },
  outsourceTool: {
    title: '外注ツール',
    description: '外注スタッフ用の棚卸しツールを開きます。',
    hint: 'バーコードスキャン対応',
  },
  theme: {
    title: 'テーマ切替',
    description: 'カラーテーマを切り替えます（Dawn/Light/Dark/Cyber）。',
  },
  language: {
    title: '言語切替',
    description: 'UIの表示言語を日本語/英語で切り替えます。',
  },
  search: {
    title: 'グローバル検索',
    description: 'SKU・タイトルで商品を検索します。',
    hint: '⌘K でショートカット',
  },
};

// ============================================================
// 棚卸しタブ専用
// ============================================================

export const INVENTORY_TOOLTIPS: Record<string, TooltipContent> = {
  syncIncremental: {
    title: '差分同期',
    description: 'eBayの変更があった商品のみを同期します（高速）。',
    hint: '通常はこちらを使用',
  },
  syncFull: {
    title: '完全同期',
    description: 'eBayの全出品を再取得して同期します（時間がかかります）。',
    hint: 'データ不整合が疑われる場合に使用',
  },
  syncMercari: {
    title: 'メルカリ同期',
    description: 'メルカリの出品データを同期します。',
  },
  newProduct: {
    title: '新規商品登録',
    description: '手動で新しい商品を登録します。',
    hint: 'SKUは自動採番されます',
  },
  bulkImageUpload: {
    title: '一括画像アップロード',
    description: '複数商品の画像をまとめてアップロードします。',
    hint: 'ファイル名でSKUを照合',
  },
  detectCandidates: {
    title: 'グループ化候補検出',
    description: '同一商品のバリエーション候補を自動検出します。',
    hint: 'タイトル・カテゴリで類似判定',
  },
  createVariation: {
    title: 'バリエーション作成',
    description: '選択した商品を1つのバリエーション親商品にまとめます。',
    hint: '2件以上選択してください',
  },
  createSet: {
    title: 'セット作成',
    description: '選択した商品をセット商品として登録します。',
    hint: '2件以上選択してください',
  },
  imageAttach: {
    title: '画像追加',
    description: '画像なしの商品に画像を追加します。',
    hint: 'ファイルをドラッグ＆ドロップ',
  },
  deleteSelected: {
    title: '選択削除',
    description: '選択した商品をデータベースから削除します。',
    hint: '削除は取り消せません',
  },
  deleteOutOfStock: {
    title: '在庫0削除',
    description: '在庫数が0の商品をすべて一括削除します。',
    hint: '売切れ商品の整理に使用',
  },
};

// ============================================================
// 承認タブ専用
// ============================================================

export const APPROVAL_TOOLTIPS: Record<string, TooltipContent> = {
  selectAll: {
    title: '全選択',
    description: '表示中の全商品を選択状態にします。',
  },
  deselectAll: {
    title: '選択解除',
    description: '全ての選択を解除します。',
  },
  approve: {
    title: '承認',
    description: '選択した商品を「承認済み」状態に変更します。',
    hint: '承認後は出品可能になります',
  },
  reject: {
    title: '却下',
    description: '選択した商品を「却下」状態に戻します。',
    hint: 'データ修正が必要な商品に使用',
  },
  scheduleListing: {
    title: 'スケジュール出品',
    description: '承認済み商品を出品スケジュールに追加します。',
    hint: 'n8nワークフローで自動出品',
  },
};

// ============================================================
// マーケットプレイス選択
// ============================================================

export const MARKETPLACE_TOOLTIPS: Record<string, TooltipContent> = {
  ebay: {
    title: 'eBay',
    description: '海外販売：為替計算・関税・DDP/DDU国際送料を考慮した利益計算',
    hint: 'メイン販路',
  },
  all: {
    title: '全販路比較',
    description: '全販路で一括計算し、最も利益率の高いモールを提案します。',
  },
  qoo10: {
    title: 'Qoo10',
    description: '国内販売：手数料12%+3.5%・国内送料で計算',
  },
  amazon: {
    title: 'Amazon JP',
    description: '国内販売：FBA手数料15%・フルフィルメント手数料込み',
  },
  mercari: {
    title: 'メルカリ',
    description: '国内販売：手数料10%・匿名配送',
  },
  yahooAuction: {
    title: 'ヤフオク',
    description: '国内販売：落札手数料8.8%・ヤフネコ送料',
  },
};

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * 全てのツールチップをマージして1つのオブジェクトとして取得
 */
export function getAllTooltips(): Record<string, TooltipContent> {
  return {
    ...QUICK_ACTION_TOOLTIPS,
    ...PROCESSING_TOOLTIPS,
    ...DATA_TOOLTIPS,
    ...RESEARCH_TOOLTIPS,
    ...FLOW_TOOLTIPS,
    ...ACTION_TOOLTIPS,
    ...SUBTOOLBAR_TOOLTIPS,
    ...HEADER_TOOLTIPS,
    ...INVENTORY_TOOLTIPS,
    ...APPROVAL_TOOLTIPS,
    ...MARKETPLACE_TOOLTIPS,
  };
}

/**
 * IDからツールチップ内容を取得
 */
export function getTooltipContent(id: string): TooltipContent | undefined {
  const all = getAllTooltips();
  return all[id];
}
