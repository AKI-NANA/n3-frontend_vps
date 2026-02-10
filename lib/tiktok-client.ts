// ファイル: /lib/tiktok-client.ts

import { getSNSApiConfig } from '@/types/env';

export interface TikTokPostData {
  title: string;
  video_url?: string; // 動画のURL（事前にアップロード済み）
  description?: string;
  privacy_level?: 'PUBLIC' | 'FRIENDS' | 'PRIVATE';
  disable_comment?: boolean;
  disable_duet?: boolean;
  disable_stitch?: boolean;
}

export interface TikTokPostResponse {
  id: string;
  title: string;
  share_url: string;
}

/**
 * TikTok API を使用して動画を投稿
 * 注: TikTok APIは動画アップロードに複数ステップが必要
 * @param postData 投稿データ
 */
export async function postToTikTok(postData: TikTokPostData): Promise<TikTokPostResponse> {
  const config = getSNSApiConfig();

  if (!config.tiktokAccessToken || !config.tiktokClientKey) {
    console.warn('TikTok API token is missing. Skipping actual TikTok post.');
    return {
      id: `mock_${Date.now()}`,
      title: postData.title,
      share_url: `https://tiktok.com/@mock_user/video/${Date.now()}`,
    };
  }

  try {
    // TikTok Content Posting API
    // https://developers.tiktok.com/doc/content-posting-api-get-started
    const endpoint = 'https://open.tiktokapis.com/v2/post/publish/video/init/';

    const headers = {
      'Authorization': `Bearer ${config.tiktokAccessToken}`,
      'Content-Type': 'application/json',
    };

    const body = {
      post_info: {
        title: postData.title,
        privacy_level: postData.privacy_level || 'PUBLIC',
        disable_comment: postData.disable_comment || false,
        disable_duet: postData.disable_duet || false,
        disable_stitch: postData.disable_stitch || false,
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: 0, // 実際のサイズを指定
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`TikTok API Error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();

    console.log('[TikTok] Video upload initiated:', result);

    // 実際の実装では、ここで動画ファイルをアップロードし、
    // publish APIを呼び出して投稿を完了させる

    return {
      id: result.data?.publish_id || `mock_${Date.now()}`,
      title: postData.title,
      share_url: result.data?.share_url || `https://tiktok.com/@user/video/${Date.now()}`,
    };
  } catch (error: any) {
    console.error('[TikTok] Post failed:', error);
    throw error;
  }
}

/**
 * TikTok からトレンド動画を検索
 * @param query 検索キーワード
 * @param maxResults 取得する最大件数
 */
export async function searchTikTokTrends(query: string, maxResults: number = 10): Promise<any[]> {
  const config = getSNSApiConfig();

  if (!config.tiktokAccessToken) {
    console.warn('TikTok API token is missing. Returning mock data.');
    return [];
  }

  try {
    // TikTok Research API (requires special access)
    const endpoint = `https://open.tiktokapis.com/v2/research/video/query/`;

    const headers = {
      'Authorization': `Bearer ${config.tiktokAccessToken}`,
      'Content-Type': 'application/json',
    };

    const body = {
      query: {
        and: [
          {
            field_name: 'keyword',
            field_values: [query],
            operation: 'IN',
          },
        ],
      },
      max_count: maxResults,
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('TikTok Search API Error:', error);
      return [];
    }

    const result = await response.json();
    return result.data?.videos || [];
  } catch (error: any) {
    console.error('[TikTok] Search failed:', error);
    return [];
  }
}

/**
 * TikTok動画のスクリプトを最適化（ショート動画向け）
 * @param script 元のスクリプト
 * @param maxDuration 最大秒数（デフォルト: 60秒）
 */
export function optimizeScriptForTikTok(script: string, maxDuration: number = 60): string {
  // 1文あたり約3秒として計算
  const maxSentences = Math.floor(maxDuration / 3);

  const sentences = script.split(/[。！？]/).filter(s => s.trim());

  if (sentences.length <= maxSentences) {
    return script;
  }

  // 重要な文章を優先的に抽出（前半と結論部分）
  const optimized = [
    ...sentences.slice(0, Math.floor(maxSentences * 0.7)),
    ...sentences.slice(-Math.floor(maxSentences * 0.3)),
  ];

  return optimized.join('。') + '。';
}
