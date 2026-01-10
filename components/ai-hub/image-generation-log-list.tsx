"use client"

import { ImageGenerationLog } from '@/types/ai'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  Clock,
  ThumbsUp,
  RefreshCw,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react'

interface ImageGenerationLogListProps {
  logs: ImageGenerationLog[]
  onRetry: (logId: number) => void
  onApprove: (logId: number) => void
  onReject: (logId: number) => void
}

const statusConfig = {
  success: { label: '成功', icon: CheckCircle, color: 'bg-green-500/10 text-green-700 border-green-500/20' },
  failed: { label: '失敗', icon: XCircle, color: 'bg-red-500/10 text-red-700 border-red-500/20' },
  pending_review: { label: 'レビュー待ち', icon: Clock, color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20' },
  approved_use: { label: '承認済み', icon: ThumbsUp, color: 'bg-blue-500/10 text-blue-700 border-blue-500/20' },
}

export default function ImageGenerationLogList({
  logs,
  onRetry,
  onApprove,
  onReject
}: ImageGenerationLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">画像生成ログがありません</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">ID</TableHead>
            <TableHead>元のコンセプト</TableHead>
            <TableHead>最適化プロンプト</TableHead>
            <TableHead>モデル</TableHead>
            <TableHead className="text-right">コスト</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>生成日時</TableHead>
            <TableHead className="text-right">アクション</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const config = statusConfig[log.status] || statusConfig.pending_review
            const StatusIcon = config.icon

            return (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.id}</TableCell>

                <TableCell>
                  <div className="max-w-xs truncate text-sm">
                    {log.prompt_original || '-'}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-md">
                    <p className="text-sm truncate">{log.prompt_optimized}</p>
                    {log.generated_image_url && (
                      <a
                        href={log.generated_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        画像を表示 <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm font-mono">{log.generation_model || '-'}</span>
                </TableCell>

                <TableCell className="text-right">
                  <span className="text-sm font-mono">${log.cost_usd.toFixed(2)}</span>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className={config.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </TableCell>

                <TableCell>
                  <div className="flex justify-end gap-2">
                    {log.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRetry(log.id)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        再実行
                      </Button>
                    )}

                    {(log.status === 'success' || log.status === 'pending_review') && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => onApprove(log.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          承認
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onReject(log.id)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          却下
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
