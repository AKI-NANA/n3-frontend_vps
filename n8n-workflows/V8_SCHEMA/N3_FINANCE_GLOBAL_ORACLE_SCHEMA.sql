-- ============================================================================
-- N3 Finance - Global Oracle：株式投資OS データベーススキーマ
-- Version: V6
-- Created: 2026-01-27
-- ============================================================================

-- ============================================================================
-- 1. market_data: 銘柄・財務・需給データ蓄積
-- ============================================================================
CREATE TABLE IF NOT EXISTS market_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL,                      -- 銘柄コード
    date DATE NOT NULL,                      -- 日付
    
    -- 株価情報
    open NUMERIC,                            -- 始値
    high NUMERIC,                            -- 高値
    low NUMERIC,                             -- 安値
    close NUMERIC,                           -- 終値
    volume BIGINT,                           -- 出来高
    turnover NUMERIC,                        -- 売買代金
    
    -- 財務情報
    per NUMERIC,                             -- PER
    pbr NUMERIC,                             -- PBR
    roe NUMERIC,                             -- ROE (%)
    eps NUMERIC,                             -- EPS
    bps NUMERIC,                             -- BPS
    dividend_yield NUMERIC,                  -- 配当利回り (%)
    
    -- 需給情報
    margin_buy BIGINT,                       -- 信用買い残
    margin_sell BIGINT,                      -- 信用売り残
    margin_ratio NUMERIC,                    -- 信用倍率
    
    -- メタ情報
    batch_id TEXT,                           -- バッチID
    fetched_at TIMESTAMPTZ DEFAULT NOW(),    -- 取得日時
    
    UNIQUE(code, date)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_market_data_code ON market_data(code);
CREATE INDEX IF NOT EXISTS idx_market_data_date ON market_data(date DESC);
CREATE INDEX IF NOT EXISTS idx_market_data_code_date ON market_data(code, date DESC);

