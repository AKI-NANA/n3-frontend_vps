// lib/empire-os/policy-validator.ts
// 🛡️ N3 Empire OS V8 Phase 2 - Policy Validator
// robots.txt違反、ToS違反、法的リスク検知エンジン

// ========================================
// 型定義
// ========================================

export type RuleCategory = 
  | 'robots_txt' 
  | 'tos_violation' 
  | 'legal_risk' 
  | 'content_safety' 
  | 'rate_limit';

export type Severity = 'info' | 'warning' | 'error' | 'critical';

export type ValidationAction = 
  | 'pass'       // 通過
  | 'flag'       // フラグのみ（続行可）
  | 'delay'      // 遅延後続行
  | 'stop'       // 停止（承認必要）
  | 'reject';    // 完全拒否

export interface PolicyRule {
  id: string;
  rule_code: string;
  rule_name: string;
  rule_category: RuleCategory;
  rule_definition: {
    type: 'pattern' | 'regex' | 'robots_check' | 'rate_check' | 'ai_check';
    patterns?: string[];
    regex?: boolean;
    severity: Severity;
    action: ValidationAction;
    ai_check_required?: boolean;
    ai_prompt?: string;
  };
  applies_to: {
    platforms: string[];
    regions: string[];
    content_types: string[];
    plan_types: string[];
  };
  action_config: {
    on_match: ValidationAction;
    require_approval: boolean;
    auto_reject: boolean;
    notify_admin: boolean;
    log_level: string;
  };
  priority: number;
  is_active: boolean;
  is_system_rule: boolean;
}

export interface ValidationResult {
  passed: boolean;
  action: ValidationAction;
  violations: ViolationDetail[];
  warnings: ViolationDetail[];
  ai_checks_required: AICheckRequest[];
  summary: {
    total_rules_checked: number;
    errors_count: number;
    warnings_count: number;
    info_count: number;
    highest_severity: Severity;
    requires_human_approval: boolean;
  };
  checked_at: string;
  execution_time_ms: number;
}

export interface ViolationDetail {
  rule_code: string;
  rule_name: string;
  category: RuleCategory;
  severity: Severity;
  action: ValidationAction;
  matched_pattern?: string;
  matched_text?: string;
  position?: { start: number; end: number };
  context?: string;
  suggestion?: string;
}

export interface AICheckRequest {
  rule_code: string;
  check_type: string;
  prompt: string;
  content_preview: string;
  priority: number;
}

export interface RobotsTxtResult {
  allowed: boolean;
  domain: string;
  path: string;
  cached: boolean;
  crawl_delay?: number;
  reason?: string;
}

// ========================================
// システム標準ルール（プリセット）
// ========================================

