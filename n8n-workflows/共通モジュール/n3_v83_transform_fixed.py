#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
N3 Empire OS V8.3 - 140ワークフロー一括変換スクリプト（修正版）
================================================================
python3 n3_v83_transform_fixed.py --input-dir ./PRODUCTION --output-dir ./PRODUCTION_V83
"""

import json, os, re, copy, csv, uuid, argparse
from datetime import datetime
from pathlib import Path

# テーブル名マッピング
TABLE_MAP = {
    "products_master": "n3_products_master",
    "inventory_master": "n3_inventory_master", 
    "ebay_tokens": "n3_ebay_tokens",
    "ebay_shipping_policies": "n3_ebay_shipping_policies",
    "marketplace_accounts": "n3_marketplace_accounts",
    "marketplace_listings": "n3_marketplace_listings",
    "orders": "n3_orders", 
    "order_items": "n3_order_items",
    "shipments": "n3_shipments", 
    "ai_decision_traces": "n3_ai_decision_traces",
    "cost_tracking": "n3_cost_tracking", 
    "burn_limits": "n3_burn_limits",
    "listing_logs": "n3_listing_logs", 
    "audit_logs": "n3_audit_logs",
    "job_queue": "n3_job_queue", 
    "api_health": "n3_api_health",
    "budget_tracker": "n3_budget_tracker",
}

def gen_id(): 
    return f"n3_core_{uuid.uuid4().hex[:8]}"

def transform_sql(sql):
    """SQLクエリ内のテーブル名を変換"""
    result = sql
    count = 0
    
    for old, new in TABLE_MAP.items():
        if old.startswith('n3_'):
            continue
        
        # 各SQLキーワードに対してパターンマッチング
        patterns = [
            (r'\bFROM\s+' + re.escape(old) + r'\b', f'FROM {new}'),
            (r'\bINTO\s+' + re.escape(old) + r'\b', f'INTO {new}'),
            (r'\bUPDATE\s+' + re.escape(old) + r'\b', f'UPDATE {new}'),
            (r'\bJOIN\s+' + re.escape(old) + r'\b', f'JOIN {new}'),
            (r'\bTABLE\s+' + re.escape(old) + r'\b', f'TABLE {new}'),
        ]
        
        for pattern, replacement in patterns:
            new_result = re.sub(pattern, replacement, result, flags=re.IGNORECASE)
            if new_result != result:
                count += 1
                result = new_result
    
    return result, count

def transform_workflow(wf, path, out_dir):
    """ワークフローを変換"""
    result = {
        "path": path, 
        "name": wf.get("name", ""), 
        "changed": False, 
        "changes": []
    }
    
    tw = copy.deepcopy(wf)
    nodes = tw.get("nodes", [])
    conns = tw.get("connections", {})
    
    # Webhook検出 & CORE-Dispatcher挿入
    for i, n in enumerate(nodes):
        if n.get("type") == "n8n-nodes-base.webhook":
            wh_name = n.get("name", "Webhook")
            pos = n.get("position", [250, 300])
            
            disp = {
                "id": gen_id(), 
                "name": "[V8.3] CORE-Dispatcher",
                "type": "n8n-nodes-base.executeWorkflow", 
                "typeVersion": 1,
                "position": [pos[0] + 200, pos[1]],
                "parameters": {
                    "source": "database", 
                    "workflowId": "={{ $vars.CORE_DISPATCHER_ID }}",
                    "mode": "once", 
                    "options": {"waitForSubWorkflow": True}
                },
                "notes": "V8.3: Auth/Circuit-Breaker/Burn-Limit/Queue"
            }
            
            nodes.append(disp)
            orig = conns.get(wh_name, {}).get("main", [[]])
            conns[wh_name] = {"main": [[{"node": disp["name"], "type": "main", "index": 0}]]}
            
            if orig and orig[0]: 
                conns[disp["name"]] = {"main": [orig[0]]}
            
            result["changes"].append(f"Inserted CORE-Dispatcher after {wh_name}")
    
    # テーブル名変換
    for n in nodes:
        p = n.get("parameters", {})
        
        # SQLクエリの変換
        if "query" in p and isinstance(p["query"], str):
            nq, c = transform_sql(p["query"])
            if c > 0: 
                p["query"] = nq
                result["changes"].append(f"SQL: {c} tables transformed")
        
        # テーブル名フィールドの変換
        for k in ["tableId", "table", "tableName"]:
            if k in p and p[k] in TABLE_MAP:
                old_table = p[k]
                p[k] = TABLE_MAP[p[k]]
                result["changes"].append(f"Table: {old_table} → {p[k]}")
        
        # 文字列内のテーブル参照を検索・変換
        for key, value in list(p.items()):
            if isinstance(value, str):
                for old, new in TABLE_MAP.items():
                    if old in value and not old.startswith('n3_'):
                        p[key] = value.replace(old, new)
                        if p[key] != value:
                            result["changes"].append(f"String replace: {old} → {new}")
                        value = p[key]
    
    # メタデータ追加
    tw.setdefault("meta", {})["n3_version"] = "V8.3"
    tw["meta"]["transformed_at"] = datetime.now().isoformat()
    
    result["changed"] = len(result["changes"]) > 0
    return tw, result

def main():
    p = argparse.ArgumentParser(description='N3 V8.3 Workflow Transformer')
    p.add_argument('--input-dir', required=True, help='Input directory')
    p.add_argument('--output-dir', help='Output directory (default: input_V83)')
    p.add_argument('--dry-run', action='store_true', help='Preview without changes')
    p.add_argument('--verbose', '-v', action='store_true', help='Show all changes')
    args = p.parse_args()
    
    in_dir = Path(args.input_dir)
    out_dir = Path(args.output_dir or str(args.input_dir) + "_V83")
    results = []
    errors = []
    
    print(f"\n{'='*60}")
    print(f"N3 V8.3 Transformer (Fixed Version)")
    print(f"{'='*60}")
    print(f"Input:  {in_dir.absolute()}")
    print(f"Output: {out_dir.absolute()}")
    print(f"Mode:   {'DRY RUN' if args.dry_run else 'EXECUTE'}")
    print(f"{'='*60}\n")
    
    json_files = list(in_dir.rglob("*.json"))
    print(f"Found {len(json_files)} JSON files\n")
    
    for f in json_files:
        try:
            content = f.read_text(encoding='utf-8')
            wf = json.loads(content)
            
            # ノードがないファイルはスキップ
            if "nodes" not in wf:
                continue
            
            tw, r = transform_workflow(wf, str(f), out_dir)
            results.append(r)
            
            # 出力
            status = '✓' if r['changed'] else '-'
            print(f"{status} {r['name'][:50]}")
            
            if args.verbose or r['changed']:
                for c in r['changes'][:5]:
                    print(f"    └─ {c}")
                if len(r['changes']) > 5:
                    print(f"    └─ ... and {len(r['changes']) - 5} more changes")
            
            # ファイル出力
            if not args.dry_run and r['changed']:
                op = out_dir / f.relative_to(in_dir)
                op.parent.mkdir(parents=True, exist_ok=True)
                op.write_text(
                    json.dumps(tw, indent=2, ensure_ascii=False), 
                    encoding='utf-8'
                )
                
        except json.JSONDecodeError as e:
            errors.append(f"{f.name}: JSON parse error - {e}")
            print(f"✗ {f.name}: JSON parse error")
        except Exception as e:
            errors.append(f"{f.name}: {e}")
            print(f"✗ {f.name}: {e}")
    
    # サマリー
    changed = sum(1 for r in results if r['changed'])
    print(f"\n{'='*60}")
    print(f"Summary")
    print(f"{'='*60}")
    print(f"Total processed: {len(results)}")
    print(f"Changed:         {changed}")
    print(f"Errors:          {len(errors)}")
    print(f"{'='*60}")
    
    if errors:
        print(f"\nErrors:")
        for e in errors[:10]:
            print(f"  - {e}")
        if len(errors) > 10:
            print(f"  ... and {len(errors) - 10} more errors")
    
    # CSV出力
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    csv_path = f"n3_v83_mapping_{timestamp}.csv"
    
    with open(csv_path, 'w', newline='', encoding='utf-8') as cf:
        w = csv.writer(cf)
        w.writerow(['Path', 'Name', 'Changed', 'Changes'])
        for r in results:
            w.writerow([r['path'], r['name'], r['changed'], '; '.join(r['changes'])])
    
    print(f"\nCSV Report: {csv_path}")
    
    if not args.dry_run and changed > 0:
        print(f"\n✅ {changed} files written to {out_dir}")

if __name__ == "__main__":
    main()
