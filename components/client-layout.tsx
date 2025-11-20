"use client"

import React, { useEffect } from "react"
import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/sidebar/sidebar-right"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Breadcrumbs from "@/components/breadcrumbs"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUser } from "@/contexts/UserContext"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/"
  const { userId, setUserId } = useUser()
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/signup" || pathname === "/auth/otp"
  const showBreadcrumbsInstead = pathname.startsWith("/asset/")

  // ✅ Auto-sync with localStorage whenever it changes
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [setUserId])

  useEffect(() => {
    // ✅ Listen to localStorage changes (e.g., logout/login)
    const handleStorageChange = () => {
      setUserId(localStorage.getItem("userId"))
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [setUserId])

  if (isAuthPage) return <>{children}</>

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
      <AppSidebar userId={userId ?? undefined} variant="inset" />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        {showBreadcrumbsInstead ? (
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
            <Breadcrumbs />
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
