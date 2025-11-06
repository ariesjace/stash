import type React from "react"
import { ConfigurableDataTable } from "@/components/configurable-data-table"
import { PageHeader } from "@/components/pageheader"
import data from "./data.json"

const columns = [
  "assetTag",
  "assetType",
  "brand",
  "model",
  "serialNumber",
  "purchaseDate",
  "warrantyExpiry",
  "vendor",
  "warrantyStatus",
  "daysRemaining",
  "remarks"
];

const columnLabels = {
  assetTag: "Asset Tag",
  assetType: "Asset Type",
  brand: "Brand",
  model: "Model",
  serialNumber: "Serial Number",
  purchaseDate: "Purchase Date",
  warrantyExpiry: "Warranty Expiry",
  vendor: "Vendor",
  warrantyStatus: "Warranty Status",
  daysRemaining: "Days Remaining",
  remarks: "Remarks"
};


export default function WarrantyManagementPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader title="Warranty Management" description="View and manage your warranty dates" />
          <ConfigurableDataTable
            data={data}
            columns={columns}
            columnLabels={columnLabels}
            title="Warranty Management"
          />
        </div>
      </div>
    </div>
  )
}
