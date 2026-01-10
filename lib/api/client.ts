// lib/api/client.ts
/**
 * API Client - 統一されたHTTPクライアント
 * 
 * 機能:
 * - 統一されたエラーハンドリング
 * - 認証トークン自動付与
 * - リトライロジック
 * - タイムアウト処理
 * - 楽観的ロック対応
 */

import { 
  ApiError, 
  createApiError, 
  createNetworkError,
  ConflictError,
  API_ERROR_CODES,
} from './errors';

// ============================================================
// 設定
// ============================================================

const DEFAULT_TIMEOUT = 30000; // 30秒
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

// ============================================================
// 型定義
// ============================================================

export interface RequestConfig extends Omit<RequestInit, 'body'> {
  /** リクエストボディ（自動的にJSON.stringifyされる） */
  body?: unknown;
  /** タイムアウト（ミリ秒） */
  timeout?: number;
  /** リトライ回数 */
  retries?: number;
  /** 楽観的ロック用のバージョン */
  expectedVersion?: number;
  /** 認証をスキップ */
  skipAuth?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

// ============================================================
// 認証トークン取得（実装に応じて変更）
// ============================================================

async function getAuthToken(): Promise<string | null> {
  // TODO: 実際の認証実装に応じて変更
  // 例: Firebase Auth, Supabase Auth, Cookie, localStorage など
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// ============================================================
// ユーザー情報取得（監査ログ用）
// ============================================================

export function getCurrentUserId(): string | null {
  // TODO: 実際の認証実装に応じて変更
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_id');
  }
  return null;
}

// ============================================================
// APIクライアント
// ============================================================

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * リクエストを実行
   */
  async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      body,
      timeout = DEFAULT_TIMEOUT,
      retries = 0,
      expectedVersion,
      skipAuth = false,
      headers: customHeaders = {},
      ...fetchConfig
    } = config;

    // URL構築
    const url = this.buildUrl(endpoint);

    // ヘッダー構築
    const headers = new Headers(customHeaders as HeadersInit);
    headers.set('Content-Type', 'application/json');

    // 認証トークン
    if (!skipAuth) {
      const token = await getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    // 楽観的ロック用のバージョン
    if (expectedVersion !== undefined) {
      headers.set('If-Match', String(expectedVersion));
    }

    // AbortController（タイムアウト用）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // エラーレスポンスの処理
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        
        // 競合エラー（楽観的ロック）
        if (response.status === 409 && errorData) {
          throw new ConflictError(
            errorData.message || 'Conflict detected',
            {
              currentVersion: expectedVersion || 0,
              serverVersion: errorData.serverVersion || 0,
              updatedBy: errorData.updatedBy,
              updatedAt: errorData.updatedAt,
            },
            response.headers.get('x-request-id') || undefined
          );
        }

        // 認証エラー
        if (response.status === 401) {
          this.handleUnauthorized();
        }

        throw createApiError(response, errorData);
      }

      // 成功レスポンス
      const data = await this.parseSuccessResponse<T>(response);
      
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      // ApiErrorはそのまま再throw
      if (error instanceof ApiError) {
        throw error;
      }

      // ネットワークエラー
      const apiError = createNetworkError(error);

      // リトライ可能な場合
      if (apiError.isRetryable && retries < MAX_RETRIES) {
        console.log(`[ApiClient] Retrying... (${retries + 1}/${MAX_RETRIES})`);
        await this.delay(RETRY_DELAY * (retries + 1));
        return this.request<T>(endpoint, { ...config, retries: retries + 1 });
      }

      throw apiError;
    }
  }

  /**
   * GETリクエスト
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'GET' });
    return response.data;
  }

  /**
   * POSTリクエスト
   */
  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'POST', body });
    return response.data;
  }

  /**
   * PUTリクエスト
   */
  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'PUT', body });
    return response.data;
  }

  /**
   * PATCHリクエスト
   */
  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'PATCH', body });
    return response.data;
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.request<T>(endpoint, { ...config, method: 'DELETE' });
    return response.data;
  }

  // ============================================================
  // ヘルパーメソッド
  // ============================================================

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint}`;
  }

  private async parseSuccessResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    
    // JSONでない場合はテキストとして返す
    const text = await response.text();
    return text as unknown as T;
  }

  private async parseErrorResponse(response: Response): Promise<Record<string, unknown> | null> {
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await response.json();
      }
    } catch {
      // パースエラーは無視
    }
    return null;
  }

  private handleUnauthorized(): void {
    // TODO: 認証エラー時の処理
    // 例: ログインページにリダイレクト
    console.warn('[ApiClient] Unauthorized - redirect to login');
    // if (typeof window !== 'undefined') {
    //   window.location.href = '/login';
    // }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================
// シングルトンインスタンス
// ============================================================

export const apiClient = new ApiClient('/api');

// ============================================================
// Export
// ============================================================

export default apiClient;
