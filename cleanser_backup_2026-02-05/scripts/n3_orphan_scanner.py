#!/usr/bin/env python3
"""
N3 Orphan File Scanner & Mover
==============================

n3_local_brainの整理ルールに基づき、野良ファイルをスキャンし、
PRODUCTIONのあるべき場所へ移動するスクリプト。

使用方法:
  python3 n3_orphan_scanner.py              # レポート表示
  python3 n3_orphan_scanner.py --script     # 移動スクリプト生成
  python3 n3_orphan_scanner.py --execute    # 実際に移動

整理ルール:
- 01_PRODUCT: 本番コード（app/, lib/, components/等）
- 02_DEV_LAB: 開発中・実験コード
- 03_VAULT: アーカイブ・バックアップ

野良ファイルの定義:
1. ルートディレクトリにある .md, .py, .sh, .csv 等の開発ファイル
2. バックアップフォルダ（*-backup-*, *.backup*）
3. 古いzip/tarアーカイブ
4. 重複フォルダ（*-duplicate）
"""

import os
import sys
import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import fnmatch

# 設定 - スクリプトの場所からルートを計算
SCRIPT_DIR = Path(__file__).parent
N3_ROOT = SCRIPT_DIR.parent  # scripts/ の親ディレクトリ

# 整理ルール
RULES = {
    # 本番コード（01_PRODUCT）に属すべきディレクトリ
    "production_dirs": [
        "app",
        "components", 
        "config",
        "contexts",
        "hooks",
        "layouts",
        "lib",
        "migrations",
        "public",
        "scripts",
        "services",
        "store",
        "types",
        "remotion",
        "mcp-servers",
    ],
    
    # 必須設定ファイル（ルートに残す）
    "required_root_files": [
        ".env",
        ".env.local",
        ".env.example",
        ".gitignore",
        "middleware.ts",
        "next-env.d.ts",
        "next.config.mjs",
        "next.config.ts",
        "package.json",
        "package-lock.json",
        "tailwind.config.ts",
        "tsconfig.json",
        "README.md",
        "ESSENTIAL.md",
    ],
    
    # 開発用ファイル（02_DEV_LABへ移動）
    "dev_file_patterns": [
        "*_HANDOVER*.md",
        "*_INSTRUCTION*.md",
        "*_PLAN*.md",
        "*_GUIDE*.md",
        "*_DEBUG*.md",
        "*_FIX*.md",
        "BLUEPRINT_*.md",
        "FINAL_*.md",
        "SESSION_*.md",
        "TODO*.md",
        "URGENT*.md",
        "*.backup*",
        "sync-*.sh",
    ],
    
    # アーカイブ対象（03_VAULTへ移動）
    "archive_patterns": [
        "*.zip",
        "*.tar",
        "*.tar.gz",
        "*-backup-*",
        "*-duplicate",
        "web-app-backup-*",
    ],
    
    # 無視するディレクトリ
    "ignore_dirs": [
        ".git",
        ".next",
        "node_modules",
        ".mcp-venv",
        "01_PRODUCT",
        "02_DEV_LAB",
        "03_VAULT",
        "docs",  # docsは残す
    ],
    
    # 無視するファイル
    "ignore_files": [
        ".DS_Store",
        ".gitkeep",
        "*.log",
    ],
}


