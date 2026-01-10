/**
 * AI改善提案エンジン - Gemini Vision画像分析統合
 *
 * 商品画像を分析し、出品品質スコアとAI改善提案を生成します。
 * - Gemini Vision APIを使用して画像品質を評価
 * - タイトル、説明文、価格設定の改善提案を生成
 * - 商品カテゴリとマーケットプレイスに基づく最適化提案
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface HealthScoreResult {
  /** 総合健全性スコア (0-100) */
  overallScore: number;
  /** スコア内訳 */
  breakdown: {
    imageQuality: number;      // 画像品質スコア (0-100)
    titleQuality: number;       // タイトル品質スコア (0-100)
    descriptionQuality: number; // 説明文品質スコア (0-100)
    pricingStrategy: number;    // 価格戦略スコア (0-100)
    seoOptimization: number;    // SEO最適化スコア (0-100)
  };
  /** AI改善提案 */
  improvements: AIImprovement[];
  /** Gemini Vision画像分析結果 */
  visionAnalysis?: VisionAnalysisResult;
}

export interface AIImprovement {
  /** 改善カテゴリ */
  category: 'image' | 'title' | 'description' | 'price' | 'seo' | 'category';
  /** 優先度 */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** 現在の問題点 */
  issue: string;
  /** 改善提案 */
  suggestion: string;
  /** 具体的な改善例 */
  example?: string;
  /** 改善による期待効果 */
  impact: string;
}

export interface VisionAnalysisResult {
  /** 画像に写っている商品の識別 */
  productIdentification: {
    category: string;
    brand?: string;
    model?: string;
    condition: 'new' | 'used' | 'refurbished' | 'unknown';
  };
  /** 画像品質評価 */
  imageQuality: {
    resolution: 'high' | 'medium' | 'low';
    lighting: 'excellent' | 'good' | 'poor';
    background: 'clean' | 'cluttered' | 'distracting';
    angle: 'optimal' | 'acceptable' | 'poor';
    professionalGrade: number; // 0-100
  };
  /** 商品の詳細特徴 */
  features: string[];
  /** 検出された問題点 */
  issues: string[];
  /** 改善提案 */
  recommendations: string[];
}

export interface ProductData {
  id: string;
  sku: string;
  title?: string;
  title_en?: string;
  description?: string;
  description_en?: string;
  price?: number;
  category?: string;
  marketplace?: string;
  images?: string[];
  primary_image_url?: string;
}

/**
 * Gemini Vision APIで画像を分析
 */
export async function analyzeProductImage(imageUrl: string): Promise<VisionAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
あなたはEC商品の画像品質を評価する専門家です。
以下の画像を分析し、JSON形式で結果を返してください。

分析項目:
1. 商品識別 (category, brand, model, condition)
2. 画像品質 (resolution, lighting, background, angle, professionalGrade)
3. 商品の詳細特徴 (features配列)
4. 検出された問題点 (issues配列)
5. 改善提案 (recommendations配列)

