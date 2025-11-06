import type React from "react"
import { ConfigurableDataTable } from "@/components/configurable-data-table"
import { PageHeader } from "@/components/pageheader"
import data from "./data.json"

const columns = [
  "softwareName",
  "softwareVersion",
  "totalPurchased",
  "managedInstallations",
  "remaining",
  "complianceStatus",
  "action",
  "networkInstallations",
]
const columnLabels = {
  softwareName: "Software Name",
  softwareVersion: "Software Version",
  totalPurchased: "Total Purchased",
  managedInstallations: "Managed Installations",
  remaining: "Remaining",
  complianceStatus: "Compliance Status",
  action: "Action",
  networkInstallations: "Network Installations",
}

export default function LiscenceManagementPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <PageHeader title="Liscence Management" description="View and manage your software liscences" />
          <ConfigurableDataTable
            data={data}
            columns={columns}
            columnLabels={columnLabels}
            title="Software Licences"
          />
        </div>
      </div>
    </div>
  )
}
