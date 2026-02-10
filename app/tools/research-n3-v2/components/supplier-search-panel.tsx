/**
 * Supplier Search Panel
 * 仕入先探索パネル
 */

'use client';

import React, { useState } from 'react';
import { Search, Globe, Package, Store, ExternalLink, Loader2 } from 'lucide-react';

interface SupplierSearchPanelProps {
  selectedItems: any[];
}

export default function SupplierSearchPanel({ selectedItems }: SupplierSearchPanelProps) {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchSuppliers = async (item: any) => {
    setIsSearching(true);
    // Simulate supplier search
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSearchResults([
      {
        id: '1',
        name: 'Amazon JP',
        price: item.price * 0.7,
        currency: 'JPY',
        availability: 'In Stock',
        url: 'https://amazon.co.jp',
      },
      {
        id: '2',
        name: 'Rakuten',
        price: item.price * 0.75,
        currency: 'JPY',
        availability: 'In Stock',
        url: 'https://rakuten.co.jp',
      },
      {
        id: '3',
        name: 'Yahoo Shopping',
        price: item.price * 0.72,
        currency: 'JPY',
        availability: 'Limited',
        url: 'https://shopping.yahoo.co.jp',
      },
    ]);
    setIsSearching(false);
  };

  if (selectedItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <Package className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">商品を選択してください</p>
        <p className="text-sm mt-2">分析タブから商品を選択して仕入先を探索します</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Selected Items */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">選択中の商品</h3>
        <div className="space-y-2">
          {selectedItems.map(item => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-6 h-6 text-gray-400 m-auto mt-2" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.identifier}</p>
                </div>
              </div>
              <button
                onClick={() => searchSuppliers(item)}
                disabled={isSearching}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : '仕入先検索'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">仕入先候補</h3>
          <div className="grid grid-cols-1 gap-3">
            {searchResults.map(supplier => (
              <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Store className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{supplier.name}</p>
                      <p className="text-sm text-gray-500">
                        {supplier.currency} {supplier.price.toLocaleString()} • {supplier.availability}
                      </p>
                    </div>
                  </div>
                  <a
                    href={supplier.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
