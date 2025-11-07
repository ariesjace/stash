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
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"

interface ItemDrawerProps {
  item: Record<string, any>
  fields: Array<{ key: string; label: string }>
  children?: React.ReactNode
}

export function ItemDrawer({ item, fields, children }: ItemDrawerProps) {
  const isMobile = useIsMobile()
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState(() => {
    const data: Record<string, any> = {}
    fields.forEach((field) => {
      data[field.key] = item[field.key] || ""
    })
    return data
  })
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const handleSave = () => {
    setIsEditing(false)
    toast.success("Changes saved successfully")
  }

  const handleDelete = () => {
    setShowDeleteDialog(false)
    toast.success("Item deleted successfully")
  }

  const titleValue = item[fields[0]?.key] || "Item"
  const statusValue = item.status || item.Status

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
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
                  className={`flex justify-between items-center py-2 ${index < fields.length - 1 ? "border-b" : ""}`}
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
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Save
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="default" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            </>
          )}
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
