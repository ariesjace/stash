"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Breadcrumbs from "@/components/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/"
  const [userId, setUserId] = useState<string | null>(null)
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const showBreadcrumbsInstead = pathname.includes("/some-page")

  // ✅ Load userId from localStorage after login
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])

  // If it's an auth page, just render children without sidebar/header
  if (isAuthPage) {
    return <>{children}</>
  }

  // Normal layout with sidebar and header
  return (
    <SidebarProvider
      className="h-screen"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar userId={userId} variant="inset" />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        {showBreadcrumbsInstead ? (
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
            {/* Sidebar Trigger */}
            <SidebarTrigger className="-ml-1" />

            {/* Vertical Separator */}
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

            {/* Breadcrumbs */}
            <Breadcrumbs />

            {/* Theme Toggle - pushed to the right */}
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </header>
        ) : (
          <SiteHeader />
        )}

        <div className="flex-1 h-0 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
