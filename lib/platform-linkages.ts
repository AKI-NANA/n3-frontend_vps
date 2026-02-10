// lib/platform-linkages.ts
// NAGANO-3 Platform Linkages - SKUマッピングシステム

import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// =====================================================
// 型定義
// =====================================================

export type PlatformName = 
  | 'ebay' 
  | 'amazon' 
  | 'yahoo_auction' 
  | 'shopee' 
  | 'lazada'
  | 'mercari_jp'
  | 'mercari_us'
  | 'rakuten'
  | 'qoo10';

export type PlatformRegion = 
  | 'us' | 'uk' | 'de' | 'au' | 'ca' | 'fr'  // eBay/Amazon
  | 'jp'                                       // 国内
  | 'sg' | 'my' | 'ph' | 'th' | 'vn' | 'id' | 'tw' | 'br';  // Shopee/Lazada

export type ListingStatus = 'active' | 'ended' | 'sold' | 'draft' | 'error' | 'delisted';

export interface PlatformLinkage {
  id: number;
  products_master_id: number;
  platform_name: PlatformName;
  platform_region: PlatformRegion | null;
  platform_item_id: string;
  platform_sku: string | null;
  listing_url: string | null;
  listing_status: ListingStatus;
  last_synced_at: string | null;
  sync_direction: 'import' | 'export' | 'both';
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateLinkageInput {
  products_master_id: number;
  platform_name: PlatformName;
  platform_region?: PlatformRegion;
  platform_item_id: string;
  platform_sku?: string;
  listing_url?: string;
  listing_status?: ListingStatus;
  sync_direction?: 'import' | 'export' | 'both';
}

// =====================================================
// 検索関数
// =====================================================

/**
 * ヤフオクIDで既存商品を検索
 */
export async function findProductByYahooId(yahooItemId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('platform_linkages')
    .select('products_master_id')
    .eq('platform_name', 'yahoo_auction')
    .eq('platform_item_id', yahooItemId)
    .single();

  if (error || !data) return null;
  return data.products_master_id;
}

/**
 * eBay Listing IDで既存商品を検索
 */
export async function findProductByEbayListingId(ebayListingId: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('platform_linkages')
    .select('products_master_id')
    .eq('platform_name', 'ebay')
    .eq('platform_item_id', ebayListingId)
    .single();

  if (error || !data) return null;
  return data.products_master_id;
}

/**
 * eBay SKUで既存商品を検索（platform_linkagesとproducts_master両方）
 */
export async function findProductByEbaySku(ebaySku: string): Promise<number | null> {
  // 1. platform_linkagesを検索
  const { data: linkage } = await supabase
    .from('platform_linkages')
    .select('products_master_id')
    .eq('platform_name', 'ebay')
    .eq('platform_sku', ebaySku)
    .single();

  if (linkage) return linkage.products_master_id;

  // 2. products_master.skuを検索
  const { data: product } = await supabase
    .from('products_master')
    .select('id')
    .eq('sku', ebaySku)
    .single();

  if (product) return product.id;

  return null;
}

/**
 * 汎用: プラットフォーム+IDで検索
 */
export async function findProductByPlatformId(
  platformName: PlatformName,
  platformItemId: string,
  platformRegion?: PlatformRegion
): Promise<number | null> {
  let query = supabase
    .from('platform_linkages')
    .select('products_master_id')
    .eq('platform_name', platformName)
    .eq('platform_item_id', platformItemId);

  if (platformRegion) {
    query = query.eq('platform_region', platformRegion);
  }

  const { data, error } = await query.single();

  if (error || !data) return null;
  return data.products_master_id;
}

// =====================================================
// CRUD操作
// =====================================================

/**
 * 新しいリンケージを作成
 */
export async function createLinkage(input: CreateLinkageInput): Promise<PlatformLinkage | null> {
  const { data, error } = await supabase
    .from('platform_linkages')
    .insert({
      products_master_id: input.products_master_id,
      platform_name: input.platform_name,
      platform_region: input.platform_region || null,
      platform_item_id: input.platform_item_id,
      platform_sku: input.platform_sku || null,
      listing_url: input.listing_url || null,
      listing_status: input.listing_status || 'active',
      sync_direction: input.sync_direction || 'both',
    })
    .select()
    .single();

  if (error) {
    console.error('❌ リンケージ作成エラー:', error);
    return null;
  }

  return data as PlatformLinkage;
}

/**
 * リンケージを更新
 */
export async function updateLinkage(
  id: number,
  updates: Partial<Omit<PlatformLinkage, 'id' | 'created_at' | 'updated_at'>>
): Promise<PlatformLinkage | null> {
  const { data, error } = await supabase
    .from('platform_linkages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('❌ リンケージ更新エラー:', error);
    return null;
  }

  return data as PlatformLinkage;
}

/**
 * 商品IDに紐づく全リンケージを取得
 */
export async function getLinkagesByProductId(productId: number): Promise<PlatformLinkage[]> {
  const { data, error } = await supabase
    .from('platform_linkages')
    .select('*')
    .eq('products_master_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ リンケージ取得エラー:', error);
    return [];
  }

