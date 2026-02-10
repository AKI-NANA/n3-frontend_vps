// lib/actions/governance-actions.ts
/**
 * 🏛️ N3 Empire OS - Governance Server Actions
 * 
 * registry.jsonに基づき、最新の法典と任務を
 * 一つのプロンプトに統合する「脳」の実装
 */

"use server";

import fs from "fs/promises";
import path from "path";

interface RegistrySource {
  label: string;
  path: string;
  required?: boolean;
}

interface Registry {
  version: string;
  updated_at: string;
  prompt_header: string;
  sources: RegistrySource[];
  security_rules: {
    forbidden_patterns: string[];
    required_imports: string[];
  };
}

interface GenerateResult {
  success: boolean;
  prompt?: string;
  stats?: {
    total_sources: number;
    loaded_sources: number;
    failed_sources: string[];
    total_chars: number;
  };
  error?: string;
}

export async function generateAIPrompt(): Promise<GenerateResult> {
  const root = process.cwd();
  const registryPath = path.join(root, "governance/registry.json");

  try {
    const registryRaw = await fs.readFile(registryPath, "utf-8");
    const registry: Registry = JSON.parse(registryRaw);

    let combinedPrompt = `${registry.prompt_header}\n\n`;
    combinedPrompt += `生成日時: ${new Date().toISOString()}\n`;
    combinedPrompt += `Registry Version: ${registry.version}\n\n`;
    combinedPrompt += `${"=".repeat(60)}\n\n`;

    const loadedSources: string[] = [];
    const failedSources: string[] = [];

    for (const src of registry.sources) {
      try {
        const fullPath = path.join(root, src.path);
        const content = await fs.readFile(fullPath, "utf-8");
        
        combinedPrompt += `${"=".repeat(60)}\n`;
        combinedPrompt += `【${src.label}】\n`;
        combinedPrompt += `FILE_PATH: ${src.path}\n`;
        combinedPrompt += `${"=".repeat(60)}\n\n`;
        combinedPrompt += content + "\n\n";
        
        loadedSources.push(src.label);
      } catch {
        if (src.required) {
          combinedPrompt += `⚠️ CRITICAL: ${src.label} (${src.path}) の読み込みに失敗しました。\n`;
          combinedPrompt += `   このファイルは必須です。管理者に報告してください。\n\n`;
        } else {
          combinedPrompt += `ℹ️ INFO: ${src.label} (${src.path}) はスキップされました（オプション）。\n\n`;
        }
        failedSources.push(src.label);
      }
    }

    combinedPrompt += `${"=".repeat(60)}\n`;
    combinedPrompt += `【SECURITY_RULES】\n`;
    combinedPrompt += `${"=".repeat(60)}\n\n`;
    combinedPrompt += `## 禁止パターン（検出時は警告）\n`;
    for (const pattern of registry.security_rules.forbidden_patterns) {
      combinedPrompt += `- \`${pattern}\`\n`;
    }
    combinedPrompt += `\n## 必須インポート（使用を確認）\n`;
    for (const imp of registry.security_rules.required_imports) {
      combinedPrompt += `- \`${imp}\`\n`;
    }
    combinedPrompt += `\n`;

    combinedPrompt += `${"=".repeat(60)}\n`;
    combinedPrompt += `END OF IMPERIAL KNOWLEDGE\n`;
    combinedPrompt += `${"=".repeat(60)}\n`;

    return {
      success: true,
      prompt: combinedPrompt,
      stats: {
        total_sources: registry.sources.length,
        loaded_sources: loadedSources.length,
        failed_sources: failedSources,
        total_chars: combinedPrompt.length,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "registry.json の読み込みに失敗しました。",
    };
  }
}

export async function getGovernanceFile(label: string): Promise<{
  success: boolean;
  content?: string;
  error?: string;
}> {
  const root = process.cwd();
  const registryPath = path.join(root, "governance/registry.json");

  try {
    const registryRaw = await fs.readFile(registryPath, "utf-8");
    const registry: Registry = JSON.parse(registryRaw);

    const source = registry.sources.find(s => s.label === label);
    if (!source) {
      return { success: false, error: `ソース '${label}' が見つかりません。` };
    }

    const fullPath = path.join(root, source.path);
    const content = await fs.readFile(fullPath, "utf-8");

    return { success: true, content };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "ファイル読み込みエラー",
    };
  }
}

export async function updateTaskFile(content: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const root = process.cwd();
  const taskPath = path.join(root, "governance/TASK.md");

  try {
    const now = new Date();
    const header = `# 📋 N3 Empire OS - CURRENT TASK（現在の任務）

> Updated: ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]} JST
> Status: 🔄 IN PROGRESS

---

`;
    const finalContent = header + content;
    
    await fs.writeFile(taskPath, finalContent, "utf-8");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "TASK.md の更新に失敗しました。",
    };
  }
}

export async function auditCode(code: string): Promise<{
  success: boolean;
  violations: Array<{
    pattern: string;
    count: number;
    severity: "error" | "warning";
  }>;
  clean: boolean;
}> {
  const root = process.cwd();
  const registryPath = path.join(root, "governance/registry.json");

  try {
    const registryRaw = await fs.readFile(registryPath, "utf-8");
    const registry: Registry = JSON.parse(registryRaw);

    const violations: Array<{
      pattern: string;
      count: number;
      severity: "error" | "warning";
    }> = [];

    for (const pattern of registry.security_rules.forbidden_patterns) {
      const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = code.match(regex);
      if (matches && matches.length > 0) {
        violations.push({
          pattern,
          count: matches.length,
          severity: pattern.includes('fetch') || pattern.includes('axios') ? "error" : "warning",
        });
      }
    }

    return {
      success: true,
      violations,
      clean: violations.length === 0,
    };
  } catch {
    return {
      success: false,
      violations: [],
      clean: false,
    };
  }
}
