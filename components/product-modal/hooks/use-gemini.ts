'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export type GeminiContentType = 'market' | 'title' | 'description';

export interface GeminiGenerateOptions {
  title?: string;
  titleJa?: string;
  description?: string;
  descriptionJa?: string;
  category?: string;
  priceUsd?: number;
  priceJpy?: number;
}

export function useGemini() {
  const [generating, setGenerating] = useState(false);

  const generateContent = async (
    type: GeminiContentType,
    options: GeminiGenerateOptions
  ): Promise<string | null> => {
    setGenerating(true);
    try {
      // Gemini APIキーを取得
      const keyResponse = await fetch('/api/gemini/get-key');
      if (!keyResponse.ok) {
        throw new Error('APIキーの取得に失敗しました');
      }
      const { apiKey } = await keyResponse.json();

      if (!apiKey) {
        throw new Error('Gemini APIキーが設定されていません');
      }

      // Google Generative AI を動的インポート
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      });

      let prompt = '';

      switch (type) {
        case 'market':
          prompt = `
商品情報:
- タイトル: ${options.titleJa || options.title || '不明'}
- カテゴリ: ${options.category || '不明'}
- 価格: $${options.priceUsd || 'N/A'} (¥${options.priceJpy || 'N/A'})

この商品のeBayにおける市場調査を行い、以下を分析してください:
1. 競合の数と価格帯
2. 需要の高さ（High/Medium/Low）
3. 推奨販売価格
4. マーケティング戦略（3つ以内）

簡潔に要点をまとめてください（300文字以内）。
          `.trim();
          break;

        case 'title':
          prompt = `
日本語商品名: ${options.titleJa || '不明'}
カテゴリ: ${options.category || '不明'}

eBayで売れやすい魅力的な英語タイトルを生成してください。

要件:
- 80文字以内
- SEOキーワードを含む
- 商品の特徴を明確に
- そのままコピペできる完成形で出力
- 説明文は不要

タイトルのみ出力してください。
          `.trim();
          break;

        case 'description':
          prompt = `
商品情報:
- 日本語タイトル: ${options.titleJa || '不明'}
- 英語タイトル: ${options.title || '不明'}
- 日本語説明: ${options.descriptionJa || ''}

eBayで購入意欲を高める英語の商品説明文を生成してください。

要件:
- 商品の特徴とメリットを強調
- 購入者への価値を明確に
- 200-300語程度
- HTML不要、プレーンテキストで
- 段落分けは適度に

説明文のみ出力してください。
          `.trim();
          break;
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      if (!text) {
        throw new Error('生成されたコンテンツが空です');
      }

      // 成功メッセージ
      switch (type) {
        case 'market':
          toast.success('市場調査完了');
          break;
        case 'title':
          toast.success('タイトルを生成しました');
          break;
        case 'description':
          toast.success('説明文を生成しました');
          break;
      }

      return text;

    } catch (error: any) {
      console.error('Gemini generation error:', error);
      toast.error(`AI生成エラー: ${error.message}`);
      return null;
    } finally {
      setGenerating(false);
    }
  };

  return {
    generateContent,
    generating
  };
}
