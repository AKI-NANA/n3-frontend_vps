// ファイル: /lib/media-converter.ts
// 記事本文をマルチメディアコンテンツに変換するロジック

import { ContentQueue, VideoScript } from '@/types/ai';
import { textToSpeech, articleToPodcast } from './ai-voice-client';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * 記事本文からYouTube台本形式へ変換する（OpenAI GPT-4使用）
 * @param markdown 記事本文
 * @returns 動画スクリプト
 */
async function generateVideoScript(markdown: string): Promise<VideoScript> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY 環境変数が設定されていません');
    }

    // LLMで記事を動画台本に変換
    const prompt = `
以下のブログ記事を、魅力的なYouTube動画の台本に変換してください。

要件:
1. 口語体で自然な話し言葉にする
2. イントロ、本編、アウトロの構成にする
3. 視聴者を引き込むフレーズを使う
4. 各シーンで表示する画像のプロンプトを提案する
5. 重要なポイントにはテロップ案を付ける

記事本文:
${markdown}

以下のJSON形式で出力してください:
{
  "script_text": "台本全文",
  "scene_cuts": [
    {
      "time_sec": 0,
      "image_prompt": "シーンの画像プロンプト",
      "caption": "テロップテキスト"
    }
  ]
}
`.trim();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'あなたは優秀なYouTubeコンテンツクリエイターです。ブログ記事を魅力的な動画台本に変換することが得意です。',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API エラー (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // JSONをパース
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('LLMからの応答が正しいJSON形式ではありません');
    }

    const scriptData = JSON.parse(jsonMatch[0]);

    return {
        script_text: scriptData.script_text,
        narration_voice_id: process.env.OPENAI_TTS_VOICE || 'alloy',
        scene_cuts: scriptData.scene_cuts || [],
    };
}

/**
 * 動画ファイルを完全に自動で生成する
 * @param queueItem 投稿キューアイテム
 * @returns 生成された動画ファイルパスまたはURL
 */
export async function generateFullVideo(queueItem: ContentQueue): Promise<string> {
    try {
        // 1. 記事を動画台本に変換
        console.log('動画台本を生成中...');
        const script = await generateVideoScript(queueItem.article_markdown);

        // 2. AI音声合成: script.script_text をナレーションに変換
        console.log('AI音声合成を実行中...');
        const audioBuffer = await textToSpeech(script.script_text, {
            voice: script.narration_voice_id as any,
            model: 'tts-1-hd',
            speed: 1.0,
        });

        // 3. 音声ファイルを保存
        const outputDir = path.join(process.cwd(), 'public', 'media', 'videos');
        await fs.mkdir(outputDir, { recursive: true });

        const audioPath = path.join(outputDir, `narration-${queueItem.id}.mp3`);
        await fs.writeFile(audioPath, audioBuffer);

        console.log(`ナレーション音声を保存: ${audioPath}`);

        // 4. AI画像生成とシーンカット情報を保存（実装は外部サービスに依存）
        // TODO: Midjourney/DALL-E APIを使用して、script.scene_cuts の各プロンプトから画像を生成
        // TODO: FFmpegなどを使用して、画像とナレーションを結合して動画を生成

        // 5. 簡易実装: 音声ファイルのパスを返す（実際は動画ファイル）
        // 注: 完全な動画生成には、FFmpegや動画編集AIサービス（Pictory.ai等）の統合が必要
        const videoPlaceholder = `/media/videos/auto-generated-${queueItem.id}.mp4`;

        console.log(`動画生成完了（プレースホルダー）: ${videoPlaceholder}`);

        return videoPlaceholder;
    } catch (error) {
        console.error('動画生成エラー:', error);
        throw error;
    }
}

/**
 * 記事本文からPodcast用MP3ファイルを生成する
 * @param markdown 記事本文
 * @param queueId キューID（ファイル名に使用）
 * @returns MP3ファイルのパス
 */
export async function generatePodcastAudio(markdown: string, queueId: number): Promise<string> {
    try {
        console.log('Podcast音声を生成中...');

        // AI音声合成でポッドキャストを生成
        const audioBuffer = await articleToPodcast(markdown, {
            voice: 'nova', // ポッドキャストに適した声
            model: 'tts-1-hd',
            speed: 1.0,
        });

        // 音声ファイルを保存
        const outputDir = path.join(process.cwd(), 'public', 'media', 'audio');
        await fs.mkdir(outputDir, { recursive: true });

        const audioPath = path.join(outputDir, `podcast-${queueId}.mp3`);
        await fs.writeFile(audioPath, audioBuffer);

        console.log(`Podcast音声を保存: ${audioPath}`);

        return `/media/audio/podcast-${queueId}.mp3`;
    } catch (error) {
        console.error('Podcast生成エラー:', error);
        throw error;
    }
}
