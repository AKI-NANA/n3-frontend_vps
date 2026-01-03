'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, Package } from 'lucide-react';

export default function TestListingPage() {
  const [productId, setProductId] = useState('');
  const [account, setAccount] = useState('green');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testListing = async () => {
    if (!productId) {
      setError('商品IDを入力してください');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/ebay/test-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, account }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error + (data.details ? `: ${data.details}` : ''));
      }
    } catch (err) {
      setError('通信エラー: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            eBay出品テスト
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* 説明 */}
          <Alert>
            <AlertDescription>
              <p className="text-sm">
                このページでは、1つの商品をeBayに出品してシステムが正常に動作するかテストします。
              </p>
              <ul className="text-xs mt-2 space-y-1 text-gray-600">
                <li>• products_masterテーブルから商品データを取得</li>
                <li>• 3つのポリシーIDを使用して出品ペイロードを構築</li>
                <li>• eBay Inventory APIで出品実行</li>
                <li>• 出品結果をDBに保存</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* 商品ID入力 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              商品ID (products_master.id)
            </label>
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="例: 1"
              className="w-full px-3 py-2 border rounded-md"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Supabaseのproducts_masterテーブルに存在する商品のIDを入力してください
            </p>
          </div>

          {/* アカウント選択 */}
          <div>
            <label className="block text-sm font-medium mb-2">
              eBayアカウント
            </label>
            <select
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              disabled={isLoading}
            >
              <option value="green">green</option>
              <option value="mjt">mjt</option>
              <option value="mystical">mystical</option>
            </select>
          </div>

          {/* 実行ボタン */}
          <Button
            onClick={testListing}
            disabled={isLoading || !productId}
            size="lg"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                出品中...
              </>
            ) : (
              <>
                <Package className="mr-2 h-4 w-4" />
                テスト出品実行
              </>
            )}
          </Button>

          {/* 成功結果 */}
          {result && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-green-900">✅ 出品成功！</p>
                  <div className="text-sm space-y-1">
                    <p><strong>Listing ID:</strong> {result.listingId}</p>
                    <p><strong>Offer ID:</strong> {result.offerId}</p>
                    <p><strong>SKU:</strong> {result.sku}</p>
                  </div>
                  <div className="text-xs mt-2 pt-2 border-t border-green-200">
                    <p className="font-semibold mb-1">使用したポリシー:</p>
                    <p>Shipping: {result.policies?.shipping}</p>
                    <p>Payment: {result.policies?.payment}</p>
                    <p>Return: {result.policies?.return}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* エラー */}
          {error && (
            <Alert className="bg-red-50 border-red-200">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <p className="font-semibold text-red-900">エラー</p>
                <p className="text-sm text-red-800 mt-1">{error}</p>
              </AlertDescription>
            </Alert>
          )}

          {/* チェックリスト */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2">📋 事前チェックリスト</h3>
            <ul className="text-xs space-y-1 text-gray-700">
              <li>✓ 3つのポリシーID同期が完了している</li>
              <li>✓ products_masterに商品データが存在する</li>
              <li>✓ 商品に最低限の情報（title, price）がある</li>
              <li>✓ eBayアクセストークンが有効</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
