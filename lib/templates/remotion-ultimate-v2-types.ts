// ============================================================================
// N3 Empire OS: 究極の Remotion 金型 V2
// 桜井スタイル完全再現 + 自律進化機能
// ============================================================================

// ----------------------------------------------------------------------------
// 1. メタデータ・エクスポート構造（タイムスタンプ・フィードバック用）
// ----------------------------------------------------------------------------

export interface SceneMetadata {
  scene_id: string;
  section_type: 'intro' | 'main' | 'transition' | 'outro';
  topic_id?: string;           // atomic_data との紐付け
  start_time_ms: number;
  end_time_ms: number;
  duration_ms: number;
  narration_text: string;
  keywords: string[];          // LMS検索用キーワード
  annotations_count: number;
  se_triggers_count: number;
}

export interface RenderExportMetadata {
  render_id: string;
  video_type: 'short' | 'long';
  total_duration_ms: number;
  composition_id: string;
  scenes: SceneMetadata[];
  audio_tracks: {
    narration_url?: string;
    bgm_tracks: string[];
    se_used: string[];
  };
  performance_params: {
    spring_stiffness: number;
    spring_damping: number;
    se_sync_tolerance_ms: number;
    color_jitter_seed: number;
  };
  generated_at: string;
}

// ----------------------------------------------------------------------------
// 2. 動的アノテーション（桜井スタイル・ポインター）
// ----------------------------------------------------------------------------

export interface DynamicAnnotation {
  id: string;
  type: 'arrow' | 'circle' | 'box' | 'underline' | 'stick' | 'highlight_zone';
  
  /** ターゲット座標（パーセント指定） */
  target: {
    x: number;      // 0-100
    y: number;      // 0-100
    width?: number; // box/highlight_zone用
    height?: number;
  };
  
  /** タイミング */
  timing: {
    start_ms: number;
    duration_ms: number;
    sync_to_word?: string;  // ElevenLabsのタイムスタンプと同期する単語
  };
  
  /** アニメーション */
  animation: {
    enter: 'spring' | 'fade' | 'draw' | 'pop';
    spring_config?: {
      stiffness: number;  // 100-500
      damping: number;    // 10-50
      mass: number;       // 0.5-2
    };
    during?: 'pulse' | 'glow' | 'shake' | 'none';
    exit?: 'fade' | 'shrink' | 'none';
  };
  
  /** スタイル */
  style: {
    color: string;
    thickness: number;
    glow_intensity?: number;
    label?: string;
    label_position?: 'top' | 'bottom' | 'left' | 'right';
  };
  
  /** 連動視覚効果 */
  impact_effect?: {
    type: 'screen_shake' | 'flash' | 'zoom_pulse' | 'none';
    intensity: number;  // 0-1
    duration_ms: number;
  };
}

// ----------------------------------------------------------------------------
// 3. 聴覚シンクロ・マネージャー（SE/BGMミリ秒同期）
// ----------------------------------------------------------------------------

export interface AudioSyncEvent {
  id: string;
  type: 'se' | 'bgm_change' | 'bgm_duck' | 'bgm_restore' | 'bgm_crossfade';
  timing_ms: number;
  
  /** SE設定 */
  se?: {
    name: string;
    volume: number;       // 0-1
    pitch_shift?: number; // -12 to +12 semitones
    pan?: number;         // -1 (left) to 1 (right)
  };
  
  /** BGM設定 */
  bgm?: {
    track: 'intro' | 'main' | 'climax' | 'outro';
    volume: number;
    fade_duration_ms: number;
    crossfade_overlap_ms?: number;
  };
  
  /** 連動ビジュアル効果 */
  visual_sync?: {
    type: 'shake' | 'flash' | 'zoom' | 'none';
    intensity: number;
    delay_ms?: number;  // SEから何ms後に発火
  };
}

export interface AudioMixerConfig {
  master_volume: number;
  narration_volume: number;
  bgm_base_volume: number;
  bgm_duck_volume: number;      // ナレーション中のBGM音量
  se_volume: number;
  
  /** 自動ダッキング設定 */
  auto_ducking: {
    enabled: boolean;
    threshold_db: number;       // ナレーション検出閾値
    attack_ms: number;          // ダッキング開始速度
    release_ms: number;         // ダッキング解除速度
    ratio: number;              // 圧縮比
  };
  
  /** BGMコンテクスト・マッピング */
  context_mapping: {
    intro: { track: string; energy: 'high' | 'medium' | 'low' };
    explanation: { track: string; energy: 'low' };
    emphasis: { track: string; energy: 'medium' };
    conclusion: { track: string; energy: 'high' };
    cta: { track: string; energy: 'medium' };
  };
}

