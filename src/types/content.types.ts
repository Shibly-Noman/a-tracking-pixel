// Content Type Definitions for Facebook/Instagram Content Tracking

export interface SocialMediaContent {
    // Identity
    content_id: string;
    platform: 'facebook' | 'instagram' | 'facebook_reels' | 'instagram_reels';
    
    // Classification
    taxonomy: {
        format: {
            type: 'video' | 'image' | 'carousel' | 'story';
            subtype?: 'reel' | 'post' | 'story';
            aspect_ratio?: string;
            duration_seconds?: number;
        };
        purpose: {
            primary: 'educational' | 'promotional' | 'engagement' | 'awareness';
            secondary?: string;
            funnel_stage: 'top' | 'middle' | 'bottom';
        };
    };
    
    // Campaign Details
    campaign_mapping: {
        objective: 'video_views' | 'reach' | 'engagement' | 'conversions' | 'traffic';
        optimization_goal: 'thruplay' | 'impressions' | 'reach' | 'landing_page_views';
        placement: string[];
    };
    
    // Creative Content
    creative: {
        primary_text: string;
        headline?: string;
        description?: string;
        call_to_action?: string;
    };
    
    // Media Assets
    media: {
        video_url?: string;
        thumbnail_url?: string;
        image_url?: string;
    };
    
    // Targeting
    audience: {
        targeting_type: 'broad' | 'narrow' | 'lookalike' | 'custom';
        age_range?: [number, number];
        interests?: string[];
        geo?: string[];
    };
    
    // Publishing Details
    timeline: {
        post_type: 'video' | 'image' | 'carousel';
        visibility: 'public' | 'private' | 'friends';
        publish_mode: 'immediate' | 'scheduled';
        scheduled_time?: string | null;
        caption?: string;
        hashtags?: string[];
        mentions?: string[];
        location_tag?: string | null;
        language?: string;
        allow_comments?: boolean;
        allow_shares?: boolean;
        allow_reactions?: boolean;
    };
    
    // Page Context
    page_context?: {
        page_id: string;
        actor_type: 'page' | 'user';
        crosspost_enabled?: boolean;
    };
    
    // Reel-Specific
    reel_metadata?: {
        audio_source?: 'original' | 'library';
        music_id?: string | null;
        auto_captions?: boolean;
        safe_zone_compliant?: boolean;
    };
    
    // Engagement Settings
    engagement_settings?: {
        pin_to_page?: boolean;
        boost_eligible?: boolean;
        boost_default_objective?: string;
    };
    
    // Moderation
    moderation?: {
        comment_filter_level?: 'low' | 'medium' | 'high';
        block_keywords?: string[];
        hide_offensive_comments?: boolean;
    };
    
    // Metrics Configuration
    metrics_to_track: string[];
    organic_metrics_to_track?: string[];
    
    // Status
    status: 'draft' | 'ready_for_publish' | 'published' | 'archived';
    
    // Timestamps
    created_at?: Date;
    updated_at?: Date;
}

export interface ContentTrackingEvent {
    // Event Identity
    event_id: string;
    content_id: string;
    
    // Event Type
    event_type: 
        | 'impression'
        | 'click'
        | 'video_view'
        | 'video_3s'
        | 'thruplay'
        | 'engagement'
        | 'share'
        | 'comment'
        | 'reaction';
    
    // User Context
    userId: string;
    timestamp: Date;
    
    // Device & Browser Info
    ipAddress: string;
    browserType: string;
    browserVersion?: string;
    deviceType: 'mobile' | 'desktop';
    operatingSystem: string;
    osVersion?: string;
    userAgent: string;
    
    // Event-Specific Metadata
    event_metadata?: {
        // Video Events
        watch_duration?: number;
        completion_percentage?: number;
        
        // Engagement Events
        engagement_type?: 'like' | 'love' | 'wow' | 'haha' | 'sad' | 'angry';
        
        // Click Events
        click_target?: 'cta_button' | 'link' | 'profile' | 'hashtag';
        
        // Share Events
        share_destination?: string;
        
        // Comment Events
        comment_length?: number;
        
        // Reaction Events
        reaction_type?: string;
        
        // Additional custom data
        [key: string]: any;
    };
}

export interface ContentFilters {
    platform?: string;
    status?: string;
    campaign_objective?: string;
}

export interface EventFilters {
    content_id?: string;
    event_type?: string;
    userId?: string;
    date_from?: Date;
    date_to?: Date;
    limit?: number;
    offset?: number;
}