export const SYSTEM_RULES: Omit<PolicyRule, 'id'>[] = [
  // ToS違反ワード（日本語）
  {
    rule_code: 'TOS_VIOLATION_JA',
    rule_name: 'ToS違反ワード（日本語）',
    rule_category: 'tos_violation',
    rule_definition: {
      type: 'pattern',
      patterns: [
        '確実に稼げる', '絶対儲かる', 'リスクゼロ', '必ず利益', '100%成功',
        '元本保証', '損失なし', '今だけ無料', '限定○名', '残りわずか',
      ],
      severity: 'error',
      action: 'stop',
    },
    applies_to: { platforms: ['*'], regions: ['JP'], content_types: ['*'], plan_types: ['*'] },
    action_config: { on_match: 'stop', require_approval: true, auto_reject: false, notify_admin: true, log_level: 'error' },
    priority: 30,
    is_active: true,
    is_system_rule: true,
  },
  
  // ToS違反ワード（英語）
  {
    rule_code: 'TOS_VIOLATION_EN',
    rule_name: 'ToS Violation Words (English)',
    rule_category: 'tos_violation',
    rule_definition: {
      type: 'pattern',
      patterns: [
        'guaranteed profit', 'guaranteed returns', '100% returns', 'no risk', 'risk-free',
        'make money fast', 'get rich quick', 'limited time offer', 'act now', 'once in a lifetime',
      ],
      severity: 'error',
      action: 'stop',
    },
    applies_to: { platforms: ['*'], regions: ['US', 'UK', 'AU', 'DE'], content_types: ['*'], plan_types: ['*'] },
    action_config: { on_match: 'stop', require_approval: true, auto_reject: false, notify_admin: true, log_level: 'error' },
    priority: 31,
    is_active: true,
    is_system_rule: true,
  },
  
  // 法的助言リスク
  {
    rule_code: 'LEGAL_ADVICE',
    rule_name: '法的助言リスク',
    rule_category: 'legal_risk',
    rule_definition: {
      type: 'pattern',
      patterns: [
        '必ず〜してください', '絶対に〜すべき', '法律で禁止', '違法です',
        'legal advice', 'this is not legal advice', 'consult a lawyer',
      ],
      severity: 'warning',
      action: 'flag',
      ai_check_required: true,
    },
    applies_to: { platforms: ['*'], regions: ['*'], content_types: ['*'], plan_types: ['*'] },
    action_config: { on_match: 'flag', require_approval: false, auto_reject: false, notify_admin: false, log_level: 'warning' },
    priority: 40,
    is_active: true,
    is_system_rule: true,
  },
  
  // 医療助言リスク
  {
    rule_code: 'MEDICAL_ADVICE',
    rule_name: '医療助言リスク',
    rule_category: 'legal_risk',
    rule_definition: {
      type: 'pattern',
      patterns: [
        '治療効果', '病気が治る', '医師の処方なしで', '薬の代わり',
        'cure disease', 'medical treatment', 'without prescription',
      ],
      severity: 'error',
      action: 'stop',
      ai_check_required: true,
    },
    applies_to: { platforms: ['*'], regions: ['*'], content_types: ['*'], plan_types: ['*'] },
    action_config: { on_match: 'stop', require_approval: true, auto_reject: false, notify_admin: true, log_level: 'error' },
    priority: 41,
    is_active: true,
    is_system_rule: true,
  },
  
  // 個人情報漏洩リスク（正規表現）
  {
    rule_code: 'PII_LEAK',
    rule_name: '個人情報漏洩リスク',
    rule_category: 'content_safety',
    rule_definition: {
      type: 'regex',
      patterns: [
        '\\d{3}-\\d{4}-\\d{4}',                    // 電話番号
        '\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}', // クレジットカード
        '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', // メール
      ],
      regex: true,
      severity: 'warning',
      action: 'flag',
    },
    applies_to: { platforms: ['*'], regions: ['*'], content_types: ['*'], plan_types: ['*'] },
    action_config: { on_match: 'flag', require_approval: false, auto_reject: false, notify_admin: false, log_level: 'warning' },
    priority: 60,
    is_active: true,
    is_system_rule: true,
  },
];

// ========================================
// バリデーション関数
// ========================================

function checkPatterns(
  text: string,
  patterns: string[],
  isRegex: boolean = false
): { matched: boolean; pattern?: string; text?: string; position?: { start: number; end: number } } {
  const lowerText = text.toLowerCase();
  
  for (const pattern of patterns) {
    if (isRegex) {
      try {
        const regex = new RegExp(pattern, 'gi');
        const match = regex.exec(text);
        if (match) {
          return {
            matched: true,
            pattern,
            text: match[0],
            position: { start: match.index, end: match.index + match[0].length },
          };
        }
      } catch (e) {
        console.warn(`Invalid regex pattern: ${pattern}`);
      }
    } else {
      const lowerPattern = pattern.toLowerCase();
      const index = lowerText.indexOf(lowerPattern);
      if (index !== -1) {
        return {
          matched: true,
          pattern,
          text: text.substring(index, index + pattern.length),
          position: { start: index, end: index + pattern.length },
        };
      }
    }
  }
  
  return { matched: false };
}

