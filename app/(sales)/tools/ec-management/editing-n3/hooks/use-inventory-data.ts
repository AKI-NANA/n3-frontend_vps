// app/tools/editing-n3/hooks/use-inventory-data.ts
/**
 * 棚卸しデータフック - inventory_masterテーブルからデータ取得
 * 
 * 機能:
 * - ページネーション対応（Supabase 1000件制限回避）
 * - フィルタリング
 * - 統計計算
 * 
 * 重要: types/inventory.ts の InventoryProduct を使用
 */

'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { InventoryProduct as BaseInventoryProduct } from '@/types/inventory';

// 拡張した型定義（N3表示用にフィールドを追加）
export interface InventoryProduct extends BaseInventoryProduct {
  // N3表示用エイリアス
  title?: string; // product_name のエイリアス
  image_url?: string; // images[0] のエイリアス
  cost_jpy?: number; // cost_price のエイリアス（円換算）
  current_stock?: number; // physical_quantity のエイリアス
  stock_status?: 'in_stock' | 'out_of_stock' | 'low_stock';
  ebay_account?: string; // source_data.ebay_account のエイリアス
  
  // L1-L4属性（分類用）
  attr_l1?: string | null;
  attr_l2?: string | null;
  attr_l3?: string | null;
  attr_l4?: string[]; // 販売予定販路（配列）
  is_verified?: boolean;
  
  // その他経費
  additional_costs?: Record<string, number>; // JSONB形式: { "国内送料": 500, "検品費": 300 }
  total_cost_jpy?: number; // 原価 + 経費合計
  
  // 棚卸し関連
  storage_location?: string | null;
  last_counted_at?: string | null;
  counted_by?: string | null;
  inventory_images?: string[];
  
  // 🔥 フェーズ2: L4マスター在庫タイプ
  master_inventory_type?: MasterInventoryType | null;
  is_set_component?: boolean;
  mu_supplier_info?: {
    mall?: string;
    url?: string;
    last_checked_at?: string;
    is_available?: boolean;
    supplier_price?: number;
    supplier_stock?: number;
    notes?: string;
  } | null;
}

// L4サブフィルター用マスター在庫タイプ
import type { MasterInventoryType } from '@/types/inventory-extended';

// フィルター型
export interface InventoryFilter {
  marketplace?: string;
  productType?: string;
  stockStatus?: string;
  condition?: string;
  category?: string;
  search?: string;
  inventoryType?: string;
  /** L4サブフィルター: マスター在庫タイプ (regular/set/mu/parts) */
  masterInventoryType?: MasterInventoryType;
  pricePhase?: string;
  daysHeldMin?: number;
  daysHeldMax?: number;
  site?: string;
  ebayAccount?: string;
  variationStatus?: string;
  /** マスターアイテムのみ表示（画像登録済み or 手動登録） */
  masterOnly?: boolean;
  /** データ未完成のみ表示（title_en or categoryが未設定） */
  dataIncomplete?: boolean;
  /** L1属性フィルター（分類1） */
  l1Category?: string;
  /** L2属性フィルター（分類2） */
  l2Category?: string;
  /** L3属性フィルター（分類3） */
  l3Category?: string;
  /** L4属性フィルター（販路） */
  l4Channel?: string;
  /** L1属性フィルター（レガシー互換） */
  attrL1?: string;
  /** L2属性フィルター（レガシー互換） */
  attrL2?: string;
  /** L3属性フィルター（レガシー互換） */
  attrL3?: string;
  /** L4属性フィルター（販売予定販路、複数選択） */
  attrL4?: string[];
  /** 画像なしのみ */
  noImages?: boolean;
  /** 最小在庫数（この数以上の在庫がある商品のみ） */
  minStock?: number;
  /** 最大在庫数（この数以下の在庫の商品のみ） */
  maxStock?: number;
  /** 保管場所フィルター */
  storageLocation?: string;
  /** アーカイブフィルター */
  isArchived?: boolean;
}

// ソートオプション型
export type SortField = 'created_at' | 'updated_at' | 'product_name' | 'sku' | 'cost_price' | 'selling_price' | 'physical_quantity';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: SortField;
  order: SortOrder;
}

