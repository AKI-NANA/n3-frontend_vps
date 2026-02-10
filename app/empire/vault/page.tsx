'use client';

import React, { useState, useEffect } from 'react';
import { 
  Key, Shield, CheckCircle, XCircle, AlertTriangle, 
  Eye, EyeOff, Plus, Trash2, RefreshCw, ExternalLink 
} from 'lucide-react';

// ========================================
// 型定義
// ========================================

interface SecretConfig {
  type: string;
  name: string;
  description: string;
  icon: string;
  fields: SecretField[];
  docsUrl?: string;
  testEndpoint?: string;
}

interface SecretField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface StoredSecret {
  id: string;
  type: string;
  name: string;
  status: 'valid' | 'invalid' | 'pending' | 'expired';
  lastVerified?: string;
  metadata?: Record<string, any>;
}

// ========================================
// シークレット設定
// ========================================

const SECRET_CONFIGS: SecretConfig[] = [
  {
    type: 'ebay_api',
    name: 'eBay API',
    description: 'eBay Developer Programの認証情報',
    icon: '🛒',
    docsUrl: 'https://developer.ebay.com/',
    testEndpoint: '/api/ebay/test-connection',
    fields: [
      { key: 'client_id', label: 'Client ID (App ID)', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret (Cert ID)', type: 'password', required: true },
      { key: 'dev_id', label: 'Dev ID', type: 'text', required: true },
      { key: 'environment', label: '環境', type: 'select', options: [
        { value: 'production', label: 'Production' },
        { value: 'sandbox', label: 'Sandbox' },
      ]},
      { key: 'ru_name', label: 'RuName', type: 'text', required: true },
    ],
  },
  {
    type: 'amazon_sp_api',
    name: 'Amazon SP-API',
    description: 'Amazon Selling Partner APIの認証情報',
    icon: '📦',
    docsUrl: 'https://developer-docs.amazon.com/sp-api/',
    testEndpoint: '/api/amazon/test-connection',
    fields: [
      { key: 'client_id', label: 'Client ID', type: 'text', required: true },
      { key: 'client_secret', label: 'Client Secret', type: 'password', required: true },
      { key: 'refresh_token', label: 'Refresh Token', type: 'password', required: true },
      { key: 'marketplace', label: 'マーケットプレイス', type: 'select', options: [
        { value: 'US', label: 'Amazon.com (US)' },
        { value: 'JP', label: 'Amazon.co.jp (JP)' },
        { value: 'UK', label: 'Amazon.co.uk (UK)' },
        { value: 'DE', label: 'Amazon.de (DE)' },
      ]},
    ],
  },
  {
    type: 'openai_api',
    name: 'OpenAI API',
    description: 'GPTモデルによるAI機能',
    icon: '🤖',
    docsUrl: 'https://platform.openai.com/',
    testEndpoint: '/api/ai/test-openai',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true, placeholder: 'sk-...' },
      { key: 'organization_id', label: 'Organization ID', type: 'text', placeholder: 'org-... (オプション)' },
    ],
  },
  {
    type: 'elevenlabs_api',
    name: 'ElevenLabs API',
    description: '高品質音声合成（メディア生成用）',
    icon: '🎙️',
    docsUrl: 'https://elevenlabs.io/',
    testEndpoint: '/api/media/test-elevenlabs',
    fields: [
      { key: 'api_key', label: 'API Key', type: 'password', required: true },
    ],
  },
  {
    type: 'chatwork_api',
    name: 'ChatWork API',
    description: '通知・アラート送信用',
    icon: '💬',
    docsUrl: 'https://developer.chatwork.com/',
    testEndpoint: '/api/notifications/test-chatwork',
    fields: [
      { key: 'api_token', label: 'APIトークン', type: 'password', required: true },
      { key: 'room_id', label: 'ルームID', type: 'text', required: true },
    ],
  },
  {
    type: 'stripe_api',
    name: 'Stripe API',
    description: '決済処理（商用プラン用）',
    icon: '💳',
    docsUrl: 'https://stripe.com/docs/api',
    testEndpoint: '/api/payments/test-stripe',
    fields: [
      { key: 'secret_key', label: 'Secret Key', type: 'password', required: true, placeholder: 'sk_live_...' },
      { key: 'publishable_key', label: 'Publishable Key', type: 'text', required: true, placeholder: 'pk_live_...' },
      { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' },
    ],
  },
];

// ========================================
// コンポーネント
// ========================================