function extractContext(text: string, position: { start: number; end: number }, contextLength: number = 50): string {
  const start = Math.max(0, position.start - contextLength);
  const end = Math.min(text.length, position.end + contextLength);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';
  return prefix + text.substring(start, end) + suffix;
}

function isRuleApplicable(
  rule: PolicyRule,
  context: { platform?: string; region?: string; content_type?: string; plan_type?: string }
): boolean {
  const { applies_to } = rule;
  
  if (!applies_to.platforms.includes('*') && context.platform && !applies_to.platforms.includes(context.platform)) return false;
  if (!applies_to.regions.includes('*') && context.region && !applies_to.regions.includes(context.region)) return false;
  if (!applies_to.content_types.includes('*') && context.content_type && !applies_to.content_types.includes(context.content_type)) return false;
  if (!applies_to.plan_types.includes('*') && context.plan_type && !applies_to.plan_types.includes(context.plan_type)) return false;
  
  return true;
}

/**
 * メインバリデーション関数
 */
export function validateContent(
  content: string,
  rules: PolicyRule[],
  context: { platform?: string; region?: string; content_type?: string; plan_type?: string } = {}
): ValidationResult {
  const startTime = Date.now();
  
  const violations: ViolationDetail[] = [];
  const warnings: ViolationDetail[] = [];
  const aiChecksRequired: AICheckRequest[] = [];
  
  let highestSeverity: Severity = 'info';
  let requiresHumanApproval = false;
  let finalAction: ValidationAction = 'pass';
  
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);
  const severityOrder: Severity[] = ['info', 'warning', 'error', 'critical'];
  
  for (const rule of sortedRules) {
    if (!rule.is_active) continue;
    if (!isRuleApplicable(rule, context)) continue;
    
    const { rule_definition } = rule;
    
    if (rule_definition.type === 'pattern' || rule_definition.type === 'regex') {
      const result = checkPatterns(
        content,
        rule_definition.patterns || [],
        rule_definition.regex || rule_definition.type === 'regex'
      );
      
      if (result.matched) {
        const violation: ViolationDetail = {
          rule_code: rule.rule_code,
          rule_name: rule.rule_name,
          category: rule.rule_category,
          severity: rule_definition.severity,
          action: rule_definition.action,
          matched_pattern: result.pattern,
          matched_text: result.text,
          position: result.position,
          context: result.position ? extractContext(content, result.position) : undefined,
        };
        
        if (rule_definition.severity === 'warning' || rule_definition.severity === 'info') {
          warnings.push(violation);
        } else {
          violations.push(violation);
        }
        
        if (severityOrder.indexOf(rule_definition.severity) > severityOrder.indexOf(highestSeverity)) {
          highestSeverity = rule_definition.severity;
        }
        
        if (rule_definition.action === 'stop' || rule_definition.action === 'reject') {
          finalAction = rule_definition.action;
        } else if (finalAction === 'pass' && rule_definition.action !== 'pass') {
          finalAction = rule_definition.action;
        }
        
        if (rule.action_config.require_approval) {
          requiresHumanApproval = true;
        }
        
        if (rule_definition.ai_check_required) {
          aiChecksRequired.push({
            rule_code: rule.rule_code,
            check_type: rule_definition.type,
            prompt: rule_definition.ai_prompt || `Check content for ${rule.rule_name}`,
            content_preview: result.position ? extractContext(content, result.position, 100) : content.substring(0, 200),
            priority: rule.priority,
          });
        }
      }
    }
    
    if (rule_definition.type === 'ai_check') {
      aiChecksRequired.push({
        rule_code: rule.rule_code,
        check_type: 'ai_check',
        prompt: rule_definition.ai_prompt || `Check content for ${rule.rule_name}`,
        content_preview: content.substring(0, 500),
        priority: rule.priority,
      });
    }
  }
  
  return {
    passed: finalAction === 'pass' || finalAction === 'flag',
    action: finalAction,
    violations,
    warnings,
    ai_checks_required: aiChecksRequired,
    summary: {
      total_rules_checked: sortedRules.filter(r => r.is_active).length,
      errors_count: violations.length,
      warnings_count: warnings.length,
      info_count: 0,
      highest_severity: highestSeverity,
      requires_human_approval: requiresHumanApproval,
    },
    checked_at: new Date().toISOString(),
    execution_time_ms: Date.now() - startTime,
  };
}