  return data as PlatformLinkage[];
}

/**
 * 特定のリンケージを削除
 */
export async function deleteLinkage(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('platform_linkages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('❌ リンケージ削除エラー:', error);
    return false;
  }

  return true;
}

// =====================================================
// インポート/エクスポートロジック
// =====================================================

/**
 * ヤフオクからの商品取り込み（重複チェック付き）
 */
export async function importFromYahooAuction(
  yahooItemId: string,
  productData: any
): Promise<{ action: 'created' | 'updated'; productId: number } | null> {
  
  // 1. 既存レコードを検索
  const existingProductId = await findProductByYahooId(yahooItemId);

  if (existingProductId) {
    // 2A. 既存レコードを更新
    console.log(`🔄 既存商品を更新: products_master_id=${existingProductId}`);
    
    const { error } = await supabase
      .from('products_master')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProductId);

    if (error) {
      console.error('❌ 更新エラー:', error);
      return null;
    }

    // リンケージの同期日時を更新
    await supabase
      .from('platform_linkages')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('products_master_id', existingProductId)
      .eq('platform_name', 'yahoo_auction');

    return { action: 'updated', productId: existingProductId };
  }

  // 2B. 新規レコード作成
  console.log(`✨ 新規商品を作成: yahoo_item_id=${yahooItemId}`);

  // SKU生成
  const newSku = await generateSku('YAH');

  const { data: newProduct, error: insertError } = await supabase
    .from('products_master')
    .insert({
      sku: newSku,
      source_platform: 'yahoo_auction',
      source_item_id: yahooItemId,
      ...productData,
    })
    .select()
    .single();

  if (insertError || !newProduct) {
    console.error('❌ 挿入エラー:', insertError);
    return null;
  }

  // リンケージを作成
  await createLinkage({
    products_master_id: newProduct.id,
    platform_name: 'yahoo_auction',
    platform_region: 'jp',
    platform_item_id: yahooItemId,
    listing_status: 'active',
    sync_direction: 'import',
  });

  return { action: 'created', productId: newProduct.id };
}

/**
 * eBay既存商品のインポート（重複チェック付き）
 */
