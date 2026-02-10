// components/error/error-boundary.tsx
/**
 * Error Boundary - コンポーネントクラッシュからの復旧
 * 
 * 機能:
 * - レンダリングエラーをキャッチ
 * - フォールバックUIを表示
 * - Sentry連携（エラーレポート）
 * - 再試行機能
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Copy, Check } from 'lucide-react';

// ============================================================
// 型定義
// ============================================================

interface ErrorBoundaryProps {
  children: ReactNode;
  /** フォールバックUIをカスタマイズ */
  fallback?: ReactNode;
  /** エラー発生時のコールバック */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** コンポーネント名（デバッグ用） */
  componentName?: string;
  /** 最小限のフォールバックUI */
  minimal?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
}

// ============================================================
// Error Boundary Component
// ============================================================

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // エラーIDを生成（追跡用）
    const errorId = `ERR-${Date.now().toString(36).toUpperCase()}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { onError, componentName } = this.props;
    const { errorId } = this.state;

    // エラーログ出力
    console.error('[ErrorBoundary] Caught error:', {
      errorId,
      componentName,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // Sentry連携（後で実装）
    this.reportToSentry(error, errorInfo);

    // カスタムコールバック
    onError?.(error, errorInfo);
  }

  private reportToSentry(error: Error, errorInfo: ErrorInfo): void {
    // TODO: Sentry SDK導入後に実装
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: { componentStack: errorInfo.componentStack },
    //   },
    //   tags: {
    //     errorId: this.state.errorId,
    //     componentName: this.props.componentName,
    //   },
    // });
    
    // 現時点ではコンソールにログ
    if (typeof window !== 'undefined') {
      console.error('[Sentry Mock] Would report:', {
        errorId: this.state.errorId,
        message: error.message,
        componentStack: errorInfo.componentStack?.slice(0, 500),
      });
    }
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
    });
  };

  private handleGoHome = (): void => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render(): ReactNode {
    const { hasError, error, errorId } = this.state;
    const { children, fallback, minimal } = this.props;

    if (hasError) {
      // カスタムフォールバック
      if (fallback) {
        return fallback;
      }

      // 最小限のフォールバック
      if (minimal) {
        return (
          <MinimalFallback
            errorId={errorId}
            onRetry={this.handleRetry}
          />
        );
      }

      // 標準フォールバック
      return (
        <StandardFallback
          error={error}
          errorId={errorId}
          onRetry={this.handleRetry}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return children;
  }
}

// ============================================================
// Fallback UI Components
// ============================================================

interface FallbackProps {
  error?: Error | null;
  errorId: string | null;
  onRetry: () => void;
  onGoHome?: () => void;
}

/** 標準フォールバックUI */
function StandardFallback({ error, errorId, onRetry, onGoHome }: FallbackProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyErrorId = () => {
    if (errorId) {
      navigator.clipboard.writeText(errorId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-[300px] p-6"
      style={{ background: 'var(--panel)' }}
    >
      <div className="text-center max-w-md">
        {/* アイコン */}
        <div 
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(239, 68, 68, 0.1)' }}
        >
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* タイトル */}
        <h2 
          className="text-lg font-semibold mb-2"
          style={{ color: 'var(--text)' }}
        >
          予期しないエラーが発生しました
        </h2>

        {/* 説明 */}
        <p 
          className="text-sm mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          このコンポーネントで問題が発生しました。<br />
          再試行するか、ホームに戻ってください。
        </p>

        {/* エラーID */}
        {errorId && (
          <div 
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md mb-4 text-xs"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
          >
            <span>エラーID: {errorId}</span>
            <button
              onClick={handleCopyErrorId}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="コピー"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}

        {/* エラー詳細（開発時のみ） */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="text-left mb-4">
            <summary 
              className="cursor-pointer text-xs mb-2"
              style={{ color: 'var(--text-muted)' }}
            >
              エラー詳細（開発モード）
            </summary>
            <pre 
              className="text-xs p-3 rounded overflow-auto max-h-32"
              style={{ background: 'var(--surface)', color: 'var(--text-muted)' }}
            >
              {error.message}
              {error.stack && `\n\n${error.stack.slice(0, 500)}`}
            </pre>
          </details>
        )}

        {/* アクションボタン */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{ 
              background: 'var(--accent)', 
              color: 'white',
            }}
          >
            <RefreshCw className="w-4 h-4" />
            再試行
          </button>
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              style={{ 
                background: 'var(--surface)', 
                color: 'var(--text)',
              }}
            >
              <Home className="w-4 h-4" />
              ホームへ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/** 最小限のフォールバックUI（リストアイテム用） */
function MinimalFallback({ errorId, onRetry }: Omit<FallbackProps, 'onGoHome'>) {
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-md"
      style={{ background: 'rgba(239, 68, 68, 0.1)' }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-600">
          読み込みエラー
          {errorId && <span className="text-xs ml-2 opacity-60">({errorId})</span>}
        </span>
      </div>
      <button
        onClick={onRetry}
        className="p-1 rounded hover:bg-red-100 transition-colors"
        title="再試行"
      >
        <RefreshCw className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}

// ============================================================
// Functional Wrapper (React 18+ 用)
// ============================================================

interface WithErrorBoundaryOptions {
  componentName?: string;
  minimal?: boolean;
  fallback?: ReactNode;
}

/**
 * HOC: コンポーネントをErrorBoundaryでラップ
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithErrorBoundaryOptions = {}
): React.FC<P> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const WithErrorBoundaryComponent: React.FC<P> = (props) => (
    <ErrorBoundary 
      componentName={options.componentName || displayName}
      minimal={options.minimal}
      fallback={options.fallback}
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `WithErrorBoundary(${displayName})`;
  
  return WithErrorBoundaryComponent;
}

// ============================================================
// Export
// ============================================================

export default ErrorBoundary;