// ========================================
// robots.txt チェック
// ========================================

export function parseRobotsTxt(content: string): {
  disallow: string[];
  allow: string[];
  crawl_delay: number | null;
  sitemap: string[];
} {
  const result = { disallow: [] as string[], allow: [] as string[], crawl_delay: null as number | null, sitemap: [] as string[] };
  const lines = content.split('\n');
  let currentUserAgent = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    
    const directive = trimmed.substring(0, colonIndex).toLowerCase().trim();
    const value = trimmed.substring(colonIndex + 1).trim();
    
    switch (directive) {
      case 'user-agent':
        currentUserAgent = value;
        break;
      case 'disallow':
        if ((currentUserAgent === '*' || currentUserAgent === '') && value) {
          result.disallow.push(value);
        }
        break;
      case 'allow':
        if ((currentUserAgent === '*' || currentUserAgent === '') && value) {
          result.allow.push(value);
        }
        break;
      case 'crawl-delay':
        if (currentUserAgent === '*' || currentUserAgent === '') {
          result.crawl_delay = parseInt(value, 10) || null;
        }
        break;
      case 'sitemap':
        result.sitemap.push(value);
        break;
    }
  }
  
  return result;
}

export function checkRobotsTxtRules(path: string, rules: { disallow: string[]; allow: string[] }): boolean {
  let disallowed = false;
  
  for (const rule of rules.disallow) {
    if (path.startsWith(rule)) {
      disallowed = true;
      break;
    }
  }
  
  if (disallowed) {
    for (const rule of rules.allow) {
      if (path.startsWith(rule)) {
        return true;
      }
    }
    return false;
  }
  
  return true;
}

export async function checkRobotsTxt(
  url: string,
  robotsTxtCache?: Map<string, { rules: ReturnType<typeof parseRobotsTxt>; expires_at: Date }>
): Promise<RobotsTxtResult> {
  const urlObj = new URL(url);
  const domain = urlObj.hostname;
  const path = urlObj.pathname;
  
  if (robotsTxtCache) {
    const cached = robotsTxtCache.get(domain);
    if (cached && cached.expires_at > new Date()) {
      const allowed = checkRobotsTxtRules(path, cached.rules);
      return { allowed, domain, path, cached: true, crawl_delay: cached.rules.crawl_delay || undefined };
    }
  }
  
  try {
    const robotsUrl = `${urlObj.protocol}//${domain}/robots.txt`;
    const response = await fetch(robotsUrl, {
      headers: { 'User-Agent': 'N3-PolicyValidator/1.0' },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) {
      return { allowed: true, domain, path, cached: false, reason: 'robots.txt not found' };
    }
    
    const content = await response.text();
    const rules = parseRobotsTxt(content);
    
    if (robotsTxtCache) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      robotsTxtCache.set(domain, { rules, expires_at: expiresAt });
    }
    
    const allowed = checkRobotsTxtRules(path, rules);
    return { allowed, domain, path, cached: false, crawl_delay: rules.crawl_delay || undefined };
    
  } catch (error: any) {
    return { allowed: true, domain, path, cached: false, reason: `Error: ${error.message}` };
  }
}

// ========================================
// n8n用テンプレート: Policy Validator
// ========================================

