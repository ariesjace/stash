"use client"

import * as React from "react"
import { ConfigurableDataTable } from "@/components/configurable-data-table"
import { PageHeader } from "@/components/pageheader"

const columns = [
  "assetTag",
  "assetType",
  "status",
  "location",
  "newUser",
  "oldUser",
  "department",
  "position",
  "brand",
  "model",
  "processor",
  "ram",
  "storage",
  "serialNumber",
  "purchaseDate",
  "assetAge",
  "amount",
  "remarks",
  "macAddress",
]

const columnLabels = {
  assetTag: "Asset Tag",
  assetType: "Asset Type",
  status: "Status",
  location: "Location",
  newUser: "New User",
  oldUser: "Old User",
  department: "Department",
  position: "Position",
  brand: "Brand",
  model: "Model",
  processor: "Processor",
  ram: "RAM",
  storage: "Storage",
  serialNumber: "Serial Number",
  purchaseDate: "Purchase Date",
  assetAge: "Asset Age",
  amount: "Amount",
  remarks: "Remarks",
  macAddress: "MAC Address",
}

export default function InventoryPage() {
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
    <div className="flex flex-1 flex-col gap-4 p-4 lg:px-6">
      <PageHeader title="Inventory" description="All assets in the database" />

      {/* ConfigurableDataTable now receives live data */}
      <ConfigurableDataTable
        data={data}
        columns={columns}
        columnLabels={columnLabels}
        title="Inventory"
        showAddButton={false} // optional
      />
    </div>
  )
}
