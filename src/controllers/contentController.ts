import { Request, Response } from 'express';
import { contentService, trackerService, analyticsService } from '../services';
import { ContentService, TrackerService, AnalyticsService } from '../services';
import { SocialMediaContent, ContentFilters } from '../types';

class ContentController {
    private contentService: ContentService;
    private trackerService: TrackerService;
    private analyticsService: AnalyticsService;

    constructor() {
        // Use shared singleton instances instead of creating new ones
        this.contentService = contentService;
        this.trackerService = trackerService;
        this.analyticsService = analyticsService;
    }

    /**
     * Create new content
     * POST /api/content
     */
    createContent(req: Request, res: Response) {
        try {
            const contentData: SocialMediaContent = req.body;

            // Validate required fields
            if (!contentData.content_id) {
                return res.status(400).json({
                    success: false,
                    error: 'content_id is required',
                });
            }

            if (!contentData.platform) {
                return res.status(400).json({
                    success: false,
                    error: 'platform is required',
                });
            }

            const content = this.contentService.create(contentData);

            res.status(201).json({
                success: true,
                data: content,
            });
        } catch (error: any) {
            console.error('Error creating content:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to create content',
            });
        }
    }

    /**
     * Get all content with optional filters
     * GET /api/content?platform=facebook&status=published
     */
    getAllContent(req: Request, res: Response) {
        try {
            const filters: ContentFilters = {
                platform: req.query.platform as string,
                status: req.query.status as string,
                campaign_objective: req.query.campaign_objective as string,
            };

            const contents = this.contentService.getAll(filters);

            res.status(200).json({
                success: true,
                data: contents,
                count: contents.length,
            });
        } catch (error: any) {
            console.error('Error retrieving content:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve content',
            });
        }
    }

    /**
     * Get specific content by ID
     * GET /api/content/:contentId
     */
    getContentById(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const content = this.contentService.getById(contentId);

            if (!content) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found',
                    content_id: contentId,
                });
            }

            res.status(200).json({
                success: true,
                data: content,
            });
        } catch (error: any) {
            console.error('Error retrieving content:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve content',
            });
        }
    }

    /**
     * Update existing content
     * PUT /api/content/:contentId
     */
    updateContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const updates: Partial<SocialMediaContent> = req.body;

            const content = this.contentService.update(contentId, updates);

            res.status(200).json({
                success: true,
                data: content,
            });
        } catch (error: any) {
            console.error('Error updating content:', error);
            
            if (error.message.includes('not found')) {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Failed to update content',
            });
        }
    }

    /**
     * Delete content
     * DELETE /api/content/:contentId
     */
    deleteContent(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            const deleted = this.contentService.delete(contentId);

            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found',
                    content_id: contentId,
                });
            }

            res.status(200).json({
                success: true,
                message: 'Content deleted successfully',
            });
        } catch (error: any) {
            console.error('Error deleting content:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete content',
            });
        }
    }

    /**
     * Get content analytics
     * GET /api/content-analytics/:contentId
     */
    getContentAnalytics(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            
            // Check if content exists
            const content = this.contentService.getById(contentId);
            if (!content) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found',
                    content_id: contentId,
                });
            }

            // Get events for this content
            const events = this.trackerService.getEventsByContent(contentId);

            // Generate analytics
            const analytics = this.analyticsService.generateContentAnalytics(content, events);

            res.status(200).json({
                success: true,
                data: analytics,
            });
        } catch (error: any) {
            console.error('Error generating content analytics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate analytics',
            });
        }
    }

    /**
     * Get aggregated content analytics
     * GET /api/content-analytics?platform=facebook
     */
    getAggregatedAnalytics(req: Request, res: Response) {
        try {
            const filters: ContentFilters = {
                platform: req.query.platform as string,
                status: req.query.status as string,
                campaign_objective: req.query.campaign_objective as string,
            };

            const contents = this.contentService.getAll(filters);
            const reports = contents.map(content => {
                const events = this.trackerService.getEventsByContent(content.content_id);
                return this.analyticsService.generateContentAnalytics(content, events);
            });

            // Calculate summary
            const summary = {
                total_content_items: reports.length,
                total_impressions: reports.reduce((sum, r) => sum + r.total_impressions, 0),
                total_unique_users: new Set(
                    reports.flatMap(r => 
                        this.trackerService.getEventsByContent(r.content_id).map(e => e.userId)
                    )
                ).size,
                avg_engagement_rate: reports.length > 0 
                    ? reports.reduce((sum, r) => sum + r.engagement_metrics.engagement_rate, 0) / reports.length 
                    : 0,
                avg_ctr: reports.length > 0 
                    ? reports.reduce((sum, r) => sum + r.click_metrics.ctr, 0) / reports.length 
                    : 0,
            };

            res.status(200).json({
                success: true,
                data: reports,
                summary: {
                    ...summary,
                    avg_engagement_rate: Math.round(summary.avg_engagement_rate * 100) / 100,
                    avg_ctr: Math.round(summary.avg_ctr * 100) / 100,
                },
            });
        } catch (error: any) {
            console.error('Error generating aggregated analytics:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to generate aggregated analytics',
            });
        }
    }

    /**
     * Get content events
     * GET /api/content/:contentId/events?event_type=video_view&limit=50
     */
    getContentEvents(req: Request, res: Response) {
        try {
            const { contentId } = req.params;
            
            // Check if content exists
            const content = this.contentService.getById(contentId);
            if (!content) {
                return res.status(404).json({
                    success: false,
                    error: 'Content not found',
                    content_id: contentId,
                });
            }

            const eventType = req.query.event_type as string;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

            const events = this.trackerService.getContentEvents({
                content_id: contentId,
                event_type: eventType,
                limit,
                offset,
            });

            const totalEvents = this.trackerService.getEventsByContent(contentId).length;

            res.status(200).json({
                success: true,
                data: events,
                pagination: {
                    limit,
                    offset,
                    total: totalEvents,
                },
            });
        } catch (error: any) {
            console.error('Error retrieving content events:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to retrieve content events',
            });
        }
    }

    // Expose services for use in other controllers
    getContentService(): ContentService {
        return this.contentService;
    }

    getTrackerService(): TrackerService {
        return this.trackerService;
    }

    getAnalyticsService(): AnalyticsService {
        return this.analyticsService;
    }
}

export default ContentController;
