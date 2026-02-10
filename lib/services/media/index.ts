// lib/services/media/index.ts
// N3 Empire OS - メディア統合サービス

import { createClient } from '@/lib/supabase/client';

const N8N_WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678/webhook';

// ============================================================
// デフォルト設定
// ============================================================
export function getDefaultBrandConfig() {
  return {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    accentColor: '#F59E0B',
    fontFamily: 'Noto Sans JP',
    fontFamilyEn: 'Inter',
    watermarkPosition: 'bottom_right',
    watermarkOpacity: 0.3,
  };
}

export function getDefaultVoiceConfig() {
  return {
    provider: 'elevenlabs',
    stability: 0.65,
    similarityBoost: 0.75,
    style: 0.2,
    fallbackProvider: 'openai',
    fallbackVoice: 'alloy',
  };
}

export function getDefaultProductionConfig() {
  return {
    videoStyle: 'education',
    telopPosition: 'bottom',
    telopAnimation: 'spring',
    enableCharacter: true,
    characterPosition: 'right',
    enableParticles: true,
    particleType: 'dust',
    enableKenBurns: true,
    bgmVolume: 0.15,
    seDucking: true,
  };
}

export function getDefaultSecurityConfig() {
  return {
    proxyType: 'residential',
    postingInterval: { min: 3600, max: 7200 },
    dailyPostLimit: 3,
    enableDigitalFingerprint: true,
    fingerprintVariation: 5,
  };
}

