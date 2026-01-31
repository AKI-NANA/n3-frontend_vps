/**
 * Yahoo Auction (ヤフオク) 型定義
 * 
 * オークタウンVer.1.19 CSVフォーマット準拠
 * 
 * @see オークタウン一括出品ガイド Ver.1.19
 */

// ============================================================
// 基本型
// ============================================================

/**
 * 会員種別（手数料率に影響）
 */
export type YahooAuctionMemberType = 'lyp_premium' | 'standard';

/**
 * 手数料率マッピング
 */
export const YAHOO_AUCTION_FEE_RATES: Record<YahooAuctionMemberType, number> = {
  lyp_premium: 0.088,  // LYPプレミアム会員: 8.8%
  standard: 0.10,      // 通常会員: 10%
};

/**
 * 出品形式
 */
export type ListingType = 'auction' | 'fixed';  // オークション形式 / フリマ形式（即決のみ）

/**
 * 商品の状態（オークタウン準拠）
 */
export type ItemCondition = 
  | '新品'
  | '未使用に近い'
  | '目立った傷や汚れなし'
  | 'やや傷や汚れあり'
  | '傷や汚れあり'
  | '全体的に状態が悪い'
  | 'ジャンク'
  | 'その他';

/**
 * 送料負担
 */
export type ShippingPayer = '落札者' | '出品者';

/**
 * 送料設定
 */
export type ShippingOption = 'はい' | 'いいえ' | '着払い';

/**
 * 開催期間（日数）
 */
export type AuctionDuration = 2 | 3 | 4 | 5 | 6 | 7;

/**
 * 終了時間（0-23時）
 */
export type EndHour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 
                      12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23;

/**
 * 配送サイズ（オークタウンVer.1.18で180/200追加）
 */
export type ShippingSize = 
  | '〜60cm' | '〜80cm' | '〜100cm' | '〜120cm' | '〜140cm' | '〜160cm' 
  | '〜170cm' | '〜180cm' | '〜200cm'
  | '宅急便〜60cm' | '宅急便〜80cm' | '宅急便〜100cm' | '宅急便〜120cm' 
  | '宅急便〜140cm' | '宅急便〜160cm';

/**
 * 配送重量
 */
export type ShippingWeight = 
  | '〜2kg' | '〜4kg' | '〜5kg' | '〜6kg' | '〜8kg' | '〜10kg'
  | '〜11kg' | '〜12kg' | '〜14kg' | '〜15kg' | '〜16kg' | '〜18kg'
  | '〜20kg' | '〜21kg' | '〜25kg' | '〜30kg' | '30kg〜';

/**
 * 発送までの日数
 */
export type ShippingDays = '1日〜2日' | '2日〜3日' | '3日〜7日';

/**
 * 自動値下げ率（%）
 */
export type AutoDiscountRate = 5 | 10 | 15 | 20 | 25 | 30;

/**
 * 自動再出品回数
 */
export type AutoRelistCount = 0 | 1 | 2 | 3;

// ============================================================
// 利益計算関連
// ============================================================

/**
 * 利益計算入力パラメータ
 */
export interface YahooAuctionProfitParams {
  /** 仕入れ価格（円） */
  costPrice: number;
  
  /** 目標回収率（%） 例: 30 = 30% = 損切り */
  targetRecoveryRate: number;
  
  /** 会員種別（手数料率に影響） */
  memberType: YahooAuctionMemberType;
  
  /** 送料（円） - 出品者負担の場合 */
  shippingCost: number;
  
  /** 梱包材費用（円） デフォルト: 100 */
  packagingCost?: number;
  
  /** 市場相場価格（円） - 警告判定用 */
  marketPrice?: number;
}

/**
 * 利益計算結果
 */
export interface YahooAuctionProfitResult {
  /** 最低出品価格（目標回収を達成するために必要な価格） */
  minimumSellingPrice: number;
  
  /** 手残り現金（売上 - 手数料 - 送料 - 梱包材） */
  netProceeds: number;
  
  /** 損失額（仕入れ価格 - 手残り） */
  lossAmount: number;
  
  /** 損益分岐点価格（仕入れ100%回収に必要な価格） */
  breakEvenPrice: number;
  
  /** 実際の回収率（%） */
  actualRecoveryRate: number;
  
  /** 黒字かどうか */
  isProfitable: boolean;
  
  /** 落札手数料（円） */
  fee: number;
  
  /** 手数料率（%） */
  feeRate: number;
  
  /** 警告メッセージ */
  warnings: string[];
  
  /** 市場相場との比較結果 */
  marketComparison?: {
    /** 相場価格 */
    marketPrice: number;
    /** 相場での手残り */
    marketNetProceeds: number;
    /** 相場での回収率 */
    marketRecoveryRate: number;
    /** 相場での出品は損か */
    isBelowMarket: boolean;
  };
}

