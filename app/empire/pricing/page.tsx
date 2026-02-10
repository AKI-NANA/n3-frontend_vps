'use client';

import React, { useState } from 'react';
import { Check, Sparkles, Zap, Crown, Mountain, Star } from 'lucide-react';
import { DEFAULT_PLANS, PlanConfig } from '@/lib/empire-os/auth-gate';

// ========================================
// プラン表示データ
// ========================================

interface PlanDisplay {
  code: string;
  name: string;
  nameJa: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  icon: React.ElementType;
  iconColor: string;
  bgGradient: string;
  borderColor: string;
  popular?: boolean;
  enterprise?: boolean;
  features: string[];
  limits: { label: string; value: string }[];
}

const PLAN_DISPLAYS: PlanDisplay[] = [
  {
    code: 'HAKU',
    name: 'Mt. Haku',
    nameJa: '白山プラン',
    description: '個人セラー向けの入門プラン',
    priceMonthly: 4980,
    priceYearly: 49800,
    icon: Mountain,
    iconColor: 'text-gray-600',
    bgGradient: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-200',
    features: [
      'AI商品タイトル最適化',
      'eBay/Amazon連携',
      '基本的なリサーチ機能',
      'メールサポート',
    ],
    limits: [
      { label: '在庫管理', value: '500件' },
      { label: '日次出品', value: '20件' },
      { label: '日次リサーチ', value: '100件' },
      { label: 'アカウント数', value: '1' },
    ],
  },
  {
    code: 'FUJI',
    name: 'Mt. Fuji',
    nameJa: '富士山プラン',
    description: '成長中のセラー向け',
    priceMonthly: 9800,
    priceYearly: 98000,
    icon: Mountain,
    iconColor: 'text-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    popular: true,
    features: [
      'HAKUプランの全機能',
      '自律修復エンジン',
      'バッチリサーチ',
      '優先サポート',
      'API連携（読み取り）',
    ],
    limits: [
      { label: '在庫管理', value: '3,000件' },
      { label: '日次出品', value: '100件' },
      { label: '日次リサーチ', value: '500件' },
      { label: 'アカウント数', value: '3' },
    ],
  },
  {
    code: 'EVEREST',
    name: 'Mt. Everest',
    nameJa: 'エベレストプラン',
    description: 'プロフェッショナルセラー向け',
    priceMonthly: 29800,
    priceYearly: 298000,
    icon: Crown,
    iconColor: 'text-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-200',
    features: [
      'FUJIプランの全機能',
      'マルチアカウント管理',
      'API完全アクセス',
      '優先サポート（24時間）',
      '高度な分析ダッシュボード',
      'カスタムワークフロー',
    ],
    limits: [
      { label: '在庫管理', value: '10,000件' },
      { label: '日次出品', value: '500件' },
      { label: '日次リサーチ', value: '2,000件' },
      { label: 'アカウント数', value: '10' },
    ],
  },
  {
    code: 'KUNLUN-1',
    name: 'Mt. Kunlun I',
    nameJa: '崑崙Ⅰプラン',
    description: 'ビジネス拡大を目指す方向け',
    priceMonthly: 79800,
    priceYearly: 798000,
    icon: Zap,
    iconColor: 'text-yellow-600',
    bgGradient: 'from-yellow-50 to-yellow-100',
    borderColor: 'border-yellow-200',
    features: [
      'EVERESTプランの全機能',
      'マーケット・エキスパンダー',
      'トレンド自動検知',
      'YouTube/TikTok連携',
      '専属アカウントマネージャー',
    ],
    limits: [
      { label: '在庫管理', value: '30,000件' },
      { label: '日次出品', value: '1,500件' },
      { label: '日次リサーチ', value: '5,000件' },
      { label: 'アカウント数', value: '30' },
    ],
  },
  {
    code: 'KUNLUN-3',
    name: 'Mt. Kunlun III',
    nameJa: '崑崙Ⅲプラン',
    description: 'エンタープライズ向け無制限プラン',
    priceMonthly: 498000,
    priceYearly: 4980000,
    icon: Sparkles,
    iconColor: 'text-amber-500',
    bgGradient: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
    enterprise: true,
    features: [
      '全機能無制限アクセス',
      'メディア帝国システム',
      'ホワイトラベル対応',
      '24/7専用サポート',
      'カスタム開発対応',
      'オンプレミス対応可能',
    ],
    limits: [
      { label: '在庫管理', value: '無制限' },
      { label: '日次出品', value: '無制限' },
      { label: '日次リサーチ', value: '無制限' },
      { label: 'アカウント数', value: '無制限' },
    ],
  },
];

// ========================================
// コンポーネント
// ========================================

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP').format(price);
  };
  
  const getDiscountPercentage = (monthly: number, yearly: number) => {
    const monthlyTotal = monthly * 12;
    const discount = ((monthlyTotal - yearly) / monthlyTotal) * 100;
    return Math.round(discount);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          N3 Empire OS プラン
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          あなたのビジネス規模に合わせた最適なプランをお選びください
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            月額
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            年額
            <span className="ml-2 text-green-600 text-xs">2ヶ月分お得</span>
          </button>
        </div>
      </div>
      
      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {PLAN_DISPLAYS.map((plan) => {
            const Icon = plan.icon;
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            const discount = getDiscountPercentage(plan.priceMonthly, plan.priceYearly);
            
            return (
              <div
                key={plan.code}
                className={`relative rounded-2xl border-2 ${plan.borderColor} bg-gradient-to-b ${plan.bgGradient} p-6 flex flex-col ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                } ${plan.enterprise ? 'lg:col-span-1' : ''}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      人気No.1
                    </span>
                  </div>
                )}
                
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-full bg-white shadow-sm mb-4`}>
                    <Icon className={`w-8 h-8 ${plan.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-600">{plan.nameJa}</p>
                  <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                </div>
                
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ¥{formatPrice(price)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{billingCycle === 'monthly' ? '月' : '年'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      年間 {discount}% お得
                    </p>
                  )}
                </div>
                
                {/* Limits */}
                <div className="bg-white rounded-lg p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">利用上限</h4>
                  <div className="space-y-2">
                    {plan.limits.map((limit, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{limit.label}</span>
                        <span className="font-medium text-gray-900">{limit.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Features */}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">機能</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* CTA Button */}
                <button
                  onClick={() => setSelectedPlan(plan.code)}
                  className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.enterprise
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.enterprise ? 'お問い合わせ' : '今すぐ始める'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          よくあるご質問
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              プランはいつでも変更できますか？
            </h3>
            <p className="text-gray-600 text-sm">
              はい、いつでもアップグレード・ダウングレードが可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              無料トライアルはありますか？
            </h3>
            <p className="text-gray-600 text-sm">
              ゲストとして月1回まで全機能をお試しいただけます。本格的にご利用いただく場合は、HAKUプラン以上へのご契約をお願いします。
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              支払い方法は何がありますか？
            </h3>
            <p className="text-gray-600 text-sm">
              クレジットカード（VISA、Mastercard、AMEX）、銀行振込に対応しています。エンタープライズプランでは請求書払いも可能です。
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="text-center mt-16">
        <p className="text-gray-600 mb-4">
          ご不明な点がございましたら、お気軽にお問い合わせください
        </p>
        <a
          href="mailto:support@n3-empire.com"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          support@n3-empire.com
        </a>
      </div>
    </div>
  );
}
