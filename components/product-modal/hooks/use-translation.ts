'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function useTranslation() {
  const [translating, setTranslating] = useState(false);

  const translateSingle = async (text: string): Promise<string | null> => {
    if (!text || text.trim() === '') {
      toast.error('翻訳するテキストがありません');
      return null;
    }

    setTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'single',
          text: text.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`翻訳API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.results && data.results.length > 0) {
        return data.results[0];
      }

      throw new Error(data.error || '翻訳に失敗しました');
    } catch (error: any) {
      console.error('Translation error:', error);
      toast.error(`翻訳エラー: ${error.message}`);
      return null;
    } finally {
      setTranslating(false);
    }
  };

  const translateBatch = async (texts: string[]): Promise<string[] | null> => {
    if (!texts || texts.length === 0) {
      toast.error('翻訳するテキストがありません');
      return null;
    }

    // 空文字を除外
    const validTexts = texts.filter(t => t && t.trim() !== '');
    if (validTexts.length === 0) {
      toast.error('有効なテキストがありません');
      return null;
    }

    setTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'batch',
          texts: validTexts
        })
      });

      if (!response.ok) {
        throw new Error(`翻訳API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.results) {
        return data.results;
      }

      throw new Error(data.error || '翻訳に失敗しました');
    } catch (error: any) {
      console.error('Translation batch error:', error);
      toast.error(`翻訳エラー: ${error.message}`);
      return null;
    } finally {
      setTranslating(false);
    }
  };

  return {
    translateSingle,
    translateBatch,
    translating
  };
}
