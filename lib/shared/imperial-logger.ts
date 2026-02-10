// lib/shared/imperial-logger.ts
/**
 * N3 Empire OS - 帝国ログ転送基盤
 * Chatwork通知 + サイレントログ
 * 
 * 【ルール】
 * - console.log → 削除または logger.info（サイレント）
 * - console.error → imperialErrorLog（Chatwork即時通知）
 */

import { fetchSecret, safeFetchSecret } from "./security";

// ============================================================
// Chatwork通知（本番エラー速報）
// ============================================================

/**
 * 緊急エラーをChatworkに通知
 * 夜間無人運用時のエラー検出用
 */
export async function imperialErrorLog(
  title: string,
  message: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const chatworkToken = await safeFetchSecret("CHATWORK_TOKEN");
    const chatworkRoom = await safeFetchSecret("CHATWORK_ROOM_ID");
    
    if (!chatworkToken || !chatworkRoom) {
      // Chatwork未設定時はサイレント（本番では設定必須）
      return;
    }
    
    const timestamp = new Date().toISOString();
    const metaStr = metadata ? `\n📎 ${JSON.stringify(metadata)}` : "";
    
    const body = `[info][title]🚨 ${title}[/title]${timestamp}\n${message}${metaStr}[/info]`;

    await fetch(`https://api.chatwork.com/v2/rooms/${chatworkRoom}/messages`, {
      method: "POST",
      headers: {
        "X-ChatWorkToken": chatworkToken,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `body=${encodeURIComponent(body)}`
    });
  } catch {
    // Chatwork送信失敗時は無視（本処理に影響させない）
  }
}

/**
 * 情報ログ（Chatwork通知なし・サイレント）
 * console.log の代替
 */
export function logger_info(..._args: unknown[]): void {
  // 本番では何もしない（ログ出力禁止）
  // 開発時のみ有効にする場合は process.env.NODE_ENV === 'development' で条件分岐
}

/**
 * エラーログ（Chatwork通知あり）
 * console.error の代替
 */
export async function logger_error(title: string, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error);
  await imperialErrorLog(title, message);
}

// ============================================================
// レートリミットガード
// ============================================================

/**
 * API呼び出し間隔の強制スロットリング
 * @param ms 待機ミリ秒（デフォルト5秒）
 */
export async function imperialSleep(ms = 5000): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// エクスポート（互換性のため）
// ============================================================

export const logger = {
  info: logger_info,
  error: logger_error,
};
