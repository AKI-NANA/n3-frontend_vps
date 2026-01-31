// ============================================================================
// N3 Empire OS: 究極の Remotion 金型 V2 - React コンポーネント
// 桜井スタイル完全再現 + 物理演算 + SE同期 + AI検知回避
// ============================================================================
// このファイルは Remotion プロジェクトにコピーして使用してください

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  random,
} from 'remotion';

import type {
  UltimateRemotionProps,
  UltimateScene,
  DynamicAnnotation,
  AudioSyncEvent,
  UniqueFingerprint,
  PerformanceParams,
} from './remotion-ultimate-v2-types';

// ============================================================================
// 1. メイン・コンポジション
// ============================================================================

export const UltimateVideoComposition: React.FC<UltimateRemotionProps> = (props) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  
  // フレーム単位のユニーク化シード
  const frameSeed = useMemo(() => {
    return `${props.fingerprint.seed}-${frame}`;
  }, [props.fingerprint.seed, frame]);
  
  // シーンの累積時間を計算
  const sceneTimings = useMemo(() => {
    let accumulated = 0;
    return props.content.scenes.map((scene) => {
      const start = accumulated;
      accumulated += scene.duration_ms;
      return { start, end: accumulated };
    });
  }, [props.content.scenes]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: props.style.colors.background }}>
      {/* 背景レイヤー */}
      <BackgroundLayer
        scenes={props.content.scenes}
        sceneTimings={sceneTimings}
        fps={fps}
      />
      
      {/* シーン別コンテンツ */}
      {props.content.scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={Math.floor((sceneTimings[index].start / 1000) * fps)}
          durationInFrames={Math.ceil((scene.duration_ms / 1000) * fps)}
        >
          <SceneRenderer
            scene={scene}
            props={props}
            sceneIndex={index}
          />
        </Sequence>
      ))}
      
      {/* グローバル・アノテーション・レイヤー */}
      <AnnotationLayer
        annotations={props.annotations}
        performance={props.performance}
        fps={fps}
      />
      
      {/* オーディオ・レイヤー */}
      <AudioLayer
        audio={props.audio}
        seEvents={props.audio.se_events}
        fps={fps}
      />
      
      {/* ユニーク化フィルター・レイヤー（最上位） */}
      <UniquenessFilter
        fingerprint={props.fingerprint}
        frameSeed={frameSeed}
      />
      
      {/* ループ用エンディング処理（Shorts） */}
      {props.loop?.enabled && (
        <LoopTransition
          config={props.loop}
          totalDuration={sceneTimings[sceneTimings.length - 1]?.end || 0}
          fps={fps}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 2. シーン・レンダラー
// ============================================================================

const SceneRenderer: React.FC<{
  scene: UltimateScene;
  props: UltimateRemotionProps;
  sceneIndex: number;
}> = ({ scene, props, sceneIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // トランジション計算
  const transitionProgress = useMemo(() => {
    const inDuration = scene.transition_in?.duration_ms || 300;
    const outDuration = scene.transition_out?.duration_ms || 300;
    const sceneDurationFrames = Math.ceil((scene.duration_ms / 1000) * fps);
    
    const inProgress = interpolate(
      frame,
      [0, Math.ceil((inDuration / 1000) * fps)],
      [0, 1],
      { extrapolateRight: 'clamp' }
    );
    
    const outProgress = interpolate(
      frame,
      [sceneDurationFrames - Math.ceil((outDuration / 1000) * fps), sceneDurationFrames],
      [1, 0],
      { extrapolateLeft: 'clamp' }
    );
    
    return Math.min(inProgress, outProgress);
  }, [frame, fps, scene]);
  
  return (
    <AbsoluteFill style={{ opacity: transitionProgress }}>
      {/* ビジュアル・レイヤー */}
      <VisualLayer
        visual={scene.layers.visual}
        style={props.style}
        performance={props.performance}
      />
      
      {/* シーン固有アノテーション */}
      <AnnotationLayer
        annotations={scene.layers.annotations}
        performance={props.performance}
        fps={fps}
      />
      
      {/* テロップ・レイヤー */}
      <CaptionLayer
        captions={scene.layers.captions}
        style={props.style}
        layout={props.layout}
        performance={props.performance}
      />
      
      {/* オーバーレイ */}
      <OverlayLayer overlay={scene.layers.overlay} />
      
      {/* シーン固有SE/視覚効果 */}
      {scene.audio_events.map((event, idx) => (
        <AudioEventHandler
          key={`${scene.id}-audio-${idx}`}
          event={event}
          performance={props.performance}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};

// ============================================================================
// 3. 背景レイヤー
// ============================================================================

const BackgroundLayer: React.FC<{
  scenes: UltimateScene[];
  sceneTimings: Array<{ start: number; end: number }>;
  fps: number;
}> = ({ scenes, sceneTimings, fps }) => {
  const frame = useCurrentFrame();
  const currentTimeMs = (frame / fps) * 1000;
  
  // 現在のシーンを特定
  const currentSceneIndex = sceneTimings.findIndex(
    (timing) => currentTimeMs >= timing.start && currentTimeMs < timing.end
  );
  const currentScene = scenes[currentSceneIndex] || scenes[0];
  const bg = currentScene?.layers.background;
  
  if (!bg) return null;
  
  let bgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  };
  
  switch (bg.type) {
    case 'solid':
      bgStyle.backgroundColor = bg.config?.color || '#0f0f23';
      break;
    case 'gradient':
      const colors = bg.config?.colors || ['#0f0f23', '#1a1a2e'];
      const angle = bg.config?.angle || 135;
      bgStyle.background = `linear-gradient(${angle}deg, ${colors.join(', ')})`;
      break;
    case 'image':
      bgStyle.backgroundImage = `url(${bg.config?.url})`;
      bgStyle.backgroundSize = 'cover';
      bgStyle.backgroundPosition = 'center';
      if (bg.config?.blur) {
        bgStyle.filter = `blur(${bg.config.blur}px)`;
      }
      break;
  }
  
  return <div style={bgStyle} />;
};

// ============================================================================
// 4. ビジュアル・レイヤー
// ============================================================================

const VisualLayer: React.FC<{
  visual: UltimateScene['layers']['visual'];
  style: UltimateRemotionProps['style'];
  performance: PerformanceParams;
}> = ({ visual, style, performance }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Spring アニメーション
  const springProgress = spring({
    frame,
    fps,
    config: {
      stiffness: performance.spring.stiffness,
      damping: performance.spring.damping,
      mass: performance.spring.mass,
    },
  });
  
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '80%',
    height: '70%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: `scale(${interpolate(springProgress, [0, 1], [0.8, 1])})`,
    opacity: springProgress,
  };
  
  if (!visual) return null;
  
  switch (visual.type) {
    case 'image':
      return (
        <div style={containerStyle}>
          <Img
            src={visual.config?.url || ''}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              borderRadius: 12,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              border: `4px solid ${style.colors.accent}`,
            }}
          />
        </div>
      );
      
    case 'text_card':
      return (
        <div style={containerStyle}>
          <div
            style={{
              background: `linear-gradient(135deg, ${style.colors.accent}20, ${style.colors.primary}e0)`,
              borderLeft: `4px solid ${style.colors.accent}`,
              borderRadius: '0 16px 16px 0',
              padding: 40,
              maxWidth: '80%',
            }}
          >
            {visual.config?.title && (
              <h2
                style={{
                  fontFamily: style.fonts.title,
                  fontSize: 48,
                  fontWeight: 900,
                  color: style.colors.highlight,
                  marginBottom: 20,
                }}
              >
                {visual.config.title}
              </h2>
            )}
            <p
              style={{
                fontFamily: style.fonts.body,
                fontSize: 32,
                lineHeight: 1.6,
                color: style.colors.text,
              }}
            >
              {visual.config?.body || ''}
            </p>
          </div>
        </div>
      );
      
    case 'multi_image':
      return (
        <div style={{ ...containerStyle, flexWrap: 'wrap', gap: 20 }}>
          {(visual.config?.images || []).map((img: any, idx: number) => (
            <div key={idx} style={{ flex: '1 1 45%', textAlign: 'center' }}>
              <Img
                src={img.url}
                style={{
                  maxWidth: '100%',
                  maxHeight: 300,
                  borderRadius: 8,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
                }}
              />
              {img.label && (
                <p style={{ marginTop: 10, color: style.colors.text, fontSize: 24 }}>
                  {img.label}
                </p>
              )}
            </div>
          ))}
        </div>
      );
      
    default:
      return null;
  }
};

// ============================================================================
// 5. 動的アノテーション・レイヤー（桜井スタイル・ポインター）
// ============================================================================

const AnnotationLayer: React.FC<{
  annotations: DynamicAnnotation[];
  performance: PerformanceParams;
  fps: number;
}> = ({ annotations, performance, fps }) => {
  const frame = useCurrentFrame();
  
  if (!annotations || annotations.length === 0) return null;
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 100 }}>
      {annotations.map((annotation) => (
        <AnnotationItem
          key={annotation.id}
          annotation={annotation}
          performance={performance}
          fps={fps}
        />
      ))}
    </AbsoluteFill>
  );
};

