'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export interface OriginCountryDetectionResult {
  origin_country: string;
  confidence: number;
  reason: string;
  source: 'sm_analysis' | 'ai_detection' | 'default';
  alternatives?: Array<{
    country_code: string;
    confidence: number;
    reason: string;
  }>;
}

export function useOriginCountryDetection() {
  const [detecting, setDetecting] = useState(false);

  const detectOriginCountry = async (productData: {
    title: string;
    titleJa?: string;
    description?: string;
    descriptionJa?: string;
    category?: string;
    brand?: string;
    keywords?: string[];
    smData?: {
      origin_country?: string;
      seller_location?: string;
    };
  }): Promise<OriginCountryDetectionResult | null> => {
    setDetecting(true);
    try {
      const response = await fetch('/api/origin-country/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || '原産国の検出に失敗しました');
      }

      // 成功メッセージ
      const countryNames: Record<string, string> = {
        'JP': '日本',
        'CN': '中国',
        'KR': '韓国',
        'US': 'アメリカ',
        'DE': 'ドイツ',
        'GB': 'イギリス',
        'FR': 'フランス',
        'IT': 'イタリア',
        'UNKNOWN': '不明'
      };

      const countryName = countryNames[data.origin_country] || data.origin_country;
      
      if (data.source === 'sm_analysis') {
        toast.success(`原産国: ${countryName} (SM分析データ)`);
      } else if (data.source === 'ai_detection') {
        toast.success(`原産国: ${countryName} (AI推測 - ${Math.round(data.confidence * 100)}%)`);
      } else {
        toast.info(`原産国: ${countryName} (デフォルト値)`);
      }

      return {
        origin_country: data.origin_country,
        confidence: data.confidence,
        reason: data.reason,
        source: data.source,
        alternatives: data.alternatives
      };

    } catch (error: any) {
      console.error('Origin country detection error:', error);
      toast.error(`原産国検出エラー: ${error.message}`);
      return null;
    } finally {
      setDetecting(false);
    }
  };

  return {
    detectOriginCountry,
    detecting
  };
}
