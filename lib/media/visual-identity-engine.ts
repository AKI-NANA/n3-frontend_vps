// ============================================================================
// N3 Empire OS: フェーズ2 - 視覚的別人化エンジン
// キャラクター生成・ストック素材・音声モジュレーション
// ============================================================================

// ----------------------------------------------------------------------------
// 1. 型定義
// ----------------------------------------------------------------------------

export interface ChannelCharacter {
  channel_id: string;
  character_name: string;
  character_type: 'anime' | 'realistic' | 'cartoon' | '3d' | 'minimal';
  mj_cref_url: string;
  mj_sref_url?: string;
  expression_set: ExpressionSet;
  angle_variants: AngleVariants;
}

export interface ExpressionSet {
  neutral: string;
  happy: string;
  thinking: string;
  pointing_right: string;
  pointing_left: string;
  surprised: string;
  serious: string;
  explaining: string;
  nodding: string;
  questioning: string;
  [key: string]: string;
}

export interface AngleVariants {
  front: Partial<ExpressionSet>;
  quarter_left: Partial<ExpressionSet>;
  quarter_right: Partial<ExpressionSet>;
  profile_left: Partial<ExpressionSet>;
  profile_right: Partial<ExpressionSet>;
}

export interface VoiceProfile {
  channel_id: string;
  elevenlabs_voice_id: string;
  modulation_config: VoiceModulation;
  emotion_adjustments: Record<string, Partial<VoiceModulation>>;
  cost_tier: 'S' | 'A' | 'B';
}

export interface VoiceModulation {
  pitch_shift: number;      // 0.8-1.2
  speaking_rate: number;    // 0.8-1.2
  stability: number;        // 0-1
  similarity_boost: number; // 0-1
  style: number;            // 0-1
  use_speaker_boost: boolean;
}

export interface StockAsset {
  id: number;
  source: 'pexels' | 'pixabay' | 'unsplash';
  source_id: string;
  asset_type: 'video' | 'image';
  original_url: string;
  keywords: string[];
  dominant_colors: string[];
}

export interface EmotionMapping {
  emotion_tag: string;
  expression_key: string;
  angle_preference: string;
  accompanying_se?: string;
  animation_hint?: string;
}

// ----------------------------------------------------------------------------
// 2. キャラクター画像選択エンジン
// ----------------------------------------------------------------------------

export class CharacterImageSelector {
  private character: ChannelCharacter;
  private emotionMappings: Map<string, EmotionMapping>;
  
  constructor(character: ChannelCharacter, mappings: EmotionMapping[]) {
    this.character = character;
    this.emotionMappings = new Map(mappings.map(m => [m.emotion_tag, m]));
  }
  
  /**
   * 脚本タグから最適な画像URLを取得
   */
  getImageForEmotion(emotionTag: string, preferredAngle?: string): CharacterImageResult {
    const mapping = this.emotionMappings.get(emotionTag) || this.emotionMappings.get('[neutral]');
    
    if (!mapping) {
      return {
        url: this.character.expression_set.neutral,
        expression: 'neutral',
        angle: 'front',
        se: undefined,
        animation: undefined,
      };
    }
    
    const expression = mapping.expression_key;
    const angle = preferredAngle || mapping.angle_preference || 'front';
    
    // 角度バリエーションから取得を試みる
    let url = this.character.angle_variants[angle as keyof AngleVariants]?.[expression];
    
    // なければ基本セットから
    if (!url) {
      url = this.character.expression_set[expression] || this.character.expression_set.neutral;
    }
    
    return {
      url,
      expression,
      angle,
      se: mapping.accompanying_se,
      animation: mapping.animation_hint,
    };
  }
  
