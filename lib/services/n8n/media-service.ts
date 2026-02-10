// lib/services/n8n/media-service.ts
// N3 Empire OS メディアセクション n8n統合サービス
// 27次元準拠: HMAC署名、タイムスタンプ検証、実行ログ

const N8N_BASE_URL = process.env.N8N_BASE_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://160.16.120.186:5678';
const N8N_WEBHOOK_BASE = `${N8N_BASE_URL}/webhook`;

// ============================================================================
// 型定義
// ============================================================================

export interface MediaResponse {
  success: boolean;
  jobId?: string;
  data?: any;
  error?: string;
  message?: string;
  executionTime?: number;
}

export interface VideoGenerateRequest {
  contentId?: string;
  productId?: number | string;
  channelId: string;
  videoType?: 'youtube_long' | 'youtube_short' | 'tiktok';
  autoPublish?: boolean;
  generateVoice?: boolean;
  genre?: string;
  useV6BioNoise?: boolean;
  options?: {
    title?: string;
    description?: string;
    tags?: string[];
    thumbnailUrl?: string;
    scheduledAt?: string;
  };
}

export interface VoiceGenerateRequest {
  text: string;
  voiceId?: string;
  productId?: number | string;
  genre?: string;
  language?: string;
  useEmotionAI?: boolean;
  addBreath?: boolean;
  emotionSettings?: {
    stability?: number;
    similarityBoost?: number;
    style?: number;
  };
}

export interface LivePortraitRequest {
  sourceImageUrl: string;
  drivingVideoUrl: string;
  channelId?: string;
  productId?: number | string;
  outputFormat?: 'mp4' | 'webm';
  quality?: 'low' | 'medium' | 'high';
}

export interface VisualAnnotationRequest {
  contentId: string;
  script: string;
  diagrams?: any[];
  channelId?: string;
}

export interface LiveStreamRequest {
  action: 'start' | 'stop' | 'status';
  channelId?: string;
  streamId?: string;
  playlistMode?: 'revenue_priority' | 'random' | 'sequential';
  includeStockOnly?: boolean;
}

export interface AssetRequest {
  action: 'upload' | 'list' | 'delete' | 'get';
  assetId?: string;
  channelId?: string;
  assetType?: string;
  assetUrl?: string;
  metadata?: Record<string, any>;
  filters?: {
    type?: string;
    category?: string;
    emotionTag?: string;
  };
}

export interface LMSRequest {
  action: 'generate_question' | 'check_weak_points' | 'get_recommendations';
  userId: string;
  category?: string;
  topic?: string;
  difficulty?: number;
  questionCount?: number;
}

export interface ChannelRequest {
  action: 'create' | 'update' | 'get' | 'list' | 'delete';
  channelId?: string;
  channelData?: {
    channelName?: string;
    platform?: string;
    niche?: string;
    language?: string;
    voiceId?: string;
    styleConfig?: Record<string, any>;
    proxyIp?: string;
    browserProfileId?: string;
  };
}

// ============================================================================
// ヘルパー関数
// ============================================================================

function generateJobId(): string {
  return `MEDIA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

async function callMediaWebhook(
  endpoint: string, 
  data: any,
  options: { timeout?: number } = {}
): Promise<MediaResponse> {
  const url = `${N8N_WEBHOOK_BASE}/${endpoint}`;
  const jobId = generateJobId();
  const timestamp = Date.now().toString();
  const startTime = Date.now();
  
  const payload = {
    job_id: jobId,
    timestamp: new Date().toISOString(),
    ...data,
  };
  
  console.log(`[N8nMedia] Calling: ${endpoint}`, { jobId, payload });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Job-Id': jobId,
        'X-N3-Timestamp': timestamp,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(options.timeout || 120000),
    });
    
    const executionTime = Date.now() - startTime;
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[N8nMedia] Error: ${response.status}`, errorText);
      return {
        success: false,
        jobId,
        error: `n8n error: ${response.status} - ${errorText}`,
        executionTime,
      };
    }
    
    const result = await response.json();
    console.log(`[N8nMedia] Success:`, { jobId, executionTime });
    
    return {
      success: result.success !== false,
      jobId: result.job_id || jobId,
      data: result,
      message: result.message || 'Request completed',
      executionTime,
    };
  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error(`[N8nMedia] Failed:`, error);
    return {
      success: false,
      jobId,
      error: error instanceof Error ? error.message : 'Connection failed',
      executionTime,
    };
  }
}

// ============================================================================
// 動画生成サービス
// ============================================================================

