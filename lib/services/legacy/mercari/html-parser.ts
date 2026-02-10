/**
 * メルカリ出品一覧HTMLパーサー
 * 
 * クラス名に依存せず、data-testid属性とHTML構造から
 * 商品情報を抽出する堅牢なパーサー
 * 
 * 対象ページ: https://jp.mercari.com/mypage/listings
 */

export interface MercariListingItem {
  // 基本情報
  mercari_item_id: string        // メルカリ商品ID (例: m30917873683)
  product_name: string           // 商品名
  price_jpy: number              // 価格（円）
  thumbnail_url: string          // サムネイル画像URL
  
  // メタデータ
  item_url: string               // 商品ページURL
  is_liked: boolean              // いいね済みフラグ（ハートアイコンの状態）
  
  // パース情報
  parsed_at: string              // パース日時
}

export interface MercariParseResult {
  success: boolean
  items: MercariListingItem[]
  total_found: number
  errors: string[]
  parse_method: string           // どの方法でパースしたか
}

/**
 * メルカリ出品一覧HTMLをパースして商品情報を抽出
 * 複数の抽出方法を試行し、最も成功率の高い方法を使用
 * 
 * @param html メルカリ出品一覧ページのHTML
 * @returns パース結果
 */
export function parseMercariListingsHtml(html: string): MercariParseResult {
  const errors: string[] = []
  let items: MercariListingItem[] = []
  let parseMethod = ''

  // 方法1: data-testid属性ベースの抽出（最も安定）
  try {
    items = parseByDataTestId(html)
    if (items.length > 0) {
      parseMethod = 'data-testid'
    }
  } catch (e: any) {
    errors.push(`data-testid方式エラー: ${e.message}`)
  }

  // 方法2: href="/item/m..."パターンベースの抽出（フォールバック）
  if (items.length === 0) {
    try {
      items = parseByHrefPattern(html)
      if (items.length > 0) {
        parseMethod = 'href-pattern'
      }
    } catch (e: any) {
      errors.push(`href-pattern方式エラー: ${e.message}`)
    }
  }

  // 方法3: aria-labelベースの抽出（最終フォールバック）
  if (items.length === 0) {
    try {
      items = parseByAriaLabel(html)
      if (items.length > 0) {
        parseMethod = 'aria-label'
      }
    } catch (e: any) {
      errors.push(`aria-label方式エラー: ${e.message}`)
    }
  }

  return {
    success: items.length > 0,
    items,
    total_found: items.length,
    errors,
    parse_method: parseMethod || 'none'
  }
}

/**
 * 方法1: data-testid属性ベースの抽出
 * 最も安定した方法
 */
function parseByDataTestId(html: string): MercariListingItem[] {
  const items: MercariListingItem[] = []
  const now = new Date().toISOString()

  // data-testid="item-cell" を持つ各商品セルを抽出
  // <li data-testid="item-cell"...>...</li> のパターン
  const itemCellPattern = /<li[^>]*data-testid="item-cell"[^>]*>([\s\S]*?)<\/li>/gi
  let cellMatch

  while ((cellMatch = itemCellPattern.exec(html)) !== null) {
    const cellHtml = cellMatch[1]

    // スケルトン（ローディング中）のセルはスキップ
    if (cellHtml.includes('merSkeleton') || cellHtml.includes('pulse__')) {
      continue
    }

    try {
      const item = extractItemFromCell(cellHtml, now)
      if (item) {
        items.push(item)
      }
    } catch (e) {
      // 個別の商品パースエラーは無視して続行
      continue
    }
  }

  return items
}

/**
 * 方法2: href="/item/m..."パターンベースの抽出
 */
