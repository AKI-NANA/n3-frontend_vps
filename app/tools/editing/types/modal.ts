// app/tools/editing/types/modal.ts
export type ModalType =
  | 'none'
  | 'product_detail'
  | 'paste_data'
  | 'csv_upload'
  | 'ai_enrichment'
  | 'market_research'
  | 'pricing_strategy'
  | 'gemini_batch'
  | 'html_publish'
  | 'category_assign'
  | 'filter_config';

export interface ModalPayload {
  product?: any;
  products?: any[];
  selectedIds?: Set<string>;
  targetProduct?: any;
  [key: string]: any;
}
