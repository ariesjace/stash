"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", assigned: 120, inventory: 45 },
  { date: "2024-04-02", assigned: 125, inventory: 42 },
  { date: "2024-04-03", assigned: 128, inventory: 40 },
  { date: "2024-04-04", assigned: 132, inventory: 38 },
  { date: "2024-04-05", assigned: 135, inventory: 35 },
  { date: "2024-04-06", assigned: 138, inventory: 32 },
  { date: "2024-04-07", assigned: 140, inventory: 30 },
  { date: "2024-04-08", assigned: 142, inventory: 28 },
  { date: "2024-04-09", assigned: 141, inventory: 29 },
  { date: "2024-04-10", assigned: 143, inventory: 27 },
  { date: "2024-04-11", assigned: 145, inventory: 25 },
  { date: "2024-04-12", assigned: 147, inventory: 23 },
  { date: "2024-04-13", assigned: 148, inventory: 22 },
  { date: "2024-04-14", assigned: 150, inventory: 20 },
  { date: "2024-04-15", assigned: 151, inventory: 19 },
  { date: "2024-04-16", assigned: 152, inventory: 18 },
  { date: "2024-04-17", assigned: 153, inventory: 17 },
  { date: "2024-04-18", assigned: 154, inventory: 16 },
  { date: "2024-04-19", assigned: 155, inventory: 15 },
  { date: "2024-04-20", assigned: 156, inventory: 14 },
  { date: "2024-04-21", assigned: 156, inventory: 14 },
  { date: "2024-04-22", assigned: 156, inventory: 14 },
  { date: "2024-04-23", assigned: 156, inventory: 14 },
  { date: "2024-04-24", assigned: 156, inventory: 14 },
  { date: "2024-04-25", assigned: 156, inventory: 14 },
  { date: "2024-04-26", assigned: 156, inventory: 14 },
  { date: "2024-04-27", assigned: 156, inventory: 14 },
  { date: "2024-04-28", assigned: 156, inventory: 14 },
  { date: "2024-04-29", assigned: 156, inventory: 14 },
  { date: "2024-04-30", assigned: 156, inventory: 14 },
  { date: "2024-05-01", assigned: 156, inventory: 14 },
  { date: "2024-05-02", assigned: 156, inventory: 14 },
  { date: "2024-05-03", assigned: 156, inventory: 14 },
  { date: "2024-05-04", assigned: 156, inventory: 14 },
  { date: "2024-05-05", assigned: 156, inventory: 14 },
  { date: "2024-05-06", assigned: 156, inventory: 14 },
  { date: "2024-05-07", assigned: 156, inventory: 14 },
  { date: "2024-05-08", assigned: 156, inventory: 14 },
  { date: "2024-05-09", assigned: 156, inventory: 14 },
  { date: "2024-05-10", assigned: 156, inventory: 14 },
  { date: "2024-05-11", assigned: 156, inventory: 14 },
  { date: "2024-05-12", assigned: 156, inventory: 14 },
  { date: "2024-05-13", assigned: 156, inventory: 14 },
  { date: "2024-05-14", assigned: 156, inventory: 14 },
  { date: "2024-05-15", assigned: 156, inventory: 14 },
  { date: "2024-05-16", assigned: 156, inventory: 14 },
  { date: "2024-05-17", assigned: 156, inventory: 14 },
  { date: "2024-05-18", assigned: 156, inventory: 14 },
  { date: "2024-05-19", assigned: 156, inventory: 14 },
  { date: "2024-05-20", assigned: 156, inventory: 14 },
  { date: "2024-05-21", assigned: 156, inventory: 14 },
  { date: "2024-05-22", assigned: 156, inventory: 14 },
  { date: "2024-05-23", assigned: 156, inventory: 14 },
  { date: "2024-05-24", assigned: 156, inventory: 14 },
  { date: "2024-05-25", assigned: 156, inventory: 14 },
  { date: "2024-05-26", assigned: 156, inventory: 14 },
  { date: "2024-05-27", assigned: 156, inventory: 14 },
  { date: "2024-05-28", assigned: 156, inventory: 14 },
  { date: "2024-05-29", assigned: 156, inventory: 14 },
  { date: "2024-05-30", assigned: 156, inventory: 14 },
  { date: "2024-05-31", assigned: 156, inventory: 14 },
  { date: "2024-06-01", assigned: 156, inventory: 14 },
  { date: "2024-06-02", assigned: 156, inventory: 14 },
  { date: "2024-06-03", assigned: 156, inventory: 14 },
  { date: "2024-06-04", assigned: 156, inventory: 14 },
  { date: "2024-06-05", assigned: 156, inventory: 14 },
  { date: "2024-06-06", assigned: 156, inventory: 14 },
  { date: "2024-06-07", assigned: 156, inventory: 14 },
  { date: "2024-06-08", assigned: 156, inventory: 14 },
  { date: "2024-06-09", assigned: 156, inventory: 14 },
  { date: "2024-06-10", assigned: 156, inventory: 14 },
  { date: "2024-06-11", assigned: 156, inventory: 14 },
  { date: "2024-06-12", assigned: 156, inventory: 14 },
  { date: "2024-06-13", assigned: 156, inventory: 14 },
  { date: "2024-06-14", assigned: 156, inventory: 14 },
  { date: "2024-06-15", assigned: 156, inventory: 14 },
  { date: "2024-06-16", assigned: 156, inventory: 14 },
  { date: "2024-06-17", assigned: 156, inventory: 14 },
  { date: "2024-06-18", assigned: 156, inventory: 14 },
  { date: "2024-06-19", assigned: 156, inventory: 14 },
  { date: "2024-06-20", assigned: 156, inventory: 14 },
  { date: "2024-06-21", assigned: 156, inventory: 14 },
  { date: "2024-06-22", assigned: 156, inventory: 14 },
  { date: "2024-06-23", assigned: 156, inventory: 14 },
  { date: "2024-06-24", assigned: 156, inventory: 14 },
  { date: "2024-06-25", assigned: 156, inventory: 14 },
  { date: "2024-06-26", assigned: 156, inventory: 14 },
  { date: "2024-06-27", assigned: 156, inventory: 14 },
  { date: "2024-06-28", assigned: 156, inventory: 14 },
  { date: "2024-06-29", assigned: 156, inventory: 14 },
  { date: "2024-06-30", assigned: 156, inventory: 14 },
]

const chartConfig = {
  assigned: {
    label: "Assigned Assets",
    color: "var(--primary)",
  },
  inventory: {
    label: "Inventory Items",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Asset Distribution</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">Assigned vs Inventory for the last 3 months</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAssigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-assigned)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--color-assigned)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillInventory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-inventory)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-inventory)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="inventory"
              type="natural"
              fill="url(#fillInventory)"
              stroke="var(--color-inventory)"
              stackId="a"
            />
            <Area
              dataKey="assigned"
              type="natural"
              fill="url(#fillAssigned)"
              stroke="var(--color-assigned)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
