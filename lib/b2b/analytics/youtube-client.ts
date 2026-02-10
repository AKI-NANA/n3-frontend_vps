/**
 * YouTube Data API v3 クライアント
 *
 * 目的: YouTubeチャンネルの統計情報を取得
 */

import { google } from 'googleapis';

export interface YouTubeMetrics {
  youtube_subscribers: number;
  youtube_total_views: number;
  youtube_avg_views: number;
  youtube_video_count: number;
  youtube_avg_engagement_rate: number;
}

/**
 * YouTube Data APIクライアントを初期化
 */
function getYouTubeClient() {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.warn('[YouTube] YOUTUBE_API_KEY not set');
    return null;
  }

  return google.youtube({
    version: 'v3',
    auth: apiKey,
  });
}

/**
 * YouTubeチャンネルのメトリクスを取得
 */
export async function fetchYouTubeMetrics(channelId: string): Promise<YouTubeMetrics> {
  const youtube = getYouTubeClient();

  if (!youtube) {
    console.warn('[YouTube] Client not initialized, returning mock data');
    return getMockMetrics();
  }

  try {
    // チャンネル統計を取得
    const channelResponse = await youtube.channels.list({
      part: ['statistics', 'contentDetails'],
      id: [channelId],
    });

    if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
      throw new Error('Channel not found');
    }

    const channel = channelResponse.data.items[0];
    const stats = channel.statistics;

    const subscriberCount = parseInt(stats?.subscriberCount || '0');
    const viewCount = parseInt(stats?.viewCount || '0');
    const videoCount = parseInt(stats?.videoCount || '0');

    // 最近の動画のパフォーマンスを取得（平均再生回数計算用）
    const uploadsPlaylistId = channel.contentDetails?.relatedPlaylists?.uploads;
    let avgViews = 0;
    let avgEngagementRate = 0;

    if (uploadsPlaylistId) {
      const recentVideos = await fetchRecentVideos(youtube, uploadsPlaylistId, 10);

      if (recentVideos.length > 0) {
        const totalViews = recentVideos.reduce((sum, v) => sum + v.views, 0);
        avgViews = Math.round(totalViews / recentVideos.length);

        const totalEngagement = recentVideos.reduce(
          (sum, v) => sum + v.likes + v.comments,
          0
        );
        const totalViewsForEngagement = recentVideos.reduce((sum, v) => sum + v.views, 0);
        avgEngagementRate =
          totalViewsForEngagement > 0
            ? (totalEngagement / totalViewsForEngagement) * 100
            : 0;
      }
    }

    return {
      youtube_subscribers: subscriberCount,
      youtube_total_views: viewCount,
      youtube_avg_views: avgViews,
      youtube_video_count: videoCount,
      youtube_avg_engagement_rate: Math.round(avgEngagementRate * 10) / 10,
    };
  } catch (error) {
    console.error('[YouTube] Error fetching metrics:', error);
    throw error;
  }
}

/**
 * 最近の動画を取得
 */
async function fetchRecentVideos(
  youtube: any,
  playlistId: string,
  maxResults: number = 10
): Promise<Array<{ videoId: string; views: number; likes: number; comments: number }>> {
  try {
    // プレイリストから最近の動画IDを取得
    const playlistResponse = await youtube.playlistItems.list({
      part: ['contentDetails'],
      playlistId,
      maxResults,
    });

    const videoIds =
      playlistResponse.data.items?.map(
        (item: any) => item.contentDetails.videoId
      ) || [];

    if (videoIds.length === 0) {
      return [];
    }

    // 動画の統計を取得
    const videosResponse = await youtube.videos.list({
      part: ['statistics'],
      id: videoIds,
    });

    return (
      videosResponse.data.items?.map((item: any) => ({
        videoId: item.id,
        views: parseInt(item.statistics?.viewCount || '0'),
        likes: parseInt(item.statistics?.likeCount || '0'),
        comments: parseInt(item.statistics?.commentCount || '0'),
      })) || []
    );
  } catch (error) {
    console.error('[YouTube] Error fetching recent videos:', error);
    return [];
  }
}

/**
 * チャンネルのトップ動画を取得
 */
export async function fetchTopVideos(
  channelId: string,
  maxResults: number = 10
): Promise<
  Array<{
    videoId: string;
    title: string;
    views: number;
    likes: number;
    publishedAt: string;
  }>
> {
  const youtube = getYouTubeClient();

  if (!youtube) {
    return [];
  }

  try {
    // チャンネルのアップロードプレイリストIDを取得
    const channelResponse = await youtube.channels.list({
      part: ['contentDetails'],
      id: [channelId],
    });

    const uploadsPlaylistId =
      channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      return [];
    }

    // 最近の動画を取得
    const playlistResponse = await youtube.playlistItems.list({
      part: ['contentDetails', 'snippet'],
      playlistId: uploadsPlaylistId,
      maxResults: 50, // 多めに取得してソート
    });

    const videoIds =
      playlistResponse.data.items?.map(
        (item: any) => item.contentDetails.videoId
      ) || [];

    if (videoIds.length === 0) {
      return [];
    }

    // 動画の統計を取得
    const videosResponse = await youtube.videos.list({
      part: ['statistics', 'snippet'],
      id: videoIds,
    });

    const videos =
      videosResponse.data.items?.map((item: any) => ({
        videoId: item.id,
        title: item.snippet?.title || '',
        views: parseInt(item.statistics?.viewCount || '0'),
        likes: parseInt(item.statistics?.likeCount || '0'),
        publishedAt: item.snippet?.publishedAt || '',
      })) || [];

    // 再生回数でソート
    return videos.sort((a, b) => b.views - a.views).slice(0, maxResults);
  } catch (error) {
    console.error('[YouTube] Error fetching top videos:', error);
    return [];
  }
}

/**
 * モックメトリクス（開発用）
 */
function getMockMetrics(): YouTubeMetrics {
  return {
    youtube_subscribers: 10000 + Math.floor(Math.random() * 2000),
    youtube_total_views: 500000 + Math.floor(Math.random() * 100000),
    youtube_avg_views: 5000 + Math.floor(Math.random() * 2000),
    youtube_video_count: 100 + Math.floor(Math.random() * 20),
    youtube_avg_engagement_rate: 3.5 + Math.random() * 2.0,
  };
}
