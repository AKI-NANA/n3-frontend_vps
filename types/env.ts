// ファイル: /types/env.ts
// 環境変数の型定義

export interface SNSApiConfig {
  // YouTube Data API v3
  youtubeApiKey?: string;

  // Note API
  noteApiToken?: string;

  // X (Twitter) API v2
  xApiKey?: string;
  xApiSecret?: string;
  xAccessToken?: string;
  xAccessSecret?: string;
  xBearerToken?: string;

  // TikTok API
  tiktokClientKey?: string;
  tiktokClientSecret?: string;
  tiktokAccessToken?: string;

  // Gemini API (for AI content generation)
  geminiApiKey?: string;
}

/**
 * 環境変数から SNS API 設定を取得
 */
export function getSNSApiConfig(): SNSApiConfig {
  return {
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    noteApiToken: process.env.NOTE_API_TOKEN,
    xApiKey: process.env.X_API_KEY,
    xApiSecret: process.env.X_API_SECRET,
    xAccessToken: process.env.X_ACCESS_TOKEN,
    xAccessSecret: process.env.X_ACCESS_SECRET,
    xBearerToken: process.env.X_BEARER_TOKEN,
    tiktokClientKey: process.env.TIKTOK_CLIENT_KEY,
    tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET,
    tiktokAccessToken: process.env.TIKTOK_ACCESS_TOKEN,
    geminiApiKey: process.env.GEMINI_API_KEY,
  };
}
