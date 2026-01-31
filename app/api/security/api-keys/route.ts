// app/api/security/api-keys/route.ts
/**
 * 🔑 API Key Management
 * 
 * Phase 4E: Security Hardening
 * 
 * @usage GET /api/security/api-keys - 一覧取得
 * @usage POST /api/security/api-keys - 新規作成
 * @usage DELETE /api/security/api-keys - 削除/無効化
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// ============================================================
// 型定義
// ============================================================

interface CreateKeyRequest {
  organizationId: string;
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}

interface ApiKeyResponse {
  id: string;
  name: string;
  keyPrefix: string;
  scopes: string[];
  lastUsedAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

// ============================================================
// Supabase Client
// ============================================================

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(url, key);
}

// ============================================================
// Key Generation
// ============================================================

function generateApiKey(): { key: string; hash: string; prefix: string } {
  const keyBytes = crypto.randomBytes(32);
  const key = 'n3_' + keyBytes.toString('base64url');
  const hash = crypto.createHash('sha256').update(key).digest('hex');
  const prefix = key.substring(0, 12);
  return { key, hash, prefix };
}

// ============================================================
// GET /api/security/api-keys
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || request.headers.get('x-organization-id');
    
    if (!organizationId) {
      return NextResponse.json({ success: false, error: 'organizationId is required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    const { data: keys, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, last_used_at, expires_at, is_active, created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    const apiKeys: ApiKeyResponse[] = (keys || []).map(k => ({
      id: k.id, name: k.name, keyPrefix: k.key_prefix, scopes: k.scopes,
      lastUsedAt: k.last_used_at, expiresAt: k.expires_at, isActive: k.is_active, createdAt: k.created_at,
    }));
    
    return NextResponse.json({ success: true, keys: apiKeys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// POST /api/security/api-keys
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: CreateKeyRequest = await request.json();
    const { organizationId, name, scopes = ['dispatch'], expiresInDays } = body;
    
    if (!organizationId || !name) {
      return NextResponse.json({ success: false, error: 'organizationId and name are required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    const { count } = await supabase
      .from('api_keys')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('is_active', true);
    
    if ((count || 0) >= 5) {
      return NextResponse.json({ success: false, error: 'Maximum 5 active API keys' }, { status: 400 });
    }
    
    const { key, hash, prefix } = generateApiKey();
    const expiresAt = expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString() : null;
    
    const { data, error } = await supabase
      .from('api_keys')
      .insert({ organization_id: organizationId, name, key_hash: hash, key_prefix: prefix, scopes, expires_at: expiresAt })
      .select('id')
      .single();
    
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    await supabase.from('audit_logs').insert({
      organization_id: organizationId, action: 'api_key_created', resource_type: 'api_key', resource_id: data.id,
    });
    
    return NextResponse.json({
      success: true, key, keyId: data.id, keyPrefix: prefix, name, scopes, expiresAt,
      message: 'Save this key securely. It will not be shown again.',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ============================================================
// DELETE /api/security/api-keys
// ============================================================

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');
    const organizationId = searchParams.get('organizationId') || request.headers.get('x-organization-id');
    
    if (!keyId || !organizationId) {
      return NextResponse.json({ success: false, error: 'keyId and organizationId required' }, { status: 400 });
    }
    
    const supabase = getSupabaseClient();
    
    await supabase.from('api_keys').update({ is_active: false }).eq('id', keyId).eq('organization_id', organizationId);
    await supabase.from('audit_logs').insert({ organization_id: organizationId, action: 'api_key_revoked', resource_type: 'api_key', resource_id: keyId });
    
    return NextResponse.json({ success: true, message: 'API key revoked' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Organization-Id',
    },
  });
}
