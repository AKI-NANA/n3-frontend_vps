-- ============================================================================
-- N3 Empire OS - メディアセクション 追加スキーマ（既存テーブル対応版）
-- 既存テーブル: media_channels, content_master, media_assets, media_content
-- 追加するもの: 不足テーブル + 不足カラム + ビュー
-- ============================================================================

-- ============================================================================
-- PART 1: 既存テーブルに不足カラムを追加
-- ============================================================================

-- content_master に content_id カラム追加（TEXT型、既存idから生成）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'content_master' AND column_name = 'content_id'
    ) THEN
        ALTER TABLE content_master ADD COLUMN content_id TEXT;
        -- 既存レコードにcontent_idを設定
        UPDATE content_master SET content_id = 'CNT-' || id::text WHERE content_id IS NULL;
        -- ユニーク制約追加
        ALTER TABLE content_master ADD CONSTRAINT content_master_content_id_unique UNIQUE (content_id);
    END IF;
END $$;

-- content_master に追加カラム
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'description') THEN
        ALTER TABLE content_master ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'thumbnail_url') THEN
        ALTER TABLE content_master ADD COLUMN thumbnail_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'content_type') THEN
        ALTER TABLE content_master ADD COLUMN content_type TEXT DEFAULT 'youtube_long';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'genre') THEN
        ALTER TABLE content_master ADD COLUMN genre TEXT DEFAULT 'general';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'publish_status') THEN
        ALTER TABLE content_master ADD COLUMN publish_status TEXT DEFAULT 'draft';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'scheduled_at') THEN
        ALTER TABLE content_master ADD COLUMN scheduled_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'published_at') THEN
        ALTER TABLE content_master ADD COLUMN published_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'views') THEN
        ALTER TABLE content_master ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'likes') THEN
        ALTER TABLE content_master ADD COLUMN likes INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'content_master' AND column_name = 'metadata') THEN
        ALTER TABLE content_master ADD COLUMN metadata JSONB DEFAULT '{}';
    END IF;
END $$;

-- media_channels に追加カラム
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'youtube_channel_id') THEN
        ALTER TABLE media_channels ADD COLUMN youtube_channel_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'style_id') THEN
        ALTER TABLE media_channels ADD COLUMN style_id TEXT DEFAULT 'default';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'avatar_seed') THEN
        ALTER TABLE media_channels ADD COLUMN avatar_seed TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'style_config') THEN
        ALTER TABLE media_channels ADD COLUMN style_config JSONB DEFAULT '{"emotion_intensity": 0.7, "motion_smoothness": 0.8}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'proxy_profile_id') THEN
        ALTER TABLE media_channels ADD COLUMN proxy_profile_id TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'fingerprint_seed') THEN
        ALTER TABLE media_channels ADD COLUMN fingerprint_seed TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'media_channels' AND column_name = 'auto_publish_enabled') THEN
        ALTER TABLE media_channels ADD COLUMN auto_publish_enabled BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================================================
-- PART 2: 新規テーブル作成（存在しない場合のみ）
-- ============================================================================

-- YouTube OAuth トークン
CREATE TABLE IF NOT EXISTS youtube_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id VARCHAR(255) NOT NULL UNIQUE,
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

-- ライブストリーム管理
CREATE TABLE IF NOT EXISTS live_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id TEXT NOT NULL UNIQUE,
    channel_id VARCHAR(255) NOT NULL,
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

-- プレイリスト管理
CREATE TABLE IF NOT EXISTS live_stream_playlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id TEXT NOT NULL,
    media_content_id UUID,
    play_order INTEGER NOT NULL,
    played_at TIMESTAMPTZ,
    play_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 視覚的注釈（桜井スタイル）
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

-- KJ法ナレッジグラフ
CREATE TABLE IF NOT EXISTS kj_knowledge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data_type TEXT NOT NULL,
    source_workflow TEXT NOT NULL,
    channel_id VARCHAR(255),
    content_id TEXT,
    product_id BIGINT,
    insights JSONB NOT NULL,
    correlation_score NUMERIC(5, 4),
    confidence_level NUMERIC(3, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 実行ログ
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

-- LMSユーザー進捗
CREATE TABLE IF NOT EXISTS lms_user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    content_id TEXT,
    channel_id VARCHAR(255),
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

-- LMSパラメトリック問題
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

-- ============================================================================
-- PART 3: インデックス作成
-- ============================================================================

-- youtube_oauth_tokens
CREATE INDEX IF NOT EXISTS idx_youtube_oauth_tokens_channel ON youtube_oauth_tokens(channel_id);

-- live_streams
CREATE INDEX IF NOT EXISTS idx_live_streams_stream_id ON live_streams(stream_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_channel ON live_streams(channel_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);

-- live_stream_playlist
CREATE INDEX IF NOT EXISTS idx_live_stream_playlist_stream ON live_stream_playlist(stream_id);

-- visual_annotations
CREATE INDEX IF NOT EXISTS idx_visual_annotations_content ON visual_annotations(content_id);

-- kj_knowledge_graph
CREATE INDEX IF NOT EXISTS idx_kj_knowledge_graph_type ON kj_knowledge_graph(data_type);
CREATE INDEX IF NOT EXISTS idx_kj_knowledge_graph_channel ON kj_knowledge_graph(channel_id);

-- execution_logs
CREATE INDEX IF NOT EXISTS idx_execution_logs_workflow ON execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_executed ON execution_logs(executed_at DESC);

-- lms_user_progress
CREATE INDEX IF NOT EXISTS idx_lms_user_progress_user ON lms_user_progress(user_id);

-- lms_parametric_questions
CREATE INDEX IF NOT EXISTS idx_lms_parametric_questions_category ON lms_parametric_questions(category);

-- content_master 追加インデックス
CREATE INDEX IF NOT EXISTS idx_content_master_content_id ON content_master(content_id);
CREATE INDEX IF NOT EXISTS idx_content_master_publish_status ON content_master(publish_status);

-- ============================================================================
-- PART 4: コメント
-- ============================================================================

COMMENT ON TABLE youtube_oauth_tokens IS 'YouTube OAuth2認証トークン管理';
COMMENT ON TABLE live_streams IS '24時間ライブ配信の管理';
COMMENT ON TABLE visual_annotations IS '桜井スタイル視覚的注釈';
COMMENT ON TABLE kj_knowledge_graph IS 'KJ法による知見蓄積';
COMMENT ON TABLE execution_logs IS 'n8nワークフロー実行ログ';
COMMENT ON TABLE lms_user_progress IS 'LMSユーザー学習進捗';
COMMENT ON TABLE lms_parametric_questions IS 'パラメトリック問題テンプレート';

-- ============================================================================
-- 完了
-- ============================================================================
SELECT 'N3 Media Additional Schema applied successfully' as message;
