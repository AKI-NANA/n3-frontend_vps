-- ============================================================================
-- N3 Empire OS - メディアセクション専用SQLスキーマ（修正版）
-- 生成日: 2026-01-28
-- 修正: 外部キー参照順序を修正、依存関係の解決
-- ============================================================================

-- ============================================================================
-- 1. メディアチャンネル管理（media_channels）- 最初に作成
-- ============================================================================
CREATE TABLE IF NOT EXISTS media_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT NOT NULL UNIQUE,
    channel_name TEXT NOT NULL,
    
    -- YouTube連携
    youtube_channel_id TEXT,
    youtube_channel_url TEXT,
    
    -- スタイル設定
    style_id TEXT DEFAULT 'default',
    avatar_seed TEXT,
    style_config JSONB DEFAULT '{
        "emotion_intensity": 0.7,
        "motion_smoothness": 0.8,
        "personality": "balanced"
    }'::jsonb,
    
    -- ブランド設定
    brand_color_primary TEXT DEFAULT '#3b82f6',
    brand_color_secondary TEXT DEFAULT '#1e40af',
    brand_font TEXT DEFAULT 'NotoSansJP',
    
    -- 多言語設定
    primary_language TEXT DEFAULT 'ja',
    supported_languages TEXT[] DEFAULT ARRAY['ja', 'en'],
    
    -- 運用設定
    is_active BOOLEAN DEFAULT true,
    auto_publish_enabled BOOLEAN DEFAULT false,
    daily_upload_limit INTEGER DEFAULT 10,
    
    -- BAN回避設定
    proxy_profile_id TEXT,
    fingerprint_seed TEXT,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_channels_channel_id ON media_channels(channel_id);
CREATE INDEX IF NOT EXISTS idx_media_channels_active ON media_channels(is_active) WHERE is_active = true;

COMMENT ON TABLE media_channels IS 'YouTubeチャンネル設定・ブランドDNA管理';

-- ============================================================================
-- 2. YouTube OAuth トークン（youtube_oauth_tokens）
-- ============================================================================
CREATE TABLE IF NOT EXISTS youtube_oauth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id TEXT NOT NULL UNIQUE,
    youtube_channel_id TEXT,
    
    -- OAuth2トークン
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    token_type TEXT DEFAULT 'Bearer',
    expires_at TIMESTAMPTZ NOT NULL,
    
    -- スコープ
    scopes TEXT[] DEFAULT ARRAY['https://www.googleapis.com/auth/youtube.upload'],
    
    -- Stream Key（ライブ配信用）
    stream_key TEXT,
    
    -- 状態
    is_valid BOOLEAN DEFAULT true,
    last_refresh_at TIMESTAMPTZ,
    last_error TEXT,
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_youtube_oauth_tokens_channel ON youtube_oauth_tokens(channel_id);
CREATE INDEX IF NOT EXISTS idx_youtube_oauth_tokens_valid ON youtube_oauth_tokens(is_valid) WHERE is_valid = true;

COMMENT ON TABLE youtube_oauth_tokens IS 'YouTube OAuth2認証トークン管理';

-- ============================================================================
-- 3. コンテンツマスター（content_master）
-- ============================================================================
CREATE TABLE IF NOT EXISTS content_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT NOT NULL UNIQUE,
    
    -- 関連ID
    channel_id TEXT,
    product_id BIGINT,
    
    -- コンテンツ情報
    title TEXT NOT NULL,
    description TEXT,
    script_data JSONB,
    
    -- メディアURL
    audio_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    
    -- 生成設定
    content_type TEXT DEFAULT 'youtube_long',
    genre TEXT DEFAULT 'general',
    target_language TEXT DEFAULT 'ja',
    
    -- 品質設定
    video_quality TEXT DEFAULT '1080p',
    audio_quality TEXT DEFAULT 'high',
    
    -- 公開設定
    publish_status TEXT DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    -- 統計
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_master_content_id ON content_master(content_id);
CREATE INDEX IF NOT EXISTS idx_content_master_channel ON content_master(channel_id);
CREATE INDEX IF NOT EXISTS idx_content_master_product ON content_master(product_id);
CREATE INDEX IF NOT EXISTS idx_content_master_status ON content_master(publish_status);