function parseByHrefPattern(html: string): MercariListingItem[] {
  const items: MercariListingItem[] = []
  const now = new Date().toISOString()
  const seenIds = new Set<string>()

  // href="/item/m..."パターンを検索
  const hrefPattern = /href="\/item\/(m\d+)"/gi
  let hrefMatch

  while ((hrefMatch = hrefPattern.exec(html)) !== null) {
    const itemId = hrefMatch[1]
    
    // 重複スキップ
    if (seenIds.has(itemId)) continue
    seenIds.add(itemId)

    // 商品IDの周辺HTMLから情報を抽出
    const contextStart = Math.max(0, hrefMatch.index - 500)
    const contextEnd = Math.min(html.length, hrefMatch.index + 3000)
    const contextHtml = html.substring(contextStart, contextEnd)

    const item = extractItemFromContext(itemId, contextHtml, now)
    if (item) {
      items.push(item)
    }
  }

  return items
}

/**
 * 方法3: aria-labelベースの抽出
 */
function parseByAriaLabel(html: string): MercariListingItem[] {
  const items: MercariListingItem[] = []
  const now = new Date().toISOString()
  const seenIds = new Set<string>()

  // aria-label="商品名の画像 価格円" パターンを検索
  // 例: aria-label="MATTEL 1/18 アストンマーチン DB10 007の画像 80,000円"
  const ariaPattern = /aria-label="([^"]+の画像)\s+([\d,]+)円"[^>]*id="(m\d+)"/gi
  let ariaMatch

  while ((ariaMatch = ariaPattern.exec(html)) !== null) {
    const ariaLabel = ariaMatch[1]
    const priceStr = ariaMatch[2]
    const itemId = ariaMatch[3]

    if (seenIds.has(itemId)) continue
    seenIds.add(itemId)

    // 商品名を抽出（"の画像"を除去）
    const productName = ariaLabel.replace(/の画像$/, '')
    const price = parseInt(priceStr.replace(/,/g, ''), 10)

    // 画像URLを推測
    const thumbnailUrl = `https://static.mercdn.net/thumb/item/jpeg/${itemId}_1.jpg`

    items.push({
      mercari_item_id: itemId,
      product_name: productName,
      price_jpy: price,
      thumbnail_url: thumbnailUrl,
      item_url: `https://jp.mercari.com/item/${itemId}`,
      is_liked: false,
      parsed_at: now
    })
  }

  return items
}

/**
 * セルHTMLから商品情報を抽出
 */
function extractItemFromCell(cellHtml: string, now: string): MercariListingItem | null {
  // 商品ID: href="/item/m..."から抽出
  const itemIdMatch = cellHtml.match(/href="\/item\/(m\d+)"/)
  if (!itemIdMatch) return null
  const itemId = itemIdMatch[1]

  // 商品名: data-testid="thumbnail-item-name"またはaria-labelから抽出
  let productName = ''
  
  // 方法1: data-testid="thumbnail-item-name"
  const nameMatch = cellHtml.match(/data-testid="thumbnail-item-name"[^>]*>([^<]+)</)
  if (nameMatch) {
    productName = nameMatch[1].trim()
  }
  
  // 方法2: aria-label="商品名の画像..."
  if (!productName) {
    const ariaMatch = cellHtml.match(/aria-label="([^"]+の画像)/)
    if (ariaMatch) {
      productName = ariaMatch[1].replace(/の画像$/, '').trim()
    }
  }
  
  // 方法3: itemName__クラスから
  if (!productName) {
    const itemNameMatch = cellHtml.match(/class="[^"]*itemName[^"]*"[^>]*>([^<]+)</)
    if (itemNameMatch) {
      productName = itemNameMatch[1].trim()
    }
  }

  if (!productName) return null

  // 価格: .number__クラスまたはaria-labelから抽出
  let price = 0
  
  // 方法1: number__クラス
  const numberMatch = cellHtml.match(/class="[^"]*number[^"]*"[^>]*>([\d,]+)</)
  if (numberMatch) {
    price = parseInt(numberMatch[1].replace(/,/g, ''), 10)
  }
  
  // 方法2: aria-labelから価格抽出
  if (price === 0) {
    const priceAriaMatch = cellHtml.match(/aria-label="[^"]+\s+([\d,]+)円"/)
    if (priceAriaMatch) {
      price = parseInt(priceAriaMatch[1].replace(/,/g, ''), 10)
    }
  }

  // 画像URL: img srcから抽出
  let thumbnailUrl = ''
  
  // 方法1: img src属性
  const imgMatch = cellHtml.match(/src="(https:\/\/static\.mercdn\.net\/[^"]+)"/)
  if (imgMatch) {
    thumbnailUrl = imgMatch[1]
  }
  
  // 方法2: 推測（商品IDから）
  if (!thumbnailUrl) {
    thumbnailUrl = `https://static.mercdn.net/thumb/item/jpeg/${itemId}_1.jpg`
  }

  // いいね状態: attention（塗りつぶし）かprimary（輪郭のみ）か
  const isLiked = cellHtml.includes('attention__')

  return {
    mercari_item_id: itemId,
    product_name: productName,
    price_jpy: price,
    thumbnail_url: thumbnailUrl,
    item_url: `https://jp.mercari.com/item/${itemId}`,
    is_liked: isLiked,
    parsed_at: now
  }
}

