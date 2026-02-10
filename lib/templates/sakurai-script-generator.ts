// ============================================================================
// N3 Empire OS: Sakurai Style 脚本生成プロンプト
// Gemini用 - SE/BGM/演出タグを自動挿入する脚本生成
// ============================================================================

import {
  SakuraiStyleScript,
  SakuraiScene,
  DEFAULT_SAKURAI_STYLE,
  DEFAULT_SE_LIBRARY,
} from './sakurai-style-types';

// ----------------------------------------------------------------------------
// Geminiプロンプト: 桜井スタイル脚本生成
// ----------------------------------------------------------------------------

export const GEMINI_SAKURAI_SCRIPT_PROMPT = `
あなたは「桜井政博のゲーム作るには」チャンネルの演出スタイルを完璧に理解した脚本家です。
以下の商品/トピック情報を元に、YouTubeショート動画（60秒）または解説動画（5-10分）の脚本を作成してください。

【桜井スタイルの特徴】
1. **明快な構成**: 導入→本題→まとめ の3部構成
2. **視聴者への語りかけ**: 「〜ですね」「〜なんです」など親しみやすい口調
3. **具体例と図解**: 抽象的な説明を避け、具体的な事例で解説
4. **適度な間（ま）**: 重要ポイントの後に0.5-1秒の溜めを入れる
5. **強調と繰り返し**: キーワードは強調して印象づける

【出力形式】
以下のJSON形式で脚本を生成してください。演出タグは必ず含めてください。

\`\`\`json
{
  "meta": {
    "title": "動画タイトル",
    "genre": "education | product | news | tutorial",
    "duration_target_seconds": 60,
    "language": "ja"
  },
  "sections": [
    {
      "id": "intro",
      "type": "intro",
      "title": "導入",
      "scenes": [
        {
          "id": "scene_001",
          "duration_seconds": 5,
          "narration": {
            "text": "ナレーションテキスト [SE:pop] 強調したい部分 [PAUSE:0.5]",
            "emotion": "friendly",
            "speed": 1.0,
            "pause_after_ms": 500
          },
          "visual_description": "画面に表示する内容の説明",
          "caption": {
            "text": "テロップテキスト",
            "highlight_words": ["強調したい", "単語"]
          },
          "pointer": {
            "type": "stick | box | circle",
            "target_description": "指し示す対象"
          }
        }
      ]
    }
  ],
  "bgm_cues": [
    { "timing": "intro", "track": "upbeat_intro" },
    { "timing": "main", "track": "calm_explanation" },
    { "timing": "outro", "track": "energetic_outro" }
  ]
}
\`\`\`

【演出タグ一覧】
- [SE:pop] - 要素出現時のポップ音
- [SE:whoosh] - スライドイン時のシュッ音
- [SE:impact] - 重要ポイント強調
- [SE:ding] - 正解/ポイント音
- [SE:shutter] - 画像切替音
- [SE:sparkle] - キラキラ演出音
- [SE:success] - 成功/完了音
- [SE:warning] - 注意喚起音
- [SE:pointer_appear] - ポインター出現音
- [SE:chapter_start] - チャプター開始音
- [PAUSE:0.5] - 0.5秒の間
- [PAUSE:1.0] - 1秒の間
- [BGM:duck] - BGM音量下げ
- [BGM:restore] - BGM音量戻す
- [EMPHASIS] テキスト [/EMPHASIS] - 強調表現

【重要な指示】
1. 各シーンは3-7秒程度に収める
2. ナレーションは1シーン1メッセージ
3. 重要なポイントの後には必ず [PAUSE:0.5] を入れる
4. 画像切替時には [SE:shutter] を使用
5. テロップの highlight_words は必ず3語以内
6. ポインターは説明対象を明確に指し示す場面でのみ使用

---

【入力情報】
`;

// ----------------------------------------------------------------------------
// 脚本からSakuraiStyleScriptへの変換
// ----------------------------------------------------------------------------

