/**
 * データエクスポート共通ユーティリティ
 */

export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert('エクスポートするデータがありません');
    return;
  }

  // ヘッダー行を作成
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // カンマや改行を含む場合はクォート
        if (typeof value === 'string' && (value.includes(',') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  // BOM付きでダウンロード（Excelで文字化け防止）
  const bom = '\uFEFF';
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(data: any[], filename: string) {
  // 簡易的なExcel形式（TSV）でエクスポート
  if (!data || data.length === 0) {
    alert('エクスポートするデータがありません');
    return;
  }

  const headers = Object.keys(data[0]);
  const tsvContent = [
    headers.join('\t'),
    ...data.map(row => 
      headers.map(header => row[header] ?? '').join('\t')
    )
  ].join('\n');

  const bom = '\uFEFF';
  const blob = new Blob([bom + tsvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToJSON(data: any[], filename: string) {
  if (!data || data.length === 0) {
    alert('エクスポートするデータがありません');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Amazon商品データ用の整形
export function formatAmazonProductsForExport(products: any[]) {
  return products.map(p => ({
    'ASIN': p.asin,
    'タイトル': p.title,
    '現在価格': p.current_price,
    '利益額': p.profit_amount,
    '利益率': p.profit_margin,
    'スコア': p.profit_score,
    'BSR': p.bsr,
    '評価': p.star_rating,
    'Prime': p.is_prime_eligible ? 'Yes' : 'No',
    '在庫': p.in_stock ? 'あり' : 'なし',
    '登録日': p.created_at,
  }));
}

// バッチジョブデータ用の整形
export function formatBatchJobsForExport(jobs: any[]) {
  return jobs.map(j => ({
    'ジョブID': j.job_id,
    'ジョブ名': j.job_name,
    'ステータス': j.status,
    '進捗': `${j.progress_percentage}%`,
    '総タスク数': j.total_tasks,
    '完了': j.tasks_completed,
    '保留': j.tasks_pending,
    '作成日': j.created_at,
  }));
}

// 仕入先データ用の整形
export function formatSuppliersForExport(suppliers: any[]) {
  return suppliers.map(s => ({
    '会社名': s.companyName,
    'URL': s.websiteUrl,
    'リピート候補': s.isRepeatCandidate ? 'Yes' : 'No',
    '最終連絡': s.lastContacted,
    'メモ': s.notes,
    '作成日': s.createdAt,
  }));
}
