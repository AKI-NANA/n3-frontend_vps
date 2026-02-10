/**
 * Qoo10 Domestic Shipping Rates Data (2024)
 * Shipping rates for Yamato, Japan Post, and Sagawa from Kanto region
 */

import type {
  DomesticCarrier,
  ShippingRegion,
  ShippingSize,
  ShippingRatesByRegion,
} from '@/types/qoo10';

// =============================================================================
// Yamato Transport Rates (ヤマト運輸 2024年版・関東発送基準)
// =============================================================================

export const YAMATO_TAKKYUBIN_RATES: Record<string, ShippingRatesByRegion> = {
  '60': {  // 60サイズ（2kgまで）
    kanto: 930, shinetsu: 930, hokuriku: 930,
    tokai: 930, kinki: 1040, chugoku: 1150,
    shikoku: 1150, kyushu: 1150, hokkaido: 1370, okinawa: 1430
  },
  '80': {  // 80サイズ（5kgまで）
    kanto: 1150, shinetsu: 1150, hokuriku: 1150,
    tokai: 1150, kinki: 1260, chugoku: 1370,
    shikoku: 1370, kyushu: 1480, hokkaido: 1590, okinawa: 1650
  },
  '100': { // 100サイズ（10kgまで）
    kanto: 1390, shinetsu: 1390, hokuriku: 1390,
    tokai: 1390, kinki: 1500, chugoku: 1610,
    shikoku: 1610, kyushu: 1720, hokkaido: 1830, okinawa: 2070
  },
  '120': { // 120サイズ（15kgまで）
    kanto: 1610, shinetsu: 1610, hokuriku: 1610,
    tokai: 1610, kinki: 1720, chugoku: 1830,
    shikoku: 1830, kyushu: 1940, hokkaido: 2050, okinawa: 2510
  },
  '140': { // 140サイズ（20kgまで）
    kanto: 1850, shinetsu: 1850, hokuriku: 1850,
    tokai: 1850, kinki: 1960, chugoku: 2070,
    shikoku: 2070, kyushu: 2180, hokkaido: 2290, okinawa: 2950
  },
  '160': { // 160サイズ（25kgまで）
    kanto: 2070, shinetsu: 2070, hokuriku: 2070,
    tokai: 2070, kinki: 2180, chugoku: 2290,
    shikoku: 2290, kyushu: 2400, hokkaido: 2510, okinawa: 3390
  }
};

// ネコポス（A4サイズ、厚さ3cm、1kg以内）- 全国一律
export const NEKOPOS_RATE = 385;

// 宅急便コンパクト
export const YAMATO_COMPACT_RATES: ShippingRatesByRegion = {
  kanto: 690, shinetsu: 690, hokuriku: 690,
  tokai: 690, kinki: 800, chugoku: 910,
  shikoku: 910, kyushu: 910, hokkaido: 1130, okinawa: 1130
};

// =============================================================================
// Japan Post Rates (日本郵便 2024年版・関東発送基準)
// =============================================================================

export const YUPACK_RATES: Record<string, ShippingRatesByRegion> = {
  '60': {
    kanto: 870, shinetsu: 870, hokuriku: 920,
    tokai: 920, kinki: 970, chugoku: 1100,
    shikoku: 1100, kyushu: 1100, hokkaido: 1300, okinawa: 1350
  },
  '80': {
    kanto: 1100, shinetsu: 1100, hokuriku: 1140,
    tokai: 1140, kinki: 1200, chugoku: 1310,
    shikoku: 1310, kyushu: 1310, hokkaido: 1530, okinawa: 1560
  },
  '100': {
    kanto: 1330, shinetsu: 1330, hokuriku: 1390,
    tokai: 1390, kinki: 1440, chugoku: 1560,
    shikoku: 1560, kyushu: 1560, hokkaido: 1760, okinawa: 1970
  },
  '120': {
    kanto: 1590, shinetsu: 1590, hokuriku: 1640,
    tokai: 1640, kinki: 1690, chugoku: 1800,
    shikoku: 1800, kyushu: 1800, hokkaido: 2010, okinawa: 2410
  },
  '140': {
    kanto: 1830, shinetsu: 1830, hokuriku: 1890,
    tokai: 1890, kinki: 1950, chugoku: 2060,
    shikoku: 2060, kyushu: 2060, hokkaido: 2260, okinawa: 2840
  },
  '160': {
    kanto: 2060, shinetsu: 2060, hokuriku: 2130,
    tokai: 2130, kinki: 2190, chugoku: 2310,
    shikoku: 2310, kyushu: 2310, hokkaido: 2500, okinawa: 3280
  },
  '170': {
    kanto: 2410, shinetsu: 2410, hokuriku: 2480,
    tokai: 2480, kinki: 2540, chugoku: 2660,
    shikoku: 2660, kyushu: 2660, hokkaido: 2850, okinawa: 3780
  }
};

