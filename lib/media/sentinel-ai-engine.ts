// ============================================================================
// N3 Empire OS: フェーズ3 - Sentinel AI（自律統治エンジン）
// 11,000chを無人で統治・改善し続けるAIプロデューサー
// ============================================================================

// ----------------------------------------------------------------------------
// 1. 型定義
// ----------------------------------------------------------------------------

export interface SentinelTask {
  id: number;
  task_type: SentinelTaskType;
  channel_id?: string;
  video_id?: string;
  comment_id?: string;
  task_data: any;
  ai_decision?: AIDecision;
  priority: number;
  status: TaskStatus;
  requires_human_review: boolean;
}

export type SentinelTaskType = 
  | 'performance_check'
  | 'thumbnail_regenerate'
  | 'title_optimize'
  | 'community_reply'
  | 'legal_check'
  | 'content_update';

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'human_review';

export interface AIDecision {
  action: string;
  confidence: number;
  reasoning: string;
  parameters: Record<string, any>;
}

export interface PerformanceRule {
  id: number;
  rule_name: string;
  rule_type: string;
  conditions: RuleConditions;
  action_type: string;
  action_params: Record<string, any>;
  is_active: boolean;
}

export interface RuleConditions {
  metric: 'ctr' | 'retention_rate' | 'engagement_rate' | 'views';
  operator: 'lt' | 'gt' | 'eq' | 'between';
  threshold: number;
  comparison: 'absolute' | 'channel_average' | 'category_average';
  min_views: number;
  time_window_hours: number;
}

export interface VideoPerformance {
  video_id: string;
  channel_id: string;
  title: string;
  ctr: number;
  retention_rate: number;
  engagement_rate: number;
  views: number;
  published_at: Date;
}

export interface LegalAlert {
  id: number;
  alert_type: 'law_change' | 'policy_update' | 'copyright_claim' | 'strike';
  detected_keywords: string[];
  affected_categories: string[];
  recommended_action: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

// ----------------------------------------------------------------------------
// 2. Sentinel コア - パフォーマンス監視
// ----------------------------------------------------------------------------

export class SentinelPerformanceMonitor {
  /**
   * パフォーマンスルールに基づいて動画を評価
   */
  static evaluateVideo(
    video: VideoPerformance,
    rule: PerformanceRule,
    channelAverages: { ctr: number; retention_rate: number; engagement_rate: number },
    categoryAverages: { ctr: number; retention_rate: number; engagement_rate: number }
  ): EvaluationResult | null {
    const { conditions } = rule;
    const metric = video[conditions.metric as keyof VideoPerformance] as number;
    
    // 最低視聴数チェック
    if (video.views < conditions.min_views) return null;
    
    // 比較基準を決定
    let threshold = conditions.threshold;
    if (conditions.comparison === 'channel_average') {
      const avg = channelAverages[conditions.metric as keyof typeof channelAverages];
      threshold = avg * conditions.threshold;
    } else if (conditions.comparison === 'category_average') {
      const avg = categoryAverages[conditions.metric as keyof typeof categoryAverages];
      threshold = avg * conditions.threshold;
    }
    
    // 条件チェック
    let triggered = false;
    switch (conditions.operator) {
      case 'lt': triggered = metric < threshold; break;
      case 'gt': triggered = metric > threshold; break;
      case 'eq': triggered = Math.abs(metric - threshold) < 0.001; break;
    }
    
    if (!triggered) return null;
    
    return {
      video_id: video.video_id,
      rule_id: rule.id,
      rule_name: rule.rule_name,
      action_type: rule.action_type,
      action_params: rule.action_params,
      metric_value: metric,
      threshold_value: threshold,
      confidence: this.calculateConfidence(metric, threshold, conditions.operator),
    };
  }
  
  /**
   * 自信度を計算
   */
  private static calculateConfidence(
    actual: number,
    threshold: number,
    operator: string
  ): number {
    const diff = Math.abs(actual - threshold);
    const relDiff = diff / Math.max(actual, threshold, 0.001);
    
    // 差が大きいほど自信度が高い
    return Math.min(0.5 + relDiff * 2, 0.99);
  }
  
