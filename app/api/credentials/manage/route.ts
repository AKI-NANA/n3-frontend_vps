// app/api/credentials/manage/route.ts
// P0: 認証情報管理API

import { NextRequest, NextResponse } from 'next/server';
import {
  CredentialManager,
  CredentialType,
  Environment,
} from '@/lib/security/credential-manager';

/**
 * 認証情報の保存
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      credentialType,
      serviceName,
      environment,
      apiKey,
      apiSecret,
      accessToken,
      refreshToken,
      username,
      password,
      additionalData,
      tokenExpiresAt,
    } = body;

    // バリデーション
    if (!credentialType || !serviceName || !environment) {
      return NextResponse.json(
        {
          success: false,
          error: '必須パラメータが不足しています',
        },
        { status: 400 }
      );
    }

    const credentialId = await CredentialManager.saveCredential(
      credentialType as CredentialType,
      serviceName,
      environment as Environment,
      {
        apiKey,
        apiSecret,
        accessToken,
        refreshToken,
        username,
        password,
        additionalData,
        tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : undefined,
      }
    );

    return NextResponse.json({
      success: true,
      message: '認証情報を暗号化して保存しました',
      credentialId,
    });
  } catch (error: any) {
    console.error('Save credential error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '認証情報の保存に失敗しました',
      },
      { status: 500 }
    );
  }
}

/**
 * 認証情報の取得（復号化済み）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceName = searchParams.get('serviceName');
    const environment = (searchParams.get('environment') ||
      'production') as Environment;
    const credentialType = (searchParams.get('credentialType') ||
      'MARKETPLACE_API') as CredentialType;

    if (!serviceName) {
      return NextResponse.json(
        {
          success: false,
          error: 'serviceNameパラメータが必要です',
        },
        { status: 400 }
      );
    }

    const credential = await CredentialManager.getCredential(
      serviceName,
      environment,
      credentialType
    );

    if (!credential) {
      return NextResponse.json({
        success: false,
        error: '認証情報が見つかりません',
      });
    }

    return NextResponse.json({
      success: true,
      data: credential,
    });
  } catch (error: any) {
    console.error('Get credential error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '認証情報の取得に失敗しました',
      },
      { status: 500 }
    );
  }
}

/**
 * 認証情報の無効化
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const credentialId = searchParams.get('credentialId');

    if (!credentialId) {
      return NextResponse.json(
        {
          success: false,
          error: 'credentialIdパラメータが必要です',
        },
        { status: 400 }
      );
    }

    await CredentialManager.deactivateCredential(credentialId);

    return NextResponse.json({
      success: true,
      message: '認証情報を無効化しました',
    });
  } catch (error: any) {
    console.error('Deactivate credential error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || '認証情報の無効化に失敗しました',
      },
      { status: 500 }
    );
  }
}
