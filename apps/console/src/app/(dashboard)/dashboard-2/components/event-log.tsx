"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield, Download, RefreshCw } from "lucide-react"
import dashboardData from "../data/dashboard-data.json"

const { eventLog } = dashboardData

const EVENT_BADGE_COLORS: Record<string, string> = {
  page_view: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  button_click: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  form_submit: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  purchase: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  video_play: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  scroll_depth_75: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
}

function formatTimestamp(ts: string): string {
  const d = new Date(ts)
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function EventLog() {
  const [search, setSearch] = useState("")
  const [eventFilter, setEventFilter] = useState("all")

  const uniqueEvents = Array.from(new Set(eventLog.map((e) => e.eventName)))

  const filtered = eventLog.filter((event) => {
    const matchesSearch =
      search === "" ||
      event.eventName.includes(search.toLowerCase()) ||
      event.sessionId.includes(search.toLowerCase()) ||
      event.url.includes(search.toLowerCase())
    const matchesEvent = eventFilter === "all" || event.eventName === eventFilter
    return matchesSearch && matchesEvent
  })

  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Raw Event Log
            </CardTitle>
            <CardDescription>
              Anonymized event data — hashed IPs, no PII stored
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="cursor-pointer gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="cursor-pointer gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Privacy Notice */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
          <span>
            All IP addresses are hashed using SHA-256. User agents are normalized. No personally identifiable information (PII) is stored or displayed.
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by event, session ID, or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-full sm:w-44 h-9 cursor-pointer">
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="cursor-pointer">All Events</SelectItem>
              {uniqueEvents.map((evt) => (
                <SelectItem key={evt} value={evt} className="cursor-pointer capitalize">
                  {evt.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="py-3 px-4 text-xs font-semibold">Event</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold">Session ID</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold">URL</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold">Hashed IP</TableHead>
                <TableHead className="py-3 px-4 text-xs font-semibold">Meta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No events match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((event) => (
                  <TableRow key={event.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          EVENT_BADGE_COLORS[event.eventName] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {event.eventName.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4 font-mono text-xs text-muted-foreground">
                      {event.sessionId}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {formatTimestamp(event.timestamp)}
                    </TableCell>
                    <TableCell className="py-3 px-4 font-mono text-xs">
                      {event.url}
                    </TableCell>
                    <TableCell className="py-3 px-4 font-mono text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-primary" />
                        {event.hashedIp}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(event.meta).map(([k, v]) => (
                          <Badge key={k} variant="outline" className="text-xs px-1.5 py-0">
                            {k}: {String(v)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {eventLog.length} events (sample)</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="h-7 text-xs">Previous</Button>
            <Button variant="outline" size="sm" disabled className="h-7 text-xs">Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
