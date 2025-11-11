"use client"

import * as React from "react"
import { IconSearch, IconCalendar, IconDownload, IconLayoutList, IconLayoutGrid } from "@tabler/icons-react"
import { toast } from "sonner"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { AddItemDialog } from "@/components/add-item-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface FieldConfig {
  key: string
  label: string
  required?: boolean
  defaultValue?: string
}

interface PageButtonGroupProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  dateRange: { from: string; to: string }
  onDateRangeChange: (range: { from: string; to: string }) => void
  viewMode: "table" | "card"
  onViewModeChange: (mode: "table" | "card") => void
  selectedRowCount: number
  onDeleteSelected: () => void
  onAddNew: (data: Record<string, any>) => void
  filteredData: any[]
  fields: FieldConfig[]
  showAddButton?: boolean
  pageType?: "inventory" | "assigned" | "maintenance" | "disposal"
  columnLabels: Record<string, string>
  dialogSize?: "sm" | "md" | "lg" | "xl"
  userDetails?: Record<string, any>
}

export function PageButtonGroup({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  viewMode,
  onViewModeChange,
  selectedRowCount,
  onDeleteSelected,
  onAddNew,
  filteredData,
  fields,
  showAddButton = true,
  pageType,
  columnLabels,
  dialogSize = "md",
  userDetails = {},
}: PageButtonGroupProps) {
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [calendarRange, setCalendarRange] = React.useState<DateRange | undefined>(undefined)

  const handleExportToExcel = () => {
    const headers = fields.map((f) => f.label)
    const rows = filteredData.map((item) => fields.map((f) => item[f.key]))

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Data exported successfully")
  }

  const handleCalendarRangeChange = (range: DateRange | undefined) => {
    setCalendarRange(range)
    if (range?.from && range?.to) {
      onDateRangeChange({
        from: range.from.toISOString().split("T")[0],
        to: range.to.toISOString().split("T")[0],
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {showAddButton && (
            <AddItemDialog
              open={showAddDialog}
              onOpenChange={setShowAddDialog}
              onAddNew={onAddNew}
              filteredData={filteredData}
              fields={fields}
              showButton={true}
              pageType={pageType}
              dialogSize={dialogSize}
              userDetails={userDetails}
            />
          )}

          {/* Search Input */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 w-full md:w-48"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <IconCalendar className="h-4 w-4" />
                {calendarRange?.from && calendarRange?.to
                  ? `${calendarRange.from.toLocaleDateString()} - ${calendarRange.to.toLocaleDateString()}`
                  : "Select Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="range"
                selected={calendarRange}
                captionLayout="dropdown"
                onSelect={handleCalendarRangeChange}
              />
            </PopoverContent>
          </Popover>

          {/* Export Button */}
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleExportToExcel}>
            <IconDownload className="h-4 w-4" />
            Export
          </Button>

          {selectedRowCount > 0 && (
            <DeleteConfirmationDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              onConfirm={() => {
                onDeleteSelected()
                setShowDeleteDialog(false)
              }}
              count={selectedRowCount}
              isMultiple={true}
            />
          )}
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => onViewModeChange("table")}
          >
            <IconLayoutList className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => onViewModeChange("card")}
          >
            <IconLayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">Card</span>
          </Button>
        </div>
      </div>
    </div>
  )
}