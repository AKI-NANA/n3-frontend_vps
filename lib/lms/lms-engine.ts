// ============================================================================
// N3 Empire OS: フェーズ1 - LMS循環エンジン TypeScript実装
// シャッフル・類題生成・弱点追跡・自動再解説トリガー
// ============================================================================

// ----------------------------------------------------------------------------
// 1. 型定義
// ----------------------------------------------------------------------------

export interface Question {
  id: number;
  question_code: string;
  source_exam: string;
  category: string;
  subcategory?: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'true_false' | 'fill_blank';
  difficulty: number;
  importance: number;
  creation_intent?: string;
  related_laws: string[];
  keywords: string[];
  global_accuracy_rate?: number;
}

export interface QuestionOption {
  id: number;
  question_id: number;
  option_label: string;
  option_text: string;
  is_correct: boolean;
  parametric_slots?: ParametricSlots;
  incorrect_reason?: string;
  common_misconception?: string;
}

export interface ParametricSlots {
  [slotName: string]: {
    original: string;
    alternatives?: string[];
    type?: 'person_name' | 'money' | 'date' | 'number' | 'place';
    range?: [number, number];
    unit?: string;
    formula?: string;
  };
}

export interface UserAnswer {
  user_id: string;
  question_id: number;
  selected_option_id: number;
  is_correct: boolean;
  time_spent_seconds: number;
  confidence_level?: number;
  question_snapshot?: ShuffledQuestion;
  session_id?: string;
}

export interface ShuffledQuestion {
  original_question_id: number;
  question_text: string;
  options: ShuffledOption[];
  parametric_seed?: string;
}

export interface ShuffledOption {
  original_id: number;
  label: string;
  text: string;
  display_order: number;
}

export interface WeakPoint {
  user_id: string;
  category: string;
  accuracy_rate: number;
  weakness_level: 'critical' | 'weak' | 'moderate' | 'strong';
  recommended_question_ids: number[];
}

// ----------------------------------------------------------------------------
// 2. シャッフル＆類題生成エンジン
// ----------------------------------------------------------------------------

export class QuestionShuffler {
  /**
   * 選択肢をシャッフル（問題の本質は変えずに表示順を変更）
   */
  static shuffleOptions(options: QuestionOption[], seed?: string): ShuffledOption[] {
    const shuffled = [...options];
    
    // Fisher-Yatesアルゴリズム（シード付き）
    const random = seed ? this.seededRandom(seed) : Math.random;
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // ラベルを再割り当て
    const labels = ['ア', 'イ', 'ウ', 'エ', 'オ', 'カ', 'キ', 'ク'];
    
    return shuffled.map((opt, idx) => ({
      original_id: opt.id,
      label: labels[idx] || String(idx + 1),
      text: opt.option_text,
      display_order: idx,
    }));
  }
  
