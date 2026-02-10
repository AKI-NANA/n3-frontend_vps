'use client';

import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface SystemLog {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  source?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Mac通知を送信
const sendMacNotification = (title: string, body: string, icon?: string) => {
  if (!('Notification' in window)) {
    console.log('このブラウザは通知をサポートしていません');
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      tag: 'n3-notification',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, {
          body,
          icon: icon || '/favicon.ico',
          tag: 'n3-notification',
        });
      }
    });
  }
};

// トースト通知を表示
const showToast = (log: SystemLog) => {
  const options = {
    duration: 5000,
    description: log.source ? `from: ${log.source}` : undefined,
  };

  switch (log.type) {
    case 'success':
      toast.success(log.message, options);
      break;
    case 'warning':
      toast.warning(log.message, options);
      break;
    case 'error':
      toast.error(log.message, options);
      break;
    default:
      toast.info(log.message, options);
  }
};

// アイコンを取得
const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    default:
      return 'ℹ️';
  }
};

export function SystemNotificationProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null);

  // 通知許可をリクエスト
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Supabase Realtimeを監視
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('system_logs_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'system_logs',
        },
        (payload) => {
          const log = payload.new as SystemLog;
          
          // トースト通知
          showToast(log);
          
          // Mac通知
          const icon = getNotificationIcon(log.type);
          sendMacNotification(
            `${icon} N3 System`,
            log.message
          );
          
          // 最終アクティビティ更新
          setLastActivity(new Date());
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          console.log('🔔 System notification connected');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // 生存確認（1時間アクティビティがなければ警告）
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastActivity.getTime();
      const oneHour = 60 * 60 * 1000;

      if (diff > oneHour) {
        toast.warning('⚠️ システムからの応答がありません（1時間以上）', {
          duration: 10000,
        });
      }
    }, 5 * 60 * 1000); // 5分ごとにチェック

    return () => clearInterval(checkInterval);
  }, [lastActivity]);

  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        expand={true}
      />
      {/* 接続状態インジケーター */}
      <div className="fixed bottom-4 right-4 z-50">
        <div 
          className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
          title={isConnected ? '通知システム: 接続中' : '通知システム: 切断'}
        />
      </div>
    </>
  );
}

// 手動で通知を送信するユーティリティ
export async function sendSystemLog(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  source?: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('system_logs')
    .insert({
      message,
      type,
      source,
      metadata,
    });

  if (error) {
    console.error('Failed to send system log:', error);
    throw error;
  }
}