// ----------------------------------------------------------------------------
// 4. ハッシュ値完全ユニーク化（AI検知回避）
// ----------------------------------------------------------------------------

export interface UniqueFingerprint {
  /** シード値（channel_id + render_id） */
  seed: string;
  
  /** カラージッター設定 */
  color_jitter: {
    enabled: boolean;
    contrast_range: [number, number];    // [0.98, 1.02]
    saturation_range: [number, number];  // [0.97, 1.03]
    brightness_range: [number, number];  // [0.99, 1.01]
    hue_shift_range: [number, number];   // [-2, 2] degrees
  };
  
  /** カメラシミュレーション */
  camera_simulation: {
    enabled: boolean;
    micro_shake: {
      intensity: number;  // 0-5 pixels
      frequency: number;  // Hz
    };
    lens_distortion: number;  // 0-0.02
    chromatic_aberration: number;  // 0-0.005
  };
  
  /** パーティクル・ノイズ */
  ambient_noise: {
    dust_particles: {
      enabled: boolean;
      density: number;  // 0-100
      size_range: [number, number];
      speed_range: [number, number];
    };
    film_grain: {
      enabled: boolean;
      intensity: number;  // 0-0.1
    };
  };
  
  /** フレーム単位のランダム変動 */
  per_frame_variation: {
    enabled: boolean;
    variation_seed_multiplier: number;
  };
}

// ----------------------------------------------------------------------------
// 5. レスポンシブ・パブリッシング（動画/印刷共用）
// ----------------------------------------------------------------------------

export interface ResponsiveLayout {
  /** 出力ターゲット */
  target: 'video_landscape' | 'video_portrait' | 'video_square' | 'print_a4' | 'print_a5' | 'print_b5';
  
  /** 解像度 */
  dimensions: {
    width: number;
    height: number;
    dpi?: number;  // 印刷用
  };
  
  /** 余白（CSS変数として適用） */
  margins: {
    safe_area_percent: number;
    caption_area_height_percent: number;
    header_height_percent?: number;  // 印刷用
    footer_height_percent?: number;
  };
  
  /** タイポグラフィスケール */
  typography_scale: {
    title: number;      // px
    heading: number;
    body: number;
    caption: number;
    small: number;
  };
  
  /** グリッド設定 */
  grid: {
    columns: number;
    gutter: number;
    baseline: number;  // 印刷用
  };
  
  /** アニメーション有効/無効 */
  animations_enabled: boolean;
}

export const RESPONSIVE_PRESETS: Record<string, ResponsiveLayout> = {
  video_landscape: {
    target: 'video_landscape',
    dimensions: { width: 1920, height: 1080 },
    margins: { safe_area_percent: 5, caption_area_height_percent: 18 },
    typography_scale: { title: 72, heading: 48, body: 32, caption: 42, small: 24 },
    grid: { columns: 12, gutter: 24, baseline: 8 },
    animations_enabled: true,
  },
  video_portrait: {
    target: 'video_portrait',
    dimensions: { width: 1080, height: 1920 },
    margins: { safe_area_percent: 5, caption_area_height_percent: 15 },
    typography_scale: { title: 64, heading: 42, body: 28, caption: 36, small: 20 },
    grid: { columns: 6, gutter: 16, baseline: 8 },
    animations_enabled: true,
  },
  video_square: {
    target: 'video_square',
    dimensions: { width: 1080, height: 1080 },
    margins: { safe_area_percent: 6, caption_area_height_percent: 20 },
    typography_scale: { title: 56, heading: 40, body: 26, caption: 34, small: 18 },
    grid: { columns: 8, gutter: 20, baseline: 8 },
    animations_enabled: true,
  },
  print_a4: {
    target: 'print_a4',
    dimensions: { width: 2480, height: 3508, dpi: 300 },
    margins: { safe_area_percent: 8, caption_area_height_percent: 0, header_height_percent: 5, footer_height_percent: 5 },
    typography_scale: { title: 48, heading: 32, body: 16, caption: 14, small: 12 },
    grid: { columns: 12, gutter: 20, baseline: 12 },
    animations_enabled: false,
  },
  print_a5: {
    target: 'print_a5',
    dimensions: { width: 1748, height: 2480, dpi: 300 },
    margins: { safe_area_percent: 10, caption_area_height_percent: 0, header_height_percent: 6, footer_height_percent: 6 },
    typography_scale: { title: 36, heading: 24, body: 14, caption: 12, small: 10 },
    grid: { columns: 8, gutter: 16, baseline: 10 },
    animations_enabled: false,
  },
};