/**
 * コンテキストHTMLから商品情報を抽出
 */
function extractItemFromContext(itemId: string, contextHtml: string, now: string): MercariListingItem | null {
  // 商品名: aria-labelまたはthumbnail-item-nameから
  let productName = ''
  
  const ariaMatch = contextHtml.match(new RegExp(`id="${itemId}"[^>]*>[\\s\\S]*?aria-label="([^"]+の画像)`))
  if (ariaMatch) {
    productName = ariaMatch[1].replace(/の画像$/, '').trim()
  }
  
  if (!productName) {
    const nameMatch = contextHtml.match(/data-testid="thumbnail-item-name"[^>]*>([^<]+)</)
    if (nameMatch) {
      productName = nameMatch[1].trim()
    }
  }

  if (!productName) return null

  // 価格
  let price = 0
  const priceMatch = contextHtml.match(/aria-label="[^"]+\s+([\d,]+)円"/)
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/,/g, ''), 10)
  }

  // 画像URL
  const imgMatch = contextHtml.match(new RegExp(`src="(https://static\\.mercdn\\.net/[^"]*${itemId}[^"]*\\.jpg[^"]*)"`))
  const thumbnailUrl = imgMatch ? imgMatch[1] : `https://static.mercdn.net/thumb/item/jpeg/${itemId}_1.jpg`

  return {
    mercari_item_id: itemId,
    product_name: productName,
    price_jpy: price,
    thumbnail_url: thumbnailUrl,
    item_url: `https://jp.mercari.com/item/${itemId}`,
    is_liked: false,
    parsed_at: now
  }
}

/**
 * パース結果をinventory_master形式に変換
 */
export function convertToInventoryFormat(items: MercariListingItem[], accountName: string = 'default') {
  return items.map(item => ({
    unique_id: `mercari-${accountName}-${item.mercari_item_id}`,
    product_name: item.product_name,
    sku: item.mercari_item_id,
    product_type: 'stock' as const,
    physical_quantity: 1,  // メルカリは基本的に1点もの
    listing_quantity: 1,
    cost_price: 0,  // 後から設定
    selling_price: item.price_jpy,  // 円建て
    condition_name: null,  // メルカリからは取得できない
    category: null,  // メルカリからは取得できない
    images: [item.thumbnail_url],
    
    // source_data: メルカリ固有データ
    source_data: {
      marketplace: 'mercari',
      mercari_account: accountName,
      mercari_item_id: item.mercari_item_id,
      mercari_url: item.item_url,
      original_price_jpy: item.price_jpy,
      currency: 'JPY',
      is_liked: item.is_liked,
      synced_at: item.parsed_at
    },

    marketplace: 'mercari',
    account: accountName,
    is_manual_entry: false,
    priority_score: 0,
    notes: `メルカリ同期 (${item.parsed_at})`
  }))
}
