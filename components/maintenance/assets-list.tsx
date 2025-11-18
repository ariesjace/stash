"use client";

import React from "react";

interface Asset {
  _id: string;
  assetTag: string;
  brand?: string;
  model?: string;
  status?: "defective" | "spare" | "deployed" | "dispose";
}

interface AssetsListProps {
  assets: Asset[];
  selectedId: string | null;
  onSelectAsset: (id: string) => void;
}

export function AssetsList({
  assets,
  selectedId,
  onSelectAsset,
}: AssetsListProps) {
  const getStatusClasses = (status?: string) => {
    switch (status) {
      case "spare":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "deployed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "dispose":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "defective":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-2">
      {assets.map((asset) => (
        <div
          key={asset._id}
          onClick={() => onSelectAsset(asset._id)}
          className={`cursor-pointer flex justify-between items-center p-3 border rounded-md transition-colors
            ${
              selectedId === asset._id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                : "border-gray-200 dark:border-gray-700"
            }
          `}
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {asset.assetTag}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {asset.brand} {asset.model}
            </p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${getStatusClasses(
              asset.status
            )}`}
          >
            {asset.status || "unknown"}
          </span>
        </div>
      ))}
    </div>
  );
}
