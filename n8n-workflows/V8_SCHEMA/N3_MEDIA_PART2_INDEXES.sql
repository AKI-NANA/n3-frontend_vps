-- ============================================================================
-- N3 Empire OS - メディアセクション PART 2: インデックス
-- PART1のテーブル作成後に実行
-- ============================================================================

-- media_channels
CREATE INDEX IF NOT EXISTS idx_media_channels_channel_id ON media_channels(channel_id);
CREATE INDEX IF NOT EXISTS idx_media_channels_active ON media_channels(is_active) WHERE is_active = true;

-- youtube_oauth_tokens
CREATE INDEX IF NOT EXISTS idx_youtube_oauth_tokens_channel ON youtube_oauth_tokens(channel_id);
CREATE INDEX IF NOT EXISTS idx_youtube_oauth_tokens_valid ON youtube_oauth_tokens(is_valid) WHERE is_valid = true;

-- content_master
CREATE INDEX IF NOT EXISTS idx_content_master_content_id ON content_master(content_id);
CREATE INDEX IF NOT EXISTS idx_content_master_channel ON content_master(channel_id);
CREATE INDEX IF NOT EXISTS idx_content_master_product ON content_master(product_id);
CREATE INDEX IF NOT EXISTS idx_content_master_status ON content_master(publish_status);

-- media_content
CREATE INDEX IF NOT EXISTS idx_media_content_channel ON media_content(channel_id);
CREATE INDEX IF NOT EXISTS idx_media_content_status ON media_content(publish_status);

-- media_assets
CREATE INDEX IF NOT EXISTS idx_media_assets_channel ON media_assets(channel_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON media_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_emotion ON media_assets(emotion_tag);

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
CREATE INDEX IF NOT EXISTS idx_kj_knowledge_graph_created ON kj_knowledge_graph(created_at DESC);

-- execution_logs
CREATE INDEX IF NOT EXISTS idx_execution_logs_workflow ON execution_logs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_execution_logs_status ON execution_logs(status);
CREATE INDEX IF NOT EXISTS idx_execution_logs_executed ON execution_logs(executed_at DESC);

-- lms_user_progress
CREATE INDEX IF NOT EXISTS idx_lms_user_progress_user ON lms_user_progress(user_id);

-- lms_parametric_questions
CREATE INDEX IF NOT EXISTS idx_lms_parametric_questions_category ON lms_parametric_questions(category);
CREATE INDEX IF NOT EXISTS idx_lms_parametric_questions_difficulty ON lms_parametric_questions(difficulty_level);

-- コメント追加
COMMENT ON TABLE media_channels IS 'YouTubeチャンネル設定・ブランドDNA管理';
COMMENT ON TABLE youtube_oauth_tokens IS 'YouTube OAuth2認証トークン管理';
COMMENT ON TABLE content_master IS 'メディアコンテンツのマスターデータ';
COMMENT ON TABLE media_content IS '24hライブ等で使用するメディアコンテンツ';
COMMENT ON TABLE media_assets IS 'MidJourney画像・LivePortrait動画等のアセット管理';
COMMENT ON TABLE live_streams IS '24時間ライブ配信の管理';
COMMENT ON TABLE visual_annotations IS '桜井スタイル視覚的注釈';
COMMENT ON TABLE kj_knowledge_graph IS 'KJ法による知見蓄積';
COMMENT ON TABLE execution_logs IS 'n8nワークフロー実行ログ';
