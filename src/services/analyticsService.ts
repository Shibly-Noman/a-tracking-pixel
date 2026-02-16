import { PixelData, AnalyticsReport, ContentTrackingEvent, ContentAnalyticsReport, SocialMediaContent } from '../types';

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

    /**
     * Generate analytics report for specific content
     */
    generateContentAnalytics(
        content: SocialMediaContent,
        events: ContentTrackingEvent[]
    ): ContentAnalyticsReport {
        if (events.length === 0) {
            return {
                content_id: content.content_id,
                platform: content.platform,
                total_impressions: 0,
                unique_users: 0,
                engagement_metrics: {
                    total_engagements: 0,
                    engagement_rate: 0,
                    breakdown: {},
                },
                click_metrics: {
                    total_clicks: 0,
                    ctr: 0,
                    breakdown: {},
                },
                audience_breakdown: {
                    by_device: { mobile: 0, desktop: 0 },
                    by_browser: {},
                    by_os: {},
                },
                timestamp: new Date(),
            };
        }

        // Basic metrics
        const impressions = events.filter(e => e.event_type === 'impression').length;
        const uniqueUsers = new Set(events.map(e => e.userId)).size;

        // Video metrics
        const videoEvents = events.filter(e =>
            e.event_type === 'video_view' ||
            e.event_type === 'video_3s' ||
            e.event_type === 'thruplay'
        );
        
        let videoMetrics = undefined;
        if (videoEvents.length > 0) {
            const videoViews = events.filter(e => e.event_type === 'video_view');
            const threeSecViews = events.filter(e => e.event_type === 'video_3s');
            const thruplayEvents = events.filter(e => e.event_type === 'thruplay');
            
            const totalWatchDuration = videoViews.reduce((sum, e) =>
                sum + (e.event_metadata?.watch_duration || 0), 0
            );
            const avgWatchDuration = videoViews.length > 0 ? totalWatchDuration / videoViews.length : 0;
            
            const totalCompletion = videoViews.reduce((sum, e) =>
                sum + (e.event_metadata?.completion_percentage || 0), 0
            );
            const completionRate = videoViews.length > 0 ? totalCompletion / videoViews.length : 0;
            
            const viewRate = impressions > 0 ? (videoViews.length / impressions) * 100 : 0;

            videoMetrics = {
                total_views: videoViews.length,
                three_second_views: threeSecViews.length,
                thruplay: thruplayEvents.length,
                avg_watch_duration: Math.round(avgWatchDuration * 100) / 100,
                completion_rate: Math.round(completionRate * 100) / 100,
                view_rate: Math.round(viewRate * 100) / 100,
            };
        }

        // Engagement metrics
        const engagementEvents = events.filter(e =>
            e.event_type === 'engagement' ||
            e.event_type === 'share' ||
            e.event_type === 'comment' ||
            e.event_type === 'reaction'
        );
        
        const engagementBreakdown: Record<string, number> = {};
        engagementEvents.forEach(e => {
            if (e.event_type === 'engagement' && e.event_metadata?.engagement_type) {
                const type = e.event_metadata.engagement_type;
                engagementBreakdown[type] = (engagementBreakdown[type] || 0) + 1;
            } else if (e.event_type === 'share') {
                engagementBreakdown.share = (engagementBreakdown.share || 0) + 1;
            } else if (e.event_type === 'comment') {
                engagementBreakdown.comment = (engagementBreakdown.comment || 0) + 1;
            }
        });

        const engagementRate = impressions > 0 ? (engagementEvents.length / impressions) * 100 : 0;

        // Click metrics
        const clickEvents = events.filter(e => e.event_type === 'click');
        const clickBreakdown: Record<string, number> = {};
        clickEvents.forEach(e => {
            if (e.event_metadata?.click_target) {
                const target = e.event_metadata.click_target;
                clickBreakdown[target] = (clickBreakdown[target] || 0) + 1;
            }
        });

        const ctr = impressions > 0 ? (clickEvents.length / impressions) * 100 : 0;

        // Audience breakdown
        const deviceBreakdown = { mobile: 0, desktop: 0 };
        const browserBreakdown: Record<string, number> = {};
        const osBreakdown: Record<string, number> = {};

        events.forEach(e => {
            deviceBreakdown[e.deviceType]++;
            browserBreakdown[e.browserType] = (browserBreakdown[e.browserType] || 0) + 1;
            osBreakdown[e.operatingSystem] = (osBreakdown[e.operatingSystem] || 0) + 1;
        });

        return {
            content_id: content.content_id,
            platform: content.platform,
            total_impressions: impressions,
            unique_users: uniqueUsers,
            video_metrics: videoMetrics,
            engagement_metrics: {
                total_engagements: engagementEvents.length,
                engagement_rate: Math.round(engagementRate * 100) / 100,
                breakdown: engagementBreakdown,
            },
            click_metrics: {
                total_clicks: clickEvents.length,
                ctr: Math.round(ctr * 100) / 100,
                breakdown: clickBreakdown,
            },
            audience_breakdown: {
                by_device: deviceBreakdown,
                by_browser: browserBreakdown,
                by_os: osBreakdown,
            },
            timestamp: new Date(),
        };
    }
}