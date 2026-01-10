/**
 * Qoo10 HTMLテンプレートエンジン
 * /lib/qoo10/template-engine.ts
 * 
 * JSが使用できないQoo10の制約に対応した静的HTML生成
 * inline-styleを適用したクリーンなデザイン
 */

import type { Product } from '@/types/product';

// =====================================================
// テンプレートタイプ
// =====================================================
export type TemplateType = 'standard' | 'premium' | 'simple' | 'minimal';

export interface TemplateOptions {
  type?: TemplateType;
  accentColor?: string;
  showBrand?: boolean;
  showSpecs?: boolean;
  showShippingInfo?: boolean;
  showReturnPolicy?: boolean;
  customFooter?: string;
  features?: string[];  // 特徴ポイント（最大3つ）
}

// =====================================================
// デフォルト設定
// =====================================================
const DEFAULT_OPTIONS: TemplateOptions = {
  type: 'standard',
  accentColor: '#ff0066',
  showBrand: true,
  showSpecs: true,
  showShippingInfo: true,
  showReturnPolicy: true,
};

// =====================================================
// メイン関数
// =====================================================
export function generateQoo10Html(product: Product, options: TemplateOptions = {}): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const p = product as any;
  
  // データ抽出
  const title = p.japanese_title || p.title_ja || p.title || '商品名';
  const description = p.description_ja || p.description || '';
  const brand = p.brand_name || p.brand || p.scraped_data?.brand || '';
  const manufacturer = p.manufacturer || p.scraped_data?.manufacturer || '';
  const modelNumber = p.model_number || p.scraped_data?.model_number || '';
  const janCode = p.jan_code || p.scraped_data?.jan_code || '';
  
  // 画像
  const mainImage = p.primary_image_url || 
                    p.scraped_data?.main_image || 
                    (Array.isArray(p.gallery_images) && p.gallery_images[0]) ||
                    (Array.isArray(p.selectedImages) && p.selectedImages[0]) ||
                    '';
  
  const galleryImages = p.gallery_images || p.selectedImages || p.scraped_data?.images || [];
  
  // スペック情報
  const specs = p.scraped_data?.specifications || {};
  const weightG = p.weight_g || 0;
  const dimensions = (p.length_cm && p.width_cm && p.height_cm) 
    ? `${p.length_cm} × ${p.width_cm} × ${p.height_cm} cm` : '';
  
  // テンプレート選択
  switch (opts.type) {
    case 'premium':
      return generatePremiumTemplate(title, description, mainImage, galleryImages, brand, manufacturer, modelNumber, specs, opts);
    case 'simple':
      return generateSimpleTemplate(title, description, mainImage, opts);
    case 'minimal':
      return generateMinimalTemplate(title, description, mainImage);
    default:
      return generateStandardTemplate(title, description, mainImage, galleryImages, brand, specs, opts);
  }
}

