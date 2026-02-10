// app/api/n8n/workflows/route.ts
/**
 * n8n Workflow 管理 API
 * 
 * Phase A-3: Control Center から n8n ワークフロー一覧を取得・管理
 * 
 * GET  - ワークフロー一覧取得
 * POST - ワークフローの有効化/無効化
 */

import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

interface N8nWorkflow {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: Array<{ id: string; name: string }>;
}

interface WorkflowListResponse {
  data: N8nWorkflow[];
  nextCursor?: string;
}

// ============================================================
// GET /api/n8n/workflows - ワークフロー一覧取得
// ============================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const active = searchParams.get('active');
  const limit = searchParams.get('limit') || '100';
  
  try {
    const params = new URLSearchParams();
    params.set('limit', limit);
    if (active !== null) {
      params.set('active', active);
    }
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/workflows?${params}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      // n8n API が利用できない場合はモックデータを返す
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          success: true,
          workflows: getMockWorkflows(),
          source: 'mock',
          message: 'n8n API認証エラー - モックデータを使用',
        });
      }
      throw new Error(`n8n API error: ${response.status}`);
    }
    
    const data: WorkflowListResponse = await response.json();
    
    // ワークフローをカテゴリ別に整理
    const categorized = categorizeWorkflows(data.data);
    
    return NextResponse.json({
      success: true,
      workflows: data.data,
      categorized,
      total: data.data.length,
      source: 'n8n',
    });
    
  } catch (error: any) {
    console.error('[n8n API] Workflows fetch error:', error);
    
    // エラー時はモックデータを返す
    return NextResponse.json({
      success: true,
      workflows: getMockWorkflows(),
      source: 'mock',
      error: error.message,
    });
  }
}

// ============================================================
// POST /api/n8n/workflows - ワークフロー有効化/無効化
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, action } = body;
    
    if (!workflowId || !action) {
      return NextResponse.json(
        { success: false, error: 'workflowId and action are required' },
        { status: 400 }
      );
    }
    
    if (!['activate', 'deactivate'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'action must be "activate" or "deactivate"' },
        { status: 400 }
      );
    }
    
    const endpoint = action === 'activate' 
      ? `${N8N_BASE_URL}/api/v1/workflows/${workflowId}/activate`
      : `${N8N_BASE_URL}/api/v1/workflows/${workflowId}/deactivate`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      workflow: data,
      action,
    });
    
  } catch (error: any) {
    console.error('[n8n API] Workflow action error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ============================================================
// ヘルパー関数
// ============================================================

function categorizeWorkflows(workflows: N8nWorkflow[]): Record<string, N8nWorkflow[]> {
  const categories: Record<string, N8nWorkflow[]> = {
    listing: [],
    inventory: [],
    research: [],
    media: [],
    finance: [],
    system: [],
    defense: [],
    empire: [],
    other: [],
  };
  
  for (const wf of workflows) {
    const name = wf.name.toLowerCase();
    
    if (name.includes('出品') || name.includes('listing')) {
      categories.listing.push(wf);
    } else if (name.includes('在庫') || name.includes('inventory') || name.includes('stock')) {
      categories.inventory.push(wf);
    } else if (name.includes('リサーチ') || name.includes('research') || name.includes('amazon')) {
      categories.research.push(wf);
    } else if (name.includes('メディア') || name.includes('media') || name.includes('youtube')) {
      categories.media.push(wf);
    } else if (name.includes('経理') || name.includes('finance') || name.includes('価格')) {
      categories.finance.push(wf);
    } else if (name.includes('司令') || name.includes('system') || name.includes('sentinel')) {
      categories.system.push(wf);
    } else if (name.includes('防衛') || name.includes('defense')) {
      categories.defense.push(wf);
    } else if (name.includes('帝国') || name.includes('empire') || name.includes('外注')) {
      categories.empire.push(wf);
    } else {
      categories.other.push(wf);
    }
  }
  
  return categories;
}

function getMockWorkflows(): N8nWorkflow[] {
  return [
    { id: '1', name: '【出品】01_ローカル-eBay出品処理', active: true, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '2', name: '【出品】02_エラー復旧エージェント', active: true, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '3', name: '【在庫】01_GlobalStockKiller', active: true, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '4', name: '【在庫】06_inventory-monitoring', active: true, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '5', name: '【リサーチ】01_自律型リサーチAgent', active: true, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '6', name: '【リサーチ】02_SM高度自動化バッチ', active: false, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '7', name: '【メディア】M1_Remotion動画生成', active: false, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '8', name: '【メディア】M2_ElevenLabs音声生成', active: false, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '9', name: '【司令塔】09_Sentinel監視', active: true, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
    { id: '10', name: '【経理】01_MoneyForward連携', active: false, createdAt: '2025-01-01', updatedAt: '2026-01-27' },
  ];
}
