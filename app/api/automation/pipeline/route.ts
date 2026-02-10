// app/api/automation/pipeline/route.ts
/**
 * 🔄 Auto Pipeline API
 * 
 * Phase E-2: 自動パイプライン構築
 * 
 * Research → Editing → Listing を完全自動接続
 * 
 * @usage GET /api/automation/pipeline - パイプライン状態取得
 * @usage POST /api/automation/pipeline - パイプライン手動実行
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getKillSwitchStatus } from '@/lib/guards/kill-switch';

// ============================================================
// 型定義
// ============================================================

interface PipelineCandidate {
  id: string;
  sku: string;
  title: string;
  price_jpy: number;
  profit_margin: number;
  current_stock: number;
  category_id: string;
  primary_image_url: string;
  gallery_images: string[];
  completeness_score: number;
  missing_fields: string[];
  pipeline_stage: string;
}

// ============================================================
// 完全性チェック
// ============================================================

const REQUIRED_FIELDS = [
  'title',
  'english_title',
  'price_jpy',
  'cost_price',
  'profit_margin',
  'current_stock',
  'category_id',
  'primary_image_url',
  'weight_g',
  'hts_code',
];

function checkCompleteness(product: any): { score: number; missing: string[] } {
  const missing: string[] = [];
  let filled = 0;
  
  for (const field of REQUIRED_FIELDS) {
    if (product[field] !== null && product[field] !== undefined && product[field] !== '') {
      filled++;
    } else {
      missing.push(field);
    }
  }
  
  // 画像チェック
  if (!product.primary_image_url) {
    missing.push('primary_image_url');
  }
  if (!product.gallery_images || product.gallery_images.length < 3) {
    missing.push('gallery_images (min 3)');
  }
  
  const score = Math.round((filled / REQUIRED_FIELDS.length) * 100);
  
  return { score, missing };
}

// ============================================================
// パイプラインステージ判定
// ============================================================

function determinePipelineStage(product: any): string {
  const { score } = checkCompleteness(product);
  
  // リサーチ段階（データ不足）
  if (score < 50) {
    return 'research';
  }
  
  // 編集段階（データ整形中）
  if (score < 80) {
    return 'editing';
  }
  
  // 出品準備完了
  if (score >= 80 && product.current_stock > 0 && product.profit_margin > 10) {
    return 'listing_ready';
  }
  
  // 在庫なし
  if (product.current_stock <= 0) {
    return 'out_of_stock';
  }
  
  // 利益率不足
  if (product.profit_margin <= 10) {
    return 'low_margin';
  }
  
  return 'editing';
}

// ============================================================
// GET /api/automation/pipeline - パイプライン状態取得
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // products_master から取得
    let query = supabase
      .from('products_master')
      .select(`
        id, sku, title, english_title, price_jpy, cost_price,
        profit_margin, current_stock, category_id, category_name,
        primary_image_url, gallery_images, weight_g, hts_code,
        listing_status, created_at, updated_at
      `)
      .eq('is_archived', false)
      .order('updated_at', { ascending: false })
      .limit(limit);
    
    const { data: products, error } = await query;
    
    if (error) {
      console.error('[Pipeline] Failed to fetch products:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    // パイプライン分類
    const pipeline: Record<string, PipelineCandidate[]> = {
      research: [],
      editing: [],
      listing_ready: [],
      out_of_stock: [],
      low_margin: [],
      listed: [],
    };
    
    const stats = {
      total: 0,
      research: 0,
      editing: 0,
      listing_ready: 0,
      out_of_stock: 0,
      low_margin: 0,
      listed: 0,
    };
    
    for (const product of products || []) {
      const { score, missing } = checkCompleteness(product);
      const pipelineStage = product.listing_status === 'active' 
        ? 'listed' 
        : determinePipelineStage(product);
      
      const candidate: PipelineCandidate = {
        id: product.id,
        sku: product.sku,
        title: product.title || product.english_title || 'Untitled',
        price_jpy: product.price_jpy || 0,
        profit_margin: product.profit_margin || 0,
        current_stock: product.current_stock || 0,
        category_id: product.category_id,
        primary_image_url: product.primary_image_url,
        gallery_images: product.gallery_images || [],
        completeness_score: score,
        missing_fields: missing,
        pipeline_stage: pipelineStage,
      };
      
      pipeline[pipelineStage].push(candidate);
      stats.total++;
      stats[pipelineStage as keyof typeof stats]++;
    }
    
    // ステージフィルタ
    if (stage && pipeline[stage]) {
      return NextResponse.json({
        success: true,
        stage,
        candidates: pipeline[stage],
        count: pipeline[stage].length,
        stats,
      });
    }
    
    return NextResponse.json({
      success: true,
      pipeline,
      stats,
    });
    
  } catch (error: any) {
    console.error('[Pipeline] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// POST /api/automation/pipeline - パイプライン手動実行
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Kill Switch チェック
    const killSwitchStatus = await getKillSwitchStatus();
    if (killSwitchStatus.active) {
      return NextResponse.json(
        { success: false, error: 'Kill Switch is active' },
        { status: 503 }
      );
    }
    
    const body = await request.json();
    const { action, product_ids, auto_queue } = body;
    
    const supabase = createClient();
    
    // 出品準備完了商品を取得
    if (action === 'queue_listing_ready' || auto_queue) {
      const { data: readyProducts, error } = await supabase
        .from('products_master')
        .select('id, sku, title, profit_margin, current_stock')
        .eq('is_archived', false)
        .neq('listing_status', 'active')
        .gt('current_stock', 0)
        .gt('profit_margin', 10)
        .limit(100);
      
      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      
      // 完全性チェックして出品キューに投入
      const queuedIds: string[] = [];
      
      for (const product of readyProducts || []) {
        // 完全な商品データを取得
        const { data: fullProduct } = await supabase
          .from('products_master')
          .select('*')
          .eq('id', product.id)
          .single();
        
        if (fullProduct) {
          const { score } = checkCompleteness(fullProduct);
          
          if (score >= 80) {
            // 出品キューに追加
            await supabase
              .from('n3_listing_queue')
              .upsert({
                product_id: product.id,
                sku: product.sku,
                status: 'pending',
                priority: Math.round(product.profit_margin),
                queued_at: new Date().toISOString(),
              });
            
            queuedIds.push(product.id);
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        action: 'queue_listing_ready',
        queued_count: queuedIds.length,
        queued_ids: queuedIds,
      });
    }
    
    // 個別商品のパイプライン進行
    if (action === 'advance' && product_ids?.length > 0) {
      const results: { id: string; from: string; to: string }[] = [];
      
      for (const productId of product_ids) {
        const { data: product } = await supabase
          .from('products_master')
          .select('*')
          .eq('id', productId)
          .single();
        
        if (product) {
          const currentStage = determinePipelineStage(product);
          const { score } = checkCompleteness(product);
          
          // 出品準備完了の場合、キューに投入
          if (currentStage === 'listing_ready' && score >= 80) {
            await supabase
              .from('n3_listing_queue')
              .upsert({
                product_id: productId,
                sku: product.sku,
                status: 'pending',
                priority: Math.round(product.profit_margin || 0),
                queued_at: new Date().toISOString(),
              });
            
            results.push({
              id: productId,
              from: currentStage,
              to: 'listing_queue',
            });
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        action: 'advance',
        results,
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('[Pipeline] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
