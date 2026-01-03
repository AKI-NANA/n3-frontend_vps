/**
 * app/api/ebay/accounts/route.ts
 *
 * eBayアカウント管理API
 * P1: eBayアカウント管理UI・API実装
 *
 * エンドポイント:
 * - GET: eBayアカウント一覧取得
 * - POST: 新規eBayアカウント登録
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import type {
  EbayAccountSummary,
  CreateEbayAccountInput,
} from "@/src/db/ebay_accounts_schema";

/**
 * GET: eBayアカウント一覧取得
 *
 * クエリパラメータ:
 * - status: ステータスフィルター
 * - account_type: アカウントタイプフィルター
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const accountType = searchParams.get("account_type");

    // クエリビルダー
    let query = supabase
      .from("ebay_accounts")
      .select(
        `
        id,
        account_name,
        account_display_name,
        account_type,
        ebay_user_id,
        ebay_username,
        ebay_marketplace_id,
        status,
        is_default,
        refresh_token_encrypted,
        access_token_encrypted,
        token_expires_at,
        last_used_at,
        last_token_refresh_at,
        created_at,
        updated_at,
        description,
        tags
      `
      )
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    // フィルター適用
    if (status) {
      query = query.eq("status", status);
    }
    if (accountType) {
      query = query.eq("account_type", accountType);
    }

    const { data, error } = await query;

    if (error) {
      console.error("eBayアカウント一覧取得エラー:", error);
      return NextResponse.json(
        {
          error: "eBayアカウントの取得に失敗しました",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 機密情報を除外してサマリー化
    const summaries: EbayAccountSummary[] = (data || []).map((account) => ({
      id: account.id,
      account_name: account.account_name,
      account_display_name: account.account_display_name,
      account_type: account.account_type,
      ebay_user_id: account.ebay_user_id,
      ebay_username: account.ebay_username,
      ebay_marketplace_id: account.ebay_marketplace_id,
      status: account.status,
      is_default: account.is_default,
      has_refresh_token: account.refresh_token_encrypted !== null,
      has_access_token: account.access_token_encrypted !== null,
      token_expires_at: account.token_expires_at,
      last_used_at: account.last_used_at,
      last_token_refresh_at: account.last_token_refresh_at,
      created_at: account.created_at,
      updated_at: account.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: summaries,
      count: summaries.length,
    });
  } catch (error) {
    console.error("eBayアカウント一覧取得エラー:", error);
    return NextResponse.json(
      { error: "eBayアカウントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * POST: 新規eBayアカウント登録
 *
 * リクエストボディ:
 * - account_name: アカウント名（必須）
 * - client_id: eBay Client ID（必須）
 * - client_secret: eBay Client Secret（必須）
 * - その他のフィールド（オプション）
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = (await request.json()) as CreateEbayAccountInput;

    // バリデーション
    if (!body.account_name || !body.client_id || !body.client_secret) {
      return NextResponse.json(
        {
          error: "必須フィールドが不足しています",
          required: ["account_name", "client_id", "client_secret"],
        },
        { status: 400 }
      );
    }

    // アカウント名の重複チェック
    const { data: existing, error: checkError } = await supabase
      .from("ebay_accounts")
      .select("id")
      .eq("account_name", body.account_name)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "このアカウント名は既に使用されています" },
        { status: 409 }
      );
    }

    // RPC関数を使用してアカウント作成（暗号化付き）
    const { data: accountId, error } = await supabase.rpc(
      "upsert_ebay_account",
      {
        p_account_name: body.account_name,
        p_account_display_name: body.account_display_name || body.account_name,
        p_account_type: body.account_type || "production",
        p_client_id: body.client_id,
        p_client_secret: body.client_secret,
        p_is_default: body.is_default || false,
        p_description: body.description || null,
      }
    );

    if (error) {
      console.error("eBayアカウント作成エラー:", error);
      return NextResponse.json(
        {
          error: "eBayアカウントの作成に失敗しました",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 作成されたアカウントを取得
    const { data: createdAccount, error: fetchError } = await supabase
      .from("ebay_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (fetchError) {
      console.error("作成されたアカウントの取得エラー:", fetchError);
    }

    return NextResponse.json({
      success: true,
      data: createdAccount,
      message: "eBayアカウントを登録しました。OAuth認証を行ってください。",
    });
  } catch (error) {
    console.error("eBayアカウント作成エラー:", error);
    return NextResponse.json(
      { error: "eBayアカウントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
