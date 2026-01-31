// lib/n8n/ui-orchestrator.ts
// 🏰 N3 Empire OS - UI Orchestrator
// n8nからのui_configを解釈し、動的にUIコンポーネントを生成する中央制御モジュール

import crypto from 'crypto';

// ========================================
// 型定義
// ========================================

/**
 * n8nからの標準レスポンス形式
 */
export interface N8nStandardResponse<T = any> {
  success: boolean;
  data: T;
  ui_config: UIConfig;
  meta: ResponseMeta;
  error?: ErrorInfo;
}

/**
 * UI設定
 */
export interface UIConfig {
  view_type: 'tabs' | 'modal' | 'panel' | 'table' | 'chart' | 'form' | 'grid' | 'kanban';
  tabs?: TabConfig[];
  modal?: ModalConfig;
  data_display?: DataDisplayConfig;
  actions?: ActionConfig[];
  filters?: FilterConfig[];
  pagination?: PaginationConfig;
  refresh_interval?: number; // ミリ秒
  theme?: ThemeConfig;
}

export interface TabConfig {
  id: string;
  label: string;
  icon?: string;
  visible?: boolean;
  order?: number;
  content_type?: 'table' | 'chart' | 'form' | 'custom';
  lazy_load?: boolean;
}

export interface ModalConfig {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  footer?: boolean;
}

export interface DataDisplayConfig {
  type: 'table' | 'grid' | 'list' | 'card';
  columns?: ColumnConfig[];
  sortable?: boolean;
  selectable?: boolean;
  row_actions?: ActionConfig[];
}

export interface ColumnConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'badge' | 'image' | 'link' | 'actions' | 'masked';
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  visible?: boolean;
  format?: string;
  mask_type?: 'email' | 'phone' | 'address' | 'name' | 'full';
}

export interface ActionConfig {
  id: string;
  label: string;
  theme?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  icon?: string;
  confirm?: boolean;
  confirm_message?: string;
  disabled?: boolean;
  webhook?: string;
  bulk?: boolean;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'checkbox';
  options?: { value: string; label: string }[];
  default?: any;
}

export interface PaginationConfig {
  enabled: boolean;
  page_size: number;
  page_size_options?: number[];
  show_total?: boolean;
}

export interface ThemeConfig {
  primary_color?: string;
  header_bg?: string;
  accent_color?: string;
}

export interface ResponseMeta {
  total_count: number;
  page?: number;
  page_size?: number;
  execution_time_ms: number;
  tenant_id: string | null;
  request_id: string;
  cached?: boolean;
  cache_expires_at?: string;
}

export interface ErrorInfo {
  code: string;
  message: string;
  details?: Record<string, any>;
  recoverable?: boolean;
  suggested_action?: string;
}

// ========================================
// デフォルト設定
// ========================================

export const DEFAULT_UI_CONFIG: UIConfig = {
  view_type: 'table',
  data_display: {
    type: 'table',
    sortable: true,
    selectable: true,
  },
  pagination: {
    enabled: true,
    page_size: 50,
    page_size_options: [20, 50, 100, 200],
    show_total: true,
  },
  actions: [
    { id: 'refresh', label: '更新', theme: 'secondary', icon: 'RefreshCw' },
  ],
};

export const DEFAULT_META: ResponseMeta = {
  total_count: 0,
  execution_time_ms: 0,
  tenant_id: null,
  request_id: '',
};

// ========================================
// ビルダークラス
// ========================================

/**
 * n8nレスポンスビルダー
 * n8nワークフロー内でこのテンプレートを使用してレスポンスを構築
 */
export class N8nResponseBuilder<T = any> {
  private response: N8nStandardResponse<T>;

  constructor() {
    this.response = {
      success: true,
      data: [] as any,
      ui_config: { ...DEFAULT_UI_CONFIG },
      meta: { 
        ...DEFAULT_META,
        request_id: crypto.randomUUID(),
      },
    };
  }

  setData(data: T): this {
    this.response.data = data;
    if (Array.isArray(data)) {
      this.response.meta.total_count = data.length;
    }
    return this;
  }

  setViewType(type: UIConfig['view_type']): this {
    this.response.ui_config.view_type = type;
    return this;
  }

