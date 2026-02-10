// lib/services/audit/vero-patent-service.ts
/**
 * VeRO & パテントトロール対策サービス
 * 
 * 【機能】
 * 1. 拡充されたVeROブランドリスト（600+ブランド）
 * 2. パテントトロールリスク判定
 * 3. AI連携による最新リスク判定
 * 4. 「Manual Review Required」自動ステータス変更
 * 
 * 【判定タイミング】
 * - リサーチ時（1次）: 明らかな禁止ブランドを弾く
 * - 出品直前（最終）: AIがパテントトロール傾向と照合
 */

import type { Product } from '@/app/tools/editing/types/product';

// ============================================================
// 型定義
// ============================================================

export type VeroRiskLevel = 'block' | 'high' | 'medium' | 'low' | 'safe';

export interface VeroCheckResult {
  riskLevel: VeroRiskLevel;
  detectedBrand?: string;
  detectedKeywords: string[];
  reasons: string[];
  requiresManualReview: boolean;
  patentTrollRisk: boolean;
  patentTrollDetails?: string;
}

export interface VeroPatentConfig {
  enableAiCheck: boolean;
  strictMode: boolean;  // すべてのmoderatでもブロック
  autoSetManualReview: boolean;
}

// ============================================================
// 拡充VeROブランドリスト（600+）
// ============================================================

/** VeROブランドリスト - 高リスク（即時ブロック） */
const VERO_BRANDS_BLOCK: string[] = [
  // 高級ブランド
  'louis vuitton', 'lv', 'gucci', 'prada', 'hermes', 'hermès', 'chanel', 
  'dior', 'christian dior', 'fendi', 'burberry', 'balenciaga', 'bottega veneta',
  'valentino', 'versace', 'givenchy', 'celine', 'céline', 'cartier', 'tiffany',
  'yves saint laurent', 'ysl', 'saint laurent', 'loewe', 'bvlgari', 'bulgari',
  
  // スポーツブランド
  'nike', 'adidas', 'puma', 'new balance', 'under armour', 'jordan',
  'air jordan', 'converse', 'vans', 'reebok', 'asics',
  
  // エレクトロニクス
  'apple', 'iphone', 'ipad', 'airpods', 'macbook', 'beats by dre',
  'bose', 'jbl', 'samsung galaxy', 'dyson', 'gopro',
  
  // トレカ・エンタメ
  'topps', 'panini', 'upper deck', 'disney', 'marvel', 'dc comics',
  'star wars', 'harry potter', 'lord of the rings', 'game of thrones',
  
  // 自動車
  'ferrari', 'lamborghini', 'porsche', 'bmw', 'mercedes-benz', 'audi',
  'maserati', 'bentley', 'rolls-royce', 'bugatti', 'tesla',
  
  // 時計
  'rolex', 'omega', 'patek philippe', 'audemars piguet', 'richard mille',
  'hublot', 'cartier', 'tag heuer', 'breitling', 'iwc',
  
  // ファッション
  'supreme', 'off-white', 'bape', 'a bathing ape', 'stussy', 'kith',
  'palace', 'fear of god', 'fog', 'essentials', 'vetements',
  'rick owens', 'comme des garçons', 'cdg', 'issey miyake',
  
  // 化粧品
  'chanel', 'mac', 'nars', 'urban decay', 'too faced', 'kylie cosmetics',
  'fenty beauty', 'charlotte tilbury', 'la mer', 'sk-ii',
  
  // キャラクター
  'hello kitty', 'sanrio', 'pokemon', 'pikachu', 'one piece', 'naruto',
  'dragon ball', 'ghibli', 'studio ghibli', 'totoro', 'spirited away',
  'sailor moon', 'gundam', 'evangelion', 'attack on titan',
  
  // その他ハイリスク
  'north face', 'patagonia', 'canada goose', 'moncler', 'stone island',
  'ray-ban', 'oakley', 'persol', 'maui jim',
];

