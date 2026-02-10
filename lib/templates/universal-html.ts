/**
 * N3 Empire OS - Universal HTML Template Engine
 * 
 * 1つの商品データから3種類のHTML（動画スライド/ブログ/電子書籍）を生成
 * CSSを切り替えるだけで各メディア形式に対応
 */

// ============================================================================
// 型定義
// ============================================================================

export interface ProductData {
  id: number;
  sku?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  price: number;
  currency: string;
  image_url?: string;
  image_urls?: string[];
  category?: string;
  brand?: string;
  features?: string[];
  benefit_points?: string[];
  specifications?: Record<string, string>;
}

export interface ContentConfig {
  mode: 'video-slide' | 'blog-post' | 'ebook-page';
  language: 'ja' | 'en';
  theme?: {
    primaryColor?: string;
    accentColor?: string;
    fontFamily?: string;
  };
  includePrice?: boolean;
  includeCTA?: boolean;
  ctaUrl?: string;
  customCSS?: string;
}

export interface GeneratedHTML {
  html: string;
  mode: string;
  productId: number;
  timestamp: string;
  styles: string;
}

// ============================================================================
// CSS定義
// ============================================================================

export const CSS_VIDEO_SLIDE = `
/* video-slide.css - 動画スライド用（高コントラスト・大文字） */
.n3-content {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  font-family: 'Noto Sans JP', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.n3-content.vertical {
  width: 1080px;
  height: 1920px;
}

.hero {
  text-align: center;
  margin-bottom: 40px;
}

.title-main {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.2;
  text-shadow: 2px 2px 20px rgba(0,0,0,0.5);
  margin: 0;
  background: linear-gradient(90deg, #ff6b35, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price-tag {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.price {
  font-size: 96px;
  font-weight: 900;
  color: #ff6b35;
  text-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
}

.currency {
  font-size: 48px;
  vertical-align: top;
  margin-right: 10px;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 80%;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 36px;
  background: rgba(255,255,255,0.1);
  padding: 20px 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.benefit .icon {
  color: #4ade80;
  font-size: 48px;
}

.cta {
  margin-top: 60px;
}

.cta a {
  display: inline-block;
  padding: 24px 60px;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(90deg, #ff6b35, #f97316);
  border-radius: 50px;
  text-decoration: none;
  box-shadow: 0 10px 40px rgba(255, 107, 53, 0.4);
}

.product-image {
  max-width: 400px;
  max-height: 400px;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

/* パーティクル演出（AI対策） */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: particle-drift 20s linear infinite;
}

@keyframes particle-drift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}
`;

export const CSS_BLOG_POST = `
/* blog-post.css - ブログ記事用（読了感重視・レスポンシブ） */
.n3-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Noto Sans JP', 'Helvetica Neue', Arial, sans-serif;
  color: #333333;
  line-height: 1.8;
  background: #ffffff;
}

.hero {
  margin-bottom: 40px;
  text-align: center;
}

.title-main {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0 0 20px 0;
}

.subtitle {
  font-size: 18px;
  color: #666666;
}

.product-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 12px;
  margin: 30px auto;
  display: block;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.price-tag {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.price {
  font-size: 42px;
  font-weight: 700;
  color: #e74c3c;
}

.price-label {
  font-size: 14px;
  color: #666666;
  display: block;
  margin-top: 5px;
}

.benefit-list {
  margin: 40px 0;
}

.benefit {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  margin-bottom: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #3498db;
}

.benefit .icon {
  color: #27ae60;
  font-size: 24px;
  flex-shrink: 0;
}

.benefit .text {
  font-size: 16px;
}

.description {
  font-size: 16px;
  line-height: 2;
  color: #444444;
  margin: 30px 0;
}

.specifications {
  margin: 40px 0;
}

.specifications h3 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
}

.spec-table tr {
  border-bottom: 1px solid #eee;
}

.spec-table th, .spec-table td {
  padding: 12px 15px;
  text-align: left;
}

.spec-table th {
  background: #f8f9fa;
  font-weight: 600;
  width: 30%;
}

.cta {
  text-align: center;
  margin: 50px 0;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
}

.cta a {
  display: inline-block;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background: #ff6b35;
  border-radius: 30px;
  text-decoration: none;
  transition: transform 0.2s;
}

.cta a:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .title-main { font-size: 24px; }
  .price { font-size: 32px; }
  .benefit { padding: 15px; }
}
`;