const AnnotationItem: React.FC<{
  annotation: DynamicAnnotation;
  performance: PerformanceParams;
  fps: number;
}> = ({ annotation, performance, fps }) => {
  const frame = useCurrentFrame();
  const currentTimeMs = (frame / fps) * 1000;
  
  const { timing, target, style: annotationStyle, animation, type, impact_effect } = annotation;
  
  // 表示タイミングチェック
  const isVisible =
    currentTimeMs >= timing.start_ms &&
    currentTimeMs < timing.start_ms + timing.duration_ms;
  
  if (!isVisible) return null;
  
  // アニメーション進捗
  const localFrame = Math.floor(((currentTimeMs - timing.start_ms) / 1000) * fps);
  const enterDurationFrames = Math.ceil((performance.timing.annotation_enter_ms / 1000) * fps);
  
  let progress = 1;
  
  if (animation.enter === 'spring') {
    progress = spring({
      frame: localFrame,
      fps,
      config: {
        stiffness: animation.spring_config?.stiffness || performance.spring.stiffness,
        damping: animation.spring_config?.damping || performance.spring.damping,
        mass: animation.spring_config?.mass || performance.spring.mass,
      },
    });
  } else if (animation.enter === 'fade') {
    progress = interpolate(localFrame, [0, enterDurationFrames], [0, 1], {
      extrapolateRight: 'clamp',
    });
  } else if (animation.enter === 'pop') {
    const rawProgress = interpolate(localFrame, [0, enterDurationFrames], [0, 1], {
      extrapolateRight: 'clamp',
    });
    // オーバーシュート効果
    progress = rawProgress * (1 + Math.sin(rawProgress * Math.PI) * 0.2);
  }
  
  // パルス効果（during: pulse）
  let pulseScale = 1;
  if (animation.during === 'pulse') {
    pulseScale = 1 + Math.sin((localFrame / fps) * Math.PI * 2) * 0.03;
  }
  
  // グロー効果（during: glow）
  let glowStyle: React.CSSProperties = {};
  if (animation.during === 'glow') {
    const glowIntensity = 0.5 + Math.sin((localFrame / fps) * Math.PI * 3) * 0.5;
    glowStyle.boxShadow = `0 0 ${20 * glowIntensity}px ${annotationStyle.color}`;
  }
  
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${target.x}%`,
    top: `${target.y}%`,
    transform: `translate(-50%, -50%) scale(${progress * pulseScale})`,
    opacity: progress,
    ...glowStyle,
  };
  
  // タイプ別レンダリング
  switch (type) {
    case 'circle':
      return (
        <div
          style={{
            ...baseStyle,
            width: (target.width || 15) * 10,
            height: (target.width || 15) * 10,
            border: `${annotationStyle.thickness}px solid ${annotationStyle.color}`,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${annotationStyle.color}80`,
          }}
        />
      );
      
    case 'box':
      return (
        <div
          style={{
            ...baseStyle,
            width: `${target.width || 20}%`,
            height: `${target.height || 15}%`,
            border: `${annotationStyle.thickness}px solid ${annotationStyle.color}`,
            borderRadius: 12,
            boxShadow: `0 0 20px ${annotationStyle.color}80`,
          }}
        />
      );
      
    case 'stick':
      // 桜井スタイルの指し棒
      return (
        <div
          style={{
            ...baseStyle,
            width: 200,
            height: annotationStyle.thickness * 2,
            background: `linear-gradient(90deg, ${annotationStyle.color}, #ffd700)`,
            borderRadius: annotationStyle.thickness,
            transformOrigin: 'left center',
            transform: `translate(0, -50%) rotate(-15deg) scaleX(${progress})`,
          }}
        >
          {/* 矢印の先端 */}
          <div
            style={{
              position: 'absolute',
              right: -20,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 0,
              height: 0,
              borderLeft: '24px solid #ffd700',
              borderTop: '12px solid transparent',
              borderBottom: '12px solid transparent',
            }}
          />
        </div>
      );
      
    case 'arrow':
      return (
        <div
          style={{
            ...baseStyle,
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: `30px solid ${annotationStyle.color}`,
            filter: `drop-shadow(0 0 10px ${annotationStyle.color})`,
          }}
        />
      );
      
    case 'highlight_zone':
      return (
        <div
          style={{
            ...baseStyle,
            width: `${target.width || 30}%`,
            height: `${target.height || 20}%`,
            background: `${annotationStyle.color}30`,
            border: `2px solid ${annotationStyle.color}`,
            borderRadius: 8,
          }}
        />
      );
      
    default:
      return null;
  }
};

