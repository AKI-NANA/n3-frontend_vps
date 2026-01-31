// ============================================================================
// N3 Empire OS: Sakurai Style 演出エンジン - 型定義
// 桜井政博「ゲーム作るには」スタイルの演出を完全再現
// ============================================================================

// ----------------------------------------------------------------------------
// 1. 演出定義JSON構造
// ----------------------------------------------------------------------------

export interface SakuraiStyleScript {
  /** 動画メタデータ */
  meta: {
    title: string;
    genre: 'education' | 'product' | 'news' | 'tutorial';
    duration_target_seconds: number;
    language: string;
    created_at: string;
  };

  /** BGM設定 */
  bgm: {
    intro: string;      // URL: 導入パート用BGM
    main: string;       // URL: 解説パート用BGM
    outro: string;      // URL: まとめパート用BGM
    volume_default: number;  // 0.0-1.0
    ducking_level: number;   // ナレーション時の減衰レベル (例: 0.3)
  };

  /** SEライブラリ */
  se_library: {
    [key: string]: string;  // SE名: URL
  };

  /** セクション配列 */
  sections: SakuraiSection[];

  /** グローバルスタイル */
  global_style: SakuraiGlobalStyle;
}

export interface SakuraiSection {
  id: string;
  type: 'intro' | 'main' | 'transition' | 'outro';
  title?: string;
  scenes: SakuraiScene[];
}

export interface SakuraiScene {
  id: string;
  duration_seconds: number;
  
  /** レイヤー構成 */
  layers: {
    background: BackgroundLayer;
    visual: VisualLayer;
    annotation: AnnotationLayer;
    overlay?: OverlayLayer;
  };

  /** ナレーション */
  narration?: {
    text: string;
    emotion: 'neutral' | 'excited' | 'serious' | 'friendly';
    speed: number;  // 0.8-1.2
    pause_after_ms: number;  // 重要ポイント後の溜め
  };

  /** SE/BGMトリガー */
  audio_triggers: AudioTrigger[];

  /** 視覚演出トリガー */
  visual_triggers: VisualTrigger[];
}

// ----------------------------------------------------------------------------
// 2. レイヤー定義
// ----------------------------------------------------------------------------

export interface BackgroundLayer {
  type: 'solid' | 'gradient' | 'image' | 'video';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  image_url?: string;
  blur?: number;  // 0-20
  opacity?: number;  // 0-1
}

export interface VisualLayer {
  type: 'image' | 'multi_image' | 'diagram' | 'text_card';
  
  /** 単一画像 */
  image?: {
    url: string;
    position: { x: number; y: number };  // 0-100 (%)
    size: { width: number; height: number };  // 0-100 (%)
    animation?: ImageAnimation;
  };

  /** 複数画像（比較など） */
  images?: Array<{
    url: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
    label?: string;
    animation?: ImageAnimation;
  }>;

  /** 図解（矢印、フロー等） */
  diagram?: {
    type: 'flow' | 'comparison' | 'timeline' | 'list';
    items: DiagramItem[];
  };

  /** テキストカード */
  text_card?: {
    title: string;
    body: string;
    style: 'info' | 'warning' | 'success' | 'highlight';
  };
}

export interface AnnotationLayer {
  /** テロップ */
  captions: CaptionItem[];
  
  /** ポインター（桜井スタイルの指し棒・枠線） */
  pointers: PointerItem[];
  
  /** プログレスバー */
  progress_bar?: {
    show: boolean;
    position: 'top' | 'bottom';
    current_topic?: string;
  };
}

export interface OverlayLayer {
  /** パーティクル演出 */
  particles?: {
    type: 'sparkle' | 'confetti' | 'snow' | 'none';
    density: number;  // 0-100
  };

  /** ビネット（画面端の暗さ） */
  vignette?: {
    intensity: number;  // 0-1
    color?: string;
  };

  /** フレーム */
  frame?: {
    style: 'sakurai' | 'minimal' | 'none';
    color?: string;
  };
}

// ----------------------------------------------------------------------------
// 3. アニメーション定義
// ----------------------------------------------------------------------------

export interface ImageAnimation {
  enter: {
    type: 'fade' | 'slide' | 'zoom' | 'bounce' | 'pop';
    direction?: 'left' | 'right' | 'top' | 'bottom';
    duration_ms: number;
    easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'spring';
  };
  during?: {
    type: 'ken_burns' | 'pulse' | 'float' | 'none';
    intensity?: number;  // 0-1
  };
  exit?: {
    type: 'fade' | 'slide' | 'zoom' | 'none';
    direction?: 'left' | 'right' | 'top' | 'bottom';
    duration_ms: number;
  };
}

// ----------------------------------------------------------------------------
// 4. テロップ・ポインター定義
// ----------------------------------------------------------------------------

export interface CaptionItem {
  text: string;
  start_ms: number;
  duration_ms: number;
  position: 'top' | 'center' | 'bottom';
  style: {
    font_size: 'small' | 'medium' | 'large' | 'xlarge';
    font_weight: 'normal' | 'bold';
    color: string;
    background?: string;
    highlight_words?: string[];  // 強調する単語
  };
  animation: {
    type: 'typewriter' | 'fade' | 'slide' | 'pop';
    highlight_effect?: 'glow' | 'underline' | 'box' | 'none';
  };
}

