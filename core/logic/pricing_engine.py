"""
N3 Empire OS - 中核価格計算エンジン
=====================================
Version: 1.0.0
Purpose: n8nワークフローから呼び出される価格計算の「脳」
Features:
  - DDP（関税込み）価格計算
  - 利益率自動調整
  - 為替・手数料のDB動的取得
  - HMAC署名検証
"""

import os
import hmac
import hashlib
import time
import json
from dataclasses import dataclass, field, asdict
from typing import Optional, Dict, Any, List
from decimal import Decimal, ROUND_HALF_UP


# ======================
# 設定クラス
# ======================

@dataclass
class PricingConfig:
    """価格計算の設定値"""
    exchange_rate_usd_jpy: float = 150.0
    target_margin: float = 15.0  # %
    min_margin: float = 5.0  # %
    fvf_rate: float = 12.9  # %
    international_fee: float = 1.35  # %
    payment_processing_fee: float = 2.9  # %
    payment_fixed_fee: float = 0.30  # USD
    ddp_service_fee: float = 15.0  # USD
    sales_tax_rate: float = 8.0  # %
    mpf_rate: float = 0.3464  # %
    insertion_fee: float = 0.35  # USD
    
    @classmethod
    def from_db_rows(cls, rows: List[Dict]) -> 'PricingConfig':
        """DBから取得した設定行を設定クラスに変換"""
        config = cls()
        for row in rows:
            key = row.get('key', '')
            value = row.get('value')
            if hasattr(config, key) and value is not None:
                try:
                    setattr(config, key, float(value))
                except (ValueError, TypeError):
                    pass
        return config


@dataclass
class ShippingPolicy:
    """配送ポリシー"""
    max_weight_kg: float
    base_cost: float
    total_shipping: float


# 配送料金テーブル
SHIPPING_POLICIES = [
    ShippingPolicy(0.5, 12, 15),
    ShippingPolicy(1.0, 15, 20),
    ShippingPolicy(2.0, 20, 28),
    ShippingPolicy(5.0, 35, 45),
    ShippingPolicy(10.0, 55, 70),
    ShippingPolicy(20.0, 80, 100),
    ShippingPolicy(30.0, 110, 140),
]

# HTSコード別関税率（セクション301含む）
HTS_TARIFF_MAP = {
    '9504.40': 0.0,      # ゲーム機
    '9504.50': 0.0,      # ビデオゲーム
    '9503.00': 0.0,      # おもちゃ
    '8471.30': 0.0,      # PC
    '8517.12': 0.0,      # スマートフォン
    '8517.62': 0.0,      # 通信機器
    '6505.00': 0.0589,   # 帽子
    '6203.42': 0.12,     # ズボン
    '6204.62': 0.12,     # パンツ
    '9506.91': 0.055,    # フィットネス機器
}

# セクション301追加関税対象
SECTION_301_PREFIXES = ['8471', '8517', '9403', '9405']


# ======================
# 計算関数
# ======================

def get_shipping_policy(weight_kg: float) -> ShippingPolicy:
    """重量から配送ポリシーを取得"""
    for policy in SHIPPING_POLICIES:
        if weight_kg <= policy.max_weight_kg:
            return policy
    return SHIPPING_POLICIES[-1]


def get_tariff_rate(hts_code: str, origin_country: str) -> tuple[float, float]:
    """
    HTSコードと原産国から関税率を取得
    Returns: (base_tariff, section_301_tariff)
    """
    if not hts_code:
        return 0.06, 0.0
    
    hts_prefix = hts_code[:7] if len(hts_code) >= 7 else hts_code
    base_tariff = HTS_TARIFF_MAP.get(hts_prefix, 0.06)
    
    section_301 = 0.0
    if origin_country == 'CN':
        hts_4digit = hts_code[:4] if len(hts_code) >= 4 else hts_code
        if hts_4digit in SECTION_301_PREFIXES:
            section_301 = 0.25
    
    return base_tariff, section_301


