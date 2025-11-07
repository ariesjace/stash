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
}

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filteredData: any[]
  fields: FieldConfig[]
  showButton?: boolean
  dialogSize?: "sm" | "md" | "lg" | "xl"
  userDetails: any // added to support createdBy
  fetchPosts?: (refId: string) => void // optional refresh function
}

export function AddItemDialog({
  open,
  onOpenChange,
  filteredData,
  fields,
  showButton = true,
  dialogSize = "xl",
  userDetails,
  fetchPosts,
}: AddItemDialogProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initial: Record<string, string> = {}
    fields.forEach((field) => {
      initial[field.key] = field.defaultValue || ""
    })
    initial["remarks"] = ""
    return initial
  })

  const [purchaseDate, setPurchaseDate] = React.useState<Date | undefined>(
    undefined
  )
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  // Dropdown options
  const options = {
    status: ["deployed", "spare", "lend", "defective", "dispose", "missing"],
    location: [
      "primex",
      "j&l",
      "pasig wh",
      "cdo",
      "cebu",
      "davao",
      "buildchem",
      "disruptive",
    ],
    assetType: ["Laptop", "Monitor", "Desktop"],
    department: [
      "human resources",
      "information technology",
      "marketing",
      "procurement",
      "sales",
      "warehouse operations",
      "operations",
      "engineering",
    ],
  }

  // Auto-generate Asset Tag when Asset Type changes
  const handleAssetTypeChange = (value: string) => {
    const prefix = value.toLowerCase().slice(0, 3)
    const year = new Date().getFullYear()
    const randomNum = Math.floor(1 + Math.random() * 999)
      .toString()
      .padStart(3, "0")
    const assetTag = `${prefix}-${year}-${randomNum}`

    setFormData((prev) => ({
      ...prev,
      assetType: value,
      assetTag,
    }))
  }

  // Compute asset age
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

  // Handle purchase date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    const formattedDate = date.toLocaleDateString("en-CA") // YYYY-MM-DD
    const assetAge = computeAssetAge(date)
    setPurchaseDate(date)
    setFormData((prev) => ({
      ...prev,
      purchaseDate: formattedDate,
      assetAge,
    }))
    setIsCalendarOpen(false)
  }

  // ✅ New handleAddNew: Post to DB (copied & adapted from your Form.tsx)
  const handleAddNew = async () => {
    const requiredFields = fields.filter((f) => f.required)
    const missingFields = requiredFields.filter((f) => !formData[f.key])

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      )
      return
    }

    try {
      const payload = {
        ...formData,
        createdBy: userDetails?.UserId,
      }

      const res = await fetch("/api/backend/inventory/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error(result.error || result.message || "Error occurred.")
        return
      }

      toast.success("Data Added Successfully!")

      // Optional refresh if available
      if (fetchPosts && userDetails?.ReferenceID) {
        fetchPosts(userDetails.ReferenceID)
      }

      // Reset form
      const reset: Record<string, string> = {}
      fields.forEach((field) => {
        reset[field.key] = field.defaultValue || ""
      })
      reset["remarks"] = ""
      setFormData(reset)
      setPurchaseDate(undefined)
      onOpenChange(false)
    } catch (error: any) {
      console.error("❌ Submit error:", error)
      toast.error(error?.message || "Failed to save data.")
    }
  }

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-3xl",
    xl: "max-w-6xl",
  }

  // --- Dialog Body Layout ---
  const DialogBody = (
    <div className="max-h-[70vh] overflow-y-auto px-1 space-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {fields
          .filter(
            (field) =>
              field.key !== "remarks" &&
              field.key !== "purchaseDate" &&
              field.key !== "assetAge"
          )
          .map((field) => {
            const isSelect =
              field.key in options &&
              Array.isArray(options[field.key as keyof typeof options])
            const isAssetTag = field.key === "assetTag"

            return (
              <div key={field.key} className="flex flex-col">
                <Label
                  htmlFor={field.key}
                  className="text-sm font-medium text-muted-foreground mb-1"
                >
                  {field.label}{" "}
                  {field.required && <span className="text-red-500">*</span>}
                </Label>

                {isSelect ? (
                  <div className="relative">
                    <select
                      id={field.key}
                      value={formData[field.key]}
                      onChange={(e) => {
                        const value = e.target.value
                        if (field.key === "assetType") {
                          handleAssetTypeChange(value)
                        } else {
                          setFormData({ ...formData, [field.key]: value })
                        }
                      }}
                      className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">
                        Select {field.label.toLowerCase()}
                      </option>
                      {options[field.key as keyof typeof options].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.charAt(0).toUpperCase() + opt.slice(1)}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <Input
                    id={field.key}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={formData[field.key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.key]: e.target.value })
                    }
                    readOnly={isAssetTag}
                    className={
                      isAssetTag
                        ? "bg-gray-50 text-gray-600 cursor-not-allowed"
                        : ""
                    }
                  />
                )}
              </div>
            )
          })}

        {/* --- Purchase Date --- */}
        <div className="flex flex-col">
          <Label
            htmlFor="purchaseDate"
            className="text-sm font-medium text-muted-foreground mb-1"
          >
            Purchase Date
          </Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal"
              >
                {purchaseDate
                  ? purchaseDate.toLocaleDateString()
                  : "Select purchase date"}
                <ChevronDownIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={purchaseDate}
                captionLayout="dropdown"
                onSelect={handleDateSelect}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* --- Asset Age --- */}
        <div className="flex flex-col">
          <Label
            htmlFor="assetAge"
            className="text-sm font-medium text-muted-foreground mb-1"
          >
            Asset Age
          </Label>
          <Input
            id="assetAge"
            placeholder="Auto-calculated"
            value={formData.assetAge || ""}
            readOnly
            className="bg-gray-50 text-gray-600 cursor-not-allowed"
          />
        </div>
      </div>

      {/* --- Remarks --- */}
      <div className="mt-4">
        <Label
          htmlFor="remarks"
          className="text-sm font-medium text-muted-foreground mb-1"
        >
          Remarks
        </Label>
        <Textarea
          id="remarks"
          placeholder="Enter any remarks here..."
          value={formData.remarks}
          onChange={(e) =>
            setFormData({ ...formData, remarks: e.target.value })
          }
          className="min-h-[100px]"
        />
      </div>
    </div>
  )

  const DialogFooterButtons = (
    <DialogFooter className="mt-4">
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button
        onClick={handleAddNew}
        className="bg-blue-600 hover:bg-blue-700"
      >
        Add Item
      </Button>
    </DialogFooter>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showButton && (
        <Button size="sm" className="gap-2" onClick={() => onOpenChange(true)}>
          <IconPlus className="size-4" />
          Add New
        </Button>
      )}
      <DialogContent className={`${sizeClasses[dialogSize]} p-6`}>
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new item to the database.
          </DialogDescription>
        </DialogHeader>
        {DialogBody}
        {DialogFooterButtons}
      </DialogContent>
    </Dialog>
  )
}
