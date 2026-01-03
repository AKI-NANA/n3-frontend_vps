// app/api/products/attributes/route.ts
/**
 * 商品属性オプション取得API
 * 
 * 階層フィルター用の属性選択肢を取得
 * - attr_l1（大分類）の一意な値リスト
 * - attr_l2（中分類）の一意な値リスト
 * - attr_l3（小分類）の一意な値リスト
 * - 親子関係マップ（l1→l2, l2→l3）
 * 
 * @version 1.0.0
 * @date 2025-12-22
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    console.log('[attributes/route] Fetching attribute options...');
    
    // inventory_masterから属性を取得
    // まずはproducts_masterから試し、なければモックデータを返す
    const { data: products, error } = await supabase
      .from('products_master')
      .select('attribute_level1, attribute_level2, attribute_level3')
      .not('attribute_level1', 'is', null);
    
    if (error) {
      console.warn('[attributes/route] DB query failed, using fallback:', error.message);
      
      // フォールバック: inventory_masterから取得を試みる
      const { data: inventory, error: invError } = await supabase
        .from('inventory_master')
        .select('attribute_level1, attribute_level2, attribute_level3')
        .not('attribute_level1', 'is', null);
      
      if (invError || !inventory || inventory.length === 0) {
        // 完全なフォールバック: モックデータを返す
        return NextResponse.json({
          success: true,
          attributes: {
            l1: ['MTG', 'Pokemon', 'Yu-Gi-Oh', 'ワンピース', 'その他TCG'],
            l2: ['シングルカード', 'ボックス', 'パック', 'サプライ', 'セット'],
            l3: ['日本語版', '英語版', 'Foil', '初版', 'PSA鑑定品'],
          },
          hierarchyMap: {
            l1ToL2: {
              'MTG': ['シングルカード', 'ボックス', 'パック', 'サプライ'],
              'Pokemon': ['シングルカード', 'ボックス', 'パック', 'サプライ', 'PSA鑑定品'],
              'Yu-Gi-Oh': ['シングルカード', 'ボックス', 'パック'],
              'ワンピース': ['シングルカード', 'ボックス', 'パック'],
              'その他TCG': ['シングルカード', 'ボックス', 'サプライ'],
            },
            l2ToL3: {
              'シングルカード': ['日本語版', '英語版', 'Foil', '初版'],
              'ボックス': ['日本語版', '英語版', '初版'],
              'パック': ['日本語版', '英語版'],
              'サプライ': ['日本語版', '英語版'],
              'PSA鑑定品': ['PSA10', 'PSA9', 'PSA8'],
            },
          },
          source: 'mock',
          fetchedAt: new Date().toISOString(),
        });
      }
      
      // inventory_masterからの結果を処理
      const result = processAttributes(inventory);
      return NextResponse.json({
        success: true,
        ...result,
        source: 'inventory_master',
        fetchedAt: new Date().toISOString(),
      });
    }
    
    // products_masterからの結果を処理
    const result = processAttributes(products);
    
    const duration = Date.now() - startTime;
    console.log(`[attributes/route] Fetched in ${duration}ms - L1: ${result.attributes.l1.length}, L2: ${result.attributes.l2.length}, L3: ${result.attributes.l3.length}`);
    
    return NextResponse.json({
      success: true,
      ...result,
      source: 'products_master',
      fetchedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[attributes/route] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      // エラー時もモックデータを返す
      attributes: {
        l1: ['フィギュア', 'カード', 'ゲーム', 'アパレル', 'その他'],
        l2: ['アクションフィギュア', 'スケールフィギュア', 'トレカ', 'サプライ'],
        l3: ['ワンピース', 'ドラゴンボール', '鬼滅の刃', 'その他'],
      },
      hierarchyMap: { l1ToL2: {}, l2ToL3: {} },
    }, { status: 500 });
  }
}

/**
 * 属性データを処理して一意な値リストと階層マップを生成
 */
function processAttributes(data: Array<{
  attribute_level1?: string | null;
  attribute_level2?: string | null;
  attribute_level3?: string | null;
}>) {
  const l1Set = new Set<string>();
  const l2Set = new Set<string>();
  const l3Set = new Set<string>();
  const l1ToL2: Record<string, Set<string>> = {};
  const l2ToL3: Record<string, Set<string>> = {};
  
  for (const row of data) {
    const l1 = row.attribute_level1;
    const l2 = row.attribute_level2;
    const l3 = row.attribute_level3;
    
    if (l1) {
      l1Set.add(l1);
      
      if (l2) {
        l2Set.add(l2);
        if (!l1ToL2[l1]) l1ToL2[l1] = new Set();
        l1ToL2[l1].add(l2);
        
        if (l3) {
          l3Set.add(l3);
          if (!l2ToL3[l2]) l2ToL3[l2] = new Set();
          l2ToL3[l2].add(l3);
        }
      }
    }
  }
  
  // SetをArrayに変換してソート
  const toSortedArray = (set: Set<string>) => Array.from(set).sort();
  const mapSetToArray = (map: Record<string, Set<string>>) => {
    const result: Record<string, string[]> = {};
    for (const [key, set] of Object.entries(map)) {
      result[key] = toSortedArray(set);
    }
    return result;
  };
  
  return {
    attributes: {
      l1: toSortedArray(l1Set),
      l2: toSortedArray(l2Set),
      l3: toSortedArray(l3Set),
    },
    hierarchyMap: {
      l1ToL2: mapSetToArray(l1ToL2),
      l2ToL3: mapSetToArray(l2ToL3),
    },
  };
}