// ゆうパケット（厚さ別料金）
export const YUPACKET_RATES: Record<string, number> = {
  '1cm': 250,   // 厚さ1cm以内
  '2cm': 310,   // 厚さ2cm以内
  '3cm': 360    // 厚さ3cm以内
};

// クリックポスト（全国一律、3cm、1kg以内）
export const CLICK_POST_RATE = 185;

// レターパック
export const LETTERPACK_RATES = {
  plus: 520,    // レターパックプラス（4kg、厚さ制限なし）
  light: 370    // レターパックライト（4kg、厚さ3cm）
};

// =============================================================================
// Shipping Service Definitions
// =============================================================================

export interface ShippingService {
  id: string;
  carrier: DomesticCarrier;
  name: string;
  nameJa: string;
  sizeCode: ShippingSize;
  maxWeightG: number;
  maxLengthCm?: number;
  maxWidthCm?: number;
  maxHeightCm?: number;
  maxTotalCm?: number;
  isFlat: boolean;  // flat rate nationwide
  flatRate?: number;
  tracking: boolean;
  compensation: boolean;
  description: string;
}

export const SHIPPING_SERVICES: ShippingService[] = [
  // Yamato services
  {
    id: 'yamato-nekopos',
    carrier: 'yamato',
    name: 'NekoPos',
    nameJa: 'ネコポス',
    sizeCode: 'A4',
    maxWeightG: 1000,
    maxLengthCm: 31.2,
    maxWidthCm: 22.8,
    maxHeightCm: 3,
    isFlat: true,
    flatRate: NEKOPOS_RATE,
    tracking: true,
    compensation: false,
    description: 'A4サイズ、厚さ3cm以内、1kg以内。ポスト投函。'
  },
  {
    id: 'yamato-compact',
    carrier: 'yamato',
    name: 'Takkyubin Compact',
    nameJa: '宅急便コンパクト',
    sizeCode: 'compact',
    maxWeightG: 10000,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '専用BOX（70円別途）。手渡し配達。'
  },
  {
    id: 'yamato-60',
    carrier: 'yamato',
    name: 'Takkyubin 60',
    nameJa: '宅急便 60サイズ',
    sizeCode: '60',
    maxWeightG: 2000,
    maxTotalCm: 60,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計60cm以内、2kg以内'
  },
  {
    id: 'yamato-80',
    carrier: 'yamato',
    name: 'Takkyubin 80',
    nameJa: '宅急便 80サイズ',
    sizeCode: '80',
    maxWeightG: 5000,
    maxTotalCm: 80,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計80cm以内、5kg以内'
  },
  {
    id: 'yamato-100',
    carrier: 'yamato',
    name: 'Takkyubin 100',
    nameJa: '宅急便 100サイズ',
    sizeCode: '100',
    maxWeightG: 10000,
    maxTotalCm: 100,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計100cm以内、10kg以内'
  },
  {
    id: 'yamato-120',
    carrier: 'yamato',
    name: 'Takkyubin 120',
    nameJa: '宅急便 120サイズ',
    sizeCode: '120',
    maxWeightG: 15000,
    maxTotalCm: 120,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計120cm以内、15kg以内'
  },
  {
    id: 'yamato-140',
    carrier: 'yamato',
    name: 'Takkyubin 140',
    nameJa: '宅急便 140サイズ',
    sizeCode: '140',
    maxWeightG: 20000,
    maxTotalCm: 140,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計140cm以内、20kg以内'
  },
  {
    id: 'yamato-160',
    carrier: 'yamato',
    name: 'Takkyubin 160',
    nameJa: '宅急便 160サイズ',
    sizeCode: '160',
    maxWeightG: 25000,
    maxTotalCm: 160,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計160cm以内、25kg以内'
  },

  // Japan Post services
  {
    id: 'jp-clickpost',
    carrier: 'jp_post',
    name: 'Click Post',
    nameJa: 'クリックポスト',
    sizeCode: '3cm',
    maxWeightG: 1000,
    maxLengthCm: 34,
    maxWidthCm: 25,
    maxHeightCm: 3,
    isFlat: true,
    flatRate: CLICK_POST_RATE,
    tracking: true,
    compensation: false,
    description: 'A4サイズ、厚さ3cm以内、1kg以内。ポスト投函。最安！'
  },
  {
    id: 'jp-yupacket-1cm',
    carrier: 'jp_post',
    name: 'Yu-Packet 1cm',
    nameJa: 'ゆうパケット（1cm）',
    sizeCode: '1cm',
    maxWeightG: 1000,
    maxLengthCm: 34,
    maxWidthCm: 25,
    maxHeightCm: 1,
    isFlat: true,
    flatRate: YUPACKET_RATES['1cm'],
    tracking: true,
    compensation: false,
    description: 'A4サイズ、厚さ1cm以内'
  },
  {
    id: 'jp-yupacket-2cm',
    carrier: 'jp_post',
    name: 'Yu-Packet 2cm',
    nameJa: 'ゆうパケット（2cm）',
    sizeCode: '2cm',
    maxWeightG: 1000,
    maxLengthCm: 34,
    maxWidthCm: 25,
    maxHeightCm: 2,
    isFlat: true,
    flatRate: YUPACKET_RATES['2cm'],
    tracking: true,
    compensation: false,
    description: 'A4サイズ、厚さ2cm以内'
  },
  {
    id: 'jp-yupacket-3cm',
    carrier: 'jp_post',
    name: 'Yu-Packet 3cm',
    nameJa: 'ゆうパケット（3cm）',
    sizeCode: '3cm',
    maxWeightG: 1000,
    maxLengthCm: 34,
    maxWidthCm: 25,
    maxHeightCm: 3,
    isFlat: true,
    flatRate: YUPACKET_RATES['3cm'],
    tracking: true,
    compensation: false,
    description: 'A4サイズ、厚さ3cm以内'
  },
  {
    id: 'jp-letterpack-light',
    carrier: 'jp_post',
    name: 'Letter Pack Light',
    nameJa: 'レターパックライト',
    sizeCode: '3cm',
    maxWeightG: 4000,
    maxLengthCm: 34,
    maxWidthCm: 24.8,
    maxHeightCm: 3,
    isFlat: true,
    flatRate: LETTERPACK_RATES.light,
    tracking: true,
    compensation: false,
    description: '専用封筒、4kg以内、厚さ3cm以内。ポスト投函。'
  },
  {
    id: 'jp-letterpack-plus',
    carrier: 'jp_post',
    name: 'Letter Pack Plus',
    nameJa: 'レターパックプラス',
    sizeCode: '4kg',
    maxWeightG: 4000,
    maxLengthCm: 34,
    maxWidthCm: 24.8,
    isFlat: true,
    flatRate: LETTERPACK_RATES.plus,
    tracking: true,
    compensation: false,
    description: '専用封筒、4kg以内、厚さ制限なし。対面配達。'
  },
  {
    id: 'jp-yupack-60',
    carrier: 'jp_post',
    name: 'Yu-Pack 60',
    nameJa: 'ゆうパック 60サイズ',
    sizeCode: '60',
    maxWeightG: 25000,
    maxTotalCm: 60,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計60cm以内、25kg以内'
  },
  {
    id: 'jp-yupack-80',
    carrier: 'jp_post',
    name: 'Yu-Pack 80',
    nameJa: 'ゆうパック 80サイズ',
    sizeCode: '80',
    maxWeightG: 25000,
    maxTotalCm: 80,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計80cm以内、25kg以内'
  },
  {
    id: 'jp-yupack-100',
    carrier: 'jp_post',
    name: 'Yu-Pack 100',
    nameJa: 'ゆうパック 100サイズ',
    sizeCode: '100',
    maxWeightG: 25000,
    maxTotalCm: 100,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計100cm以内、25kg以内'
  },
  {
    id: 'jp-yupack-120',
    carrier: 'jp_post',
    name: 'Yu-Pack 120',
    nameJa: 'ゆうパック 120サイズ',
    sizeCode: '120',
    maxWeightG: 25000,
    maxTotalCm: 120,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計120cm以内、25kg以内'
  },
  {
    id: 'jp-yupack-140',
    carrier: 'jp_post',
    name: 'Yu-Pack 140',
    nameJa: 'ゆうパック 140サイズ',
    sizeCode: '140',
    maxWeightG: 25000,
    maxTotalCm: 140,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計140cm以内、25kg以内'
  },
  {
    id: 'jp-yupack-160',
    carrier: 'jp_post',
    name: 'Yu-Pack 160',
    nameJa: 'ゆうパック 160サイズ',
    sizeCode: '160',
    maxWeightG: 25000,
    maxTotalCm: 160,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計160cm以内、25kg以内'
  },
  {
    id: 'jp-yupack-170',
    carrier: 'jp_post',
    name: 'Yu-Pack 170',
    nameJa: 'ゆうパック 170サイズ',
    sizeCode: '170',
    maxWeightG: 25000,
    maxTotalCm: 170,
    isFlat: false,
    tracking: true,
    compensation: true,
    description: '3辺合計170cm以内、25kg以内'
  }
];

