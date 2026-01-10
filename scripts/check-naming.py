#!/usr/bin/env python3
"""
N3 Frontend - ファイル命名規則チェッカー
"""

import os
import re
import sys
from pathlib import Path

def check_naming_violations():
    """命名規則違反を検出"""
    violations = []
    dirs = ['app', 'lib', 'components']
    
    for dir_path in dirs:
        if not os.path.exists(dir_path):
            continue
            
        for root, _, files in os.walk(dir_path):
            if 'node_modules' in root or '.next' in root:
                continue
                
            for file in files:
                if not file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                    continue
                    
                # 大文字を含むファイル名を検出
                if re.search(r'[A-Z]', file):
                    violations.append(os.path.join(root, file))
    
    return violations

def main():
    print("🔍 ファイル命名規則チェック")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    
    violations = check_naming_violations()
    
    if not violations:
        print("✅ すべてのファイル名が正しい形式（kebab-case）です！")
        return 0
    
    print(f"❌ {len(violations)} 個のファイルが命名規則違反です：\n")
    
    for file in violations[:20]:  # 最初の20個を表示
        basename = os.path.basename(file)
        # 正しい名前を提案
        name, ext = os.path.splitext(basename)
        correct = re.sub('([a-z0-9])([A-Z])', r'\1-\2', name)
        correct = re.sub('(.)([A-Z][a-z]+)', r'\1-\2', correct).lower()
        
        print(f"  ❌ {file}")
        print(f"     → 推奨: {os.path.dirname(file)}/{correct}{ext}")
        print()
    
    if len(violations) > 20:
        print(f"  ... 他 {len(violations) - 20} ファイル")
    
    print("\n修正方法:")
    print("  npm run fix:naming")
    print("  または")
    print("  python3 fix-casing.py")
    
    return 1

if __name__ == "__main__":
    sys.exit(main())
