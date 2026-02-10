// lib/n8n/workflow-registry-extended.ts
/**
 * N3 Empire OS - 拡張ワークフローレジストリ
 * Blueprint 2.0 対応：高校生でも3秒で理解できる知能図鑑
 */

export type WorkflowKind = 'Brain' | 'Body' | 'Calculator';
export type TriggerType = 'Manual' | 'Cron' | 'Webhook';
export type ConnectionStatus = 'Linked' | 'Orphan';

export interface WorkflowConnection {
  ui: string;                    // どの画面のどのボタン（例：editing-n3 > 在庫タブ > 更新ボタン）
  trigger: TriggerType;          // トリガータイプ
  status: ConnectionStatus;      // 配線状況
  route?: string;                // APIルート
}

export interface N8nWorkflowExtended {
  // 基本情報
  id: string;
  nameJa: string;
  nameEn: string;
  
  // Blueprint 2.0 必須フィールド
  kind: WorkflowKind;            // Brain(AIエージェント) | Body(作業自動化) | Calculator(Python/計算)
  userStory: string;             // 「〇〇が〇〇した時に、〇〇を自動でやってくれるヤツ」
  connection: WorkflowConnection;
  
  // 技術情報
  category: string;
  webhookPath: string;
  version: string;
  
  // 詳細情報（サイドパネル用）
  role: string;                  // 「このエージェントは、〇〇を〇〇する知能です」
  inputOutput: {
    input: string;               // 入力データの説明
    output: string;              // 出力データの説明
  };
  dependencies?: string[];       // 親ワークフロー（リレーション用）
  children?: string[];           // サブエージェント（リレーション用）
}

// ============================================================
// ワークフロー定義（拡張版）
// ============================================================

