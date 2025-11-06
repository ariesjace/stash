"use client"
import { useState } from "react"
import { IconTrash } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemName?: string
  count?: number
  isMultiple?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  count = 1,
  isMultiple = false,
}: DeleteConfirmationDialogProps) {
  const [consent, setConsent] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {/* Trigger Button */}
      <Button
        variant="destructive"
        className="gap-2 bg-red-600 hover:bg-red-700"
        onClick={() => onOpenChange(true)}
      >
        <IconTrash className="size-4" />
        {isMultiple ? `Delete (${count})` : "Delete"}
      </Button>

      {/* Dialog Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isMultiple ? "Delete selected rows?" : "Delete this item?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isMultiple
              ? `This action cannot be undone. You are about to delete ${count} row(s).`
              : `This action cannot be undone. You are about to delete "${itemName}".`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Consent Checkbox */}
        <div className="flex items-center space-x-2 py-3">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setConsent(checked === true)}
          />
          <label
            htmlFor="consent"
            className="text-sm text-muted-foreground select-none"
          >
            Do you consent on deleting this item?
          </label>
        </div>

        {/* Footer with dynamic layout */}
        <AlertDialogFooter
          className={`flex w-full ${
            consent ? "justify-between sm:justify-end" : "justify-center"
          }`}
        >
          <AlertDialogCancel
            onClick={() => {
              setConsent(false)
              onOpenChange(false)
            }}
          >
            Cancel
          </AlertDialogCancel>

          {/* Delete only appears after consent */}
          {consent && (
            <AlertDialogAction
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
