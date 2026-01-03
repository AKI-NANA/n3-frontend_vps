<<<<<<< HEAD
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { getSortedNavigationItems, NavigationItem, SubMenuItem } from '@/components/layout/sidebar-config'

const statusConfig = {
  ready: { label: '稼働中', className: 'bg-green-500/80 text-white' },
  new: { label: '新機能', className: 'bg-blue-500/80 text-white' },
  pending: { label: '準備中', className: 'bg-yellow-500/80 text-white' }
}

export default function ToolsHubPage() {
  // サイドバー設定から全ツールを取得
  const navigationItems = getSortedNavigationItems()
  
  // 全てのサブメニュー項目を抽出
  const allTools: Array<SubMenuItem & { categoryLabel: string; categoryIcon: string }> = []
  
  navigationItems.forEach((category) => {
    if (category.submenu && category.submenu.length > 0) {
      category.submenu.forEach((tool) => {
        allTools.push({
          ...tool,
          categoryLabel: category.label,
          categoryIcon: category.icon
        })
      })
    }
  })

  // カテゴリごとにグループ化
  const toolsByCategory: Record<string, typeof allTools> = {}
  allTools.forEach((tool) => {
    if (!toolsByCategory[tool.categoryLabel]) {
      toolsByCategory[tool.categoryLabel] = []
    }
    toolsByCategory[tool.categoryLabel].push(tool)
  })

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔧 ツールハブ</h1>
        <p className="text-gray-600">
          n3-frontend - 全{allTools.length}ツールの統合管理ページ
        </p>
      </div>

      {/* カテゴリごとに表示 */}
      <div className="space-y-12">
        {Object.entries(toolsByCategory).map(([categoryLabel, tools]) => (
          <div key={categoryLabel}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              {categoryLabel}
              <Badge variant="outline" className="text-sm">
                {tools.length}ツール
              </Badge>
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => {
                const status = statusConfig[tool.status as keyof typeof statusConfig] || statusConfig.pending
                
                return (
                  <Card key={tool.link} className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{tool.text}</CardTitle>
                        <Badge className={status.className}>
                          {status.label}
                        </Badge>
                      </div>
                      {tool.database && (
                        <Badge variant="outline" className="w-fit text-xs">
                          DB: {tool.database}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Link
                        href={tool.link}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        ツールを開く
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 統計サマリー */}
      <div className="mt-12 grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">総ツール数</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{allTools.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">稼働中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {allTools.filter(t => t.status === 'ready').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">新機能</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {allTools.filter(t => t.status === 'new').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-600">準備中</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {allTools.filter(t => t.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 開発ガイド */}
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">📚 開発ガイド</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">●</span>
            <span>新しいツールを追加する場合は、<code className="bg-white px-2 py-0.5 rounded">components/layout/sidebar-config.ts</code>を編集してください</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">●</span>
            <span>サイドバーとこのツールハブページは自動的に同期されます</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">●</span>
            <span>ツールの優先度は<code className="bg-white px-2 py-0.5 rounded">priority</code>プロパティで調整できます（小さいほど上に表示）</span>
          </li>
        </ul>
      </div>
    </div>
  )
=======
// app/tools/editing-n3/page.tsx
/**
 * Editing N3 Page - N3デザインシステム版エントリーポイント
 * 
 * このファイルは、N3コンポーネントを使用した新しいUIを提供します。
 * Hooks、Services、Typesはすべて tools/editing から参照し、
 * UI層のみをN3コンポーネントで置き換えています。
 * 
 * 設計原則:
 * - Hooks層（ビジネスロジック）: tools/editing からそのまま参照
 * - Services層（API通信）: tools/editing からそのまま参照
 * - Types層（型定義）: tools/editing からそのまま参照
 * - UI層（コンポーネント）: N3コンポーネントで再構築
 */

'use client';

import { EditingN3PageLayout } from './components/layouts/editing-n3-page-layout';

export default function EditingN3Page() {
  return <EditingN3PageLayout />;
>>>>>>> fdea69ee91cbefc7650420e2b4b21ad0cc0488ce
}
