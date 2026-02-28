"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import dashboardData from "../data/dashboard-data.json"

const { attribution } = dashboardData

const modelDescriptions: Record<string, string> = {
  lastTouch: "100% credit to the last touchpoint before conversion",
  firstTouch: "100% credit to the first touchpoint in the journey",
  linear: "Equal credit distributed across all touchpoints",
  timeDecay: "More credit to touchpoints closer to conversion",
}

const chartConfig = {
  lastTouch: { label: "Last Touch", color: "var(--chart-1)" },
  firstTouch: { label: "First Touch", color: "var(--chart-2)" },
  linear: { label: "Linear", color: "var(--chart-3)" },
  timeDecay: { label: "Time Decay", color: "var(--chart-4)" },
}

type ModelKey = "lastTouch" | "firstTouch" | "linear" | "timeDecay"

// Build comparison data: for each channel, show all 4 models
const channels = attribution.lastTouch.map((item) => item.channel)
const comparisonData = channels.map((channel) => {
  const last = attribution.lastTouch.find((i) => i.channel === channel)
  const first = attribution.firstTouch.find((i) => i.channel === channel)
  const lin = attribution.linear.find((i) => i.channel === channel)
  const decay = attribution.timeDecay.find((i) => i.channel === channel)
  return {
    channel,
    lastTouch: last?.conversions ?? 0,
    firstTouch: first?.conversions ?? 0,
    linear: lin?.conversions ?? 0,
    timeDecay: decay?.conversions ?? 0,
  }
})

// Radar data: for each model, total conversions per channel (normalized)
const radarData = channels.map((channel) => {
  const last = attribution.lastTouch.find((i) => i.channel === channel)
  const first = attribution.firstTouch.find((i) => i.channel === channel)
  const lin = attribution.linear.find((i) => i.channel === channel)
  const decay = attribution.timeDecay.find((i) => i.channel === channel)
  return {
    channel: channel.charAt(0).toUpperCase() + channel.slice(1),
    lastTouch: last?.conversions ?? 0,
    firstTouch: first?.conversions ?? 0,
    linear: lin?.conversions ?? 0,
    timeDecay: decay?.conversions ?? 0,
  }
})

export function AttributionChart() {
  const [activeModel, setActiveModel] = useState<ModelKey>("lastTouch")

  const modelData = attribution[activeModel]
  const totalConversions = modelData.reduce((sum, item) => sum + item.conversions, 0)
  const totalRevenue = modelData.reduce((sum, item) => sum + item.revenue, 0)

  const singleModelConfig = {
    conversions: { label: "Conversions", color: "var(--chart-1)" },
    revenue: { label: "Revenue", color: "var(--chart-2)" },
  }

  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <CardTitle>Attribution Analysis</CardTitle>
            <CardDescription>Multi-touch attribution across marketing channels</CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            <span>Avg. {attribution.avgTouchpoints} touchpoints per conversion</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="comparison">
          <TabsList className="grid w-full grid-cols-2 h-10 mb-6">
            <TabsTrigger value="comparison" className="cursor-pointer text-xs">Model Comparison</TabsTrigger>
            <TabsTrigger value="single" className="cursor-pointer text-xs">Single Model View</TabsTrigger>
          </TabsList>

          {/* Model Comparison - grouped bar chart */}
          <TabsContent value="comparison" className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Side-by-side comparison of how each attribution model credits channels
            </p>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="lastTouch" fill="var(--color-lastTouch)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="firstTouch" fill="var(--color-firstTouch)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="linear" fill="var(--color-linear)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="timeDecay" fill="var(--color-timeDecay)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-3">
              {(Object.keys(chartConfig) as ModelKey[]).map((key) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: `var(--color-${key})` }}
                  />
                  <span className="text-xs text-muted-foreground">{chartConfig[key].label}</span>
                </div>
              ))}
            </div>

            {/* Radar Chart for channel distribution */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Channel Distribution by Model (Radar)</h3>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-muted/40" />
                    <PolarAngleAxis dataKey="channel" tick={{ fontSize: 11 }} />
                    <Radar name="Last Touch" dataKey="lastTouch" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} />
                    <Radar name="First Touch" dataKey="firstTouch" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} />
                    <Radar name="Linear" dataKey="linear" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.15} />
                    <Radar name="Time Decay" dataKey="timeDecay" stroke="var(--chart-4)" fill="var(--chart-4)" fillOpacity={0.15} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Single Model View */}
          <TabsContent value="single" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(chartConfig) as ModelKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveModel(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border cursor-pointer ${
                    activeModel === key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 hover:bg-muted border-transparent"
                  }`}
                >
                  {chartConfig[key].label}
                </button>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-muted/30 border text-xs text-muted-foreground flex items-start gap-2">
              <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
              <span>{modelDescriptions[activeModel]}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border text-center">
                <div className="text-xs text-muted-foreground">Total Attributed Conversions</div>
                <div className="text-2xl font-bold mt-1">{totalConversions.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-lg border text-center">
                <div className="text-xs text-muted-foreground">Total Attributed Revenue</div>
                <div className="text-2xl font-bold mt-1">${(totalRevenue / 1000).toFixed(1)}K</div>
              </div>
            </div>

            <ChartContainer config={singleModelConfig} className="h-[240px] w-full">
              <BarChart data={modelData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="conversions" fill="var(--color-conversions)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>

            <div className="space-y-2">
              {modelData.map((item, i) => {
                const pct = ((item.conversions / totalConversions) * 100).toFixed(1)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium capitalize">{item.channel}</div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: "var(--chart-1)" }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm">{item.conversions.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs w-14 justify-center">{pct}%</Badge>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
