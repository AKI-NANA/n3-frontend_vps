// app/tools/editing/services/api-client.ts
/**
 * 統一APIクライアント
 * 全てのAPI呼び出しはこのクライアントを経由する
 */

interface ApiClientOptions extends RequestInit {
  headers?: HeadersInit;
  timeout?: number; // タイムアウト（ミリ秒）
}

/**
 * APIエラークラス
 */
export class ApiError extends Error {
  status: number;
  statusText: string;
  details?: any;
  
  constructor(message: string, status: number, statusText: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.details = details;
  }
  
  /**
   * ユーザー向けエラーメッセージを取得
   */
  getUserMessage(): string {
    switch (this.status) {
      case 400:
        return `リクエストエラー: ${this.message}`;
      case 401:
        return '認証エラー: ログインが必要です';
      case 403:
        return 'アクセス拒否: 権限がありません';
      case 404:
        return `APIが見つかりません: エンドポイントを確認してください`;
      case 429:
        return `レート制限: しばらく待ってから再試行してください`;
      case 500:
        return `サーバーエラー: ${this.message}`;
      case 502:
      case 503:
        return 'サービス一時停止: しばらく待ってから再試行してください';
      case 504:
        return 'タイムアウト: 再試行してください';
      default:
        return `APIエラー (${this.status}): ${this.message}`;
    }
  }
}

/**
 * タイムアウト付きfetch
 */
async function fetchWithTimeout(
  url: string, 
  options: RequestInit, 
  timeout: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 統一的なAPIクライアント関数
 */
export async function apiClient<T = any>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const url = path.startsWith('/api/') ? path : `/api/${path}`;
  const { timeout = 30000, ...fetchOptions } = options;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetchWithTimeout(
      url,
      {
        ...fetchOptions,
        headers: {
          ...defaultHeaders,
          ...fetchOptions.headers,
        },
      },
      timeout
    );

    if (!response.ok) {
      // レスポンスボディを取得（JSONまたはテキスト）
      let errorData: any = null;
      let errorMessage = 'APIエラー';
      
      try {
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `APIエラー (${response.status})`;
        } else {
          const text = await response.text();
          errorMessage = text.substring(0, 200) || `APIエラー (${response.status})`;
        }
      } catch (parseError) {
        errorMessage = `APIエラー (${response.status}): レスポンス解析失敗`;
      }
      
      // 詳細なエラーログ
      console.error(`❌ API Error [${response.status}] ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        message: errorMessage,
        details: errorData
      });
      
      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText,
        errorData
      );
    }

    return response.json();
    
  } catch (error) {
    // タイムアウトエラー
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`❌ API Timeout [${url}]:`, timeout, 'ms');
      throw new ApiError(
        'リクエストタイムアウト',
        504,
        'Gateway Timeout',
        { timeout }
      );
    }
    
    // ネットワークエラー
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`❌ Network Error [${url}]:`, error.message);
      throw new ApiError(
        'ネットワークエラー: サーバーに接続できません',
        0,
        'Network Error',
        { originalError: error.message }
      );
    }
    
    // ApiErrorはそのまま再throw
    if (error instanceof ApiError) {
      throw error;
    }
    
    // その他のエラー
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ API Unknown Error [${url}]:`, errorMessage);
    throw new ApiError(errorMessage, 500, 'Internal Error');
  }
}

/**
 * GET リクエスト用のヘルパー
 */
export function apiGet<T = any>(path: string, options?: ApiClientOptions): Promise<T> {
  return apiClient<T>(path, { ...options, method: 'GET' });
}

/**
 * POST リクエスト用のヘルパー
 */
export function apiPost<T = any>(
  path: string,
  body?: any,
  options?: ApiClientOptions
): Promise<T> {
  return apiClient<T>(path, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT リクエスト用のヘルパー
 */
export function apiPut<T = any>(
  path: string,
  body?: any,
  options?: ApiClientOptions
): Promise<T> {
  return apiClient<T>(path, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE リクエスト用のヘルパー
 */
export function apiDelete<T = any>(
  path: string,
  body?: any,
  options?: ApiClientOptions
): Promise<T> {
  return apiClient<T>(path, {
    ...options,
    method: 'DELETE',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * リトライ付きAPIクライアント
 */
export async function apiClientWithRetry<T = any>(
  path: string,
  options: ApiClientOptions & { maxRetries?: number; retryDelay?: number } = {}
): Promise<T> {
  const { maxRetries = 3, retryDelay = 1000, ...apiOptions } = options;
  
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiClient<T>(path, apiOptions);
    } catch (error) {
      lastError = error as Error;
      
      // リトライ不可能なエラー
      if (error instanceof ApiError) {
        if ([400, 401, 403, 404].includes(error.status)) {
          throw error; // クライアントエラーはリトライしない
        }
      }
      
      // 最後の試行でなければ待機
      if (attempt < maxRetries) {
        const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.warn(`⚠️ API呼び出し失敗、${delay}ms後にリトライ (${attempt}/${maxRetries}):`, lastError.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}
