// app/tools/research-table/types/research.ts
/**
 * リサーチテーブル用型定義
 */

export type WorkflowType = 'reverse' | 'forward' | 'arbitrage' | 'ai_proposal';

export type ResearchStatus = 'pending' | 'approved' | 'rejected' | 'processing';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface ResearchItem {
  id: string;
  title: string;
  title_en?: string;
  source: 'yahoo_auction' | 'mercari' | 'rakuten' | 'amazon_jp' | 'manual';
  source_url?: string;
  source_item_id?: string;
  image_url?: string;
  
  // 価格情報
  buy_price: number;
  sell_price?: number;
  profit?: number;
  profit_margin?: number;
  
  // スコア・評価
  n3_score?: number;
  ai_confidence?: number;
  seo_score?: number;
  risk_level?: RiskLevel;
  
  // ステータス
  status: ResearchStatus;
  workflow_type: WorkflowType;
  
  // 日時
  created_at: string;
  updated_at: string;
  approved_at?: string;
  
  // その他
  category?: string;
  brand?: string;
  condition?: string;
  notes?: string;
  
  // 拡張データ
  metadata?: Record<string, unknown>;
}

export interface ResearchSort {
  field: keyof ResearchItem;
  direction: 'asc' | 'desc';
}

export interface ResearchFilter {
  status?: ResearchStatus[];
  workflow_type?: WorkflowType[];
  source?: string[];
  min_profit?: number;
  max_profit?: number;
  min_score?: number;
  search?: string;
}

export const SOURCE_LABELS: Record<string, string> = {
  yahoo_auction: 'ヤフオク',
  mercari: 'メルカリ',
  rakuten: '楽天',
  amazon_jp: 'Amazon JP',
  manual: '手動登録',
};

export const WORKFLOW_LABELS: Record<WorkflowType, string> = {
  reverse: '逆リサーチ',
  forward: '順リサーチ',
  arbitrage: 'アービトラージ',
  ai_proposal: 'AI提案',
};

export const STATUS_LABELS: Record<ResearchStatus, string> = {
  pending: '承認待ち',
  approved: '承認済み',
  rejected: '却下',
  processing: '処理中',
};
