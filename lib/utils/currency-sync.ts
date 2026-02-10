/**
 * inventory_master → products_master 通貨・サイト同期ユーティリティ
 * 
 * Supabaseトリガーが通貨情報を同期しないため、
 * inventory_masterへの書き込み後にこの関数を呼び出す
 * 
 * 使用方法:
 * import { syncCurrencyAfterInventoryUpdate } from '@/lib/utils/currency-sync';
 * await syncCurrencyAfterInventoryUpdate(supabase, sourceIds);
 */

import { SupabaseClient } from '@supabase/supabase-js';

interface SyncResult {
  success: boolean;
  synced: number;
  errors: string[];
}

/**
 * 特定のsource_idに対して通貨・サイト情報を同期
 * @param supabase Supabaseクライアント
 * @param sourceIds 同期対象のsource_id配列（unique_id形式）
 */
export async function syncCurrencyAfterInventoryUpdate(
  supabase: SupabaseClient,
  sourceIds: string[]
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    errors: [],
  };

  if (!sourceIds || sourceIds.length === 0) {
    return result;
  }

  try {
    // inventory_masterから対象レコードを取得
    const { data: inventoryData, error: invError } = await supabase
      .from('inventory_master')
      .select('id, unique_id, ebay_data, source_data')
      .in('unique_id', sourceIds);

    if (invError) {
      result.success = false;
      result.errors.push(`inventory_master取得エラー: ${invError.message}`);
      return result;
    }

    if (!inventoryData || inventoryData.length === 0) {
      // IDで再検索
      const { data: inventoryByIdData } = await supabase
        .from('inventory_master')
        .select('id, unique_id, ebay_data, source_data')
        .in('id', sourceIds.filter(id => !id.includes('-')).map(id => parseInt(id)));

      if (!inventoryByIdData || inventoryByIdData.length === 0) {
        return result;
      }

      // 以下同様の処理
      for (const inv of inventoryByIdData) {
        await syncSingleRecord(supabase, inv, result);
      }
      return result;
    }

    // 各レコードの通貨・サイト情報を同期
    for (const inv of inventoryData) {
      await syncSingleRecord(supabase, inv, result);
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`同期エラー: ${error.message}`);
    return result;
  }
}

/**
 * 単一レコードの同期処理
 */
async function syncSingleRecord(
  supabase: SupabaseClient,
  inv: any,
  result: SyncResult
): Promise<void> {
  const sourceId = inv.unique_id || String(inv.id);
  
  // 通貨を取得（ebay_data.currency → source_data.currency → 'USD'）
  const currency = inv.ebay_data?.currency || inv.source_data?.currency || 'USD';
  
  // サイトを取得（ebay_data.site → source_data.site → 'US'）
  const ebay_site = inv.ebay_data?.site || inv.source_data?.site || 'US';

  // products_masterを更新
  const { error: updateError } = await supabase
    .from('products_master')
    .update({
      currency: currency,
      ebay_site: ebay_site,
      updated_at: new Date().toISOString(),
    })
    .eq('source_system', 'inventory_master')
    .eq('source_id', sourceId);

  if (updateError) {
    result.errors.push(`${sourceId}: ${updateError.message}`);
  } else {
    result.synced++;
  }
}

/**
 * 全データの通貨・サイト情報を一括同期
 * @param supabase Supabaseクライアント
 */
export async function syncAllCurrency(
  supabase: SupabaseClient
): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    synced: 0,
    errors: [],
  };

  try {
    // inventory_master全件取得
    const { data: inventoryData, error: invError } = await supabase
      .from('inventory_master')
      .select('id, unique_id, ebay_data, source_data');

    if (invError) {
      result.success = false;
      result.errors.push(`inventory_master取得エラー: ${invError.message}`);
      return result;
    }

    if (!inventoryData || inventoryData.length === 0) {
      return result;
    }

    console.log(`[currency-sync] ${inventoryData.length}件の通貨同期を開始`);

    // バッチ更新（100件ずつ）
    const batchSize = 100;
    for (let i = 0; i < inventoryData.length; i += batchSize) {
      const batch = inventoryData.slice(i, i + batchSize);
      
      for (const inv of batch) {
        await syncSingleRecord(supabase, inv, result);
      }
      
      console.log(`[currency-sync] ${Math.min(i + batchSize, inventoryData.length)}/${inventoryData.length}件完了`);
    }

    console.log(`[currency-sync] 完了: ${result.synced}件同期, ${result.errors.length}件エラー`);
    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`同期エラー: ${error.message}`);
    return result;
  }
}

/**
 * 新規追加時の通貨同期（INSERT直後に呼び出す）
 * @param supabase Supabaseクライアント
 * @param uniqueId 新規追加されたレコードのunique_id
 * @param ebayData eBayデータ（currency, site含む）
 * @param sourceData ソースデータ
 */
export async function syncCurrencyForNewRecord(
  supabase: SupabaseClient,
  uniqueId: string,
  ebayData?: { currency?: string; site?: string },
  sourceData?: { currency?: string; site?: string }
): Promise<boolean> {
  try {
    const currency = ebayData?.currency || sourceData?.currency || 'USD';
    const ebay_site = ebayData?.site || sourceData?.site || 'US';

    // 少し待機（トリガーによるproducts_master作成を待つ）
    await new Promise(resolve => setTimeout(resolve, 100));

    const { error } = await supabase
      .from('products_master')
      .update({
        currency: currency,
        ebay_site: ebay_site,
        updated_at: new Date().toISOString(),
      })
      .eq('source_system', 'inventory_master')
      .eq('source_id', uniqueId);

    if (error) {
      console.error(`[currency-sync] ${uniqueId} 通貨同期失敗:`, error.message);
      return false;
    }

    console.log(`[currency-sync] ${uniqueId} 通貨同期完了: ${currency}/${ebay_site}`);
    return true;
  } catch (error: any) {
    console.error(`[currency-sync] エラー:`, error.message);
    return false;
  }
}