  /**
   * 脚本テキストから感情タグを自動検出
   */
  static detectEmotionFromText(text: string): string {
    const patterns: Array<{ pattern: RegExp; tag: string }> = [
      { pattern: /重要|ポイント|注目/i, tag: '[emphasis]' },
      { pattern: /なぜ|どうして|疑問/i, tag: '[questioning]' },
      { pattern: /つまり|結論|まとめ/i, tag: '[conclusion]' },
      { pattern: /驚き|すごい|びっくり/i, tag: '[surprised]' },
      { pattern: /考え|思う|検討/i, tag: '[thinking]' },
      { pattern: /嬉しい|良い|素晴らしい/i, tag: '[happy]' },
      { pattern: /注意|危険|気をつけ/i, tag: '[serious]' },
      { pattern: /説明|解説|紹介/i, tag: '[explaining]' },
      { pattern: /そうです|その通り|正解/i, tag: '[nodding]' },
    ];
    
    for (const { pattern, tag } of patterns) {
      if (pattern.test(text)) return tag;
    }
    
    return '[neutral]';
  }
  
  /**
   * シーン全体の画像シーケンスを生成
   */
  generateImageSequence(
    narrationSegments: Array<{ text: string; duration_ms: number; emotion_tag?: string }>
  ): ImageSequenceItem[] {
    const sequence: ImageSequenceItem[] = [];
    let currentTime = 0;
    
    for (const segment of narrationSegments) {
      const emotionTag = segment.emotion_tag || CharacterImageSelector.detectEmotionFromText(segment.text);
      const result = this.getImageForEmotion(emotionTag);
      
      sequence.push({
        start_ms: currentTime,
        end_ms: currentTime + segment.duration_ms,
        ...result,
        narration_text: segment.text,
      });
      
      currentTime += segment.duration_ms;
    }
    
    return sequence;
  }
}

interface CharacterImageResult {
  url: string;
  expression: string;
  angle: string;
  se?: string;
  animation?: string;
}

interface ImageSequenceItem extends CharacterImageResult {
  start_ms: number;
  end_ms: number;
  narration_text: string;
}

// ----------------------------------------------------------------------------
// 3. ストック素材自動選択エンジン（Pexels/Pixabay）
// ----------------------------------------------------------------------------

export class StockAssetSelector {
  private pexelsApiKey: string;
  private pixabayApiKey: string;
  
  constructor(pexelsApiKey: string, pixabayApiKey: string) {
    this.pexelsApiKey = pexelsApiKey;
    this.pixabayApiKey = pixabayApiKey;
  }
  
  /**
   * キーワードから最適な背景素材を検索
   */
  async searchBackgroundAssets(
    keywords: string[],
    options: {
      type?: 'video' | 'image';
      orientation?: 'landscape' | 'portrait' | 'square';
      minWidth?: number;
      limit?: number;
    } = {}
  ): Promise<StockAssetResult[]> {
    const { type = 'video', orientation = 'landscape', minWidth = 1920, limit = 10 } = options;
    
    const results: StockAssetResult[] = [];
    
    // Pexels検索
    const pexelsResults = await this.searchPexels(keywords.join(' '), type, orientation, limit);
    results.push(...pexelsResults);
    
    // Pixabay検索（補完）
    if (results.length < limit) {
      const pixabayResults = await this.searchPixabay(keywords.join('+'), type, orientation, limit - results.length);
      results.push(...pixabayResults);
    }
    
    // 品質スコアでソート
    return results.sort((a, b) => b.quality_score - a.quality_score).slice(0, limit);
  }
  