export const N8nVideoService = {
  async generate(request: VideoGenerateRequest): Promise<MediaResponse> {
    return callMediaWebhook('video-generate-v6', {
      content_id: request.contentId,
      product_id: request.productId,
      channel_id: request.channelId,
      video_type: request.videoType || 'youtube_long',
      auto_publish: request.autoPublish || false,
      generate_voice: request.generateVoice !== false,
      genre: request.genre || 'general',
      use_v6_bio_noise: request.useV6BioNoise !== false,
      options: request.options,
    }, { timeout: 600000 });
  },
  
  async generateThumbnail(contentId: string, options?: { style?: string; text?: string; useAI?: boolean }): Promise<MediaResponse> {
    return callMediaWebhook('thumbnail-generate', {
      content_id: contentId,
      style: options?.style || 'default',
      text: options?.text,
      use_ai: options?.useAI !== false,
    });
  },
  
  async applyFingerprint(videoUrl: string, channelId: string): Promise<MediaResponse> {
    return callMediaWebhook('digital-fingerprint', { video_url: videoUrl, channel_id: channelId });
  },
  
  async batchRender(contentIds: string[]): Promise<MediaResponse> {
    return callMediaWebhook('remotion-lambda-render', { content_ids: contentIds, parallel: true }, { timeout: 900000 });
  },
};

// ============================================================================
// 音声生成サービス
// ============================================================================

export const N8nAudioService = {
  async generate(request: VoiceGenerateRequest): Promise<MediaResponse> {
    return callMediaWebhook('voice-generate', {
      text: request.text,
      voice_id: request.voiceId,
      product_id: request.productId,
      genre: request.genre || 'general',
      language: request.language || 'ja',
      use_emotion_ai: request.useEmotionAI !== false,
      add_breath: request.addBreath !== false,
      emotion_settings: request.emotionSettings,
    }, { timeout: 120000 });
  },
  
  async preview(text: string, voiceId?: string): Promise<MediaResponse> {
    return callMediaWebhook('voice-preview', { text: text.substring(0, 200), voice_id: voiceId }, { timeout: 30000 });
  },
  
  async listVoices(): Promise<MediaResponse> {
    return callMediaWebhook('voice-list', { action: 'list' });
  },
};

// ============================================================================
// アバター・表情サービス
// ============================================================================

export const N8nAvatarService = {
  async transferExpression(request: LivePortraitRequest): Promise<MediaResponse> {
    return callMediaWebhook('liveportrait-transfer', {
      source_image_url: request.sourceImageUrl,
      driving_video_url: request.drivingVideoUrl,
      channel_id: request.channelId,
      product_id: request.productId,
      output_format: request.outputFormat || 'mp4',
      quality: request.quality || 'high',
    }, { timeout: 600000 });
  },
  
  async generateAvatar(channelId: string, options?: { style?: string; emotion?: string; posture?: string }): Promise<MediaResponse> {
    return callMediaWebhook('midjourney-avatar', {
      channel_id: channelId,
      style: options?.style,
      emotion: options?.emotion || 'neutral',
      posture: options?.posture || 'front',
    }, { timeout: 300000 });
  },
};

// ============================================================================
// 視覚注釈サービス（桜井スタイル）
// ============================================================================

export const N8nAnnotationService = {
  async generate(request: VisualAnnotationRequest): Promise<MediaResponse> {
    return callMediaWebhook('visual-annotation', {
      content_id: request.contentId,
      script: request.script,
      diagrams: request.diagrams || [],
      channel_id: request.channelId,
    });
  },
  
  async preview(contentId: string): Promise<MediaResponse> {
    return callMediaWebhook('visual-annotation-preview', { content_id: contentId });
  },
};

// ============================================================================
// ライブ配信サービス
// ============================================================================

export const N8nLiveService = {
  async control(request: LiveStreamRequest): Promise<MediaResponse> {
    return callMediaWebhook('live-stream', {
      action: request.action,
      channel_id: request.channelId,
      stream_id: request.streamId,
      playlist_mode: request.playlistMode || 'revenue_priority',
      include_stock_only: request.includeStockOnly !== false,
    });
  },
  
  async start(channelId: string, options?: { playlistMode?: string; includeStockOnly?: boolean }): Promise<MediaResponse> {
    return this.control({ action: 'start', channelId, playlistMode: options?.playlistMode as any, includeStockOnly: options?.includeStockOnly });
  },
  
  async stop(streamId: string): Promise<MediaResponse> {
    return this.control({ action: 'stop', streamId });
  },
  
  async status(): Promise<MediaResponse> {
    return this.control({ action: 'status' });
  },
};

// ============================================================================
// アセット管理サービス
// ============================================================================

