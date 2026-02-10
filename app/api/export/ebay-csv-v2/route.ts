/**
 * eBay CSV Export API (v2)
 * 
 * eBay File Exchange / Seller Hub Reports 形式のCSV生成
 * 
 * 対応機能:
 * - アクション: Add, Revise, Relist, VerifyAdd, Draft
 * - フォーマット: FixedPrice, Auction
 * - サイト: US, UK, AU, DE
 * - 完全なItem Specifics対応
 * - HTML説明文
 * - ビジネスポリシーID
 * - カテゴリ別CSV分割（オプション）
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ============================================================
// 型定義
// ============================================================

type EbayAction = 'Add' | 'Revise' | 'Relist' | 'VerifyAdd' | 'Draft';
type EbayFormat = 'FixedPrice' | 'Auction';
type EbaySite = 'US' | 'UK' | 'AU' | 'DE';
type EbayAccount = 'MJT' | 'GREEN';
type EbayDuration = 'GTC' | '1' | '3' | '5' | '7' | '10' | '30';

interface ExportOptions {
  action: EbayAction;
  format: EbayFormat;
  site: EbaySite;
  account: EbayAccount;
  duration: EbayDuration;
  includeItemSpecifics: boolean;
  includeHtml: boolean;
  includeBusinessPolicies: boolean;
  overrideQuantity: number | null;
  scheduleTime: string | null;
  groupByCategory: boolean;
  productIds: (number | string)[];
}

// ============================================================
// 定数
// ============================================================

const SITE_CONFIG: Record<EbaySite, { siteId: number; currency: string; country: string; location: string }> = {
  US: { siteId: 0, currency: 'USD', country: 'US', location: 'Japan' },
  UK: { siteId: 3, currency: 'GBP', country: 'GB', location: 'Japan' },
  AU: { siteId: 15, currency: 'AUD', country: 'AU', location: 'Japan' },
  DE: { siteId: 77, currency: 'EUR', country: 'DE', location: 'Japan' },
};

// 基本カラム（必須）
// ヘッダー行では「SiteID」はプレースホルダー - 実際のサイトIDに置換される
const BASE_COLUMNS = [
  'Action(SiteID=SITE_PLACEHOLDER)',
  'ItemID',
  'CustomLabel',
  '*Category',
  'StoreCategory',
  '*Title',
  'Subtitle',
  '*ConditionID',
  'ConditionDescription',
  '*C:Brand',
  'C:MPN',
  'C:Type',
  'C:Model',
  'C:Material',
  'C:Color',
  'C:Size',
  'C:Country/Region of Manufacture',
  'Product:UPC',
  'Product:EAN',
  'Product:ISBN',
  '*Format',
  '*Duration',
  '*StartPrice',
  'BuyItNowPrice',
  'ReservePrice',
  '*Quantity',
  '*Description',
  'PicURL',
  '*Location',
  '*Country',
  'ShippingType',
  'ShippingService-1:Option',
  'ShippingService-1:Cost',
  'ShippingService-2:Option',
  'ShippingService-2:Cost',
  '*DispatchTimeMax',
  '*ReturnsAcceptedOption',
  'ReturnsWithinOption',
  'RefundOption',
  'ShippingCostPaidByOption',
  'PaymentProfileName',
  'ShippingProfileName',
  'ReturnProfileName',
  'ScheduleTime',
  'BestOfferEnabled',
  'BestOfferAutoAcceptPrice',
  'MinimumBestOfferPrice',
];

// Condition IDマッピング
const CONDITION_MAP: Record<string, number> = {
  'new': 1000,
  'new_with_tags': 1000,
  'new_other': 1500,
  'new_with_defects': 1750,
  'manufacturer_refurbished': 2000,
  'certified_refurbished': 2000,
  'seller_refurbished': 2500,
  'like_new': 2750,
  'used': 3000,
  'very_good': 4000,
  'good': 5000,
  'acceptable': 6000,
  'for_parts': 7000,
};

// ============================================================
// ユーティリティ関数
// ============================================================

function escapeCSV(value: any): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // カンマ、改行、ダブルクォートを含む場合はダブルクォートで囲む
  if (str.includes(',') || str.includes('\n') || str.includes('\r') || str.includes('"')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function formatPrice(price: number | null | undefined): string {
  if (!price || price <= 0) return '';
  return price.toFixed(2);
}

function formatImages(images: string[] | string | null | undefined, maxImages = 12): string {
  if (!images) return '';
  const imgArray = Array.isArray(images) ? images : [images];
  return imgArray.slice(0, maxImages).join('|');
}

function truncateTitle(title: string | null | undefined, maxLength = 80): string {
  if (!title) return '';
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

function getConditionId(condition: string | null | undefined): number {
  if (!condition) return 1000; // デフォルト: New
  const normalized = condition.toLowerCase().replace(/\s+/g, '_');
  return CONDITION_MAP[normalized] || 1000;
}

function formatScheduleTime(dateStr: string | null): string {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    // YYYY-MM-DD HH:MM:SS 形式
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  } catch {
    return '';
  }
}

function cleanHtml(html: string | null | undefined): string {
  if (!html) return '';
  // 最小限のクリーンアップ（改行をBRに変換など）
  return html
    .replace(/\r\n/g, '\n')
    .replace(/\n\n+/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

// ============================================================
// メイン処理
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const options: ExportOptions = body;

    if (!options.productIds || options.productIds.length === 0) {
      return NextResponse.json({ success: false, error: '商品IDが指定されていません' }, { status: 400 });
    }

    // Supabaseクライアント
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 商品データ取得
    const { data: products, error: fetchError } = await supabase
      .from('products_master')
      .select('*')
      .in('id', options.productIds);

    if (fetchError) {
      console.error('[eBay CSV] 商品取得エラー:', fetchError);
      return NextResponse.json({ success: false, error: '商品データの取得に失敗しました' }, { status: 500 });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ success: false, error: '商品が見つかりません' }, { status: 404 });
    }

    // サイト設定
    const siteConfig = SITE_CONFIG[options.site];
    const siteId = siteConfig.siteId;

    // Item Specifics収集（全商品から）
    const allItemSpecifics = new Set<string>();
    if (options.includeItemSpecifics) {
      for (const product of products) {
        const specifics = product.item_specifics || product.listing_data?.item_specifics || {};
        Object.keys(specifics).forEach(key => allItemSpecifics.add(key));
      }
    }

    // カラムヘッダー生成
    const columns = [...BASE_COLUMNS];
    
    // 動的Item Specificsカラム追加
    const itemSpecificColumns = Array.from(allItemSpecifics)
      .filter(key => !['Brand', 'MPN', 'Type', 'Model', 'Material', 'Color', 'Size', 'Country/Region of Manufacture'].includes(key))
      .map(key => `C:${key}`);
    columns.push(...itemSpecificColumns);

    // CSV生成
    const rows: string[][] = [];
    
    // ヘッダー行 - SiteIDを実際の値に置換
    rows.push(columns.map(col => {
      let header = col.replace('*', '');
      // Action(SiteID=SITE_PLACEHOLDER) → Action(SiteID=0) 等に変換
      if (header.includes('SITE_PLACEHOLDER')) {
        header = header.replace('SITE_PLACEHOLDER', String(siteId));
      }
      return header;
    }));

    // データ行
    for (const product of products) {
      const row: string[] = [];
      const listingData = product.listing_data || {};
      const itemSpecifics = product.item_specifics || listingData.item_specifics || {};

      for (const col of columns) {
        const cleanCol = col.replace('*', '');
        let value = '';

        switch (cleanCol) {
          case `Action(SiteID=SITE_PLACEHOLDER)`:
            value = `${options.action}(SiteID=${siteId})`;
            break;
          
          case 'ItemID':
            value = product.item_id || product.ebay_item_id || listingData.item_id || '';
            break;
          
          case 'CustomLabel':
            // SKUはそのまま使用（既にアカウント情報が含まれている）
            // パターン: INV-ebay-mjt-{itemId}, INV-ebay-green-{itemId}, YAH-{id}, ITEM-{id}
            value = product.sku || `ITEM-${product.id}`;
            break;
          
          case 'Category':
            value = product.category_id || product.ebay_category_id || listingData.category_id || '';
            break;
          
          case 'StoreCategory':
            value = listingData.store_category_id || '';
            break;
          
          case 'Title':
            value = truncateTitle(product.english_title || product.title_en || product.title);
            break;
          
          case 'Subtitle':
            value = listingData.subtitle || '';
            break;
          
          case 'ConditionID':
            value = String(getConditionId(product.condition || listingData.condition));
            break;
          
          case 'ConditionDescription':
            value = product.condition_description || listingData.condition_description || '';
            break;
          
          case 'C:Brand':
            // Brand が無い場合は Manufacturer から取得（Trading Cards等）
            value = itemSpecifics.Brand || itemSpecifics.Manufacturer || product.brand || 'Unbranded';
            break;
          
          case 'C:MPN':
            value = itemSpecifics.MPN || product.mpn || 'Does Not Apply';
            break;
          
          case 'C:Type':
            // Type が無い場合は Game / Card Type から取得（Trading Cards等）
            // product_typeがstock/dropshipの場合は除外
            let typeValue = itemSpecifics.Type || itemSpecifics.Game || itemSpecifics['Card Type'] || product.product_type || '';
            value = (typeValue === 'stock' || typeValue === 'dropship') ? '' : typeValue;
            break;
          
          case 'C:Model':
            value = itemSpecifics.Model || product.model || '';
            break;
          
          case 'C:Material':
            value = itemSpecifics.Material || product.material || '';
            break;
          
          case 'C:Color':
            value = itemSpecifics.Color || product.color || '';
            break;
          
          case 'C:Size':
            value = itemSpecifics.Size || product.size || '';
            break;
          
          case 'C:Country/Region of Manufacture':
            value = itemSpecifics['Country/Region of Manufacture'] || product.origin_country || 'Japan';
            break;
          
          case 'Product:UPC':
            value = product.upc || 'Does not apply';
            break;
          
          case 'Product:EAN':
            value = product.ean || '';
            break;
          
          case 'Product:ISBN':
            value = product.isbn || '';
            break;
          
          case 'Format':
            value = options.format === 'Auction' ? 'Auction' : 'FixedPrice';
            break;
          
          case 'Duration':
            value = options.duration;
            break;
          
          case 'StartPrice':
            // 価格の優先順位:
            // 1. listing_data内のサイト別価格
            // 2. recommended_price_usd / ddp_price_usd / ddu_price_usd
            // 3. listing_price
            // 4. price_jpyから変換
            let priceValue: number | null = null;
            
            // 1. listing_data内のサイト別価格
            if (options.site === 'US') {
              priceValue = listingData.price_usd || listingData.start_price;
            } else if (options.site === 'UK') {
              priceValue = listingData.price_gbp;
            } else if (options.site === 'AU') {
              priceValue = listingData.price_aud;
            } else if (options.site === 'DE') {
              priceValue = listingData.price_eur;
            }
            
            // 2. products_masterの価格カラム（USD系）
            if (!priceValue || priceValue <= 0) {
              // 優先順位: recommended_price_usd > ddp_price_usd > ddu_price_usd > listing_price
              priceValue = product.recommended_price_usd || 
                           product.ddp_price_usd || 
                           product.ddu_price_usd || 
                           product.listing_price;
            }
            
            // 3. USD以外のサイトの場合は為替変換（簡易レート）
            if (priceValue && priceValue > 0 && options.site !== 'US') {
              // USDから他通貨への簡易変換
              const conversionRates: Record<string, number> = {
                'UK': 0.79,   // USD -> GBP
                'AU': 1.53,   // USD -> AUD
                'DE': 0.92,   // USD -> EUR
              };
              const rate = conversionRates[options.site] || 1;
              priceValue = Math.round(priceValue * rate * 100) / 100;
            }
            
            // 4. フォールバック: price_jpyから変換
            if ((!priceValue || priceValue <= 0) && product.price_jpy) {
              // JPYから各通貨への変換レート
              const jpyRates: Record<string, number> = {
                'US': 150,   // JPY -> USD
                'UK': 190,   // JPY -> GBP
                'AU': 98,    // JPY -> AUD
                'DE': 163,   // JPY -> EUR
              };
              const rate = jpyRates[options.site] || 150;
              priceValue = Math.round((product.price_jpy / rate) * 100) / 100;
            }
            
            // 価格がない場合は警告ログ
            if (!priceValue || priceValue <= 0) {
              console.warn(`[eBay CSV] 価格が設定されていません: SKU=${product.sku}, ID=${product.id}`);
              console.warn(`[eBay CSV] recommended_price_usd=${product.recommended_price_usd}, ddp_price_usd=${product.ddp_price_usd}, price_jpy=${product.price_jpy}`);
            }
            
            value = formatPrice(priceValue);
            break;
          
          case 'BuyItNowPrice':
            // オークションの場合のみ
            if (options.format === 'Auction') {
              value = formatPrice(listingData.buy_it_now_price);
            }
            break;
          
          case 'ReservePrice':
            if (options.format === 'Auction') {
              value = formatPrice(listingData.reserve_price);
            }
            break;
          
          case 'Quantity':
            value = String(options.overrideQuantity || product.quantity || product.current_stock || 1);
            break;
          
          case 'Description':
            let descValue = '';
            if (options.includeHtml) {
              descValue = product.html_content || listingData.description || product.description_en || product.description || '';
            } else {
              descValue = product.description_en || product.description || '';
            }
            // 説明文が空の場合はタイトルから自動生成
            if (!descValue) {
              const title = product.english_title || product.title_en || product.title || '';
              const condition = product.condition || 'New';
              descValue = `<p><strong>${title}</strong></p><p>Condition: ${condition}</p><p>Ships from Japan with tracking.</p>`;
            }
            value = descValue;
            break;
          
          case 'PicURL':
            const images = product.gallery_images || product.images || [];
            const primaryImage = product.primary_image_url;
            const allImages = primaryImage ? [primaryImage, ...images.filter((i: string) => i !== primaryImage)] : images;
            value = formatImages(allImages);
            break;
          
          case 'Location':
            value = siteConfig.location;
            break;
          
          case 'Country':
            // 出荷元の国コードを設定（Japanから出荷）
            value = 'JP';
            break;
          
          case 'ShippingType':
            value = listingData.shipping_type || 'Flat';
            break;
          
          case 'ShippingService-1:Option':
            value = listingData.shipping_service_1 || 'EconomyShippingFromOutsideUS';
            break;
          
          case 'ShippingService-1:Cost':
            value = formatPrice(listingData.shipping_cost_1 || 0);
            break;
          
          case 'ShippingService-2:Option':
            value = listingData.shipping_service_2 || '';
            break;
          
          case 'ShippingService-2:Cost':
            value = formatPrice(listingData.shipping_cost_2);
            break;
          
          case 'DispatchTimeMax':
            value = String(listingData.dispatch_time_max || 3);
            break;
          
          case 'ReturnsAcceptedOption':
            value = listingData.returns_accepted || 'ReturnsAccepted';
            break;
          
          case 'ReturnsWithinOption':
            value = listingData.returns_within || 'Days_30';
            break;
          
          case 'RefundOption':
            value = listingData.refund_option || 'MoneyBack';
            break;
          
          case 'ShippingCostPaidByOption':
            value = listingData.return_shipping_paid_by || 'Buyer';
            break;
          
          case 'PaymentProfileName':
            if (options.includeBusinessPolicies) {
              value = listingData.payment_profile_name || listingData.payment_policy_id || '';
            }
            break;
          
          case 'ShippingProfileName':
            if (options.includeBusinessPolicies) {
              value = listingData.shipping_profile_name || listingData.shipping_policy_id || '';
            }
            break;
          
          case 'ReturnProfileName':
            if (options.includeBusinessPolicies) {
              value = listingData.return_profile_name || listingData.return_policy_id || '';
            }
            break;
          
          case 'ScheduleTime':
            value = formatScheduleTime(options.scheduleTime);
            break;
          
          case 'BestOfferEnabled':
            value = listingData.best_offer_enabled ? '1' : '';
            break;
          
          case 'BestOfferAutoAcceptPrice':
            value = formatPrice(listingData.best_offer_auto_accept);
            break;
          
          case 'MinimumBestOfferPrice':
            value = formatPrice(listingData.minimum_best_offer);
            break;
          
          default:
            // 動的Item Specifics
            if (cleanCol.startsWith('C:')) {
              const specKey = cleanCol.substring(2);
              value = itemSpecifics[specKey] || '';
            }
            break;
        }

        row.push(escapeCSV(value));
      }

      rows.push(row);
    }

    // CSV文字列生成
    const csvContent = rows.map(row => row.join(',')).join('\r\n');
    
    // eBay File ExchangeはBOMなしを推奨
    // BOMありは古いシステムでヘッダー認識エラーの原因になる
    const finalCsv = csvContent;

    // ファイル名生成
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `ebay_file_exchange_${options.account}_${options.site}_${options.action}_${dateStr}.csv`;

    // レスポンス
    return new NextResponse(finalCsv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('[eBay CSV] エラー:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'CSVの生成に失敗しました' },
      { status: 500 }
    );
  }
}

// GET: 空のテンプレートCSVをダウンロード
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const site = (searchParams.get('site') || 'US') as EbaySite;
  const siteConfig = SITE_CONFIG[site] || SITE_CONFIG.US;
  const columns = BASE_COLUMNS.map(col => {
    let header = col.replace('*', '');
    if (header.includes('SITE_PLACEHOLDER')) {
      header = header.replace('SITE_PLACEHOLDER', String(siteConfig.siteId));
    }
    return header;
  });
  const csvContent = columns.join(',');
  
  // BOMなし（eBay File Exchange推奨）
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ebay_template_${site}.csv"`,
    },
  });
}
