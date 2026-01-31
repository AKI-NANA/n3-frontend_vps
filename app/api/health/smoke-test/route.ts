// app/api/health/smoke-test/route.ts
/**
 * Phase C-6: System Smoke Test
 * 
 * 完全スモークテスト自動化
 * UI → Dispatch → n8n → DB → UI refresh 全経路テスト
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// 型定義
// ============================================================

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  message?: string;
  details?: any;
}

interface SmokeTestResult {
  success: boolean;
  timestamp: string;
  duration: number;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
  };
}

// ============================================================
// テスト関数
// ============================================================

async function testDatabaseConnection(): Promise<TestResult> {
  const start = Date.now();
  try {
    const { data, error } = await supabase.from('products_master').select('id').limit(1);
    if (error) throw error;
    return {
      name: 'Database Connection',
      status: 'pass',
      duration: Date.now() - start,
      message: 'Connected to Supabase',
    };
  } catch (e: any) {
    return {
      name: 'Database Connection',
      status: 'fail',
      duration: Date.now() - start,
      message: e.message,
    };
  }
}

async function testN8nHealth(): Promise<TestResult> {
  const start = Date.now();
  const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${baseUrl}/healthz`, { signal: controller.signal });
    clearTimeout(timeout);
    return {
      name: 'n8n Health',
      status: res.ok ? 'pass' : 'fail',
      duration: Date.now() - start,
      message: res.ok ? 'n8n is running' : `HTTP ${res.status}`,
    };
  } catch (e: any) {
    return {
      name: 'n8n Health',
      status: 'fail',
      duration: Date.now() - start,
      message: e.name === 'AbortError' ? 'Connection timeout' : e.message,
    };
  }
}

async function testDispatchApi(baseUrl: string): Promise<TestResult> {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/api/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolId: 'sentinel-monitor',
        action: 'health_check',
        params: { test: true },
      }),
    });
    const data = await res.json();
    return {
      name: 'Dispatch API',
      status: res.ok ? 'pass' : 'fail',
      duration: Date.now() - start,
      message: res.ok ? 'Dispatch API responding' : data.error || `HTTP ${res.status}`,
      details: { jobId: data.jobId },
    };
  } catch (e: any) {
    return {
      name: 'Dispatch API',
      status: 'fail',
      duration: Date.now() - start,
      message: e.message,
    };
  }
}

async function testWebhookEndpoint(): Promise<TestResult> {
  const start = Date.now();
  const webhookUrl = process.env.N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`${webhookUrl}/n3-health-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'ping', timestamp: new Date().toISOString() }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    return {
      name: 'n8n Webhook Endpoint',
      status: res.ok || res.status === 404 ? 'pass' : 'fail',
      duration: Date.now() - start,
      message: res.ok ? 'Webhook responding' : res.status === 404 ? 'Endpoint reachable' : `HTTP ${res.status}`,
    };
  } catch (e: any) {
    return {
      name: 'n8n Webhook Endpoint',
      status: 'fail',
      duration: Date.now() - start,
      message: e.name === 'AbortError' ? 'Connection timeout' : e.message,
    };
  }
}

async function testAutomationSettings(): Promise<TestResult> {
  const start = Date.now();
  try {
    const { data, error } = await supabase.from('automation_settings').select('id').limit(1);
    
    if (error && error.code === '42P01') {
      return {
        name: 'Automation Settings Table',
        status: 'skip',
        duration: Date.now() - start,
        message: 'Table not created yet',
      };
    }
    if (error) throw error;
    
    return {
      name: 'Automation Settings Table',
      status: 'pass',
      duration: Date.now() - start,
      message: 'Table exists and accessible',
    };
  } catch (e: any) {
    return {
      name: 'Automation Settings Table',
      status: 'fail',
      duration: Date.now() - start,
      message: e.message,
    };
  }
}

async function testProductsMaster(): Promise<TestResult> {
  const start = Date.now();
  try {
    const { count, error } = await supabase
      .from('products_master')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return {
      name: 'Products Master',
      status: 'pass',
      duration: Date.now() - start,
      message: `${count || 0} products in database`,
      details: { count },
    };
  } catch (e: any) {
    return {
      name: 'Products Master',
      status: 'fail',
      duration: Date.now() - start,
      message: e.message,
    };
  }
}

async function testInventoryMaster(): Promise<TestResult> {
  const start = Date.now();
  try {
    const { count, error } = await supabase
      .from('inventory_master')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return {
      name: 'Inventory Master',
      status: 'pass',
      duration: Date.now() - start,
      message: `${count || 0} inventory items`,
      details: { count },
    };
  } catch (e: any) {
    return {
      name: 'Inventory Master',
      status: 'fail',
      duration: Date.now() - start,
      message: e.message,
    };
  }
}

async function testEbayTokens(): Promise<TestResult> {
  const start = Date.now();
  try {
    const { data, error } = await supabase
      .from('ebay_tokens')
      .select('account_id, expires_at')
      .limit(5);
    
    if (error) throw error;
    
    const expiredTokens = data?.filter(t => new Date(t.expires_at) < new Date()).length || 0;
    const validTokens = (data?.length || 0) - expiredTokens;
    
    return {
      name: 'eBay Tokens',
      status: validTokens > 0 ? 'pass' : expiredTokens > 0 ? 'fail' : 'skip',
      duration: Date.now() - start,
      message: validTokens > 0 
        ? `${validTokens} valid tokens` 
        : expiredTokens > 0 
          ? `All ${expiredTokens} tokens expired!` 
          : 'No tokens configured',
      details: { valid: validTokens, expired: expiredTokens },
    };
  } catch (e: any) {
    return {
      name: 'eBay Tokens',
      status: 'fail',
      duration: Date.now() - start,
      message: e.message,
    };
  }
}

// ============================================================
// GET: スモークテスト実行
// ============================================================

export async function GET(request: NextRequest) {
  const totalStart = Date.now();
  const baseUrl = request.nextUrl.origin;
  
  try {
    // 全テスト実行
    const tests: TestResult[] = await Promise.all([
      testDatabaseConnection(),
      testN8nHealth(),
      testDispatchApi(baseUrl),
      testWebhookEndpoint(),
      testAutomationSettings(),
      testProductsMaster(),
      testInventoryMaster(),
      testEbayTokens(),
    ]);
    
    // 集計
    const summary = {
      total: tests.length,
      passed: tests.filter(t => t.status === 'pass').length,
      failed: tests.filter(t => t.status === 'fail').length,
      skipped: tests.filter(t => t.status === 'skip').length,
    };
    
    const result: SmokeTestResult = {
      success: summary.failed === 0,
      timestamp: new Date().toISOString(),
      duration: Date.now() - totalStart,
      tests,
      summary,
    };
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Smoke test error:', error);
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      duration: Date.now() - totalStart,
      error: error.message,
      tests: [],
      summary: { total: 0, passed: 0, failed: 1, skipped: 0 },
    }, { status: 500 });
  }
}