-- ============================================================================
-- 2. macro_context: マクロ環境・相場モード
-- ============================================================================
CREATE TABLE IF NOT EXISTS macro_context (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id TEXT NOT NULL,               -- 分析ID
    target_date DATE NOT NULL UNIQUE,        -- 対象日
    
    -- マクロ指標
    usd_jpy NUMERIC,                         -- ドル円レート
    us_10y_yield NUMERIC,                    -- 米10年債利回り
    avg_margin_ratio NUMERIC,                -- 平均信用倍率
    
    -- タグ
    context_tags JSONB,                      -- コンテキストタグ配列
    
    -- 判定結果
    market_mode TEXT,                        -- BULLISH/CAUTION/OPPORTUNITY/NEUTRAL
    mode_score INTEGER,                      -- モードスコア (0-100)
    
    analyzed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. strategy_backtests: 戦略シミュレーション結果
-- ============================================================================
CREATE TABLE IF NOT EXISTS strategy_backtests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    strategy_name TEXT NOT NULL,             -- 戦略名
    stock_code TEXT NOT NULL,                -- 銘柄コード
    
    score INTEGER,                           -- スコア (0-100)
    signal TEXT,                             -- BUY/SELL/HOLD
    confidence NUMERIC,                      -- 信頼度 (0-100)
    
    market_mode TEXT,                        -- 判定時の相場モード
    sim_id TEXT,                             -- シミュレーションID
    
    tested_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_strategy_backtests_stock ON strategy_backtests(stock_code);
CREATE INDEX IF NOT EXISTS idx_strategy_backtests_strategy ON strategy_backtests(strategy_name);

-- ============================================================================
-- 4. agent_debates: AIエージェントディベート結果
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_debates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    debate_id TEXT NOT NULL UNIQUE,          -- ディベートID
    stock_code TEXT NOT NULL,                -- 銘柄コード
    stock_name TEXT,                         -- 銘柄名
    
    -- エージェント判定
    bullish_confidence INTEGER,              -- 強気派の自信度
    bearish_caution INTEGER,                 -- 弱気派の警戒度
    skeptical_certainty INTEGER,             -- 懐疑派の確実性
    skeptical_evaluation TEXT,               -- 懐疑派の評価 (bullish/bearish/neutral)
    
    -- 合意結果
    consensus TEXT,                          -- BUY/SELL/HOLD/DEBATE
    consensus_score INTEGER,                 -- 合意スコア
    recommendation TEXT,                     -- 推奨アクション
    should_alert BOOLEAN DEFAULT FALSE,      -- アラート発火
    
    debated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_agent_debates_stock ON agent_debates(stock_code);
CREATE INDEX IF NOT EXISTS idx_agent_debates_consensus ON agent_debates(consensus);

-- ============================================================================
-- 5. tactical_plans: 戦術書（Entry/Exit/StopLoss）
-- ============================================================================
CREATE TABLE IF NOT EXISTS tactical_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id TEXT NOT NULL UNIQUE,            -- プランID
    stock_code TEXT NOT NULL,                -- 銘柄コード
    stock_name TEXT,                         -- 銘柄名
    
    -- 価格情報
    current_price NUMERIC NOT NULL,          -- 現在価格
    entry_price NUMERIC,                     -- エントリー価格
    stop_loss_price NUMERIC,                 -- 損切り価格
    take_profit_1_price NUMERIC,             -- 利確1価格
    take_profit_2_price NUMERIC,             -- 利確2価格
    trailing_stop_distance NUMERIC,          -- トレーリングストップ幅
    
    -- 時間制限
    time_limit_days INTEGER,                 -- 塩漬け防止日数
    
    -- 分析結果
    win_rate NUMERIC,                        -- 勝率
    risk_reward_ratio NUMERIC,               -- リスクリワード比
    expected_value_percent NUMERIC,          -- 期待値 (%)
    
    -- 推奨
    recommendation TEXT,                     -- 推奨アクション
    
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_tactical_plans_stock ON tactical_plans(stock_code);
CREATE INDEX IF NOT EXISTS idx_tactical_plans_generated ON tactical_plans(generated_at DESC);

-- ============================================================================
-- 6. safety_settings: 安全装置設定
-- ============================================================================
CREATE TABLE IF NOT EXISTS safety_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- シングルトン
    survival_fund_jpy NUMERIC DEFAULT 2000000,        -- 聖域資金（円）
    tax_reserve_rate NUMERIC DEFAULT 0.3,             -- 納税リザーブ率
    max_investment_ratio NUMERIC DEFAULT 0.1,         -- 1銘柄最大投入比率
    usd_reserve NUMERIC DEFAULT 0,                    -- USD待機資金
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- デフォルト設定を挿入
INSERT INTO safety_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. cash_checks: キャッシュチェック履歴
-- ============================================================================
CREATE TABLE IF NOT EXISTS cash_checks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    check_id TEXT NOT NULL UNIQUE,           -- チェックID
    
    -- 入力値
    total_balance_jpy NUMERIC,               -- 総残高（円）
    total_balance_usd NUMERIC,               -- 総残高（USD）
    
    -- リザーブ内訳
    survival_fund NUMERIC,                   -- 聖域資金
    operating_reserve NUMERIC,               -- 運転資金リザーブ
    tax_reserve NUMERIC,                     -- 納税リザーブ
    total_reserve NUMERIC,                   -- 総リザーブ
    
    -- 投資可能額
    investable_jpy NUMERIC,                  -- 投資可能額（円）
    investable_usd NUMERIC,                  -- 投資可能額（USD）
    max_per_stock NUMERIC,                   -- 1銘柄最大投資額
    
    -- ステータス
    status TEXT,                             -- ATTACK/CAUTIOUS/DEFENSE/LOCKDOWN
    
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_cash_checks_status ON cash_checks(status);
CREATE INDEX IF NOT EXISTS idx_cash_checks_checked ON cash_checks(checked_at DESC);

-- ============================================================================
-- 8. trade_logs: 売買ログ（実績・シミュレーション）
-- ============================================================================
CREATE TABLE IF NOT EXISTS trade_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trade_id TEXT NOT NULL UNIQUE,           -- トレードID
    stock_code TEXT NOT NULL,                -- 銘柄コード
    stock_name TEXT,                         -- 銘柄名
    
    -- 売買情報
    trade_type TEXT NOT NULL,                -- BUY/SELL
    is_simulation BOOLEAN DEFAULT FALSE,     -- シミュレーションフラグ
    
    entry_price NUMERIC,                     -- エントリー価格
    exit_price NUMERIC,                      -- 決済価格
    quantity INTEGER,                        -- 数量
    
    -- 損益
    profit_loss NUMERIC,                     -- 損益額
    profit_loss_percent NUMERIC,             -- 損益率
    
    -- 戦略情報
    strategy_used TEXT,                      -- 使用した戦略
    plan_id TEXT REFERENCES tactical_plans(plan_id), -- 紐づく戦術書
    
    -- 反省・学習
    exit_reason TEXT,                        -- 決済理由
    lessons_learned TEXT,                    -- 学んだこと
    
    entry_at TIMESTAMPTZ,                    -- エントリー日時
    exit_at TIMESTAMPTZ,                     -- 決済日時
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_trade_logs_stock ON trade_logs(stock_code);
CREATE INDEX IF NOT EXISTS idx_trade_logs_type ON trade_logs(trade_type);
CREATE INDEX IF NOT EXISTS idx_trade_logs_simulation ON trade_logs(is_simulation);

-- ============================================================================
-- 9. formula_library: 計算式ライブラリ（自己修復用）
-- ============================================================================
CREATE TABLE IF NOT EXISTS formula_library (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    formula_name TEXT NOT NULL UNIQUE,       -- 数式名
    formula_code TEXT NOT NULL,              -- 数式コード（JS/Python）
    
    -- パフォーマンス
    total_trades INTEGER DEFAULT 0,          -- 総トレード数
    win_count INTEGER DEFAULT 0,             -- 勝ち数
    lose_count INTEGER DEFAULT 0,            -- 負け数
    win_rate NUMERIC,                        -- 勝率
    avg_return NUMERIC,                      -- 平均リターン
    max_drawdown NUMERIC,                    -- 最大ドローダウン
    
    -- ステータス
    is_active BOOLEAN DEFAULT TRUE,          -- 有効フラグ
    last_used_at TIMESTAMPTZ,                -- 最終使用日時
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. watchlist: 監視銘柄リスト
-- ============================================================================
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stock_code TEXT NOT NULL,                -- 銘柄コード
    stock_name TEXT,                         -- 銘柄名
    
    -- 監視設定
    watch_reason TEXT,                       -- 監視理由
    target_entry_price NUMERIC,              -- 目標エントリー価格
    alert_enabled BOOLEAN DEFAULT TRUE,      -- アラート有効
    
    -- 優先度
    priority INTEGER DEFAULT 5,              -- 優先度 (1-10)
    
    added_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(stock_code)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_watchlist_priority ON watchlist(priority DESC);

-- ============================================================================
-- コメント
-- ============================================================================
COMMENT ON TABLE market_data IS 'J-Quantsから取得した銘柄の財務・需給データ';
COMMENT ON TABLE macro_context IS '毎日の相場環境タグ（円安/高金利/過熱等）';
COMMENT ON TABLE strategy_backtests IS '各投資理論のバックテスト結果';
COMMENT ON TABLE agent_debates IS 'AI3エージェント（強気/弱気/懐疑）のディベート結果';
COMMENT ON TABLE tactical_plans IS 'Entry/Exit/StopLossをセットにした戦術書';
COMMENT ON TABLE safety_settings IS '安全装置の設定（聖域資金・納税リザーブ等）';
COMMENT ON TABLE cash_checks IS 'キャッシュフローチェック履歴';
COMMENT ON TABLE trade_logs IS '売買ログ（実績＆シミュレーション）';
COMMENT ON TABLE formula_library IS '計算式ライブラリ（自己修復用）';
COMMENT ON TABLE watchlist IS '監視銘柄リスト';
