'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Plus,
  Images,
  Layers,
  Zap,
  RefreshCw,
  CloudDownload,
  Store,
  Trash2,
  X,
  Loader2,
  ClipboardCheck
} from 'lucide-react'

interface ActionButtonsProps {
  selectedCount?: number
  pendingCount?: number
  onRefresh: () => void
  onNewProduct?: () => void
  onBulkUpload?: () => void
  onCreateSet?: () => void
  onCreateVariation?: () => void
  onClearSelection?: () => void
  onEbaySync?: (account: 'mjt' | 'green' | 'all') => Promise<void>
  onEbayIncrementalSync?: (account: 'mjt' | 'green' | 'all') => Promise<void>
  onMercariSync?: () => void
  onBulkDelete?: () => void
  ebaySyncingMjt?: boolean
  ebaySyncingGreen?: boolean
  incrementalSyncing?: boolean
}

export function ActionButtons({
  selectedCount = 0,
  pendingCount = 0,
  onRefresh,
  onNewProduct,
  onBulkUpload,
  onCreateSet,
  onCreateVariation,
  onClearSelection,
  onEbaySync,
  onEbayIncrementalSync,
  onMercariSync,
  onBulkDelete,
  ebaySyncingMjt = false,
  ebaySyncingGreen = false,
  incrementalSyncing = false
}: ActionButtonsProps) {
  const ebaySyncing = ebaySyncingMjt || ebaySyncingGreen || incrementalSyncing

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-wrap gap-3">
        {/* 有在庫判定バッジ */}
        {pendingCount > 0 && (
          <Link href="/zaiko/tanaoroshi/classification">
            <Button className="bg-orange-600 hover:bg-orange-700 relative">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              有在庫判定
              <Badge className="ml-2 bg-white text-orange-600 hover:bg-white">
                {pendingCount}
              </Badge>
            </Button>
          </Link>
        )}

        {/* 商品登録 */}
        <Button onClick={onNewProduct} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          新規商品登録
        </Button>

        <Button onClick={onBulkUpload} variant="outline">
          <Images className="h-4 w-4 mr-2" />
          画像一括登録
        </Button>

        {/* 選択操作 */}
        <Button
          onClick={onCreateSet}
          variant="outline"
          disabled={selectedCount < 2}
        >
          <Layers className="h-4 w-4 mr-2" />
          セット商品作成 ({selectedCount})
        </Button>

        <Button
          onClick={onCreateVariation}
          variant="outline"
          disabled={selectedCount < 2}
          className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
        >
          <Zap className="h-4 w-4 mr-2" />
          バリエーション作成 ({selectedCount})
        </Button>

        {selectedCount > 0 && (
          <Button onClick={onClearSelection} variant="outline" className="border-slate-400 text-slate-600 hover:bg-slate-100">
            <X className="h-4 w-4 mr-2" />
            選択解除 ({selectedCount})
          </Button>
        )}

        {/* eBay同期ボタン */}
        <div className="flex flex-col gap-2 border-l pl-3">
          {/* 差分同期 */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 min-w-[60px]">差分同期:</span>
            <Button
              onClick={() => onEbayIncrementalSync?.('all')}
              disabled={ebaySyncing}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              title="最終同期以降の変更のみ取得（高速）"
            >
              {incrementalSyncing ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" />同期中...</>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  差分同期
                </>
              )}
            </Button>
          </div>

          {/* 全件同期 */}
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-500 min-w-[60px]">全件同期:</span>
            <Button
              onClick={() => onEbaySync?.('mjt')}
              disabled={ebaySyncing}
              size="sm"
              variant="outline"
              className="border-blue-400 text-blue-700 hover:bg-blue-50"
              title="MJTアカウントのeBayデータを全件同期"
            >
              {ebaySyncingMjt ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" />同期中</>
              ) : (
                <>
                  <CloudDownload className="h-4 w-4 mr-1" />
                  MJT
                </>
              )}
            </Button>

            <Button
              onClick={() => onEbaySync?.('green')}
              disabled={ebaySyncing}
              size="sm"
              variant="outline"
              className="border-green-400 text-green-700 hover:bg-green-50"
              title="GREENアカウントのeBayデータを全件同期"
            >
              {ebaySyncingGreen ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" />同期中</>
              ) : (
                <>
                  <CloudDownload className="h-4 w-4 mr-1" />
                  GREEN
                </>
              )}
            </Button>

            <Button
              onClick={() => onEbaySync?.('all')}
              disabled={ebaySyncing}
              size="sm"
              variant="outline"
              className="border-purple-400 text-purple-700 hover:bg-purple-50"
              title="全アカウントを一括同期"
            >
              {ebaySyncing && !ebaySyncingMjt && !ebaySyncingGreen && !incrementalSyncing ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1" />同期中</>
              ) : (
                <>
                  <CloudDownload className="h-4 w-4 mr-1" />
                  全件
                </>
              )}
            </Button>
          </div>
        </div>

        {/* データ削除ボタン */}
        <div className="flex items-center gap-2 border-l pl-3">
          <span className="text-xs text-slate-500 font-medium">データ削除:</span>
          <Button
            onClick={onBulkDelete}
            size="sm"
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />削除
          </Button>
        </div>

        {/* メルカリ同期ボタン */}
        <Button
          onClick={onMercariSync}
          variant="outline"
          className="border-red-400 text-red-700 hover:bg-red-50"
          title="メルカリの出品データを同期"
        >
          <Store className="h-4 w-4 mr-2" />
          メルカリ同期
        </Button>

        <div className="flex-1"></div>

        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          更新
        </Button>
      </div>
    </div>
  )
}