// ----------------------------------------------------------------------------
// 6. 演出学習パラメータ（A/Bテスト・進化用）
// ----------------------------------------------------------------------------

export interface PerformanceParams {
  /** 物理演算設定 */
  spring: {
    stiffness: number;   // 100-500
    damping: number;     // 10-50
    mass: number;        // 0.5-2
  };
  
  /** タイミング設定 */
  timing: {
    scene_transition_ms: number;      // 300-1000
    caption_fade_ms: number;          // 200-500
    annotation_enter_ms: number;      // 150-400
    se_anticipation_ms: number;       // 0-100 (SE先行発火)
    pause_after_emphasis_ms: number;  // 300-1500
  };
  
  /** 視覚強度 */
  visual_intensity: {
    shake_magnitude: number;    // 0-20 pixels
    flash_opacity: number;      // 0-0.5
    zoom_pulse_scale: number;   // 1.0-1.1
    glow_radius: number;        // 0-30 pixels
  };
  
  /** 音響バランス */
  audio_balance: {
    se_volume_relative: number;       // 0.5-1.5
    bgm_duck_depth: number;           // 0.1-0.5
    narration_pace_multiplier: number; // 0.9-1.1
  };
}

export interface EvolutionaryRecord {
  params: PerformanceParams;
  metrics: {
    ctr: number;              // クリック率
    retention_rate: number;   // 視聴維持率
    avg_view_duration: number;
    engagement_score: number; // いいね+コメント率
  };
  channel_id: string;
  video_id: string;
  recorded_at: string;
}

// ----------------------------------------------------------------------------
// 7. インフィニティ・ループ・ショート設定
// ----------------------------------------------------------------------------

export interface LoopConfig {
  enabled: boolean;
  
  /** オーディオ・ループ設定 */
  audio: {
    crossfade_duration_ms: number;  // 末尾→先頭のクロスフェード
    bgm_loop_point_ms: number;      // BGMのループポイント
    narration_seamless: boolean;    // ナレーションもシームレス化
  };
  
  /** ビジュアル・ループ設定 */
  visual: {
    first_frame_match: boolean;     // 最終フレーム≒最初フレーム
    transition_type: 'fade' | 'zoom' | 'none';
    transition_duration_ms: number;
  };
  
  /** 脚本設定 */
  script: {
    ending_hook_required: boolean;  // 「続きは？」で終わる
    opening_callback: boolean;      // 冒頭が結末を受ける
  };
}

// ----------------------------------------------------------------------------
// 8. 統合：究極の Remotion Props 構造
// ----------------------------------------------------------------------------

export interface UltimateRemotionProps {
  /** 基本情報 */
  meta: {
    render_id: string;
    channel_id: string;
    video_type: 'short' | 'long';
    language: string;
    created_at: string;
  };
  
  /** コンテンツ */
  content: {
    title: string;
    description: string;
    script: string;
    scenes: UltimateScene[];
  };
  
  /** オーディオ */
  audio: {
    narration_url?: string;
    narration_timestamps?: Array<{
      word: string;
      start_ms: number;
      end_ms: number;
    }>;
    bgm_config: AudioMixerConfig;
    se_events: AudioSyncEvent[];
  };
  
  /** アノテーション */
  annotations: DynamicAnnotation[];
  
  /** ユニーク化 */
  fingerprint: UniqueFingerprint;
  
  /** レスポンシブ設定 */
  layout: ResponsiveLayout;
  
  /** 演出パラメータ */
  performance: PerformanceParams;
  
  /** ループ設定（Shorts用） */
  loop?: LoopConfig;
  
  /** スタイル */
  style: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
      highlight: string;
    };
    fonts: {
      title: string;
      body: string;
      caption: string;
    };
  };
}

export interface UltimateScene {
  id: string;
  type: 'intro' | 'main' | 'transition' | 'emphasis' | 'conclusion' | 'cta' | 'outro';
  duration_ms: number;
  topic_id?: string;  // atomic_data 紐付け
  
  /** レイヤー */
  layers: {
    background: {
      type: 'solid' | 'gradient' | 'image' | 'video';
      config: any;
    };
    visual: {
      type: 'image' | 'multi_image' | 'diagram' | 'text_card' | 'comparison';
      config: any;
    };
    annotations: DynamicAnnotation[];
    captions: {
      text: string;
      highlight_words: string[];
      position: 'top' | 'center' | 'bottom';
      style: any;
    }[];
    overlay: {
      vignette?: { intensity: number };
      particles?: { type: string; density: number };
      frame?: { style: string };
    };
  };
  
