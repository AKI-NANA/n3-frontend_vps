// app/api/pipeline/autonomous/route.ts
/**
 * 自律出品パイプラインAPIエンドポイント
 * 
 * POST /api/pipeline/autonomous
 * - 単一または複数商品の自律パイプライン実行
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { 
  runAutonomousPipeline, 
  runBatchPipeline, 
  summarizePipelineResults,
  DEFAULT_PIPELINE_OPTIONS,
  type PipelineOptions 
} from '@/lib/services/pipeline/autonomous-listing-pipeline';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      productIds,
      products,
      options = {},
    } = body as {
      productIds?: (string | number)[];
      products?: any[];
      options?: Partial<PipelineOptions>;
    };
    
    let targetProducts = products || [];
    
    if (productIds && productIds.length > 0 && targetProducts.length === 0) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({
          success: false,
          error: 'Database configuration missing',
        }, { status: 500 });
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data, error } = await supabase
        .from('products_master')
        .select('*')
        .in('id', productIds);
      
      if (error) {
        return NextResponse.json({
          success: false,
          error: `Failed to fetch products: ${error.message}`,
        }, { status: 500 });
      }
      
      targetProducts = data || [];
    }
    
    if (targetProducts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No products to process',
      }, { status: 400 });
    }
    
    const pipelineOptions: PipelineOptions = {
      ...DEFAULT_PIPELINE_OPTIONS,
      ...options,
    };
    
    if (targetProducts.length === 1) {
      const result = await runAutonomousPipeline(targetProducts[0], pipelineOptions);
      
      return NextResponse.json({
        success: true,
        result: {
          productId: result.productId,
          stage: result.stage,
          progress: result.progress,
          warnings: result.warnings,
          errors: result.errors,
          result: result.result,
          logsCount: result.logs.length,
        },
      });
    } else {
      const results = await runBatchPipeline(targetProducts, pipelineOptions);
      const summary = summarizePipelineResults(results);
      
      return NextResponse.json({
        success: true,
        summary,
        results: results.map(r => ({
          productId: r.productId,
          stage: r.stage,
          result: r.result,
          warningsCount: r.warnings.length,
          errorsCount: r.errors.length,
        })),
      });
    }
    
  } catch (error) {
    console.error('[API] Pipeline error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
