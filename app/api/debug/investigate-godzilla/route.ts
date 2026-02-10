/**
 * Little Godzilla 調査API
 * GET /api/debug/investigate-godzilla
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const report: any = {
    timestamp: new Date().toISOString(),
    godzillaProducts: [],
    masterCount: 0,
    dataEditingCount: 0,
    archivedCount: 0,
    orphanIds: [],
    orphanDetails: [],
    statusDistribution: {},
  };
  
  try {
    // 1. Godzilla関連商品を検索
    const { data: godzillaProducts, error: searchError } = await supabase
      .from('products_master')
      .select('id, sku, title, english_title, is_parent, is_archived, physical_quantity, workflow_status, listing_status')
      .or('title.ilike.%godzilla%,english_title.ilike.%godzilla%,sku.ilike.%godzilla%');
    
    if (searchError) {
      report.errors = report.errors || [];
      report.errors.push({ step: 'godzilla_search', error: searchError.message });
    } else {
      report.godzillaProducts = godzillaProducts?.map(p => ({
        id: p.id,
        sku: p.sku,
        title: (p.title || p.english_title || '').substring(0, 100),
        is_parent: p.is_parent,
        is_archived: p.is_archived,
        physical_quantity: p.physical_quantity,
        workflow_status: p.workflow_status,
        listing_status: p.listing_status,
      })) || [];
    }
    
    // 2. 全商品のID突合（is_parent=true のみ）
    const { data: allProducts, error: allError } = await supabase
      .from('products_master')
      .select('id, sku, title, english_title, is_parent, is_archived, listing_status, workflow_status, physical_quantity')
      .eq('is_parent', true);
    
    if (allError) {
      report.errors = report.errors || [];
      report.errors.push({ step: 'all_products', error: allError.message });
    } else {
      const masterIds = new Set(allProducts?.map(p => p.id) || []);
      // データ編集: is_archived=false （nullも含む）
      const dataEditingProducts = allProducts?.filter(p => p.is_archived !== true) || [];
      const archivedProducts = allProducts?.filter(p => p.is_archived === true) || [];
      
      report.masterCount = masterIds.size;
      report.dataEditingCount = dataEditingProducts.length;
      report.archivedCount = archivedProducts.length;
      report.sum = dataEditingProducts.length + archivedProducts.length;
      report.match = report.masterCount === report.sum;
      
      // 孤児ID（どちらにも属さない）の計算 - 理論上は存在しないはず
      const dataEditingIds = new Set(dataEditingProducts.map(p => p.id));
      const archivedIds = new Set(archivedProducts.map(p => p.id));
      
      const orphanIds: number[] = [];
      masterIds.forEach(id => {
        if (!dataEditingIds.has(id) && !archivedIds.has(id)) {
          orphanIds.push(id);
        }
      });
      
      report.orphanIds = orphanIds;
      
      // 孤児がいる場合は詳細を取得
      if (orphanIds.length > 0) {
        const orphanProducts = allProducts?.filter(p => orphanIds.includes(p.id)) || [];
        report.orphanDetails = orphanProducts.map(p => ({
          id: p.id,
          sku: p.sku,
          title: (p.title || p.english_title || '').substring(0, 100),
          is_parent: p.is_parent,
          is_archived: p.is_archived,
          workflow_status: p.workflow_status,
          listing_status: p.listing_status,
        }));
      }
      
      // ステータス分布
      const statusCounts: Record<string, number> = {};
      allProducts?.forEach(p => {
        const key = `workflow=${p.workflow_status || 'null'}, listing=${p.listing_status || 'null'}, archived=${p.is_archived}`;
        statusCounts[key] = (statusCounts[key] || 0) + 1;
      });
      report.statusDistribution = statusCounts;
      
      // Little Godzilla 特定調査
      const littleGodzilla = allProducts?.find(p => 
        (p.title && p.title.toLowerCase().includes('little godzilla')) ||
        (p.english_title && p.english_title.toLowerCase().includes('little godzilla'))
      );
      
      if (littleGodzilla) {
        report.littleGodzilla = {
          found: true,
          id: littleGodzilla.id,
          sku: littleGodzilla.sku,
          title: littleGodzilla.title || littleGodzilla.english_title,
          is_parent: littleGodzilla.is_parent,
          is_archived: littleGodzilla.is_archived,
          physical_quantity: littleGodzilla.physical_quantity,
          workflow_status: littleGodzilla.workflow_status,
          listing_status: littleGodzilla.listing_status,
          shouldAppearIn: littleGodzilla.is_archived === true ? 'archived' : 'data_editing',
        };
      } else {
        report.littleGodzilla = { found: false, message: 'Little Godzilla not found in DB' };
      }
    }
    
    return NextResponse.json({
      success: true,
      report,
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      report,
    }, { status: 500 });
  }
}
