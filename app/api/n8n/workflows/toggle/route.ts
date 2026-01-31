// app/api/n8n/workflows/toggle/route.ts
/**
 * n8n ワークフロー ON/OFF切り替えAPI
 */
import { NextRequest, NextResponse } from 'next/server';

const N8N_BASE_URL = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workflowId, active } = body;

    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflowId is required' },
        { status: 400 }
      );
    }

    // n8n APIでワークフローを有効/無効化
    const response = await fetch(
      `${N8N_BASE_URL}/api/v1/workflows/${workflowId}${active ? '/activate' : '/deactivate'}`,
      {
        method: 'POST',
        headers: {
          'X-N8N-API-KEY': N8N_API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n toggle error:', errorText);
      return NextResponse.json(
        { error: 'Failed to toggle workflow', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      workflow: data,
    });

  } catch (error) {
    console.error('n8n toggle API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
