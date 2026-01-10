// ファイル: /lib/wp-client.ts
// WordPress REST APIを通じて記事を自動投稿するクライアント

import { ContentQueue, SiteConfig } from '@/types/ai';

/**
 * Markdown記事をHTMLに変換（完全版）
 * セキュリティと互換性を考慮した実装
 */
const markdownToHtml = (markdown: string): string => {
    let html = markdown;

    // エスケープ処理
    const escapeHtml = (text: string) => {
        const map: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    // コードブロック（```）を保護
    const codeBlocks: string[] = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`);
        return placeholder;
    });

    // インラインコード（`）を保護
    const inlineCodes: string[] = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
        inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
        return placeholder;
    });

    // 見出し（# ## ### #### ##### ######）
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // 太字（**text** or __text__）
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

    // イタリック（*text* or _text_）
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');

    // リンク（[text](url)）
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // 画像（![alt](url)）
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // リスト（順序なし）
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // リスト（順序あり）
    html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');

    // 引用（> text）
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // 水平線（--- or ***）
    html = html.replace(/^---$/gim, '<hr>');
    html = html.replace(/^\*\*\*$/gim, '<hr>');

    // 改行処理
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = `<p>${html}</p>`;

    // コードブロックを復元
    codeBlocks.forEach((block, i) => {
        html = html.replace(`__CODE_BLOCK_${i}__`, block);
    });

    // インラインコードを復元
    inlineCodes.forEach((code, i) => {
        html = html.replace(`__INLINE_CODE_${i}__`, code);
    });

    return html;
};

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
                console.log(`リトライ ${attempt + 1}/${maxRetries}: ${delay}ms 後に再試行...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError || new Error('不明なエラー');
}

/**
 * WordPressに記事を自動投稿する
 * @param queueItem 投稿キューアイテム
 * @param siteConfig サイト設定（認証情報を含む）
 * @returns 投稿された記事のURL
 */
export async function postToWordPress(
    queueItem: ContentQueue,
    siteConfig: SiteConfig
): Promise<string> {
    // 入力検証
    if (!siteConfig.domain) {
        throw new Error('WordPress ドメインが設定されていません');
    }

    if (!siteConfig.api_key_encrypted) {
        throw new Error('WordPress API キーが設定されていません');
    }

    if (!queueItem.content_title || !queueItem.article_markdown) {
        throw new Error('コンテンツのタイトルまたは本文が空です');
    }

    const wordpressDomain = siteConfig.domain;
    const { article_markdown, content_title, final_affiliate_links } = queueItem;

    // アフィリエイトリンクを記事に挿入
    let enrichedContent = article_markdown;
    if (final_affiliate_links && final_affiliate_links.length > 0) {
        enrichedContent += '\n\n---\n\n';
        enrichedContent += '## おすすめ商品\n\n';
        final_affiliate_links.forEach(link => {
            enrichedContent += `- [商品を見る](${link})\n`;
        });
    }

    const postData = {
        title: content_title,
        content: markdownToHtml(enrichedContent),
        status: 'publish',
        // カテゴリ、タグ、カスタムフィールドの挿入ロジックはカスタムプラグイン経由で実現
    };

    // 認証情報（通常はアプリパスワードを使用）
    const token = Buffer.from(`admin:${siteConfig.api_key_encrypted}`).toString('base64');

    // リトライロジック付きでWordPress APIを呼び出し
    return await retryWithBackoff(async () => {
        const response = await fetch(`https://${wordpressDomain}/wp-json/wp/v2/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${token}`,
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`WordPress投稿失敗 (${response.status}): ${errorText}`);
        }

        const json = await response.json();

        if (!json.link) {
            throw new Error('WordPress APIからURLが返されませんでした');
        }

        return json.link; // 投稿された記事のURL
    }, 3, 2000); // 最大3回リトライ、初期待機時間2秒
}
