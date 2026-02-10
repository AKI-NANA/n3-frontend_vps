/**
 * 統合プラットフォーム設定
 *
 * 新しいプラットフォームを追加する際は、ここに設定を追加するだけです。
 */

export interface PlatformConfig {
  id: string
  name: string
  displayName: string
  color: string
  icon: string
  authType: 'oauth2' | 'api-key' | 'manual'
  tokenLifetime: {
    access: number // 時間（時）
    refresh: number // 月
  }
  accounts: string[]
  features: {
    multiAccount: boolean
    autoRefresh: boolean
    manualToken: boolean
  }
  endpoints: {
    authorize?: string
    callback?: string
    tokens: string
    autoRefresh?: string
  }
  documentation?: string
  status: 'active' | 'beta' | 'planned'
}

export const PLATFORMS: Record<string, PlatformConfig> = {
  ebay: {
    id: 'ebay',
    name: 'ebay',
    displayName: 'eBay',
    color: 'blue',
    icon: '🏷️',
    authType: 'oauth2',
    tokenLifetime: {
      access: 2, // 2時間
      refresh: 18 // 18ヶ月
    },
    accounts: ['mjt', 'green'],
    features: {
      multiAccount: true,
      autoRefresh: true,
      manualToken: true
    },
    endpoints: {
      authorize: '/api/ebay/auth/authorize',
      callback: '/api/ebay/auth/callback',
      tokens: '/api/ebay/tokens',
      autoRefresh: '/api/ebay/tokens/auto-refresh'
    },
    documentation: '/dev-logs?search=ebay',
    status: 'active'
  },

  amazon: {
    id: 'amazon',
    name: 'amazon',
    displayName: 'Amazon SP-API',
    color: 'orange',
    icon: '📦',
    authType: 'oauth2',
    tokenLifetime: {
      access: 1, // 1時間
      refresh: 12 // 12ヶ月
    },
    accounts: ['us', 'jp', 'uk', 'de', 'ca', 'au'],
    features: {
      multiAccount: true,
      autoRefresh: true,
      manualToken: true
    },
    endpoints: {
      authorize: '/api/amazon/auth/authorize',
      callback: '/api/amazon/auth/callback',
      tokens: '/api/amazon/tokens',
      autoRefresh: '/api/amazon/tokens/auto-refresh'
    },
    documentation: '/settings/amazon',
    status: 'active' // ✅ 実装完了
  },

  shopee: {
    id: 'shopee',
    name: 'shopee',
    displayName: 'Shopee',
    color: 'red',
    icon: '🛍️',
    authType: 'oauth2',
    tokenLifetime: {
      access: 4, // 4時間
      refresh: 1 // 1ヶ月
    },
    accounts: ['sg', 'my', 'th', 'tw'],
    features: {
      multiAccount: true,
      autoRefresh: true,
      manualToken: false
    },
    endpoints: {
      authorize: '/api/shopee/auth/authorize',
      callback: '/api/shopee/auth/callback',
      tokens: '/api/shopee/tokens',
      autoRefresh: '/api/shopee/tokens/auto-refresh'
    },
    documentation: '/dev-logs?search=shopee',
    status: 'planned'
  },

  qoo10: {
    id: 'qoo10',
    name: 'qoo10',
    displayName: 'Qoo10',
    color: 'purple',
    icon: '🎁',
    authType: 'api-key',
    tokenLifetime: {
      access: 0, // API Key（期限なし）
      refresh: 0
    },
    accounts: ['jp', 'sg'],
    features: {
      multiAccount: true,
      autoRefresh: false,
      manualToken: true
    },
    endpoints: {
      tokens: '/api/qoo10/tokens'
    },
    documentation: '/dev-logs?search=qoo10',
    status: 'planned'
  },

  shopify: {
    id: 'shopify',
    name: 'shopify',
    displayName: 'Shopify',
    color: 'green',
    icon: '🏪',
    authType: 'oauth2',
    tokenLifetime: {
      access: 0, // 無期限（revoke可能）
      refresh: 0
    },
    accounts: ['store1', 'store2'],
    features: {
      multiAccount: true,
      autoRefresh: false,
      manualToken: false
    },
    endpoints: {
      authorize: '/api/shopify/auth/authorize',
      callback: '/api/shopify/auth/callback',
      tokens: '/api/shopify/tokens'
    },
    documentation: '/dev-logs?search=shopify',
    status: 'planned'
  },

  keepa: {
    id: 'keepa',
    name: 'keepa',
    displayName: 'Keepa',
    color: 'indigo',
    icon: '📊',
    authType: 'api-key',
    tokenLifetime: {
      access: 0, // API Key（期限なし）
      refresh: 0
    },
    accounts: ['main'],
    features: {
      multiAccount: false,
      autoRefresh: false,
      manualToken: true
    },
    endpoints: {
      tokens: '/api/keepa/tokens'
    },
    documentation: '/dev-logs?search=keepa',
    status: 'planned'
  }
}

/**
 * アクティブなプラットフォームのみを取得
 */
export function getActivePlatforms(): PlatformConfig[] {
  return Object.values(PLATFORMS).filter(p => p.status === 'active')
}

/**
 * 全プラットフォームを取得（ステータス順）
 */
export function getAllPlatforms(): PlatformConfig[] {
  const statusOrder = { active: 0, beta: 1, planned: 2 }
  return Object.values(PLATFORMS).sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  )
}

/**
 * プラットフォームIDから設定を取得
 */
export function getPlatformConfig(platformId: string): PlatformConfig | undefined {
  return PLATFORMS[platformId]
}

/**
 * プラットフォームの色クラスを取得
 */
export function getPlatformColorClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    orange: 'bg-orange-600 hover:bg-orange-700',
    red: 'bg-red-600 hover:bg-red-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
    green: 'bg-green-600 hover:bg-green-700',
    indigo: 'bg-indigo-600 hover:bg-indigo-700'
  }
  return colorMap[color] || 'bg-gray-600 hover:bg-gray-700'
}

/**
 * プラットフォームのバッジ色を取得
 */
export function getPlatformBadgeClass(color: string): string {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    green: 'bg-green-100 text-green-700',
    indigo: 'bg-indigo-100 text-indigo-700'
  }
  return colorMap[color] || 'bg-gray-100 text-gray-700'
}

/**
 * ステータスラベルを取得
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: '利用可能',
    beta: 'ベータ版',
    planned: '計画中'
  }
  return labels[status] || status
}

/**
 * ステータス色を取得
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-500',
    beta: 'bg-yellow-500',
    planned: 'bg-gray-400'
  }
  return colors[status] || 'bg-gray-500'
}
