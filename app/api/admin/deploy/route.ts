// app/api/admin/deploy/route.ts
/**
 * N3 デプロイAPI
 * 
 * エンドポイント:
 * POST /api/admin/deploy
 * 
 * アクション:
 * - scan: 野良ファイルスキャン
 * - move-orphans: 野良ファイル移動
 * - promote: DEV_LAB → PRODUCT 昇格
 * - sync-root: ルートのコードを01_PRODUCTへ同期
 * - sync-to-vps-repo: 開発 → VPSリポジトリ同期
 * - push-vps-repo: VPSリポジトリをPush
 * - push: Git プッシュ（開発リポジトリ）
 * - status: Git/VPS状態確認
 * - vps-pull: VPSでpull & restart
 * - clean-deploy: 完全クリーンデプロイ
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

// パス設定（環境変数または固定値）
const N3_ROOT = process.env.N3_ROOT || '/Users/AKI-NANA/n3-frontend_new';
const N3_VPS_LOCAL = process.env.N3_VPS_LOCAL || '/Users/AKI-NANA/n3-frontend_vps';
const VPS_HOST = process.env.VPS_HOST || '160.16.120.186';
const VPS_USER = process.env.VPS_USER || 'ubuntu';
const VPS_PATH = process.env.VPS_PATH || '~/n3-frontend-vps';

// 簡易認証
const ADMIN_KEY = process.env.ADMIN_DEPLOY_KEY || 'n3-deploy-2026';

interface DeployRequest {
  action: string;
  params?: Record<string, any>;
  adminKey?: string;
}

interface DeployResponse {
  success: boolean;
  action: string;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

// ========================================
// ユーティリティ
// ========================================

function matchPattern(name: string, pattern: string): boolean {
  const regex = new RegExp('^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$');
  return regex.test(name);
}

// ========================================
// 野良ファイル管理
// ========================================

async function scanOrphans(): Promise<any> {
  const orphanPatterns = {
    dev: ['BLUEPRINT_*.md', 'FINAL_*.md', 'SESSION_*.md', '*_HANDOVER*.md', '*_DEBUG*.md', 'TODO*.md', 'URGENT*.md', 'sync-*.sh'],
    archive: ['*.zip', '*.tar', '*.tar.gz', '*-backup-*', 'web-app-backup-*'],
  };
  const requiredRootFiles = ['.env', '.env.local', '.env.local.example', '.gitignore', 'middleware.ts', 'next-env.d.ts', 'next.config.mjs', 'next.config.ts', 'package.json', 'package-lock.json', 'tailwind.config.ts', 'tsconfig.json', 'README.md', 'ESSENTIAL.md'];
  const ignoreDirs = ['.git', '.next', 'node_modules', '.mcp-venv', '01_PRODUCT', '02_DEV_LAB', '03_VAULT', 'docs'];
  const productionDirs = ['app', 'components', 'config', 'contexts', 'hooks', 'layouts', 'lib', 'migrations', 'public', 'scripts', 'services', 'store', 'types', 'remotion', 'mcp-servers', 'n8n-workflows'];

  const orphans: any[] = [];
  try {
    const items = await fs.readdir(N3_ROOT, { withFileTypes: true });
    for (const item of items) {
      const name = item.name;
      if (name.startsWith('.') && !requiredRootFiles.includes(name)) {
        if (item.isDirectory() && ignoreDirs.includes(name)) continue;
      }
      if (ignoreDirs.includes(name) || productionDirs.includes(name) || requiredRootFiles.includes(name)) continue;

      let matched = false;
      for (const pattern of orphanPatterns.dev) {
        if (matchPattern(name, pattern)) {
          orphans.push({ name, path: `/${name}`, destination: item.isDirectory() ? '02_DEV_LAB/misc/' : '02_DEV_LAB/docs/', reason: `Matches dev pattern: ${pattern}`, category: 'dev', isDirectory: item.isDirectory() });
          matched = true;
          break;
        }
      }
      if (!matched) {
        for (const pattern of orphanPatterns.archive) {
          if (matchPattern(name, pattern)) {
            orphans.push({ name, path: `/${name}`, destination: item.isDirectory() ? '03_VAULT/backups/' : '03_VAULT/archives/', reason: `Matches archive pattern: ${pattern}`, category: 'archive', isDirectory: item.isDirectory() });
            matched = true;
            break;
          }
        }
      }
      if (!matched && item.isFile()) {
        const ext = path.extname(name).toLowerCase();
        if (['.md', '.py', '.sh', '.csv', '.sql'].includes(ext)) {
          orphans.push({ name, path: `/${name}`, destination: '02_DEV_LAB/misc/', reason: `Development file (${ext}) in root`, category: 'dev', isDirectory: false });
        }
      }
    }
    return { orphans, count: orphans.length };
  } catch (error: any) {
    throw new Error(`Scan failed: ${error.message}`);
  }
}

async function moveOrphans(files?: string[]): Promise<any> {
  const { orphans } = await scanOrphans();
  const toMove = files ? orphans.filter((o: any) => files.includes(o.name)) : orphans;
  const results: any[] = [];
  for (const orphan of toMove) {
    const src = path.join(N3_ROOT, orphan.name);
    const destDir = path.join(N3_ROOT, orphan.destination);
    const dest = path.join(destDir, orphan.name);
    try {
      await fs.mkdir(destDir, { recursive: true });
      await fs.rename(src, dest);
      results.push({ name: orphan.name, success: true, destination: orphan.destination });
    } catch (error: any) {
      results.push({ name: orphan.name, success: false, error: error.message });
    }
  }
  return { moved: results.filter(r => r.success).length, results };
}

// ========================================
// 同期・昇格
// ========================================

async function syncRootToProduct(): Promise<any> {
  const syncDirs = ['app', 'components', 'config', 'contexts', 'hooks', 'layouts', 'lib', 'migrations', 'public', 'scripts', 'services', 'store', 'types', 'n8n-workflows'];
  const syncFiles = ['middleware.ts', 'next.config.ts', 'next.config.mjs', 'tailwind.config.ts', 'tsconfig.json', 'package.json', 'package-lock.json'];
  const productDir = path.join(N3_ROOT, '01_PRODUCT');
  const results: any[] = [];

  try {
    await fs.mkdir(productDir, { recursive: true });
    for (const dir of syncDirs) {
      const src = path.join(N3_ROOT, dir);
      const dest = path.join(productDir, dir);
      try {
        await fs.access(src);
        await execAsync(`rsync -av --delete --exclude='*.backup*' --exclude='.DS_Store' "${src}/" "${dest}/"`);
        results.push({ name: dir, type: 'directory', success: true });
      } catch {
        results.push({ name: dir, type: 'directory', success: false, error: 'Not found' });
      }
    }
    for (const file of syncFiles) {
      const src = path.join(N3_ROOT, file);
      const dest = path.join(productDir, file);
      try {
        await fs.copyFile(src, dest);
        results.push({ name: file, type: 'file', success: true });
      } catch {
        results.push({ name: file, type: 'file', success: false, error: 'Not found' });
      }
    }
    return { synced: results.filter(r => r.success).length, total: results.length, results };
  } catch (error: any) {
    throw new Error(`Sync failed: ${error.message}`);
  }
}

async function promote(type?: 'n8n' | 'sql' | 'all'): Promise<any> {
  const devLab = path.join(N3_ROOT, '02_DEV_LAB');
  const product = path.join(N3_ROOT, '01_PRODUCT');
  const results: any[] = [];
  const promoteType = type || 'all';

  if (promoteType === 'n8n' || promoteType === 'all') {
    const n8nSrc = path.join(devLab, 'n8n-workflows');
    const n8nDest = path.join(product, 'n8n-workflows');
    try {
      await fs.access(n8nSrc);
      const files = await fs.readdir(n8nSrc);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      await fs.mkdir(n8nDest, { recursive: true });
      for (const file of jsonFiles) {
        await fs.copyFile(path.join(n8nSrc, file), path.join(n8nDest, file));
        results.push({ name: file, type: 'n8n', success: true });
      }
    } catch {}
  }

  if (promoteType === 'sql' || promoteType === 'all') {
    const sqlSrc = path.join(devLab, 'supabase', 'migrations');
    const sqlDest = path.join(N3_ROOT, 'migrations');
    try {
      await fs.access(sqlSrc);
      const files = await fs.readdir(sqlSrc);
      const sqlFiles = files.filter(f => f.endsWith('.sql'));
      await fs.mkdir(sqlDest, { recursive: true });
      for (const file of sqlFiles) {
        const srcPath = path.join(sqlSrc, file);
        const destPath = path.join(sqlDest, file);
        try {
          const srcContent = await fs.readFile(srcPath, 'utf-8');
          const destContent = await fs.readFile(destPath, 'utf-8');
          if (srcContent !== destContent) {
            await fs.copyFile(srcPath, destPath);
            results.push({ name: file, type: 'sql', success: true, action: 'updated' });
          } else {
            results.push({ name: file, type: 'sql', success: true, action: 'unchanged' });
          }
        } catch {
          await fs.copyFile(srcPath, destPath);
          results.push({ name: file, type: 'sql', success: true, action: 'new' });
        }
      }
    } catch {}
  }
  return { promoted: results.filter(r => r.success && r.action !== 'unchanged').length, total: results.length, results };
}

// ========================================
// 開発 → VPSリポジトリ同期
// ========================================

async function syncToVpsRepo(): Promise<any> {
  try {
    const excludes = ['.git', 'node_modules', '.next', '.env*', '01_PRODUCT', '02_DEV_LAB', '03_VAULT', '.DS_Store'].map(e => `--exclude='${e}'`).join(' ');
    await execAsync(`rsync -av --delete ${excludes} "${N3_ROOT}/" "${N3_VPS_LOCAL}/"`);
    const { stdout: status } = await execAsync('git status --porcelain', { cwd: N3_VPS_LOCAL });
    const changes = status.trim().split('\n').filter(l => l.trim());
    return { success: true, message: 'Synced to VPS repository', source: N3_ROOT, destination: N3_VPS_LOCAL, changesInVpsRepo: changes.length };
  } catch (error: any) {
    throw new Error(`Sync to VPS repo failed: ${error.message}`);
  }
}

async function pushVpsRepo(message?: string): Promise<any> {
  try {
    const { stdout: status } = await execAsync('git status --porcelain', { cwd: N3_VPS_LOCAL });
    const changes = status.trim().split('\n').filter(l => l.trim());
    if (changes.length === 0) return { success: true, message: 'No changes to commit', pushed: false };

    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const commitMsg = message || `deploy: ${changes.length} files [${timestamp}]`;

    await execAsync('git add -A', { cwd: N3_VPS_LOCAL });
    await execAsync(`git commit -m "${commitMsg}"`, { cwd: N3_VPS_LOCAL });
    const { stdout: beforeCommit } = await execAsync('git rev-parse --short HEAD~1', { cwd: N3_VPS_LOCAL }).catch(() => ({ stdout: 'unknown' }));
    await execAsync('git push origin main', { cwd: N3_VPS_LOCAL });
    const { stdout: newCommit } = await execAsync('git rev-parse --short HEAD', { cwd: N3_VPS_LOCAL });

    return { success: true, message: 'Pushed to VPS repository', pushed: true, commitMessage: commitMsg, previousCommit: beforeCommit.trim(), newCommit: newCommit.trim(), changesCommitted: changes.length };
  } catch (error: any) {
    throw new Error(`Push VPS repo failed: ${error.message}`);
  }
}

async function getVpsRepoStatus(): Promise<any> {
  try {
    const { stdout: branch } = await execAsync('git branch --show-current', { cwd: N3_VPS_LOCAL });
    const { stdout: commit } = await execAsync('git rev-parse --short HEAD', { cwd: N3_VPS_LOCAL });
    const { stdout: status } = await execAsync('git status --porcelain', { cwd: N3_VPS_LOCAL });
    const { stdout: remote } = await execAsync('git remote get-url origin', { cwd: N3_VPS_LOCAL }).catch(() => ({ stdout: '' }));
    const changes = status.trim().split('\n').filter(l => l.trim());
    return { path: N3_VPS_LOCAL, branch: branch.trim(), commit: commit.trim(), remote: remote.trim(), hasChanges: changes.length > 0, changeCount: changes.length, changes: changes.slice(0, 20) };
  } catch (error: any) {
    return { error: 'VPS repo not found', message: error.message, path: N3_VPS_LOCAL };
  }
}

// ========================================
// Git操作（開発リポジトリ）
// ========================================

async function getGitStatus(): Promise<any> {
  try {
    const { stdout: branch } = await execAsync('git branch --show-current', { cwd: N3_ROOT });
    const { stdout: commit } = await execAsync('git rev-parse --short HEAD', { cwd: N3_ROOT });
    const { stdout: status } = await execAsync('git status --porcelain', { cwd: N3_ROOT });
    const { stdout: remote } = await execAsync('git remote get-url origin', { cwd: N3_ROOT }).catch(() => ({ stdout: '' }));
    const changes = status.trim().split('\n').filter(l => l.trim());
    return { branch: branch.trim(), commit: commit.trim(), remote: remote.trim(), hasChanges: changes.length > 0, changeCount: changes.length, changes: changes.slice(0, 20) };
  } catch (error: any) {
    return { error: 'Git not initialized', message: error.message };
  }
}

async function gitPush(message?: string): Promise<any> {
  try {
    const status = await getGitStatus();
    if (status.error) throw new Error(status.error);
    if (!status.hasChanges) return { success: true, message: 'No changes to commit', pushed: false };

    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const commitMsg = message || `update: ${status.changeCount} files [${timestamp}]`;

    await execAsync('git add -A', { cwd: N3_ROOT });
    await execAsync(`git commit -m "${commitMsg}"`, { cwd: N3_ROOT });
    await execAsync(`git push origin ${status.branch}`, { cwd: N3_ROOT });
    const newStatus = await getGitStatus();

    return { success: true, message: 'Pushed successfully', pushed: true, commitMessage: commitMsg, previousCommit: status.commit, newCommit: newStatus.commit, changesCommitted: status.changeCount };
  } catch (error: any) {
    throw new Error(`Git push failed: ${error.message}`);
  }
}

// ========================================
// VPS操作
// ========================================

async function getVpsStatus(): Promise<any> {
  try {
    const sshCmd = `ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_HOST}`;
    const { stdout: commit } = await execAsync(`${sshCmd} 'cd ${VPS_PATH} && git rev-parse --short HEAD 2>/dev/null || echo "unknown"'`);
    const { stdout: pm2Status } = await execAsync(`${sshCmd} 'pm2 jlist 2>/dev/null || echo "[]"'`).catch(() => ({ stdout: '[]' }));

    let pm2Info = null;
    try {
      const pm2List = JSON.parse(pm2Status);
      const n3Process = pm2List.find((p: any) => p.name === 'n3');
      if (n3Process) {
        pm2Info = { status: n3Process.pm2_env?.status, uptime: n3Process.pm2_env?.pm_uptime, restarts: n3Process.pm2_env?.restart_time, memory: n3Process.monit?.memory };
      }
    } catch {}

    return { reachable: true, commit: commit.trim(), host: VPS_HOST, path: VPS_PATH, pm2: pm2Info };
  } catch (error: any) {
    return { reachable: false, error: error.message, host: VPS_HOST };
  }
}

async function vpsPull(): Promise<any> {
  try {
    const sshCmd = `ssh ${VPS_USER}@${VPS_HOST}`;
    const { stdout: pullResult } = await execAsync(`${sshCmd} 'cd ${VPS_PATH} && git pull origin main 2>&1'`);
    const { stdout: restartResult } = await execAsync(`${sshCmd} 'pm2 restart n3 2>&1 || echo "PM2 restart skipped"'`);
    const { stdout: newCommit } = await execAsync(`${sshCmd} 'cd ${VPS_PATH} && git rev-parse --short HEAD'`);
    return { success: true, pullResult: pullResult.trim(), restartResult: restartResult.trim(), newCommit: newCommit.trim() };
  } catch (error: any) {
    throw new Error(`VPS pull failed: ${error.message}`);
  }
}

async function cleanDeploy(): Promise<any> {
  try {
    const sshCmd = `ssh ${VPS_USER}@${VPS_HOST}`;
    const dirsToClean = ['app', 'lib', 'components', 'config', 'contexts', 'hooks', 'layouts', 'migrations', 'n8n-workflows', 'public', 'scripts', 'services', 'store', 'types'].join(' ');
    await execAsync(`${sshCmd} 'cd ${VPS_PATH} && rm -rf ${dirsToClean}'`);
    await execAsync(`${sshCmd} 'cd ${VPS_PATH} && git checkout . && git pull origin main'`);
    await execAsync(`${sshCmd} 'cd ${VPS_PATH} && npm install --production'`);
    await execAsync(`${sshCmd} 'pm2 restart n3'`);
    const { stdout: newCommit } = await execAsync(`${sshCmd} 'cd ${VPS_PATH} && git rev-parse --short HEAD'`);
    return { success: true, message: 'Clean deploy completed', newCommit: newCommit.trim() };
  } catch (error: any) {
    throw new Error(`Clean deploy failed: ${error.message}`);
  }
}

// ========================================
// メインハンドラー
// ========================================

export async function POST(request: NextRequest): Promise<NextResponse<DeployResponse>> {
  const timestamp = new Date().toISOString();

  try {
    const body: DeployRequest = await request.json();
    const { action, params, adminKey } = body;

    if (adminKey !== ADMIN_KEY) {
      return NextResponse.json({ success: false, action, message: 'Unauthorized', error: 'Invalid admin key', timestamp }, { status: 401 });
    }

    let result: any;

    switch (action) {
      case 'scan': result = await scanOrphans(); break;
      case 'move-orphans': result = await moveOrphans(params?.files); break;
      case 'sync-root': result = await syncRootToProduct(); break;
      case 'promote': result = await promote(params?.type); break;
      case 'git-status': result = await getGitStatus(); break;
      case 'push': result = await gitPush(params?.message); break;
      case 'sync-to-vps-repo': result = await syncToVpsRepo(); break;
      case 'push-vps-repo': result = await pushVpsRepo(params?.message); break;
      case 'vps-repo-status': result = await getVpsRepoStatus(); break;
      case 'vps-status': result = await getVpsStatus(); break;
      case 'vps-pull': result = await vpsPull(); break;
      case 'clean-deploy': result = await cleanDeploy(); break;
      case 'full-status':
        const [gitStatus, vpsRepoStatus, vpsStatus, orphanStatus] = await Promise.all([
          getGitStatus(), getVpsRepoStatus(), getVpsStatus(), scanOrphans(),
        ]);
        result = { git: gitStatus, vpsRepo: vpsRepoStatus, vps: vpsStatus, orphans: orphanStatus };
        break;
      default:
        return NextResponse.json({ success: false, action, message: 'Unknown action', error: `Action '${action}' is not supported`, timestamp }, { status: 400 });
    }

    return NextResponse.json({ success: true, action, message: 'Action completed successfully', data: result, timestamp });

  } catch (error: any) {
    console.error('Deploy API error:', error);
    return NextResponse.json({ success: false, action: 'unknown', message: 'Action failed', error: error.message, timestamp }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString();
  try {
    const [gitStatus, vpsRepoStatus, vpsStatus, orphanStatus] = await Promise.all([
      getGitStatus(),
      getVpsRepoStatus().catch(() => ({ error: 'Not found' })),
      getVpsStatus().catch(() => ({ reachable: false, error: 'Connection failed' })),
      scanOrphans(),
    ]);
    return NextResponse.json({ success: true, data: { git: gitStatus, vpsRepo: vpsRepoStatus, vps: vpsStatus, orphans: orphanStatus, timestamp } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, timestamp }, { status: 500 });
  }
}
