'use client'

import { useState } from 'react'
import { X, Check, XCircle, ExternalLink, TrendingUp, Package, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { AIProposal } from '@/lib/ai-proposals/types'
import { isResearchProposal } from '@/lib/ai-proposals/types'

interface ProposalDetailModalProps {
  proposal: AIProposal
  isOpen: boolean
  onClose: () => void
  onApprove: (proposalId: string) => void
  onReject: (proposalId: string, comment?: string) => void
}

export default function ProposalDetailModal({
  proposal,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: ProposalDetailModalProps) {
  const [rejectComment, setRejectComment] = useState('')

  // リサーチ提案の詳細表示
  const renderResearchProposalDetail = () => {
    if (!isResearchProposal(proposal)) return null

    const data = proposal.proposal_data

    return (
      <Tabs defaultValue="overview" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="profit">利益計算</TabsTrigger>
          <TabsTrigger value="supplier">仕入先</TabsTrigger>
          <TabsTrigger value="risk">リスク分析</TabsTrigger>
        </TabsList>

        {/* 概要タブ */}
        <TabsContent value="overview" className="space-y-4">
          <div className="flex gap-4">
            {data.image && (
              <img
                src={data.image}
                alt={data.title}
                className="w-48 h-48 object-cover rounded-lg"
              />
            )}
            <div className="flex-1 space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">商品名（英語）</div>
                <div className="font-medium">{data.title}</div>
              </div>
              {data.title_jp && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">商品名（日本語）</div>
                  <div className="font-medium">{data.title_jp}</div>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">プラットフォーム</div>
                  <Badge variant="default">{data.source.toUpperCase()}</Badge>
                </div>
                {data.sold_count !== undefined && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">販売数</div>
                    <div className="font-semibold">{data.sold_count}個</div>
                  </div>
                )}
                {data.competitor_count !== undefined && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">競合数</div>
                    <div className="font-semibold">{data.competitor_count}</div>
                  </div>
                )}
              </div>
              {data.url && (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                >
                  商品ページを開く <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </TabsContent>

        {/* 利益計算タブ */}
        <TabsContent value="profit" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">販売価格</div>
              <div className="text-2xl font-bold text-blue-600">
                ${data.price.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">仕入価格</div>
              <div className="text-2xl font-bold">${data.cost_price.toFixed(2)}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">推定利益</div>
              <div className="text-2xl font-bold text-green-600">
                ${data.estimated_profit.toFixed(2)}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">利益率</div>
              <div className="text-2xl font-bold text-green-600">
                {data.profit_rate.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">推定売上</div>
            <div className="text-xl font-bold text-yellow-700">
              ${data.estimated_revenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              ※ eBay/PayPal手数料を考慮した概算値です
            </div>
          </div>
        </TabsContent>

        {/* 仕入先タブ */}
        <TabsContent value="supplier" className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">推奨仕入先</div>
              <Badge variant="secondary">{data.supplier}</Badge>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">仕入価格:</span>
                <span className="font-semibold">${data.cost_price.toFixed(2)}</span>
              </div>
              {data.supplier_url && (
                <a
                  href={data.supplier_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  仕入先ページを開く <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </TabsContent>

        {/* リスク分析タブ */}
        <TabsContent value="risk" className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-3 rounded-lg ${
                data.risk_level === 'low'
                  ? 'bg-green-100'
                  : data.risk_level === 'medium'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}
            >
              <AlertTriangle
                className={`w-6 h-6 ${
                  data.risk_level === 'low'
                    ? 'text-green-600'
                    : data.risk_level === 'medium'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              />
            </div>
            <div>
              <div className="font-semibold text-lg">
                {data.risk_level === 'low' && '低リスク'}
                {data.risk_level === 'medium' && '中リスク'}
                {data.risk_level === 'high' && '高リスク'}
              </div>
              <div className="text-sm text-gray-600">
                総合スコア: {data.total_score?.toFixed(1) || 'N/A'}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {data.profit_score !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">利益スコア</span>
                <span className="font-semibold">{data.profit_score.toFixed(0)}/100</span>
              </div>
            )}
            {data.demand_score !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">需要スコア</span>
                <span className="font-semibold">{data.demand_score.toFixed(0)}/100</span>
              </div>
            )}
            {data.competition_score !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">競合スコア</span>
                <span className="font-semibold">{data.competition_score.toFixed(0)}/100</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {proposal.type === 'research_proposal' && <Package className="w-6 h-6" />}
            {proposal.type === 'bookkeeping_proposal' && <TrendingUp className="w-6 h-6" />}
            {proposal.title}
          </DialogTitle>
          <DialogDescription>{proposal.description}</DialogDescription>
        </DialogHeader>

        {/* メタデータ */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Badge
            variant={
              proposal.priority === 'high'
                ? 'destructive'
                : proposal.priority === 'medium'
                ? 'default'
                : 'secondary'
            }
          >
            {proposal.priority === 'high' && '高優先度'}
            {proposal.priority === 'medium' && '中優先度'}
            {proposal.priority === 'low' && '低優先度'}
          </Badge>
          {proposal.confidence_score && (
            <Badge variant="outline">信頼度: {proposal.confidence_score.toFixed(0)}%</Badge>
          )}
          <span>作成: {new Date(proposal.created_at).toLocaleString('ja-JP')}</span>
        </div>

        {/* 詳細内容 */}
        {renderResearchProposalDetail()}

        {/* アクションボタン */}
        {proposal.status === 'pending' && (
          <div className="space-y-4 mt-6 pt-6 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">却下理由（任意）</label>
              <Textarea
                placeholder="却下する理由を入力してください..."
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onReject(proposal.id, rejectComment)
                  setRejectComment('')
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                却下
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => onApprove(proposal.id)}
              >
                <Check className="w-4 h-4 mr-2" />
                承認して出品管理へ送信
              </Button>
            </div>
          </div>
        )}

        {/* ステータス表示（承認済み/却下済み） */}
        {proposal.status !== 'pending' && (
          <div className="mt-6 pt-6 border-t">
            <div
              className={`p-4 rounded-lg ${
                proposal.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold mb-2">
                {proposal.status === 'approved' ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-700">承認済み</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700">却下済み</span>
                  </>
                )}
              </div>
              {proposal.reviewed_by && (
                <div className="text-sm text-gray-600">
                  レビュー者: {proposal.reviewed_by}
                </div>
              )}
              {proposal.reviewed_at && (
                <div className="text-sm text-gray-600">
                  レビュー日時: {new Date(proposal.reviewed_at).toLocaleString('ja-JP')}
                </div>
              )}
              {proposal.review_comment && (
                <div className="text-sm text-gray-700 mt-2">
                  コメント: {proposal.review_comment}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
