'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface PolicyIdSyncButtonProps {
  account?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

export function PolicyIdSyncButton({ 
  account = 'green',
  variant = 'default',
  size = 'default',
  className = ''
}: PolicyIdSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const syncPolicyIds = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/shipping-policies/sync-ebay-policy-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'エラーが発生しました');
      }
    } catch (err) {
      setError('通信エラー: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={syncPolicyIds}
        disabled={isLoading}
        variant={variant}
        size={size}
        className={className}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            同期中...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            Policy ID同期 ({account})
          </>
        )}
      </Button>

      {result && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="text-sm space-y-1">
              <p className="font-semibold text-green-900">同期完了</p>
              <div className="flex gap-4 text-xs">
                <span>成功: <strong>{result.successCount}</strong></span>
                <span>失敗: <strong>{result.errorCount}</strong></span>
                <span>合計: <strong>{result.total}</strong></span>
                {result.newPolicies > 0 && (
                  <span className="text-green-700">新規: <strong>{result.newPolicies}</strong></span>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <p className="text-sm text-red-900">{error}</p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
