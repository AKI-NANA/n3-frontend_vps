/**
 * app/api/ebay/accounts/[id]/route.ts
 *
 * eBayアカウント個別操作API
 * P1: eBayアカウント管理UI・API実装
 *
 * エンドポイント:
 * - GET: eBayアカウント詳細取得
 * - PATCH: eBayアカウント更新
 * - DELETE: eBayアカウント削除
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/client";
import type { UpdateEbayAccountInput } from "@/src/db/ebay_accounts_schema";

/**
 * GET: eBayアカウント詳細取得
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const accountId = parseInt(params.id);

    if (isNaN(accountId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("ebay_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "指定されたアカウントが見つかりません" },
          { status: 404 }
        );
      }
      console.error("eBayアカウント取得エラー:", error);
      return NextResponse.json(
        {
          error: "eBayアカウントの取得に失敗しました",
          details: error.message,
        },
        { status: 500 }
      );
    }

    // 機密情報を除外
    const summary = {
      id: data.id,
      account_name: data.account_name,
      account_display_name: data.account_display_name,
      account_type: data.account_type,
      ebay_user_id: data.ebay_user_id,
      ebay_username: data.ebay_username,
      ebay_marketplace_id: data.ebay_marketplace_id,
      client_id: data.client_id,
      redirect_uri: data.redirect_uri,
      status: data.status,
      is_default: data.is_default,
      has_refresh_token: data.refresh_token_encrypted !== null,
      has_access_token: data.access_token_encrypted !== null,
      token_expires_at: data.token_expires_at,
      token_scopes: data.token_scopes,
      last_used_at: data.last_used_at,
      last_token_refresh_at: data.last_token_refresh_at,
      description: data.description,
      tags: data.tags,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("eBayアカウント取得エラー:", error);
    return NextResponse.json(
      { error: "eBayアカウントの取得に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * PATCH: eBayアカウント更新
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const accountId = parseInt(params.id);
    const body = (await request.json()) as UpdateEbayAccountInput;

    if (isNaN(accountId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    // 既存アカウントの確認
    const { data: existing, error: checkError } = await supabase
      .from("ebay_accounts")
      .select("account_name")
      .eq("id", accountId)
      .single();

    if (checkError || !existing) {
      return NextResponse.json(
        { error: "指定されたアカウントが見つかりません" },
        { status: 404 }
      );
    }

    // 更新処理
    // Client SecretがあればRPC関数を使用（暗号化のため）
    if (body.client_secret) {
      const { data: updatedId, error } = await supabase.rpc(
        "upsert_ebay_account",
        {
          p_account_name: existing.account_name, // 変更不可
          p_account_display_name: body.account_display_name,
          p_account_type: "production", // デフォルト
          p_client_id: body.client_id,
          p_client_secret: body.client_secret,
          p_is_default: body.is_default,
          p_description: body.description,
        }
      );

      if (error) {
        console.error("eBayアカウント更新エラー:", error);
        return NextResponse.json(
          {
            error: "eBayアカウントの更新に失敗しました",
            details: error.message,
          },
          { status: 500 }
        );
      }
    } else {
      // Client Secret以外の更新
      const updateData: any = {};

      if (body.account_display_name !== undefined)
        updateData.account_display_name = body.account_display_name;
      if (body.client_id !== undefined) updateData.client_id = body.client_id;
      if (body.redirect_uri !== undefined)
        updateData.redirect_uri = body.redirect_uri;
      if (body.ebay_marketplace_id !== undefined)
        updateData.ebay_marketplace_id = body.ebay_marketplace_id;
      if (body.is_default !== undefined)
        updateData.is_default = body.is_default;
      if (body.description !== undefined)
        updateData.description = body.description;
      if (body.tags !== undefined) updateData.tags = body.tags;
      if (body.status !== undefined) updateData.status = body.status;

      const { error } = await supabase
        .from("ebay_accounts")
        .update(updateData)
        .eq("id", accountId);

      if (error) {
        console.error("eBayアカウント更新エラー:", error);
        return NextResponse.json(
          {
            error: "eBayアカウントの更新に失敗しました",
            details: error.message,
          },
          { status: 500 }
        );
      }
    }

    // 更新後のアカウントを取得
    const { data: updatedAccount, error: fetchError } = await supabase
      .from("ebay_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    return NextResponse.json({
      success: true,
      data: updatedAccount,
      message: "eBayアカウントを更新しました",
    });
  } catch (error) {
    console.error("eBayアカウント更新エラー:", error);
    return NextResponse.json(
      { error: "eBayアカウントの更新に失敗しました" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: eBayアカウント削除
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient();
    const accountId = parseInt(params.id);

    if (isNaN(accountId)) {
      return NextResponse.json({ error: "無効なIDです" }, { status: 400 });
    }

    // デフォルトアカウントの削除を防ぐ
    const { data: account, error: checkError } = await supabase
      .from("ebay_accounts")
      .select("is_default, account_name")
      .eq("id", accountId)
      .single();

    if (checkError || !account) {
      return NextResponse.json(
        { error: "指定されたアカウントが見つかりません" },
        { status: 404 }
      );
    }

    if (account.is_default) {
      return NextResponse.json(
        {
          error: "デフォルトアカウントは削除できません",
          message:
            "別のアカウントをデフォルトに設定してから削除してください",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("ebay_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      console.error("eBayアカウント削除エラー:", error);
      return NextResponse.json(
        {
          error: "eBayアカウントの削除に失敗しました",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `eBayアカウント「${account.account_name}」を削除しました`,
    });
  } catch (error) {
    console.error("eBayアカウント削除エラー:", error);
    return NextResponse.json(
      { error: "eBayアカウントの削除に失敗しました" },
      { status: 500 }
    );
  }
}
