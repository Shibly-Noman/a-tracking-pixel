/**
 * Demo Data Loader
 * 
 * This module provides utilities to load demo data for the pixel tracker app.
 * It includes content items, tracking events, and user profiles.
 */

import * as demoContentData from './demo-content.json';
import * as demoEventsData from './demo-events.json';
import * as demoUsersData from './demo-users.json';
import { SocialMediaContent, ContentTrackingEvent } from '../types';

// Type the imported data
export const demoContent = ((demoContentData as any).default || demoContentData) as unknown as SocialMediaContent[];
export const demoEvents = (((demoEventsData as any).default || demoEventsData) as any[]).map((event: any) => ({
    ...event,
    timestamp: new Date(event.timestamp)
})) as ContentTrackingEvent[];

export interface DemoUser {
    userId: string;
    name: string;
    email: string;
    location: string;
    age: number;
    interests: string[];
    devicePreference: 'mobile' | 'desktop';
    browserPreference: string;
    operatingSystem: string;
    engagementLevel: 'low' | 'medium' | 'high';
    joinedDate: string;
}

export const demoUsers = ((demoUsersData as any).default || demoUsersData) as unknown as DemoUser[];

/**
 * Get all demo content
 */
export function getAllDemoContent(): SocialMediaContent[] {
    return demoContent;
}

/**
 * Get demo content by ID
 */
export function getDemoContentById(contentId: string): SocialMediaContent | undefined {
    return demoContent.find(c => c.content_id === contentId);
}

/**
 * Get demo content by platform
 */
export function getDemoContentByPlatform(platform: string): SocialMediaContent[] {
    return demoContent.filter(c => c.platform === platform);
}

/**
 * Get all demo events
 */
export function getAllDemoEvents(): ContentTrackingEvent[] {
    return demoEvents;
}

/**
 * Get demo events by content ID
 */
export function getDemoEventsByContentId(contentId: string): ContentTrackingEvent[] {
    return demoEvents.filter(e => e.content_id === contentId);
}

/**
 * Get demo events by user ID
 */
export function getDemoEventsByUserId(userId: string): ContentTrackingEvent[] {
    return demoEvents.filter(e => e.userId === userId);
}

/**
 * Get all demo users
 */
export function getAllDemoUsers(): DemoUser[] {
    return demoUsers;
}

/**
 * Get demo user by ID
 */
export function getDemoUserById(userId: string): DemoUser | undefined {
    return demoUsers.find(u => u.userId === userId);
}

/**
 * Get demo statistics
 */
export function getDemoStatistics() {
    return {
        totalContent: demoContent.length,
        totalEvents: demoEvents.length,
        totalUsers: demoUsers.length,
        contentByPlatform: {
            facebook: demoContent.filter(c => c.platform === 'facebook').length,
            instagram: demoContent.filter(c => c.platform === 'instagram').length,
        },
        eventsByType: demoEvents.reduce((acc, event) => {
            acc[event.event_type] = (acc[event.event_type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        usersByEngagement: {
            high: demoUsers.filter(u => u.engagementLevel === 'high').length,
            medium: demoUsers.filter(u => u.engagementLevel === 'medium').length,
            low: demoUsers.filter(u => u.engagementLevel === 'low').length,
        }
    };
}

/**
 * Seed services with demo data
 */
export function seedDemoData(contentService: any, trackerService: any) {
    // Clear existing data
    contentService.clearAll();
    trackerService.clearContentEvents();

    // Seed content
    const createdContent = contentService.bulkCreate(demoContent);
    console.log(`✅ Seeded ${createdContent.length} content items`);

    // Seed events
    trackerService.bulkLogContentEvents(demoEvents);
    console.log(`✅ Seeded ${demoEvents.length} tracking events`);

    // Log statistics
    const stats = getDemoStatistics();
    console.log('📊 Demo Data Statistics:', stats);

    return {
        content: createdContent,
        events: demoEvents,
        users: demoUsers,
        statistics: stats
    };
}
