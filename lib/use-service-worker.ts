// lib/use-service-worker.ts
// Service Worker登録フック - Phase 9

'use client'

import { useEffect } from 'react';

/**
 * Service Workerを登録するカスタムフック
 */
export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker not supported');
      return;
    }

    // Service Worker登録（エラーハンドリング強化）
    navigator.serviceWorker
      .register('/sw.js', {
        scope: '/',
        updateViaCache: 'none', // キャッシュを無視
      })
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);

        // 更新チェック
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 Service Worker updated - reload to activate');
            }
          });
        });
      })
      .catch((error) => {
        // Service Workerの失敗はアプリの動作に影響しないため、警告のみ
        console.warn('⚠️ Service Worker registration failed:', error.message);
        // エラーを無視して続行
      });

    // 定期的に更新チェック（1時間ごと）
    const interval = setInterval(() => {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update().catch(() => {
            // 更新エラーは無視
          });
        }
      });
    }, 1000 * 60 * 60);

    return () => clearInterval(interval);
  }, []);
}
