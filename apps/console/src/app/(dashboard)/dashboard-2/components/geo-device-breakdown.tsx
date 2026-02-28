"use client"

import { Cell, Pie, PieChart, RadialBar, RadialBarChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Smartphone, Tablet, Globe, BarChart2 } from "lucide-react"
import dashboardData from "../data/dashboard-data.json"

const { behavior } = dashboardData

const deviceIcons: Record<string, React.ElementType> = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
}

const DEVICE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]
const BROWSER_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]
const GEO_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]

const deviceChartConfig = {
  Desktop: { label: "Desktop", color: "var(--chart-1)" },
  Mobile: { label: "Mobile", color: "var(--chart-2)" },
  Tablet: { label: "Tablet", color: "var(--chart-3)" },
}

const browserChartConfig = {
  Chrome: { label: "Chrome", color: "var(--chart-1)" },
  Safari: { label: "Safari", color: "var(--chart-2)" },
  Firefox: { label: "Firefox", color: "var(--chart-3)" },
  Edge: { label: "Edge", color: "var(--chart-4)" },
  Other: { label: "Other", color: "var(--chart-5)" },
}

const devicePieData = behavior.deviceBreakdown.map((d) => ({
  name: d.device,
  value: d.sessions,
  fill: DEVICE_COLORS[behavior.deviceBreakdown.indexOf(d)],
}))

const browserRadialData = behavior.browserBreakdown.map((b, i) => ({
  name: b.browser,
  value: b.percentage,
  fill: BROWSER_COLORS[i],
}))

export function GeoDeviceBreakdown() {
  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <CardTitle>User Behavior & Segmentation</CardTitle>
        <CardDescription>Device, browser, and geographic distribution of anonymous sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="device">
          <TabsList className="grid w-full grid-cols-4 h-10 mb-6">
            <TabsTrigger value="device" className="cursor-pointer text-xs">Device</TabsTrigger>
            <TabsTrigger value="browser" className="cursor-pointer text-xs">Browser</TabsTrigger>
            <TabsTrigger value="geo" className="cursor-pointer text-xs">Geography</TabsTrigger>
            <TabsTrigger value="pages" className="cursor-pointer text-xs">Top Pages</TabsTrigger>
          </TabsList>

          {/* Device Breakdown */}
          <TabsContent value="device">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer config={deviceChartConfig} className="h-[240px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={devicePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                    strokeWidth={2}
                  >
                    {devicePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="flex flex-col justify-center space-y-4">
                {behavior.deviceBreakdown.map((item, i) => {
                  const Icon = deviceIcons[item.device] || Monitor
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${DEVICE_COLORS[i]}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: DEVICE_COLORS[i] }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.device}</span>
                          <span className="text-sm font-bold">{item.percentage}%</span>
                        </div>
                        <div className="mt-1 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${item.percentage}%`, backgroundColor: DEVICE_COLORS[i] }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{item.sessions.toLocaleString()} sessions</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          {/* Browser Breakdown */}
          <TabsContent value="browser">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer config={browserChartConfig} className="h-[260px] w-full">
                <RadialBarChart
                  data={browserRadialData}
                  innerRadius={20}
                  outerRadius={110}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar dataKey="value" background={{ fill: "var(--muted)" }} cornerRadius={4}>
                    {browserRadialData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RadialBar>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadialBarChart>
              </ChartContainer>

              <div className="flex flex-col justify-center space-y-3">
                {behavior.browserBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: BROWSER_COLORS[i] }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.browser}</span>
                        <span className="font-bold">{item.percentage}%</span>
                      </div>
                      <div className="mt-1 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.percentage}%`, backgroundColor: BROWSER_COLORS[i] }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">{item.sessions.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Geo Breakdown */}
          <TabsContent value="geo">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <Globe className="h-3.5 w-3.5" />
                <span>Aggregated geo-location data (privacy-preserving, country-level)</span>
              </div>
              {behavior.geoBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium truncate">{item.country}</div>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: GEO_COLORS[i % GEO_COLORS.length],
                      }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm text-muted-foreground">
                    {item.sessions.toLocaleString()}
                  </div>
                  <div className="w-12 text-right text-sm font-bold">
                    {item.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Top Pages */}
          <TabsContent value="pages">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <BarChart2 className="h-3.5 w-3.5" />
                <span>Most frequently visited pages with engagement metrics</span>
              </div>
              {behavior.topPages.map((page, i) => (
                <div key={i} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: GEO_COLORS[i % GEO_COLORS.length] }}
                      >
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium font-mono">{page.url}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{Math.floor(page.avgDuration / 60)}m {page.avgDuration % 60}s avg</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <span>{page.views.toLocaleString()} total views</span>
                    <span className="text-right">{page.uniqueViews.toLocaleString()} unique views</span>
                  </div>
                  <div className="mt-2 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(page.views / behavior.topPages[0].views) * 100}%`,
                        backgroundColor: GEO_COLORS[i % GEO_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
