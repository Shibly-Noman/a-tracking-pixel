import { Request, Response } from 'express';
import { contentService, trackerService, analyticsService } from '../services';
import { ContentService, TrackerService, AnalyticsService } from '../services';
import { PixelData, ContentTrackingEvent } from '../types';
import {
    generateUniqueId,
    getIpAddress,
    parseUserAgent,
} from '../utils/helpers';

class PixelController {
    private trackerService: TrackerService;
    private analyticsService: AnalyticsService;
    private contentService: ContentService;

    constructor() {
        // Use shared singleton instances instead of creating new ones
        this.trackerService = trackerService;
        this.analyticsService = analyticsService;
        this.contentService = contentService;
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

    /**
     * Track content event
     * POST /api/track-content-event
     */
    trackContentEvent(req: Request, res: Response) {
        try {
            const { content_id, event_type, userId, event_metadata } = req.body;

            // Validate required fields
            if (!content_id) {
                return res.status(400).json({
                    success: false,
                    error: 'content_id is required',
                });
            }

            if (!event_type) {
                return res.status(400).json({
                    success: false,
                    error: 'event_type is required',
                });
            }

            if (!userId) {
                return res.status(400).json({
                    success: false,
                    error: 'userId is required',
                });
            }

            // Check if content exists
            const content = this.contentService.getById(content_id);
            if (!content) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found',
                    content_id,
                });
            }

            // Get user agent info
            const userAgent = req.headers['user-agent'] || 'Unknown';
            const ipAddress = getIpAddress(req);
            const userAgentInfo = parseUserAgent(userAgent);

            // Create content tracking event
            const event: ContentTrackingEvent = {
                event_id: generateUniqueId(),
                content_id,
                event_type,
                userId,
                timestamp: new Date(),
                ipAddress,
                browserType: userAgentInfo.browserType,
                browserVersion: userAgentInfo.browserVersion,
                deviceType: userAgentInfo.deviceType,
                operatingSystem: userAgentInfo.operatingSystem,
                osVersion: userAgentInfo.osVersion,
                userAgent,
                event_metadata,
            };

            // Log the event
            this.trackerService.logContentEvent(event);

            res.status(200).json({
                success: true,
                event_id: event.event_id,
                timestamp: event.timestamp,
            });
        } catch (error: any) {
            console.error('Error tracking content event:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to track content event',
            });
        }
    }

    // Expose services for dependency injection
    getTrackerService(): TrackerService {
        return this.trackerService;
    }

    getAnalyticsService(): AnalyticsService {
        return this.analyticsService;
    }

    getContentService(): ContentService {
        return this.contentService;
    }
}

export default PixelController;