/**
 * 価格シミュレーション入力
 */
export interface PriceSimulationParams {
  /** 仕入れ価格 */
  costPrice: number;
  /** 販売価格 */
  sellingPrice: number;
  /** 会員種別 */
  memberType: YahooAuctionMemberType;
  /** 送料 */
  shippingCost: number;
  /** 梱包材費用 */
  packagingCost?: number;
}

/**
 * 価格シミュレーション結果
 */
export interface PriceSimulationResult {
  /** 販売価格 */
  sellingPrice: number;
  /** 落札手数料 */
  fee: number;
  /** 手残り現金 */
  netProceeds: number;
  /** 利益（または損失） */
  profit: number;
  /** 利益率（%） */
  profitMargin: number;
  /** 回収率（%） */
  recoveryRate: number;
  /** 黒字かどうか */
  isProfitable: boolean;
}

// ============================================================
// タイトル最適化関連
// ============================================================

/**
 * タイトル生成入力パラメータ
 */
export interface TitleGeneratorParams {
  /** 商品名（日本語または英語） */
  productName: string;
  
  /** 商品の状態 */
  condition?: ItemCondition | string;
  
  /** 定価（円） */
  retailPrice?: number;
  
  /** 正規品フラグ */
  isAuthentic?: boolean;
  
  /** ブランド名 */
  brand?: string;
  
  /** 型番・モデル名 */
  modelNumber?: string;
  
  /** 送料無料フラグ */
  isFreeShipping?: boolean;
  
  /** 1円スタートフラグ */
  is1YenStart?: boolean;
  
  /** 終了時間（0-23） */
  endHour?: EndHour;
  
  /** 終了曜日（0=日, 1=月, ...） */
  endDayOfWeek?: number;
  
  /** 追加キーワード */
  additionalKeywords?: string[];
  
  /** 限定品フラグ */
  isLimitedEdition?: boolean;
  
  /** 未開封フラグ */
  isSealed?: boolean;
}

/**
 * タイトル生成結果
 */
export interface TitleGeneratorResult {
  /** 生成されたタイトル */
  title: string;
  
  /** 文字数（全角換算） */
  charCount: number;
  
  /** 最大文字数 */
  maxCharCount: number;
  
  /** 文字数制限内かどうか */
  isWithinLimit: boolean;
  
  /** 含まれるパワーワード */
  includedPowerWords: string[];
  
  /** 除外されたパワーワード（文字数制限で入らなかったもの） */
  excludedPowerWords: string[];
  
  /** 警告 */
  warnings: string[];
}

// ============================================================
// CSV生成関連（オークタウンフォーマット）
// ============================================================

/**
 * オークタウンCSV行データ
 */
export interface AuctownCSVRow {
  // === 必須フィールド ===
  /** カテゴリID */
  カテゴリ: string;
  /** タイトル（65文字以内） */
  タイトル: string;
  /** 説明（HTML可） */
  説明: string;
  /** 開始価格 */
  開始価格: number;
  /** 即決価格 */
  即決価格?: number;
  /** 個数（1-9） */
  個数: number;
  /** 開催期間（2-7日） */
  開催期間: AuctionDuration;
  /** 終了時間（0-23） */
  終了時間: EndHour;
  /** 商品発送元の都道府県 */
  商品発送元の都道府県: string;
  /** 送料負担 */
  送料負担: ShippingPayer;
  /** 商品の状態 */
  商品の状態: ItemCondition;
  /** 返品の可否 */
  返品の可否: '返品不可' | '返品可';
  /** 自動延長 */
  自動延長: 'はい' | 'いいえ';
  /** 早期終了 */
  早期終了: 'はい' | 'いいえ';
  
  // === 配送関連 ===
  /** 送料固定 */
  送料固定?: ShippingOption;
  /** 荷物の大きさ */
  荷物の大きさ?: ShippingSize;
  /** 荷物の重量 */
  荷物の重量?: ShippingWeight;
  /** 発送までの日数 */
  発送までの日数: ShippingDays;
  
  // === ヤフネコ!（クロネコ） ===
  ネコポス?: 'はい' | 'いいえ';
  宅急便コンパクト?: 'はい' | 'いいえ';
  宅急便?: 'はい' | 'いいえ';
  
  // === ゆうパック（おてがる版） ===
  ゆうパケット?: 'はい' | 'いいえ';
  ゆうパケットポストmini?: 'はい' | 'いいえ';  // Ver.1.19追加
  ゆうパケットプラス?: 'はい' | 'いいえ';      // Ver.1.19追加
  ゆうパック?: 'はい' | 'いいえ';
  
