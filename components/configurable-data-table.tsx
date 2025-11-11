"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconCircleCheckFilled,
  IconLoader,
  IconFolderOpen,
  IconX,
} from "@tabler/icons-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { PageButtonGroup } from "@/components/page-button-group"
import { ItemDrawer } from "@/components/item-drawer"

/* ---------------------------- STATUS BADGE ---------------------------- */
function StatusBadge({ status, className = "" }: { status?: string | null; className?: string }) {
  const s = (status || "").toLowerCase().trim()

  const map: Record<string, string> = {
    deployed:
          "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300",
        spare:
          "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
        lend:
          "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
        defective:
          "bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
        missing:
          "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300",
        dispose:
          "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300",
  }

  const defaultCls = "bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/30 dark:text-gray-300"

  const colorCls = map[s] ?? defaultCls

  return (
    <span
      className={`${colorCls} inline-flex items-center gap-2 px-2 py-0.5 text-xs font-medium rounded-full ${className}`}
      role="status"
      aria-label={`status ${status}`}
    >
      <span className="whitespace-nowrap">{status ?? "-"}</span>
    </span>
  )
}

function filterDataByPageType(data: any[], pageType?: string): any[] {
  if (!pageType || !Array.isArray(data)) return data

  const statusMap: Record<string, string[]> = {
    // inventory: no filter - shows all statuses
    disposal: ["dispose"],
    maintenance: ["defective"],
    assigned: ["deployed", "lend"],
    inventory: ["deployed", "lend", "spare", "missing"]
  }

  const allowedStatuses = statusMap[pageType.toLowerCase()]
  if (!allowedStatuses) return data // includes "inventory" which has no filter

  return data.filter((item) => {
    const status = String(item.status || "").toLowerCase().trim()
    return allowedStatuses.includes(status)
  })
}

/* ---------------------------- DRAG HANDLE ---------------------------- */
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

/* ---------------------------- DRAGGABLE ROW ---------------------------- */
function DraggableRow({ row, columns }: { row: Row<any>; columns: string[] }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 hover:bg-muted/50 transition-colors cursor-pointer"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
      ))}
    </TableRow>
  )
}

