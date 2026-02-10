-- ============================================================================
-- N3 Empire OS - メディアセクション PART 3: 関数・トリガー・ビュー
-- PART1, PART2の後に実行
-- ============================================================================

-- トリガー関数
CREATE OR REPLACE FUNCTION media_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- media_channels トリガー
DROP TRIGGER IF EXISTS trg_media_channels_timestamp ON media_channels;
CREATE TRIGGER trg_media_channels_timestamp
    BEFORE UPDATE ON media_channels
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- youtube_oauth_tokens トリガー
DROP TRIGGER IF EXISTS trg_youtube_oauth_tokens_timestamp ON youtube_oauth_tokens;
CREATE TRIGGER trg_youtube_oauth_tokens_timestamp
    BEFORE UPDATE ON youtube_oauth_tokens
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- content_master トリガー
DROP TRIGGER IF EXISTS trg_content_master_timestamp ON content_master;
CREATE TRIGGER trg_content_master_timestamp
    BEFORE UPDATE ON content_master
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- media_content トリガー
DROP TRIGGER IF EXISTS trg_media_content_timestamp ON media_content;
CREATE TRIGGER trg_media_content_timestamp
    BEFORE UPDATE ON media_content
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- media_assets トリガー
DROP TRIGGER IF EXISTS trg_media_assets_timestamp ON media_assets;
CREATE TRIGGER trg_media_assets_timestamp
    BEFORE UPDATE ON media_assets
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- live_streams トリガー
DROP TRIGGER IF EXISTS trg_live_streams_timestamp ON live_streams;
CREATE TRIGGER trg_live_streams_timestamp
    BEFORE UPDATE ON live_streams
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- visual_annotations トリガー
DROP TRIGGER IF EXISTS trg_visual_annotations_timestamp ON visual_annotations;
CREATE TRIGGER trg_visual_annotations_timestamp
    BEFORE UPDATE ON visual_annotations
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- lms_user_progress トリガー
DROP TRIGGER IF EXISTS trg_lms_user_progress_timestamp ON lms_user_progress;
CREATE TRIGGER trg_lms_user_progress_timestamp
    BEFORE UPDATE ON lms_user_progress
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- lms_parametric_questions トリガー
DROP TRIGGER IF EXISTS trg_lms_parametric_questions_timestamp ON lms_parametric_questions;
CREATE TRIGGER trg_lms_parametric_questions_timestamp
    BEFORE UPDATE ON lms_parametric_questions
    FOR EACH ROW EXECUTE FUNCTION media_update_timestamp();

-- チャンネル初期化関数
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
        COALESCE(p_style_config, '{"emotion_intensity": 0.7, "motion_smoothness": 0.8, "personality": "balanced"}'::jsonb)
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

-- チャンネル統計ビュー
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

-- youtube_tokens ビュー（24hライブ用エイリアス）
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

-- 完了メッセージ
SELECT 'N3 Media Schema PART3 (Functions/Triggers/Views) completed' as message;