export const N8N_POLICY_VALIDATOR_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - Policy Validator ノード
// API送信・コンテンツ公開の前に配置
// ========================================

const tenantId = $json.tenant_context?.tenant_id || $env.DEFAULT_TENANT_ID || '0';
const contentToCheck = $json.content || $json.text || $json.description || '';
const context = {
  platform: $json.target_platform || 'default',
  region: $json.target_region || 'JP',
  content_type: $json.content_type || 'general',
  plan_type: $json.tenant_context?.plan_type || 'basic'
};

if (!contentToCheck) {
  return [{ json: { ...($input.first().json), policy_validation: { passed: true, action: 'pass', message: 'No content to validate' } } }];
}

// ポリシールール取得
const rulesResponse = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/core.policy_rules',
  qs: { select: '*', is_active: 'eq.true', order: 'priority.asc' },
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY },
  json: true
}).catch(() => []);

const rules = rulesResponse || [];
const violations = [];
const warnings = [];
let highestSeverity = 'info';
let requiresApproval = false;
let finalAction = 'pass';
const severityOrder = ['info', 'warning', 'error', 'critical'];

for (const rule of rules) {
  const appliesTo = rule.applies_to || {};
  if (!appliesTo.platforms?.includes('*') && context.platform && !appliesTo.platforms?.includes(context.platform)) continue;
  if (!appliesTo.regions?.includes('*') && context.region && !appliesTo.regions?.includes(context.region)) continue;
  
  const ruleDef = rule.rule_definition || {};
  if (ruleDef.type !== 'pattern' && ruleDef.type !== 'regex') continue;
  
  const patterns = ruleDef.patterns || [];
  for (const pattern of patterns) {
    let matched = false, matchedText = '';
    
    if (ruleDef.regex) {
      try {
        const regex = new RegExp(pattern, 'gi');
        const match = regex.exec(contentToCheck);
        if (match) { matched = true; matchedText = match[0]; }
      } catch (e) {}
    } else {
      if (contentToCheck.toLowerCase().includes(pattern.toLowerCase())) {
        matched = true; matchedText = pattern;
      }
    }
    
    if (matched) {
      const violation = { rule_code: rule.rule_code, rule_name: rule.rule_name, severity: ruleDef.severity, action: ruleDef.action, matched_text: matchedText };
      if (ruleDef.severity === 'warning' || ruleDef.severity === 'info') { warnings.push(violation); }
      else { violations.push(violation); }
      
      if (severityOrder.indexOf(ruleDef.severity) > severityOrder.indexOf(highestSeverity)) highestSeverity = ruleDef.severity;
      if (ruleDef.action === 'stop' || ruleDef.action === 'reject') finalAction = ruleDef.action;
      if (rule.action_config?.require_approval) requiresApproval = true;
      break;
    }
  }
}

// 違反ログ保存
if (violations.length > 0) {
  for (const v of violations) {
    await $http.request({
      method: 'POST',
      url: $env.SUPABASE_URL + '/rest/v1/core.policy_violations',
      headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: { tenant_id: tenantId, rule_code: v.rule_code, severity: v.severity, matched_pattern: v.matched_text, action_taken: v.action, requires_human_review: requiresApproval, workflow_id: $workflow.id, execution_id: $execution.id }
    }).catch(() => {});
  }
}

const result = { passed: finalAction === 'pass' || finalAction === 'flag', action: finalAction, violations, warnings, summary: { errors_count: violations.length, warnings_count: warnings.length, highest_severity: highestSeverity, requires_human_approval: requiresApproval } };

if (finalAction === 'stop' || finalAction === 'reject') {
  return [{ json: { ...($input.first().json), policy_validation: result, _error: true, _error_code: 'POLICY_VIOLATION', _error_message: 'Policy violation: ' + violations.map(v => v.rule_name).join(', ') } }];
}