// ============================================================
// 統合サービス
// ============================================================
export const EmpireMediaService = {
  // チャンネル管理
  channels: {
    async getAll(filters?: { status?: string; genre?: string }) {
      const supabase = createClient();
      let query = supabase.from('media_channels').select('*');
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.genre) query = query.eq('genre', filters.genre);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    
    async get(channelId: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('media_channels')
        .select('*')
        .eq('channel_id', channelId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    
    async create(channel: any) {
      const supabase = createClient();
      const channelId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const { data, error } = await supabase
        .from('media_channels')
        .insert({
          channel_id: channelId,
          channel_name: channel.channel_name || '新規チャンネル',
          brand_config: channel.brand_config || getDefaultBrandConfig(),
          voice_config: channel.voice_config || getDefaultVoiceConfig(),
          production_config: channel.production_config || getDefaultProductionConfig(),
          security_config: channel.security_config || getDefaultSecurityConfig(),
          genre: channel.genre || 'education',
          language: channel.language || 'ja',
          target_languages: channel.target_languages || ['ja'],
          revenue_rank: channel.revenue_rank || 'C',
          status: 'active',
          ...channel,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async update(channelId: string, updates: any) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('media_channels')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('channel_id', channelId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async archive(channelId: string) {
      const supabase = createClient();
      const { error } = await supabase
        .from('media_channels')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('channel_id', channelId);
      if (error) throw error;
    },
  },
  
  // コンテンツ管理
  contents: {
    async getAll(filters?: { channelId?: string; publishStatus?: string; renderStatus?: string; limit?: number }) {
      const supabase = createClient();
      let query = supabase.from('content_master').select('*');
      if (filters?.channelId) query = query.eq('channel_id', filters.channelId);
      if (filters?.publishStatus) query = query.eq('publish_status', filters.publishStatus);
      if (filters?.renderStatus) query = query.eq('render_status', filters.renderStatus);
      if (filters?.limit) query = query.limit(filters.limit);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    
    async get(contentId: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('content_master')
        .select('*')
        .eq('content_id', contentId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    
    async create(content: any) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('content_master')
        .insert({
          channel_id: content.channel_id,
          title: content.title || '新規コンテンツ',
          content_type: content.content_type || 'video_short',
          video_format: content.video_format || '9:16',
          script_status: 'draft',
          render_status: 'pending',
          publish_status: 'draft',
          ...content,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async update(contentId: string, updates: any) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('content_master')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('content_id', contentId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async generateScript(contentId: string, options?: { topic?: string; style?: string; duration?: number }) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/script-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId, ...options }),
      });
      return res.json();
    },
    
    async render(contentId: string, options?: { quality?: string; priority?: number }) {
      const supabase = createClient();
      await supabase.from('content_master').update({ render_status: 'queued' }).eq('content_id', contentId);
      
      const res = await fetch(`${N8N_WEBHOOK_URL}/video-generate-v6`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId, action: 'render', ...options }),
      });
      return res.json();
    },
    
    async publish(contentId: string) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/youtube-publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId, action: 'publish' }),
      });
      return res.json();
    },
    
    async schedule(contentId: string, scheduledAt: Date) {
      const supabase = createClient();
      const { error } = await supabase
        .from('content_master')
        .update({ publish_status: 'scheduled', scheduled_at: scheduledAt.toISOString() })
        .eq('content_id', contentId);
      if (error) throw error;
    },
  },
  
  // MJアセット管理
  assets: {
    async getAll(filters?: { channelId?: string; characterId?: string; emotionTag?: string }) {
      const supabase = createClient();
      let query = supabase.from('mj_assets').select('*').eq('status', 'active');
      if (filters?.channelId) query = query.eq('channel_id', filters.channelId);
      if (filters?.characterId) query = query.eq('character_id', filters.characterId);
      if (filters?.emotionTag) query = query.eq('emotion_tag', filters.emotionTag);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    
    async create(asset: any) {
      const supabase = createClient();
      const assetId = `mj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const { data, error } = await supabase
        .from('mj_assets')
        .insert({ asset_id: assetId, status: 'active', ...asset })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    
    async bulkGenerate(options: { channelId: string; characterPrompt: string; emotions: string[]; angles: string[]; cref?: string }) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/mj-bulk-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      return res.json();
    },
  },
  
  // 音声管理
  voice: {
    async getPresets(filters?: { provider?: string }) {
      const supabase = createClient();
      let query = supabase.from('voice_presets').select('*');
      if (filters?.provider) query = query.eq('provider', filters.provider);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    
    async generate(text: string, options: { channelId: string; voicePreset?: string; emotion?: string }) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/voice-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, ...options }),
      });
      return res.json();
    },
    
    async getOptimalPreset(revenueRank: string, genre: string) {
      const supabase = createClient();
      const rankOrder: Record<string, number> = { S: 4, A: 3, B: 2, C: 1 };
      
      const { data, error } = await supabase
        .from('voice_presets')
        .select('*')
        .contains('genre_tags', [genre])
        .order('cost_per_1k_chars', { ascending: true });
      
      if (error) throw error;
      
      const filtered = (data || []).filter(preset => {
        const presetRank = rankOrder[preset.min_revenue_rank] || 1;
        const channelRank = rankOrder[revenueRank] || 1;
        return channelRank >= presetRank;
      });
      
      return filtered[0] || data?.[0] || null;
    },
  },
  
  // 桜井スタイル注釈
  annotations: {
    async generate(contentId: string, script: string, diagrams?: any[]) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/visual-annotation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId, script, diagrams }),
      });
      return res.json();
    },
    
    async get(contentId: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('visual_annotations')
        .select('*')
        .eq('content_id', contentId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  },
  
  // LMS（学習管理）
  lms: {
    async getAtomicData(filters?: { subject?: string; topic?: string; limit?: number }) {
      const supabase = createClient();
      let query = supabase.from('lms_atomic_data').select('*');
      if (filters?.subject) query = query.eq('subject', filters.subject);
      if (filters?.topic) query = query.eq('topic', filters.topic);
      if (filters?.limit) query = query.limit(filters.limit);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    
    async getWeakPoints(userId: string) {
      const supabase = createClient();
      const { data, error } = await supabase.from('lms_weak_points').select('*').eq('user_id', userId);
      if (error) throw error;
      return data || [];
    },
    
    async generateParametric(atomicId: string) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/lms-parametric`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atomic_id: atomicId }),
      });
      return res.json();
    },
    
    async recordProgress(userId: string, atomicId: string, isCorrect: boolean, timeSeconds: number) {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from('lms_user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('atomic_id', atomicId)
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from('lms_user_progress')
          .update({
            attempt_count: existing.attempt_count + 1,
            correct_count: existing.correct_count + (isCorrect ? 1 : 0),
            last_correct: isCorrect,
            total_time_seconds: existing.total_time_seconds + timeSeconds,
            last_attempt_at: new Date().toISOString(),
            is_weak_point: (existing.correct_count + (isCorrect ? 1 : 0)) / (existing.attempt_count + 1) < 0.4,
          })
          .eq('user_id', userId)
          .eq('atomic_id', atomicId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('lms_user_progress').insert({
          user_id: userId,
          atomic_id: atomicId,
          attempt_count: 1,
          correct_count: isCorrect ? 1 : 0,
          last_correct: isCorrect,
          total_time_seconds: timeSeconds,
          last_attempt_at: new Date().toISOString(),
          is_weak_point: !isCorrect,
        });
        if (error) throw error;
      }
    },
  },
  
  // ブログ
  blog: {
    async getAll(filters?: { contentId?: string; status?: string }) {
      const supabase = createClient();
      let query = supabase.from('blog_posts').select('*');
      if (filters?.contentId) query = query.eq('content_id', filters.contentId);
      if (filters?.status) query = query.eq('status', filters.status);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    
    async generate(contentId: string) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/blog-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_id: contentId }),
      });
      return res.json();
    },
    
    async publish(postId: string, platform: string) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/blog-publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, platform }),
      });
      return res.json();
    },
  },
  
  // 電子書籍
  ebook: {
    async getChapters(bookId: string) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ebook_chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    
    async generate(bookId: string, contentIds: string[]) {
      const res = await fetch(`${N8N_WEBHOOK_URL}/ebook-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book_id: bookId, content_ids: contentIds }),
      });
      return res.json();
    },
  },
  
  // コストルーティング
  cost: {
    async getConfig() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('cost_routing_config')
        .select('*')
        .eq('config_name', 'default')
        .single();
      if (error) throw error;
      return data;
    },
    
    async getOptimalConfig(revenueRank: string) {
      const config = await this.getConfig();
      if (!config) return null;
      
      switch (revenueRank) {
        case 'S': return config.rank_s_config;
        case 'A': return config.rank_a_config;
        case 'B': return config.rank_b_config;
        case 'C':
        default: return config.rank_c_config;
      }
    },
  },
};

export default EmpireMediaService;
