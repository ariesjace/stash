import type React from "react"
import { ConfigurableDataTable } from "@/components/configurable-data-table"
import { PageHeader } from "@/components/pageheader"
import data from "./data.json"

const columns = ["newUser", "department", "position", "status", "brand", "assetType", "model", "serialNumber", "remarks"]
const columnLabels = {
  newUser: "Employee Name",
  department: "Department",
  position: "Position",
  status: "Status",
  brand: "Brand",
  assetType: "Asset Type",
  model: "Model",
  serialNumber: "Serial Number",
  remarks: "Remarks",
}

export default function AssignedAssetsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader title="Assigned Assets" description="View and manage assigned assets" />
          <ConfigurableDataTable
            data={data}
            columns={columns}
            columnLabels={columnLabels}
            title="Assigned Assets"
            pageType="assigned"
            showAddButton={true}
          />
        </div>
      </div>
    </div>
  )
}
