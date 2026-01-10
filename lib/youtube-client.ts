// ファイル: /lib/youtube-client.ts
// YouTube Data API v3を通じて動画を自動アップロードするクライアント

import { ContentQueue, SiteConfig } from '@/types/ai';

/**
 * OAuth 2.0アクセストークンをリフレッシュする
 */
async function refreshAccessToken(refreshToken: string): Promise<string> {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('YouTube OAuth認証情報が設定されていません');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`トークンリフレッシュ失敗: ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
}

/**
 * 指数バックオフでリトライを実行
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 2000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.log(`YouTube API リトライ ${attempt + 1}/${maxRetries}: ${delay}ms 後に再試行...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('不明なエラー');
}

/**
 * YouTubeに動画をアップロードする
 * @param videoFilePath 動画ファイルのパス
 * @param queueItem 投稿キューアイテム
 * @param siteConfig サイト設定（認証情報を含む）
 * @returns アップロードされた動画のURL
 */
export async function uploadToYouTube(
    videoFilePath: string,
    queueItem: ContentQueue,
    siteConfig: SiteConfig
): Promise<string> {
    // 入力検証
    if (!siteConfig.api_key_encrypted) {
        throw new Error('YouTube リフレッシュトークンが設定されていません');
    }

    if (!queueItem.content_title || !queueItem.article_markdown) {
        throw new Error('コンテンツのタイトルまたは説明が空です');
    }

    // アクセストークンを取得
    const accessToken = await refreshAccessToken(siteConfig.api_key_encrypted);

    const { content_title, article_markdown } = queueItem;

    // 動画の説明文を作成（記事の要約 + アフィリエイトリンク）
    let description = article_markdown.substring(0, 5000); // YouTubeの制限は5000文字
    if (queueItem.final_affiliate_links && queueItem.final_affiliate_links.length > 0) {
        description += '\n\n━━━━━━━━━━━━━━━━\n📌 おすすめ商品リンク\n━━━━━━━━━━━━━━━━\n\n';
        queueItem.final_affiliate_links.forEach((link, i) => {
            description += `🔗 商品${i + 1}: ${link}\n`;
        });
    }

    // 動画メタデータ
    const videoMetadata = {
        snippet: {
            title: content_title,
            description: description,
            tags: ['自動生成', 'AIコンテンツ', 'アフィリエイト'],
            categoryId: '22', // People & Blogs
        },
        status: {
            privacyStatus: 'public', // 'public', 'unlisted', 'private'
            selfDeclaredMadeForKids: false,
        },
    };

    // リトライロジック付きでYouTube APIを呼び出し
    return await retryWithBackoff(async () => {
        // ステップ1: 動画のメタデータをアップロード（初期化）
        const initResponse = await fetch(
            'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'X-Upload-Content-Type': 'video/*',
                },
                body: JSON.stringify(videoMetadata),
            }
        );

        if (!initResponse.ok) {
            const errorText = await initResponse.text();
            throw new Error(`YouTube 初期化失敗 (${initResponse.status}): ${errorText}`);
        }

        const uploadUrl = initResponse.headers.get('Location');
        if (!uploadUrl) {
            throw new Error('YouTube アップロードURLが取得できませんでした');
        }

        // ステップ2: 動画ファイルをアップロード
        // 注: 実際の実装では、ファイルシステムから動画を読み込む必要があります
        // ここでは概念的な実装を示します
        const videoResponse = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'video/*',
            },
            // body: videoFileBuffer, // 実際にはファイルバッファを送信
        });

        if (!videoResponse.ok) {
            const errorText = await videoResponse.text();
            throw new Error(`YouTube アップロード失敗 (${videoResponse.status}): ${errorText}`);
        }

        const videoData = await videoResponse.json();

        if (!videoData.id) {
            throw new Error('YouTube APIから動画IDが返されませんでした');
        }

        return `https://www.youtube.com/watch?v=${videoData.id}`;
    }, 3, 3000); // 最大3回リトライ、初期待機時間3秒
}

/**
 * YouTube Shortsとしてアップロード
 * @param videoFilePath 動画ファイルのパス（縦型、60秒以内）
 * @param queueItem 投稿キューアイテム
 * @param siteConfig サイト設定
 * @returns アップロードされたショート動画のURL
 */
export async function uploadToYouTubeShorts(
    videoFilePath: string,
    queueItem: ContentQueue,
    siteConfig: SiteConfig
): Promise<string> {
    // YouTube Shortsは通常の動画アップロードと同じAPIを使用
    // タイトルに #Shorts を含めることで自動的にShortsとして認識される
    const modifiedQueueItem = {
        ...queueItem,
        content_title: `${queueItem.content_title} #Shorts`,
    };

    return await uploadToYouTube(videoFilePath, modifiedQueueItem, siteConfig);
}
