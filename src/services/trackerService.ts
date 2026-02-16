import { PixelData, ContentTrackingEvent, EventFilters } from '../types';

export class TrackerService {
    private pixelData: PixelData[] = [];
    private contentEvents: ContentTrackingEvent[] = [];

    logPixel(data: PixelData): void {
        this.pixelData.push({
            ...data,
            timestamp: new Date(data.timestamp),
        });
        console.log('Pixel logged:', data);
    }

    getPixelData(): PixelData[] {
        return this.pixelData;
    }

    getPixelsByUser(userId: string): PixelData[] {
        return this.pixelData.filter((pixel) => pixel.userId === userId);
    }

    getPixelsByDeviceType(deviceType: 'mobile' | 'desktop'): PixelData[] {
        return this.pixelData.filter((pixel) => pixel.deviceType === deviceType);
    }

    getPixelsByBrowser(browserType: string): PixelData[] {
        return this.pixelData.filter(
            (pixel) => pixel.browserType === browserType
        );
    }

    getPixelsByOS(operatingSystem: string): PixelData[] {
        return this.pixelData.filter(
            (pixel) => pixel.operatingSystem === operatingSystem
        );
    }

    clearPixelData(): void {
        this.pixelData = [];
    }

    // Content Event Tracking Methods

    /**
     * Log a content tracking event
     */
    logContentEvent(event: ContentTrackingEvent): void {
        this.contentEvents.push({
            ...event,
            timestamp: new Date(event.timestamp),
        });
        console.log('Content event logged:', event.event_type, 'for', event.content_id);
    }

    /**
     * Get all content events
     */
    getContentEvents(filters?: EventFilters): ContentTrackingEvent[] {
        let events = [...this.contentEvents];

        if (filters) {
            if (filters.content_id) {
                events = events.filter(e => e.content_id === filters.content_id);
            }
            if (filters.event_type) {
                events = events.filter(e => e.event_type === filters.event_type);
            }
            if (filters.userId) {
                events = events.filter(e => e.userId === filters.userId);
            }
            if (filters.date_from) {
                events = events.filter(e => e.timestamp >= filters.date_from!);
            }
            if (filters.date_to) {
                events = events.filter(e => e.timestamp <= filters.date_to!);
            }
            
            // Apply pagination
            if (filters.offset !== undefined) {
                events = events.slice(filters.offset);
            }
            if (filters.limit !== undefined) {
                events = events.slice(0, filters.limit);
            }
        }

        return events;
    }

    /**
     * Get events by content ID
     */
    getEventsByContent(contentId: string): ContentTrackingEvent[] {
        return this.contentEvents.filter(e => e.content_id === contentId);
    }

    /**
     * Get events by event type
     */
    getEventsByType(eventType: string): ContentTrackingEvent[] {
        return this.contentEvents.filter(e => e.event_type === eventType);
    }

    /**
     * Get events by user
     */
    getContentEventsByUser(userId: string): ContentTrackingEvent[] {
        return this.contentEvents.filter(e => e.userId === userId);
    }

    /**
     * Get total content events count
     */
    getContentEventsCount(contentId?: string): number {
        if (contentId) {
            return this.contentEvents.filter(e => e.content_id === contentId).length;
        }
        return this.contentEvents.length;
    }

    /**
     * Clear all content events (for testing)
     */
    clearContentEvents(): void {
        this.contentEvents = [];
        console.log('All content events cleared');
    }

    /**
     * Bulk log content events (for seeding)
     */
    bulkLogContentEvents(events: ContentTrackingEvent[]): void {
        for (const event of events) {
            this.logContentEvent(event);
        }
    }
}