// ============================================================================
// 6. テロップ・レイヤー
// ============================================================================

const CaptionLayer: React.FC<{
  captions: UltimateScene['layers']['captions'];
  style: UltimateRemotionProps['style'];
  layout: UltimateRemotionProps['layout'];
  performance: PerformanceParams;
}> = ({ captions, style, layout, performance }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  if (!captions || captions.length === 0) return null;
  
  // フェードイン
  const fadeProgress = interpolate(
    frame,
    [0, Math.ceil((performance.timing.caption_fade_ms / 1000) * fps)],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  return (
    <AbsoluteFill style={{ zIndex: 50 }}>
      {captions.map((caption, idx) => {
        const positionStyle: React.CSSProperties =
          caption.position === 'top'
            ? { top: '10%' }
            : caption.position === 'center'
            ? { top: '50%', transform: 'translateY(-50%)' }
            : { bottom: 0, height: `${layout.margins.caption_area_height_percent}%` };
        
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                caption.position === 'bottom'
                  ? 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
                  : 'transparent',
              padding: `0 ${layout.margins.safe_area_percent}%`,
              opacity: fadeProgress,
              ...positionStyle,
            }}
          >
            <p
              style={{
                fontFamily: style.fonts.caption,
                fontSize: layout.typography_scale.caption,
                fontWeight: 700,
                textAlign: 'center',
                color: style.colors.text,
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                maxWidth: '80%',
              }}
            >
              {highlightText(caption.text, caption.highlight_words, style.colors.highlight)}
            </p>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// テキストハイライト関数
function highlightText(
  text: string,
  highlightWords: string[],
  highlightColor: string
): React.ReactNode {
  if (!highlightWords || highlightWords.length === 0) {
    return text;
  }
  
  const pattern = new RegExp(`(${highlightWords.join('|')})`, 'gi');
  const parts = text.split(pattern);
  
  return parts.map((part, idx) => {
    const isHighlight = highlightWords.some(
      (word) => word.toLowerCase() === part.toLowerCase()
    );
    if (isHighlight) {
      return (
        <span
          key={idx}
          style={{
            color: highlightColor,
            background: `${highlightColor}30`,
            padding: '0 8px',
            borderRadius: 4,
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

// ============================================================================
// 7. オーバーレイ・レイヤー
// ============================================================================

const OverlayLayer: React.FC<{
  overlay: UltimateScene['layers']['overlay'];
}> = ({ overlay }) => {
  if (!overlay) return null;
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: 200 }}>
      {/* ビネット */}
      {overlay.vignette && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,${overlay.vignette.intensity}) 100%)`,
          }}
        />
      )}
      
      {/* フレーム */}
      {overlay.frame?.style === 'sakurai' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: '8px solid rgba(233, 69, 96, 0.3)',
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// 8. オーディオ・レイヤー
// ============================================================================

const AudioLayer: React.FC<{
  audio: UltimateRemotionProps['audio'];
  seEvents: AudioSyncEvent[];
  fps: number;
}> = ({ audio, seEvents, fps }) => {
  return (
    <>
      {/* ナレーション */}
      {audio.narration_url && (
        <Audio src={audio.narration_url} volume={audio.bgm_config.narration_volume} />
      )}
      
      {/* SE（タイミング制御） */}
      {seEvents
        .filter((e) => e.type === 'se' && e.se)
        .map((event, idx) => (
          <Sequence
            key={`se-${idx}`}
            from={Math.floor((event.timing_ms / 1000) * fps)}
            durationInFrames={fps * 2} // SE長さは2秒想定
          >
            <Audio
              src={`/audio/se/${event.se!.name}.mp3`}
              volume={event.se!.volume * audio.bgm_config.se_volume}
            />
          </Sequence>
        ))}
    </>
  );
};

// ============================================================================
// 9. オーディオ・イベント・ハンドラー（視覚同期）
// ============================================================================

const AudioEventHandler: React.FC<{
  event: AudioSyncEvent;
  performance: PerformanceParams;
  fps: number;
}> = ({ event, performance, fps }) => {
  const frame = useCurrentFrame();
  const eventFrame = Math.floor((event.timing_ms / 1000) * fps);
  
  if (!event.visual_sync || event.visual_sync.type === 'none') return null;
  
  const effectStartFrame = eventFrame + Math.floor(((event.visual_sync.delay_ms || 0) / 1000) * fps);
  const effectDurationFrames = Math.ceil(0.2 * fps); // 200ms
  
  const isActive = frame >= effectStartFrame && frame < effectStartFrame + effectDurationFrames;
  
  if (!isActive) return null;
  
  const progress = interpolate(
    frame,
    [effectStartFrame, effectStartFrame + effectDurationFrames],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );
  
  switch (event.visual_sync.type) {
    case 'shake':
      const shakeX = Math.sin(progress * Math.PI * 8) * performance.visual_intensity.shake_magnitude * (1 - progress);
      const shakeY = Math.cos(progress * Math.PI * 6) * performance.visual_intensity.shake_magnitude * (1 - progress);
      return (
        <AbsoluteFill
          style={{
            transform: `translate(${shakeX}px, ${shakeY}px)`,
            zIndex: 1000,
          }}
        />
      );
      
    case 'flash':
      const flashOpacity = performance.visual_intensity.flash_opacity * (1 - progress);
      return (
        <AbsoluteFill
          style={{
            backgroundColor: `rgba(255, 255, 255, ${flashOpacity})`,
            zIndex: 1000,
          }}
        />
      );
      
    case 'zoom':
      const zoomScale = 1 + (performance.visual_intensity.zoom_pulse_scale - 1) * (1 - progress);
      return (
        <AbsoluteFill
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'center',
            zIndex: 1000,
          }}
        />
      );
      
    default:
      return null;
  }
};

// ============================================================================
// 10. ユニーク化フィルター（AI検知回避）
// ============================================================================

const UniquenessFilter: React.FC<{
  fingerprint: UniqueFingerprint;
  frameSeed: string;
}> = ({ fingerprint, frameSeed }) => {
  const frame = useCurrentFrame();
  
  if (!fingerprint.color_jitter.enabled && !fingerprint.camera_simulation.enabled) {
    return null;
  }
  
  // シード値からランダム値を生成
  const seedNum = hashString(frameSeed);
  const rand = (min: number, max: number) => min + (seedNum % 1000) / 1000 * (max - min);
  
  // カラージッター
  const contrast = rand(...fingerprint.color_jitter.contrast_range);
  const saturate = rand(...fingerprint.color_jitter.saturation_range);
  const brightness = rand(...fingerprint.color_jitter.brightness_range);
  const hueRotate = rand(...fingerprint.color_jitter.hue_shift_range);
  
  // カメラシミュレーション
  let shakeX = 0, shakeY = 0;
  if (fingerprint.camera_simulation.enabled) {
    const shake = fingerprint.camera_simulation.micro_shake;
    const t = frame / 30; // 30fps想定
    shakeX = Math.sin(t * shake.frequency * Math.PI * 2) * shake.intensity * rand(0.5, 1.5);
    shakeY = Math.cos(t * shake.frequency * Math.PI * 2 * 0.7) * shake.intensity * rand(0.5, 1.5);
  }
  
  return (
    <AbsoluteFill
      style={{
        filter: `contrast(${contrast}) saturate(${saturate}) brightness(${brightness}) hue-rotate(${hueRotate}deg)`,
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

// 簡易ハッシュ関数
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// ============================================================================
// 11. ループ・トランジション（Shorts用）
// ============================================================================

const LoopTransition: React.FC<{
  config: UltimateRemotionProps['loop'];
  totalDuration: number;
  fps: number;
}> = ({ config, totalDuration, fps }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  
  if (!config?.enabled) return null;
  
  const transitionFrames = Math.ceil((config.visual.transition_duration_ms / 1000) * fps);
  
  // 終了間際のフェード
  if (frame > durationInFrames - transitionFrames) {
    const fadeProgress = interpolate(
      frame,
      [durationInFrames - transitionFrames, durationInFrames],
      [0, 1],
      { extrapolateLeft: 'clamp' }
    );
    
    return (
      <AbsoluteFill
        style={{
          backgroundColor: 'black',
          opacity: config.visual.transition_type === 'fade' ? fadeProgress : 0,
          zIndex: 10000,
        }}
      />
    );
  }
  
  return null;
};

// ============================================================================
// エクスポート
// ============================================================================

export default UltimateVideoComposition;