def calculate_ddp_price(
    cost_jpy: float,
    weight_g: float,
    hts_code: str = None,
    origin_country: str = 'JP',
    config: PricingConfig = None,
    competitor_min_price: float = None,
    competitor_avg_price: float = None,
) -> Dict[str, Any]:
    """
    DDP（関税込み）価格計算のメイン関数
    
    Args:
        cost_jpy: 仕入原価（円）
        weight_g: 重量（グラム）
        hts_code: HSコード
        origin_country: 原産国
        config: 計算設定
        competitor_min_price: 競合最安値（USD）
        competitor_avg_price: 競合平均値（USD）
    
    Returns:
        計算結果のDict
    """
    if config is None:
        config = PricingConfig()
    
    # 基本変換
    exchange_rate = config.exchange_rate_usd_jpy
    cost_usd = cost_jpy / exchange_rate
    weight_kg = weight_g / 1000
    
    # 配送ポリシー取得
    shipping_policy = get_shipping_policy(weight_kg)
    base_shipping = shipping_policy.base_cost
    total_shipping = shipping_policy.total_shipping
    
    # 関税率取得
    base_tariff, section_301 = get_tariff_rate(hts_code, origin_country)
    total_tariff_rate = base_tariff + section_301
    
    # 変動費率
    target_margin_rate = config.target_margin / 100
    fvf_rate = config.fvf_rate / 100
    intl_fee_rate = config.international_fee / 100
    payment_rate = config.payment_processing_fee / 100
    
    variable_rate = fvf_rate + intl_fee_rate + payment_rate
    
    # 反復計算で商品価格を決定（10回収束）
    product_price = 50.0
    for _ in range(10):
        # 関税・消費税計算
        tariff = product_price * total_tariff_rate
        sales_tax = product_price * (config.sales_tax_rate / 100)
        mpf = product_price * (config.mpf_rate / 100)
        ddp_cost = tariff + sales_tax + mpf + config.ddp_service_fee
        
        # 固定コスト
        fixed_cost = cost_usd + base_shipping + ddp_cost + config.insertion_fee + config.payment_fixed_fee
        
        # 必要売上
        required_revenue = fixed_cost / (1 - target_margin_rate - variable_rate)
        new_price = required_revenue - total_shipping
        
        if abs(new_price - product_price) < 0.1:
            product_price = new_price
            break
        product_price = new_price
    
    # 価格調整（競合価格考慮）
    product_price = max(10, round(product_price / 5) * 5)  # 最低$10、$5単位
    
    if competitor_min_price and competitor_min_price > 0:
        if product_price < competitor_min_price * 0.8:
            product_price = round(competitor_min_price * 0.9 / 5) * 5
    
    if competitor_avg_price and competitor_avg_price > 0:
        if product_price > competitor_avg_price * 1.3:
            product_price = round(competitor_avg_price * 1.2 / 5) * 5
    
    # 最終計算
    total_revenue = product_price + total_shipping
    tariff_final = product_price * total_tariff_rate
    sales_tax_final = product_price * (config.sales_tax_rate / 100)
    mpf_final = product_price * (config.mpf_rate / 100)
    ddp_total = tariff_final + sales_tax_final + mpf_final + config.ddp_service_fee
    
    ebay_fees = total_revenue * variable_rate + config.insertion_fee + config.payment_fixed_fee
    total_costs = cost_usd + base_shipping + ddp_total + ebay_fees
    
    profit_usd = total_revenue - total_costs
    profit_margin = (profit_usd / total_revenue * 100) if total_revenue > 0 else 0
    profit_jpy = profit_usd * exchange_rate
    
    # ステータス判定
    has_tariff = total_tariff_rate > 0
    required_margin = 10 if has_tariff else 5
    
    is_red_flag = False
    workflow_status = 'ready'
    error_reason = ''
    
    if profit_usd < 0:
        workflow_status = 'review'
        is_red_flag = True
        error_reason = f'赤字: ${profit_usd:.2f}'
    elif profit_margin < required_margin:
        workflow_status = 'review'
        is_red_flag = True
        error_reason = f'利益率不足: {profit_margin:.1f}%（最低{required_margin}%）'
    
    return {
        'price_usd': round(product_price, 2),
        'shipping_usd': round(total_shipping, 2),
        'total_revenue': round(total_revenue, 2),
        'cost_usd': round(cost_usd, 2),
        'tariff_usd': round(tariff_final, 2),
        'tariff_rate': round(total_tariff_rate * 100, 2),
        'ddp_total_usd': round(ddp_total, 2),
        'ebay_fees_usd': round(ebay_fees, 2),
        'total_costs_usd': round(total_costs, 2),
        'profit_usd': round(profit_usd, 2),
        'profit_margin': round(profit_margin, 1),
        'profit_jpy': round(profit_jpy),
        'workflow_status': workflow_status,
        'is_red_flag': is_red_flag,
        'error_reason': error_reason,
        'calculation_details': {
            'exchange_rate': exchange_rate,
            'weight_kg': round(weight_kg, 3),
            'base_shipping': base_shipping,
            'total_shipping': total_shipping,
            'base_tariff': round(base_tariff * 100, 2),
            'section_301': round(section_301 * 100, 2),
            'origin_country': origin_country,
            'hts_code': hts_code,
        }
    }


