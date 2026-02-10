// app/api/system/events/route.ts
/**
 * 🔴 Phase H-6: Server-Sent Events (SSE) API
 * 
 * リアルタイムイベント配信
 * - Kill Switch 状態変更
 * - 実行進捗
 * - エラー通知
 * - Health 状態変更
 */

import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// イベントタイプ
export type SSEEventType = 
  | 'kill_switch'
  | 'execution_start'
  | 'execution_progress'
  | 'execution_complete'
  | 'execution_failed'
  | 'health_update'
  | 'error'
  | 'heartbeat';

export interface SSEEvent {
  type: SSEEventType;
  timestamp: string;
  data: any;
}

// グローバルイベントキュー（実運用ではRedis等を使用）
const eventQueue: SSEEvent[] = [];
const MAX_QUEUE_SIZE = 100;

// イベントを追加する関数（外部から呼び出し可能）
export function pushEvent(event: Omit<SSEEvent, 'timestamp'>) {
  const fullEvent: SSEEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };
  
  eventQueue.push(fullEvent);
  
  // キューサイズ制限
  if (eventQueue.length > MAX_QUEUE_SIZE) {
    eventQueue.shift();
  }
  
  console.log('[SSE] Event pushed:', event.type);
}

// GET: SSE ストリーム
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // 最後のイベントID取得
  const lastEventId = request.headers.get('last-event-id');
  let eventIndex = lastEventId ? parseInt(lastEventId) : eventQueue.length;
  
  const stream = new ReadableStream({
    start(controller) {
      // 初期接続メッセージ
      const connectEvent = `event: connected\ndata: ${JSON.stringify({ 
        message: 'SSE Connected',
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(connectEvent));
      
      // Heartbeat & イベントチェック
      const interval = setInterval(async () => {
        try {
          // 新しいイベントがあれば送信
          while (eventIndex < eventQueue.length) {
            const event = eventQueue[eventIndex];
            const eventStr = `id: ${eventIndex}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
            controller.enqueue(encoder.encode(eventStr));
            eventIndex++;
          }
          
          // 定期的にシステム状態をチェック
          const status = await fetchSystemStatus();
          if (status) {
            const statusEvent = `event: system_status\ndata: ${JSON.stringify(status)}\n\n`;
            controller.enqueue(encoder.encode(statusEvent));
          }
          
          // Heartbeat
          const heartbeat = `event: heartbeat\ndata: ${JSON.stringify({ 
            timestamp: new Date().toISOString(),
            queueSize: eventQueue.length,
          })}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
          
        } catch (error) {
          console.error('[SSE] Stream error:', error);
        }
      }, 3000); // 3秒間隔
      
      // クリーンアップ
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Nginx用
    },
  });
}

// システム状態取得
async function fetchSystemStatus() {
  try {
    // Kill Switch状態
    const { data: killData } = await supabase
      .from('system_config')
      .select('value')
      .eq('key', 'kill_switch')
      .single();
    
    // 実行中ジョブ
    const { data: jobsData } = await supabase
      .from('dispatch_jobs')
      .select('*')
      .eq('status', 'running')
      .limit(5);
    
    return {
      killSwitch: killData?.value || { enabled: true, killSwitchActive: false },
      runningJobs: jobsData?.length || 0,
      jobs: jobsData || [],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return null;
  }
}

// POST: イベントを手動でプッシュ（内部API用）
export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();
    
    if (!type) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'type is required' 
      }), { status: 400 });
    }
    
    pushEvent({ type, data });
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Event pushed',
    }));
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { status: 500 });
  }
}