// 統計型
export interface InventoryStats {
  totalCount: number;
  inStockCount: number;
  mjtCount: number;
  greenCount: number;
  totalCostJpy: number;
  variationCandidateCount: number;
  variationParentCount: number;
  variationMemberCount: number;
  standaloneCount: number;
  setCount: number;
  archivedCount: number;
  // 🔥 フェーズ2: L4マスター在庫タイプ別カウント
  regularCount: number;  // 通常品
  muCount: number;       // 無在庫
  partsCount: number;    // 構成パーツ
}

const DEFAULT_ITEMS_PER_PAGE = 50;
const EXCHANGE_RATE_USD_JPY = 150; // 仮の為替レート

// MUG（Multi-country Listing）非英語パターン
const MUG_NON_ENGLISH_PATTERNS = [
  /\bKarten\b/i, /\bSumpf\b/i, /\bKomplett\b/i, /\bActionfigur\b/i,
  /\bCarta\b/i, /\bCarte\b/i, /\bgiapponese\b/i, /\bFigurine\b/i,
  /\bcartas\b/i, /\bFigura de acción\b/i, /\bActiefiguur\b/i, /\bFigurka\b/i,
];

/**
 * MUG派生リスティングかどうか判定
 * USD以外の通貨は除外（MUGで生成された派生リスティング）
 */
function isMugDerivedListing(item: any): boolean {
  const currency = item.ebay_data?.currency;
  if (currency && currency !== 'USD') {
    return true;
  }
  // タイトルベースの非英語検出（バックアップ）
  const title = item.product_name || '';
  if (MUG_NON_ENGLISH_PATTERNS.some(pattern => pattern.test(title))) {
    return true;
  }
  return false;
}

/**
 * セット商品の販売可能数を計算
 * 構成品の在庫数から自動計算（ボトルネック = 最小在庫）
 */
function calculateSetAvailableQuantity(
  setProduct: any,
  allProducts: Map<string, any>
): number {
  const members = setProduct.set_members;
  if (!members || !Array.isArray(members) || members.length === 0) {
    return 0;
  }
  
  let minAvailable = Infinity;
  
  for (const member of members) {
    const memberId = member.product_id;
    const requiredQty = member.quantity || 1;
    
    if (!memberId) continue;
    
    const memberProduct = allProducts.get(memberId);
    if (!memberProduct) {
      // 構成品が見つからない場合は0
      return 0;
    }
    
    const memberStock = memberProduct.physical_quantity || 0;
    const availableSets = Math.floor(memberStock / requiredQty);
    
    minAvailable = Math.min(minAvailable, availableSets);
  }
  
  return minAvailable === Infinity ? 0 : minAvailable;
}

