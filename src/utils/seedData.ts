import { ContentService } from '../services/contentService';
import { TrackerService } from '../services/trackerService';
import { SocialMediaContent, ContentTrackingEvent } from '../types';
import { generateUniqueId } from './helpers';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Seed demo content and generate sample tracking events
 */
export function seedDemoData(contentService: ContentService, trackerService: TrackerService): void {
    console.log('🌱 Seeding demo data...');

    try {
        // Load demo content from JSON file
        const demoContentPath = path.join(__dirname, '../data/demo-content.json');
        const demoContentData = fs.readFileSync(demoContentPath, 'utf-8');
        const demoContents: SocialMediaContent[] = JSON.parse(demoContentData);

        // Create content
        console.log(`📦 Creating ${demoContents.length} content items...`);
        const createdContents = contentService.bulkCreate(demoContents);
        console.log(`✅ Created ${createdContents.length} content items`);

        // Generate sample events for each content
        console.log('🎯 Generating sample tracking events...');
        let totalEvents = 0;

        createdContents.forEach(content => {
            const events = generateSampleEvents(content);
            trackerService.bulkLogContentEvents(events);
            totalEvents += events.length;
            console.log(`  - ${content.content_id}: ${events.length} events`);
        });

        console.log(`✅ Generated ${totalEvents} total tracking events`);
        console.log('🎉 Demo data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding demo data:', error);
    }
}

/**
 * Generate sample tracking events for a content item
 */
