// app/api/security/decrypt-secret/route.ts
// 🔐 N3 Empire OS - Secret Vault 復号APIエンドポイント
// n8nから参照IDで呼び出され、サーバーサイドで復号して返却

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import SecretVault from '@/lib/n8n/secret-vault';

// ========================================
// 環境変数
// ========================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const INTERNAL_TOKEN = process.env.N3_INTERNAL_TOKEN || 'n3-internal-token-change-me';

// ========================================
// POST: シークレット復号
// ========================================

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);
  const startTime = Date.now();

  try {
    // 内部トークン検証
    const authToken = request.headers.get('X-N3-Internal-Token');
    if (authToken !== INTERNAL_TOKEN) {
      console.error(`[secret-vault:${requestId}] Invalid internal token`);
      return NextResponse.json(
        { success: false, error: 'Unauthorized', requestId },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ref_id, tenant_id } = body;

    if (!ref_id) {
      return NextResponse.json(
        { success: false, error: 'ref_id is required', requestId },
        { status: 400 }
      );
    }

    // Supabase接続（サービスロールキーを使用）
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // シークレット取得
    const { data, error } = await supabase
      .from('secret_vault')
      .select('encrypted_value, metadata, expires_at, is_active, tenant_id')
      .eq('ref_id', ref_id)
      .single();

    if (error || !data) {
      console.error(`[secret-vault:${requestId}] Secret not found:`, ref_id);
      return NextResponse.json(
        { success: false, error: 'Secret not found', requestId },
        { status: 404 }
      );
    }

    // テナントID検証（指定があれば）
    if (tenant_id && data.tenant_id !== '0' && data.tenant_id !== tenant_id) {
      console.error(`[secret-vault:${requestId}] Tenant mismatch:`, {
        requested: tenant_id,
        actual: data.tenant_id,
      });
      return NextResponse.json(
        { success: false, error: 'Access denied', requestId },
        { status: 403 }
      );
    }

    // 有効性チェック
    if (!data.is_active) {
      console.error(`[secret-vault:${requestId}] Secret is inactive:`, ref_id);
      return NextResponse.json(
        { success: false, error: 'Secret is inactive', requestId },
        { status: 410 }
      );
    }

    // 有効期限チェック
    if (SecretVault.isSecretExpired(data)) {
      console.error(`[secret-vault:${requestId}] Secret is expired:`, ref_id);
      return NextResponse.json(
        { success: false, error: 'Secret is expired', requestId },
        { status: 410 }
      );
    }

    // 復号
    const decryptedValue = SecretVault.decryptSecretEntry(data);

    // 使用日時を更新
    await supabase
      .from('secret_vault')
      .update({ last_used_at: new Date().toISOString() })
      .eq('ref_id', ref_id);

    const executionTime = Date.now() - startTime;
    console.log(`[secret-vault:${requestId}] Decrypted in ${executionTime}ms`);

    return NextResponse.json({
      success: true,
      value: decryptedValue,
      metadata: data.metadata,
      requestId,
      executionTime,
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[secret-vault:${requestId}] Error:`, error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed',
        requestId,
        executionTime,
      },
      { status: 500 }
    );
  }
}

// ========================================
// GET: シークレットメタデータ取得（値は含まない）
// ========================================

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID().slice(0, 8);

  try {
    // 内部トークン検証
    const authToken = request.headers.get('X-N3-Internal-Token');
    if (authToken !== INTERNAL_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tenant_id = searchParams.get('tenant_id');
    const secret_type = searchParams.get('secret_type');

    // Supabase接続
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false },
    });

    // クエリ構築
    let query = supabase
      .from('secret_vault')
      .select('ref_id, tenant_id, secret_type, metadata, expires_at, last_used_at, is_active')
      .eq('is_active', true);

    if (tenant_id) {
      query = query.eq('tenant_id', tenant_id);
    }

    if (secret_type) {
      query = query.eq('secret_type', secret_type);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      count: data?.length || 0,
      requestId,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}