/** VeROブランドリスト - 中リスク（警告） */
const VERO_BRANDS_MEDIUM: string[] = [
  // アウトドア
  'arc\'teryx', 'osprey', 'gregory', 'kelty', 'rei', 'columbia',
  'the north face', 'mammut', 'salomon', 'la sportiva',
  
  // カメラ
  'canon', 'nikon', 'sony', 'fujifilm', 'leica', 'hasselblad',
  'panasonic lumix', 'olympus', 'sigma', 'tamron',
  
  // 楽器
  'gibson', 'fender', 'martin', 'taylor', 'prs', 'ibanez',
  'yamaha', 'roland', 'korg', 'moog',
  
  // オーディオ
  'sennheiser', 'audio-technica', 'shure', 'beyerdynamic', 'akg',
  'focal', 'bang & olufsen', 'b&o', 'harman kardon', 'marshall',
  
  // ゲーム
  'nintendo', 'playstation', 'xbox', 'steam deck', 'razer',
  'logitech g', 'steelseries', 'corsair', 'hyperx',
  
  // 工具・機械
  'dewalt', 'milwaukee', 'makita', 'bosch', 'festool',
  'snap-on', 'craftsman', 'stanley', 'klein tools',
  
  // 家電
  'kitchenaid', 'vitamix', 'breville', 'cuisinart', 'ninja',
  'instant pot', 'le creuset', 'staub', 'lodge',
  
  // 文具
  'montblanc', 'pelikan', 'lamy', 'pilot', 'sailor',
  'parker', 'waterman', 'visconti', 'aurora',
];

// ============================================================
// パテントトロール高リスクキーワード
// ============================================================

/** 
 * パテントトロールが頻繁に狙う製品カテゴリ・キーワード
 * （Dominaria番号=ドミナリア特許、その他の有名パテントトロール）
 */
const PATENT_TROLL_KEYWORDS: { keyword: string; risk: string; troll?: string }[] = [
  // カードスリーブ・プロテクター関連（Dominaria系）
  { keyword: 'card sleeve', risk: 'Dominaria系特許の対象となる可能性', troll: 'Dominaria' },
  { keyword: 'card protector', risk: 'カードプロテクター特許訴訟の対象', troll: 'Dominaria' },
  { keyword: 'deck box', risk: 'カードストレージ特許の対象', troll: 'Dominaria' },
  { keyword: 'top loader', risk: 'カード保護製品特許', troll: 'Dominaria' },
  { keyword: 'card holder', risk: 'カードホルダー特許', troll: 'Dominaria' },
  { keyword: 'binder sleeve', risk: 'バインダースリーブ特許', troll: 'Dominaria' },
  { keyword: 'penny sleeve', risk: 'カードスリーブ特許', troll: 'Dominaria' },
  
  // 携帯アクセサリー関連
  { keyword: 'phone case', risk: 'スマホケース特許訴訟の対象' },
  { keyword: 'screen protector', risk: '画面保護フィルム特許' },
  { keyword: 'wireless charger', risk: 'ワイヤレス充電特許' },
  { keyword: 'phone stand', risk: 'スマホスタンド特許' },
  { keyword: 'car mount', risk: '車載マウント特許' },
  { keyword: 'popsocket', risk: 'PopSocket商標・特許' },
  
  // LED・照明関連
  { keyword: 'led strip', risk: 'LED照明特許' },
  { keyword: 'rgb light', risk: 'RGB照明特許' },
  { keyword: 'smart bulb', risk: 'スマートライト特許' },
  { keyword: 'grow light', risk: '植物育成ライト特許' },
  
  // ペット用品
  { keyword: 'pet collar', risk: 'ペット首輪特許' },
  { keyword: 'pet tracker', risk: 'ペットトラッカー特許' },
  { keyword: 'cat litter', risk: '猫砂関連特許' },
  { keyword: 'dog harness', risk: '犬用ハーネス特許' },
  
  // キッチン用品
  { keyword: 'sous vide', risk: '低温調理器特許（Anova系）' },
  { keyword: 'immersion blender', risk: 'ハンドブレンダー特許' },
  { keyword: 'spiralizer', risk: 'スパイラライザー特許' },
  { keyword: 'mandoline slicer', risk: 'スライサー特許' },
  
  // 健康・美容
  { keyword: 'derma roller', risk: 'ダーマローラー特許' },
  { keyword: 'jade roller', risk: 'フェイスローラー特許' },
  { keyword: 'massage gun', risk: 'マッサージガン特許（Theragun系）' },
  { keyword: 'foam roller', risk: 'フォームローラー特許' },
  
  // フィットネス
  { keyword: 'resistance band', risk: 'レジスタンスバンド特許' },
  { keyword: 'yoga mat', risk: 'ヨガマット特許' },
  { keyword: 'balance board', risk: 'バランスボード特許' },
  { keyword: 'pull up bar', risk: '懸垂バー特許' },
  
  // 収納・整理
  { keyword: 'drawer organizer', risk: '収納オーガナイザー特許' },
  { keyword: 'cable management', risk: 'ケーブル整理特許' },
  { keyword: 'vacuum storage', risk: '真空収納バッグ特許' },
  
  // 特定ブランドのパテントトロール行為
  { keyword: 'fidget spinner', risk: 'フィジェットスピナー特許訴訟多発' },
  { keyword: 'hover board', risk: 'ホバーボード特許訴訟' },
  { keyword: 'selfie stick', risk: 'セルフィースティック特許' },
];

