// lib/inventory/set-inventory-calculator.ts
/**
 * セット商品在庫計算ユーティリティ
 * 
 * フェーズ2: セット品在庫連動
 * 
 * 計算式: 親の販売可能在庫 = MIN(構成パーツAの在庫, 構成パーツBの在庫, ...)
 */

import type { 
  SetMemberInfoExtended, 
  SetAvailabilityCalculation,
  SetInventoryInfo,
  PartsUsageInfo,
} from '@/types/inventory-extended';

// ============================================================
// 型定義
// ============================================================

interface ProductBasicInfo {
  id: string;
  product_name?: string;
  physical_quantity?: number;
}

interface SetProduct {
  id: string;
  product_name?: string;
  set_members?: SetMemberInfoExtended[] | null;
}

// ============================================================
// メイン計算関数
// ============================================================

/**
 * セット商品の販売可能数を計算（MINロジック）
 * 
 * @param setProduct セット商品データ
 * @param allProducts 全商品のMap（ID → 商品データ）
 * @returns 計算結果
 */
export function calculateSetAvailability(
  setProduct: SetProduct,
  allProducts: Map<string, ProductBasicInfo>
): SetAvailabilityCalculation {
  const members = setProduct.set_members;
  
  // 構成品がない場合は0
  if (!members || !Array.isArray(members) || members.length === 0) {
    return {
      available_quantity: 0,
      members: [],
      bottleneck: undefined,
    };
  }
  
  let minAvailable = Infinity;
  let bottleneckMember: SetAvailabilityCalculation['bottleneck'] = undefined;
  
  const memberResults: SetAvailabilityCalculation['members'] = [];
  
  for (const member of members) {
    const memberId = member.product_id;
    const requiredQty = member.quantity || 1;
    
    if (!memberId) {
      // IDがない構成品は無視
      continue;
    }
    
    const memberProduct = allProducts.get(memberId);
    
    if (!memberProduct) {
      // 構成品が見つからない場合は0（セット作成不可）
      memberResults.push({
        product_id: memberId,
        product_name: member.product_name,
        required_quantity: requiredQty,
        current_stock: 0,
        available_sets: 0,
        is_bottleneck: true,
      });
      
      return {
        available_quantity: 0,
        members: memberResults,
        bottleneck: {
          product_id: memberId,
          product_name: member.product_name,
          limiting_factor: 0,
        },
      };
    }
    
    const memberStock = memberProduct.physical_quantity || 0;
    const availableSets = Math.floor(memberStock / requiredQty);
    
    memberResults.push({
      product_id: memberId,
      product_name: memberProduct.product_name || member.product_name,
      required_quantity: requiredQty,
      current_stock: memberStock,
      available_sets: availableSets,
      is_bottleneck: false, // 後で更新
    });
    
    if (availableSets < minAvailable) {
      minAvailable = availableSets;
      bottleneckMember = {
        product_id: memberId,
        product_name: memberProduct.product_name || member.product_name,
        limiting_factor: availableSets,
      };
    }
  }
  
  // ボトルネックをマーク
  if (bottleneckMember) {
    const bottleneckIndex = memberResults.findIndex(m => m.product_id === bottleneckMember!.product_id);
    if (bottleneckIndex >= 0) {
      memberResults[bottleneckIndex].is_bottleneck = true;
    }
  }
  
  return {
    available_quantity: minAvailable === Infinity ? 0 : minAvailable,
    members: memberResults,
    bottleneck: bottleneckMember,
  };
}

/**
 * 複数のセット商品の在庫を一括計算
 * 
 * @param setProducts セット商品の配列
 * @param allProducts 全商品のMap
 * @returns セット商品ID → 計算結果のMap
 */
export function calculateMultipleSetAvailability(
  setProducts: SetProduct[],
  allProducts: Map<string, ProductBasicInfo>
): Map<string, SetAvailabilityCalculation> {
  const results = new Map<string, SetAvailabilityCalculation>();
  
  for (const setProduct of setProducts) {
    const calculation = calculateSetAvailability(setProduct, allProducts);
    results.set(setProduct.id, calculation);
  }
  
  return results;
}

/**
 * 構成パーツの使用状況を計算
 * 
 * @param partsProductId 構成パーツの商品ID
 * @param setProducts 全セット商品の配列
 * @param partsStock 構成パーツの在庫数
 * @returns 使用状況情報
 */
