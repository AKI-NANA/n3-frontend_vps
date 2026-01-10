// ファイル: /lib/x-client.ts

import { getSNSApiConfig } from '@/types/env';

export interface XPostData {
  text: string;
  media_ids?: string[];
}

export interface XPostResponse {
  id: string;
  text: string;
  url: string;
}

/**
 * X (Twitter) API v2を使用してツイートを投稿
 * @param postData 投稿データ
 * @returns 投稿結果
 */
export async function postToX(postData: XPostData): Promise<XPostResponse> {
  const config = getSNSApiConfig();

  if (!config.xBearerToken && !config.xAccessToken) {
    console.warn('X API token is missing. Skipping actual X post.');
    return {
      id: `mock_${Date.now()}`,
      text: postData.text,
      url: `https://x.com/mock_user/status/${Date.now()}`,
    };
  }

  try {
    // Twitter API v2エンドポイント
    const endpoint = 'https://api.twitter.com/2/tweets';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Bearer Tokenを優先使用
    if (config.xBearerToken) {
      headers['Authorization'] = `Bearer ${config.xBearerToken}`;
    } else if (config.xAccessToken) {
      // OAuth 1.0a認証の場合（実装簡略化のためBearer Tokenを推奨）
      headers['Authorization'] = `Bearer ${config.xAccessToken}`;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        text: postData.text,
        ...(postData.media_ids && { media: { media_ids: postData.media_ids } }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`X API Error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    const tweetId = result.data.id;

    console.log(`[X] Successfully posted tweet: ${tweetId}`);

    return {
      id: tweetId,
      text: result.data.text,
      url: `https://x.com/i/status/${tweetId}`,
    };
  } catch (error: any) {
    console.error('[X] Post failed:', error);
    throw error;
  }
}

/**
 * X (Twitter) からトレンドを取得
 * @param query 検索クエリ
 * @param maxResults 取得する最大件数（デフォルト: 10）
 */
export async function searchXTrends(query: string, maxResults: number = 10): Promise<any[]> {
  const config = getSNSApiConfig();

  if (!config.xBearerToken) {
    console.warn('X API token is missing. Returning mock data.');
    return [];
  }

  try {
    // Twitter API v2 Search endpoint
    const endpoint = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(
      query
    )}&max_results=${maxResults}&tweet.fields=public_metrics,created_at,author_id`;

    const headers = {
      Authorization: `Bearer ${config.xBearerToken}`,
    };

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`X Search API Error: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error('[X] Search failed:', error);
    return [];
  }
}

/**
 * 文字数制限に合わせてテキストを分割（Xは280文字制限）
 */
export function splitTextForX(text: string, maxLength: number = 280): string[] {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = '';

  const sentences = text.split(/[。！？\n]/);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength - 5) {
      currentChunk += sentence + '。';
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence + '。';
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
