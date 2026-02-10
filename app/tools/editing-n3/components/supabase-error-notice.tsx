// app/tools/editing-n3/components/supabase-error-notice.tsx
/**
 * Supabaseエラー通知コンポーネント
 * 
 * Supabaseのサービス制限エラーを検知して、ユーザーに対策を提示
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ExternalLink, RefreshCw, X } from 'lucide-react';

interface SupabaseErrorNoticeProps {
  error?: string | null;
  onDismiss?: () => void;
}

export function SupabaseErrorNotice({ error, onDismiss }: SupabaseErrorNoticeProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Supabaseのサービス制限エラーを検知
  const isSupabaseRestriction = error?.includes('restricted') || 
                                 error?.includes('violations') ||
                                 error?.includes('HTTP 500');

  useEffect(() => {
    // エラーが解消されたら表示をリセット
    if (!error) {
      setIsDismissed(false);
    }
  }, [error]);

  // エラーがない、または既に閉じられている場合は何も表示しない
  if (!error || !isSupabaseRestriction || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <Alert variant="destructive" className="mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 mt-0.5" />
        <div className="flex-1 space-y-2">
          <AlertTitle className="flex items-center justify-between">
            <span>⚠️ データベース接続エラー</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertTitle>
          <AlertDescription className="space-y-3">
            <p className="text-sm">
              Supabaseデータベースへの接続が制限されています。
              以下の原因が考えられます：
            </p>
            
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>無料プランの利用制限を超過</li>
              <li>リクエスト数の上限に到達</li>
              <li>ストレージ容量の上限に到達</li>
              <li>一時的なサービス制限</li>
            </ul>

            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '詳細を非表示' : '詳細を表示'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://supabase.com/dashboard/project/zdzfpucdyxdlavkgrvil/settings/billing', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Supabaseダッシュボード
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                リロード
              </Button>
            </div>

            {showDetails && (
              <Card className="mt-3 bg-background/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">対策方法</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium mb-1">1. 利用状況の確認</h4>
                    <p className="text-muted-foreground">
                      Supabaseダッシュボード → Project Settings → Usage で、
                      現在の使用状況を確認してください。
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">2. プランのアップグレード（推奨）</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>Pro Plan: $25/月 - 無制限リクエスト</li>
                      <li>Team Plan: $599/月 - エンタープライズ機能</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">3. 一時的な対策</h4>
                    <ul className="text-muted-foreground list-disc list-inside space-y-1">
                      <li>不要なAPIリクエストの削減</li>
                      <li>バッチ処理の活用</li>
                      <li>キャッシュの有効活用</li>
                      <li>数時間待機（制限が自動解除される場合あり）</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-1">4. サポートへの問い合わせ</h4>
                    <p className="text-muted-foreground">
                      Supabaseサポートに制限の詳細と一時的な解除を依頼できます。
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 mt-1"
                      onClick={() => window.open('https://supabase.com/dashboard/support/new', '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      サポートチケットを作成
                    </Button>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>エラー詳細:</strong> {error}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}

export default SupabaseErrorNotice;