export function calculatePartsUsage(
  partsProductId: string,
  partsProductName: string | undefined,
  setProducts: SetProduct[],
  partsStock: number
): PartsUsageInfo {
  const usedInSets: PartsUsageInfo['used_in_sets'] = [];
  let totalReserved = 0;
  
  for (const setProduct of setProducts) {
    const members = setProduct.set_members;
    if (!members || !Array.isArray(members)) continue;
    
    const memberInfo = members.find(m => m.product_id === partsProductId);
    if (memberInfo) {
      usedInSets.push({
        set_product_id: setProduct.id,
        set_product_name: setProduct.product_name,
        required_quantity: memberInfo.quantity || 1,
      });
      
      // 予約数は「セットが1つ作れる数」×「必要数」
      // ただし実際の計算はより複雑（他の構成品の在庫も影響する）
      totalReserved += memberInfo.quantity || 1;
    }
  }
  
  return {
    parts_product_id: partsProductId,
    parts_product_name: partsProductName,
    used_in_sets: usedInSets,
    total_reserved: totalReserved,
    available_for_new_sets: Math.max(0, partsStock - totalReserved),
  };
}

// ============================================================
// ヘルパー関数
// ============================================================

/**
 * 商品配列からMapを作成
 */
export function createProductMap(products: ProductBasicInfo[]): Map<string, ProductBasicInfo> {
  const map = new Map<string, ProductBasicInfo>();
  for (const product of products) {
    map.set(product.id, product);
  }
  return map;
}

/**
 * セット商品かどうかを判定
 */
export function isSetProduct(product: any): boolean {
  return (
    product.product_type === 'set' ||
    product.master_inventory_type === 'set' ||
    (product.set_members && Array.isArray(product.set_members) && product.set_members.length > 0)
  );
}

/**
 * 構成パーツかどうかを判定
 */
export function isPartsProduct(product: any): boolean {
  return (
    product.master_inventory_type === 'parts' ||
    product.is_set_component === true
  );
}

/**
 * 無在庫商品かどうかを判定
 */
export function isMUProduct(product: any): boolean {
  return (
    product.master_inventory_type === 'mu' ||
    product.inventory_type === 'mu'
  );
}

/**
 * 通常品かどうかを判定
 */
export function isRegularProduct(product: any): boolean {
  return (
    product.master_inventory_type === 'regular' ||
    (!isSetProduct(product) && !isPartsProduct(product) && !isMUProduct(product))
  );
}

/**
 * セット商品の在庫変動をシミュレート
 * 
 * @param setId セット商品ID
 * @param deltaSets 変動数（正: 増加, 負: 減少）
 * @param setProducts セット商品配列
 * @param allProducts 全商品Map
 * @returns 各構成パーツの変動後在庫
 */
export function simulateSetStockChange(
  setId: string,
  deltaSets: number,
  setProducts: SetProduct[],
  allProducts: Map<string, ProductBasicInfo>
): Map<string, number> {
  const result = new Map<string, number>();
  
  const setProduct = setProducts.find(p => p.id === setId);
  if (!setProduct || !setProduct.set_members) {
    return result;
  }
  
  for (const member of setProduct.set_members) {
    const memberId = member.product_id;
    const requiredQty = member.quantity || 1;
    const memberProduct = allProducts.get(memberId);
    
    if (memberProduct) {
      const currentStock = memberProduct.physical_quantity || 0;
      const newStock = currentStock - (deltaSets * requiredQty);
      result.set(memberId, Math.max(0, newStock));
    }
  }
  
  return result;
}

// ============================================================
// フォーマット関数
// ============================================================

/**
 * 在庫計算結果を表示用テキストに変換
 */
export function formatSetAvailabilityText(calculation: SetAvailabilityCalculation): string {
  if (calculation.available_quantity === 0) {
    if (calculation.bottleneck) {
      return `在庫なし（${calculation.bottleneck.product_name || calculation.bottleneck.product_id}が不足）`;
    }
    return '在庫なし';
  }
  
  let text = `${calculation.available_quantity}セット作成可能`;
  
  if (calculation.bottleneck) {
    text += ` (制限: ${calculation.bottleneck.product_name || calculation.bottleneck.product_id})`;
  }
  
  return text;
}

/**
 * 構成パーツの使用状況を表示用テキストに変換
 */
export function formatPartsUsageText(usage: PartsUsageInfo): string {
  if (usage.used_in_sets.length === 0) {
    return '未使用';
  }
  
  const setNames = usage.used_in_sets.map(s => s.set_product_name || s.set_product_id).join(', ');
  return `${usage.used_in_sets.length}セットで使用: ${setNames}`;
}
