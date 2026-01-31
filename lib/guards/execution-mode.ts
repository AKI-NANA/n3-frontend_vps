// lib/guards/execution-mode.ts
/**
 * 🔧 Phase D-Core: Execution Mode Guard
 * 
 * ローカル処理の完全停止モード
 * 
 * EXECUTION_MODE:
 * - 'n8n_only': n8nのみで実行（ローカル処理禁止）
 * - 'local_only': ローカルのみで実行（n8n禁止）
 * - 'hybrid': 両方許可（デフォルト）
 * - 'disabled': すべて停止
 */

// ============================================================
// 型定義
// ============================================================

export type ExecutionMode = 'n8n_only' | 'local_only' | 'hybrid' | 'disabled';

export interface ExecutionModeConfig {
  mode: ExecutionMode;
  allowLocal: boolean;
  allowN8n: boolean;
  reason?: string;
}

// ============================================================
// エラークラス
// ============================================================

export class ExecutionModeError extends Error {
  code: string;
  mode: ExecutionMode;
  
  constructor(mode: ExecutionMode, message: string) {
    super(message);
    this.name = 'ExecutionModeError';
    this.code = 'EXECUTION_MODE_BLOCKED';
    this.mode = mode;
  }
  
  toResponse() {
    return {
      success: false,
      error: this.message,
      code: this.code,
      executionMode: this.mode,
    };
  }
}

// ============================================================
// 実行モード取得
// ============================================================

/**
 * 現在の実行モードを取得
 */
export function getExecutionMode(): ExecutionModeConfig {
  const mode = (process.env.EXECUTION_MODE || 'hybrid') as ExecutionMode;
  
  switch (mode) {
    case 'n8n_only':
      return {
        mode,
        allowLocal: false,
        allowN8n: true,
        reason: 'System is configured for n8n execution only',
      };
    
    case 'local_only':
      return {
        mode,
        allowLocal: true,
        allowN8n: false,
        reason: 'System is configured for local execution only',
      };
    
    case 'disabled':
      return {
        mode,
        allowLocal: false,
        allowN8n: false,
        reason: 'All execution is disabled',
      };
    
    case 'hybrid':
    default:
      return {
        mode: 'hybrid',
        allowLocal: true,
        allowN8n: true,
      };
  }
}

// ============================================================
// ガード関数
// ============================================================

/**
 * ローカル実行が許可されているかチェック
 */
export function checkLocalExecution(): void {
  const config = getExecutionMode();
  
  if (!config.allowLocal) {
    throw new ExecutionModeError(
      config.mode,
      config.reason || 'Local execution is disabled'
    );
  }
}

/**
 * n8n実行が許可されているかチェック
 */
export function checkN8nExecution(): void {
  const config = getExecutionMode();
  
  if (!config.allowN8n) {
    throw new ExecutionModeError(
      config.mode,
      config.reason || 'n8n execution is disabled'
    );
  }
}

/**
 * ローカル実行が許可されているか（例外を投げない版）
 */
export function isLocalExecutionAllowed(): boolean {
  const config = getExecutionMode();
  return config.allowLocal;
}

/**
 * n8n実行が許可されているか（例外を投げない版）
 */
export function isN8nExecutionAllowed(): boolean {
  const config = getExecutionMode();
  return config.allowN8n;
}

// ============================================================
// 実行ラッパー
// ============================================================

/**
 * ローカル実行ラッパー
 */
export async function withLocalExecutionGuard<T>(
  fn: () => Promise<T>
): Promise<T> {
  checkLocalExecution();
  return fn();
}

/**
 * n8n実行ラッパー
 */
export async function withN8nExecutionGuard<T>(
  fn: () => Promise<T>
): Promise<T> {
  checkN8nExecution();
  return fn();
}

// ============================================================
// ユーティリティ
// ============================================================

/**
 * 実行先を自動選択（hybrid モード用）
 */
export function selectExecutionTarget(): 'n8n' | 'local' | null {
  const config = getExecutionMode();
  
  if (config.mode === 'disabled') {
    return null;
  }
  
  if (config.mode === 'n8n_only') {
    return 'n8n';
  }
  
  if (config.mode === 'local_only') {
    return 'local';
  }
  
  // hybrid: 環境変数 USE_N8N で決定
  const useN8n = process.env.USE_N8N === 'true' || process.env.NEXT_PUBLIC_USE_N8N === 'true';
  
  return useN8n ? 'n8n' : 'local';
}

/**
 * 実行モード情報をログ用に取得
 */
export function getExecutionModeInfo(): string {
  const config = getExecutionMode();
  const target = selectExecutionTarget();
  
  return `Mode: ${config.mode}, Target: ${target || 'none'}, Local: ${config.allowLocal}, n8n: ${config.allowN8n}`;
}
