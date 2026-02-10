/**
 * TikTok API クライアント
 *
 * 目的: TikTokアカウントのフォロワー数・エンゲージメントデータを取得
 * 注意: TikTok APIは申請が必要で、承認には時間がかかる場合があります
 */

export interface TikTokMetrics {
  followers: number;
  following: number;
  video_count: number;
  total_likes: number;
  avg_views_per_video: number;
  avg_engagement_rate: number;
}

/**
 * TikTok APIを使用してメトリクスを取得
 *
 * TikTok API の使用には、TikTok Developer Platform での承認が必要です。
 * https://developers.tiktok.com/
 */
export async function fetchTikTokMetrics(username: string): Promise<TikTokMetrics> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    console.warn('[TikTok] TIKTOK_ACCESS_TOKEN not set, returning mock data');
    return getMockMetrics();
  }

  try {
    // TikTok User Info API
    const userResponse = await fetch(
      `https://open.tiktokapis.com/v2/user/info/?fields=display_name,follower_count,following_count,likes_count,video_count`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`TikTok API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    if (!userData.data || !userData.data.user) {
      throw new Error('User not found');
    }

    const user = userData.data.user;

    // 最近の動画のパフォーマンスを取得（平均再生回数・エンゲージメント計算用）
    const videosResponse = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=id,view_count,like_count,comment_count,share_count&max_count=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let avgViews = 0;
    let avgEngagementRate = 0;

    if (videosResponse.ok) {
      const videosData = await videosResponse.json();

      if (videosData.data && videosData.data.videos && videosData.data.videos.length > 0) {
        const videos = videosData.data.videos;
        const totalViews = videos.reduce(
          (sum: number, v: any) => sum + (v.view_count || 0),
          0
        );
        const totalLikes = videos.reduce(
          (sum: number, v: any) => sum + (v.like_count || 0),
          0
        );
        const totalComments = videos.reduce(
          (sum: number, v: any) => sum + (v.comment_count || 0),
          0
        );
        const totalShares = videos.reduce(
          (sum: number, v: any) => sum + (v.share_count || 0),
          0
        );

        avgViews = Math.round(totalViews / videos.length);

        const totalEngagement = totalLikes + totalComments + totalShares;
        avgEngagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;
      }
    }

    return {
      followers: user.follower_count,
      following: user.following_count,
      video_count: user.video_count,
      total_likes: user.likes_count,
      avg_views_per_video: avgViews,
      avg_engagement_rate: Math.round(avgEngagementRate * 10) / 10,
    };
  } catch (error) {
    console.error('[TikTok] Error fetching metrics:', error);
    throw error;
  }
}

/**
 * トップ動画を取得
 */
export async function fetchTopVideos(
  maxResults: number = 10
): Promise<
  Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    created_at: number;
  }>
> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return [];
  }

  try {
    const response = await fetch(
      `https://open.tiktokapis.com/v2/video/list/?fields=id,title,view_count,like_count,comment_count,share_count,create_time&max_count=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || !data.data.videos) {
      return [];
    }

    const videos = data.data.videos.map((video: any) => ({
      id: video.id,
      title: video.title || '',
      views: video.view_count || 0,
      likes: video.like_count || 0,
      comments: video.comment_count || 0,
      shares: video.share_count || 0,
      created_at: video.create_time || 0,
    }));

    // 再生回数でソート
    return videos.sort((a: any, b: any) => b.views - a.views);
  } catch (error) {
    console.error('[TikTok] Error fetching top videos:', error);
    return [];
  }
}

/**
 * モックメトリクス（開発用）
 */
function getMockMetrics(): TikTokMetrics {
  return {
    followers: 50000 + Math.floor(Math.random() * 10000),
    following: 200 + Math.floor(Math.random() * 50),
    video_count: 150 + Math.floor(Math.random() * 30),
    total_likes: 500000 + Math.floor(Math.random() * 100000),
    avg_views_per_video: 20000 + Math.floor(Math.random() * 10000),
    avg_engagement_rate: 5.0 + Math.random() * 3.0,
  };
}
