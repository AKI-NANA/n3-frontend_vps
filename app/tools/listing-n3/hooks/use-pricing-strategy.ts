// app/tools/listing-n3/hooks/use-pricing-strategy.ts
/**
 * 価格戦略フック
 * 競合分析・価格設定・ルール管理
 */

'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  PricePoint,
  PricingStrategy,
  PricingRule,
  Marketplace,
} from '../types/listing';

// モック価格データ
const generateMockPricePoints = (productId: string): PricePoint[] => {
  const marketplaces: Marketplace[] = ['ebay', 'amazon', 'mercari', 'yahoo', 'rakuten'];
  const basePrice = Math.floor(Math.random() * 30000) + 5000;

  return marketplaces.map(mp => {
    const variance = (Math.random() - 0.5) * 0.2; // ±10%
    const competitorCount = Math.floor(Math.random() * 5) + 2;

    return {
      marketplace: mp,
      currentPrice: Math.round(basePrice * (1 + variance)),
      suggestedPrice: Math.round(basePrice * (1 + variance * 0.5)),
      minPrice: Math.round(basePrice * 0.8),
      maxPrice: Math.round(basePrice * 1.3),
      competitorPrices: Array.from({ length: competitorCount }, () =>
        Math.round(basePrice * (0.85 + Math.random() * 0.3))
      ),
      currency: 'JPY',
    };
  });
};

// デフォルト戦略
const defaultStrategies: PricingStrategy[] = [
  {
    id: 'strategy-1',
    name: '競合追従',
    type: 'competitive',
    rules: [
      {
        id: 'rule-1',
        condition: '競合最安値より高い場合',
        action: 'decrease',
        value: 5,
        valueType: 'percentage',
      },
    ],
    isActive: true,
  },
  {
    id: 'strategy-2',
    name: '固定マージン',
    type: 'fixed',
    rules: [
      {
        id: 'rule-2',
        condition: '常時',
        action: 'set',
        value: 30,
        valueType: 'percentage',
      },
    ],
    isActive: false,
  },
  {
    id: 'strategy-3',
    name: 'タイムセール',
    type: 'time-based',
    rules: [
      {
        id: 'rule-3',
        condition: '週末',
        action: 'decrease',
        value: 10,
        valueType: 'percentage',
      },
    ],
    isActive: false,
  },
];

export function usePricingStrategy() {
  const [strategies, setStrategies] = useState<PricingStrategy[]>(defaultStrategies);
  const [pricePoints, setPricePoints] = useState<Map<string, PricePoint[]>>(new Map());
  const [loading, setLoading] = useState(false);

  // アクティブな戦略
  const activeStrategy = useMemo(
    () => strategies.find(s => s.isActive),
    [strategies]
  );

  // 価格分析取得
  const fetchPriceAnalysis = useCallback(async (productId: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));

    const points = generateMockPricePoints(productId);
    setPricePoints(prev => new Map(prev).set(productId, points));
    setLoading(false);

    return points;
  }, []);

  // 戦略切り替え
  const activateStrategy = useCallback((strategyId: string) => {
    setStrategies(prev =>
      prev.map(s => ({
        ...s,
        isActive: s.id === strategyId,
      }))
    );
  }, []);

  // 戦略追加
  const addStrategy = useCallback((strategy: Omit<PricingStrategy, 'id'>) => {
    const newStrategy: PricingStrategy = {
      ...strategy,
      id: `strategy-${Date.now()}`,
    };
    setStrategies(prev => [...prev, newStrategy]);
    return newStrategy;
  }, []);

  // 戦略更新
  const updateStrategy = useCallback((id: string, updates: Partial<PricingStrategy>) => {
    setStrategies(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  // 戦略削除
  const deleteStrategy = useCallback((id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id));
  }, []);

  // ルール追加
  const addRule = useCallback((strategyId: string, rule: Omit<PricingRule, 'id'>) => {
    setStrategies(prev =>
      prev.map(s =>
        s.id === strategyId
          ? {
              ...s,
              rules: [...s.rules, { ...rule, id: `rule-${Date.now()}` }],
            }
          : s
      )
    );
  }, []);

  // ルール削除
  const deleteRule = useCallback((strategyId: string, ruleId: string) => {
    setStrategies(prev =>
      prev.map(s =>
        s.id === strategyId
          ? { ...s, rules: s.rules.filter(r => r.id !== ruleId) }
          : s
      )
    );
  }, []);

  // 価格適用
  const applyPrice = useCallback((
    productId: string,
    marketplace: Marketplace,
    price: number
  ) => {
    console.log('Apply price:', productId, marketplace, price);
    // 実際のAPIコール
  }, []);

  // 一括価格更新
  const bulkApplyPrices = useCallback((updates: Array<{
    productId: string;
    marketplace: Marketplace;
    price: number;
  }>) => {
    console.log('Bulk apply prices:', updates);
    // 実際のAPIコール
  }, []);

  return {
    strategies,
    activeStrategy,
    pricePoints,
    loading,
    fetchPriceAnalysis,
    activateStrategy,
    addStrategy,
    updateStrategy,
    deleteStrategy,
    addRule,
    deleteRule,
    applyPrice,
    bulkApplyPrices,
  };
}

export default usePricingStrategy;
