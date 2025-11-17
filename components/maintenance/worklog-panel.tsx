'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { WorklogEntry, WorklogItem } from './worklog-entry';
import { cn } from '@/lib/utils';

interface Asset {
  id: string; // ✔ FIX
  assetTag: string;
  assetType: string;
  brand: string;
  model: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string;
}

interface WorklogPanelProps {
  asset: Asset;
  worklogs: WorklogItem[];
  onAddUpdate: (update: string, status: Asset['status']) => void;
  isLoading?: boolean;
}

export function WorklogPanel({ asset, worklogs, onAddUpdate, isLoading }: WorklogPanelProps) {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [updateText, setUpdateText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Asset['status']>(asset.status);

  const handleSubmit = () => {
    if (updateText.trim()) {
      onAddUpdate(updateText, selectedStatus);
      setUpdateText('');
      setIsAddingUpdate(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {asset.assetTag}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {asset.brand} {asset.model}
          </p>
        </div>

        <Button onClick={() => setIsAddingUpdate(!isAddingUpdate)}>
          {isAddingUpdate ? 'Cancel' : '+ Add Update'}
        </Button>
      </div>

      {/* Add Update Form */}
      {isAddingUpdate && (
        <Card className="mt-6 p-4 mb-6 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
          <textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Enter maintenance update..."
            className="w-full p-2 text-sm border bg-white dark:bg-gray-800 rounded mb-3"
            rows={3}
          />
          <div className="flex gap-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as Asset['status'])}
              className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <Button onClick={handleSubmit} size="sm">
              Submit Update
            </Button>
          </div>
        </Card>
      )}

      {/* Worklogs */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-300">
            Loading worklogs...
          </div>
        ) : worklogs.length > 0 ? (
          <div className="space-y-4">
            {worklogs.map((log) => (
              <WorklogEntry
                key={log.id}
                {...log}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-300">
            No updates yet.
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Current Status</span>
          <span
            className={cn(
              'inline-block px-3 py-1 rounded-lg text-sm font-semibold',
              asset.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800'
                : asset.status === 'In Progress'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
            )}
          >
            {asset.status}
          </span>
        </div>
      </div>
    </div>
  );
}