  /** オーディオイベント */
  audio_events: AudioSyncEvent[];
  
  /** トランジション */
  transition_in?: {
    type: 'fade' | 'slide' | 'zoom' | 'wipe';
    duration_ms: number;
    easing: string;
  };
  transition_out?: {
    type: 'fade' | 'slide' | 'zoom' | 'wipe';
    duration_ms: number;
    easing: string;
  };
}

// ----------------------------------------------------------------------------
// 9. デフォルト・パフォーマンス・パラメータ（桜井スタイル最適化済み）
// ----------------------------------------------------------------------------

export const DEFAULT_PERFORMANCE_PARAMS: PerformanceParams = {
  spring: {
    stiffness: 260,
    damping: 20,
    mass: 1,
  },
  timing: {
    scene_transition_ms: 400,
    caption_fade_ms: 250,
    annotation_enter_ms: 200,
    se_anticipation_ms: 50,
    pause_after_emphasis_ms: 600,
  },
  visual_intensity: {
    shake_magnitude: 8,
    flash_opacity: 0.15,
    zoom_pulse_scale: 1.03,
    glow_radius: 15,
  },
  audio_balance: {
    se_volume_relative: 1.0,
    bgm_duck_depth: 0.25,
    narration_pace_multiplier: 1.0,
  },
};

export const DEFAULT_FINGERPRINT: UniqueFingerprint = {
  seed: '',
  color_jitter: {
    enabled: true,
    contrast_range: [0.98, 1.02],
    saturation_range: [0.97, 1.03],
    brightness_range: [0.99, 1.01],
    hue_shift_range: [-2, 2],
  },
  camera_simulation: {
    enabled: true,
    micro_shake: { intensity: 2, frequency: 0.5 },
    lens_distortion: 0.005,
    chromatic_aberration: 0.002,
  },
  ambient_noise: {
    dust_particles: {
      enabled: true,
      density: 30,
      size_range: [1, 4],
      speed_range: [0.5, 2],
    },
    film_grain: {
      enabled: true,
      intensity: 0.03,
    },
  },
  per_frame_variation: {
    enabled: true,
    variation_seed_multiplier: 1.618,
  },
};

export const DEFAULT_LOOP_CONFIG: LoopConfig = {
  enabled: true,
  audio: {
    crossfade_duration_ms: 500,
    bgm_loop_point_ms: 0,
    narration_seamless: false,
  },
  visual: {
    first_frame_match: true,
    transition_type: 'fade',
    transition_duration_ms: 300,
  },
  script: {
    ending_hook_required: true,
    opening_callback: true,
  },
};

// ----------------------------------------------------------------------------
// 10. メタデータ・エクスポート関数（レンダリング完了時に実行）
// ----------------------------------------------------------------------------

export function generateRenderMetadata(
  props: UltimateRemotionProps,
  actualDurationMs: number
): RenderExportMetadata {
  const scenes: SceneMetadata[] = [];
  let currentTime = 0;
  
  for (const scene of props.content.scenes) {
    scenes.push({
      scene_id: scene.id,
      section_type: scene.type as any,
      topic_id: scene.topic_id,
      start_time_ms: currentTime,
      end_time_ms: currentTime + scene.duration_ms,
      duration_ms: scene.duration_ms,
      narration_text: scene.layers.captions[0]?.text || '',
      keywords: scene.layers.captions[0]?.highlight_words || [],
      annotations_count: scene.layers.annotations.length,
      se_triggers_count: scene.audio_events.filter(e => e.type === 'se').length,
    });
    currentTime += scene.duration_ms;
  }
  
  return {
    render_id: props.meta.render_id,
    video_type: props.meta.video_type,
    total_duration_ms: actualDurationMs,
    composition_id: props.meta.video_type === 'short' ? 'ShortVideo' : 'LongVideo',
    scenes,
    audio_tracks: {
      narration_url: props.audio.narration_url,
      bgm_tracks: Object.values(props.audio.bgm_config.context_mapping).map(c => c.track),
      se_used: [...new Set(props.audio.se_events.filter(e => e.se).map(e => e.se!.name))],
    },
    performance_params: {
      spring_stiffness: props.performance.spring.stiffness,
      spring_damping: props.performance.spring.damping,
      se_sync_tolerance_ms: 50,
      color_jitter_seed: parseInt(props.fingerprint.seed.slice(-8), 16) || 0,
    },
    generated_at: new Date().toISOString(),
  };
}