  /**
   * バッチ評価（複数動画×複数ルール）
   */
  static batchEvaluate(
    videos: VideoPerformance[],
    rules: PerformanceRule[],
    channelAverages: Map<string, { ctr: number; retention_rate: number; engagement_rate: number }>,
    categoryAverages: Map<string, { ctr: number; retention_rate: number; engagement_rate: number }>
  ): EvaluationResult[] {
    const results: EvaluationResult[] = [];
    
    for (const video of videos) {
      const chAvg = channelAverages.get(video.channel_id) || { ctr: 0.05, retention_rate: 0.4, engagement_rate: 0.05 };
      const catAvg = categoryAverages.get('default') || { ctr: 0.05, retention_rate: 0.4, engagement_rate: 0.05 };
      
      for (const rule of rules) {
        if (!rule.is_active) continue;
        
        const result = this.evaluateVideo(video, rule, chAvg, catAvg);
        if (result) {
          results.push(result);
        }
      }
    }
    
    // 優先度でソート（自信度が高い順）
    return results.sort((a, b) => b.confidence - a.confidence);
  }
}

interface EvaluationResult {
  video_id: string;
  rule_id: number;
  rule_name: string;
  action_type: string;
  action_params: Record<string, any>;
  metric_value: number;
  threshold_value: number;
  confidence: number;
}

// ----------------------------------------------------------------------------
// 3. Sentinel コミュニティ返信エンジン
// ----------------------------------------------------------------------------

export class SentinelCommunityAgent {
  /**
   * コメントを分析して返信を生成
   */
  static analyzeComment(
    comment: {
      text: string;
      author: string;
      video_id: string;
    },
    channelPersona: {
      tone: 'friendly' | 'professional' | 'casual' | 'educational';
      character_name?: string;
    },
    knowledgeBase: Array<{
      question_code: string;
      category: string;
      explanation: string;
    }>
  ): CommentAnalysis {
    // 感情分析（簡易版）
    const sentiment = this.analyzeSentiment(comment.text);
    
    // 質問検出
    const isQuestion = this.detectQuestion(comment.text);
    
    // 関連する知識を検索
    const relevantKnowledge = this.findRelevantKnowledge(comment.text, knowledgeBase);
    
    // 返信を生成
    const response = this.generateResponse(
      comment,
      channelPersona,
      sentiment,
      isQuestion,
      relevantKnowledge
    );
    
    return {
      sentiment_score: sentiment,
      is_question: isQuestion,
      requires_expertise: relevantKnowledge.length > 0 && isQuestion,
      suggested_response: response.text,
      confidence: response.confidence,
      knowledge_sources: relevantKnowledge.map(k => k.question_code),
    };
  }
  
  /**
   * 感情分析（簡易版）
   */
  private static analyzeSentiment(text: string): number {
    const positiveWords = ['ありがとう', 'すごい', '素晴らしい', '勉強になる', '分かりやすい', '助かる'];
    const negativeWords = ['分からない', '難しい', '間違い', 'つまらない', '最悪'];
    
    let score = 0;
    for (const word of positiveWords) {
      if (text.includes(word)) score += 0.2;
    }
    for (const word of negativeWords) {
      if (text.includes(word)) score -= 0.2;
    }
    
    return Math.max(-1, Math.min(1, score));
  }
  
  /**
   * 質問検出
   */
  private static detectQuestion(text: string): boolean {
    const questionPatterns = [
      /[?？]/,
      /教えて/,
      /どう(やって|すれば)/,
      /なぜ|どうして/,
      /〜(です|ます)か/,
      /分から(ない|ん)/,
    ];
    
    return questionPatterns.some(p => p.test(text));
  }
  
  /**
   * 関連知識を検索
   */
  private static findRelevantKnowledge(
    text: string,
    knowledgeBase: Array<{ question_code: string; category: string; explanation: string }>
  ): Array<{ question_code: string; category: string; explanation: string }> {
    // 簡易キーワードマッチング
    const keywords = text.split(/[\s、。]+/).filter(w => w.length >= 2);
    
    return knowledgeBase.filter(k => 
      keywords.some(kw => k.explanation.includes(kw) || k.category.includes(kw))
    ).slice(0, 3);
  }
  
  /**
   * 返信を生成
   */
  private static generateResponse(
    comment: { text: string; author: string },
    persona: { tone: string; character_name?: string },
    sentiment: number,
    isQuestion: boolean,
    knowledge: Array<{ explanation: string }>
  ): { text: string; confidence: number } {
    const greeting = persona.character_name 
      ? `${comment.author}さん、コメントありがとうございます！${persona.character_name}です。`
      : `${comment.author}さん、コメントありがとうございます！`;
    
    let body = '';
    let confidence = 0.7;
    
    if (isQuestion && knowledge.length > 0) {
      body = knowledge[0].explanation.substring(0, 200);
      confidence = 0.85;
    } else if (sentiment > 0) {
      body = 'そう言っていただけて嬉しいです！これからも分かりやすい解説を心がけます。';
      confidence = 0.9;
    } else if (sentiment < 0) {
      body = 'ご指摘ありがとうございます。より分かりやすい説明を心がけます。';
      confidence = 0.75;
    } else {
      body = '引き続きよろしくお願いします！';
      confidence = 0.8;
    }
    
    const closing = persona.tone === 'casual' ? '😊' : '';
    
    return {
      text: `${greeting}\n${body}${closing}`,
      confidence,
    };
  }
  
