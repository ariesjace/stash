"use client"

import * as React from "react"
import { useEffect, useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation"
import {
  FolderKanban,
  Clock,
  FolderCheck,
  Cog,
  Gauge,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  userId?: string;

}

export function AppSidebar({ userId, ...props }: AppSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { state } = useSidebar()
  const searchParams = useSearchParams();

  const [userDetails, setUserDetails] = React.useState({
    UserId: "",
    Firstname: "",
    Lastname: "",
    Email: "",
    profilePicture: "",
    ReferenceID: "",
  })

  React.useEffect(() => {
    if (!userId) return;
    fetch(`/api/user?id=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        setUserDetails({
          UserId: data._id || userId,
          Firstname: data.Firstname || "Leroux",
          Lastname: data.Lastname || "Xchire",
          Email: data.Email || "example@email.com",
          profilePicture: data.profilePicture || "/avatars/default.jpg",
          ReferenceID: data.ReferenceID || "N/A",
        })
      })
      .catch((err) => console.error(err));
  }, [userId]);

  // ✅ Append userId to URLs
  const appendUserId = (url: string) => {
    if (!userId) return url
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}userId=${encodeURIComponent(userId)}`
  }

  // ✅ Navigation items
  const navMain = [
    {
      title: "Dashboard",
      url: appendUserId("/dashboard"),
      icon: Gauge,
      isActive: pathname?.startsWith("/dashboard"),
    },
    {
      title: "Asset Management",
      url: appendUserId("/asset"),
      icon: FolderKanban,
      isActive: pathname?.startsWith("/asset"),
      items: [
        { title: "Inventory", url: appendUserId("/asset/inventory") },
        { title: "Assigned Assets", url: appendUserId("/asset/assigned") },
        { title: "Disposal", url: appendUserId("/asset/disposal") },
        { title: "License Management", url: appendUserId("/asset/liscence") },
        { title: "Warranty Management", url: appendUserId("/asset/warranty") },
      ],
    },
    {
      title: "Maintenance",
      url: appendUserId("/maintenance"),
      icon: Cog,
      isActive: pathname?.startsWith("/maintenance"),
    },
    {
      title: "Audit Logs",
      url: appendUserId("/audit"),
      icon: FolderCheck,
      isActive: pathname?.startsWith("/audit"),
    },
    {
      title: "History Logs",
      url: appendUserId("/history"),
      icon: Clock,
      isActive: pathname?.startsWith("/history"),
    },
  ]

  const data = {
    user: {
      name: `${userDetails.Firstname} ${userDetails.Lastname}`,
      email: userDetails.Email,
      avatar: userDetails.profilePicture,
    },
    navMain,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Sidebar Header (Logo Section) */}
      <SidebarHeader className="pb-2"> {/* reduced bottom padding */}
        <Link
          href={appendUserId("/dashboard")}
          className={`flex items-center transition-all duration-200 ${state === "collapsed"
            ? "justify-center py-3"
            : "justify-start gap-3 px-3 py-2"
            }`}
        >
          <div className="shrink-0 w-12 h-12 flex items-center justify-center">
            <Image
              src="/stashminidark.png"
              alt="Stash"
              width={40}
              height={40}
              className="rounded-md object-contain"
              priority
            />
          </div>

          {state !== "collapsed" && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Stash</span>
              <span className="truncate text-xs text-muted-foreground">
                IT Asset Inventory System
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* Sidebar Navigation (Closer to header) */}
      <SidebarContent className="pt-0 -mt-1">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Sidebar Footer (User Info) */}
      <SidebarFooter>
  {userId ? (
    <NavUser
      user={{
        id: userDetails.UserId || undefined,
        name: `${userDetails.Firstname} ${userDetails.Lastname}`,
        email: userDetails.Email,
        avatar: userDetails.profilePicture,
      }}
      userId={userId}
      appendUserId={(url: string) => appendUserId(url)} // ✅ Pass function
    />
  ) : null}
</SidebarFooter>


      <SidebarRail />
    </Sidebar>
  )
}
