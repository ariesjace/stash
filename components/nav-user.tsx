"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  BadgeCheck,
  EllipsisVertical,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
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

interface NavUserProps {
  user: {
    id?: string
    name: string
    email: string
    avatar: string
  }
  userId: string
  appendUserId?: (url: string) => string
}

export function NavUser({ user, userId, appendUserId }: NavUserProps) {
  const router = useRouter()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)
  const { state } = useSidebar()
  const [userData, setUserData] = useState(user)

  // ✅ Fetch latest user data automatically
  useEffect(() => {
    if (!userId) return
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user?id=${encodeURIComponent(userId)}`)
        if (!res.ok) throw new Error("Failed to fetch user data")
        const data = await res.json()
        setUserData({
          id: data._id,
          name: `${data.Firstname || ""} ${data.Lastname || ""}`.trim() || "Unnamed User",
          email: data.Email || "No email",
          avatar: data.profilePicture || "/default-avatar.png",
        })
      } catch (err) {
        console.error("Error fetching user:", err)
      }
    }

    fetchUserData()

    // Optional: Re-fetch automatically every 30s (live sync)
    const interval = setInterval(fetchUserData, 30000)
    return () => clearInterval(interval)
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    router.replace("/login")
    setLogoutDialogOpen(false)
  }

  const linkWithUserId = (url: string) => {
    if (appendUserId) return appendUserId(url)
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}userId=${encodeURIComponent(userId)}`
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="relative">
          <div
            className={`flex items-center justify-between w-full transition-colors
            ${state === "collapsed" ? "justify-center px-2 py-2" : "gap-2 px-2 py-1.5"}`}
          >
            {state === "collapsed" ? (
              <Avatar
                className="h-8 w-8 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => router.push(linkWithUserId("/profile"))}
              >
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-lg">
                  {userData.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <>
                {/* Avatar + Info */}
                <Link
                  href={linkWithUserId("/profile")}
                  className="flex items-center gap-3 flex-1 rounded-lg px-2 py-1 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={userData.avatar} alt={userData.name} />
                    <AvatarFallback className="rounded-lg">
                      {userData.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="truncate font-medium">{userData.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
                  </div>
                </Link>

                {/* Ellipsis Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 rounded-lg transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                      <EllipsisVertical className="size-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-56 rounded-lg" align="end" sideOffset={4}>
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={userData.avatar} alt={userData.name} />
                          <AvatarFallback className="rounded-lg">
                            {userData.name?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">{userData.name}</span>
                          <span className="truncate text-xs text-muted-foreground">{userData.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href={linkWithUserId("/profile")} className="flex items-center">
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Notifications</DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => setLogoutDialogOpen(true)}
                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You’ll be redirected to the login page and will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700"
            >
              Log out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}