"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { ImageGenerationLog } from '@/types/ai'
import ImageGenerationLogList from '@/components/ai-hub/image-generation-log-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AIProposalsHub() {
  const [imageGenerationLogs, setImageGenerationLogs] = useState<ImageGenerationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchImageGenerationLogs()
  }, [])

  const fetchImageGenerationLogs = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('image_generation_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      setImageGenerationLogs(data || [])
    } catch (err: any) {
      console.error('画像生成ログの取得エラー:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRetryImageGeneration = async (logId: number) => {
    try {
      // 再実行APIを呼び出す（後で実装）
      const response = await fetch('/api/media/image-automator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ retry: true, logId })
      })

      if (!response.ok) throw new Error('画像生成の再実行に失敗しました')

      // ログを再取得
      fetchImageGenerationLogs()
    } catch (err: any) {
      console.error('再実行エラー:', err)
      alert(err.message)
    }
  }

  const handleApproveImage = async (logId: number) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('image_generation_log')
        .update({ status: 'approved_use' })
        .eq('id', logId)

      if (error) throw error

      // ログを再取得
      fetchImageGenerationLogs()
    } catch (err: any) {
      console.error('承認エラー:', err)
      alert(err.message)
    }
  }

  const handleRejectImage = async (logId: number) => {
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('image_generation_log')
        .update({ status: 'failed' })
        .eq('id', logId)

      if (error) throw error

      // ログを再取得
      fetchImageGenerationLogs()
    } catch (err: any) {
      console.error('却下エラー:', err)
      alert(err.message)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI提案管理ハブ</h1>
        <p className="text-muted-foreground">
          AIによる画像生成提案と出品提案を一元管理し、承認・却下・再実行を行います。
        </p>
      </div>

      <Tabs defaultValue="image-generation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="image-generation">画像生成ログ</TabsTrigger>
          <TabsTrigger value="listing-proposals">出品提案（準備中）</TabsTrigger>
        </TabsList>

        <TabsContent value="image-generation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>画像生成履歴</CardTitle>
              <CardDescription>
                AIが生成した画像のプロンプト、ステータス、コストを確認できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                  エラー: {error}
                </div>
              ) : (
                <ImageGenerationLogList
                  logs={imageGenerationLogs}
                  onRetry={handleRetryImageGeneration}
                  onApprove={handleApproveImage}
                  onReject={handleRejectImage}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listing-proposals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>出品提案（準備中）</CardTitle>
              <CardDescription>
                統合リサーチシステムからの出品提案を確認・承認できます。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                この機能は準備中です。統合リサーチシステムの実装後に利用可能になります。
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
