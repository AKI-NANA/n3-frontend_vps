// lib/product/mismatch-detector.ts
/**
 * 不一致（Mismatch）自動検知システム
 * 
 * 💡 目的:
 * - タイトルとデータの不一致を検出
 * - 人間の判断ミスを防ぐ
 */

// ============================================================
// 型定義
// ============================================================

export type MismatchSeverity = 'critical' | 'warning' | 'info';

export interface MismatchDetection {
  type: string;
  severity: MismatchSeverity;
  field: string;
  message: string;
  suggestion?: string;
  autoFixable: boolean;
}

// ============================================================
// 不一致検出ルール
// ============================================================

interface DetectionRule {
  id: string;
  name: string;
  check: (product: any) => MismatchDetection | null;
}

const DETECTION_RULES: DetectionRule[] = [
  // タイトルに「Foil」があるが、Item Specificsにない
  {
    id: 'foil_mismatch',
    name: 'Foil不一致',
    check: (product) => {
      const title = (product.english_title || product.title || '').toLowerCase();
      const itemSpecs = product.listing_data?.item_specifics || {};
      
      if (title.includes('foil') && !itemSpecs.Finish?.toLowerCase().includes('foil')) {
        return {
          type: 'foil_mismatch',
          severity: 'warning',
          field: 'item_specifics.Finish',
          message: 'タイトルに「Foil」がありますが、Item SpecificsのFinishが「Foil」ではありません',
          suggestion: 'Item SpecificsのFinishを「Foil」に設定してください',
          autoFixable: true,
        };
      }
      return null;
    },
  },
  
  // タイトルに「Japanese」があるが、Languageが「English」
  {
    id: 'language_mismatch',
    name: '言語不一致',
    check: (product) => {
      const title = (product.english_title || product.title || '').toLowerCase();
      const itemSpecs = product.listing_data?.item_specifics || {};
      
      if (title.includes('japanese') && itemSpecs.Language?.toLowerCase() === 'english') {
        return {
          type: 'language_mismatch',
          severity: 'critical',
          field: 'item_specifics.Language',
          message: 'タイトルに「Japanese」がありますが、言語設定が「English」です',
          suggestion: 'Item SpecificsのLanguageを「Japanese」に修正してください',
          autoFixable: true,
        };
      }
      
      if (title.includes('english') && itemSpecs.Language?.toLowerCase() === 'japanese') {
        return {
          type: 'language_mismatch',
          severity: 'critical',
          field: 'item_specifics.Language',
          message: 'タイトルに「English」がありますが、言語設定が「Japanese」です',
          suggestion: 'Item SpecificsのLanguageを「English」に修正してください',
          autoFixable: true,
        };
      }
      
      return null;
    },
  },
  
  // タイトルにブランド名があるがVEROフラグがない
  {
    id: 'vero_brand_missing',
    name: 'VEROブランド未検出',
    check: (product) => {
      const title = (product.english_title || product.title || '').toLowerCase();
      const veroKeywords = ['pokemon', 'nintendo', 'disney', 'sanrio', 'bandai', 'marvel'];
      
      const foundBrand = veroKeywords.find(brand => title.includes(brand));
      
      if (foundBrand && !product.is_vero_brand) {
        return {
          type: 'vero_brand_missing',
          severity: 'warning',
          field: 'is_vero_brand',
          message: `タイトルに「${foundBrand}」がありますが、VEROブランドフラグが設定されていません`,
          suggestion: 'VEROブランドの可能性を確認してください',
          autoFixable: false,
        };
      }
      return null;
    },
  },
  
  // カテゴリとタイトルの不一致（カード vs スリーブ）
  {
    id: 'category_card_sleeve_mismatch',
    name: 'カテゴリ不一致（カードvsスリーブ）',
    check: (product) => {
      const title = (product.english_title || product.title || '').toLowerCase();
      const categoryId = product.ebay_category_id || product.listing_data?.ebay_category_id;
      
      // カードの特徴があるがスリーブカテゴリ
      const cardKeywords = ['foil', 'holo', 'rare', 'ultra rare', 'secret rare', 'full art'];
      const hasCardKeyword = cardKeywords.some(kw => title.includes(kw));
      
      if (hasCardKeyword && categoryId === '183473') {
        return {
          type: 'category_card_sleeve_mismatch',
          severity: 'critical',
          field: 'ebay_category_id',
          message: 'タイトルにカードの特徴がありますが、カテゴリが「スリーブ」です',
          suggestion: 'カテゴリを「CCG Individual Cards」(183454)に変更してください',
          autoFixable: true,
        };
      }
      return null;
    },
  },
  
  // 原産国とタイトルの不一致
  {
    id: 'origin_mismatch',
    name: '原産国不一致',
    check: (product) => {
      const title = (product.english_title || product.title || '').toLowerCase();
      const origin = (product.origin_country || '').toLowerCase();
      
      // タイトルに「Made in China」「Chinese」など
      if ((title.includes('chinese') || title.includes('china')) && origin === 'jp') {
        return {
          type: 'origin_mismatch',
          severity: 'warning',
          field: 'origin_country',
          message: 'タイトルに「China/Chinese」がありますが、原産国が「Japan」です',
          suggestion: '原産国を確認してください',
          autoFixable: false,
        };
      }
      
      return null;
    },
  },
  
  // 重量が異常
  {
    id: 'weight_anomaly',
    name: '重量異常',
    check: (product) => {
      const weightG = product.listing_data?.weight_g || product.weight_g;
      
      if (!weightG) {
        return {
          type: 'weight_missing',
          severity: 'warning',
          field: 'weight_g',
          message: '重量が設定されていません',
          suggestion: '重量を入力するか、AIで推定してください',
          autoFixable: false,
        };
      }
      
      // 異常に軽い（1g未満）
      if (weightG < 1) {
        return {
          type: 'weight_too_light',
          severity: 'critical',
          field: 'weight_g',
          message: `重量が${weightG}gと異常に軽いです`,
          suggestion: '重量を確認・修正してください',
          autoFixable: false,
        };
      }
      
      // 異常に重い（10kg超）
      if (weightG > 10000) {
        return {
          type: 'weight_too_heavy',
          severity: 'critical',
          field: 'weight_g',
          message: `重量が${weightG}g (${(weightG/1000).toFixed(1)}kg) と異常に重いです`,
          suggestion: '重量を確認・修正してください',
          autoFixable: false,
        };
      }
      
      return null;
    },
  },
  
  // 価格が異常
  {
    id: 'price_anomaly',
    name: '価格異常',
    check: (product) => {
      const priceUsd = product.listing_data?.ddp_price_usd || product.ddp_price_usd;
      
      if (!priceUsd || priceUsd <= 0) {
        return {
          type: 'price_missing',
          severity: 'critical',
          field: 'ddp_price_usd',
          message: '出品価格が設定されていません',
          suggestion: '価格計算を実行してください',
          autoFixable: false,
        };
      }
      
      // 異常に安い（$1未満）
      if (priceUsd < 1) {
        return {
          type: 'price_too_low',
          severity: 'critical',
          field: 'ddp_price_usd',
          message: `出品価格が$${priceUsd.toFixed(2)}と異常に安いです`,
          suggestion: '価格設定を確認してください',
          autoFixable: false,
        };
      }
      
      return null;
    },
  },
  
  // HTSコードがカテゴリと不一致
  {
    id: 'hts_category_mismatch',
    name: 'HTS-カテゴリ不一致',
    check: (product) => {
      const htsCode = product.hts_code;
      const categoryId = product.ebay_category_id || product.listing_data?.ebay_category_id;
      
      // カードカテゴリなのにHTSがアパレル
      if (categoryId === '183454' && htsCode?.startsWith('61')) {
        return {
          type: 'hts_category_mismatch',
          severity: 'critical',
          field: 'hts_code',
          message: 'カテゴリは「カード」ですが、HTSコードは「アパレル」です',
          suggestion: 'HTSコードを9504.40（トランプ）に修正してください',
          autoFixable: true,
        };
      }
      
      return null;
    },
  },
];

// ============================================================
// メイン検出関数
// ============================================================

/**
 * 商品の不一致を検出
 */
export function detectMismatches(product: any): MismatchDetection[] {
  const results: MismatchDetection[] = [];
  
  for (const rule of DETECTION_RULES) {
    const detection = rule.check(product);
    if (detection) {
      results.push(detection);
    }
  }
  
  // 重要度でソート（critical > warning > info）
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  results.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  return results;
}

/**
 * 致命的な不一致があるか判定
 */
export function hasCriticalMismatch(product: any): boolean {
  return detectMismatches(product).some(m => m.severity === 'critical');
}

/**
 * 不一致の数を取得
 */
export function countMismatches(product: any): { critical: number; warning: number; info: number } {
  const mismatches = detectMismatches(product);
  return {
    critical: mismatches.filter(m => m.severity === 'critical').length,
    warning: mismatches.filter(m => m.severity === 'warning').length,
    info: mismatches.filter(m => m.severity === 'info').length,
  };
}

/**
 * 自動修正可能な不一致を取得
 */
export function getAutoFixableMismatches(product: any): MismatchDetection[] {
  return detectMismatches(product).filter(m => m.autoFixable);
}
