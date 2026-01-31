-- ============================================================================
-- N3 Empire OS - メディアセクション専用SQLスキーマ（V3 - 分割実行版）
-- エラー回避のため、ビューとトリガーを最後に配置
-- ============================================================================

-- ============================================================================
-- PART 1: 基本テーブル作成
-- ============================================================================

-- 1. メディアチャンネル管理
CREATE TABLE IF NOT EXISTS media_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT NOT NULL UNIQUE,
    channel_name TEXT NOT NULL,
    youtube_channel_id TEXT,
    youtube_channel_url TEXT,
    style_id TEXT DEFAULT 'default',
    avatar_seed TEXT,
    style_config JSONB DEFAULT '{"emotion_intensity": 0.7, "motion_smoothness": 0.8, "personality": "balanced"}'::jsonb,
    brand_color_primary TEXT DEFAULT '#3b82f6',
    brand_color_secondary TEXT DEFAULT '#1e40af',
    brand_font TEXT DEFAULT 'NotoSansJP',
    primary_language TEXT DEFAULT 'ja',
    supported_languages TEXT[] DEFAULT ARRAY['ja', 'en'],
    is_active BOOLEAN DEFAULT true,
    auto_publish_enabled BOOLEAN DEFAULT false,
    daily_upload_limit INTEGER DEFAULT 10,
    proxy_profile_id TEXT,
    fingerprint_seed TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. YouTube OAuth トークン
CREATE TABLE IF NOT EXISTS youtube_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT NOT NULL UNIQUE,
    youtube_channel_id TEXT,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ NOT NULL,
    scopes TEXT[] DEFAULT ARRAY['https://www.googleapis.com/auth/youtube.upload'],
    stream_key TEXT,
    is_valid BOOLEAN DEFAULT true,
    last_refresh_at TIMESTAMPTZ,
    last_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. コンテンツマスター
CREATE TABLE IF NOT EXISTS content_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT NOT NULL UNIQUE,
    channel_id TEXT,
    product_id BIGINT,
    title TEXT NOT NULL,
    description TEXT,
    script_data JSONB,
    audio_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    content_type TEXT DEFAULT 'youtube_long',
    genre TEXT DEFAULT 'general',
    target_language TEXT DEFAULT 'ja',
    video_quality TEXT DEFAULT '1080p',
    audio_quality TEXT DEFAULT 'high',
    publish_status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. メディアコンテンツ（24hライブ用）
CREATE TABLE IF NOT EXISTS media_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT,
    content_master_id UUID,
    product_id BIGINT,
    title TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'video',
    duration_seconds INTEGER,
    publish_status TEXT DEFAULT 'draft',
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue NUMERIC(10, 2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. メディアアセット
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT,
    product_id BIGINT,
    content_id TEXT,
    asset_type TEXT NOT NULL,
    asset_url TEXT NOT NULL,
    asset_name TEXT,
    file_size BIGINT,
    file_format TEXT,
    width INTEGER,
    height INTEGER,
    duration_ms INTEGER,
    tags TEXT[] DEFAULT '{}',
    emotion_tag TEXT,
    posture_id TEXT,
    mj_prompt TEXT,
    mj_seed TEXT,
    mj_style_id TEXT,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ライブストリーム管理
CREATE TABLE IF NOT EXISTS live_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id TEXT NOT NULL UNIQUE,
    channel_id TEXT NOT NULL,
    stream_title TEXT NOT NULL,
    stream_type TEXT DEFAULT 'playlist',
    rtmp_url TEXT,
    playlist_config JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending',
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    peak_viewers INTEGER DEFAULT 0,
    total_watch_time_minutes INTEGER DEFAULT 0,
    last_error TEXT,
    error_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. プレイリスト管理テーブル
CREATE TABLE IF NOT EXISTS live_stream_playlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id TEXT NOT NULL,
    media_content_id UUID,
    play_order INTEGER NOT NULL,
    played_at TIMESTAMPTZ,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 視覚的注釈
CREATE TABLE IF NOT EXISTS visual_annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT NOT NULL,
    annotations JSONB NOT NULL DEFAULT '[]',
    diagrams JSONB DEFAULT '[]',
    ai_annotation_model TEXT DEFAULT 'gemini-1.5-pro',
    annotation_count INTEGER DEFAULT 0,
    confidence_score NUMERIC(3, 2) DEFAULT 0.85,
    remotion_props JSONB DEFAULT '{}',
    is_approved BOOLEAN DEFAULT false,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. KJ法ナレッジグラフ
CREATE TABLE IF NOT EXISTS kj_knowledge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT NOT NULL,
    source_workflow TEXT NOT NULL,
    channel_id TEXT,
    content_id TEXT,
    product_id BIGINT,
    insights JSONB NOT NULL,
    correlation_score NUMERIC(5, 4),
    confidence_level NUMERIC(3, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. 実行ログ
CREATE TABLE IF NOT EXISTS execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    status TEXT NOT NULL,
    execution_time_ms INTEGER,
    error_message TEXT,
    error_code TEXT,
    node_count INTEGER,
    metadata JSONB DEFAULT '{}',
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. LMSユーザー進捗
CREATE TABLE IF NOT EXISTS lms_user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content_id TEXT,
    channel_id TEXT,
    questions_answered INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    incorrect_count INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    weak_points JSONB DEFAULT '[]',
    strong_points JSONB DEFAULT '[]',
    last_question_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. LMSパラメトリック問題
CREATE TABLE IF NOT EXISTS lms_parametric_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_template TEXT NOT NULL,
    answer_template TEXT NOT NULL,
    explanation_template TEXT,
    parameters JSONB NOT NULL DEFAULT '{}',
    difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5),
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT '{}',
    related_content_id TEXT,
    related_video_timestamp_ms INTEGER,
    times_used INTEGER DEFAULT 0,
    average_time_seconds INTEGER,
    success_rate NUMERIC(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
