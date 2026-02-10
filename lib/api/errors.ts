// lib/api/errors.ts
/**
 * API エラー定義 - 統一されたエラーハンドリング
 * 
 * 全てのAPIエラーはこのクラスを使用して統一的に処理する
 */

// ============================================================
// エラーコード定義
// ============================================================

export const API_ERROR_CODES = {
  // 認証・認可
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  
  // クライアントエラー
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,  // 楽観的ロックの競合
  VALIDATION_ERROR: 422,
  TOO_MANY_REQUESTS: 429,
  
  // サーバーエラー
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  
  // ネットワークエラー
  NETWORK_ERROR: 0,
  TIMEOUT: -1,
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];

// ============================================================
// カスタムエラークラス
// ============================================================

export interface ApiErrorDetails {
  field?: string;
  message: string;
  code?: string;
}

export class ApiError extends Error {
  public readonly code: ApiErrorCode;
  public readonly details?: ApiErrorDetails[];
  public readonly requestId?: string;
  public readonly timestamp: string;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    code: ApiErrorCode,
    options?: {
      details?: ApiErrorDetails[];
      requestId?: string;
      originalError?: unknown;
    }
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = options?.details;
    this.requestId = options?.requestId;
    this.timestamp = new Date().toISOString();
    this.originalError = options?.originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /** 認証エラーかどうか */
  get isAuthError(): boolean {
    return this.code === API_ERROR_CODES.UNAUTHORIZED || this.code === API_ERROR_CODES.FORBIDDEN;
  }

  /** 競合エラー（楽観的ロック）かどうか */
  get isConflict(): boolean {
    return this.code === API_ERROR_CODES.CONFLICT;
  }

  /** バリデーションエラーかどうか */
  get isValidationError(): boolean {
    return this.code === API_ERROR_CODES.VALIDATION_ERROR;
  }

  /** ネットワークエラーかどうか */
  get isNetworkError(): boolean {
    return this.code === API_ERROR_CODES.NETWORK_ERROR || this.code === API_ERROR_CODES.TIMEOUT;
  }

  /** リトライ可能かどうか */
  get isRetryable(): boolean {
    return (
      this.code === API_ERROR_CODES.NETWORK_ERROR ||
      this.code === API_ERROR_CODES.TIMEOUT ||
      this.code === API_ERROR_CODES.SERVICE_UNAVAILABLE ||
      this.code === API_ERROR_CODES.TOO_MANY_REQUESTS
    );
  }

  /** ユーザーフレンドリーなメッセージを取得 */
  getUserMessage(): string {
    switch (this.code) {
      case API_ERROR_CODES.UNAUTHORIZED:
        return 'ログインが必要です。再度ログインしてください。';
      case API_ERROR_CODES.FORBIDDEN:
        return 'この操作を実行する権限がありません。';
      case API_ERROR_CODES.NOT_FOUND:
        return '要求されたリソースが見つかりません。';
      case API_ERROR_CODES.CONFLICT:
        return '他のユーザーがこのデータを更新しました。画面をリロードして再試行してください。';
      case API_ERROR_CODES.VALIDATION_ERROR:
        return '入力内容に問題があります。内容を確認してください。';
      case API_ERROR_CODES.TOO_MANY_REQUESTS:
        return 'リクエストが多すぎます。しばらく待ってから再試行してください。';
      case API_ERROR_CODES.NETWORK_ERROR:
        return 'ネットワーク接続を確認してください。';
      case API_ERROR_CODES.TIMEOUT:
        return 'サーバーからの応答がありません。しばらく待ってから再試行してください。';
      case API_ERROR_CODES.SERVICE_UNAVAILABLE:
        return 'サービスが一時的に利用できません。しばらく待ってから再試行してください。';
      default:
        return 'エラーが発生しました。しばらく待ってから再試行してください。';
    }
  }

  /** JSON形式でエクスポート */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      requestId: this.requestId,
      timestamp: this.timestamp,
    };
  }
}

// ============================================================
// エラー生成ヘルパー
// ============================================================

export function createApiError(response: Response, data?: unknown): ApiError {
  const code = response.status as ApiErrorCode;
  const requestId = response.headers.get('x-request-id') || undefined;
  
  let message = response.statusText || 'Unknown error';
  let details: ApiErrorDetails[] | undefined;

  // レスポンスボディからエラー情報を抽出
  if (data && typeof data === 'object') {
    const errorData = data as Record<string, unknown>;
    if (typeof errorData.message === 'string') {
      message = errorData.message;
    }
    if (Array.isArray(errorData.errors)) {
      details = errorData.errors as ApiErrorDetails[];
    }
    if (Array.isArray(errorData.details)) {
      details = errorData.details as ApiErrorDetails[];
    }
  }

  return new ApiError(message, code, { details, requestId });
}

export function createNetworkError(error: unknown): ApiError {
  const isTimeout = error instanceof Error && error.name === 'AbortError';
  
  return new ApiError(
    isTimeout ? 'Request timeout' : 'Network error',
    isTimeout ? API_ERROR_CODES.TIMEOUT : API_ERROR_CODES.NETWORK_ERROR,
    { originalError: error }
  );
}

// ============================================================
// 楽観的ロック用のConflictエラー
// ============================================================

export interface ConflictErrorData {
  currentVersion: number;
  serverVersion: number;
  updatedBy?: string;
  updatedAt?: string;
}

export class ConflictError extends ApiError {
  public readonly conflictData: ConflictErrorData;

  constructor(message: string, conflictData: ConflictErrorData, requestId?: string) {
    super(message, API_ERROR_CODES.CONFLICT, { requestId });
    this.name = 'ConflictError';
    this.conflictData = conflictData;
  }
}

// ============================================================
// バリデーションエラー
// ============================================================

export class ValidationError extends ApiError {
  constructor(message: string, details: ApiErrorDetails[], requestId?: string) {
    super(message, API_ERROR_CODES.VALIDATION_ERROR, { details, requestId });
    this.name = 'ValidationError';
  }

  /** フィールドごとのエラーマップを取得 */
  getFieldErrors(): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    
    if (this.details) {
      for (const detail of this.details) {
        if (detail.field) {
          if (!fieldErrors[detail.field]) {
            fieldErrors[detail.field] = [];
          }
          fieldErrors[detail.field].push(detail.message);
        }
      }
    }
    
    return fieldErrors;
  }
}
