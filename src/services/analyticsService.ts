import { PixelData, AnalyticsReport } from '../types';

export class AnalyticsService {
    analyzeData(data: PixelData[]): AnalyticsReport {
        if (data.length === 0) {
            const now = new Date();
            return {
                totalPixelsTracked: 0,
                uniqueUsers: 0,
                eventsByType: {},
                deviceTypeBreakdown: { mobile: 0, desktop: 0 },
                topBrowsers: [],
                topOperatingSystems: [],
                timestampRange: { earliest: now, latest: now },
                timestamp: now,
            };
        }

        const uniqueUsers = new Set(data.map((p) => p.userId)).size;
        const eventsByType: Record<string, number> = {};
        let mobileCount = 0;
        let desktopCount = 0;
        const browsers: Record<string, number> = {};
        const operatingSystems: Record<string, number> = {};

        data.forEach((pixel) => {
            eventsByType[pixel.eventType] =
                (eventsByType[pixel.eventType] || 0) + 1;

            if (pixel.deviceType === 'mobile') {
                mobileCount++;
            } else {
                desktopCount++;
            }

            browsers[pixel.browserType] =
                (browsers[pixel.browserType] || 0) + 1;
            operatingSystems[pixel.operatingSystem] =
                (operatingSystems[pixel.operatingSystem] || 0) + 1;
        });

        const topBrowsers = Object.entries(browsers)
            .map(([browser, count]) => ({ browser, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const topOS = Object.entries(operatingSystems)
            .map(([os, count]) => ({ os, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const timestamps = data.map((p) => p.timestamp);
        const earliest = new Date(
            Math.min(...timestamps.map((t) => t.getTime()))
        );
        const latest = new Date(
            Math.max(...timestamps.map((t) => t.getTime()))
        );

        return {
            totalPixelsTracked: data.length,
            uniqueUsers,
            eventsByType,
            deviceTypeBreakdown: {
                mobile: mobileCount,
                desktop: desktopCount,
            },
            topBrowsers,
            topOperatingSystems: topOS,
            timestampRange: {
                earliest,
                latest,
            },
            timestamp: new Date(),
        };
    }

    generateReport(analyticsData: AnalyticsReport): string {
        const report = {
            title: 'Pixel Tracking Analytics Report',
            generatedAt: analyticsData.timestamp.toISOString(),
            summary: {
                totalPixelsTracked: analyticsData.totalPixelsTracked,
                uniqueUsers: analyticsData.uniqueUsers,
            },
            deviceBreakdown: analyticsData.deviceTypeBreakdown,
            eventTypes: analyticsData.eventsByType,
            topBrowsers: analyticsData.topBrowsers,
            topOperatingSystems: analyticsData.topOperatingSystems,
            timeRange: {
                from: analyticsData.timestampRange.earliest.toISOString(),
                to: analyticsData.timestampRange.latest.toISOString(),
            },
        };

        return JSON.stringify(report, null, 2);
    }
}