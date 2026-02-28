import { TrafficMetrics } from "./components/traffic-metrics"
import { ActivityOverTime } from "./components/activity-over-time"
import { TrafficSources } from "./components/traffic-sources"
import { ConversionFunnel } from "./components/conversion-funnel"
import { AttributionChart } from "./components/attribution-chart"
import { GeoDeviceBreakdown } from "./components/geo-device-breakdown"
import { EventLog } from "./components/event-log"

export default function Dashboard2() {
  return (
    <div className="flex-1 space-y-8 px-6 pt-0 pb-8">
      {/* Dashboard Header */}
      {/* <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Privacy-first, cookieless analytics — comprehensive insights without compromising user privacy
        </p>
      </div> */}

      {/* Main Dashboard Grid */}
      <div className="@container/main space-y-8">

        {/* Section 1: Core Engagement & Traffic Metrics */}
        <TrafficMetrics />

        {/* Section 2: Activity Over Time */}
        <ActivityOverTime />

        {/* Section 3: Traffic Sources & Campaign Performance */}
        <div className="grid gap-6 grid-cols-1 @5xl:grid-cols-2">
          <TrafficSources />
          <ConversionFunnel />
        </div>

        {/* Section 4: Attribution Analysis */}
        <AttributionChart />

        {/* Section 5: User Behavior & Segmentation */}
        <GeoDeviceBreakdown />

        {/* Section 6: Raw Event Log */}
        <EventLog />

      </div>
    </div>
  )
}
