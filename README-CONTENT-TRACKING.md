# Facebook/Instagram Content Pixel Tracking - Implementation Guide

## Overview

This implementation adds comprehensive Facebook/Instagram content tracking capabilities to the pixel-tracker project. The system manages social media content, tracks user interactions, and provides detailed analytics.

## Features Implemented

### ✅ Content Management
- Store complete Facebook/Instagram content metadata
- CRUD operations via REST API
- Support for multiple platforms (Facebook, Instagram, Reels, Stories)
- Campaign and audience targeting information
- Organic and paid content settings

### ✅ Pixel Tracking
- Track 9 event types:
  - `impression` - Content views
  - `video_view` - Video playback started
  - `video_3s` - Video played for 3+ seconds
  - `thruplay` - Video played to completion or 15s
  - `engagement` - User reactions (like, love, wow, etc.)
  - `share` - Content shared
  - `comment` - User commented
  - `reaction` - User reacted
  - `click` - User clicked (CTA, link, profile)
- Rich event metadata (watch duration, engagement type, click targets)
- Full user context (device, browser, OS, location)

### ✅ Analytics & Reporting
- Content-specific performance metrics
- Video analytics (completion rate, avg watch time)
- Engagement rate and CTR calculations
- Audience demographics breakdown
- Aggregated cross-content analytics

### ✅ Demo Data
- 5 sample content items automatically loaded on startup
- 675+ realistic tracking events
- Distributed across 7 days with diverse user interactions

## API Endpoints

### Content Management

#### Create Content
```bash
POST /api/content
Content-Type: application/json

{
  "platform": "facebook",
  "content_id": "fb_post_001",
  "taxonomy": { ... },
  "campaign_mapping": { ... },
  "creative": { ... },
  "status": "ready_for_publish"
}
```

#### Get All Content
```bash
GET /api/content?platform=facebook&status=published
```

#### Get Specific Content
```bash
GET /api/content/fb_post_001
```

#### Update Content
```bash
PUT /api/content/fb_post_001
Content-Type: application/json

{
  "status": "published",
  "creative": { ... }
}
```

#### Delete Content
```bash
DELETE /api/content/fb_post_001
```

### Content Tracking

#### Track Content Event
```bash
POST /api/track-content-event
Content-Type: application/json

{
  "content_id": "fb_post_001",
  "event_type": "impression",
  "userId": "user_123"
}
```

**Video View Event:**
```json
{
  "content_id": "fb_post_001",
  "event_type": "video_view",
  "userId": "user_123",
  "event_metadata": {
    "watch_duration": 15,
    "completion_percentage": 83
  }
}
```

**Engagement Event:**
```json
{
  "content_id": "fb_post_001",
  "event_type": "engagement",
  "userId": "user_123",
  "event_metadata": {
    "engagement_type": "like"
  }
}
```

**Click Event:**
```json
{
  "content_id": "fb_post_001",
  "event_type": "click",
  "userId": "user_123",
  "event_metadata": {
    "click_target": "cta_button"
  }
}
```

### Analytics

#### Get Content Analytics
```bash
GET /api/content-analytics/fb_post_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "content_id": "fb_post_001",
    "platform": "facebook",
    "total_impressions": 850,
    "unique_users": 320,
    "video_metrics": {
      "total_views": 280,
      "three_second_views": 245,
      "thruplay": 180,
      "avg_watch_duration": 14.5,
      "completion_rate": 64.3,
      "view_rate": 32.9
    },
    "engagement_metrics": {
      "total_engagements": 95,
      "engagement_rate": 11.2,
      "breakdown": {
        "like": 60,
        "share": 20,
        "comment": 15
      }
    },
    "click_metrics": {
      "total_clicks": 45,
      "ctr": 5.3,
      "breakdown": {
        "cta_button": 30,
        "link": 10,
        "profile": 5
      }
    },
    "audience_breakdown": {
      "by_device": {
        "mobile": 680,
        "desktop": 170
      },
      "by_browser": { ... },
      "by_os": { ... }
    },
    "timestamp": "2026-02-16T06:00:00.000Z"
  }
}
```

