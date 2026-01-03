// app/tools/editing/services/api-client.ts
/**
 * 統一APIクライアント
 * 全てのAPI呼び出しはこのクライアントを経由する
 */

interface ApiClientOptions extends RequestInit {
  headers?: HeadersInit;
}

/**
 * 統一的なAPIクライアント関数
 */
export async function apiClient<T = any>(
  path: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const url = path.startsWith('/api/') ? path : `/api/${path}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: '不明なAPIエラー',
    }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  return response.json();
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
