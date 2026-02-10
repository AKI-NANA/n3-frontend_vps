'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Pause, 
  RefreshCw, 
  Youtube, 
  Music, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Eye,
  ThumbsUp,
  ExternalLink,
  Loader2
} from 'lucide-react';

// ============================================================================
// 型定義
// ============================================================================

interface VideoContent {
  id: number;
  product_id: number;
  content_type: string;
  title: string;
  script: string;
  audio_url: string | null;
  media_url: string | null;
  platform_id: string | null;
  publish_status: 'draft' | 'published' | 'scheduled' | 'error';
  render_status: 'pending' | 'rendering' | 'completed' | 'error';
  metadata: {
    render_id?: string;
    genre?: string;
    scenes?: any[];
    youtube_views?: number;
    youtube_likes?: number;
  };
  created_at: string;
  updated_at: string;
}

interface RenderQueue {
  id: string;
  product_id: number;
  status: 'queued' | 'rendering' | 'completed' | 'error';
  progress: number;
  started_at: string | null;
  completed_at: string | null;
}

interface DashboardStats {
  totalVideos: number;
  publishedVideos: number;
  draftVideos: number;
  renderingCount: number;
  totalViews: number;
  totalLikes: number;
  shopifyClicks: number;
}

// ============================================================================
// メインコンポーネント
// ============================================================================

