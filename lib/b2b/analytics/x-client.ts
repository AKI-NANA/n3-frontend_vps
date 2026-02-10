/**
 * X (Twitter) API v2 クライアント
 *
 * 目的: Xアカウントのフォロワー数・エンゲージメントデータを取得
 */

export interface XMetrics {
  followers: number;
  following: number;
  tweet_count: number;
  avg_engagement_rate: number;
  avg_likes_per_tweet: number;
  avg_retweets_per_tweet: number;
}

/**
 * X API v2クライアントを使用してメトリクスを取得
 */
export async function fetchXMetrics(username: string): Promise<XMetrics> {
  const bearerToken = process.env.X_API_BEARER_TOKEN;

  if (!bearerToken) {
    console.warn('[X] X_API_BEARER_TOKEN not set, returning mock data');
    return getMockMetrics();
  }

  try {
    // ユーザー情報を取得
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`X API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();

    if (!userData.data) {
      throw new Error('User not found');
    }

    const metrics = userData.data.public_metrics;

    // 最近のツイートのエンゲージメントを取得
    const userId = userData.data.id;
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=public_metrics`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    let avgEngagementRate = 0;
    let avgLikes = 0;
    let avgRetweets = 0;

    if (tweetsResponse.ok) {
      const tweetsData = await tweetsResponse.json();

      if (tweetsData.data && tweetsData.data.length > 0) {
        const tweets = tweetsData.data;
        const totalLikes = tweets.reduce(
          (sum: number, t: any) => sum + (t.public_metrics?.like_count || 0),
          0
        );
        const totalRetweets = tweets.reduce(
          (sum: number, t: any) => sum + (t.public_metrics?.retweet_count || 0),
          0
        );
        const totalReplies = tweets.reduce(
          (sum: number, t: any) => sum + (t.public_metrics?.reply_count || 0),
          0
        );
        const totalImpressions = tweets.reduce(
          (sum: number, t: any) => sum + (t.public_metrics?.impression_count || 0),
          0
        );

        avgLikes = Math.round(totalLikes / tweets.length);
        avgRetweets = Math.round(totalRetweets / tweets.length);

        const totalEngagement = totalLikes + totalRetweets + totalReplies;
        avgEngagementRate =
          totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;
      }
    }

    return {
      followers: metrics.followers_count,
      following: metrics.following_count,
      tweet_count: metrics.tweet_count,
      avg_engagement_rate: Math.round(avgEngagementRate * 10) / 10,
      avg_likes_per_tweet: avgLikes,
      avg_retweets_per_tweet: avgRetweets,
    };
  } catch (error) {
    console.error('[X] Error fetching metrics:', error);
    throw error;
  }
}

/**
 * 最近のトップツイートを取得
 */
export async function fetchTopTweets(
  username: string,
  maxResults: number = 10
): Promise<
  Array<{
    id: string;
    text: string;
    likes: number;
    retweets: number;
    replies: number;
    created_at: string;
  }>
> {
  const bearerToken = process.env.X_API_BEARER_TOKEN;

  if (!bearerToken) {
    return [];
  }

  try {
    // ユーザーIDを取得
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(`X API error: ${userResponse.status}`);
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // 最近のツイートを取得（エンゲージメント順）
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=public_metrics,created_at`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      throw new Error(`X API error: ${tweetsResponse.status}`);
    }

    const tweetsData = await tweetsResponse.json();

    if (!tweetsData.data) {
      return [];
    }

    const tweets = tweetsData.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      likes: tweet.public_metrics?.like_count || 0,
      retweets: tweet.public_metrics?.retweet_count || 0,
      replies: tweet.public_metrics?.reply_count || 0,
      created_at: tweet.created_at,
    }));

    // エンゲージメント順にソート
    return tweets.sort((a: any, b: any) => {
      const engagementA = a.likes + a.retweets + a.replies;
      const engagementB = b.likes + b.retweets + b.replies;
      return engagementB - engagementA;
    });
  } catch (error) {
    console.error('[X] Error fetching top tweets:', error);
    return [];
  }
}

/**
 * モックメトリクス（開発用）
 */
function getMockMetrics(): XMetrics {
  return {
    followers: 15000 + Math.floor(Math.random() * 3000),
    following: 500 + Math.floor(Math.random() * 100),
    tweet_count: 5000 + Math.floor(Math.random() * 1000),
    avg_engagement_rate: 3.0 + Math.random() * 2.0,
    avg_likes_per_tweet: 50 + Math.floor(Math.random() * 30),
    avg_retweets_per_tweet: 10 + Math.floor(Math.random() * 10),
  };
}
