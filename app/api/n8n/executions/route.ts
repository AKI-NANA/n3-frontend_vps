// app/api/n8n/executions/route.ts
/**
 * n8n Execution 履歴 API
 * 
 * Phase A-3: Control Center から n8n 実行履歴を取得
 * 
 * GET - 実行履歴取得
 */

import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

interface N8nExecution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowId: string;
  workflowName?: string;
  status: 'success' | 'error' | 'waiting' | 'running';
  data?: any;
}

interface ExecutionListResponse {
  data: N8nExecution[];
  nextCursor?: string;
}

// ============================================================
// GET /api/n8n/executions - 実行履歴取得
// ============================================================

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const workflowId = searchParams.get('workflowId');
  const status = searchParams.get('status');
  const limit = searchParams.get('limit') || '50';
  
  try {
    const params = new URLSearchParams();
    params.set('limit', limit);
    if (workflowId) params.set('workflowId', workflowId);
    if (status) params.set('status', status);
    
    const response = await fetch(`${N8N_BASE_URL}/api/v1/executions?${params}`, {
      headers: {
        'X-N8N-API-KEY': N8N_API_KEY,
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json({
          success: true,
          executions: getMockExecutions(),
          source: 'mock',
          message: 'n8n API認証エラー - モックデータを使用',
        });
      }
      throw new Error(`n8n API error: ${response.status}`);
    }
    
    const data: ExecutionListResponse = await response.json();
    
    // 統計を計算
    const stats = calculateStats(data.data);
    
    return NextResponse.json({
      success: true,
      executions: data.data,
      stats,
      total: data.data.length,
      source: 'n8n',
    });
    
  } catch (error: any) {
    console.error('[n8n API] Executions fetch error:', error);
    
    return NextResponse.json({
      success: true,
      executions: getMockExecutions(),
      stats: {
        total: 10,
        success: 7,
        error: 2,
        running: 1,
        successRate: 77.8,
      },
      source: 'mock',
      error: error.message,
    });
  }
}

// ============================================================
// ヘルパー関数
// ============================================================

function calculateStats(executions: N8nExecution[]) {
  const total = executions.length;
  const success = executions.filter(e => e.status === 'success').length;
  const error = executions.filter(e => e.status === 'error').length;
  const running = executions.filter(e => e.status === 'running' || e.status === 'waiting').length;
  
  return {
    total,
    success,
    error,
    running,
    successRate: total > 0 ? Math.round((success / total) * 1000) / 10 : 0,
  };
}

function getMockExecutions(): N8nExecution[] {
  const now = new Date();
  return [
    { 
      id: 'exec-1', 
      finished: true, 
      mode: 'webhook', 
      startedAt: new Date(now.getTime() - 300000).toISOString(),
      stoppedAt: new Date(now.getTime() - 295000).toISOString(),
      workflowId: '1', 
      workflowName: '【出品】01_ローカル-eBay出品処理',
      status: 'success' 
    },
    { 
      id: 'exec-2', 
      finished: true, 
      mode: 'webhook', 
      startedAt: new Date(now.getTime() - 600000).toISOString(),
      stoppedAt: new Date(now.getTime() - 590000).toISOString(),
      workflowId: '3', 
      workflowName: '【在庫】01_GlobalStockKiller',
      status: 'success' 
    },
    { 
      id: 'exec-3', 
      finished: true, 
      mode: 'webhook', 
      startedAt: new Date(now.getTime() - 900000).toISOString(),
      stoppedAt: new Date(now.getTime() - 895000).toISOString(),
      workflowId: '5', 
      workflowName: '【リサーチ】01_自律型リサーチAgent',
      status: 'error' 
    },
    { 
      id: 'exec-4', 
      finished: false, 
      mode: 'webhook', 
      startedAt: new Date(now.getTime() - 60000).toISOString(),
      workflowId: '1', 
      workflowName: '【出品】01_ローカル-eBay出品処理',
      status: 'running' 
    },
    { 
      id: 'exec-5', 
      finished: true, 
      mode: 'trigger', 
      startedAt: new Date(now.getTime() - 1200000).toISOString(),
      stoppedAt: new Date(now.getTime() - 1190000).toISOString(),
      workflowId: '9', 
      workflowName: '【司令塔】09_Sentinel監視',
      status: 'success' 
    },
  ];
}
