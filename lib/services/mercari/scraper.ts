/**
 * メルカリスクレイピングサービス
 * 
 * 特定の販売者プロフィールページから出品商品を取得
 * URL: https://jp.mercari.com/user/profile/{seller_id}
 */

import * as cheerio from 'cheerio'

export interface MercariItem {
  mercari_item_id: string       // 商品ID (m30917873683形式)
  title: string                  // 商品名
  price: number                  // 価格（円）
  thumbnail_url: string          // サムネイル画像URL
  item_url: string               // 商品詳細ページURL
  is_sold: boolean               // 売り切れフラグ
  is_liked: boolean              // いいね済みフラグ（参考）
}

export interface MercariScrapeResult {
  seller_id: string
  items: MercariItem[]
  total_count: number
  scraped_at: string
  errors: string[]
}

/**
 * メルカリの販売者ページHTMLをパースして商品情報を抽出
 */
export function parseMercariListingsHtml(html: string, sellerId: string): MercariScrapeResult {
  const $ = cheerio.load(html)
  const items: MercariItem[] = []
  const errors: string[] = []

  // 商品一覧をパース（data-testid="item-cell" を持つ li 要素）
  $('li[data-testid="item-cell"]').each((index, element) => {
    try {
      const $item = $(element)
      const $link = $item.find('a[data-testid="thumbnail-link"]')
      
      // リンクがない場合（スケルトン要素など）はスキップ
      if ($link.length === 0) return

      // 商品IDを取得（href="/item/m30917873683" から抽出）
      const href = $link.attr('href') || ''
      const itemIdMatch = href.match(/\/item\/(m\d+)/)
      if (!itemIdMatch) return

      const mercariItemId = itemIdMatch[1]

      // 商品名を取得
      const title = $item.find('[data-testid="thumbnail-item-name"]').text().trim()
      if (!title) return

      // 価格を取得（¥マークを除去して数値化）
      const priceText = $item.find('.number__6b270ca7').text().trim()
      const price = parseInt(priceText.replace(/,/g, ''), 10) || 0

      // サムネイル画像URLを取得
      const thumbnailUrl = $item.find('img').attr('src') || ''

      // 売り切れ判定（"売り切れ"ステッカーの有無）
      const isSold = $item.find('[data-testid="thumbnail-sticker"]').length > 0 ||
                     $item.find('svg title:contains("売り切れ")').length > 0 ||
                     $item.find('[aria-label*="売り切れ"]').length > 0

      // いいね判定（塗りつぶしハートかどうか - attention クラスの有無）
      const isLiked = $item.find('.icon__386b8057.attention__386b8057').length > 0

      items.push({
        mercari_item_id: mercariItemId,
        title,
        price,
        thumbnail_url: thumbnailUrl,
        item_url: `https://jp.mercari.com/item/${mercariItemId}`,
        is_sold: isSold,
        is_liked: isLiked
      })
    } catch (err: any) {
      errors.push(`アイテムパースエラー: ${err.message}`)
    }
  })

  return {
    seller_id: sellerId,
    items,
    total_count: items.length,
    scraped_at: new Date().toISOString(),
    errors
  }
}

/**
 * メルカリ商品をinventory_master形式に変換
 */
export function convertMercariToInventory(item: MercariItem, sellerId: string) {
  return {
    unique_id: `mercari-${sellerId}-${item.mercari_item_id}`,
    product_name: item.title,
    sku: item.mercari_item_id,
    product_type: 'stock' as const,
    physical_quantity: item.is_sold ? 0 : 1,
    listing_quantity: item.is_sold ? 0 : 1,
    cost_price: 0,  // ユーザーが後で設定
    selling_price: item.price,  // 円建て
    condition_name: null,  // メルカリからは取得不可
    category: null,  // 詳細ページから取得が必要
    images: item.thumbnail_url ? [item.thumbnail_url.replace('/thumb/', '/photos/')] : [],
    
    // source_data: メルカリ固有情報
    source_data: {
      marketplace: 'mercari',
      mercari_seller_id: sellerId,
      mercari_item_id: item.mercari_item_id,
      mercari_url: item.item_url,
      original_price: item.price,
      currency: 'JPY',
      is_sold: item.is_sold,
      is_liked: item.is_liked,
      thumbnail_url: item.thumbnail_url,
      synced_at: new Date().toISOString()
    },

    marketplace: 'mercari',
    account: sellerId,

    // mercari_data: メルカリ詳細データ
    mercari_data: {
      item_id: item.mercari_item_id,
      seller_id: sellerId,
      title: item.title,
      price: item.price,
      currency: 'JPY',
      is_sold: item.is_sold,
      is_liked: item.is_liked,
      thumbnail_url: item.thumbnail_url,
      item_url: item.item_url
    },

    is_manual_entry: false,
    priority_score: item.is_liked ? 10 : 0,  // いいねされている商品は優先度を上げる
    notes: `メルカリ同期 (${new Date().toISOString()})${item.is_sold ? ' [売り切れ]' : ''}`
  }
}

/**
 * 高解像度画像URLに変換
 * メルカリのサムネイルURLからフルサイズ画像URLを生成
 */
export function convertToFullSizeImage(thumbnailUrl: string): string {
  if (!thumbnailUrl) return ''
  
  // https://static.mercdn.net/thumb/item/jpeg/m30917873683_1.jpg
  // → https://static.mercdn.net/item/detail/orig/photos/m30917873683_1.jpg
  return thumbnailUrl
    .replace('/thumb/item/', '/item/detail/orig/photos/')
    .replace('.jpg?', '_1.jpg?')
}