def calculate_batch(
    products: List[Dict],
    config: PricingConfig = None
) -> List[Dict]:
    """
    バッチ価格計算
    
    Args:
        products: 計算対象商品リスト
        config: 計算設定
    
    Returns:
        計算結果リスト
    """
    results = []
    for product in products:
        try:
            result = calculate_ddp_price(
                cost_jpy=product.get('cost_jpy', 0),
                weight_g=product.get('weight_g', 500),
                hts_code=product.get('hts_code'),
                origin_country=product.get('origin_country', 'JP'),
                config=config,
                competitor_min_price=product.get('sm_lowest_price'),
                competitor_avg_price=product.get('sm_average_price'),
            )
            result['product_id'] = product.get('product_id')
            result['sku'] = product.get('sku')
            results.append(result)
        except Exception as e:
            results.append({
                'product_id': product.get('product_id'),
                'error': str(e),
                'workflow_status': 'error',
                'is_red_flag': True,
            })
    
    return results


# ======================
# HMAC署名検証
# ======================

def verify_hmac_signature(
    payload: str,
    signature: str,
    timestamp: str,
    secret: str,
    max_age_seconds: int = 300
) -> tuple[bool, str]:
    """
    HMAC署名を検証
    
    Args:
        payload: リクエストボディ（JSON文字列）
        signature: x-n3-signature ヘッダー
        timestamp: x-n3-timestamp ヘッダー
        secret: HMAC秘密鍵
        max_age_seconds: 有効期間（秒）
    
    Returns:
        (is_valid, error_message)
    """
    if not signature or not timestamp:
        return False, '署名またはタイムスタンプが不足'
    
    try:
        ts = int(timestamp)
        now = int(time.time())
        if abs(now - ts) > max_age_seconds:
            return False, f'タイムスタンプ期限切れ（{max_age_seconds}秒）'
    except ValueError:
        return False, '無効なタイムスタンプ形式'
    
    message = f'{timestamp}.{payload}'
    expected = hmac.new(
        secret.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected):
        return False, '署名が一致しません'
    
    return True, ''


def generate_hmac_signature(payload: str, secret: str) -> tuple[str, str]:
    """
    HMAC署名を生成
    
    Returns:
        (signature, timestamp)
    """
    timestamp = str(int(time.time()))
    message = f'{timestamp}.{payload}'
    signature = hmac.new(
        secret.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    return signature, timestamp


# ======================
# テスト
# ======================

if __name__ == '__main__':
    # テスト計算
    config = PricingConfig(
        exchange_rate_usd_jpy=155.0,
        target_margin=15.0,
        fvf_rate=12.9,
    )
    
    result = calculate_ddp_price(
        cost_jpy=5000,
        weight_g=800,
        hts_code='9504.40.00',
        origin_country='JP',
        config=config,
    )
    
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # HMAC署名テスト
    payload = '{"test": "data"}'
    secret = 'test-secret-key'
    sig, ts = generate_hmac_signature(payload, secret)
    is_valid, err = verify_hmac_signature(payload, sig, ts, secret)
    print(f'\nHMAC検証: {is_valid}, エラー: {err}')
