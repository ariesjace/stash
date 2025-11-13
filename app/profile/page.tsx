"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const userId = searchParams?.get("userId")

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userId) return

    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/user?id=${userId}`)
        if (!res.ok) throw new Error("Failed to fetch user data")
        const data = await res.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
        toast.error("Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  const handleSaveChanges = async () => {
    if (!user) return
    setSaving(true)

    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user._id,
          Firstname: user.Firstname,
          Lastname: user.Lastname,
          Email: user.Email,
          profilePicture: user.profilePicture,
        }),
      })

      if (!res.ok) throw new Error("Failed to save changes")
      toast.success("Profile updated successfully ✅")
    } catch (error) {
      console.error("Error saving changes:", error)
      toast.error("Failed to save changes ❌")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUser((prev: any) => ({ ...prev, [field]: value }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading user details...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>User not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile Overview */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.profilePicture || "https://github.com/shadcn.png"} alt="Profile picture" />
                  <AvatarFallback>
                    {user.Firstname?.[0]}
                    {user.Lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-semibold">{`${user.Firstname} ${user.Lastname}`}</h3>
                  <p className="text-sm text-muted-foreground">{user.Email}</p>
                  {user.Role && (
                    <Badge
                      variant={user.Role === "Admin" ? "destructive" : "secondary"}
                      className="mt-2"
                    >
                      {user.Role}
                    </Badge>
                  )}

                </div>
                <Button variant="outline" className="w-full">Change Avatar</Button>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={user.Firstname || ""}
                    onChange={(e) => handleInputChange("Firstname", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={user.Lastname || ""}
                    onChange={(e) => handleInputChange("Lastname", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.Email || ""}
                    onChange={(e) => handleInputChange("Email", e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveChanges} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="••••••••" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about asset changes
                  </p>
                </div>
                <Switch id="emailNotifications" defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maintenance Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming maintenance
                  </p>
                </div>
                <Switch id="maintenanceAlerts" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">System Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Stay informed about system changes
                  </p>
                </div>
                <Switch id="systemUpdates" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Delete Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}