export function useInventoryData() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
  // 🔥 v3: 在庫0も含めて全件表示がデフォルト（Gemini指示書準拠）
  // ユーザーがアーカイブしない限り、全データを作業机に表示する
  const [filter, setFilter] = useState<InventoryFilter>({});
  const [pendingCount, setPendingCount] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'created_at', order: 'desc' });
  
  // ❗ P0: 無限ループ対策 - マウントカウント追跡
  const mountCountRef = useRef(0);
  useEffect(() => {
    mountCountRef.current++;
    if (process.env.NODE_ENV === 'development' && mountCountRef.current > 3) {
      console.warn(`[useInventoryData] ⚠️ マウント回数: ${mountCountRef.current}`);
    }
    
    // 10秒後にリセット
    const timer = setTimeout(() => { mountCountRef.current = 0; }, 10000);
    return () => clearTimeout(timer);
  }, []);

  // 現在のタブ（データソース切り替え用）
  const [currentTab, setCurrentTab] = useState<string>('inventory_master');

  // データ読み込み（ページネーション対応）
  // ❗ P0: 空の依存配列で関数参照を安定化
  // tabパラメータでデータソースを切り替え:
  // - 'in_stock_master' / 'master': products_master テーブル（is_parent=true）
  // - その他: inventory_master テーブル（従来通り）
  const loadProducts = useCallback(async (tab?: string) => {
    setLoading(true);
    setError(null);
    
    const targetTab = tab || currentTab;
    if (tab) setCurrentTab(tab);
    
    try {
      let allProducts: any[] = [];
      
      // マスタータブの場合は products_master API を使用
      if (targetTab === 'in_stock_master' || targetTab === 'master') {
        // products_master API から全件取得（is_parent=true のみ）
        const response = await fetch('/api/products?list_filter=master&limit=2000');
        const data = await response.json();
        
        if (data.success && data.products) {
          allProducts = data.products;
          console.log(`[useInventoryData] products_master から ${allProducts.length} 件取得`);
          // 🔥 マスタータブのフィルターはレイアウト側で制御（タイミング競合防止）
          // setFilter はここでは呼ばない
        } else {
          throw new Error(data.error || 'products_master の取得に失敗');
        }
      } else {
        // 従来通り inventory_master テーブルから取得
        let from = 0;
        const chunkSize = 1000;
        let hasMore = true;
        
        while (hasMore) {
          const { data, error: fetchError } = await supabase
            .from('inventory_master')
            .select('*')
            .range(from, from + chunkSize - 1)
            .order('updated_at', { ascending: false });
          
          if (fetchError) throw fetchError;
          
          if (data && data.length > 0) {
            // MUG派生リスティングを除外（USD以外の通貨）
            const filteredData = data.filter(item => !isMugDerivedListing(item));
            allProducts.push(...filteredData);
            from += chunkSize;
            hasMore = data.length === chunkSize;
          } else {
            hasMore = false;
          }
          
          // 安全上限10ページ
          if (from >= 10000) {
            console.warn('[useInventoryData] 安全上限10000件に達しました');
            hasMore = false;
          }
        }
      }
      
      // データ変換（N3表示用フィールドを追加）
      // まずIDをキーにしたMapを作成（セット販売可能数計算用）
      const productMap = new Map<string, any>();
      allProducts.forEach(item => {
        productMap.set(item.id, item);
      });
      
      const inventoryProducts: InventoryProduct[] = allProducts.map(item => {
        // products_master と inventory_master のフィールド名の違いを吸収
        const sourceData = item.source_data || {};
        const marketplace = item.source_system || sourceData.marketplace || 'manual';
        const account = item.ebay_account || sourceData.ebay_account || sourceData.mercari_account || null;
        const images = item.images || [];
        
        // products_master には title / english_title があるが、inventory_master には product_name
        const productName = item.product_name || item.title || item.english_title || '';
        
        // ============================================================
        // 棚卸し表示用データ変換
        // ============================================================
        
        // 原価 (cost_jpy): 手動登録専用フィールド
        // - DBのcost_priceフィールドを使用
        // - 現時点では未登録なので0として扱う
        // - 将来的に手動で原価を入力する機能を使う
        // 注意: cost_priceには何も自動で入れない。UIから手動登録のみ。
        const rawCostPrice = item.cost_price;
        let costJpy = 0;
        // cost_priceが明示的に設定されている場合のみ使用
        // ただし、selling_priceと完全一致する場合は誤データの可能性があるので除外
        if (rawCostPrice && rawCostPrice > 0 && rawCostPrice !== item.selling_price) {
          costJpy = rawCostPrice < 1000 ? rawCostPrice * EXCHANGE_RATE_USD_JPY : rawCostPrice;
        }
        
        // 在庫数 (physical_quantity): DBの値をそのまま使用
        // - 在庫数は手動で登録・修正する
        // - 将来的に連動機能を実装予定
        const physicalQuantity = item.physical_quantity || 0;
        const listingQuantity = item.listing_quantity || 0;
        let stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock' = 'out_of_stock';
        if (physicalQuantity > 5) {
          stockStatus = 'in_stock';
        } else if (physicalQuantity > 0) {
          stockStatus = 'low_stock';
        }
        
        return {
          // 元のフィールド
          id: item.id,
          unique_id: item.unique_id,
          product_name: productName,
          sku: item.sku,
          product_type: item.product_type,
          physical_quantity: physicalQuantity,
          listing_quantity: item.listing_quantity || 0,
          cost_price: rawCostPrice,
          selling_price: item.selling_price || 0,
          condition_name: item.condition_name || '',
          category: item.category || '',
          subcategory: item.subcategory,
          images: images,
          source_data: sourceData,
          supplier_info: item.supplier_info,
          is_manual_entry: item.is_manual_entry ?? (marketplace === 'manual'),
          priority_score: item.priority_score || 0,
          notes: item.notes,
          created_at: item.created_at,
          updated_at: item.updated_at,
          marketplace: marketplace,
          account: account,
          date_acquired: item.date_acquired,
          target_sale_deadline: item.target_sale_deadline,
          inventory_type: item.inventory_type,
          current_price_phase: item.current_price_phase,
          parent_sku: item.parent_sku,
          variation_attributes: item.variation_attributes,
          is_variation_parent: item.is_variation_parent || false,
          is_variation_child: item.is_variation_child || false,
          is_variation_member: item.is_variation_member || false,
          variation_parent_id: item.variation_parent_id || null,
          
          // セット商品関連
          set_members: item.set_members || null,
          set_available_quantity: item.product_type === 'set' 
            ? calculateSetAvailableQuantity(item, productMap)
            : null,
          
          // N3表示用エイリアス
          title: productName,
          image_url: images[0] || null,
          cost_jpy: Math.round(costJpy),
          current_stock: physicalQuantity,
          stock_status: stockStatus,
          ebay_account: account,
          
          // L1-L3属性（DBから直接マッピング）
          attr_l1: item.attr_l1 || null,
          attr_l2: item.attr_l2 || null,
          attr_l3: item.attr_l3 || null,
          is_verified: item.is_verified || false,
          
          // L4属性: 販売予定販路（配列）
          attr_l4: item.attr_l4 || [],
          
          // その他経費（JSONB）
          additional_costs: item.additional_costs || {},
          
          // 総原価（原価 + 経費合計）
          total_cost_jpy: item.total_cost_jpy || 0,
          
          // 棚卸し関連
          storage_location: item.storage_location || null,
          last_counted_at: item.last_counted_at || null,
          counted_by: item.counted_by || null,
          inventory_images: item.inventory_images || [],
          
          // フラグ・メモ（棚卸し用）
          needs_count_check: item.needs_count_check || false,
          stock_confirmed: item.stock_confirmed || false,
          stock_memo: item.stock_memo || '',
          
          // 🔥 フェーズ2: L4マスター在庫タイプ
          master_inventory_type: item.master_inventory_type || null,
          is_set_component: item.is_set_component || false,
          mu_supplier_info: item.mu_supplier_info || null,
        };
      });
      
      setProducts(inventoryProducts);
      
      // 分類待ち件数取得
      const { count } = await supabase
        .from('stock_classification_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      setPendingCount(count || 0);
      
    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました');
      console.error('Inventory load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);  // supabaseはシングルトンなので依存配列不要

  // フィルタリング
  // 🔥 v2: currentTab を参照して、マスタータブでは minStock フィルターを無視
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // 🔥 マスタータブ判定：currentTab が 'in_stock_master' または 'master' の場合
    const isMasterTab = currentTab === 'in_stock_master' || currentTab === 'master';
    
    // 🔥 DEBUG: 在庫0問題のデバッグログ
    console.log('[filteredProducts] DEBUG:', {
      tab: currentTab,
      isMasterTab: isMasterTab,
      inputCount: products.length,
      filterMinStock: filter.minStock,
      firstProductStock: products[0]?.physical_quantity,
      zeroStockCount: products.filter(p => (p.physical_quantity || 0) === 0).length,
    });
    
    if (filter.marketplace) {
      if (filter.marketplace === 'unknown') {
        result = result.filter(p => !p.marketplace || p.marketplace === 'manual');
      } else {
        result = result.filter(p => p.marketplace === filter.marketplace);
      }
    }
    if (filter.productType) {
      result = result.filter(p => p.product_type === filter.productType);
    }
    if (filter.stockStatus) {
      result = result.filter(p => p.stock_status === filter.stockStatus);
    }
    if (filter.condition) {
      result = result.filter(p => p.condition_name?.toLowerCase() === filter.condition?.toLowerCase());
    }
    if (filter.category) {
      if (filter.category === 'unknown') {
        result = result.filter(p => !p.category);
      } else {
        result = result.filter(p => p.category === filter.category);
      }
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(p => 
        p.product_name?.toLowerCase().includes(searchLower) ||
        p.sku?.toLowerCase().includes(searchLower) ||
        p.unique_id?.toLowerCase().includes(searchLower)
      );
    }
    if (filter.ebayAccount) {
      if (filter.ebayAccount === 'manual') {
        result = result.filter(p => p.marketplace === 'manual' || p.is_manual_entry || !p.ebay_account);
      } else {
        result = result.filter(p => p.ebay_account?.toLowerCase() === filter.ebayAccount?.toLowerCase());
      }
    }
    if (filter.site) {
      result = result.filter(p => p.source_data?.site === filter.site);
    }
    if (filter.pricePhase) {
      result = result.filter(p => p.current_price_phase === filter.pricePhase);
    }
    if (filter.variationStatus) {
      switch (filter.variationStatus) {
        case 'parent':
          result = result.filter(p => p.is_variation_parent);
          break;
        case 'member':
          result = result.filter(p => p.is_variation_member || p.is_variation_child);
          break;
        case 'standalone':
          result = result.filter(p => !p.is_variation_parent && !p.is_variation_member && !p.is_variation_child);
          break;
      }
    }
    if (filter.daysHeldMin !== undefined || filter.daysHeldMax !== undefined) {
      const now = Date.now();
      result = result.filter(p => {
        if (!p.date_acquired) return false;
        const days = Math.floor((now - new Date(p.date_acquired).getTime()) / (1000 * 60 * 60 * 24));
        if (filter.daysHeldMin !== undefined && days < filter.daysHeldMin) return false;
        if (filter.daysHeldMax !== undefined && days > filter.daysHeldMax) return false;
        return true;
      });
    }
    
    // 在庫タイプフィルター
    if (filter.inventoryType) {
      result = result.filter(p => p.inventory_type === filter.inventoryType);
    }
    
    // 🔥 フェーズ2: L4サブフィルター（マスター在庫タイプ）
    // regular: 通常品, set: セット品, mu: 無在庫, parts: 構成パーツ
    if (filter.masterInventoryType) {
      result = result.filter(p => {
        const pAny = p as any;
        const masterType = pAny.master_inventory_type;
        const inventoryType = p.inventory_type;
        const productType = p.product_type;
        const isSetComponent = pAny.is_set_component;
        
        switch (filter.masterInventoryType) {
          case 'regular':
            // 通常品: master_inventory_type が regular、または未設定で他のタイプでない
            if (masterType === 'regular') return true;
            if (!masterType && productType !== 'set' && inventoryType !== 'mu' && !isSetComponent) return true;
            return false;
          case 'set':
            // セット品: master_inventory_type が set、または product_type が set
            return masterType === 'set' || productType === 'set';
          case 'mu':
            // 無在庫: master_inventory_type が mu、または inventory_type が mu
            return masterType === 'mu' || inventoryType === 'mu';
          case 'parts':
            // 構成パーツ: master_inventory_type が parts、または is_set_component が true
            return masterType === 'parts' || isSetComponent === true;
          default:
            return true;
        }
      });
    }
    
    // マスターアイテムフィルター（画像登録済み or 手動登録）
    if (filter.masterOnly) {
      result = result.filter(p => {
        // 画像が登録されている
        const hasImages = p.images && Array.isArray(p.images) && p.images.length > 0;
        // 手動登録された商品
        const isManual = p.is_manual_entry === true;
        // is_master_itemフラグ（将来用）
        const isMasterFlagged = (p as any).is_master_item === true;
        
        return hasImages || isManual || isMasterFlagged;
      });
    }
    
    // データ未完成フィルター（data_editingタブ用）
    if (filter.dataIncomplete) {
      result = result.filter(p => {
        // title_en または category が未設定
        const hasEnglishTitle = (p as any).title_en && (p as any).title_en.trim() !== '';
        const hasCategory = p.category && p.category.trim() !== '';
        return !hasEnglishTitle || !hasCategory;
      });
    }
    
    // L1-L3属性フィルター
    if (filter.attrL1) {
      result = result.filter(p => (p as any).attr_l1 === filter.attrL1);
    }
    if (filter.attrL2) {
      result = result.filter(p => (p as any).attr_l2 === filter.attrL2);
    }
    if (filter.attrL3) {
      result = result.filter(p => (p as any).attr_l3 === filter.attrL3);
    }
    
    // 🔥 L1-L4カテゴリフィルター（新規追加）
    if (filter.l1Category) {
      result = result.filter(p => (p as any).attr_l1 === filter.l1Category);
    }
    if (filter.l2Category) {
      result = result.filter(p => (p as any).attr_l2 === filter.l2Category);
    }
    if (filter.l3Category) {
      result = result.filter(p => (p as any).attr_l3 === filter.l3Category);
    }
    if (filter.l4Channel) {
      result = result.filter(p => {
        const productL4 = (p as any).attr_l4;
        if (!productL4 || !Array.isArray(productL4)) return false;
        return productL4.includes(filter.l4Channel);
      });
    }
    
    // 🔥 保管場所フィルター（新規追加）
    if (filter.storageLocation) {
      result = result.filter(p => p.storage_location === filter.storageLocation);
    }
    
    // 🔥 アーカイブフィルター（新規追加）
    if (filter.isArchived === true) {
      result = result.filter(p => (p as any).is_archived === true);
    } else if (filter.isArchived === false) {
      result = result.filter(p => (p as any).is_archived !== true);
    }
    
    // 画像なしフィルター
    if (filter.noImages) {
      result = result.filter(p => !p.images || !Array.isArray(p.images) || p.images.length === 0);
    }
    
    // L4属性フィルター（販売予定販路、複数選択）
    if (filter.attrL4 && filter.attrL4.length > 0) {
      result = result.filter(p => {
        const productL4 = (p as any).attr_l4;
        if (!productL4 || !Array.isArray(productL4) || productL4.length === 0) return false;
        // フィルターで指定された販路のいずれかが含まれているか
        return filter.attrL4!.some(channel => productL4.includes(channel));
      });
    }
    
    // 最小在庫数フィルター
    // 🔥 v3: マスタータブでは強制的に minStock フィルターを無視（在庫0も表示）
    const beforeMinStockFilter = result.length;
    // マスタータブなら filter.minStock の値に関係なくスキップ
    if (!isMasterTab) {
      // 非マスタータブの場合のみ minStock フィルターを適用
      if (filter.minStock !== undefined && filter.minStock > 0) {
        result = result.filter(p => (p.physical_quantity || 0) >= filter.minStock!);
      }
    }
    const afterMinStockFilter = result.length;
    
    // 🔥 DEBUG: minStockフィルターの効果を確認
    console.log('[filteredProducts] minStock filter result:', {
      isMasterTab,
      filterMinStock: filter.minStock,
      beforeFilter: beforeMinStockFilter,
      afterFilter: afterMinStockFilter,
      removedCount: beforeMinStockFilter - afterMinStockFilter,
      appliedFilter: !isMasterTab && filter.minStock !== undefined && filter.minStock > 0,
    });
    
    // 最大在庫数フィルター
    if (filter.maxStock !== undefined) {
      result = result.filter(p => (p.physical_quantity || 0) <= filter.maxStock!);
    }
    
    // ソート適用
    result.sort((a, b) => {
      let aVal: any;
      let bVal: any;
      
      switch (sortOption.field) {
        case 'created_at':
          aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
          bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        case 'updated_at':
          aVal = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          bVal = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          break;
        case 'product_name':
          aVal = a.product_name?.toLowerCase() || '';
          bVal = b.product_name?.toLowerCase() || '';
          break;
        case 'sku':
          aVal = a.sku?.toLowerCase() || '';
          bVal = b.sku?.toLowerCase() || '';
          break;
        case 'cost_price':
          aVal = a.cost_price || 0;
          bVal = b.cost_price || 0;
          break;
        case 'selling_price':
          aVal = a.selling_price || 0;
          bVal = b.selling_price || 0;
          break;
        case 'physical_quantity':
          aVal = a.physical_quantity || 0;
          bVal = b.physical_quantity || 0;
          break;
        default:
          aVal = a.created_at ? new Date(a.created_at).getTime() : 0;
          bVal = b.created_at ? new Date(b.created_at).getTime() : 0;
      }
      
      if (typeof aVal === 'string') {
        return sortOption.order === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return sortOption.order === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return result;
  }, [products, filter, sortOption, currentTab]);  // 🔥 v2: currentTab を依存配列に追加

  // 統計計算
  // 🔥 v2: L4タイプ別カウントはフィルター前の全商品から計算（タブ切り替え時に件数が変わらないように）
  const stats = useMemo((): InventoryStats => {
    const all = filteredProducts;
    const allProducts = products; // フィルター前の全商品
    
    // L4タイプ別カウントの計算関数（全商品から計算）
    const calculateL4Count = (type: 'regular' | 'set' | 'mu' | 'parts'): number => {
      return allProducts.filter(p => {
        const pAny = p as any;
        const masterType = pAny.master_inventory_type;
        const inventoryType = p.inventory_type;
        const productType = p.product_type;
        const isSetComponent = pAny.is_set_component;
        
        switch (type) {
          case 'regular':
            if (masterType === 'regular') return true;
            if (!masterType && productType !== 'set' && inventoryType !== 'mu' && !isSetComponent) return true;
            return false;
          case 'set':
            return masterType === 'set' || productType === 'set';
          case 'mu':
            return masterType === 'mu' || inventoryType === 'mu';
          case 'parts':
            return masterType === 'parts' || isSetComponent === true;
          default:
            return false;
        }
      }).length;
    };
    
    return {
      totalCount: all.length,
      inStockCount: all.filter(p => p.physical_quantity > 0).length,
      mjtCount: all.filter(p => p.ebay_account?.toLowerCase() === 'mjt').length,
      greenCount: all.filter(p => p.ebay_account?.toLowerCase() === 'green').length,
      totalCostJpy: all.reduce((sum, p) => sum + ((p.cost_jpy || 0) * (p.physical_quantity || 0)), 0),
      variationCandidateCount: all.filter(p => 
        p.category && 
        p.physical_quantity > 0 && 
        !p.is_variation_parent &&
        !p.is_variation_member &&
        !p.is_variation_child &&
        p.product_type !== 'set'
      ).length,
      variationParentCount: all.filter(p => p.is_variation_parent).length,
      variationMemberCount: all.filter(p => p.is_variation_member || p.is_variation_child).length,
      standaloneCount: all.filter(p => 
        !p.is_variation_parent && 
        !p.is_variation_member && 
        !p.is_variation_child &&
        p.product_type !== 'set'
      ).length,
      setCount: all.filter(p => p.product_type === 'set').length,
      // 🔥 アーカイブ数（全商品からカウント）
      archivedCount: allProducts.filter(p => (p as any).is_archived === true).length,
      // 🔥 フェーズ2: L4マスター在庫タイプ別カウント（全商品から計算）
      regularCount: calculateL4Count('regular'),
      muCount: calculateL4Count('mu'),
      partsCount: calculateL4Count('parts'),
    };
  }, [filteredProducts, products]);

  // カテゴリ一覧
  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  // L1-L3属性オプション一覧
  const attributeOptions = useMemo(() => {
    const l1Set = new Set<string>();
    const l2Set = new Set<string>();
    const l3Set = new Set<string>();
    
    products.forEach(p => {
      const pAny = p as any;
      if (pAny.attr_l1) l1Set.add(pAny.attr_l1);
      if (pAny.attr_l2) l2Set.add(pAny.attr_l2);
      if (pAny.attr_l3) l3Set.add(pAny.attr_l3);
    });
    
    return {
      l1: Array.from(l1Set).sort(),
      l2: Array.from(l2Set).sort(),
      l3: Array.from(l3Set).sort(),
    };
  }, [products]);

  // 画像なし商品のカウント
  const noImagesCount = useMemo(() => {
    return products.filter(p => !p.images || !Array.isArray(p.images) || p.images.length === 0).length;
  }, [products]);

  // ページネーション
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // フィルター変更時にページをリセット
  const handleSetFilter = useCallback((newFilter: InventoryFilter | ((prev: InventoryFilter) => InventoryFilter)) => {
    setFilter(newFilter);
    setCurrentPage(1);
  }, []);

  // 表示件数変更時にページをリセット
  const handleSetItemsPerPage = useCallback((newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  }, []);

  // リフレッシュ
  const refreshData = useCallback(async () => {
    await loadProducts();
  }, [loadProducts]);

  // ローカル商品データ更新（DB更新後の即時反映用）
  const updateLocalProduct = useCallback((id: string, updates: Partial<InventoryProduct>) => {
    setProducts(prev => prev.map(p => {
      if (String(p.id) === id) {
        // 在庫数更新の場合、関連フィールドも更新
        if (updates.physical_quantity !== undefined) {
          const newQty = updates.physical_quantity;
          let stockStatus: 'in_stock' | 'out_of_stock' | 'low_stock' = 'out_of_stock';
          if (newQty > 5) stockStatus = 'in_stock';
          else if (newQty > 0) stockStatus = 'low_stock';
          
          return {
            ...p,
            ...updates,
            current_stock: newQty,
            stock_status: stockStatus,
          };
        }
        return { ...p, ...updates };
      }
      return p;
    }));
  }, []);

  return {
    // データ
    products,
    filteredProducts,
    paginatedProducts,
    
    // 統計
    stats,
    categories,
    attributeOptions,
    noImagesCount,
    
    // 状態
    loading,
    error,
    pendingCount,
    
    // ページネーション
    totalItems,
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    
    // フィルター
    filter,
    setFilter: handleSetFilter,
    
    // アクション
    loadProducts,
    refreshData,
    updateLocalProduct,
    
    // ソート
    sortOption,
    setSortOption,
  };
}