  // === オプション ===
  /** JANコード */
  JANコード?: string;
  /** 画像1-10 */
  画像1?: string;
  画像2?: string;
  画像3?: string;
  画像4?: string;
  画像5?: string;
  画像6?: string;
  画像7?: string;
  画像8?: string;
  画像9?: string;
  画像10?: string;
  /** 値下げ交渉（開始=即決の場合のみ） */
  値下げ交渉?: 'はい' | 'いいえ';
  /** 自動再出品 */
  自動再出品?: AutoRelistCount;
  /** 自動値下げ */
  自動値下げ?: 'はい' | 'いいえ';
  /** 自動値下げ価格率 */
  自動値下げ価格率?: AutoDiscountRate;
  /** 最低落札価格 */
  最低落札価格?: number;
  /** 海外発送 */
  海外発送?: 'はい' | 'いいえ';
  /** 商品の状態備考 */
  商品の状態備考?: string;
  /** 返品の可否備考 */
  返品の可否備考?: string;
}

/**
 * CSV生成オプション
 */
export interface CSVGeneratorOptions {
  /** 文字コード（デフォルト: Shift_JIS） */
  encoding?: 'Shift_JIS' | 'UTF-8';
  /** 改行コード（デフォルト: CRLF） */
  lineEnding?: 'CRLF' | 'LF';
  /** BOMを含めるか（UTF-8の場合） */
  includeBOM?: boolean;
}

// ============================================================
// 商品データ（N3システム連携用）
// ============================================================

/**
 * ヤフオク出品用商品データ
 */
export interface YahooAuctionProduct {
  /** 商品ID（products_master.id） */
  id: number;
  /** SKU */
  sku?: string;
  /** 商品名（英語） */
  titleEn?: string;
  /** 商品名（日本語） */
  titleJa?: string;
  /** 説明（日本語） */
  descriptionJa?: string;
  /** 仕入れ価格（円） */
  costPrice: number;
  /** 市場相場価格（円） */
  marketPrice?: number;
  /** 定価（円） */
  retailPrice?: number;
  /** 商品の状態 */
  condition?: ItemCondition | string;
  /** ブランド */
  brand?: string;
  /** 型番 */
  modelNumber?: string;
  /** 重量（g） */
  weightG?: number;
  /** サイズ（cm） */
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  /** 画像URL群 */
  images?: string[];
  /** ヤフオクカテゴリID */
  yahooAuctionCategoryId?: string;
  /** 正規品フラグ */
  isAuthentic?: boolean;
  /** 限定品フラグ */
  isLimitedEdition?: boolean;
  /** 未開封フラグ */
  isSealed?: boolean;
  /** JANコード */
  janCode?: string;
}

/**
 * ヤフオク出品設定
 */
export interface YahooAuctionListingConfig {
  /** 会員種別 */
  memberType: YahooAuctionMemberType;
  /** 出品形式 */
  listingType: ListingType;
  /** 開催期間 */
  duration: AuctionDuration;
  /** 終了時間 */
  endHour: EndHour;
  /** 送料負担 */
  shippingPayer: ShippingPayer;
  /** 発送元都道府県 */
  shippingFromPrefecture: string;
  /** 発送までの日数 */
  shippingDays: ShippingDays;
  /** 配送方法設定 */
  shippingMethods: {
    nekopos?: boolean;
    takkyubinCompact?: boolean;
    takkyubin?: boolean;
    yuPacket?: boolean;
    yuPacketPostMini?: boolean;
    yuPacketPlus?: boolean;
    yuPack?: boolean;
  };
  /** 返品可否 */
  acceptsReturns: boolean;
  /** 値下げ交渉可否（フリマ形式のみ） */
  acceptsNegotiation: boolean;
  /** 自動延長 */
  autoExtend: boolean;
  /** 早期終了 */
  earlyEnd: boolean;
  /** 自動再出品 */
  autoRelist: AutoRelistCount;
  /** 自動値下げ */
  autoDiscount: boolean;
  /** 自動値下げ率 */
  autoDiscountRate?: AutoDiscountRate;
}

/**
 * 一括出品リクエスト
 */
export interface BulkListingRequest {
  /** 商品群 */
  products: YahooAuctionProduct[];
  /** 出品設定 */
  config: YahooAuctionListingConfig;
  /** 目標回収率（%） */
  targetRecoveryRate: number;
}

/**
 * 一括出品結果
 */
export interface BulkListingResult {
  /** 成功件数 */
  successCount: number;
  /** 失敗件数 */
  errorCount: number;
  /** 各商品の計算結果 */
  items: Array<{
    productId: number;
    sku?: string;
    title: string;
    sellingPrice: number;
    netProceeds: number;
    recoveryRate: number;
    isProfitable: boolean;
    warnings: string[];
    csvRow?: AuctownCSVRow;
  }>;
  /** CSV生成用データ */
  csvData?: string;
}

