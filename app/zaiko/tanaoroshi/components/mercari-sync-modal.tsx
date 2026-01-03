'use client'

/**
 * メルカリ同期モーダル
 * HTMLペースト方式でメルカリ出品データを同期
 * 
 * 使い方:
 * 1. メルカリのマイページ > 出品した商品 を開く
 * 2. ページを下までスクロールして全商品を読み込む
 * 3. Ctrl+A で全選択、Ctrl+C でコピー
 * 4. このモーダルにペースト
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  ShoppingBag, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react'

interface MercariSyncModalProps {
  isOpen: boolean
  onClose: () => void
  onSyncComplete: () => void
}

interface SyncResult {
  success: boolean
  parse_method: string
  total_parsed: number
  total_synced: number
  total_updated: number
  total_skipped: number
  total_errors: number
  price_summary: {
    total_jpy: number
    min_jpy: number
    max_jpy: number
    avg_jpy: number
  }
  items: Array<{
    id: string
    mercari_item_id: string
    product_name: string
    price_jpy: number
    status: string
  }>
  account: string
  error?: string
}

export function MercariSyncModal({ isOpen, onClose, onSyncComplete }: MercariSyncModalProps) {
  const [html, setHtml] = useState('')
  const [account, setAccount] = useState('default')
  const [forceUpdate, setForceUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SyncResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSync = async () => {
    if (!html.trim()) {
      setError('HTMLを入力してください')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/sync/mercari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html, account, forceUpdate })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '同期に失敗しました')
        return
      }

      setResult(data)
      
      // 同期成功後にリストを更新
      if (data.success && (data.total_synced > 0 || data.total_updated > 0)) {
        onSyncComplete()
      }

    } catch (e: any) {
      setError(`エラー: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setHtml('')
    setResult(null)
    setError(null)
    onClose()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            メルカリ出品同期
          </DialogTitle>
          <DialogDescription>
            メルカリの出品一覧ページからHTMLをコピーして同期します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 手順説明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-2">同期手順:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>
                    <a 
                      href="https://jp.mercari.com/mypage/listings" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      メルカリ出品一覧 <ExternalLink className="w-3 h-3" />
                    </a>
                    を開く
                  </li>
                  <li>ページ下までスクロールして全商品を読み込む</li>
                  <li>
                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl</kbd>
                    +<kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">A</kbd> で全選択、
                    <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">Ctrl</kbd>
                    +<kbd className="px-1.5 py-0.5 bg-white border rounded text-xs">C</kbd> でコピー
                  </li>
                  <li>下のテキストエリアにペースト</li>
                </ol>
              </div>
            </div>
          </div>

          {/* アカウント名 */}
          <div className="space-y-2">
            <Label htmlFor="account">アカウント名（任意）</Label>
            <Input
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="default"
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground">
              複数アカウントを区別する場合に入力
            </p>
          </div>

          {/* TASK 6: メルカリURL入力（将来のAPI対応用） */}
          <div className="space-y-2 opacity-50">
            <Label htmlFor="mercari_url" className="flex items-center gap-2">
              メルカリURL（API連携対応予定）
              <Badge variant="outline" className="text-xs bg-slate-100">
                準備中
              </Badge>
            </Label>
            <Input
              id="mercari_url"
              disabled
              placeholder="https://jp.mercari.com/item/..."
              className="max-w-md"
            />
            <p className="text-xs text-muted-foreground">
              <Info className="w-3 h-3 inline mr-1" />
              メルカリAPI連携が実装されると、URLから自動同期できるようになります
            </p>
          </div>

          {/* HTML入力 */}
          <div className="space-y-2">
            <Label htmlFor="html">HTMLソース</Label>
            <Textarea
              id="html"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="メルカリ出品一覧ページのHTMLをここにペースト..."
              className="min-h-[200px] font-mono text-xs"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {html.length > 0 ? `${html.length.toLocaleString()}文字` : ''}
              </p>
              {html.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setHtml('')}
                  className="text-xs"
                >
                  クリア
                </Button>
              )}
            </div>
          </div>

          {/* オプション */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <Label htmlFor="forceUpdate" className="font-medium">既存データを更新</Label>
              <p className="text-xs text-muted-foreground">
                同じ商品IDが存在する場合も価格等を更新
              </p>
            </div>
            <Switch
              id="forceUpdate"
              checked={forceUpdate}
              onCheckedChange={setForceUpdate}
            />
          </div>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {/* 結果表示 */}
          {result && (
            <div className={`border rounded-lg p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center gap-2 mb-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
                <span className="font-medium">
                  {result.success ? '同期完了' : '部分的に成功'}
                </span>
                <Badge variant="outline" className="text-xs">
                  {result.parse_method}
                </Badge>
              </div>

              {/* 統計 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.total_parsed}</div>
                  <div className="text-xs text-muted-foreground">抽出</div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-2xl font-bold text-green-600">{result.total_synced}</div>
                  <div className="text-xs text-muted-foreground">新規登録</div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-2xl font-bold text-amber-600">{result.total_updated}</div>
                  <div className="text-xs text-muted-foreground">更新</div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-2xl font-bold text-slate-400">{result.total_skipped}</div>
                  <div className="text-xs text-muted-foreground">スキップ</div>
                </div>
              </div>

              {/* 価格サマリ */}
              <div className="bg-white rounded p-3 mb-4">
                <div className="text-sm font-medium mb-2">価格サマリ（円）</div>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <div className="text-muted-foreground">合計</div>
                    <div className="font-medium">{formatPrice(result.price_summary.total_jpy)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">平均</div>
                    <div className="font-medium">{formatPrice(result.price_summary.avg_jpy)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">最低</div>
                    <div className="font-medium">{formatPrice(result.price_summary.min_jpy)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">最高</div>
                    <div className="font-medium">{formatPrice(result.price_summary.max_jpy)}</div>
                  </div>
                </div>
              </div>

              {/* 商品リスト（プレビュー） */}
              {result.items.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">同期された商品（最大20件）</div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.items.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between bg-white rounded px-2 py-1 text-xs"
                      >
                        <span className="truncate flex-1 mr-2">{item.product_name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatPrice(item.price_jpy)}</span>
                          <Badge 
                            variant={item.status === 'created' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.status === 'created' ? '新規' : '更新'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            閉じる
          </Button>
          <Button 
            onClick={handleSync} 
            disabled={isLoading || !html.trim()}
            className="bg-red-500 hover:bg-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                同期中...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                同期する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
