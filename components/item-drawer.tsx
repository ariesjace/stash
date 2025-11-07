"use client"

import * as React from "react"
import { toast } from "sonner"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ItemDrawerProps {
  item: Record<string, any>
  fields: Array<{ key: string; label: string }>
  children?: React.ReactNode
  onSave?: () => Promise<void> | void
}

export function ItemDrawer({ item, fields, children, onSave }: ItemDrawerProps) {
  const isMobile = useIsMobile()
  const [isEditing, setIsEditing] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState(() => {
    const data: Record<string, any> = {}
    fields.forEach((field) => {
      data[field.key] = item[field.key] || ""
    })
    return data
  })
  const [isOpen, setIsOpen] = React.useState(false)

  // Reset form data whenever the drawer opens
  React.useEffect(() => {
    if (isOpen) {
      const data: Record<string, any> = {}
      fields.forEach((field) => {
        data[field.key] = item[field.key] || ""
      })
      setFormData(data)
      setIsEditing(false)
    }
  }, [isOpen, item, fields])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/backend/inventory/edit?id=${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to update asset")
      toast.success("Changes saved successfully")
      setIsEditing(false)
      if (onSave) await onSave()
    } catch (error) {
      console.error("Update error:", error)
      toast.error("Failed to save changes")
    } finally {
      setLoading(false)
    }
  }

  const titleValue = item[fields[0]?.key] || "Item"
  const statusValue = item.status || item.Status

  return (
    <Drawer
      direction={isMobile ? "bottom" : "right"}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DrawerTrigger asChild>
        {children ? (
          <div>{children}</div>
        ) : (
          <Button variant="link" className="text-foreground w-fit px-0 text-left">
            {titleValue}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-2">
          <div className="flex items-center justify-between">
            <DrawerTitle>{titleValue}</DrawerTitle>
            {statusValue && <Badge className="bg-blue-600 hover:bg-blue-700">{statusValue}</Badge>}
          </div>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {isEditing ? (
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <Label htmlFor={field.key} className="text-muted-foreground">
                    {field.label}
                  </Label>
                  <Input
                    id={field.key}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="mt-1"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.key}
                  className={`flex justify-between items-center py-2 ${
                    index < fields.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span className="text-muted-foreground">{field.label}</span>
                  <span className="font-medium">{formData[field.key] || "-"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <DrawerFooter className="gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant="outline" disabled={loading}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
