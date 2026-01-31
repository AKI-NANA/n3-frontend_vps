"""
N3 Empire OS - 価格計算API (FastAPI)
=====================================
Version: 1.0.0
Purpose: n8nワークフローから呼び出されるREST API
Endpoints:
  - POST /calculate - 単一商品価格計算
  - POST /calculate-batch - バッチ価格計算
  - POST /verify-signature - HMAC署名検証
  - GET /health - ヘルスチェック
"""

import os
import json
import asyncio
from typing import Optional, List, Dict, Any
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Header, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx

from pricing_engine import (
    PricingConfig,
    calculate_ddp_price,
    calculate_batch,
    verify_hmac_signature,
    generate_hmac_signature,
)


# ======================
# 環境変数
# ======================

SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://zdzfpucdyxdlavkgrvil.supabase.co')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')
N3_HMAC_SECRET = os.getenv('N3_HMAC_SECRET', 'your-hmac-secret-key-change-this')
PORT = int(os.getenv('PRICING_ENGINE_PORT', 8000))

# 設定キャッシュ
_config_cache: Dict[str, PricingConfig] = {}
_config_cache_ts: Dict[str, float] = {}
CONFIG_CACHE_TTL = 300  # 5分


# ======================
# Pydanticモデル
# ======================

class CalculateRequest(BaseModel):
    cost_jpy: float = Field(..., description='仕入原価（円）')
    weight_g: float = Field(500, description='重量（グラム）')
    hts_code: Optional[str] = Field(None, description='HSコード')
    origin_country: str = Field('JP', description='原産国')
    user_id: str = Field('default', description='ユーザーID')
    sm_lowest_price: Optional[float] = Field(None, description='競合最安値')
    sm_average_price: Optional[float] = Field(None, description='競合平均値')


class BatchCalculateRequest(BaseModel):
    products: List[Dict[str, Any]] = Field(..., description='商品リスト')
    user_id: str = Field('default', description='ユーザーID')


class VerifySignatureRequest(BaseModel):
    payload: str
    signature: str
    timestamp: str


class CalculateResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    processed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class BatchCalculateResponse(BaseModel):
    success: bool
    results: Optional[List[Dict[str, Any]]] = None
    summary: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    processed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


# ======================
# ヘルパー関数
# ======================

async def fetch_config_from_db(user_id: str) -> PricingConfig:
    """Supabaseからユーザー設定を取得"""
    global _config_cache, _config_cache_ts
    
    now = datetime.utcnow().timestamp()
    cache_key = user_id
    
    # キャッシュチェック
    if cache_key in _config_cache:
        if now - _config_cache_ts.get(cache_key, 0) < CONFIG_CACHE_TTL:
            return _config_cache[cache_key]
    
    # DBから取得
    if not SUPABASE_SERVICE_KEY:
        return PricingConfig()
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f'{SUPABASE_URL}/rest/v1/global_settings',
                params={
                    'user_id': f'eq.{user_id}',
                    'select': 'key,value',
                },
                headers={
                    'apikey': SUPABASE_SERVICE_KEY,
                    'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
                },
                timeout=10.0,
            )
            
            if response.status_code == 200:
                rows = response.json()
                config = PricingConfig.from_db_rows(rows)
                _config_cache[cache_key] = config
                _config_cache_ts[cache_key] = now
                return config
    except Exception as e:
        print(f'設定取得エラー: {e}')
    
    return PricingConfig()


# ======================
# FastAPIアプリ
# ======================

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f'🚀 N3 Pricing Engine 起動中... ポート: {PORT}')
    yield
    print('🛑 N3 Pricing Engine 停止')


app = FastAPI(
    title='N3 Pricing Engine',
    description='N3 Empire OS 価格計算エンジン API',
    version='1.0.0',
    lifespan=lifespan,
)

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# ======================
# ミドルウェア：HMAC検証
# ======================