  setTabs(tabs: TabConfig[]): this {
    this.response.ui_config.tabs = tabs;
    this.response.ui_config.view_type = 'tabs';
    return this;
  }

  setModal(config: ModalConfig): this {
    this.response.ui_config.modal = config;
    this.response.ui_config.view_type = 'modal';
    return this;
  }

  setDataDisplay(config: DataDisplayConfig): this {
    this.response.ui_config.data_display = config;
    return this;
  }

  setColumns(columns: ColumnConfig[]): this {
    if (!this.response.ui_config.data_display) {
      this.response.ui_config.data_display = { type: 'table', columns: [] };
    }
    this.response.ui_config.data_display.columns = columns;
    return this;
  }

  setActions(actions: ActionConfig[]): this {
    this.response.ui_config.actions = actions;
    return this;
  }

  setFilters(filters: FilterConfig[]): this {
    this.response.ui_config.filters = filters;
    return this;
  }

  setPagination(config: PaginationConfig): this {
    this.response.ui_config.pagination = config;
    return this;
  }

  setRefreshInterval(ms: number): this {
    this.response.ui_config.refresh_interval = ms;
    return this;
  }

  setMeta(meta: Partial<ResponseMeta>): this {
    this.response.meta = { ...this.response.meta, ...meta };
    return this;
  }

  setTenantId(tenantId: string | null): this {
    this.response.meta.tenant_id = tenantId;
    return this;
  }

  setError(error: ErrorInfo): this {
    this.response.success = false;
    this.response.error = error;
    return this;
  }

  build(): N8nStandardResponse<T> {
    this.response.meta.execution_time_ms = Date.now() - (this.response.meta as any)._startTime || 0;
    return this.response;
  }
}

// ========================================
// ファクトリー関数（n8n Code ノード用）
// ========================================

/**
 * リスト表示用レスポンス
 */
export function buildListResponse<T>(
  items: T[],
  columns: ColumnConfig[],
  options?: {
    actions?: ActionConfig[];
    filters?: FilterConfig[];
    pagination?: Partial<PaginationConfig>;
    tenantId?: string;
  }
): N8nStandardResponse<T[]> {
  return new N8nResponseBuilder<T[]>()
    .setData(items)
    .setViewType('table')
    .setColumns(columns)
    .setActions(options?.actions || [
      { id: 'refresh', label: '更新', theme: 'secondary', icon: 'RefreshCw' },
      { id: 'export', label: 'エクスポート', theme: 'ghost', icon: 'Download' },
    ])
    .setFilters(options?.filters || [])
    .setPagination({
      enabled: true,
      page_size: options?.pagination?.page_size || 50,
      ...options?.pagination,
    })
    .setTenantId(options?.tenantId || null)
    .build();
}

/**
 * 詳細表示用レスポンス
 */
export function buildDetailResponse<T>(
  item: T,
  options?: {
    tabs?: TabConfig[];
    actions?: ActionConfig[];
    tenantId?: string;
  }
): N8nStandardResponse<T> {
  const builder = new N8nResponseBuilder<T>()
    .setData(item)
    .setViewType(options?.tabs ? 'tabs' : 'panel')
    .setActions(options?.actions || [
      { id: 'save', label: '保存', theme: 'primary', icon: 'Save' },
      { id: 'cancel', label: 'キャンセル', theme: 'ghost' },
    ])
    .setTenantId(options?.tenantId || null);

  if (options?.tabs) {
    builder.setTabs(options.tabs);
  }

  return builder.build();
}

/**
 * モーダル用レスポンス
 */
export function buildModalResponse<T>(
  data: T,
  title: string,
  options?: {
    size?: ModalConfig['size'];
    actions?: ActionConfig[];
    tenantId?: string;
  }
): N8nStandardResponse<T> {
  return new N8nResponseBuilder<T>()
    .setData(data)
    .setModal({
      title,
      size: options?.size || 'md',
      closable: true,
      footer: true,
    })
    .setActions(options?.actions || [
      { id: 'confirm', label: '確認', theme: 'primary' },
      { id: 'cancel', label: 'キャンセル', theme: 'ghost' },
    ])
    .setTenantId(options?.tenantId || null)
    .build();
}

