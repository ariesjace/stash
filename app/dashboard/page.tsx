"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, MoreVertical, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

// Data
const metrics = [
  { label: "Total Assets", value: "85" },
  { label: "Deployed", value: "52" },
  { label: "Spare", value: "22" },
  { label: "Maintenance", value: "7" },
]

interface DeployedAsset {
  id: string
  name: string
  category: string
  location: string
  assignedTo: string
  status: "deployed" | "pending" | "maintenance"
  lastUpdated: string
}

const deployedAssets: DeployedAsset[] = [
  {
    id: "laptop-001",
    name: "HP ProBook 450 G10",
    category: "Laptop",
    location: "Primex",
    assignedTo: "Andrea Cruz",
    status: "deployed",
    lastUpdated: "2 hours ago",
  },
  {
    id: "desktop-001",
    name: "Dell OptiPlex 7090",
    category: "Desktop",
    location: "J&L",
    assignedTo: "John Ramos",
    status: "deployed",
    lastUpdated: "5 hours ago",
  },
  {
    id: "monitor-001",
    name: "AOC 24B1XHS Monitor",
    category: "Monitor",
    location: "Pasig WH",
    assignedTo: "Kevin Tan",
    status: "deployed",
    lastUpdated: "1 day ago",
  },
  {
    id: "laptop-002",
    name: "Lenovo ThinkPad X1",
    category: "Laptop",
    location: "Primex",
    assignedTo: "Maria Santos",
    status: "deployed",
    lastUpdated: "3 hours ago",
  },
  {
    id: "desktop-002",
    name: "HP EliteDesk 800 G9",
    category: "Desktop",
    location: "CDO",
    assignedTo: "Carlos Mendez",
    status: "pending",
    lastUpdated: "12 hours ago",
  },
]

const locations = [
  { name: "Primex", id: 1 },
  { name: "J&L", id: 2 },
  { name: "Pasig WH", id: 3 },
  { name: "CDO", id: 4 },
  { name: "Cebu", id: 5 },
]

const categoryColors = {
  Laptop: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Desktop: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Monitor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
}

export default function DashboardPage() {
  return (
    <div className="w-full bg-background">
      {/* Main Content */}
      <div className="w-full">
        <div className="w-full overflow-auto">
          <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Asset Dashboard</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, idx) => (
                <Card key={idx} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <p className="text-4xl font-bold mt-3">{metric.value}</p>
                      </div>
                      <div className="w-12 h-12 rounded-md bg-muted/50 border border-border/30 flex items-center justify-center shrink-0">
                        <div className="w-6 h-6 rounded bg-muted-foreground/20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Deployed Assets and Locations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Deployed Assets List */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-xl">Recent Assigned Assets</CardTitle>
                    <div className="text-sm text-muted-foreground pt-2">
                      <span className="font-semibold text-foreground">35</span> Laptop •
                      <span className="font-semibold text-foreground ml-2">22</span> Desktop •
                      <span className="font-semibold text-foreground ml-2">28</span> Monitor
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deployedAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors group"
                      >
                        {/* Left Section - Asset Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Image Placeholder */}
                          <div className="w-12 h-12 rounded-md bg-muted/50 border border-border/30 flex items-center justify-center shrink-0">
                            <div className="w-6 h-6 rounded bg-muted-foreground/20" />
                          </div>

                          {/* Asset Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm truncate">{asset.name}</span>
                              <Badge
                                variant="outline"
                                className={`text-xs shrink-0 ${categoryColors[asset.category as keyof typeof categoryColors]}`}
                              >
                                {asset.category}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-0.5">
                              <div>
                                <span className="text-muted-foreground">Location:</span> {asset.location}
                              </div>
                              <div>
                                <span className="text-muted-foreground">Assigned to:</span> {asset.assignedTo}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Asset Locations Map */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-xl">Asset Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Map Placeholder */}
                  <div className="w-full h-72 rounded-lg bg-linear-to-br from-muted/50 to-muted/30 border border-border/50 flex items-center justify-center mb-6 relative overflow-hidden">
                    {/* Decorative map elements */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full border-2 border-primary/30" />
                      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full border-2 border-primary/20" />
                      <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full border-2 border-primary/25" />
                    </div>
                    <MapPin className="h-12 w-12 text-muted-foreground/50 relative z-10" />
                  </div>

                  {/* Locations List */}
                  <div className="space-y-3">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="flex items-center gap-1 p-3 rounded hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm">{location.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Software Licenses */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Software Licenses</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Active</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expiring Soon</span>
                    <span className="font-semibold text-yellow-400">6</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expired</span>
                    <span className="font-semibold text-red-400">3</span>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Warranty */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Asset Warranty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Under Warranty</span>
                    <span className="font-semibold">68</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expiring Soon</span>
                    <span className="font-semibold text-yellow-400">9</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expired</span>
                    <span className="font-semibold text-red-400">8</span>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Status */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Asset Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Deployed</span>
                    <span className="font-semibold">52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Spare</span>
                    <span className="font-semibold">22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Maintenance</span>
                    <span className="font-semibold text-orange-400">7</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}