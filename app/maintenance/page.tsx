import { ConfigurableDataTable } from "@/components/configurable-data-table"
import data from "./data.json"
import { PageHeader } from "@/components/pageheader"

const columns = [
  "assetTag",
  "status",
  "remarks",
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
]

const columnLabels = {
  assetTag: "Asset Tag",
  status: "Status",
  remarks: "Remarks",
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
}

export default function MaintenancePage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader
            title="Maintenance"
            description="Track and manage asset maintenance"
          />
          <ConfigurableDataTable
            data={data}
            columns={columns}
            columnLabels={columnLabels}
            title="Maintenance"
            pageType="maintenance"
            showAddButton={true}
          />
        </div>
      </div>
    </div>
  )
}
