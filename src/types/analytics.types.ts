// Analytics Type Definitions for Content Performance Reporting

export interface ContentAnalyticsReport {
    // Report Identity
    report_id?: string;
    content_id: string;
    platform: string;
    
    // Basic Metrics
    total_impressions: number;
    unique_users: number;
    
    // Video Metrics
    video_metrics?: {
        total_views: number;
        three_second_views: number;
        thruplay: number;
        avg_watch_duration: number;
        completion_rate: number;
        view_rate: number; // views / impressions * 100
    };
    
    // Engagement Metrics
    engagement_metrics: {
        total_engagements: number;
        engagement_rate: number; // engagements / impressions * 100
        breakdown: {
            like?: number;
            love?: number;
            wow?: number;
            haha?: number;
            sad?: number;
            angry?: number;
            share?: number;
            comment?: number;
        };
    };
    
    // Click Metrics
    click_metrics: {
        total_clicks: number;
        ctr: number; // clicks / impressions * 100
        breakdown: {
            cta_button?: number;
            link?: number;
            profile?: number;
            hashtag?: number;
        };
    };
    
    // Audience Breakdown
    audience_breakdown: {
        by_device: {
            mobile: number;
            desktop: number;
        };
        by_browser: Record<string, number>;
        by_os: Record<string, number>;
        by_geo?: Record<string, number>;
    };
    
    // Time Series Data
    time_series_data?: {
        hourly?: Array<{
            hour: string;
            impressions: number;
            engagements: number;
            clicks: number;
        }>;
        daily?: Array<{
            date: string;
            impressions: number;
            engagements: number;
            clicks: number;
        }>;
    };
    
    // Report Metadata
    timestamp: Date;
    date_range?: {
        from: Date;
        to: Date;
    };
}

export interface AggregatedContentAnalytics {
    // Summary
    summary: {
        total_content_items: number;
        total_impressions: number;
        total_unique_users: number;
        avg_engagement_rate: number;
        avg_ctr: number;
        total_video_views?: number;
        avg_completion_rate?: number;
    };
    
    // Per-Content Reports
    content_reports: ContentAnalyticsReport[];
    
    // Platform Breakdown
    by_platform?: {
        facebook?: ContentAnalyticsReport[];
        instagram?: ContentAnalyticsReport[];
        facebook_reels?: ContentAnalyticsReport[];
        instagram_reels?: ContentAnalyticsReport[];
    };
    
    // Campaign Objective Breakdown
    by_objective?: Record<string, ContentAnalyticsReport[]>;
    
    // Top Performers
    top_performers?: {
        by_impressions: ContentAnalyticsReport[];
        by_engagement_rate: ContentAnalyticsReport[];
        by_ctr: ContentAnalyticsReport[];
        by_video_completion?: ContentAnalyticsReport[];
    };
    
    // Report Metadata
    timestamp: Date;
    filters_applied?: {
        platform?: string;
        date_from?: Date;
        date_to?: Date;
        campaign_objective?: string;
    };
}