// ============================================================
// 都道府県コード（オークタウン準拠）
// ============================================================

export const PREFECTURE_CODES: Record<string, number> = {
  '北海道': 1,
  '青森県': 2,
  '岩手県': 3,
  '宮城県': 4,
  '秋田県': 5,
  '山形県': 6,
  '福島県': 7,
  '茨城県': 8,
  '栃木県': 9,
  '群馬県': 10,
  '埼玉県': 11,
  '千葉県': 12,
  '東京都': 13,
  '神奈川県': 14,
  '新潟県': 15,
  '富山県': 16,
  '石川県': 17,
  '福井県': 18,
  '山梨県': 19,
  '長野県': 20,
  '岐阜県': 21,
  '静岡県': 22,
  '愛知県': 23,
  '三重県': 24,
  '滋賀県': 25,
  '京都府': 26,
  '大阪府': 27,
  '兵庫県': 28,
  '奈良県': 29,
  '和歌山県': 30,
  '鳥取県': 31,
  '島根県': 32,
  '岡山県': 33,
  '広島県': 34,
  '山口県': 35,
  '徳島県': 36,
  '香川県': 37,
  '愛媛県': 38,
  '高知県': 39,
  '福岡県': 40,
  '佐賀県': 41,
  '長崎県': 42,
  '熊本県': 43,
  '大分県': 44,
  '宮崎県': 45,
  '鹿児島県': 46,
  '沖縄県': 47,
};

export const PREFECTURES = Object.keys(PREFECTURE_CODES);

// ============================================================
// デフォルト値
// ============================================================

export const DEFAULT_LISTING_CONFIG: YahooAuctionListingConfig = {
  memberType: 'lyp_premium',
  listingType: 'fixed',
  duration: 7,
  endHour: 22,
  shippingPayer: '出品者',
  shippingFromPrefecture: '東京都',
  shippingDays: '2日〜3日',
  shippingMethods: {
    yuPack: true,
  },
  acceptsReturns: false,
  acceptsNegotiation: true,
  autoExtend: true,
  earlyEnd: true,
  autoRelist: 0,
  autoDiscount: false,
};

export const DEFAULT_PACKAGING_COST = 150;  // 梱包材費用デフォルト（実務ベース）
export const TITLE_MAX_LENGTH = 65;          // タイトル最大文字数（全角）

// ============================================================
// 利益率ベース計算（V2追加）
// ============================================================

/**
 * 利益率ベース計算入力パラメータ
 * 数式: 販売価格 = (仕入 + 送料 + 梱包費) ÷ (1 - 手数料率 - 利益率)
 */
export interface ProfitRateCalcParams {
  /** 仕入れ価格 */
  costPrice: number;
  /** 送料（出品者負担の場合） */
  shippingCost: number;
  /** 梱包材費 */
  packagingCost: number;
  /** 最低利益率（%） */
  minProfitRate: number;
  /** 会員種別 */
  memberType: YahooAuctionMemberType;
}

/**
 * 利益率ベース計算結果
 */
export interface ProfitRateCalcResult {
  /** 販売価格 */
  sellingPrice: number;
  /** 利益額 */
  profitAmount: number;
  /** 利益率（%） */
  profitRate: number;
  /** 手数料 */
  fee: number;
  /** 手残り */
  netProceeds: number;
  /** 計算式詳細 */
  breakdown: {
    costPrice: number;
    shippingCost: number;
    packagingCost: number;
    totalCost: number;
    feeRate: number;
    minProfitRate: number;
  };
}

/**
 * CSV生成設定（UI用）
 */
export interface YahooCsvExportSettings {
  /** 会員種別 */
  memberType: YahooAuctionMemberType;
  /** 最低利益率（%） */
  minProfitRate: number;
  /** 送料計算方式 */
  shippingCalcMethod: 'actual' | 'fixed';
  /** 固定送料額（fixed選択時） */
  fixedShippingCost?: number;
  /** 梱包材費 */
  packagingCost: number;
  /** 最低販売価格 */
  minSellingPrice?: number;
  /** 損切り許容 */
  allowLossCut: boolean;
}

/**
 * CSV生成設定デフォルト
 */
export const DEFAULT_CSV_EXPORT_SETTINGS: YahooCsvExportSettings = {
  memberType: 'lyp_premium',
  minProfitRate: 15,
  shippingCalcMethod: 'actual',
  packagingCost: 150,
  allowLossCut: false,
};

/**
 * CSV出力ログ（DB保存用）
 */
export interface YahooExportLog {
  id?: string;
  generated_at: string;
  product_count: number;
  total_estimated_profit: number;
  user_setting_snapshot: YahooCsvExportSettings;
  file_name: string;
  status: 'success' | 'partial' | 'failed';
  product_ids: number[];
  error_message?: string;
}
