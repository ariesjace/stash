import type React from "react"
import { ConfigurableDataTable } from "@/components/configurable-data-table"
import { PageHeader } from "@/components/pageheader"
import data from "./data.json"

const columns = [
  "assetTag",
  "status",
  "brand",
  "assetType",
  "model",
  "processor",
  "ram",
  "storage",
  "serialNumber",
  "purchaseDate",
  "assetAge",
  "amount",
  "remarks",
]

const columnLabels = {
  assetTag: "Asset Tag",
  status: "Status",
  brand: "Brand",
  assetType: "Asset Type",
  model: "Model",
  processor: "Processor",
  ram: "RAM",
  storage: "Storage",
  serialNumber: "Serial Number",
  purchaseDate: "Purchase Date",
  assetAge: "Asset Age",
  amount: "Amount",
  remarks: "Remarks",
}

export default function DisposalPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader title="Disposal" description="Track disposed assets" />
          <ConfigurableDataTable
            data={data}
            columns={columns}
            columnLabels={columnLabels}
            title="Disposal"
            pageType="disposal"
            showAddButton={false}
          />
        </div>
      </div>
    </div>
  )
}
