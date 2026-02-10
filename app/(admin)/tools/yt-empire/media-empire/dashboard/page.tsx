'use client';

import React, { useState } from 'react';
import { 
  Play, 
  FileText, 
  BookOpen, 
  Settings,
  ChevronRight,
  Youtube,
  BarChart3,
  Users,
  Layers,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// ============================================================================
// Empire OS Dashboard - メインページ
// ============================================================================

export default function MediaEmpireDashboard() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Empire OS</h1>
                <p className="text-sm text-muted-foreground">メディア帝国統治システム</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                システム稼働中
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                設定
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="アクティブチャンネル"
            value="12"
            subValue="/ 1,000 ch"
            icon={<Youtube className="w-5 h-5" />}
            trend="+3 今週"
            color="blue"
          />
          <StatsCard
            title="コンテンツ生成中"
            value="47"
            subValue="件"
            icon={<Layers className="w-5 h-5" />}
            trend="24件 完了待ち"
            color="purple"
          />
          <StatsCard
            title="原子データ"
            value="2,847"
            subValue="件"
            icon={<FileText className="w-5 h-5" />}
            trend="+156 今月"
            color="green"
          />
          <StatsCard
            title="月間収益"
            value="¥847,320"
            subValue=""
            icon={<TrendingUp className="w-5 h-5" />}
            trend="+12.3%"
            color="amber"
          />
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左側: チャンネルリスト */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">チャンネル一覧</h2>
                <Button variant="ghost" size="sm">
                  すべて表示
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-2">
                <ChannelItem
                  name="宅建合格チャンネル"
                  cluster="TAKKEN"
                  status="active"
                  subscribers={12500}
                  isSelected={selectedChannel === 'takken'}
                  onClick={() => setSelectedChannel('takken')}
                />
                <ChannelItem
                  name="簿記マスター講座"
                  cluster="BOKI"
                  status="active"
                  subscribers={8700}
                  isSelected={selectedChannel === 'boki'}
                  onClick={() => setSelectedChannel('boki')}
                />
                <ChannelItem
                  name="ITパスポート攻略"
                  cluster="IT_PASSPORT"
                  status="draft"
                  subscribers={0}
                  isSelected={selectedChannel === 'it'}
                  onClick={() => setSelectedChannel('it')}
                />
              </div>
            </Card>

            {/* パイプライン状態 */}
            <Card className="p-4 mt-4">
              <h2 className="font-semibold mb-4">パイプライン状態</h2>
              <div className="space-y-3">
                <PipelineStatus
                  label="脚本生成中"
                  count={5}
                  color="blue"
                  icon={<FileText className="w-4 h-4" />}
                />
                <PipelineStatus
                  label="AI監査待ち"
                  count={12}
                  color="amber"
                  icon={<AlertCircle className="w-4 h-4" />}
                />
                <PipelineStatus
                  label="レンダリング中"
                  count={8}
                  color="purple"
                  icon={<Clock className="w-4 h-4" />}
                />
                <PipelineStatus
                  label="公開待ち"
                  count={22}
                  color="green"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                />
              </div>
            </Card>
          </div>

          {/* 右側: マルチプレビュー */}
          <div className="lg:col-span-2">
            <Card className="p-4 h-full">
              <Tabs defaultValue="video" className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">コンテンツプレビュー</h2>
                  <TabsList>
                    <TabsTrigger value="script" className="gap-2">
                      <FileText className="w-4 h-4" />
                      脚本
                    </TabsTrigger>
                    <TabsTrigger value="video" className="gap-2">
                      <Play className="w-4 h-4" />
                      動画
                    </TabsTrigger>
                    <TabsTrigger value="blog" className="gap-2">
                      <BookOpen className="w-4 h-4" />
                      ブログ
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* 脚本タブ */}
                <TabsContent value="script" className="flex-1 mt-0">
                  <ScriptEditorPreview />
                </TabsContent>

                {/* 動画タブ */}
                <TabsContent value="video" className="flex-1 mt-0">
                  <VideoPreview />
                </TabsContent>

                {/* ブログタブ */}
                <TabsContent value="blog" className="flex-1 mt-0">
                  <BlogPreview />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// サブコンポーネント
// ============================================================================

interface StatsCardProps {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  trend: string;
  color: 'blue' | 'purple' | 'green' | 'amber';
}

