import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AssetManagementPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Asset Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage your organization's assets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                  Manage asset inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/asset/inventory">
                  <Button className="w-full">View Inventory</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Assigned Assets</CardTitle>
                <CardDescription>
                  View and manage assigned assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/asset/assigned">
                  <Button className="w-full">View Assets</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Disposal</CardTitle>
                <CardDescription>
                  Track disposed assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/asset/disposal">
                  <Button className="w-full">View Disposal</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Warranty Management</CardTitle>
                <CardDescription>
                  Manage asset warranties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/asset/disposal">
                  <Button className="w-full">View Warranty</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Liscence Management</CardTitle>
                <CardDescription>
                  Managge your software liscences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/asset/disposal">
                  <Button className="w-full">View Liscence</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
