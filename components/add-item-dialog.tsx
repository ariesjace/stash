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
import { Badge } from "@/components/ui/badge"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  const [step, setStep] = React.useState<"selectAsset" | "form">("form")
  const [selectedAsset, setSelectedAsset] = React.useState<any>(null)

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
      initial[field.key] = field.defaultValue ?? ""
    })
    initial["remarks"] = ""
    return initial
  })

  const [purchaseDate, setPurchaseDate] = React.useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)
  const [spareAssets, setSpareAssets] = React.useState<any[]>([])
  const [isLoadingAssets, setIsLoadingAssets] = React.useState(false)

  React.useEffect(() => {
    if (!open) {
      setStep(pageType === "assigned" ? "selectAsset" : "form")
      setSelectedAsset(null)
    } else if (open && pageType === "assigned") {
      setStep("selectAsset")
    }
  }, [open, pageType])

  React.useEffect(() => {
    if (pageType === "assigned" && open) {
      setIsLoadingAssets(true)
      fetch("/api/backend/inventory/spare-assets")
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
          return res.json()
        })
        .then((data) => {
          setSpareAssets(data || [])
          setIsLoadingAssets(false)
        })
        .catch((err) => {
          console.error("Error fetching spare assets:", err)
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
      if (res.ok && result.assetTag) setFormData((prev) => ({ ...prev, assetTag: result.assetTag }))
      else {
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
    if (days < 0) { months -= 1; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate() }
    if (months < 0) { years -= 1; months += 12 }
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

  const handleAssetSelect = (asset: any) => {
    setFormData((prev) => ({
      ...prev,
      assetTag: asset.assetTag || "",
      assetType: asset.assetType || "",
      brand: asset.brand || "",
      model: asset.model || "",
      serialNumber: asset.serialNumber || "",
      oldUser: asset.newUser || "",
    }))
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
      // Automatically set status to dispose if asset is >= 5 years old
      let autoStatus = formData.status || "spare"
      if (formData.purchaseDate) {
        const purchase = new Date(formData.purchaseDate)
        const now = new Date()
        const diffYears = now.getFullYear() - purchase.getFullYear()
        const monthCheck = now.getMonth() - purchase.getMonth()
        const dayCheck = now.getDate() - purchase.getDate()
        const isOver5Years = diffYears > 5 || (diffYears === 5 && (monthCheck > 0 || (monthCheck === 0 && dayCheck >= 0)))
        if (isOver5Years) {
          autoStatus = "dispose"
          toast.info("Asset is over 5 years old. Status automatically set to 'dispose'.")
        }
      }

      const payload = {
        ...formData,
        status: autoStatus,
        createdBy: userDetails?.UserId,
        pageType: pageType,
      }

      const res = await fetch("/api/backend/inventory/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      if (!res.ok) {
        console.error("❌ Create failed:", result)
        toast.error(result.error || result.message || "Error occurred.")
        return
      }

      toast.success("Data Added Successfully!")

      if (pageType === "assigned" && formData.assetTag) {
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
          if (!statusRes.ok) {
            toast.warning("Assignment created but failed to update asset status. Please update manually.")
          }
        } catch (statusError) {
          toast.warning("Assignment created but failed to update asset status. Please update manually.")
        }
      }

      if (fetchPosts && userDetails?.ReferenceID) fetchPosts(userDetails.ReferenceID)

      const reset: Record<string, string> = {}
      fields.forEach((field) => { reset[field.key] = field.defaultValue || "" })
      reset["remarks"] = ""
      setFormData(reset)
      setPurchaseDate(undefined)
      setSelectedAsset(null)
      onOpenChange(false)
    } catch (error: any) {
      console.error("❌ Submit error:", error)
      toast.error(error?.message || "Failed to save data.")
    }
  }

  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-3xl", xl: "max-w-6xl" }

  const renderFields = pageType === "assigned"
    ? [
      { key: "assetTag", label: "Asset Tag", required: true, readOnly: true },
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

  const AssetSelectionStep = () => (
    <div className="max-h-[70vh] overflow-y-auto px-1">
      {isLoadingAssets ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading spare assets...</p>
        </div>
      ) : spareAssets.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No spare assets available</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {spareAssets
              .sort((a, b) => {
                const parseStorage = (s?: string) => {
                  if (!s) return 0
                  if (s.toLowerCase().includes("tb")) return parseFloat(s) * 1024
                  return parseFloat(s)
                }
                return parseStorage(b.storage) - parseStorage(a.storage)
              })
              .map((asset) => {
                const isSelected = selectedAsset?.assetTag === asset.assetTag
                const storageValue = asset.storage ? asset.storage.toLowerCase() : ""
                let storageGB = 0
                if (storageValue.includes("tb")) storageGB = parseFloat(storageValue) * 1024
                else if (storageValue.includes("gb")) storageGB = parseFloat(storageValue)
                const isRecommended = storageGB >= 500

                return (
                  <div
                    key={asset.assetTag}
                    className={`cursor-pointer transition-all border rounded-lg ${isSelected
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:border-blue-400 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <Card>
                      <CardHeader className="flex items-center justify-between">
                        <div>
                          <CardTitle>{asset.assetTag}</CardTitle>
                          <CardDescription>{asset.assetType}</CardDescription>
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        )}
                      </CardHeader>

                      <CardContent className="pl-6">
                        <p className="text-xs text-muted-foreground mb-2">
                          This asset is a {asset.brand} {asset.model} with {asset.ram} RAM, powered by a {asset.processor} processor and {asset.storage} storage. Perfect for office or technical use.
                        </p>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs mb-1">Brand: {asset.brand}</p>
                          <p className="text-xs mb-1">Model: {asset.model}</p>
                          <p className="text-xs mb-1">RAM: {asset.ram}</p>
                          <p className="text-xs mb-1">Processor: {asset.processor}</p>
                          <p className="text-xs mb-1">Storage: {asset.storage}</p>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-gray-50 px-4 py-2 text-right flex justify-end items-center gap-2">
                        <Badge className="capitalize">{asset.status}</Badge>
                        {isRecommended && (
                          <span className="text-xs font-medium text-green-600">Recommended</span>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                )
              })}
          </div>

          <div className="sticky bottom-0 bg-white pt-4 border-t flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            {selectedAsset && (
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                onClick={() => { handleAssetSelect(selectedAsset); setStep("form") }}
              >
                Proceed with {selectedAsset.assetTag}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )

  const FormStep = () => (
    <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {renderFields
          .filter((field) => field.key !== "remarks" && field.key !== "purchaseDate" && field.key !== "assetAge")
          .map((field) => {
            const isSelect = field.key in options && Array.isArray(options[field.key as keyof typeof options])
            const isAssetTag = field.key === "assetTag"
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

        {pageType !== "assigned" && (
          <>
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

            <div className="flex flex-col">
              <Label htmlFor="assetAge" className="text-sm font-medium text-muted-foreground mb-1">Asset Age</Label>
              <Input id="assetAge" placeholder="Auto-calculated" value={formData.assetAge || ""} readOnly className="bg-gray-50 text-gray-600 cursor-not-allowed" />
            </div>
          </>
        )}
      </div>

      <div className="mt-4">
        <Label htmlFor="remarks" className="text-sm font-medium text-muted-foreground mb-1">Remarks</Label>
        <Textarea id="remarks" placeholder="Enter any remarks here..." value={formData.remarks || ""} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} className="min-h-[100px]" />
      </div>
    </div>
  )

  const DialogBody = step === "selectAsset" && pageType === "assigned"
    ? <AssetSelectionStep />
    : <FormStep />

  const DialogFooterButtons = step === "form" ? (
    <DialogFooter className="mt-4">
      {pageType === "assigned" && (
        <Button variant="outline" onClick={() => { setStep("selectAsset"); setSelectedAsset(null) }}>
          Back
        </Button>
      )}
      <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
      <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">Add Item</Button>
    </DialogFooter>
  ) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showButton && (
        <Button size="sm" className="gap-2" onClick={() => onOpenChange(true)}>
          <IconPlus className="size-4" /> Add New
        </Button>
      )}
      <DialogContent className={`${sizeClasses[dialogSize]} p-6`}>
        <DialogHeader>
          <DialogTitle>
            {step === "selectAsset" && pageType === "assigned"
              ? "Select Spare Asset"
              : "Add New Item"}
          </DialogTitle>
          <DialogDescription>
            {step === "selectAsset" && pageType === "assigned"
              ? "Select a spare asset from the available inventory to assign to a user."
              : "Fill in the details to add a new item to the database."}
          </DialogDescription>
        </DialogHeader>
        {DialogBody}
        {DialogFooterButtons}
      </DialogContent>
    </Dialog>
  )
}