export interface PointerItem {
  type: 'arrow' | 'box' | 'circle' | 'underline' | 'stick';  // stick = 桜井風指し棒
  target: {
    x: number;  // 0-100 (%)
    y: number;
    width?: number;
    height?: number;
  };
  start_ms: number;
  duration_ms: number;
  style: {
    color: string;
    thickness: number;
    animated: boolean;  // 動的に出現するか
  };
  label?: string;  // ポインター横のラベル
}

// ----------------------------------------------------------------------------
// 5. オーディオトリガー定義
// ----------------------------------------------------------------------------

export interface AudioTrigger {
  type: 'se' | 'bgm_change' | 'bgm_duck' | 'bgm_restore';
  timing_ms: number;
  
  /** SE再生 */
  se_name?: string;  // se_libraryのキー
  
  /** BGM変更 */
  bgm_track?: 'intro' | 'main' | 'outro';
  
  /** BGMダッキング */
  duck_level?: number;  // 0-1
  duck_duration_ms?: number;
}

export interface VisualTrigger {
  type: 'shake' | 'flash' | 'zoom_pulse' | 'highlight';
  timing_ms: number;
  duration_ms: number;
  intensity: number;  // 0-1
  target?: 'screen' | 'visual' | 'caption';
}

// ----------------------------------------------------------------------------
// 6. 図解アイテム定義
// ----------------------------------------------------------------------------

export interface DiagramItem {
  id: string;
  text: string;
  icon?: string;  // emoji or icon URL
  position: { x: number; y: number };
  connections?: string[];  // 矢印で接続するアイテムID
  style?: {
    color: string;
    background: string;
  };
}

// ----------------------------------------------------------------------------
// 7. グローバルスタイル定義（桜井スタイル）
// ----------------------------------------------------------------------------

export interface SakuraiGlobalStyle {
  /** カラーパレット */
  colors: {
    primary: string;      // メインカラー
    secondary: string;    // サブカラー
    accent: string;       // アクセントカラー
    background: string;   // 背景色
    text: string;         // テキスト色
    text_highlight: string;  // 強調テキスト色
  };

  /** フォント設定 */
  fonts: {
    title: string;        // タイトル用 (例: 'M PLUS Rounded 1c')
    body: string;         // 本文用 (例: 'Noto Sans JP')
    caption: string;      // テロップ用 (例: 'UD Gothic')
  };

  /** 余白・サイズ */
  layout: {
    safe_margin_percent: number;  // 画面端からの余白 (例: 5)
    caption_area_height_percent: number;  // テロップエリア高さ (例: 20)
  };

  /** 桜井スタイル固有設定 */
  sakurai_specific: {
    use_stick_pointer: boolean;     // 指し棒を使用
    use_topic_indicator: boolean;   // トピック表示
    use_chapter_markers: boolean;   // チャプターマーカー
    intro_logo_url?: string;        // オープニングロゴ
    outro_cta_text?: string;        // エンディングCTA
  };
}

// ----------------------------------------------------------------------------
// 8. デフォルト桜井スタイル設定
// ----------------------------------------------------------------------------

export const DEFAULT_SAKURAI_STYLE: SakuraiGlobalStyle = {
  colors: {
    primary: '#1a1a2e',      // 深い紺色
    secondary: '#16213e',    // やや明るい紺
    accent: '#e94560',       // 赤アクセント
    background: '#0f0f23',   // 暗い背景
    text: '#ffffff',         // 白テキスト
    text_highlight: '#ffd700', // 金色ハイライト
  },
  fonts: {
    title: 'M PLUS Rounded 1c',
    body: 'Noto Sans JP',
    caption: 'Noto Sans JP',
  },
  layout: {
    safe_margin_percent: 5,
    caption_area_height_percent: 18,
  },
  sakurai_specific: {
    use_stick_pointer: true,
    use_topic_indicator: true,
    use_chapter_markers: true,
    intro_logo_url: undefined,
    outro_cta_text: 'チャンネル登録お願いします',
  },
};

// ----------------------------------------------------------------------------
// 9. デフォルトSEライブラリ
// ----------------------------------------------------------------------------

export const DEFAULT_SE_LIBRARY = {
  // 出現・登場系
  'pop': '/audio/se/pop.mp3',
  'whoosh': '/audio/se/whoosh.mp3',
  'slide': '/audio/se/slide.mp3',
  
  // 強調系
  'impact': '/audio/se/impact.mp3',
  'ding': '/audio/se/ding.mp3',
  'sparkle': '/audio/se/sparkle.mp3',
  
  // 切替系
  'shutter': '/audio/se/shutter.mp3',
  'page_turn': '/audio/se/page_turn.mp3',
  'click': '/audio/se/click.mp3',
  
  // 成功・完了系
  'success': '/audio/se/success.mp3',
  'level_up': '/audio/se/level_up.mp3',
  
  // 警告・注意系
  'warning': '/audio/se/warning.mp3',
  'error': '/audio/se/error.mp3',
  
  // 桜井スタイル特有
  'pointer_appear': '/audio/se/pointer_appear.mp3',
  'chapter_start': '/audio/se/chapter_start.mp3',
};
