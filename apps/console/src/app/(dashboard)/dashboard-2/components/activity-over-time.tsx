"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dashboardData from "../data/dashboard-data.json"

const { activityOverTime } = dashboardData

const chartConfig = {
  events: {
    label: "Total Events",
    color: "var(--chart-1)",
  },
  pageViews: {
    label: "Page Views",
    color: "var(--chart-2)",
  },
  sessions: {
    label: "Sessions",
    color: "var(--chart-3)",
  },
}

type MetricKey = "events" | "pageViews" | "sessions" | "all"

export function ActivityOverTime() {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("all")

  const visibleKeys: Array<"events" | "pageViews" | "sessions"> =
    activeMetric === "all"
      ? ["events", "pageViews", "sessions"]
      : [activeMetric as "events" | "pageViews" | "sessions"]

  return (
    <Card className="cursor-pointer">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Activity Over Time</CardTitle>
          <CardDescription>Events, page views, and sessions trends</CardDescription>
        </div>
        <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as MetricKey)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="cursor-pointer text-xs px-3">All</TabsTrigger>
            <TabsTrigger value="events" className="cursor-pointer text-xs px-3">Events</TabsTrigger>
            <TabsTrigger value="pageViews" className="cursor-pointer text-xs px-3">Page Views</TabsTrigger>
            <TabsTrigger value="sessions" className="cursor-pointer text-xs px-3">Sessions</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <AreaChart data={activityOverTime} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              {visibleKeys.map((key) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {visibleKeys.map((key) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`var(--color-${key})`}
                fill={`url(#gradient-${key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