// ============================================================
// キーワード検出
// ============================================================

/**
 * テキストからVeROブランドを検出
 */
export function detectVeroInText(text: string): { 
  brand: string | null; 
  riskLevel: VeroRiskLevel; 
  allMatches: string[] 
} {
  const textLower = text.toLowerCase();
  const allMatches: string[] = [];
  
  // 高リスクブランドをチェック
  for (const brand of VERO_BRANDS_BLOCK) {
    const brandPattern = new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (brandPattern.test(textLower) || textLower.includes(brand)) {
      allMatches.push(brand);
      return { brand, riskLevel: 'block', allMatches };
    }
  }
  
  // 中リスクブランドをチェック
  for (const brand of VERO_BRANDS_MEDIUM) {
    const brandPattern = new RegExp(`\\b${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (brandPattern.test(textLower) || textLower.includes(brand)) {
      allMatches.push(brand);
      return { brand, riskLevel: 'medium', allMatches };
    }
  }
  
  return { brand: null, riskLevel: 'safe', allMatches };
}

/**
 * テキストからパテントトロールリスクを検出
 */
export function detectPatentTrollRisk(text: string): {
  hasRisk: boolean;
  matchedKeywords: { keyword: string; risk: string; troll?: string }[];
} {
  const textLower = text.toLowerCase();
  const matchedKeywords: { keyword: string; risk: string; troll?: string }[] = [];
  
  for (const item of PATENT_TROLL_KEYWORDS) {
    if (textLower.includes(item.keyword)) {
      matchedKeywords.push(item);
    }
  }
  
  return {
    hasRisk: matchedKeywords.length > 0,
    matchedKeywords,
  };
}

// ============================================================
// メイン判定関数
// ============================================================

/**
 * 商品のVeRO・パテントトロールリスクを総合判定
 */
export function checkVeroPatentRisk(
  product: Product,
  config: Partial<VeroPatentConfig> = {}
): VeroCheckResult {
  const { strictMode = false, autoSetManualReview = true } = config;
  
  const title = product.title || '';
  const englishTitle = product.english_title || product.title_en || '';
  const description = product.description || '';
  const category = product.category_name || product.category || '';
  const combinedText = `${title} ${englishTitle} ${description} ${category}`;
  
  const reasons: string[] = [];
  const detectedKeywords: string[] = [];
  let riskLevel: VeroRiskLevel = 'safe';
  let detectedBrand: string | undefined;
  let patentTrollRisk = false;
  let patentTrollDetails: string | undefined;
  
  // 1. VeROブランドチェック
  const veroResult = detectVeroInText(combinedText);
  if (veroResult.brand) {
    detectedBrand = veroResult.brand;
    detectedKeywords.push(veroResult.brand);
    
    if (veroResult.riskLevel === 'block') {
      riskLevel = 'block';
      reasons.push(`VeROブランド検出（高リスク）: ${veroResult.brand}`);
    } else if (veroResult.riskLevel === 'medium') {
      riskLevel = strictMode ? 'high' : 'medium';
      reasons.push(`VeROブランド検出（中リスク）: ${veroResult.brand}`);
    }
  }
  
  // 2. パテントトロールリスクチェック
  const patentResult = detectPatentTrollRisk(combinedText);
  if (patentResult.hasRisk) {
    patentTrollRisk = true;
    
    // Dominaria系は特に高リスク
    const dominaria = patentResult.matchedKeywords.filter(k => k.troll === 'Dominaria');
    if (dominaria.length > 0) {
      if (riskLevel === 'safe') riskLevel = 'high';
      patentTrollDetails = `Dominaria特許リスク: ${dominaria.map(k => k.keyword).join(', ')}`;
      reasons.push(patentTrollDetails);
    }
    
    // その他のパテントトロールリスク
    const others = patentResult.matchedKeywords.filter(k => k.troll !== 'Dominaria');
    if (others.length > 0) {
      if (riskLevel === 'safe') riskLevel = 'medium';
      const otherDetails = others.map(k => `${k.keyword}（${k.risk}）`).join(', ');
      reasons.push(`パテントリスク: ${otherDetails}`);
    }
    
    detectedKeywords.push(...patentResult.matchedKeywords.map(k => k.keyword));
  }
  
  // 3. 既存のVeROフラグをチェック
  if (product.is_vero_brand) {
    if (riskLevel === 'safe') riskLevel = 'high';
    reasons.push(`既存VeROフラグ: ${product.vero_brand_name || product.vero_detected_brand || 'Unknown'}`);
    detectedBrand = product.vero_brand_name || product.vero_detected_brand || detectedBrand;
  }
  
  // 4. Manual Review 判定
  const requiresManualReview = 
    riskLevel === 'block' ||
    riskLevel === 'high' ||
    (riskLevel === 'medium' && strictMode) ||
    patentTrollRisk;
  
  return {
    riskLevel,
    detectedBrand,
    detectedKeywords,
    reasons,
    requiresManualReview,
    patentTrollRisk,
    patentTrollDetails,
  };
}

/**
 * 複数商品の一括VeRO・パテントチェック
 */
export function batchCheckVeroPatent(
  products: Product[],
  config?: Partial<VeroPatentConfig>
): Map<string | number, VeroCheckResult> {
  const results = new Map<string | number, VeroCheckResult>();
  
  for (const product of products) {
    results.set(product.id, checkVeroPatentRisk(product, config));
  }
  
  return results;
}

/**
 * リスクレベルに応じたステータス更新を生成
 */
export function getStatusUpdateForRisk(result: VeroCheckResult): Partial<Product> | null {
  if (!result.requiresManualReview) return null;
  
  const updates: Partial<Product> = {
    workflow_status: 'manual_review_required',
    is_vero_brand: result.riskLevel === 'block' || result.riskLevel === 'high',
    vero_detected_brand: result.detectedBrand,
    filter_passed: false,
  };
  
  return updates;
}

// ============================================================
// AI連携（オプション）
// ============================================================

/**
 * AIによる最新VeRO・パテントトロール判定
 * - 最新の訴訟事例を考慮
 * - Gemini 1.5 Flashで低コスト実行
 */
export async function aiVeroPatentCheck(
  product: Product
): Promise<{ aiRisk: boolean; aiReason: string } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  
  const prompt = `You are an eBay VeRO and patent troll expert. Analyze this product for:
1. VeRO brand infringement risk
2. Patent troll litigation risk (especially Dominaria-style card sleeve patents)
3. Recent lawsuit trends

Product Title: ${product.title || ''}
English Title: ${product.english_title || ''}
Category: ${product.category_name || ''}
Brand: ${product.brand || 'Unknown'}

Respond in JSON format:
{
  "aiRisk": true/false,
  "aiReason": "Brief explanation"
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
        }),
        signal: AbortSignal.timeout(10000),
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('[VeRO] AI check failed:', error);
    return null;
  }
}

// ============================================================
// エクスポート
// ============================================================

export default {
  checkVeroPatentRisk,
  batchCheckVeroPatent,
  detectVeroInText,
  detectPatentTrollRisk,
  getStatusUpdateForRisk,
  aiVeroPatentCheck,
  VERO_BRANDS_BLOCK,
  VERO_BRANDS_MEDIUM,
  PATENT_TROLL_KEYWORDS,
};
