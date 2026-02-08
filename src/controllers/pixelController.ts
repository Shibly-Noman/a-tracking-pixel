import { Request, Response } from 'express';
import { TrackerService } from '../services/trackerService';
import { AnalyticsService } from '../services/analyticsService';
import { PixelData } from '../types';
import {
    generateUniqueId,
    getIpAddress,
    parseUserAgent,
} from '../utils/helpers';

class PixelController {
    private trackerService: TrackerService;
    private analyticsService: AnalyticsService;

    constructor() {
        this.trackerService = new TrackerService();
        this.analyticsService = new AnalyticsService();
    }

    trackPixel(req: Request, res: Response) {
        try {
            const { userId, eventType, metadata } = req.body;
            const userAgent = req.headers['user-agent'] || 'Unknown';
            const ipAddress = getIpAddress(req);
            const userAgentInfo = parseUserAgent(userAgent);

            const pixelData: PixelData = {
                id: generateUniqueId(),
                timestamp: new Date(),
                userId,
                eventType,
                ipAddress,
                browserType: userAgentInfo.browserType,
                browserVersion: userAgentInfo.browserVersion,
                deviceType: userAgentInfo.deviceType,
                operatingSystem: userAgentInfo.operatingSystem,
                osVersion: userAgentInfo.osVersion,
                userAgent,
                metadata,
            };

            this.trackerService.logPixel(pixelData);

            res.status(200).json({
                success: true,
                pixelId: pixelData.id,
                timestamp: pixelData.timestamp,
            });
        } catch (error) {
            console.error('Error tracking pixel:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to track pixel',
            });
        }
    }

    getAnalytics(req: Request, res: Response) {
        try {
            const pixelData = this.trackerService.getPixelData();

            if (pixelData.length === 0) {
                return res.status(200).json({
                    data: {
                        message: 'No pixel data available',
                        totalPixelsTracked: 0,
                    },
                });
            }

            const uniqueUsers = new Set(pixelData.map((p) => p.userId)).size;
            const eventsByType: Record<string, number> = {};

            let mobileCount = 0;
            let desktopCount = 0;
            const browsers: Record<string, number> = {};
            const operatingSystems: Record<string, number> = {};

            pixelData.forEach((pixel) => {
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

            const timestamps = pixelData.map((p) => p.timestamp);
            const earliest = new Date(Math.min(...timestamps.map((t) => t.getTime())));
            const latest = new Date(Math.max(...timestamps.map((t) => t.getTime())));

            const analyticsReport = {
                totalPixelsTracked: pixelData.length,
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

            res.status(200).json({
                success: true,
                data: analyticsReport,
            });
        } catch (error) {
            console.error('Error retrieving analytics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve analytics',
            });
        }
    }
}

export default PixelController;