/**
 * エラーレスポンス
 */
export function buildErrorResponse(
  code: string,
  message: string,
  options?: {
    details?: Record<string, any>;
    recoverable?: boolean;
    suggestedAction?: string;
  }
): N8nStandardResponse<null> {
  return new N8nResponseBuilder<null>()
    .setData(null)
    .setError({
      code,
      message,
      details: options?.details,
      recoverable: options?.recoverable ?? true,
      suggested_action: options?.suggestedAction,
    })
    .build();
}

// ========================================
// n8n Code ノード用テンプレート
// ========================================

/**
 * n8n Code ノードにコピペするテンプレート
 * ワークフローの最終レスポンスノードでこの形式を使用
 */
export const N8N_RESPONSE_TEMPLATE = `
// ========================================
// N3 Empire OS - 標準レスポンステンプレート
// このコードをn8n Codeノードにコピーしてください
// ========================================

const items = $input.all().map(i => i.json);
const config = $node['初期化ノード名'].json;

// UI設定を構築
const ui_config = {
  view_type: 'table', // tabs | modal | panel | table | chart | form
  tabs: [
    { id: 'main', label: '基本', icon: 'List' },
    { id: 'ai', label: 'AI解析', icon: 'Sparkles' }
  ],
  data_display: {
    type: 'table',
    columns: [
      { id: 'id', label: 'ID', type: 'text', width: 80 },
      { id: 'title', label: 'タイトル', type: 'text', sortable: true },
      { id: 'price', label: '価格', type: 'currency', format: 'JPY' },
      { id: 'status', label: 'ステータス', type: 'badge' },
      // 個人情報カラムにはmask_typeを指定
      { id: 'email', label: 'メール', type: 'masked', mask_type: 'email' },
      { id: 'phone', label: '電話', type: 'masked', mask_type: 'phone' },
    ],
    sortable: true,
    selectable: true,
  },
  actions: [
    { id: 'save', label: '保存', theme: 'primary', icon: 'Save' },
    { id: 'delete', label: '削除', theme: 'danger', icon: 'Trash2', confirm: true, confirm_message: '本当に削除しますか？' },
  ],
  filters: [
    { id: 'status', label: 'ステータス', type: 'select', options: [
      { value: 'active', label: 'アクティブ' },
      { value: 'inactive', label: '非アクティブ' },
    ]},
  ],
  pagination: {
    enabled: true,
    page_size: 50,
    show_total: true,
  },
};

// メタ情報
const meta = {
  total_count: items.length,
  execution_time_ms: Date.now() - $workflow.startedAt,
  tenant_id: config.tenant_id || null,
  request_id: $execution.id,
};

return [{
  json: {
    success: true,
    data: items,
    ui_config,
    meta,
  }
}];
`;

/**
 * アクション分岐Switchノード用テンプレート
 */
export const N8N_ACTION_SWITCH_TEMPLATE = `
// ========================================
// N3 Empire OS - アクション分岐テンプレート
// Switchノードの前のCodeノードで使用
// ========================================

const body = $input.first().json.body || $input.first().json || {};
const action = body.action || 'get_list';

// 有効なアクション一覧
const validActions = ['get_list', 'get_details', 'save', 'delete', 'bulk_action'];

if (!validActions.includes(action)) {
  return [{
    json: {
      error: true,
      code: 'INVALID_ACTION',
      message: \`無効なアクション: \${action}. 有効: \${validActions.join(', ')}\`,
    }
  }];
}

// テナントID注入（商用セキュリティ）
const tenant_id = body.tenant_id || $env.DEFAULT_TENANT_ID || '0';

return [{
  json: {
    action,
    tenant_id,
    params: body.params || {},
    filters: body.filters || {},
    pagination: body.pagination || { page: 1, page_size: 50 },
    timestamp: new Date().toISOString(),
  }
}];
`;

// ========================================
// エクスポート
// ========================================

export default {
  N8nResponseBuilder,
  buildListResponse,
  buildDetailResponse,
  buildModalResponse,
  buildErrorResponse,
  DEFAULT_UI_CONFIG,
  DEFAULT_META,
  N8N_RESPONSE_TEMPLATE,
  N8N_ACTION_SWITCH_TEMPLATE,
};