  /**
   * コミュニティ投稿を生成
   */
  static generateCommunityPost(
    channelId: string,
    postType: 'poll' | 'announcement' | 'engagement',
    context: {
      recent_topics: string[];
      upcoming_videos?: string[];
      milestone?: { type: string; value: number };
    }
  ): CommunityPostDraft {
    switch (postType) {
      case 'poll':
        return {
          type: 'poll',
          question: `次に解説してほしいテーマはどれですか？`,
          options: context.recent_topics.slice(0, 4),
          confidence: 0.9,
        };
      
      case 'announcement':
        return {
          type: 'text',
          text: context.upcoming_videos 
            ? `📣 今週の予定\n${context.upcoming_videos.map(v => `・${v}`).join('\n')}\nお楽しみに！`
            : `今週も頑張っていきましょう！`,
          confidence: 0.85,
        };
      
      case 'engagement':
        return {
          type: 'text',
          text: context.milestone
            ? `🎉 ${context.milestone.type}が${context.milestone.value}を達成しました！\nいつもありがとうございます！`
            : `質問があればコメントで教えてください！`,
          confidence: 0.88,
        };
      
      default:
        return { type: 'text', text: '', confidence: 0 };
    }
  }
}

interface CommentAnalysis {
  sentiment_score: number;
  is_question: boolean;
  requires_expertise: boolean;
  suggested_response: string;
  confidence: number;
  knowledge_sources: string[];
}

interface CommunityPostDraft {
  type: 'text' | 'poll' | 'image';
  text?: string;
  question?: string;
  options?: string[];
  image_url?: string;
  confidence: number;
}

// ----------------------------------------------------------------------------
// 4. 法的キルスイッチ
// ----------------------------------------------------------------------------

export class SentinelLegalGuard {
  private static readonly LAW_KEYWORDS: Record<string, string[]> = {
    '宅建': ['宅地建物取引業法', '宅建業法', '重要事項説明', '媒介契約'],
    '民法': ['民法改正', '成年年齢', '相続法', '債権法'],
    '行政書士': ['行政書士法', '行政手続法'],
    '簿記': ['会計基準', '収益認識'],
  };
  
  /**
   * ニュース記事から法改正を検出
   */
  static detectLawChanges(
    newsArticles: Array<{ title: string; content: string; date: string; source: string }>
  ): LegalAlert[] {
    const alerts: LegalAlert[] = [];
    
    for (const article of newsArticles) {
      const fullText = `${article.title} ${article.content}`;
      
      for (const [category, keywords] of Object.entries(this.LAW_KEYWORDS)) {
        const matchedKeywords = keywords.filter(kw => fullText.includes(kw));
        
        if (matchedKeywords.length >= 2 && (fullText.includes('改正') || fullText.includes('施行'))) {
          alerts.push({
            id: 0,
            alert_type: 'law_change',
            detected_keywords: matchedKeywords,
            affected_categories: [category],
            recommended_action: this.determineAction(fullText),
            severity: this.determineSeverity(fullText, matchedKeywords.length),
          });
        }
      }
    }
    
    return alerts;
  }
  
  /**
   * 推奨アクションを決定
   */
  private static determineAction(text: string): string {
    if (text.includes('廃止') || text.includes('削除')) return 'unpublish';
    if (text.includes('施行')) return 'add_disclaimer';
    return 'update_description';
  }
  
  /**
   * 重要度を決定
   */
  private static determineSeverity(text: string, keywordCount: number): 'critical' | 'high' | 'medium' | 'low' {
    if (text.includes('即時') || text.includes('緊急')) return 'critical';
    if (keywordCount >= 4) return 'high';
    if (keywordCount >= 2) return 'medium';
    return 'low';
  }
  
  /**
   * 影響を受ける動画を特定
   */
  static async findAffectedVideos(
    alert: LegalAlert,
    supabase: any
  ): Promise<string[]> {
    const { data: videos } = await supabase
      .from('render_metadata')
      .select('render_id, youtube_video_id')
      .contains('scenes', [{ keywords: alert.detected_keywords }])
      .limit(100);
    
    return (videos || []).map((v: any) => v.youtube_video_id).filter(Boolean);
  }
  