function generateSampleEvents(content: SocialMediaContent): ContentTrackingEvent[] {
    const events: ContentTrackingEvent[] = [];
    const now = new Date();
    
    // Generate events over the past 7 days
    const daysAgo = 7;
    
    // Determine event counts based on content type
    const isVideo = content.taxonomy.format.type === 'video';
    const impressionCount = Math.floor(Math.random() * 30) + 70; // 70-100 impressions
    const videoViewCount = isVideo ? Math.floor(impressionCount * 0.3) : 0; // 30% view rate
    const threeSecViewCount = isVideo ? Math.floor(videoViewCount * 0.85) : 0; // 85% of views
    const thruplayCount = isVideo ? Math.floor(videoViewCount * 0.65) : 0; // 65% completion
    const engagementCount = Math.floor(impressionCount * 0.12); // 12% engagement rate
    const clickCount = Math.floor(impressionCount * 0.05); // 5% CTR

    // Generate user IDs
    const userCount = Math.floor(impressionCount * 0.7); // 70% unique users
    const userIds = Array.from({ length: userCount }, (_, i) => `user_${i + 1}`);

    // Device and browser distributions
    const devices: Array<'mobile' | 'desktop'> = ['mobile', 'mobile', 'mobile', 'desktop']; // 75% mobile
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Chrome', 'Safari'];
    const operatingSystems = ['Android', 'iOS', 'Windows', 'macOS', 'Android', 'iOS'];

    // Generate impressions
    for (let i = 0; i < impressionCount; i++) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const browser = browsers[Math.floor(Math.random() * browsers.length)];
        const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
        const timestamp = getRandomTimestamp(now, daysAgo);

        events.push({
            event_id: generateUniqueId(),
            content_id: content.content_id,
            event_type: 'impression',
            userId,
            timestamp,
            ipAddress: generateRandomIP(),
            browserType: browser,
            deviceType: device,
            operatingSystem: os,
            userAgent: `Mozilla/5.0 (${os}) ${browser}`,
        });
    }

    // Generate video views
    if (isVideo) {
        for (let i = 0; i < videoViewCount; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const device = devices[Math.floor(Math.random() * devices.length)];
            const browser = browsers[Math.floor(Math.random() * browsers.length)];
            const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
            const timestamp = getRandomTimestamp(now, daysAgo);
            const duration = content.taxonomy.format.duration_seconds || 15;
            const watchDuration = Math.floor(Math.random() * duration) + 1;
            const completionPercentage = Math.floor((watchDuration / duration) * 100);

            events.push({
                event_id: generateUniqueId(),
                content_id: content.content_id,
                event_type: 'video_view',
                userId,
                timestamp,
                ipAddress: generateRandomIP(),
                browserType: browser,
                deviceType: device,
                operatingSystem: os,
                userAgent: `Mozilla/5.0 (${os}) ${browser}`,
                event_metadata: {
                    watch_duration: watchDuration,
                    completion_percentage: completionPercentage,
                },
            });
        }

        // Generate 3-second views
        for (let i = 0; i < threeSecViewCount; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const device = devices[Math.floor(Math.random() * devices.length)];
            const browser = browsers[Math.floor(Math.random() * browsers.length)];
            const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
            const timestamp = getRandomTimestamp(now, daysAgo);

            events.push({
                event_id: generateUniqueId(),
                content_id: content.content_id,
                event_type: 'video_3s',
                userId,
                timestamp,
                ipAddress: generateRandomIP(),
                browserType: browser,
                deviceType: device,
                operatingSystem: os,
                userAgent: `Mozilla/5.0 (${os}) ${browser}`,
                event_metadata: {
                    watch_duration: 3,
                },
            });
        }

        // Generate thruplay events
        for (let i = 0; i < thruplayCount; i++) {
            const userId = userIds[Math.floor(Math.random() * userIds.length)];
            const device = devices[Math.floor(Math.random() * devices.length)];
            const browser = browsers[Math.floor(Math.random() * browsers.length)];
            const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
            const timestamp = getRandomTimestamp(now, daysAgo);
            const duration = content.taxonomy.format.duration_seconds || 15;

            events.push({
                event_id: generateUniqueId(),
                content_id: content.content_id,
                event_type: 'thruplay',
                userId,
                timestamp,
                ipAddress: generateRandomIP(),
                browserType: browser,
                deviceType: device,
                operatingSystem: os,
                userAgent: `Mozilla/5.0 (${os}) ${browser}`,
                event_metadata: {
                    watch_duration: duration,
                    completion_percentage: 100,
                },
            });
        }
    }

    // Generate engagement events
    const engagementTypes: Array<'like' | 'love' | 'wow' | 'haha'> = ['like', 'like', 'like', 'love', 'wow', 'haha'];
    for (let i = 0; i < engagementCount; i++) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const browser = browsers[Math.floor(Math.random() * browsers.length)];
        const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
        const timestamp = getRandomTimestamp(now, daysAgo);
        const engagementType = engagementTypes[Math.floor(Math.random() * engagementTypes.length)];

        events.push({
            event_id: generateUniqueId(),
            content_id: content.content_id,
            event_type: 'engagement',
            userId,
            timestamp,
            ipAddress: generateRandomIP(),
            browserType: browser,
            deviceType: device,
            operatingSystem: os,
            userAgent: `Mozilla/5.0 (${os}) ${browser}`,
            event_metadata: {
                engagement_type: engagementType,
            },
        });
    }

    // Generate click events
    const clickTargets: Array<'cta_button' | 'link' | 'profile'> = ['cta_button', 'cta_button', 'link', 'profile'];
    for (let i = 0; i < clickCount; i++) {
        const userId = userIds[Math.floor(Math.random() * userIds.length)];
        const device = devices[Math.floor(Math.random() * devices.length)];
        const browser = browsers[Math.floor(Math.random() * browsers.length)];
        const os = operatingSystems[Math.floor(Math.random() * operatingSystems.length)];
        const timestamp = getRandomTimestamp(now, daysAgo);
        const clickTarget = clickTargets[Math.floor(Math.random() * clickTargets.length)];

        events.push({
            event_id: generateUniqueId(),
            content_id: content.content_id,
            event_type: 'click',
            userId,
            timestamp,
            ipAddress: generateRandomIP(),
            browserType: browser,
            deviceType: device,
            operatingSystem: os,
            userAgent: `Mozilla/5.0 (${os}) ${browser}`,
            event_metadata: {
                click_target: clickTarget,
            },
        });
    }

    return events;
}

/**
 * Generate a random timestamp within the past N days
 */
function getRandomTimestamp(now: Date, daysAgo: number): Date {
    const millisecondsAgo = daysAgo * 24 * 60 * 60 * 1000;
    const randomTime = Math.floor(Math.random() * millisecondsAgo);
    return new Date(now.getTime() - randomTime);
}

/**
 * Generate a random IP address
 */
function generateRandomIP(): string {
    return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}