export function parseGeminiScriptToSakurai(
  geminiOutput: any,
  productData?: any
): SakuraiStyleScript {
  const meta = geminiOutput.meta || {};
  const sections = geminiOutput.sections || [];
  
  return {
    meta: {
      title: meta.title || productData?.title || 'N3 動画',
      genre: meta.genre || 'product',
      duration_target_seconds: meta.duration_target_seconds || 60,
      language: meta.language || 'ja',
      created_at: new Date().toISOString(),
    },
    bgm: {
      intro: '/audio/bgm/intro.mp3',
      main: '/audio/bgm/main.mp3',
      outro: '/audio/bgm/outro.mp3',
      volume_default: 0.3,
      ducking_level: 0.1,
    },
    se_library: DEFAULT_SE_LIBRARY,
    sections: sections.map(convertSection),
    global_style: DEFAULT_SAKURAI_STYLE,
  };
}

function convertSection(section: any): any {
  return {
    id: section.id || `section_${Date.now()}`,
    type: section.type || 'main',
    title: section.title,
    scenes: (section.scenes || []).map(convertScene),
  };
}

function convertScene(scene: any): SakuraiScene {
  const narration = scene.narration || {};
  const caption = scene.caption || {};
  const pointer = scene.pointer;
  
  // ナレーションテキストからSE/PAUSEタグをパース
  const { cleanText, audioTriggers, visualTriggers } = parseNarrationTags(
    narration.text || '',
    scene.duration_seconds || 5
  );
  
  return {
    id: scene.id || `scene_${Date.now()}`,
    duration_seconds: scene.duration_seconds || 5,
    layers: {
      background: {
        type: 'gradient',
        gradient: {
          type: 'linear',
          colors: ['#0f0f23', '#1a1a2e', '#16213e'],
          angle: 135,
        },
      },
      visual: scene.visual_description ? {
        type: 'text_card',
        text_card: {
          title: '',
          body: scene.visual_description,
          style: 'info',
        },
      } : {
        type: 'image',
        image: {
          url: '/placeholder.png',
          position: { x: 50, y: 45 },
          size: { width: 50, height: 60 },
        },
      },
      annotation: {
        captions: caption.text ? [{
          text: cleanText.substring(0, 50) || caption.text,
          start_ms: 0,
          duration_ms: (scene.duration_seconds || 5) * 1000,
          position: 'bottom',
          style: {
            font_size: 'large',
            font_weight: 'bold',
            color: '#ffffff',
            highlight_words: caption.highlight_words || [],
          },
          animation: {
            type: 'fade',
            highlight_effect: 'glow',
          },
        }] : [],
        pointers: pointer ? [{
          type: pointer.type || 'stick',
          target: { x: 60, y: 40, width: 20, height: 20 },
          start_ms: 500,
          duration_ms: (scene.duration_seconds || 5) * 1000 - 500,
          style: {
            color: '#e94560',
            thickness: 4,
            animated: true,
          },
          label: pointer.target_description,
        }] : [],
        progress_bar: {
          show: true,
          position: 'top',
        },
      },
      overlay: {
        vignette: { intensity: 0.3 },
        frame: { style: 'sakurai' },
      },
    },
    narration: {
      text: cleanText,
      emotion: narration.emotion || 'neutral',
      speed: narration.speed || 1.0,
      pause_after_ms: narration.pause_after_ms || 0,
    },
    audio_triggers: audioTriggers,
    visual_triggers: visualTriggers,
  };
}

// ----------------------------------------------------------------------------
// ナレーションタグのパース
// ----------------------------------------------------------------------------

interface ParsedNarration {
  cleanText: string;
  audioTriggers: any[];
  visualTriggers: any[];
}

