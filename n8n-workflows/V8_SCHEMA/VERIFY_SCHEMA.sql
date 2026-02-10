-- 確認用クエリ：追加されたテーブルとcontent_masterのカラム確認

-- 1. 新規作成されたテーブル一覧
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'youtube_oauth_tokens', 
    'live_streams', 
    'live_stream_playlist',
    'visual_annotations',
    'kj_knowledge_graph',
    'execution_logs',
    'lms_user_progress',
    'lms_parametric_questions'
)
ORDER BY table_name;

-- 2. content_masterに追加されたカラム確認
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'content_master'
ORDER BY ordinal_position;