/* ---------------------------- CARD VIEW ---------------------------- */
function CardView({
  data,
  columns,
  columnLabels,
  drawerFields,
  rowSelection,
  onRowSelectionChange,
}: {
  data: any[]
  columns: string[]
  columnLabels: Record<string, string>
  drawerFields: Array<{ key: string; label: string }>
  rowSelection: Record<string, boolean>
  onRowSelectionChange: (selection: Record<string, boolean>) => void
}) {
  const handleCheckboxChange = (itemId: string, checked: boolean) => {
    onRowSelectionChange({
      ...rowSelection,
      [itemId]: checked,
    })
  }

  const allSelected = data.length > 0 && data.every((item) => item.id !== undefined && rowSelection[item.id.toString()])
  const someSelected = data.some((item) => item.id !== undefined && rowSelection[item.id.toString()]) && !allSelected

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = { ...rowSelection }
      data.forEach((item) => {
        if (item.id !== undefined) {
          newSelection[item.id.toString()] = true
        }
      })
      onRowSelectionChange(newSelection)
    } else {
      const newSelection = { ...rowSelection }
      data.forEach((item) => {
        if (item.id !== undefined) {
          delete newSelection[item.id.toString()]
        }
      })
      onRowSelectionChange(newSelection)
    }
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderOpen />
          </EmptyMedia>
          <EmptyTitle>No Items Found</EmptyTitle>
          <EmptyDescription>There are no items to display.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center gap-2 px-1">
        <Checkbox
          checked={allSelected || (someSelected ? "indeterminate" : false)}
          onCheckedChange={handleSelectAll}
          aria-label="Select all"
        />
        <span className="text-sm text-muted-foreground">{allSelected ? "Deselect all" : "Select all"}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
        {data.map((item, index) => {
          const itemId = item.id !== undefined && item.id !== null ? String(item.id) : String(index)
          const isSelected = itemId ? rowSelection[itemId] : false

          return (
            <Card
              key={itemId}
              className={`cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 ${isSelected ? "ring-2 ring-primary" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <Checkbox
                    checked={isSelected || false}
                    onCheckedChange={(checked) => itemId && handleCheckboxChange(itemId, !!checked)}
                    aria-label={`Select ${item[columns[0]]}`}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <ItemDrawer item={item} fields={drawerFields}>
                  <div className="space-y-3">
                    <h3 className="font-bold text-foreground hover:underline transition-all">{item[columns[0]]}</h3>

                    <div className="space-y-1.5">
                      {columns.slice(1).map((col) => (
                        <div key={col} className="flex items-center justify-between gap-2">
                          <span className="text-sm text-muted-foreground">{columnLabels[col]}:</span>

                          {col.toLowerCase() === "status" ? (
                            <StatusBadge status={item[col]} />
                          ) : (
                            <span className="text-sm font-medium">{item[col] ?? "-"}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </ItemDrawer>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------------------- MAIN COMPONENT ---------------------------- */
export function ConfigurableDataTable({
  data: initialData,
  columns: columnKeys,
  columnLabels,
  title,
  pageType,
  showAddButton = true,
  dialogSize = "md",
}: {
  data: any[]
  columns: string[]
  columnLabels: Record<string, string>
  title: string
  pageType?: "inventory" | "assigned" | "maintenance" | "disposal" 
  showAddButton?: boolean
  dialogSize?: "sm" | "md" | "lg" | "xl"
}) {
  const [data, setData] = React.useState(() => initialData ?? [])
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"table" | "card">("table")
  const [dateRange, setDateRange] = React.useState({ from: "", to: "" })
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {}),
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => (data || []).map(({ id }) => id), [data])
  const drawerFields = React.useMemo(
    () => columnKeys.map((key) => ({ key, label: columnLabels[key] || key })),
    [columnKeys, columnLabels],
  )
  const addDialogFields = React.useMemo(
    () =>
      columnKeys.map((key) => ({
        key,
        label: columnLabels[key] || key,
        required: key === columnKeys[0],
      })),
    [columnKeys, columnLabels],
  )

  /* ---------------------- FETCH DATA ON MOUNT --------------------- */
  React.useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/backend/inventory/fetch")
      if (!res.ok) throw new Error("Failed to fetch data")
      const json = await res.json()
      // Normalize _id to id
      const normalizedData = (json.data ?? []).map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }))
      setData(normalizedData)
    } catch (err) {
      console.error("Error fetching inventory:", err)
    }
  }
  fetchData()
}, [])

  /* ---------------------- TABLE COLUMNS --------------------- */
  const dynamicColumns: ColumnDef<any>[] = React.useMemo(() => {
    const cols: ColumnDef<any>[] = [
      {
        id: "drag",
        header: () => null,
        cell: ({ row }) => <DragHandle id={row.original.id} />,
      },
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ]

    columnKeys.forEach((key) => {
      cols.push({
        accessorKey: key,
        header: columnLabels[key] || key,
        cell: ({ row }) => {
          const value = row.original[key]
          if (key === columnKeys[0]) {
            return (
              <ItemDrawer item={row.original} fields={drawerFields}>
                <span className="font-bold hover:underline transition-all cursor-pointer">{value}</span>
              </ItemDrawer>
            )
          }
          if (key.toLowerCase() === "status") {
            return <StatusBadge status={value} />
          }
          return <span className="text-sm">{value ?? "-"}</span>
        },
      })
    })

    return cols
  }, [columnKeys, columnLabels, drawerFields])

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(data)) return []
    
    // First filter by page type (status-based filtering)
    const statusFiltered = filterDataByPageType(data, pageType)
    
    // Then apply search filter
    return statusFiltered.filter((item) =>
      columnKeys.some((key) =>
        String(item[key] ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()),
      ),
    )
  }, [data, searchTerm, columnKeys, pageType])

  const table = useReactTable({
    data: filteredData,
    columns: dynamicColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row, index) => (row.id !== undefined ? row.id.toString() : index.toString()),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  /* ---------------------- DRAG & DROP --------------------- */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  /* ---------------------- EXPORT --------------------- */
  const handleExportToExcel = () => {
    const headers = columnKeys.map((key) => columnLabels[key] || key)
    const rows = filteredData.map((item) => columnKeys.map((key) => item[key]))

    const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success("Data exported successfully")
  }

  /* ---------------------- DELETE --------------------- */
  const handleDeleteSelected = async () => {
  const selectedRowIds = Object.keys(rowSelection).filter(
    (key) => Boolean((rowSelection as Record<string, boolean>)[key])
  )

  if (selectedRowIds.length === 0) {
    toast.error("No rows selected")
    return
  }

  try {
    // Call a single API endpoint with all selected IDs
    const res = await fetch("/api/backend/inventory/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedRowIds }), // send array of ids
    })

    if (!res.ok) throw new Error("Failed to delete selected rows")

    // Remove deleted items from local state safely
    setData((prev) =>
      prev.filter((item) => !selectedRowIds.includes(String(item.id ?? "")))
    )

    setRowSelection({})
    toast.success(`${selectedRowIds.length} row(s) deleted successfully`)
  } catch (err) {
    console.error("Delete error:", err)
    toast.error("Failed to delete selected rows")
  }
}

  /* ---------------------- RENDER --------------------- */
  const selectedRowCount = Object.keys(rowSelection).filter((key) => (rowSelection as Record<string, boolean>)[key]).length
  const handleAddNew = (item?: any) => {
    // Placeholder implementation: PageButtonGroup may open its own dialog and pass a new item.
    // If it passes an item, add it to local state; otherwise show a message.
    if (!item) {
      toast.error("Add new not implemented")
      return
    }
    setData((prev) => [...prev, item])
    toast.success("Item added")
  }

  return (
    <div className="w-full flex-col justify-start gap-6 flex">
      <div className="shrink-0">
        <PageButtonGroup
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedRowCount={selectedRowCount}
          onDeleteSelected={handleDeleteSelected}
          onAddNew={handleAddNew}
          filteredData={filteredData}
          fields={addDialogFields}
          showAddButton={showAddButton}
          pageType={pageType}
          columnLabels={columnLabels}
          dialogSize={dialogSize}
        />
      </div>

      {viewMode === "table" ? (
        <div className="relative flex flex-col gap-4 px-4 lg:px-6">
          <div className="overflow-x-auto overflow-y-auto max-h-[70vh] rounded-lg border">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table className="min-w-[1600px] w-full text-sm">
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} colSpan={header.colSpan} className="px-3 py-2 text-xs font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} columns={columnKeys} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={dynamicColumns.length} className="h-[400px]">
                        <Empty>
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <IconFolderOpen />
                            </EmptyMedia>
                            <EmptyTitle>No Items Found</EmptyTitle>
                            <EmptyDescription>There are no items to display.</EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
              selected.
            </div>

            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>

              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 bg-transparent"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8 bg-transparent"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex bg-transparent"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 lg:px-6">
          <CardView
            data={filteredData}
            columns={columnKeys}
            columnLabels={columnLabels}
            drawerFields={drawerFields}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
          />
        </div>
      )}
    </div>
  )
}