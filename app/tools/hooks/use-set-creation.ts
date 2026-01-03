// app/tools/editing-n3/hooks/use-set-creation.ts
/**
 * セット商品作成フック
 * 
 * 機能:
 * - セット商品の作成
 * - セット候補の検出
 * - セット価格計算
 */

'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { InventoryProduct } from './use-inventory-data';

interface CreateSetParams {
  name: string;
  memberIds: string[];
  quantities: Record<string, number>;
}

export function useSetCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  // セット在庫計算（構成商品の最小在庫数）
  const calculateSetStock = useCallback((
    members: any[],
    quantities: Record<string, number>
  ): number => {
    if (members.length === 0) return 0;
    
    let minStock = Infinity;
    
    members.forEach(member => {
      const requiredQty = quantities[String(member.id)] || 1;
      const availableStock = member.current_stock || member.physical_quantity || 0;
      // この商品で作れるセット数 = 在庫数 / 必要数
      const possibleSets = Math.floor(availableStock / requiredQty);
      minStock = Math.min(minStock, possibleSets);
    });
    
    return minStock === Infinity ? 0 : minStock;
  }, []);

  // セット商品作成
  const createSet = useCallback(async (params: CreateSetParams) => {
    setLoading(true);
    setError(null);
    
    try {
      // メンバー商品の情報を取得
      const { data: members, error: fetchError } = await supabase
        .from('inventory_master')
        .select('*')
        .in('id', params.memberIds.map(id => parseInt(id, 10)));
      
      if (fetchError) throw fetchError;
      if (!members || members.length === 0) {
        throw new Error('メンバー商品が見つかりません');
      }
      
      // セット価格計算（原価合計 + 25%マージン）
      let totalCost = 0;
      const composition = members.map(member => {
        const qty = params.quantities[String(member.id)] || 1;
        const cost = (member.cost_jpy || 0) * qty;
        totalCost += cost;
        return {
          product_id: member.id,
          sku: member.sku,
          title: member.title || member.product_name,
          quantity: qty,
          unit_cost: member.cost_jpy || 0,
          available_stock: member.current_stock || member.physical_quantity || 0,
        };
      });
      
      const setPrice = Math.ceil(totalCost * 1.25);
      
      // セット在庫計算（構成商品の最小在庫数）
      const setStock = calculateSetStock(members, params.quantities);
      
      // セット商品を作成
      const { data: newSet, error: insertError } = await supabase
        .from('inventory_master')
        .insert({
          title: params.name,
          product_name: params.name,
          sku: `SET-${Date.now()}`,
          cost_jpy: totalCost,          // 原価は合計
          selling_price: setPrice,       // 販売価格はマージン込み
          product_type: 'set',
          stock_status: setStock > 0 ? 'in_stock' : 'out_of_stock',
          current_stock: setStock,       // セット在庫
          physical_quantity: setStock,
          is_set_product: true,
          source_data: {
            set_composition: composition,
            total_member_cost: totalCost,
            margin_rate: 0.25,
            calculated_stock: setStock,
            member_ids: params.memberIds,
          },
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      // メンバー商品に親セットIDを設定
      const { error: updateError } = await supabase
        .from('inventory_master')
        .update({
          set_parent_id: newSet.id,
          is_set_member: true,
        })
        .in('id', params.memberIds.map(id => parseInt(id, 10)));
      
      if (updateError) {
        console.warn('メンバー商品の更新に失敗しました:', updateError);
        // ロールバックはしない（セット自体は作成成功）
      }
      
      return { 
        success: true, 
        set: newSet,
        calculatedStock: setStock,
        totalCost,
        setPrice,
      };
    } catch (err: any) {
      const errorMessage = err.message || 'セット商品作成に失敗しました';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [supabase, calculateSetStock]);

  // セット候補を検出（単品で在庫ありの商品）
  const findSetCandidates = useCallback((products: InventoryProduct[]): InventoryProduct[] => {
    return products.filter(p =>
      // 単品商品
      (p.product_type === 'single' || !p.product_type) &&
      // バリエーションメンバーではない
      !p.variation_parent_id &&
      // 在庫がある
      (p.stock_status === 'in_stock' || (p.current_stock && p.current_stock > 0)) &&
      // セット商品ではない
      p.product_type !== 'set'
    );
  }, []);

  // セット価格計算
  const calculateSetPrice = useCallback((
    products: InventoryProduct[],
    quantities: Record<string, number>
  ): { totalCost: number; setPrice: number; marginRate: number } => {
    let totalCost = 0;
    
    products.forEach(product => {
      const qty = quantities[String(product.id)] || 1;
      totalCost += (product.cost_jpy || 0) * qty;
    });
    
    const marginRate = 0.25;
    const setPrice = Math.ceil(totalCost * (1 + marginRate));
    
    return { totalCost, setPrice, marginRate };
  }, []);

  return {
    loading,
    error,
    createSet,
    findSetCandidates,
    calculateSetPrice,
  };
}