#### Get Aggregated Analytics
```bash
GET /api/content-analytics?platform=facebook
```

#### Get Content Events
```bash
GET /api/content/fb_post_001/events?event_type=video_view&limit=50
```

### Existing Endpoints (Maintained)

#### Track Generic Pixel
```bash
POST /track-pixel
```

#### Get Overall Analytics
```bash
GET /analytics
```

## File Structure

```
pixel-tracker/
├── src/
│   ├── types/
│   │   ├── index.ts                    [EXTENDED] - Exports all types
│   │   ├── content.types.ts            [NEW] - Content data structures
│   │   └── analytics.types.ts          [NEW] - Analytics report types
│   ├── services/
│   │   ├── contentService.ts           [NEW] - Content CRUD operations
│   │   ├── trackerService.ts           [EXTENDED] - Content event tracking
│   │   └── analyticsService.ts         [EXTENDED] - Content analytics
│   ├── controllers/
│   │   ├── contentController.ts        [NEW] - Content API handlers
│   │   └── pixelController.ts          [EXTENDED] - Content tracking endpoint
│   ├── routes/
│   │   ├── contentRoutes.ts            [NEW] - Content API routes
│   │   └── pixelRoutes.ts              [EXTENDED] - Content tracking route
│   ├── data/
│   │   └── demo-content.json           [NEW] - Sample content data
│   ├── utils/
│   │   └── seedData.ts                 [NEW] - Data seeding utility
│   └── index.ts                        [EXTENDED] - Register routes & seed data
```

## Demo Data

The system automatically loads 5 sample content items on startup:

1. **fb_post_001** - Facebook Reel (Educational, Ad Blocker Awareness)
   - 153 events: 81 impressions, 24 video views, 20 3s views, 15 thruplay, 9 engagements, 4 clicks

2. **ig_reel_001** - Instagram Reel (Promotional, Product Showcase)
   - 154 events: Similar distribution

3. **fb_video_001** - Facebook Video Post (Educational, Tutorial)
   - 170 events: Higher engagement due to longer format

4. **ig_story_001** - Instagram Story (Engagement, Behind the Scenes)
   - 108 events: No video metrics (image format)

5. **fb_image_001** - Facebook Image Post (Promotional, API Launch)
   - 90 events: Focus on clicks and engagement

**Total: 675 tracking events** across all content items

## Testing the Implementation

### 1. Start the Server
```bash
cd pixel-tracker
npm start
```

You should see:
```
🌱 Seeding demo data...
📦 Creating 5 content items...
✅ Created 5 content items
🎯 Generating sample tracking events...
✅ Generated 675 total tracking events
🎉 Demo data seeding completed successfully!
Server is running on http://localhost:3000
```

### 2. Test Content Endpoints

**Get all content:**
```bash
curl http://localhost:3000/api/content
```

**Get specific content:**
```bash
curl http://localhost:3000/api/content/fb_post_001
```

**Get content analytics:**
```bash
curl http://localhost:3000/api/content-analytics/fb_post_001
```

**Get aggregated analytics:**
```bash
curl http://localhost:3000/api/content-analytics
```

**Get content events:**
```bash
curl http://localhost:3000/api/content/fb_post_001/events?limit=10
```

### 3. Test Tracking Endpoint

**Track an impression:**
```bash
curl -X POST http://localhost:3000/api/track-content-event \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "fb_post_001",
    "event_type": "impression",
    "userId": "test_user_001"
  }'
```

**Track a video view:**
```bash
curl -X POST http://localhost:3000/api/track-content-event \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "fb_post_001",
    "event_type": "video_view",
    "userId": "test_user_001",
    "event_metadata": {
      "watch_duration": 12,
      "completion_percentage": 67
    }
  }'
```

