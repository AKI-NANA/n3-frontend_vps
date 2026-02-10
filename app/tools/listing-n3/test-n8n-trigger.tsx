'use client';

import { useState } from 'react';
import { triggerListing } from '@/lib/api/n8n-client';

export default function TestN8nTrigger() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setResult(null);

    const response = await triggerListing({
      action: 'list_now',
      ids: [1, 2, 3],
      target: 'ebay',
      account: 'mjt'
    });

    setResult(response);
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold mb-2">n8n統合テスト</h3>
      
      <button 
        onClick={handleTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? '実行中...' : '即時出品テスト'}
      </button>

      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
