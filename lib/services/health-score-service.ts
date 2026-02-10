/**
 * Health Score Service
 * Gemini Vision画像分析結果とAI改善提案サービス
 */

export interface HealthScoreResult {
  score: number; // 0-100
  category: 'excellent' | 'good' | 'fair' | 'poor';
  improvements: Improvement[];
  imageAnalysis: ImageAnalysis;
  timestamp: Date;
}

export interface Improvement {
  id: string;
  type: 'title' | 'description' | 'image' | 'price' | 'category';
  priority: 'high' | 'medium' | 'low';
  currentValue: string;
  suggestedValue: string;
  reason: string;
  impact: string; // 期待される効果
}

export interface ImageAnalysis {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  issues: string[];
  suggestions: string[];
  mainObjects: string[];
  background: string;
  lighting: string;
}

/**
 * Health Score Serviceクラス
 */
export class HealthScoreService {
  /**
   * 商品のHealth Scoreを計算（モック）
   * 実際はGemini Vision APIを使用
   */
  static async calculateHealthScore(product: {
    title: string;
    description: string;
    images: string[];
    price: number;
    category?: string;
  }): Promise<HealthScoreResult> {
    // モックの画像分析結果
    const imageAnalysis: ImageAnalysis = {
      quality: product.images.length > 0 ? 'good' : 'poor',
      issues:
        product.images.length === 0
          ? ['画像がありません']
          : [
              '背景にノイズが見られます',
              '照明がやや暗いです',
            ],
      suggestions: [
        '白背景で撮影すると商品が際立ちます',
        '自然光または拡散光を使用してください',
        '複数アングルの画像を追加してください',
      ],
      mainObjects: ['商品本体', 'パッケージ'],
      background: '雑然とした背景',
      lighting: 'やや暗い',
    };

    // モックの改善提案
    const improvements: Improvement[] = [];

    // タイトル分析
    if (product.title.length < 30) {
      improvements.push({
        id: 'TITLE001',
        type: 'title',
        priority: 'high',
        currentValue: product.title,
        suggestedValue: `${product.title} - 高品質・迅速配送・満足保証`,
        reason: 'タイトルが短すぎます。SEOキーワードを含めることで検索順位が向上します。',
        impact: '検索表示回数+30%、クリック率+15%',
      });
    }

    // 説明文分析
    if (product.description.length < 100) {
      improvements.push({
        id: 'DESC001',
        type: 'description',
        priority: 'high',
        currentValue: product.description.substring(0, 50) + '...',
        suggestedValue:
          '詳細な商品説明を含め、特徴・仕様・使用方法・注意事項などを300文字以上で記載してください。',
        reason: '説明文が短すぎます。詳細な情報は購入決定率を高めます。',
        impact: 'コンバージョン率+20%',
      });
    }

    // 画像分析
    if (product.images.length < 3) {
      improvements.push({
        id: 'IMAGE001',
        type: 'image',
        priority: 'medium',
        currentValue: `現在の画像数: ${product.images.length}`,
        suggestedValue: '最低3枚以上の画像を追加してください（正面、側面、使用例）',
        reason: '複数の画像は商品の理解を深め、購入意欲を高めます。',
        impact: 'コンバージョン率+25%',
      });
    }

    // 価格分析（仮の競合価格）
    const competitorPrice = product.price * 0.9;
    if (product.price > competitorPrice * 1.2) {
      improvements.push({
        id: 'PRICE001',
        type: 'price',
        priority: 'low',
        currentValue: `¥${product.price.toLocaleString()}`,
        suggestedValue: `¥${Math.floor(competitorPrice * 1.1).toLocaleString()}`,
        reason: '競合他社と比較して価格が高めです。',
        impact: 'コンバージョン率+10%',
      });
    }

    // スコア計算
    const titleScore = product.title.length >= 30 ? 30 : 15;
    const descScore = product.description.length >= 100 ? 30 : 15;
    const imageScore = product.images.length >= 3 ? 30 : product.images.length * 10;
    const priceScore = 10;

    const score = titleScore + descScore + imageScore + priceScore;

    const category: 'excellent' | 'good' | 'fair' | 'poor' =
      score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'fair' : 'poor';

    return {
      score,
      category,
      improvements,
      imageAnalysis,
      timestamp: new Date(),
    };
  }

  /**
   * スコアカテゴリーのラベルを取得
   */
  static getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      excellent: '優秀',
      good: '良好',
      fair: '改善の余地あり',
      poor: '要改善',
    };
    return labels[category] || 'N/A';
  }

  /**
   * スコアカテゴリーの色を取得
   */
  static getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      excellent: 'text-green-600',
      good: 'text-blue-600',
      fair: 'text-yellow-600',
      poor: 'text-red-600',
    };
    return colors[category] || 'text-gray-600';
  }

  /**
   * 優先度のラベルを取得
   */
  static getPriorityLabel(priority: string): string {
    const labels: Record<string, string> = {
      high: '高',
      medium: '中',
      low: '低',
    };
    return labels[priority] || 'N/A';
  }

  /**
   * 優先度の色を取得
   */
  static getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }
}

export default HealthScoreService;