  /**
   * パラメトリック変換（数字・人名を置換して類題生成）
   */
  static generateParametricVariant(
    question: Question,
    options: QuestionOption[],
    seed?: string
  ): ShuffledQuestion {
    const random = seed ? this.seededRandom(seed) : Math.random;
    
    // 置換マップを作成
    const replacements: Map<string, string> = new Map();
    
    // 各選択肢のパラメトリックスロットを処理
    for (const option of options) {
      if (!option.parametric_slots) continue;
      
      for (const [slotName, slot] of Object.entries(option.parametric_slots)) {
        if (replacements.has(slot.original)) continue;
        
        let newValue = slot.original;
        
        if (slot.alternatives && slot.alternatives.length > 0) {
          // 代替値からランダム選択
          const idx = Math.floor(random() * slot.alternatives.length);
          newValue = slot.alternatives[idx];
        } else if (slot.type === 'money' && slot.range) {
          // 金額をランダム生成
          const [min, max] = slot.range;
          const value = Math.floor(random() * (max - min + 1) + min);
          newValue = `${value}${slot.unit || '万円'}`;
        } else if (slot.type === 'number' && slot.range) {
          // 数値をランダム生成
          const [min, max] = slot.range;
          newValue = String(Math.floor(random() * (max - min + 1) + min));
        } else if (slot.type === 'date') {
          // 日付をランダム生成
          const year = 2020 + Math.floor(random() * 6);
          const month = 1 + Math.floor(random() * 12);
          const day = 1 + Math.floor(random() * 28);
          newValue = `令和${year - 2018}年${month}月${day}日`;
        }
        
        replacements.set(slot.original, newValue);
      }
    }
    
    // テキストを置換
    let newQuestionText = question.question_text;
    const newOptions = options.map(opt => {
      let newText = opt.option_text;
      for (const [original, replacement] of replacements) {
        newQuestionText = newQuestionText.replace(new RegExp(original, 'g'), replacement);
        newText = newText.replace(new RegExp(original, 'g'), replacement);
      }
      return { ...opt, option_text: newText };
    });
    
    // シャッフル
    const shuffledOptions = this.shuffleOptions(newOptions, seed);
    
    return {
      original_question_id: question.id,
      question_text: newQuestionText,
      options: shuffledOptions,
      parametric_seed: seed,
    };
  }
  
  /**
   * シード付き乱数生成器
   */
  private static seededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return () => {
      hash = Math.sin(hash) * 10000;
      return hash - Math.floor(hash);
    };
  }
}

// ----------------------------------------------------------------------------
// 3. 自動問題生成（○×クイズ、穴埋め）
// ----------------------------------------------------------------------------

export class AutoQuestionGenerator {
  /**
   * ○×クイズを生成
   */
  static generateTrueFalseQuiz(
    question: Question,
    options: QuestionOption[],
    count: number = 4
  ): TrueFalseQuiz[] {
    const quizzes: TrueFalseQuiz[] = [];
    
    // 正解選択肢から正しい文を生成
    const correctOptions = options.filter(o => o.is_correct);
    for (const opt of correctOptions.slice(0, Math.ceil(count / 2))) {
      quizzes.push({
        statement: opt.option_text,
        is_true: true,
        explanation: `この記述は正しいです。${opt.incorrect_reason || ''}`,
        source_question_id: question.id,
      });
    }
    
    // 誤り選択肢から誤りの文を生成
    const incorrectOptions = options.filter(o => !o.is_correct);
    for (const opt of incorrectOptions.slice(0, Math.floor(count / 2))) {
      quizzes.push({
        statement: opt.option_text,
        is_true: false,
        explanation: `この記述は誤りです。${opt.incorrect_reason || opt.common_misconception || ''}`,
        source_question_id: question.id,
      });
    }
    
    return this.shuffle(quizzes);
  }
  
  /**
   * 穴埋め問題を生成
   */
  static generateFillBlankQuiz(
    question: Question,
    explanation: string
  ): FillBlankQuiz | null {
    // キーワードを抽出
    const keywords = question.keywords || [];
    if (keywords.length === 0) return null;
    
    // 解説文からキーワードを穴埋めに
    let blankText = explanation;
    const blanks: string[] = [];
    
    for (const keyword of keywords.slice(0, 3)) {
      if (blankText.includes(keyword)) {
        blankText = blankText.replace(keyword, `【${blanks.length + 1}】`);
        blanks.push(keyword);
      }
    }
    
    if (blanks.length === 0) return null;
    
    return {
      question_text: blankText,
      blanks: blanks,
      hints: keywords.filter(k => !blanks.includes(k)),
      source_question_id: question.id,
    };
  }
  
