'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export interface HTSCandidate {
  hts_code: string;
  hts_description: string;
  confidence: number;
  score: number;
  general_rate?: string;
  special_rate?: string;
  additional_duties?: string;
  source?: string;
}

export interface HTSClassificationResult {
  candidates: HTSCandidate[];
  count: number;
  autoSelected: {
    hts_code: string;
    confidence: number;
    score: number;
  } | null;
}

export function useHTSClassification() {
  const [classifying, setClassifying] = useState(false);

  const classifyProduct = async (productData: {
    title: string;
    titleJa?: string;
    category?: string;
    brand?: string;
    keywords?: string[];
    hts_keywords?: string;
    material_recommendation?: string;
    origin_country_candidate?: string;
  }): Promise<HTSClassificationResult | null> => {
    setClassifying(true);
    try {
      const response = await fetch('/api/products/hts-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'HTS分類に失敗しました');
      }

      const data = result.data;

      // 成功メッセージ
      if (data.count > 0) {
        const topCandidate = data.candidates[0];
        toast.success(
          `HTS Code: ${topCandidate.hts_code} (スコア: ${topCandidate.score})`,
          { duration: 3000 }
        );
      } else {
        toast.warning('HTS Codeの候補が見つかりませんでした');
      }

      return {
        candidates: data.candidates || [],
        count: data.count || 0,
        autoSelected: data.autoSelected || null
      };

    } catch (error: any) {
      console.error('HTS classification error:', error);
      toast.error(`HTS分類エラー: ${error.message}`);
      return null;
    } finally {
      setClassifying(false);
    }
  };

  /**
   * 関税計算（簡易版）
   */
  const calculateDuty = (
    priceUsd: number,
    htsCode: string,
    generalRate?: string
  ): {
    dutyRate: number;
    dutyAmount: number;
    totalCost: number;
  } => {
    // 関税率の解析
    let dutyRate = 0;

    if (generalRate) {
      // "5%" → 5
      // "Free" → 0
      // "2.5%" → 2.5
      const match = generalRate.match(/(\d+\.?\d*)/);
      if (match) {
        dutyRate = parseFloat(match[1]);
      }
    }

    const dutyAmount = (priceUsd * dutyRate) / 100;
    const totalCost = priceUsd + dutyAmount;

    return {
      dutyRate,
      dutyAmount,
      totalCost
    };
  };

  return {
    classifyProduct,
    calculateDuty,
    classifying
  };
}