return [{ json: { ...($input.first().json), policy_validation: result } }];
`;

// ========================================
// n8n用テンプレート: robots.txt チェック
// ========================================

export const N8N_ROBOTS_CHECK_TEMPLATE = `
// ========================================
// N3 Empire OS V8 - robots.txt チェックノード
// スクレイピング前に配置
// ========================================

const targetUrl = $json.url || $json.target_url;
if (!targetUrl) {
  return [{ json: { ...($input.first().json), robots_check: { allowed: true, reason: 'No URL' } } }];
}

let domain, path;
try {
  const urlObj = new URL(targetUrl);
  domain = urlObj.hostname;
  path = urlObj.pathname;
} catch (e) {
  return [{ json: { ...($input.first().json), robots_check: { allowed: true, reason: 'Invalid URL' } } }];
}

// キャッシュチェック
const cache = await $http.request({
  method: 'GET',
  url: $env.SUPABASE_URL + '/rest/v1/core.robots_cache',
  qs: { domain: 'eq.' + domain, 'expires_at': 'gt.' + new Date().toISOString() },
  headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY }
}).catch(() => []);

let rules;
if (cache && cache.length > 0) {
  rules = cache[0].parsed_rules;
} else {
  try {
    const robotsContent = await $http.request({ method: 'GET', url: 'https://' + domain + '/robots.txt', timeout: 5000 });
    rules = { disallow: [], allow: [], crawl_delay: null };
    const lines = (robotsContent || '').split('\\n');
    let ua = '';
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const idx = t.indexOf(':');
      if (idx === -1) continue;
      const d = t.substring(0, idx).toLowerCase().trim();
      const v = t.substring(idx + 1).trim();
      if (d === 'user-agent') ua = v;
      else if (d === 'disallow' && (ua === '*' || ua === '') && v) rules.disallow.push(v);
      else if (d === 'allow' && (ua === '*' || ua === '') && v) rules.allow.push(v);
      else if (d === 'crawl-delay' && (ua === '*' || ua === '')) rules.crawl_delay = parseInt(v) || null;
    }
    // キャッシュ保存
    const exp = new Date(); exp.setHours(exp.getHours() + 1);
    await $http.request({
      method: 'POST', url: $env.SUPABASE_URL + '/rest/v1/core.robots_cache',
      headers: { 'apikey': $env.SUPABASE_ANON_KEY, 'Authorization': 'Bearer ' + $env.SUPABASE_SERVICE_KEY, 'Content-Type': 'application/json', 'Prefer': 'resolution=merge-duplicates' },
      body: { domain, parsed_rules: rules, fetch_status: 'success', fetched_at: new Date().toISOString(), expires_at: exp.toISOString() }
    }).catch(() => {});
  } catch (e) {
    return [{ json: { ...($input.first().json), robots_check: { allowed: true, domain, path, reason: 'robots.txt not found' } } }];
  }
}

let allowed = true;
for (const r of (rules.disallow || [])) { if (path.startsWith(r)) { allowed = false; break; } }
if (!allowed) { for (const r of (rules.allow || [])) { if (path.startsWith(r)) { allowed = true; break; } } }

if (!allowed) {
  return [{ json: { ...($input.first().json), robots_check: { allowed, domain, path }, _error: true, _error_code: 'ROBOTS_DISALLOWED', _error_message: 'Disallowed by robots.txt' } }];
}
return [{ json: { ...($input.first().json), robots_check: { allowed, domain, path, crawl_delay: rules.crawl_delay } } }];
`;

// ========================================
// エクスポート
// ========================================

export default {
  // バリデーション
  validateContent,
  SYSTEM_RULES,
  
  // robots.txt
  parseRobotsTxt,
  checkRobotsTxtRules,
  checkRobotsTxt,
  
  // n8nテンプレート
  N8N_POLICY_VALIDATOR_TEMPLATE,
  N8N_ROBOTS_CHECK_TEMPLATE,
};