export default function MediaEmpireDashboard() {
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [renderQueue, setRenderQueue] = useState<RenderQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<VideoContent | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    product_id: '',
    video_type: 'youtube_short',
    genre: 'general',
    generate_voice: true,
    auto_publish: false
  });
  const [generating, setGenerating] = useState(false);

  // ============================================================================
  // データ取得
  // ============================================================================

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // 動画一覧取得
      const videosRes = await fetch('/api/media/videos');
      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.data || []);
      }
      
      // 統計取得
      const statsRes = await fetch('/api/media/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      
      // レンダーキュー取得
      const queueRes = await fetch('/api/media/render-queue');
      if (queueRes.ok) {
        const queueData = await queueRes.json();
        setRenderQueue(queueData.data || []);
      }
      
    } catch (error) {
      console.error('データ取得エラー:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // 30秒ごとに自動更新
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ============================================================================
  // 動画生成
  // ============================================================================

  const handleGenerate = async () => {
    if (!generateForm.product_id) {
      alert('商品IDを入力してください');
      return;
    }
    
    try {
      setGenerating(true);
      
      const res = await fetch('/api/media/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: parseInt(generateForm.product_id),
          video_type: generateForm.video_type,
          genre: generateForm.genre,
          generate_voice: generateForm.generate_voice,
          auto_publish: generateForm.auto_publish
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert(`動画生成を開始しました！\nRender ID: ${data.render_id || 'N/A'}`);
        setShowGenerateModal(false);
        fetchData();
      } else {
        alert(`エラー: ${data.error || '不明なエラー'}`);
      }
    } catch (error) {
      console.error('生成エラー:', error);
      alert('生成リクエストに失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  // ============================================================================
  // レンダリング
  // ============================================================================

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Empire OS を起動中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ヘッダー */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Empire OS - Media Command</h1>
              <p className="text-sm text-gray-400">動画生成 & YouTube投稿管理</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              title="更新"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              <Upload className="w-4 h-4" />
              動画生成
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Video className="w-6 h-6" />}
            label="総動画数"
            value={stats?.totalVideos || 0}
            color="blue"
          />
          <StatCard
            icon={<Youtube className="w-6 h-6" />}
            label="公開済み"
            value={stats?.publishedVideos || 0}
            color="red"
          />
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            label="総再生数"
            value={stats?.totalViews || 0}
            color="green"
            format="number"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Shopifyクリック"
            value={stats?.shopifyClicks || 0}
            color="orange"
          />
        </div>

        {/* レンダーキュー */}
        {renderQueue.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-yellow-500" />
              レンダリング中 ({renderQueue.filter(q => q.status === 'rendering').length})
            </h2>
            <div className="space-y-3">
              {renderQueue.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-700 rounded-lg p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">商品ID: {item.product_id}</p>
                    <p className="text-sm text-gray-400">
                      {item.status === 'rendering' ? 'レンダリング中...' : item.status}
                    </p>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 text-right mt-1">{item.progress}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 動画一覧 */}
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">動画コンテンツ</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-750">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">タイトル</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">タイプ</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">レンダー</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">公開</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">再生数</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-750 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-9 bg-gray-700 rounded flex items-center justify-center">
                          {video.media_url ? (
                            <Video className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-xs">{video.title}</p>
                          <p className="text-sm text-gray-400">ID: {video.product_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        video.content_type === 'youtube_short' 
                          ? 'bg-pink-500/20 text-pink-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {video.content_type === 'youtube_short' ? 'Shorts' : 'Long'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={video.render_status} type="render" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={video.publish_status} type="publish" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {video.metadata?.youtube_views?.toLocaleString() || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {video.platform_id && (
                          <a
                            href={`https://youtube.com/watch?v=${video.platform_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded hover:bg-gray-600 transition-colors"
                            title="YouTubeで見る"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => setSelectedVideo(video)}
                          className="p-1.5 rounded hover:bg-gray-600 transition-colors"
                          title="詳細"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {videos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      まだ動画がありません。「動画生成」ボタンから作成してください。
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 動画生成モーダル */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold">動画生成</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1 rounded hover:bg-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">商品ID *</label>
                <input
                  type="number"
                  value={generateForm.product_id}
                  onChange={(e) => setGenerateForm({ ...generateForm, product_id: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                  placeholder="例: 12345"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">動画タイプ</label>
                <select
                  value={generateForm.video_type}
                  onChange={(e) => setGenerateForm({ ...generateForm, video_type: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                >
                  <option value="youtube_short">YouTube Shorts (60秒)</option>
                  <option value="youtube_long">YouTube Long (5-10分)</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">ジャンル</label>
                <select
                  value={generateForm.genre}
                  onChange={(e) => setGenerateForm({ ...generateForm, genre: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
                >
                  <option value="general">一般</option>
                  <option value="electronics">家電・ガジェット</option>
                  <option value="apparel">アパレル・ファッション</option>
                  <option value="luxury">高級品・コレクション</option>
                  <option value="education">教育・解説</option>
                </select>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateForm.generate_voice}
                    onChange={(e) => setGenerateForm({ ...generateForm, generate_voice: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">音声生成 (ElevenLabs)</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateForm.auto_publish}
                    onChange={(e) => setGenerateForm({ ...generateForm, auto_publish: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">自動投稿</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    生成開始
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// サブコンポーネント
// ============================================================================

function StatCard({ 
  icon, 
  label, 
  value, 
  color,
  format = 'default'
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: 'blue' | 'red' | 'green' | 'orange';
  format?: 'default' | 'number';
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  };
  
  const displayValue = format === 'number' 
    ? value.toLocaleString()
    : value;
  
  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{displayValue}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ 
  status, 
  type 
}: { 
  status: string; 
  type: 'render' | 'publish';
}) {
  const getConfig = () => {
    if (type === 'render') {
      switch (status) {
        case 'completed':
          return { icon: <CheckCircle className="w-3 h-3" />, bg: 'bg-green-500/20', text: 'text-green-400', label: '完了' };
        case 'rendering':
          return { icon: <Loader2 className="w-3 h-3 animate-spin" />, bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'レンダリング中' };
        case 'error':
          return { icon: <XCircle className="w-3 h-3" />, bg: 'bg-red-500/20', text: 'text-red-400', label: 'エラー' };
        default:
          return { icon: <Clock className="w-3 h-3" />, bg: 'bg-gray-500/20', text: 'text-gray-400', label: '待機中' };
      }
    } else {
      switch (status) {
        case 'published':
          return { icon: <CheckCircle className="w-3 h-3" />, bg: 'bg-green-500/20', text: 'text-green-400', label: '公開中' };
        case 'scheduled':
          return { icon: <Clock className="w-3 h-3" />, bg: 'bg-blue-500/20', text: 'text-blue-400', label: '予約' };
        case 'error':
          return { icon: <XCircle className="w-3 h-3" />, bg: 'bg-red-500/20', text: 'text-red-400', label: 'エラー' };
        default:
          return { icon: <AlertTriangle className="w-3 h-3" />, bg: 'bg-gray-500/20', text: 'text-gray-400', label: '下書き' };
      }
    }
  };
  
  const config = getConfig();
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
}
