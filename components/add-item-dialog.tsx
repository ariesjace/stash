"use client"

import * as React from "react"
import { IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export const schema = z.record(z.string(), z.unknown())

interface FieldConfig {
  key: string
  label: string
  required?: boolean
  defaultValue?: string
  readOnly?: boolean
}

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filteredData: any[]
  fields: FieldConfig[]
  showButton?: boolean
  pageType?: "inventory" | "assigned" | "maintenance" | "disposal"
  dialogSize?: "sm" | "md" | "lg" | "xl"
  userDetails: any
  fetchPosts?: (refId: string) => void
  onAddNew?: (data: Record<string, any>) => void
}

export function AddItemDialog({
  open,
  onOpenChange,
  filteredData,
  fields,
  showButton = true,
  pageType,
  dialogSize = "xl",
  userDetails,
  fetchPosts,
}: AddItemDialogProps) {
 const [formData, setFormData] = React.useState<Record<string, any>>(() => {
  const initial: Record<string, string> = {}

  const allFields = pageType === "assigned"
    ? [
        { key: "assetTag", defaultValue: "" },
        { key: "assetType", defaultValue: "" },
        { key: "brand", defaultValue: "" },
        { key: "model", defaultValue: "" },
        { key: "serialNumber", defaultValue: "" },
        { key: "oldUser", defaultValue: "" },
        { key: "newUser", defaultValue: "" },
        { key: "position", defaultValue: "" },
        { key: "department", defaultValue: "" },
      ]
    : fields

  allFields.forEach((field) => {
    // Provide a safe fallback if defaultValue does not exist
    initial[field.key] = field.defaultValue ?? ""
  })

  initial["remarks"] = ""
  return initial
})

  const [purchaseDate, setPurchaseDate] = React.useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [spareAssets, setSpareAssets] = React.useState<any[]>([])
  const [isLoadingAssets, setIsLoadingAssets] = React.useState(false)

  // Fetch spare assets for assigned page from inventory collection
  React.useEffect(() => {
    if (pageType === "assigned" && open) {
      setIsLoadingAssets(true)
      fetch("/api/backend/inventory/spare-assets")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
          }
          return res.json()
        })
        .then((data) => {
          console.log("Fetched spare assets from inventory collection:", data)
          setSpareAssets(data || [])
          setIsLoadingAssets(false)
        })
        .catch((err) => {
          console.error("Error fetching spare assets from inventory:", err)
          toast.error("Failed to load spare assets from inventory")
          setIsLoadingAssets(false)
        })
    }
  }, [pageType, open])

  const getStatusOptions = () => {
    const statusByPage: Record<string, string[]> = {
      inventory: ["spare", "deployed", "lend", "missing", "defective", "dispose"],
      disposal: ["dispose"],
      maintenance: ["defective"],
      assigned: ["deployed", "lend"],
    }
    return pageType ? statusByPage[pageType] || [] : ["deployed", "spare", "lend", "defective", "dispose", "missing"]
  }

  const options = {
    status: getStatusOptions(),
    location: ["primex", "j&l", "pasig wh", "cdo", "cebu", "davao", "buildchem", "disruptive"],
    assetType: ["Laptop", "Monitor", "Desktop"],
    department: ["human resources", "information technology", "marketing", "procurement", "sales", "warehouse operations", "operations", "engineering"],
  }

  const handleAssetTypeChange = async (value: string) => {
    setFormData((prev) => ({ ...prev, assetType: value, assetTag: "Generating..." }))
    try {
      const res = await fetch("/api/backend/inventory/next-asset-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetType: value }),
      })
      const result = await res.json()
      if (res.ok && result.assetTag) {
        setFormData((prev) => ({ ...prev, assetTag: result.assetTag }))
      } else {
        toast.error("Failed to generate asset tag")
        setFormData((prev) => ({ ...prev, assetTag: "" }))
      }
    } catch (error) {
      console.error("Error generating asset tag:", error)
      toast.error("Error generating asset tag")
      setFormData((prev) => ({ ...prev, assetTag: "" }))
    }
  }

  const computeAssetAge = (date: Date) => {
    const now = new Date()
    let years = now.getFullYear() - date.getFullYear()
    let months = now.getMonth() - date.getMonth()
    let days = now.getDate() - date.getDate()

    if (days < 0) {
      months -= 1
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    return `${years}y ${months}m ${days}d`
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const formattedDate = date.toLocaleDateString("en-CA")
    const assetAge = computeAssetAge(date)
    setPurchaseDate(date)
    setFormData((prev) => ({ ...prev, purchaseDate: formattedDate, assetAge }))
    setIsCalendarOpen(false)
  }

  // Handle asset tag selection for assigned page
  const handleAssetTagChange = (assetTag: string) => {
    const asset = spareAssets.find((a) => a.assetTag === assetTag)
    if (asset) {
      setFormData((prev) => ({
        ...prev,
        assetTag,
        assetType: asset.assetType || "",
        brand: asset.brand || "",
        model: asset.model || "",
        serialNumber: asset.serialNumber || "",
      }))
    } else {
      // Clear autofilled fields if no asset selected
      setFormData((prev) => ({
        ...prev,
        assetTag,
        assetType: "",
        brand: "",
        model: "",
        serialNumber: "",
      }))
    }
  }

  const handleAddNew = async () => {
    const requiredFields = (pageType === "assigned"
      ? [
        { key: "assetTag", label: "Asset Tag", required: true },
        { key: "oldUser", label: "old User", required: false },
        { key: "newUser", label: "New User", required: true },
        { key: "position", label: "Position", required: true },
        { key: "department", label: "Department", required: true },
      ]
      : fields
    ).filter((f) => f.required)

    const missingFields = requiredFields.filter((f) => !formData[f.key])
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.map((f) => f.label).join(", ")}`
      )
      return
    }

    try {
      // Prepare payload - for assigned page, ensure we have all asset details
      const payload = {
        ...formData,
        createdBy: userDetails?.UserId,
        pageType: pageType, // Include page type to help backend
        // For assigned page, don't override status in formData, it will be updated separately
      }

      console.log("📤 Submitting payload:", payload)

      const res = await fetch("/api/backend/inventory/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()
      console.log("📥 Response:", result)

      if (!res.ok) {
        console.error("❌ Create failed:", result)
        toast.error(result.error || result.message || "Error occurred.")
        return
      }

      toast.success("Data Added Successfully!")

      // Update asset status to deployed if assigned - THIS IS CRITICAL
      if (pageType === "assigned" && formData.assetTag) {
        console.log("🔄 Updating asset status to deployed for:", formData.assetTag)
        try {
          const statusRes = await fetch("/api/backend/inventory/update-status", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                assetTag: formData.assetTag,
                status: "deployed",
                newUser: formData.newUser,
                oldUser: formData.oldUser,
                remarks: formData.remarks,
                department: formData.department,
                position: formData.position,
              }),
            })

          const statusResult = await statusRes.json()
          console.log("✅ Status update response:", statusResult)

          if (!statusRes.ok) {
            console.error("❌ Status update failed:", statusResult)
            toast.warning("Assignment created but failed to update asset status. Please update manually.")
          } else {
            console.log("✅ Asset status successfully updated to deployed")
          }
        } catch (statusError) {
          console.error("❌ Error updating asset status:", statusError)
          toast.warning("Assignment created but failed to update asset status. Please update manually.")
        }
      }

      // Refresh the table data
      if (fetchPosts && userDetails?.ReferenceID) {
        console.log("🔄 Refreshing data for:", userDetails.ReferenceID)
        fetchPosts(userDetails.ReferenceID)
      } else {
        console.warn("⚠️ fetchPosts or ReferenceID not available:", {
          hasFetchPosts: !!fetchPosts,
          referenceId: userDetails?.ReferenceID
        })
      }

      // Reset form
      const reset: Record<string, string> = {}
      fields.forEach((field) => { reset[field.key] = field.defaultValue || "" })
      reset["remarks"] = ""
      setFormData(reset)
      setPurchaseDate(undefined)
      onOpenChange(false)
    } catch (error: any) {
      console.error("❌ Submit error:", error)
      toast.error(error?.message || "Failed to save data.")
    }
  }

  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-3xl", xl: "max-w-6xl" }

  const renderFields = pageType === "assigned"
    ? [
      { key: "assetTag", label: "Asset Tag", required: true },
      { key: "assetType", label: "Asset Type", readOnly: true },
      { key: "brand", label: "Brand", readOnly: true },
      { key: "model", label: "Model", readOnly: true },
      { key: "serialNumber", label: "Serial Number", readOnly: true },
      { key: "oldUser", label: "Old User", readOnly: true },
      { key: "newUser", label: "New User", required: true },
      { key: "position", label: "Position", required: true },
      { key: "department", label: "Department", required: true },
    ]
    : fields

  const DialogBody = (
    <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {renderFields
          .filter((field) => field.key !== "remarks" && field.key !== "purchaseDate" && field.key !== "assetAge")
          .map((field) => {
            const isSelect = field.key in options && Array.isArray(options[field.key as keyof typeof options])
            const isAssetTag = field.key === "assetTag"

            // Assigned page Asset Tag dropdown - show only asset tag
            if (isAssetTag && pageType === "assigned") {
              return (
                <div key={field.key} className="flex flex-col">
                  <Label htmlFor={field.key} className="text-sm font-medium text-muted-foreground mb-1">
                    {field.label} <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id={field.key}
                    value={formData.assetTag || ""}
                    onChange={(e) => handleAssetTagChange(e.target.value)}
                    disabled={isLoadingAssets}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {isLoadingAssets ? "Loading assets..." : "Select Asset Tag"}
                    </option>
                    {spareAssets.map((a) => (
                      <option key={a.assetTag} value={a.assetTag}>
                        {a.assetTag}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }

            // Check if field is readonly (for assigned page autofilled fields)
            // In assigned page: assetType, brand, model, serialNumber should be disabled
            const isReadOnly = pageType === "assigned" && field.readOnly
            const isDisabled = isReadOnly

            return (
              <div key={field.key} className="flex flex-col">
                <Label htmlFor={field.key} className="text-sm font-medium text-muted-foreground mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </Label>

                {isSelect ? (
                  <div className="relative">
                    <select
                      id={field.key}
                      value={formData[field.key] || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        if (field.key === "assetType") handleAssetTypeChange(value)
                        else setFormData({ ...formData, [field.key]: value })
                      }}
                      disabled={isDisabled}
                      className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50"
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {options[field.key as keyof typeof options].map((opt) => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <Input
                    id={field.key}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    disabled={isDisabled || (isAssetTag && pageType !== "assigned")}
                    className={(isDisabled || (isAssetTag && pageType !== "assigned")) ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}
                  />
                )}
              </div>
            )
          })}

        {/* Purchase Date - Only show for non-assigned pages */}
        {pageType !== "assigned" && (
          <div className="flex flex-col">
            <Label htmlFor="purchaseDate" className="text-sm font-medium text-muted-foreground mb-1">Purchase Date</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between font-normal">
                  {purchaseDate ? purchaseDate.toLocaleDateString() : "Select purchase date"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={purchaseDate} captionLayout="dropdown" onSelect={handleDateSelect} />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Asset Age - Only show for non-assigned pages */}
        {pageType !== "assigned" && (
          <div className="flex flex-col">
            <Label htmlFor="assetAge" className="text-sm font-medium text-muted-foreground mb-1">Asset Age</Label>
            <Input id="assetAge" placeholder="Auto-calculated" value={formData.assetAge || ""} readOnly className="bg-gray-50 text-gray-600 cursor-not-allowed" />
          </div>
        )}
      </div>

      {/* Remarks */}
      <div className="mt-4">
        <Label htmlFor="remarks" className="text-sm font-medium text-muted-foreground mb-1">Remarks</Label>
        <Textarea id="remarks" placeholder="Enter any remarks here..." value={formData.remarks || ""} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} className="min-h-[100px]" />
      </div>
    </div>
  )

  const DialogFooterButtons = (
    <DialogFooter className="mt-4">
      <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
      <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">Add Item</Button>
    </DialogFooter>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showButton && (
        <Button size="sm" className="gap-2" onClick={() => onOpenChange(true)}>
          <IconPlus className="size-4" /> Add New
        </Button>
      )}
      <DialogContent className={`${sizeClasses[dialogSize]} p-6`}>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Fill in the details to add a new item to the database.</DialogDescription>
        </DialogHeader>
        {DialogBody}
        {DialogFooterButtons}
      </DialogContent>
    </Dialog>
  )
}