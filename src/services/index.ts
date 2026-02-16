/**
 * Centralized Service Instances
 * 
 * This module exports singleton service instances to ensure
 * all parts of the application use the same data store.
 */

import { ContentService } from './contentService';
import { TrackerService } from './trackerService';
import { AnalyticsService } from './analyticsService';

// Create singleton instances
export const contentService = new ContentService();
export const trackerService = new TrackerService();
export const analyticsService = new AnalyticsService();

// Export classes for type definitions
export { ContentService, TrackerService, AnalyticsService };