export const N8nAssetService = {
  async manage(request: AssetRequest): Promise<MediaResponse> {
    return callMediaWebhook('asset-manager', {
      action: request.action,
      asset_id: request.assetId,
      channel_id: request.channelId,
      asset_type: request.assetType,
      asset_url: request.assetUrl,
      metadata: request.metadata,
      filters: request.filters,
    });
  },
  
  async upload(channelId: string, assetType: string, assetUrl: string, metadata?: Record<string, any>): Promise<MediaResponse> {
    return this.manage({ action: 'upload', channelId, assetType, assetUrl, metadata });
  },
  
  async list(channelId: string, filters?: AssetRequest['filters']): Promise<MediaResponse> {
    return this.manage({ action: 'list', channelId, filters });
  },
  
  async delete(assetId: string): Promise<MediaResponse> {
    return this.manage({ action: 'delete', assetId });
  },
};

// ============================================================================
// LMSサービス
// ============================================================================

export const N8nLMSService = {
  async generateQuestion(request: LMSRequest): Promise<MediaResponse> {
    return callMediaWebhook('lms-parametric', {
      action: 'generate_question',
      user_id: request.userId,
      category: request.category,
      topic: request.topic,
      difficulty: request.difficulty,
      question_count: request.questionCount || 5,
    });
  },
  
  async analyzeWeakPoints(userId: string): Promise<MediaResponse> {
    return callMediaWebhook('lms-weak-points', { action: 'check_weak_points', user_id: userId });
  },
  
  async getRecommendations(userId: string): Promise<MediaResponse> {
    return callMediaWebhook('lms-recommendations', { action: 'get_recommendations', user_id: userId });
  },
};

// ============================================================================
// チャンネル管理サービス
// ============================================================================

export const N8nChannelService = {
  async manage(request: ChannelRequest): Promise<MediaResponse> {
    return callMediaWebhook('channel-manager', {
      action: request.action,
      channel_id: request.channelId,
      channel_data: request.channelData,
    });
  },
  
  async create(channelData: ChannelRequest['channelData']): Promise<MediaResponse> {
    return this.manage({ action: 'create', channelData });
  },
  
  async update(channelId: string, channelData: ChannelRequest['channelData']): Promise<MediaResponse> {
    return this.manage({ action: 'update', channelId, channelData });
  },
  
  async list(): Promise<MediaResponse> {
    return this.manage({ action: 'list' });
  },
  
  async authenticateYouTube(channelId: string): Promise<MediaResponse> {
    return callMediaWebhook('youtube-oauth', { action: 'initiate', channel_id: channelId });
  },
};

// ============================================================================
// コンテンツパイプラインサービス
// ============================================================================

export const N8nContentPipelineService = {
  async fullPipeline(params: {
    contentId: string;
    channelId: string;
    script: string;
    options?: { generateVoice?: boolean; generateAnnotations?: boolean; generateThumbnail?: boolean; autoPublish?: boolean; scheduledAt?: string };
  }): Promise<MediaResponse> {
    return callMediaWebhook('content-full-pipeline', {
      content_id: params.contentId,
      channel_id: params.channelId,
      script: params.script,
      generate_voice: params.options?.generateVoice !== false,
      generate_annotations: params.options?.generateAnnotations !== false,
      generate_thumbnail: params.options?.generateThumbnail !== false,
      auto_publish: params.options?.autoPublish || false,
      scheduled_at: params.options?.scheduledAt,
    }, { timeout: 900000 });
  },
  
  async getStatus(contentId: string): Promise<MediaResponse> {
    return callMediaWebhook('content-status', { content_id: contentId });
  },
  
  async batchFromSheet(sheetUrl: string, options?: { channelId?: string; startRow?: number; endRow?: number }): Promise<MediaResponse> {
    return callMediaWebhook('batch-from-sheet', {
      sheet_url: sheetUrl,
      channel_id: options?.channelId,
      start_row: options?.startRow,
      end_row: options?.endRow,
    }, { timeout: 1800000 });
  },
};

// ============================================================================
// ユーティリティ
// ============================================================================

export const N8nMediaUtils = {
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${N8N_BASE_URL}/healthz`, { method: 'GET', signal: AbortSignal.timeout(5000) });
      return response.ok;
    } catch {
      return false;
    }
  },
  
  isSecurityEnabled(): boolean {
    return !!(process.env.N8N_HMAC_SECRET || process.env.N3_HMAC_SECRET);
  },
  
  getWebhookUrl(endpoint: string): string {
    return `${N8N_WEBHOOK_BASE}/${endpoint}`;
  },
  
  getConfig(): { baseUrl: string; securityEnabled: boolean } {
    return { baseUrl: N8N_BASE_URL, securityEnabled: this.isSecurityEnabled() };
  },
};

// ============================================================================
// デフォルトエクスポート
// ============================================================================

export const N8nMediaService = {
  video: N8nVideoService,
  audio: N8nAudioService,
  avatar: N8nAvatarService,
  annotation: N8nAnnotationService,
  live: N8nLiveService,
  asset: N8nAssetService,
  lms: N8nLMSService,
  channel: N8nChannelService,
  pipeline: N8nContentPipelineService,
  utils: N8nMediaUtils,
};

export default N8nMediaService;
