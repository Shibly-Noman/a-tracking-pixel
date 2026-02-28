"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import dashboardData from "../data/dashboard-data.json"

const { trafficSources } = dashboardData

const sourceChartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
}

const mediumChartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-3)" },
  conversions: { label: "Conversions", color: "var(--chart-4)" },
}

const campaignChartConfig = {
  sessions: { label: "Sessions", color: "var(--chart-1)" },
  conversions: { label: "Conversions", color: "var(--chart-2)" },
}

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
]

export function TrafficSources() {
  const [activeTab, setActiveTab] = useState("source")

  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <CardTitle>Traffic Source & Campaign Performance</CardTitle>
        <CardDescription>Where your traffic originates and campaign effectiveness</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 h-10 mb-6">
            <TabsTrigger value="source" className="cursor-pointer text-xs">By Source</TabsTrigger>
            <TabsTrigger value="medium" className="cursor-pointer text-xs">By Medium</TabsTrigger>
            <TabsTrigger value="campaign" className="cursor-pointer text-xs">By Campaign</TabsTrigger>
            <TabsTrigger value="referrer" className="cursor-pointer text-xs">By Referrer</TabsTrigger>
          </TabsList>

          {/* By Source */}
          <TabsContent value="source" className="space-y-4">
            <ChartContainer config={sourceChartConfig} className="h-[280px] w-full">
              <BarChart
                data={trafficSources.bySource}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted/30" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="source" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} width={70} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[0, 4, 4, 0]}>
                  {trafficSources.bySource.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-3 px-4">Source</TableHead>
                    <TableHead className="text-right py-3 px-4">Sessions</TableHead>
                    <TableHead className="text-right py-3 px-4">Conversions</TableHead>
                    <TableHead className="text-right py-3 px-4">Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trafficSources.bySource.map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      <TableCell className="py-3 px-4 font-medium capitalize">{row.source}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.sessions.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">
                        <Badge variant="outline" className="text-xs">{row.conversionRate}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* By Medium */}
          <TabsContent value="medium" className="space-y-4">
            <ChartContainer config={mediumChartConfig} className="h-[220px] w-full">
              <BarChart
                data={trafficSources.byMedium}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="medium" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]}>
                  {trafficSources.byMedium.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-3 px-4">Medium</TableHead>
                    <TableHead className="text-right py-3 px-4">Sessions</TableHead>
                    <TableHead className="text-right py-3 px-4">Conversions</TableHead>
                    <TableHead className="text-right py-3 px-4">Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trafficSources.byMedium.map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      <TableCell className="py-3 px-4 font-medium capitalize">{row.medium}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.sessions.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">
                        <Badge variant="outline" className="text-xs">{row.conversionRate}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* By Campaign */}
          <TabsContent value="campaign" className="space-y-4">
            <ChartContainer config={campaignChartConfig} className="h-[220px] w-full">
              <BarChart
                data={trafficSources.byCampaign}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                <XAxis dataKey="campaign" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={(v) => v.split("_")[0]} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={[4, 4, 0, 0]}>
                  {trafficSources.byCampaign.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-3 px-4">Campaign</TableHead>
                    <TableHead className="text-right py-3 px-4">Sessions</TableHead>
                    <TableHead className="text-right py-3 px-4">Events</TableHead>
                    <TableHead className="text-right py-3 px-4">Conversions</TableHead>
                    <TableHead className="text-right py-3 px-4">Conv. Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trafficSources.byCampaign.map((row, i) => (
                    <TableRow key={i} className="hover:bg-muted/30">
                      <TableCell className="py-3 px-4 font-medium text-xs">{row.campaign}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.sessions.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.events.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">{row.conversions.toLocaleString()}</TableCell>
                      <TableCell className="text-right py-3 px-4">
                        <Badge variant="outline" className="text-xs">{row.conversionRate}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* By Referrer */}
          <TabsContent value="referrer" className="space-y-4">
            <div className="space-y-3">
              {trafficSources.byReferrer.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-28 text-sm font-medium truncate">{item.referrer}</div>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: COLORS[i % COLORS.length],
                      }}
                    />
                  </div>
                  <div className="w-20 text-right text-sm text-muted-foreground">
                    {item.sessions.toLocaleString()}
                  </div>
                  <div className="w-12 text-right text-sm font-medium">
                    {item.percentage}%
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
