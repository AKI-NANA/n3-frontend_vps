// app/api/health/apis/route.ts
/**
 * Phase C-5: External API Health Check
 * 
 * 外部API設定検証システム
 * 各APIのヘルスチェックを実行
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// 型定義
// ============================================================

interface ApiHealthStatus {
  name: string;
  status: 'ok' | 'error' | 'warning' | 'unconfigured';
  latency?: number;
  message?: string;
  lastChecked: string;
  configKeys: string[];
  missingKeys: string[];
}

// ============================================================
// API定義
// ============================================================

const API_DEFINITIONS = [
  {
    name: 'Supabase',
    configKeys: ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
    check: async () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!url || !key) return { status: 'unconfigured' as const, message: 'API keys not configured' };
      
      const start = Date.now();
      try {
        const res = await fetch(`${url}/rest/v1/`, {
          headers: { 'apikey': key, 'Authorization': `Bearer ${key}` },
        });
        const latency = Date.now() - start;
        return res.ok 
          ? { status: 'ok' as const, latency }
          : { status: 'error' as const, message: `HTTP ${res.status}`, latency };
      } catch (e: any) {
        return { status: 'error' as const, message: e.message };
      }
    },
  },
  {
    name: 'eBay API',
    configKeys: ['EBAY_CLIENT_ID', 'EBAY_CLIENT_SECRET'],
    check: async () => {
      const clientId = process.env.EBAY_CLIENT_ID;
      const clientSecret = process.env.EBAY_CLIENT_SECRET;
      if (!clientId || !clientSecret) return { status: 'unconfigured' as const, message: 'API keys not configured' };
      return { status: 'ok' as const, message: 'Credentials configured' };
    },
  },
  {
    name: 'Amazon PA-API',
    configKeys: ['AMAZON_ACCESS_KEY', 'AMAZON_SECRET_KEY', 'AMAZON_PARTNER_TAG'],
    check: async () => {
      const accessKey = process.env.AMAZON_ACCESS_KEY;
      const secretKey = process.env.AMAZON_SECRET_KEY;
      const partnerTag = process.env.AMAZON_PARTNER_TAG;
      if (!accessKey || !secretKey || !partnerTag) return { status: 'unconfigured' as const, message: 'API keys not configured' };
      return { status: 'ok' as const, message: 'Credentials configured' };
    },
  },
  {
    name: 'Keepa',
    configKeys: ['KEEPA_API_KEY'],
    check: async () => {
      const apiKey = process.env.KEEPA_API_KEY;
      if (!apiKey) return { status: 'unconfigured' as const, message: 'API key not configured' };
      
      const start = Date.now();
      try {
        const res = await fetch(`https://api.keepa.com/token?key=${apiKey}`);
        const latency = Date.now() - start;
        const data = await res.json();
        return data.tokensLeft !== undefined
          ? { status: 'ok' as const, latency, message: `${data.tokensLeft} tokens remaining` }
          : { status: 'error' as const, message: 'Invalid response', latency };
      } catch (e: any) {
        return { status: 'error' as const, message: e.message };
      }
    },
  },
  {
    name: 'OpenAI',
    configKeys: ['OPENAI_API_KEY'],
    check: async () => {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) return { status: 'unconfigured' as const, message: 'API key not configured' };
      
      const start = Date.now();
      try {
        const res = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        const latency = Date.now() - start;
        return res.ok
          ? { status: 'ok' as const, latency }
          : { status: 'error' as const, message: `HTTP ${res.status}`, latency };
      } catch (e: any) {
        return { status: 'error' as const, message: e.message };
      }
    },
  },
  {
    name: 'Anthropic (Claude)',
    configKeys: ['ANTHROPIC_API_KEY'],
    check: async () => {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) return { status: 'unconfigured' as const, message: 'API key not configured' };
      return { status: 'ok' as const, message: 'Credentials configured' };
    },
  },
  {
    name: 'ElevenLabs',
    configKeys: ['ELEVENLABS_API_KEY'],
    check: async () => {
      const apiKey = process.env.ELEVENLABS_API_KEY;
      if (!apiKey) return { status: 'unconfigured' as const, message: 'API key not configured' };
      
      const start = Date.now();
      try {
        const res = await fetch('https://api.elevenlabs.io/v1/user', {
          headers: { 'xi-api-key': apiKey },
        });
        const latency = Date.now() - start;
        return res.ok
          ? { status: 'ok' as const, latency }
          : { status: 'error' as const, message: `HTTP ${res.status}`, latency };
      } catch (e: any) {
        return { status: 'error' as const, message: e.message };
      }
    },
  },
  {
    name: 'YouTube Data API',
    configKeys: ['YOUTUBE_API_KEY'],
    check: async () => {
      const apiKey = process.env.YOUTUBE_API_KEY;
      if (!apiKey) return { status: 'unconfigured' as const, message: 'API key not configured' };
      return { status: 'ok' as const, message: 'Credentials configured' };
    },
  },
  {
    name: 'n8n',
    configKeys: ['N8N_BASE_URL'],
    check: async () => {
      const baseUrl = process.env.N8N_BASE_URL || 'http://160.16.120.186:5678';
      
      const start = Date.now();
      try {
        const res = await fetch(`${baseUrl}/healthz`);
        const latency = Date.now() - start;
        return res.ok
          ? { status: 'ok' as const, latency }
          : { status: 'warning' as const, message: 'n8n may be offline', latency };
      } catch (e: any) {
        return { status: 'error' as const, message: 'Connection failed' };
      }
    },
  },
  {
    name: 'Rakuten API',
    configKeys: ['RAKUTEN_APP_ID'],
    check: async () => {
      const appId = process.env.RAKUTEN_APP_ID;
      if (!appId) return { status: 'unconfigured' as const, message: 'API key not configured' };
      return { status: 'ok' as const, message: 'Credentials configured' };
    },
  },
  {
    name: 'ChatWork',
    configKeys: ['CHATWORK_API_KEY', 'CHATWORK_ROOM_ID'],
    check: async () => {
      const apiKey = process.env.CHATWORK_API_KEY;
      const roomId = process.env.CHATWORK_ROOM_ID;
      if (!apiKey || !roomId) return { status: 'unconfigured' as const, message: 'API key not configured' };
      
      const start = Date.now();
      try {
        const res = await fetch('https://api.chatwork.com/v2/me', {
          headers: { 'X-ChatWorkToken': apiKey },
        });
        const latency = Date.now() - start;
        return res.ok
          ? { status: 'ok' as const, latency }
          : { status: 'error' as const, message: `HTTP ${res.status}`, latency };
      } catch (e: any) {
        return { status: 'error' as const, message: e.message };
      }
    },
  },
];

// ============================================================
// GET: 全APIヘルスチェック
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const apis: ApiHealthStatus[] = [];
    const summary = { total: API_DEFINITIONS.length, ok: 0, error: 0, warning: 0, unconfigured: 0 };
    
    for (const api of API_DEFINITIONS) {
      const missingKeys = api.configKeys.filter(key => !process.env[key]);
      
      let result: { status: 'ok' | 'error' | 'warning' | 'unconfigured'; latency?: number; message?: string };
      
      if (missingKeys.length === api.configKeys.length) {
        result = { status: 'unconfigured', message: 'No credentials configured' };
      } else if (missingKeys.length > 0) {
        result = { status: 'warning', message: `Missing: ${missingKeys.join(', ')}` };
      } else {
        result = await api.check();
      }
      
      apis.push({
        name: api.name,
        status: result.status,
        latency: result.latency,
        message: result.message,
        lastChecked: new Date().toISOString(),
        configKeys: api.configKeys,
        missingKeys,
      });
      
      summary[result.status]++;
    }
    
    return NextResponse.json({
      success: true,
      apis,
      summary,
    });
    
  } catch (error: any) {
    console.error('API health check error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