function StatsCard({ title, value, subValue, icon, trend, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold">{value}</span>
            {subValue && <span className="text-sm text-muted-foreground">{subValue}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        </div>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface ChannelItemProps {
  name: string;
  cluster: string;
  status: 'active' | 'draft' | 'paused';
  subscribers: number;
  isSelected: boolean;
  onClick: () => void;
}

function ChannelItem({ name, cluster, status, subscribers, isSelected, onClick }: ChannelItemProps) {
  const statusColors = {
    active: 'bg-green-500',
    draft: 'bg-gray-400',
    paused: 'bg-amber-500',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg border text-left transition-colors ${
        isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-transparent hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
          <div>
            <p className="font-medium text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{cluster}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{subscribers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">登録者</p>
        </div>
      </div>
    </button>
  );
}

interface PipelineStatusProps {
  label: string;
  count: number;
  color: 'blue' | 'amber' | 'purple' | 'green';
  icon: React.ReactNode;
}

function PipelineStatus({ label, count, color, icon }: PipelineStatusProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
      <div className="flex items-center gap-2">
        <span className={`p-1.5 rounded ${colorClasses[color]}`}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
}

// ============================================================================
// プレビューコンポーネント
// ============================================================================

function ScriptEditorPreview() {
  const sampleScript = {
    segments: [
      { type: 'title', text: '抵当権の効力範囲について', effect: 'highlight' },
      { type: 'text', text: '今日は宅建試験で頻出の「抵当権」について解説します。', effect: 'none' },
      { type: 'point', title: '重要ポイント', items: ['従物への効力', '付加一体物の範囲'], effect: 'list_animate' },
    ]
  };

  return (
    <div className="grid grid-cols-2 gap-4 h-[500px]">
      {/* 左: JSONエディタ */}
      <div className="border rounded-lg p-4 bg-slate-950 text-slate-100 overflow-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-slate-400">script.json</span>
        </div>
        <pre className="text-xs font-mono">
          {JSON.stringify(sampleScript, null, 2)}
        </pre>
      </div>
      
      {/* 右: プレビュー */}
      <div className="border rounded-lg p-4 bg-muted/30 overflow-auto">
        <h3 className="font-semibold mb-4 text-lg">プレビュー</h3>
        <div className="space-y-4">
          <div className="p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
            <h4 className="font-bold text-lg">抵当権の効力範囲について</h4>
          </div>
          <p className="text-sm">
            今日は宅建試験で頻出の「抵当権」について解説します。
          </p>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <h5 className="font-semibold text-sm mb-2">📌 重要ポイント</h5>
            <ul className="text-sm space-y-1">
              <li>• 従物への効力</li>
              <li>• 付加一体物の範囲</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoPreview() {
  return (
    <div className="h-[500px] flex flex-col">
      {/* 動画プレビューエリア */}
      <div className="flex-1 bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
        {/* 16:9 アスペクト比を維持 */}
        <div className="absolute inset-4 bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg flex flex-col items-center justify-center">
          {/* タイトル */}
          <div className="text-white text-2xl font-bold mb-4 px-6 py-2 bg-white/10 rounded-lg backdrop-blur">
            抵当権の効力範囲
          </div>
          
          {/* キャラクター（プレースホルダー） */}
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-16 h-16 text-white/60" />
          </div>
          
          {/* テロップ */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-black/70 text-white p-3 rounded-lg text-center">
              今日は宅建試験で頻出の「抵当権」について解説します
            </div>
          </div>
          
          {/* Remotionプレビューバッジ */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Remotion Preview
            </Badge>
          </div>
        </div>
      </div>
      
      {/* コントロール */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Play className="w-4 h-4 mr-1" />
            再生
          </Button>
          <span className="text-sm text-muted-foreground">00:00 / 10:24</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">レンダリング開始</Button>
          <Button variant="outline" size="sm">設定</Button>
        </div>
      </div>
    </div>
  );
}

function BlogPreview() {
  return (
    <div className="h-[500px] overflow-auto">
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <h1>抵当権の効力範囲について【宅建試験対策】</h1>
        
        <p className="lead">
          宅建試験において、抵当権は非常に重要なテーマです。
          特に「効力範囲」についての問題は毎年のように出題されています。
        </p>
        
        <h2>1. 抵当権とは？</h2>
        <p>
          抵当権とは、債権者が債務者の不動産を担保として、
          債務の弁済を受ける権利のことです。
        </p>
        
        <h2>2. 効力が及ぶ範囲</h2>
        <p>
          民法370条によると、抵当権の効力は「付加一体物」に及びます。
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg not-prose">
          <h4 className="font-semibold mb-2">📌 重要ポイント</h4>
          <ul className="text-sm space-y-1">
            <li>✓ 設定時に存在した従物に効力が及ぶ</li>
            <li>✓ 設定後に付加された従物にも効力が及ぶ</li>
            <li>✓ 判例（最判昭44.3.28）で確認済み</li>
          </ul>
        </div>
        
        <h2>3. まとめ</h2>
        <p>
          抵当権の効力範囲は、試験でよく出題されるポイントです。
          「付加一体物」という概念をしっかり理解しておきましょう。
        </p>
      </article>
      
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <span className="text-sm text-muted-foreground">1,247文字 | 読了時間: 約3分</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Markdownコピー</Button>
          <Button variant="outline" size="sm">WordPress投稿</Button>
        </div>
      </div>
    </div>
  );
}
