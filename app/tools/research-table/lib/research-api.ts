/**
 * 統合リサーチテーブル API クライアント
 * Supabase直接アクセス版
 */

import { supabase } from '@/lib/supabase/client';
import type {
  ResearchItem,
  KaritoriCategory,
  SupplierContact,
  ResearchFilters,
  ResearchSort,
  ResearchStats,
} from '../types/research';

/**
 * リサーチアイテム取得
 */
export async function fetchResearchItems(
  filters: ResearchFilters = {},
  sort: ResearchSort = { field: 'created_at', direction: 'desc' },
  page: number = 1,
  pageSize: number = 50
): Promise<{ data: ResearchItem[]; total: number }> {
  let query = supabase
    .from('research_repository')
    .select('*', { count: 'exact' });

  // フィルター適用
  if (filters.source) {
    query = query.eq('source', filters.source);
  }
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.karitori_status) {
    query = query.eq('karitori_status', filters.karitori_status);
  }
  if (filters.risk_level) {
    query = query.eq('risk_level', filters.risk_level);
  }
  if (filters.min_profit_margin !== undefined) {
    query = query.gte('profit_margin', filters.min_profit_margin);
  }
  if (filters.max_profit_margin !== undefined) {
    query = query.lte('profit_margin', filters.max_profit_margin);
  }
  if (filters.min_score !== undefined) {
    query = query.gte('total_score', filters.min_score);
  }
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,english_title.ilike.%${filters.search}%,asin.ilike.%${filters.search}%`);
  }

  // ソート適用
  query = query.order(sort.field, { ascending: sort.direction === 'asc', nullsFirst: false });

  // ページネーション
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('fetchResearchItems error:', error);
    throw new Error(error.message);
  }

  return {
    data: (data || []) as ResearchItem[],
    total: count || 0,
  };
}

/**
 * 単一アイテム取得
 */
export async function fetchResearchItem(id: string): Promise<ResearchItem | null> {
  const { data, error } = await supabase
    .from('research_repository')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('fetchResearchItem error:', error);
    return null;
  }

  return data as ResearchItem;
}

/**
 * リサーチアイテム作成
 */
export async function createResearchItem(
  item: Partial<ResearchItem>
): Promise<ResearchItem | null> {
  const { data, error } = await supabase
    .from('research_repository')
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error('createResearchItem error:', error);
    throw new Error(error.message);
  }

  return data as ResearchItem;
}

/**
 * リサーチアイテム更新
 */
export async function updateResearchItem(
  id: string,
  updates: Partial<ResearchItem>
): Promise<ResearchItem | null> {
  const { data, error } = await supabase
    .from('research_repository')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateResearchItem error:', error);
    throw new Error(error.message);
  }

  return data as ResearchItem;
}

/**
 * リサーチアイテム削除
 */
export async function deleteResearchItem(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('research_repository')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('deleteResearchItem error:', error);
    return false;
  }

  return true;
}

/**
 * 一括ステータス更新
 */
export async function bulkUpdateStatus(
  ids: string[],
  status: ResearchItem['status']
): Promise<number> {
  const { data, error } = await supabase
    .from('research_repository')
    .update({ status })
    .in('id', ids)
    .select('id');

  if (error) {
    console.error('bulkUpdateStatus error:', error);
    throw new Error(error.message);
  }

  return data?.length || 0;
}

/**
 * 統計情報取得
 */
export async function fetchResearchStats(): Promise<ResearchStats> {
  const { data, error } = await supabase.rpc('get_research_stats');

  if (error) {
    console.error('fetchResearchStats error:', error);
    // フォールバック: 手動集計
    const { data: items } = await supabase
      .from('research_repository')
      .select('status, karitori_status, profit_margin, total_score');

    const fallbackStats: ResearchStats = {
      total: items?.length || 0,
      new: items?.filter(i => i.status === 'new').length || 0,
      analyzing: items?.filter(i => i.status === 'analyzing').length || 0,
      approved: items?.filter(i => i.status === 'approved').length || 0,
      rejected: items?.filter(i => i.status === 'rejected').length || 0,
      promoted: items?.filter(i => i.status === 'promoted').length || 0,
      watching: items?.filter(i => i.karitori_status === 'watching').length || 0,
      alert: items?.filter(i => i.karitori_status === 'alert').length || 0,
      avg_profit_margin: items?.reduce((acc, i) => acc + (i.profit_margin || 0), 0) / (items?.length || 1) || 0,
      avg_total_score: items?.reduce((acc, i) => acc + (i.total_score || 0), 0) / (items?.length || 1) || 0,
    };

    return fallbackStats;
  }

  return data as ResearchStats;
}

// ============================================================
// 刈り取りカテゴリ API
// ============================================================

/**
 * 刈り取りカテゴリ一覧取得
 */
export async function fetchKaritoriCategories(): Promise<KaritoriCategory[]> {
  const { data, error } = await supabase
    .from('karitori_categories')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchKaritoriCategories error:', error);
    return [];
  }

  return data as KaritoriCategory[];
}

/**
 * 刈り取りカテゴリ追加
 */
export async function addKaritoriCategory(
  category: Omit<KaritoriCategory, 'id' | 'created_at' | 'updated_at' | 'high_profits_count'>
): Promise<KaritoriCategory | null> {
  const { data, error } = await supabase
    .from('karitori_categories')
    .insert({
      ...category,
      high_profits_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('addKaritoriCategory error:', error);
    throw new Error(error.message);
  }

  return data as KaritoriCategory;
}

/**
 * 刈り取りカテゴリ削除
 */
export async function deleteKaritoriCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('karitori_categories')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('deleteKaritoriCategory error:', error);
    return false;
  }

  return true;
}

/**
 * 刈り取りアラート取得
 */
export async function fetchKaritoriAlerts(
  minProfitRate: number = 20,
  maxBsr: number = 5000
): Promise<ResearchItem[]> {
  const { data, error } = await supabase
    .from('research_repository')
    .select('*')
    .in('karitori_status', ['watching', 'alert'])
    .gte('profit_margin', minProfitRate)
    .or(`bsr_rank.is.null,bsr_rank.lte.${maxBsr}`)
    .order('profit_margin', { ascending: false });

  if (error) {
    console.error('fetchKaritoriAlerts error:', error);
    return [];
  }

  return data as ResearchItem[];
}

/**
 * 自動購入判定シミュレーション
 */
export async function simulatePurchase(
  item: ResearchItem,
  forceStatus?: 'manual-skipped'
): Promise<{ status: 'auto-bought' | 'manual-skipped'; reason: string }> {
  const MIN_PROFIT_RATE = 20;
  const MAX_BSR_FOR_AUTO = 5000;

  if (forceStatus === 'manual-skipped') {
    await updateResearchItem(item.id, {
      purchase_status: 'manual-skipped',
      karitori_reason: '手動で見送り',
    });
    return { status: 'manual-skipped', reason: '手動で見送り' };
  }

  const isProfitable = (item.profit_margin || 0) > MIN_PROFIT_RATE;
  const isFastMoving = !item.bsr_rank || item.bsr_rank <= MAX_BSR_FOR_AUTO;

  let newStatus: 'auto-bought' | 'manual-skipped';
  let reason = '';

  if (isProfitable && isFastMoving) {
    newStatus = 'auto-bought';
    reason = `自動購入実行 (利益率: ${item.profit_margin?.toFixed(1)}%, BSR: ${item.bsr_rank || 'N/A'}位)`;
  } else {
    newStatus = 'manual-skipped';
    const reasons: string[] = [];
    if (!isProfitable) {
      reasons.push(`利益率(${item.profit_margin?.toFixed(1)}%)が${MIN_PROFIT_RATE}%未満`);
    }
    if (!isFastMoving) {
      reasons.push(`BSR(${item.bsr_rank}位)が${MAX_BSR_FOR_AUTO}位を超過`);
    }
    reason = reasons.join(' AND ');
  }

  await updateResearchItem(item.id, {
    purchase_status: newStatus,
    karitori_reason: reason,
    karitori_status: newStatus === 'auto-bought' ? 'purchased' : 'skipped',
  });

  return { status: newStatus, reason };
}

// ============================================================
// 仕入先コンタクト API
// ============================================================

/**
 * 仕入先コンタクト一覧取得
 */
export async function fetchSupplierContacts(
  researchItemId?: string
): Promise<SupplierContact[]> {
  let query = supabase
    .from('supplier_contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (researchItemId) {
    query = query.eq('research_item_id', researchItemId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('fetchSupplierContacts error:', error);
    return [];
  }

  return data as SupplierContact[];
}

/**
 * 仕入先コンタクト作成
 */
export async function createSupplierContact(
  contact: Omit<SupplierContact, 'id' | 'created_at' | 'updated_at'>
): Promise<SupplierContact | null> {
  const { data, error } = await supabase
    .from('supplier_contacts')
    .insert(contact)
    .select()
    .single();

  if (error) {
    console.error('createSupplierContact error:', error);
    throw new Error(error.message);
  }

  return data as SupplierContact;
}

/**
 * 仕入先コンタクト更新
 */
export async function updateSupplierContact(
  id: string,
  updates: Partial<SupplierContact>
): Promise<SupplierContact | null> {
  const { data, error } = await supabase
    .from('supplier_contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateSupplierContact error:', error);
    throw new Error(error.message);
  }

  return data as SupplierContact;
}

// ============================================================
// 承認ワークフロー
// ============================================================

/**
 * 商品を承認してproducts_masterに昇格
 */
export async function approveAndPromote(
  researchItemId: string,
  workflowType: '無在庫' | '有在庫'
): Promise<{ success: boolean; productId?: string; error?: string }> {
  try {
    // 1. リサーチアイテム取得
    const item = await fetchResearchItem(researchItemId);
    if (!item) {
      return { success: false, error: 'リサーチアイテムが見つかりません' };
    }

    // 2. products_masterにコピー
    const { data: newProduct, error: insertError } = await supabase
      .from('products_master')
      .insert({
        title: item.title,
        title_en: item.english_title,
        english_title: item.english_title,
        price_jpy: item.sold_price_jpy || item.estimated_cost_jpy,
        purchase_price_jpy: item.supplier_price_jpy || item.estimated_cost_jpy,
        primary_image_url: item.image_url,
        image_urls: item.image_urls,
        category_name: item.category_name,
        category_id: item.category_id,
        condition: item.condition_name,
        hts_code: item.hts_code,
        origin_country: item.origin_country,
        profit_margin: item.profit_margin,
        // リサーチデータを参照として保存
        scraped_data: {
          source: item.source,
          source_url: item.source_url,
          research_item_id: item.id,
          ebay_item_id: item.ebay_item_id,
          asin: item.asin,
        },
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('approveAndPromote insert error:', insertError);
      return { success: false, error: insertError.message };
    }

    // 3. リサーチアイテムを昇格済みに更新
    await updateResearchItem(researchItemId, {
      status: 'promoted',
      workflow_type: workflowType,
      approved_at: new Date().toISOString(),
      promoted_product_id: newProduct.id,
    });

    return { success: true, productId: newProduct.id };
  } catch (error: any) {
    console.error('approveAndPromote error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 商品を却下
 */
export async function rejectItem(
  researchItemId: string,
  reason?: string
): Promise<boolean> {
  try {
    await updateResearchItem(researchItemId, {
      status: 'rejected',
      calculation_error: reason,
    });
    return true;
  } catch (error) {
    console.error('rejectItem error:', error);
    return false;
  }
}
