'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle, Clock, Globe, Loader2, Play, TrendingUp, Video, FileText, Languages, Zap, HelpCircle, BookOpen, Rocket, DollarSign, Settings, Info, X } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  topic: string;
  status: string;
  buzz_score: number;
  created_at: string;
  scheduled_at?: string;
  contents?: any[];
}

export default function GlobalDataPulsePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [showManual, setShowManual] = useState(false);
  
  // Form states
  const [topic, setTopic] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState(['ja', 'en', 'zh']);
  const [schedulePost, setSchedulePost] = useState(true);
  const [generateVideo, setGenerateVideo] = useState(true);
  const [priority, setPriority] = useState('50');
  
  // Queue states
  const [queueItems, setQueueItems] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
    fetchQueue();
    
    const interval = setInterval(() => {
      if (activeTab === 'monitor') {
        fetchProjects();
        fetchQueue();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/gdp/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchQueue = async () => {
    try {
      const response = await fetch('/api/gdp/queue');
      const data = await response.json();
      if (data.success) {
        setQueueItems(data.queue || []);
      }
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!topic) {
      toast.error('トピックを入力してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/gdp/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          sourceUrl,
          languages: selectedLanguages,
          schedulePost,
          generateVideo,
          priority: parseInt(priority)
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('プロジェクトを作成しました');
        setTopic('');
        setSourceUrl('');
        fetchProjects();
        setActiveTab('monitor');
      } else {
        toast.error(data.error || 'プロジェクト作成に失敗しました');
      }
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: '待機中', variant: 'secondary' },
      generating: { label: '生成中', variant: 'default' },
      processing: { label: '処理中', variant: 'default' },
      scheduled: { label: '予約済', variant: 'outline' },
      published: { label: '公開済', variant: 'default' },
      completed: { label: '完了', variant: 'default' },
      failed: { label: 'エラー', variant: 'destructive' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const getBuzzScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-gray-600';
  };

  return (
    <div 
      className="flex flex-col" 
      style={{ 
        background: 'var(--bg)',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Header - workspaceスタイル */}
      <div 
        className="flex items-center justify-between px-6 py-3 border-b shrink-0"
        style={{ 
          background: 'var(--panel)', 
          borderColor: 'var(--panel-border)',
          minHeight: '56px'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" style={{ color: '#8B5CF6' }} />
            <h1 className="text-lg font-semibold">Global Data Pulse</h1>
          </div>
          <Badge variant="outline" className="text-xs">
            AI自動メディア運用
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowManual(!showManual)}
          >
            <HelpCircle className="h-4 w-4 mr-1" />
            使い方
          </Button>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>本日: {projects.filter(p => p.status === 'completed').length}件</span>
          </div>
          <Button size="sm" variant="outline">
            <Zap className="h-4 w-4 mr-1" />
            自動モード
          </Button>
        </div>
      </div>

      {/* Manual Modal */}
      {showManual && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowManual(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
              style={{ background: 'var(--panel)' }}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--panel-border)' }}>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Global Data Pulse 使い方ガイド
                </h2>
                <button
                  onClick={() => setShowManual(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>

              <div className="grid grid-cols-2 gap-6">
                {/* クイックスタート */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Rocket className="h-4 w-4" />
                      クイックスタート（3ステップ）
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">1</div>
                      <div>
                        <div className="font-medium text-sm">トピックを入力</div>
                        <div className="text-xs text-gray-600 mt-1">
                          例：「AI投資が5000億ドルに到達」
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">2</div>
                      <div>
                        <div className="font-medium text-sm">オプション設定</div>
                        <div className="text-xs text-gray-600 mt-1">
                          言語選択、動画生成ON/OFF
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">3</div>
                      <div>
                        <div className="font-medium text-sm">生成開始</div>
                        <div className="text-xs text-gray-600 mt-1">
                          自動で記事・動画が完成！
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 自動生成される内容 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Zap className="h-4 w-4" />
                      自動生成される内容
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">SEO最適化ブログ記事（3言語）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">YouTube動画台本</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">AIナレーション音声</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">背景動画（Pexels）</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">自動字幕・グラフ</span>
                    </div>
                  </CardContent>
                </Card>

                {/* 活用例 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="h-4 w-4" />
                      活用例
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="font-medium text-sm text-blue-600">日々のニュース解説</div>
                      <div className="text-xs text-gray-600">
                        「日経平均4万円突破」→ 市場分析記事
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-green-600">トレンド分析</div>
                      <div className="text-xs text-gray-600">
                        「生成AI市場100兆円」→ データ動画
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-sm text-purple-600">企業ニュース</div>
                      <div className="text-xs text-gray-600">
                        「トヨタ全固体電池」→ 技術解説
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* コスト・設定 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <DollarSign className="h-4 w-4" />
                      コスト目安
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>OpenAI（記事生成）</span>
                      <span className="font-medium">$0.50-1.00/記事</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pexels（動画素材）</span>
                      <span className="font-medium text-green-600">無料</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ElevenLabs（音声）</span>
                      <span className="font-medium">$0.20-0.30/動画</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>合計（1プロジェクト）</span>
                        <span>約$1.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ヒント */}
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm text-blue-900 mb-1">成功のコツ</div>
                    <div className="text-xs text-blue-800 space-y-1">
                      <div>• 数字が入っているニュースを選ぶ（例：「5000億ドル」「2026年」）</div>
                      <div>• 比較可能なデータがあるトピックが効果的</div>
                      <div>• 重要ニュースは即座に、分析記事は翌朝に投稿</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* API設定状態 */}
              <div className="mt-4 grid grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>OpenAI API</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Supabase</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Pexels API</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-500">ElevenLabs（任意）</span>
                </div>
              </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Tab List */}
          <div 
            className="border-b shrink-0 px-6"
            style={{ 
              background: 'var(--panel)', 
              borderColor: 'var(--panel-border)' 
            }}
          >
            <TabsList className="h-10 bg-transparent p-0 border-0">
              <TabsTrigger value="create" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
                <FileText className="h-4 w-4 mr-2" />
                コンテンツ作成
              </TabsTrigger>
              <TabsTrigger value="queue" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
                <Clock className="h-4 w-4 mr-2" />
                生成キュー
              </TabsTrigger>
              <TabsTrigger value="monitor" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
                <TrendingUp className="h-4 w-4 mr-2" />
                モニター
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500">
                <Globe className="h-4 w-4 mr-2" />
                分析
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto" style={{ background: 'var(--bg)' }}>
            <div className="p-6">
              {/* Create Tab */}
              <TabsContent value="create" className="m-0">
                <div className="grid grid-cols-3 gap-6">
                  {/* Left Panel - Input */}
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardHeader>
                      <CardTitle className="text-lg">トピック入力</CardTitle>
                      <CardDescription>生成するコンテンツのテーマを設定</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="topic">メイントピック *</Label>
                        <Textarea
                          id="topic"
                          placeholder="例: AI投資が2026年に5000億ドルに到達"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          rows={3}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="source">ソースURL（任意）</Label>
                        <Input
                          id="source"
                          type="url"
                          placeholder="https://example.com/news"
                          value={sourceUrl}
                          onChange={(e) => setSourceUrl(e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>生成言語</Label>
                        <div className="flex gap-3 mt-2">
                          {['ja', 'en', 'zh'].map((lang) => (
                            <Label key={lang} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedLanguages.includes(lang)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLanguages([...selectedLanguages, lang]);
                                  } else {
                                    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
                                  }
                                }}
                                className="rounded"
                              />
                              <span className="text-sm">
                                {lang === 'ja' ? '日本語' : lang === 'en' ? 'English' : '中文'}
                              </span>
                            </Label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="priority">優先度</Label>
                        <Select value={priority} onValueChange={setPriority}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">最高</SelectItem>
                            <SelectItem value="75">高</SelectItem>
                            <SelectItem value="50">通常</SelectItem>
                            <SelectItem value="25">低</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Center Panel - Options */}
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardHeader>
                      <CardTitle className="text-lg">生成オプション</CardTitle>
                      <CardDescription>コンテンツの生成設定</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="schedule">予約投稿</Label>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>最適な時間に自動投稿</p>
                        </div>
                        <Switch
                          id="schedule"
                          checked={schedulePost}
                          onCheckedChange={setSchedulePost}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="video">動画生成</Label>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>YouTube用動画を作成</p>
                        </div>
                        <Switch
                          id="video"
                          checked={generateVideo}
                          onCheckedChange={setGenerateVideo}
                        />
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-3">生成内容</h4>
                        <div className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>ブログ記事（1000-1500文字）</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>YouTube台本（2分）</span>
                          </div>
                          {generateVideo && (
                            <>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>ナレーション音声</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>実写背景動画（Pexels）</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <Button 
                        className="w-full"
                        onClick={handleCreateProject}
                        disabled={loading || !topic}
                        style={{ 
                          background: loading || !topic ? 'var(--text-muted)' : '#8B5CF6',
                          color: 'white'
                        }}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            生成中...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            生成開始
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Right Panel - Preview */}
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardHeader>
                      <CardTitle className="text-lg">プレビュー</CardTitle>
                      <CardDescription>生成される内容の概要</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {topic ? (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">トピック</h4>
                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{topic}</p>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">生成言語</h4>
                            <div className="flex gap-2">
                              {selectedLanguages.map(lang => (
                                <Badge key={lang} variant="secondary">
                                  {lang === 'ja' ? '🇯🇵 日本語' : lang === 'en' ? '🇺🇸 English' : '🇨🇳 中文'}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">予想生成時間</h4>
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <Clock className="h-4 w-4" />
                              <span>{generateVideo ? '約5-7分' : '約2-3分'}</span>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">投稿スケジュール</h4>
                            {schedulePost ? (
                              <div className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                                <div>🇯🇵 日本: 明日 7:00</div>
                                <div>🇺🇸 英語: 明日 14:00</div>
                                <div>🇨🇳 中国: 明日 20:00</div>
                              </div>
                            ) : (
                              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>即時公開</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8" style={{ color: 'var(--text-muted)' }}>
                          <AlertCircle className="h-12 w-12 mx-auto mb-3" />
                          <p className="text-sm">トピックを入力すると<br />プレビューが表示されます</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Queue Tab */}
              <TabsContent value="queue" className="m-0">
                <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>生成キュー</CardTitle>
                        <CardDescription>処理待ちのプロジェクト</CardDescription>
                      </div>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        全て処理
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {queueItems.length > 0 ? (
                        queueItems.map((item, index) => (
                          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--panel-border)' }}>
                            <div className="flex items-center gap-4">
                              <div className="text-2xl font-bold" style={{ color: 'var(--text-muted)' }}>
                                #{index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{item.input_data?.topic || 'Untitled'}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    優先度: {item.priority}
                                  </Badge>
                                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    追加: {new Date(item.created_at).toLocaleString('ja-JP')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.status === 'processing' ? (
                                <Badge variant="default">
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  処理中
                                </Badge>
                              ) : (
                                <Badge variant="secondary">待機中</Badge>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                          <Clock className="h-12 w-12 mx-auto mb-3" />
                          <p>キューは空です</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Monitor Tab */}
              <TabsContent value="monitor" className="m-0">
                <div className="space-y-4">
                  {projects.map((project) => (
                    <Card key={project.id} style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`text-3xl font-bold ${getBuzzScoreColor(project.buzz_score)}`}>
                              {project.buzz_score}
                            </div>
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                {getStatusBadge(project.status)}
                                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                  {new Date(project.created_at).toLocaleString('ja-JP')}
                                </span>
                                {project.contents && project.contents.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Languages className="h-3 w-3" />
                                    <span className="text-xs">{project.contents.length}言語</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {project.status === 'generating' && (
                              <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--text-muted)' }} />
                            )}
                            {project.status === 'completed' && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            {project.status === 'failed' && (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                        </div>
                        
                        {project.status === 'generating' && (
                          <div className="mt-4">
                            <Progress value={45} className="h-2" />
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>コンテンツ生成中...</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {projects.length === 0 && (
                    <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                      <CardContent className="py-12 text-center" style={{ color: 'var(--text-muted)' }}>
                        <Globe className="h-12 w-12 mx-auto mb-3" />
                        <p>プロジェクトがありません</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="m-0">
                <div className="grid grid-cols-4 gap-4">
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">
                        {projects.filter(p => p.status === 'completed').length}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>完了プロジェクト</p>
                    </CardContent>
                  </Card>
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">
                        {projects.filter(p => p.status === 'published').length * 3}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>公開記事数</p>
                    </CardContent>
                  </Card>
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">
                        {projects.filter(p => p.buzz_score >= 80).length}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>高スコア案件</p>
                    </CardContent>
                  </Card>
                  <Card style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(projects.reduce((acc, p) => acc + (p.buzz_score || 0), 0) / (projects.length || 1))}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>平均バズスコア</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6" style={{ background: 'var(--panel)', borderColor: 'var(--panel-border)' }}>
                  <CardHeader>
                    <CardTitle>パフォーマンストレンド</CardTitle>
                    <CardDescription>過去7日間の生成状況</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 mx-auto mb-3" />
                        <p>グラフデータを準備中...</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
