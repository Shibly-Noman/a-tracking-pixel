# Demo Data for Pixel Tracker

This directory contains comprehensive demo data for the pixel tracker application, including content items, tracking events, and user profiles.

## Files

### 1. `demo-content.json`
Contains 11 social media content items across Facebook and Instagram platforms.

**Content Types:**
- Facebook Posts (Video Reels, Standard Videos, Images)
- Instagram Posts (Reels, Stories, Images, Carousels)

**Platforms:**
- Facebook: 5 items
- Instagram: 6 items

**Content IDs:**
- `fb_post_001` - Educational video reel about ad blockers
- `ig_reel_001` - Promotional reel about analytics
- `fb_video_001` - Educational tutorial video
- `ig_story_001` - Behind-the-scenes story
- `fb_image_001` - API announcement post
- `ig_carousel_001` - Educational carousel about pixel tracking tips
- `fb_reel_002` - Engagement-focused dashboard reveal
- `ig_image_002` - Workshop promotion
- `fb_video_002` - Facebook Pixel setup guide
- `ig_reel_002` - POV discovery reel

**Status Distribution:**
- Published: 9 items
- Ready for Publish: 1 item
- Draft: 1 item

### 2. `demo-events.json`
Contains 40 realistic tracking events across different content items.

**Event Types:**
- `impression` - Content view events
- `video_view` - Video playback events
- `video_3s` - 3-second video view milestone
- `thruplay` - Complete video playback
- `engagement` - User reactions (like, love, wow, haha)
- `click` - Click events on CTAs and links
- `share` - Content sharing events
- `comment` - Comment events

**Event Distribution by Content:**
- fb_post_001: 5 events
- ig_reel_001: 5 events
- fb_video_001: 4 events
- ig_story_001: 2 events
- fb_image_001: 3 events
- ig_carousel_001: 2 events
- fb_reel_002: 5 events
- ig_image_002: 2 events
- fb_video_002: 5 events
- ig_reel_002: 5 events

**Device Distribution:**
- Mobile: ~70%
- Desktop: ~30%

**Browser Distribution:**
- Chrome: ~60%
- Safari: ~20%
- Firefox: ~10%
- Edge: ~10%

### 3. `demo-users.json`
Contains 15 diverse user profiles from different geographic locations.

**User Attributes:**
- User ID
- Name
- Email
- Location (Bangladesh, India, Pakistan, Singapore, UK, USA, Canada, UAE, Australia, Egypt, Hong Kong)
- Age (25-40 years)
- Interests
- Device Preference (mobile/desktop)
- Browser Preference
- Operating System
- Engagement Level (low/medium/high)
- Join Date

**Engagement Level Distribution:**
- High: 7 users
- Medium: 7 users
- Low: 1 user

## Usage

### Loading Demo Data

```typescript
import {
  getAllDemoContent,
  getAllDemoEvents,
  getAllDemoUsers,
  getDemoStatistics,
  seedDemoData
} from './data';

// Get all demo content
const content = getAllDemoContent();

// Get all demo events
const events = getAllDemoEvents();

// Get all demo users
const users = getAllDemoUsers();

// Get statistics
const stats = getDemoStatistics();
console.log(stats);
```

### Seeding Services

```typescript
import { seedDemoData } from './data';
import { ContentService } from './services/contentService';
import { TrackerService } from './services/trackerService';

const contentService = new ContentService();
const trackerService = new TrackerService();

// Seed all demo data
const result = seedDemoData(contentService, trackerService);
console.log('Demo data seeded:', result.statistics);
```

### Filtering Data

```typescript
import {
  getDemoContentById,
  getDemoContentByPlatform,
  getDemoEventsByContentId,
  getDemoEventsByUserId,
  getDemoUserById
} from './data';

// Get specific content
const content = getDemoContentById('fb_post_001');

// Get content by platform
const facebookContent = getDemoContentByPlatform('facebook');

// Get events for specific content
const contentEvents = getDemoEventsByContentId('fb_post_001');

// Get events for specific user
const userEvents = getDemoEventsByUserId('user_001');

// Get specific user
const user = getDemoUserById('user_001');
```

## Data Characteristics

### Realistic Patterns

1. **User Behavior:**
   - Mobile users tend to have shorter engagement times
   - Desktop users have higher completion rates for longer videos
   - Different browsers and OS combinations reflect real-world usage

2. **Content Performance:**
   - Video content has higher engagement rates
   - Reels have better completion rates than standard videos
   - Stories have quick view patterns with lower engagement

3. **Geographic Distribution:**
   - Primary markets: Bangladesh, India, Pakistan
   - Secondary markets: USA, UK, Canada, Singapore
   - Emerging markets: UAE, Australia, Egypt, Hong Kong

4. **Temporal Patterns:**
   - Events span across different times of day
   - Sequential events show realistic user journeys
   - Video events include proper watch duration and completion percentages

### Analytics Insights

The demo data is designed to generate meaningful analytics:

- **Engagement Rates:** 5-15% across different content types
- **Video Completion Rates:** 55-100% depending on content length
- **Click-Through Rates:** 2-8% for promotional content
- **Device Split:** 70% mobile, 30% desktop (realistic for social media)
- **Browser Distribution:** Matches current market share trends

## Extending Demo Data

To add more demo data:

1. **Content:** Add new items to `demo-content.json` following the `SocialMediaContent` type
2. **Events:** Add new events to `demo-events.json` following the `ContentTrackingEvent` type
3. **Users:** Add new users to `demo-users.json` following the `DemoUser` interface

Ensure all IDs are unique and events reference existing content and user IDs.

## Data Validation

The data structure is validated against TypeScript types:
- `SocialMediaContent` from `../types/content.types.ts`
- `ContentTrackingEvent` from `../types/content.types.ts`
- `DemoUser` from `./index.ts`

TypeScript compilation will catch any structural issues with the demo data.
