// 📁 格納パス: lib/security/credentials.ts
// P0: 認証情報暗号化（pgsodium）の実装 - TypeScript ユーティリティ

import { createClient } from "@/lib/supabase/server";

/**
 * 認証情報の種類
 */
export type CredentialType = "api_key" | "secret" | "token" | "refresh_token" | "password";

/**
 * 認証情報の環境
 */
export type CredentialEnvironment = "production" | "sandbox" | "development";

/**
 * 認証情報のインターフェース
 */
export interface Credential {
  serviceName: string;
  credentialValue: string;
  credentialType: CredentialType;
  environment: CredentialEnvironment;
  expiresAt?: Date;
}

/**
 * 暗号化された認証情報を安全に保存する
 *
 * @param serviceName サービス名（例: 'ebay_client_id', 'shopee_api_key'）
 * @param credentialValue 認証情報の値（平文で渡す。pgsodiumが自動暗号化）
 * @param credentialType 認証情報の種類
 * @param environment 環境
 * @param description 説明（任意）
 * @param expiresAt 有効期限（任意）
 * @returns 保存された認証情報のID
 */
export async function storeEncryptedCredential(
  serviceName: string,
  credentialValue: string,
  credentialType: CredentialType,
  environment: CredentialEnvironment = "production",
  description?: string,
  expiresAt?: Date
): Promise<string | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("insert_encrypted_credential", {
      p_service_name: serviceName,
      p_credential_value: credentialValue,
      p_credential_type: credentialType,
      p_environment: environment,
      p_description: description || null,
      p_expires_at: expiresAt ? expiresAt.toISOString() : null,
    });

    if (error) {
      console.error(
        `[Security] Failed to store credential for ${serviceName}:`,
        error.message
      );
      return null;
    }

    console.log(`[Security] ✅ Stored encrypted credential: ${serviceName}`);
    return data as string;
  } catch (error) {
    console.error(
      `[Security] Error storing credential for ${serviceName}:`,
      error
    );
    return null;
  }
}

/**
 * 暗号化された認証情報を取得して復号化する
 *
 * @param serviceName サービス名（例: 'ebay_client_id'）
 * @returns 復号化された認証情報（見つからない場合はnull）
 */
export async function getDecryptedCredential(
  serviceName: string
): Promise<Credential | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc("get_decrypted_credential", {
      p_service_name: serviceName,
    });

    if (error) {
      console.error(
        `[Security] Failed to retrieve credential for ${serviceName}:`,
        error.message
      );
      return null;
    }

    if (!data || data.length === 0) {
      console.warn(
        `[Security] Credential not found for ${serviceName}`
      );
      return null;
    }

    const credentialData = data[0];

    return {
      serviceName: credentialData.service_name,
      credentialValue: credentialData.credential_value,
      credentialType: credentialData.credential_type,
      environment: credentialData.environment,
      expiresAt: credentialData.expires_at
        ? new Date(credentialData.expires_at)
        : undefined,
    };
  } catch (error) {
    console.error(
      `[Security] Error retrieving credential for ${serviceName}:`,
      error
    );
    return null;
  }
}

/**
 * 認証情報を取得する（フォールバック付き）
 *
 * 優先順位:
 * 1. 暗号化されたデータベースから取得
 * 2. 環境変数から取得（レガシー対応）
 *
 * @param serviceName サービス名
 * @param envVarName 環境変数名（フォールバック用）
 * @returns 認証情報の値
 */
export async function getCredentialWithFallback(
  serviceName: string,
  envVarName: string
): Promise<string | null> {
  // 1. 暗号化されたデータベースから取得を試みる
  const credential = await getDecryptedCredential(serviceName);
  if (credential) {
    return credential.credentialValue;
  }

  // 2. 環境変数から取得（レガシー対応）
  const envValue = process.env[envVarName];
  if (envValue) {
    console.warn(
      `[Security] ⚠️ Using legacy env variable ${envVarName}. Please migrate to encrypted storage.`
    );
    return envValue;
  }

  console.error(
    `[Security] ❌ Credential not found: ${serviceName} (env: ${envVarName})`
  );
  return null;
}

/**
 * 複数の認証情報をバッチで保存する
 *
 * @param credentials 認証情報の配列
 * @returns 成功した件数
 */
export async function storeBatchCredentials(
  credentials: Array<{
    serviceName: string;
    credentialValue: string;
    credentialType: CredentialType;
    environment?: CredentialEnvironment;
    description?: string;
    expiresAt?: Date;
  }>
): Promise<number> {
  let successCount = 0;

  for (const cred of credentials) {
    const result = await storeEncryptedCredential(
      cred.serviceName,
      cred.credentialValue,
      cred.credentialType,
      cred.environment || "production",
      cred.description,
      cred.expiresAt
    );

    if (result) {
      successCount++;
    }
  }

  console.log(
    `[Security] Batch credential storage complete: ${successCount}/${credentials.length} succeeded`
  );

  return successCount;
}

/**
 * 期限切れの認証情報をチェックする
 *
 * @returns 期限切れの認証情報のリスト
 */
export async function checkExpiredCredentials(): Promise<string[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("encrypted_credentials")
      .select("service_name, expires_at")
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString());

    if (error) {
      console.error("[Security] Failed to check expired credentials:", error.message);
      return [];
    }

    const expiredServices = data.map((item) => item.service_name);

    if (expiredServices.length > 0) {
      console.warn(
        `[Security] ⚠️ Found ${expiredServices.length} expired credentials:`,
        expiredServices
      );
    }

    return expiredServices;
  } catch (error) {
    console.error("[Security] Error checking expired credentials:", error);
    return [];
  }
}

/**
 * 認証情報を削除する
 *
 * @param serviceName サービス名
 * @returns 成功したかどうか
 */
export async function deleteCredential(serviceName: string): Promise<boolean> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("encrypted_credentials")
      .delete()
      .eq("service_name", serviceName);

    if (error) {
      console.error(
        `[Security] Failed to delete credential ${serviceName}:`,
        error.message
      );
      return false;
    }

    console.log(`[Security] ✅ Deleted credential: ${serviceName}`);
    return true;
  } catch (error) {
    console.error(`[Security] Error deleting credential ${serviceName}:`, error);
    return false;
  }
}

/**
 * 認証情報の一覧を取得する（値は含まない、メタデータのみ）
 *
 * @returns 認証情報のメタデータ一覧
 */
export async function listCredentials(): Promise<
  Array<{
    serviceName: string;
    credentialType: CredentialType;
    environment: CredentialEnvironment;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt?: Date;
  }>
> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("encrypted_credentials")
      .select(
        "service_name, credential_type, environment, description, created_at, updated_at, expires_at"
      )
      .order("service_name", { ascending: true });

    if (error) {
      console.error("[Security] Failed to list credentials:", error.message);
      return [];
    }

    return data.map((item) => ({
      serviceName: item.service_name,
      credentialType: item.credential_type as CredentialType,
      environment: item.environment as CredentialEnvironment,
      description: item.description || undefined,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at),
      expiresAt: item.expires_at ? new Date(item.expires_at) : undefined,
    }));
  } catch (error) {
    console.error("[Security] Error listing credentials:", error);
    return [];
  }
}
