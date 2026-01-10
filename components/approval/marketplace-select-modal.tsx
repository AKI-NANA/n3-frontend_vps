/**
 * マーケットプレイス選択モーダル
 * 即時出品時にモール・アカウントを選択
 */

'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle } from 'lucide-react';

export type MarketplaceOption = {
  marketplace: 'ebay' | 'amazon' | 'qoo10';
  accountId: string;
  accountName: string;
  available: boolean;
  reason?: string;
};

interface MarketplaceSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
  sku: string;
  onPublish: (marketplace: string, accountId: string) => Promise<void>;
}

export function MarketplaceSelectModal({
  open,
  onOpenChange,
  productId,
  sku,
  onPublish,
}: MarketplaceSelectModalProps) {
  const [selected, setSelected] = useState<string>('');
  const [publishing, setPublishing] = useState(false);

  // マーケットプレイスオプション
  const options: MarketplaceOption[] = [
    {
      marketplace: 'ebay',
      accountId: 'main_account',
      accountName: 'eBay Main Account',
      available: true,
    },
    {
      marketplace: 'ebay',
      accountId: 'green_account',
      accountName: 'eBay Green Account',
      available: true,
    },
    {
      marketplace: 'ebay',
      accountId: 'mjt_account',
      accountName: 'eBay MJT Account',
      available: true,
    },
    {
      marketplace: 'amazon',
      accountId: 'amazon_us',
      accountName: 'Amazon US',
      available: false,
      reason: '開発中',
    },
    {
      marketplace: 'qoo10',
      accountId: 'qoo10_jp',
      accountName: 'Qoo10 Japan',
      available: false,
      reason: '開発中',
    },
  ];

  const handlePublish = async () => {
    if (!selected) return;

    const [marketplace, accountId] = selected.split(':');
    setPublishing(true);

    try {
      await onPublish(marketplace, accountId);
      onOpenChange(false);
    } catch (error) {
      console.error('出品エラー:', error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>出品先を選択</DialogTitle>
          <DialogDescription>
            SKU: {sku} を出品するマーケットプレイスとアカウントを選択してください
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selected} onValueChange={setSelected}>
            <div className="space-y-3">
              {options.map((option) => {
                const value = `${option.marketplace}:${option.accountId}`;
                const disabled = !option.available;

                return (
                  <div
                    key={value}
                    className={`flex items-center space-x-3 p-3 border rounded-lg ${
                      disabled
                        ? 'bg-gray-50 border-gray-200'
                        : selected === value
                        ? 'border-primary bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem value={value} id={value} disabled={disabled} />
                    <Label
                      htmlFor={value}
                      className={`flex-1 cursor-pointer ${disabled ? 'text-muted-foreground' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{option.accountName}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {option.marketplace}
                          </div>
                        </div>
                        <div>
                          {disabled ? (
                            <Badge variant="secondary">{option.reason}</Badge>
                          ) : option.marketplace === 'ebay' ? (
                            <Badge variant="default">利用可能</Badge>
                          ) : null}
                        </div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {!selected && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">
                出品先を選択してください
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={publishing}>
            キャンセル
          </Button>
          <Button onClick={handlePublish} disabled={!selected || publishing}>
            {publishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {publishing ? '出品中...' : '即時出品'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