// =============================================================================
// Region Display Names
// =============================================================================

export const REGION_DISPLAY_NAMES: Record<ShippingRegion, string> = {
  kanto: '関東',
  shinetsu: '信越',
  hokuriku: '北陸',
  tokai: '東海',
  kinki: '近畿',
  chugoku: '中国',
  shikoku: '四国',
  kyushu: '九州',
  hokkaido: '北海道',
  okinawa: '沖縄'
};

export const CARRIER_DISPLAY_NAMES: Record<DomesticCarrier, string> = {
  yamato: 'ヤマト運輸',
  jp_post: '日本郵便',
  sagawa: '佐川急便'
};

// =============================================================================
// Shipping Rate Calculator Functions
// =============================================================================

/**
 * Get shipping rate for a specific carrier, size, and region
 */
export function getShippingRate(
  carrier: DomesticCarrier,
  sizeCode: ShippingSize | string,
  region: ShippingRegion = 'kanto'
): number {
  // Handle flat rate services
  if (carrier === 'yamato' && sizeCode === 'A4') {
    return NEKOPOS_RATE;
  }
  if (carrier === 'jp_post') {
    if (sizeCode === '1cm') return YUPACKET_RATES['1cm'];
    if (sizeCode === '2cm') return YUPACKET_RATES['2cm'];
    if (sizeCode === '3cm') {
      // Could be Yu-Packet or Click Post - return Click Post as it's cheaper
      return CLICK_POST_RATE;
    }
    if (sizeCode === '4kg') return LETTERPACK_RATES.plus;
  }

  // Handle variable rate services
  if (carrier === 'yamato') {
    if (sizeCode === 'compact') {
      return YAMATO_COMPACT_RATES[region] || YAMATO_COMPACT_RATES.kanto;
    }
    const rates = YAMATO_TAKKYUBIN_RATES[sizeCode];
    if (rates) {
      return rates[region] || rates.kanto;
    }
  }

  if (carrier === 'jp_post') {
    const rates = YUPACK_RATES[sizeCode];
    if (rates) {
      return rates[region] || rates.kanto;
    }
  }

  // Default fallback
  return 0;
}