  /**
   * 概要欄を一括更新
   */
  static generateDescriptionUpdate(
    alert: LegalAlert,
    existingDescription: string
  ): string {
    const disclaimer = `\n\n⚠️ 重要なお知らせ（${new Date().toLocaleDateString('ja-JP')}）\n` +
      `この動画で解説している${alert.affected_categories.join('・')}に関する法令が改正されました。\n` +
      `最新の情報は公式サイト等でご確認ください。`;
    
    if (existingDescription.includes('⚠️ 重要なお知らせ')) {
      // 既存の注意書きを更新
      return existingDescription.replace(/⚠️ 重要なお知らせ[\s\S]*?最新の情報は公式サイト等でご確認ください。/, disclaimer.trim());
    }
    
    return existingDescription + disclaimer;
  }
}

// ----------------------------------------------------------------------------
// 5. 自動承認ゲート
// ----------------------------------------------------------------------------

export class SentinelAutoApprovalGate {
  /**
   * タスクが自動承認可能かチェック
   */
  static checkAutoApproval(
    task: SentinelTask,
    config: {
      auto_approve_threshold: number;
      human_review_threshold: number;
      daily_auto_approve_limit: number;
    },
    todayApprovedCount: number
  ): ApprovalDecision {
    const confidence = task.ai_decision?.confidence || 0;
    
    // 日次制限チェック
    if (todayApprovedCount >= config.daily_auto_approve_limit) {
      return {
        decision: 'human_review',
        reason: '日次自動承認上限に達しました',
      };
    }
    
    // 自信度に基づく判断
    if (confidence >= config.auto_approve_threshold) {
      return {
        decision: 'auto_approve',
        reason: `自信度 ${(confidence * 100).toFixed(1)}% が閾値 ${(config.auto_approve_threshold * 100).toFixed(1)}% 以上`,
      };
    }
    
    if (confidence < config.human_review_threshold) {
      return {
        decision: 'human_review',
        reason: `自信度 ${(confidence * 100).toFixed(1)}% が閾値 ${(config.human_review_threshold * 100).toFixed(1)}% 未満`,
      };
    }
    
    return {
      decision: 'auto_approve',
      reason: '自信度が中間範囲のため自動承認',
    };
  }
}

interface ApprovalDecision {
  decision: 'auto_approve' | 'human_review' | 'reject';
  reason: string;
}

// ----------------------------------------------------------------------------
// 6. Geminiプロンプト集
// ----------------------------------------------------------------------------

export const SENTINEL_PROMPTS = {
  THUMBNAIL_ANALYSIS: `
あなたはYouTubeサムネイルの専門家です。
以下の動画パフォーマンスデータを分析し、CTR改善のためのサムネイル修正案を提案してください。

【入力データ】
- 現在のCTR: {ctr}%
- チャンネル平均CTR: {channel_avg_ctr}%
- カテゴリ平均CTR: {category_avg_ctr}%
- 動画タイトル: {title}
- 現在のサムネイルの特徴: {thumbnail_features}

【出力形式】
{
  "analysis": "現状の問題点",
  "recommendations": [
    {
      "priority": 1,
      "change": "具体的な変更内容",
      "expected_impact": "予想される改善効果"
    }
  ],
  "new_design": {
    "text_overlay": "表示するテキスト",
    "color_scheme": "推奨配色",
    "layout": "レイアウト指示"
  },
  "confidence": 0.85
}
`,

  TITLE_OPTIMIZATION: `
あなたはYouTubeタイトル最適化のエキスパートです。
視聴維持率が低い動画のタイトルを改善してください。

【入力データ】
- 現在のタイトル: {current_title}
- 視聴維持率: {retention_rate}%
- 動画内容の要約: {summary}
- ターゲット視聴者: {target_audience}

【要件】
1. フックを強化（最初の5文字で興味を引く）
2. 具体的な数字やベネフィットを含める
3. 40文字以内に収める
4. クリックベイトにしない

【出力形式】
{
  "variants": [
    { "title": "案1", "hook_type": "question", "strength": 0.9 },
    { "title": "案2", "hook_type": "number", "strength": 0.85 },
    { "title": "案3", "hook_type": "curiosity", "strength": 0.8 }
  ],
  "recommendation": "案1",
  "reasoning": "選定理由",
  "confidence": 0.88
}
`,

  COMMENT_REPLY: `
あなたはYouTubeチャンネルのコミュニティマネージャーです。
以下のコメントに対して、チャンネルのキャラクターに合った返信を生成してください。

【チャンネル情報】
- チャンネル名: {channel_name}
- トーン: {tone} (friendly/professional/casual/educational)
- キャラクター: {character_name}

【コメント】
- 投稿者: {author}
- 内容: {comment_text}
- 動画タイトル: {video_title}

【関連する知識ベース】
{knowledge_context}

【要件】
1. 投稿者への感謝を含める
2. 質問があれば正確に回答
3. 100文字以内に収める
4. チャンネルのトーンを維持

【出力形式】
{
  "reply": "返信テキスト",
  "sentiment_detected": "positive/negative/neutral",
  "is_question": true/false,
  "knowledge_used": ["使用した知識のID"],
  "confidence": 0.9
}
`,
};

// ----------------------------------------------------------------------------
// エクスポート
// ----------------------------------------------------------------------------

export {
  SentinelPerformanceMonitor,
  SentinelCommunityAgent,
  SentinelLegalGuard,
  SentinelAutoApprovalGate,
  SENTINEL_PROMPTS,
};
