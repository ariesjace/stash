'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/pageheader';
import { AssetsList } from '@/components/maintenance/assets-list';
import { WorklogPanel } from '@/components/maintenance/worklog-panel';

interface WorklogEntry {
  id: string;
  date: Date;
  update: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  technician?: string;
}

interface Asset {
  id: string; // ID always string
  assetTag  : string;
  assetType: string;
  brand: string;
  ram: string;
  storage: string;
  processor: string;
  model: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  remarks: string;
}

export default function MaintenancePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [worklogs, setWorklogs] = useState<Record<string, WorklogEntry[]>>({});
  const [assetStatuses, setAssetStatuses] = useState<Record<string, Asset['status']>>({});
  const [loadingWorklogs, setLoadingWorklogs] = useState(false);

  // Fetch defective assets
  useEffect(() => {
    const fetchDefectiveAssets = async () => {
      try {
        const res = await fetch('/api/backend/inventory/fetch');
        const json = await res.json();

        const defectiveAssets: Asset[] = (json.data ?? [])
          .filter((asset: any) => asset.status?.toLowerCase() === 'defective')
          .map((asset: any) => ({
            id: String(asset.id ?? asset._id),
            assetTag: asset.assetTag,
            assetType: asset.assetType,
            brand: asset.brand,
            model: asset.model,
            status: 'Pending',
            remarks: asset.remarks || '',
          }));

        setAssets(defectiveAssets);

        if (defectiveAssets.length > 0 && !selectedAssetId) {
          const firstId = defectiveAssets[0].id;
          setSelectedAssetId(firstId);
          fetchWorklogsForAsset(firstId);
        }
      } catch (err) {
        console.error('Error fetching defective assets:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!selectedAssetId) {
      fetchDefectiveAssets();
    }
  }, [selectedAssetId]);

  // Fetch worklogs for a given asset
  const fetchWorklogsForAsset = async (assetId: string) => {
    setLoadingWorklogs(true);
    try {
      const res = await fetch(`/api/backend/maintenance/worklog?assetId=${assetId}`);
      const json = await res.json();

      const fetchedWorklogs: WorklogEntry[] = (json.data ?? []).map((log: any) => ({
        id: String(log._id ?? Date.now()),
        date: new Date(log.createdAt),
        update: log.update,
        status: log.status,
        technician: log.technician,
      }));

      setWorklogs((prev) => ({
        ...prev,
        [assetId]: fetchedWorklogs,
      }));

      if (fetchedWorklogs.length > 0) {
        setAssetStatuses((prev) => ({
          ...prev,
          [assetId]: fetchedWorklogs[0].status,
        }));
      }
    } catch (err) {
      console.error('Error fetching worklogs:', err);
    } finally {
      setLoadingWorklogs(false);
    }
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    fetchWorklogsForAsset(assetId);
  };

  const selectedAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    const asset = assets.find((a) => a.id === selectedAssetId);
    if (!asset) return null;
    return {
      ...asset,
      status: assetStatuses[asset.id] || 'Pending',
    };
  }, [selectedAssetId, assetStatuses, assets]);

  const handleAddUpdate = async (update: string, status: Asset['status']) => {
    if (!selectedAssetId) return;

    try {
      const res = await fetch('/api/backend/maintenance/worklog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId: selectedAssetId,
          update,
          status,
          technician: 'Current User',
        }),
      });

      if (!res.ok) throw new Error('Failed to save worklog');

      const json = await res.json();

      const newEntry: WorklogEntry = {
        id: String(json.data.id ?? Date.now()),
        date: new Date(json.data.createdAt),
        update,
        status,
        technician: json.data.technician,
      };

      setWorklogs((prev) => ({
        ...prev,
        [selectedAssetId]: [newEntry, ...(prev[selectedAssetId] || [])],
      }));

      setAssetStatuses((prev) => ({
        ...prev,
        [selectedAssetId]: status,
      }));
    } catch (err) {
      console.error('Error adding update:', err);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader
            title="Maintenance"
            description="Track and manage defective assets with detailed worklogs"
          />

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading assets...</p>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No defective assets found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
              {/* Left: Assets List */}
              <div className="lg:col-span-1 h-fit lg:sticky lg:top-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Defective Assets
                  </h2>
                  <AssetsList
                    assets={assets.map((a) => ({
                      ...a,
                      status: assetStatuses[a.id] || 'Pending',
                    }))}
                    selectedId={selectedAssetId}
                    onSelectAsset={handleSelectAsset}
                  />
                </div>
              </div>

              {/* Right: Worklog Panel */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
                  {selectedAsset ? (
                    <WorklogPanel
                      asset={selectedAsset}
                      worklogs={selectedAssetId ? worklogs[selectedAssetId] || [] : []}
                      onAddUpdate={handleAddUpdate}
                      isLoading={loadingWorklogs}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      <p>Select an asset to view its maintenance worklog</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
