"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  icon?: React.ComponentType<{ className?: string }>
  component?: React.ReactNode
  url?: string
  items?: {
    title: string
    component?: React.ReactNode
    url?: string
  }[]
}

export function NavMain({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = Array.isArray(item.items) && item.items.length > 0

          // Main button content (either component or a default Link)
          const mainButton = item.component ?? (
            <Link
              href={item.url || "#"}
              className={`flex items-center gap-2 ${
                pathname === item.url
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </Link>
          )

          return (
            <Collapsible key={item.title} asChild defaultOpen={false}>
              <SidebarMenuItem>
                {/* Main navigation button */}
                <SidebarMenuButton asChild tooltip={item.title}>
                  {mainButton}
                </SidebarMenuButton>

                {/* Collapsible sub-items (if any) */}
                {hasSubItems && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction className="data-[state=open]:rotate-90">
                        <ChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          const subButton = subItem.component ?? (
                            <Link
                              href={subItem.url || "#"}
                              className={`flex items-center gap-2 ${
                                pathname === subItem.url
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          )

                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                {subButton}
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          )
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </>
                )}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
