/**
 * 商品消失調査API v2
 * GET /api/debug/missing-products
 * 
 * マスター vs データ編集 vs アーカイブ の突合調査
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function isArchived(p: any): boolean {
  return p.is_archived === true || p.listing_status === 'archived';
}

export async function GET(request: NextRequest) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const searchKeyword = request.nextUrl.searchParams.get('search') || '';
  
  const report: any = {
    timestamp: new Date().toISOString(),
    searchKeyword,
    summary: {},
    masterProducts: [],
    dataEditingProducts: [],
    archivedProducts: [],
    missingFromDataEditing: [],
    unexpectedlyArchived: [],
    notParent: [],
  };
  
  try {
    // 全商品取得（is_parent=true）
    const { data: allProducts, error } = await supabase
      .from('products_master')
      .select('id, sku, title, english_title, is_parent, is_archived, listing_status, workflow_status, physical_quantity')
      .eq('is_parent', true);
    
    if (error) throw error;
    
    // 各タブに分類
    const masterProducts = allProducts || [];
    const dataEditingProducts = masterProducts.filter(p => !isArchived(p));
    const archivedProducts = masterProducts.filter(p => isArchived(p));
    
    report.summary = {
      master: masterProducts.length,
      dataEditing: dataEditingProducts.length,
      archived: archivedProducts.length,
      sum: dataEditingProducts.length + archivedProducts.length,
      match: masterProducts.length === dataEditingProducts.length + archivedProducts.length,
    };
    
    // キーワード検索がある場合
    if (searchKeyword) {
      const searchLower = searchKeyword.toLowerCase();
      
      const matchingProducts = masterProducts.filter(p =>
        (p.title && p.title.toLowerCase().includes(searchLower)) ||
        (p.english_title && p.english_title.toLowerCase().includes(searchLower)) ||
        (p.sku && p.sku.toLowerCase().includes(searchLower))
      );
      
      report.searchResults = {
        keyword: searchKeyword,
        totalMatches: matchingProducts.length,
        products: matchingProducts.map(p => ({
          id: p.id,
          sku: p.sku,
          title: (p.title || p.english_title || '').substring(0, 100),
          is_parent: p.is_parent,
          is_archived: p.is_archived,
          listing_status: p.listing_status,
          workflow_status: p.workflow_status,
          physical_quantity: p.physical_quantity,
          // 判定結果
          isArchivedByFunction: isArchived(p),
          shouldAppearIn: isArchived(p) ? 'archived' : 'data_editing',
          // 隠れフィルタの検出
          hiddenFilterReasons: [] as string[],
        })),
      };
      
      // 各商品の隠れフィルタ理由を分析
      report.searchResults.products.forEach((p: any) => {
        if (p.is_archived === true) {
          p.hiddenFilterReasons.push('is_archived=true');
        }
        if (p.listing_status === 'archived') {
          p.hiddenFilterReasons.push('listing_status=archived');
        }
        if (p.is_parent !== true) {
          p.hiddenFilterReasons.push('is_parent is not true');
        }
      });
    }
    
    // listing_status='archived' だが is_archived=false の商品を特定
    const unexpectedlyArchivedByListingStatus = masterProducts.filter(p =>
      p.listing_status === 'archived' && p.is_archived !== true
    );
    
    if (unexpectedlyArchivedByListingStatus.length > 0) {
      report.hiddenFilterIssue = {
        description: 'listing_status="archived" により、is_archived=false でもデータ編集から除外されている商品',
        count: unexpectedlyArchivedByListingStatus.length,
        products: unexpectedlyArchivedByListingStatus.map(p => ({
          id: p.id,
          sku: p.sku,
          title: (p.title || p.english_title || '').substring(0, 80),
          is_archived: p.is_archived,
          listing_status: p.listing_status,
        })),
      };
    }
    
    // ステータス分布
    const statusCounts: Record<string, number> = {};
    const listingStatusCounts: Record<string, number> = {};
    
    masterProducts.forEach(p => {
      const ws = p.workflow_status || 'null';
      const ls = p.listing_status || 'null';
      statusCounts[ws] = (statusCounts[ws] || 0) + 1;
      listingStatusCounts[ls] = (listingStatusCounts[ls] || 0) + 1;
    });
    
    report.statusDistribution = {
      workflowStatus: statusCounts,
      listingStatus: listingStatusCounts,
    };
    
    return NextResponse.json({
      success: true,
      report,
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
