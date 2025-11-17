'use client';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface Asset {
  id: string; // ⭐ FIX: ID is always string
  assetTag: string;
  assetType: string;
  brand: string;
  model: string;
  processor: string;
  ram: string;
  storage: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string;
}

interface AssetsListProps {
  assets: Asset[];
  selectedId: string | null; // ⭐ FIX: string
  onSelectAsset: (id: string) => void; // ⭐ FIX: string
}

export function AssetsList({ assets, selectedId, onSelectAsset }: AssetsListProps) {
  return (
    <div className="space-y-3">
      {assets.map((asset) => (
        <Card
          key={`asset-${asset.id}`} // always unique now
          onClick={() => onSelectAsset(asset.id)}
          className={cn(
            'p-4 cursor-pointer transition-all border-2',
            selectedId === asset.id
              ? 'border-gray-900 dark:border-white bg-white dark:bg-gray-900 shadow-md'
              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                {asset.assetTag}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {asset.brand} {asset.model}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {asset.assetType}
              </p>
            </div>
            <div className="flex items-start gap-3 shrink-0">
              <span
                className={cn(
                  'inline-block px-2 py-1 rounded text-xs font-medium whitespace-nowrap',
                  asset.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : asset.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                )}
              >
                {asset.status}
              </span>
              {selectedId === asset.id && (
                <div className="w-3 h-3 rounded-full bg-gray-900 dark:bg-white shrink-0 mt-1" />
              )}
            </div>
          </div>

          {asset.remarks && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 line-clamp-1">
              {asset.remarks}
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