/**
 * Get all shipping rates for a size code across all regions
 */
export function getShippingRatesByRegion(
  carrier: DomesticCarrier,
  sizeCode: ShippingSize | string
): ShippingRatesByRegion | null {
  if (carrier === 'yamato') {
    if (sizeCode === 'compact') return YAMATO_COMPACT_RATES;
    return YAMATO_TAKKYUBIN_RATES[sizeCode] || null;
  }
  if (carrier === 'jp_post') {
    return YUPACK_RATES[sizeCode] || null;
  }
  return null;
}

/**
 * Get available shipping services for a carrier
 */
export function getServicesForCarrier(carrier: DomesticCarrier): ShippingService[] {
  return SHIPPING_SERVICES.filter(s => s.carrier === carrier);
}

/**
 * Find the cheapest shipping option for given weight and dimensions
 */
export function findCheapestShipping(
  weightG: number,
  lengthCm?: number,
  widthCm?: number,
  heightCm?: number,
  region: ShippingRegion = 'kanto'
): { service: ShippingService; rate: number } | null {
  const totalCm = (lengthCm || 0) + (widthCm || 0) + (heightCm || 0);
  const maxDim = Math.max(lengthCm || 0, widthCm || 0, heightCm || 0);

  const eligibleServices = SHIPPING_SERVICES.filter(service => {
    // Check weight
    if (weightG > service.maxWeightG) return false;

    // Check dimensions for size-based services
    if (service.maxTotalCm && totalCm > service.maxTotalCm) return false;

    // Check individual dimensions for flat services
    if (service.maxHeightCm && heightCm && heightCm > service.maxHeightCm) return false;
    if (service.maxLengthCm && lengthCm && lengthCm > service.maxLengthCm) return false;
    if (service.maxWidthCm && widthCm && widthCm > service.maxWidthCm) return false;

    return true;
  });

  if (eligibleServices.length === 0) return null;

  let cheapest: { service: ShippingService; rate: number } | null = null;

  for (const service of eligibleServices) {
    const rate = service.isFlat && service.flatRate
      ? service.flatRate
      : getShippingRate(service.carrier, service.sizeCode, region);

    if (!cheapest || rate < cheapest.rate) {
      cheapest = { service, rate };
    }
  }

  return cheapest;
}

/**
 * Calculate average shipping rate across all regions
 */
export function calculateAverageShippingRate(
  carrier: DomesticCarrier,
  sizeCode: ShippingSize | string
): number {
  const rates = getShippingRatesByRegion(carrier, sizeCode);
  if (!rates) return 0;

  const values = Object.values(rates);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
