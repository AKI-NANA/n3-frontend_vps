/**
 * 統合リサーチツール - Unified Research
 * Amazon ResearchのUIをベースにすべてのリサーチ機能を統合
 * 各タブに使い方マニュアル付き
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Package, TrendingUp, DollarSign, Star,
  HelpCircle, BookOpen, PlayCircle, CheckCircle,
  AlertCircle, Info, ChevronDown, ChevronUp,
  FileText, Download, Upload, RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

// タブコンポーネント
import AmazonResearchTab from './tabs/amazon-research-tab'
import EbayResearchTab from './tabs/ebay-research-tab'
import YahooResearchTab from './tabs/yahoo-research-tab'
import BatchProcessTab from './tabs/batch-process-tab'
import AIAnalysisTab from './tabs/ai-analysis-tab'
import KaritoriTab from './tabs/karitori-tab'
import SupplierSearchTab from './tabs/supplier-search-tab'
import ApprovalManagementTab from './tabs/approval-management-tab'

// 統計情報の型
interface ResearchStats {
  totalProducts: number
  avgProfitScore: number
  highProfitCount: number
  inStockCount: number
  pendingApproval: number
  todayResearched: number
  activeKaritori: number
  apiStatus: {
    keepa: boolean
    ebay: boolean
    paapi: boolean
  }
}

export default function UnifiedResearchPage() {
  const [activeTab, setActiveTab] = useState('amazon')
  const [showManual, setShowManual] = useState(false)
  const [stats, setStats] = useState<ResearchStats>({
    totalProducts: 0,
    avgProfitScore: 0,
    highProfitCount: 0,
    inStockCount: 0,
    pendingApproval: 0,
    todayResearched: 0,
    activeKaritori: 0,
    apiStatus: {
      keepa: false,
      ebay: false,
      paapi: false
    }
  })

  useEffect(() => {
    loadStats()
    checkApiStatus()
  }, [])

  const loadStats = async () => {
    try {
      const [amazonRes, researchRes] = await Promise.all([
        fetch('/api/amazon/stats'),
        fetch('/api/research-table/list')
      ])
      
      const amazonData = await amazonRes.json()
      const researchData = await researchRes.json()
      
      setStats(prev => ({
        ...prev,
        totalProducts: amazonData.totalProducts || 0,
        avgProfitScore: amazonData.avgProfitScore || 0,
        highProfitCount: amazonData.highProfitCount || 0,
        inStockCount: amazonData.inStockCount || 0,
        pendingApproval: researchData.items?.filter((i: any) => i.status === 'new').length || 0,
        todayResearched: researchData.items?.filter((i: any) => {
          const today = new Date().toDateString()
          return new Date(i.created_at).toDateString() === today
        }).length || 0
      }))
    } catch (error) {
      console.error('Stats loading error:', error)
    }
  }

  const checkApiStatus = async () => {
    try {
      const [keepaRes, ebayRes] = await Promise.all([
        fetch('/api/keepa/token-status').catch(() => null),
        fetch('/api/ebay/auth/status').catch(() => null)
      ])
      
      setStats(prev => ({
        ...prev,
        apiStatus: {
          keepa: keepaRes?.ok || false,
          ebay: ebayRes?.ok || false,
          paapi: false // PA-APIは環境変数確認が必要
        }
      }))
    } catch (error) {
      console.error('API status check error:', error)
    }
  }

  // タブごとのマニュアル内容
  const getManualContent = () => {
    switch (activeTab) {
      case 'amazon':
        return <AmazonManual />
      case 'ebay':
        return <EbayManual />
      case 'yahoo':
        return <YahooManual />
      case 'batch':
        return <BatchManual />
      case 'ai':
        return <AIManual />
      case 'karitori':
        return <KaritoriManual />
      case 'supplier':
        return <SupplierManual />
      case 'approval':
        return <ApprovalManual />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">統合リサーチツール</h1>
          <p className="text-muted-foreground mt-2">
            すべてのマーケットプレイスを一元管理
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowManual(!showManual)}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            使い方マニュアル
          </Button>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            更新
          </Button>
        </div>
      </div>

      {/* API状態アラート */}
      <div className="flex gap-2">
        {!stats.apiStatus.keepa && (
          <Alert className="flex-1">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Keepa API未設定</AlertTitle>
            <AlertDescription>
              .env.localに KEEPA_API_KEY を設定してください
            </AlertDescription>
          </Alert>
        )}
        {!stats.apiStatus.ebay && (
          <Alert className="flex-1">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>eBay API未認証</AlertTitle>
            <AlertDescription>
              設定画面からeBay APIを認証してください
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* 統計カード */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総商品数</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平均スコア</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProfitScore.toFixed(0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">高利益</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highProfitCount}</div>
            <p className="text-xs text-muted-foreground">スコア80+</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在庫あり</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inStockCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">承認待ち</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingApproval}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本日分析</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayResearched}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">刈り取り</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeKaritori}</div>
            <p className="text-xs text-muted-foreground">監視中</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API状態</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-1">
              <div className={`w-2 h-2 rounded-full ${stats.apiStatus.keepa ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className={`w-2 h-2 rounded-full ${stats.apiStatus.ebay ? 'bg-green-500' : 'bg-red-500'}`} />
              <div className={`w-2 h-2 rounded-full ${stats.apiStatus.paapi ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">K/E/P</p>
          </CardContent>
        </Card>
      </div>

      {/* マニュアル表示 */}
      {showManual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} リサーチマニュアル
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getManualContent()}
          </CardContent>
        </Card>
      )}

      {/* メインタブ */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
          <TabsTrigger value="amazon" className="text-xs">
            <span className="hidden sm:inline mr-1">🟠</span>
            Amazon
          </TabsTrigger>
          <TabsTrigger value="ebay" className="text-xs">
            <span className="hidden sm:inline mr-1">🔴</span>
            eBay
          </TabsTrigger>
          <TabsTrigger value="yahoo" className="text-xs">
            <span className="hidden sm:inline mr-1">🟣</span>
            Yahoo
          </TabsTrigger>
          <TabsTrigger value="batch" className="text-xs">
            <span className="hidden sm:inline mr-1">📦</span>
            バッチ
          </TabsTrigger>
          <TabsTrigger value="ai" className="text-xs">
            <span className="hidden sm:inline mr-1">🤖</span>
            AI分析
          </TabsTrigger>
          <TabsTrigger value="karitori" className="text-xs">
            <span className="hidden sm:inline mr-1">⏰</span>
            刈り取り
          </TabsTrigger>
          <TabsTrigger value="supplier" className="text-xs">
            <span className="hidden sm:inline mr-1">🏭</span>
            仕入先
          </TabsTrigger>
          <TabsTrigger value="approval" className="text-xs">
            <span className="hidden sm:inline mr-1">✅</span>
            承認
          </TabsTrigger>
        </TabsList>

        <TabsContent value="amazon" className="mt-6">
          <AmazonResearchTab />
        </TabsContent>

        <TabsContent value="ebay" className="mt-6">
          <EbayResearchTab />
        </TabsContent>

        <TabsContent value="yahoo" className="mt-6">
          <YahooResearchTab />
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <BatchProcessTab />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AIAnalysisTab />
        </TabsContent>

        <TabsContent value="karitori" className="mt-6">
          <KaritoriTab />
        </TabsContent>

        <TabsContent value="supplier" className="mt-6">
          <SupplierSearchTab />
        </TabsContent>

        <TabsContent value="approval" className="mt-6">
          <ApprovalManagementTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// マニュアルコンポーネント
function AmazonManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-orange-500 pl-4">
        <h3 className="font-semibold mb-2">Amazon商品リサーチの使い方</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>検索方法を選択（ASIN/キーワード）</li>
          <li>検索条件を入力</li>
          <li>「検索」ボタンをクリック</li>
          <li>結果が表示され、自動的にスコアリング</li>
        </ol>
      </div>
      
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
          <ChevronDown className="w-4 h-4" />
          詳細な使用例
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">例: ASIN検索</h4>
            <pre className="text-xs bg-white p-2 rounded border">
{`入力: B08N5WRWNW
↓
結果:
- 商品名: Echo Dot (第4世代)
- 価格: ¥5,980
- 利益率: 35%
- スコア: 85点（高利益商品）
- 推奨: 仕入れ推奨`}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function EbayManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-red-500 pl-4">
        <h3 className="font-semibold mb-2">eBay売れ筋分析の使い方</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>分析モード選択（売れ筋/セラー/キーワード）</li>
          <li>マーケット選択（US/UK/DE等）</li>
          <li>フィルター設定（価格帯、状態）</li>
          <li>キーワード入力して検索</li>
        </ol>
      </div>
      
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
          <ChevronDown className="w-4 h-4" />
          売れ筋分析の例
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">例: Vintage Watch検索</h4>
            <pre className="text-xs bg-white p-2 rounded border">
{`検索: "vintage rolex watch"
フィルター: $1000-$5000, 売れ筋のみ
↓
結果:
- 30日間で158個販売
- 平均価格: $2,850
- 利益率: 28%
- 競合セラー: 12名
- 推奨: 中リスク・中利益`}
            </pre>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

function YahooManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-purple-500 pl-4">
        <h3 className="font-semibold mb-2">Yahoo Auctionsリサーチ</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>商品IDまたはURLを入力</li>
          <li>複数の場合は改行で区切る</li>
          <li>「分析開始」をクリック</li>
          <li>落札価格の推移を確認</li>
        </ol>
      </div>
    </div>
  )
}

function BatchManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-blue-500 pl-4">
        <h3 className="font-semibold mb-2">バッチ処理の使い方</h3>
        <p className="text-sm mb-2">最大1000件まで一括処理可能</p>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>CSVファイルを準備（ASIN列必須）</li>
          <li>ファイルをアップロード</li>
          <li>処理開始</li>
          <li>進捗バーで状況確認</li>
          <li>完了後、結果をダウンロード</li>
        </ol>
      </div>
      
      <div className="p-3 bg-amber-50 rounded-lg">
        <p className="text-xs">
          <strong>💡 Tip:</strong> ExcelやGoogleスプレッドシートから直接コピペも可能
        </p>
      </div>
    </div>
  )
}

function AIManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-green-500 pl-4">
        <h3 className="font-semibold mb-2">AI自動分析</h3>
        <p className="text-sm mb-2">Claude/Gemini APIによる高度な分析</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>トレンド予測</li>
          <li>ニッチ市場発見</li>
          <li>季節性分析</li>
          <li>競合分析</li>
        </ul>
      </div>
    </div>
  )
}

function KaritoriManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-yellow-500 pl-4">
        <h3 className="font-semibold mb-2">刈り取り監視設定</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>監視したい商品を選択</li>
          <li>目標価格を設定</li>
          <li>通知方法を選択</li>
          <li>監視開始</li>
        </ol>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>自動実行</AlertTitle>
        <AlertDescription>
          価格が目標値に達すると自動で通知されます
        </AlertDescription>
      </Alert>
    </div>
  )
}

function SupplierManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-indigo-500 pl-4">
        <h3 className="font-semibold mb-2">仕入先探索</h3>
        <p className="text-sm mb-2">AIが最適な仕入先を自動検索</p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Amazon JP</li>
          <li>楽天市場</li>
          <li>Yahoo!ショッピング</li>
          <li>メルカリ</li>
          <li>その他ECサイト</li>
        </ul>
      </div>
    </div>
  )
}

function ApprovalManual() {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-emerald-500 pl-4">
        <h3 className="font-semibold mb-2">承認管理フロー</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>リサーチ済み商品が自動的にリスト表示</li>
          <li>スコアと利益率を確認</li>
          <li>承認/却下を選択</li>
          <li>承認済みはEditing N3へ送信可能</li>
        </ol>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="p-2 bg-blue-50 rounded">
          <strong>新規:</strong> 未確認
        </div>
        <div className="p-2 bg-green-50 rounded">
          <strong>承認:</strong> 仕入れOK
        </div>
        <div className="p-2 bg-red-50 rounded">
          <strong>却下:</strong> スキップ
        </div>
      </div>
    </div>
  )
}
