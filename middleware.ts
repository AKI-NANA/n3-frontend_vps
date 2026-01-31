// middleware.ts
// ========================================
// 🛡️ N3 Empire OS V8.2.1-Autonomous
// SEC-001/SEC-003: APIレート制限 & CSRF保護
// 商用レベル・セキュリティミドルウェア
// ========================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ========================================
// 設定
// ========================================

const RATE_LIMIT_WINDOW_MS = 60000; // 1分
const MAX_REQUESTS_PER_WINDOW = 100; // 1分あたり100リクエスト
const RATE_LIMIT_BY_PATH: Record<string, number> = {
  '/api/ebay': 30,
  '/api/amazon': 20,
  '/api/ai': 50,
  '/api/listing': 30,
  '/api/research': 40,
};

// インメモリレート制限（Vercel Edge対応）
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// ========================================
// レート制限チェック
// ========================================

function checkRateLimit(key: string, limit: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || record.resetAt < now) {
    // 新しいウィンドウを開始
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: limit - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  
  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, remaining: limit - record.count, resetAt: record.resetAt };
}

// ========================================
// IPアドレス取得
// ========================================

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  return 'unknown';
}

// ========================================
// CSRF保護
// ========================================

function checkCsrf(request: NextRequest): boolean {
  // GETリクエストはスキップ
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return true;
  }
  
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  // Originヘッダーが存在しない場合（same-origin）は許可
  if (!origin) {
    return true;
  }
  
  // Originがホストと一致するか確認
  try {
    const originUrl = new URL(origin);
    const allowedHosts = [
      host,
      'localhost:3000',
      'n3-frontend-vercel.vercel.app',
      process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, ''),
    ].filter(Boolean);
    
    return allowedHosts.some(h => originUrl.host === h);
  } catch {
    return false;
  }
}

// ========================================
// パス別レート制限値を取得
// ========================================

function getRateLimitForPath(pathname: string): number {
  for (const [pathPrefix, limit] of Object.entries(RATE_LIMIT_BY_PATH)) {
    if (pathname.startsWith(pathPrefix)) {
      return limit;
    }
  }
  return MAX_REQUESTS_PER_WINDOW;
}

// ========================================
// メインミドルウェア
// ========================================

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 静的ファイルとNext.js内部ルートをスキップ
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }
  
  // APIルートのみにセキュリティを適用
  if (pathname.startsWith('/api')) {
    const clientIp = getClientIp(request);
    
    // 1. CSRF保護チェック（SEC-003）
    if (!checkCsrf(request)) {
      return new NextResponse(
        JSON.stringify({ error: 'CSRF validation failed', code: 'CSRF_ERROR' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 2. レート制限チェック（SEC-001）
    const rateLimit = getRateLimitForPath(pathname);
    const rateLimitKey = `${clientIp}:${pathname.split('/').slice(0, 3).join('/')}`;
    const { allowed, remaining, resetAt } = checkRateLimit(rateLimitKey, rateLimit);
    
    const response = allowed 
      ? NextResponse.next()
      : new NextResponse(
          JSON.stringify({ 
            error: 'Rate limit exceeded', 
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.ceil((resetAt - Date.now()) / 1000)
          }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    
    // レート制限ヘッダーを追加
    response.headers.set('X-RateLimit-Limit', rateLimit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());
    
    if (!allowed) {
      response.headers.set('Retry-After', Math.ceil((resetAt - Date.now()) / 1000).toString());
    }
    
    // 3. セキュリティヘッダーを追加
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }
  
  return NextResponse.next();
}

// ========================================
// マッチャー設定
// ========================================

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