  /**
   * Pexels API検索
   */
  private async searchPexels(
    query: string,
    type: 'video' | 'image',
    orientation: string,
    limit: number
  ): Promise<StockAssetResult[]> {
    const endpoint = type === 'video' 
      ? 'https://api.pexels.com/videos/search'
      : 'https://api.pexels.com/v1/search';
    
    try {
      const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${limit}`, {
        headers: { Authorization: this.pexelsApiKey },
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      const items = type === 'video' ? data.videos : data.photos;
      
      return (items || []).map((item: any) => ({
        source: 'pexels' as const,
        source_id: String(item.id),
        asset_type: type,
        url: type === 'video' 
          ? item.video_files?.find((f: any) => f.quality === 'hd')?.link || item.video_files?.[0]?.link
          : item.src?.original || item.src?.large2x,
        preview_url: type === 'video' ? item.image : item.src?.medium,
        width: item.width,
        height: item.height,
        duration: item.duration,
        quality_score: this.calculateQualityScore(item, type),
        attribution: `Photo by ${item.photographer || item.user?.name} on Pexels`,
      }));
    } catch (error) {
      console.error('Pexels search error:', error);
      return [];
    }
  }
  
  /**
   * Pixabay API検索
   */
  private async searchPixabay(
    query: string,
    type: 'video' | 'image',
    orientation: string,
    limit: number
  ): Promise<StockAssetResult[]> {
    const endpoint = type === 'video'
      ? 'https://pixabay.com/api/videos/'
      : 'https://pixabay.com/api/';
    
    try {
      const response = await fetch(
        `${endpoint}?key=${this.pixabayApiKey}&q=${encodeURIComponent(query)}&orientation=${orientation === 'landscape' ? 'horizontal' : 'vertical'}&per_page=${limit}`
      );
      
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return (data.hits || []).map((item: any) => ({
        source: 'pixabay' as const,
        source_id: String(item.id),
        asset_type: type,
        url: type === 'video'
          ? item.videos?.large?.url || item.videos?.medium?.url
          : item.largeImageURL,
        preview_url: type === 'video' ? item.picture_id : item.previewURL,
        width: type === 'video' ? item.videos?.large?.width : item.imageWidth,
        height: type === 'video' ? item.videos?.large?.height : item.imageHeight,
        duration: item.duration,
        quality_score: this.calculateQualityScore(item, type),
        attribution: `Image by ${item.user} on Pixabay`,
      }));
    } catch (error) {
      console.error('Pixabay search error:', error);
      return [];
    }
  }
  
  /**
   * 品質スコア計算
   */
  private calculateQualityScore(item: any, type: 'video' | 'image'): number {
    let score = 0.5;
    
    // 解像度スコア
    const width = item.width || item.imageWidth || 0;
    if (width >= 3840) score += 0.3;
    else if (width >= 1920) score += 0.2;
    else if (width >= 1280) score += 0.1;
    
    // 人気度スコア
    const downloads = item.downloads || item.views || 0;
    if (downloads > 100000) score += 0.2;
    else if (downloads > 10000) score += 0.1;
    
    return Math.min(score, 1);
  }
  
  /**
   * 脚本からキーワードを抽出して素材を自動選定
   */
  async selectAssetsForScript(
    scriptSegments: Array<{ text: string; keywords?: string[] }>,
    channelColorPalette?: string[]
  ): Promise<AssetSelection[]> {
    const selections: AssetSelection[] = [];
    
    for (const segment of scriptSegments) {
      const keywords = segment.keywords || this.extractKeywords(segment.text);
      const assets = await this.searchBackgroundAssets(keywords, { type: 'image', limit: 3 });
      
      // カラーパレットとの相性でフィルタ
      let bestAsset = assets[0];
      if (channelColorPalette && assets.length > 1) {
        bestAsset = assets.reduce((best, current) => {
          const currentMatch = this.calculateColorMatch(current, channelColorPalette);
          const bestMatch = this.calculateColorMatch(best, channelColorPalette);
          return currentMatch > bestMatch ? current : best;
        });
      }
      
      if (bestAsset) {
        selections.push({
          segment_text: segment.text,
          keywords,
          selected_asset: bestAsset,
          alternatives: assets.slice(1),
        });
      }
    }
    
    return selections;
  }
  
  /**
   * テキストからキーワード抽出（簡易版）
   */
  private extractKeywords(text: string): string[] {
    // 日本語の名詞・形容詞を抽出する簡易ロジック
    const commonWords = ['です', 'ます', 'この', 'その', 'あの', 'という', 'ている', 'こと', 'もの'];
    const words = text.split(/[\s、。！？]+/).filter(w => w.length >= 2 && !commonWords.includes(w));
    return words.slice(0, 5);
  }
  
  /**
   * カラーマッチング計算
   */
  private calculateColorMatch(asset: StockAssetResult, palette: string[]): number {
    // 簡易実装（実際にはカラー解析が必要）
    return Math.random(); // プレースホルダー
  }
}

interface StockAssetResult {
  source: 'pexels' | 'pixabay';
  source_id: string;
  asset_type: 'video' | 'image';
  url: string;
  preview_url: string;
  width: number;
  height: number;
  duration?: number;
  quality_score: number;
  attribution: string;
}

interface AssetSelection {
  segment_text: string;
  keywords: string[];
  selected_asset: StockAssetResult;
  alternatives: StockAssetResult[];
}

// ----------------------------------------------------------------------------
// 4. 音声モジュレーター（ElevenLabs 別人化）
// ----------------------------------------------------------------------------

export class VoiceModulator {
  private baseConfig: VoiceModulation;
  private emotionAdjustments: Record<string, Partial<VoiceModulation>>;
  
  constructor(profile: VoiceProfile) {
    this.baseConfig = profile.modulation_config;
    this.emotionAdjustments = profile.emotion_adjustments;
  }
  
  /**
   * 感情タグに応じたモジュレーション設定を生成
   */
  getModulationForEmotion(emotionTag: string): VoiceModulation {
    const adjustment = this.emotionAdjustments[emotionTag.replace(/[\[\]]/g, '')] || {};
    
    return {
      pitch_shift: adjustment.pitch_shift ?? this.baseConfig.pitch_shift,
      speaking_rate: adjustment.speaking_rate ?? this.baseConfig.speaking_rate,
      stability: adjustment.stability ?? this.baseConfig.stability,
      similarity_boost: adjustment.similarity_boost ?? this.baseConfig.similarity_boost,
      style: adjustment.style ?? this.baseConfig.style,
      use_speaker_boost: adjustment.use_speaker_boost ?? this.baseConfig.use_speaker_boost,
    };
  }
  
  /**
   * ElevenLabs API用のパラメータを生成
   */
  generateElevenLabsParams(emotionTag: string): ElevenLabsParams {
    const modulation = this.getModulationForEmotion(emotionTag);
    
    return {
      voice_settings: {
        stability: modulation.stability,
        similarity_boost: modulation.similarity_boost,
        style: modulation.style,
        use_speaker_boost: modulation.use_speaker_boost,
      },
      // ピッチシフトと話速はSSML or 後処理で対応
      post_processing: {
        pitch_shift: modulation.pitch_shift,
        speed: modulation.speaking_rate,
      },
    };
  }
  
  /**
   * チャンネル間で十分に異なる音声設定を生成
   */
  static generateUniqueVoiceConfig(
    existingConfigs: VoiceModulation[],
    baseVoiceId: string
  ): VoiceModulation {
    const MIN_DIFFERENCE = 0.1;
    
    let config: VoiceModulation;
    let attempts = 0;
    
    do {
      config = {
        pitch_shift: 0.85 + Math.random() * 0.3,     // 0.85-1.15
        speaking_rate: 0.9 + Math.random() * 0.2,    // 0.9-1.1
        stability: 0.3 + Math.random() * 0.5,        // 0.3-0.8
        similarity_boost: 0.5 + Math.random() * 0.4, // 0.5-0.9
        style: 0.1 + Math.random() * 0.5,            // 0.1-0.6
        use_speaker_boost: Math.random() > 0.5,
      };
      
      attempts++;
    } while (
      attempts < 100 &&
      existingConfigs.some(existing => this.calculateSimilarity(config, existing) > 1 - MIN_DIFFERENCE)
    );
    
    return config;
  }
  
  /**
   * 2つの音声設定の類似度を計算
   */
  private static calculateSimilarity(a: VoiceModulation, b: VoiceModulation): number {
    const diffs = [
      Math.abs(a.pitch_shift - b.pitch_shift) / 0.4,
      Math.abs(a.speaking_rate - b.speaking_rate) / 0.4,
      Math.abs(a.stability - b.stability),
      Math.abs(a.similarity_boost - b.similarity_boost),
      Math.abs(a.style - b.style),
    ];
    
    const avgDiff = diffs.reduce((sum, d) => sum + d, 0) / diffs.length;
    return 1 - avgDiff;
  }
}

interface ElevenLabsParams {
  voice_settings: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
  post_processing: {
    pitch_shift: number;
    speed: number;
  };
}

// ----------------------------------------------------------------------------
// 5. 視覚的ユニーク性監査
// ----------------------------------------------------------------------------

export class VisualUniquenessAuditor {
  /**
   * チャンネル間の視覚的類似度をチェック
   */
  static async auditChannelUniqueness(
    newChannel: {
      color_palette: string[];
      character_type: string;
      font_family: string;
    },
    existingChannels: Array<{
      channel_id: string;
      color_palette: string[];
      character_type: string;
      font_family: string;
    }>
  ): Promise<UniquenessAuditResult> {
    const similarChannels: Array<{ channel_id: string; similarity_score: number; overlap_reasons: string[] }> = [];
    
    for (const existing of existingChannels) {
      const colorSimilarity = this.calculateColorPaletteSimilarity(newChannel.color_palette, existing.color_palette);
      const typeSimilarity = newChannel.character_type === existing.character_type ? 1 : 0;
      const fontSimilarity = newChannel.font_family === existing.font_family ? 1 : 0;
      
      const overallSimilarity = colorSimilarity * 0.5 + typeSimilarity * 0.3 + fontSimilarity * 0.2;
      
      if (overallSimilarity > 0.6) {
        const reasons: string[] = [];
        if (colorSimilarity > 0.7) reasons.push('配色が類似');
        if (typeSimilarity === 1) reasons.push('キャラクタータイプが同一');
        if (fontSimilarity === 1) reasons.push('フォントが同一');
        
        similarChannels.push({
          channel_id: existing.channel_id,
          similarity_score: overallSimilarity,
          overlap_reasons: reasons,
        });
      }
    }
    
    const uniquenessScore = similarChannels.length === 0 
      ? 1 
      : 1 - Math.max(...similarChannels.map(s => s.similarity_score));
    
    return {
      passed: uniquenessScore > 0.4,
      uniqueness_score: uniquenessScore,
      similar_channels: similarChannels,
      recommendations: this.generateRecommendations(similarChannels, newChannel),
    };
  }
  
  /**
   * カラーパレットの類似度計算
   */
  private static calculateColorPaletteSimilarity(a: string[], b: string[]): number {
    // 簡易実装：HEXカラーの差分計算
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (const colorA of a) {
      for (const colorB of b) {
        totalSimilarity += this.calculateColorDistance(colorA, colorB);
        comparisons++;
      }
    }
    
    return comparisons > 0 ? 1 - (totalSimilarity / comparisons) : 0;
  }
  
  /**
   * 2色間の距離計算
   */
  private static calculateColorDistance(hexA: string, hexB: string): number {
    const rgbA = this.hexToRgb(hexA);
    const rgbB = this.hexToRgb(hexB);
    
    if (!rgbA || !rgbB) return 1;
    
    const distance = Math.sqrt(
      Math.pow(rgbA.r - rgbB.r, 2) +
      Math.pow(rgbA.g - rgbB.g, 2) +
      Math.pow(rgbA.b - rgbB.b, 2)
    );
    
    return distance / 441.67; // 最大距離で正規化
  }
  
  private static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
  
  /**
   * 改善提案を生成
   */
  private static generateRecommendations(
    similarChannels: Array<{ overlap_reasons: string[] }>,
    newChannel: any
  ): string[] {
    const recommendations: string[] = [];
    const reasons = similarChannels.flatMap(s => s.overlap_reasons);
    
    if (reasons.includes('配色が類似')) {
      recommendations.push('補色または類似色相の異なる明度を使用することを推奨');
      recommendations.push('提案カラー: ' + this.suggestAlternativeColors(newChannel.color_palette).join(', '));
    }
    
    if (reasons.includes('キャラクタータイプが同一')) {
      const alternatives = ['anime', 'realistic', 'cartoon', '3d', 'minimal'].filter(t => t !== newChannel.character_type);
      recommendations.push(`キャラクタータイプを変更: ${alternatives.slice(0, 2).join(' または ')}`);
    }
    
    if (reasons.includes('フォントが同一')) {
      recommendations.push('異なるフォントファミリーを使用することを推奨');
    }
    
    return recommendations;
  }
  
  /**
   * 代替カラーを提案
   */
  private static suggestAlternativeColors(currentPalette: string[]): string[] {
    // 補色を計算（簡易版）
    return currentPalette.map(hex => {
      const rgb = this.hexToRgb(hex);
      if (!rgb) return hex;
      
      // 補色
      const complement = {
        r: 255 - rgb.r,
        g: 255 - rgb.g,
        b: 255 - rgb.b,
      };
      
      return `#${complement.r.toString(16).padStart(2, '0')}${complement.g.toString(16).padStart(2, '0')}${complement.b.toString(16).padStart(2, '0')}`;
    });
  }
}

