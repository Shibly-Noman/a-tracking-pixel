export interface PixelData {
    id: string;
    timestamp: Date;
    userId: string;
    eventType: string;
    ipAddress: string;
    browserType: string;
    browserVersion?: string;
    deviceType: 'mobile' | 'desktop';
    operatingSystem: string;
    osVersion?: string;
    userAgent: string;
    metadata?: Record<string, any>;
}

export interface AnalyticsReport {
    totalPixelsTracked: number;
    uniqueUsers: number;
    eventsByType: Record<string, number>;
    deviceTypeBreakdown: {
        mobile: number;
        desktop: number;
    };
    topBrowsers: Array<{ browser: string; count: number }>;
    topOperatingSystems: Array<{ os: string; count: number }>;
    timestampRange: {
        earliest: Date;
        latest: Date;
    };
    timestamp: Date;
}

export interface UserAgentInfo {
    browserType: string;
    browserVersion?: string;
    operatingSystem: string;
    osVersion?: string;
    deviceType: 'mobile' | 'desktop';
}

// Export content and analytics types
export * from './content.types';
export * from './analytics.types';