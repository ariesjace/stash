"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Laptop,
  Monitor,
  Cpu,
  Wrench,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Server,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
} from "lucide-react"

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId")
    setUserId(storedUserId)
  }, [])

  return (
    <div className="flex flex-col flex-1 p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome Back, Admin!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here’s your total asset overview. Manage hardware, software, and warranties in one place.
        </p>
      </div>

      {/* Top section: Total Assets + Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Total Assets Overview */}
        <Card className="flex flex-col justify-between border-primary/20 bg-linear  -to-br from-primary/10 via-background to-background p-4">
          <CardHeader className="pb-2">
            <CardDescription>Total Assets</CardDescription>
            <CardTitle className="text-4xl font-bold">85</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center pt-0">
            <Server className="h-10 w-10 text-primary opacity-70" />
            <Button size="sm" asChild>
              <Link href="/assets">Explore All</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Asset Locations */}
        <Card className="p-4">
          <CardHeader className="flex justify-between items-center pb-2">
            <CardTitle className="text-lg">Asset Locations</CardTitle>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              See all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="relative bg-muted/40 rounded-md h-36 mb-3 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary opacity-40" />
            </div>
            <div className="space-y-1.5 text-sm">
              {[
                ["Primex", 28],
                ["J&L", 26],
                ["Pasig WH", 15],
                ["CDO", 11],
                ["Cebu", 11],
                ["Davao", 9],
                ["Buildchem", 8],
                ["Disruptive", 5],
              ].map(([name, count]) => (
                <div
                  key={name}
                  className="flex justify-between border-b last:border-0 py-1"
                >
                  <span>{name}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Four status cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Spare", count: 22, icon: Monitor },
          { title: "Deployed", count: 52, icon: Laptop },
          { title: "Maintenance", count: 7, icon: Wrench },
          { title: "Disposal", count: 4, icon: AlertTriangle },
        ].map((item) => (
          <Card key={item.title} className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-base font-medium">
                <item.icon className="h-4 w-4 text-primary" /> {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 mt-2">
              <p className="text-2xl font-bold">{item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom section: Categories + Software Licenses + Warranties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Laptops", icon: Laptop, count: 35 },
              { name: "Monitors", icon: Monitor, count: 28 },
              { name: "Desktops", icon: Cpu, count: 22 },
            ].map((cat) => (
              <div
                key={cat.name}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <cat.icon className="h-4 w-4" />
                  <span>{cat.name}</span>
                </div>
                <span className="font-semibold">{cat.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Software Licenses Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Software Licenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-green-500" />
                <span>Active Licenses</span>
              </div>
              <span className="font-semibold">42</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-yellow-500" />
                <span>Expiring Soon</span>
              </div>
              <span className="font-semibold">6</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-red-500" />
                <span>Expired</span>
              </div>
              <span className="font-semibold">3</span>
            </div>
          </CardContent>
        </Card>

        {/* Asset Warranty Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Warranty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Under Warranty</span>
              </div>
              <span className="font-semibold">68</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-yellow-500" />
                <span>Expiring Soon</span>
              </div>
              <span className="font-semibold">9</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Expired</span>
              </div>
              <span className="font-semibold">8</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recently Assigned */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Recently Assigned</CardTitle>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground text-left border-b">
                <th className="pb-2">Asset Name</th>
                <th className="pb-2">Serial Number</th>
                <th className="pb-2">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "HP ProBook 450 G10 Laptop",
                  serial: "SN-HPX12345",
                  assigned: "Andrea Cruz",
                },
                {
                  name: "Dell OptiPlex 7090 Desktop",
                  serial: "SN-DLL90876",
                  assigned: "John Ramos",
                },
                {
                  name: "AOC 24B1XHS Monitor",
                  serial: "SN-AOC55421",
                  assigned: "Kevin Tan",
                },
              ].map((item) => (
                <tr
                  key={item.serial}
                  className="border-b last:border-0 hover:bg-muted/40"
                >
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.serial}</td>
                  <td className="py-2">{item.assigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
