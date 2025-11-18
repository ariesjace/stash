"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/pageheader";
import { AssetsList } from "@/components/maintenance/assets-list";
import { WorklogPanel } from "@/components/maintenance/worklog-panel";

export default function MaintenancePage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/backend/maintenance/fetch-defective");
      const json = await res.json();
      setAssets(json.data || []);
      if (json.data?.length) setSelectedId(json.data[0]._id);
    } catch (err) {
      console.error("Error fetching defective assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const selectedAsset = assets.find((a) => a._id === selectedId);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <PageHeader
          title="Maintenance"
          description="Track and manage defective assets with detailed worklogs"
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Loading assets...
            </p>
          </div>
        ) : assets.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No defective assets found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            <div className="lg:col-span-1 h-[600px] lg:sticky lg:top-6 overflow-y-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Defective Assets
                </h2>
                <AssetsList
                  assets={assets}
                  selectedId={selectedId}
                  onSelectAsset={setSelectedId}
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 h-full">
                {selectedAsset ? (
                  <WorklogPanel
                    asset={selectedAsset}
                    initialWorklogs={selectedAsset.worklogs}
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
  );
}