export const CSS_EBOOK_PAGE = `
/* ebook-page.css - 電子書籍用（組版・印刷対応） */
@page {
  size: A5;
  margin: 20mm 15mm 25mm 20mm;
  @bottom-center {
    content: counter(page);
    font-size: 10pt;
  }
}

.n3-content {
  font-family: 'Noto Serif JP', 'Times New Roman', serif;
  color: #1a1a1a;
  line-height: 1.9;
  font-size: 11pt;
  page-break-inside: avoid;
}

.hero {
  text-align: center;
  margin-bottom: 30pt;
  page-break-after: avoid;
}

.title-main {
  font-size: 18pt;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 10pt 0;
}

.subtitle {
  font-size: 12pt;
  color: #666666;
}

.product-image {
  max-width: 80%;
  height: auto;
  margin: 20pt auto;
  display: block;
}

.price-tag {
  text-align: center;
  margin: 20pt 0;
  padding: 15pt;
  border: 1pt solid #cccccc;
}

.price {
  font-size: 24pt;
  font-weight: 700;
  color: #c00000;
}

.benefit-list {
  margin: 20pt 0;
  padding-left: 20pt;
}

.benefit {
  margin-bottom: 10pt;
  display: flex;
  align-items: flex-start;
  gap: 10pt;
}

.benefit .icon {
  color: #27ae60;
}

.benefit .text {
  font-size: 11pt;
}

.description {
  text-align: justify;
  text-indent: 1em;
  margin: 20pt 0;
}

.specifications {
  margin: 30pt 0;
}

.specifications h3 {
  font-size: 14pt;
  margin-bottom: 15pt;
  border-bottom: 1pt solid #cccccc;
  padding-bottom: 5pt;
}

.spec-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10pt;
}

.spec-table tr {
  border-bottom: 0.5pt solid #dddddd;
}

.spec-table th, .spec-table td {
  padding: 8pt 10pt;
  text-align: left;
}

.spec-table th {
  background: #f5f5f5;
  font-weight: 600;
  width: 30%;
}

.cta {
  text-align: center;
  margin-top: 30pt;
  padding: 15pt;
  background: #f5f5f5;
  border-radius: 5pt;
}

.cta a {
  color: #0066cc;
  text-decoration: underline;
}

/* ページ区切り */
.page-break {
  page-break-before: always;
}

/* 章見出し */
.chapter-title {
  page-break-before: always;
  font-size: 24pt;
  text-align: center;
  margin: 50pt 0 30pt 0;
}
`;

// ============================================================================
// HTML生成関数
// ============================================================================

/**
 * 商品データからユニバーサルHTMLを生成
 */