  private static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

interface TrueFalseQuiz {
  statement: string;
  is_true: boolean;
  explanation: string;
  source_question_id: number;
}

interface FillBlankQuiz {
  question_text: string;
  blanks: string[];
  hints: string[];
  source_question_id: number;
}

// ----------------------------------------------------------------------------
// 4. 弱点追跡＆レコメンデーション
// ----------------------------------------------------------------------------

export class WeakPointTracker {
  /**
   * ユーザーの弱点を分析
   */
  static analyzeWeakPoints(
    answers: UserAnswer[],
    questions: Map<number, Question>
  ): WeakPoint[] {
    // カテゴリ別に集計
    const categoryStats: Map<string, { correct: number; total: number; questions: number[] }> = new Map();
    
    for (const answer of answers) {
      const question = questions.get(answer.question_id);
      if (!question) continue;
      
      const category = question.category;
      const stats = categoryStats.get(category) || { correct: 0, total: 0, questions: [] };
      
      stats.total++;
      if (answer.is_correct) stats.correct++;
      if (!stats.questions.includes(answer.question_id)) {
        stats.questions.push(answer.question_id);
      }
      
      categoryStats.set(category, stats);
    }
    
    // 弱点リストを生成
    const weakPoints: WeakPoint[] = [];
    
    for (const [category, stats] of categoryStats) {
      const accuracyRate = stats.total > 0 ? stats.correct / stats.total : 0;
      
      let level: WeakPoint['weakness_level'];
      if (accuracyRate < 0.3) level = 'critical';
      else if (accuracyRate < 0.5) level = 'weak';
      else if (accuracyRate < 0.7) level = 'moderate';
      else level = 'strong';
      
      weakPoints.push({
        user_id: answers[0]?.user_id || '',
        category,
        accuracy_rate: accuracyRate,
        weakness_level: level,
        recommended_question_ids: this.getRecommendedQuestions(stats.questions, questions, level),
      });
    }
    
    return weakPoints.sort((a, b) => a.accuracy_rate - b.accuracy_rate);
  }
  
  /**
   * 推奨問題を選定
   */
  private static getRecommendedQuestions(
    attemptedIds: number[],
    questions: Map<number, Question>,
    level: WeakPoint['weakness_level']
  ): number[] {
    const recommended: number[] = [];
    
    // 未挑戦または誤答した問題から選定
    for (const [id, question] of questions) {
      // 難易度フィルタ
      if (level === 'critical' && question.difficulty > 2) continue;
      if (level === 'weak' && question.difficulty > 3) continue;
      
      // 重要度が高いものを優先
      if (question.importance >= 3) {
        recommended.push(id);
      }
    }
    
    return recommended.slice(0, 10);
  }
  
  /**
   * 動画タイムスタンプへのジャンプリンクを生成
   */
  static getVideoJumpLink(
    questionId: number,
    renderMetadata: { render_id: string; scenes: Array<{ topic_id?: string; start_time_ms: number }> }
  ): string | null {
    const scene = renderMetadata.scenes.find(s => s.topic_id === String(questionId));
    if (!scene) return null;
    
    const seconds = Math.floor(scene.start_time_ms / 1000);
    return `https://youtube.com/watch?v=${renderMetadata.render_id}&t=${seconds}s`;
  }
}

// ----------------------------------------------------------------------------
// 5. 自動再解説トリガー
// ----------------------------------------------------------------------------

export class AutoReExplanationTrigger {
  private static readonly ACCURACY_THRESHOLD = 0.4;  // 40%以下で再解説
  private static readonly MIN_ATTEMPTS = 10;
  