@app.middleware('http')
async def verify_request_signature(request: Request, call_next):
    """リクエスト署名検証ミドルウェア"""
    # ヘルスチェックはスキップ
    if request.url.path in ['/health', '/docs', '/openapi.json', '/']:
        return await call_next(request)
    
    signature = request.headers.get('x-n3-signature')
    timestamp = request.headers.get('x-n3-timestamp')
    
    # 署名がない場合はスキップ（開発環境用）
    if not signature or not timestamp:
        # 本番環境では拒否
        if os.getenv('REQUIRE_SIGNATURE', 'false').lower() == 'true':
            return Response(
                content=json.dumps({'success': False, 'error': '署名が必要です'}),
                status_code=401,
                media_type='application/json',
            )
        return await call_next(request)
    
    # ボディを読み取り
    body = await request.body()
    payload = body.decode('utf-8')
    
    is_valid, error = verify_hmac_signature(
        payload=payload,
        signature=signature,
        timestamp=timestamp,
        secret=N3_HMAC_SECRET,
    )
    
    if not is_valid:
        return Response(
            content=json.dumps({'success': False, 'error': f'署名検証失敗: {error}'}),
            status_code=401,
            media_type='application/json',
        )
    
    return await call_next(request)


# ======================
# エンドポイント
# ======================

@app.get('/')
async def root():
    return {'service': 'N3 Pricing Engine', 'version': '1.0.0', 'status': 'running'}


@app.get('/health')
async def health():
    return {
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'service': 'N3 Pricing Engine',
        'version': '1.0.0',
    }


@app.post('/calculate', response_model=CalculateResponse)
async def calculate_price(req: CalculateRequest):
    """単一商品の価格計算"""
    try:
        config = await fetch_config_from_db(req.user_id)
        
        result = calculate_ddp_price(
            cost_jpy=req.cost_jpy,
            weight_g=req.weight_g,
            hts_code=req.hts_code,
            origin_country=req.origin_country,
            config=config,
            competitor_min_price=req.sm_lowest_price,
            competitor_avg_price=req.sm_average_price,
        )
        
        return CalculateResponse(success=True, data=result)
    
    except Exception as e:
        return CalculateResponse(success=False, error=str(e))


@app.post('/calculate-batch', response_model=BatchCalculateResponse)
async def calculate_batch_prices(req: BatchCalculateRequest):
    """バッチ価格計算"""
    try:
        config = await fetch_config_from_db(req.user_id)
        
        results = calculate_batch(req.products, config)
        
        # サマリー計算
        total = len(results)
        ready = sum(1 for r in results if r.get('workflow_status') == 'ready')
        review = sum(1 for r in results if r.get('workflow_status') == 'review')
        errors = sum(1 for r in results if r.get('workflow_status') == 'error')
        avg_margin = (
            sum(r.get('profit_margin', 0) for r in results if 'profit_margin' in r) / total
            if total > 0 else 0
        )
        
        summary = {
            'total': total,
            'ready': ready,
            'review': review,
            'errors': errors,
            'avg_margin': round(avg_margin, 1),
        }
        
        return BatchCalculateResponse(success=True, results=results, summary=summary)
    
    except Exception as e:
        return BatchCalculateResponse(success=False, error=str(e))


@app.post('/verify-signature')
async def verify_signature(req: VerifySignatureRequest):
    """署名検証エンドポイント"""
    is_valid, error = verify_hmac_signature(
        payload=req.payload,
        signature=req.signature,
        timestamp=req.timestamp,
        secret=N3_HMAC_SECRET,
    )
    
    return {'valid': is_valid, 'error': error if not is_valid else None}


@app.post('/generate-signature')
async def generate_signature_endpoint(
    payload: str = '',
):
    """署名生成エンドポイント（開発用）"""
    signature, timestamp = generate_hmac_signature(payload, N3_HMAC_SECRET)
    return {
        'signature': signature,
        'timestamp': timestamp,
        'headers': {
            'x-n3-signature': signature,
            'x-n3-timestamp': timestamp,
        }
    }


@app.post('/clear-cache')
async def clear_cache():
    """設定キャッシュをクリア"""
    global _config_cache, _config_cache_ts
    _config_cache = {}
    _config_cache_ts = {}
    return {'success': True, 'message': 'キャッシュをクリアしました'}


# ======================
# 起動
# ======================

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=PORT)
