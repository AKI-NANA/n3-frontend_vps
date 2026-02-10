/**
 * Yahoo Auction タイトル生成 API
 * 
 * POST /api/v2/yahooauction/generate-title
 * 
 * 機能:
 * - SEO最適化されたタイトル生成
 * - 全角65文字制限の遵守
 * - パワーワードの優先配置
 * - 複数バリエーション生成
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateOptimizedTitle,
  generateJapaneseTitleFromEnglish,
  generateTitleVariants,
  previewTitle,
  TitleGeneratorParams,
  EndHour,
} from '@/lib/yahooauction';

// ============================================================
// 型定義
// ============================================================

interface SingleTitleRequest {
  mode: 'single';
  productName: string;
  condition?: string;
  retailPrice?: number;
  isAuthentic?: boolean;
  brand?: string;
  modelNumber?: string;
  isFreeShipping?: boolean;
  is1YenStart?: boolean;
  endHour?: EndHour;
  endDayOfWeek?: number;
  additionalKeywords?: string[];
  isLimitedEdition?: boolean;
  isSealed?: boolean;
}

interface TranslateTitleRequest {
  mode: 'translate';
  englishTitle: string;
  condition?: string;
  retailPrice?: number;
  isAuthentic?: boolean;
  brand?: string;
  modelNumber?: string;
  isFreeShipping?: boolean;
}

interface VariantsTitleRequest {
  mode: 'variants';
  productName: string;
  count?: number;
  condition?: string;
  retailPrice?: number;
  isAuthentic?: boolean;
  brand?: string;
  modelNumber?: string;
  isFreeShipping?: boolean;
}

interface PreviewTitleRequest {
  mode: 'preview';
  title: string;
}

interface BatchTitleRequest {
  mode: 'batch';
  items: Array<{
    id: number | string;
    productName?: string;
    titleEn?: string;
    condition?: string;
    retailPrice?: number;
    isAuthentic?: boolean;
    brand?: string;
    modelNumber?: string;
    isFreeShipping?: boolean;
  }>;
}

type TitleRequest = 
  | SingleTitleRequest 
  | TranslateTitleRequest 
  | VariantsTitleRequest 
  | PreviewTitleRequest
  | BatchTitleRequest;

// ============================================================
// API ハンドラー
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: TitleRequest = await request.json();

    if (!body.mode) {
      return NextResponse.json(
        { success: false, error: 'mode is required (single, translate, variants, preview, batch)' },
        { status: 400 }
      );
    }

    switch (body.mode) {
      case 'single': {
        const { productName, ...options } = body;
        
        if (!productName || typeof productName !== 'string') {
          return NextResponse.json(
            { success: false, error: 'productName is required' },
            { status: 400 }
          );
        }

        const result = generateOptimizedTitle({
          productName,
          ...options,
        } as TitleGeneratorParams);

        return NextResponse.json({
          success: true,
          mode: 'single',
          result,
        });
      }

      case 'translate': {
        const { englishTitle, ...options } = body;
        
        if (!englishTitle || typeof englishTitle !== 'string') {
          return NextResponse.json(
            { success: false, error: 'englishTitle is required' },
            { status: 400 }
          );
        }

        const result = generateJapaneseTitleFromEnglish(englishTitle, options);

        return NextResponse.json({
          success: true,
          mode: 'translate',
          originalTitle: englishTitle,
          result,
        });
      }

      case 'variants': {
        const { productName, count = 3, ...options } = body;
        
        if (!productName || typeof productName !== 'string') {
          return NextResponse.json(
            { success: false, error: 'productName is required' },
            { status: 400 }
          );
        }

        const results = generateTitleVariants(
          { productName, ...options } as TitleGeneratorParams,
          Math.min(count, 5)
        );

        return NextResponse.json({
          success: true,
          mode: 'variants',
          count: results.length,
          results,
        });
      }

      case 'preview': {
        const { title } = body;
        
        if (!title || typeof title !== 'string') {
          return NextResponse.json(
            { success: false, error: 'title is required' },
            { status: 400 }
          );
        }

        const result = previewTitle(title);

        return NextResponse.json({
          success: true,
          mode: 'preview',
          result,
        });
      }

      case 'batch': {
        const { items } = body;
        
        if (!Array.isArray(items) || items.length === 0) {
          return NextResponse.json(
            { success: false, error: 'items must be a non-empty array' },
            { status: 400 }
          );
        }

        if (items.length > 200) {
          return NextResponse.json(
            { success: false, error: 'Maximum 200 items per batch' },
            { status: 400 }
          );
        }

        const results = items.map(item => {
          const { id, productName, titleEn, ...options } = item;
          
          let result;
          if (productName) {
            result = generateOptimizedTitle({
              productName,
              ...options,
            } as TitleGeneratorParams);
          } else if (titleEn) {
            result = generateJapaneseTitleFromEnglish(titleEn, options);
          } else {
            return {
              id,
              success: false,
              error: 'productName or titleEn is required',
            };
          }

          return {
            id,
            success: true,
            result,
          };
        });

        const successCount = results.filter(r => r.success).length;
        const errorCount = results.filter(r => !r.success).length;

        return NextResponse.json({
          success: true,
          mode: 'batch',
          count: results.length,
          successCount,
          errorCount,
          results,
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown mode: ${(body as any).mode}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('[API] Yahoo Auction generate-title error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: ヘルスチェックと使用例
export async function GET() {
  return NextResponse.json({
    success: true,
    endpoint: '/api/v2/yahooauction/generate-title',
    version: '1.0.0',
    modes: ['single', 'translate', 'variants', 'preview', 'batch'],
    maxTitleLength: 65,
    powerWords: {
      priority: [
        '1. 緊急キーワード（1円〜、日曜23時終）',
        '2. 送料無料',
        '3. 定価情報（定価○万）',
        '4. 状態（新品、未開封、美品）',
        '5. 限定品',
        '6. 商品名',
        '7. 型番・モデル名',
        '8. 正規品',
        '9. ブランド名',
      ],
    },
    examples: {
      single: {
        mode: 'single',
        productName: 'エヴァンゲリオン初号機 G覚醒Ver.',
        condition: '新品',
        retailPrice: 38000,
        isAuthentic: true,
        brand: 'バンダイ',
        isFreeShipping: true,
      },
      translate: {
        mode: 'translate',
        englishTitle: 'Evangelion Unit-01 G Awakening Ver. Figure Bandai',
        condition: '新品',
        retailPrice: 38000,
        isAuthentic: true,
      },
      variants: {
        mode: 'variants',
        productName: 'エヴァンゲリオン初号機',
        count: 3,
        condition: '新品',
        retailPrice: 38000,
      },
      preview: {
        mode: 'preview',
        title: '【送料無料】定価3.8万 新品 エヴァンゲリオン初号機 G覚醒Ver.',
      },
      batch: {
        mode: 'batch',
        items: [
          { id: 1, productName: 'ワンピース ルフィ フィギュア', condition: '新品' },
          { id: 2, titleEn: 'Dragon Ball Goku Figure Limited Edition', isLimitedEdition: true },
        ],
      },
    },
  });
}
