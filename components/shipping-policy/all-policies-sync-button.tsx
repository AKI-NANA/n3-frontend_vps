'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2, XCircle, DollarSign, RotateCcw } from 'lucide-react';

interface SyncResult {
  success: boolean;
  account: string;
  successCount: number;
  errorCount: number;
  newPolicies: number;
  total: number;
  ebayTotal: number;
  errors?: string[];
}

interface AllPoliciesSyncButtonProps {
  account?: string;
  className?: string;
}

export function AllPoliciesSyncButton({ 
  account = 'green',
  className = ''
}: AllPoliciesSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    shipping?: SyncResult;
    payment?: SyncResult;
    return?: SyncResult;
  }>({});
  const [error, setError] = useState<string | null>(null);

  const syncAllPolicies = async () => {
    setIsLoading(true);
    setResults({});
    setError(null);

    try {
      // 1. Shipping Policy同期
      console.log('🚚 Shipping Policy同期開始...');
      const shippingResponse = await fetch('/api/shipping-policies/sync-ebay-policy-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });

      const shippingData = await shippingResponse.json();
      
      if (shippingResponse.ok) {
        setResults(prev => ({ ...prev, shipping: shippingData }));
      } else {
        throw new Error(`Shipping: ${shippingData.error}`);
      }

      // 2. Payment Policy同期
      console.log('💰 Payment Policy同期開始...');
      const paymentResponse = await fetch('/api/payment-policies/sync-ebay-policy-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });

      const paymentData = await paymentResponse.json();
      
      if (paymentResponse.ok) {
        setResults(prev => ({ ...prev, payment: paymentData }));
      } else {
        throw new Error(`Payment: ${paymentData.error}`);
      }

      // 3. Return Policy同期
      console.log('🔄 Return Policy同期開始...');
      const returnResponse = await fetch('/api/return-policies/sync-ebay-policy-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ account }),
      });

      const returnData = await returnResponse.json();
      
      if (returnResponse.ok) {
        setResults(prev => ({ ...prev, return: returnData }));
      } else {
        throw new Error(`Return: ${returnData.error}`);
      }

    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Button
        onClick={syncAllPolicies}
        disabled={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            全ポリシー同期中...
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            全ポリシーID同期 ({account})
          </>
        )}
      </Button>

      {/* Shipping Policy結果 */}
      {results.shipping && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              🚚 Shipping Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-gray-600">成功</p>
                <p className="text-lg font-bold text-green-600">{results.shipping.successCount}</p>
              </div>
              <div>
                <p className="text-gray-600">失敗</p>
                <p className="text-lg font-bold text-red-600">{results.shipping.errorCount}</p>
              </div>
              <div>
                <p className="text-gray-600">合計</p>
                <p className="text-lg font-bold">{results.shipping.total}</p>
              </div>
              <div>
                <p className="text-gray-600">新規</p>
                <p className="text-lg font-bold text-blue-600">{results.shipping.newPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Policy結果 */}
      {results.payment && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payment Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-gray-600">成功</p>
                <p className="text-lg font-bold text-green-600">{results.payment.successCount}</p>
              </div>
              <div>
                <p className="text-gray-600">失敗</p>
                <p className="text-lg font-bold text-red-600">{results.payment.errorCount}</p>
              </div>
              <div>
                <p className="text-gray-600">合計</p>
                <p className="text-lg font-bold">{results.payment.total}</p>
              </div>
              <div>
                <p className="text-gray-600">新規</p>
                <p className="text-lg font-bold text-blue-600">{results.payment.newPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Return Policy結果 */}
      {results.return && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Return Policy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <p className="text-gray-600">成功</p>
                <p className="text-lg font-bold text-green-600">{results.return.successCount}</p>
              </div>
              <div>
                <p className="text-gray-600">失敗</p>
                <p className="text-lg font-bold text-red-600">{results.return.errorCount}</p>
              </div>
              <div>
                <p className="text-gray-600">合計</p>
                <p className="text-lg font-bold">{results.return.total}</p>
              </div>
              <div>
                <p className="text-gray-600">新規</p>
                <p className="text-lg font-bold text-blue-600">{results.return.newPolicies}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