export async function importFromEbay(
  ebayListingId: string,
  ebaySku: string | null,
  ebayRegion: PlatformRegion,
  productData: any
): Promise<{ action: 'created' | 'updated' | 'linked'; productId: number } | null> {

  // 1. eBay Listing IDで検索
  let existingProductId = await findProductByEbayListingId(ebayListingId);

  // 2. SKUでも検索（Listing IDがなければ）
  if (!existingProductId && ebaySku) {
    existingProductId = await findProductByEbaySku(ebaySku);
  }

  if (existingProductId) {
    // 既存レコードを更新
    console.log(`🔄 既存商品を更新: products_master_id=${existingProductId}`);

    const { error } = await supabase
      .from('products_master')
      .update({
        ...productData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProductId);

    if (error) {
      console.error('❌ 更新エラー:', error);
      return null;
    }

    // リンケージが存在するか確認、なければ作成
    const existingLinkage = await supabase
      .from('platform_linkages')
      .select('id')
      .eq('products_master_id', existingProductId)
      .eq('platform_name', 'ebay')
      .eq('platform_item_id', ebayListingId)
      .single();

    if (!existingLinkage.data) {
      await createLinkage({
        products_master_id: existingProductId,
        platform_name: 'ebay',
        platform_region: ebayRegion,
        platform_item_id: ebayListingId,
        platform_sku: ebaySku || undefined,
        listing_status: 'active',
        sync_direction: 'import',
      });
      return { action: 'linked', productId: existingProductId };
    }

    // リンケージの同期日時を更新
    await supabase
      .from('platform_linkages')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', existingLinkage.data.id);

    return { action: 'updated', productId: existingProductId };
  }

  // 新規レコード作成
  console.log(`✨ 新規商品を作成: ebay_listing_id=${ebayListingId}`);

  // SKU決定: eBay SKUがあればそれを使用、なければ生成
  const newSku = ebaySku || await generateSku('EBAY');

  const { data: newProduct, error: insertError } = await supabase
    .from('products_master')
    .insert({
      sku: newSku,
      source_platform: 'ebay_import',
      source_item_id: ebayListingId,
      original_sku: ebaySku,
      ...productData,
    })
    .select()
    .single();

  if (insertError || !newProduct) {
    console.error('❌ 挿入エラー:', insertError);
    return null;
  }

  // リンケージを作成
  await createLinkage({
    products_master_id: newProduct.id,
    platform_name: 'ebay',
    platform_region: ebayRegion,
    platform_item_id: ebayListingId,
    platform_sku: ebaySku || newSku,
    listing_status: 'active',
    sync_direction: 'import',
  });

  return { action: 'created', productId: newProduct.id };
}

/**
 * eBayに出品した後、リンケージを追加
 */
export async function linkToEbayAfterListing(
  productId: number,
  ebayListingId: string,
  ebayRegion: PlatformRegion,
  ebaySku?: string
): Promise<PlatformLinkage | null> {
  // 現在の商品情報を取得
  const { data: product } = await supabase
    .from('products_master')
    .select('sku')
    .eq('id', productId)
    .single();

  if (!product) {
    console.error('❌ 商品が見つかりません:', productId);
    return null;
  }

  return createLinkage({
    products_master_id: productId,
    platform_name: 'ebay',
    platform_region: ebayRegion,
    platform_item_id: ebayListingId,
    platform_sku: ebaySku || product.sku,
    listing_status: 'active',
    sync_direction: 'export',
  });
}

// =====================================================
// ユーティリティ
// =====================================================

/**
 * SKU生成（プレフィックス + 連番）
 */
async function generateSku(prefix: string): Promise<string> {
  // 現在の最大番号を取得
  const { data } = await supabase
    .from('products_master')
    .select('sku')
    .like('sku', `${prefix}-%`)
    .order('sku', { ascending: false })
    .limit(1)
    .single();

  let nextNumber = 1;

  if (data?.sku) {
    const match = data.sku.match(new RegExp(`${prefix}-(\\d+)`));
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}-${nextNumber.toString().padStart(6, '0')}`;
}

/**
 * 商品の全プラットフォームステータスを取得
 */
export async function getProductPlatformStatus(productId: number): Promise<{
  platforms: PlatformLinkage[];
  summary: {
    total: number;
    active: number;
    sold: number;
    ended: number;
  };
}> {
  const linkages = await getLinkagesByProductId(productId);

  return {
    platforms: linkages,
    summary: {
      total: linkages.length,
      active: linkages.filter(l => l.listing_status === 'active').length,
      sold: linkages.filter(l => l.listing_status === 'sold').length,
      ended: linkages.filter(l => l.listing_status === 'ended').length,
    },
  };
}
