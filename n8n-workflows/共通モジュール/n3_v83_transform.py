#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
N3 Empire OS V8.3 - 140ワークフロー一括変換スクリプト（完全版）
================================================================
python3 n3_v83_transform.py --input-dir ./PRODUCTION --output-dir ./PRODUCTION_V83
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
    "orders": "n3_orders", "order_items": "n3_order_items",
    "shipments": "n3_shipments", "ai_decision_traces": "n3_ai_decision_traces",
    "cost_tracking": "n3_cost_tracking", "burn_limits": "n3_burn_limits",
    "listing_logs": "n3_listing_logs", "audit_logs": "n3_audit_logs",
    "job_queue": "n3_job_queue", "api_health": "n3_api_health",
    "budget_tracker": "n3_budget_tracker",
}

def gen_id(): return f"n3_core_{uuid.uuid4().hex[:8]}"

def transform_sql(sql):
    t, c = sql, 0
    for old, new in TABLE_MAP.items():
        if old.startswith('n3_'): continue
        for p in [rf'\bFROM\s+{old}\b', rf'\bINTO\s+{old}\b', rf'\bUPDATE\s+{old}\b', rf'\bJOIN\s+{old}\b']:
            nt = re.sub(p, p.replace(old, new).replace(r'\b',''), t, flags=re.IGNORECASE)
            if nt != t: c += 1; t = nt
    return t, c

def transform_workflow(wf, path, out_dir):
    result = {"path": path, "name": wf.get("name",""), "changed": False, "changes": []}
    tw = copy.deepcopy(wf)
    nodes, conns = tw.get("nodes", []), tw.get("connections", {})
    
    # Webhook検出 & CORE-Dispatcher挿入
    for i, n in enumerate(nodes):
        if n.get("type") == "n8n-nodes-base.webhook":
            wh_name, pos = n.get("name", "Webhook"), n.get("position", [250, 300])
            disp = {
                "id": gen_id(), "name": "[V8.3] CORE-Dispatcher",
                "type": "n8n-nodes-base.executeWorkflow", "typeVersion": 1,
                "position": [pos[0] + 200, pos[1]],
                "parameters": {"source": "database", "workflowId": "={{ $vars.CORE_DISPATCHER_ID }}",
                              "mode": "once", "options": {"waitForSubWorkflow": True}},
                "notes": "V8.3: Auth/Circuit-Breaker/Burn-Limit/Queue"
            }
            nodes.append(disp)
            orig = conns.get(wh_name, {}).get("main", [[]])
            conns[wh_name] = {"main": [[{"node": disp["name"], "type": "main", "index": 0}]]}
            if orig and orig[0]: conns[disp["name"]] = {"main": [orig[0]]}
            result["changes"].append(f"Inserted CORE-Dispatcher after {wh_name}")
    
    # テーブル名変換
    for n in nodes:
        p = n.get("parameters", {})
        if "query" in p:
            nq, c = transform_sql(p["query"])
            if c > 0: p["query"] = nq; result["changes"].append(f"SQL: {c} tables")
        for k in ["tableId", "table"]:
            if k in p and p[k] in TABLE_MAP:
                result["changes"].append(f"{p[k]} → {TABLE_MAP[p[k]]}")
                p[k] = TABLE_MAP[p[k]]
    
    # メタデータ
    tw.setdefault("meta", {})["n3_version"] = "V8.3"
    tw["meta"]["transformed_at"] = datetime.now().isoformat()
    
    result["changed"] = len(result["changes"]) > 0
    return tw, result

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--input-dir', required=True)
    p.add_argument('--output-dir')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    
    in_dir, out_dir = Path(args.input_dir), Path(args.output_dir or args.input_dir + "_V83")
    results = []
    
    print(f"\n{'='*50}\nN3 V8.3 Transformer\n{'='*50}")
    print(f"Input: {in_dir}\nOutput: {out_dir}\nMode: {'DRY RUN' if args.dry_run else 'EXECUTE'}\n")
    
    for f in in_dir.rglob("*.json"):
        try:
            wf = json.loads(f.read_text(encoding='utf-8'))
            if "nodes" not in wf: continue
            tw, r = transform_workflow(wf, str(f), out_dir)
            results.append(r)
            print(f"{'✓' if r['changed'] else '-'} {r['name']}")
            for c in r['changes'][:2]: print(f"    └─ {c}")
            if not args.dry_run and r['changed']:
                op = out_dir / f.relative_to(in_dir)
                op.parent.mkdir(parents=True, exist_ok=True)
                op.write_text(json.dumps(tw, indent=2, ensure_ascii=False), encoding='utf-8')
        except Exception as e: print(f"✗ {f.name}: {e}")
    
    changed = sum(1 for r in results if r['changed'])
    print(f"\n{'='*50}\nTotal: {len(results)} | Changed: {changed}\n{'='*50}")
    
    # CSV出力
    csv_path = f"n3_v83_mapping_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    with open(csv_path, 'w', newline='', encoding='utf-8') as cf:
        w = csv.writer(cf)
        w.writerow(['Path', 'Name', 'Changed', 'Changes'])
        for r in results: w.writerow([r['path'], r['name'], r['changed'], '; '.join(r['changes'])])
    print(f"CSV: {csv_path}")

if __name__ == "__main__": main()
