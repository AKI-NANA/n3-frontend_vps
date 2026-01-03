'use client'

import { Check, X, Eye, TrendingUp, AlertTriangle, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { AIProposal } from '@/lib/ai-proposals/types'
import { isResearchProposal } from '@/lib/ai-proposals/types'

interface ProposalCardProps {
  proposal: AIProposal
  onOpenDetail: (proposal: AIProposal) => void
  onApprove: (proposalId: string) => void
  onReject: (proposalId: string) => void
}

export default function ProposalCard({
  proposal,
  onOpenDetail,
  onApprove,
  onReject,
}: ProposalCardProps) {
  // 優先度に応じた色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  // リスクレベルの色
  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  // 提案タイプのアイコン
  const getTypeIcon = () => {
    switch (proposal.type) {
      case 'research_proposal':
        return <Package className="w-5 h-5" />
      case 'bookkeeping_proposal':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  // 提案タイプの日本語名
  const getTypeName = () => {
    switch (proposal.type) {
      case 'research_proposal':
        return '出品提案'
      case 'bookkeeping_proposal':
        return '記帳ルール提案'
      default:
        return '提案'
    }
  }

  // リサーチ提案の場合、商品情報を表示
  const renderResearchProposal = () => {
    if (!isResearchProposal(proposal)) return null

    const data = proposal.proposal_data

    return (
      <div className="flex items-start gap-4">
        {/* 商品画像 */}
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="w-24 h-24 object-cover rounded"
          />
        )}

        {/* 商品情報 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
            {data.title_jp || data.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-gray-500 text-xs">販売価格</div>
              <div className="font-bold text-blue-600">${data.price.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">仕入価格</div>
              <div className="font-semibold">${data.cost_price.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">推定利益</div>
              <div className="font-bold text-green-600">
                ${data.estimated_profit.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">利益率</div>
              <div className="font-bold text-green-600">
                {data.profit_rate.toFixed(1)}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-sm">
            <Badge variant="outline">{data.source.toUpperCase()}</Badge>
            <span className="text-gray-500">仕入先: {data.supplier}</span>
            <span className={`font-medium ${getRiskColor(data.risk_level)}`}>
              {data.risk_level === 'low' && '低リスク'}
              {data.risk_level === 'medium' && '中リスク'}
              {data.risk_level === 'high' && '高リスク'}
            </span>
            {data.total_score && (
              <span className="text-gray-500">スコア: {data.total_score.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            {/* ヘッダー */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${getPriorityColor(proposal.priority)} border`}>
                {getTypeIcon()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-700">{getTypeName()}</span>
                  <Badge
                    variant="outline"
                    className={getPriorityColor(proposal.priority)}
                  >
                    {proposal.priority === 'high' && '高優先度'}
                    {proposal.priority === 'medium' && '中優先度'}
                    {proposal.priority === 'low' && '低優先度'}
                  </Badge>
                  {proposal.confidence_score && (
                    <Badge variant="secondary">
                      信頼度: {proposal.confidence_score.toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <div className="text-lg font-semibold">{proposal.title}</div>
                {proposal.description && (
                  <div className="text-sm text-gray-600 mt-1">{proposal.description}</div>
                )}
              </div>
            </div>

            {/* 提案内容 */}
            {renderResearchProposal()}

            {/* メタデータ */}
            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
              <span>作成: {new Date(proposal.created_at).toLocaleString('ja-JP')}</span>
              <span>ソース: {proposal.source_system}</span>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenDetail(proposal)}
            >
              <Eye className="w-4 h-4 mr-1" />
              詳細
            </Button>
            {proposal.status === 'pending' && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApprove(proposal.id)}
                >
                  <Check className="w-4 h-4 mr-1" />
                  承認
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onReject(proposal.id)}
                >
                  <X className="w-4 h-4 mr-1" />
                  却下
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