export default function VaultPage() {
  const [secrets, setSecrets] = useState<StoredSecret[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // モックデータ読み込み
  useEffect(() => {
    // 実際にはSupabaseから取得
    setSecrets([
      { id: '1', type: 'ebay_api', name: 'eBay Production', status: 'valid', lastVerified: '2025-01-23T10:00:00Z' },
      { id: '2', type: 'openai_api', name: 'OpenAI GPT-4', status: 'valid', lastVerified: '2025-01-23T09:30:00Z' },
    ]);
  }, []);
  
  const getStatusIcon = (status: StoredSecret['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'invalid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <RefreshCw className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'expired':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };
  
  const getStatusText = (status: StoredSecret['status']) => {
    switch (status) {
      case 'valid': return '有効';
      case 'invalid': return '無効';
      case 'pending': return '検証中';
      case 'expired': return '期限切れ';
    }
  };
  
  const handleTestConnection = async (secretType: string) => {
    setTesting(secretType);
    
    // 実際にはAPIを呼び出す
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTesting(null);
  };
  
  const handleSaveSecret = async () => {
    if (!selectedType) return;
    
    setSaving(true);
    
    // 実際にはSupabaseに保存
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const config = SECRET_CONFIGS.find(c => c.type === selectedType);
    if (config) {
      setSecrets(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: selectedType,
          name: formData.name || config.name,
          status: 'pending',
        },
      ]);
    }
    
    setSaving(false);
    setSelectedType(null);
    setFormData({});
  };
  
  const handleDeleteSecret = async (id: string) => {
    if (!confirm('このAPIキーを削除しますか？')) return;
    
    setSecrets(prev => prev.filter(s => s.id !== id));
  };
  
  const togglePasswordVisibility = (fieldKey: string) => {
    setShowPasswords(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }));
  };
  
  const selectedConfig = selectedType ? SECRET_CONFIGS.find(c => c.type === selectedType) : null;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              シークレット・ボルト
            </h1>
          </div>
          <p className="text-gray-600">
            外部サービスのAPIキーを安全に管理します。すべてのキーはAES-256で暗号化されて保存されます。
          </p>
        </div>
        
        {/* Connected Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">接続済みサービス</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {secrets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>まだAPIキーが登録されていません</p>
                <p className="text-sm">下のボタンから追加してください</p>
              </div>
            ) : (
              secrets.map((secret) => {
                const config = SECRET_CONFIGS.find(c => c.type === secret.type);
                return (
                  <div key={secret.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{config?.icon || '🔑'}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{secret.name}</span>
                          <span className="text-xs text-gray-500">({config?.name})</span>
                        </div>
                        {secret.lastVerified && (
                          <p className="text-xs text-gray-500">
                            最終検証: {new Date(secret.lastVerified).toLocaleString('ja-JP')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(secret.status)}
                        <span className={`text-sm ${
                          secret.status === 'valid' ? 'text-green-600' :
                          secret.status === 'invalid' ? 'text-red-600' :
                          secret.status === 'expired' ? 'text-orange-600' :
                          'text-yellow-600'
                        }`}>
                          {getStatusText(secret.status)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleTestConnection(secret.type)}
                        disabled={testing === secret.type}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="接続テスト"
                      >
                        <RefreshCw className={`w-4 h-4 ${testing === secret.type ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDeleteSecret(secret.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="削除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        {/* Add New Secret */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">新しいAPIキーを追加</h2>
          </div>
          
          {!selectedType ? (
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              {SECRET_CONFIGS.map((config) => (
                <button
                  key={config.type}
                  onClick={() => setSelectedType(config.type)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <span className="text-2xl block mb-2">{config.icon}</span>
                  <span className="font-medium text-gray-900 block">{config.name}</span>
                  <span className="text-xs text-gray-500">{config.description}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedConfig?.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedConfig?.name}</h3>
                    <p className="text-sm text-gray-500">{selectedConfig?.description}</p>
                  </div>
                </div>
                {selectedConfig?.docsUrl && (
                  <a
                    href={selectedConfig.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    ドキュメント
                  </a>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    表示名
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={`${selectedConfig?.name} (デフォルト)`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {selectedConfig?.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.key] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">選択してください</option>
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="relative">
                        <input
                          type={field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'}
                          value={formData[field.key] || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {field.type === 'password' && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field.key)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[field.key] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedType(null);
                    setFormData({});
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSaveSecret}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      保存
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Security Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">セキュリティについて</h3>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• すべてのAPIキーはAES-256-GCMで暗号化されて保存されます</li>
                <li>• 暗号化キーはHSMで管理され、キーローテーションが定期的に行われます</li>
                <li>• APIキーへのアクセスはすべて監査ログに記録されます</li>
                <li>• 本番環境のキーとテスト環境のキーは分離して管理することを推奨します</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