  /**
   * 誤答率が高い問題を検出し、再解説キューに追加
   */
  static async detectAndQueueReExplanation(
    supabase: any,  // SupabaseClient
  ): Promise<QueuedReExplanation[]> {
    // 低正答率の問題を取得
    const { data: lowAccuracyQuestions, error } = await supabase
      .from('questions')
      .select('id, question_code, category, global_accuracy_rate, total_attempts')
      .lt('global_accuracy_rate', this.ACCURACY_THRESHOLD)
      .gte('total_attempts', this.MIN_ATTEMPTS)
      .eq('is_active', true)
      .eq('needs_improvement', false)
      .order('global_accuracy_rate', { ascending: true })
      .limit(20);
    
    if (error || !lowAccuracyQuestions) {
      console.error('Failed to fetch low accuracy questions:', error);
      return [];
    }
    
    const queued: QueuedReExplanation[] = [];
    
    for (const question of lowAccuracyQuestions) {
      // キューに追加
      const { data, error: insertError } = await supabase
        .from('priority_render_queue')
        .insert({
          question_id: question.id,
          category: question.category,
          priority: question.global_accuracy_rate < 0.25 ? 'critical' : 'high',
          trigger_reason: 'low_accuracy',
          trigger_data: {
            accuracy_rate: question.global_accuracy_rate,
            total_attempts: question.total_attempts,
          },
          target_media: 'video',
          special_instructions: this.generateReExplanationInstructions(question),
        })
        .select()
        .single();
      
      if (!insertError && data) {
        queued.push({
          queue_id: data.id,
          question_id: question.id,
          priority: data.priority,
          reason: 'low_accuracy',
        });
        
        // 問題に改善フラグを立てる
        await supabase
          .from('questions')
          .update({
            needs_improvement: true,
            improvement_reason: `正答率${(question.global_accuracy_rate * 100).toFixed(1)}%のため再解説を予約`,
          })
          .eq('id', question.id);
      }
    }
    
    return queued;
  }
  
  /**
   * 再解説用の特別指示を生成
   */
  private static generateReExplanationInstructions(question: any): string {
    const rate = (question.global_accuracy_rate * 100).toFixed(1);
    
    return `
【再解説動画生成指示】
対象問題: ${question.question_code}
カテゴリ: ${question.category}
現在の正答率: ${rate}%

【特別対応】
1. より噛み砕いた説明に書き換える
2. 図解を追加する（フロー図または比較表）
3. よくある誤解パターンを明示的に説明
4. 具体例を2つ以上追加
5. 「ここがポイント！」マーカーを強調

【トーン】
- 「難しく感じる人が多い」と共感から入る
- 「実は簡単です」と安心させる
- ステップバイステップで解説
    `.trim();
  }
}

interface QueuedReExplanation {
  queue_id: number;
  question_id: number;
  priority: string;
  reason: string;
}

// ----------------------------------------------------------------------------
// 6. Geminiプロンプト：○×クイズ/穴埋め自動生成
// ----------------------------------------------------------------------------

export const GEMINI_AUTO_QUIZ_PROMPT = `
あなたは資格試験の問題作成のエキスパートです。
与えられた「原子データ（問題と解説）」から、以下の形式で自動的に派生問題を生成してください。

【入力】
{
  "question": "元の問題文",
  "correct_answer": "正解の選択肢",
  "explanation": "解説文",
  "keywords": ["キーワード1", "キーワード2"],
  "category": "カテゴリ"
}

【出力形式】
{
  "true_false_quizzes": [
    {
      "statement": "○×で判定する文",
      "is_true": true,
      "explanation": "なぜその答えになるかの解説"
    }
  ],
  "fill_blank_quizzes": [
    {
      "question_text": "【1】に入る語句を答えよ。〜〜は【1】である。",
      "answers": ["正解1"],
      "hints": ["ヒント1", "ヒント2"]
    }
  ],
  "short_answer_quizzes": [
    {
      "question": "〜〜とは何か、簡潔に説明せよ。",
      "model_answer": "模範解答",
      "scoring_points": ["採点ポイント1", "採点ポイント2"]
    }
  ]
}

【重要ルール】
1. 元の問題の本質（何を理解しているか問う）を維持すること
2. 難易度は元の問題と同程度にすること
3. 誤解を招く表現は避けること
4. 法律問題の場合、条文の正確性を維持すること
5. 各タイプ最低2問、最大5問を生成すること
`;

// ----------------------------------------------------------------------------
// エクスポート
// ----------------------------------------------------------------------------

export {
  QuestionShuffler,
  AutoQuestionGenerator,
  WeakPointTracker,
  AutoReExplanationTrigger,
  GEMINI_AUTO_QUIZ_PROMPT,
};
