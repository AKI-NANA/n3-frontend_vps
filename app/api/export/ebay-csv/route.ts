/**
 * eBay File Exchange CSV エクスポート API
 * 
 * POST /api/export/ebay-csv
 * 
 * eBay File Exchangeの「Add/Revise/Relist」テンプレートに準拠したCSVを生成
 * https://pages.ebay.com/file_exchange/
 * 
 * リクエスト:
 * {
 *   productIds: string[],       // 出力対象の商品ID
 *   account: 'MJT' | 'GREEN',   // eBayアカウント
 *   action: 'Add' | 'Revise' | 'Relist' | 'VerifyAdd',  // アクション
 *   site: 'US' | 'UK' | 'AU',   // サイト
 *   options?: {
 *     includeDraft?: boolean,   // 下書き含む
 *     overrideQuantity?: number // 在庫数上書き
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// CSVエスケープ（eBay用）
function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // eBayはダブルクォートで囲む
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// HTMLタグを除去
function stripHtml(html: string | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// eBay File Exchange用カラムヘッダー（Add/Revise共通）
const EBAY_FILE_EXCHANGE_HEADERS = [
  '*Action(SiteID=US)',     // アクションタイプ
  'ItemID',                 // 既存アイテムID（Revise/Relist時）
  'CustomLabel',            // SKU
  '*Title',                 // タイトル（80文字以内）
  '*Category',              // カテゴリID
  '*ConditionID',           // コンディションID
  '*Format',                // フォーマット（FixedPriceItem）
  '*Duration',              // 出品期間（GTC）
  '*StartPrice',            // 価格
  '*Quantity',              // 在庫数
  '*Description',           // 商品説明（HTML可）
  'PicURL',                 // 画像URL（最大12枚、|区切り）
  'ShippingType',           // 発送タイプ
  'ShippingService-1:Option', // 発送サービス
  'ShippingService-1:Cost', // 送料
  '*DispatchTimeMax',       // 発送までの日数
  '*ReturnsAcceptedOption', // 返品可否
  'ReturnsWithinOption',    // 返品期間
  'RefundOption',           // 返金方法
  'ShippingCostPaidByOption', // 返品送料負担
  'Country',                // 出品者所在国
  'Location',               // 出品者所在地
  '*Currency',              // 通貨
  'PayPalAccepted',         // PayPal使用（deprecated）
  'PayPalEmailAddress',     // PayPalメール（deprecated）
  'BrandMPN',               // ブランド
  'C:MPN',                  // MPN
  'C:Brand',                // ブランド（Item Specifics）
  'ItemSpecifics:Name1',    // アイテム詳細1
  'ItemSpecifics:Value1',   // アイテム詳細値1
  'ItemSpecifics:Name2',    // アイテム詳細2
  'ItemSpecifics:Value2',   // アイテム詳細値2
  'ItemSpecifics:Name3',    // アイテム詳細3
  'ItemSpecifics:Value3',   // アイテム詳細値3
];

// シンプルなカラムヘッダー（基本出品用）
const SIMPLE_HEADERS = [
  '*Action(SiteID=SITE)',   // アクションタイプ（SITEはプレースホルダー）
  'ItemID',
  'CustomLabel',
  '*Title',
  '*Category',
  '*ConditionID',
  '*Format',
  '*Duration',
  '*StartPrice',
  '*Quantity',
  '*Description',
  'PicURL',
  '*DispatchTimeMax',
  '*ReturnsAcceptedOption',
  'ReturnsWithinOption',
  'Country',
  'Location',
  '*Currency',
];

// eBayサイトID
const SITE_IDS: Record<string, string> = {
  'US': 'US',
  'UK': 'UK',
  'AU': 'AU',
  'DE': 'DE',
  'FR': 'FR',
  'IT': 'IT',
  'ES': 'ES',
  'CA': 'CA',
};

// eBayコンディションID
const CONDITION_MAP: Record<string, number> = {
  'new': 1000,
  'New': 1000,
  'NEW': 1000,
  'new with tags': 1000,
  'new with box': 1000,
  'Brand New': 1000,
  'new without tags': 1500,
  'new without box': 1500,
  'new other': 1500,
  'Open box': 1750,
  'open box': 1750,
  'Manufacturer refurbished': 2000,
  'Seller refurbished': 2500,
  'refurbished': 2500,
  'Like New': 3000,
  'like new': 3000,
  'Excellent': 3000,
  'Used': 3000,
  'used': 3000,
  'very good': 4000,
  'Very Good': 4000,
  'good': 5000,
  'Good': 5000,
  'acceptable': 6000,
  'Acceptable': 6000,
  'for parts': 7000,
  'For parts or not working': 7000,
};

// 通貨マッピング
const CURRENCY_MAP: Record<string, string> = {
  'US': 'USD',
  'UK': 'GBP',
  'AU': 'AUD',
  'DE': 'EUR',
  'FR': 'EUR',
  'IT': 'EUR',
  'ES': 'EUR',
  'CA': 'CAD',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      productIds, 
      account = 'MJT', 
      action = 'Add', 
      site = 'US',
      options = {}
    } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '出力対象の商品を選択してください' },
        { status: 400 }
      );
    }

    console.log(`[eBay CSV Export] 開始: ${productIds.length}件, account=${account}, action=${action}, site=${site}`);

    // inventory_masterから商品データ取得
    const { data: products, error } = await supabase
      .from('inventory_master')
      .select('*')
      .in('id', productIds);

    if (error) {
      console.error('データ取得エラー:', error);
      return NextResponse.json(
        { success: false, error: 'データ取得に失敗しました: ' + error.message },
        { status: 500 }
      );
    }

    if (!products || products.length === 0) {
      return NextResponse.json(
        { success: false, error: '該当する商品が見つかりません' },
        { status: 404 }
      );
    }

    console.log(`[eBay CSV Export] ${products.length}件の商品データ取得完了`);

    // サイトIDを取得
    const siteId = SITE_IDS[site] || 'US';
    const currency = CURRENCY_MAP[site] || 'USD';

    // ヘッダー行（サイトIDを埋め込む）
    const headers = SIMPLE_HEADERS.map(h => 
      h.replace('SITE', siteId)
    );

    // データ行生成
    const rows: string[][] = [];

    for (const product of products) {
      const sourceData = product.source_data || {};
      
      // タイトル（80文字制限）
      let title = product.product_name || sourceData.english_title || sourceData.title || '';
      if (title.length > 80) {
        title = title.substring(0, 77) + '...';
      }

      // コンディションID
      const conditionName = product.condition_name || sourceData.condition || 'Used';
      const conditionId = CONDITION_MAP[conditionName] || 3000;

      // カテゴリID
      const categoryId = sourceData.ebay_category_id || 
                        sourceData.category_id || 
                        product.category || 
                        '175672'; // デフォルト: アンティーク・コレクタブル

      // 価格
      const price = product.selling_price || sourceData.price_usd || 0;

      // 在庫数
      const quantity = options.overrideQuantity !== undefined 
        ? options.overrideQuantity 
        : (product.physical_quantity || product.listing_quantity || 1);

      // 説明文
      let description = sourceData.description_en || 
                       sourceData.html_content || 
                       sourceData.description || 
                       product.notes || 
                       '';
      // 簡易HTML化（プレーンテキストの場合）
      if (description && !description.includes('<')) {
        description = `<p>${description.replace(/\n/g, '</p><p>')}</p>`;
      }

      // 画像URL（最大12枚、|区切り）
      let images: string[] = [];
      if (product.images && Array.isArray(product.images)) {
        images = product.images.slice(0, 12);
      } else if (sourceData.images && Array.isArray(sourceData.images)) {
        images = sourceData.images.slice(0, 12);
      } else if (sourceData.primary_image_url) {
        images = [sourceData.primary_image_url];
      }
      const picUrl = images.join('|');

      // ItemID（Revise/Relist時のみ）
      const itemId = (action === 'Revise' || action === 'Relist') 
        ? (sourceData.ebay_item_id || sourceData.item_id || '') 
        : '';

      // 行データ
      const row = [
        action,                      // *Action
        itemId,                      // ItemID
        product.sku || product.unique_id || '', // CustomLabel
        title,                       // *Title
        categoryId,                  // *Category
        conditionId.toString(),      // *ConditionID
        'FixedPriceItem',           // *Format
        'GTC',                       // *Duration
        price.toFixed(2),           // *StartPrice
        quantity.toString(),         // *Quantity
        description,                 // *Description
        picUrl,                      // PicURL
        '3',                         // *DispatchTimeMax
        'ReturnsAccepted',          // *ReturnsAcceptedOption
        'Days_30',                   // ReturnsWithinOption
        'JP',                        // Country
        'Japan',                     // Location
        currency,                    // *Currency
      ];

      rows.push(row);
    }

    // CSV生成
    const csvLines = [
      headers.join(','),
      ...rows.map(row => row.map(escapeCSV).join(','))
    ];

    // BOM付きUTF-8
    const csv = '\uFEFF' + csvLines.join('\r\n');
    const buffer = Buffer.from(csv, 'utf-8');

    // ファイル名生成
    const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `ebay_file_exchange_${account}_${site}_${action}_${timestamp}.csv`;

    console.log(`[eBay CSV Export] 完了: ${rows.length}件, filename=${filename}`);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Total-Count': rows.length.toString(),
      },
    });

  } catch (error: any) {
    console.error('[eBay CSV Export] エラー:', error);
    return NextResponse.json(
      { success: false, error: 'CSV生成に失敗しました: ' + (error.message || '不明なエラー') },
      { status: 500 }
    );
  }
}

// GETリクエスト（テンプレートダウンロード）
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const site = searchParams.get('site') || 'US';
  const siteId = SITE_IDS[site] || 'US';
  
  // 空のテンプレートを返す
  const headers = SIMPLE_HEADERS.map(h => h.replace('SITE', siteId));
  const csv = '\uFEFF' + headers.join(',') + '\r\n';
  const buffer = Buffer.from(csv, 'utf-8');

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ebay_file_exchange_template_${site}.csv"`,
    },
  });
}
