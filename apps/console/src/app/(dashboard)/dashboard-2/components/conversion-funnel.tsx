"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, ArrowRight } from "lucide-react"
import dashboardData from "../data/dashboard-data.json"

const { funnel, conversions } = dashboardData

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
}

const STAGE_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
]

export function ConversionFunnel() {
  const overallRate = ((funnel[funnel.length - 1].users / funnel[0].users) * 100).toFixed(1)

  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Funnel Analysis</CardTitle>
            <CardDescription>User progression through conversion stages</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Overall Completion</div>
              <div className="text-xl font-bold text-primary">{overallRate}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Total Conversions</div>
              <div className="text-xl font-bold">{conversions.totalConversions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funnel Bar Chart */}
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart data={funnel} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
            <XAxis
              dataKey="stage"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => v.split(" ")[0]}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="users" radius={[4, 4, 0, 0]}>
              {funnel.map((_, index) => (
                <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {/* Funnel Steps Visual */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Stage Breakdown</h3>
          <div className="flex flex-col gap-2">
            {funnel.map((stage, index) => {
              const prevUsers = index > 0 ? funnel[index - 1].users : stage.users
              const stageDropRate = index > 0 ? (((prevUsers - stage.users) / prevUsers) * 100).toFixed(1) : null

              return (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-between flex-1 p-3 rounded-lg border"
                      style={{ borderLeftColor: STAGE_COLORS[index], borderLeftWidth: 3 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-5">{index + 1}</span>
                        <span className="text-sm font-medium">{stage.stage}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">{stage.users.toLocaleString()}</span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{ color: STAGE_COLORS[index] }}
                        >
                          {stage.completionRate}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {stageDropRate && (
                    <div className="flex items-center gap-2 pl-8 text-xs text-muted-foreground">
                      <TrendingDown className="h-3 w-3 text-destructive" />
                      <span className="text-destructive font-medium">{stageDropRate}% drop-off</span>
                      <span>({stage.dropoff.toLocaleString()} users left)</span>
                      <ArrowRight className="h-3 w-3" />
                      <span>{stage.completionRate}% continued</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Conversion Event Types */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Conversions by Event Type</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {conversions.byEventType.map((item, i) => (
              <div key={i} className="p-3 rounded-lg border text-center">
                <div className="text-xs text-muted-foreground capitalize mb-1">{item.event.replace("_", " ")}</div>
                <div className="text-lg font-bold">{item.count.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">${(item.revenue / 1000).toFixed(1)}K rev</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