interface UniquenessAuditResult {
  passed: boolean;
  uniqueness_score: number;
  similar_channels: Array<{
    channel_id: string;
    similarity_score: number;
    overlap_reasons: string[];
  }>;
  recommendations: string[];
}

// ----------------------------------------------------------------------------
// 6. Midjourneyプロンプト生成
// ----------------------------------------------------------------------------

export class MidjourneyPromptGenerator {
  /**
   * キャラクター表情セット生成用のプロンプトを生成
   */
  static generateExpressionSetPrompts(
    characterDescription: string,
    style: 'anime' | 'realistic' | 'cartoon' | '3d' | 'minimal',
    crefUrl?: string
  ): MidjourneyPrompt[] {
    const expressions = [
      { key: 'neutral', desc: 'calm neutral expression, looking at camera' },
      { key: 'happy', desc: 'happy smiling expression, warm friendly look' },
      { key: 'thinking', desc: 'thoughtful expression, looking up slightly, hand on chin' },
      { key: 'pointing_right', desc: 'confident expression, pointing to the right with finger' },
      { key: 'pointing_left', desc: 'confident expression, pointing to the left with finger' },
      { key: 'surprised', desc: 'surprised expression, wide eyes, slightly open mouth' },
      { key: 'serious', desc: 'serious focused expression, slight frown' },
      { key: 'explaining', desc: 'explanatory expression, open hands gesture' },
      { key: 'nodding', desc: 'agreeing expression, slight nod, closed eyes smile' },
      { key: 'questioning', desc: 'curious questioning expression, tilted head' },
    ];
    
    const styleModifiers: Record<string, string> = {
      anime: 'anime style, clean lines, vibrant colors, high quality anime art',
      realistic: 'photorealistic, studio lighting, professional portrait',
      cartoon: 'cartoon style, bold outlines, playful, Disney-like',
      '3d': '3D rendered, Pixar style, soft lighting, high detail',
      minimal: 'minimalist illustration, flat design, simple shapes',
    };
    
    const angleVariants = ['front view', 'quarter view left', 'quarter view right'];
    
    const prompts: MidjourneyPrompt[] = [];
    
    for (const expr of expressions) {
      for (const angle of angleVariants) {
        const prompt = [
          characterDescription,
          expr.desc,
          angle,
          styleModifiers[style],
          'white background',
          'waist up portrait',
          '--ar 1:1',
          '--s 250',
          crefUrl ? `--cref ${crefUrl}` : '',
        ].filter(Boolean).join(', ');
        
        prompts.push({
          expression_key: expr.key,
          angle: angle.replace(' view', '').replace(' ', '_'),
          prompt,
        });
      }
    }
    
    return prompts;
  }
}

interface MidjourneyPrompt {
  expression_key: string;
  angle: string;
  prompt: string;
}

// ----------------------------------------------------------------------------
// エクスポート
// ----------------------------------------------------------------------------

export {
  CharacterImageSelector,
  StockAssetSelector,
  VoiceModulator,
  VisualUniquenessAuditor,
  MidjourneyPromptGenerator,
};