// =====================================================
// スタンダードテンプレート
// =====================================================
function generateStandardTemplate(
  title: string,
  description: string,
  mainImage: string,
  galleryImages: string[],
  brand: string,
  specs: Record<string, string>,
  opts: TemplateOptions
): string {
  const accent = opts.accentColor || '#ff0066';
  
  const featuresHtml = opts.features?.length ? `
    <div style="display: flex; justify-content: center; gap: 20px; margin: 25px 0; flex-wrap: wrap;">
      ${opts.features.map(feature => `
        <div style="background: #f8f9fa; padding: 15px 25px; border-radius: 8px; text-align: center; min-width: 150px;">
          <div style="font-size: 14px; font-weight: bold; color: ${accent};">✓</div>
          <div style="font-size: 13px; color: #333; margin-top: 5px;">${escapeHtml(feature)}</div>
        </div>
      `).join('')}
    </div>
  ` : '';
  
  const specsHtml = opts.showSpecs && Object.keys(specs).length > 0 ? `
    <div style="margin: 25px 0;">
      <div style="font-size: 16px; font-weight: bold; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 8px; margin-bottom: 15px;">
        📋 商品仕様
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${Object.entries(specs).slice(0, 10).map(([key, value]) => `
          <tr>
            <td style="padding: 8px 12px; background: #f8f9fa; border: 1px solid #eee; font-weight: 600; width: 30%; font-size: 12px;">${escapeHtml(key)}</td>
            <td style="padding: 8px 12px; border: 1px solid #eee; font-size: 12px;">${escapeHtml(String(value))}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  ` : '';
  
  const shippingHtml = opts.showShippingInfo ? `
    <div style="background: linear-gradient(135deg, #e8f5e9, #f1f8e9); padding: 20px; border-radius: 8px; margin: 25px 0;">
      <div style="font-size: 15px; font-weight: bold; color: #2e7d32; margin-bottom: 10px;">🚚 配送について</div>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #333; line-height: 1.8;">
        <li>日本国内より丁寧に検品・梱包して発送いたします</li>
        <li>通常1〜3営業日以内に発送</li>
        <li>追跡番号をお知らせいたします</li>
      </ul>
    </div>
  ` : '';
  
  const returnHtml = opts.showReturnPolicy ? `
    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
      <div style="font-size: 13px; font-weight: bold; color: #e65100; margin-bottom: 5px;">📦 返品・交換について</div>
      <div style="font-size: 12px; color: #666;">商品到着後7日以内にご連絡ください。未使用品に限り返品・交換を承ります。</div>
    </div>
  ` : '';
  
  return `
<div style="font-family: 'Helvetica Neue', 'Hiragino Sans', 'Meiryo', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; background: #fff;">
  
  <!-- ヘッダー -->
  <div style="text-align: center; margin-bottom: 25px;">
    ${brand && opts.showBrand ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">${escapeHtml(brand)}</div>` : ''}
    <h1 style="font-size: 20px; font-weight: bold; color: #222; margin: 0; line-height: 1.4;">
      ${escapeHtml(title)}
    </h1>
  </div>
  
  <!-- メイン画像 -->
  ${mainImage ? `
  <div style="text-align: center; margin-bottom: 25px;">
    <img src="${escapeHtml(mainImage)}" alt="${escapeHtml(title)}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
  </div>
  ` : ''}
  
  <!-- 特徴ポイント -->
  ${featuresHtml}
  
  <!-- 商品説明 -->
  <div style="background: #fafafa; padding: 25px; border-radius: 8px; margin: 25px 0;">
    <div style="font-size: 16px; font-weight: bold; color: ${accent}; margin-bottom: 15px; border-bottom: 2px solid ${accent}; padding-bottom: 8px;">
      📝 商品説明
    </div>
    <div style="font-size: 14px; line-height: 1.8; white-space: pre-wrap; color: #444;">
${escapeHtml(description)}
    </div>
  </div>
  
  <!-- ギャラリー -->
  ${galleryImages.length > 1 ? `
  <div style="margin: 25px 0;">
    <div style="font-size: 16px; font-weight: bold; color: ${accent}; margin-bottom: 15px;">📷 商品画像</div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
      ${galleryImages.slice(1, 5).map(img => `
        <img src="${escapeHtml(img)}" alt="" style="width: 180px; height: 180px; object-fit: cover; border-radius: 6px; border: 1px solid #eee;">
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  <!-- スペック -->
  ${specsHtml}
  
  <!-- 配送情報 -->
  ${shippingHtml}
  
  <!-- 返品ポリシー -->
  ${returnHtml}
  
  <!-- フッター -->
  <div style="text-align: center; padding: 20px; margin-top: 30px; border-top: 1px solid #eee; font-size: 12px; color: #888;">
    ${opts.customFooter || 'ご不明な点がございましたら、お気軽にお問い合わせください。'}
  </div>
</div>
  `.trim();
}

// =====================================================
// プレミアムテンプレート
// =====================================================
function generatePremiumTemplate(
  title: string,
  description: string,
  mainImage: string,
  galleryImages: string[],
  brand: string,
  manufacturer: string,
  modelNumber: string,
  specs: Record<string, string>,
  opts: TemplateOptions
): string {
  const accent = opts.accentColor || '#ff0066';
  
  return `
<div style="font-family: 'Helvetica Neue', 'Hiragino Sans', sans-serif; max-width: 850px; margin: 0 auto; background: #fff;">
  
  <!-- ヒーローセクション -->
  <div style="background: linear-gradient(135deg, ${accent}15, ${accent}05); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
    ${brand ? `<div style="font-size: 14px; color: ${accent}; font-weight: 600; letter-spacing: 2px; margin-bottom: 10px;">${escapeHtml(brand.toUpperCase())}</div>` : ''}
    <h1 style="font-size: 26px; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.3;">
      ${escapeHtml(title)}
    </h1>
    ${manufacturer || modelNumber ? `
    <div style="margin-top: 15px; font-size: 12px; color: #666;">
      ${manufacturer ? `メーカー: ${escapeHtml(manufacturer)}` : ''}
      ${manufacturer && modelNumber ? ' | ' : ''}
      ${modelNumber ? `型番: ${escapeHtml(modelNumber)}` : ''}
    </div>
    ` : ''}
  </div>
  
  <!-- メイン画像 -->
  ${mainImage ? `
  <div style="padding: 30px; text-align: center; background: #fafafa;">
    <img src="${escapeHtml(mainImage)}" alt="${escapeHtml(title)}" style="max-width: 100%; max-height: 500px; object-fit: contain; border-radius: 8px;">
  </div>
  ` : ''}
  
  <!-- 特徴バナー -->
  ${opts.features?.length ? `
  <div style="display: flex; background: #1a1a1a; color: #fff;">
    ${opts.features.map(feature => `
      <div style="flex: 1; padding: 20px; text-align: center; border-right: 1px solid #333;">
        <div style="font-size: 20px; margin-bottom: 5px;">✓</div>
        <div style="font-size: 13px;">${escapeHtml(feature)}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <!-- コンテンツ -->
  <div style="padding: 40px;">
    <!-- 説明 -->
    <div style="margin-bottom: 40px;">
      <h2 style="font-size: 18px; color: ${accent}; border-left: 4px solid ${accent}; padding-left: 15px; margin-bottom: 20px;">
        商品について
      </h2>
      <div style="font-size: 15px; line-height: 2; color: #444; white-space: pre-wrap;">
${escapeHtml(description)}
      </div>
    </div>
    
    <!-- ギャラリー -->
    ${galleryImages.length > 1 ? `
    <div style="margin-bottom: 40px;">
      <h2 style="font-size: 18px; color: ${accent}; border-left: 4px solid ${accent}; padding-left: 15px; margin-bottom: 20px;">
        詳細画像
      </h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        ${galleryImages.slice(1, 7).map(img => `
          <img src="${escapeHtml(img)}" alt="" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;">
        `).join('')}
      </div>
    </div>
    ` : ''}
    
    <!-- スペック -->
    ${Object.keys(specs).length > 0 ? `
    <div style="margin-bottom: 40px;">
      <h2 style="font-size: 18px; color: ${accent}; border-left: 4px solid ${accent}; padding-left: 15px; margin-bottom: 20px;">
        製品仕様
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        ${Object.entries(specs).map(([key, value], i) => `
          <tr style="background: ${i % 2 === 0 ? '#fafafa' : '#fff'};">
            <th style="padding: 12px 15px; text-align: left; border: 1px solid #eee; width: 35%; font-weight: 600;">${escapeHtml(key)}</th>
            <td style="padding: 12px 15px; border: 1px solid #eee;">${escapeHtml(String(value))}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    ` : ''}
    
    <!-- 配送・サポート -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;">
      <div style="background: #e8f5e9; padding: 25px; border-radius: 10px;">
        <div style="font-size: 16px; font-weight: 700; color: #2e7d32; margin-bottom: 12px;">🚚 配送</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8; color: #333;">
          <li>日本国内より発送</li>
          <li>丁寧に検品・梱包</li>
          <li>1〜3営業日で発送</li>
        </ul>
      </div>
      <div style="background: #e3f2fd; padding: 25px; border-radius: 10px;">
        <div style="font-size: 16px; font-weight: 700; color: #1565c0; margin-bottom: 12px;">💬 サポート</div>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; line-height: 1.8; color: #333;">
          <li>ご質問はお気軽に</li>
          <li>迅速に対応いたします</li>
          <li>安心のアフターサービス</li>
        </ul>
      </div>
    </div>
  </div>
  
  <!-- フッター -->
  <div style="background: #1a1a1a; color: #fff; padding: 25px; text-align: center; border-radius: 0 0 12px 12px;">
    <div style="font-size: 13px; opacity: 0.9;">
      ${opts.customFooter || 'ご覧いただきありがとうございます。ご不明点はお気軽にお問い合わせください。'}
    </div>
  </div>
</div>
  `.trim();
}

// =====================================================
// シンプルテンプレート
// =====================================================
function generateSimpleTemplate(
  title: string,
  description: string,
  mainImage: string,
  opts: TemplateOptions
): string {
  const accent = opts.accentColor || '#ff0066';
  
  return `
<div style="font-family: 'Helvetica Neue', sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333;">
  <h1 style="font-size: 18px; font-weight: bold; color: #222; border-bottom: 2px solid ${accent}; padding-bottom: 10px; margin-bottom: 20px;">
    ${escapeHtml(title)}
  </h1>
  
  ${mainImage ? `
  <div style="text-align: center; margin-bottom: 25px;">
    <img src="${escapeHtml(mainImage)}" alt="${escapeHtml(title)}" style="max-width: 100%; height: auto; border: 1px solid #eee;">
  </div>
  ` : ''}
  
  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <div style="font-size: 14px; line-height: 1.8; white-space: pre-wrap;">
${escapeHtml(description)}
    </div>
  </div>
  
  ${opts.showShippingInfo ? `
  <div style="border: 2px solid #eee; padding: 15px; text-align: center;">
    <div style="font-weight: bold; color: ${accent}; margin-bottom: 8px;">【配送について】</div>
    <div style="font-size: 13px;">日本国内より丁寧に検品・梱包して発送いたします。</div>
  </div>
  ` : ''}
</div>
  `.trim();
}

// =====================================================
// ミニマルテンプレート
// =====================================================
function generateMinimalTemplate(
  title: string,
  description: string,
  mainImage: string
): string {
  return `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 15px; color: #333;">
  <h1 style="font-size: 16px; margin-bottom: 15px;">${escapeHtml(title)}</h1>
  ${mainImage ? `<img src="${escapeHtml(mainImage)}" alt="" style="max-width: 100%; margin-bottom: 15px;">` : ''}
  <p style="font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(description)}</p>
</div>
  `.trim();
}

// =====================================================
// HTMLエスケープ
// =====================================================
function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// =====================================================
// プレビュー用（iframe埋め込み対応）
// =====================================================
export function generateQoo10HtmlWithWrapper(product: Product, options: TemplateOptions = {}): string {
  const content = generateQoo10Html(product, options);
  
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Qoo10 商品説明プレビュー</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #f5f5f5; }
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `.trim();
}