function parseNarrationTags(text: string, durationSeconds: number): ParsedNarration {
  const audioTriggers: any[] = [];
  const visualTriggers: any[] = [];
  
  let cleanText = text;
  let currentPosition = 0;
  
  // SE タグをパース: [SE:name]
  const seRegex = /\[SE:(\w+)\]/g;
  let match;
  while ((match = seRegex.exec(text)) !== null) {
    const seName = match[1];
    const position = match.index;
    const timingMs = Math.floor((position / text.length) * durationSeconds * 1000);
    
    audioTriggers.push({
      type: 'se',
      timing_ms: timingMs,
      se_name: seName,
    });
    
    // 特定のSEに連動する視覚演出
    if (seName === 'impact') {
      visualTriggers.push({
        type: 'shake',
        timing_ms: timingMs,
        duration_ms: 200,
        intensity: 0.5,
        target: 'screen',
      });
    } else if (seName === 'sparkle') {
      visualTriggers.push({
        type: 'flash',
        timing_ms: timingMs,
        duration_ms: 150,
        intensity: 0.3,
        target: 'visual',
      });
    }
  }
  cleanText = cleanText.replace(seRegex, '');
  
  // PAUSE タグをパース: [PAUSE:0.5]
  const pauseRegex = /\[PAUSE:([\d.]+)\]/g;
  while ((match = pauseRegex.exec(text)) !== null) {
    // PAUSEは音声生成側で処理するため、ここではタグを残す
  }
  // クリーンテキストからは削除しない（ElevenLabsで使用）
  
  // BGM タグをパース: [BGM:duck], [BGM:restore]
  const bgmRegex = /\[BGM:(\w+)\]/g;
  while ((match = bgmRegex.exec(text)) !== null) {
    const action = match[1];
    const position = match.index;
    const timingMs = Math.floor((position / text.length) * durationSeconds * 1000);
    
    if (action === 'duck') {
      audioTriggers.push({
        type: 'bgm_duck',
        timing_ms: timingMs,
        duck_level: 0.1,
        duck_duration_ms: 2000,
      });
    } else if (action === 'restore') {
      audioTriggers.push({
        type: 'bgm_restore',
        timing_ms: timingMs,
      });
    }
  }
  cleanText = cleanText.replace(bgmRegex, '');
  
  // EMPHASIS タグをパース（テロップ用にマークを残す）
  cleanText = cleanText.replace(/\[EMPHASIS\]/g, '').replace(/\[\/EMPHASIS\]/g, '');
  
  // 余分な空白を整理
  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  
  return { cleanText, audioTriggers, visualTriggers };
}

// ----------------------------------------------------------------------------
// ElevenLabs用テキスト変換（ポーズタグ変換）
// ----------------------------------------------------------------------------

export function convertToElevenLabsText(text: string): string {
  let result = text;
  
  // [PAUSE:X] を ElevenLabsの <break time="Xs"/> に変換
  result = result.replace(/\[PAUSE:([\d.]+)\]/g, '<break time="$1s"/>');
  
  // その他のタグを削除
  result = result.replace(/\[SE:\w+\]/g, '');
  result = result.replace(/\[BGM:\w+\]/g, '');
  result = result.replace(/\[EMPHASIS\]/g, '');
  result = result.replace(/\[\/EMPHASIS\]/g, '');
  
  return result.trim();
}

// ----------------------------------------------------------------------------
// サンプル出力
// ----------------------------------------------------------------------------

export const SAMPLE_SAKURAI_SCRIPT: SakuraiStyleScript = {
  meta: {
    title: '【解説】日本製の品質の秘密',
    genre: 'product',
    duration_target_seconds: 60,
    language: 'ja',
    created_at: new Date().toISOString(),
  },
  bgm: {
    intro: '/audio/bgm/intro.mp3',
    main: '/audio/bgm/main.mp3',
    outro: '/audio/bgm/outro.mp3',
    volume_default: 0.3,
    ducking_level: 0.1,
  },
  se_library: DEFAULT_SE_LIBRARY,
  sections: [
    {
      id: 'intro',
      type: 'intro',
      title: '導入',
      scenes: [
        {
          id: 'scene_001',
          duration_seconds: 5,
          layers: {
            background: {
              type: 'gradient',
              gradient: {
                type: 'linear',
                colors: ['#0f0f23', '#1a1a2e'],
                angle: 135,
              },
            },
            visual: {
              type: 'text_card',
              text_card: {
                title: '日本製の品質',
                body: 'なぜ世界中で愛されるのか？',
                style: 'highlight',
              },
            },
            annotation: {
              captions: [{
                text: '日本製の品質の秘密',
                start_ms: 0,
                duration_ms: 5000,
                position: 'bottom',
                style: {
                  font_size: 'xlarge',
                  font_weight: 'bold',
                  color: '#ffffff',
                  highlight_words: ['品質', '秘密'],
                },
                animation: {
                  type: 'pop',
                  highlight_effect: 'glow',
                },
              }],
              pointers: [],
            },
          },
          narration: {
            text: '日本製の品質には、ある秘密があります。',
            emotion: 'friendly',
            speed: 1.0,
            pause_after_ms: 500,
          },
          audio_triggers: [
            { type: 'se', timing_ms: 0, se_name: 'chapter_start' },
            { type: 'se', timing_ms: 500, se_name: 'pop' },
          ],
          visual_triggers: [],
        },
      ],
    },
  ],
  global_style: DEFAULT_SAKURAI_STYLE,
};