COMMENT ON TABLE content_master IS 'メディアコンテンツのマスターデータ';

-- ============================================================================
-- 4. メディアコンテンツ（media_content）- 24hライブ用
-- ============================================================================
CREATE TABLE IF NOT EXISTS media_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 関連ID
    channel_id TEXT,
    content_master_id UUID,
    product_id BIGINT,
    
    -- コンテンツ情報
    title TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'video',
    duration_seconds INTEGER,
    
    -- 公開設定
    publish_status TEXT DEFAULT 'draft',
    
    -- 統計
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue NUMERIC(10, 2) DEFAULT 0,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_content_channel ON media_content(channel_id);
CREATE INDEX IF NOT EXISTS idx_media_content_status ON media_content(publish_status);

COMMENT ON TABLE media_content IS '24hライブ等で使用するメディアコンテンツ';

-- ============================================================================
-- 5. メディアアセット（media_assets）
-- ============================================================================
CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 関連ID
    channel_id TEXT,
    product_id BIGINT,
    content_id TEXT,
    
    -- アセット情報
    asset_type TEXT NOT NULL,
    asset_url TEXT NOT NULL,
    asset_name TEXT,
    
    -- ファイル情報
    file_size BIGINT,
    file_format TEXT,
    width INTEGER,
    height INTEGER,
    duration_ms INTEGER,
    
    -- 分類タグ
    tags TEXT[] DEFAULT '{}',
    emotion_tag TEXT,
    posture_id TEXT,
    
    -- MidJourney固有
    mj_prompt TEXT,
    mj_seed TEXT,
    mj_style_id TEXT,
    
    -- 使用状況
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_channel ON media_assets(channel_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_emotion ON media_assets(emotion_tag);

COMMENT ON TABLE media_assets IS 'MidJourney画像・LivePortrait動画等のアセット管理';

-- ============================================================================
-- 6. ライブストリーム管理（live_streams）
-- ============================================================================
CREATE TABLE IF NOT EXISTS live_streams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id TEXT NOT NULL UNIQUE,
    
    -- チャンネル
    channel_id TEXT NOT NULL,
    
    -- ストリーム情報
    stream_title TEXT NOT NULL,
    stream_type TEXT DEFAULT 'playlist',
    rtmp_url TEXT,
    
    -- プレイリスト設定
    playlist_config JSONB DEFAULT '{}',
    
    -- 状態
    status TEXT DEFAULT 'pending',
    
    -- 時間
    scheduled_start TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    
    -- 統計
    peak_viewers INTEGER DEFAULT 0,
    total_watch_time_minutes INTEGER DEFAULT 0,
    
    -- エラー情報
    last_error TEXT,
    error_count INTEGER DEFAULT 0,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_streams_stream_id ON live_streams(stream_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_channel ON live_streams(channel_id);
CREATE INDEX IF NOT EXISTS idx_live_streams_status ON live_streams(status);

COMMENT ON TABLE live_streams IS '24時間ライブ配信の管理';

-- プレイリスト管理テーブル
CREATE TABLE IF NOT EXISTS live_stream_playlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stream_id TEXT NOT NULL,
    media_content_id UUID,
    
    -- 順序
    play_order INTEGER NOT NULL,
    
    -- 再生状態
    played_at TIMESTAMPTZ,
    play_count INTEGER DEFAULT 0,
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_stream_playlist_stream ON live_stream_playlist(stream_id);

-- ============================================================================
-- 7. 視覚的注釈（visual_annotations）
-- ============================================================================
CREATE TABLE IF NOT EXISTS visual_annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id TEXT NOT NULL,
    
    -- 注釈データ
    annotations JSONB NOT NULL DEFAULT '[]',
    diagrams JSONB DEFAULT '[]',
    
    -- 生成情報
    ai_annotation_model TEXT DEFAULT 'gemini-1.5-pro',
    annotation_count INTEGER DEFAULT 0,
    confidence_score NUMERIC(3, 2) DEFAULT 0.85,
    
    -- Remotion用プロパティ
    remotion_props JSONB DEFAULT '{}',
    
    -- 承認状態
    is_approved BOOLEAN DEFAULT false,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_visual_annotations_content_unique ON visual_annotations(content_id);
CREATE INDEX IF NOT EXISTS idx_visual_annotations_content ON visual_annotations(content_id);

COMMENT ON TABLE visual_annotations IS '桜井スタイル視覚的注釈（矢印・ハイライト・ズーム）';

-- ============================================================================
-- 8. KJ法ナレッジグラフ（kj_knowledge_graph）
-- ============================================================================
CREATE TABLE IF NOT EXISTS kj_knowledge_graph (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- データ分類
    data_type TEXT NOT NULL,
    source_workflow TEXT NOT NULL,
    
    -- 関連ID
    channel_id TEXT,
    content_id TEXT,
    product_id BIGINT,
    
    -- 知見データ
    insights JSONB NOT NULL,
    
    -- 相関スコア
    correlation_score NUMERIC(5, 4),
    confidence_level NUMERIC(3, 2),
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kj_knowledge_graph_type ON kj_knowledge_graph(data_type);
CREATE INDEX IF NOT EXISTS idx_kj_knowledge_graph_channel ON kj_knowledge_graph(channel_id);
CREATE INDEX IF NOT EXISTS idx_kj_knowledge_graph_created ON kj_knowledge_graph(created_at DESC);

COMMENT ON TABLE kj_knowledge_graph IS 'KJ法による知見蓄積・株分析連携';

-- ============================================================================
-- 9. 実行ログ（execution_logs）
-- ============================================================================
CREATE TABLE IF NOT EXISTS execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- ワークフロー情報
    workflow_id TEXT NOT NULL,
    workflow_name TEXT NOT NULL,
    
    -- 実行結果
    status TEXT NOT NULL,
    execution_time_ms INTEGER,
    
    -- エラー情報
    error_message TEXT,
    error_code TEXT,
    
    -- ノード情報
    node_count INTEGER,
    
    -- メタデータ
    metadata JSONB DEFAULT '{}',
    
    -- タイムスタンプ
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_execution_logs_workflow ON execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_executed ON execution_logs(executed_at DESC);

COMMENT ON TABLE execution_logs IS 'n8nワークフロー実行ログ';

-- ============================================================================
-- 10. LMS関連テーブル
-- ============================================================================

CREATE TABLE IF NOT EXISTS lms_user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    
    -- コンテンツ関連
    content_id TEXT,
    channel_id TEXT,
    
    -- 進捗データ
    questions_answered INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    incorrect_count INTEGER DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    
    -- 弱点分析
    weak_points JSONB DEFAULT '[]',
    strong_points JSONB DEFAULT '[]',
    
    -- 最終アクセス
    last_question_at TIMESTAMPTZ,
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_user_progress_user ON lms_user_progress(user_id);

CREATE TABLE IF NOT EXISTS lms_parametric_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- 問題情報
    question_template TEXT NOT NULL,
    answer_template TEXT NOT NULL,
    explanation_template TEXT,
    
    -- パラメータ
    parameters JSONB NOT NULL DEFAULT '{}',
    difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5),
    
    -- 分類
    category TEXT NOT NULL,
    subcategory TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- 関連コンテンツ
    related_content_id TEXT,
    related_video_timestamp_ms INTEGER,
    
    -- 使用統計
    times_used INTEGER DEFAULT 0,
    average_time_seconds INTEGER,
    success_rate NUMERIC(5, 2),
    
    -- タイムスタンプ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lms_parametric_questions_category ON lms_parametric_questions(category);
CREATE INDEX IF NOT EXISTS idx_lms_parametric_questions_difficulty ON lms_parametric_questions(difficulty_level);

-- ============================================================================
-- 11. トリガー: updated_at自動更新
-- ============================================================================
CREATE OR REPLACE FUNCTION update_media_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- media_channels
DROP TRIGGER IF EXISTS update_media_channels_updated_at ON media_channels;
CREATE TRIGGER update_media_channels_updated_at
    BEFORE UPDATE ON media_channels
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- youtube_oauth_tokens
DROP TRIGGER IF EXISTS update_youtube_oauth_tokens_updated_at ON youtube_oauth_tokens;
CREATE TRIGGER update_youtube_oauth_tokens_updated_at
    BEFORE UPDATE ON youtube_oauth_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- content_master
DROP TRIGGER IF EXISTS update_content_master_updated_at ON content_master;
CREATE TRIGGER update_content_master_updated_at
    BEFORE UPDATE ON content_master
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- media_content
DROP TRIGGER IF EXISTS update_media_content_updated_at ON media_content;
CREATE TRIGGER update_media_content_updated_at
    BEFORE UPDATE ON media_content
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- media_assets
DROP TRIGGER IF EXISTS update_media_assets_updated_at ON media_assets;
CREATE TRIGGER update_media_assets_updated_at
    BEFORE UPDATE ON media_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- live_streams
DROP TRIGGER IF EXISTS update_live_streams_updated_at ON live_streams;
CREATE TRIGGER update_live_streams_updated_at
    BEFORE UPDATE ON live_streams
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- visual_annotations
DROP TRIGGER IF EXISTS update_visual_annotations_updated_at ON visual_annotations;
CREATE TRIGGER update_visual_annotations_updated_at
    BEFORE UPDATE ON visual_annotations
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- lms_user_progress
DROP TRIGGER IF EXISTS update_lms_user_progress_updated_at ON lms_user_progress;
CREATE TRIGGER update_lms_user_progress_updated_at
    BEFORE UPDATE ON lms_user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- lms_parametric_questions
DROP TRIGGER IF EXISTS update_lms_parametric_questions_updated_at ON lms_parametric_questions;
CREATE TRIGGER update_lms_parametric_questions_updated_at
    BEFORE UPDATE ON lms_parametric_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_media_updated_at_column();

-- ============================================================================
-- 12. RPC関数: メディアチャンネル初期化
-- ============================================================================
CREATE OR REPLACE FUNCTION init_media_channel(
    p_channel_id TEXT,
    p_channel_name TEXT,
    p_youtube_channel_id TEXT DEFAULT NULL,
    p_style_config JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO media_channels (
        channel_id, channel_name, youtube_channel_id, style_config
    ) VALUES (
        p_channel_id, 
        p_channel_name, 
        p_youtube_channel_id,
        COALESCE(p_style_config, '{
            "emotion_intensity": 0.7,
            "motion_smoothness": 0.8,
            "personality": "balanced"
        }'::jsonb)
    )
    ON CONFLICT (channel_id) DO UPDATE SET
        channel_name = EXCLUDED.channel_name,
        youtube_channel_id = COALESCE(EXCLUDED.youtube_channel_id, media_channels.youtube_channel_id),
        style_config = COALESCE(EXCLUDED.style_config, media_channels.style_config),
        updated_at = NOW()
    RETURNING id INTO v_id;
    
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 13. ビュー: チャンネル統計
-- ============================================================================
CREATE OR REPLACE VIEW v_media_channel_stats AS
SELECT 
    mc.channel_id,
    mc.channel_name,
    mc.is_active,
    (SELECT COUNT(*) FROM content_master cm WHERE cm.channel_id = mc.channel_id) as total_content,
    (SELECT COUNT(*) FROM content_master cm WHERE cm.channel_id = mc.channel_id AND cm.publish_status = 'published') as published_content,
    (SELECT COUNT(*) FROM media_assets ma WHERE ma.channel_id = mc.channel_id) as total_assets,
    (SELECT COUNT(*) FROM live_streams ls WHERE ls.channel_id = mc.channel_id AND ls.status = 'live') as active_streams,
    yot.expires_at as youtube_token_expires_at,
    CASE 
        WHEN yot.expires_at IS NULL THEN 'not_connected'
        WHEN yot.expires_at < NOW() THEN 'expired'
        WHEN yot.expires_at < NOW() + INTERVAL '1 hour' THEN 'expiring_soon'
        ELSE 'valid'
    END as youtube_auth_status
FROM media_channels mc
LEFT JOIN youtube_oauth_tokens yot ON mc.channel_id = yot.channel_id;

-- ============================================================================
-- 14. youtube_tokens ビュー（24hライブ用エイリアス）
-- ============================================================================
CREATE OR REPLACE VIEW youtube_tokens AS
SELECT 
    id,
    channel_id,
    youtube_channel_id,
    access_token,
    refresh_token,
    token_type,
    expires_at,
    stream_key
FROM youtube_oauth_tokens;

-- ============================================================================
-- 完了
-- ============================================================================
SELECT 'N3 Media SQL Schema V2 created successfully' as message;