export function generateUniversalHTML(
  product: ProductData,
  config: ContentConfig
): GeneratedHTML {
  const {
    mode,
    language,
    theme,
    includePrice = true,
    includeCTA = true,
    ctaUrl,
    customCSS
  } = config;

  const title = language === 'en' && product.title_en ? product.title_en : product.title;
  const description = language === 'en' && product.description_en ? product.description_en : product.description;
  const benefits = product.benefit_points || product.features || [];
  const imageUrl = product.image_url || (product.image_urls && product.image_urls[0]) || '';

  // 価格フォーマット
  const formattedPrice = formatPrice(product.price, product.currency);

  // CTA URL
  const ctaHref = ctaUrl || `/product/${product.id}`;

  // CTA テキスト
  const ctaText = language === 'ja' ? '今すぐ購入する' : 'Buy Now';

  // HTML生成
  const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHTML(description.substring(0, 160))}">
  <meta property="og:title" content="${escapeHTML(title)}">
  <meta property="og:description" content="${escapeHTML(description.substring(0, 160))}">
  ${imageUrl ? `<meta property="og:image" content="${escapeHTML(imageUrl)}">` : ''}
  <title>${escapeHTML(title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&family=Noto+Serif+JP:wght@400;700&display=swap" rel="stylesheet">
  <style>
    ${getCSS(mode)}
    ${customCSS || ''}
    ${theme ? generateThemeCSS(theme) : ''}
  </style>
</head>
<body>
  <article class="n3-content" data-product-id="${product.id}" data-mode="${mode}">
    ${mode === 'video-slide' ? '<div class="particles"></div>' : ''}
    
    <section class="hero">
      <h1 class="title-main">${escapeHTML(title)}</h1>
    </section>
    
    ${imageUrl ? `
    <section class="image-section">
      <img src="${escapeHTML(imageUrl)}" alt="${escapeHTML(title)}" class="product-image" loading="lazy">
    </section>
    ` : ''}
    
    ${includePrice ? `
    <section class="price-tag">
      <span class="price">${formattedPrice}</span>
      ${mode === 'blog-post' ? `<span class="price-label">${language === 'ja' ? '税込価格' : 'Price incl. tax'}</span>` : ''}
    </section>
    ` : ''}
    
    ${benefits.length > 0 ? `
    <section class="benefit-list">
      ${benefits.map(benefit => `
        <div class="benefit">
          <span class="icon">✓</span>
          <span class="text">${escapeHTML(benefit)}</span>
        </div>
      `).join('')}
    </section>
    ` : ''}
    
    ${mode !== 'video-slide' && description ? `
    <section class="description">
      <p>${escapeHTML(description)}</p>
    </section>
    ` : ''}
    
    ${mode !== 'video-slide' && product.specifications ? `
    <section class="specifications">
      <h3>${language === 'ja' ? '仕様' : 'Specifications'}</h3>
      <table class="spec-table">
        ${Object.entries(product.specifications).map(([key, value]) => `
          <tr>
            <th>${escapeHTML(key)}</th>
            <td>${escapeHTML(value)}</td>
          </tr>
        `).join('')}
      </table>
    </section>
    ` : ''}
    
    ${includeCTA ? `
    <section class="cta">
      <a href="${escapeHTML(ctaHref)}">${ctaText}</a>
    </section>
    ` : ''}
  </article>
</body>
</html>`;

  return {
    html,
    mode,
    productId: product.id,
    timestamp: new Date().toISOString(),
    styles: getCSS(mode)
  };
}

/**
 * 複数の商品から一括HTML生成
 */
export function generateBatchHTML(
  products: ProductData[],
  config: ContentConfig
): GeneratedHTML[] {
  return products.map(product => generateUniversalHTML(product, config));
}

// ============================================================================
// ヘルパー関数
// ============================================================================

function getCSS(mode: ContentConfig['mode']): string {
  switch (mode) {
    case 'video-slide':
      return CSS_VIDEO_SLIDE;
    case 'blog-post':
      return CSS_BLOG_POST;
    case 'ebook-page':
      return CSS_EBOOK_PAGE;
    default:
      return CSS_BLOG_POST;
  }
}

function formatPrice(price: number, currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    JPY: '¥',
    EUR: '€',
    GBP: '£',
    CNY: '¥',
    KRW: '₩'
  };
  
  const symbol = symbols[currency] || currency;
  
  if (currency === 'JPY' || currency === 'KRW') {
    return `${symbol}${Math.floor(price).toLocaleString()}`;
  }
  
  return `${symbol}${price.toFixed(2)}`;
}

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateThemeCSS(theme: ContentConfig['theme']): string {
  if (!theme) return '';
  
  const vars: string[] = [];
  if (theme.primaryColor) vars.push(`--primary-color: ${theme.primaryColor};`);
  if (theme.accentColor) vars.push(`--accent-color: ${theme.accentColor};`);
  if (theme.fontFamily) vars.push(`--font-family: ${theme.fontFamily};`);
  
  if (vars.length === 0) return '';
  
  return `:root { ${vars.join(' ')} }`;
}

// ============================================================================
// Gemini用プロンプトテンプレート
// ============================================================================

export const GEMINI_HTML_PROMPT = `あなたはN3 Empire OSのコンテンツ生成AIです。以下の商品データを分析し、セマンティックなHTML構造で出力してください。

【出力ルール】
1. Markdownは使用しない。HTML直接出力のみ。
2. 以下のclass名を必ず使用:
   - .hero: ヒーローセクション
   - .title-main: メインタイトル
   - .price-tag: 価格表示
   - .benefit-list: メリットリスト
   - .benefit: 各メリット項目
   - .description: 商品説明
   - .cta: コールトゥアクション
3. benefit-listは3〜5項目が最適
4. 感情に訴える表現を使用（「驚きの」「待望の」等）
5. 価格は既存データを使用、改変しない

【商品データ】
{product_json}

【出力言語】: {language}

【出力形式】: HTMLのみ（<article>タグで囲む）`;

export default {
  generateUniversalHTML,
  generateBatchHTML,
  GEMINI_HTML_PROMPT,
  CSS_VIDEO_SLIDE,
  CSS_BLOG_POST,
  CSS_EBOOK_PAGE
};
