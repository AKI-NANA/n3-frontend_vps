// ファイル: /lib/ai-voice-client.ts
// OpenAI Text-to-Speech APIを使用した音声合成クライアント

/**
 * OpenAI TTSで利用可能な音声モデル
 */
export type TTSVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

/**
 * OpenAI TTSで利用可能な音声フォーマット
 */
export type TTSFormat = 'mp3' | 'opus' | 'aac' | 'flac';

/**
 * 音声合成のオプション
 */
export interface VoiceSynthesisOptions {
    voice?: TTSVoice;
    model?: 'tts-1' | 'tts-1-hd';
    speed?: number; // 0.25 ~ 4.0
    format?: TTSFormat;
}

/**
 * 指数バックオフでリトライを実行
 */
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt < maxRetries) {
                const delay = initialDelay * Math.pow(2, attempt);
                console.log(`OpenAI TTS リトライ ${attempt + 1}/${maxRetries}: ${delay}ms 後に再試行...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('不明なエラー');
}

/**
 * テキストを音声に変換する（OpenAI TTS）
 * @param text 音声に変換するテキスト（最大4096文字）
 * @param options 音声合成オプション
 * @returns 音声ファイルのBuffer
 */
export async function textToSpeech(
    text: string,
    options: VoiceSynthesisOptions = {}
): Promise<Buffer> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY 環境変数が設定されていません');
    }

    // 入力検証
    if (!text || text.trim().length === 0) {
        throw new Error('テキストが空です');
    }

    if (text.length > 4096) {
        throw new Error('テキストが4096文字を超えています。分割してください。');
    }

    // デフォルト値
    const voice = options.voice || (process.env.OPENAI_TTS_VOICE as TTSVoice) || 'alloy';
    const model = options.model || 'tts-1';
    const speed = options.speed || 1.0;
    const format = options.format || 'mp3';

    // 速度の検証
    if (speed < 0.25 || speed > 4.0) {
        throw new Error('速度は0.25〜4.0の範囲で指定してください');
    }

    return await retryWithBackoff(async () => {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                voice,
                input: text,
                speed,
                response_format: format,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI TTS API エラー (${response.status}): ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }, 3, 2000);
}

/**
 * 長いテキストを分割して音声に変換する
 * @param text 長いテキスト
 * @param options 音声合成オプション
 * @returns 音声ファイルのBufferの配列
 */
export async function textToSpeechLong(
    text: string,
    options: VoiceSynthesisOptions = {}
): Promise<Buffer[]> {
    // テキストを4000文字ごとに分割（余裕を持たせる）
    const chunkSize = 4000;
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }

    console.log(`テキストを${chunks.length}個のチャンクに分割しました`);

    // 各チャンクを順次処理
    const audioBuffers: Buffer[] = [];
    for (let i = 0; i < chunks.length; i++) {
        console.log(`チャンク ${i + 1}/${chunks.length} を処理中...`);
        const audioBuffer = await textToSpeech(chunks[i], options);
        audioBuffers.push(audioBuffer);

        // API レート制限を避けるため、次のリクエストまで少し待つ
        if (i < chunks.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    return audioBuffers;
}

/**
 * 記事本文をポッドキャスト用の音声に変換
 * @param markdown 記事本文（Markdown形式）
 * @param options 音声合成オプション
 * @returns 音声ファイルのBuffer
 */
export async function articleToPodcast(
    markdown: string,
    options: VoiceSynthesisOptions = {}
): Promise<Buffer> {
    // Markdownから不要な記号を削除してプレーンテキストに変換
    let plainText = markdown
        .replace(/```[\s\S]*?```/g, '') // コードブロックを削除
        .replace(/`([^`]+)`/g, '$1') // インラインコードのバッククォートを削除
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンクをテキストのみに
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 画像を削除
        .replace(/^#{1,6}\s+/gm, '') // 見出し記号を削除
        .replace(/\*\*(.+?)\*\*/g, '$1') // 太字を削除
        .replace(/__(.+?)__/g, '$1')
        .replace(/\*(.+?)\*/g, '$1') // イタリックを削除
        .replace(/_(.+?)_/g, '$1')
        .replace(/^[-*]\s+/gm, '') // リスト記号を削除
        .replace(/^\d+\.\s+/gm, '') // 番号付きリスト記号を削除
        .replace(/^>\s+/gm, '') // 引用記号を削除
        .replace(/---/g, '') // 水平線を削除
        .replace(/\n\n+/g, '\n') // 複数の改行を1つに
        .trim();

    // イントロとアウトロを追加
    const podcastScript = `
皆さん、こんにちは！
今日は、興味深いトピックについてお話しします。

${plainText}

今日の内容は以上です。
最後までお聞きいただき、ありがとうございました！
チャンネル登録と高評価もよろしくお願いします。
それでは、また次回お会いしましょう！
    `.trim();

    // 長いテキストの場合は分割処理
    if (podcastScript.length > 4000) {
        const audioBuffers = await textToSpeechLong(podcastScript, options);
        // 注: 複数のMP3ファイルを結合するには、別途ライブラリが必要
        // ここでは最初のチャンクのみを返す（簡易実装）
        console.warn('テキストが長いため、最初の部分のみを音声化しました');
        return audioBuffers[0];
    }

    return await textToSpeech(podcastScript, options);
}

/**
 * ElevenLabs APIを使用した音声合成（オプション）
 * @param text テキスト
 * @param voiceId ElevenLabs音声ID
 * @returns 音声ファイルのBuffer
 */
export async function textToSpeechElevenLabs(
    text: string,
    voiceId?: string
): Promise<Buffer> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL'; // デフォルト音声

    if (!apiKey) {
        throw new Error('ELEVENLABS_API_KEY 環境変数が設定されていません');
    }

    const voice = voiceId || defaultVoiceId;

    return await retryWithBackoff(async () => {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
            {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API エラー (${response.status}): ${errorText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }, 3, 2000);
}
