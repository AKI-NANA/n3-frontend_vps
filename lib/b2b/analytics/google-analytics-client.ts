/**
 * Google Analytics Data API v1 クライアント
 *
 * 目的: ブログのトラフィック・エンゲージメントデータを取得
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

export interface GoogleAnalyticsMetrics {
  monthly_visitors: number;
  monthly_pageviews: number;
  avg_engagement_rate: number;
  avg_session_duration: number;
  bounce_rate: number;
}

/**
 * Google Analytics Data APIクライアントを初期化
 */
function getAnalyticsClient(): BetaAnalyticsDataClient | null {
  const credentials = process.env.GOOGLE_ANALYTICS_CREDENTIALS;

  if (!credentials) {
    console.warn('[GA] GOOGLE_ANALYTICS_CREDENTIALS not set');
    return null;
  }

  try {
    const credentialsJson = JSON.parse(credentials);

    return new BetaAnalyticsDataClient({
      credentials: credentialsJson,
    });
  } catch (error) {
    console.error('[GA] Error parsing credentials:', error);
    return null;
  }
}

/**
 * Google Analyticsからメトリクスを取得
 */
export async function fetchGoogleAnalyticsMetrics(
  propertyId: string
): Promise<GoogleAnalyticsMetrics> {
  const client = getAnalyticsClient();

  if (!client) {
    console.warn('[GA] Client not initialized, returning mock data');
    return getMockMetrics();
  }

  try {
    // 過去30日間のデータを取得
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    });

    if (!response.rows || response.rows.length === 0) {
      throw new Error('No data returned from Google Analytics');
    }

    const row = response.rows[0];
    const values = row.metricValues || [];

    return {
      monthly_visitors: Math.round(parseFloat(values[0]?.value || '0')),
      monthly_pageviews: Math.round(parseFloat(values[1]?.value || '0')),
      avg_engagement_rate: Math.round(parseFloat(values[2]?.value || '0') * 1000) / 10,
      avg_session_duration: Math.round(parseFloat(values[3]?.value || '0')),
      bounce_rate: Math.round(parseFloat(values[4]?.value || '0') * 1000) / 10,
    };
  } catch (error) {
    console.error('[GA] Error fetching metrics:', error);
    throw error;
  }
}

/**
 * トップページのデータを取得
 */
export async function fetchTopPages(
  propertyId: string,
  limit: number = 10
): Promise<Array<{ path: string; pageviews: number; users: number }>> {
  const client = getAnalyticsClient();

  if (!client) {
    return [];
  }

  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit,
    });

    return (
      response.rows?.map((row) => ({
        path: row.dimensionValues?.[0]?.value || '',
        pageviews: Math.round(parseFloat(row.metricValues?.[0]?.value || '0')),
        users: Math.round(parseFloat(row.metricValues?.[1]?.value || '0')),
      })) || []
    );
  } catch (error) {
    console.error('[GA] Error fetching top pages:', error);
    return [];
  }
}

/**
 * モックメトリクス（開発用）
 */
function getMockMetrics(): GoogleAnalyticsMetrics {
  return {
    monthly_visitors: 100000 + Math.floor(Math.random() * 20000),
    monthly_pageviews: 250000 + Math.floor(Math.random() * 50000),
    avg_engagement_rate: 4.5 + Math.random() * 1.5,
    avg_session_duration: 180 + Math.floor(Math.random() * 60),
    bounce_rate: 45 + Math.random() * 10,
  };
}
