// app/api/audit/ai-review/route.ts
/**
 * AI監査APIエンドポイント
 * 
 * POST /api/audit/ai-review
 * Body: { products, auditReports, provider?: 'gemini' | 'claude' }
 * 
 * Gemini/Claude APIを使用して、ルールエンジンで解決できない
 * HTS/原産国/素材の問題を分析し、修正提案を返す
 */

import { NextRequest, NextResponse } from 'next/server';
import { runAiAudit, type AuditAiConfig } from '@/lib/services/ai/audit-ai-service';
import type { Product } from '@/app/tools/editing/types/product';
import type { ProductAuditReport } from '@/lib/services/audit';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      products, 
      auditReports, 
      provider = 'gemini',
      maxProducts = 10,
      minConfidenceThreshold = 0.85,
    } = body as {
      products: Product[];
      auditReports: ProductAuditReport[];
      provider?: 'gemini' | 'claude';
      maxProducts?: number;
      minConfidenceThreshold?: number;
    };
    
    // バリデーション
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'products is required and must be a non-empty array' },
        { status: 400 }
      );
    }
    
    if (!auditReports || !Array.isArray(auditReports)) {
      return NextResponse.json(
        { success: false, error: 'auditReports is required and must be an array' },
        { status: 400 }
      );
    }
    
    // AI監査の設定
    const config: Partial<AuditAiConfig> = {
      provider,
      maxProducts,
      minConfidenceThreshold,
      timeoutMs: 30000,
    };
    
    // AI監査を実行
    const result = await runAiAudit(products, auditReports, config);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          processingTimeMs: result.processingTimeMs,
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      provider: result.provider,
      responses: result.responses,
      tokensUsed: result.tokensUsed,
      costUsd: result.costUsd,
      processingTimeMs: result.processingTimeMs,
    });
    
  } catch (error) {
    console.error('[API] AI Audit error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
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