**Track an engagement:**
```bash
curl -X POST http://localhost:3000/api/track-content-event \
  -H "Content-Type: application/json" \
  -d '{
    "content_id": "fb_post_001",
    "event_type": "engagement",
    "userId": "test_user_001",
    "event_metadata": {
      "engagement_type": "like"
    }
  }'
```

### 4. Create New Content

```bash
curl -X POST http://localhost:3000/api/content \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "instagram",
    "content_id": "ig_post_new",
    "taxonomy": {
      "format": {
        "type": "image",
        "aspect_ratio": "1:1"
      },
      "purpose": {
        "primary": "promotional",
        "funnel_stage": "top"
      }
    },
    "campaign_mapping": {
      "objective": "reach",
      "optimization_goal": "impressions",
      "placement": ["instagram_feed"]
    },
    "creative": {
      "primary_text": "Check out our new feature!",
      "call_to_action": "learn_more"
    },
    "media": {
      "image_url": "https://example.com/image.jpg"
    },
    "audience": {
      "targeting_type": "broad",
      "geo": ["BD"]
    },
    "metrics_to_track": ["reach", "impressions"],
    "status": "published",
    "timeline": {
      "post_type": "image",
      "visibility": "public",
      "publish_mode": "immediate",
      "language": "en"
    }
  }'
```

## Key Metrics Explained

### Video Metrics
- **Total Views**: Number of times video started playing
- **3-Second Views**: Videos played for at least 3 seconds
- **Thruplay**: Videos played to completion or for 15 seconds
- **Avg Watch Duration**: Average time users watched the video
- **Completion Rate**: Percentage of video watched on average
- **View Rate**: (Views / Impressions) × 100

### Engagement Metrics
- **Total Engagements**: Sum of all engagement actions
- **Engagement Rate**: (Engagements / Impressions) × 100
- **Breakdown**: Count by engagement type (like, love, share, etc.)

### Click Metrics
- **Total Clicks**: Number of clicks on content
- **CTR (Click-Through Rate)**: (Clicks / Impressions) × 100
- **Breakdown**: Count by click target (CTA, link, profile)

### Audience Metrics
- **By Device**: Mobile vs Desktop distribution
- **By Browser**: Chrome, Safari, Firefox, etc.
- **By OS**: Android, iOS, Windows, macOS, etc.

## Architecture Highlights

### Type Safety
- Full TypeScript implementation
- Comprehensive interfaces for all data structures
- Type-safe API responses

### Service Layer
- **ContentService**: Manages content storage and retrieval
- **TrackerService**: Handles event logging and querying
- **AnalyticsService**: Generates performance reports

### Controller Layer
- **ContentController**: CRUD operations for content
- **PixelController**: Event tracking and analytics

### Data Seeding
- Automatic demo data loading on startup
- Realistic event distribution
- Diverse user interactions

## Future Enhancements

### Short-term
- Add authentication/authorization
- Implement rate limiting
- Add request validation middleware
- Enhance error messages

### Medium-term
- Database integration (MongoDB/PostgreSQL)
- Real-time analytics with WebSockets
- Export functionality (CSV, JSON)
- Advanced filtering and search

### Long-term
- Machine learning for content recommendations
- Predictive analytics
- A/B testing framework
- Multi-tenant support

## Troubleshooting

### Port Already in Use
If you see `EADDRINUSE: address already in use :::3000`, either:
- Stop the existing server
- Change the port in `src/index.ts` or set `PORT` environment variable

### TypeScript Compilation Errors
```bash
npm install
```

### Missing Demo Data
The demo data is automatically loaded from `src/data/demo-content.json`. If it's not loading:
- Check file exists
- Verify JSON syntax
- Check console for error messages

## Support

For questions or issues:
1. Check the API documentation in `plans/api-endpoints-overview.md`
2. Review the architecture plan in `plans/facebook-content-pixel-tracking.md`
3. Examine the data models in `plans/data-models.md`

## License

MIT
