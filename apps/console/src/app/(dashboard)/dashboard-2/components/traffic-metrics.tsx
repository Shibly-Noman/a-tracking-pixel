"use client"

import {
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Users,
  Clock,
  MousePointerClick,
  ArrowLeftRight,
  Layers,
  BarChart2
} from "lucide-react"
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import dashboardData from "../data/dashboard-data.json"

const { coreMetrics } = dashboardData

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

const metrics = [
  {
    title: "Total Events",
    value: formatNumber(coreMetrics.totalEvents),
    description: "All recorded behavioral events",
    change: `+${coreMetrics.eventsChange}%`,
    trend: "up" as const,
    icon: Activity,
    footer: "Page views, clicks & custom actions",
    subfooter: "Trending up this period"
  },
  {
    title: "Total Page Views",
    value: formatNumber(coreMetrics.totalPageViews),
    description: "Pages viewed across all sessions",
    change: `+${coreMetrics.pageViewsChange}%`,
    trend: "up" as const,
    icon: Eye,
    footer: "Unique: " + formatNumber(coreMetrics.uniquePageViews),
    subfooter: "Distinct pages by unique sessions"
  },
  {
    title: "Total Sessions",
    value: formatNumber(coreMetrics.totalSessions),
    description: "Cookieless sessions identified",
    change: `+${coreMetrics.sessionsChange}%`,
    trend: "up" as const,
    icon: Users,
    footer: "Unique: " + formatNumber(coreMetrics.uniqueSessions),
    subfooter: "Privacy-first session tracking"
  },
  {
    title: "Avg Session Duration",
    value: formatDuration(coreMetrics.avgSessionDuration),
    description: "Average time per session",
    change: `+${coreMetrics.sessionDurationChange}%`,
    trend: "up" as const,
    icon: Clock,
    footer: "Engagement improving",
    subfooter: "Anonymous session analysis"
  },
  {
    title: "Events Per Session",
    value: coreMetrics.eventsPerSession.toFixed(2),
    description: "Avg events per session",
    change: `+${coreMetrics.eventsPerSessionChange}%`,
    trend: "up" as const,
    icon: MousePointerClick,
    footer: "Higher engagement depth",
    subfooter: "Actions per cookieless session"
  },
  {
    title: "Bounce Rate",
    value: `${coreMetrics.bounceRate}%`,
    description: "Single-event sessions",
    change: `${coreMetrics.bounceRateChange}%`,
    trend: "down" as const,
    icon: ArrowLeftRight,
    footer: "Bounce rate decreasing",
    subfooter: "Sessions with 1 page view only"
  },
  {
    title: "New Sessions",
    value: formatNumber(coreMetrics.newSessions),
    description: "First-time session IDs",
    change: "+11.2%",
    trend: "up" as const,
    icon: Layers,
    footer: "New visitor acquisition",
    subfooter: "No prior session ID observed"
  },
  {
    title: "Returning Sessions",
    value: formatNumber(coreMetrics.returningSessions),
    description: "Repeat session IDs",
    change: "+8.7%",
    trend: "up" as const,
    icon: BarChart2,
    footer: "Strong retention signal",
    subfooter: "Previously observed session IDs"
  }
]

export function TrafficMetrics() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Core Engagement & Traffic Metrics</h2>
        <p className="text-sm text-muted-foreground">Foundational analytics for cookieless session tracking</p>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs grid gap-4 sm:grid-cols-2 @5xl:grid-cols-4">
        {metrics.map((metric) => {
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          const isNegativeTrend = metric.title === "Bounce Rate" && metric.trend === "down"

          return (
            <Card key={metric.title} className="cursor-pointer">
              <CardHeader>
                <CardDescription className="flex items-center gap-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  {metric.title}
                </CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {metric.value}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline" className={isNegativeTrend ? "text-green-600" : ""}>
                    <TrendIcon className="h-4 w-4" />
                    {metric.change}
                  </Badge>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  {metric.footer}
                </div>
                <div className="text-muted-foreground">
                  {metric.subfooter}
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
