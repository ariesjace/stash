"use client"

import * as React from "react"
import { ConfigurableDataTable } from "@/components/configurable-data-table"
import { PageHeader } from "@/components/pageheader"
import data from "./data.json"

const columns = ["assetTag", "newUser", "oldUser", "department", "position", "status", "brand", "assetType", "model", "serialNumber", "remarks"]
const columnLabels = {
  assetTag: "Asset Tag",
  newUser: "New User",
  oldUser: "Old User",
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
  const [data, setData] = React.useState<any[]>([])
  
    // Fetch data from your Next.js API
    const fetchInventory = async () => {
      try {
        const res = await fetch("/api/backend/inventory/fetch")
        const json = await res.json()
        setData(json.data ?? [])
      } catch (err) {
        console.error("Error fetching inventory:", err)
      }
    }
  
    React.useEffect(() => {
      fetchInventory()
    }, [])

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader title="Assign Assets" description="Assign assest to Employees" />
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
