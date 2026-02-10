// lib/services/spreadsheet/google-auth.ts
/**
 * Google Sheets API 認証ヘルパー
 * 
 * 環境変数またはファイルからサービスアカウント認証を行う
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

export interface GoogleAuthConfig {
  scopes?: string[];
}

const DEFAULT_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.readonly',
];

/**
 * Google API 認証を取得
 * 
 * 優先順位:
 * 1. GOOGLE_SHEETS_CREDENTIALS 環境変数（JSON文字列）
 * 2. GOOGLE_APPLICATION_CREDENTIALS 環境変数（ファイルパス）
 * 3. google-service-account.json ファイル
 */
export async function getGoogleAuth(config?: GoogleAuthConfig) {
  const scopes = config?.scopes || DEFAULT_SCOPES;
  
  // 1. 環境変数から直接JSON
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (credentialsJson) {
    try {
      const credentials = JSON.parse(credentialsJson);
      console.log('[GoogleAuth] Using GOOGLE_SHEETS_CREDENTIALS env');
      return new google.auth.GoogleAuth({
        credentials,
        scopes,
      });
    } catch (e) {
      console.error('[GoogleAuth] Failed to parse GOOGLE_SHEETS_CREDENTIALS:', e);
    }
  }
  
  // 2. ファイルパス指定
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsPath && fs.existsSync(credentialsPath)) {
    try {
      console.log('[GoogleAuth] Using GOOGLE_APPLICATION_CREDENTIALS:', credentialsPath);
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      return new google.auth.GoogleAuth({
        credentials,
        scopes,
      });
    } catch (e) {
      console.error('[GoogleAuth] Failed to read credentials file:', e);
    }
  }
  
  // 3. プロジェクトルートのデフォルトファイル
  const defaultPaths = [
    path.join(process.cwd(), 'google-service-account.json'),
    path.join(process.cwd(), 'credentials.json'),
  ];
  
  for (const defaultPath of defaultPaths) {
    if (fs.existsSync(defaultPath)) {
      try {
        console.log('[GoogleAuth] Using default file:', defaultPath);
        const credentials = JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
        return new google.auth.GoogleAuth({
          credentials,
          scopes,
        });
      } catch (e) {
        console.error('[GoogleAuth] Failed to read default file:', e);
      }
    }
  }
  
  console.error('[GoogleAuth] No valid credentials found');
  return null;
}

/**
 * Google Sheets API クライアントを取得
 */
export async function getGoogleSheetsClient() {
  const auth = await getGoogleAuth();
  if (!auth) {
    throw new Error('Google authentication failed - no valid credentials');
  }
  return google.sheets({ version: 'v4', auth });
}

/**
 * スプレッドシートの共有設定を確認
 */
export async function checkSpreadsheetAccess(spreadsheetId: string): Promise<{
  success: boolean;
  title?: string;
  error?: string;
}> {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'properties.title',
    });
    
    return {
      success: true,
      title: response.data.properties?.title || 'Unknown',
    };
  } catch (error: any) {
    if (error.code === 403) {
      return {
        success: false,
        error: `Access denied. Share the spreadsheet with: n3-stocktake@gen-lang-client-0629935058.iam.gserviceaccount.com`,
      };
    }
    if (error.code === 404) {
      return {
        success: false,
        error: 'Spreadsheet not found. Check the ID.',
      };
    }
    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}