export const WORKFLOWS_EXTENDED: N8nWorkflowExtended[] = [
  // ========================================
  // Brain (AIエージェント)
  // ========================================
  {
    id: 'ai-damage-inspector',
    nameJa: '鑑定士AI',
    nameEn: 'AI Damage Inspector',
    kind: 'Brain',
    userStory: 'カード画像をアップロードした時に、傷を0.1mm単位で自動判定してくれるヤツ',
    connection: {
      ui: 'editing-n3 > メディアタブ > AI鑑定ボタン',
      trigger: 'Manual',
      status: 'Linked',
      route: '/api/ai/damage-inspection',
    },
    category: 'ai',
    webhookPath: '/webhook/ai-damage-inspection',
    version: '2.0.0',
    role: 'このエージェントは、カードの傷を0.1mm単位で推論し、PSA10取得確率を算出する知能です',
    inputOutput: {
      input: '[画像データ（JPG/PNG）]',
      output: '[PSA10確率, 傷位置座標, 修正提案]',
    },
    children: ['gemini-vision-api', 'claude-vision-fallback'],
  },
  
  {
    id: 'pricing-strategist-ai',
    nameJa: '価格軍師AI',
    nameEn: 'Pricing Strategist AI',
    kind: 'Brain',
    userStory: '出品時に、eBay/Amazonの競合を自動スキャンして最適価格を提案してくれるヤツ',
    connection: {
      ui: 'listing-n3 > 価格タブ > AI価格提案ボタン',
      trigger: 'Manual',
      status: 'Linked',
      route: '/api/ai/pricing-strategy',
    },
    category: 'ai',
    webhookPath: '/webhook/ai-pricing-strategy',
    version: '1.5.0',
    role: 'このエージェントは、競合10社の価格を瞬時に分析し、売れる確率が最も高い価格を提案する知能です',
    inputOutput: {
      input: '[商品名, カテゴリ, コンディション]',
      output: '[推奨価格, 競合平均, 利益率予測]',
    },
    dependencies: ['seller-mirror-scraper'],
  },
  
  // ========================================
  // Body (作業自動化)
  // ========================================
  {
    id: 'listing-reserve',
    nameJa: '出品予約',
    nameEn: 'Listing Reserve',
    kind: 'Body',
    userStory: '「出品」ボタンを押した時に、商品データをeBay/Amazonに自動送信してくれるヤツ',
    connection: {
      ui: 'editing-n3 > マスタータブ > 出品ボタン',
      trigger: 'Manual',
      status: 'Linked',
      route: '/webhook/listing-reserve',
    },
    category: 'listing',
    webhookPath: '/webhook/listing-reserve',
    version: '1.0.0',
    role: 'このワークフローは、選択した商品を指定マーケットプレイスに自動出品する作業ロボットです',
    inputOutput: {
      input: '[商品ID配列, マーケットプレイス, アカウント]',
      output: '[出品URL, ステータス, エラーログ]',
    },
    children: ['ebay-listing-core', 'amazon-listing-core'],
  },
  
  {
    id: 'inventory-sync',
    nameJa: '在庫同期',
    nameEn: 'Inventory Sync',
    kind: 'Body',
    userStory: '30分ごとに、Supabaseの在庫数とeBay/Amazonの在庫数を自動で合わせてくれるヤツ',
    connection: {
      ui: 'なし（自動実行）',
      trigger: 'Cron',
      status: 'Linked',
      route: '/webhook/inventory-sync',
    },
    category: 'inventory',
    webhookPath: '/webhook/inventory-sync',
    version: '1.0.0',
    role: 'このワークフローは、全マーケットプレイスの在庫数を30分ごとに同期する見張り番です',
    inputOutput: {
      input: '[なし（自動実行）]',
      output: '[同期件数, エラー商品リスト, 実行時刻]',
    },
  },
  
  {
    id: 'batch-publish',
    nameJa: 'バッチ出品',
    nameEn: 'Batch Publish',
    kind: 'Body',
    userStory: '大量の商品を一括で出品したい時に、1件ずつ自動処理してくれるヤツ',
    connection: {
      ui: 'editing-n3 > マスタータブ > 一括出品ボタン',
      trigger: 'Manual',
      status: 'Linked',
      route: '/webhook/listing-batch',
    },
    category: 'listing',
    webhookPath: '/webhook/listing-batch',
    version: '1.0.0',
    role: 'このワークフローは、最大1000件の商品を順次出品処理する大量作業ロボットです',
    inputOutput: {
      input: '[商品ID配列（最大1000件）]',
      output: '[成功件数, 失敗件数, 所要時間]',
    },
    dependencies: ['listing-reserve'],
  },
  
  // ========================================
  // Calculator (Python/計算)
  // ========================================
  {
    id: 'profit-calculator',
    nameJa: '利益計算機',
    nameEn: 'Profit Calculator',
    kind: 'Calculator',
    userStory: '販売価格を入力した時に、手数料・送料・関税を全部引いて純利益を計算してくれるヤツ',
    connection: {
      ui: 'editing-n3 > 価格タブ > 利益計算ボタン',
      trigger: 'Manual',
      status: 'Linked',
      route: '/api/calculator/profit',
    },
    category: 'pricing',
    webhookPath: '/webhook/profit-calculator',
    version: '3.0.0',
    role: 'このツールは、複雑な手数料体系（eBay/PayPal/FedEx/関税）を瞬時に計算する電卓です',
    inputOutput: {
      input: '[販売価格, 仕入れ価格, 送料, マーケットプレイス]',
      output: '[純利益, 利益率, 手数料内訳]',
    },
  },
  
  {
    id: 'hts-classifier',
    nameJa: 'HTS分類器',
    nameEn: 'HTS Classifier',
    kind: 'Calculator',
    userStory: '商品名を入れた時に、HSコード（関税番号）を自動で探してくれるヤツ',
    connection: {
      ui: 'editing-n3 > コンプライアンスタブ > HTS自動分類ボタン',
      trigger: 'Manual',
      status: 'Linked',
      route: '/api/calculator/hts-classification',
    },
    category: 'compliance',
    webhookPath: '/webhook/hts-classification',
    version: '2.1.0',
    role: 'このツールは、10,000以上のHSコードから最適なコードをAI推論で選定するロボットです',
    inputOutput: {
      input: '[商品名, カテゴリ, 素材]',
      output: '[HSコード6桁, 信頼度スコア, 関税率]',
    },
  },
  
  // ========================================
  // Orphan (野良・UI未接続)
  // ========================================
  {
    id: 'legacy-scraper',
    nameJa: '旧スクレイパー',
    nameEn: 'Legacy Scraper',
    kind: 'Body',
    userStory: '（不明：UIボタンと接続されていない野良ワークフロー）',
    connection: {
      ui: 'なし（野良）',
      trigger: 'Webhook',
      status: 'Orphan',
    },
    category: 'other',
    webhookPath: '/webhook/legacy-scraper',
    version: '0.9.0',
    role: '用途不明の旧システムです。削除推奨。',
    inputOutput: {
      input: '[不明]',
      output: '[不明]',
    },
  },
];

// ============================================================
// ヘルパー関数
// ============================================================

export function getWorkflowsByKind(kind: WorkflowKind): N8nWorkflowExtended[] {
  return WORKFLOWS_EXTENDED.filter(w => w.kind === kind);
}

export function getLinkedWorkflows(): N8nWorkflowExtended[] {
  return WORKFLOWS_EXTENDED.filter(w => w.connection.status === 'Linked');
}

export function getOrphanWorkflows(): N8nWorkflowExtended[] {
  return WORKFLOWS_EXTENDED.filter(w => w.connection.status === 'Orphan');
}

export function getWorkflowById(id: string): N8nWorkflowExtended | undefined {
  return WORKFLOWS_EXTENDED.find(w => w.id === id);
}

export function getWorkflowStats() {
  const total = WORKFLOWS_EXTENDED.length;
  const byKind = {
    Brain: getWorkflowsByKind('Brain').length,
    Body: getWorkflowsByKind('Body').length,
    Calculator: getWorkflowsByKind('Calculator').length,
  };
  const byStatus = {
    Linked: getLinkedWorkflows().length,
    Orphan: getOrphanWorkflows().length,
  };
  
  return { total, byKind, byStatus };
}
