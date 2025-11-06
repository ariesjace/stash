"use client"

import { Fragment } from "react"
import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

// Helper to format route segments into readable titles
function toTitleCase(str: string) {
  return str
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/"
  const segments = pathname.split("/").filter(Boolean)
  const currentPage =
    segments.length > 0 ? toTitleCase(segments[segments.length - 1]) : "Dashboard"

  return (
    <Fragment>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          {/* Sidebar Trigger (for collapsing sidebar) */}
          <SidebarTrigger className="-ml-1" />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          {/* Dynamic Page Title */}
          <h1 className="text-base font-medium">{currentPage}</h1>

          {/* Theme Toggle - pushed to the right */}
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>
    </Fragment>
  )
}