// ファイル: /app/api/tools/auto-publish/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { postToWordPress } from '@/lib/wp-client';
import { generateFullVideo, generatePodcastAudio } from '@/lib/media-converter';
import { uploadToYouTube } from '@/lib/youtube-client';
import { ContentQueue, SiteConfig } from '@/types/ai';

export async function POST(request: Request) {
    // 1. キューから投稿待ちのアイテムを取得
    const { data: queueItems, error: fetchError } = await supabase
        .from('generated_content_queue')
        .select('*')
        .eq('status', 'pending')
        .order('scheduled_at', { ascending: true })
        .limit(5); // 一度に処理する数を制限

    if (fetchError || !queueItems || queueItems.length === 0) {
        return NextResponse.json({ success: true, message: 'No content pending.' });
    }

    const results = [];

    for (const item of queueItems) {
        // 2. サイト設定を取得
        const { data: siteConfig, error: configError } = await supabase
            .from('site_config_master')
            .select('*')
            .eq('id', item.site_id)
            .single();

        if (configError || !siteConfig) {
            results.push({ id: item.id, status: 'failed', error: 'Site config not found.' });
            continue;
        }

        try {
            let postUrl = '';

            // ステータスを「処理中」に更新
            await supabase
                .from('generated_content_queue')
                .update({ status: 'publishing' })
                .eq('id', item.id);

            // 3. プラットフォーム別の投稿ロジック実行
            if (item.platform === 'wordpress') {
                console.log(`WordPress投稿を開始: ${item.content_title}`);
                postUrl = await postToWordPress(item as ContentQueue, siteConfig as SiteConfig);
                console.log(`WordPress投稿完了: ${postUrl}`);

            } else if (item.platform === 'youtube') {
                console.log(`YouTube動画生成を開始: ${item.content_title}`);
                // 動画生成
                const videoPath = await generateFullVideo(item as ContentQueue);
                console.log(`動画生成完了: ${videoPath}`);

                // YouTubeにアップロード
                postUrl = await uploadToYouTube(videoPath, item as ContentQueue, siteConfig as SiteConfig);
                console.log(`YouTube投稿完了: ${postUrl}`);

            } else if (item.platform === 'podcast') {
                console.log(`Podcast音声生成を開始: ${item.content_title}`);
                // Podcast音声生成
                postUrl = await generatePodcastAudio(item.article_markdown, item.id);
                console.log(`Podcast生成完了: ${postUrl}`);

            } else if (item.platform === 'tiktok') {
                console.log(`TikTok動画生成を開始: ${item.content_title}`);
                // TikTok用の短い動画を生成
                const videoPath = await generateFullVideo(item as ContentQueue);
                console.log(`TikTok動画生成完了: ${videoPath}`);

                // TODO: TikTok APIを使って動画をアップロード
                postUrl = `/media/videos/tiktok-${item.id}.mp4`;
                console.warn('TikTok APIは未実装です。ローカルファイルのみ生成されました。');

            } else {
                throw new Error(`サポートされていないプラットフォーム: ${item.platform}`);
            }

            // 4. ステータスを「完了」に更新
            await supabase
                .from('generated_content_queue')
                .update({
                    status: 'completed',
                    post_url: postUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', item.id);

            // 5. サイト最終投稿日時を更新 (サイトの活動状況追跡用)
            await supabase
                .from('site_config_master')
                .update({ last_post_at: new Date().toISOString() })
                .eq('id', siteConfig.id);

            results.push({
                id: item.id,
                status: 'completed',
                url: postUrl,
                platform: item.platform,
                title: item.content_title,
            });

        } catch (e: any) {
            console.error(`Publishing failed for item ${item.id}:`, e);
            await supabase
                .from('generated_content_queue')
                .update({
                    status: 'failed',
                    post_url: null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', item.id);
            results.push({
                id: item.id,
                status: 'failed',
                error: e.message,
                platform: item.platform,
                title: item.content_title,
            });
        }
    }

    return NextResponse.json({ success: true, results });
}