JSON形式で返してください:
{
  "productIdentification": {
    "category": "商品カテゴリ",
    "brand": "ブランド名",
    "model": "モデル名",
    "condition": "new|used|refurbished|unknown"
  },
  "imageQuality": {
    "resolution": "high|medium|low",
    "lighting": "excellent|good|poor",
    "background": "clean|cluttered|distracting",
    "angle": "optimal|acceptable|poor",
    "professionalGrade": 0-100の数値
  },
  "features": ["特徴1", "特徴2", ...],
  "issues": ["問題点1", "問題点2", ...],
  "recommendations": ["改善提案1", "改善提案2", ...]
}
`;

    // 画像をfetchしてBase64に変換
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
        },
      },
    ]);

    const responseText = result.response.text();

    // JSONを抽出（マークダウンのコードブロックを除去）
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;

    const analysis: VisionAnalysisResult = JSON.parse(jsonText);

    return analysis;
  } catch (error: any) {
    console.error('Gemini Vision分析エラー:', error);

    // フォールバック: 基本的な分析結果を返す
    return {
      productIdentification: {
        category: 'unknown',
        condition: 'unknown',
      },
      imageQuality: {
        resolution: 'medium',
        lighting: 'good',
        background: 'clean',
        angle: 'acceptable',
        professionalGrade: 60,
      },
      features: [],
      issues: ['画像分析に失敗しました'],
      recommendations: ['画像を再アップロードしてください'],
    };
  }
}

/**
 * 商品データの健全性スコアを計算
 */
export async function calculateHealthScore(product: ProductData): Promise<HealthScoreResult> {
  const improvements: AIImprovement[] = [];
  let visionAnalysis: VisionAnalysisResult | undefined;

  // 画像分析（プライマリ画像が存在する場合）
  let imageScore = 0;
  const primaryImage = product.primary_image_url || product.images?.[0];

  if (primaryImage) {
    try {
      visionAnalysis = await analyzeProductImage(primaryImage);

      // 画像品質スコアを計算
      imageScore = visionAnalysis.imageQuality.professionalGrade;

      // 画像の問題点を改善提案に追加
      visionAnalysis.issues.forEach(issue => {
        improvements.push({
          category: 'image',
          priority: 'high',
          issue,
          suggestion: visionAnalysis!.recommendations[0] || '画像を改善してください',
          impact: '画像品質の向上により、クリック率が15-30%向上します',
        });
      });

      // 画像品質が低い場合
      if (imageScore < 60) {
        improvements.push({
          category: 'image',
          priority: 'critical',
          issue: '画像品質が基準を下回っています',
          suggestion: 'プロフェッショナルな商品写真を使用してください',
          example: '白背景、明るい照明、複数アングルの画像を追加',
          impact: '高品質な画像により、コンバージョン率が最大50%向上します',
        });
      }
    } catch (error) {
      console.error('画像分析エラー:', error);
      imageScore = 50;
    }
  } else {
    improvements.push({
      category: 'image',
      priority: 'critical',
      issue: '商品画像が設定されていません',
      suggestion: '高品質な商品画像を最低3枚アップロードしてください',
      impact: '画像なしの出品は、コンバージョン率が90%以上低下します',
    });
  }

  // タイトル品質スコア
  const titleScore = evaluateTitleQuality(product, improvements);

  // 説明文品質スコア
  const descriptionScore = evaluateDescriptionQuality(product, improvements);

  // 価格戦略スコア
  const pricingScore = evaluatePricingStrategy(product, improvements);

  // SEO最適化スコア
  const seoScore = evaluateSEO(product, improvements);

  // 総合スコア計算（重み付け平均）
  const overallScore = Math.round(
    imageScore * 0.30 +
    titleScore * 0.25 +
    descriptionScore * 0.20 +
    pricingScore * 0.15 +
    seoScore * 0.10
  );

  return {
    overallScore,
    breakdown: {
      imageQuality: imageScore,
      titleQuality: titleScore,
      descriptionQuality: descriptionScore,
      pricingStrategy: pricingScore,
      seoOptimization: seoScore,
    },
    improvements: improvements.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }),
    visionAnalysis,
  };
}

/**
 * タイトル品質を評価
 */
function evaluateTitleQuality(product: ProductData, improvements: AIImprovement[]): number {
  let score = 100;
  const title = product.title_en || product.title || '';

  if (!title) {
    score = 0;
    improvements.push({
      category: 'title',
      priority: 'critical',
      issue: 'タイトルが設定されていません',
      suggestion: 'SEOを意識した魅力的なタイトルを作成してください',
      impact: 'タイトルは検索順位とクリック率に最も影響します',
    });
    return score;
  }

  // 長さチェック
  if (title.length < 30) {
    score -= 20;
    improvements.push({
      category: 'title',
      priority: 'high',
      issue: 'タイトルが短すぎます',
      suggestion: 'タイトルを50-80文字に拡張してください',
      example: 'ブランド名、商品名、主要な特徴、状態を含める',
      impact: '詳細なタイトルにより、検索ヒット率が30%向上します',
    });
  } else if (title.length > 80) {
    score -= 10;
    improvements.push({
      category: 'title',
      priority: 'medium',
      issue: 'タイトルが長すぎます',
      suggestion: 'タイトルを80文字以内に簡潔化してください',
      impact: '簡潔なタイトルは可読性が向上し、クリック率が上がります',
    });
  }

  // キーワード密度チェック
  if (!/brand|model|new|authentic|genuine/i.test(title)) {
    score -= 15;
    improvements.push({
      category: 'title',
      priority: 'medium',
      issue: '重要なキーワードが不足しています',
      suggestion: 'ブランド名、状態（New/Used）、主要な特徴を含めてください',
      impact: 'キーワード最適化により、検索順位が向上します',
    });
  }

  return Math.max(0, score);
}

/**
 * 説明文品質を評価
 */
function evaluateDescriptionQuality(product: ProductData, improvements: AIImprovement[]): number {
  let score = 100;
  const description = product.description_en || product.description || '';

  if (!description) {
    score = 0;
    improvements.push({
      category: 'description',
      priority: 'critical',
      issue: '商品説明が設定されていません',
      suggestion: '詳細な商品説明を300文字以上で作成してください',
      impact: '詳細な説明により、購入率が40%向上します',
    });
    return score;
  }

  if (description.length < 200) {
    score -= 30;
    improvements.push({
      category: 'description',
      priority: 'high',
      issue: '商品説明が短すぎます',
      suggestion: '商品の特徴、仕様、使用方法を詳しく記載してください',
      example: '素材、サイズ、重量、使用シーン、メリット、注意事項など',
      impact: '詳細な説明により、問い合わせが減少し、購入率が向上します',
    });
  }

  // HTML/フォーマットチェック
  if (!description.includes('<') && !description.includes('\n\n')) {
    score -= 15;
    improvements.push({
      category: 'description',
      priority: 'medium',
      issue: '説明文の構造化が不足しています',
      suggestion: '見出し、箇条書き、段落を使って読みやすくしてください',
      impact: '構造化された説明文は、読了率が50%向上します',
    });
  }

  return Math.max(0, score);
}

/**
 * 価格戦略を評価
 */
function evaluatePricingStrategy(product: ProductData, improvements: AIImprovement[]): number {
  let score = 100;

  if (!product.price || product.price <= 0) {
    score = 0;
    improvements.push({
      category: 'price',
      priority: 'critical',
      issue: '価格が設定されていません',
      suggestion: '競合分析を行い、適切な価格を設定してください',
      impact: '適切な価格設定は売上に直結します',
    });
    return score;
  }

  // 価格が異常に低い/高い場合の警告
  if (product.price < 500) {
    score -= 20;
    improvements.push({
      category: 'price',
      priority: 'medium',
      issue: '価格が市場平均より低い可能性があります',
      suggestion: '競合商品の価格を調査し、適正価格を再検討してください',
      impact: '適正価格により、利益率が向上します',
    });
  }

  // 端数価格戦略の提案
  if (product.price % 100 === 0) {
    score -= 10;
    improvements.push({
      category: 'price',
      priority: 'low',
      issue: '心理的価格設定が活用されていません',
      suggestion: '価格を¥○,980や¥○,990などの端数に設定してください',
      example: `現在: ¥${product.price.toLocaleString()} → 提案: ¥${(product.price - 10).toLocaleString()}`,
      impact: '端数価格により、購入心理が刺激され、コンバージョン率が5-10%向上します',
    });
  }

  return Math.max(0, score);
}

/**
 * SEO最適化を評価
 */
function evaluateSEO(product: ProductData, improvements: AIImprovement[]): number {
  let score = 100;
  const title = product.title_en || product.title || '';
  const description = product.description_en || product.description || '';

  // カテゴリ設定チェック
  if (!product.category) {
    score -= 30;
    improvements.push({
      category: 'seo',
      priority: 'high',
      issue: 'カテゴリが設定されていません',
      suggestion: '適切なカテゴリを選択してください',
      impact: 'カテゴリ設定により、検索での発見率が向上します',
    });
  }

  // キーワードの一貫性チェック
  const titleWords = title.toLowerCase().split(/\s+/);
  const descWords = description.toLowerCase().split(/\s+/);
  const commonWords = titleWords.filter(word => word.length > 3 && descWords.includes(word));

  if (commonWords.length < 3) {
    score -= 20;
    improvements.push({
      category: 'seo',
      priority: 'medium',
      issue: 'タイトルと説明文のキーワード一貫性が低い',
      suggestion: 'タイトルの主要キーワードを説明文にも含めてください',
      impact: 'キーワード一貫性により、SEOスコアが向上します',
    });
  }

  return Math.max(0, score);
}

/**
 * 複数商品のバッチ分析
 */
export async function batchAnalyzeProducts(
  products: ProductData[],
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, HealthScoreResult>> {
  const results = new Map<string, HealthScoreResult>();

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    try {
      const result = await calculateHealthScore(product);
      results.set(product.id, result);

      if (onProgress) {
        onProgress(i + 1, products.length);
      }
    } catch (error) {
      console.error(`商品ID ${product.id} の分析エラー:`, error);
    }

    // レート制限対策: 500msの待機
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}
