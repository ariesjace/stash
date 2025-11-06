"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase()

  // Map status types to theme variables
  const themeColors: Record<string, string> = {
    active:
      "bg-[var(--chart-4)]/15 text-[var(--chart-4)] border border-[var(--chart-4)]/30",
    pending:
      "bg-[var(--chart-2)]/15 text-[var(--chart-2)] border border-[var(--chart-2)]/30",
    inactive:
      "bg-[var(--destructive)]/15 text-[var(--destructive)] border border-[var(--destructive)]/30",
    archived:
      "bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--muted)]/40",
  }

  const colorClass =
    themeColors[normalized] ||
    "bg-[var(--muted)] text-[var(--muted-foreground)] border border-[var(--muted)]/30"

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full capitalize transition-colors",
        colorClass
      )}
    >
      {status}
    </span>
  )
}