class OrphanFileManager:
    def __init__(self, root_path: Path, dry_run: bool = True):
        self.root = Path(root_path)
        self.dry_run = dry_run
        self.orphans: List[Dict] = []
        
    def scan(self) -> List[Dict]:
        """野良ファイルをスキャン"""
        print(f"\n🔍 Scanning for orphan files in: {self.root}")
        print("=" * 60)
        
        self.orphans = []
        
        # ルートディレクトリのファイルをスキャン
        self._scan_root_files()
        
        # ルートディレクトリのフォルダをスキャン
        self._scan_root_dirs()
        
        return self.orphans
    
    def _scan_root_files(self):
        """ルートディレクトリのファイルをスキャン"""
        for item in self.root.iterdir():
            if item.is_file():
                # 無視するファイル
                if self._should_ignore_file(item.name):
                    continue
                    
                # 必須ファイル
                if item.name in RULES["required_root_files"]:
                    continue
                
                # 野良ファイルを判定
                orphan_info = self._classify_orphan_file(item)
                if orphan_info:
                    self.orphans.append(orphan_info)
    
    def _scan_root_dirs(self):
        """ルートディレクトリのフォルダをスキャン"""
        for item in self.root.iterdir():
            if item.is_dir():
                # 無視するディレクトリ
                if item.name in RULES["ignore_dirs"]:
                    continue
                
                # 本番ディレクトリ
                if item.name in RULES["production_dirs"]:
                    continue
                
                # 野良フォルダを判定
                orphan_info = self._classify_orphan_dir(item)
                if orphan_info:
                    self.orphans.append(orphan_info)
    
    def _should_ignore_file(self, filename: str) -> bool:
        """ファイルを無視すべきか判定"""
        for pattern in RULES["ignore_files"]:
            if fnmatch.fnmatch(filename, pattern):
                return True
        return False
    
    def _classify_orphan_file(self, path: Path) -> Optional[Dict]:
        """野良ファイルを分類"""
        name = path.name
        
        # 開発用ファイルパターン
        for pattern in RULES["dev_file_patterns"]:
            if fnmatch.fnmatch(name, pattern):
                return {
                    "path": str(path),
                    "name": name,
                    "type": "file",
                    "category": "dev",
                    "destination": f"02_DEV_LAB/docs/{name}",
                    "reason": f"Matches dev pattern: {pattern}",
                }
        
        # アーカイブパターン
        for pattern in RULES["archive_patterns"]:
            if fnmatch.fnmatch(name, pattern):
                return {
                    "path": str(path),
                    "name": name,
                    "type": "file",
                    "category": "archive",
                    "destination": f"03_VAULT/archives/{name}",
                    "reason": f"Matches archive pattern: {pattern}",
                }
        
        # その他の開発ファイル
        ext = path.suffix.lower()
        if ext in [".md", ".py", ".sh", ".csv", ".sql"]:
            return {
                "path": str(path),
                "name": name,
                "type": "file",
                "category": "dev",
                "destination": f"02_DEV_LAB/misc/{name}",
                "reason": f"Development file ({ext}) in root",
            }
        
        return None
    
    def _classify_orphan_dir(self, path: Path) -> Optional[Dict]:
        """野良フォルダを分類"""
        name = path.name
        
        # バックアップフォルダ
        for pattern in RULES["archive_patterns"]:
            if fnmatch.fnmatch(name, pattern):
                return {
                    "path": str(path),
                    "name": name,
                    "type": "directory",
                    "category": "archive",
                    "destination": f"03_VAULT/backups/{name}",
                    "reason": f"Matches archive pattern: {pattern}",
                }
        
        # yogaフォルダは特殊（Remotion依存）
        if name == "yoga":
            return None
            
        # その他の野良フォルダ
        return {
            "path": str(path),
            "name": name,
            "type": "directory",
            "category": "unknown",
            "destination": f"03_VAULT/misc/{name}",
            "reason": "Unknown directory in root",
        }
    
    def generate_report(self) -> str:
        """レポートを生成"""
        report = []
        report.append("=" * 70)
        report.append("N3 Orphan File Report")
        report.append(f"Generated: {datetime.now().isoformat()}")
        report.append(f"Root: {self.root}")
        report.append("=" * 70)
        report.append("")
        
        if not self.orphans:
            report.append("✅ No orphan files found!")
            return "\n".join(report)
        
        report.append(f"🚨 Found {len(self.orphans)} orphan items:")
        report.append("")
        
        # カテゴリ別に整理
        by_category = {}
        for orphan in self.orphans:
            cat = orphan["category"]
            if cat not in by_category:
                by_category[cat] = []
            by_category[cat].append(orphan)
        
        for category, items in by_category.items():
            report.append(f"\n📁 {category.upper()} ({len(items)} items)")
            report.append("-" * 50)
            for item in items:
                icon = "📄" if item["type"] == "file" else "📂"
                report.append(f"  {icon} {item['name']}")
                report.append(f"     → {item['destination']}")
                report.append(f"     Reason: {item['reason']}")
        
        report.append("")
        report.append("=" * 70)
        return "\n".join(report)
    
    def generate_move_script(self) -> str:
        """移動スクリプトを生成"""
        lines = []
        lines.append("#!/bin/bash")
        lines.append("# N3 Orphan File Mover")
        lines.append(f"# Generated: {datetime.now().isoformat()}")
        lines.append("")
        lines.append(f"cd '{self.root}'")
        lines.append("")
        
        if not self.orphans:
            lines.append("echo 'No orphan files to move!'")
            return "\n".join(lines)
        
        lines.append(f"echo 'Moving {len(self.orphans)} orphan items...'")
        lines.append("")
        
        # 必要なディレクトリを作成
        dest_dirs = set()
        for orphan in self.orphans:
            dest = orphan["destination"]
            dest_dir = os.path.dirname(dest)
            if dest_dir:
                dest_dirs.add(dest_dir)
        
        lines.append("# Create destination directories")
        for dest_dir in sorted(dest_dirs):
            lines.append(f"mkdir -p '{dest_dir}'")
        lines.append("")
        
        # 移動コマンド
        lines.append("# Move orphan files")
        for orphan in self.orphans:
            src = orphan["name"]
            dest = orphan["destination"]
            lines.append(f"# {orphan['reason']}")
            if orphan["type"] == "directory":
                lines.append(f"mv '{src}' '{dest}'")
            else:
                lines.append(f"mv '{src}' '{dest}'")
            lines.append("")
        
        lines.append("echo '✅ Done!'")
        return "\n".join(lines)
    
    def execute_moves(self) -> List[Dict]:
        """移動を実行"""
        results = []
        
        for orphan in self.orphans:
            src = Path(orphan["path"])
            dest = self.root / orphan["destination"]
            
            result = {
                "source": str(src),
                "destination": str(dest),
                "success": False,
                "message": "",
            }
            
            if self.dry_run:
                result["success"] = True
                result["message"] = "DRY RUN - Would move"
            else:
                try:
                    # 宛先ディレクトリを作成
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    
                    # 移動
                    shutil.move(str(src), str(dest))
                    
                    result["success"] = True
                    result["message"] = "Moved successfully"
                except Exception as e:
                    result["message"] = f"Error: {str(e)}"
            
            results.append(result)
        
        return results


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="N3 Orphan File Manager")
    parser.add_argument("--root", default=str(N3_ROOT), help="N3 root directory")
    parser.add_argument("--dry-run", action="store_true", default=True, help="Dry run mode (default)")
    parser.add_argument("--execute", action="store_true", help="Actually move files")
    parser.add_argument("--report", action="store_true", help="Generate report only")
    parser.add_argument("--script", action="store_true", help="Generate move script")
    parser.add_argument("--output", help="Output file for report/script")
    
    args = parser.parse_args()
    
    dry_run = not args.execute
    manager = OrphanFileManager(args.root, dry_run=dry_run)
    
    # スキャン
    orphans = manager.scan()
    
    if args.report or not (args.script or args.execute):
        # レポート生成
        report = manager.generate_report()
        print(report)
        
        if args.output:
            with open(args.output, "w") as f:
                f.write(report)
            print(f"\n📝 Report saved to: {args.output}")
    
    if args.script:
        # スクリプト生成
        script = manager.generate_move_script()
        
        if args.output:
            output_path = args.output
        else:
            output_path = str(N3_ROOT / "scripts" / "move_orphans.sh")
        
        with open(output_path, "w") as f:
            f.write(script)
        os.chmod(output_path, 0o755)
        print(f"\n📜 Script saved to: {output_path}")
        print(f"   Run with: bash {output_path}")
    
    if args.execute:
        print("\n🚀 Executing moves...")
        results = manager.execute_moves()
        
        success_count = sum(1 for r in results if r["success"])
        print(f"\n✅ Completed: {success_count}/{len(results)} moves successful")
        
        for r in results:
            icon = "✓" if r["success"] else "✗"
            print(f"  {icon} {Path(r['source']).name}: {r['message']}")


if __name__ == "__main__":
    main()
